/**
 * QHD Bitmask — giao việc cho n người (n = 4), dp[mask] = chi phí nhỏ nhất
 * để giao việc cho các người trong mask. 2^n trạng thái, mỗi trạng thái O(n).
 */
export const SAMPLE_BITMASK = {
  cost: [
    [9, 2, 7, 8],
    [6, 4, 3, 7],
    [5, 8, 1, 8],
    [7, 6, 9, 4],
  ],
};

export function* bitmaskDp({ cost }) {
  const n = cost.length;
  const total = 1 << n;
  const dp = Array(total).fill(Infinity);
  dp[0] = 0;
  const snap = () => [...dp];
  const bitsOf = (mask) => Array.from({ length: n }, (_, b) => (mask >> b) & 1);

  yield {
    type: 'mark',
    indices: [0],
    array: snap(),
    meta: `2^${n} = ${total} trạng thái. dp[mask] = chi phí nhỏ nhất khi đã giao việc cho người trong mask. dp[0] = 0.`,
  };

  for (let mask = 0; mask < total; mask++) {
    if (dp[mask] === Infinity) continue;
    const i = bitsOf(mask).reduce((s, b) => s + b, 0); // người tiếp theo chưa giao
    if (i >= n) continue;
    for (let job = 0; job < n; job++) {
      if (mask & (1 << job)) continue;
      const nm = mask | (1 << job);
      if (dp[mask] + cost[i][job] < dp[nm]) {
        dp[nm] = dp[mask] + cost[i][job];
        yield {
          type: 'update',
          indices: [nm],
          array: snap(),
          meta: `mask = ${mask} (người ${i} chưa có việc): giao việc ${job} (chi phí ${cost[i][job]}) ⇒ dp[${nm}] = ${dp[nm]}.`,
        };
      }
    }
    yield {
      type: 'compare',
      indices: [mask],
      array: snap(),
      meta: `Xong trạng thái ${mask} — mở rộng sang mask cao hơn bằng cách bật từng bit việc.`,
    };
  }

  yield {
    type: 'done',
    indices: [total - 1],
    array: snap(),
    meta: `dp[${total - 1}] = ${dp[total - 1]} — giao đủ ${n} việc với chi phí nhỏ nhất, thời gian O(2^n · n).`,
  };
  return dp[total - 1];
}

/**
 * QHD trên đoạn — ma trận nhân dây chuyền (Matrix Chain):
 * dp[i][j] = số phép nhân ít nhất để tính tích ma trận i..j.
 */
export const SAMPLE_INTERVAL = { dims: [10, 30, 5, 60, 20] };

export function* intervalDp({ dims }) {
  const n = dims.length - 1;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  const snap = () => dp.map((r) => [...r]);
  const cellsMark = (len) => {
    const c = [];
    for (let i = 0; i + len - 1 < n; i++) c.push([i, i + len - 1]);
    return c;
  };

  yield {
    type: 'mark',
    cells: cellsMark(1),
    matrix: snap(),
    meta: `${n} ma trận, kích thước [${dims.join('×')}]. Đoạn dài 1: 0 phép nhân.`,
  };

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        if (cost < dp[i][j]) dp[i][j] = cost;
        yield {
          type: 'update',
          cells: [[i, j]],
          matrix: snap(),
          meta: `dp[${i}][${j}]: tách tại ${k} ⇒ dp[${i}][${k}] + dp[${k + 1}][${j}] + ${dims[i]}·${dims[k + 1]}·${dims[j + 1]} = ${cost} (min hiện tại ${dp[i][j]}).`,
        };
      }
    }
  }

  yield {
    type: 'done',
    cells: [[0, n - 1]],
    matrix: snap(),
    meta: `Đáp án dp[0][${n - 1}] = ${dp[0][n - 1]} — xét đoạn theo độ dài tăng dần nên mọi dp con cần đã có sẵn.`,
  };
  return dp[0][n - 1];
}
