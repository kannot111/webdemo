import Link from 'next/link';
import AlgorithmPlayer from './AlgorithmPlayer';

export const mdxComponents = {
  // Link nội bộ dùng next/link, link ngoài giữ nguyên <a>.
  a: ({ href, ...props }) =>
    href && href.startsWith('/') ? <Link href={href} {...props} /> : <a href={href} {...props} />,

  // Thẻ <ArrayVisualizer /> / <MatrixVisualizer /> dùng trong file .mdx: nhúng
  // cả khối player (canvas + chú thích + điều khiển). Chỉ truyền key thuật toán
  // dạng string vì nội dung MDX được render phía server; generator thật và
  // renderer phù hợp được tra ở components/generators.js phía client.
  // Cả hai thẻ đều đi tới AlgorithmPlayer — tên thẻ chỉ để MDX dễ đọc.
  ArrayVisualizer: ({ algorithm = 'bubbleSort', height }) => (
    <AlgorithmPlayer algorithm={algorithm} height={height} />
  ),
  MatrixVisualizer: ({ algorithm, height }) => (
    <AlgorithmPlayer algorithm={algorithm} height={height} />
  ),
  GraphVisualizer: ({ algorithm, height }) => (
    <AlgorithmPlayer algorithm={algorithm} height={height} />
  ),
  TreeVisualizer: ({ algorithm, height }) => (
    <AlgorithmPlayer algorithm={algorithm} height={height} />
  ),
};
