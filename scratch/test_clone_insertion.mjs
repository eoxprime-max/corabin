import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function test() {
  const cdp = new ChromeCDP(9334);
  await cdp.start();
  await cdp.setViewport(1440, 900);
  await cdp.navigate('http://localhost:8088/blog/');
  await new Promise(r => setTimeout(r, 2500));

  // Perform the clone and insert inside browser
  const evalResult = await cdp.evaluate(`(() => {
    const regularContainer = document.querySelector('.framer-18dht5n');
    if (!regularContainer) return { success: false, reason: 'no regularContainer' };

    const sampleCard = regularContainer.querySelector('.framer-ij7w41-container');
    if (!sampleCard) return { success: false, reason: 'no sampleCard' };

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

    return {
      success: true,
      newCardHref: link.getAttribute('href'),
      newCardTitle: titleP.textContent,
      newCardDate: dateP.textContent,
      totalRegularCards: regularContainer.querySelectorAll('.framer-ij7w41-container').length
    };
  })()`);

  console.log('Eval result:', evalResult);

  // Wait another 2 seconds and check if the card is still there
  await new Promise(r => setTimeout(r, 2000));
  const checkResult = await cdp.evaluate(`(() => {
    const dynamicCard = document.querySelector('[data-post-slug="why-every-real-estate-agent-needs-a-website-in-2026"]');
    return {
      persisted: Boolean(dynamicCard),
      title: dynamicCard ? dynamicCard.querySelector('.framer-1pz7yr3 p')?.textContent : null
    };
  })()`);

  console.log('Check result after 2s:', checkResult);
  await cdp.stop();
}

test().catch(console.error);
