/**
 * Kiểm tra import paths: phát hiện sai HOA/thường (Windows không phân biệt
 * nhưng Linux trên Vercel có — nguyên nhân build fail "vụng về") và file
 * import không tồn tại. Chạy: node scripts/check-imports.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const DIRS = ['app', 'components', 'lib'];
const EXTS = ['', '.js', '.jsx', '.mjs', '.css', '.json'];

// Case-sensitive: liệt kê thư mục thật rồi so sánh tên chính xác từng ký tự.
function existsExact(fullPath) {
  const dir = path.dirname(fullPath);
  const base = path.basename(fullPath);
  if (!fs.existsSync(dir)) return false;
  return fs.readdirSync(dir, { withFileTypes: true }).some(
    (e) => e.name === base && (e.isFile() || e.isDirectory()),
  );
}

function resolveSpec(spec, fromFile) {
  let base;
  if (spec.startsWith('@/')) base = path.join(ROOT, spec.slice(2));
  else if (spec.startsWith('.')) base = path.join(path.dirname(fromFile), spec);
  else return null; // package npm — bỏ qua
  return path.resolve(base);
}

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(jsx?|mjs)$/.test(e.name)) yield p;
  }
}

const IMPORT_RE = /(?:import|export)\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\)/g;
let problems = 0;

for (const dir of DIRS) {
  for (const file of walk(path.join(ROOT, dir))) {
    const src = fs.readFileSync(file, 'utf8');
    for (const m of src.matchAll(IMPORT_RE)) {
      const spec = m[1] || m[2];
      if (!spec || (!spec.startsWith('.') && !spec.startsWith('@/'))) continue;
      const resolved = resolveSpec(spec, file);
      const hit = EXTS.map((ext) => resolved + ext).find(existsExact) ??
        (EXTS.map((ext) => path.join(resolved, `index${ext}`)).find(existsExact));
      if (!hit) {
        // Có file cùng tên khác HOA/thường? → đúng lỗi Vercel
        const dirEntries = fs.existsSync(path.dirname(resolved))
          ? fs.readdirSync(path.dirname(resolved))
          : [];
        const base = path.basename(resolved);
        const loose = dirEntries.find((n) => n.toLowerCase() === base.toLowerCase());
        problems++;
        if (loose) {
          console.error(`SAI HOA/THƯỜNG: ${path.relative(ROOT, file)}\n  import '${spec}'\n  → file thật: ${loose}`);
        } else {
          console.error(`KHÔNG TỒN TẠI: ${path.relative(ROOT, file)}\n  import '${spec}'`);
        }
      }
    }
  }
}

// File trên disk nhưng chưa commit (trừ ignore) — Vercel chỉ nhận những gì trong git.
const tracked = new Set(execSync('git ls-files', { encoding: 'utf8' }).split('\n'));
console.log(`\nXong. ${problems} vấn đề import. File git-tracked: ${tracked.size}.`);
