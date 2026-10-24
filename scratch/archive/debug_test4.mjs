import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function test() {
  const cdp = new ChromeCDP(9595);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Console.enable');

  cdp.onMessage = (msg) => {
    if (msg.method === 'Console.messageAdded') console.log('BROWSER:', msg.params.message.text);
    if (msg.method === 'Page.frameNavigated') console.log('NAVIGATED:', msg.params.frame.url);
  };

  await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/' });
  await new Promise(r => setTimeout(r, 3500));

  console.log('Finding Article B links on /blog/...');
  const links = await cdp.send('Runtime.evaluate', {
    expression: 'Array.from(document.querySelectorAll("a")).map(a => a.href).filter(h => h.includes("why-every-real-estate"))',
    returnByValue: true
  });
  console.log('Found links:', links.result.value);

  console.log('Clicking Article B link...');
  const clickRes = await cdp.send('Runtime.evaluate', {
    expression: '(() => { const a = document.querySelector(\'a[href*="why-every-real-estate"]\'); a.scrollIntoView(); a.click(); return { clicked: true, href: a.href }; })()',
    returnByValue: true
  });
  console.log('Click res:', clickRes.result.value);

  for (let i = 1; i <= 5; i++) {
    await new Promise(r => setTimeout(r, 1000));
    try {
      const state = await cdp.send('Runtime.evaluate', {
        expression: '(() => ({ path: location.pathname, title: document.title, h1: document.querySelector("#article-title, h1")?.innerText }))()',
        returnByValue: true
      });
      console.log(`After ${i}s:`, state.result?.value);
    } catch (e) {
      console.log(`After ${i}s error:`, e.message);
    }
  }

  await cdp.stop();
}

test().catch(console.error);
