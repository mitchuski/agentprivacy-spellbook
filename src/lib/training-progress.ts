/**
 * Training Progress System
 *
 * Tracks user progress through the training grounds and writes
 * to localStorage in a format the browser extensions can read.
 *
 * This is the ONE-WAY sync: website -> extensions
 * Extensions read from localStorage when visiting agentprivacy.ai
 *
 * Also broadcasts events to connected extensions via postMessage
 */

import {
  broadcastSpellCast,
  broadcastOrbConvergence,
  broadcastSectionVisited,
  broadcastPathUnlocked,
  syncRepertoireToExtensions
} from './extension-bridge'
import { collectInscribedOrbitingSpells } from './learning-inscribed-sync'

// ============================================
// TYPES (mirrors pretext-agentprivacy/shared/types/repertoire.ts)
// ============================================

export interface SpellRepertoire {
  version: '1.0'
  learnedSpells: LearnedSpell[]
  castHistory: CastEvent[]
  trainingProgress: TrainingProgress
  constellationSnapshot?: ConstellationSnapshot
  hexagramSnapshot?: HexagramSnapshot
  lastUpdated: number
}

export interface LearnedSpell {
  id: string
  type: 'emoji' | 'proverb' | 'keyword' | 'hexagram'
  content: string
  emoji?: string
  myTermsMapping: string
  weight: number
  yangYin: 'yang' | 'yin'
  learnedAt: number
  learnedInSection: string
  source: 'story' | 'zk' | 'canon' | 'parallel' | 'plurality'
}

export interface CastEvent {
  spellId: string
  timestamp: number
  position: { x: number; y: number }
  section: string
}

export interface TrainingProgress {
  sectionsVisited: string[]
  orbConvergenceCount: number
  spellsCastCount: number
  drakeSpellUnlocked: boolean
  firstCastTimestamp?: number
  pathUnlocked: boolean
}

export interface ConstellationSnapshot {
  nodeCount: number
  patternTypes: string[]
  hash?: string
}

export interface HexagramSnapshot {
  lines: [0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1]
  number: number
  name: string
}

// ============================================
// CONSTANTS
// ============================================

export const REPERTOIRE_STORAGE_KEY = 'agentprivacy_spell_repertoire'

export const PATH_UNLOCK_CRITERIA = {
  minSpellsCast: 3,
  minSectionsVisited: 3,
  minConvergences: 1
} as const

/** Cast id stored in castHistory for mage hexagram flow */
export const HEXAGRAM_CAST_ID = 'hexagram_cast' as const

// Sections that count toward training progress
export const TRAINING_SECTIONS = [
  'hero',
  'thesis',
  'features',
  'spellbooks',
  'your-path',
  'architecture',
  'pools',
  'story',
  'zero',
  'canon',
  'society',
  'plurality',
  'ceremony',
  'spells',
  'mage'
] as const

// Default spells available to cast (8 total: 5 yang, 3 yin)
// Only 6 can be active in the hex at a time - 2 are benched
export const DEFAULT_SPELLS: Omit<LearnedSpell, 'learnedAt' | 'learnedInSection'>[] = [
  // YANG spells (5) - outward assertion, swordsman energy
  {
    id: 'emoji_shield',
    type: 'emoji',
    content: '🛡️',
    emoji: '🛡️',
    myTermsMapping: 'DO_NOT_TRACK',
    weight: 2,
    yangYin: 'yang',
    source: 'story'
  },
  {
    id: 'emoji_dragon',
    type: 'emoji',
    content: '🐉',
    emoji: '🐉',
    myTermsMapping: 'TRUST_EXTENSION',
    weight: 3,
    yangYin: 'yang',
    source: 'story'
  },
  {
    id: 'proverb_gap',
    type: 'proverb',
    content: 'The gap is where you live',
    emoji: '⊥',
    myTermsMapping: 'DATA_MINIMISATION',
    weight: 3,
    yangYin: 'yang',
    source: 'story'
  },
  {
    id: 'keyword_dnt',
    type: 'keyword',
    content: 'DO_NOT_TRACK',
    emoji: '🚫',
    myTermsMapping: 'DO_NOT_TRACK',
    weight: 2,
    yangYin: 'yang',
    source: 'canon'
  },
  {
    id: 'emoji_crystal',
    type: 'emoji',
    content: '🔮',
    emoji: '🔮',
    myTermsMapping: 'SELECTIVE_DISCLOSURE',
    weight: 2,
    yangYin: 'yang', // active choice of what to reveal
    source: 'zk'
  },
  // YIN spells (3) - inward concealment, mage energy
  {
    id: 'proverb_weather',
    type: 'proverb',
    content: 'Build weather, not monuments',
    emoji: '🌧️',
    myTermsMapping: 'EPHEMERAL_SESSION',
    weight: 2,
    yangYin: 'yin',
    source: 'story'
  },
  {
    id: 'keyword_dns',
    type: 'keyword',
    content: 'DO_NOT_SELL',
    emoji: '💰',
    myTermsMapping: 'DO_NOT_SELL',
    weight: 2,
    yangYin: 'yin',
    source: 'canon'
  },
  {
    id: 'emoji_cloak',
    type: 'emoji',
    content: '👻',
    emoji: '👻',
    myTermsMapping: 'ANONYMIZE',
    weight: 2,
    yangYin: 'yin',
    source: 'zk'
  }
]

// Active hex spells storage (6 of 8 are active, 2 are benched)
const ACTIVE_HEX_SPELLS_KEY = 'agentprivacy:active-hex-spells'

// Default: first 6 spells are active (3 yang, 3 yin)
const DEFAULT_ACTIVE_HEX_IDS = [
  'emoji_shield', 'emoji_dragon', 'proverb_gap', // 3 yang
  'emoji_crystal', 'proverb_weather', 'keyword_dns' // 3 yin
]

export function getActiveHexSpellIds(): string[] {
  if (typeof window === 'undefined') return DEFAULT_ACTIVE_HEX_IDS
  try {
    const raw = localStorage.getItem(ACTIVE_HEX_SPELLS_KEY)
    if (!raw) return DEFAULT_ACTIVE_HEX_IDS
    const ids = JSON.parse(raw)
    if (!Array.isArray(ids) || ids.length !== 6) return DEFAULT_ACTIVE_HEX_IDS
    return ids
  } catch {
    return DEFAULT_ACTIVE_HEX_IDS
  }
}

export function setActiveHexSpellIds(ids: string[]): void {
  if (typeof window === 'undefined') return
  if (ids.length !== 6) return
  try {
    localStorage.setItem(ACTIVE_HEX_SPELLS_KEY, JSON.stringify(ids))
    window.dispatchEvent(new CustomEvent('agentprivacy:hex-spells-changed'))
  } catch { /* ignore */ }
}

export function getActiveHexSpells() {
  const activeIds = getActiveHexSpellIds()
  return DEFAULT_SPELLS.filter(s => activeIds.includes(s.id))
}

export function getBenchedHexSpells() {
  const activeIds = getActiveHexSpellIds()
  return DEFAULT_SPELLS.filter(s => !activeIds.includes(s.id))
}

export function swapHexSpell(activeId: string, benchedId: string): void {
  const current = getActiveHexSpellIds()
  const idx = current.indexOf(activeId)
  if (idx === -1) return
  const newIds = [...current]
  newIds[idx] = benchedId
  setActiveHexSpellIds(newIds)
}

// ============================================
// STORAGE FUNCTIONS
// ============================================

function getDefaultRepertoire(): SpellRepertoire {
  return {
    version: '1.0',
    learnedSpells: [],
    castHistory: [],
    trainingProgress: {
      sectionsVisited: [],
      orbConvergenceCount: 0,
      spellsCastCount: 0,
      drakeSpellUnlocked: false,
      pathUnlocked: false
    },
    lastUpdated: Date.now()
  }
}

export function getRepertoire(): SpellRepertoire {
  if (typeof window === 'undefined') return getDefaultRepertoire()

  try {
    const raw = localStorage.getItem(REPERTOIRE_STORAGE_KEY)
    if (!raw) return getDefaultRepertoire()

    const data = JSON.parse(raw)
    if (data.version !== '1.0') {
      console.warn('[Training] Unknown repertoire version:', data.version)
      return getDefaultRepertoire()
    }

    return data as SpellRepertoire
  } catch (e) {
    console.error('[Training] Failed to load repertoire:', e)
    return getDefaultRepertoire()
  }
}

export function saveRepertoire(repertoire: SpellRepertoire): void {
  if (typeof window === 'undefined') return

  repertoire.lastUpdated = Date.now()

  // Check if path should be unlocked
  const progress = repertoire.trainingProgress
  const wasUnlocked = progress.pathUnlocked
  if (!progress.pathUnlocked) {
    progress.pathUnlocked = checkPathUnlock(progress)
  }

  try {
    localStorage.setItem(REPERTOIRE_STORAGE_KEY, JSON.stringify(repertoire))

    // Sync repertoire to extensions
    syncRepertoireToExtensions(repertoire)

    // Broadcast path unlocked if just unlocked
    if (progress.pathUnlocked && !wasUnlocked) {
      console.log('[Training] Path unlocked!')
      broadcastPathUnlocked({
        sectionsVisited: progress.sectionsVisited.length,
        spellsCast: progress.spellsCastCount,
        convergences: progress.orbConvergenceCount
      })
    }
  } catch (e) {
    console.error('[Training] Failed to save repertoire:', e)
  }
}

// ============================================
// PROGRESS TRACKING
// ============================================

export function checkPathUnlock(progress: TrainingProgress): boolean {
  return (
    progress.spellsCastCount >= PATH_UNLOCK_CRITERIA.minSpellsCast &&
    progress.sectionsVisited.length >= PATH_UNLOCK_CRITERIA.minSectionsVisited &&
    progress.orbConvergenceCount >= PATH_UNLOCK_CRITERIA.minConvergences
  )
}

export function recordSectionVisit(sectionId: string): void {
  const repertoire = getRepertoire()

  if (!repertoire.trainingProgress.sectionsVisited.includes(sectionId)) {
    repertoire.trainingProgress.sectionsVisited.push(sectionId)
    console.log('[Training] Section visited:', sectionId)
    saveRepertoire(repertoire)

    // Broadcast to extensions
    broadcastSectionVisited(sectionId, repertoire.trainingProgress.sectionsVisited.length)
  }
}

export function recordOrbConvergence(): void {
  const repertoire = getRepertoire()
  repertoire.trainingProgress.orbConvergenceCount++
  console.log('[Training] Orb convergence:', repertoire.trainingProgress.orbConvergenceCount)
  saveRepertoire(repertoire)

  // Broadcast to extensions
  broadcastOrbConvergence(repertoire.trainingProgress.orbConvergenceCount)
}

// ============================================
// SPELL LEARNING & CASTING
// ============================================

export function learnSpell(
  spellId: string,
  section: string
): LearnedSpell | null {
  const repertoire = getRepertoire()

  // Check if already learned
  if (repertoire.learnedSpells.some(s => s.id === spellId)) {
    return null
  }

  // Find the spell template
  const template = DEFAULT_SPELLS.find(s => s.id === spellId)
  if (!template) {
    console.warn('[Training] Unknown spell:', spellId)
    return null
  }

  const spell: LearnedSpell = {
    ...template,
    learnedAt: Date.now(),
    learnedInSection: section
  }

  repertoire.learnedSpells.push(spell)

  // Check for drake spell unlock
  if (repertoire.learnedSpells.length >= 5) {
    repertoire.trainingProgress.drakeSpellUnlocked = true
  }

  console.log('[Training] Spell learned:', spell.content)
  saveRepertoire(repertoire)

  return spell
}

export function castSpell(
  spellId: string,
  position: { x: number; y: number },
  section: string
): CastEvent | null {
  const repertoire = getRepertoire()

  // Auto-learn spell if not known
  if (!repertoire.learnedSpells.some(s => s.id === spellId)) {
    learnSpell(spellId, section)
  }

  const event: CastEvent = {
    spellId,
    timestamp: Date.now(),
    position,
    section
  }

  repertoire.castHistory.push(event)
  repertoire.trainingProgress.spellsCastCount++

  // Record first cast timestamp
  if (!repertoire.trainingProgress.firstCastTimestamp) {
    repertoire.trainingProgress.firstCastTimestamp = Date.now()
  }

  console.log('[Training] Spell cast:', spellId, 'at', position)
  saveRepertoire(repertoire)

  // Broadcast to extensions
  const spell = DEFAULT_SPELLS.find(s => s.id === spellId)
  if (spell) {
    broadcastSpellCast(spellId, spell.content, spell.emoji || '✨', position, section)
  }

  return event
}

export function getLearnedSpells(): LearnedSpell[] {
  return getRepertoire().learnedSpells
}

export function getAvailableSpells(): typeof DEFAULT_SPELLS {
  const repertoire = getRepertoire()
  const activeIds = getActiveHexSpellIds()

  // Return only active hex spells (6), filtering dragon if not unlocked
  return DEFAULT_SPELLS.filter(s => {
    if (!activeIds.includes(s.id)) return false
    if (s.id === 'emoji_dragon') {
      return repertoire.trainingProgress.drakeSpellUnlocked
    }
    return true
  })
}

// ============================================
// CONSTELLATION
// ============================================

export function updateConstellationSnapshot(
  nodeCount: number,
  patternTypes: string[]
): void {
  const repertoire = getRepertoire()

  repertoire.constellationSnapshot = {
    nodeCount,
    patternTypes,
    hash: btoa(JSON.stringify({ nodeCount, patternTypes, t: Date.now() })).slice(0, 32)
  }

  saveRepertoire(repertoire)
}

// ============================================
// HEXAGRAM
// ============================================

export function updateHexagramSnapshot(
  lines: HexagramSnapshot['lines'],
  number: number,
  name: string
): void {
  const repertoire = getRepertoire()

  repertoire.hexagramSnapshot = { lines, number, name }

  saveRepertoire(repertoire)
}

/** Mage path: I Ching lines → snapshot + cast history (separate from swordsman radial palette). */
export function castHexagramSpell(
  lines: HexagramSnapshot['lines'],
  position: { x: number; y: number },
  section: string,
  kingWenNumber: number,
  name: string,
  glyph: string
): CastEvent | null {
  const repertoire = getRepertoire()

  updateHexagramSnapshot(lines, kingWenNumber, name)

  const event: CastEvent = {
    spellId: HEXAGRAM_CAST_ID,
    timestamp: Date.now(),
    position,
    section,
  }

  repertoire.castHistory.push(event)
  repertoire.trainingProgress.spellsCastCount++

  if (!repertoire.trainingProgress.firstCastTimestamp) {
    repertoire.trainingProgress.firstCastTimestamp = Date.now()
  }

  saveRepertoire(repertoire)

  broadcastSpellCast(HEXAGRAM_CAST_ID, name, glyph, position, section)

  return event
}

// ============================================
// STATS & QUERIES
// ============================================

export function getTrainingStats(): {
  sectionsVisited: number
  totalSections: number
  spellsLearned: number
  spellsCast: number
  convergences: number
  pathUnlocked: boolean
  progress: number // 0-100
  /** Mage: hexagram casts (H flow), from castHistory */
  hexagramCasts: number
  /** Swordsman palette: 🐉 unlocked after enough spells learned */
  drakeUnlocked: boolean
  /** Story: acts with proverb + marker emoji (orbiting chips) */
  inscribedActs: number
} {
  const repertoire = getRepertoire()
  const progress = repertoire.trainingProgress

  const totalSections = TRAINING_SECTIONS.length
  const sectionsVisited = progress.sectionsVisited.length

  const hexagramCasts = repertoire.castHistory.filter((e) => e.spellId === HEXAGRAM_CAST_ID).length
  const inscribedActs = collectInscribedOrbitingSpells().length

  // Calculate overall progress (weighted)
  const sectionProgress = (sectionsVisited / PATH_UNLOCK_CRITERIA.minSectionsVisited) * 33
  const spellProgress = (progress.spellsCastCount / PATH_UNLOCK_CRITERIA.minSpellsCast) * 33
  const convergenceProgress = (progress.orbConvergenceCount / PATH_UNLOCK_CRITERIA.minConvergences) * 34

  const overallProgress = Math.min(100, Math.round(sectionProgress + spellProgress + convergenceProgress))

  return {
    sectionsVisited,
    totalSections,
    spellsLearned: repertoire.learnedSpells.length,
    spellsCast: progress.spellsCastCount,
    convergences: progress.orbConvergenceCount,
    pathUnlocked: progress.pathUnlocked,
    progress: overallProgress,
    hexagramCasts,
    drakeUnlocked: progress.drakeSpellUnlocked,
    inscribedActs,
  }
}

export function isPathUnlocked(): boolean {
  return getRepertoire().trainingProgress.pathUnlocked
}

// ============================================
// RESET (for testing)
// ============================================

export function resetTrainingProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(REPERTOIRE_STORAGE_KEY)
  console.log('[Training] Progress reset')
}
