/** KMP — hàm tiền tố (failure): π[i] = độ dài tiền tố = hậu tố dài nhất. */
export const SAMPLE_KMP = { pattern: 'ABACABAB' };

export function* kmpDemo({ pattern }) {
  const p = pattern;
  const n = p.length;
  const pi = Array(n).fill(0);
  const snap = () => [...pi];
  yield { type: 'mark', indices: [], array: snap(), meta: `Xâu mẫu "${p}" — π[0] = 0, tính π[i] bằng cách tận dụng π[i-1] (không so lại từ đầu!).` };
  for (let i = 1; i < n; i++) {
    let k = pi[i - 1];
    while (k > 0 && p[i] !== p[k]) {
      yield { type: 'compare', indices: [i, k], array: snap(), meta: `p[${i}] = '${p[i]}' ≠ p[${k}] = '${p[k]}' — lùi về π[${k}] = ${pi[k]} (nhảy nhanh, không so lại hết).` };
      k = pi[k - 1];
    }
    if (p[i] === p[k]) k += 1;
    pi[i] = k;
    yield {
      type: 'update', indices: [i], array: snap(),
      meta: `π[${i}] = ${k}: tiền tố dài nhất = hậu tố kết thúc tại ${i} là "${p.slice(0, k)}".`,
    };
  }
  yield {
    type: 'done', indices: [n - 1], array: snap(),
    meta: `Bảng π hoàn tất — khi khớp thất bại trong văn bản, chỉ cần nhảy theo π ⇒ O(n + m) thay vì O(n·m).`,
  };
  return pi;
}

/** Z-function — z[i] = độ dài xâu con dài nhất bắt đầu tại i trùng tiền tố. */
export const SAMPLE_Z = { s: 'aabxaab' };

export function* zalgoDemo({ s }) {
  const n = s.length;
  const z = Array(n).fill(0);
  const snap = () => [...z];
  yield { type: 'mark', indices: [], array: snap(), meta: `Xâu "${s}" — z[0] thường không định nghĩa (đặt = n), duy trì đoạn [l, r] trùng tiền tố.` };
  let l = 0;
  let r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i] += 1;
    if (i + z[i] > r) {
      l = i;
      r = i + z[i];
    }
    yield {
      type: 'update', indices: [i], array: snap(),
      meta: `z[${i}] = ${z[i]} — so sánh tận dụng đoạn [${l}, ${r}] đã biết trùng tiền tố "${s.slice(0, z[i])}".`,
    };
  }
  yield {
    type: 'done', indices: [n - 1], array: snap(),
    meta: 'Bảng z hoàn tất — tìm xuất hiện của mẫu P trong văn bản T bằng cách chạy trên P + "#" + T.',
  };
  return z;
}

/** Băm xâu (polynomial rolling hash) — tiền tố băm + lũy thừa cơ số. */
export const SAMPLE_HASH_STR = { s: 'ababba' };

export function* hashStrDemo({ s }) {
  const MOD = 1_000_000_007;
  const BASE = 31;
  const n = s.length;
  const h = [0]; // h[i] = hash của tiền tố i ký tự đầu
  const pw = [1];
  const snap = () => [...h];
  yield { type: 'mark', indices: [], array: snap(), meta: `Băm xâu "${s}" với cơ số ${BASE} mod ${MOD} — mảng h có ${n + 1} phần tử, h[0] = 0.` };
  for (let i = 0; i < n; i++) {
    h.push((h[i] * BASE + (s.charCodeAt(i) - 96)) % MOD);
    pw.push((pw[i] * BASE) % MOD);
    yield {
      type: 'update', indices: [i + 1], array: snap(),
      meta: `Cộng ký tự '${s[i]}': h[${i + 1}] = h[${i}]·${BASE} + ${s.charCodeAt(i) - 96} = ${h[i + 1]}.`,
    };
  }
  const li = 1;
  const lj = 4; // xâu con [1..4] = "bab"
  const sub = (l, r) => ((h[r] - h[l - 1] * pw[r - l + 1]) % MOD + MOD) % MOD;
  yield {
    type: 'compare', indices: [li - 1, lj], array: snap(),
    meta: `Hash xâu con [${li}..${lj}] ("${s.slice(li - 1, lj)}") = (h[${lj}] − h[${li - 1}]·${pw[lj - li + 1]}) mod ${MOD} = ${sub(li, lj)} — lấy O(1) mọi xâu con.`,
  };
  yield {
    type: 'done', indices: [n], array: snap(),
    meta: 'Trước khi dùng: nên kiểm tra lại bằng so sánh trực tiếp (chống collision), hoặc dùng 2 mô-đun khác nhau.',
  };
  return h;
}
