import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9449);
  await cdp.start();
  await cdp.navigate('http://localhost:8088/blog/real-estate-agent-website-cost-2026/');
  await new Promise(r => setTimeout(r, 3000));
  
  const structure = await cdp.evaluate(`(() => {
    // Look for hero elements
    const h1 = document.querySelector('h1.framer-text, #hero h1, [data-framer-name="Heading Wrapper"] h1');
    const heroSection = document.querySelector('#hero, [data-framer-name="Hero Section"]');
    const authorP = document.querySelector('[data-framer-name="Photo"] ~ div p, .framer-y7unnl p');
    const dateDiv = document.querySelector('[data-framer-name="Author Wrapper"] [data-framer-name="Date"], [data-framer-name="Date"] p, .framer-ybkmy');
    const allDates = Array.from(document.querySelectorAll('*')).filter(el => el.children.length === 0 && /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}\b/.test(el.textContent));
    const excerptEl = document.querySelector('h2.framer-text, .framer-1ig6rss h2, [data-framer-name="Excerpt"]');
    const coverImg = document.querySelector('[data-framer-name="Background Image"] img, .framer-z182eh img');
    const bodyContent = document.querySelector('.framer-1272rho');

    return {
      h1: { text: h1?.innerText, selector: h1 ? h1.className : null, path: h1?.parentElement?.className },
      heroSection: { classes: heroSection?.className },
      author: { text: authorP?.innerText, selector: authorP?.className },
      date: { text: dateDiv?.innerText, selector: dateDiv?.className, matches: allDates.map(d => ({ tag: d.tagName, text: d.textContent, class: d.className, parent: d.parentElement?.className })) },
      excerpt: { text: excerptEl?.innerText, tag: excerptEl?.tagName, class: excerptEl?.className },
      coverImg: {
        src: coverImg?.src,
        srcset: coverImg?.srcset,
        alt: coverImg?.alt,
        selector: coverImg?.className,
        parent: coverImg?.parentElement?.outerHTML?.slice(0, 200)
      },
      bodyContent: {
        class: bodyContent?.className,
        childrenCount: bodyContent?.children?.length,
        firstThreeChildren: Array.from(bodyContent?.children || []).slice(0, 3).map(c => ({ tag: c.tagName, class: c.className, text: c.textContent.slice(0, 60) }))
      }
    };
  })()`);

  console.log('Structure:', JSON.stringify(structure, null, 2));
  await cdp.stop();
}

main().catch(console.error);
