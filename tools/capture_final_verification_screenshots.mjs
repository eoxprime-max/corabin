#!/usr/bin/env node
import { ChromeCDP } from './cdp_helper.mjs';
import fs from 'node:fs';
import path from 'node:path';

const outDir = './screenshots/comparison';
fs.mkdirSync(outDir, { recursive: true });

async function capture() {
  const cdp = new ChromeCDP(9444);
  await cdp.start();

  const tests = [
    // 1. Blog Listing Original vs Corrected
    { name: 'original_listing_desktop', url: 'http://localhost:8089/blog/', w: 1440, h: 900 },
    { name: 'corrected_listing_desktop', url: 'http://localhost:8088/blog/', w: 1440, h: 900 },
    { name: 'original_listing_tablet', url: 'http://localhost:8089/blog/', w: 768, h: 1024 },
    { name: 'corrected_listing_tablet', url: 'http://localhost:8088/blog/', w: 768, h: 1024 },
    { name: 'original_listing_mobile', url: 'http://localhost:8089/blog/', w: 390, h: 844 },
    { name: 'corrected_listing_mobile', url: 'http://localhost:8088/blog/', w: 390, h: 844 },

    // 2. Original Article vs Shared Article vs Future Slug
    { name: 'original_article_desktop', url: 'http://localhost:8088/blog/custom-vs-off-the-shelf-choose-wisely/', w: 1440, h: 900 },
    { name: 'shared_article_direct_desktop', url: 'http://localhost:8088/blog/article.html?slug=custom-vs-off-the-shelf-choose-wisely', w: 1440, h: 900 },
    { name: 'future_slug_article_desktop', url: 'http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026', w: 1440, h: 900 },
    { name: 'future_slug_article_mobile', url: 'http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026', w: 390, h: 844 },
    { name: 'future_slug_unavailable_desktop', url: 'http://localhost:8088/blog/future-cms-article-test-12345', w: 1440, h: 900 },
  ];

  for (const t of tests) {
    console.log(`Capturing ${t.name} at ${t.w}x${t.h}...`);
    await cdp.setViewport(t.w, t.h);
    await cdp.navigate(t.url);
    for (let i = 0; i < 40; i++) {
      const isRendered = await cdp.evaluate('document.getElementById("main")?.dataset.rendered === "true" || document.querySelectorAll(".framer-ij7w41-container").length >= 7');
      if (isRendered) break;
      await new Promise(r => setTimeout(r, 100));
    }
    await new Promise(r => setTimeout(r, 800));
    await cdp.captureScreenshot(path.join(outDir, `${t.name}.png`));
    console.log(`Saved ${t.name}.png`);
  }

  await cdp.stop();
  console.log('All comparison screenshots captured successfully!');
}

capture().catch(console.error);
