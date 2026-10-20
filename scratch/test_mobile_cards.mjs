import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function testMobile() {
  const cdp = new ChromeCDP(9335);
  await cdp.start();
  await cdp.setViewport(390, 844);
  await cdp.navigate('http://localhost:8088/blog/');
  await new Promise(r => setTimeout(r, 2500));

  const result = await cdp.evaluate(`(() => {
    const regularContainer = document.querySelector('.framer-18dht5n');
    const cards = Array.from(document.querySelectorAll('.framer-ij7w41-container')).map(c => {
      const a = c.querySelector('a');
      const rect = c.getBoundingClientRect();
      const style = window.getComputedStyle(c);
      return {
        href: a ? a.getAttribute('href') : null,
        visible: style.display !== 'none' && style.visibility !== 'hidden' && rect.height > 0,
        width: rect.width,
        height: rect.height,
        aClass: a ? a.className : null
      };
    });

    return {
      regularContainerFound: Boolean(regularContainer),
      cardsCount: cards.length,
      sampleCard: cards[0]
    };
  })()`);

  console.log('Mobile result:', result);
  await cdp.stop();
}

testMobile().catch(console.error);
