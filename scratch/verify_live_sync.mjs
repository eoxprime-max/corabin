import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9449);
  await cdp.start();
  console.log('Chrome started');

  await cdp.navigate('http://localhost:8088/blog/real-estate-agent-website-cost-2026/');
  console.log('Navigated, waiting 3.5s for Framer hydration & blog-runtime sync...');
  await new Promise(r => setTimeout(r, 3500));

  const result = await cdp.evaluate(`(() => {
    const coverImg = document.querySelector('[data-framer-name="Background Image"] img, .framer-z182eh img, #article-cover-img');
    const h1 = document.querySelector('h1.framer-text, #hero h1, [data-framer-name="Heading Wrapper"] h1');
    const date = document.querySelector('[data-framer-name="Author Wrapper"] [data-framer-name="Date"] p, .framer-ybkmy p, .framer-ybkmy');
    const author = document.querySelector('[data-framer-name="Photo"] ~ div p, .framer-y7unnl p');
    const excerpt = document.querySelector('[data-framer-name="Excerpt"] h2, .framer-1ig6rss h2');
    const body = document.querySelector('.framer-1272rho, #article-body-content');

    return {
      title: document.title,
      coverSrc: coverImg ? coverImg.src : null,
      coverSrcset: coverImg ? coverImg.srcset : null,
      coverAlt: coverImg ? coverImg.alt : null,
      h1: h1 ? h1.innerText : null,
      date: date ? date.innerText : null,
      author: author ? author.innerText : null,
      excerpt: excerpt ? excerpt.innerText : null,
      bodyChildrenCount: body ? body.children.length : 0,
      bodyTextSnippet: body ? body.innerText.slice(0, 150) : null
    };
  })()`);

  console.log('SYNC VERIFICATION RESULT:');
  console.log(JSON.stringify(result, null, 2));

  // Take screenshot
  await cdp.captureScreenshot('scratch/real-estate-cost-sync.png');
  console.log('Screenshot saved to scratch/real-estate-cost-sync.png');

  await cdp.stop();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
