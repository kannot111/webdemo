# Sổ tay thuật toán

Ôn tập thuật toán bằng tiếng Việt: 34 bài lý thuyết kèm **visualizer chạy từng bước** (sắp xếp, đồ thị, cây, QHD, straw string...), code C++/Python, bài tập thực chiến CSES/Codeforces/VNOJ.

## Chạy local

```bash
npm install
npm run dev        # http://localhost:3000
```

Build production + server:

```bash
npm run build
npm run start
```

## Scripts hữu ích

| Lệnh | Việc gì |
| --- | --- |
| `npm run build` | Build production (`.next`) |
| `npm run build:static` | Xuất site tĩnh ra `out/` (hosting HTML thuần) |
| `npm run index` | Sinh lại `public/search/index.json` cho tìm kiếm |
| `npm run deploy:check` | Build thường + static + sanity generators |

## Thêm bài mới

1. Tạo file MDX trong `content/algorithms/` (đặt frontmatter `title`, `description`).
2. Ghi slug trong `lib/curriculum.js`.
3. Chạy `npm run index` để cập nhật tìm kiếm.

Mỗi bài theo flow chuẩn: **Input mẫu → Code mẫu → Visualizer → Output (giải thích vì sao ra kết quả đó)**.

## Cấu trúc

- `content/algorithms/*.mdx` — nội dung bài học
- `components/` — `AlgorithmPlayer` + các visualizer (Array/Matrix/Graph/Tree dùng cytoscape)
- `lib/algorithms/` — generator minh họa từng bước cho mỗi bài
- `scripts/` — kiểm thử generator, build search index, ảnh chụp E2E

## Deploy

Xem [DEPLOY.md](DEPLOY.md) — đẩy lên GitHub rồi import vào Vercel (miễn phí).
