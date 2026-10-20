import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function check() {
  const cdp = new ChromeCDP(9580);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Console.enable');

  cdp.onMessage = (msg) => {
    if (msg.method === 'Console.messageAdded') {
      console.log('CONSOLE:', msg.params.message.text);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('API LOG:', msg.params.args.map(a => a.value || a.description).join(' '));
    }
  };

  console.log('Navigating to http://localhost:8088/blog/...');
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  
  // Wait 6 seconds
  await new Promise(r => setTimeout(r, 6000));
  
  const res = await cdp.send('Runtime.evaluate', {
    expression: 'window.__corabinBlogObserverAttached',
    returnByValue: true
  });
  console.log('__corabinBlogObserverAttached:', res.result.value);

  const postsState = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('.framer-ij7w41-container');
      return Array.from(cards).map(c => ({
        slug: c.getAttribute('data-post-slug'),
        href: c.querySelector('a')?.getAttribute('href'),
        isDynamic: c.hasAttribute('data-dynamic-post')
      }));
    })()`,
    returnByValue: true
  });
  console.log('Cards count:', postsState.result.value.length);
  console.log('Cards:', postsState.result.value);

  await cdp.stop();
}
check().catch(console.error);
