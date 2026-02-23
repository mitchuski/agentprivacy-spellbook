import { createRequire } from 'module';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapterPath = path.join(__dirname, 'build', 'fix-rsc-paths.js');

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
    // Next.js 16: flatten RSC payload paths (optional; file may be missing on CI/Cloudflare)
    ...(existsSync(adapterPath) && { adapterPath: path.resolve(adapterPath) }),
  },
};

export default nextConfig;

