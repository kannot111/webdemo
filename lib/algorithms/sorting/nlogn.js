/**
 * Quick Sort (phân hoạch Lomuto, pivot = phần tử cuối đoạn) — đệ quy sinh bước.
 * @returns {number[]} mảng đã sắp
 */
export const SAMPLE_DATA = [35, 12, 68, 4, 90, 21, 55, 7];

export function* quickSort(input) {
  const arr = [...input];
  yield {
    type: 'compare',
    indices: [],
    array: [...arr],
    meta: `Quick Sort trên ${arr.length} phần tử: chọn pivot là phần tử cuối mỗi đoạn (Lomuto).`,
  };
  yield* qs(arr, 0, arr.length - 1);
  yield {
    type: 'done',
    indices: Array.from({ length: arr.length }, (_, k) => k),
    array: [...arr],
    meta: 'Mảng đã được sắp xếp hoàn tất.',
  };
  return arr;
}

function* qs(arr, lo, hi) {
  if (lo > hi) return;
  if (lo === hi) {
    yield { type: 'mark', indices: [lo], array: [...arr], meta: `Đoạn 1 phần tử a[${lo}] = ${arr[lo]} — tự đúng vị trí.` };
    return;
  }
  const pivot = arr[hi];
  yield {
    type: 'pivot',
    indices: [hi],
    array: [...arr],
    meta: `Phân hoạch [${lo}..${hi}]: pivot = a[${hi}] = ${pivot}.`,
  };
  let i = lo;
  for (let j = lo; j < hi; j++) {
    yield {
      type: 'compare',
      indices: [j, hi],
      array: [...arr],
      meta: `So a[${j}] = ${arr[j]} với pivot ${pivot}: đưa về phía ${arr[j] < pivot ? 'trái' : 'phải'}.`,
    };
    if (arr[j] < pivot) {
      if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield { type: 'swap', indices: [i, j], array: [...arr], meta: `Nhỏ hơn pivot → hoán đổi về nhóm trái (vị trí ${i}).` };
      }
      i += 1;
    }
  }
  [arr[i], arr[hi]] = [arr[hi], arr[i]];
  yield {
    type: 'swap',
    indices: [i, hi],
    array: [...arr],
    meta: `Chốt pivot về vị trí ${i}: bên trái < ${pivot} ≤ bên phải.`,
  };
  yield { type: 'mark', indices: [i], array: [...arr], meta: `a[${i}] = ${pivot} đã đúng vị trí. Chia đôi và lặp lại.` };
  yield* qs(arr, lo, i - 1);
  yield* qs(arr, i + 1, hi);
}

/**
 * Merge Sort — chia đôi, sắp đệ quy rồi trộn hai nửa đã sắp.
 * @returns {number[]} mảng đã sắp
 */
export function* mergeSort(input) {
  const arr = [...input];
  yield {
    type: 'compare',
    indices: [],
    array: [...arr],
    meta: 'Merge Sort: chia đôi đến từng phần tử rồi trộn các cặp nửa đã sắp.',
  };
  yield* ms(arr, 0, arr.length - 1);
  yield {
    type: 'done',
    indices: Array.from({ length: arr.length }, (_, k) => k),
    array: [...arr],
    meta: 'Mảng đã được sắp xếp hoàn tất.',
  };
  return arr;
}

function* ms(arr, lo, hi) {
  if (lo >= hi) return;
  const mid = (lo + hi) >> 1;
  yield* ms(arr, lo, mid);
  yield* ms(arr, mid + 1, hi);
  // Trộn hai nửa [lo..mid] và [mid+1..hi] (đã sắp).
  const tmp = [];
  let a = lo;
  let b = mid + 1;
  while (a <= mid && b <= hi) {
    yield {
      type: 'compare',
      indices: [a, b],
      array: [...arr],
      meta: `Trộn [${lo}..${mid}] + [${mid + 1}..${hi}]: so ${arr[a]} với ${arr[b]} — lấy ${Math.min(arr[a], arr[b])}.`,
    };
    tmp.push(arr[a] <= arr[b] ? arr[a++] : arr[b++]);
  }
  while (a <= mid) tmp.push(arr[a++]);
  while (b <= hi) tmp.push(arr[b++]);
  for (let k = 0; k < tmp.length; k++) {
    arr[lo + k] = tmp[k];
    yield {
      type: 'update',
      indices: [lo + k],
      array: [...arr],
      meta: `Ghi kết quả trộn vào a[${lo + k}] = ${tmp[k]}.`,
    };
  }
  yield {
    type: 'mark',
    indices: Array.from({ length: hi - lo + 1 }, (_, k) => lo + k),
    array: [...arr],
    meta: `Đoạn [${lo}..${hi}] đã được trộn và sắp xong.`,
  };
}