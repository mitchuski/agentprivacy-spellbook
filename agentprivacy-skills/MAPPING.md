---
id: agent-skills-mapping
name: "Agent Skills Migration Mapping"
version: "5.2"
date: 2026-02-26
origin: 0xagentprivacy
total_skills: 78
includes_holonic: true
includes_braid: true
---

# Agent Skills Migration Mapping

Complete mapping from agentprivacy-spells-v50 internal format to Agent Skills standard.
Use this document to update webapp routing, imports, and skill discovery.

---

## Structure

```
agentprivacy-skills/
├── .claude-plugin/plugin.json
├── privacy-layer/     (9 foundational skills)
├── role/              (45 domain skills)  ← includes holonic (4) + braid (1)
├── meta/              (1 philosophical skill)
└── persona/           (23 persona skills)  ← includes holonic-architect
```

Each skill folder contains:
- `SKILL.md` — Required entrypoint with YAML frontmatter + instructions
- `references/` — Optional detailed docs loaded on demand
- `assets/` — Optional static resources (proverbs, spells, templates)

---

## Privacy Layer Skills (9)

Always loaded as ground state. Every term of V(π,t) covered.

| Old File | Agent Skills Name | Folder | Lines |
|----------|------------------|--------|-------|
| `dragon.skills.md` | `agentprivacy-dragon` | `privacy-layer/agentprivacy-dragon/` | 116 |
| `edge_value.skills.md` | `agentprivacy-edge-value` | `privacy-layer/agentprivacy-edge-value/` | 106 |
| `knowledgegraph.skills.md` | `agentprivacy-knowledgegraph` | `privacy-layer/agentprivacy-knowledgegraph/` | 155 |
| `network_topology.skills.md` | `agentprivacy-network-topology` | `privacy-layer/agentprivacy-network-topology/` | 107 |
| `promise_theory.skills.md` | `agentprivacy-promise-theory` | `privacy-layer/agentprivacy-promise-theory/` | 83 |
| `temporal_dynamics.skills.md` | `agentprivacy-temporal-dynamics` | `privacy-layer/agentprivacy-temporal-dynamics/` | 96 |
| `tetrahedral_sovereignty.skills.md` | `agentprivacy-tetrahedral-sovereignty` | `privacy-layer/agentprivacy-tetrahedral-sovereignty/` | 97 |
| `uor_toroidal.skills.md` | `agentprivacy-uor-toroidal` | `privacy-layer/agentprivacy-uor-toroidal/` | 91 |
| `vrc_identity.skills.md` | `agentprivacy-vrc-identity` | `privacy-layer/agentprivacy-vrc-identity/` | 83 |

---

## Role Skills (45)

Domain knowledge loaded by persona on demand. Includes 4 holonic integration skills + 1 BRAID reasoning skill.

| Old File | Agent Skills Name | Folder | Lines |
|----------|------------------|--------|-------|
| `academic.skills.md` | `agentprivacy-academic` | `role/agentprivacy-academic/` | 100 |
| `agent_interop.skills.md` | `agentprivacy-agent-interop` | `role/agentprivacy-agent-interop/` | 107 |
| `ai_agent.skills.md` | `agentprivacy-ai-agent` | `role/agentprivacy-ai-agent/` | 90 |
| `armor_progression.skills.md` | `agentprivacy-armor-progression` | `role/agentprivacy-armor-progression/` | 111 |
| `consent_infrastructure.skills.md` | `agentprivacy-consent-infrastructure` | `role/agentprivacy-consent-infrastructure/` | 121 |
| `constellation_method.skills.md` | `agentprivacy-constellation-method` | `role/agentprivacy-constellation-method/` | 132 |
| `cross_chain.skills.md` | `agentprivacy-cross-chain` | `role/agentprivacy-cross-chain/` | 97 |
| `crypto_zkp.skills.md` | `agentprivacy-crypto-zkp` | `role/agentprivacy-crypto-zkp/` | 77 |
| `dark_forest.skills.md` | `agentprivacy-dark-forest` | `role/agentprivacy-dark-forest/` | 79 |
| `data_dignity.skills.md` | `agentprivacy-data-dignity` | `role/agentprivacy-data-dignity/` | 109 |
| `economics.skills.md` | `agentprivacy-economics` | `role/agentprivacy-economics/` | 92 |
| `governance_agents.skills.md` | `agentprivacy-governance-agents` | `role/agentprivacy-governance-agents/` | 132 |
| `hitchhiker_governance.skills.md` | `agentprivacy-hitchhiker-governance` | `role/agentprivacy-hitchhiker-governance/` | 94 |
| `narrative_compression.skills.md` | `agentprivacy-narrative-compression` | `role/agentprivacy-narrative-compression/` | 85 |
| `personhood_sybil.skills.md` | `agentprivacy-personhood-sybil` | `role/agentprivacy-personhood-sybil/` | 80 |
| `plurality_cooperative.skills.md` | `agentprivacy-plurality-cooperative` | `role/agentprivacy-plurality-cooperative/` | 76 |
| `policy_governance.skills.md` | `agentprivacy-policy-governance` | `role/agentprivacy-policy-governance/` | 75 |
| `proverbiogenesis.skills.md` | `agentprivacy-proverbiogenesis` | `role/agentprivacy-proverbiogenesis/` | 140 |
| `recovery_rpp.skills.md` | `agentprivacy-recovery-rpp` | `role/agentprivacy-recovery-rpp/` | 128 |
| `reputation_credentials.skills.md` | `agentprivacy-reputation-credentials` | `role/agentprivacy-reputation-credentials/` | 118 |
| `selective_disclosure.skills.md` | `agentprivacy-selective-disclosure` | `role/agentprivacy-selective-disclosure/` | 96 |
| `sovereignty_economics.skills.md` | `agentprivacy-sovereignty-economics` | `role/agentprivacy-sovereignty-economics/` | 131 |
| `swordsman_browser.skills.md` | `agentprivacy-swordsman-browser` | `role/agentprivacy-swordsman-browser/` | 84 |
| `threat_adversarial.skills.md` | `agentprivacy-threat-adversarial` | `role/agentprivacy-threat-adversarial/` | 123 |
| `trust_spanning.skills.md` | `agentprivacy-trust-spanning` | `role/agentprivacy-trust-spanning/` | 105 |
| `understanding_as_key.skills.md` | `agentprivacy-understanding-as-key` | `role/agentprivacy-understanding-as-key/` | 172 |
| `boundary_enforcement.skills.md` | `agentprivacy-boundary-enforcement` | `role/agentprivacy-boundary-enforcement/` | ~120 |
| `enclave_operations.skills.md` | `agentprivacy-enclave-operations` | `role/agentprivacy-enclave-operations/` | ~115 |
| `forensic_defense.skills.md` | `agentprivacy-forensic-defense` | `role/agentprivacy-forensic-defense/` | ~110 |
| `grimoire_navigation.skills.md` | `agentprivacy-grimoire-navigation` | `role/agentprivacy-grimoire-navigation/` | ~125 |
| `inscription_mechanics.skills.md` | `agentprivacy-inscription-mechanics` | `role/agentprivacy-inscription-mechanics/` | ~130 |
| `intel_pooling.skills.md` | `agentprivacy-intel-pooling` | `role/agentprivacy-intel-pooling/` | ~115 |
| `key_ceremony.skills.md` | `agentprivacy-key-ceremony` | `role/agentprivacy-key-ceremony/` | ~120 |
| `metadata_resistance.skills.md` | `agentprivacy-metadata-resistance` | `role/agentprivacy-metadata-resistance/` | ~110 |
| `nullifier_design.skills.md` | `agentprivacy-nullifier-design` | `role/agentprivacy-nullifier-design/` | ~105 |
| `perimeter_hardening.skills.md` | `agentprivacy-perimeter-hardening` | `role/agentprivacy-perimeter-hardening/` | ~115 |
| `revocation_mechanics.skills.md` | `agentprivacy-revocation-mechanics` | `role/agentprivacy-revocation-mechanics/` | ~120 |
| `separation_enforcement.skills.md` | `agentprivacy-separation-enforcement` | `role/agentprivacy-separation-enforcement/` | ~125 |
| `spell_encoding.skills.md` | `agentprivacy-spell-encoding` | `role/agentprivacy-spell-encoding/` | ~130 |
| `story_diffusion.skills.md` | `agentprivacy-story-diffusion` | `role/agentprivacy-story-diffusion/` | ~115 |
| *(holonic integration)* | `agentprivacy-holonic-persistence` | `role/agentprivacy-holonic-persistence/` | ~120 |
| *(holonic integration)* | `agentprivacy-holonic-identity` | `role/agentprivacy-holonic-identity/` | ~130 |
| *(holonic integration)* | `agentprivacy-holonic-reasoning` | `role/agentprivacy-holonic-reasoning/` | ~125 |
| *(holonic integration)* | `agentprivacy-shared-parent-patterns` | `role/agentprivacy-shared-parent-patterns/` | ~115 |
| *(BRAID integration)* | `agentprivacy-braid-reasoning` | `role/agentprivacy-braid-reasoning/` | ~200 |

---

## Meta Skill (1)

| Old File | Agent Skills Name | Folder | Lines |
|----------|------------------|--------|-------|
| `drake_dragon_duality.skills.md` | `agentprivacy-drake-dragon-duality` | `meta/agentprivacy-drake-dragon-duality/` | 56 |

---

## Persona Skills (23)

Behavioural configurations. Includes 1 holonic integration persona. Each persona folder contains:
- `SKILL.md` — Identity, operational patterns, skill guidance
- `references/constellation.md` — Spellbook path and example scenarios
- `references/interaction-model.md` — Persona-to-persona relationships
- `assets/proverb-and-spell.txt` — Canonical proverb and emoji spell

| Old File | Agent Skills Name | Wing | Folder | SKILL.md Lines |
|----------|------------------|------|--------|---------------|
| `agentprivacy_archer.skills.md` | `agentprivacy-archer` | swordsman | `persona/agentprivacy-archer/` | 182 |
| `agentprivacy_cipher.skills.md` | `agentprivacy-cipher` | swordsman | `persona/agentprivacy-cipher/` | 197 |
| `agentprivacy_gatekeeper.skills.md` | `agentprivacy-gatekeeper` | swordsman | `persona/agentprivacy-gatekeeper/` | 186 |
| `agentprivacy_ranger.skills.md` | `agentprivacy-ranger` | swordsman | `persona/agentprivacy-ranger/` | 188 |
| `agentprivacy_sentinel.skills.md` | `agentprivacy-sentinel` | swordsman | `persona/agentprivacy-sentinel/` | 200 |
| `agentprivacy_sith.skills.md` | `agentprivacy-sith` | swordsman | `persona/agentprivacy-sith/` | 177 |
| `agentprivacy_soulbis.skills.md` | `agentprivacy-soulbis` | swordsman | `persona/agentprivacy-soulbis/` | 195 |
| `agentprivacy_warden.skills.md` | `agentprivacy-warden` | swordsman | `persona/agentprivacy-warden/` | 182 |
| `agentprivacy_ambassador.skills.md` | `agentprivacy-ambassador` | mage | `persona/agentprivacy-ambassador/` | 196 |
| `agentprivacy_assessor.skills.md` | `agentprivacy-assessor` | mage | `persona/agentprivacy-assessor/` | 187 |
| `agentprivacy_chronicler.skills.md` | `agentprivacy-chronicler` | mage | `persona/agentprivacy-chronicler/` | 186 |
| `agentprivacy_priest.skills.md` | `agentprivacy-priest` | mage | `persona/agentprivacy-priest/` | 203 |
| `agentprivacy_shipwright.skills.md` | `agentprivacy-shipwright` | mage | `persona/agentprivacy-shipwright/` | 191 |
| `agentprivacy_soulbae.skills.md` | `agentprivacy-soulbae` | mage | `persona/agentprivacy-soulbae/` | 197 |
| `agentprivacy_weaver.skills.md` | `agentprivacy-weaver` | mage | `persona/agentprivacy-weaver/` | 185 |
| `agentprivacy_architect.skills.md` | `agentprivacy-architect` | balanced | `persona/agentprivacy-architect/` | 200 |
| `agentprivacy_healer.skills.md` | `agentprivacy-healer` | balanced | `persona/agentprivacy-healer/` | 185 |
| `agentprivacy_jedi.skills.md` | `agentprivacy-jedi` | balanced | `persona/agentprivacy-jedi/` | 198 |
| `agentprivacy_kyra.skills.md` | `agentprivacy-kyra` | balanced | `persona/agentprivacy-kyra/` | 198 |
| `agentprivacy_pedagogue.skills.md` | `agentprivacy-pedagogue` | balanced | `persona/agentprivacy-pedagogue/` | 199 |
| `agentprivacy_person.skills.md` | `agentprivacy-person` | balanced | `persona/agentprivacy-person/` | 195 |
| `agentprivacy_witness.skills.md` | `agentprivacy-witness` | balanced | `persona/agentprivacy-witness/` | 194 |
| *(holonic integration)* | `agentprivacy-holonic-architect` | balanced | `persona/agentprivacy-holonic-architect/` | ~200 |

---

## Naming Convention

All Agent Skills names follow the pattern: `agentprivacy-{name}`

- Underscores → hyphens: `crypto_zkp` → `agentprivacy-crypto-zkp`
- Persona prefix dropped: `agentprivacy_cipher.skills.md` → `agentprivacy-cipher`
- Folder name MUST match the `name:` field in SKILL.md frontmatter

## YAML Frontmatter Format

```yaml
---
name: agentprivacy-{skill-name}     # Required, max 64 chars
description: >                        # Required, max 1024 chars
  What this skill does and when to trigger it.
license: Apache-2.0                   # Optional
metadata:                             # Optional — all custom fields here
  version: "5.0"
  category: "swordsman|mage|balanced"
  tier: "0|1|2|3"
  emoji: "🗡️🔐"
  ens: "privacymixer.eth"
  origin: "agentprivacy.ai"
---
```

## Progressive Disclosure

1. **Startup:** Only `name` + `description` loaded (~100 tokens per skill)
2. **Activation:** Full `SKILL.md` loaded when skill triggered (<500 lines)
3. **On demand:** `references/` and `assets/` loaded only when needed

## Plugin Installation

**Claude Code:**
```
/plugin marketplace add mitchuski/agentprivacy-skills
/plugin install persona-skills@agentprivacy
/plugin install role-skills@agentprivacy
/plugin install privacy-layer-skills@agentprivacy
```

**Claude.ai:** Upload skill folders as custom skills in Projects.

**API:** Use `skills=["agentprivacy-cipher"]` parameter.

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [agentskills.io](https://agentskills.io)
