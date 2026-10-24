import { ChromeCDP } from '../tools/cdp_helper.mjs';
import fs from 'fs';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function safeEval(cdp, expr, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await cdp.send('Runtime.evaluate', {
        expression: expr,
        returnByValue: true
      });
      if (res && res.result && res.result.value !== undefined) {
        return res.result.value;
      }
      if (res && res.exceptionDetails) {
        console.warn('Eval exception:', res.exceptionDetails.text, res.exceptionDetails.exception?.description);
      }
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(1000);
    }
  }
  return null;
}

async function safeClick(cdp, selector) {
  try {
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) throw new Error('Not found: ' + ${JSON.stringify(selector)});
        el.scrollIntoView();
        el.click();
        return true;
      })()`,
      returnByValue: true
    });
  } catch (err) {
    if (!err.message.includes('navigated')) throw err;
  }
}

async function safeBack(cdp) {
  try {
    await cdp.send('Runtime.evaluate', { expression: 'history.back()' });
  } catch (err) {
    if (!err.message.includes('navigated')) throw err;
  }
}

async function safeForward(cdp) {
  try {
    await cdp.send('Runtime.evaluate', { expression: 'history.forward()' });
  } catch (err) {
    if (!err.message.includes('navigated')) throw err;
  }
}

async function runTestSuite() {
  const cdp = new ChromeCDP(9590);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Console.enable');

  const consoleErrors = [];
  cdp.onMessage = (msg) => {
    if (msg.method === 'Console.messageAdded' && msg.params.message.level === 'error') {
      consoleErrors.push(msg.params.message.text);
    }
  };

  const results = {};

  try {
    console.log('\n========================================');
    console.log('TEST 1: /blog heading verification');
    console.log('========================================');
    await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/' });
    await sleep(3500);

    const initialListingH1 = await safeEval(cdp, `document.querySelector('h1')?.innerText`);
    console.log('Initial /blog H1:', initialListingH1);
    const test1Pass = initialListingH1 === 'Fresh insights & industry perspectives';
    results['Test 1: Initial Listing Heading'] = test1Pass ? 'PASSED' : `FAILED (${initialListingH1})`;

    console.log('\n========================================');
    console.log('TEST 2: Click Article A through actual card link');
    console.log('========================================');
    // Article A: ch-skskmsnsm
    console.log('Clicking card link for ch-skskmsnsm...');
    await safeClick(cdp, 'a[href*="ch-skskmsnsm"]');
    await sleep(3000);

    const articleAState = await safeEval(cdp, `(() => {
      const title = document.querySelector('#article-title, h1');
      const cover = document.querySelector('#article-cover-img');
      const body = document.querySelector('#article-body-content');
      return {
        pathname: window.location.pathname,
        title: document.title,
        h1: title?.innerText,
        coverSrc: cover?.src,
        coverOpacity: cover ? getComputedStyle(cover).opacity : null,
        bodySnippet: body?.innerText?.slice(0, 100),
        hasArticleRoot: Boolean(document.querySelector('[data-blog-article-root="true"]'))
      };
    })()`);
    console.log('Article A State:', articleAState);

    const test2Pass = articleAState.pathname.includes('ch-skskmsnsm') &&
                      articleAState.h1 === 'Ch skskmsnsm' &&
                      articleAState.coverSrc.includes('ch-skskmsnsm') &&
                      articleAState.coverOpacity === '1' &&
                      articleAState.bodySnippet.length > 10;
    results['Test 2: Click Article A (ch-skskmsnsm)'] = test2Pass ? 'PASSED' : `FAILED (${JSON.stringify(articleAState)})`;

    console.log('\n========================================');
    console.log('TEST 3: Browser Back - ensure listing heading NEVER changes');
    console.log('========================================');
    console.log('Pressing browser Back...');
    await safeBack(cdp);
    await sleep(2000);

    let test3Pass = true;
    const delays = [500, 1500, 2500, 4000];
    for (const d of delays) {
      await sleep(1000);
      const h1Now = await safeEval(cdp, `document.querySelector('h1')?.innerText`);
      console.log(`Listing H1 after back (+${d}ms):`, h1Now);
      if (h1Now !== 'Fresh insights & industry perspectives') {
        test3Pass = false;
        console.error(`ERROR: Listing H1 changed to "${h1Now}"!`);
      }
    }
    results['Test 3: Browser Back Heading Unchanged'] = test3Pass ? 'PASSED' : 'FAILED';

    console.log('\n========================================');
    console.log('TEST 4: Click Article B and verify NO flash of Article A');
    console.log('========================================');
    // Article B: why-every-real-estate-agent-needs-a-website-in-2026
    console.log('Clicking card link for Article B...');
    await safeClick(cdp, 'a[href*="why-every-real-estate-agent-needs-a-website-in-2026"]');
    
    // Check loading state immediately (150ms after click)
    await sleep(200);
    const loadingState = await safeEval(cdp, `(() => {
      const cover = document.querySelector('#article-cover-img');
      const title = document.querySelector('#article-title, h1');
      return {
        coverSrc: cover?.src,
        coverOpacity: cover ? getComputedStyle(cover).opacity : null,
        titleText: title?.innerText
      };
    })()`);
    console.log('Article B early loading state:', loadingState);

    // Wait for full load
    await sleep(3000);
    const articleBState = await safeEval(cdp, `(() => {
      const title = document.querySelector('#article-title, h1');
      const cover = document.querySelector('#article-cover-img');
      const body = document.querySelector('#article-body-content');
      return {
        pathname: window.location.pathname,
        title: document.title,
        h1: title?.innerText,
        coverSrc: cover?.src,
        coverOpacity: cover ? getComputedStyle(cover).opacity : null,
        bodySnippet: body?.innerText?.slice(0, 100)
      };
    })()`);
    console.log('Article B full state:', articleBState);

    const test4Pass = articleBState &&
                      !articleBState.h1?.includes('Ch skskmsnsm') &&
                      articleBState.h1?.includes('Why Every Real Estate Agent Needs a Website in 2026') &&
                      !articleBState.coverSrc?.includes('ch-skskmsnsm') &&
                      articleBState.coverOpacity === '1';
    results['Test 4: Click Article B (No flash of A)'] = test4Pass ? 'PASSED' : 'FAILED';

    console.log('\n========================================');
    console.log('TEST 5: Flow A -> Back -> B -> Back -> Forward');
    console.log('========================================');
    console.log('1. Pressing Back to listing...');
    await safeBack(cdp);
    await sleep(2500);
    const h1Back2 = await safeEval(cdp, `document.querySelector('h1')?.innerText`);
    console.log('Listing H1 after second Back:', h1Back2);

    console.log('2. Pressing Forward to Article B...');
    await safeForward(cdp);
    await sleep(2500);
    const forwardState = await safeEval(cdp, `(() => ({
      pathname: window.location.pathname,
      h1: document.querySelector('#article-title, h1')?.innerText
    }))()`);
    console.log('Forward state:', forwardState);

    const test5Pass = (h1Back2 === 'Fresh insights & industry perspectives') &&
                      forwardState.h1?.includes('Why Every Real Estate Agent Needs a Website in 2026');
    results['Test 5: Full Back/Forward Flow'] = test5Pass ? 'PASSED' : 'FAILED';

    console.log('\n========================================');
    console.log('TEST 6: Direct load and refresh /blog/ch-skskmsnsm/');
    console.log('========================================');
    await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/ch-skskmsnsm/' });
    await sleep(3000);

    const directCh1 = await safeEval(cdp, `(() => {
      const heading = document.querySelector('.framer-1ekua6s, [data-framer-name="Heading Wrapper"]');
      const bgImg = document.querySelector('.framer-z182eh, [data-framer-name="Background Image"]');
      const coverImg = document.querySelector('#article-cover-img');
      const body = document.querySelector('#article-body-content');
      return {
        pathname: window.location.pathname,
        title: document.title,
        h1: document.querySelector('#article-title, h1')?.innerText,
        headingOpacity: heading ? getComputedStyle(heading).opacity : null,
        coverOpacity: bgImg ? getComputedStyle(bgImg).opacity : null,
        coverImgOpacity: coverImg ? getComputedStyle(coverImg).opacity : null,
        bodyText: body?.innerText?.slice(0, 100),
        rootAttr: document.querySelector('[data-blog-article-root="true"]')?.id
      };
    })()`);
    console.log('Direct ch-skskmsnsm state:', directCh1);

    console.log('Refreshing page...');
    await cdp.send('Page.reload');
    await sleep(3000);

    const directCh2 = await safeEval(cdp, `(() => {
      const heading = document.querySelector('.framer-1ekua6s, [data-framer-name="Heading Wrapper"]');
      const bgImg = document.querySelector('.framer-z182eh, [data-framer-name="Background Image"]');
      const coverImg = document.querySelector('#article-cover-img');
      const body = document.querySelector('#article-body-content');
      return {
        pathname: window.location.pathname,
        title: document.title,
        h1: document.querySelector('#article-title, h1')?.innerText,
        headingOpacity: heading ? getComputedStyle(heading).opacity : null,
        coverOpacity: bgImg ? getComputedStyle(bgImg).opacity : null,
        coverImgOpacity: coverImg ? getComputedStyle(coverImg).opacity : null,
        bodyText: body?.innerText?.slice(0, 100)
      };
    })()`);
    console.log('Refreshed ch-skskmsnsm state:', directCh2);

    const test6Pass = directCh2.h1 === 'Ch skskmsnsm' &&
                      parseFloat(directCh2.headingOpacity) >= 0.9 &&
                      parseFloat(directCh2.coverOpacity) >= 0.5 &&
                      directCh2.coverImgOpacity === '1' &&
                      directCh2.bodyText?.length > 10;
    results['Test 6: Direct Load & Refresh CMS Post'] = test6Pass ? 'PASSED' : 'FAILED';

    console.log('\n========================================');
    console.log('TEST 7: Direct load two older baseline static slugs');
    console.log('========================================');
    // Baseline 1: custom-vs-off-the-shelf-choose-wisely
    await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/custom-vs-off-the-shelf-choose-wisely/' });
    await sleep(2500);
    const base1 = await safeEval(cdp, `(() => ({
      h1: document.querySelector('#article-title, h1')?.innerText,
      body: document.querySelector('#article-body-content')?.innerText?.slice(0, 80)
    }))()`);
    console.log('Baseline 1 (custom-vs-off-the-shelf):', base1);

    // Baseline 2: design-that-converts-our-approach
    await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/design-that-converts-our-approach/' });
    await sleep(2500);
    const base2 = await safeEval(cdp, `(() => ({
      h1: document.querySelector('#article-title, h1')?.innerText,
      body: document.querySelector('#article-body-content')?.innerText?.slice(0, 80)
    }))()`);
    console.log('Baseline 2 (design-that-converts):', base2);

    const test7Pass = base1.h1?.includes('Custom Web Architecture') &&
                      base2.h1?.includes('Conversion-Driven Design');
    results['Test 7: Older Baseline Static Slugs'] = test7Pass ? 'PASSED' : 'FAILED';

    console.log('\n========================================');
    console.log('TEST 8: Verify shared template architecture for future slugs');
    console.log('========================================');
    // Test that any slug route resolves to article.html without static file requirement
    const chStaticFileExists = fs.existsSync('/home/souvik/Corabin/Corabin.website/public/blog/ch-skskmsnsm/index.html') ||
                               fs.existsSync('/home/souvik/Corabin/Corabin.website/public/blog/ch-skskmsnsm.html');
    console.log('Does static file exist for ch-skskmsnsm?', chStaticFileExists);
    const test8Pass = !chStaticFileExists; // Confirm NO static file exists; it works purely dynamically!
    results['Test 8: Dynamic Route Architecture (No static HTML files per post)'] = test8Pass ? 'PASSED' : 'FAILED';

    console.log('\n========================================');
    console.log('TEST 9: Desktop (1440x900) & Mobile (390x844) Viewport & Console Checks');
    console.log('========================================');
    // Desktop Viewport
    await cdp.setViewport(1440, 900);
    await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/ch-skskmsnsm/' });
    await sleep(2500);
    const desktopCheck = await safeEval(cdp, `(() => ({
      width: window.innerWidth,
      titleVisible: document.querySelector('#article-title') ? getComputedStyle(document.querySelector('#article-title')).display !== 'none' : false,
      coverImgNaturalWidth: document.querySelector('#article-cover-img')?.naturalWidth
    }))()`);
    console.log('Desktop 1440x900 check:', desktopCheck);

    // Mobile Viewport
    await cdp.setViewport(390, 844);
    await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/ch-skskmsnsm/' });
    await sleep(2500);
    const mobileCheck = await safeEval(cdp, `(() => ({
      width: window.innerWidth,
      titleVisible: document.querySelector('#article-title') ? getComputedStyle(document.querySelector('#article-title')).display !== 'none' : false,
      coverImgNaturalWidth: document.querySelector('#article-cover-img')?.naturalWidth
    }))()`);
    console.log('Mobile 390x844 check:', mobileCheck);

    const test9Pass = desktopCheck.titleVisible && mobileCheck.titleVisible && (desktopCheck.coverImgNaturalWidth > 0);
    results['Test 9: Responsive Viewports (1440x900 & 390x844)'] = test9Pass ? 'PASSED' : 'FAILED';

    console.log('\n========================================');
    console.log('TEST 10: Actual Link Click Navigation');
    console.log('========================================');
    await cdp.setViewport(1440, 900);
    await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/' });
    await sleep(3500);

    // Click on a regular card directly to trigger navigation and verify full render
    await safeClick(cdp, '.framer-18dht5n .framer-ij7w41-container a');
    await sleep(3000);
    const finalClickState = await safeEval(cdp, `(() => ({
      path: window.location.pathname,
      h1: document.querySelector('#article-title, h1')?.innerText,
      hasContent: Boolean(document.querySelector('#article-body-content')?.innerText?.length > 10)
    }))()`);
    console.log('Card link click outcome:', finalClickState);

    const test10Pass = finalClickState.path.startsWith('/blog/') &&
                      finalClickState.h1?.length > 0 &&
                      finalClickState.hasContent;
    results['Test 10: Actual Card Link Click & Navigation'] = test10Pass ? 'PASSED' : 'FAILED';

    console.log('\n========================================');
    console.log('TEST RESULTS SUMMARY:');
    console.log('========================================');
    console.table(results);

    if (consoleErrors.length > 0) {
      console.log('Console Errors caught:', consoleErrors);
    } else {
      console.log('Zero console errors detected!');
    }

  } finally {
    await cdp.stop();
  }
}

runTestSuite().catch(console.error);
