/**
 * Comprehensive Soul Stats
 *
 * Tracks all inputs into the .soul export:
 * - Spells cast, proverbs, promises, evokes, inscriptions
 * - Spellbook progress (story, zero, canon, society, plurality)
 * - Persona, skills, connections
 * - Blades witnessed and assigned
 * - Convergence progress
 */

import { getRepertoire, getTrainingStats, TRAINING_SECTIONS } from '@/lib/training-progress';
import {
  getSpellbookFromStorage,
  getInscribedProverbs,
  getCustomProverbs,
  getConstellationWeb,
  getPathwayNodeIds,
} from '@/lib/spellbook-storage';
import { getBladeInventory, getStanceBladeLoadout, getAssignedBladeCount } from '@/lib/spellweb-blade-bridge';
import { getOrbLoadout } from '@/lib/orb-loadout';
import { getAgentCard, hasCompletedCeremony, getCeremonyConstellation } from '@/lib/ceremony/storage';
import { checkConvergenceReady, getConvergenceProgress } from '@/lib/soul-convergence';

// ============================================
// TYPES
// ============================================

export interface SoulStats {
  // Training basics
  sectionsVisited: number;
  totalSections: number;
  spellsCast: number;
  convergences: number;
  hexagramCasts: number;
  drakeUnlocked: boolean;
  pathUnlocked: boolean;

  // Spellbook progress
  spellbooks: {
    story: { acts: number; total: number };
    zero: { tales: number; total: number };
    canon: { chapters: number; total: number };
    society: { chapters: number; total: number };
    plurality: { acts: number; total: number };
  };
  totalSpellbookNodes: number;
  totalSpellbookNodesComplete: number;

  // Inscriptions & proverbs
  inscribedProverbs: number;
  customProverbs: number;
  totalProverbs: number;

  // Skills & persona
  skillsSelected: number;
  personaCreated: boolean;
  personaName: string | null;
  ceremonyCompleted: boolean;

  // Constellation web
  webConnections: number;
  webReflections: number;

  // Blade inventory
  bladesWitnessed: number;
  bladesAssigned: number;
  bladeRingComplete: boolean;

  // Spell orbit
  spellsInOrbit: number;
  spellOrbitComplete: boolean;

  // Convergence
  convergenceReady: string | null;
  convergenceProgress: {
    blades: { current: number; required: number; complete: boolean };
    spells: { current: number; required: number; complete: boolean };
    experience: { percent: number; complete: boolean };
  };

  // Overall
  overallProgress: number; // 0-100
  soulReady: boolean;
}

// ============================================
// STAT COLLECTION
// ============================================

/**
 * Collect all soul stats for display
 */
export function getSoulStats(): SoulStats {
  const repertoire = getRepertoire();
  const trainingStats = getTrainingStats();
  const spellbook = getSpellbookFromStorage();
  const inscribed = getInscribedProverbs();
  const customProverbsText = getCustomProverbs();
  const web = getConstellationWeb();
  const inventory = getBladeInventory();
  const bladeLoadout = getStanceBladeLoadout();
  const orbLoadout = getOrbLoadout();
  const agentCard = getAgentCard();
  const convergenceProgress = getConvergenceProgress();

  // Spellbook progress
  const storyActs = getPathwayNodeIds(spellbook.spellIds, 'story');
  const zeroTales = getPathwayNodeIds(spellbook.spellIds, 'zero');
  const canonChapters = getPathwayNodeIds(spellbook.spellIds, 'canon');
  const societyChapters = getPathwayNodeIds(spellbook.spellIds, 'society');
  const pluralityActs = getPathwayNodeIds(spellbook.spellIds, 'plurality');

  const spellbooks = {
    story: { acts: storyActs.length, total: 30 },
    zero: { tales: zeroTales.length, total: 30 },
    canon: { chapters: canonChapters.length, total: 13 },
    society: { chapters: societyChapters.length, total: 19 },
    plurality: { acts: pluralityActs.length, total: 30 },
  };

  const totalSpellbookNodes =
    spellbooks.story.total +
    spellbooks.zero.total +
    spellbooks.canon.total +
    spellbooks.society.total +
    spellbooks.plurality.total;

  const totalSpellbookNodesComplete =
    spellbooks.story.acts +
    spellbooks.zero.tales +
    spellbooks.canon.chapters +
    spellbooks.society.chapters +
    spellbooks.plurality.acts;

  // Proverbs
  const inscribedCount = Object.keys(inscribed).length;
  const customCount = customProverbsText.trim().split('\n').filter((l) => l.trim()).length;

  // Blades
  const assignedBlades = getAssignedBladeCount();
  const bladeRingComplete = !!(
    bladeLoadout.L1 &&
    bladeLoadout.L2 &&
    bladeLoadout.L3 &&
    bladeLoadout.L4 &&
    bladeLoadout.L5 &&
    bladeLoadout.L6 &&
    bladeLoadout.swap
  );

  // Spell orbit
  const spellsInOrbit = orbLoadout.mage.filter((s) => s.spellId).length;
  const spellOrbitComplete = spellsInOrbit >= 6 && spellbook.spellIds.length >= 2;

  // Calculate overall progress (weighted)
  const weights = {
    sections: 10,
    spellsCast: 10,
    convergences: 10,
    spellbookProgress: 20,
    proverbs: 10,
    skills: 10,
    persona: 5,
    web: 5,
    blades: 10,
    spellOrbit: 10,
  };

  const sectionScore = Math.min(1, trainingStats.sectionsVisited / 5) * weights.sections;
  const spellScore = Math.min(1, trainingStats.spellsCast / 10) * weights.spellsCast;
  const convergenceScore = Math.min(1, trainingStats.convergences / 3) * weights.convergences;
  const spellbookScore = Math.min(1, totalSpellbookNodesComplete / 20) * weights.spellbookProgress;
  const proverbScore = Math.min(1, (inscribedCount + customCount) / 10) * weights.proverbs;
  const skillScore = Math.min(1, spellbook.skillIds.length / 10) * weights.skills;
  const personaScore = hasCompletedCeremony() ? weights.persona : 0;
  const webScore = Math.min(1, (web.links.length + Object.keys(web.reflections).length) / 10) * weights.web;
  const bladeScore = Math.min(1, inventory.length / 7) * weights.blades;
  const orbitScore = Math.min(1, spellsInOrbit / 6) * weights.spellOrbit;

  const overallProgress = Math.round(
    sectionScore +
    spellScore +
    convergenceScore +
    spellbookScore +
    proverbScore +
    skillScore +
    personaScore +
    webScore +
    bladeScore +
    orbitScore
  );

  return {
    // Training basics
    sectionsVisited: trainingStats.sectionsVisited,
    totalSections: trainingStats.totalSections,
    spellsCast: trainingStats.spellsCast,
    convergences: trainingStats.convergences,
    hexagramCasts: trainingStats.hexagramCasts,
    drakeUnlocked: trainingStats.drakeUnlocked,
    pathUnlocked: trainingStats.pathUnlocked,

    // Spellbooks
    spellbooks,
    totalSpellbookNodes,
    totalSpellbookNodesComplete,

    // Inscriptions & proverbs
    inscribedProverbs: inscribedCount,
    customProverbs: customCount,
    totalProverbs: inscribedCount + customCount,

    // Skills & persona
    skillsSelected: spellbook.skillIds.length,
    personaCreated: !!agentCard,
    personaName: agentCard?.name || null,
    ceremonyCompleted: hasCompletedCeremony(),

    // Constellation web
    webConnections: web.links.length,
    webReflections: Object.keys(web.reflections).length,

    // Blade inventory
    bladesWitnessed: inventory.length,
    bladesAssigned: assignedBlades,
    bladeRingComplete,

    // Spell orbit
    spellsInOrbit,
    spellOrbitComplete,

    // Convergence
    convergenceReady: checkConvergenceReady(),
    convergenceProgress: {
      blades: {
        current: convergenceProgress.bladesCount,
        required: convergenceProgress.bladesRequired,
        complete: convergenceProgress.bladesComplete,
      },
      spells: {
        current: convergenceProgress.spellsCount,
        required: convergenceProgress.spellsRequired,
        complete: convergenceProgress.spellsComplete,
      },
      experience: {
        percent: convergenceProgress.experiencePercent,
        complete: convergenceProgress.experienceComplete,
      },
    },

    // Overall
    overallProgress,
    soulReady: !!checkConvergenceReady(),
  };
}

/**
 * Get a compact summary string for the training display
 */
export function getSoulStatsSummary(): {
  primary: string;
  secondary: string;
  progress: number;
  ready: boolean;
} {
  const stats = getSoulStats();

  const primaryParts: string[] = [];
  primaryParts.push(`${stats.spellsCast} cast`);
  primaryParts.push(`${stats.totalProverbs} proverbs`);
  primaryParts.push(`${stats.bladesWitnessed} blades`);

  const secondaryParts: string[] = [];
  secondaryParts.push(`${stats.totalSpellbookNodesComplete}/${stats.totalSpellbookNodes} spellbook`);
  if (stats.skillsSelected > 0) secondaryParts.push(`${stats.skillsSelected} skills`);
  if (stats.webConnections > 0) secondaryParts.push(`${stats.webConnections} links`);

  return {
    primary: primaryParts.join(' · '),
    secondary: secondaryParts.join(' · '),
    progress: stats.overallProgress,
    ready: stats.soulReady,
  };
}
