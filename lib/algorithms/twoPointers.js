/**
 * Hai con trỏ — tìm cặp có tổng bằng S trên dãy đã sắp.
 * Con trỏ trái chỉ có thể tiến, con trỏ phải chỉ có thể lùi ⇒ O(n).
 * @returns {[number, number]|null} chỉ số cặp tìm thấy hoặc null
 */
export const SAMPLE_DATA = { arr: [2, 5, 8, 12, 19, 23, 31, 40, 47], target: 42 };

export function* twoPointers({ arr, target }) {
  let l = 0;
  let r = arr.length - 1;
  yield {
    type: 'compare',
    indices: [l, r],
    array: [...arr],
    meta: `Hai con trỏ xuất phát ở hai đầu — cần cặp có tổng ${target}.`,
  };
  while (l < r) {
    const sum = arr[l] + arr[r];
    yield {
      type: 'compare',
      indices: [l, r],
      array: [...arr],
      meta: `a[${l}] + a[${r}] = ${arr[l]} + ${arr[r]} = ${sum} ${sum === target ? '= S' : sum < target ? '< S' : '> S'}.`,
    };
    if (sum === target) {
      yield {
        type: 'done',
        indices: [l, r],
        array: [...arr],
        meta: `Tìm thấy: a[${l}] + a[${r}] = ${target} — dừng sau O(n) phép so sánh.`,
      };
      return [l, r];
    }
    if (sum < target) {
      yield {
        type: 'mark',
        indices: [l],
        array: [...arr],
        meta: `Tổng nhỏ hơn ${target} ⇒ a[${l}] không ghép được với ai nữa (dãy tăng) ⇒ left tiến.`,
      };
      l += 1;
    } else {
      yield {
        type: 'mark',
        indices: [r],
        array: [...arr],
        meta: `Tổng lớn hơn ${target} ⇒ a[${r}] quá lớn với mọi phần tử còn lại ⇒ right lùi.`,
      };
      r -= 1;
    }
  }
  yield {
    type: 'done',
    array: [...arr],
    meta: 'Hai con trỏ gặp nhau — không tồn tại cặp thỏa mãn.',
  };
  return null;
}

/**
 * Cửa sổ trượt — tổng lớn nhất của cửa sổ độ dài k.
 * @returns {{start: number, best: number}}
 */
export const WINDOW_SAMPLE = { arr: [1, 4, 2, 9, 3, 8, 5, 7, 6], k: 4 };

export function* slidingWindow({ arr, k }) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i];
  let best = sum;
  let start = 0;
  yield {
    type: 'compare',
    indices: Array.from({ length: k }, (_, i) => i),
    array: [...arr],
    meta: `Cửa sổ đầu [0..${k - 1}] có tổng ${sum}.`,
  };
  for (let i = k; i < arr.length; i++) {
    const out = arr[i - k];
    sum += arr[i] - out;
    yield {
      type: 'update',
      indices: [i - k, i],
      array: [...arr],
      meta: `Trượt sang phải: bỏ a[${i - k}] = ${out}, thêm a[${i}] = ${arr[i]} ⇒ tổng ${sum}.`,
    };
    if (sum > best) {
      best = sum;
      start = i - k + 1;
      yield {
        type: 'pivot',
        indices: Array.from({ length: k }, (_, j) => i - k + 1 + j),
        array: [...arr],
        meta: `Tổng tốt nhất mới: ${best} tại [${start}..${start + k - 1}].`,
      };
    }
  }
  yield {
    type: 'done',
    indices: Array.from({ length: k }, (_, j) => start + j),
    array: [...arr],
    meta: `Tổng lớn nhất của cửa sổ ${k} phần tử = ${best}.`,
  };
  return { start, best };
}