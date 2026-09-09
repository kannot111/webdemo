/** Sàng nguyên tố Eratosthenes — đánh dấu bội của mỗi số nguyên tố. */
export const SAMPLE_SIEVE = 50;

export function* sieveDemo(N) {
  const isComposite = Array(N + 1).fill(false);
  const snap = () => [...isComposite];
  yield { type: 'mark', indices: [], array: snap(), meta: `Sàng các số 0..${N}: ban đầu chưa có số nào bị đánh dấu.` };
  for (let p = 2; p * p <= N; p++) {
    if (isComposite[p]) continue;
    yield { type: 'pivot', indices: [p], array: snap(), meta: `${p} chưa bị đánh dấu ⇒ nguyên tố. Đánh dấu tất cả bội của nó.` };
    for (let m = p * p; m <= N; m += p) {
      if (!isComposite[m]) {
        isComposite[m] = true;
        yield { type: 'update', indices: [m], array: snap(), meta: `Đánh dấu ${m} = ${p}·${Math.floor(m / p)} (hợp số).` };
      }
    }
  }
  const primes = [];
  for (let i = 2; i <= N; i++) if (!isComposite[i]) primes.push(i);
  yield {
    type: 'done', indices: primes, array: snap(),
    meta: `Nguyên tố ≤ ${N}: ${primes.join(', ')} — dựng O(N log log N), mỗi hợp số bị gỡ đúng theo các ước nguyên tố nhỏ nhất.`,
  };
  return primes;
}

/** Euclid mở rộng — tìm (x, y) để a·x + b·y = g = gcd(a, b). */
export const SAMPLE_EUCLID = { a: 240, b: 46 };

export function* euclidExtended({ a, b }) {
  const snap = (g, x, y) => [g, x, y];
  yield { type: 'mark', indices: [0, 1], array: snap(a, b, 0), meta: `Tìm gcd(${a}, ${b}) và (x, y): ${a}·x + ${b}·y = gcd. Hàng hiện: [gcd, x, y] đang xét.` };
  const steps = [];
  let r0 = a;
  let r1 = b;
  while (r1 !== 0) {
    const q = Math.floor(r0 / r1);
    steps.push({ r0, r1, q });
    yield {
      type: 'compare', indices: [0, 1], array: snap(r0, r1, q),
      meta: `${r0} = ${r1}·${q} + ${r0 % r1} — gcd giữ nguyên khi chia lấy dư.`,
    };
    [r0, r1] = [r1, r0 % r1];
  }
  const g = r0;
  // Euclid mở rộng truy vết ngược
  let x = 1;
  let y = 0;
  for (let i = steps.length - 1; i >= 0; i--) {
    const { r0: ra, r1: rb } = steps[i];
    [x, y] = [y, x - Math.floor(ra / rb) * y];
    yield {
      type: 'update', indices: [0], array: snap(ra, rb, x),
      meta: `Truy vết: ${ra}·(${x}) + ${rb}·(${y}) = ${g}.`,
    };
  }
  yield {
    type: 'done', indices: [0, 1], array: snap(g, x, y),
    meta: `gcd(${a}, ${b}) = ${g}; hệ số Bezout: ${a}·(${x}) + ${b}·(${y}) = ${g} — nền tảng của nghịch đảo modulo.`,
  };
  return { g, x, y };
}

/** Luỹ thừa nhị phân — tính a^n bằng lũy thừa của 2 (O(log n) phép nhân). */
export const SAMPLE_BINPOW = { a: 3, n: 13 };

export function* binPow({ a, n }) {
  let result = 1;
  let base = a;
  let exp = n;
  const snap = () => [result, base, exp];
  const idx = { result: 0, base: 1, exp: 2 };
  yield {
    type: 'mark', indices: [0, 1, 2], array: snap(),
    meta: `Tính ${a}^${n}: n = ${n.toString(2)} (nhị phân) — nhân dồn các luỹ thừa 2 của a tương ứng bit bật.`,
  };
  while (exp > 0) {
    if (exp & 1) {
      result *= base;
      yield {
        type: 'update', indices: [idx.result, idx.exp], array: snap(),
        meta: `Bit thấp nhất = 1 ⇒ result ×= ${base} ⇒ result = ${result}; exp >>= 1 (còn ${exp >> 1} = ${exp >> 1}).`,
      };
    } else {
      yield {
        type: 'compare', indices: [idx.exp], array: snap(),
        meta: `Bit thấp nhất = 0 ⇒ bỏ qua nhân, exp >>= 1 (còn ${exp >> 1}).`,
      };
    }
    exp >>= 1;
    if (exp > 0) {
      base *= base;
      yield { type: 'update', indices: [idx.base], array: snap(), meta: `Bình phương cơ số: base ×= base ⇒ ${base}.` };
    }
  }
  yield { type: 'done', indices: [idx.result], array: snap(), meta: `Kết quả ${a}^${n} = ${result} — chỉ ${n.toString(2).length} vòng lặp thay vì ${n} phép nhân.` };
  return result;
}

/** Tam giác Pascal — quy nạp C(n, k) = C(n-1, k-1) + C(n-1, k). */
export const SAMPLE_PASCAL = 6;

export function* pascalDemo(n) {
  const rows = [];
  for (let i = 0; i < n; i++) rows.push(Array(i + 1).fill(0));
  const snap = () => rows.map((r) => [...r]);
  yield { type: 'mark', cells: [], matrix: snap(), meta: 'C(k, 0) = C(k, k) = 1 — hai mép của tam giác luôn bằng 1.' };
  for (let i = 0; i < n; i++) {
    rows[i][0] = 1;
    rows[i][i] = 1;
    yield { type: 'update', cells: [[i, 0], [i, i]], matrix: snap(), meta: `Hàng ${i}: hai mép bằng 1.` };
    for (let k = 1; k < i; k++) {
      rows[i][k] = rows[i - 1][k - 1] + rows[i - 1][k];
      yield {
        type: 'update', cells: [[i, k]], matrix: snap(),
        meta: `C(${i}, ${k}) = C(${i - 1}, ${k - 1}) + C(${i - 1}, ${k}) = ${rows[i][k]} — mỗi ô là tổng hai ô phía trên.`,
      };
    }
  }
  yield {
    type: 'done', cells: [[n - 1, Math.floor((n - 1) / 2)]], matrix: snap(),
    meta: `Tam giác đầy đủ ${n} hàng — C(${n - 1}, ${Math.floor((n - 1) / 2)}) = ${rows[n - 1][Math.floor((n - 1) / 2)]}; bảng này dựng O(n²) và trả lời mọi C(n, k) O(1).`,
  };
  return rows;
}
