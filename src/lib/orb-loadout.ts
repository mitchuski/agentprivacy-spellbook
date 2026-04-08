/**
 * Dual-orb loadout:
 * - Swordsman: six-line hex **stance** + six Soulbis slots (S / H in training; grimoire + training picks).
 * - Mage: six Soulbae slots (M in training; /spells or /orbs).
 * - Wandering dual orbs use **only** this loadout (max 6 micro-orbits per side). Story inscriptions do not add satellites.
 * - Soulbis facet chips render only after a **spellweb forged blade** is imported (meta in localStorage).
 */

import { SPELLWEB_BLADE_META_KEY } from '@/lib/spellweb-blade-keys';
import { resolveHexagram } from '@/lib/hexagram';
import { getBakedSpellCards } from '@/lib/grimoire-baked';
import { collectInscribedOrbitingSpells } from '@/lib/learning-inscribed-sync';
import { getAgentCard, getCeremonyConstellation, hasCompletedCeremony } from '@/lib/ceremony/storage';
import { getSpellbookFromStorage } from '@/lib/spellbook-storage';
import {
  DEFAULT_SPELLS,
  getAvailableSpells,
  getRepertoire,
  isPathUnlocked,
  updateHexagramSnapshot,
  type HexagramSnapshot,
} from '@/lib/training-progress';

export const ORB_LOADOUT_SLOT_COUNT = 6;

export const ORB_LOADOUT_STORAGE_KEY = 'agentprivacy_orb_loadout_v1';

/** Spell picks from /spells graph use ids `sb:<grimoire-card-id>` */
export const SPELLBOOK_ORB_PREFIX = 'sb:' as const;

export type OrbSpellOption = {
  id: string;
  emoji: string;
  content: string;
};

/** Default I Ching lines bottom→top (yin=0, yang=1) when none saved */
export const DEFAULT_STANCE_HEX: HexagramSnapshot['lines'] = [0, 0, 0, 1, 1, 1];

export type OrbLoadoutSlot = {
  spellId: string;
  emoji: string;
};

/** v2 adds stance hex lines for swordsman orbit management */
export type OrbLoadout = {
  version: 2;
  /** Swordsman “hex stance” — same six lines as the I Ching figure */
  stanceHexLines: HexagramSnapshot['lines'];
  swordsman: OrbLoadoutSlot[];
  mage: OrbLoadoutSlot[];
};

/** Unified chip for DualOrbs sync (loadout + inscribed). */
export type OrbitingSyncSpell = {
  id: string;
  emoji: string;
  orbiter: 'swordsman' | 'mage';
  taleId?: string;
  /** Swordsman only: yin (0) / yang (1) for this line — biases orbit radius in training */
  stanceLine?: 0 | 1;
};

function hasForgedSpellwebBladeMeta(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(SPELLWEB_BLADE_META_KEY);
    if (!raw) return false;
    const o = JSON.parse(raw) as { bladeId?: unknown };
    return typeof o.bladeId === 'string' && o.bladeId.length > 0;
  } catch {
    return false;
  }
}

function isDragonUnlocked(): boolean {
  if (typeof window === 'undefined') return true;
  return getRepertoire().trainingProgress.drakeSpellUnlocked;
}

function getSpellbookCardForOrbSlot(cardId: string) {
  const { spellIds } = getSpellbookFromStorage();
  const card = getBakedSpellCards().find((c) => c.id === cardId);
  if (!card || !spellIds.includes(cardId)) return null;
  return card;
}

/** Extract complete emojis from a string, handling multi-codepoint sequences */
function uniqEmojisFromSpellString(s: string): string[] {
  // Use Intl.Segmenter to properly split by grapheme clusters (handles emoji ZWJ sequences)
  try {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    const segments = [...segmenter.segment(s)].map(seg => seg.segment);
    const emojis = segments.filter(seg => {
      const cp = seg.codePointAt(0);
      // Filter for emoji range, exclude basic ASCII and numbers
      return cp !== undefined && cp > 0x2ff && !/^[0-9#*\s]$/.test(seg);
    });
    return [...new Set(emojis)];
  } catch {
    // Fallback for environments without Intl.Segmenter
    const out: string[] = [];
    for (const ch of s) {
      const cp = ch.codePointAt(0);
      if (cp !== undefined && cp > 0x2ff) out.push(ch);
    }
    return [...new Set(out)];
  }
}

function normalizeSpellId(spellId: string): string {
  if (spellId.startsWith(SPELLBOOK_ORB_PREFIX)) {
    const cardId = spellId.slice(SPELLBOOK_ORB_PREFIX.length);
    if (getSpellbookCardForOrbSlot(cardId)) return spellId;
    const available = getAvailableSpells();
    return available[0]?.id ?? DEFAULT_SPELLS[0].id;
  }
  const available = getAvailableSpells();
  const ids = new Set(available.map((s) => s.id));
  if (ids.has(spellId)) return spellId;
  if (spellId === 'emoji_dragon' && !isDragonUnlocked()) {
    return 'emoji_shield';
  }
  return available[0]?.id ?? DEFAULT_SPELLS[0].id;
}

function normalizeStanceHex(raw: unknown): HexagramSnapshot['lines'] {
  if (!Array.isArray(raw) || raw.length !== 6) return [...DEFAULT_STANCE_HEX];
  return raw.map((x) => (x === 1 ? 1 : 0)) as HexagramSnapshot['lines'];
}

/** Full stance spell pool: persona (ceremony), orbs/training gate, or any story inscription (“spells you feel”). */
export function canAccessFullStanceSpellPool(): boolean {
  if (typeof window === 'undefined') return false;
  if (hasCompletedCeremony()) return true;
  if (isPathUnlocked()) return true;
  return collectInscribedOrbitingSpells().length > 0;
}

/** Novice pool when stance effects aren’t fully unlocked yet */
const MINIMAL_STANCE_SPELL_IDS = new Set(['emoji_shield', 'emoji_crystal', 'proverb_gap']);

/** Spells pickable per S1–S6 line in the hex stance editor */
export function getSpellsForSwordsmanStanceEditor(): ReturnType<typeof getAvailableSpells> {
  const all = getAvailableSpells();
  if (canAccessFullStanceSpellPool()) return all;
  const minimal = all.filter((s) => MINIMAL_STANCE_SPELL_IDS.has(s.id));
  return minimal.length ? minimal : all.slice(0, 3);
}

/** Emoji options derived from training spell content + primary emoji, or grimoire card spell line. */
export function getEmojiOptionsForSpellId(spellId: string): string[] {
  if (!spellId) {
    return [''];
  }
  if (spellId.startsWith(SPELLBOOK_ORB_PREFIX)) {
    const card = getBakedSpellCards().find((c) => c.id === spellId.slice(SPELLBOOK_ORB_PREFIX.length));
    if (!card) return ['✨'];
    const fromSpell = uniqEmojisFromSpellString(`${card.spell} ${card.title}`);
    return fromSpell.length ? fromSpell : ['📜'];
  }
  const sp = DEFAULT_SPELLS.find((s) => s.id === spellId);
  if (!sp) return ['✨'];
  const out: string[] = [];
  if (sp.emoji) out.push(sp.emoji);
  for (const ch of sp.content) {
    const cp = ch.codePointAt(0);
    if (cp !== undefined && cp > 0x2ff) out.push(ch);
  }
  const uniq = [...new Set(out)];
  return uniq.length ? uniq : ['✨'];
}

export function getDefaultOrbLoadout(): OrbLoadout {
  const base = DEFAULT_SPELLS.filter((s) => s.id !== 'emoji_dragon' || isDragonUnlocked());
  const pick = (i: number) => {
    const sp = base[i % base.length];
    return { spellId: sp.id, emoji: sp.emoji ?? '✨' };
  };
  return {
    version: 2,
    stanceHexLines: [...DEFAULT_STANCE_HEX],
    /** No Soulbis facets until spellweb blade import fills emojis (repertoire may stay empty). */
    swordsman: Array.from({ length: ORB_LOADOUT_SLOT_COUNT }, () => ({ spellId: '', emoji: '' })),
    mage: Array.from({ length: ORB_LOADOUT_SLOT_COUNT }, (_, i) => pick(i + ORB_LOADOUT_SLOT_COUNT)),
  };
}

function normalizeSlot(slot: Partial<OrbLoadoutSlot> | undefined, fallback: OrbLoadoutSlot): OrbLoadoutSlot {
  const rawId = typeof slot?.spellId === 'string' ? slot.spellId : fallback.spellId;
  const rawEmoji = typeof slot?.emoji === 'string' ? slot.emoji : '';

  if (rawId.startsWith(SPELLBOOK_ORB_PREFIX)) {
    const cardId = rawId.slice(SPELLBOOK_ORB_PREFIX.length);
    const card = getSpellbookCardForOrbSlot(cardId);
    if (!card) {
      return normalizeSlot({}, fallback);
    }
    const opts = getEmojiOptionsForSpellId(rawId);
    const emoji = opts.includes(rawEmoji) ? rawEmoji : opts[0] ?? '📜';
    return { spellId: rawId, emoji };
  }

  if (rawId === '') {
    return { spellId: '', emoji: rawEmoji };
  }

  const spellId = normalizeSpellId(rawId);
  const options = getEmojiOptionsForSpellId(spellId);
  const emoji = options.includes(rawEmoji) ? rawEmoji : options[0] ?? fallback.emoji;
  return { spellId, emoji };
}

function normalizeLoadout(raw: unknown): OrbLoadout {
  const def = getDefaultOrbLoadout();
  if (!raw || typeof raw !== 'object') return def;
  const o = raw as Partial<OrbLoadout> & { version?: number };
  const pad = (arr: unknown, side: 'swordsman' | 'mage'): OrbLoadoutSlot[] => {
    const slots = Array.isArray(arr) ? arr : [];
    const fb = side === 'swordsman' ? def.swordsman : def.mage;
    const fb0 = def.swordsman[0];
    return Array.from({ length: ORB_LOADOUT_SLOT_COUNT }, (_, i) =>
      normalizeSlot(slots[i] as Partial<OrbLoadoutSlot>, fb[i] ?? fb0)
    );
  };
  const stanceHexLines = o.version === 2 ? normalizeStanceHex(o.stanceHexLines) : [...DEFAULT_STANCE_HEX];
  return {
    version: 2,
    stanceHexLines,
    swordsman: pad(o.swordsman, 'swordsman'),
    mage: pad(o.mage, 'mage'),
  };
}

export function getOrbLoadout(): OrbLoadout {
  if (typeof window === 'undefined') return getDefaultOrbLoadout();
  try {
    const raw = localStorage.getItem(ORB_LOADOUT_STORAGE_KEY);
    if (!raw) return getDefaultOrbLoadout();
    return normalizeLoadout(JSON.parse(raw));
  } catch {
    return getDefaultOrbLoadout();
  }
}

export function saveOrbLoadout(loadout: OrbLoadout): void {
  if (typeof window === 'undefined') return;
  const normalized = normalizeLoadout(loadout);
  localStorage.setItem(ORB_LOADOUT_STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent('agentprivacy:orb-loadout-changed'));
  window.dispatchEvent(new CustomEvent('agentprivacy:learning-spells-sync'));
}

/** Persist hex stance + Soulbis orbit slots and sync training hex snapshot (H modal or /spells / /orbs). */
export function applyOrbStanceLoadout(lines: HexagramSnapshot['lines'], swordsman: OrbLoadoutSlot[]): void {
  const { kingWenNumber, name: stanceName } = resolveHexagram(lines);
  updateHexagramSnapshot(lines, kingWenNumber, stanceName);
  const lo = getOrbLoadout();
  saveOrbLoadout({
    ...lo,
    stanceHexLines: [...lines],
    swordsman: swordsman.slice(0, ORB_LOADOUT_SLOT_COUNT),
  });
}

/** Loadout chips for wandering dual orbs only (max six per orbiter). */
export function buildMergedOrbitingChips(): OrbitingSyncSpell[] {
  const loadout = getOrbLoadout();
  const swordsmanChips: OrbitingSyncSpell[] = [];
  const mageChips: OrbitingSyncSpell[] = [];

  // Swordsman chips: 6 fixed positions, emoji changes based on stance
  // YIN (0) = "open" → show blade's facet emoji
  // YANG (1) = "guarded" → show 🛡️ shield (protected)
  for (let i = 0; i < 6; i++) {
    const slot = loadout.swordsman[i];
    const bladeEmoji = (slot?.emoji ?? '').trim();
    const line = loadout.stanceHexLines[i] ?? 0;
    const isOpen = line === 0; // YIN = open

    swordsmanChips.push({
      id: `loadout-s-${i}`,
      emoji: isOpen && bladeEmoji ? bladeEmoji : '🛡️',
      orbiter: 'swordsman',
      stanceLine: line as 0 | 1,
    });
  }

  loadout.mage.forEach((slot, i) => {
    if (slot.spellId && slot.emoji) {
      mageChips.push({
        id: `loadout-m-${i}`,
        emoji: slot.emoji,
        orbiter: 'mage',
      });
    }
  });

  return [
    ...swordsmanChips.slice(0, ORB_LOADOUT_SLOT_COUNT),
    ...mageChips.slice(0, ORB_LOADOUT_SLOT_COUNT),
  ];
}

/** Spells and acts from the user’s /spells graph (selected grimoire cards). */
export function getSpellGraphSpellChoicesForOrb(): OrbSpellOption[] {
  if (typeof window === 'undefined') return [];
  const { spellIds } = getSpellbookFromStorage();
  const cards = getBakedSpellCards().filter((c) => spellIds.includes(c.id));
  return cards.map((c) => {
    const fromSpell = uniqEmojisFromSpellString(c.spell);
    return {
      id: `${SPELLBOOK_ORB_PREFIX}${c.id}`,
      emoji: fromSpell[0] ?? '📜',
      content: c.title,
    };
  });
}

/** Swordsman stance slots: persona spell graph first, then training pool (gated). */
export function getSwordsmanOrbSpellOptions(): OrbSpellOption[] {
  const graph = getSpellGraphSpellChoicesForOrb();
  const training = getSpellsForSwordsmanStanceEditor();
  const seen = new Set<string>();
  const out: OrbSpellOption[] = [];
  for (const g of graph) {
    if (seen.has(g.id)) continue;
    seen.add(g.id);
    out.push(g);
  }
  for (const s of training) {
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    out.push({ id: s.id, emoji: s.emoji ?? '✨', content: s.content });
  }
  return out;
}

/** Mage ring: same merge — graph spells are your persona; then full training repertoire. */
export function getMageOrbSpellOptions(): OrbSpellOption[] {
  const graph = getSpellGraphSpellChoicesForOrb();
  const training = getAvailableSpells().filter((s) => s.id !== 'emoji_dragon' || isDragonUnlocked());
  const seen = new Set<string>();
  const out: OrbSpellOption[] = [];
  for (const g of graph) {
    if (seen.has(g.id)) continue;
    seen.add(g.id);
    out.push(g);
  }
  for (const s of training) {
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    out.push({ id: s.id, emoji: s.emoji ?? '✨', content: s.content });
  }
  return out;
}

/** Ceremony step emojis (up to six) for default Soulbis orbit chips. */
export function getCeremonyConstellationEmojis(): string[] {
  if (typeof window === 'undefined') return [];
  const c = getCeremonyConstellation();
  const card = getAgentCard();
  const path = c?.constellationPath ?? card?.constellationPath;
  if (!path || typeof path !== 'string') return [];
  return path
    .split('→')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, ORB_LOADOUT_SLOT_COUNT);
}

/** Apply constellation path emojis to S1–S6 orbit slots (keeps spell picks; updates emoji only). */
export function applyCeremonyEmojisToSwordsmanSlots(): void {
  const emojis = getCeremonyConstellationEmojis();
  if (emojis.length === 0) return;
  const lo = getOrbLoadout();
  const swordsman = lo.swordsman.map((s, i) => ({
    ...s,
    emoji: emojis[i] ?? s.emoji,
  }));
  saveOrbLoadout({ ...lo, swordsman });
}

/** Spells the user can assign to mage slots — graph + training (use getMageOrbSpellOptions). */
export function getOrbLoadoutSpellChoices(): OrbSpellOption[] {
  return getMageOrbSpellOptions();
}
