import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function verifyContentAndScroll(cdp, url, name) {
  console.log(`\nScrolling and inspecting ${url}...`);
  await cdp.navigate(url);
  await new Promise(r => setTimeout(r, 2000));

  // Check scroll & content details
  const details = await cdp.evaluate(`(() => {
    const headings = Array.from(document.querySelectorAll('#article-body-content h2, #article-body-content h3, .framer-1272rho h2, .framer-1272rho h3')).map(h => h.textContent.trim());
    const paragraphs = document.querySelectorAll('#article-body-content p, .framer-1272rho p').length;
    const scrollHeight = document.documentElement.scrollHeight;
    return { headings, paragraphs, scrollHeight };
  })()`);

  console.log(`Details for ${name}:`, details);

  // Scroll down to mid-page and take a screenshot of the body content
  await cdp.evaluate(`window.scrollTo(0, 700)`);
  await new Promise(r => setTimeout(r, 500));
  await cdp.captureScreenshot(`screenshots/phase1_${name}_body.png`);
  console.log(`Saved screenshots/phase1_${name}_body.png`);
}

async function run() {
  const cdp = new ChromeCDP(9334);
  try {
    await cdp.start();
    await cdp.setViewport(1280, 800);
    await verifyContentAndScroll(cdp, 'http://localhost:8088/blog/real-estate-agent-website-cost-2026/', 'real_estate_cost');
    await verifyContentAndScroll(cdp, 'http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026/', 'why_every_agent');
  } finally {
    await cdp.stop();
  }
}

run();
