import fs from 'node:fs';
import path from 'node:path';
import { ChromeCDP } from '../tools/cdp_helper.mjs';

const RESULTS_DIR = path.resolve('scratch/audit_results');
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

const SERVER_URL = 'http://localhost:8089';

const ARTICLE_ROUTES = [
  '/blog/ch-skskmsnsm/',
  '/blog/why-every-real-estate-agent-needs-a-website-in-2026/',
  '/blog/custom-vs-off-the-shelf-choose-wisely/',
  '/blog/design-that-converts-our-approach/'
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runAudit() {
  console.log('🚀 Starting Comprehensive Browser Verification via Chrome CDP on port 9777...');
  const cdp = new ChromeCDP(9777);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('DOM.enable');

  const report = {
    homepage: null,
    blogListing: null,
    articles: {},
    mobileArticles: {},
    navigationFlow: null
  };

  try {
    // -----------------------------------------------------------------
    // TEST 1: HOMEPAGE VERIFICATION
    // -----------------------------------------------------------------
    console.log('\n========================================');
    console.log('TEST 1: Homepage Visual & Animation Verification (1440px)');
    console.log('========================================');
    await cdp.setViewport(1440, 900);
    await cdp.send('Page.navigate', { url: `${SERVER_URL}/` });
    await sleep(3500);

    const hpData = await cdp.evaluate(`(() => {
      const hero = document.querySelector('#hero, [data-framer-name="Hero Section"]');
      const featuredGrid = document.querySelector('#insights, [data-framer-name="Blog"]');
      const cards = Array.from(document.querySelectorAll('.framer-k7mcxy a.framer-7Bi9P, #insights a.framer-7Bi9P')).map(a => ({
        href: a.getAttribute('href'),
        title: a.querySelector('.framer-giavb9 p, [data-framer-name*="Title"] p')?.textContent?.trim(),
        hasImg: !!a.querySelector('img')?.src,
        imgSrc: a.querySelector('img')?.src
      }));
      const animationsTag = document.getElementById('corabin-blog-animations');
      return {
        hasHero: !!hero,
        hasFeaturedGrid: !!featuredGrid,
        cardCount: cards.length,
        cards,
        hasCorabinAnimationsTagOnHomepage: !!animationsTag
      };
    })()`);

    console.log('Homepage evaluation result:', JSON.stringify(hpData, null, 2));
    report.homepage = hpData;

    await cdp.captureScreenshot(path.join(RESULTS_DIR, '01_homepage.png'));
    console.log('📸 Captured 01_homepage.png');

    // -----------------------------------------------------------------
    // TEST 2: BLOG LISTING VERIFICATION
    // -----------------------------------------------------------------
    console.log('\n========================================');
    console.log('TEST 2: Blog Listing Page Verification (1440px)');
    console.log('========================================');
    await cdp.send('Page.navigate', { url: `${SERVER_URL}/blog/` });
    await sleep(3500);

    const blogData = await cdp.evaluate(`(() => {
      const heading = document.querySelector('h1.framer-text, [data-framer-name="Heading Wrapper"] h1')?.textContent?.trim();
      const featuredCards = Array.from(document.querySelectorAll('.framer-ugj76m a.framer-7Bi9P')).map(a => ({
        href: a.getAttribute('href'),
        title: a.querySelector('.framer-giavb9 p, [data-framer-name*="Title"] p')?.textContent?.trim(),
        imgSrc: a.querySelector('img')?.src
      }));
      const regularCards = Array.from(document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container')).map(c => {
        const a = c.querySelector('a');
        return {
          href: a?.getAttribute('href'),
          title: c.querySelector('.framer-1pz7yr3 p, [data-framer-name="Title"] p')?.textContent?.trim(),
          date: c.querySelector('.framer-ie051f p, .framer-1m2k1ez p')?.textContent?.trim(),
          imgSrc: c.querySelector('img')?.src
        };
      });

      return {
        heading,
        headingCorrect: heading === 'Fresh insights & industry perspectives',
        featuredCount: featuredCards.length,
        featuredCards,
        regularCount: regularCards.length,
        sampleRegular: regularCards.slice(0, 4)
      };
    })()`);

    console.log('Blog listing evaluation result:', JSON.stringify(blogData, null, 2));
    report.blogListing = blogData;

    await cdp.captureScreenshot(path.join(RESULTS_DIR, '02_blog_listing.png'));
    console.log('📸 Captured 02_blog_listing.png');

    // -----------------------------------------------------------------
    // TEST 3: ARTICLE PAGES & RELATED SECTION (ALL 4 REQUIRED ROUTES)
    // -----------------------------------------------------------------
    console.log('\n========================================');
    console.log('TEST 3: Individual Article Pages & Related Articles');
    console.log('========================================');

    for (const route of ARTICLE_ROUTES) {
      console.log(`\n--- Testing Article: ${route} ---`);
      await cdp.setViewport(1440, 900);
      await cdp.send('Page.navigate', { url: `${SERVER_URL}${route}` });
      await sleep(3500);

      const articleEval = await cdp.evaluate(`(() => {
        const currentSlug = window.location.pathname.replace(/^\\/blog\\//, '').replace(/\\/+$/, '');
        const title = document.querySelector('#article-title, .framer-1ltkmql h1')?.textContent?.trim();
        const date = document.querySelector('#article-date, .framer-ybkmy time, .framer-ybkmy p')?.textContent?.trim();
        const author = document.querySelector('#article-author, .framer-y7unnl p')?.textContent?.trim();
        const coverImg = document.querySelector('#article-cover-img, .framer-z182eh img');
        const coverSrc = coverImg?.src;
        const coverOpacity = coverImg ? window.getComputedStyle(coverImg).opacity : '0';
        const headingWrapper = document.querySelector('.framer-1ekua6s');
        const headingOpacity = headingWrapper ? window.getComputedStyle(headingWrapper).opacity : '0';
        const bodyContent = document.querySelector('#article-body-content, .framer-1272rho');
        const bodyTextLength = bodyContent ? bodyContent.textContent.trim().length : 0;
        const bodyHeadings = bodyContent ? Array.from(bodyContent.querySelectorAll('h1, h2, h3, h4')).map(h => h.textContent.trim()) : [];

        // Related / Blog Section
        const blogSec = document.querySelector('.framer-k7mcxy, [data-framer-name="Blog"]');
        const sectionBadge = blogSec?.querySelector('.framer-dy3gs, [data-framer-name="/Our Vision/"] p')?.textContent?.trim();
        const sectionHeading = blogSec?.querySelector('.framer-1elrhda h2, [data-framer-name="Our perspectives"] h2')?.textContent?.trim();
        const allArticlesLink = blogSec?.querySelector('a[href*="/blog"]')?.getAttribute('href');

        const relatedCards = Array.from(document.querySelectorAll('.framer-k7mcxy a.framer-7Bi9P, [data-framer-name="Blog"] a.framer-7Bi9P')).map(a => {
          const href = a.getAttribute('href');
          const cardSlug = href ? href.replace(/^\\/blog\\//, '').replace(/\\/+$/, '').replace(/^\\.\\/blog\\//, '') : '';
          const cTitle = a.querySelector('.framer-giavb9 p, [data-framer-name*="Title"] p')?.textContent?.trim();
          const cDate = a.querySelector('.framer-gifdkw p, [data-framer-name*="Date"] p')?.textContent?.trim();
          const img = a.querySelector('img');
          const rect = a.getBoundingClientRect();
          return {
            href,
            cardSlug,
            title: cTitle,
            date: cDate,
            hasImg: !!img?.src,
            imgSrc: img?.src,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            top: Math.round(rect.top)
          };
        });

        // Filter distinct cards by cardSlug
        const uniqueCardsBySlug = [];
        const seenSlugs = new Set();
        for (const c of relatedCards) {
          if (c.cardSlug && !seenSlugs.has(c.cardSlug)) {
            seenSlugs.add(c.cardSlug);
            uniqueCardsBySlug.push(c);
          }
        }

        const selfRecommended = uniqueCardsBySlug.some(c => c.cardSlug === currentSlug);

        return {
          currentSlug,
          title,
          date,
          author,
          coverSrc,
          coverOpacity,
          headingOpacity,
          bodyTextLength,
          bodyHeadingsSample: bodyHeadings.slice(0, 3),
          hasBlogSection: !!blogSec,
          sectionBadge,
          sectionHeading,
          allArticlesLink,
          totalRenderedCards: relatedCards.length,
          uniqueRelatedCards: uniqueCardsBySlug,
          selfRecommended
        };
      })()`);

      console.log(`Results for ${route}:`, JSON.stringify(articleEval, null, 2));
      report.articles[route] = articleEval;

      const slugClean = route.replace(/\//g, '_').replace(/^_blog_/, '').replace(/_$/, '');
      await cdp.captureScreenshot(path.join(RESULTS_DIR, `03_article_${slugClean}_desktop.png`));
      console.log(`📸 Captured 03_article_${slugClean}_desktop.png`);

      // Scroll to related section and take a clip screenshot
      await cdp.evaluate(`(() => {
        const sec = document.querySelector('.framer-k7mcxy, [data-framer-name="Blog"]');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`);
      await sleep(1000);
      await cdp.captureScreenshot(path.join(RESULTS_DIR, `04_article_${slugClean}_related.png`));
      console.log(`📸 Captured 04_article_${slugClean}_related.png`);
    }

    // -----------------------------------------------------------------
    // TEST 4: MOBILE VIEWPORT VERIFICATION (390px x 844px)
    // -----------------------------------------------------------------
    console.log('\n========================================');
    console.log('TEST 4: Mobile Responsive Verification (390px)');
    console.log('========================================');

    for (const route of ARTICLE_ROUTES) {
      console.log(`\n--- Mobile Check: ${route} ---`);
      await cdp.setViewport(390, 844);
      await cdp.send('Page.navigate', { url: `${SERVER_URL}${route}` });
      await sleep(3500);

      const mobileEval = await cdp.evaluate(`(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const hasHorizontalOverflow = docWidth > winWidth;
        const blogSec = document.querySelector('.framer-k7mcxy, [data-framer-name="Blog"]');
        const visibleCards = Array.from(document.querySelectorAll('.framer-k7mcxy a.framer-7Bi9P')).filter(a => {
          const rect = a.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && window.getComputedStyle(a).display !== 'none';
        }).map(a => {
          const rect = a.getBoundingClientRect();
          return {
            title: a.querySelector('.framer-giavb9 p')?.textContent?.trim(),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            top: Math.round(rect.top)
          };
        });

        return {
          docWidth,
          winWidth,
          hasHorizontalOverflow,
          hasBlogSection: !!blogSec,
          visibleCardCount: visibleCards.length,
          visibleCards
        };
      })()`);

      console.log(`Mobile results for ${route}:`, JSON.stringify(mobileEval, null, 2));
      report.mobileArticles[route] = mobileEval;

      const slugClean = route.replace(/\//g, '_').replace(/^_blog_/, '').replace(/_$/, '');
      await cdp.captureScreenshot(path.join(RESULTS_DIR, `05_mobile_${slugClean}.png`));
      console.log(`📸 Captured 05_mobile_${slugClean}.png`);
    }

    // -----------------------------------------------------------------
    // TEST 5: NAVIGATION & BACK/FORWARD FLOW
    // -----------------------------------------------------------------
    console.log('\n========================================');
    console.log('TEST 5: Full Navigation & Back/Forward Flow');
    console.log('========================================');
    await cdp.setViewport(1440, 900);
    // 1. Open /blog/
    await cdp.send('Page.navigate', { url: `${SERVER_URL}/blog/` });
    await sleep(3500);

    const step1 = await cdp.evaluate(`(() => {
      return {
        heading: document.querySelector('h1.framer-text, [data-framer-name="Heading Wrapper"] h1')?.textContent?.trim()
      };
    })()`);
    console.log('Step 1 (At /blog/):', step1);

    // 2. Open Article A by clicking its rendered card link
    const clickA = await cdp.evaluate(`(() => {
      const cardA = document.querySelector('a[href*="/blog/custom-vs-off-the-shelf-choose-wisely"]');
      if (cardA) {
        cardA.click();
        return { clicked: true, href: cardA.getAttribute('href') };
      }
      return { clicked: false };
    })()`);
    console.log('Step 2 (Click Article A):', clickA);
    await sleep(3500);

    const step2 = await cdp.evaluate(`(() => {
      return {
        pathname: window.location.pathname,
        title: document.querySelector('#article-title, .framer-1ltkmql h1')?.textContent?.trim()
      };
    })()`);
    console.log('Step 2 (At Article A):', step2);

    // 3. Browser Back
    await cdp.evaluate(`window.history.back()`);
    await sleep(3500);

    const step3 = await cdp.evaluate(`(() => {
      return {
        pathname: window.location.pathname,
        heading: document.querySelector('h1.framer-text, [data-framer-name="Heading Wrapper"] h1')?.textContent?.trim()
      };
    })()`);
    console.log('Step 3 (After Back at /blog/):', step3);

    // 4. Open Article B
    const clickB = await cdp.evaluate(`(() => {
      const cardB = document.querySelector('a[href*="/blog/why-every-real-estate-agent-needs-a-website-in-2026"]');
      if (cardB) {
        cardB.click();
        return { clicked: true, href: cardB.getAttribute('href') };
      }
      return { clicked: false };
    })()`);
    console.log('Step 4 (Click Article B):', clickB);
    await sleep(3500);

    const step4 = await cdp.evaluate(`(() => {
      return {
        pathname: window.location.pathname,
        title: document.querySelector('#article-title, .framer-1ltkmql h1')?.textContent?.trim()
      };
    })()`);
    console.log('Step 4 (At Article B):', step4);

    // 5. Back and Forward
    await cdp.evaluate(`window.history.back()`);
    await sleep(3000);
    const step5 = await cdp.evaluate(`(() => ({
      pathname: window.location.pathname,
      heading: document.querySelector('h1.framer-text')?.textContent?.trim()
    }))()`);
    console.log('Step 5 (Back at /blog/):', step5);

    await cdp.evaluate(`window.history.forward()`);
    await sleep(3000);
    const step6 = await cdp.evaluate(`(() => ({
      pathname: window.location.pathname,
      title: document.querySelector('#article-title, .framer-1ltkmql h1')?.textContent?.trim()
    }))()`);
    console.log('Step 6 (Forward at Article B):', step6);

    report.navigationFlow = {
      step1, clickA, step2, step3, clickB, step4, step5, step6
    };

    await cdp.captureScreenshot(path.join(RESULTS_DIR, '06_navigation_flow.png'));
    console.log('📸 Captured 06_navigation_flow.png');

    console.log('\n========================================');
    console.log('VERIFICATION SUMMARY');
    console.log('========================================');
    fs.writeFileSync(path.join(RESULTS_DIR, 'audit_report.json'), JSON.stringify(report, null, 2));
    console.log('✅ Full audit report written to scratch/audit_results/audit_report.json');

  } finally {
    await cdp.stop();
  }
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
