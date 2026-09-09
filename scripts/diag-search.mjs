/** Chẩn đoán SearchBox trên bản build production: chip → tải model CDN → kết quả tìm kiếm. */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:3100';
const EXE = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));

const browser = await puppeteer.launch({ executablePath: EXE, headless: true, args: ['--no-first-run'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1200 });

const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text().slice(0, 200)}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message.slice(0, 200)}`));
page.on('requestfailed', (r) => logs.push(`[reqfail] ${r.url().slice(-90)} ${r.failure()?.errorText}`));

await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });

// Bấm 1 chip gợi ý để kích hoạt tìm kiếm semantic.
await page.evaluate(() => {
  const chip = [...document.querySelectorAll('button')].find((b) => b.className.includes('chip'));
  chip?.click();
});
await new Promise((r) => setTimeout(r, 40000)); // chờ tải model từ CDN (lần đầu)

const state = await page.evaluate(() => {
  const box = document.querySelector('input[type="search"]');
  const results = [...document.querySelectorAll('a')].filter((a) =>
    a.getAttribute('href')?.startsWith('/algorithms/'),
  );
  const statusEl = [...document.querySelectorAll('div,span')].find((d) =>
    /loading-model|model-ready|error/i.test(d.textContent || '') && d.children.length === 0,
  );
  return {
    hasInput: !!box,
    resultCount: results.length,
    first: results.slice(0, 3).map((a) => a.textContent.trim().slice(0, 60)),
    statusText: statusEl?.textContent?.trim().slice(0, 80) || '(không thấy text trạng thái)',
  };
});

console.log('== SEARCH DIAG ==');
console.log(JSON.stringify(state, null, 2));
console.log('== CONSOLE (10 dòng cuối) ==');
console.log(logs.slice(-10).join('\n') || '(trống — không lỗi)');
await page.screenshot({ path: 'shots/diag-search.png', fullPage: false });
await browser.close();
