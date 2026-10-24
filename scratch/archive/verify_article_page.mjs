import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function verifyArticle() {
  const cdp = new ChromeCDP(9343);
  await cdp.start();
  await cdp.setViewport(1440, 900);
  console.log('Navigating to http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026/...');
  await cdp.navigate('http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026/');
  await new Promise(r => setTimeout(r, 2500));

  const result = await cdp.evaluate(`(() => {
    const title = document.getElementById('article-title')?.innerText.trim();
    const author = document.getElementById('article-author')?.innerText.trim();
    const date = document.getElementById('article-date')?.innerText.trim();
    const excerpt = document.getElementById('article-excerpt')?.innerText.trim();
    const coverImg = document.getElementById('article-cover-img');
    const body = document.getElementById('article-body-content');
    const moreArticles = Array.from(document.querySelectorAll('.framer-ffkmv5 .framer-2gobjs-container')).map(el => ({
      title: el.querySelector('.framer-1pz7yr3 p, [data-framer-name="Title"] p')?.innerText.trim(),
      date: el.querySelector('.framer-ie051f p, [data-framer-name="Date"] p')?.innerText.trim(),
      height: el.getBoundingClientRect().height
    }));

    return {
      docTitle: document.title,
      title,
      author,
      date,
      excerpt: excerpt ? excerpt.substring(0, 80) + '...' : null,
      coverImgSrc: coverImg ? coverImg.getAttribute('src') : null,
      headingsCount: body ? body.querySelectorAll('h1, h2, h3').length : 0,
      paragraphsCount: body ? body.querySelectorAll('p').length : 0,
      listsCount: body ? body.querySelectorAll('ul, ol').length : 0,
      bodyTextLength: body ? body.innerText.length : 0,
      moreArticlesCount: moreArticles.length,
      sampleMoreArticle: moreArticles[0]
    };
  })()`);

  console.log('Article Page Verification:', JSON.stringify(result, null, 2));
  await cdp.stop();
}

verifyArticle().catch(console.error);
