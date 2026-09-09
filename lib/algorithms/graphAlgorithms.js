/** Đồ thị mẫu dùng chung (6 đỉnh, có trọng số). */
export const SAMPLE_GRAPH = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { u: '0', v: '1', w: 4 },
    { u: '0', v: '2', w: 3 },
    { u: '1', v: '2', w: 2 },
    { u: '1', v: '3', w: 7 },
    { u: '2', v: '3', w: 5 },
    { u: '2', v: '4', w: 8 },
    { u: '3', v: '4', w: 6 },
    { u: '3', v: '5', w: 4 },
    { u: '4', v: '5', w: 3 },
  ],
};

const adjacency = (graph) => {
  const adj = new Map(graph.nodes.map((n) => [n, []]));
  for (const e of graph.edges) {
    adj.get(e.u).push(e.v);
    adj.get(e.v).push(e.u);
  }
  return adj;
};
const base = (graph) => ({ nodes: graph.nodes, edges: graph.edges, directed: false });

/** BFS — duyệt theo lớp, khoảng cách ít cạnh nhất từ nguồn. */
export function* bfsDemo() {
  const graph = SAMPLE_GRAPH;
  const adj = adjacency(graph);
  const dist = new Map(graph.nodes.map((n) => [n, Infinity]));
  const g = () => base(graph);
  const vals = () => Object.fromEntries([...dist].map(([k, d]) => [k, d === Infinity ? '∞' : `d=${d}`]));
  dist.set('0', 0);
  const queue = ['0'];
  yield { type: 'mark', keys: ['0'], values: vals(), graph: g(), meta: 'BFS từ đỉnh 0 — hàng đợi chỉ chứa nguồn, d(0) = 0.' };
  while (queue.length) {
    const u = queue.shift();
    yield { type: 'compare', keys: [u], values: vals(), graph: g(), meta: `Lấy đỉnh ${u} ra khỏi hàng đợi — xét toàn bộ đỉnh kề.` };
    for (const v of adj.get(u)) {
      if (dist.get(v) === Infinity) {
        dist.set(v, dist.get(u) + 1);
        queue.push(v);
        yield { type: 'push', keys: [v], edges: [[u, v]], values: vals(), graph: g(), meta: `${v} chưa thăm ⇒ d(${v}) = d(${u}) + 1 = ${dist.get(v)} — đẩy vào hàng đợi.` };
      }
    }
  }
  yield { type: 'done', values: vals(), graph: g(), meta: 'Mọi đỉnh có khoảng cách ít cạnh nhất — mỗi đỉnh vào hàng đợi đúng một lần ⇒ O(V + E).' };
}

/** DFS — đi sâu hết một nhánh rồi mới quay lại (ngăn xếp/khử đệ quy). */
export function* dfsDemo() {
  const graph = SAMPLE_GRAPH;
  const adj = adjacency(graph);
  const visited = new Set();
  const order = [];
  const g = () => base(graph);
  const vals = () => Object.fromEntries([...visited].map((k) => [k, `thứ tự ${order.indexOf(k) + 1}`]));
  yield { type: 'mark', graph: g(), meta: 'DFS từ đỉnh 0: chừng còn đường chưa khám phá thì đi tiếp xuống sâu.' };
  const stack = ['0'];
  while (stack.length) {
    const u = stack.pop();
    if (visited.has(u)) continue;
    visited.add(u);
    order.push(u);
    yield { type: 'visit', keys: [u], values: vals(), graph: g(), meta: `Thăm ${u} (thứ tự ${order.length}) — đẩy các kề chưa thăm vào ngăn xếp.` };
    for (const v of [...adj.get(u)].reverse()) if (!visited.has(v)) stack.push(v);
  }
  yield { type: 'done', values: vals(), graph: g(), meta: `Thứ tự DFS: ${order.join(' → ')} — mỗi đỉnh/cạnh xử lý đúng một lần ⇒ O(V + E).` };
}

/** Dijkstra — đường đi ngắn nhất từ nguồn (trọng số dương). */
export function* dijkstraDemo() {
  const graph = SAMPLE_GRAPH;
  const dist = new Map(graph.nodes.map((n) => [n, Infinity]));
  const settled = new Set();
  const g = () => base(graph);
  const vals = () => Object.fromEntries([...dist].map(([k, d]) => [k, d === Infinity ? '∞' : `${d}${settled.has(k) ? ' ✓' : ''}`]));
  dist.set('0', 0);
  yield { type: 'mark', keys: ['0'], values: vals(), graph: g(), meta: 'Dijkstra từ 0: d(0) = 0, mọi đỉnh khác ∞.' };
  while (settled.size < graph.nodes.length) {
    let u = null;
    for (const n of graph.nodes) if (!settled.has(n) && (u === null || dist.get(n) < dist.get(u))) u = n;
    if (dist.get(u) === Infinity) break;
    settled.add(u);
    yield { type: 'pivot', keys: [u], values: vals(), graph: g(), meta: `Chốt ${u} với d = ${dist.get(u)} — đỉnh chưa chốt có d nhỏ nhất luôn đúng (trọng số ≥ 0).` };
    for (const e of graph.edges) {
      const v = e.u === u ? e.v : e.v === u ? e.u : null;
      if (v === null || settled.has(v)) continue;
      const nd = dist.get(u) + e.w;
      if (nd < dist.get(v)) {
        dist.set(v, nd);
        yield { type: 'update', keys: [u, v], edges: [[u, v]], values: vals(), graph: g(), meta: `Thả lỏng cạnh (${u})–(${v}) w = ${e.w}: d(${v}) = ${nd}.` };
      }
    }
  }
  yield { type: 'done', values: vals(), graph: g(), meta: 'Mọi đỉnh chốt xong với khoảng cách ngắn nhất — O(V²) hoặc O(E log V) dùng heap.' };
}
