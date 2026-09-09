import { compileMDX } from 'next-mdx-remote/rsc';
import fs from 'node:fs';
import path from 'node:path';
import remarkGfm from 'remark-gfm';
import { mdxComponents } from '@/components/mdxComponents';
import styles from './algorithm.module.css';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'algorithms');

// Chỉ cho phép render các bài đã có file .mdx trong content/algorithms.
// Bắt buộc cho output: 'export' — slug lạ → 404 thay vì render lúc chạy.
export const dynamicParams = false;

export function generateStaticParams() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => ({ slug: file.replace(/\.mdx$/, '') }));
}

const frontmatterOf = (source) =>
  /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1] ?? '';

const metaLine = (fm, key) => {
  const match = new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(fm);
  return match?.[1]?.trim();
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const source = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), 'utf8');
  const fm = frontmatterOf(source);
  const title = metaLine(fm, 'title') ?? slug;
  const description = metaLine(fm, 'description');
  return { title, description };
}

export default async function AlgorithmPage({ params }) {
  const { slug } = params;
  const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), 'utf8');
  const fm = frontmatterOf(raw);

  // Bỏ khối frontmatter trước khi compile vì ta đã tự đọc metadata phía trên
  // (không thêm phụ thuộc remark-frontmatter).
  const source = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');

  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
    components: mdxComponents,
  });

  const title = metaLine(fm, 'title') ?? slug;
  const category = metaLine(fm, 'category');

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        {category && <p className={styles.category}>{category}</p>}
        <h1 className={styles.title}>{title}</h1>
      </header>
      <div className={styles.prose}>{content}</div>
    </div>
  );
}
