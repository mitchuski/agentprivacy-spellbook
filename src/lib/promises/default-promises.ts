/**
 * Default promises v2 — PrivacyMage tetrahedral architecture.
 *
 * Four Forces: protect (⚔️ Swordsman), project (🧙 Mage), reflect (🪞 Witness), connect (🤝 Bridge).
 * Knowledge Actions: study, inscribe, share, contribute.
 * Sovereignty Actions: affirm, practice.
 *
 * 24 default promises in 7 categories.
 */

import type { PromiseEntry } from './types';
import { DEFAULT_SPELL, DEFAULT_CONSTELLATION } from './types';

export interface DefaultPromise extends Omit<PromiseEntry, 'id' | 'createdAt' | 'updatedAt'> {
  category: string;
}

/**
 * 24 default promises:
 * 1. Four Forces (4)
 * 2. Promise Theory Foundations (4)
 * 3. V4 Privacy Value Model (4)
 * 4. Consent & Invitation (3)
 * 5. VRC & Trust Formation (4)
 * 6. Chronicles & Narrative (3)
 * 7. Guardian Path (2)
 */
export const DEFAULT_PROMISES: DefaultPromise[] = [
  // ═══════════════════════════════════════════════════════════════
  // 1. FOUR FORCES (4)
  // ═══════════════════════════════════════════════════════════════
  {
    category: 'Four Forces',
    type: 'affirm',
    force: 'protect',
    description: 'I affirm the Swordsman: I set boundaries. Protection is the promise to hold the line — no agent crosses without invitation. Boundary setting is sovereignty.',
    status: 'active',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#swordsman', '#protect'],
  },
  {
    category: 'Four Forces',
    type: 'affirm',
    force: 'project',
    description: 'I affirm the Mage: I delegate capability. Projection is the promise to extend agency through tools and spells — delegation, not substitution. The Mage acts only where I permit.',
    status: 'active',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#mage', '#project'],
  },
  {
    category: 'Four Forces',
    type: 'affirm',
    force: 'reflect',
    description: 'I affirm the Witness: temporal memory emerges from boundary accumulation. What I preserve across time — the mirror that holds my story — is not built by a single agent. Reflect (🪞) is emergent.',
    status: 'active',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#witness', '#reflect'],
  },
  {
    category: 'Four Forces',
    type: 'affirm',
    force: 'connect',
    description: 'I affirm the Bridge: relationship building emerges from network delegation. Connection (🤝) is where promises meet — bilateral, voluntary. The trust graph grows at the intersections.',
    status: 'active',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#bridge', '#connect'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. PROMISE THEORY FOUNDATIONS (4)
  // ═══════════════════════════════════════════════════════════════
  {
    category: 'Promise Theory Foundations',
    type: 'study',
    description: 'Understand the autonomy axiom: I can only promise my own behavior. The Swordsman promises protection. The Mage promises delegation. Neither promises on my behalf — and I do not promise on theirs.',
    status: 'active',
    grimoire: 'story',
    actNumber: 2,
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#autonomy', '#promise-theory'],
  },
  {
    category: 'Promise Theory Foundations',
    type: 'study',
    description: 'Grasp The Gap as irreducible promise: the conditional independence (S ⊥⊥ M | X) emerges from separation itself — owned by neither agent, captured by no adversary. Where dignity architecturally resides.',
    status: 'active',
    grimoire: 'zero',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#gap', '#zero'],
  },
  {
    category: 'Promise Theory Foundations',
    type: 'study',
    description: 'Learn the four sovereignty forces: Protect (⚔️) and Project (🧙) generate two more — Reflect (🪞) emerges from temporal boundary accumulation, Connect (🤝) from network delegation effects. The duality becomes tetrahedron.',
    status: 'active',
    grimoire: 'zero',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#four-forces', '#tetrahedron'],
  },
  {
    category: 'Promise Theory Foundations',
    type: 'study',
    description: 'Trust the reconstruction ceiling: R_max = (C_S + C_M) / H(X) < 1. No adversary can expand their scope to include my full private state X. Perfect reconstruction is mathematically impossible.',
    status: 'active',
    grimoire: 'zero',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#r-less-than-one', '#zero'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. V4 PRIVACY VALUE MODEL (4)
  // ═══════════════════════════════════════════════════════════════
  {
    category: 'V4 Privacy Value Model',
    type: 'study',
    description: 'See the three graphs: Knowledge Graph (what I know), Promise Graph (what I commit), Trust Graph (what I keep). The overlap where all three intersect — that IS the First Person. Identity emerges, not issued.',
    status: 'active',
    grimoire: 'plurality',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#three-graphs', '#identity'],
  },
  {
    category: 'V4 Privacy Value Model',
    type: 'practice',
    description: 'Live the edge value: I am defined by what I promise, not what I contain. The path through sovereignty space — each traversal, each commitment, each kept promise — that trajectory IS my 7th capital.',
    status: 'active',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#edge-value', '#7th-capital'],
  },
  {
    category: 'V4 Privacy Value Model',
    type: 'inscribe',
    description: 'Build temporal memory: each verified inscription adds to my derivation chain τ. Unverifiable history contributes nothing. Verified history compounds logarithmically. Time becomes a contest between entropy and memory.',
    status: 'active',
    grimoire: 'story',
    actNumber: 1,
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#temporal-memory', '#witness'],
  },
  {
    category: 'V4 Privacy Value Model',
    type: 'practice',
    description: 'Reclaim my 7th capital: my behavioral patterns, relationships, and digital fabric are not exhaust to be extracted — they are capital to be protected. The trajectory is larger than any observable surface.',
    status: 'active',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#7th-capital', '#sovereignty'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 4. CONSENT & INVITATION (3)
  // ═══════════════════════════════════════════════════════════════
  {
    category: 'Consent & Invitation',
    type: 'practice',
    description: 'Practice invitation, not attack: establish acceptance BEFORE proposal. Surveillance extracts without consent (attack). The Swordsman negotiates terms before data flows (invitation). Consent is architectural.',
    status: 'active',
    grimoire: 'society',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#invitation', '#consent'],
  },
  {
    category: 'Consent & Invitation',
    type: 'study',
    description: 'Own MyTerms: my conditions for engagement are mine to state. I do not accept default extraction. I inscribe my terms; the other party may accept, reject, or counter. No terms, no flow.',
    status: 'active',
    grimoire: 'society',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#myterms', '#consent'],
  },
  {
    category: 'Consent & Invitation',
    type: 'study',
    description: 'Distinguish creation from extraction: creation adds to the world with consent; extraction takes without. The Mage creates spells I authorize. Surveillance extracts. I side with creation.',
    status: 'active',
    grimoire: 'society',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#creation-vs-extraction', '#consent'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. VRC & TRUST FORMATION (4)
  // ═══════════════════════════════════════════════════════════════
  {
    category: 'VRC & Trust Formation',
    type: 'contribute',
    description: 'Form proverbs: compress my understanding into a contextual compression I can share. Proverb formation is the first step toward a VRC — matching compression proves shared understanding.',
    status: 'active',
    grimoire: 'story',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#vrc', '#proverb'],
  },
  {
    category: 'VRC & Trust Formation',
    type: 'inscribe',
    description: 'Expand my spell: sovereignty lattice notation (e.g. (⚔️⊥⿻⊥🧙)🙂) encodes my stance. I inscribe and refine my spell as I learn; the constellation (emoji path) makes the path visible.',
    status: 'active',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#spell', '#vrc'],
  },
  {
    category: 'VRC & Trust Formation',
    type: 'contribute',
    description: 'Form a VRC: a bilateral promise bundle where matching compression proves shared understanding. Assessment α(π) = compression ratio. High compression (70:1+) = strong positive assessment of promise kept.',
    status: 'active',
    grimoire: 'story',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#vrc', '#bundle'],
  },
  {
    category: 'VRC & Trust Formation',
    type: 'practice',
    description: 'Earn trust through assessment: each signal is an assessment event. Blade (low evidence) → Light (demonstrated pattern) → Heavy (sustained assessments) → Dragon (high confidence in future promise-keeping).',
    status: 'active',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#trust-tiers', '#dragon'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. CHRONICLES & NARRATIVE (3)
  // ═══════════════════════════════════════════════════════════════
  {
    category: 'Chronicles & Narrative',
    type: 'inscribe',
    description: 'Chronicle my journey: the path I walk is the story I inscribe. Journey chronicling builds temporal memory and feeds the overlap of knowledge, promise, and trust. The lived path is the proof.',
    status: 'active',
    grimoire: 'story',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#chronicle', '#story'],
  },
  {
    category: 'Chronicles & Narrative',
    type: 'practice',
    description: 'Develop my secret language: the private protocol between my Swordsman and Mage. Which face of my sovereignty tetrahedron to show each encounter. The internal graph that never leaves The Gap.',
    status: 'active',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#secret-language', '#gap'],
  },
  {
    category: 'Chronicles & Narrative',
    type: 'study',
    description: 'Understand story fracture: identity can hold multiple narratives without collapse. The fracture is not a bug — it is how the First Person spans contexts. One journey, many tellings.',
    status: 'active',
    grimoire: 'story',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#story-fracture', '#narrative'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 7. GUARDIAN PATH (2)
  // ═══════════════════════════════════════════════════════════════
  {
    category: 'Guardian Path',
    type: 'affirm',
    description: 'Consider guardian candidacy: the path from Blade to Dragon is the path from promise to proof. Guardians are those who have walked the horseshoe, carried the towel, and earned the overlap.',
    status: 'active',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#guardian', '#dragon'],
  },
  {
    category: 'Guardian Path',
    type: 'practice',
    description: 'Pursue verified personhood: the overlap of three graphs — knowledge, promises, trust — can only be occupied by someone who LIVED the journey. It cannot be forged. It accumulates. It has weight.',
    status: 'active',
    grimoire: 'plurality',
    spell: DEFAULT_SPELL,
    constellation: DEFAULT_CONSTELLATION,
    tags: ['#personhood', '#verified'],
  },
];

/**
 * Get default promises ready for insertion (no category field).
 */
export function getDefaultPromisesForUser(): Omit<DefaultPromise, 'category'>[] {
  return DEFAULT_PROMISES.map(({ category: _category, ...promise }) => promise);
}
