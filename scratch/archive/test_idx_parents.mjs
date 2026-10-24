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
      const idxLink = document.querySelector('a[href*="idx-listings-not-showing-google"]');
      if (!idxLink) return { found: false };
      let el = idxLink;
      const parents = [];
      while (el && el !== document.body) {
        parents.push({
          tag: el.tagName,
          class: el.className,
          dataName: el.getAttribute('data-framer-name')
        });
        el = el.parentElement;
      }
      return { found: true, parents, html: idxLink.outerHTML.slice(0, 300) };
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(evalRes.result.value, null, 2));
  await cdp.stop();
}
main().catch(err => { console.error(err); process.exit(1); });
