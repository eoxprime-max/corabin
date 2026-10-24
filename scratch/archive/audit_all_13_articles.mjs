import { ChromeCDP } from '../tools/cdp_helper.mjs';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('screenshots/phase3');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const SLUGS = [
  '7-critical-steps-to-successfully-launch-your-digital-product',
  'choosing-the-right-tech-stack-a-decision-framework-for-2025',
  'custom-vs-off-the-shelf-choose-wisely',
  'design-that-converts-our-approach',
  'headless-cms-the-future-is-here',
  'idx-listings-not-showing-google',
  'real-estate-agent-website-cost-2026',
  'speed-up-your-website-today',
  'stop-making-these-common-api-mistakes',
  'technical-debt-friend-or-foe',
  'website-security-made-simple',
  'why-design-systems-actually-matter',
  'why-every-real-estate-agent-needs-a-website-in-2026'
];

const VIEWPORTS = [
  { name: 'desktop', w: 1440, h: 900 },
  { name: 'mobile', w: 390, h: 844 }
];

async function inspectPage(cdp, url) {
  const consoleErrors = [];
  const networkRequests = [];

  const listener = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          consoleErrors.push(msg.params.args.map(a => a.value || a.description || '').join(' '));
        }
      } else if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
      } else if (msg.method === 'Network.requestWillBeSent') {
        networkRequests.push(msg.params.request.url);
      }
    } catch (e) {}
  };

  cdp.ws.addEventListener('message', listener);
  await cdp.send('Network.enable');

  await cdp.navigate(url);
  // Wait for Supabase hydration and DOM stabilization
  await new Promise(r => setTimeout(r, 2500));

  const data = await cdp.evaluate(`(() => {
    function getComp(sel) {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 80),
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        color: cs.color
      };
    }

    const cover = document.querySelector('#article-cover-img, [data-framer-name="Background Image"] img, .framer-z182eh img');
    const avatar = document.querySelector('[data-framer-name="Photo"] img');
    const bodyP = document.querySelectorAll('#article-body-content p, .framer-1272rho p');
    const bodyH2 = document.querySelectorAll('#article-body-content h2, .framer-1272rho h2');
    const bodyH3 = document.querySelectorAll('#article-body-content h3, .framer-1272rho h3');
    const bodyUl = document.querySelectorAll('#article-body-content ul, .framer-1272rho ul');
    const bodyOl = document.querySelectorAll('#article-body-content ol, .framer-1272rho ol');
    const bodyTable = document.querySelectorAll('#article-body-content table, .framer-1272rho table');
    const footer = document.querySelector('footer');
    const nav = document.querySelector('header, .framer-riypkh-container');

    return {
      docTitle: document.title,
      h1: getComp('h1'),
      excerpt: getComp('#article-excerpt, .framer-1ig6rss h2, [data-framer-name="Excerpt"] h2'),
      author: getComp('#article-author, .framer-y7unnl p'),
      date: getComp('#article-date, .framer-ybkmy p, .framer-ybkmy time'),
      cover: cover ? {
        src: cover.getAttribute('src') || cover.src,
        hasSrcset: Boolean(cover.getAttribute('srcset') || cover.srcset),
        complete: cover.complete,
        naturalWidth: cover.naturalWidth
      } : null,
      avatar: avatar ? {
        src: avatar.getAttribute('src') || avatar.src,
        complete: avatar.complete
      } : null,
      body: {
        paragraphCount: bodyP.length,
        firstP: bodyP[0] ? getComp('#article-body-content p, .framer-1272rho p') : null,
        h2Count: bodyH2.length,
        h3Count: bodyH3.length,
        ulCount: bodyUl.length,
        olCount: bodyOl.length,
        tableCount: bodyTable.length
      },
      hasFooter: Boolean(footer),
      hasNav: Boolean(nav)
    };
  })()`);

  cdp.ws.removeEventListener('message', listener);
  return { data, consoleErrors, networkRequests };
}

async function run() {
  console.log('==================================================================');
  console.log('CORABIN PHASE 3: COMPREHENSIVE ARTICLE AUDIT (12 EXISTING + 1 NEW)');
  console.log('==================================================================\n');

  const cdp = new ChromeCDP(9570);
  await cdp.start();

  const auditReport = [];

  for (let i = 0; i < SLUGS.length; i++) {
    const slug = SLUGS[i];
    const isNew = slug === 'why-every-real-estate-agent-needs-a-website-in-2026';
    console.log(`\n--------------------------------------------------------------`);
    console.log(`[${i + 1}/13] Auditing slug: ${slug} ${isNew ? '(NEW ARTICLE)' : ''}`);
    console.log(`--------------------------------------------------------------`);

    const resultRecord = {
      slug,
      isNew,
      viewports: {}
    };

    for (const vp of VIEWPORTS) {
      await cdp.setViewport(vp.w, vp.h);

      let origData = null;
      let origErrors = [];
      if (!isNew) {
        // Original static page on port 8088
        const origUrl = `http://localhost:8088/blog/${slug}/`;
        const origRes = await inspectPage(cdp, origUrl);
        origData = origRes.data;
        origErrors = origRes.consoleErrors;

        const origShotPath = path.join(outDir, `${slug}__${vp.name}__original.png`);
        await cdp.captureScreenshot(origShotPath);
      }

      // Shared template page
      const sharedUrl = isNew
        ? `http://localhost:8088/blog/${slug}/`
        : `http://localhost:8088/blog/article.html?slug=${slug}`;
      const sharedRes = await inspectPage(cdp, sharedUrl);
      const sharedData = sharedRes.data;
      const sharedErrors = sharedRes.consoleErrors;

      const sharedShotPath = path.join(outDir, `${slug}__${vp.name}__shared.png`);
      await cdp.captureScreenshot(sharedShotPath);

      // Check differences
      const diffs = [];
      if (origData && sharedData) {
        if (origData.h1?.text !== sharedData.h1?.text) {
          diffs.push(`H1 text mismatch: orig="${origData.h1?.text}" vs shared="${sharedData.h1?.text}"`);
        }
        if (origData.h1?.fontSize !== sharedData.h1?.fontSize) {
          diffs.push(`H1 fontSize: orig=${origData.h1?.fontSize} vs shared=${sharedData.h1?.fontSize}`);
        }
        if (origData.h1?.fontFamily !== sharedData.h1?.fontFamily) {
          diffs.push(`H1 fontFamily: orig=${origData.h1?.fontFamily} vs shared=${sharedData.h1?.fontFamily}`);
        }
        if (origData.author?.text !== sharedData.author?.text) {
          diffs.push(`Author: orig="${origData.author?.text}" vs shared="${sharedData.author?.text}"`);
        }
        if (origData.date?.text !== sharedData.date?.text) {
          diffs.push(`Date: orig="${origData.date?.text}" vs shared="${sharedData.date?.text}"`);
        }
        if (origData.body.firstP?.fontSize !== sharedData.body.firstP?.fontSize) {
          diffs.push(`Body fontSize: orig=${origData.body.firstP?.fontSize} vs shared=${sharedData.body.firstP?.fontSize}`);
        }
        if (origData.body.firstP?.lineHeight !== sharedData.body.firstP?.lineHeight) {
          diffs.push(`Body lineHeight: orig=${origData.body.firstP?.lineHeight} vs shared=${sharedData.body.firstP?.lineHeight}`);
        }
      }

      console.log(`  [${vp.name.toUpperCase()} ${vp.w}x${vp.h}]`);
      console.log(`    Title: "${sharedData.h1?.text?.slice(0, 45)}..."`);
      console.log(`    Date: ${sharedData.date?.text} | Author: ${sharedData.author?.text}`);
      console.log(`    Cover: ${sharedData.cover?.src?.slice(0, 50)}... (naturalWidth: ${sharedData.cover?.naturalWidth})`);
      console.log(`    Body: ${sharedData.body.paragraphCount} paragraphs, ${sharedData.body.h2Count} H2s, ${sharedData.body.h3Count} H3s, ${sharedData.body.ulCount} ULs, ${sharedData.body.olCount} OLs`);
      console.log(`    Errors: ${sharedErrors.length === 0 ? '0' : sharedErrors.join('; ')}`);
      console.log(`    Framer Parity: ${diffs.length === 0 ? '✅ 100% MATCH' : '⚠️ ' + diffs.join('; ')}`);

      resultRecord.viewports[vp.name] = {
        diffs,
        origData,
        sharedData,
        sharedErrors
      };
    }

    auditReport.push(resultRecord);
  }

  await cdp.stop();

  fs.writeFileSync(path.join(outDir, 'audit_report.json'), JSON.stringify(auditReport, null, 2));
  console.log('\n==================================================================');
  console.log(`AUDIT COMPLETE! Results saved to ${path.join(outDir, 'audit_report.json')}`);
  console.log(`Screenshots saved to ${outDir}`);
  console.log('==================================================================');
}

run().catch(console.error);
