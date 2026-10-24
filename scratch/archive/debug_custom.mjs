import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
    const cdp = new ChromeCDP(9231);
    await cdp.start();
    await cdp.setViewport(1440, 900);

    const consoleLogs = [];
    cdp.on('Runtime.consoleAPICalled', (params) => {
        consoleLogs.push({
            type: params.type,
            text: params.args.map(a => a.value || a.description).join(' ')
        });
    });

    const url = 'http://localhost:8089/blog/custom-vs-off-the-shelf-choose-wisely/';
    console.log(`Navigating to ${url}...`);
    await cdp.navigate(url);

    // Wait 3 seconds
    await new Promise(r => setTimeout(r, 3000));

    console.log('Console Logs:', consoleLogs);

    const debugInfo = await cdp.evaluate(`(() => {
        const slug = window.location.pathname;
        const livePost = window.__corabinLivePost;
        const publishedPosts = window.__corabinPublishedPosts;
        const gridEl = document.querySelector('.framer-k7mcxy .framer-3lukgt');
        const cards = Array.from(document.querySelectorAll('.framer-k7mcxy a.framer-7Bi9P')).map(a => ({
            href: a.getAttribute('href'),
            title: a.querySelector('.framer-giavb9 p')?.textContent,
            img: a.querySelector('img')?.src,
            dataPostSlug: a.getAttribute('data-post-slug')
        }));

        return {
            slug,
            hasLivePost: !!livePost,
            livePostSlug: livePost?.slug,
            publishedPostsCount: publishedPosts?.length,
            hasGridEl: !!gridEl,
            cards
        };
    })()`);

    console.log('Debug info:', JSON.stringify(debugInfo, null, 2));

    await cdp.stop();
}

main().catch(console.error);
