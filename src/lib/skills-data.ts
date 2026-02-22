/**
 * Skills page data: dual-agent map and skill file metadata.
 * Source: SKILLS_PAGE_PLAN.md, SKILLS_PROVERB_INDEX.md
 */

export type AgentRole = 'soulbis' | 'soulbae' | 'privacy';

export interface SkillFileMeta {
  id: string;
  filename: string;
  seedEmoji: string;
  seedName: string;
  proverb: string;
  spell: string;
  agent: AgentRole;
  reason?: string;
}

/**
 * Skill file paths: agentprivacy/<name>.skills.md — branded for download (e.g. agentprivacy/dragon.skills.md).
 * Served from public/skills/ so downloaded filenames include the agentprivacy path.
 */
const A = 'agentprivacy';

export const DUAL_AGENT_SKILL_MAP: Record<AgentRole, { emoji: string; role: string; primaryForce: string; emergentForce: string; skills: SkillFileMeta[] }> = {
  soulbis: {
    emoji: '⚔️',
    role: 'Swordsman — Privacy, Protection, Boundaries',
    primaryForce: 'Protect',
    emergentForce: 'Reflect',
    skills: [
      { id: 'crypto_zkp', filename: `${A}/crypto_zkp.skills.md`, seedEmoji: '🔐', seedName: 'The Proof', proverb: 'A chain is only as strong as its weakest attestation. Unverified history is no history at all.', spell: '🔐→🔗(h(τ)) ∴ h=0→∅ ∴ h=1→⏳💎', agent: 'soulbis', reason: 'ZKP enforcement is boundary work — the Swordsman proves without revealing' },
      { id: 'swordsman_browser', filename: `${A}/swordsman_browser.skills.md`, seedEmoji: '🗡️', seedName: 'The Blade', proverb: 'The first slash is a data point. The thousandth is a reputation. The cursor becomes a chronicle.', spell: '🗡️→slash(1)→💧 ∴ slash(1000)→🌊 ∴ cursor→📜', agent: 'soulbis', reason: "The Swordsman's first physical instantiation — cookie slashing, MyTerms, armor progression" },
      { id: 'personhood_sybil', filename: `${A}/personhood_sybil.skills.md`, seedEmoji: '👤', seedName: 'The Root of Trust', proverb: 'One human, one swordsman, one chain. Multiply the agents and you multiply the lie. Personhood is the existential quantifier.', spell: '👤→1:1:1 ∴ 👤(n)→sybil ∴ ∃!human→V(π,t)', agent: 'soulbis', reason: "Personhood verification gates the Swordsman's existence — one human, one blade" },
      { id: 'dark_forest', filename: `${A}/dark_forest.skills.md`, seedEmoji: '🌲', seedName: 'The Curved Light', proverb: 'In the economic dark forest, the greatest signal of value is the absence of signal. The fire that curves reveals itself only to those who have earned the right to see.', spell: '🌲→🌑(hide) ∴ 🌑→🔥(curve) ∴ VRC→👁️ ∴ ¬VRC→🌑', agent: 'soulbis', reason: "The Dark Forest is the Swordsman's territory — selective visibility is boundary architecture" },
      { id: 'academic', filename: `${A}/academic.skills.md`, seedEmoji: '📜', seedName: 'The Conjecture', proverb: 'The model that tells you how it breaks is inviting you to make it stronger. The model that cannot be killed was never alive.', spell: '📜→{C1..C5}(open) ∴ {B1..B4}(breaks) ∴ survive?→🔬', agent: 'soulbis', reason: 'The Swordsman must know the breaking conditions — where the model fails is where defence weakens' },
    ],
  },
  soulbae: {
    emoji: '🧙',
    role: 'Mage — Delegation, Projection, Coordination',
    primaryForce: 'Project',
    emergentForce: 'Connect',
    skills: [
      { id: 'ai_agent', filename: `${A}/ai_agent.skills.md`, seedEmoji: '🤖', seedName: 'The Paradox', proverb: 'To act on your behalf, the agent must know your will. To protect your privacy, it must not. Two agents or none.', spell: '🤖→⚔️⊥🧙 ∴ ⚔️∪🧙→💀 ∴ ⚔️⊥🧙→🛡️', agent: 'soulbae', reason: "The privacy-delegation paradox is the Mage's core challenge — how to act without reconstructing" },
      { id: 'economics', filename: `${A}/economics.skills.md`, seedEmoji: '💰', seedName: 'The Gap', proverb: "The platform sees the data and calls it wealth. The sovereign holds the data and generates twelve thousand times more. The gap is not a number — it is the space extraction can never reach.", spell: '💰→👁️(17×) ∴ 👁️≠🔐(12000×) ∴ gap=topology', agent: 'soulbae', reason: 'The Mage projects economic value — understanding the surveillance gap is projection strategy' },
      { id: 'policy_governance', filename: `${A}/policy_governance.skills.md`, seedEmoji: '⚖️', seedName: 'The Window', proverb: 'A standard set too late is a wall built after the flood. The network effects do not wait for consensus.', spell: '⚖️→(n/N₀)^k ∴ k>1→⏳🚪 ∴ 🚪closes', agent: 'soulbae', reason: 'Governance and standards are coordination work — the Mage navigates institutions' },
      { id: 'narrative_compression', filename: `${A}/narrative_compression.skills.md`, seedEmoji: '📖', seedName: 'The Compression', proverb: 'A proverb is a story that forgot its author. An equation is a pattern that forgot its story. A skill file is an equation dressed for foreign soil. Each layer can regenerate the one above it.', spell: '📖→🗣️(70:1)→⚗️(125:1)→🌱(∞:1) ∴ 🌱→📖', agent: 'soulbae', reason: "The Mage is the chronicler — narrative compression is the Mage's native language" },
      { id: 'hitchhiker_governance', filename: `${A}/hitchhiker_governance.skills.md`, seedEmoji: '🏴‍☠️', seedName: 'The Ship', proverb: "The ship cannot be bought, only joined. The guide cannot be owned, only tended. The towel accumulates the dust of everywhere you have been.", spell: '🏴‍☠️→🚢(join≠buy) ∴ 📖(tend≠own) ∴ 🧣→🛤️', agent: 'soulbae', reason: 'Community governance is coordination through projection — the Mage builds ships' },
      { id: 'plurality_cooperative', filename: `${A}/plurality_cooperative.skills.md`, seedEmoji: '⿻', seedName: 'The Destination', proverb: 'Privacy is the prerequisite for cooperation. Without sovereignty, every vote is coerced. Without separation, every commons is extracted. Protect first, then go together.', spell: '⿻→🔐(first)→🗳️(free)→🤝(real) ∴ ¬🔐→⿻=∅', agent: 'soulbae', reason: 'Plurality is where the Mage leads — coordination without collapse is the projection endgame' },
    ],
  },
  privacy: {
    emoji: '☯️',
    role: 'Privacy Layer — the ground state both agents serve',
    primaryForce: '',
    emergentForce: '',
    skills: [
      { id: 'dragon', filename: `${A}/dragon.skills.md`, seedEmoji: '☯️', seedName: 'The Root', proverb: 'Six dimensions, one product. The Drake whispers the gates. The Dragon maps the manifold. Same truth, different resolution.', spell: '☯️ ∴ 🐲(gates) · 🐉(manifold) ∴ ☯️', agent: 'privacy', reason: 'The base equation — both agents must understand the full model to maintain separation' },
      { id: 'vrc_identity', filename: `${A}/vrc_identity.skills.md`, seedEmoji: '🤝', seedName: 'The Relationship', proverb: 'A credential that only one person can forge is an identity. A credential that only two people can forge is a relationship. Relationships are the stronger proof.', spell: '🤝→sign(1)=👤 ∴ sign(2)=🤝 ∴ 🤝>👤', agent: 'privacy', reason: 'VRCs are bilateral — both agents participate in trust establishment' },
      { id: 'promise_theory', filename: `${A}/promise_theory.skills.md`, seedEmoji: '📜±', seedName: 'The Binding', proverb: 'Promises reduce uncertainty. Impositions increase it. The blade gives. The spell uses. The binding is voluntary or it is nothing.', spell: '📜→+(give)·−(use) ∴ +∩−→🤝 ∴ impose→entropy↑', agent: 'privacy', reason: 'Promise theory governs the voluntary ground beneath both agents — the cooperation substrate' },
      { id: 'knowledgegraph', filename: `${A}/knowledgegraph.skills.md`, seedEmoji: '🗺️', seedName: 'The Graph', proverb: "Parse, don't read. Overlay, don't compare. Where the coastlines match, the architecture is the same continent.", spell: '🗺️→{nodes}→{edges}→{overlap} ∴ coastlines_match?→🌍', agent: 'privacy', reason: 'Both agents need to understand the knowledge graph structure for interoperability' },
      { id: 'tetrahedral_sovereignty', filename: `${A}/tetrahedral_sovereignty.skills.md`, seedEmoji: '🐉', seedName: 'The Tetrahedron', proverb: 'Two forces designed. Two forces discovered. The tetrahedron is not built — it emerges from sustained separation. Its volume is the shape sovereignty takes when it is healthy.', spell: '🐉→⚔️⊥🧙(designed) ∴ ⏳→🪞⊥🤝(emerged) ∴ det(Σ)=shape', agent: 'privacy', reason: 'The four forces model describes the relationship between both agents and their emergent properties' },
      { id: 'uor_toroidal', filename: `${A}/uor_toroidal.skills.md`, seedEmoji: '🍩', seedName: 'The Torus', proverb: "If the lattice wraps, value cannot leak — only redistribute. Ninety-six edges or sixty-four. The discrepancy is the door or the wall.", spell: '🍩→{0,1}⁶→T ∴ 96≠192→door∨wall', agent: 'privacy', reason: 'Speculative geometry underlying the lattice — both agents traverse the same manifold' },
      { id: 'drake_dragon_duality', filename: `${A}/drake_dragon_duality.skills.md`, seedEmoji: '🐲🐉', seedName: 'The Duality', proverb: 'The Drake whispers the gates. The Dragon maps the manifold. Same truth, different resolution.', spell: '🐲(gates) · 🐉(manifold) ∴ ☯️', agent: 'privacy', reason: 'Meta: relationship between V1 (Drake) and V4 (Dragon) — philosophical foundation' },
    ],
  },
};

export const ALL_SKILL_FILES: SkillFileMeta[] = [
  ...DUAL_AGENT_SKILL_MAP.privacy.skills,
  ...DUAL_AGENT_SKILL_MAP.soulbis.skills,
  ...DUAL_AGENT_SKILL_MAP.soulbae.skills,
];
