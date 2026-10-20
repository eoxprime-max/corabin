import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9449);
  await cdp.start();
  await cdp.navigate('http://localhost:8088/blog/real-estate-agent-website-cost-2026/');

  // Inject a script that mimics what blog-runtime.js will do
  await cdp.evaluate(`(() => {
    window.__TEST_INJECTED = true;
    const SUPABASE_URL = 'https://oplfhsqycxroqyrdruej.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_c2_9jMvBS9iNxTqX9eyj2Q_oG0t2oVl';
    const CLOUDINARY_CLOUD_NAME = 'teolzwgc';

    function resolveCloudinary(ref) {
      if (!ref) return null;
      const clean = ref.trim();
      if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/')) return clean;
      return 'https://res.cloudinary.com/' + CLOUDINARY_CLOUD_NAME + '/image/upload/f_auto,q_auto/' + clean;
    }

    async function sync() {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const slug = parts[1] || 'real-estate-agent-website-cost-2026';
      const res = await fetch(SUPABASE_URL + '/rest/v1/posts?slug=eq.' + encodeURIComponent(slug) + '&status=eq.published&select=*', {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY }
      });
      const data = await res.json();
      if (!data || !data.length) return;
      const post = data[0];
      const cover = resolveCloudinary(post.cover_image);

      function apply() {
        const img = document.querySelector('[data-framer-name="Background Image"] img, .framer-z182eh img, #article-cover-img');
        if (img && cover && img.src !== cover) {
          img.src = cover;
          img.srcset = cover + ' 1024w';
          img.dataset.synced = 'true';
        }
        const h1 = document.querySelector('h1.framer-text, #hero h1, [data-framer-name="Heading Wrapper"] h1');
        if (h1 && post.title && h1.innerText !== post.title) {
          h1.innerText = post.title;
        }

        const body = document.querySelector('.framer-1272rho, #article-body-content');
        if (body && post.content && body.dataset.synced !== post.updated_at) {
          // If content has markdown, check first paragraph
          const firstLine = post.content.split('\n')[0].replace(/^#+\s*/, '');
          // Mark as synced with updated_at
          body.dataset.synced = post.updated_at || 'true';
        }
      }

      apply();
      // Watch for Framer hydration resetting it
      const observer = new MutationObserver(() => apply());
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
      
      for (let t of [500, 1000, 1500, 2000, 2500, 3000, 4000]) {
        setTimeout(apply, t);
      }
    }

    sync();
  })()`);

  // Wait 4 seconds to observe after Framer mounts
  await new Promise(r => setTimeout(r, 4000));

  const result = await cdp.evaluate(`(() => {
    const img = document.querySelector('[data-framer-name="Background Image"] img, .framer-z182eh img, #article-cover-img');
    const h1 = document.querySelector('h1.framer-text, #hero h1, [data-framer-name="Heading Wrapper"] h1');
    const body = document.querySelector('.framer-1272rho');
    return {
      imgSrc: img?.src,
      imgSynced: img?.dataset?.synced,
      h1: h1?.innerText,
      bodyParagraphs: body?.children?.length
    };
  })()`);

  console.log('Result 4s after load & hydration:', result);
  await cdp.stop();
}

main().catch(console.error);
