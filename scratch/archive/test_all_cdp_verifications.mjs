import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('=== Starting Chrome CDP Verification on Port 9580 ===');
  const cdp = new ChromeCDP(9580);
  await cdp.start();
  console.log('Chrome CDP started successfully.');

  try {
    await cdp.setViewport(1440, 900);

    // Helper to inspect listing page state
    async function getListingCards() {
      return await cdp.evaluate(`(() => {
        const featCards = Array.from(document.querySelectorAll('.framer-ugj76m a, .framer-3lukgt a')).map(a => {
          const href = a.getAttribute('href') || '';
          const title = a.innerText.trim().split('\\n')[0];
          return { href, title };
        });
        const regCards = Array.from(document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container')).map(c => {
          const a = c.querySelector('a');
          const href = a ? a.getAttribute('href') : '';
          const title = (c.querySelector('h3, h2, p') || c).innerText.trim().split('\\n')[0];
          const dataSlug = c.getAttribute('data-post-slug');
          return { href, title, dataSlug };
        });
        const allCardLinks = Array.from(document.querySelectorAll('a[href*="/blog/"]')).map(a => a.getAttribute('href'));
        return {
          featuredCount: featCards.length,
          featuredCards: featCards,
          regularCount: regCards.length,
          regularCards: regCards,
          totalCards: featCards.length + regCards.length,
          has13thInRegular: regCards.some(c => (c.href && c.href.includes('why-every-real-estate-agent-needs-a-website-in-2026')) || c.dataSlug === 'why-every-real-estate-agent-needs-a-website-in-2026'),
          has13thInFeatured: featCards.some(c => c.href && c.href.includes('why-every-real-estate-agent-needs-a-website-in-2026')),
          has13thAnywhere: Array.from(document.querySelectorAll('a')).some(a => a.href && a.href.includes('why-every-real-estate-agent-needs-a-website-in-2026'))
        };
      })()`);
    }

    // ----------------------------------------------------
    // TEST 1: Initial Visit to /blog/
    // ----------------------------------------------------
    console.log('\n--- TEST 1: Initial Visit to http://localhost:8088/blog/ ---');
    await cdp.navigate('http://localhost:8088/blog/');
    // Wait for initial render and full React hydration lifecycle
    await sleep(5500);

    const test1 = await getListingCards();
    console.log(`Test 1 Results: Featured=${test1.featuredCount}, Regular=${test1.regularCount}, Total=${test1.totalCards}`);
    console.log(`Test 1 13th post present in regular cards: ${test1.has13thInRegular}`);
    console.log('Regular cards slugs/titles:');
    test1.regularCards.forEach((c, idx) => console.log(`  ${idx + 1}. [${c.dataSlug || c.href}] ${c.title.slice(0, 45)}`));
    
    if (test1.featuredCount !== 3 || test1.regularCount !== 10 || !test1.has13thInRegular) {
      throw new Error(`TEST 1 FAILED: Expected 3 featured + 10 regular = 13 cards, got ${test1.featuredCount} + ${test1.regularCount} = ${test1.totalCards}`);
    }
    console.log('✅ TEST 1 PASSED: Exactly 3 featured + 10 regular = 13 cards on initial visit!');

    // ----------------------------------------------------
    // TEST 2: Normal Reload
    // ----------------------------------------------------
    console.log('\n--- TEST 2: Normal Reload of /blog/ ---');
    await cdp.evaluate('window.location.reload()');
    await sleep(5500);

    const test2 = await getListingCards();
    console.log(`Test 2 Results: Featured=${test2.featuredCount}, Regular=${test2.regularCount}, Total=${test2.totalCards}`);
    if (test2.featuredCount !== 3 || test2.regularCount !== 10 || !test2.has13thInRegular) {
      throw new Error(`TEST 2 FAILED: Expected 3 featured + 10 regular = 13 cards on normal reload, got ${test2.featuredCount} + ${test2.regularCount} = ${test2.totalCards}`);
    }
    console.log('✅ TEST 2 PASSED: Consistently 13 cards on normal reload!');

    // ----------------------------------------------------
    // TEST 3: Hard Reload (ignoreCache: true)
    // ----------------------------------------------------
    console.log('\n--- TEST 3: Hard Reload (ignoreCache: true) of /blog/ ---');
    await cdp.send('Page.reload', { ignoreCache: true });
    await sleep(5500);

    const test3 = await getListingCards();
    console.log(`Test 3 Results: Featured=${test3.featuredCount}, Regular=${test3.regularCount}, Total=${test3.totalCards}`);
    if (test3.featuredCount !== 3 || test3.regularCount !== 10 || !test3.has13thInRegular) {
      throw new Error(`TEST 3 FAILED: Expected 3 featured + 10 regular = 13 cards on hard reload, got ${test3.featuredCount} + ${test3.regularCount} = ${test3.totalCards}`);
    }
    console.log('✅ TEST 3 PASSED: Consistently 13 cards on hard reload!');

    // ----------------------------------------------------
    // TEST 4: New Tab / Navigate to about:blank and back
    // ----------------------------------------------------
    console.log('\n--- TEST 4: New Tab Simulation (about:blank -> /blog/) ---');
    await cdp.navigate('about:blank');
    await sleep(1000);
    await cdp.navigate('http://localhost:8088/blog/');
    await sleep(5500);

    const test4 = await getListingCards();
    console.log(`Test 4 Results: Featured=${test4.featuredCount}, Regular=${test4.regularCount}, Total=${test4.totalCards}`);
    if (test4.featuredCount !== 3 || test4.regularCount !== 10 || !test4.has13thInRegular) {
      throw new Error(`TEST 4 FAILED: Expected 3 featured + 10 regular = 13 cards on new tab navigation, got ${test4.featuredCount} + ${test4.regularCount} = ${test4.totalCards}`);
    }
    console.log('✅ TEST 4 PASSED: Consistently 13 cards on fresh tab navigation without hard refresh!');

    // ----------------------------------------------------
    // TEST 5: Click 13th Post Card from /blog/
    // ----------------------------------------------------
    console.log('\n--- TEST 5: Clicking 13th Post Card from /blog/ ---');
    const clickResult = await cdp.evaluate(`(() => {
      const card = document.querySelector('[data-post-slug="why-every-real-estate-agent-needs-a-website-in-2026"]') ||
                   Array.from(document.querySelectorAll('.framer-ij7w41-container')).find(c => {
                     const a = c.querySelector('a');
                     return a && a.href.includes('why-every-real-estate-agent-needs-a-website-in-2026');
                   });
      if (!card) return { found: false };
      const link = card.querySelector('a');
      if (!link) return { found: false, hasCard: true };
      link.scrollIntoView();
      link.click();
      return { found: true, href: link.href };
    })()`);
    console.log('Click result:', clickResult);
    if (!clickResult.found) {
      throw new Error('TEST 5 FAILED: Could not find or click 13th post card link!');
    }

    await sleep(4000);

    const postStateAfterClick = await cdp.evaluate(`(() => {
      const h1 = document.querySelector('h1')?.innerText;
      const author = (document.getElementById('article-author') || document.querySelector('.framer-15d7qcn, .framer-16ganb5'))?.innerText;
      const paragraphs = Array.from(document.querySelectorAll('#article-body-content p, .framer-3x2kfl p, .framer-1272rho p')).map(p => p.innerText.trim()).filter(Boolean);
      const headingWrapper = document.querySelector('.framer-1ekua6s, .framer-1jyj1l4');
      const headingStyle = headingWrapper ? window.getComputedStyle(headingWrapper) : null;
      return {
        url: window.location.href,
        h1,
        author,
        paragraphCount: paragraphs.length,
        paragraphs: paragraphs.slice(0, 4),
        headingOpacity: headingStyle ? headingStyle.opacity : null,
        headingTransform: headingStyle ? headingStyle.transform : null
      };
    })()`);
    console.log('Article page state after click:', postStateAfterClick);

    if (!postStateAfterClick.h1 || !postStateAfterClick.h1.includes('Why Every Real Estate Agent Needs a Website in 2026')) {
      throw new Error(`TEST 5 FAILED: Expected article title to include 'Why Every Real Estate Agent Needs a Website in 2026', got '${postStateAfterClick.h1}'`);
    }
    if (postStateAfterClick.paragraphCount < 4) {
      throw new Error(`TEST 5 FAILED: Expected at least 4 paragraphs, got ${postStateAfterClick.paragraphCount}`);
    }
    console.log('✅ TEST 5 PASSED: Clicking 13th post card successfully routed to article with full authentic Framer layout and content!');

    // ----------------------------------------------------
    // TEST 6: Direct Visit to 13th Post URL
    // ----------------------------------------------------
    console.log('\n--- TEST 6: Direct Visit to http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026 ---');
    await cdp.navigate('http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026');
    await sleep(4000);

    const test6 = await cdp.evaluate(`(() => {
      const h1 = document.querySelector('h1')?.innerText;
      const author = document.getElementById('article-author')?.innerText;
      const date = document.getElementById('article-date')?.innerText;
      const cover = document.getElementById('article-cover-img')?.getAttribute('src');
      const excerpt = document.getElementById('article-excerpt')?.innerText;
      const paragraphs = Array.from(document.querySelectorAll('#article-body-content p')).map(p => p.innerText.trim()).filter(Boolean);
      const headingWrapper = document.querySelector('.framer-1ekua6s');
      const hwStyle = headingWrapper ? window.getComputedStyle(headingWrapper) : null;
      const appearOverrides = Array.from(document.styleSheets).flatMap(s => {
        try { return Array.from(s.cssRules).filter(r => r.selectorText && r.selectorText.includes('data-framer-appear-id')); }
        catch(e) { return []; }
      }).map(r => r.cssText);
      return {
        h1,
        author,
        date,
        cover,
        excerpt,
        paragraphCount: paragraphs.length,
        paragraphs,
        headingOpacity: hwStyle ? hwStyle.opacity : null,
        headingTransform: hwStyle ? hwStyle.transform : null,
        appearOverrides
      };
    })()`);
    console.log('Direct visit details:');
    console.log(`  Title: ${test6.h1}`);
    console.log(`  Author: ${test6.author}`);
    console.log(`  Date: ${test6.date}`);
    console.log(`  Cover: ${test6.cover}`);
    console.log(`  Paragraph count: ${test6.paragraphCount}`);
    console.log(`  Heading wrapper opacity: ${test6.headingOpacity}, transform: ${test6.headingTransform}`);
    console.log(`  Appear overrides in CSS:`, test6.appearOverrides);

    if (!test6.h1 || !test6.h1.includes('Why Every Real Estate Agent Needs a Website in 2026')) {
      throw new Error(`TEST 6 FAILED: Direct visit title incorrect: ${test6.h1}`);
    }
    if (test6.paragraphCount !== 4) {
      throw new Error(`TEST 6 FAILED: Expected 4 paragraphs, got ${test6.paragraphCount}`);
    }
    if (test6.appearOverrides.length > 0) {
      throw new Error(`TEST 6 FAILED: [data-framer-appear-id] override rule still present: ${test6.appearOverrides}`);
    }
    await cdp.captureScreenshot('scratch/cdp_test6_13th_article_desktop.png');
    console.log('✅ TEST 6 PASSED: Direct visit renders complete authentic Framer design with no appear suppression!');

    // ----------------------------------------------------
    // TEST 7: Existing Articles Regression Test
    // ----------------------------------------------------
    console.log('\n--- TEST 7: Existing Articles Regression Checks ---');
    
    // Check article 1: custom-vs-off-the-shelf-choose-wisely
    await cdp.navigate('http://localhost:8088/blog/custom-vs-off-the-shelf-choose-wisely');
    await sleep(3500);
    const regArticle1 = await cdp.evaluate(`(() => {
      const h1 = document.querySelector('h1')?.innerText;
      const paragraphs = Array.from(document.querySelectorAll('#article-body-content p, .framer-3x2kfl p')).length;
      return { h1, paragraphs };
    })()`);
    console.log('Article 1 (custom-vs-off-the-shelf):', regArticle1);
    if (!regArticle1.h1 || regArticle1.paragraphs < 5) {
      throw new Error(`TEST 7 FAILED on custom-vs-off-the-shelf: ${JSON.stringify(regArticle1)}`);
    }

    // Check article 2: idx-listings-not-showing-google
    await cdp.navigate('http://localhost:8088/blog/idx-listings-not-showing-google');
    await sleep(3500);
    const regArticle2 = await cdp.evaluate(`(() => {
      const h1 = document.querySelector('h1')?.innerText;
      const paragraphs = Array.from(document.querySelectorAll('#article-body-content p, .framer-3x2kfl p')).length;
      return { h1, paragraphs };
    })()`);
    console.log('Article 2 (idx-listings):', regArticle2);
    if (!regArticle2.h1 || regArticle2.paragraphs < 5) {
      throw new Error(`TEST 7 FAILED on idx-listings-not-showing-google: ${JSON.stringify(regArticle2)}`);
    }

    // Check article 3: real-estate-agent-website-cost-2026
    await cdp.navigate('http://localhost:8088/blog/real-estate-agent-website-cost-2026');
    await sleep(3500);
    const regArticle3 = await cdp.evaluate(`(() => {
      const h1 = document.querySelector('h1')?.innerText;
      const paragraphs = Array.from(document.querySelectorAll('#article-body-content p, .framer-3x2kfl p')).length;
      return { h1, paragraphs };
    })()`);
    console.log('Article 3 (cost):', regArticle3);
    if (!regArticle3.h1 || regArticle3.paragraphs < 5) {
      throw new Error(`TEST 7 FAILED on real-estate-agent-website-cost-2026: ${JSON.stringify(regArticle3)}`);
    }

    console.log('✅ TEST 7 PASSED: Zero regressions on existing articles!');

    // Capture screenshot of /blog/ for visual verification
    await cdp.navigate('http://localhost:8088/blog/');
    await sleep(5500);
    await cdp.captureScreenshot('scratch/cdp_blog_listing_13_posts.png');
    console.log('Saved listing screenshot to scratch/cdp_blog_listing_13_posts.png');

    console.log('\n======================================================');
    console.log('🎉 ALL CDP TESTS PASSED WITH 100% SUCCESS!');
    console.log('======================================================');

  } finally {
    await cdp.stop();
    console.log('Chrome CDP stopped.');
  }
}

run().catch(err => {
  console.error('\n❌ CDP TEST SUITE ERROR:', err);
  process.exit(1);
});
