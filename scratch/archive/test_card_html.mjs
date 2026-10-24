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
      const card = document.querySelector('a.framer-7Bi9P');
      return {
        html: card ? card.outerHTML : null
      };
    })()`,
    returnByValue: true
  });
  console.log(evalRes.result.value.html);
  await cdp.stop();
}
main().catch(err => { console.error(err); process.exit(1); });
