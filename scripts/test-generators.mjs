/**
 * Kiểm tra tất cả generator đã đăng ký trong components/generators.js
 * bằng node thuần (ESM, import tương đối — registry dùng đường dẫn tương đối
 * đúng để script này chạy được). Mỗi generator phải:
 *   - chỉ yield step hợp lệ theo lib/algorithms/types.js (STEP_TYPES),
 *   - kết thúc bằng bước 'done',
 *   - thỏa mãn bất biến riêng của từng thuật toán (kết quả đúng).
 *
 * Chạy: node scripts/test-generators.mjs   (exit 1 nếu có lỗi)
 */
import { GENERATORS } from '../components/generators.js';
import { isValidStep } from '../lib/algorithms/types.js';

let failures = 0;

function check(name, cond, message) {
  if (!cond) {
    failures += 1;
    console.error(`  ✗ [${name}] ${message}`);
  }
}

function collect(entry) {
  const it = entry.gen(entry.data);
  const steps = [];
  let r = it.next();
  while (!r.done) {
    steps.push(r.value);
    r = it.next();
  }
  return { steps, result: r.value };
}

function runOne(name, entry) {
  const { steps, result } = collect(entry);
  console.log(`• ${name}: ${steps.length} bước`);
  steps.forEach((step, i) => {
    if (!isValidStep(step)) {
      failures += 1;
      console.error(`  ✗ [${name}] bước ${i}: type "${step?.type}" không nằm trong STEP_TYPES`);
    }
  });
  check(name, steps.at(-1)?.type === 'done', 'bước cuối cùng phải là done');
  return { steps, result };
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// --- bubbleSort -------------------------------------------------------------
{
  const { result } = runOne('bubbleSort', GENERATORS.bubbleSort);
  const input = GENERATORS.bubbleSort.data;
  check(
    'bubbleSort',
    same(result, [...input].sort((x, y) => x - y)),
    'mảng trả về phải là bản sắp tăng dần của dữ liệu vào',
  );
}

// --- prefixSum1D ------------------------------------------------------------
{
  const { result } = runOne('prefixSum1D', GENERATORS.prefixSum1D);
  const input = GENERATORS.prefixSum1D.data;
  check('prefixSum1D', result.length === input.length + 1, 'pre phải có n + 1 ô (kèm viền)');
  check('prefixSum1D', result[0] === 0, 'pre[0] phải là viền 0');
  let sum = 0;
  let ok = true;
  input.forEach((v, i) => {
    sum += v;
    if (result[i + 1] !== sum) ok = false;
  });
  check('prefixSum1D', ok, 'mỗi pre[i+1] phải bằng tổng i+1 phần tử đầu tiên');
}

// --- prefixSum2D ------------------------------------------------------------
{
  const { result, steps } = runOne('prefixSum2D', GENERATORS.prefixSum2D);
  const m = GENERATORS.prefixSum2D.data;
  const rows = m.length;
  const cols = m[0].length;
  check(
    'prefixSum2D',
    result.length === rows + 1 && result[0].length === cols + 1,
    'bảng phải có viền hàng 0 và cột 0',
  );
  let ok = true;
  for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= cols; j++) {
      let expect = 0;
      for (let r = 0; r < Math.min(i, rows); r++) {
        for (let c = 0; c < Math.min(j, cols); c++) expect += m[r][c];
      }
      if (result[i][j] !== expect) ok = false;
    }
  }
  check('prefixSum2D', ok, 'pre[i][j] phải bằng tổng hình chữ nhật (0,0)→(i-1,j-1)');
  check('prefixSum2D', steps.some((st) => st.type === 'compare'), 'phải có bước minh họa truy vấn');
}

// --- binarySearch -----------------------------------------------------------
{
  const { result } = runOne('binarySearch', GENERATORS.binarySearch);
  const { arr, target } = GENERATORS.binarySearch.data;
  check('binarySearch', result === arr.indexOf(target), 'phải trả về đúng vị trí của target');
  check('binarySearch', result !== -1, 'dữ liệu mẫu phải chứa target để demo "tìm thấy"');
}

// --- permutations (backtracking) -------------------------------------------
{
  const { steps, result } = runOne('permutations', GENERATORS.permutations);
  const n = GENERATORS.permutations.data.n;
  let fact = 1;
  for (let k = 2; k <= n; k++) fact *= k;
  check('permutations', result.length === fact, `phải sinh đúng ${n}! = ${fact} hoán vị`);
  check('permutations', new Set(result).size === result.length, 'các hoán vị không được trùng nhau');
  const sortedTarget = Array.from({ length: n }, (_, k) => String(k + 1)).join('');
  check(
    'permutations',
    result.every((p) => p.length === n && [...p].sort().join('') === sortedTarget),
    'mỗi hoán vị phải dùng đủ giá trị 1..n, mỗi giá trị đúng một lần',
  );
  const pushes = steps.filter((st) => st.type === 'push').length;
  const pops = steps.filter((st) => st.type === 'pop').length;
  check('permutations', pushes === pops, `số push (${pushes}) phải bằng số pop (${pops})`);
  const maxDepth = Math.max(
    ...steps.map((st) => (Array.isArray(st.stack) ? st.stack.length : 0)),
  );
  check('permutations', maxDepth === n, `độ sâu cột đệ quy tối đa phải đúng bằng ${n}`);
}

console.log(
  failures === 0
    ? '\n✓ Tất cả generator đều đạt kiểm tra.'
    : `\n✗ ${failures} kiểm tra thất bại.`,
);
process.exit(failures === 0 ? 0 : 1);