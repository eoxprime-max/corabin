import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9333);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await new Promise(r => setTimeout(r, 4000));

  const testRes = await cdp.send('Runtime.evaluate', {
    expression: `(async () => {
      // 1. Fetch live Supabase posts
      const resp = await fetch('https://oplfhsqycxroqyrdruej.supabase.co/rest/v1/posts?status=eq.published&select=id,slug,title,excerpt,category,status,published_at,cover_image,cover_image_alt,featured&order=published_at.desc', {
        headers: { 'apikey': 'sb_publishable_c2_9jMvBS9iNxTqX9eyj2Q_oG0t2oVl' }
      });
      const allPosts = await resp.json();
      const featuredPosts = allPosts.filter(p => p.featured).slice(0, 3);
      const featuredSlugs = new Set(featuredPosts.map(p => p.slug));
      const regularPosts = allPosts.filter(p => !featuredSlugs.has(p.slug));

      const container = document.querySelector('.framer-18dht5n');
      if (!container) return { error: 'no container' };

      const sampleCard = container.querySelector('.framer-ij7w41-container');
      if (!sampleCard) return { error: 'no sample card' };

      function extractSlug(href) {
        if (!href) return '';
        const clean = href.replace(/^\\.\\//, '/').replace(/\\/+$/, '');
        const segs = clean.split('/').filter(Boolean);
        const idx = segs.indexOf('blog');
        return (idx !== -1 && segs[idx + 1] && segs[idx + 1] !== 'article.html') ? segs[idx + 1] : '';
      }

      // Remove featured duplicates from regular container
      container.querySelectorAll('.framer-ij7w41-container').forEach(c => {
        const slug = extractSlug(c.querySelector('a')?.getAttribute('href'));
        if (slug && featuredSlugs.has(slug)) {
          c.remove();
        }
      });

      const loadMore = container.querySelector('.framer-1xy7824');
      const renderedCards = [];

      for (const post of regularPosts) {
        let card = container.querySelector('[data-post-slug="' + post.slug + '"]');
        if (!card) {
          for (const c of container.querySelectorAll('.framer-ij7w41-container')) {
            if (extractSlug(c.querySelector('a')?.getAttribute('href')) === post.slug) {
              card = c;
              break;
            }
          }
        }
        if (!card) {
          card = sampleCard.cloneNode(true);
        }
        card.setAttribute('data-post-slug', post.slug);
        const a = card.querySelector('a');
        if (a) a.setAttribute('href', '/blog/' + post.slug + '/');
        const titleP = card.querySelector('.framer-1pz7yr3 p');
        if (titleP) titleP.textContent = post.title;
        const dateP = card.querySelector('.framer-ie051f p');
        if (dateP) dateP.textContent = new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
        const img = card.querySelector('img');
        if (img) {
          if (post.cover_image && !post.cover_image.startsWith('/')) {
            img.src = 'https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto/' + post.cover_image;
          } else if (post.cover_image) {
            img.src = post.cover_image;
          }
        }
        if (loadMore) {
          container.insertBefore(card, loadMore);
        } else {
          container.appendChild(card);
        }
        renderedCards.push({
          slug: post.slug,
          title: titleP?.textContent,
          date: dateP?.textContent,
          imgSrc: img?.src
        });
      }

      return {
        renderedCardsCount: renderedCards.length,
        renderedCards
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  console.log(JSON.stringify(testRes.result.value, null, 2));
  await cdp.stop();
}
main().catch(err => { console.error(err); process.exit(1); });
