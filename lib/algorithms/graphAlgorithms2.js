import { SAMPLE_GRAPH } from './graphAlgorithms.js';

/** Kruskal — cây khung nhỏ nhất: sắp xếp cạnh rồi gộp bằng DSU. */
export function* kruskalDemo() {
  const graph = SAMPLE_GRAPH;
  const parent = new Map(graph.nodes.map((n) => [n, n]));
  const g = (mst) => ({ nodes: graph.nodes, edges: mst, directed: false });
  const find = (x) => (parent.get(x) === x ? x : parent.set(x, find(parent.get(x))).get(x));
  yield { type: 'mark', graph: g([]), meta: 'Bắt đầu rỗng — duyệt cạnh theo trọng số tăng dần, chỉ nhận cạnh nối hai thành phần khác nhau.' };
  const sorted = [...graph.edges].sort((a, b) => a.w - b.w);
  const mst = [];
  let total = 0;
  for (const e of sorted) {
    const ra = find(e.u);
    const rb = find(e.v);
    yield { type: 'compare', edges: [[e.u, e.v]], graph: g([...mst]), meta: `Xét cạnh (${e.u})–(${e.v}) w = ${e.w}: gốc của ${e.u} là ${ra}, của ${e.v} là ${rb}.` };
    if (ra !== rb) {
      parent.set(ra, rb);
      mst.push(e);
      total += e.w;
      yield { type: 'update', edges: [[e.u, e.v]], graph: g([...mst]), meta: `Khác gốc ⇒ nhận vào cây khung (tổng hiện tại ${total}).` };
    } else {
      yield { type: 'mark', edges: [[e.u, e.v]], graph: g([...mst]), meta: 'Cùng gốc ⇒ cạnh tạo chu trình — bỏ.' };
    }
    if (mst.length === graph.nodes.length - 1) break;
  }
  yield { type: 'done', edges: mst.map((e) => [e.u, e.v]), graph: g([...mst]), meta: `Cây khung nhỏ nhất: ${mst.length} cạnh, trọng số ${total} — chi phí chính là sắp xếp O(E log E).` };
  return total;
}

/** Kahn — sắp xếp tô pô: gỡ dần các đỉnh không còn cung vào. */
export function* topoDemo() {
  const DAG = {
    nodes: ['0', '1', '2', '3', '4', '5', '6'],
    edges: [
      { u: '6', v: '4' }, { u: '6', v: '2' }, { u: '5', v: '2' },
      { u: '5', v: '0' }, { u: '4', v: '0' }, { u: '4', v: '1' },
      { u: '2', v: '3' }, { u: '3', v: '1' },
    ],
    directed: true,
  };
  const indeg = new Map(DAG.nodes.map((n) => [n, 0]));
  for (const e of DAG.edges) indeg.set(e.v, indeg.get(e.v) + 1);
  const queue = DAG.nodes.filter((n) => indeg.get(n) === 0);
  const order = [];
  const vals = () => Object.fromEntries([...indeg].map(([k, v]) => [k, `vào ${v}${order.includes(k) ? ' ✓' : ''}`]));
  let kept = [...DAG.edges];
  const g = () => ({ nodes: DAG.nodes, edges: kept, directed: true });
  yield { type: 'mark', keys: queue, values: vals(), graph: g(), meta: 'Bắt đầu: đỉnh có bậc vào 0 có thể đứng đầu thứ tự tô pô.' };
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    yield { type: 'visit', keys: [u], values: vals(), graph: g(), meta: `Rút ${u} (vị trí ${order.length}) — xóa mọi cung đi ra khỏi nó.` };
    for (const e of DAG.edges) {
      if (e.u !== u || !kept.includes(e)) continue;
      indeg.set(e.v, indeg.get(e.v) - 1);
      yield { type: 'update', edges: [[e.u, e.v]], keys: [e.v], values: vals(), graph: g(), meta: `Cung ${u} → ${e.v} xóa: bậc vào của ${e.v} còn ${indeg.get(e.v)}.` };
      if (indeg.get(e.v) === 0) queue.push(e.v);
    }
    kept = kept.filter((e) => e.u !== u);
  }
  yield {
    type: 'done', keys: order,
    values: Object.fromEntries(order.map((k, i) => [k, `thứ tự ${i + 1}`])),
    graph: g(),
    meta: `Thứ tự tô pô: ${order.join(' → ')} — mọi cung đều đi từ trái sang phải. O(V + E).`,
  };
  return order;
}
