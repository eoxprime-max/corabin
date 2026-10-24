import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function test() {
  const cdp = new ChromeCDP(9598);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/' });
  await new Promise(r => setTimeout(r, 4500));
  const res = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll(".framer-18dht5n .framer-ij7w41-container"));
      return cards.map(c => {
        const a = c.querySelector('a');
        return {
          slug: c.getAttribute('data-post-slug'),
          href: a?.getAttribute('href'),
          dynamic: c.getAttribute('data-dynamic-post'),
          animated: c.getAttribute('data-animated')
        };
      });
    })()`,
    returnByValue: true
  });
  console.log('Cards in regular listing:', JSON.stringify(res.result.value, null, 2));
  await cdp.stop();
}
test().catch(console.error);
