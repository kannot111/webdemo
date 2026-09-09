/**
 * Chương trình ôn thi đầy đủ, chia 3 giai đoạn theo cấp độ thi đấu.
 *
 * - topic.slug  : đã có bài viết ở content/algorithms/<slug>.mdx → render thành link
 * - topic.en    : tên tiếng Anh (tìm kiếm và đối chiếu thuật ngữ)
 * - topic.detail: ghi chú ngắn về phạm vi chủ đề
 * - topic.vnoi  : đường dẫn bài tương ứng trên VNOI wiki (vnoi.info/wiki<path>)
 *                 để link "Đọc thêm trên VNOI Wiki" — nguồn tham khảo, luôn
 *                 viết lại bằng lời của site, không sao chép nguyên văn.
 *
 * Khi thêm bài viết mới: viết generator + file .mdx như mẫu bubble-sort rồi
 * gắn slug vào chủ đề tương ứng ở đây (kèm vnoi nếu wiki có bài tương ứng).
 */

export const STAGES = [
  {
    id: 'giai-doan-1',
    name: 'Giai đoạn 1',
    tag: 'Nhập môn & Nền tảng',
    level: 'Beginner',
    goal: 'thi cấp trường, nền tảng cho mọi cấp',
    groups: [
      {
        id: 'ngon-ngu',
        name: 'Kỹ năng ngôn ngữ & Nền tảng',
        topics: [
          { name: 'Cú pháp C++ nâng cao', en: 'Advanced C++ syntax', slug: 'cpp-nang-cao' },
          {
            name: 'Mảng 1D và 2D',
            en: 'Arrays',
            slug: 'mang-1d-2d',
            detail: 'Đã có bài: duyệt mảng/bảng trực quan, chỉ số tuyến tính i·m + j',
          },
          { name: 'Con trỏ', en: 'Pointers', slug: 'con-tro', vnoi: '/languages/cpp/pointers.md' },
          { name: 'Struct — dữ liệu tự định nghĩa', en: 'Structs', slug: 'struct' },
          {
            name: 'Phân tích độ phức tạp',
            en: 'Time & space complexity',
            slug: 'do-phuc-tap',
            detail: 'Big-O: O(N), O(N log N), O(2^N)… và nhận biết giới hạn tài nguyên từ ràng buộc đề bài',
            vnoi: '/algo/basic/computational-complexity.md',
          },
          {
            name: 'Thao tác bit cơ bản',
            en: 'Bitwise operations',
            slug: 'thao-tac-bit',
            detail: 'Các phép & | ^ ~ và dịch bit << >>',
            vnoi: '/algo/basic/bitwise-operators.md',
          },
        ],
      },
      {
        id: 'ky-thuat-co-ban',
        name: 'Kỹ thuật cơ bản',
        topics: [
          {
            name: 'Mảng cộng dồn & Mảng hiệu',
            en: 'Prefix Sum & Difference Array',
            slug: 'prefix-sum',
            detail: 'Đã có bài mẫu: dựng mảng cộng dồn 1D & 2D và trả lời truy vấn đoạn ngay trong web',
            vnoi: '/algo/data-structures/prefix-sum-and-difference-array.md',
          },
          {
            name: 'Hai con trỏ & Cửa sổ trượt',
            en: 'Two Pointers & Sliding Window',
            slug: 'hai-con-tro',
            detail: 'Đã có bài: hai con trỏ tìm cặp tổng S và cửa sổ trượt tổng lớn nhất',
            vnoi: '/algo/basic/two-pointers.md',
          },
          {
            name: 'Tìm kiếm nhị phân',
            en: 'Binary Search',
            slug: 'binary-search',
            detail: 'Đã có bài mẫu: thấy trực quan không gian tìm kiếm bị chia đôi sau mỗi bước',
            vnoi: '/algo/basic/Binary-Search',
          },
          { name: 'Tìm kiếm tam phân', en: 'Ternary Search', slug: 'tim-kiem-tam-phan', detail: 'Đã có bài: loại 1/3 không gian tìm kiếm mỗi bước trên hàm đơn điệu', vnoi: '/translate/emaxx/Tim-kiem-tam-phan-Ternary-Search.md' },
          {
            name: 'Đệ quy & Quay lui cơ bản',
            en: 'Recursion & Backtracking',
            slug: 'de-quy-quay-lui',
            detail: 'Đã có bài mẫu: cột đệ quy chạy sống động khi sinh hoán vị bằng quay lui',
            vnoi: '/algo/basic/backtracking.md',
          },
          {
            name: 'Sắp xếp cơ bản',
            en: 'Bubble Sort, Selection Sort, Insertion Sort',
            slug: 'bubble-sort',
            detail: 'Đã có bài mẫu: Sắp xếp nổi bọt, kèm minh họa từng bước',
            vnoi: '/algo/basic/sorting.md',
          },
          {
            name: 'Sắp xếp O(N log N)',
            en: 'Quick Sort, Merge Sort',
            slug: 'quick-sort-merge-sort',
            detail: 'Đã có bài: phân hoạch Lomuto và trộn hai nửa đã sắp, chạy trực quan',
            vnoi: '/algo/basic/sorting-new.md',
          },
        ],
      },
    ],
  },
  {
    id: 'giai-doan-2',
    name: 'Giai đoạn 2',
    tag: 'Trung cấp',
    level: 'Intermediate',
    goal: 'thi HSG cấp tỉnh, Chuyên Tin, Duyên Hải',
    groups: [
      {
        id: 'ctdl',
        name: 'Cấu trúc dữ liệu',
        topics: [
          {
            name: 'Stack, Queue, Deque',
            en: 'Linear data structures',
            slug: 'stack-queue-deque',
            detail: 'Đã có bài: minh họa cắm/lấy từng bước trên stack và hàng đợi',
            vnoi: '/algo/data-structures/Stack.md',
          },
          {
            name: 'Hàng đợi ưu tiên',
            en: 'Priority Queue / Heap',
            slug: 'hang-doi-uu-tien',
            detail: 'Đã có bài: heap nhị phân nổi bọt khi cắm, sift-down khi lấy min',
            vnoi: '/translate/wcipeg/Binary-Heap.md',
          },
          {
            name: 'Tập hợp rời rạc',
            en: 'Disjoint Set Union',
            slug: 'dsu',
            detail: 'Đã có bài: gộp theo kích thước, nén đường đi, đếm số tập trực quan',
            vnoi: '/algo/data-structures/disjoint-set-union.md',
          },
          {
            name: 'Cây Fenwick',
            en: 'Fenwick Tree / BIT',
            slug: 'cay-fenwick',
            detail: 'Đã có bài: nhảy theo bit thấp nhất khi lấy tổng tiền tố và cập nhật điểm',
            vnoi: '/algo/data-structures/fenwick.md',
          },
          {
            name: 'Cây phân đoạn',
            en: 'Segment Tree',
            slug: 'cay-phan-doan',
            detail: 'Đã có bài: dựng trên mảng 2n, truy vấn đoạn không đệ quy',
            vnoi: '/algo/data-structures/segment-tree-basic.md',
          },
        ],
      },
      {
        id: 'qhd',
        name: 'Quy hoạch động',
        topics: [
          {
            name: 'DP cơ bản',
            en: 'Knapsack, LIS, LCS, Edit Distance',
            slug: 'qhd-co-ban',
            detail: 'Đã có bài: bảng balo 0/1 và LIS chạy trực quan',
            vnoi: '/algo/dp/basic-dynamic-programming-1.md',
          },
          {
            name: 'DP Bitmask',
            en: 'Bitmask DP',
            slug: 'qhd-bitmask',
            detail: 'Đã có bài: giao việc n người, 2^n trạng thái hiển thị từng bit',
            vnoi: '/algo/dp/dp-bitmask.md',
          },
          {
            name: 'DP trên cây',
            en: 'Tree DP',
            slug: 'qhd-tren-cay',
            detail: 'Đã có bài: tổ hợp độc lập trên cây, dp[u][0/1] cập nhật khi con trở về',
            vnoi: '/algo/dp/treedp.md',
          },
          { name: 'DP chữ số', en: 'Digit DP', slug: 'qhd-chu-so' },
          {
            name: 'DP trên đoạn',
            en: 'Interval DP',
            slug: 'qhd-tren-doan',
            detail: 'Đã có bài: nhân ma trận dây chuyền, đoạn dài tăng dần',
          },
        ],
      },
      {
        id: 'do-thi',
        name: 'Lý thuyết đồ thị',
        topics: [
          {
            name: 'Biểu diễn đồ thị',
            en: 'Adjacency matrix & list',
            slug: 'bieu-dien-do-thi',
            detail: 'Đã có bài: đồ thị mẫu vẽ bằng thư viện, duyệt kề từng đỉnh',
            vnoi: '/algo/graph-theory/graph.md',
          },
          {
            name: 'Duyệt đồ thị',
            en: 'BFS & DFS',
            slug: 'duyet-do-thi',
            detail: 'Đã có bài: BFS theo lớp tính d(u), DFS đi sâu, chạy trên cùng một đồ thị',
            vnoi: '/algo/graph-theory/breadth-first-search.md',
          },
          {
            name: 'Đường đi ngắn nhất',
            en: 'Dijkstra, Bellman-Ford, Floyd-Warshall',
            slug: 'duong-di-ngan-nhat',
            detail: 'Đã có bài: Dijkstra chốt đỉnh d nhỏ nhất và thả lỏng cạnh trực quan',
            vnoi: '/algo/graph-theory/shortest-path.md',
          },
          {
            name: 'Cây khung nhỏ nhất',
            en: 'MST: Kruskal, Prim',
            slug: 'cay-khung-nho-nhat',
            detail: 'Đã có bài: Kruskal duyệt cạnh tăng dần, gộp bằng DSU',
            vnoi: '/algo/graph-theory/minimum-spanning-tree.md',
          },
          {
            name: 'Thành phần liên thông mạnh',
            en: 'SCC: Tarjan, Kosaraju',
            slug: 'thanh-phan-lien-thong-manh',
            detail: 'Đã có bài: Kosaraju 2 lượt DFS trên đồ thị gốc và đồ thị đảo',
          },
          {
            name: 'Khớp và cầu',
            en: 'Bridges & Articulation Points',
            slug: 'khop-va-cau',
            detail: 'Đã có bài: disc/low trên cây DFS, tô sáng cạnh cầu',
          },
          {
            name: 'LCA & Euler Tour',
            en: 'Lowest Common Ancestor, Euler Tour',
            slug: 'lca-euler-tour',
            detail: 'Tổ tiên chung thấp nhất bằng bội nhị phân (Binary Lifting)',
            vnoi: '/algo/data-structures/lca.md',
          },
        ],
      },
      {
        id: 'so-hoc',
        name: 'Lý thuyết số & Toán học',
        topics: [
          {
            name: 'Sàng Eratosthenes',
            en: 'Sieve of Eratosthenes',
            slug: 'sang-eratosthenes',
            detail: 'Đã có bài: gạch bội từng số nguyên tố, đếm số nguyên tố còn lại',
            vnoi: '/algo/algebra/prime_sieve.md',
          },
          {
            name: 'Thuật toán Euclid',
            en: 'GCD & Extended Euclid',
            slug: 'thuat-toan-euclid',
            detail: 'Đã có bài: Euclid mở rộng truy vết hệ số Bezout từng bước',
            vnoi: '/algo/algebra/euclid.md',
          },
          {
            name: 'Lũy thừa nhị phân',
            en: 'Binary Exponentiation',
            slug: 'luy-thua-nhi-phan',
            detail: 'Đã có bài: bình phương cơ số theo từng bit của mũ',
            vnoi: '/algo/algebra/binary_exponentation.md',
          },
          {
            name: 'Đại số tổ hợp',
            en: 'Combinatorics',
            slug: 'dai-so-to-hop',
            detail: 'Đã có bài: tam giác Pascal C(n,k) = C(n-1,k-1) + C(n-1,k)',
            vnoi: '/algo/algebra/nCk.md',
          },
        ],
      },
    ],
  },
  {
    id: 'giai-doan-3',
    name: 'Giai đoạn 3',
    tag: 'Nâng cao',
    level: 'Advanced',
    goal: 'thi VOI, APIO, IOI',
    groups: [
      {
        id: 'dp-toi-uu',
        name: 'Tối ưu hóa Quy hoạch động',
        topics: [
          { name: 'Convex Hull Trick', en: 'CHT, Li Chao Tree' },
          { name: 'Chia để trị tối ưu DP', en: 'Divide and Conquer Optimization' },
          { name: 'Knuth Optimization', en: 'Quadrangle Inequality' },
          { name: 'Slope Trick', en: 'Slope Trick' },
          { name: 'SOS DP', en: 'Sum Over Subsets DP' },
          { name: 'Profile DP', en: 'Profile DP / DP Broom' },
        ],
      },
      {
        id: 'ctdl-nang-cao',
        name: 'Cấu trúc dữ liệu nâng cao',
        topics: [
          {
            name: 'Cấu trúc dữ liệu bền vững',
            en: 'Persistent Data Structures',
            detail: 'Persistent Segment Tree, Persistent Trie',
          },
          { name: 'Cây cân bằng & cây liên kết', en: 'Treap, Splay Tree, Link-Cut Tree' },
          { name: 'Phân tách nặng-nhẹ', en: 'Heavy-Light Decomposition' },
          { name: 'Phân tách trọng tâm', en: 'Centroid Decomposition' },
          { name: 'Wavelet Tree & Merge Sort Tree', en: 'Wavelet Tree, Merge Sort Tree' },
        ],
      },
      {
        id: 'do-thi-luong',
        name: 'Đồ thị & Luồng nâng cao',
        topics: [
          {
            name: 'Luồng cực đại',
            en: 'Max Flow',
            detail: 'Ford-Fulkerson, Edmonds-Karp, Dinic',
          },
          { name: 'Lát cắt tối thiểu & luồng chi phí', en: 'Min Cut, Min Cost Max Flow' },
          {
            name: 'Cặp ghép',
            en: 'Matching: Hopcroft-Karp, Blossom',
            detail: 'Đồ thị hai phía và đồ thị tổng quát',
          },
          { name: 'Cây thống trị', en: 'Dominator Tree' },
        ],
      },
      {
        id: 'chuoi',
        name: 'Xử lý chuỗi',
        topics: [
          { name: 'Hash chuỗi', en: 'String Hashing' },
          { name: 'KMP & Z-algorithm', en: 'KMP, Z-function' },
          { name: 'Cây tiền tố & Aho-Corasick', en: 'Trie, Aho-Corasick' },
          { name: 'Cấu trúc hậu tố', en: 'Suffix Array, Suffix Automaton, Suffix Tree' },
        ],
      },
      {
        id: 'toan-nang-cao',
        name: 'Toán học & Đại số nâng cao',
        topics: [
          { name: 'Biến đổi Fourier nhanh', en: 'FFT / NTT', detail: 'Phép nhân đa thức' },
          { name: 'Khử Gauss & cơ sở XOR', en: 'Gaussian Elimination, XOR Basis' },
          { name: 'Định lý số dư Trung Hoa', en: 'Chinese Remainder Theorem' },
          {
            name: 'Nhân ma trận',
            en: 'Matrix Exponentiation',
            detail: 'Ứng dụng trong DP và đếm đường đi trên đồ thị',
          },
        ],
      },
      {
        id: 'ly-thuyet-tro-choi',
        name: 'Lý thuyết trò chơi',
        topics: [{ name: 'Nim & Sprague-Grundy', en: 'Game Theory' }],
      },
      {
        id: 'hinh-hoc',
        name: 'Hình học tính toán',
        topics: [
          { name: 'Tích có hướng & tích vô hướng', en: 'Cross Product, Dot Product' },
          {
            name: 'Vị trí tương đối',
            en: 'Point on segment, Segment intersection',
            detail: 'Điểm thuộc đoạn thẳng, giao của hai đoạn thẳng',
          },
          { name: 'Bao lồi', en: 'Convex Hull', detail: 'Graham Scan, Monotone Chain' },
          { name: 'Quét đường', en: 'Sweepline Algorithm' },
          { name: 'Định lý Pick & công thức Euler', en: "Pick's theorem, Planar Euler formula" },
        ],
      },
      {
        id: 'ngoai-tuyen',
        name: 'Xử lý ngoại tuyến & Chia để trị nâng cao',
        topics: [
          { name: 'Thuật toán Mo', en: "Mo's Algorithm", detail: 'Mo trên dãy và Mo trên cây' },
          { name: 'Chia để trị CDQ', en: 'CDQ Divide and Conquer' },
          {
            name: 'Đồ thị động',
            en: 'DSU Rollback, D&C on queries',
            detail: 'DSU hoàn tác và chia để trị theo thời gian truy vấn',
          },
        ],
      },
    ],
  },
];

/** Duyệt toàn bộ chủ đề trong chương trình. */
export function* iterTopics() {
  for (const stage of STAGES) {
    for (const group of stage.groups) {
      for (const topic of group.topics) {
        yield { topic, group, stage };
      }
    }
  }
}

export function countTopics(stage) {
  return stage.groups.reduce((sum, g) => sum + g.topics.length, 0);
}

export function countReady() {
  let n = 0;
  for (const { topic } of iterTopics()) if (topic.slug) n += 1;
  return n;
}
