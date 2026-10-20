import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function test() {
  const cdp = new ChromeCDP(9337);
  await cdp.start();
  // Start on desktop
  await cdp.setViewport(1440, 900);
  await cdp.navigate('http://localhost:8088/blog/');
  await new Promise(r => setTimeout(r, 2000));

  // Clone desktop card
  await cdp.evaluate(`(() => {
    const regularContainer = document.querySelector('.framer-18dht5n');
    const sampleCard = regularContainer.querySelector('.framer-ij7w41-container');
    const clone = sampleCard.cloneNode(true);
    clone.setAttribute('data-post-slug', 'why-every-real-estate-agent-needs-a-website-in-2026');
    clone.setAttribute('data-dynamic-post', 'true');
    regularContainer.insertBefore(clone, regularContainer.firstChild);

    // Responsive helper
    function updateResponsive() {
      const isMobile = window.innerWidth <= 809;
      const isTablet = window.innerWidth > 809 && window.innerWidth <= 1199;
      const dynamicLink = clone.querySelector('a');
      if (!dynamicLink) return;
      dynamicLink.classList.remove('framer-v-6b3n5n', 'framer-v-1ejbd52', 'framer-v-gaszep');
      if (isMobile) {
        dynamicLink.classList.add('framer-v-gaszep');
        dynamicLink.setAttribute('data-framer-name', 'Mobile');
      } else if (isTablet) {
        dynamicLink.classList.add('framer-v-1ejbd52');
        dynamicLink.setAttribute('data-framer-name', 'Tablet');
      } else {
        dynamicLink.classList.add('framer-v-6b3n5n');
        dynamicLink.setAttribute('data-framer-name', 'Desktop Wide');
      }
    }
    window.addEventListener('resize', updateResponsive);
  })()`);

  // Now resize to mobile
  await cdp.setViewport(390, 844);
  await cdp.evaluate(`window.dispatchEvent(new Event('resize'))`);
  await new Promise(r => setTimeout(r, 500));

  const result = await cdp.evaluate(`(() => {
    const clone = document.querySelector('[data-post-slug="why-every-real-estate-agent-needs-a-website-in-2026"]');
    const link = clone.querySelector('a');
    const comp = window.getComputedStyle(link);
    return {
      classes: link.className,
      flexDirection: comp.flexDirection,
      width: link.getBoundingClientRect().width
    };
  })()`);

  console.log('Resize test result:', result);
  await cdp.stop();
}

test().catch(console.error);
