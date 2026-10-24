import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9333);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  console.log('--- HOMEPAGE (http://localhost:8088/) ---');
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/' });
  await new Promise(r => setTimeout(r, 4000));
  
  const homeRes = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.framer-k7mcxy a.framer-7Bi9P, [data-framer-name="Blog"] a.framer-7Bi9P, #insights a.framer-7Bi9P, .framer-3lukgt a.framer-7Bi9P')).map(a => ({
        href: a.getAttribute('href'),
        date: a.querySelector('.framer-gifdkw p')?.textContent?.trim(),
        title: a.querySelector('.framer-giavb9 p')?.textContent?.trim(),
        imgSrc: a.querySelector('img')?.getAttribute('src'),
        imgSrcset: a.querySelector('img')?.getAttribute('srcset')
      }));
      return cards;
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(homeRes.result.value, null, 2));

  console.log('--- BLOG LISTING (http://localhost:8088/blog/) ---');
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await new Promise(r => setTimeout(r, 4000));

  const blogRes = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const featured = Array.from(document.querySelectorAll('.framer-ugj76m a.framer-7Bi9P, .framer-3lukgt a.framer-7Bi9P')).map(a => ({
        href: a.getAttribute('href'),
        date: a.querySelector('.framer-gifdkw p')?.textContent?.trim(),
        title: a.querySelector('.framer-giavb9 p')?.textContent?.trim(),
        imgSrc: a.querySelector('img')?.getAttribute('src'),
        imgSrcset: a.querySelector('img')?.getAttribute('srcset')
      }));
      const regular = Array.from(document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container')).map(c => ({
        href: c.querySelector('a')?.getAttribute('href'),
        date: c.querySelector('.framer-ie051f p')?.textContent?.trim(),
        title: c.querySelector('.framer-1pz7yr3 p')?.textContent?.trim(),
        imgSrc: c.querySelector('img')?.getAttribute('src')
      }));
      return { featured, regular };
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(blogRes.result.value, null, 2));

  await cdp.stop();
}
main().catch(err => { console.error(err); process.exit(1); });
