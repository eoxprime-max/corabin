import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

export class ChromeCDP {
  constructor(port = 9222) {
    this.port = port;
    this.chromeProc = null;
    this.ws = null;
    this.msgId = 0;
    this.callbacks = new Map();
  }

  async start() {
    this.chromeProc = spawn('google-chrome', [
      '--headless=new',
      `--remote-debugging-port=${this.port}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-sync',
      '--disable-translate',
      '--hide-scrollbars',
      'about:blank'
    ], { stdio: 'ignore' });

    // Wait for CDP endpoint
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const wsUrl = await this.getWsUrl();
        if (wsUrl) {
          await this.connectWs(wsUrl);
          return;
        }
      } catch (e) {}
    }
    throw new Error('Failed to connect to Chrome CDP');
  }

  getWsUrl() {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${this.port}/json/list`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const list = JSON.parse(data);
            const page = list.find(t => t.type === 'page') || list[0];
            if (page && page.webSocketDebuggerUrl) {
              resolve(page.webSocketDebuggerUrl);
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      }).on('error', reject);
    });
  }

  connectWs(url) {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => resolve();
      this.ws.onerror = err => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { res, rej, timer } = this.callbacks.get(msg.id);
          clearTimeout(timer);
          this.callbacks.delete(msg.id);
          if (msg.error) rej(new Error(msg.error.message));
          else res(msg.result);
        }
        if (msg.method && this.eventListeners) {
          for (const listener of this.eventListeners) {
            try { listener(msg); } catch (e) { console.error('CDP event error:', e); }
          }
        }
      };
    });
  }

  on(method, handler) {
    if (!this.eventListeners) this.eventListeners = [];
    this.eventListeners.push((msg) => {
      if (!method || msg.method === method) handler(msg.params, msg);
    });
  }

  send(method, params = {}, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      const timer = setTimeout(() => {
        if (this.callbacks.has(id)) {
          this.callbacks.delete(id);
          reject(new Error(`CDP command timed out after ${timeoutMs}ms: ${method}`));
        }
      }, timeoutMs);
      this.callbacks.set(id, { res: resolve, rej: reject, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async stop() {
    if (this.ws) {
      try { this.ws.close(); } catch (e) {}
    }
    if (this.chromeProc) {
      this.chromeProc.kill();
    }
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    });
    await this.send('Emulation.setVisibleSize', { width, height });
  }

  async navigate(url) {
    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('Page.navigate', { url });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : null;
  }

  async captureScreenshot(path, clip = null) {
    const params = { format: 'png' };
    if (clip) params.clip = clip;
    const res = await this.send('Page.captureScreenshot', params);
    fs.writeFileSync(path, Buffer.from(res.data, 'base64'));
  }
}
