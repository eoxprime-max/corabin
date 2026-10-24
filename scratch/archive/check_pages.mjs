import { ChromeCDP } from '../tools/cdp_helper.mjs';

const routes = [
    'http://localhost:8089/blog/custom-vs-off-the-shelf-choose-wisely/',
    'http://localhost:8089/blog/ch-skskmsnsm/',
    'http://localhost:8089/blog/design-that-converts-our-approach/',
    'http://localhost:8089/blog/why-every-real-estate-agent-needs-a-website-in-2026/'
];

async function main() {
    const cdp = new ChromeCDP(9230);
    await cdp.start();
    await cdp.setViewport(1440, 900);

    for (const url of routes) {
        console.log(`\n========================================`);
        console.log(`INSPECTING: ${url}`);
        console.log(`========================================`);
        try {
            await cdp.navigate(url);
            // wait 2 seconds for hydration & Supabase
            await new Promise(r => setTimeout(r, 2000));

            const evalResult = await cdp.evaluate(`(() => {
                const title = document.querySelector('#article-title')?.textContent?.trim();
                const cover = document.querySelector('#article-cover-img');
                const coverSrc = cover?.src;
                const coverOpacity = cover ? window.getComputedStyle(cover).opacity : null;
                const coverVisible = cover ? (cover.offsetWidth > 0 && cover.offsetHeight > 0) : false;
                const headingWrapper = document.querySelector('.framer-1ekua6s');
                const headingOpacity = headingWrapper ? window.getComputedStyle(headingWrapper).opacity : null;
                const headingTransform = headingWrapper ? window.getComputedStyle(headingWrapper).transform : null;
                const loadingEl = document.querySelector('#article-loading');
                const bodyText = document.querySelector('#article-body-content')?.innerText?.slice(0, 150);

                // Related cards
                const desktopCards = Array.from(document.querySelectorAll('.framer-1tq2jgu .ssr-variant:not(.hidden-72rtr7) a.framer-7Bi9P, .framer-v3he4g a.framer-7Bi9P')).map(a => ({
                    href: a.getAttribute('href'),
                    title: a.querySelector('.framer-giavb9')?.textContent?.trim(),
                    date: a.querySelector('.framer-gifdkw')?.textContent?.trim(),
                    img: a.querySelector('img')?.src,
                    display: window.getComputedStyle(a).display
                }));

                const mobileCards = Array.from(document.querySelectorAll('.framer-1tq2jgu .ssr-variant.hidden-72rtr7 a.framer-7Bi9P')).map(a => ({
                    href: a.getAttribute('href'),
                    title: a.querySelector('.framer-giavb9')?.textContent?.trim(),
                    date: a.querySelector('.framer-gifdkw')?.textContent?.trim(),
                    img: a.querySelector('img')?.src,
                    display: window.getComputedStyle(a).display
                }));

                return {
                    title,
                    coverSrc,
                    coverOpacity,
                    coverVisible,
                    headingOpacity,
                    headingTransform,
                    hasLoadingEl: !!loadingEl,
                    bodySnippet: bodyText,
                    desktopCards,
                    mobileCards
                };
            })()`);

            console.log(JSON.stringify(evalResult, null, 2));
        } catch (e) {
            console.error('Failed to inspect:', e);
        }
    }

    await cdp.stop();
}

main().catch(console.error);
