/**
 * Disjoint Set Union (DSU) — các tập hợp rời rạc với union by size +
 * path compression (nén đường đi khi find). Hiển thị cha của mỗi nút;
 * gốc của cây có cha trỏ vào chính nó.
 */
export const SAMPLE_DATA = { n: 8, unions: [[0, 1], [2, 3], [4, 5], [0, 2], [6, 7], [4, 6], [3, 4]] };

function* dsuCore(n, unions) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const size = Array(n).fill(1);
  const snap = () => [...parent];
  const keys = (arr) => (arr ?? []).map(String);

  yield { type: 'mark', keys: keys(Array.from({ length: n }, (_, i) => i)), graph: { nodes: Array.from({ length: n }, (_, i) => String(i)), edges: [], directed: false }, meta: `${n} đỉnh, ban đầu mỗi đỉnh là một tập riêng (cha = chính nó).` };

  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]; // nén đường: nhảy thẳng lên ông nội
      x = parent[x];
    }
    return x;
  }

  for (const [a, b] of unions) {
    const ra = find(a);
    const rb = find(b);
    yield {
      type: 'compare',
      keys: keys([ra, rb]),
      graph: { nodes: Array.from({ length: n }, (_, i) => String(i)), edges: [], directed: false },
      meta: `union(${a}, ${b}): gốc của ${a} là ${ra}, gốc của ${b} là ${rb} ${ra === rb ? '— cùng gốc, bỏ qua!' : '— khác gốc, cần gộp.'}`,
    };
    if (ra !== rb) {
      if (size[ra] < size[rb]) [ra, rb] = [rb, ra]; // union by size
      parent[rb] = ra;
      size[ra] += size[rb];
      yield {
        type: 'update',
        keys: keys([ra, rb]),
        graph: { nodes: Array.from({ length: n }, (_, i) => String(i)), edges: [], directed: false },
        meta: `Gắn gốc ${rb} vào gốc ${ra} (union by size — cây thấp) ⇒ tập mới có ${size[ra]} phần tử.`,
      };
    }
  }

  const roots = new Set();
  for (let i = 0; i < n; i++) roots.add(find(i));
  yield {
    type: 'done',
    keys: keys([...roots]),
    graph: { nodes: Array.from({ length: n }, (_, i) => String(i)), edges: [], directed: false },
    meta: `Kết thúc: còn ${roots.size} tập rời rạc (số lượng gốc khác nhau).`,
  };
  return roots.size;
}

export function* dsuDemo() {
  yield* dsuCore(SAMPLE_DATA.n, SAMPLE_DATA.unions);
}

/**
 * Cây Fenwick (Binary Indexed Tree) — cập nhật điểm, lấy tổng tiền tố.
 * i & (-i) là bit thấp nhất của i: mọi chỉ số chỉ "nhảy" theo bit bật.
 */
export const SAMPLE_FENWICK = { arr: [5, 2, 9, -1, 4, 7, 1, 8] };

export function* fenwickDemo({ arr }) {
  const n = arr.length;
  const tree = Array(n + 1).fill(0);
  const snap = () => [...tree];

  yield { type: 'mark', indices: [], array: snap(), meta: `Mảng ban đầu [${arr.join(', ')}] — cây Fenwick (1-indexed) bắt đầu toàn 0.` };

  for (let i = 1; i <= n; i++) {
    tree[i] += arr[i - 1];
    for (let p = i + (i & -i); p <= n; p += i & -i) tree[p] += arr[i - 1];
    yield {
      type: 'update',
      indices: [i],
      array: snap(),
      meta: `Khởi tạo: thêm a[${i - 1}] = ${arr[i - 1]} vào các nút phủ nó (i = ${i}).`,
    };
  }

  const prefix = (i) => {
    let s = 0;
    while (i > 0) {
      s += tree[i];
      i -= i & -i;
    }
    return s;
  };

  for (const q of [5, 8]) {
    let i = q;
    const chain = [];
    while (i > 0) {
      chain.push(i);
      i -= i & -i;
    }
    yield {
      type: 'compare',
      indices: chain,
      array: snap(),
      meta: `Tổng tiền tố [1..${q}]: đi theo các nút ${chain.join(' → ')} (mỗi bước bỏ bit thấp nhất) = ${prefix(q)}.`,
    };
  }

  tree[3] += 6; // point update: a[2] += 6
  for (let p = 3 + (3 & -3); p <= n; p += 3 & -3) tree[p] += 6;
  yield {
    type: 'update',
    indices: [3],
    array: snap(),
    meta: 'Cập nhật điểm a[2] += 6: chỉ các nút có chỉ số nhị phân chứa 0b011 được tăng — mỗi thao tác O(log n).',
  };
  yield {
    type: 'done',
    indices: [prefix(8) >= 0 ? 8 : 8],
    array: snap(),
    meta: `Tổng toàn bộ sau cập nhật = ${prefix(8)} — lấy tổng tiền tố bằng cách "bỏ bit thấp nhất" liên tục.`,
  };
  return tree;
}

/**
 * Sparse Table RMQ — truy vấn min trên đoạn O(1), dựng bảng O(n log n).
 * Bảng [k][i] = min của đoạn dài 2^k bắt đầu tại i.
 */
export const SAMPLE_SPARSE = [5, 2, 9, 1, 7, 3, 8, 6];

export function* sparseDemo(arr) {
  const n = arr.length;
  const K = Math.floor(Math.log2(n)) + 1;
  const table = Array.from({ length: K }, () => Array(n).fill(0));
  const snap = () => table.map((r) => [...r]);

  table[0] = [...arr];
  yield { type: 'mark', cells: [[0, 0]], matrix: snap(), meta: 'Hàng k = 0: min của đoạn dài 1 chính là phần tử itself.' };

  for (let k = 1; k < K; k++) {
    for (let i = 0; i + (1 << k) <= n; i++) {
      table[k][i] = Math.min(table[k - 1][i], table[k - 1][i + (1 << (k - 1))]);
    }
    yield {
      type: 'update',
      cells: [[k, 0]],
      matrix: snap(),
      meta: `Hàng k = ${k}: min của đoạn dài ${1 << k} — ghép hai đoạn con dài ${1 << (k - 1)} chồng lấn nhau.`,
    };
  }

  const [l, r] = [1, 6];
  const k = Math.floor(Math.log2(r - l + 1));
  const ans = Math.min(table[k][l], table[k][r - (1 << k) + 1]);
  yield {
    type: 'compare',
    cells: [[k, l], [k, r - (1 << k) + 1]],
    matrix: snap(),
    meta: `Truy vấn min [${l}..${r}] (độ dài ${r - l + 1}): ghép hai đoạn dài ${1 << k} — hai ô được tô.`,
  };
  yield {
    type: 'done',
    cells: [[k, l], [k, r - (1 << k) + 1]],
    matrix: snap(),
    meta: `Kết quả min(${table[k][l]}, ${table[k][r - (1 << k) + 1]}) = ${ans} — trả lời trong O(1) sau khi dựng O(n log n).`,
  };
  return ans;
}