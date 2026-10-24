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
      const topCards = Array.from(document.querySelectorAll('.framer-7Bi9P')).map(a => {
        let el = a;
        const parents = [];
        while (el && el !== document.body) {
          parents.push(el.className ? el.className.split(' ')[0] : el.tagName);
          el = el.parentElement;
        }
        return {
          href: a.getAttribute('href'),
          title: a.querySelector('.framer-giavb9 p, [data-framer-name*="Title"] p, p')?.textContent?.trim(),
          parents: parents.slice(0, 6)
        };
      });
      return topCards;
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(evalRes.result.value, null, 2));
  await cdp.stop();
}
main().catch(err => { console.error(err); process.exit(1); });
