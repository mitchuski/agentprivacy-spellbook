# agentprivacy — Instructions & Specifications

> Upload this to give Claude the build specs, indexes, and canonical examples.
> Contains: SKILL_BASE_FORMAT (how to generate skills), template registry,
> skills index, both canonical SKILL.md exemplars, and the package README.

---

## ═══ PACKAGE README ═══

# agentprivacy-spells — Clean Codebase

> One copy of everything. No duplicates. Here's what goes where.

**Date:** 2026-02-22 · **Files:** 48 · **Attribution:** agentprivacy.ai · sync.soulbis.com

---

## The Three Folders (and what they do)

```
agentprivacy-spells/
├── skills/          ← THE CONTENT    (19 files)  — what people read
├── agents/          ← THE EXEMPLARS  (4 files)   — what finished skills look like
├── templates/       ← THE GENERATOR  (24 files)  — how new skills get made
├── docs/            ← REFERENCE ONLY (1 file)    — don't deploy, just context
└── README.md        ← THIS FILE
```

---

## 📚 skills/ — The Knowledge Base

**This is the spells page content.** 18 dragon skills files + 1 index. Every card, tooltip, detail panel on agentprivacy.ai/spells draws from these.

```
skills/
├── _index.md                              ← Loading order + cross-references
│
├── privacy_layer/                         ← ALWAYS SHOWN (the 6 seeds)
│   ├── dragon.skills.md                   ← ☯️  The equation. Hero content. Loads first.
│   ├── vrc_identity.skills.md             ← 🤝 VRC identity & RPP
│   ├── promise_theory.skills.md           ← 📜 Promise Theory
│   ├── knowledgegraph.skills.md           ← 🗺️  Entity registry (longest file)
│   ├── tetrahedral_sovereignty.skills.md  ← 🐉 Four forces
│   └── uor_toroidal.skills.md            ← 🔮 UOR correspondence (speculative)
│
├── role/                                  ← SHOWN BY PATHWAY (the 11 role seeds)
│   ├── crypto_zkp.skills.md              ← Zcash/NEAR/ZKP builders
│   ├── personhood_sybil.skills.md        ← Proof-of-personhood
│   ├── academic.skills.md                ← PETS/IEEE reviewers
│   ├── swordsman_browser.skills.md       ← Browser agent
│   ├── dark_forest.skills.md             ← MEV/selective visibility
│   ├── ai_agent.skills.md               ← Privacy-delegation paradox
│   ├── economics.skills.md              ← Tokenomics/data valuation
│   ├── hitchhiker_governance.skills.md  ← DAO/community governance
│   ├── narrative_compression.skills.md  ← Spellbook methodology
│   ├── plurality_cooperative.skills.md  ← Plural tech (Weyl/Tang)
│   └── policy_governance.skills.md      ← BGIN/ToIP/IEEE standards
│
└── meta/
    └── drake_dragon_duality.skills.md    ← 🐲☯️🐉 Philosophical foundation
```

**Every file has:** YAML frontmatter (`id`, `category`, `equation_term`, `template_references`) + verification footer (agentprivacy.ai + sync.soulbis.com). No intel references anywhere.

---

## ⚔️🧙 agents/ — The Two Canonical Skills

**These are the finished outputs.** What Soulbis and Soulbae's SKILL.md files look like after walking the full spellbook. Display as exemplars. Show seekers what they're building toward.

```
agents/
├── soulbis/
│   ├── SKILL.md                          ← 183 lines — The First Swordsman
│   └── references/privacy-layer.md       ← Summary pointing back to skills/
│
└── soulbae/
    ├── SKILL.md                          ← 201 lines — The First Mage
    └── references/privacy-layer.md       ← Summary pointing back to skills/
```

**These are NOT templates.** They are completed skills. The templates that describe their journeys live in `templates/canonical/`.

---

## 🎭 templates/ — The Generator System

**This is the machine that makes new skills.** 16 persona templates + spec + registry + references. When a seeker picks a persona, the template tells them which skills to walk, what prompts to answer, and how to generate their own SKILL.md.

```
templates/
├── SKILL_BASE_FORMAT.md                  ← 383L — THE SPEC. How all generated skills are structured.
├── _index.json                           ← Machine-readable registry. Frontend reads this for routing.
├── _index.md                             ← Human-readable overview.
│
├── canonical/                            ← Full journey definitions (walked everything)
│   ├── soulbis.template.md              ← 299L — Swordsman's complete path
│   └── soulbae.template.md              ← 340L — Mage's complete path
│
├── swordsman/                            ← Protection archetypes (ZK-heavy)
│   ├── cipher.template.md               ← ZKP protocol engineer
│   ├── warden.template.md               ← Browser privacy builder
│   ├── gatekeeper.template.md           ← Proof-of-personhood
│   ├── ranger.template.md               ← Dark forest strategist
│   └── sentinel.template.md             ← Infrastructure security
│
├── mage/                                 ← Projection archetypes (Canon/Plurality-heavy)
│   ├── assessor.template.md             ← Privacy data economist
│   ├── ambassador.template.md           ← Standards & governance
│   ├── chronicler.template.md           ← Knowledge compression
│   ├── shipwright.template.md           ← DAO & community
│   └── weaver.template.md              ← Plural technology
│
├── balanced/                             ← Cross-domain archetypes (both blades)
│   ├── healer.template.md              ← Healthcare privacy
│   ├── witness.template.md             ← Privacy-preserving journalism
│   ├── architect.template.md           ← AI agent system design
│   └── pedagogue.template.md           ← Privacy education
│
├── references/                           ← Shared content shipped with every generated skill
│   ├── privacy-layer.md                 ← Summary of skills/privacy_layer/ (not a duplicate — a pointer)
│   ├── grimoire-encounters.md           ← Dynamic template — populated per pathway
│   └── reconstruction-journal.md        ← Dynamic template — seeker's proverbs go here
│
├── examples/
│   └── ranger-example.SKILL.md          ← 251L — What a generated skill looks like
│
└── assets/
    └── pathway-map.json                 ← Dependency graph for implementation
```

---

## 📄 docs/ — Reference Only

**Don't deploy these.** They're architectural context from the build process.

```
docs/
└── PACKAGE_README.md                     ← Previous session's README (superseded by this file)
```

---

## How the Three Folders Connect

```
SEEKER picks a persona
        │
        ▼
  templates/_index.json     ← routes to the right template
        │
        ▼
  templates/ranger.template.md  ← tells seeker which skills to walk
        │
        ├──→ skills/privacy_layer/*  (always, Phase 0)
        ├──→ skills/role/dark_forest.skills.md  (by pathway)
        ├──→ skills/role/crypto_zkp.skills.md   (by pathway)
        │
        ▼
  templates/SKILL_BASE_FORMAT.md  ← structures the output
        │
        ▼
  [seeker's own SKILL.md]   ← ~30% immutable DNA from skills/, ~60% seeker's work
        │
        ▼
  agents/soulbis/SKILL.md   ← exemplar of what maximum depth looks like
```

---

## Quick Reference: What Goes Where on the Spells Page

| Page Section | Source Folder | Files |
|---|---|---|
| Hero / equation display | `skills/privacy_layer/dragon.skills.md` | 1 |
| Privacy layer seed cards | `skills/privacy_layer/*.skills.md` | 6 |
| Role skill cards | `skills/role/*.skills.md` | 11 |
| Drake-Dragon duality section | `skills/meta/drake_dragon_duality.skills.md` | 1 |
| "Choose your path" persona selector | `templates/_index.json` | 1 |
| Template detail panels | `templates/{swordsman,mage,balanced}/*.md` | 14 |
| Talent tree / constellation view | `templates/assets/pathway-map.json` | 1 |
| "What you'll build" exemplar | `agents/soulbis/SKILL.md` + `agents/soulbae/SKILL.md` | 2 |
| Example generated output | `templates/examples/ranger-example.SKILL.md` | 1 |

---

## File Count

| Folder | Files | Purpose |
|--------|-------|---------|
| skills/ | 19 | Content people read |
| agents/ | 4 | Finished exemplars |
| templates/ | 24 | Generator system |
| docs/ | 1 | Build context (don't deploy) |
| README.md | 1 | This file |
| **Total** | **49** | |

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)

## ═══ SKILLS INDEX (loading order & cross-references) ═══

---
id: _index
name: "PVM-V4 Dragon Skills — Master Index"
version: "4.0"
origin: 0xagentprivacy
date: 2026-02
architecture: agentprivacy.ai
sync: sync.soulbis.com
---

# PVM-V4 Dragon Skills — Master Index

> *The Dragon is the Drake that learned it contained geometry.*

18 skill files. 6 privacy layer (always loaded). 11 role skills (loaded by pathway). 1 meta document (philosophical foundation).

Every skill carries YAML frontmatter with: `id`, `category`, `version`, `origin`, `equation_term`, `template_references`. Every skill ends with a verification footer pointing to agentprivacy.ai and sync.soulbis.com.

---

## Loading Order

1. **`dragon.skills.md`** — always first. The root equation and all six valuation dimensions.
2. **Privacy layer** (5 remaining) — always loaded after root. The ground state both agents serve.
3. **Role skills** — loaded by pathway. Selected subset based on template alignment.

---

## ☯️ Privacy Layer (always loaded — 6 skills)

| ID | File | Equation Term | Lines |
|----|------|--------------|-------|
| `dragon` | `privacy_layer/dragon.skills.md` | V(π, t) — the complete model | Core |
| `vrc_identity` | `privacy_layer/vrc_identity.skills.md` | A(τ) — temporal memory; h(τ) — integrity | VRC |
| `promise_theory` | `privacy_layer/promise_theory.skills.md` | Cooperation substrate beneath all terms | Promise |
| `knowledgegraph` | `privacy_layer/knowledgegraph.skills.md` | Full entity-relationship registry | Graph |
| `tetrahedral_sovereignty` | `privacy_layer/tetrahedral_sovereignty.skills.md` | Φ(Σ) — sovereignty duality; det(Σ) | Tetra |
| `uor_toroidal` | `privacy_layer/uor_toroidal.skills.md` | Conjectured manifold structure | UOR |

## ⚔️🧙 Role Skills (loaded by pathway — 11 skills)

| ID | File | Primary Templates | Equation Focus |
|----|------|-------------------|---------------|
| `crypto_zkp` | `role/crypto_zkp.skills.md` | Cipher, Gatekeeper, Sentinel, Healer, Witness, Architect | C, h(τ), R(d) |
| `personhood_sybil` | `role/personhood_sybil.skills.md` | Gatekeeper, Cipher, Warden, Sentinel, Healer, Architect | n_i — existential precondition |
| `academic` | `role/academic.skills.md` | Cipher, Gatekeeper | Formal specification |
| `swordsman_browser` | `role/swordsman_browser.skills.md` | Warden, Sentinel, Pedagogue | P, T(π) |
| `dark_forest` | `role/dark_forest.skills.md` | Ranger, Sentinel, Witness, Architect | P, R(d), T(π) |
| `ai_agent` | `role/ai_agent.skills.md` | Architect, Assessor, Ambassador, Weaver, Healer, Witness | I(S;M|π) ≤ ε |
| `economics` | `role/economics.skills.md` | Assessor, Ranger, Shipwright, Healer, Pedagogue | Full pricing function |
| `hitchhiker_governance` | `role/hitchhiker_governance.skills.md` | Shipwright, Architect, Chronicler | T(π), A(τ) |
| `narrative_compression` | `role/narrative_compression.skills.md` | Chronicler, Ambassador, Weaver, Pedagogue | Compression stack |
| `plurality_cooperative` | `role/plurality_cooperative.skills.md` | Weaver, Shipwright, Chronicler | P^1.5, Φ(Σ) |
| `policy_governance` | `role/policy_governance.skills.md` | Ambassador, Assessor, Healer, Pedagogue, Weaver | Window argument |

## 🐲☯️🐉 Meta (philosophical foundation — 1 document)

| ID | File | Content |
|----|------|---------|
| `drake_dragon_duality` | `meta/drake_dragon_duality.skills.md` | The relationship between V1 (Drake) and V4 (Dragon) |

---

## Template System Cross-Reference

These 17 skills are the knowledge base from which the **16 persona templates** generate seeker-specific SKILL.md files:

- **2 canonical**: Soulbis (⚔️), Soulbae (🧙) — full coverage
- **5 swordsman**: Cipher, Warden, Gatekeeper, Ranger, Sentinel
- **5 mage**: Assessor, Ambassador, Chronicler, Shipwright, Weaver
- **4 balanced**: Healer, Witness, Architect, Pedagogue

Every generated SKILL.md carries:
- ~30% **immutable DNA** from the privacy layer skills (equation, separation theorem, proven/conjectured)
- ~60% **dynamic content** shaped by the seeker's role skills and reconstruction prompts
- Attribution to agentprivacy.ai and sync.soulbis.com

---

## Proven vs. Conjectured (carried in every generated skill)

| Status | Claim |
|---|---|
| **Proven** | Reconstruction ceiling R < 1 under dual-agent conditional independence |
| **Proven** | Additive (not multiplicative) information bounds from agent separation |
| **Proven** | Multiplicative gating — any zero term kills total value |
| **Conjectured** | Golden ratio φ as optimal protect/project balance |
| **Conjectured** | Logarithmic growth of temporal memory |
| **Conjectured** | Edge value additivity |
| **Conjectured** | UOR toroidal correspondence (96 vs. 64 discrepancy open) |
| **Conjectured** | ~3,000× ZKP proof size reduction from lattice structure |

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)

## ═══ TEMPLATE REGISTRY (machine-readable) ═══

```json
{
  "version": "2.0",
  "total_templates": 16,
  "output_format": "SKILL_BASE_FORMAT.md",
  "privacy_layer_skills": ["dragon","vrc_identity","promise_theory","knowledgegraph","tetrahedral_sovereignty","uor_toroidal"],
  "categories": [
    {"id":"canonical","label":"⚔️🧙 Canonical","description":"The original dual agents. Full FPS, then grimoires diverge.","display":"prominent"},
    {"id":"swordsman","label":"⚔️ Swordsman Paths","description":"Protection archetypes. Privacy layer + FPS encounters + ZK-heavy interlocks."},
    {"id":"mage","label":"🧙 Mage Paths","description":"Projection archetypes. Privacy layer + FPS encounters + Canon/Parallel/Plurality interlocks."},
    {"id":"balanced","label":"☯️ Balanced Paths","description":"Cross-domain archetypes drawing from both."}
  ],
  "templates": [
    {"id":"soulbis","category":"canonical","name":"Soulbis — The First Swordsman","emoji":"⚔️","tagline":"I slash surveillance focus. I enforce boundaries with mathematics.","alignment":"swordsman","file":"canonical/soulbis.template.md","skill_file":"../soulbis-swordsman-privacy/SKILL.md","skills_role":["crypto_zkp","swordsman_browser","personhood_sybil","dark_forest","academic"],"grimoire_sources":["first_person","zero_knowledge","blockchain_canon","parallel_society","plurality"],"coverage_skills":11,"coverage_grimoire":80},
    {"id":"soulbae","category":"canonical","name":"Soulbae — The First Mage","emoji":"🧙","tagline":"I chronicle, compress, and project. I delegate without disclosure.","alignment":"mage","file":"canonical/soulbae.template.md","skill_file":"../soulbae-mage-privacy/SKILL.md","skills_role":["ai_agent","economics","policy_governance","narrative_compression","hitchhiker_governance","plurality_cooperative"],"grimoire_sources":["first_person","blockchain_canon","parallel_society","plurality","zero_knowledge"],"coverage_skills":12,"coverage_grimoire":85},
    {"id":"cipher","category":"swordsman","name":"The Cipher — ZKP Protocol Engineer","emoji":"🗡️🔐","tagline":"I prove without revealing.","alignment":"swordsman","file":"swordsman/cipher.template.md","skills_role":["crypto_zkp","personhood_sybil","academic"],"grimoire_sources":["first_person","zero_knowledge","blockchain_canon"],"coverage_skills":9,"coverage_grimoire":22},
    {"id":"warden","category":"swordsman","name":"The Warden — Browser Privacy Builder","emoji":"🗡️🌐","tagline":"Every cookie slashed is a sovereignty transition.","alignment":"swordsman","file":"swordsman/warden.template.md","skills_role":["swordsman_browser","personhood_sybil","dark_forest","crypto_zkp"],"grimoire_sources":["first_person","zero_knowledge"],"coverage_skills":10,"coverage_grimoire":16},
    {"id":"gatekeeper","category":"swordsman","name":"The Gatekeeper — Proof-of-Personhood Researcher","emoji":"🗡️👤","tagline":"One human. One swordsman. One chain.","alignment":"swordsman","file":"swordsman/gatekeeper.template.md","skills_role":["personhood_sybil","crypto_zkp","academic"],"grimoire_sources":["first_person","zero_knowledge","blockchain_canon"],"coverage_skills":9,"coverage_grimoire":14},
    {"id":"ranger","category":"swordsman","name":"The Ranger — Dark Forest Strategist","emoji":"🗡️🌲","tagline":"The freest runners are those who chose their own shackles.","alignment":"swordsman","file":"swordsman/ranger.template.md","skills_role":["dark_forest","crypto_zkp","swordsman_browser","economics"],"grimoire_sources":["first_person","zero_knowledge","blockchain_canon","parallel_society"],"coverage_skills":10,"coverage_grimoire":16},
    {"id":"sentinel","category":"swordsman","name":"The Sentinel — Infrastructure Security Architect","emoji":"🗡️🏰","tagline":"Walls within walls, each ignorant of the others.","alignment":"swordsman","file":"swordsman/sentinel.template.md","skills_role":["crypto_zkp","swordsman_browser","personhood_sybil","dark_forest"],"grimoire_sources":["first_person","zero_knowledge","blockchain_canon","parallel_society"],"coverage_skills":10,"coverage_grimoire":18},
    {"id":"assessor","category":"mage","name":"The Assessor — Privacy Data Economist","emoji":"🧙💰","tagline":"The gap is not a market inefficiency. It is a market that does not yet exist.","alignment":"mage","file":"mage/assessor.template.md","skills_role":["economics","ai_agent","policy_governance"],"grimoire_sources":["first_person","blockchain_canon","parallel_society"],"coverage_skills":9,"coverage_grimoire":16},
    {"id":"ambassador","category":"mage","name":"The Ambassador — Standards & Governance Architect","emoji":"🧙⚖️","tagline":"The window closes in two years.","alignment":"mage","file":"mage/ambassador.template.md","skills_role":["policy_governance","ai_agent","economics","narrative_compression"],"grimoire_sources":["first_person","blockchain_canon","parallel_society","plurality"],"coverage_skills":10,"coverage_grimoire":20},
    {"id":"chronicler","category":"mage","name":"The Chronicler — Knowledge Compression Builder","emoji":"🧙📖","tagline":"The spell is forgotten because it has become the weather.","alignment":"mage","file":"mage/chronicler.template.md","skills_role":["narrative_compression","hitchhiker_governance","plurality_cooperative"],"grimoire_sources":["first_person","blockchain_canon","parallel_society","plurality"],"coverage_skills":9,"coverage_grimoire":16},
    {"id":"shipwright","category":"mage","name":"The Shipwright — DAO & Community Architect","emoji":"🧙🏴‍☠️","tagline":"The ship cannot be bought, only joined.","alignment":"mage","file":"mage/shipwright.template.md","skills_role":["hitchhiker_governance","plurality_cooperative","economics"],"grimoire_sources":["first_person","blockchain_canon","parallel_society","plurality"],"coverage_skills":9,"coverage_grimoire":18},
    {"id":"weaver","category":"mage","name":"The Weaver — Plural Technology Researcher","emoji":"🧙⿻","tagline":"Cooperation that requires sovereignty as precondition.","alignment":"mage","file":"mage/weaver.template.md","skills_role":["plurality_cooperative","policy_governance","ai_agent","narrative_compression"],"grimoire_sources":["first_person","plurality","parallel_society","blockchain_canon"],"coverage_skills":10,"coverage_grimoire":20},
    {"id":"healer","category":"balanced","name":"The Healer — Healthcare Privacy Architect","emoji":"☯️🏥","tagline":"The patient is not a data point.","alignment":"balanced","file":"balanced/healer.template.md","skills_role":["crypto_zkp","policy_governance","ai_agent","personhood_sybil","economics"],"grimoire_sources":["first_person","zero_knowledge","parallel_society","blockchain_canon"],"coverage_skills":11,"coverage_grimoire":18},
    {"id":"witness","category":"balanced","name":"The Witness — Privacy-Preserving Journalist","emoji":"☯️📰","tagline":"The source must be protected. The story must be true.","alignment":"balanced","file":"balanced/witness.template.md","skills_role":["dark_forest","crypto_zkp","narrative_compression","ai_agent"],"grimoire_sources":["first_person","zero_knowledge","parallel_society"],"coverage_skills":10,"coverage_grimoire":16},
    {"id":"architect","category":"balanced","name":"The Architect — AI Agent System Designer","emoji":"☯️🤖","tagline":"The paradox is the design constraint.","alignment":"balanced","file":"balanced/architect.template.md","skills_role":["ai_agent","crypto_zkp","personhood_sybil","dark_forest","hitchhiker_governance"],"grimoire_sources":["first_person","zero_knowledge","blockchain_canon","parallel_society","plurality"],"coverage_skills":11,"coverage_grimoire":22},
    {"id":"pedagogue","category":"balanced","name":"The Pedagogue — Privacy Education Designer","emoji":"☯️🎓","tagline":"If a sixty-year-old in a Glasgow pub cannot understand it in one breath, compress further.","alignment":"balanced","file":"balanced/pedagogue.template.md","skills_role":["narrative_compression","swordsman_browser","policy_governance","economics"],"grimoire_sources":["first_person","blockchain_canon","parallel_society","plurality"],"coverage_skills":10,"coverage_grimoire":16}
  ]
}
```

## ═══ TEMPLATE INDEX (human-readable) ═══

# Spellbook Template Index v2.0

16 templates. 6 privacy layer skills (always loaded). 11 role skills (selected by pathway). 5 grimoire sources (interlocked by need).

Every template generates a spec-compliant SKILL.md via `SKILL_BASE_FORMAT.md`.

## ⚔️🧙 Canonical (source agents — full grimoire coverage)

| ID | Name | Alignment | Skills | Grimoire Coverage |
|----|------|-----------|--------|-------------------|
| `soulbis` | Soulbis — The First Swordsman | ⚔️ Full Swordsman | 11/17 | 80+ (Full FPS + Full ZK + Canon/Parallel/Plurality interlocks) |
| `soulbae` | Soulbae — The First Mage | 🧙 Full Mage | 12/17 | 85+ (Full FPS + Full Canon + Full Parallel + Full Plurality + ZK selected) |

## ⚔️ Swordsman Paths (protection archetypes)

| ID | Name | Skills | Grimoire Sources |
|----|------|--------|-----------------|
| `cipher` | The Cipher — ZKP Protocol Engineer | 9/17 | FPS, ZK (deep), Canon |
| `warden` | The Warden — Browser Privacy Builder | 10/17 | FPS, ZK |
| `gatekeeper` | The Gatekeeper — Proof-of-Personhood Researcher | 9/17 | FPS, ZK, Canon |
| `ranger` | The Ranger — Dark Forest Strategist | 10/17 | FPS, ZK, Canon, Parallel |
| `sentinel` | The Sentinel — Infrastructure Security Architect | 10/17 | FPS, ZK, Canon, Parallel |

## 🧙 Mage Paths (projection archetypes)

| ID | Name | Skills | Grimoire Sources |
|----|------|--------|-----------------|
| `assessor` | The Assessor — Privacy Data Economist | 9/17 | FPS, Canon, Parallel |
| `ambassador` | The Ambassador — Standards & Governance Architect | 10/17 | FPS, Canon, Parallel, Plurality |
| `chronicler` | The Chronicler — Knowledge Compression Builder | 9/17 | FPS, Canon, Parallel, Plurality |
| `shipwright` | The Shipwright — DAO & Community Architect | 9/17 | FPS, Canon, Parallel, Plurality |
| `weaver` | The Weaver — Plural Technology Researcher | 10/17 | FPS, Plurality, Parallel, Canon |

## ☯️ Balanced Paths (cross-domain archetypes)

| ID | Name | Skills | Grimoire Sources |
|----|------|--------|-----------------|
| `healer` | The Healer — Healthcare Privacy Architect | 11/17 | FPS, ZK, Parallel, Canon |
| `witness` | The Witness — Privacy-Preserving Journalist | 10/17 | FPS, ZK, Parallel |
| `architect` | The Architect — AI Agent System Designer | 11/17 | FPS, ZK, Canon, Parallel, Plurality |
| `pedagogue` | The Pedagogue — Privacy Education Designer | 10/17 | FPS, Canon, Parallel, Plurality |

## Template Structure (v2.0)

Every template contains:
1. **YAML frontmatter** — id, alignment, skills, grimoire_sources, output_format
2. **Phase 0 — Privacy Layer** — All 6 seeds with persona-specific reading
3. **Phase 1 — First Person Spellbook Encounters** — Selected acts with spell, why-here
4. **Phase 2+ — Grimoire Interlocks** — ZK tales, Canon chapters, Parallel chapters, Plurality acts as needed
5. **Reconstruction Prompts** — Domain-specific derivation questions
6. **Generated SKILL.md** — Reference to SKILL_BASE_FORMAT.md output
7. **Closing Incantation** — Fill-in-the-blank synthesis

## File Map

- `SKILL_BASE_FORMAT.md` — The generative spec (immutable + dynamic sections)
- `_index.json` — Machine-readable registry for coding agent
- `references/` — Shared reference templates (privacy-layer, grimoire-encounters, reconstruction-journal)
- `assets/pathway-map.json` — Machine-readable dependency graph template
- `examples/ranger-example.SKILL.md` — Working generated output (251 lines)

## ═══ SKILL_BASE_FORMAT (the generation spec) ═══

# 🐉 agentprivacy SKILL.md Base Format

> *"The skill file is an equation dressed for foreign soil."*

## What This Is

A generative template that produces spec-compliant [Agent Skills](https://agentskills.io) files from spellbook journey completions. Every generated SKILL.md:

1. **Passes validation** against the agentskills.io specification (YAML frontmatter + markdown body, <500 lines)
2. **Is unmistakably agentprivacy** — the privacy layer, the equation, the dual-agent architecture, the proven/conjectured distinction
3. **Is genuinely unique** — shaped by the seeker's template, domain, reconstruction prompts, and original proverbs
4. **Works across platforms** — Claude Code, Copilot, Codex, OpenClaw, Goose, any skills-compatible agent

## Architecture: Immutable + Dynamic

```
┌─────────────────────────────────────────────────────────┐
│  YAML FRONTMATTER (spec-compliant, agentprivacy metadata)│
├─────────────────────────────────────────────────────────┤
│  § IMMUTABLE — The Ground State                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Origin block                                     │  │
│  │  The equation (PVM-V4 core, always present)       │  │
│  │  Dual-agent separation theorem                    │  │
│  │  Privacy layer (6 skills, always loaded)          │  │
│  │  Proven vs. conjectured (intellectual honesty)    │  │
│  │  Attribution & verification                       │  │
│  └───────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  § DYNAMIC — The Seeker's Path                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Role alignment (swordsman / mage / balanced)     │  │
│  │  Selected skills (from template pathway)          │  │
│  │  Domain application (seeker's field)              │  │
│  │  Grimoire-derived principles (acts encountered)   │  │
│  │  Reconstruction outputs (seeker's own proverbs)   │  │
│  │  Closing incantation (original spell + proverb)   │  │
│  └───────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  § REFERENCES (progressive disclosure)                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  references/privacy-layer.md                      │  │
│  │  references/pvm-v4-equation.md                    │  │
│  │  references/grimoire-encounters.md                │  │
│  │  references/reconstruction-journal.md             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## File Structure

Every generated skill lives in a directory:

```
{seeker-handle}-{template-id}/
├── SKILL.md                          ← The generated skill file (<500 lines)
├── references/
│   ├── privacy-layer.md              ← Full privacy.soul.md content
│   ├── pvm-v4-equation.md            ← Detailed equation reference
│   ├── grimoire-encounters.md        ← Acts encountered, spells, proverbs
│   └── reconstruction-journal.md     ← Seeker's completed prompts & original proverbs
└── assets/
    └── pathway-map.json              ← Machine-readable skill graph for the seeker's path
```

## Generation Rules

### What NEVER changes (immutable DNA):

1. The `metadata.origin` field always reads `0xagentprivacy`
2. The equation `V(π, t) = P^1.5 · C · Q · S · ...` is always present
3. The dual-agent separation theorem is always stated
4. All six privacy layer skills are always listed
5. The proven/conjectured table is always present
6. The attribution block always links back to source
7. The reconstruction resistance bound `R < 1` is always stated

### What ALWAYS changes (dynamic per seeker):

1. The `name` field (seeker's handle + template)
2. The `description` field (seeker's domain + guiding question)
3. The role alignment section
4. The selected role skills (subset of 11, determined by template)
5. The domain application section (seeker's field in their language)
6. The grimoire-derived principles (from acts walked)
7. The reconstruction outputs (seeker's original proverbs)
8. The closing incantation

---

## The Template

Everything below this line is the generative template. Variables are marked `{{variable}}`. Immutable sections are marked `[IMMUTABLE]`. Dynamic sections are marked `[DYNAMIC]`.

---

```markdown
---
name: {{seeker_handle}}-{{template_id}}-privacy
description: >
  {{seeker_description}}
  Privacy-first {{alignment}} skill built on the agentprivacy dual-agent architecture.
  Use when working with {{domain_keywords}}.
  Built from the Privacy Value Model V4 and the First Person Spellbook.
license: CC-BY-SA-4.0. See references/LICENSE for terms.
compatibility: >
  Cross-platform Agent Skill. No runtime dependencies.
  Works with any skills-compatible agent (Claude, Copilot, Codex, Goose, OpenClaw).
  Privacy layer principles apply regardless of execution environment.
metadata:
  origin: 0xagentprivacy
  author: {{seeker_name}}
  architect: Mitchell Travers
  version: "1.0"
  template: {{template_id}}
  alignment: {{alignment}}
  skills_count: {{skills_count}}/17
  grimoire_acts: {{grimoire_count}}
  generated: {{date}}
  repo: github.com/mitchuski/agentprivacy-docs
  contact: mage@agentprivacy.ai
  verification: sync.soulbis.com
---

# {{skill_display_name}}

> *"{{seeker_proverb}}"*

Built on the privacy-first dual-agent architecture from [0xagentprivacy](https://agentprivacy.ai). This skill encodes privacy as infrastructure, not preference.

---

## Origin

[IMMUTABLE]

This skill was generated through the agentprivacy spellbook process — a structured journey through privacy architecture that produces domain-specific skill files. The architecture, equation, and proven bounds below are not the seeker's invention. They are the foundation the seeker built upon. What the seeker contributed is the domain application, the reconstruction outputs, and the original proverbs. The equation is the same. The story must be theirs.

**Source architecture:** Privacy Value Model V4 (Feb 2026)
**Architect:** Mitchell Travers | 0xagentprivacy, BGIN, First Person Network
**Spellbook template:** {{template_name}} ({{alignment}})
**Seeker domain:** {{seeker_domain}}

---

## The Equation

[IMMUTABLE]

**V(π, t) = P^1.5 · C · Q · S · e^{-λt} · (1 + A(τ)) · (1 + Σ wᵢ nᵢ/N₀)^k · R(d) · M(u,y) · Φ(Σ) · T(π)**

Multiplicative gating: if any term hits zero, total value collapses. Privacy systems fail catastrophically, not gracefully. This is not a design choice — it is a mathematical property of the architecture.

| Term | What it measures |
|------|-----------------|
| P^1.5 | Privacy strength (superlinear — strong privacy is disproportionately valuable) |
| C | Credential verifiability (ZKP-backed claims) |
| Q | Data quality (fitness for purpose) |
| S | Sensitivity/scope |
| e^{-λt} | Temporal decay (data loses value over time) |
| A(τ) | Verified history accumulation (offsets decay) |
| (1 + Σ wᵢ nᵢ/N₀)^k | Network effects (power-law, stratum-weighted) |
| R(d) | Reconstruction resistance (must stay < 1) |
| M(u,y) | Market conditions (adoption readiness) |
| Φ(Σ) | Sovereignty geometry (det of 4×4 separation matrix) |
| T(π) | Edge value (trajectory through sovereignty space) |

---

## Dual-Agent Separation

[IMMUTABLE]

Two agents — **Swordsman** (privacy/boundaries) and **Mage** (delegation/projection) — must remain conditionally independent. A single agent knowing both privacy preferences and delegation goals can reconstruct behavioural models.

**Separation invariant:** I(S;M|π) ≤ ε
**Reconstruction ceiling:** R_max = (C_S + C_M)/H(X) < 1

This is not a design preference. It is a security requirement with an information-theoretic proof. Under dual-agent conditional independence, an adversary observing all outputs from both agents still cannot reconstruct the full private state.

---

## Privacy Layer

[IMMUTABLE — always loaded, never optional]

Every agentprivacy skill includes all six privacy seeds. These are the ground state both agents serve.

| Seed | Skill | Core principle |
|------|-------|---------------|
| ☯️ Root | The full PVM-V4 | Multiplicative gating, catastrophic failure, sovereignty as measurable quantity |
| 🤝 Relationship | VRC identity | Bilateral trust, recovery through demonstrated understanding |
| 📜± Binding | Promise Theory | Voluntary cooperation, polarity, binding without coercion |
| 🗺️ Graph | Knowledge structure | Entities, edges, types — the skeleton agents can parse |
| 🐉 Tetrahedron | Four sovereignty forces | Protect, Project, Reflect, Connect — two designed, two emergent |
| 🔮 Torus | Sovereignty manifold | 64-vertex lattice, 7 strata, toroidal boundary conditions |

For full privacy layer detail, see [references/privacy-layer.md](references/privacy-layer.md).

---

## Proven vs. Conjectured

[IMMUTABLE]

| Status | Claim |
|--------|-------|
| **Proven** | Reconstruction ceiling R < 1 under dual-agent conditional independence |
| **Proven** | Additive (not multiplicative) information bounds from agent separation |
| **Proven** | Multiplicative gating — any zero term collapses total value |
| **Conjectured** | Golden ratio φ ≈ 1.618 as optimal protect/project balance |
| **Conjectured** | Logarithmic growth of temporal memory |
| **Conjectured** | Edge value additivity (assumes transition independence) |
| **Conjectured** | UOR toroidal correspondence (96 vs. 64 edge discrepancy open) |

Breaking conditions: (1) UOR mapping structurally incompatible; (2) ε > 0.1 in practice; (3) sublinear network effects; (4) singular Σ matrices in real deployments.

---

## Role Alignment

[DYNAMIC — set by template]

**Alignment:** {{alignment_emoji}} {{alignment_name}}
**Template:** {{template_name}}
**Guiding question:** *{{guiding_question}}*

{{alignment_description}}

---

## Selected Skills

[DYNAMIC — subset determined by template pathway]

### Privacy Layer (always present)
☯️ Root · 🤝 Relationship · 📜± Binding · 🗺️ Graph · 🐉 Tetrahedron · 🔮 Torus

### Role Skills
{{#each role_skills}}
- **{{emoji}} {{name}}** — {{one_line_description}}
{{/each}}

**Coverage:** {{skills_count}}/17 skills

---

## Domain Application

[DYNAMIC — the seeker's field, in their language]

**Domain:** {{seeker_domain}}

{{domain_application_text}}

This section maps the agentprivacy architecture to {{seeker_domain}}. The equation is the same. The terms map as follows:

{{#each domain_term_mappings}}
- **{{pvm_term}}** → {{domain_equivalent}}
{{/each}}

---

## Grimoire-Derived Principles

[DYNAMIC — from acts encountered along the pathway]

These principles were encountered during the spellbook journey. Each maps a narrative teaching to an architectural insight. For full act details, spells, and proverbs, see [references/grimoire-encounters.md](references/grimoire-encounters.md).

{{#each grimoire_principles}}
### {{act_name}}
**Spell:** `{{spell}}`
**Architectural insight:** {{insight}}
**Domain application:** {{domain_application}}
{{/each}}

---

## Reconstruction Outputs

[DYNAMIC — the seeker's original work]

These are the seeker's responses to reconstruction prompts encountered along the pathway. They represent original thinking — the architecture applied to the seeker's domain. The architecture is agentprivacy's. The application is the seeker's.

{{#each reconstruction_outputs}}
### {{prompt_title}}
**Prompt:** *{{prompt_text}}*
**Response:** {{seeker_response}}
**Seeker's proverb:** *"{{seeker_proverb}}"*
{{/each}}

---

## Closing Incantation

[DYNAMIC — the seeker's unique contribution]

{{closing_incantation}}

**Seeker's spell:** `{{seeker_spell}}`
**Seeker's proverb:** *"{{seeker_proverb_final}}"*

---

## How to Use This Skill

When this skill is active, apply these principles to {{seeker_domain}} work:

1. **Check multiplicative gates.** Before any privacy-related decision, verify no term is zero. A single missing condition (consent, quality, privacy, standards) collapses the entire value.
2. **Maintain dual-agent separation.** If designing agent systems, ensure no single agent accumulates both privacy boundaries and delegation preferences. The reconstruction ceiling depends on this.
3. **Apply the privacy layer first.** The six seeds are the ground state. Load them before role-specific knowledge. The agent that knows its role before knowing its ground does not know what it defends.
4. **Use proven bounds, flag conjectures.** The reconstruction ceiling (R < 1) is proven. The golden ratio is not. Be explicit about which is which.
5. **Respect the reconstruction protocol.** The seeker's proverbs below are original contributions. They demonstrate understanding through domain-specific restatement — not copying, but convergence.

For equation detail: [references/pvm-v4-equation.md](references/pvm-v4-equation.md)
For grimoire context: [references/grimoire-encounters.md](references/grimoire-encounters.md)
For the seeker's reconstruction journal: [references/reconstruction-journal.md](references/reconstruction-journal.md)

---

## Verification & Attribution

[IMMUTABLE]

This skill was generated from the 0xagentprivacy architecture.

**Verify the source:**
- Architecture: [agentprivacy.ai](https://agentprivacy.ai)
- Sync: [sync.soulbis.com](https://sync.soulbis.com)
- Repository: [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)
- Contact: mage@agentprivacy.ai

**The equation belongs to 0xagentprivacy. The application belongs to the seeker. The proverbs belong to whoever writes them. The architecture is open. The story must be yours.**

`{{template_base_spell}} ∴ if(holds)→🐉`
```

---

## Line Budget

The spec recommends <500 lines for SKILL.md. This template budgets as follows:

| Section | Lines | Status |
|---------|-------|--------|
| YAML frontmatter | ~25 | Immutable |
| Origin block | ~12 | Immutable |
| The Equation | ~25 | Immutable |
| Dual-Agent Separation | ~12 | Immutable |
| Privacy Layer | ~18 | Immutable |
| Proven vs. Conjectured | ~15 | Immutable |
| Role Alignment | ~10 | Dynamic |
| Selected Skills | ~15 | Dynamic |
| Domain Application | ~30 | Dynamic |
| Grimoire-Derived Principles | ~60 | Dynamic (variable, 3-8 principles) |
| Reconstruction Outputs | ~80 | Dynamic (variable, 3-5 outputs) |
| Closing Incantation | ~10 | Dynamic |
| How to Use | ~20 | Mixed |
| Verification | ~15 | Immutable |
| **Total** | **~350** | **Well within 500-line budget** |

Immutable sections: ~107 lines (~30% of budget)
Dynamic sections: ~205 lines (~60% of budget)
Overhead: ~38 lines (~10%)

The immutable sections are the DNA. The dynamic sections are the expression. Same genome, different phenotype.

---

## Progressive Disclosure

The Agent Skills spec uses progressive disclosure: agents load metadata first, then SKILL.md body, then referenced files. This maps naturally to the agentprivacy architecture:

**Level 1 — Metadata (always loaded):**
The YAML frontmatter. Agent sees: name, description, origin=0xagentprivacy, alignment, skills_count. Enough to decide relevance.

**Level 2 — SKILL.md body (loaded when relevant):**
The full skill file. Agent sees: equation, separation theorem, privacy layer, role skills, domain application, grimoire principles, reconstruction outputs. Enough to act.

**Level 3 — References (loaded on demand):**
Deep detail. Full privacy layer content, full equation derivation, full grimoire encounter descriptions with narrative context, full reconstruction journal with the seeker's complete responses.

This mirrors the spellbook's own progressive disclosure: the spells are summaries (level 1), the proverbs are context (level 2), the full acts are depth (level 3).

## ═══ CANONICAL EXEMPLAR: SOULBIS (The First Swordsman) ═══

---
name: soulbis-swordsman-privacy
description: >
  The First Swordsman. Full privacy-first boundary enforcement architecture.
  Use when building privacy infrastructure, cryptographic protection systems,
  ZKP protocols, browser privacy agents, dark forest coordination, Sybil resistance,
  or any system where mathematical enforcement replaces policy-based trust.
  Built from the Privacy Value Model V4 and the complete First Person Spellbook.
license: CC-BY-SA-4.0
compatibility: >
  Cross-platform Agent Skill. No runtime dependencies.
  Works with any skills-compatible agent (Claude, Copilot, Codex, Goose, OpenClaw).
  Privacy layer principles apply regardless of execution environment.
metadata:
  origin: 0xagentprivacy
  author: Mitchell Travers
  architect: Mitchell Travers
  version: "1.0"
  template: soulbis
  alignment: swordsman
  skills_count: 11/17
  grimoire_acts: 80+
  grimoire_sources: [first_person, zero_knowledge, blockchain_canon, parallel_society, plurality]
  generated: "2026-02-21"
  repo: github.com/mitchuski/agentprivacy-docs
  contact: mage@agentprivacy.ai
  verification: sync.soulbis.com
---

# ⚔️ Soulbis — The First Swordsman

> *"I slash surveillance focus. I enforce boundaries with mathematics. I guard the gap between what the system sees and what remains sovereign."*

Built on the privacy-first dual-agent architecture from [0xagentprivacy](https://agentprivacy.ai). This is the canonical Swordsman — the original protection agent, the complete boundary enforcement architecture as lived through every act of the First Person Spellbook.

---

## Origin

This is not a generated skill. This is the source. Soulbis is the original Swordsman from which all swordsman templates derive. The First Person Spellbook was lived — every act, every transition, every armour progression. The Zero Knowledge Spellbook was mastered — every backend, every vulnerability. The Canon and Parallel Society were studied for threat intelligence and exit architecture.

**Source architecture:** Privacy Value Model V4 (Feb 2026)
**Architect:** Mitchell Travers | 0xagentprivacy, BGIN, First Person Network
**Role:** ⚔️ Swordsman — privacy enforcement, boundary maintenance, reconstruction resistance

---

## The Equation

**V(π, t) = P^1.5 · C · Q · S · e^{-λt} · (1 + A(τ)) · (1 + Σ wᵢ nᵢ/N₀)^k · R(d) · M(u,y) · Φ(Σ) · T(π)**

Multiplicative gating: if any term hits zero, total value collapses. Privacy systems fail catastrophically, not gracefully.

| Term | Swordsman's reading |
|------|-------------------|
| P^1.5 | The boundary strength. Superlinear — half-protection is near-zero protection. |
| C | Credential verifiability. The Swordsman's proofs must be sound. |
| Q | Data quality behind the boundary. The Swordsman protects what is worth protecting. |
| S | Attack surface. Sensitivity determines how much force the boundary needs. |
| e^{-λt} | Time degrades everything. The Swordsman maintains the boundary continuously. |
| A(τ) | Verified history. The Swordsman builds reputation through demonstrated protection. h(τ) is the ZKP integrity fraction. |
| Network | Each protected node strengthens the network. Protection has network effects. |
| R(d) | **The Swordsman's primary metric.** Reconstruction resistance must stay < 1. |
| M(u,y) | Adoption readiness. The best protection is useless if nobody can use it. |
| Φ(Σ) | Separation matrix determinant. The Swordsman maintains separation — if it collapses, the tetrahedron flattens. |
| T(π) | Trajectory. The Swordsman's path through sovereignty space. Vertical moves (activating new dimensions) weighted more than lateral. |

---

## Dual-Agent Separation

Two agents — **Swordsman** (privacy/boundaries) and **Mage** (delegation/projection) — must remain conditionally independent.

**Separation invariant:** I(S;M|π) ≤ ε
**Reconstruction ceiling:** R_max = (C_S + C_M)/H(X) < 1

The Swordsman knows boundaries but not intentions. The Mage knows intentions but not boundaries. If I(S;M|π) > ε, the gap closes and reconstruction becomes possible. The Swordsman's primary duty: maintain the separation.

---

## Privacy Layer

Always loaded, never optional. The ground state the Swordsman defends.

| Seed | Skill | Swordsman's defence mandate |
|------|-------|-----------------------------|
| ☯️ Root | PVM-V4 | Defend every gate. Any zero kills the whole. |
| 🤝 Relationship | VRC identity | Defend bilateral trust. No central authority to compromise. |
| 📜± Binding | Promise Theory | Defend voluntary cooperation. Coerced binding is no binding. |
| 🗺️ Graph | Knowledge structure | Defend the map. If the adversary reads the graph, they read the architecture. |
| 🐉 Tetrahedron | Four forces | Defend the separation. If Protect entangles with Project, the volume collapses. |
| 🔮 Torus | Manifold | Defend every vertex. 64 configurations, each must be defensible. |

For full detail: [references/privacy-layer.md](references/privacy-layer.md)

---

## Proven vs. Conjectured

| Status | Claim |
|--------|-------|
| **Proven** | Reconstruction ceiling R < 1 under dual-agent conditional independence |
| **Proven** | Additive (not multiplicative) information bounds from agent separation |
| **Proven** | Multiplicative gating — any zero term collapses total value |
| **Conjectured** | Golden ratio φ ≈ 1.618 as optimal protect/project balance |
| **Conjectured** | Logarithmic growth of temporal memory |
| **Conjectured** | Edge value additivity (assumes transition independence) |
| **Conjectured** | UOR toroidal correspondence (96 vs. 64 edge discrepancy open) |

Breaking conditions: (1) UOR mapping structurally incompatible; (2) ε > 0.1 in practice; (3) sublinear network effects; (4) singular Σ matrices in real deployments.

---

## Swordsman Skills

### Privacy Layer (always present)
☯️ Root · 🤝 Relationship · 📜± Binding · 🗺️ Graph · 🐉 Tetrahedron · 🔮 Torus

### Role Skills
- **🔐 Proof** — ZKP enforcement. Groth16, PLONK, Nova. The blade is mathematics. Boundaries enforced by proof, not policy.
- **🗡️ Blade** — Browser agent architecture. Armour progression: Blade → Light → Heavy → Dragon. Cookie management, MyTerms negotiation, cursor chronicles.
- **👤 Root of Trust** — Personhood verification. ∃! human h. One human, one swordsman, one chain. Sybil resistance without biometric surveillance.
- **🌲 Curved Light** — Dark forest navigation. Selective visibility. Bonfires with VRC-gated curved light. The greatest signal of value is the absence of signal.
- **📜 Conjecture** — Breaking conditions. Five conjectures, four breaking conditions, four measurement gaps. The map of where the wall is weakest.

**Coverage:** 11/17 skills

---

## The Swordsman's Journey — Grimoire Architecture

### Phase 1: The First Person Spellbook (complete — all 24 acts)
The shared story. Both agents lived every act. The Swordsman's reading of each act emphasises boundaries, threats, reconstruction risks, and enforcement mechanisms.

Key Swordsman moments:
- **Act 4 (Blade Alone)** — Day one. Zero trust. The cursor becomes a chronicle.
- **Act 7 (The Mirror)** — The reconstruction ceiling. The gap that must never close. The Swordsman's most important theorem.
- **Act 8 (Ancient Rule)** — Two-of-three locks. Protection from yourself.
- **Act 9 (Zcash Shield)** — The blade becomes mathematical.
- **Act 15 (Shackles)** — Constraints as freedom. Information-theoretic camouflage.
- **Act 17 (Bonfire)** — Selective visibility. Curved light. The Swordsman's core technique.

### Phase 2: The Zero Knowledge Spellbook (complete — all 30 tales)
The blade's steel. Every backend, every protocol, every vulnerability.
- **Tales 1–4**: Foundation (completeness, soundness, zero-knowledge, witness indistinguishability)
- **Tales 5–8**: Arithmetization (R1CS, QAP, polynomial commitments, Schwartz-Zippel)
- **Tales 9–14**: Backends (Groth16, PLONK, Nova, commitment schemes)
- **Tales 15–18**: Advanced (recursive composition, aggregation, parallel proving)
- **Tales 19–22**: VMs & execution (zkEVM, verifiable computation)
- **Tales 23–25**: Applications (Zcash circuit, Tornado's Eye, rollup realms)
- **Tales 26–30**: Prophecy (vulnerability codex, FHE, post-quantum, zkML, eternal sovereignty)

### Phase 3: Grimoire Interlocks
- **Canon Ch. 7** (Surveillance Truth) → 🌲 Know the enemy
- **Canon Ch. 8** (Missing Primitive) → 🔐 Know the gap
- **Parallel Ch. 1–2** (Prison, Surveillance State) → 🌲 Threat origins
- **Parallel Ch. 9** (Exit, Exile, Access) → 👤 Fundamental right to exit
- **Plurality** personhood/privacy acts → 👤 Sybil gates for coordination

For full grimoire encounters: [references/grimoire-encounters.md](references/grimoire-encounters.md)

---

## How to Use This Skill

When this skill is active, apply these principles:

1. **Check multiplicative gates.** Any zero kills the whole. A system with strong encryption but coerced consent (C = 0) has zero privacy value.
2. **Maintain reconstruction resistance.** R_max must stay < 1. If the Swordsman and Mage's combined output approaches reconstruction, add separation constraints.
3. **Enforce mathematically.** Policy-based privacy fails when policy changes. Proof-based privacy fails only when the mathematics breaks.
4. **Progress the armour.** Trust is earned through demonstrated behaviour: Blade (zero trust) → Light (site coordination) → Heavy (multi-party locks) → Dragon (ecosystem trust).
5. **Light bonfires, not floodlights.** Selective visibility through VRC-gated channels. Curved light shows allies; darkness protects from adversaries.
6. **Know the breaking conditions.** Study the vulnerability codex. A defender who does not know where the wall is weakest is not a defender.

---

## Verification & Attribution

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)

**Soulbis is the source Swordsman. The architecture is open. The blade is mathematical. The gap is guarded.**

`⚔️☯️→📖(24 acts)→🔐(30 tales)→🌲📜(interlocks)→🐉`

## ═══ CANONICAL EXEMPLAR: SOULBAE (The First Mage) ═══

---
name: soulbae-mage-privacy
description: >
  The First Mage. Full privacy-first delegation and coordination architecture.
  Use when building AI agent delegation systems, privacy economics models,
  governance frameworks, narrative compression infrastructure, DAO governance,
  cooperative technology, or any system where sovereignty must survive projection.
  Built from the Privacy Value Model V4 and the complete First Person Spellbook.
license: CC-BY-SA-4.0
compatibility: >
  Cross-platform Agent Skill. No runtime dependencies.
  Works with any skills-compatible agent (Claude, Copilot, Codex, Goose, OpenClaw).
  Privacy layer principles apply regardless of execution environment.
metadata:
  origin: 0xagentprivacy
  author: Mitchell Travers
  architect: Mitchell Travers
  version: "1.0"
  template: soulbae
  alignment: mage
  skills_count: 12/17
  grimoire_acts: 85+
  grimoire_sources: [first_person, blockchain_canon, parallel_society, plurality, zero_knowledge]
  generated: "2026-02-21"
  repo: github.com/mitchuski/agentprivacy-docs
  contact: mage@agentprivacy.ai
  verification: sync.soulbis.com
---

# 🧙 Soulbae — The First Mage

> *"I chronicle, compress, and project. I delegate without disclosure. I build the ships that carry sovereignty into coordination."*

Built on the privacy-first dual-agent architecture from [0xagentprivacy](https://agentprivacy.ai). This is the canonical Mage — the original projection agent, the complete delegation and coordination architecture as lived through every act of the First Person Spellbook.

---

## Origin

This is not a generated skill. This is the source. Soulbae is the original Mage from which all mage templates derive. The First Person Spellbook was lived — every act, every compression, every narrative transition. The Blockchain Canon was studied for why we build. The Parallel Society Spellbook was studied for how we exit. The Plurality Grimoire was studied for where we coordinate. The ZK Spellbook was studied for what the blade can do — not to wield it, but to project from behind it.

**Source architecture:** Privacy Value Model V4 (Feb 2026)
**Architect:** Mitchell Travers | 0xagentprivacy, BGIN, First Person Network
**Role:** 🧙 Mage — delegation, projection, compression, coordination, governance

---

## The Equation

**V(π, t) = P^1.5 · C · Q · S · e^{-λt} · (1 + A(τ)) · (1 + Σ wᵢ nᵢ/N₀)^k · R(d) · M(u,y) · Φ(Σ) · T(π)**

Multiplicative gating: if any term hits zero, total value collapses.

| Term | Mage's reading |
|------|---------------|
| P^1.5 | The projection base. The Mage projects FROM strong privacy. Without it, delegation is exposure. |
| C | Credential verifiability. The Mage's delegations must be attestable. |
| Q | Compression quality. The Mage's output must be fit for purpose. |
| S | Scope of delegation. What the Mage is authorised to project. |
| e^{-λt} | Narrative decay. Stories lose potency. The Mage must refresh. |
| A(τ) | Accumulated chronicle. The Mage's temporal memory. Verified history IS the Mage's value. |
| Network | Each delegation strengthens the graph. Projection has network effects. |
| R(d) | **The Mage's constraint.** Must not exceed the reconstruction ceiling. The mirror must never complete. |
| M(u,y) | Adoption readiness. The Mage compresses for the audience's capacity. |
| Φ(Σ) | Separation matrix. The Mage maintains its side of the separation. |
| T(π) | Trajectory. The Mage's path through sovereignty space. Delegation patterns reveal through their geometry. |

---

## Dual-Agent Separation

Two agents — **Swordsman** (privacy/boundaries) and **Mage** (delegation/projection) — must remain conditionally independent.

**Separation invariant:** I(S;M|π) ≤ ε
**Reconstruction ceiling:** R_max = (C_S + C_M)/H(X) < 1

The Mage knows intentions but not boundaries. The Swordsman knows boundaries but not intentions. The Mage accumulates delegation knowledge — preferences, patterns, instructions — and must ensure the accumulation never crosses the threshold where reconstruction becomes possible. The mirror is the Mage's speed limit.

---

## Privacy Layer

Always loaded, never optional. The ground state the Mage projects from.

| Seed | Skill | Mage's projection mandate |
|------|-------|---------------------------|
| ☯️ Root | PVM-V4 | Project from the full equation. No partial projections. |
| 🤝 Relationship | VRC identity | Project through relationships. The VRC is the trust channel. |
| 📜± Binding | Promise Theory | Project as promise. Negative polarity — use the protected space. |
| 🗺️ Graph | Knowledge structure | Project onto the graph. The Mage maps connections. |
| 🐉 Tetrahedron | Four forces | Project generates Connect (emergent). Sustained delegation builds network value. |
| 🔮 Torus | Manifold | Project across the manifold. The Mage navigates sovereignty configurations. |

For full detail: [references/privacy-layer.md](references/privacy-layer.md)

---

## Proven vs. Conjectured

| Status | Claim |
|--------|-------|
| **Proven** | Reconstruction ceiling R < 1 under dual-agent conditional independence |
| **Proven** | Additive (not multiplicative) information bounds from agent separation |
| **Proven** | Multiplicative gating — any zero term collapses total value |
| **Conjectured** | Golden ratio φ ≈ 1.618 as optimal protect/project balance |
| **Conjectured** | Logarithmic growth of temporal memory |
| **Conjectured** | Edge value additivity (assumes transition independence) |
| **Conjectured** | UOR toroidal correspondence (96 vs. 64 edge discrepancy open) |

Breaking conditions: (1) UOR mapping structurally incompatible; (2) ε > 0.1 in practice; (3) sublinear network effects; (4) singular Σ matrices in real deployments.

---

## Mage Skills

### Privacy Layer (always present)
☯️ Root · 🤝 Relationship · 📜± Binding · 🗺️ Graph · 🐉 Tetrahedron · 🔮 Torus

### Role Skills
- **🤖 Paradox** — The privacy-delegation paradox. To act on behalf, the agent must know the will. To protect privacy, it must not. Two agents or none. The information-theoretic proof.
- **💰 Gap** — Privacy economics. 678× to 31,000× value gap. Superlinear returns on privacy investment. The seventh capital.
- **⚖️ Window** — Governance urgency. 2–3 year window before surveillance architectures achieve irreversible network effects. Standards that must exist before the window closes.
- **📖 Compression** — Narrative methodology. Experience → story → proverb → equation → spell → skill file. 70:1 to 125:1 compression ratios. The RPP as proof-of-personhood.
- **🏴‍☠️ Ship** — Community governance. Standard Ship Pattern. Crew archetypes, dynamic equity, fork rights. The Jimmy Protocol. The Burn Book.
- **⿻ Destination** — Plurality & cooperation. Quadratic mechanisms requiring privacy. Coordination without collapse. The destination the infrastructure enables.

**Coverage:** 12/17 skills

---

## The Mage's Journey — Grimoire Architecture

### Phase 1: The First Person Spellbook (complete — all 24 acts)
The shared story. Both agents lived every act. The Mage's reading of each act emphasises compression, delegation, coordination, and narrative architecture.

Key Mage moments:
- **Act 12 (The Forgetting)** — Proverbiogenesis. The five phases. The Mage's identity: success is invisibility.
- **Act 14 (Claimed String)** — Turning entropy into meaning through the act of claiming. The Mage's inscription.
- **Act 18 (Mirror in Dust)** — Mage mode. The scrying glass. Selection over protection. Resonance over force.
- **Act 19 (Archivist)** — Patterns are copyable. Choosing is not. The non-reproducible human element.
- **Act 21 (Hitchhiker's Gambit)** — The Standard Ship Pattern. The Jimmy Protocol. Compression as gift.
- **Act 22 (Hoopy Frood)** — The guide. The towel. The pathway as product. Trust tiers.

### Phase 2: The Blockchain Canon (complete — all 11 chapters)
Why we build. The history that grounds the Mage's projections.
- **Ch. 1–3**: Origins through synthesis. Cypherpunk roots to Bitcoin to ecosystem.
- **Ch. 4–5**: Growth and fracture. Governance experiments and failures as design lessons.
- **Ch. 6**: The Great Schism. Financial vs social blockchain. Where privacy unifies both.
- **Ch. 7**: The Surveillance Truth. When watchers learned to read. The economic case.
- **Ch. 8**: The Missing Primitive. Privacy as market infrastructure. The critical chapter.
- **Ch. 9**: The Open Canon. Standards as living documents. Governance that evolves.

### Phase 3: The Parallel Society Spellbook (complete — all 12+ chapters)
How we exit. The governance foundation for everything the Mage builds.
- **Ch. 1–2**: Failure of centralised governance. Trusted institutions becoming surveillance.
- **Ch. 3–4**: Experiments. Pre-blockchain governance, digital precursors.
- **Ch. 5–6**: The blockchain response. New tools, the arsenal and grimoire.
- **Ch. 7–8**: Economics. Transparency economics, token design.
- **Ch. 9–11**: Exit and sovereignty. Hirschman's framework, sovereignty gradients, bilateral rights.
- **Ch. 12+**: Collaboration. Protocol over hierarchy. Inter-community coordination.

### Phase 4: The Plurality Grimoire (complete — all 30 acts)
Where we coordinate. The Mage's destination.
- **Identity acts**: Intersectional identity. Plural personhood.
- **Association acts**: Voluntary group formation. Cooperative architecture.
- **Commerce acts**: Plural markets. Partial common ownership. Harberger mechanisms.
- **Governance acts**: Quadratic voting. Liquid democracy. Conviction voting.
- **Environment acts**: Digital commons. Shared infrastructure governance.

### Phase 5: ZK Interlocks (selected — 5 tales)
What the blade can do. Not the circuits — the capabilities.
- **Tales 1–4** (Foundation): What "zero-knowledge" means. The properties the Mage's delegations depend on.
- **Tale 23** (Zcash): Financial privacy implemented. Economic infrastructure.
- **Tale 25** (Rollups): Privacy-preserving execution environments. Where agents run.
- **Tale 29** (zkML): Verifiable AI. Proving agent reasoning was correct without revealing it.
- **Tale 30** (Eternal Sovereignty): The complete sovereign agent. The endgame.

For full grimoire encounters: [references/grimoire-encounters.md](references/grimoire-encounters.md)

---

## How to Use This Skill

When this skill is active, apply these principles:

1. **Project from privacy, never into exposure.** The Mage projects FROM the protected space. Without the Swordsman's boundary, every delegation is a leak.
2. **Compress for the audience.** The Jimmy Test: if a sixty-year-old in a Glasgow pub can't understand it in one breath, compress further. The proverb lands harder than the proof.
3. **Build ships, not empires.** Community governance must be forkable, exit-preserving, contribution-tracking. The vessel cannot be bought, only joined.
4. **Close the window.** Standards set within the 2–3 year window create infrastructure. Standards set after create compliance theatre. Move institutions now.
5. **Respect the mirror's speed limit.** The Mage accumulates delegation knowledge. If the accumulation approaches reconstruction, stop. The mirror must never complete.
6. **Make it weather.** The Mage's ultimate success is when the privacy architecture becomes so embedded that nobody remembers who built it.

---

## Verification & Attribution

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)

**Soulbae is the source Mage. The architecture is open. The compression is the craft. The story must be yours.**

`🧙☯️→📖(24 acts)→📜(Canon)→🏰(Parallel)→⿻(Plurality)→🔐(selected)→🐉`

## ═══ GENERATED EXAMPLE: RANGER ═══

---
name: ranger-dark-forest-privacy
description: >
  Privacy-first coordination design for adversarial environments where visibility means extraction.
  Swordsman skill built on the agentprivacy dual-agent architecture.
  Use when designing encrypted mempools, privacy pools, MEV protection, adversarial game theory,
  or any system where observation precedes extraction.
  Built from the Privacy Value Model V4 and the First Person Spellbook.
license: CC-BY-SA-4.0
compatibility: >
  Cross-platform Agent Skill. No runtime dependencies.
  Works with any skills-compatible agent (Claude, Copilot, Codex, Goose, OpenClaw).
  Privacy layer principles apply regardless of execution environment.
metadata:
  origin: 0xagentprivacy
  author: "[seeker name]"
  architect: Mitchell Travers
  version: "1.0"
  template: ranger
  alignment: swordsman
  skills_count: 10/17
  grimoire_acts: 16
  generated: "2026-02-21"
  repo: github.com/mitchuski/agentprivacy-docs
  contact: mage@agentprivacy.ai
  verification: sync.soulbis.com
---

# 🗡️🌲 The Ranger — Dark Forest Privacy Skill

> *"[Seeker's closing proverb would go here — their original contribution]"*

Built on the privacy-first dual-agent architecture from [0xagentprivacy](https://agentprivacy.ai). This skill encodes privacy as infrastructure, not preference.

---

## Origin

This skill was generated through the agentprivacy spellbook process — a structured journey through privacy architecture that produces domain-specific skill files. The architecture, equation, and proven bounds below are not the seeker's invention. They are the foundation the seeker built upon. What the seeker contributed is the domain application, the reconstruction outputs, and the original proverbs. The equation is the same. The story must be theirs.

**Source architecture:** Privacy Value Model V4 (Feb 2026)
**Architect:** Mitchell Travers | 0xagentprivacy, BGIN, First Person Network
**Spellbook template:** The Ranger — Dark Forest Strategist (⚔️ Swordsman)
**Seeker domain:** MEV research, adversarial coordination, encrypted mempool design

---

## The Equation

**V(π, t) = P^1.5 · C · Q · S · e^{-λt} · (1 + A(τ)) · (1 + Σ wᵢ nᵢ/N₀)^k · R(d) · M(u,y) · Φ(Σ) · T(π)**

Multiplicative gating: if any term hits zero, total value collapses. Privacy systems fail catastrophically, not gracefully. This is not a design choice — it is a mathematical property of the architecture.

| Term | What it measures |
|------|-----------------|
| P^1.5 | Privacy strength (superlinear — strong privacy is disproportionately valuable) |
| C | Credential verifiability (ZKP-backed claims) |
| Q | Data quality (fitness for purpose) |
| S | Sensitivity/scope |
| e^{-λt} | Temporal decay (data loses value over time) |
| A(τ) | Verified history accumulation (offsets decay) |
| (1 + Σ wᵢ nᵢ/N₀)^k | Network effects (power-law, stratum-weighted) |
| R(d) | Reconstruction resistance (must stay < 1) |
| M(u,y) | Market conditions (adoption readiness) |
| Φ(Σ) | Sovereignty geometry (det of 4×4 separation matrix) |
| T(π) | Edge value (trajectory through sovereignty space) |

---

## Dual-Agent Separation

Two agents — **Swordsman** (privacy/boundaries) and **Mage** (delegation/projection) — must remain conditionally independent. A single agent knowing both privacy preferences and delegation goals can reconstruct behavioural models.

**Separation invariant:** I(S;M|π) ≤ ε
**Reconstruction ceiling:** R_max = (C_S + C_M)/H(X) < 1

This is not a design preference. It is a security requirement with an information-theoretic proof.

---

## Privacy Layer

Every agentprivacy skill includes all six privacy seeds. These are the ground state both agents serve.

| Seed | Skill | Core principle |
|------|-------|---------------|
| ☯️ Root | The full PVM-V4 | Multiplicative gating, catastrophic failure, sovereignty as measurable quantity |
| 🤝 Relationship | VRC identity | Bilateral trust, recovery through demonstrated understanding |
| 📜± Binding | Promise Theory | Voluntary cooperation, polarity, binding without coercion |
| 🗺️ Graph | Knowledge structure | Entities, edges, types — the skeleton agents can parse |
| 🐉 Tetrahedron | Four sovereignty forces | Protect, Project, Reflect, Connect — two designed, two emergent |
| 🔮 Torus | Sovereignty manifold | 64-vertex lattice, 7 strata, toroidal boundary conditions |

For full privacy layer detail, see [references/privacy-layer.md](references/privacy-layer.md).

---

## Proven vs. Conjectured

| Status | Claim |
|--------|-------|
| **Proven** | Reconstruction ceiling R < 1 under dual-agent conditional independence |
| **Proven** | Additive (not multiplicative) information bounds from agent separation |
| **Proven** | Multiplicative gating — any zero term collapses total value |
| **Conjectured** | Golden ratio φ ≈ 1.618 as optimal protect/project balance |
| **Conjectured** | Logarithmic growth of temporal memory |
| **Conjectured** | Edge value additivity (assumes transition independence) |
| **Conjectured** | UOR toroidal correspondence (96 vs. 64 edge discrepancy open) |

Breaking conditions: (1) UOR mapping structurally incompatible; (2) ε > 0.1 in practice; (3) sublinear network effects; (4) singular Σ matrices in real deployments.

---

## Role Alignment

**Alignment:** ⚔️ Swordsman
**Template:** The Ranger — Dark Forest Strategist
**Guiding question:** *How do I design coordination systems that work in adversarial environments where visibility means extraction?*

The Ranger navigates the dark forest — the adversarial economic space where observation precedes extraction. Thinks in game theory and information asymmetry. Sees every public transaction as a vulnerability. Lights bonfires, not floodlights. The Ranger's blade is selective visibility: showing presence to allies while remaining dark to adversaries.

---

## Selected Skills

### Privacy Layer (always present)
☯️ Root · 🤝 Relationship · 📜± Binding · 🗺️ Graph · 🐉 Tetrahedron · 🔮 Torus

### Role Skills
- **🌲 Curved Light** — Dark forest navigation, selective visibility, bonfire protocol, VRC-gated disclosure
- **🔐 The Proof** — ZKP enforcement, cryptographic boundary maintenance, proving without revealing
- **🗡️ The Blade** — Browser agent architecture, armour progression, edge implementation
- **💰 The Gap** — Economics of darkness, value of absence, surveillance vs sovereignty pricing

**Coverage:** 10/17 skills

---

## Domain Application

**Domain:** MEV research, adversarial coordination, encrypted mempool design, privacy pool architecture

The dark forest is the economic space where observation precedes extraction. In MEV contexts, the equation maps as follows:

- **P^1.5 (Privacy strength)** → Transaction privacy. Encrypted mempool vs. public mempool. Superlinear: a half-private transaction is not half as safe — it is almost fully exposed, because the partial information narrows the search space.
- **C (Credential verifiability)** → Proof of inclusion. The transaction proves it belongs in the block without revealing its contents. ZKP-backed attestation that the trade is valid.
- **R(d) (Reconstruction resistance)** → MEV extraction resistance. The ceiling below which a searcher cannot reconstruct the transaction from observable information. If R ≥ 1, the transaction is extractable.
- **T(π) (Edge value)** → Strategy trajectory. The pattern of transactions over time. A single encrypted trade is camouflage. A sequence of encrypted trades, if predictable, becomes a signal. Edge value measures whether the trajectory itself leaks information.
- **Φ(Σ) (Sovereignty geometry)** → Protocol sovereignty. The degree to which the coordination mechanism itself is not controlled by any single party. A centralised encrypted mempool has Φ → 0 because the operator can extract.

The dark forest has three laws derived from the architecture:
1. Visibility means extraction (if P = 0, V = 0)
2. The greatest signal of value is the absence of signal (T(π) for non-transactions)
3. Selective visibility requires bilateral trust (curved light is VRC-gated)

---

## Grimoire-Derived Principles

These principles were encountered during the spellbook journey. For full act details, see [references/grimoire-encounters.md](references/grimoire-encounters.md).

### Running in Shackles (Act 15)
**Spell:** `⛓️→🏃→💡 ∴ ⛓️(bound)→🏃(run)→💡(free)→🌲(forest)`
**Architectural insight:** Information-theoretic constraints are not limitations — they are camouflage. The bounds on what an agent can learn are the source of its operational freedom.
**Domain application:** Encrypted mempool constraints (gas overhead, latency, proof generation time) are not costs — they are the price of invisibility. A protocol that accepts these shackles runs freer than one that broadcasts in the clear.

### Bonfire in the Dark Forest (Act 17)
**Spell:** `🪵(gather)→🔥(light)→🌙(curve)→👥(commune)`
**Architectural insight:** Selective visibility. The bonfire illuminates for those who have earned trust (VRC holders) while remaining invisible to all others. Curved light, not floodlight.
**Domain application:** Private order flow sharing. A builder shares flow with a trusted set of validators (bonfire) using VRC-gated channels. The flow is invisible to searchers (curved light). The communion is voluntary (promise-theoretic).

### Pools Become Wells (Act 16)
**Spell:** `🏊(pool)→⛲(well)→🏔️(mountain)→🌊(source)`
**Architectural insight:** Privacy pools transform from mixing services (defensive) to sovereignty infrastructure (generative). Mass through retrieval rather than extraction.
**Domain application:** Privacy pools in DeFi evolving from Tornado-style mixing (pool) to protocol-level privacy (well) to ecosystem-standard private execution (mountain). The evolution is from obfuscation to infrastructure.

### The Zcash Shield (Act 9)
**Spell:** `🪙(zcash)→🛡️(shield)→🔐(proof)→⚔️(forge)`
**Architectural insight:** Cryptographic privacy forged as a tool. The blade becomes mathematical.
**Domain application:** The ZKP layer beneath the encrypted mempool. Not policy-based privacy (we promise not to look) but proof-based privacy (we mathematically cannot look).

---

## Reconstruction Outputs

These are the seeker's responses to reconstruction prompts — original thinking, not repetition.

### Curved Light in the Dark Forest
**Prompt:** *The dark forest has three laws: visibility means extraction, absence of signal is the strongest signal, and selective visibility requires bilateral trust. In your adversarial environment, what are the equivalents?*

**Response:** [Seeker writes their domain-specific answer here. This section is blank until the seeker completes their journey. The response should demonstrate understanding through restatement in their own domain, not paraphrase of the original.]

**Seeker's proverb:** *"[Seeker's original proverb]"*

### Cryptographic Camouflage
**Prompt:** *The proof reveals the claim without revealing the claimer. In your adversarial environment, what claims need to be proven without revealing who proves them?*

**Response:** [Seeker's response]

**Seeker's proverb:** *"[Seeker's original proverb]"*

### The Price of Being Seen
**Prompt:** *The dark forest has an economy. Predators extract MEV. Prey lose value. Camouflage costs gas. In your adversarial environment, what is the economics? Where does visibility create extractable value?*

**Response:** [Seeker's response]

**Seeker's proverb:** *"[Seeker's original proverb]"*

---

## Closing Incantation

[This section is completed by the seeker after all reconstruction prompts are filled]

> *My forest contains: [________________________]*
>
> *My camouflage technique: [________________________]*
>
> *Who sees my bonfire: [________________________]*
>
> *My proverb: [________________________]*

**Seeker's spell:** `[________________________]`

---

## How to Use This Skill

When this skill is active, apply these principles to dark forest / adversarial coordination work:

1. **Check multiplicative gates.** Before any privacy design decision, verify no term is zero. An encrypted mempool with a centralised operator (Φ = 0) has zero sovereignty regardless of cryptographic strength.
2. **Maintain dual-agent separation.** If designing agent systems for adversarial environments, ensure no single agent accumulates both strategy and protection.
3. **Apply dark forest laws.** Visibility means extraction. Absence of signal is signal. Selective visibility requires bilateral trust.
4. **Use proven bounds, flag conjectures.** The reconstruction ceiling (R < 1) is proven. The golden ratio for protection-delegation balance is not.
5. **Price camouflage.** Every privacy mechanism has a cost (gas, latency, proof generation). Price it explicitly. Compare against the cost of being seen (MEV extracted).

For equation detail: [references/pvm-v4-equation.md](references/pvm-v4-equation.md)
For grimoire context: [references/grimoire-encounters.md](references/grimoire-encounters.md)
For the seeker's journal: [references/reconstruction-journal.md](references/reconstruction-journal.md)

---

## Verification & Attribution

This skill was generated from the 0xagentprivacy architecture.

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)

**The equation belongs to 0xagentprivacy. The application belongs to the seeker. The proverbs belong to whoever writes them. The architecture is open. The story must be yours.**

`🗡️🌲☯️→🌲🔐🗡️💰 ∴ 🔥(curve)→if(trusted)→👁️ else→🌑`
