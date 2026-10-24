import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function testListing() {
    const cdp = new ChromeCDP(9840);
    await cdp.start();
    await cdp.setViewport(390, 844);

    await cdp.navigate('http://localhost:8088/blog/');
    await new Promise(r => setTimeout(r, 4000));

    const info = await cdp.evaluate(`(() => {
        const featuredCards = [...document.querySelectorAll('.framer-ugj76m a, .framer-3lukgt a')].map(a => ({
            href: a.getAttribute('href'),
            title: a.querySelector('.framer-giavb9 p')?.textContent?.trim(),
            img: a.querySelector('img') ? {
                src: a.querySelector('img').getAttribute('src'),
                currentSrc: a.querySelector('img').currentSrc,
                srcset: a.querySelector('img').getAttribute('srcset'),
                sizes: a.querySelector('img').getAttribute('sizes'),
                loading: a.querySelector('img').getAttribute('loading'),
                naturalWidth: a.querySelector('img').naturalWidth,
                naturalHeight: a.querySelector('img').naturalHeight,
                width: a.querySelector('img').width,
                height: a.querySelector('img').height
            } : null
        }));

        const regularCards = [...document.querySelectorAll('.framer-ij7w41-container')].map(c => {
            const a = c.querySelector('a');
            const img = c.querySelector('img');
            return {
                slug: c.getAttribute('data-post-slug'),
                href: a?.getAttribute('href'),
                title: c.querySelector('.framer-1pz7yr3 p')?.textContent?.trim(),
                img: img ? {
                    src: img.getAttribute('src'),
                    currentSrc: img.currentSrc,
                    srcset: img.getAttribute('srcset'),
                    sizes: img.getAttribute('sizes'),
                    loading: img.getAttribute('loading'),
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    width: img.width,
                    height: img.height
                } : null
            };
        });

        return { featuredCards, regularCards };
    })()`);

    await cdp.stop();
    console.log(JSON.stringify(info, null, 2));
}

testListing().catch(console.error);
