import { FIRST_PERSON_SPELL_IDS } from './grimoire-baked';

/** localStorage key for the user's spellbook (inscriptions & proverbs chosen for skills.md export) */
export const SPELLBOOK_STORAGE_KEY = 'agentprivacy-spellbook';

/** User-pasted proverbs list; included in skills.md export on Spells page. */
export const CUSTOM_PROVERBS_KEY = 'agentprivacy-custom-proverbs';

/** Inscribed proverbs per act/tale (taleId → proverb + optional constellation marker emoji). */
export const INSCRIBED_PROVERBS_KEY = 'agentprivacy-inscribed-proverbs';

export interface InscribedEntry {
  proverb: string;
  markerEmoji?: string;
}

/** Returns taleId → proverb (backward compatible: if entry is string, return it; if object, return .proverb). */
export function getInscribedProverbs(): Record<string, string> {
  const raw = getInscribedProverbsRaw();
  const out: Record<string, string> = {};
  for (const [taleId, v] of Object.entries(raw)) {
    out[taleId] = typeof v === 'string' ? v : (v?.proverb ?? '');
  }
  return out;
}

/** Returns taleId → { proverb, markerEmoji }. Values may be legacy string (treated as { proverb }). */
export function getInscribedProverbsRaw(): Record<string, InscribedEntry | string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(INSCRIBED_PROVERBS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, InscribedEntry | string>;
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

/** Get the constellation marker emoji for a taleId (from spell emoji the user picked). */
export function getInscribedMarkerEmoji(taleId: string): string | undefined {
  const raw = getInscribedProverbsRaw();
  const v = raw[taleId];
  if (v == null) return undefined;
  if (typeof v === 'string') return undefined;
  return v.markerEmoji;
}

/** Human-readable label for an inscribed taleId (e.g. "Story · Act 3", "Zero · Tale 2"). */
export function getInscribedTaleLabel(taleId: string): string {
  const storyN = taleId.match(/^act-(\d{2})-/)?.[1];
  if (storyN) return `Story · Act ${parseInt(storyN, 10)}`;
  const zeroN = taleId.match(/^zero-tale-(\d+)$/)?.[1];
  if (zeroN) return `Zero · Tale ${zeroN}`;
  if (taleId === 'guardian') return 'Canon · Guardian';
  const canonN = taleId.match(/^canon-chapter-(\d+)$/)?.[1];
  if (canonN) return `Canon · Chapter ${canonN}`;
  const societyN = taleId.match(/^society-chapter-(\d+)$/)?.[1];
  if (societyN) return `Society · Chapter ${societyN}`;
  const pluralityN = taleId.match(/^plurality-act-(\d+)$/)?.[1];
  if (pluralityN) return `Plurality · Act ${pluralityN}`;
  return taleId;
}

/** Get all inscribed marker emojis as spellId → emoji map (for spellweb). */
export function getAllInscribedMarkers(): Record<string, string> {
  const raw = getInscribedProverbsRaw();
  const out: Record<string, string> = {};
  for (const [taleId, v] of Object.entries(raw)) {
    if (typeof v === 'object' && v !== null && v.markerEmoji) {
      out[taleId] = v.markerEmoji;
    }
  }
  return out;
}

export function setInscribedProverb(taleId: string, proverb: string, markerEmoji?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const prev = getInscribedProverbsRaw();
    const existing = prev[taleId];
    const existingProverb = typeof existing === 'string' ? existing : (existing as InscribedEntry)?.proverb ?? '';
    prev[taleId] = {
      proverb: proverb || existingProverb,
      markerEmoji: markerEmoji ?? (typeof existing === 'object' && existing != null && !Array.isArray(existing) ? (existing as InscribedEntry).markerEmoji : undefined),
    };
    localStorage.setItem(INSCRIBED_PROVERBS_KEY, JSON.stringify(prev));
  } catch {
    // ignore
  }
}

export function removeInscribedProverb(taleId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const prev = getInscribedProverbsRaw();
    delete prev[taleId];
    localStorage.setItem(INSCRIBED_PROVERBS_KEY, JSON.stringify(prev));
  } catch {
    // ignore
  }
}

export function getCustomProverbs(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(CUSTOM_PROVERBS_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setCustomProverbs(text: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOM_PROVERBS_KEY, text);
  } catch {
    // ignore
  }
}

/** Keys for "learned up to" progress per spellbook (tree path stays lit). Value = max node id learned. */
export const LEARNED_STORY_KEY = 'agentprivacy-story-learned';
export const LEARNED_ZERO_KEY = 'agentprivacy-zero-learned';
export const LEARNED_CANON_KEY = 'agentprivacy-canon-learned';

export function getLearnedUpTo(key: string): number {
  if (typeof window === 'undefined') return -1;
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return -1;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : -1;
  } catch {
    return -1;
  }
}

export function setLearnedUpTo(key: string, nodeId: number): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLearnedUpTo(key);
    const next = Math.max(current, nodeId);
    localStorage.setItem(key, String(next));
  } catch {
    // ignore
  }
}

export interface SpellbookStorage {
  spellIds: string[];
  skillIds: string[];
}

export function getSpellbookFromStorage(): SpellbookStorage {
  if (typeof window === 'undefined') return { spellIds: [], skillIds: [] };
  try {
    const raw = localStorage.getItem(SPELLBOOK_STORAGE_KEY);
    if (!raw) return { spellIds: [], skillIds: [] };
    const parsed = JSON.parse(raw) as SpellbookStorage;
    return {
      spellIds: Array.isArray(parsed.spellIds) ? parsed.spellIds : [],
      skillIds: Array.isArray(parsed.skillIds) ? parsed.skillIds : [],
    };
  } catch {
    return { spellIds: [], skillIds: [] };
  }
}

export function setSpellbookInStorage(data: SpellbookStorage): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SPELLBOOK_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/** Add a spell id to the stored spellbook (e.g. from story page). Returns new set of spell ids. */
export function addSpellToSpellbook(spellId: string): Set<string> {
  const { spellIds, skillIds } = getSpellbookFromStorage();
  const next = new Set(spellIds);
  next.add(spellId);
  setSpellbookInStorage({ spellIds: [...next], skillIds });
  return next;
}

/** Remove a spell id from the stored spellbook. */
export function removeSpellFromSpellbook(spellId: string): Set<string> {
  const { spellIds, skillIds } = getSpellbookFromStorage();
  const next = spellIds.filter((id) => id !== spellId);
  setSpellbookInStorage({ spellIds: next, skillIds });
  return new Set(next);
}

// --- Saved spellbooks (versioned configurations for exploration) ---

export const SAVED_SPELLBOOKS_KEY = 'agentprivacy-spellbook-saves';

export interface SavedSpellbook {
  id: string;
  name: string;
  createdAt: string; // ISO
  spellIds: string[];
  skillIds: string[];
}

export function getSavedSpellbooks(): SavedSpellbook[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_SPELLBOOKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedSpellbook[];
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export function saveSpellbookAs(name: string, spellIds: string[], skillIds: string[]): SavedSpellbook {
  const list = getSavedSpellbooks();
  const saved: SavedSpellbook = {
    id: `sb-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: name.trim() || 'Unnamed spellbook',
    createdAt: new Date().toISOString(),
    spellIds: [...spellIds],
    skillIds: [...skillIds],
  };
  list.unshift(saved);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SAVED_SPELLBOOKS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
  return saved;
}

/** Load a saved spellbook into the current working spellbook (persists to SPELLBOOK_STORAGE_KEY). */
export function loadSavedSpellbookIntoCurrent(id: string): boolean {
  const list = getSavedSpellbooks();
  const saved = list.find((s) => s.id === id);
  if (!saved) return false;
  setSpellbookInStorage({ spellIds: saved.spellIds, skillIds: saved.skillIds });
  return true;
}

export function deleteSavedSpellbook(id: string): void {
  const list = getSavedSpellbooks().filter((s) => s.id !== id);
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVED_SPELLBOOKS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

// --- Pathway: map selected spell IDs to act/tale/chapter node IDs per spellbook ---

/** Spellbook type for pathway derivation. */
export type PathwaySpellbook = 'story' | 'zero' | 'canon' | 'society' | 'plurality';

/** Parse act number from story spell id (e.g. act-13-book-of-promises → 13). */
function storySpellIdToActNumber(spellId: string): number | null {
  const m = spellId.match(/^act-(\d{2})-/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

/** Parse tale number from zero spell id (e.g. zero-tale-7 → 7). */
function zeroSpellIdToTaleNumber(spellId: string): number | null {
  const m = spellId.match(/^zero-tale-(\d+)$/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

/** Parse chapter number from canon spell id (canon-chapter-N → N, guardian → 12). */
function canonSpellIdToChapterNumber(spellId: string): number | null {
  if (spellId === 'guardian') return 12;
  const m = spellId.match(/^canon-chapter-(\d+)$/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

/** Parse chapter number from society spell id (society-chapter-N → N). */
function societySpellIdToChapterNumber(spellId: string): number | null {
  const m = spellId.match(/^society-chapter-(\d+)$/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

/** Parse act number from plurality spell id (plurality-act-N → N). */
function pluralitySpellIdToActNumber(spellId: string): number | null {
  const m = spellId.match(/^plurality-act-(\d+)$/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

/**
 * Returns sorted node IDs (act/tale/chapter numbers) for the given spellbook that appear in spellIds.
 * Used to light a "pathway" in SpellbookTalentTree and in skills.md export.
 */
export function getPathwayNodeIds(spellIds: string[], spellbook: PathwaySpellbook): number[] {
  const set = new Set<number>();
  for (const id of spellIds) {
    let n: number | null = null;
    switch (spellbook) {
      case 'story':
        n = storySpellIdToActNumber(id);
        break;
      case 'zero':
        n = zeroSpellIdToTaleNumber(id);
        break;
      case 'canon':
        n = canonSpellIdToChapterNumber(id);
        break;
      case 'society':
        n = societySpellIdToChapterNumber(id);
        break;
      case 'plurality':
        n = pluralitySpellIdToActNumber(id);
        break;
    }
    if (n != null) set.add(n);
  }
  return [...set].sort((a, b) => a - b);
}

/**
 * Returns the spell id for a given spellbook and node (act/tale/chapter number).
 * Used to add the act to the spellbook on inscribe and as taleId for inscribed proverbs storage.
 */
export function getSpellIdForNode(spellbook: PathwaySpellbook, nodeId: number): string | null {
  switch (spellbook) {
    case 'story': {
      if (nodeId < 1 || nodeId > 22) return null;
      return FIRST_PERSON_SPELL_IDS[nodeId - 1] ?? null;
    }
    case 'zero':
      return nodeId >= 1 && nodeId <= 30 ? `zero-tale-${nodeId}` : null;
    case 'canon':
      if (nodeId === 12) return 'guardian';
      return nodeId >= 0 && nodeId <= 11 ? `canon-chapter-${nodeId}` : null;
    case 'society':
      return nodeId >= 0 && nodeId <= 18 ? `society-chapter-${nodeId}` : null;
    case 'plurality':
      return nodeId >= 1 && nodeId <= 30 ? `plurality-act-${nodeId}` : null;
    default:
      return null;
  }
}

/**
 * Human-readable pathway lines for skills.md (e.g. "Story: Act I, Act XIII, Zero: Tale 1, Tale 7").
 * spellCards used to resolve spell id → title for labels.
 */
export function getPathwayLines(
  spellIds: string[],
  spellCards: { id: string; title: string; spellbook?: string }[]
): string[] {
  const bySpellbook: Record<string, { num: number; label: string }[]> = {};
  const add = (book: string, num: number, label: string) => {
    if (!bySpellbook[book]) bySpellbook[book] = [];
    if (!bySpellbook[book].some((p) => p.num === num)) {
      bySpellbook[book].push({ num, label });
    }
  };
  for (const id of spellIds) {
    const card = spellCards.find((c) => c.id === id);
    const title = card?.title ?? id;
    let n: number | null = null;
    let book: string | null = null;
    if (storySpellIdToActNumber(id) != null) {
      n = storySpellIdToActNumber(id)!;
      book = 'Story';
      add(book, n, `Act ${n}: ${title}`);
    } else if (zeroSpellIdToTaleNumber(id) != null) {
      n = zeroSpellIdToTaleNumber(id)!;
      book = 'Zero';
      add(book, n, `Tale ${n}: ${title}`);
    } else if (canonSpellIdToChapterNumber(id) != null) {
      n = canonSpellIdToChapterNumber(id)!;
      book = 'Canon';
      add(book, n, `Chapter ${n}: ${title}`);
    } else if (societySpellIdToChapterNumber(id) != null) {
      n = societySpellIdToChapterNumber(id)!;
      book = 'Society';
      add(book, n, `Chapter ${n}: ${title}`);
    } else if (pluralitySpellIdToActNumber(id) != null) {
      n = pluralitySpellIdToActNumber(id)!;
      book = 'Plurality';
      add(book, n, `Act ${n}: ${title}`);
    }
  }
  const order: string[] = ['Story', 'Zero', 'Canon', 'Society', 'Plurality'];
  const lines: string[] = [];
  for (const book of order) {
    const pairs = bySpellbook[book];
    if (!pairs?.length) continue;
    pairs.sort((a, b) => a.num - b.num);
    lines.push(`**${book}:** ${pairs.map((p) => p.label).join(' · ')}`);
  }
  return lines;
}
