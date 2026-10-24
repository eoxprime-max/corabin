import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function testClicks() {
  const cdp = new ChromeCDP(9580);
  await cdp.start();

  await cdp.send('Page.enable');
  await cdp.send('Console.enable');
  await cdp.send('Runtime.enable');

  cdp.onMessage = (msg) => {
    if (msg.method === 'Console.messageAdded') {
      console.log('CONSOLE:', msg.params.message.text);
    }
  };

  console.log('\n--- 1. Navigating to /blog/ ---');
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await new Promise(r => setTimeout(r, 2500));

  // Check card links on /blog/
  const cardLinks = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href);
      return {
        has13: links.some(l => l.includes('why-every-real-estate-agent-needs-a-website-in-2026')),
        allLinks: links.filter(l => l.includes('/blog/'))
      };
    })()`,
    returnByValue: true
  });
  console.log('Blog listing links:', cardLinks.result.value);

  // Now click on 13th post if present
  console.log('\n--- 2. Clicking on 13th post link from /blog/ ---');
  const clickRes = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const link = Array.from(document.querySelectorAll('a')).find(a => a.href.includes('why-every-real-estate-agent-needs-a-website-in-2026'));
      if (link) {
        link.click();
        return { clicked: true, href: link.href };
      }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  console.log('Click result:', clickRes.result.value);

  await new Promise(r => setTimeout(r, 2000));

  const pageAfterClick = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      return {
        url: window.location.href,
        title: document.title,
        h1: document.querySelector('h1')?.innerText,
        heroExists: !!document.querySelector('#hero'),
        articleLoading: !!document.querySelector('#article-loading'),
        bodyChildren: document.querySelector('#article-body-content')?.children?.length,
        bodyText: document.querySelector('#article-body-content')?.innerText?.slice(0, 100),
        mainHtmlSnippet: document.getElementById('main')?.innerHTML?.slice(0, 300)
      };
    })()`,
    returnByValue: true
  });
  console.log('Page state after clicking 13th post:', JSON.stringify(pageAfterClick.result.value, null, 2));

  await cdp.stop();
}

testClicks().catch(console.error);
