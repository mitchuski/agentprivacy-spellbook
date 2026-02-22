/**
 * Persona templates aligned with public/persona/_index.json.
 * Used for spellbook templates (pathway + skills) and for "Persona alignment" in skills.md export.
 */

export type PersonaAlignment = 'swordsman' | 'mage' | 'balanced';

export interface PersonaTemplate {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  alignment: PersonaAlignment;
  category: string;
  /** Role skill IDs (privacy layer is implicit). Used to match selected skills and to build spellbook template. */
  skills_role: string[];
}

/** All 16 persona templates. Order: canonical (soulbis, soulbae), then swordsman, mage, balanced. */
export const PERSONA_TEMPLATES: PersonaTemplate[] = [
  { id: 'soulbis', category: 'canonical', name: 'Soulbis — The First Swordsman', emoji: '⚔️', tagline: 'I slash surveillance focus. I enforce boundaries with mathematics.', alignment: 'swordsman', skills_role: ['crypto_zkp', 'swordsman_browser', 'personhood_sybil', 'dark_forest', 'academic'] },
  { id: 'soulbae', category: 'canonical', name: 'Soulbae — The First Mage', emoji: '🧙', tagline: 'I chronicle, compress, and project. I delegate without disclosure.', alignment: 'mage', skills_role: ['ai_agent', 'economics', 'policy_governance', 'narrative_compression', 'hitchhiker_governance', 'plurality_cooperative'] },
  { id: 'cipher', category: 'swordsman', name: 'The Cipher — ZKP Protocol Engineer', emoji: '🗡️🔐', tagline: 'I prove without revealing. I build the circuits that make privacy mathematical.', alignment: 'swordsman', skills_role: ['crypto_zkp', 'personhood_sybil', 'academic'] },
  { id: 'warden', category: 'swordsman', name: 'The Warden — Browser Privacy Builder', emoji: '🗡️🌐', tagline: 'I stand between the human and the harvest. Every cookie slashed is a sovereignty transition.', alignment: 'swordsman', skills_role: ['swordsman_browser', 'personhood_sybil', 'dark_forest', 'crypto_zkp'] },
  { id: 'gatekeeper', category: 'swordsman', name: 'The Gatekeeper — Proof-of-Personhood Researcher', emoji: '🗡️👤', tagline: 'One human. One swordsman. One chain. Multiply the agents and you multiply the lie.', alignment: 'swordsman', skills_role: ['personhood_sybil', 'crypto_zkp', 'academic'] },
  { id: 'ranger', category: 'swordsman', name: 'The Ranger — Dark Forest Strategist', emoji: '🗡️🌲', tagline: 'In the economic dark forest, the greatest signal of value is the absence of signal.', alignment: 'swordsman', skills_role: ['dark_forest', 'crypto_zkp', 'swordsman_browser', 'economics'] },
  { id: 'sentinel', category: 'swordsman', name: 'The Sentinel — Infrastructure Security Architect', emoji: '🗡️🛡️', tagline: 'The perimeter is not a wall. It is a proof. Every packet carries a claim about its origin.', alignment: 'swordsman', skills_role: ['crypto_zkp', 'swordsman_browser', 'personhood_sybil', 'dark_forest'] },
  { id: 'assessor', category: 'mage', name: 'The Assessor — Privacy Data Economist', emoji: '🧙💰', tagline: 'The gap between surveillance and sovereignty is not a number. It is a topology.', alignment: 'mage', skills_role: ['economics', 'ai_agent', 'policy_governance'] },
  { id: 'ambassador', category: 'mage', name: 'The Ambassador — Standards & Governance Architect', emoji: '🧙⚖️', tagline: 'A standard set too late is a wall built after the flood.', alignment: 'mage', skills_role: ['policy_governance', 'ai_agent', 'economics', 'narrative_compression'] },
  { id: 'chronicler', category: 'mage', name: 'The Chronicler — Knowledge Compression Builder', emoji: '🧙📖', tagline: 'A proverb is a story that forgot its author. A skill file is an equation dressed for foreign soil.', alignment: 'mage', skills_role: ['narrative_compression', 'hitchhiker_governance', 'plurality_cooperative'] },
  { id: 'shipwright', category: 'mage', name: 'The Shipwright — DAO & Community Architect', emoji: '🧙🏴‍☠️', tagline: 'The ship cannot be bought, only joined. The guide cannot be owned, only tended.', alignment: 'mage', skills_role: ['hitchhiker_governance', 'plurality_cooperative', 'economics'] },
  { id: 'weaver', category: 'mage', name: 'The Weaver — Plural Technology Researcher', emoji: '🧙⿻', tagline: 'Without sovereignty, every vote is coerced. Without separation, every commons is extracted.', alignment: 'mage', skills_role: ['plurality_cooperative', 'policy_governance', 'ai_agent', 'narrative_compression'] },
  { id: 'healer', category: 'balanced', name: 'The Healer — Healthcare Privacy Architect', emoji: '☯️🏥', tagline: "Trust is architectural, not contractual. The patient's data saves lives only if the patient trusts the system.", alignment: 'balanced', skills_role: ['crypto_zkp', 'policy_governance', 'ai_agent', 'personhood_sybil', 'economics'] },
  { id: 'witness', category: 'balanced', name: 'The Witness — Privacy-Preserving Journalist', emoji: '☯️📰', tagline: 'The source must be protected. The story must be verified. The gap is the architecture.', alignment: 'balanced', skills_role: ['dark_forest', 'crypto_zkp', 'narrative_compression', 'ai_agent'] },
  { id: 'architect', category: 'balanced', name: 'The Architect — AI Agent System Designer', emoji: '☯️🤖', tagline: 'The hardest problem in AI is not intelligence. It is trustworthiness without omniscience.', alignment: 'balanced', skills_role: ['ai_agent', 'crypto_zkp', 'personhood_sybil', 'dark_forest', 'hitchhiker_governance'] },
  { id: 'pedagogue', category: 'balanced', name: 'The Pedagogue — Privacy Education Designer', emoji: '☯️🎓', tagline: "If a sixty-year-old in a Glasgow pub can't understand it in one breath, it hasn't found its compression.", alignment: 'balanced', skills_role: ['narrative_compression', 'swordsman_browser', 'policy_governance', 'economics'] },
];

const PRIVACY_LAYER_IDS = ['dragon', 'vrc_identity', 'promise_theory', 'knowledgegraph', 'tetrahedral_sovereignty', 'uor_toroidal'];

/**
 * Returns persona templates whose role skills are fully covered by the selected skill IDs.
 * Optional: include privacy layer in selected so "full" spellbooks match canonical personas.
 */
export function getMatchingPersonas(selectedSkillIds: Set<string>): PersonaTemplate[] {
  return PERSONA_TEMPLATES.filter((p) => {
    const roleCovered = p.skills_role.every((sid) => selectedSkillIds.has(sid));
    return roleCovered;
  });
}

/**
 * Returns persona templates that have at least one role skill in the selection (weaker match).
 */
export function getPartiallyMatchingPersonas(selectedSkillIds: Set<string>, minOverlap: number = 2): PersonaTemplate[] {
  return PERSONA_TEMPLATES.filter((p) => {
    const overlap = p.skills_role.filter((sid) => selectedSkillIds.has(sid)).length;
    return overlap >= minOverlap;
  });
}

export function getPersonaById(id: string): PersonaTemplate | undefined {
  return PERSONA_TEMPLATES.find((p) => p.id === id);
}

/** Full skill set for a persona: privacy layer + role skills. */
export function getSkillIdsForPersona(personaId: string): string[] {
  const p = getPersonaById(personaId);
  if (!p) return [];
  return [...PRIVACY_LAYER_IDS, ...p.skills_role];
}
