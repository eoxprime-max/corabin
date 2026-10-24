import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
    const cdp = new ChromeCDP(9230);
    await cdp.start();
    await cdp.setViewport(1440, 900);

    const logState = async (stepName) => {
        const state = await cdp.evaluate(`(() => {
            const h1 = document.querySelector('h1')?.textContent?.trim();
            const title = document.querySelector('#article-title')?.textContent?.trim();
            const url = window.location.href;
            const pathname = window.location.pathname;
            const coverSrc = document.querySelector('#article-cover-img')?.src;
            return { step: '${stepName}', url, pathname, h1, title, coverSrc: coverSrc ? coverSrc.slice(-40) : null };
        })()`);
        console.log(JSON.stringify(state));
    };

    console.log('--- STARTING NAVIGATION FLOW TEST ---');

    // 1. Navigate to /blog/
    console.log('\nStep 1: Navigate to /blog/');
    await cdp.navigate('http://localhost:8089/blog/');
    await new Promise(r => setTimeout(r, 2000));
    await logState('Step 1: /blog/');

    // 2. Click article A: custom-vs-off-the-shelf-choose-wisely
    console.log('\nStep 2: Click article A (custom-vs-off-the-shelf)');
    await cdp.evaluate(`(() => {
        const link = document.querySelector('a[href*="custom-vs-off-the-shelf-choose-wisely"]');
        if (link) link.click();
        else window.location.href = '/blog/custom-vs-off-the-shelf-choose-wisely/';
    })()`);
    await new Promise(r => setTimeout(r, 2500));
    await logState('Step 2: Article A');

    // 3. Back to /blog/
    console.log('\nStep 3: History Back to /blog/');
    await cdp.evaluate(`window.history.back()`);
    await new Promise(r => setTimeout(r, 2000));
    await logState('Step 3: Back to /blog/');

    // 4. Click article B: ch-skskmsnsm
    console.log('\nStep 4: Click article B (ch-skskmsnsm)');
    await cdp.evaluate(`(() => {
        const link = document.querySelector('a[href*="ch-skskmsnsm"]');
        if (link) link.click();
        else window.location.href = '/blog/ch-skskmsnsm/';
    })()`);
    await new Promise(r => setTimeout(r, 2500));
    await logState('Step 4: Article B');

    // 5. Back to /blog/
    console.log('\nStep 5: History Back to /blog/');
    await cdp.evaluate(`window.history.back()`);
    await new Promise(r => setTimeout(r, 2000));
    await logState('Step 5: Back to /blog/');

    // 6. Forward to article B
    console.log('\nStep 6: History Forward to Article B');
    await cdp.evaluate(`window.history.forward()`);
    await new Promise(r => setTimeout(r, 2500));
    await logState('Step 6: Forward to Article B');

    console.log('\n--- NAVIGATION FLOW TEST COMPLETE ---');
    await cdp.stop();
}

main().catch(console.error);
