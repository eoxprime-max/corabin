import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function run() {
  const cdp = new ChromeCDP(9444);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');

  const logs = [];
  cdp.on('Runtime.consoleAPICalled', (params) => {
    logs.push(`[CONSOLE ${params.type}] ${params.args?.map(a => a.value || JSON.stringify(a)).join(' ')}`);
  });
  cdp.on('Log.entryAdded', (params) => {
    logs.push(`[LOG ${params.entry?.level}] ${params.entry?.text}`);
  });

  const failedRequests = [];
  cdp.on('Network.loadingFailed', (params) => {
    failedRequests.push(`[FAILED REQUEST] ${params.requestId} errorText: ${params.errorText} type: ${params.type}`);
  });
  cdp.on('Network.responseReceived', (params) => {
    if (params.response.status >= 400) {
      failedRequests.push(`[HTTP ${params.response.status}] ${params.response.url}`);
    }
  });

  console.log('=== TEST A: CLIENT-SIDE NAVIGATION (Blog Listing -> 13th Article) ===');
  await cdp.setViewport(1440, 900);
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await new Promise(r => setTimeout(r, 3000));

  // Find the link to 13th article
  const articleLinkExists = await cdp.evaluate(`(() => {
    const a = Array.from(document.querySelectorAll('a')).find(el => el.getAttribute('href')?.includes('why-every-real-estate-agent-needs-a-website-in-2026'));
    return !!a;
  })()`);
  console.log('Found 13th article link on /blog/:', articleLinkExists);

  // Click it
  console.log('Clicking 13th article link...');
  await cdp.evaluate(`(() => {
    const a = Array.from(document.querySelectorAll('a')).find(el => el.getAttribute('href')?.includes('why-every-real-estate-agent-needs-a-website-in-2026'));
    if (a) a.click();
  })()`);

  // Sample styles at 50ms, 150ms, 300ms, 600ms, 1200ms, 2000ms
  const intervals = [50, 100, 200, 400, 800, 1500];
  console.log('Sampling animation state over time after click:');
  for (const ms of intervals) {
    await new Promise(r => setTimeout(r, ms));
    const state = await cdp.evaluate(`(() => {
      const hero = document.querySelector('#hero, .framer-p85gyj, [data-framer-name="Hero Section"]');
      const title = document.querySelector('#article-title, .framer-1ltkmql, h1');
      const cover = document.querySelector('#article-cover-img, .framer-z182eh img, [data-framer-name="Background Image"] img');
      const bgWrapper = document.querySelector('.framer-z182eh, [data-framer-name="Background Image"]');
      const headingWrapper = document.querySelector('.framer-1ekua6s, [data-framer-name="Heading Wrapper"]');
      
      const getStyles = (el) => {
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        return {
          opacity: cs.opacity,
          transform: cs.transform,
          inlineOpacity: el.style.opacity,
          inlineTransform: el.style.transform,
          inlineWillChange: el.style.willChange
        };
      };

      return {
        url: window.location.pathname,
        headingWrapper: getStyles(headingWrapper),
        title: getStyles(title),
        bgWrapper: getStyles(bgWrapper),
        cover: cover ? {
          src: cover.src,
          currentSrc: cover.currentSrc,
          complete: cover.complete,
          naturalWidth: cover.naturalWidth,
          naturalHeight: cover.naturalHeight,
          styles: getStyles(cover)
        } : null
      };
    })()`);
    console.log(`[t+${ms}ms] URL: ${state.url}`);
    console.log(`  headingWrapper: ${JSON.stringify(state.headingWrapper)}`);
    console.log(`  bgWrapper: ${JSON.stringify(state.bgWrapper)}`);
    console.log(`  cover: src=${state.cover?.currentSrc?.substring(0, 80)} complete=${state.cover?.complete} dims=${state.cover?.naturalWidth}x${state.cover?.naturalHeight}`);
  }

  console.log('\n=== TEST B: DIRECT HARD RELOAD OF 13th ARTICLE ===');
  logs.length = 0;
  failedRequests.length = 0;
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026/' });
  // Force reload ignoring cache
  await cdp.send('Page.reload', { ignoreCache: true });

  console.log('Sampling animation state over time after hard reload:');
  for (const ms of intervals) {
    await new Promise(r => setTimeout(r, ms));
    const state = await cdp.evaluate(`(() => {
      const hero = document.querySelector('#hero, .framer-p85gyj, [data-framer-name="Hero Section"]');
      const title = document.querySelector('#article-title, .framer-1ltkmql, h1');
      const cover = document.querySelector('#article-cover-img, .framer-z182eh img, [data-framer-name="Background Image"] img');
      const bgWrapper = document.querySelector('.framer-z182eh, [data-framer-name="Background Image"]');
      const headingWrapper = document.querySelector('.framer-1ekua6s, [data-framer-name="Heading Wrapper"]');
      
      const getStyles = (el) => {
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        return {
          opacity: cs.opacity,
          transform: cs.transform,
          inlineOpacity: el.style.opacity,
          inlineTransform: el.style.transform,
          inlineWillChange: el.style.willChange
        };
      };

      return {
        url: window.location.pathname,
        headingWrapper: getStyles(headingWrapper),
        title: getStyles(title),
        bgWrapper: getStyles(bgWrapper),
        cover: cover ? {
          src: cover.src,
          currentSrc: cover.currentSrc,
          complete: cover.complete,
          naturalWidth: cover.naturalWidth,
          naturalHeight: cover.naturalHeight,
          styles: getStyles(cover)
        } : null,
        mainAttributes: document.getElementById('main') ? {
          blogSlug: document.getElementById('main').dataset.blogSlug,
          rendered: document.getElementById('main').dataset.rendered
        } : null
      };
    })()`);
    console.log(`[t+${ms}ms] URL: ${state.url}`);
    console.log(`  headingWrapper: ${JSON.stringify(state.headingWrapper)}`);
    console.log(`  bgWrapper: ${JSON.stringify(state.bgWrapper)}`);
    console.log(`  cover: src=${state.cover?.currentSrc?.substring(0, 80)} complete=${state.cover?.complete} dims=${state.cover?.naturalWidth}x${state.cover?.naturalHeight}`);
  }

  console.log('\nConsole logs during hard reload:');
  logs.forEach(l => console.log(' ', l));

  console.log('\nFailed requests during hard reload:');
  failedRequests.forEach(f => console.log(' ', f));

  await cdp.stop();
}

run().catch(console.error);
