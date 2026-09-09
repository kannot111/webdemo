import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="notfound">
      <h1>Không tìm thấy trang</h1>
      <p>
        Thuật toán bạn tìm chưa có trong sổ tay hoặc đường dẫn chưa đúng. <Link href="/">Về trang danh mục</Link>
      </p>
    </div>
  );
}
