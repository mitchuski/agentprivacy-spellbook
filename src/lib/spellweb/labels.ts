/**
 * Label formatting utilities for spellweb nodes.
 * Converts long titles to short emoji + numeral labels.
 */

const ROMAN = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
  'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
];

/** Default emoji for each grimoire/spellbook. */
const GRIMOIRE_EMOJI: Record<string, string> = {
  story: '📖',
  zero: '🔮',
  canon: '📜',
  society: '🏛️',
  plurality: '🌐',
  incantations: '✨',
  origins: '🌅',
  skills: '🧠',
};

/** Color for each grimoire. */
const GRIMOIRE_COLORS: Record<string, string> = {
  story: '#8b5cf6',    // Purple
  zero: '#06b6d4',     // Cyan
  canon: '#f59e0b',    // Amber
  society: '#10b981',  // Emerald
  plurality: '#ec4899', // Pink
  incantations: '#6366f1', // Indigo
  origins: '#f97316',  // Orange
  skills: '#84cc16',   // Lime
};

/**
 * Get short label for a spell (Roman numeral or number).
 */
export function getShortLabel(spellId: string): string {
  // Story: "act-01-..." → "I"
  const storyMatch = spellId.match(/^act-(\d{2})-/);
  if (storyMatch) {
    const n = parseInt(storyMatch[1], 10);
    return ROMAN[n - 1] || String(n);
  }

  // Zero: "zero-tale-7" → "7"
  const zeroMatch = spellId.match(/^zero-tale-(\d+)$/);
  if (zeroMatch) return zeroMatch[1];

  // Canon: "canon-chapter-3" → "III", "guardian" → "G"
  if (spellId === 'guardian') return 'G';
  const canonMatch = spellId.match(/^canon-chapter-(\d+)$/);
  if (canonMatch) {
    const n = parseInt(canonMatch[1], 10);
    return ROMAN[n] || String(n);
  }

  // Society: "society-chapter-3" → "III"
  const societyMatch = spellId.match(/^society-chapter-(\d+)$/);
  if (societyMatch) {
    const n = parseInt(societyMatch[1], 10);
    return ROMAN[n] || String(n);
  }

  // Plurality: "plurality-act-3" → "III"
  const pluralityMatch = spellId.match(/^plurality-act-(\d+)$/);
  if (pluralityMatch) {
    const n = parseInt(pluralityMatch[1], 10);
    return ROMAN[n - 1] || String(n);
  }

  // Incantations: friendly short labels for key spells
  if (spellId === 'incantation-triune_graph_spell') return '👤📚🤞';
  if (spellId === 'incantation-manifold_incantation') return '🐉';

  // Fallback: first 4 chars
  return spellId.slice(0, 4);
}

/**
 * Extract sequence number from spell ID (for connecting sequential acts).
 */
export function getSequenceNumber(spellId: string): number | null {
  // Story: "act-01-..." → 1
  const storyMatch = spellId.match(/^act-(\d{2})-/);
  if (storyMatch) return parseInt(storyMatch[1], 10);

  // Zero: "zero-tale-7" → 7
  const zeroMatch = spellId.match(/^zero-tale-(\d+)$/);
  if (zeroMatch) return parseInt(zeroMatch[1], 10);

  // Canon: "canon-chapter-3" → 3
  if (spellId === 'guardian') return 12;
  const canonMatch = spellId.match(/^canon-chapter-(\d+)$/);
  if (canonMatch) return parseInt(canonMatch[1], 10);

  // Society
  const societyMatch = spellId.match(/^society-chapter-(\d+)$/);
  if (societyMatch) return parseInt(societyMatch[1], 10);

  // Plurality
  const pluralityMatch = spellId.match(/^plurality-act-(\d+)$/);
  if (pluralityMatch) return parseInt(pluralityMatch[1], 10);

  return null;
}

/**
 * Get grimoire/spellbook from spell ID.
 */
export function getGrimoireFromSpellId(spellId: string): string {
  if (spellId.startsWith('act-')) return 'story';
  if (spellId.startsWith('zero-tale-')) return 'zero';
  if (spellId === 'guardian' || spellId.startsWith('canon-chapter-')) return 'canon';
  if (spellId.startsWith('parallel-') || spellId.startsWith('society-chapter-')) return 'society';
  if (spellId.startsWith('plurality-')) return 'plurality';
  if (spellId.startsWith('incantation-')) return 'incantations';
  if (spellId.startsWith('origins-')) return 'origins';
  return 'unknown';
}

/**
 * Get default emoji for a grimoire.
 */
export function getGrimoireEmoji(grimoire: string): string {
  return GRIMOIRE_EMOJI[grimoire] || '⚫';
}

/**
 * Get color for a grimoire.
 */
export function getGrimoireColor(grimoire: string): string {
  return GRIMOIRE_COLORS[grimoire] || '#6b7280';
}

/**
 * Get display name for a grimoire.
 */
export function getGrimoireDisplayName(grimoire: string): string {
  const names: Record<string, string> = {
    story: 'Story',
    zero: 'Zero',
    canon: 'Canon',
    society: 'Society',
    plurality: 'Plurality',
    incantations: 'Incantations',
    origins: 'Origins',
    skills: 'Skills',
  };
  return names[grimoire] || grimoire;
}
