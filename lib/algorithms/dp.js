/**
 * Thuật toán Kadane — tổng đoạn con lớn nhất (largest sum subarray).
 * Đi từ trái sang phải, giữ tổng tiền tố đang chạy; mỗi khi tổng < 0 thì
 * "hủy" đoạn cũ vì nó chỉ làm chậm tổng đoạn phía sau.
 */
export const SAMPLE_DATA = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

export function* kadane(input) {
  const arr = [...input];
  let cur = 0;
  let best = -Infinity;
  let start = 0;
  let bestStart = 0;
  let bestEnd = 0;

  yield { type: 'mark', indices: [], array: [...arr], meta: `Tìm đoạn con liên tiếp có tổng lớn nhất trên ${arr.length} phần tử.` };

  for (let i = 0; i < arr.length; i++) {
    if (cur === 0 && i > 0) start = i; // đoạn mới bắt đầu tại đây
    cur += arr[i];
    yield {
      type: 'compare',
      indices: [i],
      array: [...arr],
      meta: `Mở rộng đoạn hiện tại tới a[${i}] = ${arr[i]} ⇒ tổng ${cur}.`,
    };
    if (cur > best) {
      best = cur;
      bestStart = start;
      bestEnd = i;
      yield {
        type: 'pivot',
        indices: Array.from({ length: bestEnd - bestStart + 1 }, (_, k) => bestStart + k),
        array: [...arr],
        meta: `Tổng tốt nhất mới = ${best} tại đoạn [${bestStart}..${bestEnd}].`,
      };
    }
    if (cur < 0) {
      yield {
        type: 'mark',
        indices: [i],
        array: [...arr],
        meta: `Tổng ${cur} < 0 ⇒ đoạn này chỉ tổn hại cho phía sau — bỏ và bắt đầu lại từ a[${i + 1}].`,
      };
      cur = 0;
    }
  }
  yield {
    type: 'done',
    indices: Array.from({ length: bestEnd - bestStart + 1 }, (_, k) => bestStart + k),
    array: [...arr],
    meta: `Kết quả: tổng lớn nhất = ${best} tại đoạn [${bestStart}..${bestEnd}] — chỉ đi qua mảng một lần O(n).`,
  };
  return best;
}

/**
 * Longest Increasing Subsequence (LIS) — O(n log n) bằng tìm kiếm nhị phân
 * trên "măng" tails: tails[k] = phần tử cuối nhỏ nhất của LIS độ dài k+1.
 */
export const SAMPLE_LIS = [10, 3, 12, 4, 15, 2, 18, 11, 13];

export function* lis(input) {
  const arr = [...input];
  const tails = []; // tails[k] = giá trị cuối của LIS độ dài k+1
  const snap = () => [...tails];
  const posOf = [];

  yield { type: 'mark', indices: [], array: [...arr], meta: 'Dải dưới là "măng" tails — tails[k] luôn tăng dần ⇒ tìm nhị phân được.' };

  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    // Tìm vị trí đầu tiên trong tails có giá trị >= x.
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    const k = lo;
    yield {
      type: 'compare',
      indices: [i],
      array: [...arr],
      meta: `Xét a[${i}] = ${x}: chèn vào vị trí ${k} của măng (độ dài LIS kết thúc tại a[${i}] là ${k + 1}).`,
    };
    if (k === tails.length) {
      tails.push(x);
      yield {
        type: 'push',
        indices: [tails.length - 1],
        array: snap(),
        meta: `${x} lớn hơn mọi tail ⇒ măng dài thêm 1 — tìm được LIS dài hơn.`,
      };
    } else {
      tails[k] = x;
      yield {
        type: 'update',
        indices: [k],
        array: snap(),
        meta: `Ghi đè tails[${k}] = ${x} (giá trị cuối nhỏ hơn ⇒ dễ ghép phần tử sau hơn — LIS dài ${k + 1} vẫn giữ).`,
      };
    }
    posOf.push(k + 1);
  }

  yield {
    type: 'done',
    array: snap(),
    meta: `Độ dài LIS = ${tails.length} (măng cuối: [${tails.join(', ')}]) — mỗi phần tử tốn O(log n) tìm nhị phân.`,
  };
  return tails.length;
}

/**
 * Bảng băm — minh họa cắm phần tử (khởi đầu là dò tuyến tính khi va chạm).
 * Bảng kích thước 8, hàm băm lấy mô-đun — ô được tô là ô đang xét.
 */
export const SAMPLE_HASH = [31, 12, 47, 12, 8, 5, 21];

export function* hashDemo(keys) {
  const M = 8;
  const table = Array(M).fill(null);
  const snap = () => [...table];
  const idx = (k) => ((k % M) + M) % M;

  yield { type: 'mark', indices: [], array: snap(), meta: `Bảng băm ${M} ô trống — hàm băm h(k) = k mod ${M}.` };

  for (const k of keys) {
    let h = idx(k);
    yield {
      type: 'compare',
      indices: [h],
      array: snap(),
      meta: `Cắm ${k}: h(${k}) = ${k} mod ${M} = ${h}.`,
    };
    while (table[h] !== null) {
      yield {
        type: 'update',
        indices: [h],
        array: snap(),
        meta: `Va chạm tại ô ${h} (${table[h]}) — dò ô kế tiếp (linear probing).`,
      };
      h = (h + 1) % M;
      yield {
        type: 'compare',
        indices: [h],
        array: snap(),
        meta: `Thử ô ${h}: ${table[h] === null ? 'trống — cắm được!' : `bị chiếm bởi ${table[h]}.`}`,
      };
    }
    table[h] = k;
    yield {
      type: 'update',
      indices: [h],
      array: snap(),
      meta: `Cắm ${k} vào ô ${h} ${h !== idx(k) ? `(dời ${h - idx(k)} lần)` : '(ngay ô đích)'}.`,
    };
  }

  yield {
    type: 'done',
    array: snap(),
    meta: `Bảng đầy ${keys.length}/${M} — tra cứu trung bình O(1), xấu nhất O(n) khi nhiều va chạm.`,
  };
  return table;
}