import fs from 'fs';

const html = fs.readFileSync('public/blog/index.html', 'utf8');

const imgMatches = [...html.matchAll(/<img[^>]+>/g)].map(m => m[0]);
console.log('Total <img> tags in public/blog/index.html:', imgMatches.length);

imgMatches.forEach((img, i) => {
    const src = (img.match(/src="([^"]+)"/) || [])[1];
    const srcset = (img.match(/srcset="([^"]+)"/) || [])[1];
    const sizes = (img.match(/sizes="([^"]+)"/) || [])[1];
    const loading = (img.match(/loading="([^"]+)"/) || [])[1];
    console.log(`[${i}] src: ${src} | loading: ${loading || 'none'} | sizes: ${sizes || 'none'}\n    srcset: ${srcset ? srcset.slice(0, 90) + '...' : 'none'}`);
});
