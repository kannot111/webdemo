/**
 * Mảng cộng dồn (Prefix Sum) — generator function theo engine visualize.
 *
 * Hai biến thể:
 * - prefixSum1D: dựng mảng cộng dồn 1 chiều rồi trả lời một truy vấn đoạn.
 * - prefixSum2D: dựng bảng cộng dồn 2 chiều rồi trả lời một truy vấn hình chữ nhật.
 *
 * 1D yield step dạng mảng (render bởi ArrayVisualizer): pre có n + 1 phần tử,
 * phần tử 0 là viền 0 — sau khi dựng xong, tổng đoạn [l..r] là hiệu hai ô.
 *
 * 2D yield step có trường `matrix` (snapshot bảng (n+1)×(m+1)) và `cells`
 * (các ô vừa tác động) — render bởi MatrixVisualizer.
 *
 * @yields {{type: string, indices?: number[], array?: number[], matrix?: number[][], cells?: number[][], meta?: string}}
 */

/** Dữ liệu mẫu 1D dùng cho trang lý thuyết và visualizer. */
export const SAMPLE_DATA = [3, -1, 4, 1, 5, 9, -2, 6];

/** Truy vấn mẫu 1D: tổng đoạn [l..r] (đánh số từ 0, incluside cả hai đầu). */
export const SAMPLE_QUERY_1D = { l: 2, r: 6 };

/** Ma trận mẫu 2D (3×4). */
export const SAMPLE_MATRIX = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
];

/** Truy vấn mẫu 2D: hình chữ nhật (r1, c1) → (r2, c2), 0-based, incluside. */
export const SAMPLE_QUERY_2D = { r1: 0, c1: 2, r2: 2, c2: 3 };

export function* prefixSum1D(input) {
  const n = input.length;
  const pre = new Array(n + 1).fill(0);

  yield {
    type: 'update',
    indices: [0],
    array: [...pre],
    meta: 'pre[0] = 0 — viền gốc của mảng cộng dồn (chọn hằng số c = 0).',
  };

  for (let i = 0; i < n; i++) {
    pre[i + 1] = pre[i] + input[i];
    yield {
      type: 'update',
      indices: [i + 1],
      array: [...pre],
      meta: `pre[${i + 1}] = pre[${i}] + a[${i}] = ${pre[i]} + (${input[i]}) = ${pre[i + 1]}.`,
    };
  }

  const { l, r } = SAMPLE_QUERY_1D;
  yield {
    type: 'compare',
    indices: [l, r + 1],
    array: [...pre],
    meta: `Truy vấn tổng a[${l}..${r}]: lấy pre[${r + 1}] − pre[${l}] = ${pre[r + 1]} − ${pre[l]}.`,
  };

  yield {
    type: 'done',
    indices: [l, r + 1],
    array: [...pre],
    meta: `Kết quả ${pre[r + 1] - pre[l]} — trả lời truy vấn trong O(1) sau khi dựng O(n).`,
  };
  return pre;
}

export function* prefixSum2D(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const pre = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));
  const snap = () => pre.map((row) => [...row]);

  yield {
    type: 'update',
    cells: [],
    matrix: snap(),
    meta: 'pre[i][j] = tổng hình chữ nhật từ (0,0) tới (i−1, j−1). Hàng 0 và cột 0 là viền 0.',
  };

  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
      pre[i][j] =
        pre[i - 1][j] + pre[i][j - 1] - pre[i - 1][j - 1] + matrix[i - 1][j - 1];
      yield {
        type: 'update',
        cells: [[i, j]],
        matrix: snap(),
        meta: `pre[${i}][${j}] = trên + trái − chéo + a = ${pre[i - 1][j]} + ${pre[i][j - 1]} − ${pre[i - 1][j - 1]} + ${matrix[i - 1][j - 1]} = ${pre[i][j]}.`,
      };
    }
  }

  const { r1, c1, r2, c2 } = SAMPLE_QUERY_2D;
  yield {
    type: 'compare',
    cells: [
      [r2 + 1, c2 + 1],
      [r1, c2 + 1],
      [r2 + 1, c1],
      [r1, c1],
    ],
    matrix: snap(),
    meta: `Truy vấn hình chữ nhật (${r1},${c1}) → (${r2},${c2}): lấy pre[${r2 + 1}][${c2 + 1}] trừ hai dải thừa, cộng lại phần bị trừ hai lần.`,
  };

  const sum =
    pre[r2 + 1][c2 + 1] - pre[r1][c2 + 1] - pre[r2 + 1][c1] + pre[r1][c1];
  yield {
    type: 'done',
    cells: [
      [r2 + 1, c2 + 1],
      [r1, c2 + 1],
      [r2 + 1, c1],
      [r1, c1],
    ],
    matrix: snap(),
    meta: `Kết quả ${sum} — mỗi truy vấn 2D trả lời trong O(1).`,
  };
  return pre;
}