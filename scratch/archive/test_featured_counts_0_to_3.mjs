/**
 * Test Suite: Verification of 0, 1, 2, and 3 Featured Posts Behavior
 *
 * Verifies:
 * 1. Only posts explicitly marked `featured: true` appear in featured grid (max 3).
 * 2. No automatic promotion of newest unfeatured posts.
 * 3. Featured section on /blog/ correctly displays 0, 1, 2, or 3 cards without duplicate cards.
 * 4. Regular listing adjusts dynamically (13, 12, 11, or 10 regular cards).
 */

import { ChromeCDP } from '../tools/cdp_helper.mjs';

function fulfillJson(cdp, requestId, obj) {
    return cdp.send('Fetch.fulfillRequest', {
        requestId,
        responseCode: 200,
        responseHeaders: [
            { name: 'content-type', value: 'application/json' },
            { name: 'access-control-allow-origin', value: '*' },
            { name: 'access-control-allow-headers', value: '*' }
        ],
        body: Buffer.from(JSON.stringify(obj)).toString('base64')
    });
}

async function waitForCondition(cdp, expr, maxAttempts = 40, intervalMs = 100) {
    for (let i = 0; i < maxAttempts; i++) {
        const val = await cdp.evaluate(expr);
        if (val) return val;
        await new Promise(r => setTimeout(r, intervalMs));
    }
    return null;
}

async function testFeaturedScenario(featuredCount, port) {
    console.log(`\n--- Testing Scenario: Exactly ${featuredCount} Featured Post(s) ---`);
    const cdp = new ChromeCDP(port);
    try {
        await cdp.start();
        await cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*supabase.co*' }] });

        cdp.on('Fetch.requestPaused', async (params) => {
            const url = params.request.url;
            if (url.includes('order=published_at.desc')) {
                const liveRes = await fetch(url, { headers: { 'apikey': 'sb_publishable_c2_9jMvBS9iNxTqX9eyj2Q_oG0t2oVl' } });
                const liveData = await liveRes.json();
                // Set exactly featuredCount posts to featured: true, and all others to false
                const modified = liveData.map((p, idx) => ({
                    ...p,
                    featured: idx < featuredCount
                }));
                await fulfillJson(cdp, params.requestId, modified);
            } else {
                await cdp.send('Fetch.continueRequest', { requestId: params.requestId });
            }
        });

        await cdp.navigate('http://localhost:8088/blog/');
        await waitForCondition(cdp, `document.querySelectorAll(".framer-18dht5n .framer-ij7w41-container").length >= ${13 - featuredCount}`, 45, 100);

        const result = await cdp.evaluate(`(() => {
            const grid = document.querySelector('.framer-ugj76m');
            const gridVisible = grid ? (grid.style.display !== 'none' && grid.offsetParent !== null) : false;
            
            // Collect visible featured card links
            const visibleFeatCards = grid ? Array.from(grid.querySelectorAll('a.framer-7Bi9P')).filter(a => {
                const container = a.closest('.framer-b3is9r-container, .framer-hww4bo-container, .ssr-variant');
                return a.offsetParent !== null && (!container || container.style.display !== 'none');
            }) : [];

            const featSlugs = Array.from(new Set(visibleFeatCards.map(a => a.getAttribute('data-post-slug')).filter(Boolean)));
            
            // Collect visible regular cards
            const regCards = Array.from(document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container'));
            const regSlugs = regCards.map(c => c.getAttribute('data-post-slug')).filter(Boolean);

            const duplicates = featSlugs.filter(s => regSlugs.includes(s));

            return {
                gridVisible,
                visibleFeatCount: featSlugs.length,
                featSlugs,
                regCount: regCards.length,
                duplicates
            };
        })()`);

        console.log(`  Grid Visible: ${result.gridVisible}`);
        console.log(`  Visible Featured Slugs (${result.visibleFeatCount}):`, result.featSlugs);
        console.log(`  Regular Cards Count: ${result.regCount} (Expected: ${13 - featuredCount})`);
        console.log(`  Duplicate Count: ${result.duplicates.length}`);

        const passed = (
            (featuredCount === 0 ? !result.gridVisible || result.visibleFeatCount === 0 : result.visibleFeatCount === featuredCount) &&
            result.regCount === (13 - featuredCount) &&
            result.duplicates.length === 0
        );

        if (passed) {
            console.log(`  ✅ Passed: Exactly ${featuredCount} featured cards, ${13 - featuredCount} regular cards, 0 duplicates.`);
            return true;
        } else {
            console.error(`  ❌ Failed: Scenario ${featuredCount} did not match expected counts.`);
            return false;
        }
    } finally {
        await cdp.stop();
    }
}

async function main() {
    console.log('======================================================================');
    console.log('CORABIN FEATURED POSTS MATRIX TEST (0, 1, 2, 3 POSTS)');
    console.log('Testing: Strict featured:true enforcement without auto-promotion');
    console.log('======================================================================');

    let passed = 0;
    for (let count = 0; count <= 3; count++) {
        const ok = await testFeaturedScenario(count, 9600 + count);
        if (ok) passed++;
    }

    console.log('\n======================================================================');
    console.log(`RESULTS: ${passed} / 4 FEATURED SCENARIOS PASSED!`);
    console.log('======================================================================');
    process.exit(passed === 4 ? 0 : 1);
}

main().catch(err => {
    console.error('Fatal error in featured tests:', err);
    process.exit(1);
});
