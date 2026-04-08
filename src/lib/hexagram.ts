import type { HexagramSnapshot } from '@/lib/training-progress';

/**
 * Six lines bottom → top; yin = 0, yang = 1 (same as classical binary / Shao Yong order).
 * Binary index 0 = all yin, 63 = all yang.
 *
 * Glyphs below are I Ching hexagrams in binary order (index 0…63), matching Unicode
 * block U+4DC0…U+4DFF King Wen numbering for each character.
 * Source order: https://interglacial.com/pub/i_ching/i_ching_hexagrams_in_binary_order.html
 */
export const HEXAGRAMS_BINARY_ORDER =
  '䷁䷖䷇䷓䷏䷢䷬䷋䷎䷳䷦䷴䷽䷷䷞䷠䷆䷃䷜䷺䷧䷿䷮䷅䷭䷑䷯䷸䷟䷱䷛䷫䷗䷚䷂䷩䷲䷔䷐䷘䷣䷕䷾䷤䷶䷝䷰䷌䷒䷨䷻䷼䷵䷥䷹䷉䷊䷙䷄䷈䷡䷍䷪䷀';

/** Wilhelm/Baynes short titles, King Wen 1–64 */
export const KING_WEN_NAMES: readonly string[] = [
  'The Creative',
  'The Receptive',
  'Difficulty at the Beginning',
  'Youthful Folly',
  'Waiting',
  'Conflict',
  'The Army',
  'Holding Together',
  'The Taming Power of the Small',
  'Treading',
  'Peace',
  'Standstill',
  'Fellowship',
  'Great Possession',
  'Modesty',
  'Enthusiasm',
  'Following',
  'Work on Corruption',
  'Approach',
  'Contemplation',
  'Biting Through',
  'Grace',
  'Splitting Apart',
  'Return',
  'Innocence',
  'The Taming Power of the Great',
  'Corners of the Mouth',
  'Preponderance of the Great',
  'The Abysmal',
  'The Clinging',
  'Influence',
  'Duration',
  'Retreat',
  'The Power of the Great',
  'Progress',
  'Darkening of the Light',
  'The Family',
  'Opposition',
  'Obstruction',
  'Deliverance',
  'Decrease',
  'Increase',
  'Breakthrough',
  'Coming to Meet',
  'Gathering Together',
  'Pushing Upward',
  'Oppression',
  'The Well',
  'Revolution',
  'The Cauldron',
  'The Shock',
  'Keeping Still',
  'Development',
  'The Marrying Maiden',
  'Abundance',
  'The Wanderer',
  'The Gentle',
  'The Joyous',
  'Dispersion',
  'Limitation',
  'Inner Truth',
  'Preponderance of the Small',
  'After Completion',
  'Before Completion',
];

export function linesToBinaryIndex(lines: HexagramSnapshot['lines']): number {
  let n = 0;
  for (let i = 0; i < 6; i++) {
    n |= (lines[i] & 1) << i;
  }
  return n;
}

export function binaryIndexToGlyph(index: number): string {
  const i = Math.max(0, Math.min(63, index | 0));
  return HEXAGRAMS_BINARY_ORDER[i] ?? '䷀';
}

export function glyphToKingWenNumber(glyph: string): number {
  const cp = glyph.codePointAt(0);
  if (cp === undefined) return 1;
  const n = cp - 0x4dc0 + 1;
  return n >= 1 && n <= 64 ? n : 1;
}

export function resolveHexagram(lines: HexagramSnapshot['lines']): {
  binaryIndex: number;
  kingWenNumber: number;
  glyph: string;
  name: string;
} {
  const binaryIndex = linesToBinaryIndex(lines);
  const glyph = binaryIndexToGlyph(binaryIndex);
  const kingWenNumber = glyphToKingWenNumber(glyph);
  const name = KING_WEN_NAMES[kingWenNumber - 1] ?? `Hexagram ${kingWenNumber}`;
  return { binaryIndex, kingWenNumber, glyph, name };
}
