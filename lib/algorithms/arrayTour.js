/**
 * Duyệt mảng/bảng — minh họa truy cập phần tử theo chỉ số.
 * - arrayTour : duyệt 1D, cộng dồn tổng (mảng, con trỏ, struct...)
 * - matrixTour: duyệt 2D theo hàng (chỉ số tuyến tính i·m + j)
 */
export const SAMPLE_DATA = [7, 13, 5, 21, 8, 34];

export function* arrayTour(input) {
  let sum = 0;
  yield { type: 'mark', indices: [], array: [...input], meta: `Mảng ${input.length} phần tử — duyệt tuần tự a[0] → a[${input.length - 1}].` };
  for (let i = 0; i < input.length; i++) {
    sum += input[i];
    yield {
      type: 'visit',
      indices: [i],
      array: [...input],
      meta: `a[${i}] = ${input[i]} — địa chỉ truy cập O(1); tổng hiện tại ${sum}.`,
    };
  }
  yield { type: 'done', array: [...input], meta: `Duyệt hết mảng tốn O(n) phép duyệt, tổng = ${sum}.` };
  return sum;
}

export const SAMPLE_MATRIX = [
  [3, 8, 1],
  [4, 6, 9],
  [2, 7, 5],
];

export function* matrixTour(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const snap = () => matrix.map((r) => [...r]);
  yield { type: 'mark', cells: [], matrix: snap(), meta: `Bảng ${rows}×${cols} — lưu liên tiếp theo hàng trong bộ nhớ.` };
  let sum = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      sum += matrix[i][j];
      yield {
        type: 'visit',
        cells: [[i, j]],
        matrix: snap(),
        meta: `a[${i}][${j}] = ${matrix[i][j]} — ô thứ ${i * cols + j} (i·${cols} + j); tổng ${sum}.`,
      };
    }
  }
  yield { type: 'done', cells: [[rows - 1, cols - 1]], matrix: snap(), meta: `Duyệt hết bảng tốn O(${rows}·${cols}); tổng = ${sum}.` };
  return sum;
}