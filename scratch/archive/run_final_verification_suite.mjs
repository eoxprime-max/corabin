import fs from 'fs';
import path from 'path';
import http from 'http';
import { ChromeCDP } from '../tools/cdp_helper.mjs';

const PORT = 8089;
const SCREENSHOT_DIR = path.resolve('scratch/screenshots');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function checkRoute(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}${urlPath}`, (res) => {
      resolve({ statusCode: res.statusCode, headers: res.headers });
    }).on('error', reject);
  });
}

async function run() {
  console.log('====================================================');
  console.log('CORABIN WEBSITE & BLOG FINAL VERIFICATION SUITE');
  console.log('====================================================\n');

  // STEP 1: VERIFY ROUTING BEHAVIOR
  console.log('--- 1. Testing Route Resolution (Vercel Rewrites & Clean URLs) ---');
  const testRoutes = [
    '/blog/',
    '/blog/custom-vs-off-the-shelf-choose-wisely/',
    '/blog/custom-vs-off-the-shelf-choose-wisely',
    '/blog/ch-skskmsnsm/',
    '/blog/ch-skskmsnsm',
    '/blog/design-that-converts-our-approach/',
    '/blog/why-every-real-estate-agent-needs-a-website-in-2026/',
  ];

  for (const r of testRoutes) {
    const res = await checkRoute(r);
    console.log(`Route "${r}": HTTP ${res.statusCode} (Expected: 200)`);
    if (res.statusCode !== 200) {
      throw new Error(`Route ${r} returned non-200 status: ${res.statusCode}`);
    }
  }
  console.log('✓ All routes resolved with HTTP 200 OK!\n');

  // STEP 2: LAUNCH CHROME CDP
  console.log('--- 2. Launching Chrome via CDP (Port 9230) ---');
  const cdp = new ChromeCDP(9230);
  await cdp.start();
  console.log('✓ Chrome connected successfully\n');

  try {
    const pagesToTest = [
      {
        slug: 'custom-vs-off-the-shelf-choose-wisely',
        name: 'custom-vs-off-the-shelf',
        titlePart: 'Custom Web Architecture',
      },
      {
        slug: 'ch-skskmsnsm',
        name: 'ch-skskmsnsm',
        titlePart: 'Ch skskmsnsm',
      },
      {
        slug: 'design-that-converts-our-approach',
        name: 'baseline-design-converts',
        titlePart: 'Conversion-Driven Design',
      },
      {
        slug: 'why-every-real-estate-agent-needs-a-website-in-2026',
        name: 'baseline-real-estate',
        titlePart: 'Real Estate',
      },
    ];

    // STEP 3: DESKTOP TESTING (1440 x 900)
    console.log('--- 3. Desktop Tests & Screenshots (1440x900) ---');
    await cdp.setViewport(1440, 900);

    // Blog listing page
    console.log('\nNavigating to /blog/ (Desktop)...');
    await cdp.navigate(`http://localhost:${PORT}/blog/`);
    await wait(3500);
    const listingH1 = await cdp.evaluate(`(() => {
      const h1 = Array.from(document.querySelectorAll('h1')).find(el => el.innerText.includes('Fresh insights')) || document.querySelector('h1');
      return h1 ? h1.innerText.trim() : null;
    })()`);
    console.log(`Blog Listing H1: "${listingH1}"`);
    await cdp.captureScreenshot(path.join(SCREENSHOT_DIR, 'desktop_blog_listing.png'));
    console.log('Captured: desktop_blog_listing.png');

    for (const page of pagesToTest) {
      console.log(`\nTesting Desktop: /blog/${page.slug}/`);
      await cdp.navigate(`http://localhost:${PORT}/blog/${page.slug}/`);
      await wait(2500);

      // Verify DOM
      const domData = await cdp.evaluate(`(() => {
        const expectedSlug = ${JSON.stringify(page.slug)};
        const titleEl = document.getElementById('article-title') || document.querySelector('h1');
        const coverImg = document.getElementById('article-cover-img');
        const cards = Array.from(document.querySelectorAll('.framer-3lukgt a[href^="/blog/"]')).map(a => {
          const href = a.getAttribute('href');
          const title = a.querySelector('.framer-giavb9 p, p')?.innerText?.trim() || '';
          const img = a.querySelector('img');
          return {
            href,
            title,
            imgSrc: img ? img.src : null,
            imgComplete: img ? img.complete : false,
            naturalWidth: img ? img.naturalWidth : 0,
          };
        });

        const main = document.getElementById('main');
        const mainOpacity = main ? window.getComputedStyle(main).opacity : null;

        return {
          title: titleEl ? titleEl.innerText.trim() : null,
          titleOpacity: titleEl ? window.getComputedStyle(titleEl).opacity : null,
          coverSrc: coverImg ? coverImg.src : null,
          coverComplete: coverImg ? coverImg.complete : false,
          coverNaturalWidth: coverImg ? coverImg.naturalWidth : 0,
          coverOpacity: coverImg ? window.getComputedStyle(coverImg).opacity : null,
          mainOpacity,
          cardCount: cards.length,
          cards,
          hasSelfReference: cards.some(c => c.href.includes(expectedSlug)),
        };
      })()`);

      console.log(`- Title: "${domData.title}" (opacity: ${domData.titleOpacity})`);
      console.log(`- Cover: ${domData.coverSrc ? domData.coverSrc.slice(0, 70) + '...' : 'none'} (naturalWidth: ${domData.coverNaturalWidth}, opacity: ${domData.coverOpacity})`);
      console.log(`- Related Cards count: ${domData.cardCount}, Self-referencing: ${domData.hasSelfReference}`);
      domData.cards.slice(0, 3).forEach((c, idx) => {
        console.log(`  Card ${idx + 1}: ${c.href} | "${c.title.slice(0, 40)}" | ${c.imgSrc ? c.imgSrc.slice(0, 60) + '...' : 'none'}`);
      });

      if (domData.hasSelfReference) {
        throw new Error(`Self-reference detected on /blog/${page.slug}/!`);
      }
      if (domData.coverNaturalWidth === 0) {
        console.warn(`WARNING: Cover naturalWidth is 0 on /blog/${page.slug}/!`);
      }

      // Screenshot Hero (top)
      await cdp.evaluate(`window.scrollTo(0, 0)`);
      await wait(400);
      await cdp.captureScreenshot(path.join(SCREENSHOT_DIR, `desktop_${page.name}_hero.png`));
      console.log(`Captured: desktop_${page.name}_hero.png`);

      // Scroll to Related section
      await cdp.evaluate(`(() => {
        const related = document.querySelector('.framer-3lukgt');
        if (related) related.scrollIntoView({ behavior: 'instant' });
      })()`);
      await wait(800);
      await cdp.captureScreenshot(path.join(SCREENSHOT_DIR, `desktop_${page.name}_related.png`));
      console.log(`Captured: desktop_${page.name}_related.png`);
    }

    // STEP 4: MOBILE TESTING (390 x 844)
    console.log('\n--- 4. Mobile Tests & Screenshots (390x844) ---');
    await cdp.setViewport(390, 844);

    for (const page of pagesToTest) {
      console.log(`\nTesting Mobile: /blog/${page.slug}/`);
      await cdp.navigate(`http://localhost:${PORT}/blog/${page.slug}/`);
      await wait(2500);

      // Verify DOM
      const domData = await cdp.evaluate(`(() => {
        const expectedSlug = ${JSON.stringify(page.slug)};
        const titleEl = document.getElementById('article-title') || document.querySelector('h1');
        const coverImg = document.getElementById('article-cover-img');
        const cards = Array.from(document.querySelectorAll('.framer-3lukgt a[href^="/blog/"]')).map(a => {
          return {
            href: a.getAttribute('href'),
            title: a.querySelector('.framer-giavb9 p, p')?.innerText?.trim() || '',
            imgSrc: a.querySelector('img')?.src || null,
          };
        });
        return {
          title: titleEl ? titleEl.innerText.trim() : null,
          coverSrc: coverImg ? coverImg.src : null,
          coverNaturalWidth: coverImg ? coverImg.naturalWidth : 0,
          cardCount: cards.length,
          hasSelfReference: cards.some(c => c.href.includes(expectedSlug)),
        };
      })()`);

      console.log(`- Mobile Title: "${domData.title}"`);
      console.log(`- Mobile Cover naturalWidth: ${domData.coverNaturalWidth}`);
      console.log(`- Mobile Related Cards count: ${domData.cardCount}, Self-referencing: ${domData.hasSelfReference}`);

      // Screenshot Hero (top)
      await cdp.evaluate(`window.scrollTo(0, 0)`);
      await wait(400);
      await cdp.captureScreenshot(path.join(SCREENSHOT_DIR, `mobile_${page.name}_hero.png`));
      console.log(`Captured: mobile_${page.name}_hero.png`);

      // Scroll to Related section
      await cdp.evaluate(`(() => {
        const related = document.querySelector('.framer-3lukgt');
        if (related) related.scrollIntoView({ behavior: 'instant' });
      })()`);
      await wait(800);
      await cdp.captureScreenshot(path.join(SCREENSHOT_DIR, `mobile_${page.name}_related.png`));
      console.log(`Captured: mobile_${page.name}_related.png`);
    }

    // STEP 5: NAVIGATION FLOW TESTING
    console.log('\n--- 5. Full Browser Navigation Flow Test ---');
    console.log('Flow: /blog/ → Article A → Back → Article B → Back → Forward');
    await cdp.setViewport(1440, 900);

    // 1. Load /blog/
    console.log('Step 5.1: Navigating to /blog/');
    await cdp.navigate(`http://localhost:${PORT}/blog/`);
    await wait(2000);
    let navH1 = await cdp.evaluate(`(() => {
      const el = Array.from(document.querySelectorAll('h1')).find(e => e.innerText.includes('Fresh insights')) || document.querySelector('h1');
      return el ? el.innerText.trim() : null;
    })()`);
    console.log(`Blog Listing H1: "${navH1}"`);
    if (!navH1.includes('Fresh insights')) throw new Error('Listing H1 mismatch');

    // 2. Click Article A
    console.log('Step 5.2: Clicking first article link in listing...');
    const clickedA = await cdp.evaluate(`(() => {
      const link = document.querySelector('a[href*="/blog/custom-vs-off-the-shelf"]');
      if (link) {
        link.click();
        return link.getAttribute('href');
      }
      return null;
    })()`);
    console.log(`Clicked href: ${clickedA}`);
    await wait(2500);
    let articleTitle = await cdp.evaluate(`document.querySelector('h1')?.innerText?.trim()`);
    console.log(`Article A Title: "${articleTitle}"`);
    if (!articleTitle.includes('Custom Web Architecture')) throw new Error('Article A title mismatch');

    // 3. Browser Back
    console.log('Step 5.3: Navigating Back...');
    await cdp.evaluate(`window.history.back()`);
    await wait(3500);
    navH1 = await cdp.evaluate(`document.querySelector('h1')?.innerText?.trim()`);
    console.log(`Back at Blog Listing. H1: "${navH1}"`);
    if (!navH1.includes('Fresh insights')) throw new Error('Back navigation H1 mismatch');

    // 4. Click Article B
    console.log('Step 5.4: Clicking second article link...');
    const clickedB = await cdp.evaluate(`(() => {
      const link = document.querySelector('a[href*="/blog/design-that-converts"]');
      if (link) {
        link.click();
        return link.getAttribute('href');
      }
      return null;
    })()`);
    console.log(`Clicked href: ${clickedB}`);
    await wait(2500);
    articleTitle = await cdp.evaluate(`document.querySelector('h1')?.innerText?.trim()`);
    console.log(`Article B Title: "${articleTitle}"`);
    if (!articleTitle.includes('Conversion-Driven Design')) throw new Error('Article B title mismatch');

    // 5. Browser Back
    console.log('Step 5.5: Navigating Back...');
    await cdp.evaluate(`window.history.back()`);
    await wait(2000);
    navH1 = await cdp.evaluate(`document.querySelector('h1')?.innerText?.trim()`);
    console.log(`Back at Blog Listing. H1: "${navH1}"`);
    if (!navH1.includes('Fresh insights')) throw new Error('Back navigation H1 mismatch');

    // 6. Browser Forward
    console.log('Step 5.6: Navigating Forward...');
    await cdp.evaluate(`window.history.forward()`);
    await wait(2500);
    articleTitle = await cdp.evaluate(`document.querySelector('h1')?.innerText?.trim()`);
    console.log(`Forward at Article B. Title: "${articleTitle}"`);
    if (!articleTitle.includes('Conversion-Driven Design')) throw new Error('Forward navigation title mismatch');

    console.log('\n✓ Navigation flow test PASSED 100%!');

  } finally {
    await cdp.stop();
  }

  console.log('\n====================================================');
  console.log('ALL BROWSER VERIFICATIONS COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
}

run().catch(err => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
