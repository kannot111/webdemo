/** QHD trên cây — tổ hợp độc lập có trọng số lớn nhất (dp[u][0/1]). */
export function* treeDpDemo() {
  const tree = {
    nodes: ['0', '1', '2', '3', '4', '5', '6'],
    edges: [
      { u: '0', v: '1' }, { u: '0', v: '2' }, { u: '1', v: '3' },
      { u: '1', v: '4' }, { u: '2', v: '5' }, { u: '5', v: '6' },
    ],
    directed: false,
  };
  const weight = { 0: 4, 1: 7, 2: 2, 3: 9, 4: 1, 5: 8, 6: 3 };
  const dp = new Map(tree.nodes.map((n) => [n, { 0: 0, 1: 0 }]));
  const g = () => ({ nodes: tree.nodes, edges: tree.edges, directed: false });
  const vals = () => Object.fromEntries([...dp].map(([k, d]) => [k, `${d[0]}/${d[1]}`]));
  const adj = new Map(tree.nodes.map((n) => [n, []]));
  for (const e of tree.edges) {
    adj.get(e.u).push(e.v);
    adj.get(e.v).push(e.u);
  }
  yield {
    type: 'mark', values: vals(), graph: g(),
    meta: 'dp[u][0] = giá trị lớn nhất nếu KHÔNG chọn u; dp[u][1] = nếu CHỌN u. Nhãn: dp0/dp1.',
  };
  function* dfs(u, parent) {
    dp.get(u)[1] = weight[u];
    for (const v of adj.get(u)) {
      if (v === parent) continue;
      yield* dfs(v, u);
      dp.get(u)[0] += Math.max(dp.get(v)[0], dp.get(v)[1]);
      dp.get(u)[1] += dp.get(v)[0];
    }
    yield {
      type: 'update', keys: [u], values: vals(), graph: g(),
      meta: `Xong gốc ${u}: dp[${u}][0] = ${dp.get(u)[0]}, dp[${u}][1] = ${dp.get(u)[1]}.`,
    };
  }
  yield* dfs('0', null);
  const best = Math.max(dp.get('0')[0], dp.get('0')[1]);
  yield {
    type: 'done', keys: ['0'], values: vals(), graph: g(),
    meta: `Kết quả tại gốc 0: max(${dp.get('0')[0]}, ${dp.get('0')[1]}) = ${best} — mỗi đỉnh tính đúng một lần O(n).`,
  };
  return best;
}