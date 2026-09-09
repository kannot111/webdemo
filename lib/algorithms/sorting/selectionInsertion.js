/**
 * Selection Sort — chọn phần tử nhỏ nhất của đoạn chưa sắp đưa về đầu đoạn.
 * @returns {number[]} mảng đã sắp
 */
export const SAMPLE_DATA = [29, 10, 14, 37, 13, 25, 5];

export function* selectionSort(input) {
  const arr = [...input];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      yield {
        type: 'compare',
        indices: [min, j],
        array: [...arr],
        meta: `Tìm min của [${i}..${n - 1}]: so sánh a[${j}] = ${arr[j]} với min hiện tại a[${min}] = ${arr[min]}.`,
      };
      if (arr[j] < arr[min]) {
        min = j;
        yield {
          type: 'pivot',
          indices: [min],
          array: [...arr],
          meta: `a[${j}] = ${arr[j]} nhỏ hơn → min mới tại vị trí ${j}.`,
        };
      }
    }
    if (min !== i) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
      yield {
        type: 'swap',
        indices: [i, min],
        array: [...arr],
        meta: `Hoán đổi min về đầu đoạn: a[${i}] ↔ a[${min}].`,
      };
    }
    yield {
      type: 'mark',
      indices: Array.from({ length: i + 1 }, (_, k) => k),
      array: [...arr],
      meta: `Chốt vị trí ${i} — ${i + 1} phần tử đầu đã đúng vị trí.`,
    };
  }
  yield {
    type: 'done',
    indices: Array.from({ length: n }, (_, k) => k),
    array: [...arr],
    meta: 'Mảng đã được sắp xếp hoàn tất.',
  };
  return arr;
}

/**
 * Insertion Sort — chèn từng phần tử vào đoạn đầu đã sắp (như xếp bài trên tay).
 * @returns {number[]} mảng đã sắp
 */
export function* insertionSort(input) {
  const arr = [...input];
  const n = arr.length;
  yield {
    type: 'mark',
    indices: [0],
    array: [...arr],
    meta: 'Phần tử đầu tự thành đoạn đã sắp độ dài 1.',
  };
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    yield {
      type: 'pivot',
      indices: [i],
      array: [...arr],
      meta: `Rút a[${i}] = ${key} — chèn vào đoạn [0..${i - 1}] đã sắp.`,
    };
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      yield {
        type: 'update',
        indices: [j + 1],
        array: [...arr],
        meta: `a[${j}] = ${arr[j]} > ${key} → dịch phải sang a[${j + 1}].`,
      };
      j -= 1;
    }
    arr[j + 1] = key;
    yield {
      type: 'mark',
      indices: Array.from({ length: i + 1 }, (_, k) => k),
      array: [...arr],
      meta: `Chèn ${key} vào vị trí ${j + 1} — đoạn [0..${i}] đã sắp.`,
    };
  }
  yield {
    type: 'done',
    indices: Array.from({ length: n }, (_, k) => k),
    array: [...arr],
    meta: 'Mảng đã được sắp xếp hoàn tất.',
  };
  return arr;
}