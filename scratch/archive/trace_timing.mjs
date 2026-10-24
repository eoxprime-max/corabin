import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function traceBlogListing() {
  const cdp = new ChromeCDP(9580);
  await cdp.start();

  await cdp.send('Page.enable');
  await cdp.send('Console.enable');
  await cdp.send('Runtime.enable');

  const logs = [];
  cdp.onMessage = (msg) => {
    if (msg.method === 'Console.messageAdded') {
      logs.push(`[${msg.params.message.level}] ${msg.params.message.text}`);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      logs.push(`[console.${msg.params.type}] ${text}`);
    }
  };

  console.log('Navigating to http://localhost:8088/blog/...');
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });

  // Poll DOM state every 300ms for 4 seconds
  for (let t = 300; t <= 4500; t += 300) {
    await new Promise(r => setTimeout(r, 300));
    const step = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const featGrid = document.querySelector('.framer-ugj76m, .framer-3lukgt');
        const regContainer = document.querySelector('.framer-18dht5n');
        const regCards = regContainer ? Array.from(regContainer.querySelectorAll('.framer-ij7w41-container')) : [];
        const slugs = regCards.map(c => c.getAttribute('data-post-slug') || c.querySelector('a')?.getAttribute('href'));
        return {
          t: ${t},
          featExists: !!featGrid,
          regContainerExists: !!regContainer,
          regCount: regCards.length,
          has13th: slugs.some(s => s && s.includes('why-every-real-estate-agent-needs-a-website-in-2026')),
          hasDynamicPostAttr: regCards.some(c => c.hasAttribute('data-dynamic-post')),
          first3Slugs: slugs.slice(0, 3)
        };
      })()`,
      returnByValue: true
    });
    console.log(`t=${t}ms:`, step.result.value);
  }

  console.log('\nAll Console Logs:', logs);
  await cdp.stop();
}

traceBlogListing().catch(console.error);
