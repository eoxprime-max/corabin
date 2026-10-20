import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function test() {
  const cdp = new ChromeCDP(9336);
  await cdp.start();
  await cdp.setViewport(390, 844);
  await cdp.navigate('http://localhost:8088/blog/');
  await new Promise(r => setTimeout(r, 2500));

  const evalResult = await cdp.evaluate(`(() => {
    const regularContainer = document.querySelector('.framer-18dht5n');
    if (!regularContainer) return { error: 'no container' };
    const sampleCard = regularContainer.querySelector('.framer-ij7w41-container');
    if (!sampleCard) return { error: 'no card' };

    const clone = sampleCard.cloneNode(true);
    clone.setAttribute('data-post-slug', 'why-every-real-estate-agent-needs-a-website-in-2026');
    clone.setAttribute('data-dynamic-post', 'true');

    const link = clone.querySelector('a');
    if (link) link.setAttribute('href', '/blog/why-every-real-estate-agent-needs-a-website-in-2026/');
    const dateP = clone.querySelector('.framer-ie051f p');
    if (dateP) dateP.textContent = 'Apr 13, 2026';
    const titleP = clone.querySelector('.framer-1pz7yr3 p');
    if (titleP) titleP.textContent = 'Why Every Real Estate Agent Needs a Website in 2026';

    regularContainer.insertBefore(clone, regularContainer.firstChild);

    const rect = clone.getBoundingClientRect();
    const computed = window.getComputedStyle(clone.firstElementChild);

    return {
      width: rect.width,
      height: rect.height,
      flexDirection: computed.flexDirection,
      aClasses: clone.firstElementChild.className
    };
  })()`);

  console.log('Mobile clone test:', evalResult);
  await cdp.stop();
}

test().catch(console.error);
