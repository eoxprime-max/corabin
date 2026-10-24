import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9449);
  await cdp.start();
  await cdp.navigate('http://localhost:8088/blog/real-estate-agent-website-cost-2026/');
  
  // Wait for initial load
  await new Promise(r => setTimeout(r, 1000));
  
  // Update cover image and title via evaluate
  const result1 = await cdp.evaluate(`(() => {
    const coverImg = document.querySelector('[data-framer-name="Background Image"] img, .framer-z182eh img');
    if (coverImg) {
      coverImg.src = 'https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto/corabin/blog-covers/real-estate-agent-website-cost-2026-030f8a6f';
      coverImg.srcset = 'https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto/corabin/blog-covers/real-estate-agent-website-cost-2026-030f8a6f 1024w';
    }
    const h1 = document.querySelector('.framer-1ltkmql h1');
    if (h1) {
      h1.textContent = 'TEST MODIFIED TITLE';
    }
    return {
      imgSrc: coverImg?.src,
      h1Text: h1?.textContent
    };
  })()`);
  console.log('Immediately after modification:', result1);

  // Wait 4 seconds to see if Framer hydration or animations clobber it
  await new Promise(r => setTimeout(r, 4000));

  const result2 = await cdp.evaluate(`(() => {
    const coverImg = document.querySelector('[data-framer-name="Background Image"] img, .framer-z182eh img');
    const h1 = document.querySelector('.framer-1ltkmql h1');
    return {
      imgSrc: coverImg?.src,
      h1Text: h1?.textContent
    };
  })()`);
  console.log('4 seconds later:', result2);

  await cdp.stop();
}

main().catch(console.error);
