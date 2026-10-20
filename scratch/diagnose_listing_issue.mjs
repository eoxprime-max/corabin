import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function testListing() {
  const cdp = new ChromeCDP(9580);
  await cdp.start();

  console.log('--- TEST 1: Open /blog/ with cache enabled (normal visit) ---');
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: false });

  const networkRequests = [];
  const consoleMessages = [];

  const listener = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Network.requestWillBeSent') {
        networkRequests.push({
          url: msg.params.request.url,
          initiator: msg.params.initiator?.type
        });
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        consoleMessages.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
    } catch (e) {}
  };

  cdp.ws.addEventListener('message', listener);

  // Navigate to /blog/
  await cdp.navigate('http://localhost:8088/blog/');
  // Wait 1.5 seconds for normal load
  await new Promise(r => setTimeout(r, 1500));

  const evaluation1 = await cdp.evaluate(`(() => {
    const featCards = Array.from(document.querySelectorAll('.framer-ugj76m .framer-1fa5qs8, .framer-3lukgt .framer-1fa5qs8')).filter(el => {
      return el.offsetParent !== null || getComputedStyle(el).display !== 'none';
    });
    const featHrefs = featCards.map(a => a.getAttribute('href'));
    const regCards = Array.from(document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container'));
    const regHrefs = regCards.map(c => c.querySelector('a')?.getAttribute('href'));
    return {
      featCount: featHrefs.length,
      featHrefs,
      regCount: regHrefs.length,
      regHrefs,
      totalCount: featHrefs.length + regHrefs.length
    };
  })()`);

  console.log('Evaluation 1 (normal load):', evaluation1);
  console.log('Console messages:', consoleMessages);
  console.log('Supabase requests in Test 1:', networkRequests.filter(r => r.url.includes('supabase')));

  console.log('\n--- TEST 2: Hard reload /blog/ (cache disabled) ---');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 1500));

  const evaluation2 = await cdp.evaluate(`(() => {
    const featCards = Array.from(document.querySelectorAll('.framer-ugj76m .framer-1fa5qs8, .framer-3lukgt .framer-1fa5qs8')).filter(el => {
      return el.offsetParent !== null || getComputedStyle(el).display !== 'none';
    });
    const featHrefs = featCards.map(a => a.getAttribute('href'));
    const regCards = Array.from(document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container'));
    const regHrefs = regCards.map(c => c.querySelector('a')?.getAttribute('href'));
    return {
      featCount: featHrefs.length,
      featHrefs,
      regCount: regHrefs.length,
      regHrefs,
      totalCount: featHrefs.length + regHrefs.length
    };
  })()`);

  console.log('Evaluation 2 (hard reload):', evaluation2);

  await cdp.close();
}

testListing().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
