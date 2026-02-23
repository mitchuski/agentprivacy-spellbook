/**
 * Next.js 16 static export: fix RSC payload path mismatch (issue #85374).
 * Build outputs __next/segment/__PAGE__.txt but the client requests __next.segment.__PAGE__.txt.
 * This adapter renames nested paths to dot-separated so prefetch and client nav work.
 * @see https://github.com/vercel/next.js/issues/85374
 * @see https://blog.axiorema.com/engineering/uncurious-case-broken-static-exports-404s-nextjs-16/
 */

const fs = require('fs');
const path = require('path');

/** @type {import('next').NextAdapter} */
const adapter = {
  name: 'fix-rsc-paths-85374',
  async onBuildComplete({ outputs }) {
    if (!outputs.staticFiles) return;
    for (const file of outputs.staticFiles) {
      const sourcePath = file.filePath;
      const targetPath = fixupPath(sourcePath);
      if (targetPath && sourcePath !== targetPath) {
        try {
          await fs.promises.rename(sourcePath, targetPath);
        } catch (e) {
          console.warn('[fix-rsc-paths] rename failed:', sourcePath, '->', targetPath, e.message);
        }
      }
    }
  },
};

function fixupPath(filePath) {
  const sep = path.sep;
  const components = filePath.split(sep);
  // On disk: .../out/__next/company/__PAGE__.txt → want .../out/__next.company.__PAGE__.txt
  const idx = components.findIndex((x) => x === '__next' || x.startsWith('__next.'));
  if (idx >= 0 && idx < components.length - 1) {
    const result = components.slice(0, idx);
    result.push(components.slice(idx).join('.'));
    return result.join(sep);
  }
  return null;
}

module.exports = adapter;
