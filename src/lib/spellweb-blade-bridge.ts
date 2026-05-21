/**
 * Bridge forged / witness blades from spellweb.ai into Soulbis hex stance facet emojis.
 * @see docs/SPELLWEB_AGENTPRIVACY_BLADE_BRIDGE.md
 */

import {
  SPELLWEB_BLADE_META_KEY,
  SPELLWEB_BLADE_INVENTORY_KEY,
  SPELLWEB_EQUIPPED_BLADE_KEY,
  SPELLWEB_STANCE_LOADOUT_KEY,
} from '@/lib/spellweb-blade-keys';
import { ORB_LOADOUT_SLOT_COUNT, getOrbLoadout, saveOrbLoadout, type OrbLoadoutSlot } from '@/lib/orb-loadout';

export { SPELLWEB_BLADE_META_KEY, SPELLWEB_BLADE_INVENTORY_KEY, SPELLWEB_EQUIPPED_BLADE_KEY, SPELLWEB_STANCE_LOADOUT_KEY };

export type SpellwebBladeImportPayloadV1 = {
  v: 1;
  bladeId: string;
  name: string;
  /** Blade identity emoji (display only; not repeated in ring unless also in marks) */
  primaryEmoji: string;
  /** Up to six — order matches constellation marks along the forged path */
  markEmojis: string[];
  proofSignature?: string;
  isWitness?: boolean;
  swordsmanId?: string;
  runecrafted?: boolean;
  swordsmanSignature?: string;
};

export type SpellwebBladeMeta = {
  bladeId: string;
  name: string;
  primaryEmoji: string;
  proofSignature?: string;
  isWitness?: boolean;
  importedAt: string;
  swordsmanId?: string;
  runecrafted?: boolean;
  swordsmanSignature?: string;
};

/** A blade facet - one of 6 spell slots unlocked by a blade */
export type BladeFacet = {
  emoji: string;
  label: string; // e.g., "Genesis Ceremony"
  lineIndex: number; // 0-5 (L1-L6)
};

/** Full blade in inventory with its 6 facets */
export type InventoryBlade = {
  id: string;
  name: string;
  primaryEmoji: string;
  proofSignature?: string;
  isWitness?: boolean;
  bladeHex: string;
  tier: 'light' | 'heavy' | 'dragon';
  stratum: number;
  facets: BladeFacet[];
  importedAt: string;
  swordsmanId?: string;
  runecrafted?: boolean;
  swordsmanSignature?: string;
};

/** Stance loadout: 6 lines (L1-L6) + 1 swap slot = 7 blade positions */
export type StanceBladeLoadout = {
  L1: string | null;
  L2: string | null;
  L3: string | null;
  L4: string | null;
  L5: string | null;
  L6: string | null;
  swap: string | null; // 7th blade ready to rotate in
};

export const EMPTY_STANCE_LOADOUT: StanceBladeLoadout = {
  L1: null, L2: null, L3: null, L4: null, L5: null, L6: null, swap: null,
};

function isPayloadV1(x: unknown): x is SpellwebBladeImportPayloadV1 {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    o.v === 1 &&
    typeof o.bladeId === 'string' &&
    typeof o.name === 'string' &&
    typeof o.primaryEmoji === 'string' &&
    Array.isArray(o.markEmojis) &&
    o.markEmojis.every((e) => typeof e === 'string')
  );
}

/** base64url → UTF-8 JSON (handles emoji in forged blade marks). */
export function decodeSpellwebBladePayload(raw: string): SpellwebBladeImportPayloadV1 | null {
  try {
    const b64 = raw.replace(/-/g, '+').replace(/_/g, '/');
    const pad = (4 - (b64.length % 4)) % 4;
    const padded = b64 + '='.repeat(pad);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as unknown;
    return isPayloadV1(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** For spellweb.ai or tooling: build query-safe token (UTF-8 safe). */
export function encodeSpellwebBladePayloadForUrl(payload: SpellwebBladeImportPayloadV1): string {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function parseSpellwebBladeImportJson(text: string): SpellwebBladeImportPayloadV1 | null {
  try {
    const parsed = JSON.parse(text) as unknown;
    return isPayloadV1(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Parse a spellweb blade markdown file into payload format.
 * Extracts: name, emoji, signature, hex, constellation path emojis.
 */
export function parseSpellwebBladeMarkdown(md: string): SpellwebBladeImportPayloadV1 | null {
  try {
    // Extract blade name and emoji from title: "# 🐉 Universe"
    const titleMatch = md.match(/^#\s+(\S+)\s+(.+)$/m);
    if (!titleMatch) return null;
    const primaryEmoji = titleMatch[1];
    const name = titleMatch[2].trim();

    // Extract signature: "Signature: SPELL-YW5I59-1Q"
    const sigMatch = md.match(/Signature:\s*(SPELL-[\w-]+)/);
    const proofSignature = sigMatch?.[1];

    // Extract hex: "Hex: 3F"
    const hexMatch = md.match(/Hex:\s*([0-9A-Fa-f]+)/);
    const bladeHex = hexMatch?.[1] || '00';

    // Check if witness blade
    const isWitness = /## Witness Blade/i.test(md) || /Type:\s*Witness/i.test(md);

    // Extract constellation path emojis
    // Format: "1. 🔑⚔️🧙→😊 **Genesis Ceremony**"
    const pathMatches = [...md.matchAll(/^\d+\.\s+(\S+)\s+\*\*(.+?)\*\*/gm)];
    const markEmojis: string[] = [];
    for (const match of pathMatches.slice(0, 6)) {
      const emoji = match[1].trim();
      if (emoji) markEmojis.push(emoji);
    }

    // If not enough emojis from path, fill with dimension emojis based on hex
    if (markEmojis.length < 6) {
      const hexVal = parseInt(bladeHex, 16);
      const dimEmojis = ['🛡️', '🤝', '📜', '🔗', '⚡', '💎'];
      for (let i = markEmojis.length; i < 6; i++) {
        // Check if dimension is active (bit is set)
        const bitActive = (hexVal & (1 << (5 - i))) !== 0;
        markEmojis.push(bitActive ? dimEmojis[i] : '·');
      }
    }

    return {
      v: 1,
      bladeId: proofSignature || `blade-${Date.now()}`,
      name,
      primaryEmoji,
      markEmojis,
      proofSignature,
      isWitness,
    };
  } catch {
    return null;
  }
}

/**
 * Convert blade hex to stance lines (6-bit binary → [0|1, 0|1, ...])
 * Hex "3F" = binary 111111 = all yang [1,1,1,1,1,1]
 * Hex "10" = binary 010000 = [0,1,0,0,0,0]
 */
export function hexToStanceLines(hex: string): [0|1, 0|1, 0|1, 0|1, 0|1, 0|1] {
  const val = parseInt(hex, 16) || 0;
  return [
    ((val >> 5) & 1) as 0|1,
    ((val >> 4) & 1) as 0|1,
    ((val >> 3) & 1) as 0|1,
    ((val >> 2) & 1) as 0|1,
    ((val >> 1) & 1) as 0|1,
    (val & 1) as 0|1,
  ];
}

/**
 * Apply blade from markdown: sets both facet emojis AND stance lines from hex.
 */
export function applySpellwebBladeMarkdownToSwordsmanSlots(md: string): SpellwebBladeImportPayloadV1 | null {
  const payload = parseSpellwebBladeMarkdown(md);
  if (!payload) return null;

  // Extract hex for stance lines
  const hexMatch = md.match(/Hex:\s*([0-9A-Fa-f]+)/);
  const bladeHex = hexMatch?.[1] || '00';
  const stanceLines = hexToStanceLines(bladeHex);

  const lo = getOrbLoadout();
  const marks = payload.markEmojis.slice(0, ORB_LOADOUT_SLOT_COUNT);
  const swordsman: OrbLoadoutSlot[] = lo.swordsman.map((s, i) => ({
    ...s,
    emoji: marks[i] ?? s.emoji,
  }));

  // Save loadout with both emojis and stance lines from blade hex
  saveOrbLoadout({
    ...lo,
    stanceHexLines: stanceLines,
    swordsman,
  });

  const meta: SpellwebBladeMeta = {
    bladeId: payload.bladeId,
    name: payload.name,
    primaryEmoji: payload.primaryEmoji,
    proofSignature: payload.proofSignature,
    isWitness: payload.isWitness,
    importedAt: new Date().toISOString(),
    swordsmanId: payload.swordsmanId,
    runecrafted: payload.runecrafted,
    swordsmanSignature: payload.swordsmanSignature,
  };
  try {
    localStorage.setItem(SPELLWEB_BLADE_META_KEY, JSON.stringify(meta));
  } catch {
    /* ignore */
  }

  return payload;
}

/** Apply mark emojis to Soulbis slots; keeps existing spellId selections, updates emoji facets only. */
export function applySpellwebBladeToSwordsmanSlots(payload: SpellwebBladeImportPayloadV1): void {
  const lo = getOrbLoadout();
  const marks = payload.markEmojis.slice(0, ORB_LOADOUT_SLOT_COUNT);
  const swordsman: OrbLoadoutSlot[] = lo.swordsman.map((s, i) => ({
    ...s,
    emoji: marks[i] ?? s.emoji,
  }));
  saveOrbLoadout({ ...lo, swordsman });

  const meta: SpellwebBladeMeta = {
    bladeId: payload.bladeId,
    name: payload.name,
    primaryEmoji: payload.primaryEmoji,
    proofSignature: payload.proofSignature,
    isWitness: payload.isWitness,
    importedAt: new Date().toISOString(),
    swordsmanId: payload.swordsmanId,
    runecrafted: payload.runecrafted,
    swordsmanSignature: payload.swordsmanSignature,
  };
  try {
    localStorage.setItem(SPELLWEB_BLADE_META_KEY, JSON.stringify(meta));
  } catch {
    /* ignore */
  }
}

export function getSpellwebBladeMeta(): SpellwebBladeMeta | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SPELLWEB_BLADE_META_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SpellwebBladeMeta;
  } catch {
    return null;
  }
}

/**
 * If URL has ?spellwebBlade=..., decode, apply, strip query. Returns true if applied.
 */
export function consumeSpellwebBladeFromUrl(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('spellwebBlade');
  if (!raw) return false;
  const payload = decodeSpellwebBladePayload(raw);
  if (!payload) return false;
  applySpellwebBladeToSwordsmanSlots(payload);
  params.delete('spellwebBlade');
  const q = params.toString();
  const next = `${window.location.pathname}${q ? `?${q}` : ''}${window.location.hash}`;
  window.history.replaceState({}, '', next);
  return true;
}

// ═══════════════════════════════════════════════════════════════
// BLADE INVENTORY - Multiple blades, equip to unlock facets
// ═══════════════════════════════════════════════════════════════

/** Get all imported blades from inventory */
export function getBladeInventory(): InventoryBlade[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SPELLWEB_BLADE_INVENTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InventoryBlade[];
  } catch {
    return [];
  }
}

/** Save blade inventory */
function saveBladeInventory(blades: InventoryBlade[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SPELLWEB_BLADE_INVENTORY_KEY, JSON.stringify(blades));
    window.dispatchEvent(new CustomEvent('agentprivacy:blade-inventory-changed'));
  } catch {
    /* ignore */
  }
}

/** Get currently equipped blade ID */
export function getEquippedBladeId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(SPELLWEB_EQUIPPED_BLADE_KEY);
  } catch {
    return null;
  }
}

/** Get the equipped blade (full data) */
export function getEquippedBlade(): InventoryBlade | null {
  const id = getEquippedBladeId();
  if (!id) return null;
  const inventory = getBladeInventory();
  return inventory.find(b => b.id === id) || null;
}

/** Equip a blade by ID - unlocks its facets for orbit */
export function equipBlade(bladeId: string): boolean {
  if (typeof window === 'undefined') return false;
  const inventory = getBladeInventory();
  const blade = inventory.find(b => b.id === bladeId);
  if (!blade) return false;

  try {
    localStorage.setItem(SPELLWEB_EQUIPPED_BLADE_KEY, bladeId);

    // Set blade meta so swordsman orbiting chips are enabled in buildMergedOrbitingChips()
    const meta: SpellwebBladeMeta = {
      bladeId: blade.id,
      name: blade.name,
      primaryEmoji: blade.primaryEmoji,
      proofSignature: blade.proofSignature,
      isWitness: blade.isWitness,
      importedAt: blade.importedAt,
    };
    localStorage.setItem(SPELLWEB_BLADE_META_KEY, JSON.stringify(meta));

    window.dispatchEvent(new CustomEvent('agentprivacy:blade-equipped', { detail: blade }));

    // Apply equipped blade's hex to stance lines and facets to orbit
    const stanceLines = hexToStanceLines(blade.bladeHex);
    const lo = getOrbLoadout();
    const swordsman: OrbLoadoutSlot[] = lo.swordsman.map((s, i) => ({
      ...s,
      emoji: blade.facets[i]?.emoji ?? s.emoji,
    }));
    saveOrbLoadout({ ...lo, stanceHexLines: stanceLines, swordsman });

    return true;
  } catch {
    return false;
  }
}

/** Unequip current blade */
export function unequipBlade(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SPELLWEB_EQUIPPED_BLADE_KEY);
    localStorage.removeItem(SPELLWEB_BLADE_META_KEY);
    window.dispatchEvent(new CustomEvent('agentprivacy:blade-unequipped'));
    window.dispatchEvent(new CustomEvent('agentprivacy:orb-loadout-changed'));
  } catch {
    /* ignore */
  }
}

/** Parse full blade data from markdown and add to inventory */
export function parseAndAddBladeToInventory(md: string): InventoryBlade | null {
  try {
    // Extract blade name and emoji from title: "# 🐉 Universe"
    const titleMatch = md.match(/^#\s+(\S+)\s+(.+)$/m);
    if (!titleMatch) return null;
    const primaryEmoji = titleMatch[1];
    const name = titleMatch[2].trim();

    // Extract signature: "Signature: SPELL-YW5I59-1Q"
    const sigMatch = md.match(/Signature:\s*(SPELL-[\w-]+)/);
    const proofSignature = sigMatch?.[1];
    const id = proofSignature || `blade-${Date.now()}`;

    // Extract hex: "Hex: 3F"
    const hexMatch = md.match(/Hex:\s*([0-9A-Fa-f]+)/);
    const bladeHex = hexMatch?.[1] || '00';

    // Extract tier: "**Tier:** Dragon Blade"
    const tierMatch = md.match(/\*\*Tier:\*\*\s*(\w+)/i);
    const tierStr = tierMatch?.[1]?.toLowerCase() || 'light';
    const tier = (tierStr === 'dragon' ? 'dragon' : tierStr === 'heavy' ? 'heavy' : 'light') as 'light' | 'heavy' | 'dragon';

    // Extract stratum: "**Stratum:** 6/6"
    const stratumMatch = md.match(/\*\*Stratum:\*\*\s*(\d+)/);
    const stratum = parseInt(stratumMatch?.[1] || '0', 10);

    // Check if witness blade
    const isWitness = /## Witness Blade/i.test(md) || /Type:\s*Witness/i.test(md);

    // Extract constellation path as facets
    // Format: "1. 🔑⚔️🧙→😊 **Genesis Ceremony**"
    const pathMatches = [...md.matchAll(/^\d+\.\s+(\S+)\s+\*\*(.+?)\*\*/gm)];
    const facets: BladeFacet[] = [];
    for (let i = 0; i < 6; i++) {
      const match = pathMatches[i];
      if (match) {
        facets.push({
          emoji: match[1].trim(),
          label: match[2].trim(),
          lineIndex: i,
        });
      } else {
        // Fill with dimension emoji if path is short
        const hexVal = parseInt(bladeHex, 16);
        const dimEmojis = ['🛡️', '🤝', '📜', '🔗', '⚡', '💎'];
        const dimLabels = ['Protection', 'Delegation', 'Memory', 'Connection', 'Computation', 'Value'];
        const bitActive = (hexVal & (1 << (5 - i))) !== 0;
        facets.push({
          emoji: bitActive ? dimEmojis[i] : '·',
          label: dimLabels[i],
          lineIndex: i,
        });
      }
    }

    // Extract runecraft proof if present in markdown
    const swordsmanIdMatch = md.match(/\*\*Swordsman ID:\*\*\s*`([^`]+)`/);
    const swordsmanSigMatch = md.match(/\*\*Swordsman Signature:\*\*\s*`([^`]+)`/);
    const runecraftedMatch = /Dual Ed25519 signature verified/.test(md);

    const blade: InventoryBlade = {
      id,
      name,
      primaryEmoji,
      proofSignature,
      isWitness,
      bladeHex,
      tier,
      stratum,
      facets,
      importedAt: new Date().toISOString(),
      ...(runecraftedMatch && {
        swordsmanId: swordsmanIdMatch?.[1],
        runecrafted: true,
        swordsmanSignature: swordsmanSigMatch?.[1],
      }),
    };

    // Add to inventory (or update if same signature exists)
    const inventory = getBladeInventory();
    const existingIndex = inventory.findIndex(b => b.id === id);
    if (existingIndex >= 0) {
      inventory[existingIndex] = blade;
    } else {
      inventory.push(blade);
    }
    saveBladeInventory(inventory);

    return blade;
  } catch {
    return null;
  }
}

/** Remove a blade from inventory */
export function removeBladeFromInventory(bladeId: string): boolean {
  const inventory = getBladeInventory();
  const filtered = inventory.filter(b => b.id !== bladeId);
  if (filtered.length === inventory.length) return false;
  saveBladeInventory(filtered);

  // Unequip if this was the equipped blade
  if (getEquippedBladeId() === bladeId) {
    unequipBlade();
  }
  return true;
}

/** Get facet options for a stance line from equipped blade */
export function getEquippedBladeFacetForLine(lineIndex: number): BladeFacet | null {
  const blade = getEquippedBlade();
  if (!blade) return null;
  return blade.facets[lineIndex] || null;
}

/** Get all available facets from equipped blade */
export function getEquippedBladeFacets(): BladeFacet[] {
  const blade = getEquippedBlade();
  return blade?.facets || [];
}

// ═══════════════════════════════════════════════════════════════
// STANCE BLADE LOADOUT - 6 lines + 1 swap slot (7 blades total)
// ═══════════════════════════════════════════════════════════════

/** Get current stance blade loadout */
export function getStanceBladeLoadout(): StanceBladeLoadout {
  if (typeof window === 'undefined') return EMPTY_STANCE_LOADOUT;
  try {
    const raw = localStorage.getItem(SPELLWEB_STANCE_LOADOUT_KEY);
    if (!raw) return EMPTY_STANCE_LOADOUT;
    return { ...EMPTY_STANCE_LOADOUT, ...JSON.parse(raw) };
  } catch {
    return EMPTY_STANCE_LOADOUT;
  }
}

/** Save stance blade loadout */
function saveStanceBladeLoadout(loadout: StanceBladeLoadout): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SPELLWEB_STANCE_LOADOUT_KEY, JSON.stringify(loadout));
    window.dispatchEvent(new CustomEvent('agentprivacy:stance-loadout-changed'));
    // Sync facet emojis to orb loadout
    syncStanceLoadoutToOrbit();
  } catch {
    /* ignore */
  }
}

/** Assign a blade to a stance line (L1-L6 or swap) */
export function assignBladeToLine(bladeId: string, line: keyof StanceBladeLoadout): boolean {
  const inventory = getBladeInventory();
  const blade = inventory.find(b => b.id === bladeId);
  if (!blade) return false;

  const loadout = getStanceBladeLoadout();

  // Check if blade is already assigned elsewhere - remove it first
  for (const key of Object.keys(loadout) as (keyof StanceBladeLoadout)[]) {
    if (loadout[key] === bladeId) {
      loadout[key] = null;
    }
  }

  // Assign to new line
  loadout[line] = bladeId;
  saveStanceBladeLoadout(loadout);

  // NOTE: syncStanceLoadoutToOrbit (called by saveStanceBladeLoadout) already syncs
  // the blade emoji to the orb loadout, so we don't need to do it again here

  return true;
}

/** Set the emoji for a stance line (picks from assigned blade's facets) */
export function setLineEmoji(line: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6', emoji: string): void {
  const lineIndex = parseInt(line.slice(1)) - 1;
  const orbLoadout = getOrbLoadout();
  const currentSlot = orbLoadout.swordsman[lineIndex];
  orbLoadout.swordsman[lineIndex] = {
    ...currentSlot,
    emoji,
  };
  saveOrbLoadout(orbLoadout);
}

/** Remove blade from its current stance slot */
export function unassignBlade(bladeId: string): void {
  const loadout = getStanceBladeLoadout();
  for (const key of Object.keys(loadout) as (keyof StanceBladeLoadout)[]) {
    if (loadout[key] === bladeId) {
      loadout[key] = null;
      // Clear the orb loadout emoji for this line
      if (key !== 'swap') {
        const lineIndex = parseInt(key.slice(1)) - 1;
        const orbLoadout = getOrbLoadout();
        orbLoadout.swordsman[lineIndex] = { spellId: '', emoji: '' };
        saveOrbLoadout(orbLoadout);
      }
    }
  }
  saveStanceBladeLoadout(loadout);
}

/** Swap the 7th (swap) blade with a line blade */
export function swapBladeWithLine(line: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6'): void {
  const loadout = getStanceBladeLoadout();
  const lineBladeId = loadout[line];
  const swapBladeId = loadout.swap;
  loadout[line] = swapBladeId;
  loadout.swap = lineBladeId;
  saveStanceBladeLoadout(loadout);
}

/** Get blade assigned to a specific line */
export function getBladeForLine(line: keyof StanceBladeLoadout): InventoryBlade | null {
  const loadout = getStanceBladeLoadout();
  const bladeId = loadout[line];
  if (!bladeId) return null;
  const inventory = getBladeInventory();
  return inventory.find(b => b.id === bladeId) || null;
}

/** Get the facet emoji for a stance line from assigned blade */
export function getStanceLineFacetEmoji(lineIndex: number): string | null {
  const lineKey = `L${lineIndex + 1}` as keyof StanceBladeLoadout;
  const blade = getBladeForLine(lineKey);
  if (!blade) return null;
  // Always use the blade's primaryEmoji for orbit display
  // (facet emojis may be dimension defaults like 🛡️ which conflicts with our shield indicator)
  return blade.primaryEmoji;
}

/** Sync stance loadout facets to the orbit loadout (updates swordsman slots) */
export function syncStanceLoadoutToOrbit(): void {
  const lo = getOrbLoadout();
  const swordsman: OrbLoadoutSlot[] = lo.swordsman.map((s, i) => {
    const facetEmoji = getStanceLineFacetEmoji(i);
    // If a blade is assigned, ALWAYS use its facet emoji (not preserved old value)
    // If no blade, clear the emoji
    // IMPORTANT: Use empty spellId so normalizeSlot preserves the emoji as-is
    return {
      ...s,
      emoji: facetEmoji || '',
      spellId: '',
    };
  });

  // NOTE: Do NOT overwrite stanceHexLines here - stance is user-controlled via hexagram toggles
  // The blade provides the emoji; the user controls yin/yang display (open vs guarded)

  // Set blade meta from first assigned blade so swordsman chips render
  let firstBlade: InventoryBlade | null = null;
  for (let i = 0; i < 6; i++) {
    const lineKey = `L${i + 1}` as keyof StanceBladeLoadout;
    const blade = getBladeForLine(lineKey);
    if (blade) {
      firstBlade = blade;
      break;
    }
  }

  if (firstBlade) {
    const meta: SpellwebBladeMeta = {
      bladeId: firstBlade.id,
      name: firstBlade.name,
      primaryEmoji: firstBlade.primaryEmoji,
      proofSignature: firstBlade.proofSignature,
      isWitness: firstBlade.isWitness,
      importedAt: firstBlade.importedAt,
    };
    try {
      localStorage.setItem(SPELLWEB_BLADE_META_KEY, JSON.stringify(meta));
    } catch {
      /* ignore */
    }
  }

  saveOrbLoadout({ ...lo, swordsman });
}

/** Check if stance loadout is complete (all 6 lines have blades) */
export function isStanceLoadoutComplete(): boolean {
  const loadout = getStanceBladeLoadout();
  return !!(loadout.L1 && loadout.L2 && loadout.L3 && loadout.L4 && loadout.L5 && loadout.L6);
}

/** Get count of assigned blade slots */
export function getAssignedBladeCount(): number {
  const loadout = getStanceBladeLoadout();
  let count = 0;
  for (const key of ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'swap'] as const) {
    if (loadout[key]) count++;
  }
  return count;
}

/** Get which line a blade is assigned to (if any) */
export function getBladeAssignment(bladeId: string): keyof StanceBladeLoadout | null {
  const loadout = getStanceBladeLoadout();
  for (const key of Object.keys(loadout) as (keyof StanceBladeLoadout)[]) {
    if (loadout[key] === bladeId) return key;
  }
  return null;
}
