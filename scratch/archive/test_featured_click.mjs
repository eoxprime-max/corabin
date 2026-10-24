import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function test() {
  const cdp = new ChromeCDP(9599);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Console.enable');

  console.log('1. Loading /blog/');
  await cdp.send('Page.navigate', { url: 'http://localhost:8089/blog/' });
  await new Promise(r => setTimeout(r, 4000));

  console.log('2. Clicking featured card 1 (custom-vs-off-the-shelf-choose-wisely)...');
  const res1 = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const a = document.querySelector('a[href*="custom-vs-off-the-shelf-choose-wisely"]');
      if (!a) return { error: 'not found' };
      a.click();
      return { clicked: true, path: window.location.pathname };
    })()`,
    returnByValue: true
  });
  console.log('Click 1 res:', res1.result.value);

  await new Promise(r => setTimeout(r, 2000));
  const page1 = await cdp.send('Runtime.evaluate', {
    expression: `(() => ({
      path: window.location.pathname,
      title: document.title,
      h1: document.querySelector('#article-title, h1')?.innerText,
      hasArticleRoot: Boolean(document.querySelector('#article-title'))
    }))()`,
    returnByValue: true
  });
  console.log('Page after click 1:', page1.result.value);

  console.log('3. Clicking Back...');
  await cdp.send('Runtime.evaluate', { expression: 'history.back()' });
  await new Promise(r => setTimeout(r, 2000));

  const pageBack = await cdp.send('Runtime.evaluate', {
    expression: `(() => ({
      path: window.location.pathname,
      title: document.title,
      h1: document.querySelector('h1')?.innerText
    }))()`,
    returnByValue: true
  });
  console.log('Page after back:', pageBack.result.value);

  await cdp.stop();
}

test().catch(console.error);
