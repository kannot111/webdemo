/** Chẩn đoán TreeVisualizer/GraphVisualizer: canvas cytoscape có tồn tại & có kích thước không? */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const EXE = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));

const browser = await puppeteer.launch({ executablePath: EXE, headless: true, args: ['--no-first-run'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1600 });

const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text().slice(0, 300)}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message.slice(0, 300)}`));
page.on('requestfailed', (r) => logs.push(`[reqfail] ${r.url().slice(-80)} ${r.failure()?.errorText}`));

const BASE = process.argv[2] || 'http://localhost:3000';

for (const slug of ['qhd-tren-cay', 'de-quy-quay-lui', 'dsu']) {
  logs.length = 0;
  await page.goto(`${BASE}/algorithms/${slug}/`, { waitUntil: 'networkidle0' });
  // Hydration có thể chưa xong khi click → thử lại vài lần trước khi kết luận.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Chạy');
      btn?.click();
    });
    await new Promise((r) => setTimeout(r, 2500));

    // Dừng sớm nếu đã có canvas được tô.
    const any = await page.evaluate(() =>
      [...document.querySelectorAll('canvas')].some((c) => {
        try {
          const d = c.getContext('2d').getImageData(0, 0, c.width, 200).data;
          for (let i = 3; i < d.length; i += 40) if (d[i] > 0) return true;
        } catch {}
        return false;
      }),
    );
    if (any) break;
  }

  const info = await page.evaluate(() => {
    const frames = [...document.querySelectorAll('div')].filter((d) => d.className && String(d.className).includes('frame'));
    return frames.map((f) => {
      const r = f.getBoundingClientRect();
      const canvases = [...f.querySelectorAll('canvas')].map((c) => {
        const cr = c.getBoundingClientRect();
        let painted = -1;
        try {
          const ctx = c.getContext('2d');
          if (ctx && c.width > 0) {
            const d = ctx.getImageData(0, 0, c.width, Math.min(c.height, 400)).data;
            painted = 0;
            for (let i = 3; i < d.length; i += 40) if (d[i] > 0) painted++;
          }
        } catch {}
        return { w: Math.round(cr.width), h: Math.round(cr.height), painted };
      });
      return { cls: String(f.className).slice(0, 60), w: Math.round(r.width), h: Math.round(r.height), canvases };
    });
  });
  console.log(`\n=== ${slug} ===`);
  console.log(JSON.stringify(info, null, 1));
  console.log('logs:', logs.length ? logs : '(không có)');
  await page.screenshot({ path: `shots/diag-${slug}.png`, fullPage: false });
}
await browser.close();
