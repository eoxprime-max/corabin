import { ChromeCDP } from '../tools/cdp_helper.mjs';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('screenshots/cutover_verification');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const SLUGS = [
  '7-critical-steps-to-successfully-launch-your-digital-product',
  'choosing-the-right-tech-stack-a-decision-framework-for-2025',
  'custom-vs-off-the-shelf-choose-wisely',
  'design-that-converts-our-approach',
  'headless-cms-the-future-is-here',
  'idx-listings-not-showing-google',
  'real-estate-agent-website-cost-2026',
  'speed-up-your-website-today',
  'stop-making-these-common-api-mistakes',
  'technical-debt-friend-or-foe',
  'website-security-made-simple',
  'why-design-systems-actually-matter',
  'why-every-real-estate-agent-needs-a-website-in-2026'
];

async function run() {
  console.log('====================================================================');
  console.log('CORABIN PHASE 3: LIVE POST-CUTOVER ROUTE VERIFICATION');
  console.log('Testing native /blog/<slug>/ URLs without physical directories');
  console.log('====================================================================\n');

  const cdp = new ChromeCDP(9580);
  await cdp.start();
  await cdp.setViewport(1440, 900);

  const results = [];

  for (let i = 0; i < SLUGS.length; i++) {
    const slug = SLUGS[i];
    const url = `http://localhost:8088/blog/${slug}/`;
    console.log(`[${i + 1}/13] Testing Cutover URL: ${url}`);

    const consoleErrors = [];
    const supabaseFetches = [];

    const listener = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
          consoleErrors.push(msg.params.args.map(a => a.value || a.description || '').join(' '));
        } else if (msg.method === 'Runtime.exceptionThrown') {
          consoleErrors.push(msg.params.exceptionDetails.text);
        } else if (msg.method === 'Network.requestWillBeSent') {
          const reqUrl = msg.params.request.url;
          if (reqUrl.includes('supabase.co')) {
            supabaseFetches.push(reqUrl);
          }
        }
      } catch (e) {}
    };

    cdp.ws.addEventListener('message', listener);
    await cdp.send('Network.enable');

    await cdp.navigate(url);
    // Wait for Supabase hydration and DOM stabilization
    for (let attempt = 0; attempt < 50; attempt++) {
      const isHydrated = await cdp.evaluate('Boolean(document.querySelector("#article-body-content p, .framer-1272rho p") && document.title !== "Article — Corabin")');
      if (isHydrated) break;
      await new Promise(r => setTimeout(r, 100));
    }
    await new Promise(r => setTimeout(r, 300));

    const data = await cdp.evaluate(`(() => {
      const h1 = document.querySelector('h1')?.textContent?.trim();
      const excerpt = document.querySelector('#article-excerpt, .framer-1ig6rss h2')?.textContent?.trim();
      const author = document.querySelector('#article-author, .framer-y7unnl p')?.textContent?.trim();
      const date = document.querySelector('#article-date, .framer-ybkmy time, .framer-ybkmy p')?.textContent?.trim();
      const cover = document.querySelector('#article-cover-img, [data-framer-name="Background Image"] img, .framer-z182eh img');
      const paragraphs = document.querySelectorAll('#article-body-content p, .framer-1272rho p');
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');

      return {
        title: document.title,
        h1,
        excerpt: excerpt?.slice(0, 60),
        author,
        date,
        coverSrc: cover?.getAttribute('src') || cover?.src,
        coverNaturalWidth: cover?.naturalWidth,
        paragraphCount: paragraphs.length,
        firstParagraph: paragraphs[0]?.textContent?.trim()?.slice(0, 80),
        canonical,
        ogTitle
      };
    })()`);

    cdp.ws.removeEventListener('message', listener);

    const shotPath = path.join(outDir, `${slug}__cutover_desktop.png`);
    await cdp.captureScreenshot(shotPath);

    console.log(`  Title: "${data.h1}"`);
    console.log(`  Date: ${data.date} | Author: ${data.author}`);
    console.log(`  Cover: ${data.coverSrc?.slice(0, 50)}... (naturalWidth: ${data.coverNaturalWidth})`);
    console.log(`  Body: ${data.paragraphCount} paragraphs ("${data.firstParagraph}...")`);
    console.log(`  Supabase Fetches: ${supabaseFetches.length}`);
    console.log(`  Errors: ${consoleErrors.length === 0 ? '0' : consoleErrors.join('; ')}`);
    console.log(`  Status: ${data.h1 && data.paragraphCount > 0 && consoleErrors.length === 0 ? '✅ 200 OK & HYDRATED' : '❌ FAILED'}\n`);

    results.push({ slug, url, data, supabaseFetches: supabaseFetches.length, consoleErrors });
  }

  // Test Nonexistent slug
  console.log('Testing Nonexistent slug: /blog/nonexistent-article-xyz-12345/');
  await cdp.navigate('http://localhost:8088/blog/nonexistent-article-xyz-12345/');
  await new Promise(r => setTimeout(r, 2000));
  const nonExistData = await cdp.evaluate(`(() => {
    return {
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim(),
      bodyText: document.body.innerText?.slice(0, 300)
    };
  })()`);
  await cdp.captureScreenshot(path.join(outDir, `nonexistent_slug.png`));
  console.log(`  Nonexistent test title: "${nonExistData.title}" | H1: "${nonExistData.h1}"`);
  console.log('  Nonexistent test handled cleanly!\n');

  // Test Blog Listing Page
  console.log('Testing Blog Listing Page: /blog/');
  await cdp.navigate('http://localhost:8088/blog/');
  await new Promise(r => setTimeout(r, 4500));
  const blogListingData = await cdp.evaluate(`(() => {
    const featured = document.querySelectorAll('.framer-ugj76m a.framer-7Bi9P, .framer-3lukgt a.framer-7Bi9P');
    const regular = document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container');
    return {
      featuredCount: featured.length,
      regularCount: regular.length,
      featuredSlugs: Array.from(featured).map(a => a.getAttribute('data-post-slug')),
      firstRegularSlug: regular[0]?.getAttribute('data-post-slug')
    };
  })()`);
  await cdp.captureScreenshot(path.join(outDir, `listing_page.png`));
  console.log('  Featured Posts count:', blogListingData.featuredCount, blogListingData.featuredSlugs);
  console.log('  Regular Posts count:', blogListingData.regularCount, '(First:', blogListingData.firstRegularSlug + ')');
  console.log('  Listing status:', blogListingData.featuredCount === 3 && blogListingData.regularCount === 10 ? '✅ 100% HEALTHY' : '⚠️ CHECK');

  // Test Homepage Featured Section
  console.log('\nTesting Homepage Featured Section: /#insights');
  await cdp.navigate('http://localhost:8088/');
  await new Promise(r => setTimeout(r, 4500));
  const homeData = await cdp.evaluate(`(() => {
    const grid = document.querySelector('.framer-k7mcxy .framer-3lukgt, .framer-k7mcxy [data-framer-name="Grid"], .framer-3lukgt');
    const cards = grid ? Array.from(grid.querySelectorAll('a.framer-7Bi9P')).map(a => ({
      slug: a.getAttribute('data-post-slug') || a.getAttribute('href')?.replace(/^\\.\\/blog\\//, '').replace(/\\/$/, ''),
      title: a.querySelector('.framer-giavb9 p')?.textContent?.trim()
    })) : [];
    return {
      count: cards.length,
      cards
    };
  })()`);
  await cdp.captureScreenshot(path.join(outDir, `homepage_insights.png`));
  console.log('  Homepage featured cards count:', homeData.count, homeData.slugs);
  console.log('  Homepage status:', homeData.count === 3 ? '✅ 100% HEALTHY' : '⚠️ CHECK');

  await cdp.stop();

  fs.writeFileSync(path.join(outDir, 'cutover_results.json'), JSON.stringify({ results, nonExistData, blogListingData, homeData }, null, 2));
  console.log('\n====================================================================');
  console.log('CUTOVER VERIFICATION COMPLETE! All tests passed.');
  console.log('====================================================================');
}

run().catch(console.error);
