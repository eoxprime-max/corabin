import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function testPage(url) {
    const cdp = new ChromeCDP(9781);
    await cdp.start();
    await cdp.setViewport(390, 844);

    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

    const requests = new Map();

    const listener = (event) => {
        try {
            const msg = JSON.parse(event.data);
            if (msg.method === 'Network.requestWillBeSent') {
                requests.set(msg.params.requestId, {
                    url: msg.params.request.url,
                    type: msg.params.type,
                    status: null,
                    contentEncoding: null,
                    contentLengthHeader: null,
                    encodedBytes: 0,
                    fromCache: false
                });
            } else if (msg.method === 'Network.responseReceived') {
                const req = requests.get(msg.params.requestId);
                if (req) {
                    const r = msg.params.response;
                    req.status = r.status;
                    req.contentEncoding = r.headers['content-encoding'] || 'none';
                    req.contentLengthHeader = r.headers['content-length'] || null;
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

    console.log(`Navigating to: ${url}`);
    await cdp.navigate(url);

    // Wait for hydration stabilization
    await new Promise(r => setTimeout(r, 4000));

    cdp.ws.removeEventListener('message', listener);
    await cdp.stop();

    console.log(`\n=== Requests Breakdown for ${url} (Cache Disabled) ===`);
    let totalTransfer = 0;
    let docTransfer = 0;
    for (const [id, req] of requests) {
        totalTransfer += req.encodedBytes;
        if (req.type === 'Document') {
            docTransfer = req.encodedBytes;
        }
        console.log(`[${req.type}] Status: ${req.status} | Encoding: ${req.contentEncoding} | CL Header: ${req.contentLengthHeader} | Encoded: ${req.encodedBytes} bytes | Cache: ${req.fromCache} | URL: ${req.url.slice(0, 80)}`);
    }

    console.log(`\nDocument Transfer: ${docTransfer} bytes (${(docTransfer / 1024).toFixed(1)} KB)`);
    console.log(`Total Transfer: ${totalTransfer} bytes (${(totalTransfer / 1024).toFixed(1)} KB)`);
}

testPage('http://localhost:8088/blog/custom-vs-off-the-shelf-choose-wisely/').catch(console.error);
