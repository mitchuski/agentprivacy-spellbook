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
