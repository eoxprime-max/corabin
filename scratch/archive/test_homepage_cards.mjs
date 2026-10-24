import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9333);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/' });
  await new Promise(r => setTimeout(r, 4000));
  
  const evalRes = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const blogSection = document.querySelector('[data-framer-name="Blog"], .framer-k7mcxy, #insights');
      const grid = blogSection?.querySelector('.framer-3lukgt, .framer-ugj76m, [data-framer-name="Grid"]');
      const cards = grid ? Array.from(grid.querySelectorAll('a.framer-7Bi9P')).map(a => ({
        href: a.getAttribute('href'),
        title: a.querySelector('.framer-giavb9 p, [data-framer-name*="Title"] p, p')?.textContent?.trim(),
        date: a.querySelector('.framer-gifdkw p')?.textContent?.trim(),
        img: a.querySelector('img')?.getAttribute('src'),
        srcset: a.querySelector('img')?.getAttribute('srcset')
      })) : [];
      return {
        hasBlogSection: !!blogSection,
        hasGrid: !!grid,
        cardsCount: cards.length,
        cards
      };
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(evalRes.result.value, null, 2));
  await cdp.stop();
}
main().catch(err => { console.error(err); process.exit(1); });
