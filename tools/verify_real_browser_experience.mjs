import { ChromeCDP } from './cdp_helper.mjs';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = '/home/souvik/.gemini/antigravity-ide/brain/6ec40112-e82b-4f2c-85c7-43c31edc3db9';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForSelector(cdp, selector, minCount = 1, timeout = 12000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const count = await cdp.evaluate(`document.querySelectorAll('${selector}').length`);
    if (count >= minCount) return true;
    await sleep(200);
  }
  return false;
}

async function run() {
  console.log('================================================================');
  console.log('CORABIN REAL BROWSER EXPERIENCE & PUSH READINESS VERIFICATION');
  console.log('================================================================');

  const cdp = new ChromeCDP(9462);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');

  const networkErrors = [];
  const consoleErrors = [];

  cdp.on('Network.responseReceived', (params) => {
    if (params.response.status >= 400) {
      networkErrors.push(`[HTTP ${params.response.status}] ${params.response.url}`);
    }
  });

  cdp.on('Runtime.consoleAPICalled', (params) => {
    if (params.type === 'error') {
      const text = params.args.map(a => a.value || a.description || '').join(' ');
      // Filter out harmless favicon 404 if any
      if (!text.includes('favicon.ico')) {
        consoleErrors.push(`[Console Error] ${text}`);
      }
    }
  });

  cdp.on('Runtime.exceptionThrown', (params) => {
    consoleErrors.push(`[Uncaught Exception] ${params.exceptionDetails?.text || ''} ${params.exceptionDetails?.exception?.description || ''}`);
  });

  const testResults = {
    blogListingDesktop: null,
    blogListingMobile: null,
    articlesSpaAndDirect: [],
    historyNavigation: null,
    nonBlogPages: []
  };

  // -------------------------------------------------------------
  // SUITE 1: /blog/ LISTING (Desktop 1440x900)
  // -------------------------------------------------------------
  console.log('\n--- SUITE 1: /blog/ LISTING (Desktop 1440x900) ---');
  await cdp.setViewport(1440, 900);
  networkErrors.length = 0;
  consoleErrors.length = 0;

  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await waitForSelector(cdp, '.framer-18dht5n .framer-ij7w41-container', 5, 12000);
  await sleep(1000);

  // Trigger lazy-load of all images down the page
  for (let s = 1; s <= 5; s++) {
    await cdp.evaluate(`(() => { window.scrollTo(0, (document.body.scrollHeight / 5) * ${s}); })()`);
    await sleep(400);
  }
  await sleep(1500);

  const desktopCards = await cdp.evaluate(`(() => {
    const featCards = Array.from(document.querySelectorAll('.framer-ugj76m a.framer-7Bi9P, .framer-3lukgt a.framer-7Bi9P'))
      .filter(c => window.getComputedStyle(c).display !== 'none');
    
    const regCards = Array.from(document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container'))
      .filter(c => window.getComputedStyle(c).display !== 'none');

    const parseCard = (el, type) => {
      const link = el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a');
      const img = el.querySelector('img');
      const title = el.querySelector('h2, h3, .framer-1pz7yr3 p, [data-framer-name="Title"] p, .framer-text')?.textContent?.trim();
      const href = link?.getAttribute('href') || link?.href || '';
      return {
        type,
        href,
        title,
        imgSrc: img?.currentSrc || img?.src || '',
        complete: img?.complete || false,
        naturalWidth: img?.naturalWidth || 0,
        naturalHeight: img?.naturalHeight || 0,
        isCloudinary: (img?.currentSrc || img?.src || '').includes('cloudinary.com')
      };
    };

    return {
      featuredCount: featCards.length,
      regularCount: regCards.length,
      totalCount: featCards.length + regCards.length,
      featured: featCards.map(c => parseCard(c, 'featured')),
      regular: regCards.map(c => parseCard(c, 'regular'))
    };
  })()`);

  console.log(`Desktop Featured Cards: ${desktopCards.featuredCount} (Expected: 3)`);
  console.log(`Desktop Regular Cards:  ${desktopCards.regularCount} (Expected: 10)`);
  console.log(`Desktop Total Cards:    ${desktopCards.totalCount} (Expected: 13)`);

  let brokenCovers = 0;
  [...desktopCards.featured, ...desktopCards.regular].forEach((card, idx) => {
    const isOk = card.complete && card.naturalWidth > 0 && card.isCloudinary;
    if (!isOk) brokenCovers++;
    console.log(`  [${card.type.padEnd(8)}] #${idx + 1}: "${card.title?.substring(0, 35)}..." -> ${card.href}`);
    console.log(`             img: complete=${card.complete} dims=${card.naturalWidth}x${card.naturalHeight} Cloudinary=${card.isCloudinary}`);
  });

  testResults.blogListingDesktop = {
    ...desktopCards,
    brokenCovers,
    networkErrorsCount: networkErrors.length,
    consoleErrorsCount: consoleErrors.length
  };

  await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'final_verification_blog_desktop.png'));

  // -------------------------------------------------------------
  // SUITE 2: /blog/ LISTING (Mobile 390x844)
  // -------------------------------------------------------------
  console.log('\n--- SUITE 2: /blog/ LISTING (Mobile 390x844) ---');
  await cdp.setViewport(390, 844);
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await waitForSelector(cdp, '.framer-18dht5n .framer-ij7w41-container', 5, 12000);
  
  for (let s = 1; s <= 5; s++) {
    await cdp.evaluate(`(() => { window.scrollTo(0, (document.body.scrollHeight / 5) * ${s}); })()`);
    await sleep(300);
  }
  await sleep(1500);

  const mobileCards = await cdp.evaluate(`(() => {
    const featCards = Array.from(document.querySelectorAll('.framer-ugj76m a.framer-7Bi9P, .framer-3lukgt a.framer-7Bi9P'))
      .filter(c => window.getComputedStyle(c).display !== 'none');
    
    const regCards = Array.from(document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container'))
      .filter(c => window.getComputedStyle(c).display !== 'none');

    const countLoadedImages = (elements) => {
      let loaded = 0;
      elements.forEach(el => {
        const img = el.querySelector('img');
        if (img && img.complete && img.naturalWidth > 0) loaded++;
      });
      return loaded;
    };

    return {
      featuredCount: featCards.length,
      regularCount: regCards.length,
      featuredImagesLoaded: countLoadedImages(featCards),
      regularImagesLoaded: countLoadedImages(regCards)
    };
  })()`);

  console.log(`Mobile Featured Cards: ${mobileCards.featuredCount} (Loaded Images: ${mobileCards.featuredImagesLoaded})`);
  console.log(`Mobile Regular Cards:  ${mobileCards.regularCount} (Loaded Images: ${mobileCards.regularImagesLoaded})`);

  testResults.blogListingMobile = mobileCards;
  await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'final_verification_blog_mobile.png'));

  // -------------------------------------------------------------
  // SUITE 3: ALL 13 ARTICLES — SPA CLICK NAVIGATION & HARD REFRESH
  // -------------------------------------------------------------
  console.log('\n--- SUITE 3: ALL 13 ARTICLES (SPA NAVIGATION & DIRECT HARD REFRESH) ---');
  await cdp.setViewport(1440, 900);

  const all13Slugs = [
    'idx-listings-not-showing-google',
    'real-estate-agent-website-cost-2026',
    'custom-vs-off-the-shelf-choose-wisely',
    'why-every-real-estate-agent-needs-a-website-in-2026',
    'design-that-converts-our-approach',
    '7-critical-steps-to-successfully-launch-your-digital-product',
    'choosing-the-right-tech-stack-a-decision-framework-for-2025',
    'speed-up-your-website-today',
    'why-design-systems-actually-matter',
    'headless-cms-the-future-is-here',
    'stop-making-these-common-api-mistakes',
    'website-security-made-simple',
    'technical-debt-friend-or-foe'
  ];

  for (let i = 0; i < all13Slugs.length; i++) {
    const slug = all13Slugs[i];
    console.log(`\nVerifying Article #${i + 1}: ${slug}`);

    // Part A: SPA Click from /blog/
    await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
    await waitForSelector(cdp, '.framer-18dht5n .framer-ij7w41-container', 5, 12000);
    
    // Scroll to reveal card
    await cdp.evaluate(`(() => {
      const link = Array.from(document.querySelectorAll('a')).find(a => a.getAttribute('href')?.includes('${slug}'));
      if (link) link.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(300);

    const clickSuccess = await cdp.evaluate(`(() => {
      const link = Array.from(document.querySelectorAll('a')).find(a => a.getAttribute('href')?.includes('${slug}'));
      if (link) {
        link.click();
        return true;
      }
      return false;
    })()`);

    await sleep(1800);

    const spaState = await cdp.evaluate(`(() => {
      const title = document.querySelector('#article-title, h1')?.textContent?.trim();
      const cover = document.querySelector('#article-cover-img, .framer-z182eh img');
      const heading = document.querySelector('.framer-1ekua6s');
      const bg = document.querySelector('.framer-z182eh');
      const bodyContent = document.querySelector('#article-body-content');
      
      const csH = heading ? window.getComputedStyle(heading) : null;
      const csB = bg ? window.getComputedStyle(bg) : null;

      return {
        path: window.location.pathname,
        hasBlogBlog: window.location.pathname.includes('/blog/blog'),
        title: title?.substring(0, 45),
        headingOpacity: csH?.opacity,
        bgOpacity: csB?.opacity,
        bodyTextLength: bodyContent?.textContent?.trim().length || 0,
        cover: cover ? {
          src: cover.currentSrc || cover.src,
          complete: cover.complete,
          naturalWidth: cover.naturalWidth,
          isCloudinary: (cover.currentSrc || cover.src)?.includes('cloudinary.com')
        } : null
      };
    })()`);

    console.log(`  [SPA Click] Path: ${spaState.path} (hasBlogBlog: ${spaState.hasBlogBlog})`);
    console.log(`              Title: "${spaState.title}..."`);
    console.log(`              Cover: complete=${spaState.cover?.complete} dims=${spaState.cover?.naturalWidth}px Cloudinary=${spaState.cover?.isCloudinary}`);
    console.log(`              Anim Opacity: heading=${spaState.headingOpacity} bg=${spaState.bgOpacity}`);

    // Part B: Direct Hard Refresh with Timeline Sampling
    await cdp.send('Page.navigate', { url: `http://localhost:8088/blog/${slug}/` });
    
    // Sample mid-animation (300ms) and settled (1500ms)
    await sleep(300);
    const midRefresh = await cdp.evaluate(`(() => {
      const h1 = document.querySelector('h1')?.textContent?.trim();
      const img = document.querySelector('#article-cover-img, .framer-z182eh img');
      const heading = document.querySelector('.framer-1ekua6s');
      return {
        h1: h1?.substring(0, 35),
        img: img?.src?.split('/').pop(),
        opacity: heading ? window.getComputedStyle(heading).opacity : null
      };
    })()`);

    // Allow live Supabase REST API fetch to return and populate article body
    let settledRefresh = null;
    for (let attempts = 0; attempts < 10; attempts++) {
      await sleep(attempts === 0 ? 1200 : 300);
      settledRefresh = await cdp.evaluate(`(() => {
        const h1 = document.querySelector('h1')?.textContent?.trim();
        const img = document.querySelector('#article-cover-img, .framer-z182eh img');
        const heading = document.querySelector('.framer-1ekua6s');
        const body = document.querySelector('#article-body-content');
        return {
          path: window.location.pathname,
          hasBlogBlog: window.location.pathname.includes('/blog/blog'),
          h1: h1?.substring(0, 45),
          img: img?.src?.split('/').pop(),
          complete: img?.complete,
          naturalWidth: img?.naturalWidth,
          opacity: heading ? window.getComputedStyle(heading).opacity : null,
          bodyLen: body?.textContent?.trim().length || 0
        };
      })()`);
      if (settledRefresh.bodyLen > 50) break;
    }

    console.log(`  [Hard Refresh] Mid (t=300ms): op=${midRefresh.opacity} H1="${midRefresh.h1}..." Img=${midRefresh.img}`);
    console.log(`                 Settled: op=${settledRefresh.opacity} complete=${settledRefresh.complete} bodyLen=${settledRefresh.bodyLen}`);

    testResults.articlesSpaAndDirect.push({
      slug,
      clickSuccess,
      spaState,
      midRefresh,
      settledRefresh
    });
  }

  // -------------------------------------------------------------
  // SUITE 4: HISTORY NAVIGATION & BACK / FORWARD INTEGRITY
  // -------------------------------------------------------------
  console.log('\n--- SUITE 4: HISTORY NAVIGATION (BACK / FORWARD) ---');
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await sleep(1500);

  // Navigate to Article 1
  await cdp.evaluate(`(() => {
    const a = Array.from(document.querySelectorAll('a')).find(el => el.getAttribute('href')?.includes('idx-listings-not-showing-google'));
    if (a) a.click();
  })()`);
  await sleep(1500);
  const histStep1 = await cdp.evaluate('window.location.pathname');

  // Navigate to Article 2
  await cdp.evaluate(`(() => {
    const a = Array.from(document.querySelectorAll('a')).find(el => el.getAttribute('href')?.includes('real-estate-agent-website-cost-2026'));
    if (a) a.click();
  })()`);
  await sleep(1500);
  const histStep2 = await cdp.evaluate('window.location.pathname');

  // Back to Article 1
  await cdp.evaluate('window.history.back()');
  await sleep(1200);
  const histStep3 = await cdp.evaluate('window.location.pathname');

  // Back to /blog/
  await cdp.evaluate('window.history.back()');
  await sleep(1200);
  const histStep4 = await cdp.evaluate('window.location.pathname');

  // Forward to Article 1
  await cdp.evaluate('window.history.forward()');
  await sleep(1200);
  const histStep5 = await cdp.evaluate('window.location.pathname');

  console.log(`  History Step 1 (Nav Article 1): ${histStep1}`);
  console.log(`  History Step 2 (Nav Article 2): ${histStep2}`);
  console.log(`  History Step 3 (Back to Art 1): ${histStep3}`);
  console.log(`  History Step 4 (Back to Blog):  ${histStep4}`);
  console.log(`  History Step 5 (Forward to Art):${histStep5}`);

  testResults.historyNavigation = {
    histStep1, histStep2, histStep3, histStep4, histStep5,
    noBlogBlog: ![histStep1, histStep2, histStep3, histStep4, histStep5].some(p => p.includes('/blog/blog'))
  };

  // -------------------------------------------------------------
  // SUITE 5: NON-BLOG PAGES INTEGRITY
  // -------------------------------------------------------------
  console.log('\n--- SUITE 5: NON-BLOG PAGES INTEGRITY ---');
  const nonBlogUrls = [
    { name: 'Homepage', url: 'http://localhost:8088/' },
    { name: 'About Page', url: 'http://localhost:8088/about' },
    { name: 'Projects Listing', url: 'http://localhost:8088/projects' },
    { name: 'Project Detail (Kora)', url: 'http://localhost:8088/projects/kora' },
    { name: 'Contact Page', url: 'http://localhost:8088/contact' }
  ];

  for (const page of nonBlogUrls) {
    await cdp.send('Page.navigate', { url: page.url });
    const pageState = await cdp.evaluate(`(async () => {
      const h1 = document.querySelector('h1')?.textContent?.trim();
      
      // Scroll rendered images in desktop layout to trigger lazy loading
      const renderedImages = Array.from(document.querySelectorAll('img')).filter(img => {
        const style = window.getComputedStyle(img);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });

      for (const img of renderedImages) {
        img.scrollIntoView({ behavior: 'instant', block: 'center' });
        await new Promise(r => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 600));

      const visibleImages = Array.from(document.querySelectorAll('img')).filter(img => {
        const rect = img.getBoundingClientRect();
        const style = window.getComputedStyle(img);
        return style.display !== 'none' && (rect.width > 0 || img.naturalWidth > 0);
      });

      const brokenImages = visibleImages.filter(img => !img.complete || img.naturalWidth === 0);
      return {
        title: document.title,
        h1: h1?.substring(0, 40),
        totalImages: visibleImages.length,
        brokenImagesCount: brokenImages.length
      };
    })()`);

    console.log(`  [${page.name}] title="${pageState.title}" h1="${pageState.h1}..." images=${pageState.totalImages} (broken=${pageState.brokenImagesCount})`);
    testResults.nonBlogPages.push({ ...page, ...pageState });
  }

  console.log('\n-------------------------------------------------------------');
  console.log(`Final Global Error Summary:`);
  console.log(`  Network 4xx/5xx Errors: ${networkErrors.length}`);
  console.log(`  Console Errors:         ${consoleErrors.length}`);
  if (networkErrors.length > 0) console.log('  Network Errors:', networkErrors);
  if (consoleErrors.length > 0) console.log('  Console Errors:', consoleErrors);
  console.log('-------------------------------------------------------------');

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'comprehensive_browser_verification_results.json'),
    JSON.stringify(testResults, null, 2)
  );

  await cdp.stop();
  console.log('\n================================================================');
  console.log('REAL BROWSER VERIFICATION COMPLETE!');
  console.log('================================================================');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
