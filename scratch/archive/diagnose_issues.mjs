import http from 'node:http';
import fs from 'node:fs';
import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function runDiagnostics() {
  console.log('--- Starting Real Browser Diagnostics ---');
  const cdp = new ChromeCDP(9580);
  await cdp.start();

  const consoleLogs = [];
  const networkRequests = [];

  await cdp.send('Page.enable');
  await cdp.send('Console.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');

  cdp.onMessage = (msg) => {
    if (msg.method === 'Console.messageAdded') {
      consoleLogs.push(`[${msg.params.message.level}] ${msg.params.message.text}`);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      consoleLogs.push(`[console.${msg.params.type}] ${text}`);
    }
    if (msg.method === 'Network.responseReceived') {
      networkRequests.push({
        url: msg.params.response.url,
        status: msg.params.response.status,
        fromDiskCache: msg.params.response.fromDiskCache,
        fromServiceWorker: msg.params.response.fromServiceWorker
      });
    }
  };

  async function getListingState() {
    const expr = `(() => {
      const featGrid = document.querySelector('.framer-ugj76m, .framer-3lukgt');
      const featCards = featGrid ? Array.from(featGrid.querySelectorAll('a.framer-7Bi9P')).filter(a => a.offsetParent !== null || getComputedStyle(a).display !== 'none') : [];
      const featSlugs = featCards.map(c => c.getAttribute('data-post-slug') || c.getAttribute('href'));
      
      const regContainer = document.querySelector('.framer-18dht5n');
      const regCards = regContainer ? Array.from(regContainer.querySelectorAll('.framer-ij7w41-container')) : [];
      const regSlugs = regCards.map(c => c.getAttribute('data-post-slug') || c.querySelector('a')?.getAttribute('href'));
      
      return {
        featCount: featCards.length,
        featSlugs,
        regCount: regCards.length,
        regSlugs,
        total: featCards.length + regCards.length,
        has13thInReg: regSlugs.some(s => s && s.includes('why-every-real-estate-agent-needs-a-website-in-2026')),
        has13thInFeat: featSlugs.some(s => s && s.includes('why-every-real-estate-agent-needs-a-website-in-2026'))
      };
    })()`;
    const res = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res.result.value;
  }

  // 1. Initial normal load of /blog/
  console.log('\n--- 1. Testing Normal Initial Load of /blog/ ---');
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await new Promise(r => setTimeout(r, 2500));
  const state1 = await getListingState();
  console.log('State 1 (Normal initial visit):', JSON.stringify(state1, null, 2));

  // 2. Refresh page normally
  console.log('\n--- 2. Testing Normal Reload of /blog/ ---');
  await cdp.send('Page.reload', { ignoreCache: false });
  await new Promise(r => setTimeout(r, 2500));
  const state2 = await getListingState();
  console.log('State 2 (Normal reload):', JSON.stringify(state2, null, 2));

  // 3. Hard Refresh (ignore cache)
  console.log('\n--- 3. Testing Hard Refresh (ignoreCache: true) of /blog/ ---');
  await cdp.send('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 2500));
  const state3 = await getListingState();
  console.log('State 3 (Hard refresh):', JSON.stringify(state3, null, 2));

  // 4. Re-open tab (navigate to about:blank, then navigate to /blog/)
  console.log('\n--- 4. Testing Re-opened Tab Navigation to /blog/ ---');
  await cdp.send('Page.navigate', { url: 'about:blank' });
  await new Promise(r => setTimeout(r, 500));
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await new Promise(r => setTimeout(r, 2500));
  const state4 = await getListingState();
  console.log('State 4 (Revisit / fresh tab):', JSON.stringify(state4, null, 2));

  // 5. Test Article 1: custom-vs-off-the-shelf-choose-wisely
  console.log('\n--- 5. Testing Article 1 (custom-vs-off-the-shelf-choose-wisely) ---');
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/custom-vs-off-the-shelf-choose-wisely' });
  await new Promise(r => setTimeout(r, 2500));
  const art1Expr = `(() => {
    return {
      title: document.title,
      h1: document.querySelector('#article-title, h1')?.innerText,
      author: document.querySelector('#article-author')?.innerText,
      date: document.querySelector('#article-date')?.innerText,
      coverSrc: document.querySelector('#article-cover-img')?.src,
      bodyChildrenCount: document.querySelector('#article-body-content')?.children?.length,
      bodyFirst100: document.querySelector('#article-body-content')?.innerText?.slice(0, 100),
      heroWrapperTransform: getComputedStyle(document.querySelector('.framer-1ekua6s') || document.body).transform,
      heroWrapperOpacity: getComputedStyle(document.querySelector('.framer-1ekua6s') || document.body).opacity,
      appearAnimations: document.querySelectorAll('style[data-framer-appear-id]').length
    };
  })()`;
  const art1State = await cdp.send('Runtime.evaluate', { expression: art1Expr, returnByValue: true });
  console.log('Article 1 State:', JSON.stringify(art1State.result.value, null, 2));

  // 6. Test Article 13: why-every-real-estate-agent-needs-a-website-in-2026
  console.log('\n--- 6. Testing Article 13 (why-every-real-estate-agent-needs-a-website-in-2026) ---');
  consoleLogs.length = 0; // reset console logs to see what happens on article 13
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026' });
  await new Promise(r => setTimeout(r, 2500));
  const art13State = await cdp.send('Runtime.evaluate', { expression: art1Expr, returnByValue: true });
  console.log('Article 13 State:', JSON.stringify(art13State.result.value, null, 2));
  console.log('Console logs on Article 13:', consoleLogs);

  // Take screenshots of both
  const screenshot1 = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/article_13.png', Buffer.from(screenshot1.data, 'base64'));
  console.log('Screenshot of Article 13 saved to scratch/article_13.png');

  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/custom-vs-off-the-shelf-choose-wisely' });
  await new Promise(r => setTimeout(r, 2000));
  const screenshot2 = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/article_1.png', Buffer.from(screenshot2.data, 'base64'));
  console.log('Screenshot of Article 1 saved to scratch/article_1.png');

  await cdp.stop();
  console.log('--- Diagnostics Completed ---');
}

runDiagnostics().catch(console.error);
