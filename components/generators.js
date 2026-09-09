/**
 * Registry nối tên thuật toán (dùng trong file .mdx qua prop algorithm="...")
 * với generator function, dữ liệu mẫu và renderer tương ứng.
 *
 * Khi thêm thuật toán mới: viết generator ở lib/algorithms/<nhóm>/<tên>.js
 * rồi đăng ký một mục ở đây — không cần sửa gì khác. Field `kind` ép renderer
 * ('matrix' cho bảng 2D; bỏ trống = tự suy, mặc định mảng 1D). Field `stack`
 * bật cột đệ quy bên phải (dùng cho quay lui).
 *
 * Import dùng đường dẫn tương đối (không phải alias @/) để script
 * scripts/test-generators.mjs chạy được bằng node thuần.
 */
import { bubbleSort, SAMPLE_DATA as bubbleSortData } from '../lib/algorithms/sorting/bubbleSort.js';
import { selectionSort, insertionSort } from '../lib/algorithms/sorting/selectionInsertion.js';
import { quickSort, mergeSort } from '../lib/algorithms/sorting/nlogn.js';
import { twoPointers, slidingWindow, SAMPLE_DATA as twoPtrData, WINDOW_SAMPLE } from '../lib/algorithms/twoPointers.js';
import { ternarySearch, SAMPLE_DATA as ternaryData } from '../lib/algorithms/ternarySearch.js';
import { bitOps, SAMPLE_DATA as bitData } from '../lib/algorithms/bitOps.js';
import { arrayTour, matrixTour, SAMPLE_DATA as tourData, SAMPLE_MATRIX as tourMatrix } from '../lib/algorithms/arrayTour.js';
import { dsuDemo, fenwickDemo, sparseDemo, SAMPLE_FENWICK, SAMPLE_SPARSE } from '../lib/algorithms/dataStructures.js';
import { kadane, lis, hashDemo, SAMPLE_DATA as kadaneData, SAMPLE_LIS as lisData, SAMPLE_HASH as hashData } from '../lib/algorithms/dp.js';
import { knapsack01, lcs, digitDp, SAMPLE_KNAPSACK, SAMPLE_LCS, SAMPLE_DIGIT } from '../lib/algorithms/dpTables.js';
import { bitmaskDp, intervalDp, SAMPLE_BITMASK, SAMPLE_INTERVAL } from '../lib/algorithms/dpAdvanced.js';
import { segmentTreeDemo, heapDemo, SAMPLE_SEGTREE, SAMPLE_HEAP } from '../lib/algorithms/treeStructures.js';
import { bfsDemo, dfsDemo, dijkstraDemo } from '../lib/algorithms/graphAlgorithms.js';
import { kruskalDemo, topoDemo } from '../lib/algorithms/graphAlgorithms2.js';
import { sccDemo, bridgesDemo } from '../lib/algorithms/graphAdvanced.js';
import { treeDpDemo } from '../lib/algorithms/graphTree.js';
import { sieveDemo, euclidExtended, binPow, pascalDemo, SAMPLE_SIEVE, SAMPLE_EUCLID, SAMPLE_BINPOW, SAMPLE_PASCAL } from '../lib/algorithms/numberTheory.js';
import { kmpDemo, zalgoDemo, hashStrDemo, SAMPLE_KMP, SAMPLE_Z, SAMPLE_HASH_STR } from '../lib/algorithms/strings.js';
import {
  prefixSum1D,
  prefixSum2D,
  SAMPLE_DATA as prefixSumData,
  SAMPLE_MATRIX,
} from '../lib/algorithms/prefixSum.js';
import { binarySearch, SAMPLE_DATA as binarySearchData } from '../lib/algorithms/binarySearch.js';
import {
  permutationsBacktracking,
  recursionTree,
  SAMPLE_INPUT as permInput,
  SAMPLE_TREE as permTree,
} from '../lib/algorithms/backtracking.js';

export const GENERATORS = {
  // ══════════ Giai đoạn 1 — Nền tảng ══════════
  bubbleSort: { gen: bubbleSort, data: bubbleSortData, label: 'Sắp xếp nổi bọt' },
  selectionSort: { gen: selectionSort, data: bubbleSortData, label: 'Sắp xếp chọn' },
  insertionSort: { gen: insertionSort, data: bubbleSortData, label: 'Sắp xếp chèn' },
  quickSort: { gen: quickSort, data: bubbleSortData, label: 'Quick Sort' },
  mergeSort: { gen: mergeSort, data: bubbleSortData, label: 'Merge Sort' },
  prefixSum1D: { gen: prefixSum1D, data: prefixSumData, label: 'Mảng cộng dồn 1 chiều' },
  prefixSum2D: { gen: prefixSum2D, data: SAMPLE_MATRIX, label: 'Mảng cộng dồn 2 chiều', kind: 'matrix' },
  binarySearch: { gen: binarySearch, data: binarySearchData, label: 'Tìm kiếm nhị phân' },
  permutations: { gen: permutationsBacktracking, data: permInput, label: 'Quay lui sinh hoán vị', stack: true },
  recursionTree: { gen: recursionTree, data: permTree, label: 'Cây đệ quy quay lui (n = 3)', kind: 'tree' },
  twoPointers: { gen: twoPointers, data: twoPtrData, label: 'Hai con trỏ — tìm cặp tổng S' },
  slidingWindow: { gen: slidingWindow, data: WINDOW_SAMPLE, label: 'Cửa sổ trượt — tổng lớn nhất k' },
  ternarySearch: { gen: ternarySearch, data: ternaryData, label: 'Tìm kiếm tam phân' },
  bitOps: { gen: bitOps, data: bitData, label: 'Thao tác bit' },
  array1d: { gen: arrayTour, data: tourData, label: 'Duyệt mảng 1 chiều' },
  array2d: { gen: matrixTour, data: tourMatrix, label: 'Duyệt bảng 2 chiều', kind: 'matrix' },

  // ══════════ Giai đoạn 2 — CTDL & QHD & Đồ thị ══════════
  dsu: { gen: dsuDemo, data: undefined, label: 'Disjoint Set Union', kind: 'graph' },
  fenwick: { gen: fenwickDemo, data: SAMPLE_FENWICK, label: 'Cây Fenwick (BIT)' },
  sparseTable: { gen: sparseDemo, data: SAMPLE_SPARSE, label: 'Sparse Table RMQ', kind: 'matrix' },
  segmentTree: { gen: segmentTreeDemo, data: SAMPLE_SEGTREE, label: 'Cây phân đoạn (mảng 2n)' },
  heap: { gen: heapDemo, data: SAMPLE_HEAP, label: 'Heap nhị phân — cắm & lấy min' },
  hashTable: { gen: hashDemo, data: hashData, label: 'Bảng băm — dò tuyến tính' },
  kadane: { gen: kadane, data: kadaneData, label: 'Kadane — tổng đoạn con lớn nhất' },
  lis: { gen: lis, data: lisData, label: 'LIS O(n log n)' },
  knapsack01: { gen: knapsack01, data: SAMPLE_KNAPSACK, label: 'Balo 0/1', kind: 'matrix' },
  lcs: { gen: lcs, data: SAMPLE_LCS, label: 'Xâu con chung dài nhất', kind: 'matrix' },
  bitmaskDp: { gen: bitmaskDp, data: SAMPLE_BITMASK, label: 'QHD Bitmask — giao việc' },
  digitDp: { gen: digitDp, data: SAMPLE_DIGIT, label: 'QHD chữ số — dư mod 3', kind: 'matrix' },
  intervalDp: { gen: intervalDp, data: SAMPLE_INTERVAL, label: 'QHD đoạn — nhân ma trận', kind: 'matrix' },
  bfs: { gen: bfsDemo, data: undefined, label: 'BFS duyệt đồ thị', kind: 'graph' },
  dfs: { gen: dfsDemo, data: undefined, label: 'DFS duyệt đồ thị', kind: 'graph' },
  dijkstra: { gen: dijkstraDemo, data: undefined, label: 'Dijkstra đường đi ngắn nhất', kind: 'graph' },
  kruskal: { gen: kruskalDemo, data: undefined, label: 'Kruskal cây khung nhỏ nhất', kind: 'graph' },
  topoSort: { gen: topoDemo, data: undefined, label: 'Sắp xếp tô pô (Kahn)', kind: 'graph' },
  scc: { gen: sccDemo, data: undefined, label: 'SCC — Kosaraju', kind: 'graph' },
  bridges: { gen: bridgesDemo, data: undefined, label: 'Cạnh cầu — cây DFS', kind: 'graph' },
  treeDp: { gen: treeDpDemo, data: undefined, label: 'QHD trên cây', kind: 'tree' },

  // ══════════ Số học & Chuỗi (GĐ2 lõi + GĐ3 lõi) ══════════
  sieve: { gen: sieveDemo, data: SAMPLE_SIEVE, label: 'Sàng Eratosthenes' },
  euclid: { gen: euclidExtended, data: SAMPLE_EUCLID, label: 'Euclid mở rộng' },
  binPow: { gen: binPow, data: SAMPLE_BINPOW, label: 'Luỹ thừa nhị phân' },
  pascal: { gen: pascalDemo, data: SAMPLE_PASCAL, label: 'Tam giác Pascal', kind: 'matrix' },
  kmp: { gen: kmpDemo, data: SAMPLE_KMP, label: 'KMP — hàm tiền tố' },
  zalgo: { gen: zalgoDemo, data: SAMPLE_Z, label: 'Z-function' },
  hashStr: { gen: hashStrDemo, data: SAMPLE_HASH_STR, label: 'Băm xâu' },
};
