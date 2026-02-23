import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async generateBuildId() {
    return 'static-build';
  },
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    // Next.js 16: flatten RSC payload paths so client requests find them (issue #85374)
    adapterPath: require.resolve('./build/fix-rsc-paths.js'),
  },
};

export default nextConfig;

