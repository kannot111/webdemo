/**
 * Tìm kiếm tam phân — cực đại của hàm đơn điệu unimodal trên đoạn nguyên.
 * Mỗi lần so sánh hai điểm m1, m2 rồi loại 1/3 đoạn ⇒ O(log n).
 * @returns {number} vị trí cực đại
 */
export const SAMPLE_DATA = [4, 15, 24, 31, 36, 39, 40, 39, 36, 31, 24, 15, 4];

export function* ternarySearch(input) {
  const f = [...input];
  let lo = 0;
  let hi = f.length - 1;
  yield {
    type: 'compare',
    indices: [],
    array: [...f],
    meta: `Hàm unimodal trên [${lo}..${hi}] — mỗi cột là giá trị f(x).`,
  };
  while (hi - lo > 2) {
    const m1 = lo + Math.floor((hi - lo) / 3);
    const m2 = hi - Math.floor((hi - lo) / 3);
    yield {
      type: 'compare',
      indices: [m1, m2],
      array: [...f],
      meta: `Hai điểm thử: f(${m1}) = ${f[m1]}, f(${m2}) = ${f[m2]}.`,
    };
    if (f[m1] < f[m2]) {
      yield {
        type: 'mark',
        indices: Array.from({ length: m1 - lo + 1 }, (_, k) => lo + k),
        array: [...f],
        meta: `f(${m1}) < f(${m2}) ⇒ cực đại chắc chắn không nằm trong [${lo}..${m1}] — loại 1/3 trái.`,
      };
      lo = m1 + 1;
    } else {
      yield {
        type: 'mark',
        indices: Array.from({ length: hi - m2 + 1 }, (_, k) => m2 + k),
        array: [...f],
        meta: `f(${m1}) ≥ f(${m2}) ⇒ cực đại nằm bên trái ${m2} — loại 1/3 phải.`,
      };
      hi = m2 - 1;
    }
  }
  let best = lo;
  for (let x = lo; x <= hi; x++) if (f[x] > f[best]) best = x;
  yield {
    type: 'done',
    indices: [best],
    array: [...f],
    meta: `Cực đại f(${best}) = ${f[best]} — đoạn còn lại ≤ 3 điểm, xét trực tiếp.`,
  };
  return best;
}