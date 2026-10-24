import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function test() {
  const cdp = new ChromeCDP(9596);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Console.enable');
  await cdp.send('Network.enable');

  const logs = [];
  const network = [];
  cdp.onMessage = (msg) => {
    if (msg.method === 'Console.messageAdded') logs.push(`[${msg.params.message.level}] ${msg.params.message.text}`);
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      logs.push(`[console.${msg.params.type}] ${text}`);
    }
    if (msg.method === 'Network.requestWillBeSent') {
      network.push(`REQ: ${msg.params.request.url}`);
    }
  };

  console.log('1. Navigating to /blog/');
  await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/' });
  // Wait 4 seconds for regular listing to fully sync
  await new Promise(r => setTimeout(r, 4000));

  console.log('2. Inspecting card links for ch-skskmsnsm...');
  const cardInfo = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container'));
      const chCard = cards.find(c => (c.getAttribute('data-post-slug') || c.querySelector('a')?.getAttribute('href') || '').includes('ch-skskmsnsm'));
      if (!chCard) return { error: 'chCard not found', totalCards: cards.length };
      const link = chCard.querySelector('a');
      return {
        slug: chCard.getAttribute('data-post-slug'),
        href: link?.getAttribute('href'),
        target: link?.getAttribute('target'),
        classes: link?.className
      };
    })()`,
    returnByValue: true
  });
  console.log('Card info:', cardInfo.result.value);

  console.log('3. Clicking card link for ch-skskmsnsm...');
  network.length = 0; // reset network
  const clickRes = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container'));
      const chCard = cards.find(c => (c.getAttribute('data-post-slug') || c.querySelector('a')?.getAttribute('href') || '').includes('ch-skskmsnsm'));
      const link = chCard?.querySelector('a');
      if (!link) return { error: 'no link' };
      link.click();
      return { clicked: true, newPath: window.location.pathname };
    })()`,
    returnByValue: true
  });
  console.log('Click result:', clickRes.result.value);

  // Wait 2.5 seconds after click
  await new Promise(r => setTimeout(r, 2500));

  const afterClick = await cdp.send('Runtime.evaluate', {
    expression: `(() => ({
      pathname: window.location.pathname,
      title: document.title,
      h1: document.querySelector('#article-title, h1')?.innerText,
      mainDataset: JSON.stringify(document.getElementById('main')?.dataset || {}),
      bodyText: document.querySelector('#article-body-content, .framer-1272rho')?.innerText?.slice(0, 150)
    }))()`,
    returnByValue: true
  });
  console.log('State after click:', JSON.stringify(afterClick.result.value, null, 2));

  console.log('Network after click (first 10):', network.slice(0, 10));
  if (logs.length > 0) console.log('Console Logs:\n', logs.slice(-10).join('\n'));

  console.log('4. Pressing history.back()...');
  await cdp.send('Runtime.evaluate', { expression: 'history.back()' });
  await new Promise(r => setTimeout(r, 2000));

  const afterBack = await cdp.send('Runtime.evaluate', {
    expression: `(() => ({
      pathname: window.location.pathname,
      h1: document.querySelector('h1')?.innerText,
      allH1s: Array.from(document.querySelectorAll('h1')).map(h => h.innerText)
    }))()`,
    returnByValue: true
  });
  console.log('State after back:', JSON.stringify(afterBack.result.value, null, 2));

  await cdp.stop();
}

test().catch(console.error);
