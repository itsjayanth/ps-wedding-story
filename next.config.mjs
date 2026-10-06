/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true, formats: ['image/avif', 'image/webp'] },
  eslint: { ignoreDuringBuilds: false },
};
export default nextConfig;
