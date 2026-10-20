import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function testLoadMore() {
  const cdp = new ChromeCDP(9338);
  await cdp.start();
  await cdp.setViewport(1440, 900);
  await cdp.navigate('http://localhost:8088/blog/');
  await new Promise(r => setTimeout(r, 2000));

  // Initial count of regular cards
  const initial = await cdp.evaluate(`(() => {
    return document.querySelectorAll('.framer-ij7w41-container').length;
  })()`);
  console.log('Initial cards count:', initial);

  // Click load more
  const clickResult = await cdp.evaluate(`(() => {
    const btn = document.querySelector('.framer-1xy7824') || document.querySelector('[data-framer-name="Load More"]');
    const innerBtn = btn ? btn.querySelector('.framer-18iqc63, .framer-vuzi6n') : null;
    const target = innerBtn || btn;
    if (target) {
      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return { clicked: true, tag: target.tagName, className: target.className };
    }
    return { clicked: false };
  })()`);
  console.log('Click result:', clickResult);

  await new Promise(r => setTimeout(r, 1000));

  const afterClick = await cdp.evaluate(`(() => {
    const cards = Array.from(document.querySelectorAll('.framer-ij7w41-container')).map(c => {
      const a = c.querySelector('a');
      return a ? a.getAttribute('href') : null;
    });
    return {
      count: cards.length,
      links: cards
    };
  })()`);
  console.log('After load more click:', afterClick);

  await cdp.stop();
}

testLoadMore().catch(console.error);
