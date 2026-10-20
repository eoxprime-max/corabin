import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9333);
  await cdp.start();

  console.log('--- Testing Full Blog Listing Sync ---');
  await cdp.setViewport(1440, 900);
  await cdp.navigate('http://localhost:8088/blog/');
  await new Promise(r => setTimeout(r, 4000));

  const blogRes = await cdp.evaluate(`(async () => {
    const SUPABASE_URL = 'https://oplfhsqycxroqyrdruej.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_c2_9jMvBS9iNxTqX9eyj2Q_oG0t2oVl';
    const res = await fetch(SUPABASE_URL + '/rest/v1/posts?status=eq.published&select=id,slug,title,excerpt,category,status,published_at,cover_image,cover_image_alt,featured&order=published_at.desc', {
      headers: { 'apikey': SUPABASE_ANON_KEY }
    });
    const allPosts = await res.json();
    const featured = allPosts.filter(p => p.featured).slice(0, 3);
    const featuredSlugs = new Set(featured.map(p => p.slug));
    const regular = allPosts.filter(p => !featuredSlugs.has(p.slug));

    function resolveCloudinary(ref) {
      if (!ref) return null;
      const clean = ref.trim();
      if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/')) return clean;
      return 'https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto/' + clean;
    }

    function extractSlug(href) {
      if (!href) return '';
      const clean = href.replace(/^\\.\\//, '/').replace(/\\/+$/, '');
      const segs = clean.split('/').filter(Boolean);
      const idx = segs.indexOf('blog');
      return (idx !== -1 && segs[idx + 1] && segs[idx + 1] !== 'article.html') ? segs[idx + 1] : '';
    }

    const container = document.querySelector('.framer-18dht5n');
    const sampleCard = container?.querySelector('.framer-ij7w41-container');
    if (!container || !sampleCard) return { error: 'no container or sample' };

    // Remove cards matching featured slugs
    container.querySelectorAll('.framer-ij7w41-container').forEach(c => {
      const slug = extractSlug(c.querySelector('a')?.getAttribute('href')) || c.getAttribute('data-post-slug');
      if (slug && featuredSlugs.has(slug)) c.remove();
    });

    const loadMore = container.querySelector('.framer-1xy7824');

    for (const post of regular) {
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
      const titleP = card.querySelector('.framer-1pz7yr3 p') || card.querySelector('.framer-1pz7yr3');
      if (titleP) titleP.textContent = post.title;
      const dateP = card.querySelector('.framer-ie051f p');
      if (dateP) {
        const d = new Date(post.published_at);
        dateP.textContent = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
      }
      const img = card.querySelector('img');
      if (img) {
        img.src = resolveCloudinary(post.cover_image);
        img.alt = post.cover_image_alt || post.title || '';
      }
      if (loadMore) {
        container.insertBefore(card, loadMore);
      } else {
        container.appendChild(card);
      }
    }

    const renderedRegular = Array.from(container.querySelectorAll('.framer-ij7w41-container')).map(c => ({
      slug: c.getAttribute('data-post-slug'),
      href: c.querySelector('a')?.getAttribute('href'),
      title: c.querySelector('.framer-1pz7yr3 p')?.textContent?.trim(),
      date: c.querySelector('.framer-ie051f p')?.textContent?.trim(),
      imgSrc: c.querySelector('img')?.getAttribute('src')
    }));

    return {
      renderedCount: renderedRegular.length,
      renderedRegular
    };
  })()`);

  console.log('Blog Regular Result:', JSON.stringify(blogRes, null, 2));
  await cdp.stop();
}

main().catch(console.error);
