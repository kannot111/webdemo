/**
 * Test end-to-end các trang visualizer (server phải đang chạy ở :3000).
 *
 * Với mỗi trang bài học: mở trang, nhấn nút "Chạy" của player, chờ vài bước,
 * xác minh (1) player thật sự tiến bước (thanh tiến trình chạy, caption đổi),
 * (2) trang quay lui hiển thị cột đệ quy, và chụp màn hình vào shots/.
 * Chạy: node scripts/test-algorithms.mjs
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const EXE = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p));

const outDir = new URL('../shots/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
fs.mkdirSync(outDir, { recursive: true });

const PAGES = [
  { slug: 'prefix-sum', stack: false },
  { slug: 'binary-search', stack: false },
  { slug: 'de-quy-quay-lui', stack: true },
  { slug: 'bubble-sort', stack: false },
  { slug: 'mang-1d-2d', stack: false },
  { slug: 'hai-con-tro', stack: false },
  { slug: 'thao-tac-bit', stack: false },
  { slug: 'quick-sort-merge-sort', stack: false },
  { slug: 'dsu', stack: false },
  { slug: 'duyet-do-thi', stack: false },
  { slug: 'cay-phan-doan', stack: false },
  { slug: 'qhd-co-ban', stack: false },
  { slug: 'qhd-tren-cay', stack: false },
  { slug: 'lca-euler-tour', stack: false },
  { slug: 'sang-eratosthenes', stack: false },
];

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: true,
  args: ['--no-first-run', '--hide-scrollbars'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1400, deviceScaleFactor: 1 });

const problems = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') problems.push(`[console.error] ${msg.text().slice(0, 200)}`);
});
page.on('pageerror', (err) => problems.push(`[pageerror] ${err.message.slice(0, 200)}`));

let failed = false;

// Trang chủ: badge + link wiki.
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
const homeText = await page.evaluate(() => document.body.innerText);
const readyBadges = (homeText.match(/Đã có bài \+ visualizer/g) ?? []).length;
if (readyBadges < 34) {
  failed = true;
  console.error(`✗ Trang chủ: kỳ vọng ≥ 34 badge "Đã có bài + visualizer", thấy ${readyBadges}`);
} else {
  console.log(`✓ Trang chủ: ${readyBadges} chủ đề gắn badge bài hoàn chỉnh`);
}
if (!homeText.includes('VNOI Wiki')) {
  failed = true;
  console.error('✗ Trang chủ: không thấy credit VNOI Wiki');
}
await page.screenshot({ path: `${outDir}home.png`, fullPage: true });
console.log('captured home.png');

for (const { slug, stack } of PAGES) {
  await page.goto(`http://localhost:3000/algorithms/${slug}`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 400));

  const before = await page.evaluate(() => ({
    progress: document.querySelector('[class*="trackFill"]')?.style?.width ?? '',
    caption: document.querySelector('figcaption')?.textContent ?? '',
  }));

  // Nhấn nút "Chạy" đầu tiên trên trang.
  const clicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(
      (b) => b.textContent.trim() === 'Chạy',
    );
    if (!btn) return false;
    btn.click();
    return true;
  });
  if (!clicked) {
    failed = true;
    console.error(`✗ /algorithms/${slug}: không tìm thấy nút Chạy`);
    continue;
  }

  // Chờ đủ lâu để player chạy vài bước (tick 800ms).
  await new Promise((r) => setTimeout(r, 3600));
  await page.screenshot({ path: `${outDir}${slug}-playing.png` });

  const after = await page.evaluate(() => ({
    progress: document.querySelector('[class*="trackFill"]')?.style?.width ?? '',
    caption: document.querySelector('figcaption')?.textContent ?? '',
    body: document.body.innerText,
  }));

  const progressed = after.progress !== before.progress && after.progress !== '0%';
  if (!progressed) {
    failed = true;
    console.error(`✗ /algorithms/${slug}: player không tiến bước (trackFill: "${after.progress}")`);
  } else {
    console.log(`✓ /algorithms/${slug}: player chạy — tiến trình ${after.progress}`);
  }

  if (after.caption === before.caption) {
    failed = true;
    console.error(`✗ /algorithms/${slug}: caption không đổi sau khi chạy`);
  }

  if (stack && !after.body.includes('tầng ')) {
    failed = true;
    console.error(`✗ /algorithms/${slug}: không thấy cột đệ quy (tầng ...) khi chạy`);
  } else if (stack) {
    console.log(`✓ /algorithms/${slug}: cột đệ quy hiển thị các tầng`);
  }
}

await browser.close();

if (problems.length) {
  console.log('CONSOLE PROBLEMS:');
  problems.forEach((p) => console.log(' -', p));
  failed = true;
}

if (failed) process.exit(1);
console.log('\n✓ Tất cả trang visualizer hoạt động, không có lỗi console.');