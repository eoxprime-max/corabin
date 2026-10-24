import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function verifyArticleMobile() {
  const cdp = new ChromeCDP(9344);
  await cdp.start();
  await cdp.setViewport(390, 844);
  console.log('Navigating to http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026/ on mobile (390x844)...');
  await cdp.navigate('http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026/');
  await new Promise(r => setTimeout(r, 2500));

  const result = await cdp.evaluate(`(() => {
    const title = document.getElementById('article-title');
    const titleRect = title ? title.getBoundingClientRect() : null;
    const body = document.getElementById('article-body-content');
    const bodyRect = body ? body.getBoundingClientRect() : null;
    const moreArticles = Array.from(document.querySelectorAll('.framer-ffkmv5 .framer-2gobjs-container')).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        title: el.querySelector('.framer-1pz7yr3 p, [data-framer-name="Title"] p')?.innerText.trim()
      };
    });

    return {
      titleWidth: titleRect ? titleRect.width : 0,
      titleHeight: titleRect ? titleRect.height : 0,
      bodyWidth: bodyRect ? bodyRect.width : 0,
      bodyParagraphs: body ? body.querySelectorAll('p').length : 0,
      moreArticlesCount: moreArticles.length,
      sampleMoreArticle: moreArticles[0],
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  })()`);

  console.log('Mobile Article Result:', JSON.stringify(result, null, 2));
  await cdp.stop();
}

verifyArticleMobile().catch(console.error);
