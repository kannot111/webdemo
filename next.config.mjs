import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

// Đặt STATIC_EXPORT=1 để xuất toàn bộ site ra thư mục out/ (hosting tĩnh:
// GitHub Pages, Netlify Drop, Cloudflare Pages...). Mặc định giữ `next start`.
const isStaticExport = process.env.STATIC_EXPORT === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  ...(isStaticExport && {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
  },
});

export default withMDX(nextConfig);
