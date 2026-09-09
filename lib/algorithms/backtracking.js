/**
 * Quay lui sinh hoán vị (Backtracking) — generator function theo engine visualize.
 *
 * Trực quan hóa bằng "cột đệ quy": mỗi bước yield có trường
 *
 *   stack: [{ k: vị trí (tầng đệ quy), v: giá trị đang chọn }]
 *   extra: { used: [bool] } — giá trị 1..n đã được dùng ở nhánh hiện tại
 *
 * render bởi StackVisualizer. Mỗi lần push = gọi đệ quy sâu hơn,
 * mỗi lần pop = quay lui để thử giá trị khác.
 *
 * Với n = 4 có 4! = 24 hoán vị — đủ nhỏ để xem trọn vẹn cấu trúc cây đệ quy.
 *
 * @yields {{type: string, stack?: {k: number, v: number}[], extra?: {used: boolean[]}, meta?: string}}
 * @returns {string[]} danh sách hoán vị dạng chuỗi, theo thứ tự sinh.
 */
export const SAMPLE_INPUT = { n: 4 };

export function* permutationsBacktracking({ n = 4 } = {}) {
  const used = new Array(n).fill(false);
  const cur = [];
  const solutions = [];
  const stackSnap = () => cur.map((v, k) => ({ k, v }));
  const extraSnap = () => ({ used: [...used] });

  yield {
    type: 'visit',
    stack: stackSnap(),
    extra: extraSnap(),
    meta: `Bắt đầu sinh hoán vị của {1..${n}}. Cột bên trái là các tầng đệ quy, đang rỗng.`,
  };

  function* gen(pos) {
    if (pos === n) {
      solutions.push(cur.join(''));
      yield {
        type: 'mark',
        stack: stackSnap(),
        extra: extraSnap(),
        meta: `Đủ ${n} vị trí → ghi nhận hoán vị ${cur.join(' ')} (mới thứ ${solutions.length}).`,
      };
      return;
    }
    for (let v = 1; v <= n; v++) {
      if (used[v - 1]) continue;
      used[v - 1] = true;
      cur.push(v);
      yield {
        type: 'push',
        stack: stackSnap(),
        extra: extraSnap(),
        meta: `Chọn ${v} cho vị trí ${pos} (chưa dùng) → gọi đệ quy sâu hơn.`,
      };
      yield* gen(pos + 1);
      cur.pop();
      used[v - 1] = false;
      yield {
        type: 'pop',
        stack: stackSnap(),
        extra: extraSnap(),
        meta: `Quay lui: gỡ ${v} khỏi vị trí ${pos} để thử giá trị khác.`,
      };
    }
  }

  yield* gen(0);

  yield {
    type: 'done',
    stack: stackSnap(),
    extra: extraSnap(),
    meta: `Đã duyệt hết cây đệ quy: ${solutions.length} = ${n}! hoán vị.`,
  };
  return solutions;
}

/**
 * Cây đệ quy của quay lui sinh hoán vị n = 3 — mỗi nút là một lời gọi
 * quayLui(k), con của nút là các lựa chọn giá trị ở tầng kế, lá = hoán vị.
 * Generator chạy theo đúng thứ tự DFS mà chương trình quay lui chạy:
 * đi sâu nhánh trái, chốt lá, quay lui, sang nhánh kế.
 */
const TREE_N = 3;
const treeNodes = [];
const treeEdges = [];
const treeValues = {}; // id nút → nhãn phụ "chọn x"

function buildTree(parent, path) {
  const id = path.join('-') || 'root';
  treeNodes.push(id);
  if (parent != null) treeEdges.push({ u: parent, v: id });
  if (path.length > 0) treeValues[id] = `chọn ${path[path.length - 1]}`;
  if (path.length === TREE_N) return;
  for (let v = 1; v <= TREE_N; v++) {
    if (path.includes(v)) continue; // cắt tỉa: giá trị đã dùng ở nhánh này
    buildTree(id, [...path, v]);
  }
}
buildTree(null, []);

export const SAMPLE_TREE = { n: TREE_N };

export function* recursionTree() {
  const done = [];
  const nodesOf = (id) => (id === 'root' ? ['root'] : ['root', ...id.split('-')]);
  const edgesOf = (id) => {
    const p = nodesOf(id);
    return p.slice(1).map((v, i) => [p[i], v]);
  };
  const g = () => ({ nodes: treeNodes, edges: treeEdges });

  yield {
    type: 'mark', keys: ['root'], graph: g(), values: {},
    meta: 'Cây quay lui: gốc = lời gọi rỗng, mỗi tầng chọn 1 giá trị chưa dùng, lá = 1 hoán vị hoàn chỉnh (n = 3).',
  };

  function* dfs(id) {
    const p = nodesOf(id);
    yield {
      type: 'visit', keys: p, edges: edgesOf(id), graph: g(), values: treeValues,
      meta: `Gọi quayLui(tầng ${p.length - 1}): nhánh hiện tại chọn ${id === 'root' ? '(rỗng)' : id.split('-').join(', ')}.`,
    };
    if (p.length - 1 === TREE_N) {
      done.push(id);
      yield {
        type: 'done', keys: p, done: [...done], graph: g(), values: treeValues,
        meta: `Lá "${id}" đủ ${TREE_N} giá trị ⇒ xuất hoán vị ${id.split('-').join(' ')}.`,
      };
      return;
    }
    for (let v = 1; v <= TREE_N; v++) {
      if (p.includes(String(v))) continue;
      yield* dfs(`${id === 'root' ? '' : `${id}-`}${v}`);
      // sau vòng for: quay lui — gỡ lựa chọn, thử giá trị kế ở tầng này
    }
  }
  yield* dfs('root');

  yield {
    type: 'done', done: [...done], graph: g(), values: treeValues,
    meta: `Đủ ${done.length} lá = 3! = 6 hoán vị — mọi nút của cây là một lời gọi đệ quy thực sự chạy.`,
  };
}
