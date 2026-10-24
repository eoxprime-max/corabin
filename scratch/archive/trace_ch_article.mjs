import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function test() {
  const cdp = new ChromeCDP(9593);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Console.enable');
  await cdp.send('Network.enable');

  const logs = [];
  const network = [];

  cdp.onMessage = (msg) => {
    if (msg.method === 'Console.messageAdded') {
      logs.push(`[${msg.params.message.level}] ${msg.params.message.text}`);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      logs.push(`[console.${msg.params.type}] ${text}`);
    }
    if (msg.method === 'Network.requestWillBeSent') {
      if (msg.params.request.url.includes('supabase') || msg.params.request.url.includes('blog')) {
        network.push(`REQ: ${msg.params.request.method} ${msg.params.request.url}`);
      }
    }
    if (msg.method === 'Network.responseReceived') {
      if (msg.params.response.url.includes('supabase') || msg.params.response.url.includes('blog')) {
        network.push(`RESP: ${msg.params.response.status} ${msg.params.response.url}`);
      }
    }
  };

  await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/ch-skskmsnsm/' });
  await new Promise(r => setTimeout(r, 4000));

  const result = await cdp.send('Runtime.evaluate', {
    expression: `(() => ({
      currentSlug: window.location.pathname,
      resolvedSlug: typeof resolveCurrentSlug !== 'undefined' ? resolveCurrentSlug() : null,
      livePost: window.__corabinLivePost,
      preloaded: window.__PRELOADED_BLOG_POST__,
      articleTitle: document.querySelector('#article-title')?.innerText,
      body: document.querySelector('#article-body-content')?.innerText?.slice(0, 100)
    }))()`,
    returnByValue: true
  });

  console.log('Browser State:', JSON.stringify(result.result.value, null, 2));
  console.log('Console Logs:\n', logs.join('\n'));
  console.log('Network:\n', network.join('\n'));

  await cdp.stop();
}

test().catch(console.error);
