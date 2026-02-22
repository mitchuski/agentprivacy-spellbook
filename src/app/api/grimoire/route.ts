import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const GRIMOIRE_FILENAME = 'complete-spellbook-v5.0.0-canonical.json';

/** Spells page uses baked grimoire (getBakedSpellCards); this route is optional/legacy. */
export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const candidates = [
    path.join(process.cwd(), 'docs', GRIMOIRE_FILENAME),
    path.join(process.cwd(), '..', 'docs', GRIMOIRE_FILENAME),
  ];
  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const data = await readFile(filePath, 'utf-8');
        const json = JSON.parse(data);
        return NextResponse.json(json);
      }
    } catch (e) {
      console.warn('Grimoire load attempt failed:', filePath, e);
    }
  }
  console.error('Grimoire not found at any path:', candidates);
  return NextResponse.json({ error: 'Grimoire not found' }, { status: 404 });
}
