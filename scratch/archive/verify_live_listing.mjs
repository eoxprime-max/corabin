import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function verifyListing() {
  const cdp = new ChromeCDP(9340);
  await cdp.start();
  await cdp.setViewport(1440, 900);
  console.log('Navigating to http://localhost:8088/blog/...');
  await cdp.navigate('http://localhost:8088/blog/');

  // Wait 3.5s for Framer hydration and runtime sync
  await new Promise(r => setTimeout(r, 3500));

  const result = await cdp.evaluate(`(() => {
    const featuredCards = Array.from(document.querySelectorAll('.framer-ugj76m a[href*="/blog/"]')).map(a => ({
      href: a.getAttribute('href'),
      title: a.querySelector('[data-framer-name="Title"] p')?.innerText.trim()
    }));

    const regularCards = Array.from(document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container')).map(el => {
      const a = el.querySelector('a');
      const title = el.querySelector('.framer-1pz7yr3 p, [data-framer-name="Title"] p');
      const date = el.querySelector('.framer-ie051f p, [data-framer-name="Date"] p');
      const img = el.querySelector('img');
      const isDynamic = el.getAttribute('data-dynamic-post') === 'true';
      const slug = el.getAttribute('data-post-slug');
      return {
        slug,
        isDynamic,
        href: a ? a.getAttribute('href') : null,
        title: title ? title.innerText.trim() : null,
        date: date ? date.innerText.trim() : null,
        imgSrc: img ? img.getAttribute('src') : null
      };
    });

    const allSlugs = regularCards.map(c => c.href);
    const duplicates = allSlugs.filter((item, index) => allSlugs.indexOf(item) !== index);

    return {
      featuredCount: featuredCards.length,
      featuredTitles: featuredCards.map(f => f.title),
      regularCount: regularCards.length,
      regularCards,
      duplicates,
      firstRegularCard: regularCards[0]
    };
  })()`);

  console.log('Verification Result:', JSON.stringify(result, null, 2));
  await cdp.stop();
}

verifyListing().catch(console.error);
