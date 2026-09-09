/** Kosaraju — thành phần liên thông mạnh: DFS 2 lần (thứ tự kết thúc + đảo đồ thị). */
export function* sccDemo() {
  const graph = {
    nodes: ['0', '1', '2', '3', '4', '5'],
    edges: [
      { u: '0', v: '1' }, { u: '1', v: '2' }, { u: '2', v: '0' },
      { u: '2', v: '3' }, { u: '3', v: '4' }, { u: '4', v: '3' }, { u: '4', v: '5' },
    ],
    directed: true,
  };
  const adj = (edges) => {
    const m = new Map(graph.nodes.map((n) => [n, []]));
    for (const e of edges) m.get(e.u).push(e.v);
    return m;
  };
  const g = (rev) => ({ nodes: graph.nodes, edges: rev ? graph.edges.map((e) => ({ u: e.v, v: e.u })) : graph.edges, directed: true });
  const finish = [];
  const visited = new Set();
  const comp = new Map();
  const dfs1 = (u) => {
    visited.add(u);
    for (const v of adj(graph.edges).get(u)) if (!visited.has(v)) dfs1(v);
    finish.push(u);
  };
  dfs1('0');
  yield { type: 'mark', keys: finish, graph: g(false), meta: `Lượt 1 trên đồ thị gốc: thứ tự kết thúc DFS = ${finish.join(', ')}.` };
  const radj = adj(graph.edges.map((e) => ({ u: e.v, v: e.u })));
  let c = 0;
  for (const u of [...finish].reverse()) {
    if (comp.has(u)) continue;
    c += 1;
    const stack = [u];
    const members = [];
    while (stack.length) {
      const x = stack.pop();
      if (comp.has(x)) continue;
      comp.set(x, c);
      members.push(x);
      for (const v of radj.get(x)) if (!comp.has(v)) stack.push(v);
    }
    yield { type: 'pivot', keys: members, graph: g(true), meta: `Lượt 2 trên đồ thị đảo: SCC C${c} = { ${members.join(', ')} }.` };
  }
  yield {
    type: 'done', keys: [...comp.keys()], graph: g(true),
    meta: `Tìm được ${c} SCC — mỗi SCC là cụm mà từ mọi đỉnh đều tới được mọi đỉnh khác.`,
  };
  return c;
}

/** Cạnh cầu trên cây DFS: cạnh (u, v) là cầu ⟺ low[v] > disc[u]. */
export function* bridgesDemo() {
  const graph = {
    nodes: ['0', '1', '2', '3', '4', '5'],
    edges: [
      { u: '0', v: '1' }, { u: '1', v: '2' }, { u: '1', v: '3' },
      { u: '3', v: '4' }, { u: '4', v: '0' }, { u: '4', v: '5' },
    ],
    directed: false,
  };
  const adj = new Map(graph.nodes.map((n) => [n, []]));
  for (const e of graph.edges) {
    adj.get(e.u).push({ to: e.v, e });
    adj.get(e.v).push({ to: e.u, e });
  }
  const disc = new Map();
  const low = new Map();
  let timer = 0;
  const bridges = [];
  const g = () => ({ nodes: graph.nodes, edges: graph.edges, directed: false });
  const vals = () => Object.fromEntries([...disc].map(([k]) => [k, `disc ${disc.get(k)} / low ${low.get(k)}`]));
  yield { type: 'mark', graph: g(), meta: 'DFS ghi disc (thứ tự vào) và low (disc nhỏ nhất chạm được). Cạnh cầu: low[con] > disc[cha].' };
  function dfs(u, pe) {
    disc.set(u, timer);
    low.set(u, timer);
    timer += 1;
    for (const { to, e } of adj.get(u)) {
      if (e === pe) continue;
      if (disc.has(to)) low.set(u, Math.min(low.get(u), disc.get(to)));
      else {
        dfs(to, e);
        low.set(u, Math.min(low.get(u), low.get(to)));
        if (low.get(to) > disc.get(u)) bridges.push(e);
      }
    }
  }
  dfs('0', null);
  for (const e of bridges) {
    yield {
      type: 'pivot', keys: [e.u, e.v], edges: [[e.u, e.v]], values: vals(), graph: g(),
      meta: `Cạnh (${e.u})–(${e.v}) là CẦU: low[${e.v}] = ${low.get(e.v)} > disc[${e.u}] = ${disc.get(e.u)} — xóa cạnh này thì đồ thị tách đôi.`,
    };
  }
  yield {
    type: 'done', edges: bridges.map((e) => [e.u, e.v]), values: vals(), graph: g(),
    meta: `Cạnh cầu: ${bridges.map((e) => `(${e.u})–(${e.v})`).join(', ') || 'không có'} — tìm trong một lần DFS O(V + E).`,
  };
}
