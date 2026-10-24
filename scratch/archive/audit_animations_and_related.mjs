import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const cdp = new ChromeCDP(9596);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  console.log('--- 1. AUDITING HOMEPAGE ANIMATIONS ---');
  await cdp.send('Page.navigate', { url: 'http://localhost:8089/' });
  await sleep(3000);

  const homeData = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const appearIds = Array.from(document.querySelectorAll('[data-framer-appear-id]')).map(el => ({
        id: el.getAttribute('data-framer-appear-id'),
        tag: el.tagName,
        className: el.className,
        computedOpacity: getComputedStyle(el).opacity,
        computedTransform: getComputedStyle(el).transform
      }));
      const cards = Array.from(document.querySelectorAll('.framer-7Bi9P')).map(el => ({
        href: el.getAttribute('href'),
        arrowBottom: getComputedStyle(el.querySelector('.framer-8piq4i') || el).bottom,
        imgTransform: getComputedStyle(el.querySelector('img') || el).transform
      }));
      return {
        appearIds,
        cardsCount: cards.length,
        hasAnimationsStyleTag: Boolean(document.getElementById('corabin-blog-animations'))
      };
    })()`,
    returnByValue: true
  });
  console.log('Homepage Animation Audit:', JSON.stringify(homeData.result.value, null, 2));

  console.log('\n--- 2. AUDITING BLOG LISTING ANIMATIONS ---');
  await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/' });
  await sleep(3500);

  const blogData = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const appearIds = Array.from(document.querySelectorAll('[data-framer-appear-id]')).map(el => ({
        id: el.getAttribute('data-framer-appear-id'),
        tag: el.tagName,
        computedOpacity: getComputedStyle(el).opacity,
        computedTransform: getComputedStyle(el).transform
      }));
      const featuredCards = Array.from(document.querySelectorAll('.framer-7Bi9P')).map(el => ({
        href: el.getAttribute('href'),
        arrowBottom: getComputedStyle(el.querySelector('.framer-8piq4i') || el).bottom
      }));
      const regularCards = Array.from(document.querySelectorAll('.framer-sHlxX')).map(el => ({
        href: el.getAttribute('href'),
        arrowBottom: getComputedStyle(el.querySelector('.framer-pizjbw') || el).bottom
      }));
      return {
        appearIds,
        featuredCardsCount: featuredCards.length,
        regularCardsCount: regularCards.length,
        hasAnimationsStyleTag: Boolean(document.getElementById('corabin-blog-animations'))
      };
    })()`,
    returnByValue: true
  });
  console.log('Blog Listing Animation Audit:', JSON.stringify(blogData.result.value, null, 2));

  console.log('\n--- 3. AUDITING ARTICLE PAGES & RELATED POSTS ---');
  const routes = [
    '/blog/ch-skskmsnsm/',
    '/blog/why-every-real-estate-agent-needs-a-website-in-2026/',
    '/blog/custom-vs-off-the-shelf-choose-wisely/',
    '/blog/design-that-converts-our-approach/'
  ];

  for (const r of routes) {
    console.log(`\nTesting article route: ${r}`);
    await cdp.send('Page.navigate', { url: `http://localhost:8089${r}` });
    await sleep(3000);

    const artData = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const title = document.querySelector('#article-title, h1')?.innerText;
        const headingWrapper = document.querySelector('.framer-1ekua6s');
        const coverWrapper = document.querySelector('.framer-z182eh');
        const coverImg = document.querySelector('#article-cover-img');

        // Check related / more articles section
        const moreSection = document.querySelector('.framer-px4s1i, .framer-k7mcxy, [data-framer-name="More Articles"], [data-framer-name="Blog"]');
        const moreSectionClass = moreSection ? moreSection.className : 'NONE';
        const moreSectionName = moreSection ? moreSection.getAttribute('data-framer-name') : 'NONE';
        
        // Find cards inside moreSection
        const cards = moreSection ? Array.from(moreSection.querySelectorAll('a')).map(a => ({
          href: a.getAttribute('href'),
          title: a.querySelector('h2, h3, p, [data-framer-name*="Title"]')?.innerText?.slice(0, 50),
          hasImg: Boolean(a.querySelector('img')),
          imgSrc: a.querySelector('img')?.src || null,
          className: a.className
        })) : [];

        return {
          title,
          headingOpacity: headingWrapper ? getComputedStyle(headingWrapper).opacity : null,
          headingTransform: headingWrapper ? getComputedStyle(headingWrapper).transform : null,
          coverOpacity: coverWrapper ? getComputedStyle(coverWrapper).opacity : null,
          coverImgSrc: coverImg?.src,
          moreSectionClass,
          moreSectionName,
          relatedCardsCount: cards.length,
          relatedCards: cards
        };
      })()`,
      returnByValue: true
    });
    console.log(`Article ${r} Data:`, JSON.stringify(artData.result.value, null, 2));
  }

  await cdp.stop();
}

run().catch(console.error);
