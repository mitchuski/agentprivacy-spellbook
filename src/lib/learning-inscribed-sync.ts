/**
 * Maps inscribed story proverbs (with marker emoji) to orbiting spell chips on the dual orbs.
 */

import { getInscribedProverbsRaw } from '@/lib/spellbook-storage';

export interface OrbitingInscribedSpell {
  taleId: string;
  emoji: string;
  orbiter: 'swordsman' | 'mage';
}

/** Odd act → swordsman orbit, even → mage (First Person act ids). */
function orbiterForStoryActId(taleId: string): 'swordsman' | 'mage' {
  const m = taleId.match(/^act-(\d+)-/);
  if (!m) return 'swordsman';
  const n = parseInt(m[1], 10);
  return n % 2 === 1 ? 'swordsman' : 'mage';
}

/**
 * Inscribed acts only (marker emoji + non-empty proverb). Drives wandering orb satellites.
 */
export function collectInscribedOrbitingSpells(): OrbitingInscribedSpell[] {
  if (typeof window === 'undefined') return [];
  const raw = getInscribedProverbsRaw();
  const out: OrbitingInscribedSpell[] = [];

  for (const [taleId, v] of Object.entries(raw)) {
    if (!taleId.startsWith('act-')) continue;
    const entry = typeof v === 'string' ? { proverb: v, markerEmoji: undefined as string | undefined } : v;
    const proverb = entry?.proverb?.trim() ?? '';
    const marker = entry?.markerEmoji?.trim();
    if (!proverb || !marker) continue;
    out.push({
      taleId,
      emoji: marker,
      orbiter: orbiterForStoryActId(taleId),
    });
  }

  return out;
}

export const LEARNING_SPELLS_FORMING_BLADE = 'learning spells, forming blades';
