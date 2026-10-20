import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9449);
  await cdp.start();
  await cdp.navigate('http://localhost:8088/blog/real-estate-agent-website-cost-2026/');
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Inspect the image and h1
  const before = await cdp.evaluate(`(() => {
    const img = document.querySelector('[data-framer-name="Background Image"] img, .framer-z182eh img');
    const h1 = document.querySelector('.framer-1ltkmql h1');
    const body = document.querySelector('.framer-1272rho');
    return {
      imgSrc: img ? img.src : null,
      imgSrcset: img ? img.srcset : null,
      h1: h1 ? h1.innerText : null,
      bodyFirstP: body?.children[0]?.innerText
    };
  })()`);
  console.log('Before update:', before);

  // Apply update
  const updated = await cdp.evaluate(`(() => {
    const img = document.querySelector('[data-framer-name="Background Image"] img, .framer-z182eh img');
    const h1 = document.querySelector('.framer-1ltkmql h1');
    const body = document.querySelector('.framer-1272rho');
    if (img) {
      img.src = 'https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto/corabin/blog-covers/real-estate-agent-website-cost-2026-030f8a6f';
      img.srcset = 'https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto,w_1024/corabin/blog-covers/real-estate-agent-website-cost-2026-030f8a6f 1024w';
    }
    if (h1) {
      h1.innerText = 'CMS Updated Title Real Estate Cost';
    }
    if (body) {
      body.children[0].innerText = 'CMS Updated First Paragraph Body Content!';
    }
    return {
      imgSrc: img ? img.src : null,
      h1: h1 ? h1.innerText : null,
      bodyFirstP: body?.children[0]?.innerText
    };
  })()`);
  console.log('Immediately updated:', updated);

  // Wait 3 seconds
  await new Promise(r => setTimeout(r, 3000));

  const after = await cdp.evaluate(`(() => {
    const img = document.querySelector('[data-framer-name="Background Image"] img, .framer-z182eh img');
    const h1 = document.querySelector('.framer-1ltkmql h1');
    const body = document.querySelector('.framer-1272rho');
    return {
      imgSrc: img ? img.src : null,
      imgSrcset: img ? img.srcset : null,
      h1: h1 ? h1.innerText : null,
      bodyFirstP: body?.children[0]?.innerText
    };
  })()`);
  console.log('After 3 seconds:', after);

  await cdp.stop();
}

main().catch(console.error);
