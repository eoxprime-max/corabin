import { ChromeCDP } from '../tools/cdp_helper.mjs';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('screenshots/phase4');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function measurePageWithCacheDisabled(url, label, isUnavailableCheck = false) {
    const cdp = new ChromeCDP(9830);
    await cdp.start();
    await cdp.setViewport(390, 844);

    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

    const requests = new Map();
    const consoleErrors = [];
    let mainRequestId = null;

    const listener = (event) => {
        try {
            const msg = JSON.parse(event.data);
            if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
                consoleErrors.push(msg.params.args.map(a => a.value || a.description || '').join(' '));
            } else if (msg.method === 'Runtime.exceptionThrown') {
                consoleErrors.push(msg.params.exceptionDetails.text);
            } else if (msg.method === 'Network.requestWillBeSent') {
                const reqUrl = msg.params.request.url;
                if (!mainRequestId && (reqUrl === url || reqUrl === url.replace(/\/$/, ''))) {
                    mainRequestId = msg.params.requestId;
                }
                requests.set(msg.params.requestId, {
                    id: msg.params.requestId,
                    url: reqUrl,
                    type: msg.params.type || 'Other',
                    status: null,
                    contentEncoding: 'none',
                    contentLengthHeader: null,
                    encodedBytes: 0,
                    fromCache: false,
                    isMainDoc: false
                });
            } else if (msg.method === 'Network.responseReceived') {
                const req = requests.get(msg.params.requestId);
                if (req) {
                    const r = msg.params.response;
                    req.status = r.status;
                    req.contentEncoding = r.headers['content-encoding'] || r.headers['Content-Encoding'] || 'none';
                    req.contentLengthHeader = r.headers['content-length'] || r.headers['Content-Length'] || null;
                    req.fromCache = r.fromDiskCache || r.fromMemoryCache || false;
                }
            } else if (msg.method === 'Network.loadingFinished') {
                const req = requests.get(msg.params.requestId);
                if (req) {
                    req.encodedBytes = msg.params.encodedDataLength;
                }
            }
        } catch (e) {}
    };

    cdp.ws.addEventListener('message', listener);

    const t0 = Date.now();
    await cdp.navigate(url);

    // Wait for hydration or unavailable state
    for (let i = 0; i < 60; i++) {
        const ready = await cdp.evaluate(`(() => {
            if (${isUnavailableCheck}) {
                return Boolean(document.querySelector('.article-unavailable-container') && document.title.includes('Unavailable'));
            }
            if (window.location.pathname.startsWith('/blog/') && window.location.pathname !== '/blog/') {
                return Boolean(document.querySelector('#article-body-content p, .framer-1272rho p') && document.title !== 'Article — Corabin');
            }
            return document.readyState === 'complete';
        })()`);
        if (ready) break;
        await new Promise(r => setTimeout(r, 100));
    }

    // Settling time so all network requests finish
    await new Promise(r => setTimeout(r, 2500));
    const loadTimeMs = Date.now() - t0;

    const domInfo = await cdp.evaluate(`(() => {
        const title = document.title;
        const h1 = document.querySelector('h1')?.textContent?.trim() || '';
        const metaRobots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
        const coverImg = document.querySelector('#article-cover-img, [data-framer-name="Background Image"] img, .framer-z182eh img');
        const unavailableContainer = document.querySelector('.article-unavailable-container');
        const returnLink = document.querySelector('.article-unavailable-back-btn')?.getAttribute('href');
        const authorWrapper = document.querySelector('.framer-16ganb5');
        const authorVisible = authorWrapper ? window.getComputedStyle(authorWrapper).display !== 'none' : false;
        const paragraphs = document.querySelectorAll('#article-body-content p, .framer-1272rho p');

        return {
            title,
            h1,
            metaRobots,
            canonical,
            coverSrc: coverImg?.getAttribute('src') || coverImg?.src || '',
            coverSrcset: coverImg?.getAttribute('srcset') || '',
            coverLoading: coverImg?.getAttribute('loading') || '',
            coverFetchPriority: coverImg?.getAttribute('fetchpriority') || '',
            coverNaturalWidth: coverImg?.naturalWidth || 0,
            hasUnavailableUi: !!unavailableContainer,
            returnLink,
            authorVisible,
            paragraphCount: paragraphs.length
        };
    })()`);

    // Capture screenshot
    const ssData = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const ssPath = path.join(outDir, `${label}.png`);
    fs.writeFileSync(ssPath, Buffer.from(ssData.data, 'base64'));

    cdp.ws.removeEventListener('message', listener);
    await cdp.stop();

    // Identify main doc
    let mainDocReq = null;
    if (mainRequestId && requests.has(mainRequestId)) {
        mainDocReq = requests.get(mainRequestId);
        mainDocReq.isMainDoc = true;
    } else {
        // fallback: find first Document request
        for (const [id, req] of requests) {
            if (req.type === 'Document' && (req.url === url || req.url.startsWith('http://localhost:8088/blog/'))) {
                mainDocReq = req;
                req.isMainDoc = true;
                break;
            }
        }
    }

    const typeBreakdown = {};
    let totalEncodedBytes = 0;
    const reqList = [];

    for (const [id, req] of requests) {
        totalEncodedBytes += req.encodedBytes;
        typeBreakdown[req.type] = (typeBreakdown[req.type] || 0) + req.encodedBytes;
        reqList.push({
            url: req.url,
            type: req.type,
            status: req.status,
            contentEncoding: req.contentEncoding,
            contentLengthHeader: req.contentLengthHeader,
            encodedBytes: req.encodedBytes,
            fromCache: req.fromCache,
            isMainDoc: req.isMainDoc
        });
    }

    return {
        label,
        url,
        loadTimeMs,
        requestsCount: reqList.length,
        mainDocument: {
            url: mainDocReq?.url || url,
            status: mainDocReq?.status || 200,
            contentEncoding: mainDocReq?.contentEncoding || 'none',
            contentLengthHeader: mainDocReq?.contentLengthHeader,
            encodedBytes: mainDocReq?.encodedBytes || 0,
            encodedKB: ((mainDocReq?.encodedBytes || 0) / 1024).toFixed(1)
        },
        totalEncodedBytes,
        totalEncodedKB: (totalEncodedBytes / 1024).toFixed(1),
        typeBreakdownKB: Object.fromEntries(
            Object.entries(typeBreakdown).map(([k, v]) => [k, (v / 1024).toFixed(1)])
        ),
        consoleErrors,
        domInfo,
        reqList
    };
}

async function run() {
    console.log('======================================================================');
    console.log('CORABIN PHASE 4: ACCURATE CACHE-DISABLED MOBILE PERFORMANCE BENCHMARK');
    console.log('Mobile Viewport: 390 x 844 | Cache: DISABLED | Wire Measurement');
    console.log('======================================================================\n');

    const tests = [
        { url: 'http://localhost:8088/blog/custom-vs-off-the-shelf-choose-wisely/', label: 'mobile_local_cover', unavail: false },
        { url: 'http://localhost:8088/blog/real-estate-agent-website-cost-2026/', label: 'mobile_cloudinary_cover', unavail: false },
        { url: 'http://localhost:8088/blog/', label: 'mobile_blog_listing', unavail: false },
        { url: 'http://localhost:8088/blog/nonexistent-article-xyz-12345/', label: 'mobile_unavailable_slug', unavail: true }
    ];

    const results = [];
    for (const t of tests) {
        console.log(`Running benchmark on: ${t.label} (${t.url})...`);
        const res = await measurePageWithCacheDisabled(t.url, t.label, t.unavail);
        results.push(res);
        console.log(`  -> Load Time: ${res.loadTimeMs}ms`);
        console.log(`  -> Requests: ${res.requestsCount}`);
        console.log(`  -> Primary Document Size: ${res.mainDocument.encodedBytes.toLocaleString()} bytes (${res.mainDocument.encodedKB} KB, encoding: ${res.mainDocument.contentEncoding}, status: ${res.mainDocument.status})`);
        console.log(`  -> Total Page Wire Transfer: ${res.totalEncodedBytes.toLocaleString()} bytes (${res.totalEncodedKB} KB)`);
        console.log(`  -> Type Breakdown: ${JSON.stringify(res.typeBreakdownKB)}`);
        console.log(`  -> H1: "${res.domInfo.h1}"`);
        console.log(`  -> Title: "${res.domInfo.title}"`);
        if (t.unavail) {
            console.log(`  -> Unavailable UI: ${res.domInfo.hasUnavailableUi} | Back link: "${res.domInfo.returnLink}" | Robots: "${res.domInfo.metaRobots}" | Canonical: "${res.domInfo.canonical}"`);
        } else {
            console.log(`  -> Cover Image: ${res.domInfo.coverSrc.slice(0, 65)}... (naturalWidth: ${res.domInfo.coverNaturalWidth}, loading: ${res.domInfo.coverLoading}, priority: ${res.domInfo.coverFetchPriority})`);
            console.log(`  -> Paragraphs: ${res.domInfo.paragraphCount}`);
        }
        console.log(`  -> Console errors: ${res.consoleErrors.length}\n`);
    }

    fs.writeFileSync('scratch/phase4_verified_cache_disabled_results.json', JSON.stringify(results, null, 2));
    console.log('Results saved to scratch/phase4_verified_cache_disabled_results.json');
}

run().catch(console.error);
