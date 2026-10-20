#!/usr/bin/env node
/**
 * tools/run_visual_fidelity_audit.mjs
 * ===================================
 * Automated visual fidelity verification runner for Corabin blog template.
 * Compares all 12 original Framer blog pages (:8089) against
 * the shared template pages with live Supabase content (:8088).
 *
 * Viewports:
 * - Desktop: 1440 × 900
 * - Tablet:  768 × 1024
 * - Mobile:  390 × 844
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SCREENSHOT_DIR = path.join(PROJECT_ROOT, 'screenshots', 'visual_fidelity');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const SLUGS = [
  'custom-vs-off-the-shelf-choose-wisely',
  'design-that-converts-our-approach',
  '7-critical-steps-to-successfully-launch-your-digital-product',
  'choosing-the-right-tech-stack-a-decision-framework-for-2025',
  'speed-up-your-website-today',
  'why-design-systems-actually-matter',
  'headless-cms-the-future-is-here',
  'stop-making-these-common-api-mistakes',
  'website-security-made-simple',
  'technical-debt-friend-or-foe',
  'idx-listings-not-showing-google',
  'real-estate-agent-website-cost-2026'
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, isMobile: false },
  { name: 'tablet',  width: 768,  height: 1024, isMobile: false },
  { name: 'mobile',  width: 390,  height: 844,  isMobile: true }
];

class ChromeClient {
  constructor(port = 9222) {
    this.port = port;
    this.chromeProc = null;
    this.ws = null;
    this.msgId = 0;
    this.callbacks = new Map();
  }

  async start() {
    this.chromeProc = spawn('google-chrome', [
      '--headless=new',
      `--remote-debugging-port=${this.port}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-sync',
      '--disable-translate',
      '--hide-scrollbars',
      'about:blank'
    ], { stdio: 'ignore' });

    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const target = await this.getPageTarget();
        if (target && target.webSocketDebuggerUrl) {
          await this.connectWs(target.webSocketDebuggerUrl);
          await this.send('Page.enable');
          await this.send('Runtime.enable');
          return;
        }
      } catch (e) {}
    }
    throw new Error('Failed to connect to Chrome CDP Page target');
  }

  getPageTarget() {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${this.port}/json/list`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const list = JSON.parse(data);
            const page = list.find(t => t.type === 'page');
            resolve(page || list[0]);
          } catch (e) {
            resolve(null);
          }
        });
      }).on('error', reject);
    });
  }

  connectWs(url) {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => resolve();
      this.ws.onerror = err => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { res, rej } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) rej(new Error(msg.error.message));
          else res(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.callbacks.set(id, { res: resolve, rej: reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async setViewport(vp) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.isMobile
    });
    await this.send('Emulation.setVisibleSize', { width: vp.width, height: vp.height });
  }

  async navigateAndWait(url, timeoutMs = 15000) {
    await this.send('Page.navigate', { url });

    // Poll until content is rendered
    const pollExpr = `new Promise((resolve) => {
      const start = Date.now();
      const interval = setInterval(() => {
        const h1 = document.querySelector('h1');
        const p = document.querySelector('.framer-1272rho p') || document.querySelector('#content p');
        const state = document.querySelector('.corabin-supabase-state');
        if (h1 && p && !state) {
          clearInterval(interval);
          resolve(true);
        } else if (Date.now() - start > ${timeoutMs}) {
          clearInterval(interval);
          resolve(false);
        }
      }, 100);
    })`;

    await this.send('Runtime.evaluate', {
      expression: pollExpr,
      awaitPromise: true,
      returnByValue: true
    });

    // Small delay for font rendering and image layout
    await new Promise(r => setTimeout(r, 1200));

    // Scroll to top
    await this.send('Runtime.evaluate', {
      expression: 'window.scrollTo(0, 0); document.documentElement.scrollTop = 0;'
    });
    await new Promise(r => setTimeout(r, 200));
  }

  async extractStyles() {
    const code = `(() => {
      function get(sel) {
        const el = document.querySelector(sel);
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          rect: { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) },
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          color: cs.color,
          backgroundColor: cs.backgroundColor
        };
      }
      return {
        h1: get('.framer-1ltkmql h1') || get('#hero h1') || get('h1'),
        hero: get('#hero'),
        author: get('.framer-y7unnl p') || get('.framer-16ganb5 p'),
        date: get('.framer-ybkmy p'),
        bodyH2: get('#content h2'),
        bodyH3: get('#content h3') || get('.framer-1272rho h3'),
        bodyP: get('#content p') || get('.framer-1272rho p'),
        bodyContainer: get('.framer-1272rho'),
        footer: get('footer')
      };
    })()`;

    const res = await this.send('Runtime.evaluate', {
      expression: code,
      returnByValue: true
    });
    return res.result ? res.result.value : null;
  }

  async captureScreenshot(filePath, vp) {
    const res = await this.send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 0,
        y: 0,
        width: vp.width,
        height: vp.height,
        scale: 1
      }
    });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
  }

  async stop() {
    if (this.ws) {
      try { this.ws.close(); } catch (e) {}
    }
    if (this.chromeProc) {
      try { this.chromeProc.kill(); } catch (e) {}
    }
  }
}

function compareImages(origPath, currPath, diffPath) {
  try {
    const cmd = `compare -metric RMSE "${origPath}" "${currPath}" "${diffPath}" 2>&1`;
    const out = execSync(cmd, { encoding: 'utf-8', shell: '/bin/bash' });
    const match = out.match(/\(([0-9.]+)\)/);
    const rmse = match ? parseFloat(match[1]) : 0;
    return { rmse, raw: out.trim() };
  } catch (err) {
    // ImageMagick compare returns exit code 1 if images differ
    const out = (err.stdout || err.stderr || '').toString();
    const match = out.match(/\(([0-9.]+)\)/);
    const rmse = match ? parseFloat(match[1]) : 1.0;
    return { rmse, raw: out.trim() };
  }
}

async function main() {
  console.log('===============================================================');
  console.log('🚀 CORABIN BLOG TEMPLATE VISUAL FIDELITY AUDIT');
  console.log(`Testing 12 slugs across 3 viewports = 36 total test pairs`);
  console.log('Original backup port: 8089 | Shared template port: 8088');
  console.log('===============================================================\n');

  const client = new ChromeClient(9400);
  await client.start();

  const auditResults = [];

  for (let sIdx = 0; sIdx < SLUGS.length; sIdx++) {
    const slug = SLUGS[sIdx];
    console.log(`\n-----------------------------------------------------------`);
    console.log(`[${sIdx + 1}/12] Auditing Slug: ${slug}`);
    console.log(`-----------------------------------------------------------`);

    for (const vp of VIEWPORTS) {
      const testName = `${slug}__${vp.name}`;
      const origPng = path.join(SCREENSHOT_DIR, `orig_${testName}.png`);
      const currPng = path.join(SCREENSHOT_DIR, `curr_${testName}.png`);
      const diffPng = path.join(SCREENSHOT_DIR, `diff_${testName}.png`);

      await client.setViewport(vp);

      // 1. Capture Original (:8089)
      const origUrl = `http://localhost:8089/blog/${slug}/`;
      await client.navigateAndWait(origUrl);
      const origStyles = await client.extractStyles();
      await client.captureScreenshot(origPng, vp);

      // 2. Capture Current Shared Template (:8088)
      const currUrl = `http://localhost:8088/blog/${slug}/`;
      await client.navigateAndWait(currUrl);
      const currStyles = await client.extractStyles();
      await client.captureScreenshot(currPng, vp);

      // 3. Image Comparison
      const diff = compareImages(origPng, currPng, diffPng);

      // 4. Style Comparison Metrics
      const styleDiffs = [];
      if (origStyles && currStyles) {
        if (origStyles.h1 && currStyles.h1) {
          if (origStyles.h1.fontSize !== currStyles.h1.fontSize) {
            styleDiffs.push(`H1 fontSize: orig=${origStyles.h1.fontSize} curr=${currStyles.h1.fontSize}`);
          }
          if (origStyles.h1.fontFamily !== currStyles.h1.fontFamily) {
            styleDiffs.push(`H1 fontFamily: orig=${origStyles.h1.fontFamily} curr=${currStyles.h1.fontFamily}`);
          }
        }
        if (origStyles.bodyP && currStyles.bodyP) {
          if (origStyles.bodyP.fontSize !== currStyles.bodyP.fontSize) {
            styleDiffs.push(`BodyP fontSize: orig=${origStyles.bodyP.fontSize} curr=${currStyles.bodyP.fontSize}`);
          }
          if (origStyles.bodyP.fontFamily !== currStyles.bodyP.fontFamily) {
            styleDiffs.push(`BodyP fontFamily: orig=${origStyles.bodyP.fontFamily} curr=${currStyles.bodyP.fontFamily}`);
          }
        }
        if (origStyles.hero && currStyles.hero) {
          const heroHeightDiff = Math.abs(origStyles.hero.rect.height - currStyles.hero.rect.height);
          if (heroHeightDiff > 15) {
            styleDiffs.push(`Hero height diff: ${heroHeightDiff}px (orig=${origStyles.hero.rect.height}, curr=${currStyles.hero.rect.height})`);
          }
          const heroTopDiff = Math.abs(origStyles.hero.rect.top - currStyles.hero.rect.top);
          if (heroTopDiff > 5) {
            styleDiffs.push(`Hero top diff: ${heroTopDiff}px (orig=${origStyles.hero.rect.top}, curr=${currStyles.hero.rect.top})`);
          }
        }
        if (origStyles.h1 && currStyles.h1) {
          const h1TopDiff = Math.abs(origStyles.h1.rect.top - currStyles.h1.rect.top);
          if (h1TopDiff > 10) {
            styleDiffs.push(`H1 top diff: ${h1TopDiff}px (orig=${origStyles.h1.rect.top}, curr=${currStyles.h1.rect.top})`);
          }
        }
        if (origStyles.date && currStyles.date) {
          const dateHeightDiff = Math.abs(origStyles.date.rect.height - currStyles.date.rect.height);
          if (dateHeightDiff > 10) {
            styleDiffs.push(`Date height diff: ${dateHeightDiff}px (orig=${origStyles.date.rect.height}, curr=${currStyles.date.rect.height})`);
          }
        }
      }

      const passed = diff.rmse < 0.35 && styleDiffs.length === 0;
      console.log(`  • ${vp.name.padEnd(8)} (${vp.width}x${vp.height}): RMSE = ${diff.rmse.toFixed(4)} | Style Diffs: ${styleDiffs.length === 0 ? 'None (MATCH)' : styleDiffs.join('; ')} -> ${passed ? '✅ PASS' : '⚠️ REVIEW'}`);

      auditResults.push({
        slug,
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        rmse: diff.rmse,
        passed,
        styleDiffs,
        origStyles,
        currStyles,
        screenshots: {
          orig: `screenshots/visual_fidelity/orig_${testName}.png`,
          curr: `screenshots/visual_fidelity/curr_${testName}.png`,
          diff: `screenshots/visual_fidelity/diff_${testName}.png`
        }
      });
    }
  }

  await client.stop();

  const reportPath = path.join(SCREENSHOT_DIR, 'audit_results.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));

  console.log('\n===============================================================');
  console.log(`✅ AUDIT COMPLETE! Results saved to: ${reportPath}`);
  const passCount = auditResults.filter(r => r.passed).length;
  console.log(`Summary: ${passCount} / ${auditResults.length} test pairs passed exact fidelity standards`);
  console.log('===============================================================\n');
}

main().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
