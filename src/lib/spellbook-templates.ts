/**
 * Built-in spellbook patterns — pre-configured skill graphs users can load.
 * V5 Update: Added Netkeeper (swordsman) and Herald (mage) personas.
 * Aligned with agentprivacy-CODEX.md (25 personas). Soulbis and Soulbae are canonical;
 * skillIds from persona-index getSkillIdsForPersona (privacy layer + skills_role).
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

/** Cipher — ZKP Protocol Engineer (Swordsman persona). */
const CIPHER_SPELL_IDS: string[] = [
  'act-09-zcash-shield', 'act-07-mirror', 'act-10-topology',
  'zero-tale-1', 'zero-tale-2', 'zero-tale-3', 'zero-tale-4',
  'zero-tale-9', 'zero-tale-10', 'zero-tale-11', 'zero-tale-12', 'zero-tale-13', 'zero-tale-14',
  'zero-tale-15', 'zero-tale-16', 'zero-tale-17', 'zero-tale-18',
  'zero-tale-23', 'zero-tale-26',
];

/** Warden — Browser Builder (Swordsman persona). */
const WARDEN_SPELL_IDS: string[] = [
  'act-04-blade-alone', 'act-05-light-armor', 'act-08-ancient-rule', 'act-09-zcash-shield',
  'act-15-running-in-shackles', 'act-17-bonfire-dark-forest',
];

/** Chronicler — Narrative Compression Specialist (Mage persona). */
const CHRONICLER_SPELL_IDS: string[] = [
  'act-01-venice', 'act-02-dual-ceremony', 'act-03-drakes-teaching', 'act-12-forgetting',
  'chapter-00-preface', 'chapter-01-cypherpunk-whispers', 'chapter-02-early-incantations', 'chapter-03-synthesis',
];

/** Mage-focused pathway (canon + story). Used by assessor, ambassador, shipwright, weaver, priest. */
const MAGE_PATH_SPELL_IDS: string[] = [
  'act-01-venice', 'act-02-dual-ceremony', 'act-03-drakes-teaching', 'act-12-forgetting',
  'chapter-00-preface', 'chapter-01-cypherpunk-whispers', 'chapter-02-early-incantations', 'chapter-03-synthesis',
];

/** Balanced pathway (story + canon). Used by healer, witness, pedagogue, jedi, person. */
const BALANCED_PATH_SPELL_IDS: string[] = [
  'act-01-venice', 'act-03-drakes-teaching', 'act-09-zcash-shield', 'act-12-forgetting',
  'chapter-00-preface', 'chapter-01-cypherpunk-whispers', 'chapter-03-synthesis',
];

/** Balanced + Acts XXV–XXVI (mesh + hemispheres / AI governance). Used by architect and kyra. */
const BALANCED_PLUS_MESH_HEMISPHERE_SPELL_IDS: string[] = [
  ...BALANCED_PATH_SPELL_IDS,
  'act-25-the-dragons-hide',
  'act-26-master-and-his-emissary',
];

/** Holonic Architect — data substrate, persistence, Acts XXIV–XXV (bound + walkable spellweb). Story acts 2, 6, 9, 11, 13, 24, 25 + canon + triune/manifold. */
const HOLONIC_ARCHITECT_SPELL_IDS: string[] = [
  'act-02-dual-ceremony', 'act-06-trust-graph', 'act-09-zcash-shield', 'act-11-sovereignty-spiral',
  'act-13-book-of-promises', 'act-24-holographic-bound', 'act-25-the-dragons-hide',
  'chapter-00-preface', 'chapter-01-cypherpunk-whispers', 'chapter-08-missing-primitive',
  'incantation-triune_graph_spell', 'incantation-manifold_incantation',
];
/** Netkeeper — Mesh Network Sovereignty Builder (V5 Swordsman persona). Acts 2, 6, 9, 17, 25 + Zero Tales mesh focus. Act XXV = Dragon's Hide. */
const NETKEEPER_SPELL_IDS: string[] = [
  'act-02-dual-ceremony', 'act-06-trust-graph', 'act-09-zcash-shield', 'act-17-bonfire-dark-forest',
  'act-25-the-dragons-hide',
  'zero-tale-9', 'zero-tale-10', 'zero-tale-11', 'zero-tale-12',
];

/** Herald — Information Commons Architect (V5 Mage persona). Acts 1, 2, 3, 25, 26 + canon + plurality. Acts XXV–XXVI = mesh + Master/Emissary. */
const HERALD_SPELL_IDS: string[] = [
  'act-01-venice', 'act-02-dual-ceremony', 'act-03-drakes-teaching', 'act-25-the-dragons-hide', 'act-26-master-and-his-emissary',
  'chapter-00-preface', 'chapter-01-cypherpunk-whispers',
  'plurality-opening', 'plurality-closing',
];

export const SPELLBOOK_TEMPLATES: SpellbookTemplate[] = [
  {
    id: 'soulbis',
    name: 'Soulbis — The First Swordsman',
    emoji: '⚔️',
    tagline: 'The blade that protects without seeing what it protects is the only blade that cannot be turned.',
    alignment: 'swordsman',
    spellIds: SOULBIS_SPELL_IDS,
    skillIds: getSkillIdsForPersona('soulbis'),
  },
  {
    id: 'soulbae',
    name: 'Soulbae — The First Mage',
    emoji: '🧙',
    tagline: 'The mage who sees everything and touches nothing is the only delegate who cannot betray what was delegated.',
    alignment: 'mage',
    spellIds: SOULBAE_SPELL_IDS,
    skillIds: getSkillIdsForPersona('soulbae'),
  },
  {
    id: 'cipher',
    name: 'The Cipher — ZKP Protocol Engineer',
    emoji: '🗡️🔐',
    tagline: 'A proof that reveals nothing except its own truth is worth more than a promise that reveals everything about its maker.',
    alignment: 'swordsman',
    spellIds: CIPHER_SPELL_IDS,
    skillIds: getSkillIdsForPersona('cipher'),
  },
  {
    id: 'warden',
    name: 'The Warden — Browser Builder',
    emoji: '🗡️🌐',
    tagline: 'The door you walk through a thousand times a day is the one most worth guarding.',
    alignment: 'swordsman',
    spellIds: WARDEN_SPELL_IDS,
    skillIds: getSkillIdsForPersona('warden'),
  },
  {
    id: 'gatekeeper',
    name: 'The Gatekeeper — Personhood Verification Specialist',
    emoji: '🗡️👤',
    tagline: 'The gate that knows you are real without knowing who you are is the only gate worth walking through.',
    alignment: 'swordsman',
    spellIds: CIPHER_SPELL_IDS,
    skillIds: getSkillIdsForPersona('gatekeeper'),
  },
  {
    id: 'ranger',
    name: 'The Ranger — Dark Forest Navigator',
    emoji: '🗡️🌲',
    tagline: "The forest doesn't punish the visible — it prices them.",
    alignment: 'swordsman',
    spellIds: WARDEN_SPELL_IDS,
    skillIds: getSkillIdsForPersona('ranger'),
  },
  {
    id: 'sentinel',
    name: 'The Sentinel — Infrastructure Security Architect',
    emoji: '🗡️🛡️',
    tagline: 'The wall you never notice is the one doing its job.',
    alignment: 'swordsman',
    spellIds: WARDEN_SPELL_IDS,
    skillIds: getSkillIdsForPersona('sentinel'),
  },
  {
    id: 'sith',
    name: 'The Sith — Adversarial Researcher',
    emoji: '🗡️🔴',
    tagline: 'The architecture that only discovers weaknesses when attackers find them has already been breached.',
    alignment: 'swordsman',
    spellIds: WARDEN_SPELL_IDS,
    skillIds: getSkillIdsForPersona('sith'),
  },
  {
    id: 'archer',
    name: 'The Archer — Precision Strike Operative',
    emoji: '🗡️🎯',
    tagline: 'The most sovereign disclosure reveals exactly one truth and leaves no residue.',
    alignment: 'swordsman',
    spellIds: WARDEN_SPELL_IDS,
    skillIds: getSkillIdsForPersona('archer'),
  },
  {
    id: 'netkeeper',
    name: 'The Netkeeper — Mesh Network Sovereignty Builder',
    emoji: '🗡️🕸️',
    tagline: "The dragon's hide is not one scale but many. Each tunnel is a scale. Together they are impenetrable.",
    alignment: 'swordsman',
    spellIds: NETKEEPER_SPELL_IDS,
    skillIds: getSkillIdsForPersona('netkeeper'),
  },
  {
    id: 'chronicler',
    name: 'The Chronicler — Narrative Compression Specialist',
    emoji: '🧙📖',
    tagline: "A proverb that can't rebuild the cathedral it was carved from was never carved at all.",
    alignment: 'mage',
    spellIds: CHRONICLER_SPELL_IDS,
    skillIds: getSkillIdsForPersona('chronicler'),
  },
  {
    id: 'assessor',
    name: 'The Assessor — Privacy Data Economist',
    emoji: '🧙💰',
    tagline: 'The person who knows the price of their data but not its compounding value has already been bought at discount.',
    alignment: 'mage',
    spellIds: MAGE_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('assessor'),
  },
  {
    id: 'ambassador',
    name: 'The Ambassador — Standards & Governance Architect',
    emoji: '🧙⚖️',
    tagline: 'The standard that requires surveillance to enforce has already failed the thing it was written to protect.',
    alignment: 'mage',
    spellIds: MAGE_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('ambassador'),
  },
  {
    id: 'shipwright',
    name: 'The Shipwright — DAO & Community Architect',
    emoji: '🧙🏴‍☠️',
    tagline: "The ship that can't sail without its captain was never a ship — it was a throne.",
    alignment: 'mage',
    spellIds: MAGE_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('shipwright'),
  },
  {
    id: 'weaver',
    name: 'The Weaver — Plural Technology Researcher',
    emoji: '🧙⿻',
    tagline: 'The thread that refuses to touch other threads makes no fabric.',
    alignment: 'mage',
    spellIds: MAGE_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('weaver'),
  },
  {
    id: 'priest',
    name: 'The Priest — Ceremony Architect',
    emoji: '🧙🔮',
    tagline: 'A ceremony that can be performed without understanding has already emptied itself of everything worth committing to.',
    alignment: 'mage',
    spellIds: MAGE_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('priest'),
  },
  {
    id: 'herald',
    name: 'The Herald — Information Commons Architect',
    emoji: '🧙📡',
    tagline: 'The town crier speaks to everyone. The algorithm speaks to each person differently. Plurality requires shared hearing.',
    alignment: 'mage',
    spellIds: HERALD_SPELL_IDS,
    skillIds: getSkillIdsForPersona('herald'),
  },
  {
    id: 'healer',
    name: 'The Healer — Healthcare Privacy Specialist',
    emoji: '☯️🏥',
    tagline: 'The record that heals you should not be the record that prices you.',
    alignment: 'balanced',
    spellIds: BALANCED_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('healer'),
  },
  {
    id: 'witness',
    name: 'The Witness — Privacy-Preserving Accountability Agent',
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
    tagline: 'The system that trusts its agents to behave has already delegated sovereignty to hope.',
    alignment: 'balanced',
    spellIds: BALANCED_PLUS_MESH_HEMISPHERE_SPELL_IDS,
    skillIds: getSkillIdsForPersona('architect'),
  },
  {
    id: 'pedagogue',
    name: 'The Pedagogue — Privacy Education Designer',
    emoji: '☯️🎓',
    tagline: 'The teacher who needs the student to know cryptography before explaining privacy has already lost the class that matters most.',
    alignment: 'balanced',
    spellIds: BALANCED_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('pedagogue'),
  },
  {
    id: 'jedi',
    name: 'The Jedi — Balanced Force Practitioner',
    emoji: '☯️⚡',
    tagline: 'The practitioner who masters the tension builds sovereignty.',
    alignment: 'balanced',
    spellIds: BALANCED_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('jedi'),
  },
  {
    id: 'kyra',
    name: 'Kyra — Sovereign AI Vision',
    emoji: '☯️💎',
    tagline: 'The intelligence that serves without surveilling, delegates without extracting, and protects without imprisoning is the only intelligence worth building.',
    alignment: 'balanced',
    spellIds: BALANCED_PLUS_MESH_HEMISPHERE_SPELL_IDS,
    skillIds: getSkillIdsForPersona('kyra'),
  },
  {
    id: 'person',
    name: 'The Person — First Person Seeker',
    emoji: '☯️👤',
    tagline: 'The platform sees the data and calls it wealth. The sovereign holds the data and generates twelve thousand times more.',
    alignment: 'balanced',
    spellIds: BALANCED_PATH_SPELL_IDS,
    skillIds: getSkillIdsForPersona('person'),
  },
  {
    id: 'holonic-architect',
    name: 'The Holonic Architect — Builder of Identity-Independent Data Structures',
    emoji: '☯️🔷',
    tagline: 'I build the data substrate where Swordsman and Mage persist. The identity must outlive any backend.',
    alignment: 'balanced',
    spellIds: HOLONIC_ARCHITECT_SPELL_IDS,
    skillIds: getSkillIdsForPersona('holonic-architect'),
  },
];

export function getTemplateById(id: string): SpellbookTemplate | undefined {
  return SPELLBOOK_TEMPLATES.find((t) => t.id === id);
}
