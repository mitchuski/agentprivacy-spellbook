# Promises V2 Implementation Plan

## Overview

This document outlines the enhanced promises system that aligns with Privacy is Value V4 and Promise Theory. The key additions are:

1. **New promise types** based on the Four Sovereignty Forces (Protect, Project, Reflect, Connect)
2. **Spell notation** connecting each promise to the sovereignty lattice
3. **Proverb field** for user's contextual compression
4. **Emoji constellation** derived from the spell
5. **Tags** for categorization and filtering

---

## The Four Sovereignty Forces as Promise Types

From the whitepaper and V4 equation, the tetrahedral architecture generates four forces:

| Force | Symbol | Agent | Role | Promise Type |
|-------|--------|-------|------|--------------|
| **Protect** | ⚔️ | Swordsman | External boundaries, control disclosure | `protect` |
| **Project** | 🧙 | Mage | External execution, coordinate capabilities | `project` |
| **Reflect** | 🪞 | Emergent | Temporal memory, audit trail, derivation chains | `reflect` |
| **Connect** | 🤝 | Emergent | Network effects, relationships, value compounding | `connect` |

---

## File Changes Required

### 1. Update `src/lib/promises/types.ts`

```typescript
/**
 * Promises system types (BGIN-style voluntary commitments).
 *
 * Grounded in Promise Theory (Bergstra & Burgess 2019):
 * - Agents can only promise their own behavior
 * - Assessment α(π) determines if promise was kept
 * - Trust accumulates through demonstrated promise-keeping
 */

/**
 * Promise types mapped to Promise Theory and Four Forces:
 *
 * PRIMARY FORCES (Agent-aligned):
 * - protect: Boundary setting — Swordsman (⚔️) aligned
 * - project: Capability execution — Mage (🧙) aligned
 *
 * EMERGENT FORCES (Process-aligned):
 * - reflect: Temporal memory — Witness (🪞) aligned
 * - connect: Relationship building — Bridge (🤝) aligned
 *
 * KNOWLEDGE ACTIONS:
 * - study: Assessment preparation — understanding before action
 * - inscribe: Give promise (+b) — commit understanding to chain
 * - share: Coordination promise C(b) — knowledge transfer
 * - contribute: Protocol participation — building the commons
 *
 * SOVEREIGNTY ACTIONS:
 * - affirm: Personal sovereignty — First Person declarations
 * - practice: Behavioral integration — daily embodiment
 */
export type PromiseType =
  // Four Forces
  | 'protect'   // ⚔️ Swordsman — boundary setting
  | 'project'   // 🧙 Mage — capability delegation
  | 'reflect'   // 🪞 Witness — temporal memory
  | 'connect'   // 🤝 Bridge — relationship building
  // Knowledge Actions
  | 'study'     // 📖 Assessment preparation
  | 'inscribe'  // 📜 Chain commitment
  | 'share'     // 🌐 Knowledge transfer
  | 'contribute' // 🛠️ Protocol building
  // Sovereignty Actions
  | 'affirm'    // ✨ First Person declarations
  | 'practice'; // 🔄 Behavioral integration

export type PromiseStatus = 'active' | 'in_progress' | 'completed' | 'withdrawn';

/**
 * Promise entry with spell notation and proverb support.
 */
export interface PromiseEntry {
  id: string;
  type: PromiseType;
  description: string;
  status: PromiseStatus;

  /** Connected grimoire (story, zero, canon, society, plurality) */
  grimoire?: string;

  /** Specific act/tale number within grimoire */
  actNumber?: number;

  /** User's contextual proverb — their unique compression */
  proverb?: string;

  /**
   * Spell notation connecting to sovereignty lattice.
   * Default: (⚔️⊥⿻⊥🧙)🙂 (master inscription)
   */
  spell?: string;

  /**
   * Emoji constellation derived from spell.
   * Visual representation of the promise's position in sovereignty space.
   */
  constellation?: string;

  /** Related tags for categorization and filtering */
  tags?: string[];

  /** Legacy field - use proverb instead */
  connectedProverb?: string;

  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

/**
 * The master inscription — default spell for all promises.
 */
export const MASTER_INSCRIPTION = '(⚔️⊥⿻⊥🧙)🙂';

/**
 * Core spells from the sovereignty lattice.
 */
export const CORE_SPELLS = {
  master: '(⚔️⊥⿻⊥🧙)🙂',
  fourForces: '⚖️(⚔️⊥⿻⊥🧙⊥🪞⊥🤝)',
  edgeValue: '🛤️🙂',
  temporalMemory: '⏳·🪞',
  threeGraphs: '📚×🤝×⭐→🙂',
  ceiling: '🪞→✨→P_e>0',
  invitation: '🤝📜→⚔️🛡️',
  vrc: '🔐↔🔐→🤝',
  secretLanguage: '⚔️🔐🧙',
  privacyIsValue: '🔐^✨·🔑·✅·🌐·⏳·🪞·🕸️^🌱(📐)·🎯·💰·⚖️·🛤️🙂',
} as const;

/**
 * Promise type metadata for UI display.
 */
export const PROMISE_TYPE_META: Record<
  PromiseType,
  { label: string; emoji: string; description: string; force?: string; ptConcept: string }
> = {
  // Four Forces
  protect: {
    label: 'Protect',
    emoji: '⚔️',
    description: 'Set and maintain boundaries',
    force: 'Swordsman',
    ptConcept: 'Boundary promise',
  },
  project: {
    label: 'Project',
    emoji: '🧙',
    description: 'Execute capabilities through delegation',
    force: 'Mage',
    ptConcept: 'Delegation promise',
  },
  reflect: {
    label: 'Reflect',
    emoji: '🪞',
    description: 'Build temporal memory and derivation chains',
    force: 'Witness',
    ptConcept: 'Memory accumulation',
  },
  connect: {
    label: 'Connect',
    emoji: '🤝',
    description: 'Build trust relationships and network effects',
    force: 'Bridge',
    ptConcept: 'Coordination promise C(b)',
  },
  // Knowledge Actions
  study: {
    label: 'Study',
    emoji: '📖',
    description: 'Deepen understanding of concepts',
    ptConcept: 'Assessment preparation',
  },
  inscribe: {
    label: 'Inscribe',
    emoji: '📜',
    description: 'Commit understanding to the chain',
    ptConcept: 'Give promise (+b)',
  },
  share: {
    label: 'Share',
    emoji: '🌐',
    description: 'Transfer knowledge to others',
    ptConcept: 'Knowledge coordination',
  },
  contribute: {
    label: 'Contribute',
    emoji: '🛠️',
    description: 'Build the protocol commons',
    ptConcept: 'Protocol participation',
  },
  // Sovereignty Actions
  affirm: {
    label: 'Affirm',
    emoji: '✨',
    description: 'Declare personal sovereignty',
    ptConcept: 'Self-promise (µ→self)',
  },
  practice: {
    label: 'Practice',
    emoji: '🔄',
    description: 'Embody principles daily',
    ptConcept: 'Behavioral integration',
  },
};
```

---

### 2. Update `src/lib/promises/default-promises.ts`

The 24 default promises organized by category:

#### Four Forces Promises (4)

| # | Type | Description | Spell | Proverb |
|---|------|-------------|-------|---------|
| 1 | `protect` | Guard my boundaries using Zcash viewing keys — observe but never spend, verify but never extract | `⚔️🛡️🔐` | "The blade that protects never cuts its wielder" |
| 2 | `project` | Delegate capabilities through the Mage — act publicly using only Swordsman-authorized information | `🧙✨🌐` | "The spell projects power without revealing source" |
| 3 | `reflect` | Build temporal memory through verified inscriptions — each derivation chain compounds my history | `⏳·🪞` | "Time becomes memory when the witness records" |
| 4 | `connect` | Form trust relationships through VRCs — network effects emerge from bilateral promise-keeping | `🤝🕸️⭐` | "Connection multiplies what protection preserves" |

#### Promise Theory Foundations (4)

| # | Type | Description | Spell | Proverb |
|---|------|-------------|-------|---------|
| 5 | `study` | Understand the autonomy axiom: I can only promise my own behavior | `(⚔️⊥⿻⊥🧙)🙂` | "Sovereignty is the right to make promises only about your own behavior" |
| 6 | `study` | Grasp The Gap as irreducible promise — (S ⊥⊥ M \| X) owned by neither agent | `⿻` | "The Gap lives in the space between kept promises" |
| 7 | `study` | Learn the four sovereignty forces — Protect and Project generate Reflect and Connect | `⚖️(⚔️⊥⿻⊥🧙⊥🪞⊥🤝)` | "Two agents cast four shadows" |
| 8 | `study` | Trust the reconstruction ceiling: R_max < 1 — perfect reconstruction mathematically impossible | `🪞→✨→P_e>0` | "The mirror reflects but never completes" |

#### V4 Privacy Value Model (4)

| # | Type | Description | Spell | Proverb |
|---|------|-------------|-------|---------|
| 9 | `study` | See the three graphs: Knowledge × Promise × Trust — their overlap IS the First Person | `📚×🤝×⭐→🙂` | "Identity emerges at the intersection, not from issuance" |
| 10 | `affirm` | Live the edge value: I am defined by what I promise, not what I contain | `🛤️🙂` | "The equation rewards the dance, not the stance" |
| 11 | `reflect` | Build temporal memory A(τ) — verified history compounds, unverifiable contributes nothing | `⏳·🪞` | "Time contests entropy through memory" |
| 12 | `affirm` | Reclaim my 7th capital — behavioral patterns are capital to protect, not exhaust to extract | `🔐^✨·🛤️🙂` | "The trajectory is larger than any observable surface" |

#### Consent & Invitation (3)

| # | Type | Description | Spell | Proverb |
|---|------|-------------|-------|---------|
| 13 | `practice` | Practice invitation, not attack: establish acceptance BEFORE proposal | `🤝📜→⚔️🛡️` | "Consent is architectural, not aspirational" |
| 14 | `protect` | Negotiate MyTerms: present my privacy terms before data flows, using IEEE 7012 | `⚔️📜🤝` | "The Swordsman proposes, sites accept or negotiate" |
| 15 | `practice` | Choose creation over extraction — sovereignty creates value, surveillance destroys it | `🌱>🔥` | "Privacy preserved through creation, not destroyed through extraction" |

#### VRC & Trust Formation (4)

| # | Type | Description | Spell | Proverb |
|---|------|-------------|-------|---------|
| 16 | `inscribe` | Form a proverb unique to my context — compress understanding into contextual wisdom | `📜✨🙂` | (User forms their own) |
| 17 | `study` | Master spell expansion — demonstrate I can expand ⚔️ ⊥ 🧙 to full context on demand | `⚔️⊥🧙→📖` | "Compression proves understanding" |
| 18 | `connect` | Form a VRC: bilateral promise bundle where matching compression proves shared understanding | `🔐↔🔐→🤝` | "Assessment α(π) = compression ratio" |
| 19 | `contribute` | Earn trust through assessment: signals are assessment events, tiers emerge from kept promises | `🗡️→🛡️→⚔️→🐉` | "Trust is accumulated evidence of promise-keeping" |

#### Chronicles & Narrative (3)

| # | Type | Description | Spell | Proverb |
|---|------|-------------|-------|---------|
| 20 | `reflect` | Chronicle my journey: timestamps narratives describing what I did and why | `📖⏳🪞` | "Chronicles aren't audit logs — they're stories I tell about myself" |
| 21 | `practice` | Develop my secret language: the private cipher between my Swordsman and Mage | `⚔️🔐🧙` | "The internal graph that never leaves The Gap" |
| 22 | `share` | Experience story fracture with principle convergence — different contexts, one spell | `📖↔📖→⚔️⊥🧙` | "The story fractures. The principle converges." |

#### Guardian Path (2)

| # | Type | Description | Spell | Proverb |
|---|------|-------------|-------|---------|
| 23 | `contribute` | Walk the guardian path: prove reconstruction ability through sustained learning | `🗡️→🛡️→⚔️→🐉` | "Guardian candidates demonstrate compression, not just stake" |
| 24 | `protect` | Anchor my agents in verified personhood: Origin(S) ∩ Origin(M) = {P} | `🙂→⚔️∩🧙` | "One root, two agents, irreducible gap" |

---

### 3. Default Promise Interface Update

```typescript
export interface DefaultPromise extends Omit<PromiseEntry, 'id' | 'createdAt' | 'updatedAt'> {
  /** Category for organization in docs */
  category: string;

  /** Default proverb suggestion (user can override) */
  proverb?: string;

  /** Spell connecting to sovereignty lattice */
  spell: string;

  /** Tags for filtering */
  tags: string[];
}
```

---

### 4. Storage Migration

Add migration logic for existing promises that use old `custom` type:

```typescript
function migratePromiseType(oldType: string): PromiseType {
  if (oldType === 'custom') {
    // Default custom → affirm (personal sovereignty)
    return 'affirm';
  }
  return oldType as PromiseType;
}
```

---

## UI Updates Required

### Promise Creation Modal

1. Add **Spell selector** dropdown with `CORE_SPELLS` options + custom input
2. Add **Proverb textarea** for user's contextual compression
3. Add **Tags input** (comma-separated or chip input)
4. Show **Constellation preview** based on selected spell
5. Group promise types by category (Four Forces / Knowledge / Sovereignty)

### Promise Card Display

1. Show spell notation prominently
2. Display constellation emoji sequence
3. Show proverb in italics if present
4. Tags as chips/badges
5. Type icon from `PROMISE_TYPE_META`

### Promise Board Filters

1. Filter by type category (Four Forces, Knowledge, Sovereignty)
2. Filter by tags
3. Filter by grimoire
4. Sort by constellation similarity

---

## Tag Taxonomy

Suggested default tags aligned with the architecture:

| Category | Tags |
|----------|------|
| **Forces** | `#protect`, `#project`, `#reflect`, `#connect` |
| **Agents** | `#swordsman`, `#mage`, `#first-person` |
| **Concepts** | `#gap`, `#vrc`, `#chronicle`, `#trust-tier` |
| **V4 Terms** | `#edge-value`, `#temporal-memory`, `#reconstruction-ceiling` |
| **Actions** | `#boundary`, `#delegation`, `#inscription`, `#compression` |
| **Grimoires** | `#story`, `#zero`, `#canon`, `#society`, `#plurality` |

---

## Constellation Generation

The constellation is derived from the spell by extracting emoji characters:

```typescript
function spellToConstellation(spell: string): string {
  // Extract all emoji from spell
  const emojiRegex = /\p{Emoji}/gu;
  const emojis = spell.match(emojiRegex) || [];

  // Join with → for path representation
  return emojis.join('→');
}

// Example:
// spell: '(⚔️⊥⿻⊥🧙)🙂'
// constellation: '⚔️→⿻→🧙→🙂'
```

---

## Implementation Checklist

### Phase 1: Types & Data
- [ ] Update `types.ts` with new PromiseType union
- [ ] Add `MASTER_INSCRIPTION`, `CORE_SPELLS`, `PROMISE_TYPE_META`
- [ ] Update `PromiseEntry` interface with new fields
- [ ] Update `default-promises.ts` with 24 promises
- [ ] Add storage migration for old `custom` type

### Phase 2: Storage
- [ ] Update `storage.ts` with new fields
- [ ] Add `spellToConstellation()` helper
- [ ] Migrate existing promises on load

### Phase 3: UI Components
- [ ] Update `NewPromiseModal` with spell/proverb/tags
- [ ] Update `PromiseCard` to display new fields
- [ ] Add constellation preview component
- [ ] Add type category grouping in selectors

### Phase 4: Filters & Discovery
- [ ] Add tag-based filtering to `PromiseBoard`
- [ ] Add constellation similarity sorting
- [ ] Add type category tabs

---

## Summary

This plan transforms the promises system from simple task tracking into a **sovereignty-aligned commitment framework** where each promise:

1. **Connects to the sovereignty lattice** via spell notation
2. **Captures contextual understanding** via user proverbs
3. **Visualizes position in sovereignty space** via constellation
4. **Enables discovery and filtering** via tags
5. **Aligns with the Four Forces** (Protect, Project, Reflect, Connect)

The 24 default promises cover the core concepts from:
- Promise Theory (autonomy axiom, irreducible promise, assessment)
- Privacy is Value V4 (edge value, temporal memory, three graphs)
- Whitepaper (MyTerms, chronicles, VRCs, guardian path)

**Master Inscription: (⚔️⊥⿻⊥🧙)🙂**

*"Agents can only promise their own behavior."*
