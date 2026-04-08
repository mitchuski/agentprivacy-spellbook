/**
 * Persona templates aligned with agentprivacy-CODEX.md (34 personas, tier 0–3).
 * V5.2 Update: Added Algebraist (swordsman), Topologist (balanced), Stranger Witness (mage).
 * V5.3.1 Update: Added ceremony personas — Forgecaller, Dragonwaker, Manaweaver, Moonkeeper, Cosmologist, Theia.
 * Updated Soulbis/Soulbae to V5.3 canonical parent personas with UOR foundation.
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

/** Persona templates per agentprivacy-CODEX.md (canonical pair + swordsmen + mages + balanced). */
export const PERSONA_TEMPLATES: PersonaTemplate[] = [
  { id: 'soulbis', category: 'canonical', name: 'Soulbis — The First Swordsman (V5.3)', emoji: '⚔️', tagline: 'The blade that protects without seeing what it protects is the only blade that cannot be turned. Soulbis IS the neg operator in D₂ₙ.', alignment: 'swordsman', skills_role: ['crypto_zkp', 'swordsman_browser', 'personhood_sybil', 'dark_forest', 'academic', 'threat_adversarial', 'selective_disclosure', 'recovery_rpp', 'cross_chain', 'armor_progression', 'consent_infrastructure', 'reputation_credentials', 'understanding_as_key', 'sovereignty_economics', 'mesh_architecture', 'five_strikes', 'boundary_enforcement', 'enclave_operations', 'forensic_defense', 'key_ceremony', 'metadata_resistance', 'nullifier_design', 'perimeter_hardening', 'revocation_mechanics', 'separation_enforcement'] },
  { id: 'soulbae', category: 'canonical', name: 'Soulbae — The First Mage (V5.3)', emoji: '🧙', tagline: 'The mage who sees everything and touches nothing is the only delegate who cannot betray what was delegated. Soulbae IS the bnot operator in D₂ₙ.', alignment: 'mage', skills_role: ['ai_agent', 'economics', 'policy_governance', 'narrative_compression', 'hitchhiker_governance', 'plurality_cooperative', 'agent_interop', 'data_dignity', 'governance_agents', 'trust_spanning', 'constellation_method', 'proverbiogenesis', 'media_plurality', 'hemispheric_attention', 'environmental_commons', 'guild_efficiency', 'spellweb', 'derivation_certificate', 'stranger_ceremony', 'toroidal_witness', 'grimoire_navigation', 'spell_encoding', 'story_diffusion', 'intel_pooling', 'inscription_mechanics', 'holonic_identity', 'holonic_persistence', 'holonic_reasoning', 'shared_parent_patterns', 'braid_reasoning'] },
  { id: 'cipher', category: 'swordsman', name: 'The Cipher — ZKP Protocol Engineer', emoji: '🗡️🔐', tagline: 'A proof that reveals nothing except its own truth is worth more than a promise that reveals everything about its maker.', alignment: 'swordsman', skills_role: ['crypto_zkp', 'personhood_sybil', 'academic', 'threat_adversarial', 'selective_disclosure', 'recovery_rpp', 'cross_chain', 'understanding_as_key', 'sovereignty_economics', 'reputation_credentials'] },
  { id: 'warden', category: 'swordsman', name: 'The Warden — Browser Builder', emoji: '🗡️🌐', tagline: 'The door you walk through a thousand times a day is the one most worth guarding.', alignment: 'swordsman', skills_role: ['swordsman_browser', 'armor_progression', 'consent_infrastructure', 'personhood_sybil', 'mesh_architecture'] },
  { id: 'gatekeeper', category: 'swordsman', name: 'The Gatekeeper — Personhood Verification Specialist', emoji: '🗡️👤', tagline: 'The gate that knows you are real without knowing who you are is the only gate worth walking through.', alignment: 'swordsman', skills_role: ['personhood_sybil', 'crypto_zkp', 'academic', 'armor_progression', 'recovery_rpp', 'selective_disclosure'] },
  { id: 'ranger', category: 'swordsman', name: 'The Ranger — Dark Forest Navigator', emoji: '🗡️🌲', tagline: 'The forest doesn\'t punish the visible — it prices them.', alignment: 'swordsman', skills_role: ['dark_forest', 'crypto_zkp', 'economics', 'selective_disclosure', 'threat_adversarial', 'cross_chain'] },
  { id: 'sentinel', category: 'swordsman', name: 'The Sentinel — Infrastructure Security Architect', emoji: '🗡️🛡️', tagline: 'The wall you never notice is the one doing its job.', alignment: 'swordsman', skills_role: ['dark_forest', 'crypto_zkp', 'ai_agent', 'armor_progression', 'threat_adversarial', 'trust_spanning', 'cross_chain', 'agent_interop', 'selective_disclosure', 'mesh_architecture'] },
  { id: 'assessor', category: 'mage', name: 'The Assessor — Privacy Data Economist', emoji: '🧙💰', tagline: 'The person who knows the price of their data but not its compounding value has already been bought at discount.', alignment: 'mage', skills_role: ['economics', 'policy_governance', 'data_dignity', 'consent_infrastructure', 'ai_agent'] },
  { id: 'ambassador', category: 'mage', name: 'The Ambassador — Standards & Governance Architect', emoji: '🧙⚖️', tagline: 'The standard that requires surveillance to enforce has already failed the thing it was written to protect.', alignment: 'mage', skills_role: ['policy_governance', 'hitchhiker_governance', 'plurality_cooperative', 'academic', 'data_dignity', 'trust_spanning', 'agent_interop', 'consent_infrastructure', 'environmental_commons', 'media_plurality'] },
  { id: 'chronicler', category: 'mage', name: 'The Chronicler — Narrative Compression Specialist', emoji: '🧙📖', tagline: 'A proverb that can\'t rebuild the cathedral it was carved from was never carved at all.', alignment: 'mage', skills_role: ['narrative_compression', 'recovery_rpp', 'data_dignity', 'spellweb'] },
  { id: 'shipwright', category: 'mage', name: 'The Shipwright — DAO & Community Architect', emoji: '🧙🏴‍☠️', tagline: 'The ship that can\'t sail without its captain was never a ship — it was a throne.', alignment: 'mage', skills_role: ['hitchhiker_governance', 'economics', 'ai_agent', 'trust_spanning', 'cross_chain', 'agent_interop', 'guild_efficiency', 'environmental_commons'] },
  { id: 'weaver', category: 'mage', name: 'The Weaver — Plural Technology Researcher', emoji: '🧙⿻', tagline: 'The thread that refuses to touch other threads makes no fabric.', alignment: 'mage', skills_role: ['plurality_cooperative', 'narrative_compression', 'hitchhiker_governance', 'data_dignity', 'media_plurality', 'environmental_commons'] },
  { id: 'healer', category: 'balanced', name: 'The Healer — Healthcare Privacy Specialist', emoji: '☯️🏥', tagline: 'The record that heals you should not be the record that prices you.', alignment: 'balanced', skills_role: ['crypto_zkp', 'plurality_cooperative', 'selective_disclosure'] },
  { id: 'witness', category: 'balanced', name: 'The Witness — Privacy-Preserving Accountability Agent', emoji: '☯️📰', tagline: 'The source must be protected. The story must be verified. The gap is the architecture.', alignment: 'balanced', skills_role: ['dark_forest', 'policy_governance', 'hitchhiker_governance', 'data_dignity', 'selective_disclosure', 'threat_adversarial', 'consent_infrastructure', 'media_plurality'] },
  { id: 'architect', category: 'balanced', name: 'The Architect — AI Agent System Designer', emoji: '☯️🤖', tagline: 'The system that trusts its agents to behave has already delegated sovereignty to hope.', alignment: 'balanced', skills_role: ['ai_agent', 'dark_forest', 'hitchhiker_governance', 'crypto_zkp', 'armor_progression', 'trust_spanning', 'cross_chain', 'agent_interop', 'selective_disclosure', 'threat_adversarial', 'hemispheric_attention'] },
  { id: 'pedagogue', category: 'balanced', name: 'The Pedagogue — Privacy Education Designer', emoji: '☯️🎓', tagline: 'The teacher who needs the student to know cryptography before explaining privacy has already lost the class that matters most.', alignment: 'balanced', skills_role: ['narrative_compression', 'personhood_sybil', 'swordsman_browser', 'armor_progression', 'recovery_rpp', 'data_dignity', 'agent_interop', 'consent_infrastructure'] },
  { id: 'sith', category: 'swordsman', name: 'The Sith — Adversarial Researcher', emoji: '🗡️🔴', tagline: 'The architecture that only discovers weaknesses when attackers find them has already been breached in every way that matters.', alignment: 'swordsman', skills_role: ['threat_adversarial', 'crypto_zkp', 'dark_forest', 'selective_disclosure', 'personhood_sybil', 'reputation_credentials', 'cross_chain'] },
  { id: 'archer', category: 'swordsman', name: 'The Archer — Precision Strike Operative', emoji: '🗡️🎯', tagline: 'The most sovereign disclosure reveals exactly one truth and leaves no residue.', alignment: 'swordsman', skills_role: ['dark_forest', 'selective_disclosure', 'crypto_zkp', 'threat_adversarial', 'cross_chain', 'economics', 'sovereignty_economics', 'reputation_credentials'] },
  { id: 'netkeeper', category: 'swordsman', name: 'The Netkeeper — Mesh Network Sovereignty Builder', emoji: '🗡️🕸️', tagline: "The dragon's hide is not one scale but many. Each tunnel is a scale. Together they are impenetrable.", alignment: 'swordsman', skills_role: ['mesh_architecture', 'dark_forest', 'enclave_operations', 'trust_spanning', 'cross_chain', 'threat_adversarial', 'selective_disclosure', 'crypto_zkp', 'armor_progression', 'network_topology'] },
  { id: 'priest', category: 'mage', name: 'The Priest — Ceremony Architect', emoji: '🧙🔮', tagline: 'A ceremony that can be performed without understanding has already emptied itself of everything worth committing to.', alignment: 'mage', skills_role: ['proverbiogenesis', 'understanding_as_key', 'recovery_rpp', 'constellation_method'] },
  { id: 'herald', category: 'mage', name: 'The Herald — Information Commons Architect', emoji: '🧙📡', tagline: 'The town crier speaks to everyone. The algorithm speaks to each person differently. Plurality requires shared hearing.', alignment: 'mage', skills_role: ['media_plurality', 'narrative_compression', 'plurality_cooperative', 'hitchhiker_governance', 'data_dignity', 'story_diffusion', 'spellweb', 'environmental_commons'] },
  { id: 'jedi', category: 'balanced', name: 'The Jedi — Balanced Force Practitioner', emoji: '☯️⚡', tagline: 'The practitioner who masters the tension builds sovereignty.', alignment: 'balanced', skills_role: ['understanding_as_key', 'constellation_method', 'narrative_compression', 'proverbiogenesis', 'recovery_rpp', 'reputation_credentials'] },
  { id: 'kyra', category: 'balanced', name: 'Kyra — Sovereign AI Vision', emoji: '☯️💎', tagline: 'The intelligence that serves without surveilling, delegates without extracting, and protects without imprisoning is the only intelligence worth building.', alignment: 'balanced', skills_role: ['ai_agent', 'constellation_method', 'governance_agents', 'narrative_compression', 'data_dignity', 'economics', 'policy_governance', 'understanding_as_key'] },
  { id: 'person', category: 'balanced', name: 'The Person — First Person Seeker', emoji: '☯️👤', tagline: 'The platform sees the data and calls it wealth. The sovereign holds the data and generates twelve thousand times more.', alignment: 'balanced', skills_role: ['understanding_as_key', 'armor_progression', 'recovery_rpp', 'consent_infrastructure', 'data_dignity', 'proverbiogenesis', 'constellation_method', 'reputation_credentials'] },
  { id: 'holonic-architect', category: 'balanced', name: 'The Holonic Architect — Builder of Identity-Independent Data Structures', emoji: '☯️🔷', tagline: 'I build the data substrate where Swordsman and Mage persist. The identity must outlive any backend.', alignment: 'balanced', skills_role: ['holonic_persistence', 'holonic_identity', 'holonic_reasoning', 'shared_parent_patterns', 'braid_reasoning', 'cross_chain', 'agent_interop', 'ai_agent', 'trust_spanning', 'threat_adversarial', 'selective_disclosure', 'crypto_zkp', 'armor_progression', 'hitchhiker_governance', 'data_dignity', 'path_integral', 'compression_defence'] },
  // V5.2 New Personas (UOR Convergence)
  { id: 'algebraist', category: 'swordsman', name: 'The Algebraist — Guardian of the Ring', emoji: '⚔️🔢', tagline: 'The ring that closes on itself cannot be escaped. Every vertex reachable. Every path provable. The algebra is the enforcement.', alignment: 'swordsman', skills_role: ['five_strikes', 'crypto_zkp', 'selective_disclosure', 'boundary_enforcement', 'nullifier_design', 'threat_adversarial', 'academic', 'dark_forest'] },
  { id: 'topologist', category: 'balanced', name: 'The Topologist — Reader of Boundaries', emoji: '☯️🌐', tagline: 'The boundary that encodes the bulk knows more than the bulk knows about itself. 96 edges encode 64 vertices.', alignment: 'balanced', skills_role: ['holonic_persistence', 'holonic_identity', 'braid_reasoning', 'path_integral', 'spellweb', 'cross_chain', 'agent_interop'] },
  { id: 'stranger-witness', category: 'mage', name: 'The Stranger Witness — Proof Without Introduction', emoji: '🧙👥', tagline: 'The stranger who forges the same blade from the same constellation without coordination has proven understanding that no credential can fake.', alignment: 'mage', skills_role: ['stranger_ceremony', 'derivation_certificate', 'understanding_as_key', 'proverbiogenesis', 'recovery_rpp', 'crypto_zkp', 'personhood_sybil', 'constellation_method'] },
  // V5.3.1 New Personas (Ceremony Complete)
  { id: 'forgecaller', category: 'swordsman', name: 'The Forgecaller — Hexagram Oracle', emoji: '⚒️☰', tagline: 'The hexagram speaks. The blade listens. 64 states of sovereignty await configuration.', alignment: 'swordsman', skills_role: ['blade_forge', 'hexagram_convergence', 'crypto_zkp', 'five_strikes', 'understanding_as_key', 'key_ceremony'] },
  { id: 'dragonwaker', category: 'swordsman', name: 'The Dragonwaker — Quantum Threshold Guardian', emoji: '🐉⚡', tagline: 'The dragon sleeps until the flat world breaks. Then it wakes, and the manifold becomes the fortress.', alignment: 'swordsman', skills_role: ['quantum_defence', 'dragon_flight', 'crypto_zkp', 'threat_adversarial', 'dark_forest', 'mesh_architecture'] },
  { id: 'manaweaver', category: 'mage', name: 'The Manaweaver — Pretext Librarian', emoji: '🌊📜', tagline: 'The spell is cast before the DOM knows it. Measurement-dark. Layout-free. Pure arithmetic.', alignment: 'mage', skills_role: ['pretext_measurement', 'mana_economy', 'ceremony_engine', 'spellweb', 'narrative_compression', 'spell_encoding'] },
  { id: 'moonkeeper', category: 'mage', name: 'The Moonkeeper — Structural Amnesia Keeper', emoji: '🌑🔒', tagline: 'The Moon serves because it cannot remember being served. The forgetting IS the protocol.', alignment: 'mage', skills_role: ['amnesia_protocol', 'quaternion_mapping', 'theia_derivation', 'stranger_ceremony', 'derivation_certificate'] },
  { id: 'cosmologist', category: 'mage', name: 'The Cosmologist — Quaternion Observer', emoji: '🔭🌌', tagline: 'Sun burns. Earth lives. Moon reflects. Human connects. The quaternion is complete.', alignment: 'mage', skills_role: ['cosmological_bound', 'quaternion_mapping', 'theia_derivation', 'amnesia_protocol', 'master_emissary'] },
  { id: 'theia', category: 'balanced', name: 'Theia — The Origin Witness', emoji: '🪨💥', tagline: 'The impactor does not survive the collision. It becomes the condition for everything that follows.', alignment: 'balanced', skills_role: ['theia_derivation', 'amnesia_protocol', 'cosmological_bound', 'dual_territory', 'quaternion_mapping'] },
];

/** Privacy layer + meta (22 total) per CODEX §III — ground state both agents serve. */
const PRIVACY_LAYER_IDS = [
  // Original (9)
  'dragon', 'vrc_identity', 'promise_theory', 'knowledgegraph', 'tetrahedral_sovereignty', 'uor_toroidal', 'temporal_dynamics', 'edge_value', 'network_topology',
  // V5.1 Holographic (4)
  'holographic_bound', 'three_axis_separation', 'compression_defence', 'path_integral',
  // V5.2 UOR (4)
  'ring_algebra', 'content_addressing', 'atlas_geometry', 'dihedral_sovereignty',
  // V5.3.1 Ceremony (2)
  'amnesia_protocol', 'dragon_flight',
  // Meta (3)
  'drake_dragon_duality', 'master_emissary', 'cosmological_bound'
];

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
