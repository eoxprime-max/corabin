import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9449);
  await cdp.start();
  await cdp.navigate('http://localhost:8088/blog/real-estate-agent-website-cost-2026/');

  for (let i = 1; i <= 6; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const state = await cdp.evaluate(`(() => {
      const hero = document.getElementById('hero');
      const content = document.getElementById('content');
      const h1 = document.querySelector('h1.framer-text, #hero h1, [data-framer-name="Heading Wrapper"] h1');
      const bgImg = document.querySelector('[data-framer-name="Background Image"] img');
      const body = document.querySelector('.framer-1272rho');
      return {
        elapsed: ${i} + 's',
        hasHero: !!hero,
        hasContent: !!content,
        h1Text: h1?.innerText?.slice(0, 40),
        bgImgSrc: bgImg?.src,
        bodyParagraphs: body?.children?.length
      };
    })()`);
    console.log(state);
  }

  await cdp.stop();
}

main().catch(console.error);
