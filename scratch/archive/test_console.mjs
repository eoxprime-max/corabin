import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function testConsole() {
  const cdp = new ChromeCDP(9341);
  await cdp.start();
  await cdp.send('Console.enable');
  await cdp.send('Runtime.enable');

  cdp.ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.log('[BROWSER EXCEPTION]', msg.params.exceptionDetails);
    }
  });

  await cdp.setViewport(1440, 900);
  await cdp.navigate('http://localhost:8088/blog/');
  await new Promise(r => setTimeout(r, 4000));

  const check = await cdp.evaluate(`(() => {
    return {
      pathname: window.location.pathname,
      isListing: window.location.pathname === '/blog' || window.location.pathname === '/blog/' || window.location.pathname === '/blog/index.html',
      moduleLoaded: typeof window.__corabinBlogObserverAttached !== 'undefined'
    };
  })()`);
  console.log('DOM check:', check);

  await cdp.stop();
}

testConsole().catch(console.error);
