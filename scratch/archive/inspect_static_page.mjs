import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9446);
  await cdp.start();
  await cdp.navigate('http://localhost:8088/blog/real-estate-agent-website-cost-2026/');
  await new Promise(r => setTimeout(r, 2500));
  const res = await cdp.evaluate(`(() => {
    return {
      title: document.title,
      h1s: Array.from(document.querySelectorAll('h1')).map(h => h.innerText),
      heroCoverImg: document.querySelector('#hero img, .framer-p85gyj img, .framer-z182eh img, [data-framer-name="Background Image"] img')?.src,
      allImages: Array.from(document.querySelectorAll('img')).map(img => ({ src: img.src, alt: img.alt })),
      contentEl: document.querySelector('#content, .framer-3x2kfl, [data-framer-name="Content"]')?.innerText?.slice(0, 300)
    };
  })()`);
  console.log('Result:', JSON.stringify(res, null, 2));
  await cdp.stop();
}

main().catch(console.error);
