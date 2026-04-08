/**
 * Soul Convergence Ceremony System
 *
 * Tracks progress toward convergence per CHRONICLE_CONTROL_SCHEME_MATHEMATICS.md:
 *
 * SWORDSMAN (Master) — 7 SWORDS (6 active + 1 reserve)
 *   Right click, right brain, deliberate stances
 *   7 = chakras, days of creation, musical notes, 7th capital
 *
 * MAGE (Emissary) — 8 SPELLS (6 orbit + 2 reserve)
 *   Left click, left brain, reactive casting
 *   8 = octave, I Ching trigrams, bits in byte
 *
 * Ratio 8:7 creates asymmetric harmony.
 * Convergence = 7 blades + 8 spells + experience bar
 *
 * @see docs/concept-convergence-ceremony.md
 * @see CHRONICLE_CONTROL_SCHEME_MATHEMATICS.md
 */

import {
  getBladeInventory,
  getStanceBladeLoadout,
  isStanceLoadoutComplete,
  getAssignedBladeCount,
  type InventoryBlade,
  type StanceBladeLoadout,
} from '@/lib/spellweb-blade-bridge';
import {
  getOrbLoadout,
  ORB_LOADOUT_SLOT_COUNT,
  type OrbLoadout,
  type OrbLoadoutSlot,
} from '@/lib/orb-loadout';
import {
  getRepertoire,
  getTrainingStats,
  type SpellRepertoire,
  type TrainingProgress,
  type HexagramSnapshot,
  type ConstellationSnapshot,
} from '@/lib/training-progress';
import { getAgentCard, getCeremonyConstellation, hasCompletedCeremony } from '@/lib/ceremony/storage';
import { getSpellbookFromStorage } from '@/lib/spellbook-storage';

// ============================================
// TYPES
// ============================================

export type ConvergenceType = 'true' | 'swordsman' | 'mage' | 'experience';

export type ConvergenceTier = {
  type: ConvergenceType;
  label: string;
  requiredObservation: number; // seconds
  description: string;
};

export const CONVERGENCE_TIERS: Record<ConvergenceType, ConvergenceTier> = {
  swordsman: {
    type: 'swordsman',
    label: 'Swordsman Convergence',
    requiredObservation: 30,
    description: '7 blades complete',
  },
  mage: {
    type: 'mage',
    label: 'Mage Convergence',
    requiredObservation: 30,
    description: '7 spells complete',
  },
  experience: {
    type: 'experience',
    label: 'Experience Convergence',
    requiredObservation: 45,
    description: 'Progress bar 100%',
  },
  true: {
    type: 'true',
    label: 'True Convergence',
    requiredObservation: 60,
    description: 'Blades + Spells + Experience complete',
  },
};

export type CeremonyPhase =
  | 'idle'
  | 'initiation'
  | 'activation'
  | 'observation'
  | 'convergence'
  | 'crystallization'
  | 'complete';

export type CeremonyState = {
  phase: CeremonyPhase;
  convergenceType: ConvergenceType | null;
  startedAt: number | null;
  elapsed: number;
  required: number;
  interrupted: boolean;
};

export type SoulIdentity = {
  personaName: string;
  personaEmoji: string;
  createdAt: string;
};

export type SoulSwordsman = {
  bladeRing: {
    L1: SoulBlade | null;
    L2: SoulBlade | null;
    L3: SoulBlade | null;
    L4: SoulBlade | null;
    L5: SoulBlade | null;
    L6: SoulBlade | null;
    swap: SoulBlade | null;
  };
  combinedHex: string;
  stancesPlaced: number;
  hexagramOpens: number;
};

export type SoulBlade = {
  bladeId: string;
  name: string;
  emoji: string;
  hex: string;
  tier: 'light' | 'heavy' | 'dragon';
};

export type SoulMage = {
  spellOrbit: SoulSpell[]; // 6 active orbit spells
  spellReserve: SoulSpell[]; // 2 reserve spells
  totalSpells: number; // Should be 8
  spellsCast: number;
  constellationsFormed: number;
};

export type SoulSpell = {
  id: string;
  emoji: string;
  content: string;
};

export type SoulTraining = {
  sectionsVisited: string[];
  convergencesWitnessed: number;
  inscribedActs: number;
  drakeUnlocked: boolean;
  pathUnlocked: boolean;
  experienceProgress: number;
};

export type SoulConstellation = {
  nodes: SoulConstellationNode[];
  edges: { from: number; to: number }[];
  pattern: 'hexagonal' | 'spiral' | 'tree' | 'custom';
};

export type SoulConstellationNode = {
  emoji: string;
  x: number;
  y: number;
  source: string; // e.g., 'blade-L1', 'spell-1'
};

export type SoulProof = {
  ceremonyHash: string;
  witnessedAt: string;
  observationDuration: number;
  signature: string;
};

export type SoulFile = {
  version: '1.0';
  type: 'soul';
  convergenceType: ConvergenceType;
  timestamp: string;
  identity: SoulIdentity;
  swordsman: SoulSwordsman;
  mage: SoulMage;
  training: SoulTraining;
  constellation: SoulConstellation;
  proof: SoulProof;
  portability: {
    canImportTo: string[];
    expiresAt: null;
    transferable: boolean;
  };
};

// ============================================
// STORAGE
// ============================================

const CONVERGENCE_STATE_KEY = 'agentprivacy_convergence_state';
const SOUL_EXPORT_HISTORY_KEY = 'agentprivacy_soul_exports';

export function getConvergenceState(): CeremonyState {
  if (typeof window === 'undefined') {
    return getDefaultCeremonyState();
  }
  try {
    const raw = localStorage.getItem(CONVERGENCE_STATE_KEY);
    if (!raw) return getDefaultCeremonyState();
    return JSON.parse(raw) as CeremonyState;
  } catch {
    return getDefaultCeremonyState();
  }
}

export function saveConvergenceState(state: CeremonyState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONVERGENCE_STATE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('agentprivacy:convergence-state-changed'));
  } catch {
    /* ignore */
  }
}

function getDefaultCeremonyState(): CeremonyState {
  return {
    phase: 'idle',
    convergenceType: null,
    startedAt: null,
    elapsed: 0,
    required: 0,
    interrupted: false,
  };
}

// ============================================
// CONVERGENCE CHECK
// ============================================

/**
 * Check if convergence is ready and return the type.
 * Priority: true > swordsman > mage > experience
 */
export function checkConvergenceReady(): ConvergenceType | null {
  const bladesComplete = checkBladesComplete();
  const spellsComplete = checkSpellsComplete();
  const barComplete = checkExperienceComplete();

  if (bladesComplete && spellsComplete && barComplete) return 'true';
  if (bladesComplete && spellsComplete) return 'true'; // blades + spells = true even without bar
  if (bladesComplete) return 'swordsman';
  if (spellsComplete) return 'mage';
  if (barComplete) return 'experience';

  return null;
}

/**
 * Check if all 7 blade slots are filled (L1-L6 equipped + swap ready)
 * 7 total blades, 6 can be equipped at a time
 */
export function checkBladesComplete(): boolean {
  const loadout = getStanceBladeLoadout();
  const inventory = getBladeInventory();

  // Need 7 blades in inventory total
  if (inventory.length < 7) return false;

  // Need all 6 lines + swap filled (7 total assigned)
  const linesFilled = !!(
    loadout.L1 &&
    loadout.L2 &&
    loadout.L3 &&
    loadout.L4 &&
    loadout.L5 &&
    loadout.L6
  );
  const swapFilled = !!loadout.swap;

  return linesFilled && swapFilled;
}

/**
 * Check if all 8 spell slots are filled (6 mage orbit equipped + 2 from grimoire/training)
 * 8 total spells, 6 can be equipped in orbit at a time
 */
export function checkSpellsComplete(): boolean {
  const loadout = getOrbLoadout();
  const filledSlots = loadout.mage.filter(
    (slot) => slot.spellId && slot.spellId.length > 0
  ).length;

  // For 8 spells: 6 orbit slots filled + at least 2 grimoire/training spells
  const spellbook = getSpellbookFromStorage();
  const grimoireCount = spellbook.spellIds.length;
  const repertoire = getRepertoire();
  const learnedCount = repertoire.learnedSpells.length;

  // Total unique spells = orbit slots + grimoire + learned (deduplicated roughly by count)
  const totalSpells = filledSlots + Math.max(0, grimoireCount - filledSlots) + Math.max(0, learnedCount - filledSlots);

  // Need 6 slots filled and enough total spells to reach 8
  return filledSlots >= 6 && (grimoireCount + learnedCount) >= 2;
}

/**
 * Check if experience bar is at 100%
 */
export function checkExperienceComplete(): boolean {
  const stats = getTrainingStats();
  return stats.progress >= 100;
}

/**
 * Get detailed convergence progress
 */
export function getConvergenceProgress(): {
  bladesCount: number;
  bladesRequired: number;
  bladesEquipped: number;
  bladesComplete: boolean;
  spellsCount: number;
  spellsRequired: number;
  spellsEquipped: number;
  spellsComplete: boolean;
  experiencePercent: number;
  experienceComplete: boolean;
  convergenceReady: ConvergenceType | null;
} {
  const inventory = getBladeInventory();
  const assignedBlades = getAssignedBladeCount();
  const loadout = getOrbLoadout();
  const filledSpells = loadout.mage.filter((s) => s.spellId).length;
  const spellbook = getSpellbookFromStorage();
  const grimoireCount = spellbook.spellIds.length;
  const repertoire = getRepertoire();
  const learnedCount = repertoire.learnedSpells.length;
  const stats = getTrainingStats();

  // Total spells = grimoire spells + learned spells (may overlap with equipped)
  const totalSpells = grimoireCount + learnedCount;

  return {
    bladesCount: inventory.length,
    bladesRequired: 7,
    bladesEquipped: assignedBlades,
    bladesComplete: checkBladesComplete(),
    spellsCount: totalSpells,
    spellsRequired: 8,
    spellsEquipped: filledSpells,
    spellsComplete: checkSpellsComplete(),
    experiencePercent: stats.progress,
    experienceComplete: stats.progress >= 100,
    convergenceReady: checkConvergenceReady(),
  };
}

// ============================================
// CEREMONY CONTROL
// ============================================

/**
 * Start the convergence ceremony
 */
export function startCeremony(): CeremonyState | null {
  const convergenceType = checkConvergenceReady();
  if (!convergenceType) return null;

  const tier = CONVERGENCE_TIERS[convergenceType];
  const state: CeremonyState = {
    phase: 'initiation',
    convergenceType,
    startedAt: Date.now(),
    elapsed: 0,
    required: tier.requiredObservation,
    interrupted: false,
  };

  saveConvergenceState(state);
  return state;
}

/**
 * Advance ceremony phase
 */
export function advanceCeremonyPhase(state: CeremonyState): CeremonyState {
  const phases: CeremonyPhase[] = [
    'initiation',
    'activation',
    'observation',
    'convergence',
    'crystallization',
    'complete',
  ];
  const currentIndex = phases.indexOf(state.phase);
  if (currentIndex < 0 || currentIndex >= phases.length - 1) return state;

  const newState: CeremonyState = {
    ...state,
    phase: phases[currentIndex + 1],
  };
  saveConvergenceState(newState);
  return newState;
}

/**
 * Update ceremony elapsed time
 */
export function updateCeremonyElapsed(elapsed: number): void {
  const state = getConvergenceState();
  if (state.phase === 'idle' || state.phase === 'complete') return;

  const newState: CeremonyState = {
    ...state,
    elapsed,
  };
  saveConvergenceState(newState);
}

/**
 * Interrupt the ceremony (user clicked away, etc.)
 */
export function interruptCeremony(): void {
  const state = getConvergenceState();
  if (state.phase === 'idle' || state.phase === 'complete') return;

  saveConvergenceState({
    ...state,
    interrupted: true,
    phase: 'idle',
  });
}

/**
 * Reset ceremony to idle
 */
export function resetCeremony(): void {
  saveConvergenceState(getDefaultCeremonyState());
}

// ============================================
// SOUL FILE GENERATION
// ============================================

/**
 * Generate a unique soul signature
 */
function generateSoulSignature(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let hash = '';
  for (let i = 0; i < 6; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  const checksum = chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
  return `SOUL-${hash}-${checksum}`;
}

/**
 * Generate ceremony hash from state
 */
function generateCeremonyHash(
  convergenceType: ConvergenceType,
  timestamp: string,
  observationDuration: number
): string {
  const data = `${convergenceType}-${timestamp}-${observationDuration}`;
  // Simple hash for now (in production, use crypto.subtle)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Build blade data for soul file
 */
function buildSoulBlade(blade: InventoryBlade | null): SoulBlade | null {
  if (!blade) return null;
  return {
    bladeId: blade.id,
    name: blade.name,
    emoji: blade.primaryEmoji,
    hex: blade.bladeHex,
    tier: blade.tier,
  };
}

/**
 * Build constellation from blades + spells
 */
function buildSoulConstellation(
  bladeLoadout: StanceBladeLoadout,
  mageSlots: OrbLoadoutSlot[],
  inventory: InventoryBlade[]
): SoulConstellation {
  const nodes: SoulConstellationNode[] = [];
  const edges: { from: number; to: number }[] = [];

  // Add blade facets (positions on a hex pattern)
  const lines = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'] as const;
  lines.forEach((line, i) => {
    const bladeId = bladeLoadout[line];
    const blade = bladeId ? inventory.find((b) => b.id === bladeId) : null;
    if (blade) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const radius = 0.35;
      nodes.push({
        emoji: blade.primaryEmoji,
        x: 0.5 + Math.cos(angle) * radius,
        y: 0.5 + Math.sin(angle) * radius,
        source: `blade-${line}`,
      });
    }
  });

  // Add mage spells (inner ring)
  mageSlots.forEach((slot, i) => {
    if (slot.emoji) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2 + Math.PI / 6; // Offset from blades
      const radius = 0.2;
      nodes.push({
        emoji: slot.emoji,
        x: 0.5 + Math.cos(angle) * radius,
        y: 0.5 + Math.sin(angle) * radius,
        source: `spell-${i + 1}`,
      });
    }
  });

  // Connect alternating nodes to form star pattern
  for (let i = 0; i < nodes.length; i++) {
    const next = (i + 2) % nodes.length;
    if (next !== i) {
      edges.push({ from: i, to: next });
    }
  }

  return {
    nodes,
    edges,
    pattern: nodes.length >= 12 ? 'hexagonal' : 'spiral',
  };
}

/**
 * Generate the complete .soul file
 */
export function generateSoulFile(observationDuration: number): SoulFile | null {
  const convergenceType = checkConvergenceReady();
  if (!convergenceType) return null;

  const timestamp = new Date().toISOString();
  const repertoire = getRepertoire();
  const stats = getTrainingStats();
  const bladeLoadout = getStanceBladeLoadout();
  const inventory = getBladeInventory();
  const orbLoadout = getOrbLoadout();
  const agentCard = getAgentCard();
  const spellbook = getSpellbookFromStorage();

  // Identity
  const identity: SoulIdentity = {
    personaName: agentCard?.name || spellbook.personaName || 'Anonymous',
    personaEmoji: agentCard?.emoji || '🙂',
    createdAt: agentCard?.createdAt || timestamp,
  };

  // Swordsman
  const swordsman: SoulSwordsman = {
    bladeRing: {
      L1: buildSoulBlade(inventory.find((b) => b.id === bladeLoadout.L1) || null),
      L2: buildSoulBlade(inventory.find((b) => b.id === bladeLoadout.L2) || null),
      L3: buildSoulBlade(inventory.find((b) => b.id === bladeLoadout.L3) || null),
      L4: buildSoulBlade(inventory.find((b) => b.id === bladeLoadout.L4) || null),
      L5: buildSoulBlade(inventory.find((b) => b.id === bladeLoadout.L5) || null),
      L6: buildSoulBlade(inventory.find((b) => b.id === bladeLoadout.L6) || null),
      swap: buildSoulBlade(inventory.find((b) => b.id === bladeLoadout.swap) || null),
    },
    combinedHex: inventory.map((b) => b.bladeHex).join(''),
    stancesPlaced: stats.hexagramCasts,
    hexagramOpens: stats.hexagramCasts,
  };

  // Mage - 8 spells (6 orbit + 2 reserve) per CHRONICLE_CONTROL_SCHEME_MATHEMATICS.md
  const orbitSpells: SoulSpell[] = orbLoadout.mage
    .filter((s) => s.spellId)
    .map((s) => ({
      id: s.spellId,
      emoji: s.emoji,
      content: s.spellId,
    }));

  // Reserve spells from grimoire/learned that aren't in orbit
  const orbitIds = new Set(orbitSpells.map((s) => s.id));
  const reserveSpells: SoulSpell[] = [];

  // Add grimoire spells not in orbit
  for (const spellId of spellbook.spellIds) {
    if (!orbitIds.has(spellId) && reserveSpells.length < 2) {
      reserveSpells.push({ id: spellId, emoji: '📜', content: spellId });
    }
  }

  // Add learned spells not in orbit if still need more
  for (const learned of repertoire.learnedSpells) {
    if (!orbitIds.has(learned.id) && reserveSpells.length < 2) {
      reserveSpells.push({ id: learned.id, emoji: learned.emoji || '✨', content: learned.content });
    }
  }

  const mage: SoulMage = {
    spellOrbit: orbitSpells, // 6 active
    spellReserve: reserveSpells, // 2 reserve
    totalSpells: orbitSpells.length + reserveSpells.length, // Should be 8
    spellsCast: stats.spellsCast,
    constellationsFormed: stats.convergences,
  };

  // Training
  const training: SoulTraining = {
    sectionsVisited: repertoire.trainingProgress.sectionsVisited,
    convergencesWitnessed: stats.convergences,
    inscribedActs: stats.inscribedActs,
    drakeUnlocked: stats.drakeUnlocked,
    pathUnlocked: stats.pathUnlocked,
    experienceProgress: stats.progress,
  };

  // Constellation
  const constellation = buildSoulConstellation(bladeLoadout, orbLoadout.mage, inventory);

  // Proof
  const proof: SoulProof = {
    ceremonyHash: generateCeremonyHash(convergenceType, timestamp, observationDuration),
    witnessedAt: timestamp,
    observationDuration,
    signature: generateSoulSignature(),
  };

  return {
    version: '1.0',
    type: 'soul',
    convergenceType,
    timestamp,
    identity,
    swordsman,
    mage,
    training,
    constellation,
    proof,
    portability: {
      canImportTo: ['agentprivacy', 'spellweb', 'extensions'],
      expiresAt: null,
      transferable: true,
    },
  };
}

/**
 * Download the soul file (JSON format - legacy)
 */
export function downloadSoulFile(soul: SoulFile): void {
  const filename = `${soul.identity.personaName.toLowerCase().replace(/\s+/g, '-')}.soul`;
  const content = JSON.stringify(soul, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Record export
  recordSoulExport(soul);
}

/**
 * Generate soul file as markdown
 */
export function generateSoulMarkdown(soul: SoulFile, name: string, ceremonyCasts: string[] = []): string {
  const tier = CONVERGENCE_TIERS[soul.convergenceType];
  const bladeRing = soul.swordsman.bladeRing;
  const blades = Object.entries(bladeRing)
    .filter(([, b]) => b !== null)
    .map(([slot, b]) => ({ slot, ...b! }));

  const lines: string[] = [];

  // Header
  lines.push(`# ${soul.identity.personaEmoji} ${name}`);
  lines.push('');
  lines.push(`**Signature:** ${soul.proof.signature}`);
  lines.push(`**Convergence:** ${tier.label}`);
  lines.push(`**Witnessed:** ${new Date(soul.timestamp).toLocaleString()}`);
  lines.push(`**Observation:** ${soul.proof.observationDuration}s`);
  lines.push('');

  // Ceremony cast trail
  if (ceremonyCasts.length > 0) {
    lines.push('## Ceremony Cast Trail');
    lines.push('');
    lines.push(ceremonyCasts.join(' → '));
    lines.push('');
  }

  // Blade Ring (Swordsman)
  lines.push('## Blade Ring (Swordsman)');
  lines.push('');
  lines.push('| Slot | Blade | Emoji | Hex | Tier |');
  lines.push('|------|-------|-------|-----|------|');
  for (const b of blades) {
    lines.push(`| ${b.slot} | ${b.name} | ${b.emoji} | ${b.hex} | ${b.tier} |`);
  }
  lines.push('');
  lines.push(`**Combined Hex:** ${soul.swordsman.combinedHex}`);
  lines.push(`**Stances Placed:** ${soul.swordsman.stancesPlaced}`);
  lines.push('');

  // Spell Orbit (Mage)
  lines.push('## Spell Orbit (Mage)');
  lines.push('');
  lines.push('### Active Orbit (6)');
  lines.push('');
  for (const spell of soul.mage.spellOrbit) {
    lines.push(`- ${spell.emoji} **${spell.id}**`);
  }
  lines.push('');
  if (soul.mage.spellReserve.length > 0) {
    lines.push('### Reserve (2)');
    lines.push('');
    for (const spell of soul.mage.spellReserve) {
      lines.push(`- ${spell.emoji} **${spell.id}**`);
    }
    lines.push('');
  }
  lines.push(`**Total Spells:** ${soul.mage.totalSpells}`);
  lines.push(`**Spells Cast:** ${soul.mage.spellsCast}`);
  lines.push(`**Constellations:** ${soul.mage.constellationsFormed}`);
  lines.push('');

  // Training
  lines.push('## Training Progress');
  lines.push('');
  lines.push(`- **Experience:** ${soul.training.experienceProgress}%`);
  lines.push(`- **Sections Visited:** ${soul.training.sectionsVisited.length}`);
  lines.push(`- **Convergences Witnessed:** ${soul.training.convergencesWitnessed}`);
  lines.push(`- **Inscribed Acts:** ${soul.training.inscribedActs}`);
  lines.push(`- **Drake Unlocked:** ${soul.training.drakeUnlocked ? 'Yes' : 'No'}`);
  lines.push(`- **Path Unlocked:** ${soul.training.pathUnlocked ? 'Yes' : 'No'}`);
  lines.push('');

  // Constellation
  lines.push('## Constellation');
  lines.push('');
  lines.push(`**Pattern:** ${soul.constellation.pattern}`);
  lines.push(`**Nodes:** ${soul.constellation.nodes.length}`);
  lines.push('');
  lines.push('```');
  lines.push(soul.constellation.nodes.map(n => n.emoji).join(' '));
  lines.push('```');
  lines.push('');

  // Identity
  lines.push('## Identity');
  lines.push('');
  lines.push(`- **Persona:** ${soul.identity.personaEmoji} ${soul.identity.personaName}`);
  lines.push(`- **Created:** ${soul.identity.createdAt}`);
  lines.push('');

  // Proof
  lines.push('## Proof');
  lines.push('');
  lines.push('```');
  lines.push(`Signature: ${soul.proof.signature}`);
  lines.push(`Hash: ${soul.proof.ceremonyHash}`);
  lines.push(`Witnessed: ${soul.proof.witnessedAt}`);
  lines.push(`Duration: ${soul.proof.observationDuration}s`);
  lines.push('```');
  lines.push('');

  // Footer
  lines.push('---');
  lines.push('');
  lines.push('*Forged in the 64-Tetrahedra Lattice*');
  lines.push('*(⚔️⊥⿻⊥🧙)🙂*');
  lines.push('');

  return lines.join('\n');
}

/**
 * Download soul file as markdown
 */
export function downloadSoulMarkdown(soul: SoulFile, name: string, ceremonyCasts: string[] = []): void {
  const filename = `${name.toLowerCase().replace(/\s+/g, '-')}.soul.md`;
  const content = generateSoulMarkdown(soul, name, ceremonyCasts);
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Record export
  recordSoulExport(soul);
}

/**
 * Record soul export in history
 */
function recordSoulExport(soul: SoulFile): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(SOUL_EXPORT_HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];
    history.push({
      signature: soul.proof.signature,
      timestamp: soul.timestamp,
      convergenceType: soul.convergenceType,
    });
    localStorage.setItem(SOUL_EXPORT_HISTORY_KEY, JSON.stringify(history.slice(-10)));
  } catch {
    /* ignore */
  }
}

/**
 * Get soul export history
 */
export function getSoulExportHistory(): { signature: string; timestamp: string; convergenceType: ConvergenceType }[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SOUL_EXPORT_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
