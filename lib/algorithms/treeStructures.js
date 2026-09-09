/**
 * Cây phân đoạn (Segment Tree) — phiên bản 1-indexed dạng mảng:
 * node 1 là gốc, node v có con 2v và 2v + 1, lá ở [n..2n-1].
 * Minh họa: dựng cây, truy vấn tổng đoạn [l..r], cập nhật điểm.
 */
export const SAMPLE_SEGTREE = [5, 2, 9, 1, 7, 3, 8, 6];

export function* segmentTreeDemo(arr) {
  const n = arr.length;
  const tree = Array(2 * n).fill(0);
  const snap = () => [...tree];
  const nodeLabel = (v) => {
    // mô tả đoạn mà node v phụ trách (chỉ đúng với cây n = 2^k, n = 8 ở đây)
    return null;
  };

  yield {
    type: 'mark',
    indices: [],
    array: snap(),
    meta: `Cây phân đoạn lưu trong mảng 2n ô: ô ${n}..${2 * n - 1} là lá (chính a[0..${n - 1}]), ô 1..${n - 1} là nút cha = tổng hai con.`,
  };

  for (let i = 0; i < n; i++) {
    tree[n + i] = arr[i];
    yield { type: 'update', indices: [n + i], array: snap(), meta: `Lá ${n + i} = a[${i}] = ${arr[i]}.` };
  }
  for (let v = n - 1; v >= 1; v--) {
    tree[v] = tree[2 * v] + tree[2 * v + 1];
    yield {
      type: 'update',
      indices: [v],
      array: snap(),
      meta: `Nút ${v} = con trái ${2 * v} + con phải ${2 * v + 1} = ${tree[v]}.`,
    };
  }

  // Truy vấn tổng [2..6]
  const l = 2;
  const r = 6;
  let res = 0;
  let lo = l + n;
  let hi = r + n + 1;
  const visited = [];
  while (lo < hi) {
    if (lo & 1) {
      res += tree[lo];
      visited.push(lo);
      lo += 1;
    }
    if (hi & 1) {
      hi -= 1;
      res += tree[hi];
      visited.push(hi);
    }
    lo >>= 1;
    hi >>= 1;
  }
  yield {
    type: 'compare',
    indices: visited,
    array: snap(),
    meta: `Truy vấn tổng [${l}..${r}]: leo từ hai lá lên, gom ${visited.length} nút → ${res}.`,
  };
  yield {
    type: 'done',
    indices: visited,
    array: snap(),
    meta: `Tổng [${l}..${r}] = ${res} — dựng O(n), truy vấn/cập nhật O(log n), không cần đệ quy.`,
  };
  return res;
}

/**
 * Heap nhị phân (min-heap) — cắm phần tử nổi bọt lên (sift-up) rồi
 * lấy phần tử nhỏ nhất xuống đáy (sift-down). Hiển thị dạng mảng:
 * con của i là 2i+1 và 2i+2 (0-indexed).
 */
export const SAMPLE_HEAP = [7, 2, 9, 4, 1];

export function* heapDemo(input) {
  const h = [];
  const snap = () => [...h];

  yield { type: 'mark', indices: [], array: [], meta: 'Min-heap dạng mảng: con của i là 2i+1 và 2i+2, cha của i là (i-1)/2.' };

  for (const x of input) {
    h.push(x);
    let i = h.length - 1;
    yield {
      type: 'push',
      indices: [i],
      array: snap(),
      meta: `Cắm ${x} vào đáy heap tại vị trí ${i}.`,
    };
    while (i > 0 && h[(i - 1) >> 1] > h[i]) {
      const p = (i - 1) >> 1;
      yield {
        type: 'compare',
        indices: [p, i],
        array: snap(),
        meta: `Cha ${h[p]} > ${h[i]} — vi phạm tính chất heap, cần nổi lên.`,
      };
      [h[p], h[i]] = [h[i], h[p]];
      yield { type: 'swap', indices: [p, i], array: snap(), meta: `Hoán đổi với cha — ${h[p]} lên vị trí ${p}.` };
      i = p;
    }
    yield { type: 'mark', indices: [0], array: snap(), meta: `Heap hợp lệ — phần nhỏ nhất luôn ở gốc (vị trí 0): ${h[0]}.` };
  }

  while (h.length > 0) {
    const min = h[0];
    h[0] = h[h.length - 1];
    h.pop();
    yield {
      type: 'update',
      indices: h.length ? [0] : [],
      array: snap(),
      meta: h.length ? `Lấy min = ${min}; phần tử cuối về gốc, chuẩn bị sift-down.` : `Lấy min cuối = ${min} — heap rỗng.`,
    };
    let i = 0;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let m = i;
      if (l < h.length && h[l] < h[m]) m = l;
      if (r < h.length && h[r] < h[m]) m = r;
      if (m === i) break;
      [h[i], h[m]] = [h[m], h[i]];
      yield { type: 'swap', indices: [i, m], array: snap(), meta: `Sift-down: hoán đổi về phía con nhỏ hơn (vị trí ${m}).` };
      i = m;
    }
  }

  yield {
    type: 'done',
    array: [],
    meta: 'Heap trống — đã lấy ra toàn bộ theo thứ tự tăng dần (heapsort!). Cắm/lấy đều O(log n).',
  };
  return input.length;
}