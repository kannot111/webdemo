/**
 * Balo 0/1 — bảng QHD dp[i][j] = giá trị lớn nhất khi chọn trong i món đầu
 * với giới hạn khối lượng j. Chuyển: dp[i][j] = max(dp[i-1][j], dp[i-1][j-w] + v).
 */
export const SAMPLE_KNAPSACK = {
  items: [
    { name: 'Sách', w: 1, v: 6 },
    { name: 'Bàn phím', w: 3, v: 10 },
    { name: 'Camera', w: 4, v: 12 },
    { name: 'Ổ cắm', w: 2, v: 7 },
  ],
  capacity: 5,
};

export function* knapsack01({ items, capacity }) {
  const n = items.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  const snap = () => dp.map((r) => [...r]);

  yield {
    type: 'mark',
    cells: [],
    matrix: snap(),
    meta: 'Hàng i = món thứ i, cột j = giới hạn khối lượng. Hàng 0 (chưa chọn món nào) toàn 0.',
  };

  for (let i = 1; i <= n; i++) {
    const { name, w, v } = items[i - 1];
    yield {
      type: 'compare',
      cells: [[i, 0], [i, capacity]],
      matrix: snap(),
      meta: `Xét món ${i - 1}: ${name} (w = ${w}, v = ${v}).`,
    };
    for (let j = 0; j <= capacity; j++) {
      dp[i][j] = dp[i - 1][j];
      if (j >= w && dp[i - 1][j - w] + v > dp[i][j]) dp[i][j] = dp[i - 1][j - w] + v;
      yield {
        type: 'update',
        cells: [[i, j]],
        matrix: snap(),
        meta: `dp[${i}][${j}] = max(không lấy = ${dp[i - 1][j]}, lấy = ${j >= w ? dp[i - 1][j - w] + v : 'không đủ chỗ'}) = ${dp[i][j]}.`,
      };
    }
  }

  let j = capacity;
  const chosen = [];
  for (let i = n; i >= 1; i--) {
    if (dp[i][j] !== dp[i - 1][j]) {
      chosen.push(items[i - 1].name);
      j -= items[i - 1].w;
    }
  }
  yield {
    type: 'done',
    cells: [[n, capacity]],
    matrix: snap(),
    meta: `Đáp án dp[${n}][${capacity}] = ${dp[n][capacity]} — chọn: ${chosen.reverse().join(', ')}.`,
  };
  return dp[n][capacity];
}

/**
 * Xâu con chung dài nhất (LCS) — dp[i][j] = độ dài LCS của i ký tự đầu
 * của a và j ký tự đầu của b.
 */
export const SAMPLE_LCS = { a: 'ABCBDAB', b: 'BDCABA' };

export function* lcs({ a, b }) {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  const snap = () => dp.map((r) => [...r]);

  yield {
    type: 'mark',
    cells: [],
    matrix: snap(),
    meta: `Hàng = ký tự của "${a}", cột = ký tự của "${b}". dp[0][*] = dp[*][0] = 0 (xâu rỗng).`,
  };

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        yield {
          type: 'update',
          cells: [[i, j]],
          matrix: snap(),
          meta: `'${a[i - 1]}' = '${b[j - 1]}' ⇒ khớp: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}.`,
        };
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        yield {
          type: 'update',
          cells: [[i, j]],
          matrix: snap(),
          meta: `'${a[i - 1]}' ≠ '${b[j - 1]}' ⇒ bỏ 1 ký tự: dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${dp[i][j]}.`,
        };
      }
    }
  }

  let i = n;
  let j = m;
  const seq = [];
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      seq.push(a[i - 1]);
      i -= 1;
      j -= 1;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) i -= 1;
    else j -= 1;
  }
  yield {
    type: 'done',
    cells: [[n, m]],
    matrix: snap(),
    meta: `Độ dài LCS = ${dp[n][m]} — một LCS: "${seq.reverse().join('')}".`,
  };
  return dp[n][m];
}

/**
 * QHD chữ số — đếm số 1..N có tổng chữ số chia hết cho 3.
 * Hàng = vị trí chữ số đang điền, cột = số dư tổng mod 3;
 * nhánh "tight" (vẫn bám tiền tố của N) tách dần thành các nhánh tự do.
 */
export const SAMPLE_DIGIT = '428';

export function* digitDp(N) {
  const digits = String(N).split('').map(Number);
  const rows = digits.length;
  const dp = Array.from({ length: rows + 1 }, () => [0, 0, 0]);
  const snap = () => dp.map((r) => [...r]);

  yield {
    type: 'mark', cells: [], matrix: snap(),
    meta: `Đếm số ≤ ${N} có tổng chữ số chia hết cho 3. Hàng = vị trí chữ số, cột = dư mod 3; dp[0][0] = 1 cho tiền tố rỗng.`,
  };

  let prefix = 0;
  for (let k = 0; k < rows; k++) {
    const d = digits[k];
    const startDig = k === 0 ? 1 : 0; // chữ số đầu không được 0
    for (let dig = startDig; dig < d; dig++) {
      dp[k + 1][(prefix + dig) % 3] += 1;
    }
    prefix = (prefix + d) % 3;
    yield {
      type: 'update', cells: [[k + 1, 0], [k + 1, 1], [k + 1, 2]], matrix: snap(),
      meta: `Chữ số ${k} của N là ${d}: các chữ số ${startDig}..${d - 1} nhỏ hơn trở thành nhánh tự do (mỗi số dư một nhánh); tiền tố tight hiện có dư ${prefix}.`,
    };
  }

  const count = dp[rows][0] + (prefix === 0 ? 1 : 0);
  yield {
    type: 'done', cells: [[rows, 0]], matrix: snap(),
    meta: `dp[${rows}][0] = ${dp[rows][0]}${prefix === 0 ? ' + 1 (chính là N)' : ''} = ${count} — trạng thái chỉ là số dư nên R lớn bao nhiêu cũng chỉ tốn O(số chữ số · mod).`,
  };
  return count;
}

