import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9333);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await new Promise(r => setTimeout(r, 4000));
  
  const evalRes = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const featured = Array.from(document.querySelectorAll('.framer-3lukgt a')).map(a => ({
        href: a.getAttribute('href'),
        title: a.querySelector('.framer-giavb9 p, .framer-1pz7yr3 p, [data-framer-name*="Title"] p')?.textContent?.trim(),
        date: a.querySelector('.framer-gifdkw p, .framer-ie051f p')?.textContent?.trim(),
        img: a.querySelector('img')?.getAttribute('src')
      }));
      const regularContainer = document.querySelector('.framer-18dht5n');
      const regularCards = Array.from(document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container')).map(c => ({
        href: c.querySelector('a')?.getAttribute('href'),
        title: c.querySelector('.framer-1pz7yr3 p')?.textContent?.trim(),
        date: c.querySelector('.framer-ie051f p')?.textContent?.trim(),
        img: c.querySelector('img')?.getAttribute('src')
      }));
      return {
        featuredCount: featured.length,
        featured,
        hasRegularContainer: !!regularContainer,
        regularCardsCount: regularCards.length,
        regularCards
      };
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(evalRes.result.value, null, 2));
  await cdp.stop();
}
main().catch(err => { console.error(err); process.exit(1); });
