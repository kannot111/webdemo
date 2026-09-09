/**
 * Bubble Sort — generator function theo engine visualize.
 *
 * Hợp đồng: nhận mảng số nguyên, lần lượt yield các step
 * (xem lib/algorithms/types.js) tại mỗi thao tác quan trọng,
 * không chạy 1 mạch rồi chỉ in kết quả cuối.
 *
 * Thuật toán: so sánh từng cặp phần tử kề nhau, hoán đổi nếu sai thứ tự.
 * Sau mỗi vòng lặp, phần tử lớn nhất của đoạn chưa sắp được "nổi" lên cuối.
 *
 * @param {number[]} input - mảng cần sắp (không mutate mảng gốc)
 * @yields {{type: string, indices?: number[], array?: number[], meta?: string}}
 */
export function* bubbleSort(input) {
  const arr = [...input];
  const n = arr.length;

  yield {
    type: 'compare',
    indices: [],
    array: [...arr],
    meta: `Bắt đầu với mảng ${n} phần tử. Vòng sắp xếp thứ nhất.`,
  };

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    // Vùng [n - i, n) đã đúng vị trí sau i vòng — highlight bằng mark.
    if (i > 0) {
      yield {
        type: 'mark',
        indices: Array.from({ length: i }, (_, k) => n - 1 - k),
        array: [...arr],
        meta: `Vòng ${i + 1}: ${i} phần tử cuối đã đúng vị trí.`,
      };
    }

    for (let j = 0; j < n - 1 - i; j++) {
      yield {
        type: 'compare',
        indices: [j, j + 1],
        array: [...arr],
        meta: `So sánh a[${j}] = ${arr[j]} với a[${j + 1}] = ${arr[j + 1]}.`,
      };

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        yield {
          type: 'swap',
          indices: [j, j + 1],
          array: [...arr],
          meta: `${arr[j + 1]} > ${arr[j]} nên hoán đổi hai phần tử.`,
        };
      }
    }

    yield {
      type: 'mark',
      indices: [n - 1 - i],
      array: [...arr],
      meta: `a[${n - 1 - i}] = ${arr[n - 1 - i]} đã đúng vị trí, không xét lại.`,
    };

    // Tối ưu: nếu cả vòng không có hoán đổi nào thì mảng đã sắp xong.
    if (!swapped) {
      yield {
        type: 'done',
        array: [...arr],
        meta: 'Cả vòng không có hoán đổi nào — mảng đã sắp xếp xong sớm.',
      };
      return arr;
    }
  }

  yield {
    type: 'done',
    indices: Array.from({ length: n }, (_, k) => k),
    array: [...arr],
    meta: 'Mảng đã được sắp xếp hoàn tất.',
  };
  return arr;
}

/** Dữ liệu mẫu dùng cho trang lý thuyết và visualizer. */
export const SAMPLE_DATA = [38, 12, 45, 7, 29, 3, 41, 18];
