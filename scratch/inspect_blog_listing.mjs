import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function main() {
  const cdp = new ChromeCDP(9336);
  await cdp.start();
  await cdp.navigate('http://localhost:8088/blog');
  await new Promise(r => setTimeout(r, 4000));

  const res = await cdp.evaluate(`(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/blog/"]')).map(a => ({
      href: a.getAttribute('href'),
      text: a.innerText?.slice(0, 80).replace(/\\n/g, ' | '),
      class: a.className,
      parent: a.parentElement?.className,
      grandParent: a.parentElement?.parentElement?.className
    }));

    const mainChildren = Array.from(document.getElementById('main')?.querySelectorAll('section, div[id], [data-framer-name]') || []).map(el => ({
      tag: el.tagName,
      name: el.getAttribute('data-framer-name'),
      id: el.id,
      class: el.className
    })).slice(0, 30);

    return {
      linksCount: links.length,
      links,
      mainChildren
    };
  })()`);

  console.log(JSON.stringify(res, null, 2));
  await cdp.stop();
}

main().catch(console.error);
