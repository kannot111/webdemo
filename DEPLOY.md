# Deploy lên Vercel (miễn phí)

Site là Next.js thuần tĩnh — deploy Vercel không cần cấu hình gì thêm.

## Bước 1 — Tạo repo GitHub
1. Mở https://github.com/new
2. Repository name: `so-tay-thuat-toan` (hoặc tên khác), chọn **Public**.
3. **KHÔNG** tick "Add a README" / ".gitignore" / "license" (repo phải trống).
4. Bấm **Create repository**.

## Bước 2 — Đẩy code lên GitHub (chạy trong thư mục dự án)
Thay `<username>` bằng tên tài khoản GitHub của bạn:

```bash
git remote add origin https://github.com/<username>/so-tay-thuat-toan.git
git branch -M main
git push -u origin main
```

Cửa sổ đăng nhập GitHub (Git Credential Manager) sẽ hiện lên lần đầu — đăng nhập
bằng trình duyệt là xong. Nếu git hỏi email tác giả, đặt trước khi commit tiếp:

```bash
git config user.email "<email-cua-ban>"
```

## Bước 3 — Import vào Vercel
1. Mở https://vercel.com/new và đăng nhập (có thể dùng luôn tài khoản GitHub).
2. Chọn **Import** repo `so-tay-thuat-toan`.
3. Giữ nguyên mọi mặc định (Framework: **Next.js**, Build: `next build`) → **Deploy**.
4. Chờ ~1–2 phút, nhận URL dạng `https://so-tay-thuat-toan.vercel.app`.

## Bước 4 — Gửi link cho bạn
Gửi URL ở bước 3. Mỗi lần `git push` lên `main`, Vercel tự build & cập nhật site.

## Cập nhật nội dung sau này
```bash
git add -A
git commit -m "mô tả thay đổi"
git push
```

## Kiểm tra trước khi đẩy (tuỳ chọn)
```bash
npm run deploy:check   # build thường + build static export + sanity generators
```

---

## C?p nh?t: d� th�m phuong �n GitHub Pages (dang d�ng)

Repo build **th�nh c�ng tr�n Linux thu?n** (GitHub Actions: Node 22, th?m ch� c?
gi? l?p `npm ci --ignore-scripts` + `NODE_ENV=production` � xem branch `debug-logs`).
N?u deployment tr�n Vercel v?n fail, nguy�n nh�n n?m ? c?u h�nh project tr�n dashboard:

1. Xem log chi ti?t: `npx vercel inspect <deployment-id> --logs` (c?n `npx vercel login`).
2. Project Settings: Root Directory d? tr?ng, Build Command d? tr?ng (m?c d?nh), Node 22.x.
3. C�ch nhanh nh?t: xo� project `webdemo` tr�n vercel.com r?i import l?i t? d?u.

GitHub Pages d� b?t t? d?ng qua `.github/workflows/deploy-pages.yml`:

- URL live: https://kannot111.github.io/webdemo/
- M?i push l�n `main` t? build static export (`STATIC_EXPORT=1`, `BASE_PATH=/webdemo`) v� deploy.
- N?u l?n d?u chua th?y trang: **Settings ? Pages ? Source = GitHub Actions**.
