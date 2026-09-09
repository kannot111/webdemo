/**
 * Tìm kiếm nhị phân trên mảng đã sắp — generator function theo engine visualize.
 *
 * Khác các generator sắp xếp, dữ liệu mẫu là một object { arr, target }
 * (mảng đã sắp tăng dần + giá trị cần tìm) vì binary search không đổi mảng,
 * chỉ thu hẹp đoạn [lo..hi].
 *
 * Ngôn ngữ màu trên ArrayVisualizer:
 * - compare : ô mid đang xét (trục của lần chia đôi này).
 * - mark    : các phần tử đã bị LOẠI khỏi không gian tìm kiếm.
 * - done    : chốt vị trí tìm thấy.
 *
 * @yields {{type: string, indices?: number[], array?: number[], meta?: string}}
 * @returns {number} chỉ số tìm thấy, hoặc -1 nếu không có.
 */
export const SAMPLE_DATA = { arr: [3, 7, 11, 16, 19, 24, 31, 38, 45, 52, 60, 71, 84, 90, 97], target: 60 };

export function* binarySearch({ arr, target }) {
  let lo = 0;
  let hi = arr.length - 1;
  const excluded = [];

  yield {
    type: 'compare',
    indices: [],
    array: [...arr],
    meta: `Không gian tìm kiếm ban đầu [${lo}..${hi}] — ${hi - lo + 1} phần tử, cần tìm x = ${target}.`,
  };

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    yield {
      type: 'compare',
      indices: [mid],
      array: [...arr],
      meta: `Đoạn đang xét [${lo}..${hi}]. Xét phần tử giữa a[${mid}] = ${arr[mid]} với x = ${target}.`,
    };

    if (arr[mid] === target) {
      yield {
        type: 'done',
        indices: [mid],
        array: [...arr],
        meta: `a[${mid}] = ${target} — tìm thấy x tại vị trí ${mid} sau ⌈log₂ n⌉ lần chia đôi.`,
      };
      return mid;
    }

    if (arr[mid] < target) {
      // Mọi phần tử từ lo tới mid đều nhỏ hơn x → loại cả đoạn.
      for (let k = lo; k <= mid; k++) excluded.push(k);
      lo = mid + 1;
      yield {
        type: 'mark',
        indices: [...excluded],
        array: [...arr],
        meta: `${arr[mid]} < ${target} nên nửa trái không thể chứa x — loại ${mid - lo + 2} phần tử, còn lại [${lo}..${hi}].`,
      };
    } else {
      for (let k = mid; k <= hi; k++) excluded.push(k);
      hi = mid - 1;
      yield {
        type: 'mark',
        indices: [...excluded],
        array: [...arr],
        meta: `${arr[mid]} > ${target} nên nửa phải không thể chứa x — loại phần tử dư, còn lại [${lo}..${hi}].`,
      };
    }
  }

  yield {
    type: 'done',
    indices: [...excluded],
    array: [...arr],
    meta: `Không gian tìm kiếm rỗng — x = ${target} không nằm trong dãy.`,
  };
  return -1;
}