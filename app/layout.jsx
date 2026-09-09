import './globals.css';

export const metadata = {
  title: {
    default: 'Sổ tay thuật toán',
    template: '%s — Sổ tay thuật toán',
  },
  description:
    'Lý thuyết và minh họa trực quan các thuật toán luyện thi tin học, từ cấp trường đến quốc gia.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
