import { ChromeCDP } from '../tools/cdp_helper.mjs';
import fs from 'node:fs';

const ARTIFACT_DIR = '/home/souvik/.gemini/antigravity-ide/brain/d6a7040b-5a91-4e77-b138-2861c8e7f0e1';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('====================================================');
  console.log('CORABIN COMPREHENSIVE BROWSER CDP VERIFICATION SUITE');
  console.log('====================================================');

  const cdp = new ChromeCDP(9445);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');

  const consoleLogs = [];
  cdp.on('Runtime.consoleAPICalled', (params) => {
    const text = params.args?.map(a => a.value || JSON.stringify(a)).join(' ');
    consoleLogs.push(`[${params.type}] ${text}`);
  });

  const networkErrors = [];
  cdp.on('Network.responseReceived', (params) => {
    if (params.response.status >= 400) {
      networkErrors.push(`[HTTP ${params.response.status}] ${params.response.url}`);
    }
  });
  cdp.on('Network.loadingFailed', (params) => {
    networkErrors.push(`[FAILED] ${params.errorText}: ${params.type}`);
  });

  // ==========================================
  // TEST 1: DESKTOP /blog/ LISTING (1440x900)
  // ==========================================
  console.log('\n--- TEST 1: DESKTOP /blog/ LISTING (1440x900) ---');
  networkErrors.length = 0;
  consoleLogs.length = 0;
  await cdp.setViewport(1440, 900);
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await sleep(3500);

  const listingDesktop = await cdp.evaluate(`(() => {
    const cards = Array.from(document.querySelectorAll('.framer-18dht5n, .framer-ij7w41-container'));
    const visibleCards = cards.filter(c => window.getComputedStyle(c).display !== 'none');
    
    const cardData = visibleCards.map((card, i) => {
      const img = card.querySelector('img');
      const link = card.querySelector('a');
      const title = card.querySelector('.framer-1pz7yr3, h2, h3, [data-framer-name="Title"]')?.textContent?.trim();
      return {
        index: i + 1,
        href: link?.getAttribute('href'),
        title: title?.substring(0, 40),
        img: img ? {
          src: img.src,
          currentSrc: img.currentSrc,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          hasBrokenIcon: img.naturalWidth === 0 && img.complete
        } : null
      };
    });

    return {
      totalCardsFound: cards.length,
      visibleCardCount: visibleCards.length,
      cardData
    };
  })()`);

  console.log(`Total cards found: ${listingDesktop.totalCardsFound}, Visible: ${listingDesktop.visibleCardCount}`);
  let brokenImagesCount = 0;
  listingDesktop.cardData.forEach(c => {
    const isCloudinary = c.img?.src?.includes('cloudinary.com');
    const isLoaded = c.img?.complete && c.img?.naturalWidth > 0;
    if (!isLoaded || !isCloudinary) brokenImagesCount++;
    console.log(`  Card ${c.index}: [${c.title}] href="${c.href}" | loaded=${isLoaded} (${c.img?.naturalWidth}x${c.img?.naturalHeight}) Cloudinary=${isCloudinary}`);
  });
  console.log(`Broken/missing image count on Desktop /blog/: ${brokenImagesCount}`);
  console.log(`Network errors on /blog/: ${networkErrors.length}`);
  if (networkErrors.length > 0) console.log('  ', networkErrors.join('\n   '));

  await cdp.captureScreenshot(`${ARTIFACT_DIR}/cdp_test1_desktop_blog_listing.png`);
  console.log(`Saved screenshot to ${ARTIFACT_DIR}/cdp_test1_desktop_blog_listing.png`);

  // ==========================================
  // TEST 2: MOBILE /blog/ LISTING (390x844)
  // ==========================================
  console.log('\n--- TEST 2: MOBILE /blog/ LISTING (390x844) ---');
  networkErrors.length = 0;
  await cdp.setViewport(390, 844);
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await sleep(3500);

  const listingMobile = await cdp.evaluate(`(() => {
    const cards = Array.from(document.querySelectorAll('.framer-18dht5n, .framer-ij7w41-container'));
    const visibleCards = cards.filter(c => window.getComputedStyle(c).display !== 'none');
    const cardData = visibleCards.map((card, i) => {
      const img = card.querySelector('img');
      return {
        index: i + 1,
        complete: img?.complete,
        naturalWidth: img?.naturalWidth,
        naturalHeight: img?.naturalHeight,
        isCloudinary: img?.src?.includes('cloudinary.com')
      };
    });
    return { visibleCardCount: visibleCards.length, cardData };
  })()`);

  console.log(`Visible cards on Mobile: ${listingMobile.visibleCardCount}`);
  let mobileBroken = 0;
  listingMobile.cardData.forEach(c => {
    if (!c.complete || c.naturalWidth === 0 || !c.isCloudinary) mobileBroken++;
  });
  console.log(`Broken images on Mobile: ${mobileBroken}`);
  await cdp.captureScreenshot(`${ARTIFACT_DIR}/cdp_test2_mobile_blog_listing.png`);

  // ==========================================
  // TEST 3: DIRECT HARD RELOAD OF 13TH ARTICLE (Appear Animation Sampling)
  // ==========================================
  console.log('\n--- TEST 3: DIRECT HARD RELOAD OF 13TH ARTICLE ---');
  await cdp.setViewport(1440, 900);
  networkErrors.length = 0;

  // Navigate to 13th article
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026/' });
  
  // Sample appear animation progression over 1.5 seconds
  const sampleTimeline = [30, 80, 150, 300, 600, 1200];
  console.log('Sampling 13th article appear animation progression:');
  for (const delay of sampleTimeline) {
    await sleep(delay);
    const sample = await cdp.evaluate(`(() => {
      const headingWrapper = document.querySelector('.framer-1ekua6s');
      const bgWrapper = document.querySelector('.framer-z182eh');
      const coverImg = document.querySelector('#article-cover-img, .framer-z182eh img');
      
      const getMetrics = (el) => {
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        return {
          opacity: parseFloat(cs.opacity).toFixed(4),
          transform: cs.transform,
          appearId: el.getAttribute('data-framer-appear-id')
        };
      };

      return {
        heading: getMetrics(headingWrapper),
        bg: getMetrics(bgWrapper),
        cover: coverImg ? {
          src: coverImg.src?.substring(0, 80),
          complete: coverImg.complete,
          naturalWidth: coverImg.naturalWidth,
          naturalHeight: coverImg.naturalHeight
        } : null
      };
    })()`);

    console.log(`  [t+${delay}ms] heading: opacity=${sample.heading?.opacity} transform=${sample.heading?.transform} | bg: opacity=${sample.bg?.opacity} transform=${sample.bg?.transform} | cover: loaded=${sample.cover?.complete} (${sample.cover?.naturalWidth}x${sample.cover?.naturalHeight})`);
  }

  await sleep(1000);
  await cdp.captureScreenshot(`${ARTIFACT_DIR}/cdp_test3_13th_article_direct.png`);
  console.log(`Saved screenshot to ${ARTIFACT_DIR}/cdp_test3_13th_article_direct.png`);

  // ==========================================
  // TEST 4: DIRECT HARD RELOAD OF ORIGINAL ARTICLES (Articles 1, 2, 11, 12)
  // ==========================================
  const originalSlugs = [
    'custom-vs-off-the-shelf-choose-wisely',
    'design-that-converts-our-approach',
    'real-estate-agent-website-cost-2026',
    'idx-listings-not-showing-google'
  ];

  console.log('\n--- TEST 4: DIRECT HARD RELOAD OF ORIGINAL ARTICLES ---');
  for (const slug of originalSlugs) {
    await cdp.send('Page.navigate', { url: `http://localhost:8088/blog/${slug}/` });
    
    // Sample initial vs final
    await sleep(40);
    const initialSample = await cdp.evaluate(`(() => {
      const heading = document.querySelector('.framer-1ekua6s');
      const bg = document.querySelector('.framer-z182eh');
      const csH = heading ? window.getComputedStyle(heading) : null;
      const csB = bg ? window.getComputedStyle(bg) : null;
      return {
        headingOpacity: csH ? csH.opacity : null,
        headingTransform: csH ? csH.transform : null,
        bgOpacity: csB ? csB.opacity : null,
        bgTransform: csB ? csB.transform : null
      };
    })()`);

    await sleep(1200);
    const finalSample = await cdp.evaluate(`(() => {
      const heading = document.querySelector('.framer-1ekua6s');
      const bg = document.querySelector('.framer-z182eh');
      const cover = document.querySelector('#article-cover-img, .framer-z182eh img');
      const title = document.querySelector('#article-title, h1')?.textContent?.trim();
      const csH = heading ? window.getComputedStyle(heading) : null;
      const csB = bg ? window.getComputedStyle(bg) : null;
      return {
        title: title?.substring(0, 40),
        headingOpacity: csH ? csH.opacity : null,
        headingTransform: csH ? csH.transform : null,
        bgOpacity: csB ? csB.opacity : null,
        bgTransform: csB ? csB.transform : null,
        cover: cover ? {
          complete: cover.complete,
          naturalWidth: cover.naturalWidth,
          naturalHeight: cover.naturalHeight,
          isCloudinary: cover.src?.includes('cloudinary.com')
        } : null
      };
    })()`);

    console.log(`  Article /blog/${slug}/:`);
    console.log(`    Initial (t+40ms): headingOpacity=${initialSample.headingOpacity} headingTransform=${initialSample.headingTransform}`);
    console.log(`    Final (t+1200ms): title="${finalSample.title}" headingOpacity=${finalSample.headingOpacity} coverLoaded=${finalSample.cover?.complete} (${finalSample.cover?.naturalWidth}x${finalSample.cover?.naturalHeight}) Cloudinary=${finalSample.cover?.isCloudinary}`);
  }

  // ==========================================
  // TEST 5: CLIENT-SIDE SPA NAVIGATION (Click-Through from /blog/)
  // ==========================================
  console.log('\n--- TEST 5: CLIENT-SIDE SPA NAVIGATION FROM /blog/ ---');
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await sleep(3000);

  // Click on the 13th article
  console.log('Clicking 13th article link from listing...');
  const clicked13 = await cdp.evaluate(`(() => {
    const a = Array.from(document.querySelectorAll('a')).find(el => el.getAttribute('href')?.includes('why-every-real-estate-agent-needs-a-website-in-2026'));
    if (a) {
      a.click();
      return true;
    }
    return false;
  })()`);
  console.log('13th article clicked:', clicked13);

  await sleep(1500);
  const spa13Result = await cdp.evaluate(`(() => {
    const cover = document.querySelector('#article-cover-img, .framer-z182eh img');
    const heading = document.querySelector('.framer-1ekua6s');
    return {
      url: window.location.pathname,
      headingOpacity: heading ? window.getComputedStyle(heading).opacity : null,
      cover: cover ? {
        src: cover.currentSrc || cover.src,
        complete: cover.complete,
        naturalWidth: cover.naturalWidth,
        naturalHeight: cover.naturalHeight,
        isCloudinary: (cover.currentSrc || cover.src)?.includes('cloudinary.com')
      } : null
    };
  })()`);
  console.log(`  SPA navigated to: ${spa13Result.url}`);
  console.log(`  Heading opacity: ${spa13Result.headingOpacity}`);
  console.log(`  Cover: complete=${spa13Result.cover?.complete} (${spa13Result.cover?.naturalWidth}x${spa13Result.cover?.naturalHeight}) Cloudinary=${spa13Result.cover?.isCloudinary}`);

  // Navigate back to /blog/
  console.log('Navigating back to /blog/ via SPA...');
  await cdp.evaluate(`(() => {
    const blogNav = Array.from(document.querySelectorAll('a')).find(el => el.getAttribute('href') === '/blog');
    if (blogNav) blogNav.click();
    else window.history.back();
  })()`);
  await sleep(2000);

  // Click on blog 1 (custom-vs-off-the-shelf-choose-wisely)
  console.log('Clicking blog 1 (custom-vs-off-the-shelf-choose-wisely) from listing...');
  const clicked1 = await cdp.evaluate(`(() => {
    const a = Array.from(document.querySelectorAll('a')).find(el => el.getAttribute('href')?.includes('custom-vs-off-the-shelf-choose-wisely'));
    if (a) {
      a.click();
      return true;
    }
    return false;
  })()`);
  console.log('Blog 1 clicked:', clicked1);

  await sleep(1500);
  const spa1Result = await cdp.evaluate(`(() => {
    const cover = document.querySelector('#article-cover-img, .framer-z182eh img');
    const heading = document.querySelector('.framer-1ekua6s');
    return {
      url: window.location.pathname,
      headingOpacity: heading ? window.getComputedStyle(heading).opacity : null,
      cover: cover ? {
        src: cover.currentSrc || cover.src,
        complete: cover.complete,
        naturalWidth: cover.naturalWidth,
        naturalHeight: cover.naturalHeight,
        isCloudinary: (cover.currentSrc || cover.src)?.includes('cloudinary.com')
      } : null
    };
  })()`);
  console.log(`  SPA navigated to: ${spa1Result.url}`);
  console.log(`  Heading opacity: ${spa1Result.headingOpacity}`);
  console.log(`  Cover: complete=${spa1Result.cover?.complete} (${spa1Result.cover?.naturalWidth}x${spa1Result.cover?.naturalHeight}) Cloudinary=${spa1Result.cover?.isCloudinary}`);

  await cdp.captureScreenshot(`${ARTIFACT_DIR}/cdp_test5_spa_blog1_article.png`);

  await cdp.stop();
  console.log('\n====================================================');
  console.log('ALL CDP TESTS COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
