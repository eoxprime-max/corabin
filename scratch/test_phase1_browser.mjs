import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function testRoute(cdp, routeUrl, slugName) {
  console.log(`\n======================================================`);
  console.log(`Testing Route: ${routeUrl} (${slugName})`);
  console.log(`======================================================`);

  const consoleLogs = [];
  const consoleErrors = [];
  const networkRequests = [];

  // Listen to Console and Network via CDP
  cdp.ws.addEventListener('message', (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
        consoleLogs.push({ type: msg.params.type, text });
        if (msg.params.type === 'error') {
          consoleErrors.push(text);
        }
      } else if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
      } else if (msg.method === 'Network.requestWillBeSent') {
        networkRequests.push(msg.params.request.url);
      }
    } catch (e) {}
  });

  await cdp.send('Network.enable');
  await cdp.setViewport(1280, 800);

  const startTime = Date.now();
  console.log(`Navigating to ${routeUrl}...`);
  await cdp.navigate(routeUrl);

  // Poll for hydration and stability over 4 seconds
  let livePostPresent = false;
  let pageTitle = '';
  let heroHeading = '';
  let dateText = '';
  let authorText = '';
  let bodyContentSnippet = '';
  let framerRendered = false;

  for (let i = 0; i < 8; i++) {
    await new Promise(r => setTimeout(r, 500));
    const status = await cdp.evaluate(`(() => {
      const titleEl = document.querySelector('#article-title, .framer-1ltkmql h1, [data-framer-name="Heading Wrapper"] h1, #hero h1, h1.framer-text');
      const dateEl = document.querySelector('#article-date, .framer-ybkmy time, .framer-ybkmy p, [data-framer-name="Author Wrapper"] [data-framer-name="Date"] p, .framer-ybkmy');
      const authorEl = document.querySelector('#article-author, .framer-y7unnl p, [data-framer-name="Photo"] ~ div p');
      const bodyEl = document.querySelector('#article-body-content, .framer-1272rho, #content .framer-1272rho');
      const framerRoot = document.getElementById('main');

      return {
        hasLivePost: Boolean(window.__corabinLivePost),
        livePostTitle: window.__corabinLivePost ? window.__corabinLivePost.title : null,
        title: document.title,
        heading: titleEl ? titleEl.textContent.trim() : null,
        date: dateEl ? dateEl.textContent.trim() : null,
        author: authorEl ? authorEl.textContent.trim() : null,
        bodySnippet: bodyEl ? bodyEl.textContent.trim().slice(0, 150) : null,
        framerHydrated: Boolean(framerRoot && framerRoot.children.length > 0)
      };
    })()`);

    if (status) {
      livePostPresent = status.hasLivePost;
      pageTitle = status.title;
      heroHeading = status.heading;
      dateText = status.date;
      authorText = status.author;
      bodyContentSnippet = status.bodySnippet;
      framerRendered = status.framerHydrated;
    }
  }

  const durationMs = Date.now() - startTime;
  console.log(`Navigation & stabilization completed in ${durationMs}ms`);

  // Count Supabase REST requests
  const supabaseRequests = networkRequests.filter(url => url.includes('/rest/v1/posts'));
  console.log(`Supabase REST requests made: ${supabaseRequests.length}`);
  console.log(`Live Post in window.__corabinLivePost: ${livePostPresent}`);
  console.log(`Document Title: "${pageTitle}"`);
  console.log(`Hero Heading: "${heroHeading}"`);
  console.log(`Date Text: "${dateText}"`);
  console.log(`Author Text: "${authorText}"`);
  console.log(`Body Snippet: "${bodyContentSnippet}"`);
  console.log(`Console Errors (${consoleErrors.length}):`, consoleErrors);

  // Take a screenshot
  const screenshotPath = `screenshots/phase1_${slugName}.png`;
  await cdp.captureScreenshot(screenshotPath);
  console.log(`Screenshot saved to ${screenshotPath}`);

  return {
    routeUrl,
    durationMs,
    supabaseRequestsCount: supabaseRequests.length,
    livePostPresent,
    pageTitle,
    heroHeading,
    dateText,
    authorText,
    bodyContentSnippet,
    consoleErrors,
    screenshotPath
  };
}

async function run() {
  const cdp = new ChromeCDP(9333);
  try {
    await cdp.start();
    console.log('Chrome CDP started successfully on port 9333.');

    const res1 = await testRoute(cdp, 'http://localhost:8088/blog/real-estate-agent-website-cost-2026/', 'real_estate_agent_website_cost_2026');
    const res2 = await testRoute(cdp, 'http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026/', 'why_every_real_estate_agent_needs_a_website_in_2026');

    console.log('\n================ SUMMARY ================');
    console.log('Test 1 (Existing article):', res1.durationMs < 6000 && res1.supabaseRequestsCount <= 2 ? 'PASSED' : 'CHECK');
    console.log('Test 2 (New dynamic article):', res2.durationMs < 6000 && res2.supabaseRequestsCount <= 2 ? 'PASSED' : 'CHECK');
  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await cdp.stop();
  }
}

run();
