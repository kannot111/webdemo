/**
 * Chụp màn hình kiểm tra thiết kế (chạy: node scripts/screenshot.mjs).
 * Cần server đang chạy ở localhost:3000.
 * puppeteer-core cài bằng `npm i puppeteer-core --no-save` (không nằm trong deps).
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
  if (msg.type() === 'error') problems.push(`[console.error] ${msg.text()}`);
});
page.on('pageerror', (err) => problems.push(`[pageerror] ${err.message}`));

// 1. Trang chủ
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
await page.screenshot({ path: `${outDir}home.png`, fullPage: true });
console.log('captured home.png');

// 2. Trang bubble-sort (toàn trang, trạng thái ban đầu)
await page.goto('http://localhost:3000/algorithms/bubble-sort', { waitUntil: 'networkidle0' });
await page.waitForSelector('canvas');
await page.screenshot({ path: `${outDir}bubble-sort-full.png`, fullPage: true });
console.log('captured bubble-sort-full.png');

// 3. Nhấn "Chạy", chờ vài bước rồi chụp khung nhìn player
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) => b.textContent === 'Chạy');
  btn?.click();
});
await new Promise((r) => setTimeout(r, 4300));
const stage = await page.$('figure');
await stage.screenshot({ path: `${outDir}player-running.png` });
console.log('captured player-running.png');

// 4. Tạm dừng rồi "Bước tới" một lần
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) => b.textContent === 'Tạm dừng');
  btn?.click();
});
await new Promise((r) => setTimeout(r, 200));
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) => b.textContent === 'Bước tới');
  btn?.click();
});
await new Promise((r) => setTimeout(r, 300));
await stage.screenshot({ path: `${outDir}player-stepped.png` });
console.log('captured player-stepped.png');

await browser.close();

if (problems.length) {
  console.log('CONSOLE PROBLEMS:');
  problems.forEach((p) => console.log(' -', p));
  process.exitCode = 1;
} else {
  console.log('No console errors.');
}
