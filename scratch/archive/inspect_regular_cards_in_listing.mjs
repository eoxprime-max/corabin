import fs from 'fs';

const html = fs.readFileSync('public/blog/index.html', 'utf8');

// Find regular cards container or instances of framer-ij7w41-container
const regularCards = [...html.matchAll(/class="[^"]*framer-ij7w41-container[^"]*"[\s\S]*?(?=(class="[^"]*framer-ij7w41-container|$))/g)];
console.log('Regular cards in static HTML:', regularCards.length);

regularCards.forEach((c, idx) => {
    const cardHtml = c[0];
    const imgMatches = [...cardHtml.matchAll(/<img[^>]+>/g)].map(m => m[0]);
    console.log(`Card ${idx}:`, imgMatches);
});
