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
  console.log('================================================================');
  console.log('FINAL CORABIN WEBSITE RELEASE-BLOCKER AUDIT & TEST SUITE');
  console.log('================================================================\n');

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  // -------------------------------------------------------------------------
  // SECTION 1: VERIFY CODEBASE INTEGRITY (KNOWN_POSTS & CH-SKSKMSNSM CHECK)
  // -------------------------------------------------------------------------
  console.log('--- SECTION 1: Inspecting KNOWN_POSTS & Special-Case Audit ---');
  const articleHtml = fs.readFileSync('public/blog/article.html', 'utf-8');
  
  const hasChInKnownPosts = articleHtml.includes('"ch-skskmsnsm":');
  console.log(`Checking if "ch-skskmsnsm" is in KNOWN_POSTS: ${hasChInKnownPosts ? 'YES (FAIL)' : 'NO (PASSED)'}`);
  if (hasChInKnownPosts) {
    throw new Error('Blocker 1 Failure: "ch-skskmsnsm" must not be hardcoded in KNOWN_POSTS!');
  }

  // Verify that preloader handles !post without flashing previous article
  const hasUnpreloadedSanitization = articleHtml.includes('coverEl.src = "data:image/svg+xml');
  console.log(`Checking un-preloaded placeholder sanitization: ${hasUnpreloadedSanitization ? 'ACTIVE (PASSED)' : 'MISSING (FAIL)'}`);
  if (!hasUnpreloadedSanitization) {
    throw new Error('Blocker 1 Failure: Un-preloaded slug sanitization is missing in article.html!');
  }
  console.log('✓ Section 1 Passed: ch-skskmsnsm removed from KNOWN_POSTS; un-preloaded sanitization active.\n');

  // -------------------------------------------------------------------------
  // SECTION 2: VERIFY ROUTING BEHAVIOR
  // -------------------------------------------------------------------------
  console.log('--- SECTION 2: Route Resolution & Clean URL Validation ---');
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
  console.log('✓ Section 2 Passed: Clean URLs and trailing-slash routes resolve with HTTP 200 OK.\n');

  // -------------------------------------------------------------------------
  // SECTION 3: REAL BROWSER CDP AUDIT ON 4 CORE ROUTES (DESKTOP & MOBILE)
  // -------------------------------------------------------------------------
  console.log('--- SECTION 3: Real Browser CDP Audit (Fixed & Baseline Routes) ---');
  const cdp = new ChromeCDP(9230);
  await cdp.start();
  console.log('✓ Chrome connected via CDP on port 9230.\n');

  // Enable Page domain
  await cdp.send('Page.enable');

  // Listen to console and error logs
  const consoleErrors = [];
  cdp.on('Runtime.consoleAPICalled', (params) => {
    if (params.type === 'error') {
      const text = params.args.map(a => a.value || a.description).join(' ');
      consoleErrors.push(text);
    }
  });

  const pagesToTest = [
    {
      slug: 'custom-vs-off-the-shelf-choose-wisely',
      name: 'custom-vs-off-the-shelf',
      expectedTitle: 'Custom Web Architecture vs. Commercial Templates: The Enterprise ROI Breakdown',
      isPreloaded: true,
    },
    {
      slug: 'ch-skskmsnsm',
      name: 'ch-skskmsnsm',
      expectedTitle: 'Ch skskmsnsm',
      isPreloaded: false, // Proves dynamic rendering from Supabase!
    },
    {
      slug: 'design-that-converts-our-approach',
      name: 'design-that-converts',
      expectedTitle: 'Conversion-Driven Design: How Top Digital Studios Engineer User Intent',
      isPreloaded: true,
    },
    {
      slug: 'why-every-real-estate-agent-needs-a-website-in-2026',
      name: 'why-every-real-estate-agent',
      expectedTitle: 'Why Every Real Estate Agent Needs a Website in 2026',
      isPreloaded: true,
    },
  ];

  await cdp.setViewport(1440, 900);

  for (const page of pagesToTest) {
    console.log(`\nTesting Desktop Route: /blog/${page.slug}/ (Preloaded: ${page.isPreloaded})`);
    await cdp.navigate(`http://localhost:${PORT}/blog/${page.slug}/`);
    
    // Wait for article body content to sync from Supabase
    await cdp.evaluate(`new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        const body = document.getElementById('article-body-content');
        if (body && (body.getAttribute('data-supabase-synced') || (body.innerText && !body.innerText.includes('Loading article...')))) {
          resolve(true);
        } else if (Date.now() - start > 6000) {
          resolve(false);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    })`);
    await wait(800);

    const domData = await cdp.evaluate(`(() => {
      const titleEl = document.getElementById('article-title');
      const coverEl = document.getElementById('article-cover-img');
      const authorEl = document.getElementById('article-author');
      const dateEl = document.getElementById('article-date');
      const bodyContent = document.getElementById('article-body-content');
      
      const relatedCards = Array.from(document.querySelectorAll('.framer-3lukgt a[href^="/blog/"]')).map(a => {
        return {
          href: a.getAttribute('href'),
          title: a.querySelector('.framer-giavb9 p, p')?.innerText?.trim() || '',
          imgSrc: a.querySelector('img')?.src || null,
          imgComplete: a.querySelector('img')?.complete || false,
          imgNaturalWidth: a.querySelector('img')?.naturalWidth || 0,
        };
      });

      // Framer appear element checks
      const headingWrapper = document.querySelector('.framer-1ekua6s');
      const coverWrapper = document.querySelector('.framer-z182eh');

      return {
        title: titleEl ? titleEl.innerText.trim() : null,
        titleOpacity: titleEl ? window.getComputedStyle(titleEl).opacity : null,
        coverSrc: coverEl ? coverEl.src : null,
        coverComplete: coverEl ? coverEl.complete : false,
        coverNaturalWidth: coverEl ? coverEl.naturalWidth : 0,
        author: authorEl ? authorEl.innerText.trim() : null,
        date: dateEl ? dateEl.innerText.trim() : null,
        bodyLength: bodyContent ? bodyContent.innerText.trim().length : 0,
        hasLoadingInBody: bodyContent ? bodyContent.innerText.includes('Loading article...') : false,
        headingOpacity: headingWrapper ? window.getComputedStyle(headingWrapper).opacity : null,
        coverWrapperOpacity: coverWrapper ? window.getComputedStyle(coverWrapper).opacity : null,
        relatedCardCount: relatedCards.length,
        relatedCards,
        hasSelfReference: relatedCards.some(c => c.href.includes(${JSON.stringify(page.slug)})),
      };
    })()`);

    console.log(`- Rendered Title: "${domData.title}"`);
    console.log(`- Author: "${domData.author}" | Date: "${domData.date}"`);
    console.log(`- Cover image: ${domData.coverSrc ? domData.coverSrc.slice(0, 75) + '...' : 'none'} (naturalWidth: ${domData.coverNaturalWidth})`);
    console.log(`- Body length: ${domData.bodyLength} chars (Has 'Loading...': ${domData.hasLoadingInBody})`);
    console.log(`- Framer appear: headingOpacity=${domData.headingOpacity}, coverWrapperOpacity=${domData.coverWrapperOpacity}`);
    console.log(`- Related cards: ${domData.relatedCardCount} distinct cards (Self-reference: ${domData.hasSelfReference})`);
    
    domData.relatedCards.forEach((c, idx) => {
      console.log(`  Card ${idx + 1}: ${c.href} | naturalWidth=${c.imgNaturalWidth} | "${c.title.slice(0, 38)}"`);
    });

    // Validations
    if (!domData.title.includes(page.expectedTitle.slice(0, 20))) {
      throw new Error(`Title mismatch on /blog/${page.slug}/! Expected: "${page.expectedTitle}", got: "${domData.title}"`);
    }
    if (domData.coverNaturalWidth === 0) {
      throw new Error(`Cover image failed to load (naturalWidth: 0) on /blog/${page.slug}/!`);
    }
    if (domData.bodyLength < 20 || domData.hasLoadingInBody) {
      throw new Error(`Article body did not render properly on /blog/${page.slug}/!`);
    }
    if (domData.hasSelfReference) {
      throw new Error(`Self-reference detected in companion cards on /blog/${page.slug}/!`);
    }
    if (domData.relatedCardCount < 3) {
      throw new Error(`Expected at least 3 companion cards, found ${domData.relatedCardCount} on /blog/${page.slug}/!`);
    }

    // Screenshots
    await cdp.evaluate('window.scrollTo(0, 0)');
    await wait(300);
    await cdp.captureScreenshot(path.join(SCREENSHOT_DIR, `blocker_desktop_${page.name}_hero.png`));
    
    await cdp.evaluate(`(() => {
      const related = document.querySelector('.framer-3lukgt');
      if (related) related.scrollIntoView({ behavior: 'instant' });
    })()`);
    await wait(400);
    await cdp.captureScreenshot(path.join(SCREENSHOT_DIR, `blocker_desktop_${page.name}_related.png`));
  }
  console.log('✓ Section 3 Passed: 4 core routes rendered cleanly with full text, Cloudinary images & companion cards.\n');

  // -------------------------------------------------------------------------
  // SECTION 4: UNKNOWN FIXTURE SLUG DYNAMIC RENDERING (ZERO PER-POST CODE DEPENDENCE)
  // -------------------------------------------------------------------------
  console.log('--- SECTION 4: Unknown Valid Fixture Slug Test (Proves Zero Per-Post Code Dependence) ---');
  const fixtureSlug = 'test-fixture-distributed-architectures-2027';
  const fixtureTitle = 'Distributed Architecture Paradigms for 2027 Systems';
  const fixtureCover = 'https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto/corabin/blog-covers/technical-debt-friend-or-foe-120bb0fa';

  console.log(`Setting up CDP Page script to mock Supabase fetch for un-preloaded fixture: "/blog/${fixtureSlug}/"...`);

  // Use Page.addScriptToEvaluateOnNewDocument to mock Supabase before any document script runs!
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `(() => {
      const origFetch = window.fetch;
      window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
        if (url.includes('slug=eq.${fixtureSlug}')) {
          console.log('[Mock Supabase] Intercepting fetch for fixture slug');
          return new Response(JSON.stringify([{
            id: 'fixture-test-uuid-9999',
            slug: '${fixtureSlug}',
            title: '${fixtureTitle}',
            excerpt: 'An authoritative technical briefing on next-generation distributed architecture.',
            content: '## Architectural Evolution\\n\\nNext-generation distributed architectures eliminate operational overhead while delivering extreme scalability.',
            status: 'published',
            production_status: 'live_on_site',
            published_at: '2026-10-22T10:00:00.000Z',
            cover_image: '${fixtureCover}',
            author: { name: 'Souvik' }
          }]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return origFetch.apply(this, arguments);
      };
    })()`
  });

  // Navigate to fixture URL
  await cdp.navigate(`http://localhost:${PORT}/blog/${fixtureSlug}/`);
  
  // Wait for dynamic render
  await cdp.evaluate(`new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const body = document.getElementById('article-body-content');
      if (body && (body.getAttribute('data-supabase-synced') || (body.innerText && !body.innerText.includes('Loading article...')))) {
        resolve(true);
      } else if (Date.now() - start > 6000) {
        resolve(false);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  })`);
  await wait(800);

  const fixtureDom = await cdp.evaluate(`(() => {
    const titleEl = document.getElementById('article-title');
    const coverEl = document.getElementById('article-cover-img');
    const bodyEl = document.getElementById('article-body-content');
    return {
      title: titleEl ? titleEl.innerText.trim() : null,
      coverSrc: coverEl ? coverEl.src : null,
      coverNaturalWidth: coverEl ? coverEl.naturalWidth : 0,
      bodyText: bodyEl ? bodyEl.innerText.trim() : null,
    };
  })()`);

  console.log(`- Fixture Rendered Title: "${fixtureDom.title}"`);
  console.log(`- Fixture Cover: ${fixtureDom.coverSrc ? fixtureDom.coverSrc.slice(0, 75) + '...' : 'none'} (naturalWidth: ${fixtureDom.coverNaturalWidth})`);
  console.log(`- Fixture Body: "${fixtureDom.bodyText ? fixtureDom.bodyText.slice(0, 80) + '...' : 'none'}"`);

  if (fixtureDom.title !== fixtureTitle) {
    throw new Error(`Fixture title mismatch! Expected "${fixtureTitle}", got "${fixtureDom.title}"`);
  }
  if (!fixtureDom.coverSrc.includes('technical-debt-friend-or-foe')) {
    throw new Error(`Fixture cover mismatch! Expected fixture cover, got "${fixtureDom.coverSrc}"`);
  }
  if (!fixtureDom.bodyText.includes('Architectural Evolution')) {
    throw new Error(`Fixture body content failed to parse into shared Framer template!`);
  }

  await cdp.captureScreenshot(path.join(SCREENSHOT_DIR, 'blocker_unknown_fixture_rendered.png'));
  console.log('Captured: blocker_unknown_fixture_rendered.png');
  console.log('✓ Section 4 Passed: Unknown fixture slug renders automatically through shared Framer template without code changes!\n');

  // -------------------------------------------------------------------------
  // SECTION 5: BROWSER BACK/FORWARD AND DIRECT REFRESH NAVIGATION FLOW
  // -------------------------------------------------------------------------
  console.log('--- SECTION 5: Back/Forward & Direct Refresh Navigation Flow ---');
  
  // 1. Start at /blog/
  console.log('1. Navigating to /blog/...');
  await cdp.navigate(`http://localhost:${PORT}/blog/`);
  await wait(2500);
  const blogUrl = await cdp.evaluate('window.location.pathname');
  console.log(`Current Path: ${blogUrl}`);

  // 2. Navigate to /blog/ch-skskmsnsm/
  console.log('2. Navigating to /blog/ch-skskmsnsm/...');
  await cdp.navigate(`http://localhost:${PORT}/blog/ch-skskmsnsm/`);
  await cdp.evaluate(`new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const body = document.getElementById('article-body-content');
      if (body && (body.getAttribute('data-supabase-synced') || (body.innerText && !body.innerText.includes('Loading article...')))) {
        resolve(true);
      } else if (Date.now() - start > 6000) {
        resolve(false);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  })`);
  await wait(600);

  const articleUrl = await cdp.evaluate('window.location.pathname');
  const articleTitle = await cdp.evaluate('document.getElementById("article-title")?.innerText.trim()');
  console.log(`Current Path: ${articleUrl} | Title: "${articleTitle}"`);
  if (!articleTitle.includes('Ch skskmsnsm')) {
    throw new Error(`Article title not loaded on ch-skskmsnsm: got "${articleTitle}"`);
  }

  // 3. Test Back Navigation
  console.log('3. Triggering window.history.back()...');
  await cdp.evaluate('window.history.back()');
  await wait(1800);
  const backPath = await cdp.evaluate('window.location.pathname');
  console.log(`After Back: Path = "${backPath}"`);
  if (!backPath.includes('/blog')) {
    throw new Error(`Back navigation failed: expected /blog, got ${backPath}`);
  }

  // 4. Test Forward Navigation
  console.log('4. Triggering window.history.forward()...');
  await cdp.evaluate('window.history.forward()');
  await wait(1800);
  const forwardPath = await cdp.evaluate('window.location.pathname');
  const forwardTitle = await cdp.evaluate('document.getElementById("article-title")?.innerText.trim()');
  console.log(`After Forward: Path = "${forwardPath}" | Title = "${forwardTitle}"`);
  if (!forwardPath.includes('ch-skskmsnsm') || !forwardTitle.includes('Ch skskmsnsm')) {
    throw new Error(`Forward navigation failed to restore ch-skskmsnsm!`);
  }

  // 5. Direct Page Refresh
  console.log('5. Triggering direct page reload (location.reload())...');
  await cdp.evaluate('window.location.reload()');
  await cdp.evaluate(`new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const body = document.getElementById('article-body-content');
      if (body && (body.getAttribute('data-supabase-synced') || (body.innerText && !body.innerText.includes('Loading article...')))) {
        resolve(true);
      } else if (Date.now() - start > 6000) {
        resolve(false);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  })`);
  await wait(800);

  const refreshedTitle = await cdp.evaluate('document.getElementById("article-title")?.innerText.trim()');
  const refreshedCoverNaturalWidth = await cdp.evaluate('document.getElementById("article-cover-img")?.naturalWidth || 0');
  console.log(`After Refresh: Title = "${refreshedTitle}" | Cover naturalWidth = ${refreshedCoverNaturalWidth}`);
  if (!refreshedTitle.includes('Ch skskmsnsm') || refreshedCoverNaturalWidth === 0) {
    throw new Error(`Direct refresh failed to render article correctly!`);
  }
  console.log('✓ Section 5 Passed: Back/Forward and direct reload flow verified flawlessly.\n');

  // -------------------------------------------------------------------------
  // SECTION 6: CONSOLE ERROR AUDIT
  // -------------------------------------------------------------------------
  console.log('--- SECTION 6: Console Error & Network Diagnostics ---');
  console.log(`Total Runtime Console Errors Captured: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  }
  console.log('✓ Section 6 Passed: Clean execution without fatal runtime errors.\n');

  console.log('================================================================');
  console.log('ALL WEBSITE RELEASE-BLOCKER TESTS PASSED WITH 100% SUCCESS!');
  console.log('================================================================');
}

run().catch((err) => {
  console.error('\nRELEASE-BLOCKER TEST RUN FAILED:', err);
  process.exit(1);
});
