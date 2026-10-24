import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
    const cdp = new ChromeCDP(9230);
    await cdp.start();
    for (const slug of ['custom-vs-off-the-shelf-choose-wisely', 'ch-skskmsnsm', 'design-that-converts-our-approach']) {
        await cdp.navigate('http://localhost:8089/blog/' + slug + '/');
        await new Promise(r => setTimeout(r, 4000));
        const res = await cdp.evaluate(`(() => {
            const desktopCards = Array.from(document.querySelectorAll('.framer-1tq2jgu .ssr-variant:not(.hidden-72rtr7) a.framer-7Bi9P, .framer-v3he4g a.framer-7Bi9P')).map(a => ({
                href: a.getAttribute('href'),
                title: a.querySelector('.framer-giavb9')?.textContent?.trim(),
                img: a.querySelector('img')?.src
            }));
            const mobileCards = Array.from(document.querySelectorAll('.framer-1tq2jgu .ssr-variant.hidden-72rtr7 a.framer-7Bi9P')).map(a => ({
                href: a.getAttribute('href'),
                title: a.querySelector('.framer-giavb9')?.textContent?.trim(),
                img: a.querySelector('img')?.src
            }));
            return {
                title: document.querySelector('#article-title')?.textContent?.trim(),
                desktopCards,
                mobileCards
            };
        })()`);
        console.log(`\n=== ${slug} ===`);
        console.log(JSON.stringify(res, null, 2));
    }
    await cdp.stop();
}

main().catch(console.error);
