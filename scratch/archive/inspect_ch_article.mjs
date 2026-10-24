import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function test() {
  const cdp = new ChromeCDP(9592);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/ch-skskmsnsm/' });
  await new Promise(r => setTimeout(r, 2500));
  const res = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const heading = document.querySelector('.framer-1ekua6s, [data-framer-name="Heading Wrapper"]');
      const cover = document.querySelector('.framer-z182eh, [data-framer-name="Background Image"]');
      const h1 = document.querySelector('#article-title, h1');
      const body = document.querySelector('#article-body-content');
      const coverImg = document.querySelector('#article-cover-img');
      return {
        title: document.title,
        h1: h1?.innerText,
        headingOpacity: heading ? getComputedStyle(heading).opacity : null,
        headingTransform: heading ? getComputedStyle(heading).transform : null,
        headingInlineStyle: heading ? heading.getAttribute('style') : null,
        coverOpacity: cover ? getComputedStyle(cover).opacity : null,
        coverTransform: cover ? getComputedStyle(cover).transform : null,
        coverInlineStyle: cover ? cover.getAttribute('style') : null,
        coverSrc: coverImg?.src,
        bodySnippet: body?.innerText?.slice(0, 150),
        renderedState: document.getElementById('main')?.getAttribute('data-rendered')
      };
    })()`,
    returnByValue: true
  });
  console.log('CH Article Inspection:', JSON.stringify(res.result.value, null, 2));
  await cdp.stop();
}

test().catch(console.error);
