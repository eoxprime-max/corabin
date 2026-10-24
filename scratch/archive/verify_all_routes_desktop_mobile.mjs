import { ChromeCDP } from '../tools/cdp_helper.mjs';
import fs from 'fs';

const routes = [
    { name: 'Homepage', path: '/', isArticle: false, isUnavailable: false },
    { name: 'Blog Listing', path: '/blog/', isArticle: false, isUnavailable: false },
    { name: 'Article 1 (7 Steps)', path: '/blog/7-critical-steps-to-successfully-launch-your-digital-product/', isArticle: true, isUnavailable: false },
    { name: 'Article 2 (Tech Stack)', path: '/blog/choosing-the-right-tech-stack-a-decision-framework-for-2025/', isArticle: true, isUnavailable: false },
    { name: 'Article 3 (Custom vs Off Shelf)', path: '/blog/custom-vs-off-the-shelf-choose-wisely/', isArticle: true, isUnavailable: false },
    { name: 'Article 4 (Design that Converts)', path: '/blog/design-that-converts-our-approach/', isArticle: true, isUnavailable: false },
    { name: 'Article 5 (Headless CMS)', path: '/blog/headless-cms-the-future-is-here/', isArticle: true, isUnavailable: false },
    { name: 'Article 6 (IDX SEO)', path: '/blog/idx-listings-not-showing-google/', isArticle: true, isUnavailable: false },
    { name: 'Article 7 (Real Estate Cost)', path: '/blog/real-estate-agent-website-cost-2026/', isArticle: true, isUnavailable: false },
    { name: 'Article 8 (Speed up Website)', path: '/blog/speed-up-your-website-today/', isArticle: true, isUnavailable: false },
    { name: 'Article 9 (API Mistakes)', path: '/blog/stop-making-these-common-api-mistakes/', isArticle: true, isUnavailable: false },
    { name: 'Article 10 (Technical Debt)', path: '/blog/technical-debt-friend-or-foe/', isArticle: true, isUnavailable: false },
    { name: 'Article 11 (Website Security)', path: '/blog/website-security-made-simple/', isArticle: true, isUnavailable: false },
    { name: 'Article 12 (Design Systems)', path: '/blog/why-design-systems-actually-matter/', isArticle: true, isUnavailable: false },
    { name: 'Article 13 (Why Agent Needs Website)', path: '/blog/why-every-real-estate-agent-needs-a-website-in-2026/', isArticle: true, isUnavailable: false },
    { name: 'Missing Slug Route', path: '/blog/nonexistent-article-xyz-12345/', isArticle: true, isUnavailable: true }
];

async function testRoute(cdp, route, viewport) {
    const url = 'http://localhost:8088' + route.path;
    const errors = [];
    const failedRequests = [];
    const requestsMap = new Map();

    const listener = (event) => {
        try {
            const msg = JSON.parse(event.data);
            if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
                errors.push(msg.params.args.map(a => a.value || a.description || '').join(' '));
            } else if (msg.method === 'Runtime.exceptionThrown') {
                errors.push(msg.params.exceptionDetails.text + ': ' + (msg.params.exceptionDetails.exception?.description || ''));
            } else if (msg.method === 'Network.requestWillBeSent') {
                requestsMap.set(msg.params.requestId, msg.params.request.url);
            } else if (msg.method === 'Network.loadingFailed') {
                if (msg.params.errorText !== 'net::ERR_ABORTED' && !msg.params.canceled) {
                    const reqUrl = requestsMap.get(msg.params.requestId) || msg.params.requestId;
                    failedRequests.push({ url: reqUrl, error: msg.params.errorText });
                }
            } else if (msg.method === 'Network.responseReceived') {
                if (msg.params.response.status >= 400 && msg.params.response.status !== 404) {
                    failedRequests.push({ url: msg.params.response.url, status: msg.params.response.status });
                }
            }
        } catch (e) {}
    };

    cdp.ws.addEventListener('message', listener);
    await cdp.navigate(url);

    // Dynamic readiness polling loop (up to 8 seconds)
    for (let i = 0; i < 80; i++) {
        const ready = await cdp.evaluate(`(() => {
            if (${route.isUnavailable}) {
                return Boolean(document.querySelector('.article-unavailable-container') && document.title.includes('Unavailable'));
            }
            if (${route.isArticle}) {
                return Boolean(document.querySelector('#article-body-content p, .framer-1272rho p') && document.title !== 'Article — Corabin');
            }
            if (window.location.pathname === '/blog/') {
                return document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container').length >= 10;
            }
            // Homepage
            const visibleCards = Array.from(document.querySelectorAll('a.framer-7Bi9P')).filter(a => a.offsetParent !== null);
            return visibleCards.length === 3;
        })()`);
        if (ready) break;
        await new Promise(r => setTimeout(r, 100));
    }

    // Short settling window
    await new Promise(r => setTimeout(r, 1000));

    const check = await cdp.evaluate(`(() => {
        const title = document.title;
        const h1 = document.querySelector('h1')?.textContent?.trim() || '';
        if (${route.isUnavailable}) {
            const unavail = document.querySelector('.article-unavailable-container');
            return {
                title,
                h1,
                hydrated: !!unavail,
                marker: 'Unavailable UI: ' + !!unavail
            };
        }
        if (${route.isArticle}) {
            const pCount = document.querySelectorAll('#article-body-content p, .framer-1272rho p').length;
            const cover = document.querySelector('#article-cover-img, [data-framer-name="Background Image"] img, .framer-z182eh img')?.getAttribute('src');
            return {
                title,
                h1,
                hydrated: pCount > 0,
                marker: pCount + ' paragraphs, cover: ' + (cover ? 'present' : 'none')
            };
        }
        if (window.location.pathname === '/blog/') {
            const featCards = Array.from(document.querySelectorAll('.framer-ugj76m a.framer-7Bi9P, .framer-3lukgt a.framer-7Bi9P')).filter(a => a.offsetParent !== null).length;
            const regCards = document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container').length;
            return {
                title,
                h1,
                hydrated: featCards === 3 && regCards === 10,
                marker: featCards + ' visible feat cards, ' + regCards + ' reg cards'
            };
        }
        // Homepage
        const homeCards = Array.from(document.querySelectorAll('a.framer-7Bi9P')).filter(a => a.offsetParent !== null).length;
        return {
            title,
            h1,
            hydrated: homeCards === 3,
            marker: homeCards + ' visible home cards'
        };
    })()`);

    cdp.ws.removeEventListener('message', listener);

    return {
        name: route.name,
        path: route.path,
        viewport: viewport.label,
        errorsCount: errors.length,
        errors,
        failedRequestsCount: failedRequests.length,
        failedRequests,
        title: check?.title,
        h1: check?.h1,
        hydrated: check?.hydrated,
        marker: check?.marker
    };
}

async function run() {
    console.log('======================================================================');
    console.log('PHASE 4.1 FINAL INDEPENDENT VERIFICATION: DESKTOP & MOBILE');
    console.log('16 Routes x 2 Viewports = 32 Test Suites');
    console.log('======================================================================\n');

    const viewports = [
        { label: 'Desktop (1440x900)', width: 1440, height: 900, port: 9840 },
        { label: 'Mobile (390x844)', width: 390, height: 844, port: 9841 }
    ];

    const allResults = [];

    for (const vp of viewports) {
        console.log(`\n>>> Testing Viewport: ${vp.label} <<<`);
        const cdp = new ChromeCDP(vp.port);
        await cdp.start();
        await cdp.setViewport(vp.width, vp.height);
        await cdp.send('Network.enable');
        await cdp.send('Runtime.enable');

        for (const r of routes) {
            process.stdout.write(`  [${vp.label}] Testing ${r.name} (${r.path})... `);
            const res = await testRoute(cdp, r, vp);
            allResults.push(res);
            if (res.errorsCount === 0 && res.failedRequestsCount === 0 && res.hydrated) {
                console.log(`✅ OK | H1: "${res.h1.slice(0, 30)}..." | ${res.marker}`);
            } else {
                console.log(`❌ FAILED | Errors: ${res.errorsCount}, FailedReqs: ${res.failedRequestsCount}, Hydrated: ${res.hydrated}`);
                if (res.errors.length) console.log('    Errors:', res.errors);
                if (res.failedRequests.length) console.log('    FailedReqs:', res.failedRequests);
            }
        }
        await cdp.stop();
    }

    fs.writeFileSync('scratch/all_routes_verification_results.json', JSON.stringify(allResults, null, 2));
    console.log('\n======================================================================');
    const passed = allResults.filter(r => r.errorsCount === 0 && r.failedRequestsCount === 0 && r.hydrated);
    console.log(`FINAL RESULT: ${passed.length} / ${allResults.length} (${(passed.length/allResults.length*100).toFixed(1)}%) TESTS PASSED!`);
    console.log('======================================================================');
}

run().catch(console.error);
