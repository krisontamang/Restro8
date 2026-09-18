import { spawn } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const CHROME_PATH = existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const PORT = 9338;
const ARTIFACT_DIR = 'C:\\Users\\kriso\\.gemini\\antigravity-ide\\brain\\197e0876-69cc-461a-bf66-a1cc1c96c211';

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve: res, reject: rej } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) rej(new Error(msg.error.message || JSON.stringify(msg.error)));
          else res(msg.result);
        }
      };
    });
  }

  async send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function ensureServerRunning() {
  for (const port of [5180, 5175, 5173]) {
    try {
      const res = await fetch(`http://localhost:${port}/menu`);
      if (res.ok) {
        const text = await res.text();
        if (text.includes('Restro8') || text.includes('restrox')) {
          return { url: `http://localhost:${port}/menu`, proc: null };
        }
      }
    } catch {
      // try next
    }
  }

  // Start vite dev server if none running
  const devProc = spawn('npx.cmd', ['vite', '--port', '5180'], { stdio: 'ignore' });
  for (let i = 0; i < 30; i++) {
    await sleep(200);
    try {
      const res = await fetch('http://localhost:5180/menu');
      if (res.ok) return { url: 'http://localhost:5180/menu', proc: devProc };
    } catch {}
  }
  return { url: 'http://localhost:5180/menu', proc: devProc };
}

test('guest menu layout verification in headless browser', async (t) => {
  const { url: MENU_URL, proc: serverProc } = await ensureServerRunning();
  const tempDir = resolve(tmpdir(), `chrome-test-${Date.now()}`);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--disable-extensions',
    `--user-data-dir=${tempDir}`,
    MENU_URL,
  ]);

  let cdp = null;

  try {
    // Wait for CDP to be available
    let pageTarget = null;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
        if (res.ok) {
          const targets = await res.json();
          pageTarget = targets.find((tgt) => tgt.type === 'page' && tgt.webSocketDebuggerUrl);
          if (pageTarget) break;
        }
      } catch {
        // wait
      }
      await sleep(250);
    }
    assert.ok(pageTarget, 'Chrome CDP did not provide a valid page target');

    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    // Wait until .public-menu-card elements are rendered
    let cardsLoaded = false;
    for (let i = 0; i < 40; i++) {
      const res = await cdp.send('Runtime.evaluate', {
        expression: `document.querySelectorAll('.public-menu-card').length`,
        returnByValue: true,
      });
      if (res?.result?.value > 0) {
        cardsLoaded = true;
        console.log(`Found ${res.result.value} cards.`);
        break;
      }
      await sleep(250);
    }
    assert.ok(cardsLoaded, 'Timed out waiting for .public-menu-card elements to render');

    // Wait up to 1.5s for images to settle without hanging on external CDNs
    await cdp.send('Runtime.evaluate', {
      expression: `Promise.race([
        Promise.all(Array.from(document.images).map(img => img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; }))),
        new Promise(res => setTimeout(res, 1500))
      ])`,
      awaitPromise: true,
    });
    console.log('Images settled.');

    const viewports = [
      { name: '1440px Desktop', width: 1440, height: 900, mobile: false },
      { name: '1280px Desktop', width: 1280, height: 800, mobile: false },
      { name: '1024px Tablet Landscape', width: 1024, height: 768, mobile: false },
      { name: '768px Tablet Portrait', width: 768, height: 1024, mobile: true },
      { name: '414x896 Mobile', width: 414, height: 896, mobile: true },
      { name: '375px Mobile Small', width: 375, height: 667, mobile: true },
    ];

    for (const vp of viewports) {
      await t.test(`Layout at ${vp.name} (${vp.width}x${vp.height})`, async () => {
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.mobile,
        });

        await sleep(300);

        const evalResult = await cdp.send('Runtime.evaluate', {
          expression: `(() => {
            const banner = document.querySelector('.development-preview-banner');
            const hasBanner = !!banner;
            const scrollWidth = document.documentElement.scrollWidth;
            const clientWidth = document.documentElement.clientWidth;
            const hasHorizontalOverflow = scrollWidth > clientWidth + 1;

            const cards = Array.from(document.querySelectorAll('.public-menu-card'));
            const cardReports = cards.map((card, index) => {
              const imageContainer = card.querySelector('.public-menu-image');
              const imageEl = card.querySelector('.public-food-image, .food-cutout, .food-image-fallback');
              const body = card.querySelector('.public-menu-card-body');
              const category = card.querySelector('.public-category');
              const title = card.querySelector('h2');
              const desc = card.querySelector('.public-description');
              const footer = card.querySelector('.public-menu-card-footer');
              const button = card.querySelector('.public-add-button');

              if (!imageContainer || !imageEl || !body || !footer || !button) {
                return { index, error: 'Missing core card elements' };
              }

              const cRect = imageContainer.getBoundingClientRect();
              const iRect = imageEl.getBoundingClientRect();
              const bRect = body.getBoundingClientRect();
              const catRect = category ? category.getBoundingClientRect() : null;
              const tRect = title ? title.getBoundingClientRect() : null;
              const dRect = desc ? desc.getBoundingClientRect() : null;
              const fRect = footer.getBoundingClientRect();
              const btnRect = button.getBoundingClientRect();

              // Check if image is contained inside imageContainer (allowing 1px subpixel rounding)
              const imageContained =
                iRect.top >= cRect.top - 1 &&
                iRect.bottom <= cRect.bottom + 1 &&
                iRect.left >= cRect.left - 1 &&
                iRect.right <= cRect.right + 1;

              // Check that media wrapper ends before card body begins
              const mediaBeforeBody = cRect.bottom <= bRect.top + 1;

              // Check that image does not intersect category, title, description, footer, button
              const intersectsText = (catRect && iRect.bottom > catRect.top + 1) ||
                                     (tRect && iRect.bottom > tRect.top + 1) ||
                                     (dRect && iRect.bottom > dRect.top + 1) ||
                                     (iRect.bottom > fRect.top + 1) ||
                                     (iRect.bottom > btnRect.top + 1);

              const buttonMinSize = btnRect.width >= 43.5 && btnRect.height >= 43.5;

              return {
                index,
                imageContained,
                mediaBeforeBody,
                intersectsText,
                buttonMinSize,
                cRect: { width: Math.round(cRect.width), height: Math.round(cRect.height) },
                iRect: { width: Math.round(iRect.width), height: Math.round(iRect.height) },
                btnRect: { width: Math.round(btnRect.width), height: Math.round(btnRect.height) },
              };
            });

            return {
              hasBanner,
              hasHorizontalOverflow,
              cardCount: cards.length,
              cardReports,
            };
          })()`,
          returnByValue: true,
        });

        const report = evalResult.result.value;
        assert.equal(report.hasBanner, false, 'Development banner must be completely removed');
        assert.equal(report.hasHorizontalOverflow, false, `No horizontal overflow at ${vp.name}`);
        assert.ok(report.cardCount > 0, `Menu cards must be present (found ${report.cardCount})`);

        for (const c of report.cardReports) {
          assert.equal(c.imageContained, true, `Card #${c.index} image must be contained in .public-menu-image`);
          assert.equal(c.mediaBeforeBody, true, `Card #${c.index} media container must end before body`);
          assert.equal(c.intersectsText, false, `Card #${c.index} image must not intersect text`);
          assert.equal(c.buttonMinSize, true, `Card #${c.index} add button must be at least 44x44px (got ${c.btnRect.width}x${c.btnRect.height})`);
        }

        // Capture screenshots for Desktop (1280) and Mobile (414)
        if (vp.width === 1280 || vp.width === 414) {
          const ssResult = await cdp.send('Page.captureScreenshot', { format: 'png' });
          const filename = vp.width === 1280 ? 'guest_menu_desktop.png' : 'guest_menu_mobile.png';
          writeFileSync(resolve(ARTIFACT_DIR, filename), Buffer.from(ssResult.data, 'base64'));
          console.log(`Saved screenshot: ${filename}`);

          // Scroll down to view the photograph cards (e.g. biryani, thakali khana sets)
          await cdp.send('Runtime.evaluate', {
            expression: `window.scrollTo(0, 600)`,
          });
          await sleep(300);
          const ssScrolled = await cdp.send('Page.captureScreenshot', { format: 'png' });
          const scrolledFilename = vp.width === 1280 ? 'guest_menu_desktop_scrolled.png' : 'guest_menu_mobile_scrolled.png';
          writeFileSync(resolve(ARTIFACT_DIR, scrolledFilename), Buffer.from(ssScrolled.data, 'base64'));
          console.log(`Saved screenshot: ${scrolledFilename}`);
          await cdp.send('Runtime.evaluate', {
            expression: `window.scrollTo(0, 0)`,
          });
        }
      });
    }
  } finally {
    if (cdp) cdp.close();
    chromeProc.kill('SIGTERM');
    if (serverProc) serverProc.kill('SIGTERM');
  }
});
