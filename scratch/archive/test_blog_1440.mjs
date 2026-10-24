import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9333);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.setViewport(1440, 900);
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await new Promise(r => setTimeout(r, 4000));

  const res = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const ugj = document.querySelector('.framer-ugj76m');
      const luk = document.querySelector('.framer-3lukgt');
      const dht = document.querySelector('.framer-18dht5n');
      return {
        hasUgj: !!ugj,
        hasLuk: !!luk,
        hasDht: !!dht,
        allCardLinks: Array.from(document.querySelectorAll('a[href*="/blog/"]')).map(a => a.getAttribute('href'))
      };
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(res.result.value, null, 2));
  await cdp.stop();
}
main().catch(err => { console.error(err); process.exit(1); });
