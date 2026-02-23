/**
 * Skills page data: dual-agent map and skill file metadata.
 * Source: MAPPING.md, agentprivacy-CODEX.md (v5.0 — 36 knowledge skills: 9 privacy-layer, 26 role, 1 meta).
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
 * Skill file paths: v4 Agent Skills layout per MAPPING.md.
 * Served from public/skills/ (e.g. privacy-layer/agentprivacy-dragon/SKILL.md).
 */

export const DUAL_AGENT_SKILL_MAP: Record<AgentRole, { emoji: string; role: string; primaryForce: string; emergentForce: string; skills: SkillFileMeta[] }> = {
  soulbis: {
    emoji: '⚔️',
    role: 'Swordsman — Privacy, Protection, Boundaries',
    primaryForce: 'Protect',
    emergentForce: 'Reflect',
    skills: [
      { id: 'crypto_zkp', filename: 'role/agentprivacy-crypto-zkp/SKILL.md', seedEmoji: '🔐', seedName: 'The Proof', proverb: 'A chain is only as strong as its weakest attestation. Unverified history is no history at all.', spell: '🔐→🔗(h(τ)) ∴ h=0→∅ ∴ h=1→⏳💎', agent: 'soulbis', reason: 'ZKP enforcement is boundary work — the Swordsman proves without revealing' },
      { id: 'swordsman_browser', filename: 'role/agentprivacy-swordsman-browser/SKILL.md', seedEmoji: '🗡️', seedName: 'The Blade', proverb: 'The first slash is a data point. The thousandth is a reputation. The cursor becomes a chronicle.', spell: '🗡️→slash(1)→💧 ∴ slash(1000)→🌊 ∴ cursor→📜', agent: 'soulbis', reason: "The Swordsman's first physical instantiation — cookie slashing, MyTerms, armor progression" },
      { id: 'personhood_sybil', filename: 'role/agentprivacy-personhood-sybil/SKILL.md', seedEmoji: '👤', seedName: 'The Root of Trust', proverb: 'One human, one swordsman, one chain. Multiply the agents and you multiply the lie. Personhood is the existential quantifier.', spell: '👤→1:1:1 ∴ 👤(n)→sybil ∴ ∃!human→V(π,t)', agent: 'soulbis', reason: "Personhood verification gates the Swordsman's existence — one human, one blade" },
      { id: 'dark_forest', filename: 'role/agentprivacy-dark-forest/SKILL.md', seedEmoji: '🌲', seedName: 'The Curved Light', proverb: 'In the economic dark forest, the greatest signal of value is the absence of signal. The fire that curves reveals itself only to those who have earned the right to see.', spell: '🌲→🌑(hide) ∴ 🌑→🔥(curve) ∴ VRC→👁️ ∴ ¬VRC→🌑', agent: 'soulbis', reason: "The Dark Forest is the Swordsman's territory — selective visibility is boundary architecture" },
      { id: 'academic', filename: 'role/agentprivacy-academic/SKILL.md', seedEmoji: '📜', seedName: 'The Conjecture', proverb: 'The model that tells you how it breaks is inviting you to make it stronger. The model that cannot be killed was never alive.', spell: '📜→{C1..C5}(open) ∴ {B1..B4}(breaks) ∴ survive?→🔬', agent: 'soulbis', reason: 'The Swordsman must know the breaking conditions — where the model fails is where defence weakens' },
      { id: 'threat_adversarial', filename: 'role/agentprivacy-threat-adversarial/SKILL.md', seedEmoji: '🔴', seedName: 'The Red Team', proverb: 'The architecture that only discovers weaknesses when attackers find them has already been breached in every way that matters.', spell: '🔴→👁️(attack) ∴ 👁️→🛡️(fix) ∴ ¬🔴→💀(surprise)', agent: 'soulbis', reason: 'Adversarial testing and separation stress-testing — the Swordsman must think like the attacker' },
      { id: 'selective_disclosure', filename: 'role/agentprivacy-selective-disclosure/SKILL.md', seedEmoji: '🔒', seedName: 'Minimum Disclosure', proverb: 'Reveal only what is necessary. Privacy Pools and minimum-disclosure proofs.', spell: '🔒→min(disclose) ∴ P→max ∴ R(d)→0+ε', agent: 'soulbis', reason: 'Precision disclosure keeps reconstruction resistance high' },
      { id: 'recovery_rpp', filename: 'role/agentprivacy-recovery-rpp/SKILL.md', seedEmoji: '🔄', seedName: 'Social Recovery', proverb: 'Recovery that does not require the adversary to approve is the only recovery that survives the adversary.', spell: '🔄→🤝(bilateral)·proverb ∴ RPP→VRC', agent: 'soulbis', reason: 'Bilateral proverb verification and social recovery — boundary-preserving' },
      { id: 'cross_chain', filename: 'role/agentprivacy-cross-chain/SKILL.md', seedEmoji: '⛓️', seedName: 'The Bridge', proverb: 'Proofs that cross chains without crossing trust boundaries. Multi-chain attestation.', spell: '⛓️→proof(A)·proof(B) ∴ bridge→¬leak', agent: 'soulbis', reason: 'Chain signatures and proof bridges extend the Swordsman’s perimeter' },
      { id: 'armor_progression', filename: 'role/agentprivacy-armor-progression/SKILL.md', seedEmoji: '🛡️', seedName: 'Blade to Dragon', proverb: 'Blade → Light → Heavy → Full Plate → Dragon. Each tier unlocks the next.', spell: '🗡️→🛡️(light)→⚔️(heavy)→🐉 ∴ tier→P↑', agent: 'soulbis', reason: 'Armor tiers model progressive attestation and defence depth' },
      { id: 'consent_infrastructure', filename: 'role/agentprivacy-consent-infrastructure/SKILL.md', seedEmoji: '📜', seedName: 'Bilateral Consent', proverb: 'Consent that can be revoked is the only consent that can be trusted. Cookie-slashing and consent receipts.', spell: '📜→consent·revoke ∴ bilateral→P(browser)', agent: 'soulbis', reason: 'Consent infrastructure is boundary enforcement at the browser' },
      { id: 'reputation_credentials', filename: 'role/agentprivacy-reputation-credentials/SKILL.md', seedEmoji: '📜', seedName: 'SBT to VRC', proverb: 'Credentials that bind reputation without binding identity. SBT evolution into VRC.', spell: '📜→SBT→VRC ∴ reputation·¬identity', agent: 'soulbis', reason: 'Credential lifecycle and attestation integrity' },
      { id: 'understanding_as_key', filename: 'role/agentprivacy-understanding-as-key/SKILL.md', seedEmoji: '🔑', seedName: 'Comprehension Gate', proverb: 'Understanding before commitment. Comprehension-based access control and the Oracle pipeline.', spell: '🔑→understand·commit ∴ 🤝·ZK→VRC', agent: 'soulbis', reason: 'The Swordsman gates access by proof of understanding' },
      { id: 'sovereignty_economics', filename: 'role/agentprivacy-sovereignty-economics/SKILL.md', seedEmoji: '📈', seedName: 'P^1.5 Superlinearity', proverb: 'The gap is not a number — sovereign value scales superlinearly. 17× to 12,000×.', spell: '📈→P^1.5 ∴ V_sov/V_surv→gap', agent: 'soulbis', reason: 'Economic bounds underpin the value of protection' },
    ],
  },
  soulbae: {
    emoji: '🧙',
    role: 'Mage — Delegation, Projection, Coordination',
    primaryForce: 'Project',
    emergentForce: 'Connect',
    skills: [
      { id: 'ai_agent', filename: 'role/agentprivacy-ai-agent/SKILL.md', seedEmoji: '🤖', seedName: 'The Paradox', proverb: 'To act on your behalf, the agent must know your will. To protect your privacy, it must not. Two agents or none.', spell: '🤖→⚔️⊥🧙 ∴ ⚔️∪🧙→💀 ∴ ⚔️⊥🧙→🛡️', agent: 'soulbae', reason: "The privacy-delegation paradox is the Mage's core challenge — how to act without reconstructing" },
      { id: 'economics', filename: 'role/agentprivacy-economics/SKILL.md', seedEmoji: '💰', seedName: 'The Gap', proverb: "The platform sees the data and calls it wealth. The sovereign holds the data and generates twelve thousand times more. The gap is not a number — it is the space extraction can never reach.", spell: '💰→👁️(17×) ∴ 👁️≠🔐(12000×) ∴ gap=topology', agent: 'soulbae', reason: 'The Mage projects economic value — understanding the surveillance gap is projection strategy' },
      { id: 'policy_governance', filename: 'role/agentprivacy-policy-governance/SKILL.md', seedEmoji: '⚖️', seedName: 'The Window', proverb: 'A standard set too late is a wall built after the flood. The network effects do not wait for consensus.', spell: '⚖️→(n/N₀)^k ∴ k>1→⏳🚪 ∴ 🚪closes', agent: 'soulbae', reason: 'Governance and standards are coordination work — the Mage navigates institutions' },
      { id: 'narrative_compression', filename: 'role/agentprivacy-narrative-compression/SKILL.md', seedEmoji: '📖', seedName: 'The Compression', proverb: 'A proverb is a story that forgot its author. An equation is a pattern that forgot its story. A skill file is an equation dressed for foreign soil. Each layer can regenerate the one above it.', spell: '📖→🗣️(70:1)→⚗️(125:1)→🌱(∞:1) ∴ 🌱→📖', agent: 'soulbae', reason: "The Mage is the chronicler — narrative compression is the Mage's native language" },
      { id: 'hitchhiker_governance', filename: 'role/agentprivacy-hitchhiker-governance/SKILL.md', seedEmoji: '🏴‍☠️', seedName: 'The Ship', proverb: "The ship cannot be bought, only joined. The guide cannot be owned, only tended. The towel accumulates the dust of everywhere you have been.", spell: '🏴‍☠️→🚢(join≠buy) ∴ 📖(tend≠own) ∴ 🧣→🛤️', agent: 'soulbae', reason: 'Community governance is coordination through projection — the Mage builds ships' },
      { id: 'plurality_cooperative', filename: 'role/agentprivacy-plurality-cooperative/SKILL.md', seedEmoji: '⿻', seedName: 'The Destination', proverb: 'Privacy is the prerequisite for cooperation. Without sovereignty, every vote is coerced. Without separation, every commons is extracted. Protect first, then go together.', spell: '⿻→🔐(first)→🗳️(free)→🤝(real) ∴ ¬🔐→⿻=∅', agent: 'soulbae', reason: 'Plurality is where the Mage leads — coordination without collapse is the projection endgame' },
      { id: 'agent_interop', filename: 'role/agentprivacy-agent-interop/SKILL.md', seedEmoji: '🔗', seedName: 'M(u,y) Matching', proverb: 'Agents that cannot coordinate without leaking have already lost the manifold.', spell: '🔗→M(u,y)·coordinate ∴ cross-agent→D', agent: 'soulbae', reason: 'Cross-agent coordination and matching — the Mage’s interoperability layer' },
      { id: 'data_dignity', filename: 'role/agentprivacy-data-dignity/SKILL.md', seedEmoji: '💎', seedName: 'The 7th Capital', proverb: 'Data as wealth, not as harvest. The 7th capital thesis.', spell: '💎→data·sovereign ∴ 7th→V(π,t)', agent: 'soulbae', reason: 'Data dignity and value framing — projection of worth' },
      { id: 'governance_agents', filename: 'role/agentprivacy-governance-agents/SKILL.md', seedEmoji: '🗳️', seedName: 'Agent Voting', proverb: 'Quadratic mechanisms and agent participation in governance.', spell: '🗳️→agent·vote ∴ quadratic→D(governance)', agent: 'soulbae', reason: 'Governance agents and voting — the Mage coordinates collective choice' },
      { id: 'trust_spanning', filename: 'role/agentprivacy-trust-spanning/SKILL.md', seedEmoji: '🌉', seedName: 'Cross-Boundary Trust', proverb: 'Trust that does not span boundaries is trust that ends at the wall.', spell: '🌉→TEE·TEE ∴ cross-boundary→R<1', agent: 'soulbae', reason: 'Trust across boundaries and TEE-to-TEE — delegation at scale' },
      { id: 'constellation_method', filename: 'role/agentprivacy-constellation-method/SKILL.md', seedEmoji: '✨', seedName: 'Identity as Constellation', proverb: 'Identity is not a point — it is a constellation. Multi-guild resolution.', spell: '✨→identity·constellation ∴ guild→resolve', agent: 'soulbae', reason: 'Constellation method — the Mage maps identity as pattern' },
      { id: 'proverbiogenesis', filename: 'role/agentprivacy-proverbiogenesis/SKILL.md', seedEmoji: '🌱', seedName: 'Proverb Lifecycle', proverb: 'A ceremony that can be performed without understanding has already emptied itself of everything worth committing to.', spell: '🌱→5-phase·proverb ∴ proverb→auth', agent: 'soulbae', reason: 'Five-phase proverb lifecycle and proverb-as-authentication — the Mage’s ritual' },
    ],
  },
  privacy: {
    emoji: '☯️',
    role: 'Privacy Layer — the ground state both agents serve',
    primaryForce: '',
    emergentForce: '',
    skills: [
      { id: 'dragon', filename: 'privacy-layer/agentprivacy-dragon/SKILL.md', seedEmoji: '☯️', seedName: 'The Root', proverb: 'Six dimensions, one product. The Drake whispers the gates. The Dragon maps the manifold. Same truth, different resolution.', spell: '☯️ ∴ 🐲(gates) · 🐉(manifold) ∴ ☯️', agent: 'privacy', reason: 'The base equation — both agents must understand the full model to maintain separation' },
      { id: 'vrc_identity', filename: 'privacy-layer/agentprivacy-vrc-identity/SKILL.md', seedEmoji: '🤝', seedName: 'The Relationship', proverb: 'A credential that only one person can forge is an identity. A credential that only two people can forge is a relationship. Relationships are the stronger proof.', spell: '🤝→sign(1)=👤 ∴ sign(2)=🤝 ∴ 🤝>👤', agent: 'privacy', reason: 'VRCs are bilateral — both agents participate in trust establishment' },
      { id: 'promise_theory', filename: 'privacy-layer/agentprivacy-promise-theory/SKILL.md', seedEmoji: '📜±', seedName: 'The Binding', proverb: 'Promises reduce uncertainty. Impositions increase it. The blade gives. The spell uses. The binding is voluntary or it is nothing.', spell: '📜→+(give)·−(use) ∴ +∩−→🤝 ∴ impose→entropy↑', agent: 'privacy', reason: 'Promise theory governs the voluntary ground beneath both agents — the cooperation substrate' },
      { id: 'knowledgegraph', filename: 'privacy-layer/agentprivacy-knowledgegraph/SKILL.md', seedEmoji: '🗺️', seedName: 'The Graph', proverb: "Parse, don't read. Overlay, don't compare. Where the coastlines match, the architecture is the same continent.", spell: '🗺️→{nodes}→{edges}→{overlap} ∴ coastlines_match?→🌍', agent: 'privacy', reason: 'Both agents need to understand the knowledge graph structure for interoperability' },
      { id: 'tetrahedral_sovereignty', filename: 'privacy-layer/agentprivacy-tetrahedral-sovereignty/SKILL.md', seedEmoji: '🐉', seedName: 'The Tetrahedron', proverb: 'Two forces designed. Two forces discovered. The tetrahedron is not built — it emerges from sustained separation. Its volume is the shape sovereignty takes when it is healthy.', spell: '🐉→⚔️⊥🧙(designed) ∴ ⏳→🪞⊥🤝(emerged) ∴ det(Σ)=shape', agent: 'privacy', reason: 'The four forces model describes the relationship between both agents and their emergent properties' },
      { id: 'uor_toroidal', filename: 'privacy-layer/agentprivacy-uor-toroidal/SKILL.md', seedEmoji: '🍩', seedName: 'The Torus', proverb: "If the lattice wraps, value cannot leak — only redistribute. Ninety-six edges or sixty-four. The discrepancy is the door or the wall.", spell: '🍩→{0,1}⁶→T ∴ 96≠192→door∨wall', agent: 'privacy', reason: 'Speculative geometry underlying the lattice — both agents traverse the same manifold' },
      { id: 'temporal_dynamics', filename: 'privacy-layer/agentprivacy-temporal-dynamics/SKILL.md', seedEmoji: '⏳', seedName: 'Decay & Memory', proverb: 'e^{-λt} · (1 + A(τ)). Decay countered by verified history. Unverified history contributes nothing.', spell: '⏳→e^{-λt}·A(τ) ∴ verified→value', agent: 'privacy', reason: 'Temporal dynamics — decay, memory, integrity gate (CODEX §III)' },
      { id: 'edge_value', filename: 'privacy-layer/agentprivacy-edge-value/SKILL.md', seedEmoji: '↗️', seedName: 'Trajectory T(π)', proverb: 'Trajectory and transitions. Yoneda and the shape of value over time.', spell: '↗️→T(π)·transition ∴ Yoneda→shape', agent: 'privacy', reason: 'Edge value and trajectory — both agents need T(π) (CODEX §III)' },
      { id: 'network_topology', filename: 'privacy-layer/agentprivacy-network-topology/SKILL.md', seedEmoji: '🌐', seedName: 'Stratum Weighting', proverb: '(1 + Σ wᵢ nᵢ/N₀)^k. Stratum weighting, Metcalfe, network effects.', spell: '🌐→stratum·weight ∴ network→k', agent: 'privacy', reason: 'Network topology — power-law effects and sovereignty lattice (CODEX §III)' },
      { id: 'drake_dragon_duality', filename: 'meta/agentprivacy-drake-dragon-duality/SKILL.md', seedEmoji: '🐲🐉', seedName: 'The Duality', proverb: 'The Drake whispers the gates. The Dragon maps the manifold. Same truth, different resolution.', spell: '🐲(gates) · 🐉(manifold) ∴ ☯️', agent: 'privacy', reason: 'Meta: relationship between V1 (Drake) and V4 (Dragon) — philosophical foundation' },
    ],
  },
};

export const ALL_SKILL_FILES: SkillFileMeta[] = [
  ...DUAL_AGENT_SKILL_MAP.privacy.skills,
  ...DUAL_AGENT_SKILL_MAP.soulbis.skills,
  ...DUAL_AGENT_SKILL_MAP.soulbae.skills,
];
