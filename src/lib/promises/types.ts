/**
 * Promises system types v2 — tetrahedral architecture, knowledge/sovereignty actions.
 *
 * Four Forces: protect (⚔️), project (🧙), reflect (🪞), connect (🤝).
 * Knowledge Actions: study, inscribe, share, contribute.
 * Sovereignty Actions: affirm, practice.
 */

/** Tetrahedral force / agent role. */
export type PromiseForce = 'protect' | 'project' | 'reflect' | 'connect';

/** Knowledge actions (study, inscribe, share, contribute) + sovereignty (affirm, practice). */
export type PromiseType =
  | 'study'
  | 'inscribe'
  | 'share'
  | 'contribute'
  | 'affirm'
  | 'practice'
  | 'custom';

export type PromiseStatus = 'active' | 'in_progress' | 'completed' | 'withdrawn';

export const DEFAULT_SPELL = '(⚔️⊥⿻⊥🧙)🙂';
export const DEFAULT_CONSTELLATION = '⚔️→⿻→🧙→🙂';

/** Emoji path derived from spell (e.g. ⚔️→⿻→🧙→🙂). */
export function spellToConstellation(spell: string): string {
  const emoji = spell.replace(/[^\p{Emoji}\u{200D}\u{FE0F}\u{2EFB}]/gu, ' ').trim().split(/\s+/).filter(Boolean);
  return emoji.length > 0 ? emoji.join('→') : DEFAULT_CONSTELLATION;
}

export interface PromiseEntry {
  id: string;
  type: PromiseType;
  description: string;
  status: PromiseStatus;
  /** User's contextual compression. */
  proverb?: string;
  /** Sovereignty lattice notation. Default: (⚔️⊥⿻⊥🧙)🙂 */
  spell?: string;
  /** Emoji path derived from spell (e.g. ⚔️→⿻→🧙→🙂). */
  constellation?: string;
  /** Categorization e.g. #gap, #vrc, #swordsman. */
  tags?: string[];
  /** Tetrahedral force when applicable. */
  force?: PromiseForce;
  grimoire?: string;
  actNumber?: number;
  /** Legacy: same as proverb for display. */
  connectedProverb?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

/** Force symbol for UI. */
export const FORCE_SYMBOLS: Record<PromiseForce, string> = {
  protect: '⚔️',
  project: '🧙',
  reflect: '🪞',
  connect: '🤝',
};

/** Force label for UI. */
export const FORCE_LABELS: Record<PromiseForce, string> = {
  protect: 'Swordsman',
  project: 'Mage',
  reflect: 'Witness',
  connect: 'Bridge',
};
