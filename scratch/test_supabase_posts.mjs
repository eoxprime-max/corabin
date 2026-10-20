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
      const resp = await fetch('https://oplfhsqycxroqyrdruej.supabase.co/rest/v1/posts?status=eq.published&select=id,slug,title,excerpt,category,status,published_at,cover_image,cover_image_alt,featured&order=published_at.desc', {
        headers: { 'apikey': 'sb_publishable_c2_9jMvBS9iNxTqX9eyj2Q_oG0t2oVl' }
      });
      const posts = await resp.json();
      const featured = posts.filter(p => p.featured);
      const featuredSlugs = new Set(featured.map(p => p.slug));
      const regular = posts.filter(p => !featuredSlugs.has(p.slug));
      return {
        totalPosts: posts.length,
        featuredCount: featured.length,
        featuredSlugs: Array.from(featuredSlugs),
        regularCount: regular.length,
        regularSlugs: regular.map(p => p.slug)
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('Supabase posts test:');
  console.log(JSON.stringify(testRes.result.value, null, 2));
  await cdp.stop();
}
main().catch(err => { console.error(err); process.exit(1); });
