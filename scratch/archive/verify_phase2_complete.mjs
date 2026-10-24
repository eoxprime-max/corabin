import { ChromeCDP } from '../tools/cdp_helper.mjs';
import fs from 'fs';
import path from 'path';

async function main() {
  const cdp = new ChromeCDP(9333);
  await cdp.start();

  const screenshotsDir = path.resolve('screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const report = {};

  // ==========================================
  // Test 1: Homepage Desktop (1440px)
  // ==========================================
  console.log('1. Testing Homepage Desktop (1440px)...');
  await cdp.setViewport(1440, 900);
  await cdp.navigate('http://localhost:8088/');
  await new Promise(r => setTimeout(r, 4500));

  const homeDesktop = await cdp.evaluate(`(() => {
    const grid = document.querySelector('.framer-3lukgt, .framer-ugj76m, [data-framer-name="Grid"]');
    const cards = Array.from(grid?.querySelectorAll('a.framer-7Bi9P') || []).map(a => ({
      slug: a.getAttribute('data-post-slug'),
      href: a.getAttribute('href'),
      title: a.querySelector('.framer-giavb9 p')?.textContent?.trim(),
      date: a.querySelector('.framer-gifdkw p')?.textContent?.trim(),
      imgSrc: a.querySelector('img')?.getAttribute('src'),
      imgSrcset: a.querySelector('img')?.getAttribute('srcset'),
      visible: a.offsetParent !== null
    }));
    return {
      gridClass: grid?.className,
      totalCards: cards.length,
      cards
    };
  })()`);

  await cdp.captureScreenshot(path.join(screenshotsDir, 'phase2_home_desktop.png'));
  report.homeDesktop = homeDesktop;

  // ==========================================
  // Test 2: Homepage Mobile (390px)
  // ==========================================
  console.log('2. Testing Homepage Mobile (390px)...');
  await cdp.setViewport(390, 844);
  await cdp.navigate('http://localhost:8088/');
  await new Promise(r => setTimeout(r, 4500));

  const homeMobile = await cdp.evaluate(`(() => {
    const grid = document.querySelector('.framer-3lukgt, .framer-ugj76m, [data-framer-name="Grid"]');
    const cards = Array.from(grid?.querySelectorAll('a.framer-7Bi9P') || []).map(a => ({
      slug: a.getAttribute('data-post-slug'),
      href: a.getAttribute('href'),
      title: a.querySelector('.framer-giavb9 p')?.textContent?.trim(),
      date: a.querySelector('.framer-gifdkw p')?.textContent?.trim(),
      imgSrc: a.querySelector('img')?.getAttribute('src'),
      visible: a.offsetParent !== null
    }));
    return {
      gridClass: grid?.className,
      totalCards: cards.length,
      cards
    };
  })()`);

  await cdp.captureScreenshot(path.join(screenshotsDir, 'phase2_home_mobile.png'));
  report.homeMobile = homeMobile;

  // ==========================================
  // Test 3: Blog Listing Desktop (1440px)
  // ==========================================
  console.log('3. Testing Blog Listing Desktop (1440px)...');
  await cdp.setViewport(1440, 900);
  await cdp.navigate('http://localhost:8088/blog/');
  await new Promise(r => setTimeout(r, 5000));

  const blogDesktop = await cdp.evaluate(`(() => {
    const featGrid = document.querySelector('.framer-ugj76m, .framer-3lukgt');
    const featCards = Array.from(featGrid?.querySelectorAll('a.framer-7Bi9P') || []).map(a => ({
      slug: a.getAttribute('data-post-slug'),
      href: a.getAttribute('href'),
      title: a.querySelector('.framer-giavb9 p')?.textContent?.trim(),
      date: a.querySelector('.framer-gifdkw p')?.textContent?.trim(),
      imgSrc: a.querySelector('img')?.getAttribute('src'),
      imgSrcset: a.querySelector('img')?.getAttribute('srcset')
    }));

    const regContainer = document.querySelector('.framer-18dht5n');
    const regCards = Array.from(regContainer?.querySelectorAll('.framer-ij7w41-container') || []).map(c => ({
      slug: c.getAttribute('data-post-slug'),
      href: c.querySelector('a')?.getAttribute('href'),
      title: c.querySelector('.framer-1pz7yr3 p')?.textContent?.trim(),
      date: c.querySelector('.framer-ie051f p')?.textContent?.trim(),
      imgSrc: c.querySelector('img')?.getAttribute('src'),
      variant: c.querySelector('a')?.getAttribute('data-framer-name')
    }));

    const featSlugs = new Set(featCards.map(c => c.slug).filter(Boolean));
    const duplicates = regCards.filter(c => featSlugs.has(c.slug));

    return {
      featCount: featCards.length,
      featCards,
      regCount: regCards.length,
      regCards,
      duplicatesCount: duplicates.length,
      duplicates
    };
  })()`);

  await cdp.captureScreenshot(path.join(screenshotsDir, 'phase2_blog_desktop.png'));
  report.blogDesktop = blogDesktop;

  // ==========================================
  // Test 4: Blog Listing Mobile (390px)
  // ==========================================
  console.log('4. Testing Blog Listing Mobile (390px)...');
  await cdp.setViewport(390, 844);
  await cdp.navigate('http://localhost:8088/blog/');
  await new Promise(r => setTimeout(r, 5000));

  const blogMobile = await cdp.evaluate(`(() => {
    const featGrid = document.querySelector('.framer-ugj76m, .framer-3lukgt');
    const featCards = Array.from(featGrid?.querySelectorAll('a.framer-7Bi9P') || []).map(a => ({
      slug: a.getAttribute('data-post-slug'),
      href: a.getAttribute('href'),
      title: a.querySelector('.framer-giavb9 p')?.textContent?.trim(),
      date: a.querySelector('.framer-gifdkw p')?.textContent?.trim(),
      imgSrc: a.querySelector('img')?.getAttribute('src')
    }));

    const regContainer = document.querySelector('.framer-18dht5n');
    const regCards = Array.from(regContainer?.querySelectorAll('.framer-ij7w41-container') || []).map(c => ({
      slug: c.getAttribute('data-post-slug'),
      href: c.querySelector('a')?.getAttribute('href'),
      title: c.querySelector('.framer-1pz7yr3 p')?.textContent?.trim(),
      date: c.querySelector('.framer-ie051f p')?.textContent?.trim(),
      variant: c.querySelector('a')?.getAttribute('data-framer-name')
    }));

    return {
      featCount: featCards.length,
      featCards,
      regCount: regCards.length,
      sampleMobileVariant: regCards[0]?.variant
    };
  })()`);

  await cdp.captureScreenshot(path.join(screenshotsDir, 'phase2_blog_mobile.png'));
  report.blogMobile = blogMobile;

  // ==========================================
  // Test 5: Article Route Network Monitoring (Task C verification)
  // ==========================================
  console.log('5. Testing Article Route Single Fetch (Task C verification)...');
  await cdp.setViewport(1440, 900);
  await cdp.navigate('http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026/');
  await new Promise(r => setTimeout(r, 4500));

  const articleEval = await cdp.evaluate(`(() => {
    const h1 = document.querySelector('h1.framer-text, #hero h1, [data-framer-name="Heading Wrapper"] h1');
    const cover = document.querySelector('[data-framer-name="Background Image"] img, .framer-z182eh img, #article-cover-img');
    const body = document.querySelector('.framer-1272rho, #article-body-content');

    const supabaseEntries = performance.getEntriesByType('resource')
      .filter(e => e.name.includes('supabase.co/rest/v1/posts'))
      .map(e => ({ name: e.name, duration: e.duration, initiatorType: e.initiatorType }));

    return {
      title: h1?.textContent?.trim(),
      coverSrc: cover?.getAttribute('src'),
      hasBody: !!body && body.children.length > 0,
      bodyParagraphs: body?.children?.length || 0,
      supabaseEntriesCount: supabaseEntries.length,
      supabaseEntries
    };
  })()`);

  await cdp.captureScreenshot(path.join(screenshotsDir, 'phase2_article_desktop.png'));

  report.article = articleEval;

  console.log('\n================ COMPLETE VERIFICATION REPORT ================');
  console.log(JSON.stringify(report, null, 2));

  await cdp.stop();
}

main().catch(console.error);
