#!/usr/bin/env node
// Syncs agentprivacy-skills/agentprivacy-skills-v5/ → public/skills/
// Canonical source is agentprivacy-skills/; public/skills/ is a build artifact (gitignored).
// Runs automatically on prebuild and predev.

import { rm, mkdir, readdir, copyFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'agentprivacy-skills', 'agentprivacy-skills-v5');
const DST = join(ROOT, 'public', 'skills');

// Skip maintenance and repo-internal files so public/skills/ only carries serving content.
const SKIP_NAMES = new Set(['.DS_Store', 'Thumbs.db', '.git', '.gitignore']);
const SKIP_SUFFIXES = ['.bak', '.swp', '.swo'];

function shouldSkip(name) {
  if (SKIP_NAMES.has(name)) return true;
  for (const suffix of SKIP_SUFFIXES) {
    if (name.endsWith(suffix)) return true;
  }
  return false;
}

async function copyDir(src, dst) {
  await mkdir(dst, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  let fileCount = 0;
  for (const entry of entries) {
    if (shouldSkip(entry.name)) continue;
    const srcPath = join(src, entry.name);
    const dstPath = join(dst, entry.name);
    if (entry.isDirectory()) {
      fileCount += await copyDir(srcPath, dstPath);
    } else if (entry.isFile()) {
      await copyFile(srcPath, dstPath);
      fileCount += 1;
    }
  }
  return fileCount;
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(`[sync-skills] canonical source missing: ${SRC}`);
    process.exit(1);
  }

  const srcStat = await stat(SRC);
  if (!srcStat.isDirectory()) {
    console.error(`[sync-skills] canonical source is not a directory: ${SRC}`);
    process.exit(1);
  }

  if (existsSync(DST)) {
    await rm(DST, { recursive: true, force: true });
  }

  const count = await copyDir(SRC, DST);
  console.log(`[sync-skills] ${count} files copied: ${relative(ROOT, SRC)} -> ${relative(ROOT, DST)}`);
}

main().catch((err) => {
  console.error('[sync-skills] failed:', err);
  process.exit(1);
});
