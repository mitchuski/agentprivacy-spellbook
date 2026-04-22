import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const GRIMOIRE_FILENAME = 'privacymage-grimoire-v10.2.0-canonical.json';

/** Spells page uses baked grimoire (getBakedSpellCards); this route serves the canonical v10.2 grimoire (Zero Spellbook v2.0 sync). */
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
