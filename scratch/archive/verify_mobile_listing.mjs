import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function verifyMobileListing() {
  const cdp = new ChromeCDP(9342);
  await cdp.start();
  await cdp.setViewport(390, 844);
  console.log('Navigating to http://localhost:8088/blog/ on mobile (390x844)...');
  await cdp.navigate('http://localhost:8088/blog/');
  await new Promise(r => setTimeout(r, 3500));

  const result = await cdp.evaluate(`(() => {
    const regularCards = Array.from(document.querySelectorAll('.framer-18dht5n .framer-ij7w41-container')).map(el => {
      const a = el.querySelector('a');
      const title = el.querySelector('.framer-1pz7yr3 p, [data-framer-name="Title"] p');
      const date = el.querySelector('.framer-ie051f p, [data-framer-name="Date"] p');
      const isDynamic = el.getAttribute('data-dynamic-post') === 'true';
      const rect = el.getBoundingClientRect();
      const comp = window.getComputedStyle(a);
      return {
        isDynamic,
        href: a ? a.getAttribute('href') : null,
        title: title ? title.innerText.trim() : null,
        date: date ? date.innerText.trim() : null,
        flexDirection: comp.flexDirection,
        width: rect.width,
        height: rect.height,
        aClass: a ? a.className : null
      };
    });

    return {
      regularCount: regularCards.length,
      firstCard: regularCards[0],
      secondCard: regularCards[1]
    };
  })()`);

  console.log('Mobile Verification Result:', JSON.stringify(result, null, 2));
  await cdp.stop();
}

verifyMobileListing().catch(console.error);
