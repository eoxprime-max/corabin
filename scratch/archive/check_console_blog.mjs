import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9333);
  await cdp.start();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');

  const logs = [];
  cdp.ws.addEventListener('message', (evt) => {
    const data = JSON.parse(evt.data);
    if (data.method === 'Runtime.consoleAPICalled' || data.method === 'Runtime.exceptionThrown') {
      logs.push(data);
    }
  });

  await cdp.setViewport(1440, 900);
  await cdp.send('Page.navigate', { url: 'http://localhost:8088/blog/' });
  await new Promise(r => setTimeout(r, 5000));

  console.log('Logs captured:', logs.length);
  for (const l of logs) {
    if (l.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION:', l.params.exceptionDetails);
    } else {
      console.log('CONSOLE:', l.params.type, l.params.args?.map(a => a.value || a.description));
    }
  }

  const res = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      return {
        mainId: document.getElementById('main')?.id,
        mainDataset: Object.keys(document.getElementById('main')?.dataset || {}),
        rendered: document.getElementById('main')?.dataset?.rendered,
        hasUgj: !!document.querySelector('.framer-ugj76m'),
        hasLuk: !!document.querySelector('.framer-3lukgt'),
        hasDht: !!document.querySelector('.framer-18dht5n')
      };
    })()`,
    returnByValue: true
  });
  console.log('DOM check:', res.result.value);
  await cdp.stop();
}
main().catch(err => { console.error(err); process.exit(1); });
