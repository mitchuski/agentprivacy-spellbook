/**
 * Built-in spellbook patterns — pre-configured skill graphs users can load.
 * Aligned with public/persona/_index.json (16 templates). Soulbis and Soulbae are canonical;
 * others are role-specific pathways with persona-index skills_role.
 */

import { FIRST_PERSON_SPELL_IDS } from '@/lib/grimoire-baked';
import { getSkillIdsForPersona } from '@/lib/persona-index';

export interface SpellbookTemplate {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  alignment: 'swordsman' | 'mage' | 'balanced';
  spellIds: string[];
  skillIds: string[];
}

/** Soulbis — Full First Person + Swordsman divergence (Zero-heavy, blade/shield). */
const SOULBIS_SPELL_IDS: string[] = [
  ...FIRST_PERSON_SPELL_IDS,
  'zero-tale-1', 'zero-tale-2', 'zero-tale-3', 'zero-tale-4',
  'zero-tale-9', 'zero-tale-10', 'zero-tale-11', 'zero-tale-12', 'zero-tale-13', 'zero-tale-14',
  'zero-tale-26',
];

const SOULBIS_SKILL_IDS: string[] = [
  'dragon', 'vrc_identity', 'promise_theory', 'knowledgegraph', 'tetrahedral_sovereignty', 'uor_toroidal',
  'crypto_zkp', 'swordsman_browser', 'personhood_sybil', 'dark_forest', 'academic',
];

/** Soulbae — Full First Person + Mage divergence (Canon, Society, Plurality, incantations). */
const SOULBAE_SPELL_IDS: string[] = [
  ...FIRST_PERSON_SPELL_IDS,
  'chapter-00-preface', 'chapter-01-cypherpunk-whispers', 'chapter-02-early-incantations', 'chapter-03-synthesis',
  'chapter-08-missing-primitive', 'chapter-09-open-canon',
  'parallel-9', // Exit, Exile, Access
  'plurality-opening', 'plurality-closing',
  'incantation-triune_graph_spell',  // Triune Graph Spell — identity, knowledge, promise → living trust
  'incantation-manifold_incantation', // Manifold Dragon — convergence
];

const SOULBAE_SKILL_IDS: string[] = [
  'dragon', 'vrc_identity', 'promise_theory', 'knowledgegraph', 'tetrahedral_sovereignty', 'uor_toroidal',
  'ai_agent', 'economics', 'policy_governance', 'narrative_compression', 'hitchhiker_governance', 'plurality_cooperative',
];

/** Cipher — ZKP Protocol Engineer (Swordsman persona). */
const CIPHER_SPELL_IDS: string[] = [
  'act-09-zcash-shield', 'act-07-mirror', 'act-10-topology',
  'zero-tale-1', 'zero-tale-2', 'zero-tale-3', 'zero-tale-4',
  'zero-tale-9', 'zero-tale-10', 'zero-tale-11', 'zero-tale-12', 'zero-tale-13', 'zero-tale-14',
  'zero-tale-15', 'zero-tale-16', 'zero-tale-17', 'zero-tale-18',
  'zero-tale-23', 'zero-tale-26',
];

const CIPHER_SKILL_IDS: string[] = [
  'dragon', 'vrc_identity', 'promise_theory', 'knowledgegraph', 'tetrahedral_sovereignty', 'uor_toroidal',
  'crypto_zkp', 'personhood_sybil', 'academic',
];

/** Warden — Browser Privacy Builder (Swordsman persona). */
const WARDEN_SPELL_IDS: string[] = [
  'act-04-blade-alone', 'act-05-light-armor', 'act-08-ancient-rule', 'act-09-zcash-shield',
  'act-15-running-in-shackles', 'act-17-bonfire-dark-forest',
];

const WARDEN_SKILL_IDS: string[] = [
  'dragon', 'vrc_identity', 'promise_theory', 'knowledgegraph', 'tetrahedral_sovereignty', 'uor_toroidal',
  'swordsman_browser', 'personhood_sybil', 'dark_forest', 'crypto_zkp',
];

/** Chronicler — Narrative Architect (Mage persona). */
const CHRONICLER_SPELL_IDS: string[] = [
  'act-01-venice', 'act-02-dual-ceremony', 'act-03-drakes-teaching', 'act-12-forgetting',
  'chapter-00-preface', 'chapter-01-cypherpunk-whispers', 'chapter-02-early-incantations', 'chapter-03-synthesis',
];

const CHRONICLER_SKILL_IDS: string[] = [
  'dragon', 'vrc_identity', 'promise_theory', 'knowledgegraph', 'tetrahedral_sovereignty', 'uor_toroidal',
  'narrative_compression', 'ai_agent', 'hitchhiker_governance', 'plurality_cooperative',
];

/** Mage-focused pathway (canon + story). Used by assessor, ambassador, shipwright, weaver. */
const MAGE_PATH_SPELL_IDS: string[] = [
  'act-01-venice', 'act-02-dual-ceremony', 'act-03-drakes-teaching', 'act-12-forgetting',
  'chapter-00-preface', 'chapter-01-cypherpunk-whispers', 'chapter-02-early-incantations', 'chapter-03-synthesis',
];

/** Balanced pathway (story + canon). Used by healer, witness, architect, pedagogue. */
const BALANCED_PATH_SPELL_IDS: string[] = [
  'act-01-venice', 'act-03-drakes-teaching', 'act-09-zcash-shield', 'act-12-forgetting',
  'chapter-00-preface', 'chapter-01-cypherpunk-whispers', 'chapter-03-synthesis',
];

export const SPELLBOOK_TEMPLATES: SpellbookTemplate[] = [
  {
    id: 'soulbis',
    name: 'Soulbis — The First Swordsman',
    emoji: '⚔️',
    tagline: 'I slash surveillance focus. I enforce boundaries with mathematics.',
    alignment: 'swordsman',
    spellIds: SOULBIS_SPELL_IDS,
    skillIds: SOULBIS_SKILL_IDS,
  },
  {
    id: 'soulbae',
    name: 'Soulbae — The First Mage',
    emoji: '🧙',
    tagline: 'I chronicle, compress, and project. I delegate without disclosure.',
    alignment: 'mage',
    spellIds: SOULBAE_SPELL_IDS,
    skillIds: SOULBAE_SKILL_IDS,
  },
  {
    id: 'cipher',
    name: 'The Cipher — ZKP Protocol Engineer',
    emoji: '🗡️🔐',
    tagline: 'I prove without revealing. I build the circuits that make privacy mathematical.',
    alignment: 'swordsman',
    spellIds: CIPHER_SPELL_IDS,
    skillIds: CIPHER_SKILL_IDS,
  },
  {
    id: 'warden',
    name: 'The Warden — Browser Privacy Builder',
    emoji: '🗡️🌐',
    tagline: 'I stand between the human and the harvest. Every cookie slashed is a sovereignty transition.',
    alignment: 'swordsman',
    spellIds: WARDEN_SPELL_IDS,
    skillIds: WARDEN_SKILL_IDS,
  },
  {
    id: 'gatekeeper',
    name: 'The Gatekeeper — Proof-of-Personhood Researcher',
    emoji: '🗡️👤',
    tagline: 'One human. One swordsman. One chain. Multiply the agents and you multiply the lie.',
    alignment: 'swordsman',
    spellIds: CIPHER_SPELL_IDS,
    skillIds: getSkillIdsForPersona('gatekeeper'),
  },
  {
    id: 'ranger',
    name: 'The Ranger — Dark Forest Strategist',
    emoji: '🗡️🌲',
    tagline: 'In the economic dark forest, the greatest signal of value is the absence of signal.',
    alignment: 'swordsman',
    spellIds: WARDEN_SPELL_IDS,
    skillIds: getSkillIdsForPersona('ranger'),
  },
  {
    id: 'sentinel',
    name: 'The Sentinel — Infrastructure Security Architect',
    emoji: '🗡️🛡️',
    tagline: 'The perimeter is not a wall. It is a proof. Every packet carries a claim about its origin.',
    alignment: 'swordsman',
    spellIds: WARDEN_SPELL_IDS,
    skillIds: getSkillIdsForPersona('sentinel'),
  },
  {
    id: 'chronicler',
    name: 'The Chronicler — Knowledge Compression Builder',
    emoji: '🧙📖',
    tagline: 'A proverb is a story that forgot its author. A skill file is an equation dressed for foreign soil.',
    alignment: 'mage',
    spellIds: CHRONICLER_SPELL_IDS,
    skillIds: CHRONICLER_SKILL_IDS,
  },
  {
    id: 'assessor',
    name: 'The Assessor — Privacy Data Economist',
    emoji: '🧙💰',
    tagline: 'The gap between surveillance and sovereignty is not a number. It is a topology.',
    alignment: 'mage',
    spellIds: MAGE_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('assessor'),
  },
  {
    id: 'ambassador',
    name: 'The Ambassador — Standards & Governance Architect',
    emoji: '🧙⚖️',
    tagline: 'A standard set too late is a wall built after the flood.',
    alignment: 'mage',
    spellIds: MAGE_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('ambassador'),
  },
  {
    id: 'shipwright',
    name: 'The Shipwright — DAO & Community Architect',
    emoji: '🧙🏴‍☠️',
    tagline: 'The ship cannot be bought, only joined. The guide cannot be owned, only tended.',
    alignment: 'mage',
    spellIds: MAGE_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('shipwright'),
  },
  {
    id: 'weaver',
    name: 'The Weaver — Plural Technology Researcher',
    emoji: '🧙⿻',
    tagline: 'Without sovereignty, every vote is coerced. Without separation, every commons is extracted.',
    alignment: 'mage',
    spellIds: MAGE_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('weaver'),
  },
  {
    id: 'healer',
    name: 'The Healer — Healthcare Privacy Architect',
    emoji: '☯️🏥',
    tagline: "Trust is architectural, not contractual. The patient's data saves lives only if the patient trusts the system.",
    alignment: 'balanced',
    spellIds: BALANCED_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('healer'),
  },
  {
    id: 'witness',
    name: 'The Witness — Privacy-Preserving Journalist',
    emoji: '☯️📰',
    tagline: 'The source must be protected. The story must be verified. The gap is the architecture.',
    alignment: 'balanced',
    spellIds: BALANCED_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('witness'),
  },
  {
    id: 'architect',
    name: 'The Architect — AI Agent System Designer',
    emoji: '☯️🤖',
    tagline: 'The hardest problem in AI is not intelligence. It is trustworthiness without omniscience.',
    alignment: 'balanced',
    spellIds: BALANCED_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('architect'),
  },
  {
    id: 'pedagogue',
    name: 'The Pedagogue — Privacy Education Designer',
    emoji: '☯️🎓',
    tagline: "If a sixty-year-old in a Glasgow pub can't understand it in one breath, it hasn't found its compression.",
    alignment: 'balanced',
    spellIds: BALANCED_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('pedagogue'),
  },
];

export function getTemplateById(id: string): SpellbookTemplate | undefined {
  return SPELLBOOK_TEMPLATES.find((t) => t.id === id);
}
