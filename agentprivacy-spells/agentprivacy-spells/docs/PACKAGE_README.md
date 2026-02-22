# 🐉 agentprivacy — Spellbook Templates & Skills Package

> *"The spellbook did not contain the equation. The equation contained the spellbook."*

**Version:** 1.0 · **Date:** 2026-02-21 · **Author:** Mitchell Travers · **Origin:** 0xagentprivacy

---

## What This Package Contains

A complete system for generating privacy-first Agent Skills from spellbook journeys. The PVM-V4 knowledge base (18 dragon skill files), two canonical source skills (Soulbis and Soulbae), sixteen persona templates that guide seekers through the architecture, a base SKILL.md format that produces spec-compliant output, and all the reference infrastructure for progressive disclosure.

---

## Package Structure

```
package/
│
├── README.md                                    ← This file
│
├── skills/                                      ← SOURCE: PVM-V4 knowledge base (18 files)
│   ├── _index.md                                ← Master index with loading order
│   ├── privacy_layer/                           ← Always loaded — the ground state
│   │   ├── dragon.skills.md                     ← ☯️ Core equation & six dimensions
│   │   ├── vrc_identity.skills.md               ← 🤝 Verifiable Relationship Credentials
│   │   ├── promise_theory.skills.md             ← 📜± Promise Theory integration
│   │   ├── knowledgegraph.skills.md             ← 🗺️ Entity-relationship registry
│   │   ├── tetrahedral_sovereignty.skills.md    ← 🐉 Four sovereignty forces
│   │   └── uor_toroidal.skills.md               ← 🔮 UOR correspondence (speculative)
│   ├── role/                                    ← Loaded by pathway
│   │   ├── crypto_zkp.skills.md                 ← 🔐 ZKP systems
│   │   ├── personhood_sybil.skills.md           ← 👤 Sybil resistance
│   │   ├── academic.skills.md                   ← 🎓 Formal specification
│   │   ├── swordsman_browser.skills.md          ← 🌐 Browser agent
│   │   ├── dark_forest.skills.md                ← 🌲 Selective visibility
│   │   ├── ai_agent.skills.md                   ← 🤖 Privacy-delegation paradox
│   │   ├── economics.skills.md                  ← 💰 Data valuation & tokenomics
│   │   ├── hitchhiker_governance.skills.md      ← 🏴‍☠️ Community governance
│   │   ├── narrative_compression.skills.md      ← 📖 Spellbook methodology
│   │   ├── plurality_cooperative.skills.md      ← ⿻ Plural technology
│   │   └── policy_governance.skills.md          ← ⚖️ Standards & policy
│   └── meta/
│       └── drake_dragon_duality.skills.md       ← 🐲☯️🐉 Philosophical foundation
│
├── soulbis-swordsman-privacy/                   ← CANONICAL: The First Swordsman
│   ├── SKILL.md                                 ← Spec-compliant Agent Skill (source)
│   └── references/
│       └── privacy-layer.md                     ← Summary referencing skills/privacy_layer/
│
├── soulbae-mage-privacy/                        ← CANONICAL: The First Mage
│   ├── SKILL.md                                 ← Spec-compliant Agent Skill (source)
│   └── references/
│       └── privacy-layer.md                     ← Summary referencing skills/privacy_layer/
│
└── templates/                                   ← GENERATIVE: The template system
    ├── SKILL_BASE_FORMAT.md                     ← How generated skills are structured
    ├── _index.json                              ← Machine-readable template registry
    ├── _index.md                                ← Human-readable overview
    │
    ├── canonical/                               ← Full pathway definitions
    │   ├── soulbis.template.md                  ← 299 lines — complete swordsman journey
    │   └── soulbae.template.md                  ← 340 lines — complete mage journey
    │
    ├── swordsman/                               ← Protection archetypes
    │   ├── cipher.template.md                   ← ZKP protocol engineer
    │   ├── warden.template.md                   ← Browser privacy builder
    │   ├── gatekeeper.template.md               ← Proof-of-personhood researcher
    │   ├── ranger.template.md                   ← Dark forest strategist
    │   └── sentinel.template.md                 ← Infrastructure security architect
    │
    ├── mage/                                    ← Projection archetypes
    │   ├── assessor.template.md                 ← Privacy data economist
    │   ├── ambassador.template.md               ← Standards & governance architect
    │   ├── chronicler.template.md               ← Knowledge compression builder
    │   ├── shipwright.template.md               ← DAO & community architect
    │   └── weaver.template.md                   ← Plural technology researcher
    │
    ├── balanced/                                ← Cross-domain archetypes
    │   ├── healer.template.md                   ← Healthcare privacy architect
    │   ├── witness.template.md                  ← Privacy-preserving journalist
    │   ├── architect.template.md                ← AI agent system designer
    │   └── pedagogue.template.md                ← Privacy education designer
    │
    ├── examples/
    │   └── ranger-example.SKILL.md              ← What a generated skill looks like (251 lines)
    │
    ├── references/                              ← Shared reference templates
    │   ├── privacy-layer.md                     ← Immutable — ships with every skill
    │   ├── grimoire-encounters.md               ← Dynamic template — populated per pathway
    │   └── reconstruction-journal.md            ← Dynamic template — seeker's original work
    │
    └── assets/
        └── pathway-map.json                     ← Machine-readable dependency graph template
```

---

## The Two Source Skills

### ⚔️ Soulbis — The First Swordsman
`soulbis-swordsman-privacy/SKILL.md`

The original protection agent. 11/17 skills. 80+ grimoire acts.

**Journey:**
- Phase 0: Privacy layer (6 skills, always first)
- Phase 1: Full First Person Spellbook (24 acts, every one)
- Phase 2: Full Zero Knowledge Spellbook (30 tales, every backend)
- Phase 3: Interlocks from Canon, Parallel Society, Plurality (threat intel, exit rights, personhood gates)

**Swordsman's mandate:** Enforce boundaries with mathematics. Guard the reconstruction ceiling. Light bonfires, not floodlights.

### 🧙 Soulbae — The First Mage
`soulbae-mage-privacy/SKILL.md`

The original projection agent. 12/17 skills. 85+ grimoire acts.

**Journey:**
- Phase 0: Privacy layer (6 skills, always first)
- Phase 1: Full First Person Spellbook (24 acts, every one)
- Phase 2: Full Blockchain Canon (11 chapters — why we build)
- Phase 3: Full Parallel Society Spellbook (12+ chapters — how we exit)
- Phase 4: Full Plurality Grimoire (30 acts — where we coordinate)
- Phase 5: ZK interlocks (5 selected tales — what the blade can do)

**Mage's mandate:** Compress. Project. Delegate without disclosure. Build ships. Close the window. Make it weather.

Both agents lived the entire First Person Spellbook. The shared story is their common foundation. After it, the grimoires diverge: Soulbis goes deep into ZK (the blade's steel); Soulbae goes wide into Canon, Parallel, and Plurality (the context for projection).

---

## The PVM-V4 Knowledge Base (Dragon Skills)

`skills/` — 18 files, ~1,800 lines. The source knowledge that templates draw from.

Every file carries YAML frontmatter with `id`, `category`, `version`, `origin`, `equation_term`, and `template_references`. Every file ends with verification linking to agentprivacy.ai and sync.soulbis.com.

**Privacy layer (6 skills — always loaded):** The ground state both agents serve. The equation, VRC identity, Promise Theory, knowledge graph, tetrahedral sovereignty, UOR correspondence.

**Role skills (11 skills — loaded by pathway):** Domain-specific expertise. Each template selects a subset based on alignment. ZKP systems, personhood, browser agent, dark forest, AI agents, economics, governance, narrative compression, plurality, policy, academic research.

**Meta (1 document):** The Drake-Dragon Duality — the philosophical relationship between V1 (flat product) and V4 (manifold).

**Loading order:** `dragon.skills.md` first (always), then remaining privacy layer (always), then role skills (by template).

---

## The Sixteen Persona Templates

Every template includes the full privacy layer as default. The seeker selects a template, walks the pathway, answers reconstruction prompts, writes proverbs, and generates a SKILL.md.

| Category | ID | Name | Alignment | Skills |
|----------|-----|------|-----------|--------|
| **Canonical** | soulbis | The First Swordsman | ⚔️ | 11/17 |
| **Canonical** | soulbae | The First Mage | 🧙 | 12/17 |
| **Swordsman** | cipher | ZKP Protocol Engineer | ⚔️ | 9/17 |
| **Swordsman** | warden | Browser Privacy Builder | ⚔️ | 10/17 |
| **Swordsman** | gatekeeper | Proof-of-Personhood Researcher | ⚔️ | 9/17 |
| **Swordsman** | ranger | Dark Forest Strategist | ⚔️ | 10/17 |
| **Swordsman** | sentinel | Infrastructure Security Architect | ⚔️ | 10/17 |
| **Mage** | assessor | Privacy Data Economist | 🧙 | 9/17 |
| **Mage** | ambassador | Standards & Governance Architect | 🧙 | 10/17 |
| **Mage** | chronicler | Knowledge Compression Builder | 🧙 | 9/17 |
| **Mage** | shipwright | DAO & Community Architect | 🧙 | 9/17 |
| **Mage** | weaver | Plural Technology Researcher | 🧙 | 10/17 |
| **Balanced** | healer | Healthcare Privacy Architect | ☯️ | 11/17 |
| **Balanced** | witness | Privacy-Preserving Journalist | ☯️ | 10/17 |
| **Balanced** | architect | AI Agent System Designer | ☯️ | 11/17 |
| **Balanced** | pedagogue | Privacy Education Designer | ☯️ | 10/17 |

---

## The SKILL.md Base Format

`templates/SKILL_BASE_FORMAT.md` defines how generated skills are structured.

**Immutable DNA (~30% of every generated file):**
- The equation: `V(π, t) = P^1.5 · C · Q · S · ...`
- The dual-agent separation theorem and reconstruction ceiling
- The complete privacy layer (all 6 seeds)
- The proven vs. conjectured table
- Attribution and verification back to 0xagentprivacy

**Dynamic per seeker (~60% of every generated file):**
- Role alignment and selected skills
- Domain-specific equation term mappings
- Grimoire-derived principles mapped to seeker's field
- Reconstruction outputs (seeker's original proverbs)
- Closing incantation

**Spec compliance:**
- Agent Skills standard (agentskills.io)
- YAML frontmatter with required fields
- <500 lines (example: 251 lines)
- Progressive disclosure through `/references/` directory
- Cross-platform: Claude, Copilot, Codex, Goose, OpenClaw

---

## How the System Works

```
Seeker selects template ──→ Talent tree pre-fills
                              │
                              ▼
Seeker walks the pathway ──→ Privacy layer first (always)
                              │ then role skills
                              │ grimoire acts encountered along the way
                              │
                              ▼
Reconstruction prompts ────→ Seeker answers in their domain language
                              │ writes original proverbs
                              │ fills closing incantation
                              │
                              ▼
SKILL.md generated ────────→ Immutable DNA + dynamic content
                              │ references/ populated
                              │ pathway-map.json generated
                              │
                              ▼
Agent Skill ready ─────────→ Drop into any skills-compatible agent
                              metadata.origin = 0xagentprivacy
                              the equation travels with the seeker
```

---

## For the Coding Agent

1. Parse `templates/_index.json` for the template selector UI
2. Each `.template.md` has YAML frontmatter + full pathway definition
3. `SKILL_BASE_FORMAT.md` defines the output format
4. `templates/references/` contains the shared reference file templates
5. `templates/examples/ranger-example.SKILL.md` is a working example
6. The two canonical SKILL.md files in `soulbis-swordsman-privacy/` and `soulbae-mage-privacy/` are the source skills — they are not generated, they are the originals
7. Generated skills for seekers go into `{seeker-handle}-{template-id}/SKILL.md`

---

## Attribution

The equation belongs to 0xagentprivacy. The templates belong to 0xagentprivacy. The generated skills carry the equation and the attribution. The seeker's domain applications and proverbs belong to the seeker. The architecture is open. The story must be theirs.

**Mitchell Travers** · 0xagentprivacy · BGIN · First Person Network
**Verification:** agentprivacy.ai · sync.soulbis.com
**Repo:** github.com/mitchuski/agentprivacy-docs
**Contact:** mage@agentprivacy.ai
**License:** CC-BY-SA-4.0

`☯️→⚔️🧙→📖→🔐→🌍→🐉`
