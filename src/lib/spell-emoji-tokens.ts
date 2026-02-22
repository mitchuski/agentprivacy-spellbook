/**
 * Split a spell emoji string into selectable tokens (emoji sequences) for the constellation marker picker.
 * Splits on whitespace and common separators; keeps segments that contain at least one emoji.
 */
const SPLIT_REGEX = /[\s→←=\+\-➗⊥×\[\],()]+/;
const HAS_EMOJI = /\p{Emoji}/u;

export function tokenizeSpellEmoji(spellString: string): string[] {
  if (!spellString.trim()) return [];
  const tokens = spellString
    .split(SPLIT_REGEX)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && HAS_EMOJI.test(s));
  return [...new Set(tokens)]; // dedupe
}
