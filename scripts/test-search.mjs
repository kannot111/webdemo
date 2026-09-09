/**
 * Test tìm kiếm ngữ nghĩa end-to-end (server phải đang chạy ở :3000).
 * Chạy: node scripts/test-search.mjs
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const EXE = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));

const outDir = new URL('../shots/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: true,
  args: ['--no-first-run', '--hide-scrollbars'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1180, deviceScaleFactor: 1 });

const problems = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') problems.push(`[console.error] ${msg.text().slice(0, 200)}`);
});
page.on('pageerror', (err) => problems.push(`[pageerror] ${err.message.slice(0, 200)}`));
page.on('response', (res) => {
  if (res.status() === 404) console.log(`404: ${res.url()}`);
});

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
await page.screenshot({ path: `${outDir}home.png`, fullPage: true });
console.log('captured home.png');

// Gõ truy vấn CÓ Ý KHÔNG GIỐNG CHÍNH TẢ với tên chủ đề để chứng minh tìm theo nghĩa:
// "cây đoạn" → phải ra "Cây phân đoạn" (Segment Tree).
const input = await page.waitForSelector('input[type=search]');
await input.type('cây đoạn', { delay: 40 });

try {
  await page.waitForFunction(
    () => document.body.innerText.includes('Cây phân đoạn'),
    { timeout: 120000 }
  );
  console.log('OK: tìm "cây đoạn" ra đúng "Cây phân đoạn"');
} catch {
  console.log('TIMEOUT: không thấy kết quả "Cây phân đoạn" sau 120s');
}

await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: `${outDir}search-results.png`, fullPage: false });

// In text kết quả ra để kiểm tra thứ hạng.
const text = await page.evaluate(() => document.body.innerText);
const idx = text.indexOf('chủ đề khớp nhất');
console.log('---');
console.log(text.slice(Math.max(idx - 40, 0), idx + 400).replace(/\n+/g, ' | '));

await browser.close();

if (problems.length) {
  console.log('CONSOLE PROBLEMS:');
  problems.forEach((p) => console.log(' -', p));
  process.exitCode = 1;
} else {
  console.log('No console errors.');
}
