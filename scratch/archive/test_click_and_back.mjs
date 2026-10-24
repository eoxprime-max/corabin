import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function test() {
  const cdp = new ChromeCDP(9594);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Console.enable');

  const logs = [];
  cdp.onMessage = (msg) => {
    if (msg.method === 'Console.messageAdded') logs.push(`[${msg.params.message.level}] ${msg.params.message.text}`);
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      logs.push(`[console.${msg.params.type}] ${text}`);
    }
  };

  console.log('1. Navigating to /blog/');
  await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/' });
  await new Promise(r => setTimeout(r, 2000));

  console.log('2. Finding card for ch-skskmsnsm and clicking it...');
  const clickRes = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const links = Array.from(document.querySelectorAll('a[href*="ch-skskmsnsm"]'));
      if (links.length === 0) return { error: 'No link found' };
      const link = links[0];
      link.scrollIntoView();
      link.click();
      return { clicked: true, href: link.getAttribute('href') };
    })()`,
    returnByValue: true
  });
  console.log('Click result:', clickRes.result.value);

  await new Promise(r => setTimeout(r, 2000));

  const afterClick = await cdp.send('Runtime.evaluate', {
    expression: `(() => ({
      pathname: window.location.pathname,
      title: document.title,
      h1: document.querySelector('#article-title, h1')?.innerText,
      mainId: document.getElementById('main')?.id,
      articleRoot: document.querySelector('[data-framer-name="Hero Section"], #hero')?.id
    }))()`,
    returnByValue: true
  });
  console.log('After click state:', afterClick.result.value);

  console.log('3. Pressing browser back...');
  await cdp.send('Runtime.evaluate', { expression: 'history.back()' });
  await new Promise(r => setTimeout(r, 1000));

  const afterBack = await cdp.send('Runtime.evaluate', {
    expression: `(() => ({
      pathname: window.location.pathname,
      title: document.title,
      h1: document.querySelector('h1')?.innerText,
      heroH1: document.querySelector('#hero h1, [data-framer-name="Heading Wrapper"] h1, h1.framer-text')?.innerText
    }))()`,
    returnByValue: true
  });
  console.log('After back state:', afterBack.result.value);

  if (logs.length > 0) console.log('Console Logs:\n', logs.join('\n'));

  await cdp.stop();
}

test().catch(console.error);
