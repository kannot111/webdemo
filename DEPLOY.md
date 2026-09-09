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
