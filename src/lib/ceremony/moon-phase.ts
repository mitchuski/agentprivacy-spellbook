/**
 * Moon Phase Notation
 *
 * The moon is the whole information space — dark, total, containing everything.
 * The crescent that appears is what the Swordsman's boundary allows to be reflected.
 * The lit portion is the disclosure. The dark portion is what remains private.
 *
 * The stratum (0-6 dimensions active) determines the phase.
 *
 * @see docs/chronicles/moon-phase-notation.md
 */

export type MoonPhase = '🌑' | '🌒' | '🌓' | '🌔' | '🌖' | '🌗' | '🌕';

export interface MoonPhaseInfo {
  emoji: MoonPhase;
  name: string;
  stratum: number;
  dimensionsActive: string;
  meaning: string;
}

export const MOON_PHASES: MoonPhaseInfo[] = [
  {
    emoji: '🌑',
    name: 'New Moon',
    stratum: 0,
    dimensionsActive: 'None',
    meaning: 'Null blade — nothing reflected, total darkness',
  },
  {
    emoji: '🌒',
    name: 'Waxing Crescent',
    stratum: 1,
    dimensionsActive: '1 of 6',
    meaning: 'Minimal disclosure — one boundary set',
  },
  {
    emoji: '🌓',
    name: 'First Quarter',
    stratum: 2,
    dimensionsActive: '2 of 6',
    meaning: 'Twin-edge — the dual-agent vertex',
  },
  {
    emoji: '🌔',
    name: 'Waxing Gibbous',
    stratum: 3,
    dimensionsActive: '3 of 6',
    meaning: 'Half sovereignty — three axes active',
  },
  {
    emoji: '🌖',
    name: 'Waning Gibbous',
    stratum: 4,
    dimensionsActive: '4 of 6',
    meaning: 'Substantial disclosure — four boundaries',
  },
  {
    emoji: '🌗',
    name: 'Last Quarter',
    stratum: 5,
    dimensionsActive: '5 of 6',
    meaning: 'Near-full — one dimension held dark',
  },
  {
    emoji: '🌕',
    name: 'Full Moon',
    stratum: 6,
    dimensionsActive: 'All 6',
    meaning: 'Full sovereignty reflected — all dimensions visible',
  },
];

/**
 * Get moon phase info by stratum (0-6)
 */
export function getMoonPhase(stratum: number): MoonPhaseInfo {
  const clamped = Math.max(0, Math.min(6, Math.floor(stratum)));
  return MOON_PHASES[clamped]!;
}

/**
 * Get moon phase emoji by stratum (0-6)
 */
export function getMoonPhaseEmoji(stratum: number): MoonPhase {
  return getMoonPhase(stratum).emoji;
}

/**
 * Ceremony position: the starting state before any forging
 * 🌑 — total, dark, the whole information space
 */
export const CEREMONY_MOON = '🌑' as const;

/**
 * Map trust tier to approximate stratum
 * blade → 1, light → 2, heavy → 3, dragon → 4+
 */
export function getTierStratum(tier: string): number {
  switch (tier) {
    case 'blade':
      return 1;
    case 'light':
      return 2;
    case 'heavy':
      return 3;
    case 'dragon':
      return 5;
    default:
      return 0;
  }
}

/**
 * Get moon phase for a trust tier
 */
export function getTierMoonPhase(tier: string): MoonPhaseInfo {
  return getMoonPhase(getTierStratum(tier));
}

/**
 * Ceremony step count to moon phase progression
 * Maps 6 ceremony steps to moon phases (ceremony is a waxing cycle)
 */
export function getCeremonyStepPhase(step: number, totalSteps: number = 6): MoonPhaseInfo {
  // Step 0 = 🌑, Step 6 = 🌕
  const stratum = Math.floor((step / totalSteps) * 6);
  return getMoonPhase(stratum);
}

/**
 * Display string for moon phase with name
 */
export function formatMoonPhase(phase: MoonPhaseInfo): string {
  return `${phase.emoji} ${phase.name}`;
}

/**
 * The ceremony progression: 🌑 → forge → blade phase
 */
export function describeCeremonyProgression(finalStratum: number): string {
  const finalPhase = getMoonPhase(finalStratum);
  return `🌑 → forge → ${finalPhase.emoji}`;
}
