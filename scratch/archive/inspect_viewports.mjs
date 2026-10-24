import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function inspect(url, name, width, height) {
  const cdp = new ChromeCDP(9333);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.setViewport(width, height);
  await cdp.send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 4000));

  const res = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('a.framer-7Bi9P')).map((a, i) => {
        const style = window.getComputedStyle(a);
        const parentStyle = window.getComputedStyle(a.parentElement);
        const ancestorWithHidden = a.closest('.hidden-1fvi3ca, .hidden-1nuy9oi, .hidden-72rtr7, .hidden-r6libt, .hidden-1gwx6by');
        return {
          index: i,
          href: a.getAttribute('href'),
          classes: a.className,
          visible: style.display !== 'none' && parentStyle.display !== 'none' && (!ancestorWithHidden || window.getComputedStyle(ancestorWithHidden).display !== 'none'),
          ancestorHiddenClass: ancestorWithHidden ? ancestorWithHidden.className : null,
          title: a.querySelector('.framer-giavb9 p, p:not(.framer-gifdkw p)')?.textContent?.trim()
        };
      });
      return cards;
    })()`,
    returnByValue: true
  });
  console.log(`=== ${name} (${width}x${height}) ===`);
  console.log(JSON.stringify(res.result.value, null, 2));
  await cdp.stop();
}

async function main() {
  await inspect('http://localhost:8088/', 'HOMEPAGE DESKTOP', 1440, 900);
  await inspect('http://localhost:8088/', 'HOMEPAGE MOBILE', 390, 844);
  await inspect('http://localhost:8088/blog/', 'BLOG DESKTOP', 1440, 900);
  await inspect('http://localhost:8088/blog/', 'BLOG MOBILE', 390, 844);
}
main().catch(err => { console.error(err); process.exit(1); });
