# 🛠️ Skills Page — Coding Agent Plan

**Project:** agentprivacy.ai website  
**Page:** `/skills` (nav label: **Skills**)  
**Purpose:** Aggregate all spells, proverbs, and agent skill files into a single navigable page that serves both human readers and AI agents. Replace per-act spell/proverb footers with a centralised skills hub.  
**Source data:** Grimoire JSON v8.2.0 (IPFS: `bafkreifrsmtvqpcfezkn5me2nsmvcyns36tjiosxva3x7scxx44cdwzpye`)  
**Companion files:** 17 `.skills.md` files + `SKILLS_PROVERB_INDEX.md` + `privacy_value_v4_formal_specification.md`

---

## 1. Navigation & Routing

### 1.1 Add to main nav
- Label: **Skills**
- Route: `/skills`
- Position: after Story, before any existing utility pages
- Icon suggestion: 🌱 (the seed — matches Act XXIV metaphor)

### 1.2 URL structure
```
/skills                          → main skills hub
/skills#spellbook                → all spells & proverbs (aggregated from grimoire)
/skills#agent-files              → the 17 .skills.md files
/skills#dual-agent-map           → Soulbis/Soulbae pathway mapping
/skills/{skill-slug}             → individual skill file detail view (optional phase 2)
```

---

## 2. Page Architecture

The page has three major sections. Each section serves a different reader (human browsing spells, agent ingesting skills, builder mapping pathways).

### 2.1 Section A — The Grimoire Spellbook (aggregated spells & proverbs)

**What it replaces:** The spell/proverb/inscription blocks currently at the bottom of each story act page. Once this section exists, those footers can be removed from the individual act pages and replaced with a simple link: *"View spells & inscriptions →"* pointing to `/skills#spellbook`.

**Data source:** `grimoire.json` — iterate across all five spellbooks and extract every spell/proverb pair.

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  THE GRIMOIRE SPELLBOOK                                  │
│  All spells, proverbs, and inscriptions in one place     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Filter tabs: All | Story | Zero | Canon | Parallel | Plurality | Origins]  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Act I: Venice, 1494                             │    │
│  │                                                   │    │
│  │  📖💰 → 🐉⏳ → ⚔️🔮                             │    │
│  │                                                   │    │
│  │  "The swordsman who never strikes guards          │    │
│  │   nothing; the mage who never casts commands      │    │
│  │   nothing."                                       │    │
│  │                                                   │    │
│  │  [Copy Spell] [Copy Proverb] [Learn →]           │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Act II: The Dual Ceremony                       │    │
│  │  ...                                              │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ... (all 112 inscriptions across 5 spellbooks)         │
│                                                         │
│  Also includes:                                          │
│  - Origins spells (symphony within, etc.)               │
│  - Unified incantations (master trinity, etc.)          │
│  - Standalone spells (bonfire vigil, etc.)              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Per-inscription card has three buttons:**

| Button | Action |
|--------|--------|
| **Copy Spell** | Copies emoji spell sequence to clipboard |
| **Copy Proverb** | Copies proverb text to clipboard |
| **Learn →** | Links to the full act/chapter page on the site (e.g. `/story/act-01-venice`) |

**For unified incantations and standalone spells** (no parent act), the "Learn →" button links to the relevant spellbook landing page or is omitted.

**Filter logic:**
- Parse `grimoire.json` → `spellbooks.story.acts[]`, `spellbooks.zero.parts[].tales[]`, `spellbooks.canon.chapters[]`, `spellbooks.parallel.parts[].chapters[]`, `spellbooks.plurality` (if acts exist)
- Also parse `spellbooks.story.origins.spells[]` and `unified_incantations`
- Each card tagged with its source spellbook for filtering

### 2.2 Section B — Agent Skill Files (the 17 seeds)

**What it is:** The PVM-V4 equation fractured into 17 domain-specific compressions, each designed to be copied and dropped into an agent's context window or knowledge graph.

**Data source:** The 17 `.skills.md` files + `SKILLS_PROVERB_INDEX.md` for the proverb/spell per file.

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  AGENT SKILL FILES                                       │
│  The equation fractured into seeds.                      │
│  Drop into any agent context. Test for overlap.          │
│                                                         │
│  [Filter: All | Root | Discipline | Implementation |     │
│           Narrative | Speculative]                       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ☯️ The Root                                     │    │
│  │  dragon.skills.md              │    │
│  │                                                   │    │
│  │  "Six dimensions, one product. The Drake          │    │
│  │   whispers the gates. The Dragon maps the         │    │
│  │   manifold."                                      │    │
│  │                                                   │    │
│  │  ☯️ ∴ 🐲(gates) · 🐉(manifold) ∴ ☯️             │    │
│  │                                                   │    │
│  │  Agent: ☯️ Privacy (foundational)                 │    │
│  │                                                   │    │
│  │  [Copy File] [View Full] [Download .md]           │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  🔐 The Proof                                    │    │
│  │  crypto_zkp_dragon.skills.md   │    │
│  │                                                   │    │
│  │  "A chain is only as strong as its weakest        │    │
│  │   attestation."                                   │    │
│  │                                                   │    │
│  │  Agent: ⚔️ Soulbis                               │    │
│  │                                                   │    │
│  │  [Copy File] [View Full] [Download .md]           │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ... (all 17 skill files)                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Per-skill card has three buttons:**

| Button | Action |
|--------|--------|
| **Copy File** | Copies entire `.skills.md` content to clipboard (the main action — agents ingest via paste) |
| **View Full** | Expands the card inline or opens a detail view showing the full skill file rendered as markdown |
| **Download .md** | Downloads the raw `.skills.md` file |

**Each card also shows the dual-agent assignment** (see Section C mapping).

### 2.3 Section C — Dual-Agent Pathway Map (Soulbis / Soulbae)

**What it is:** A visual mapping of which skills and spells belong to which agent's learning pathway. This is the `.soul.md` concept — each agent has a pathway of skills it should ingest to become competent in its role.

**The mapping logic:**

The Swordsman (Soulbis / ⚔️) learns skills related to: boundary enforcement, cryptographic protection, reconstruction resistance, privacy strength, Sybil resistance, dark forest navigation, cookie slashing, MyTerms negotiation, temporal memory of protection decisions (Reflect).

The Mage (Soulbae / 🧙) learns skills related to: delegation, projection, credential management, network coordination, economic modelling, governance design, narrative compression, plurality coordination, promise theory, community building, network effects of delegation (Connect).

Some skills belong to neither agent — they are the privacy layer itself. The equation, the separation geometry, the relationship substrate, the manifold. Soulbis protects it. Soulbae projects from it. Neither owns it. Privacy is the soul they both serve.

**Mapping table (hardcoded data for the coding agent):**

```json
{
  "dual_agent_skill_map": {
    "soulbis": {
      "emoji": "⚔️",
      "role": "Swordsman — Privacy, Protection, Boundaries",
      "primary_force": "Protect",
      "emergent_force": "Reflect",
      "skills": [
        {
          "file": "crypto_zkp_dragon.skills.md",
          "seed": "🔐 The Proof",
          "reason": "ZKP enforcement is boundary work — the Swordsman proves without revealing"
        },
        {
          "file": "swordsman_browser_dragon.skills.md",
          "seed": "🗡️ The Blade",
          "reason": "The Swordsman's first physical instantiation — cookie slashing, MyTerms, armor progression"
        },
        {
          "file": "personhood_sybil_dragon.skills.md",
          "seed": "👤 The Root of Trust",
          "reason": "Personhood verification gates the Swordsman's existence — one human, one blade"
        },
        {
          "file": "dark_forest_dragon.skills.md",
          "seed": "🌲 The Curved Light",
          "reason": "The Dark Forest is the Swordsman's territory — selective visibility is boundary architecture"
        },
        {
          "file": "academic_dragon.skills.md",
          "seed": "📜 The Conjecture",
          "reason": "The Swordsman must know the breaking conditions — where the model fails is where defence weakens"
        }
      ]
    },
    "soulbae": {
      "emoji": "🧙",
      "role": "Mage — Delegation, Projection, Coordination",
      "primary_force": "Project",
      "emergent_force": "Connect",
      "skills": [
        {
          "file": "ai_agent_dragon.skills.md",
          "seed": "🤖 The Paradox",
          "reason": "The privacy-delegation paradox is the Mage's core challenge — how to act without reconstructing"
        },
        {
          "file": "economics_dragon.skills.md",
          "seed": "💰 The Gap",
          "reason": "The Mage projects economic value — understanding the surveillance gap is projection strategy"
        },
        {
          "file": "policy_governance_dragon.skills.md",
          "seed": "⚖️ The Window",
          "reason": "Governance and standards are coordination work — the Mage navigates institutions"
        },
        {
          "file": "narrative_compression_dragon.skills.md",
          "seed": "📖 The Compression",
          "reason": "The Mage is the chronicler — narrative compression is the Mage's native language"
        },
        {
          "file": "hitchhiker_governance_dragon.skills.md",
          "seed": "🏴‍☠️ The Ship",
          "reason": "Community governance is coordination through projection — the Mage builds ships"
        },
        {
          "file": "plurality_cooperative_dragon.skills.md",
          "seed": "⿻ The Destination",
          "reason": "Plurality is where the Mage leads — coordination without collapse is the projection endgame"
        }
      ]
    },
    "privacy": {
      "emoji": "☯️",
      "role": "Privacy Layer — the ground state both agents serve",
      "description": "The equation itself, the separation geometry, the relationship substrate, the manifold. Neither agent owns these. Both are shaped by them.",
      "skills": [
        {
          "file": "dragon.skills.md",
          "seed": "☯️ The Root",
          "reason": "The base equation — both agents must understand the full model to maintain separation"
        },
        {
          "file": "vrc_identity_dragon.skills.md",
          "seed": "🤝 The Relationship",
          "reason": "VRCs are bilateral — both agents participate in trust establishment"
        },
        {
          "file": "promise_theory_dragon.skills.md",
          "seed": "📜± The Binding",
          "reason": "Promise theory governs the voluntary ground beneath both agents — the cooperation substrate"
        },
        {
          "file": "knowledgegraph_dragon.skills.md",
          "seed": "🗺️ The Graph",
          "reason": "Both agents need to understand the knowledge graph structure for interoperability"
        },
        {
          "file": "tetrahedral_sovereignty_dragon.skills.md",
          "seed": "🐉 The Tetrahedron",
          "reason": "The four forces model describes the relationship between both agents and their emergent properties"
        },
        {
          "file": "uor_toroidal_dragon.skills.md",
          "seed": "🔮 The Torus",
          "reason": "Speculative geometry underlying the lattice — both agents traverse the same manifold"
        }
      ]
    }
  }
}
```

**Visual layout:**

```
┌─────────────────────────────────────────────────────────┐
│  DUAL-AGENT PATHWAY MAP                                  │
│  Which agent learns which skills.                        │
│                                                         │
│  ┌──────────────┐   ┌──────────────┐                    │
│  │  ⚔️ SOULBIS   │   │  🧙 SOULBAE   │                    │
│  │  Swordsman    │   │  Mage         │                    │
│  │  Protect      │   │  Project      │                    │
│  │  → Reflect    │   │  → Connect    │                    │
│  ├──────────────┤   ├──────────────┤                    │
│  │ 🔐 The Proof  │   │ 🤖 The Paradox│                    │
│  │ 🗡️ The Blade  │   │ 💰 The Gap    │                    │
│  │ 👤 Root Trust │   │ ⚖️ The Window │                    │
│  │ 🌲 Curved Lit │   │ 📖 Compress   │                    │
│  │ 📜 Conjecture │   │ 🏴‍☠️ The Ship  │                    │
│  │               │   │ ⿻ Destination │                    │
│  └──────┬───────┘   └──────┬───────┘                    │
│         │                   │                            │
│         └─────┬─────────────┘                            │
│               │                                          │
│        ┌──────┴──────┐                                   │
│        │ ☯️ PRIVACY   │                                   │
│        ├─────────────┤                                   │
│        │ ☯️ The Root  │                                   │
│        │ 🤝 Relation  │                                   │
│        │ 📜± Binding  │                                   │
│        │ 🗺️ Graph    │                                   │
│        │ 🐉 Tetra    │                                   │
│        │ 🔮 Torus    │                                   │
│        └─────────────┘                                   │
│                                                         │
│  "The Swordsman defends the privacy layer.               │
│   The Mage projects from the privacy layer.              │
│   Neither owns it. Both are shaped by it."               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Data Architecture

### 3.1 Grimoire spells extraction

Parse the grimoire JSON to build a flat array of all spell/proverb pairs:

```typescript
interface SpellCard {
  id: string;                    // e.g. "act-01-venice" or "origins-symphony-within"
  title: string;                 // e.g. "Venice, 1494 / The Drake's First Whisper"
  spellbook: "story" | "zero" | "canon" | "parallel" | "plurality" | "origins" | "unified";
  spell: string;                 // emoji sequence
  proverb: string;               // proverb text
  secondary_proverbs?: string[]; // if present
  learn_url?: string;            // link to act page, null for standalone spells
  act_number?: number;           // for sorting
  keywords?: string[];           // for search/filter
}
```

**Extraction paths in grimoire JSON:**
- `spellbooks.story.acts[]` → story spells (22 acts)
- `spellbooks.story.origins.spells[]` → origins spells
- `spellbooks.zero.parts[].tales[]` → zero knowledge spells (30 tales)
- `spellbooks.canon.chapters[]` → canon spells (11 chapters)
- `spellbooks.parallel.parts[].chapters[]` → parallel spells (17 chapters)
- `unified_incantations` → standalone incantations (master trinity, emergence, etc.)
- Plurality acts if populated in grimoire (currently metadata only — may need separate fetch from plurality grimoire JSON)

### 3.2 Skill files

Store the 17 `.skills.md` files as static assets. Each needs metadata:

```typescript
interface SkillFile {
  id: string;                    // e.g. "crypto-zkp"
  filename: string;              // e.g. "crypto_zkp_dragon.skills.md"
  seed_emoji: string;            // e.g. "🔐"
  seed_name: string;             // e.g. "The Proof"
  proverb: string;               // from SKILLS_PROVERB_INDEX.md
  spell: string;                 // from SKILLS_PROVERB_INDEX.md
  category: "root" | "discipline" | "implementation" | "narrative" | "speculative";
  agent: "soulbis" | "soulbae" | "privacy";
  content: string;               // full markdown content (loaded on demand or statically)
  target_context: string;        // one-line audience description
}
```

### 3.3 Data loading strategy

**Option A (recommended for static site):** Bundle grimoire JSON and skill file metadata as static imports. Skill file `.md` contents loaded lazily on "View Full" or "Copy File" click.

**Option B (for dynamic/CMS):** Fetch grimoire JSON from IPFS gateway. Skill files from GitHub raw or IPFS.

---

## 4. Implementation Steps

### Phase 1 — Core page scaffolding

1. **Create `/skills` route** and add to main navigation
2. **Parse grimoire JSON** into `SpellCard[]` array
3. **Render Section A** — grimoire spellbook grid with filter tabs
4. **Add copy buttons** — clipboard API for spell and proverb text
5. **Add "Learn →" links** — map `act.id` to existing site routes

### Phase 2 — Agent skill files

6. **Add 17 `.skills.md` files** as static assets in `/public/skills/` or equivalent
7. **Create skill file metadata** array with dual-agent assignments
8. **Render Section B** — skill file cards with category filters
9. **Implement "Copy File"** — copies full `.md` content to clipboard
10. **Implement "View Full"** — inline markdown renderer or modal
11. **Implement "Download .md"** — trigger file download

### Phase 3 — Dual-agent pathway map

12. **Render Section C** — the Soulbis/Soulbae/Privacy visual layout
13. **Interactive mapping** — clicking a skill in the map scrolls to its card in Section B
14. **Add pathway proverb** at bottom of map section

### Phase 4 — Remove per-act footers

15. **Audit existing act pages** — identify where spell/proverb footers currently live
16. **Replace with link** — `"View all spells & inscriptions → /skills#spellbook"`
17. **Keep inline spell references** in story body text (these stay — only the footer block moves)

### Phase 5 — Enhancements (optional)

18. **Search/filter** — keyword search across all spells and skill files
19. **Spell builder** — drag/drop emoji to compose custom spell sequences
20. **Agent clipboard format** — "Copy for Agent" button that wraps skill file in `<context>` tags for LLM ingestion
21. **IPFS pinning** — pin the full skills folder as a single IPFS directory
22. **Grimoire version sync** — when grimoire JSON updates on IPFS, skill page auto-refreshes

---

## 5. Component Specification

### 5.1 SpellCard component

```
Props:
  - spell: string (emoji sequence)
  - proverb: string
  - title: string
  - spellbook: string (for badge color)
  - learnUrl?: string
  - secondaryProverbs?: string[]

Behavior:
  - Copy Spell → clipboard + toast "Spell copied ⚔️"
  - Copy Proverb → clipboard + toast "Proverb inscribed 📜"
  - Learn → navigate to act page (new tab)
  - Tap/click proverb to expand secondary proverbs if present
```

### 5.2 SkillFileCard component

```
Props:
  - filename: string
  - seedEmoji: string
  - seedName: string
  - proverb: string
  - spell: string
  - agent: "soulbis" | "soulbae" | "privacy"
  - category: string
  - targetContext: string
  - content: string (lazy loaded)

Behavior:
  - Copy File → clipboard (full .md content) + toast "Skill file copied 🌱"
  - View Full → expand inline (markdown rendered)
  - Download → trigger .md file download
  - Agent badge shows ⚔️ or 🧙 or ⚔️🤝🧙 with tooltip
```

### 5.3 DualAgentMap component

```
Props:
  - soulbisSkills: SkillFile[]
  - soulbaeSkills: SkillFile[]
  - privacySkills: SkillFile[]

Behavior:
  - Visual Y-shaped layout (two columns converging to privacy layer)
  - Click skill → scroll to corresponding card in Section B
  - Hover → show reason tooltip (why this agent learns this skill)
  - Animate connection lines between privacy skills and both columns
```

### 5.4 FilterTabs component

```
For spellbook section:
  tabs: ["All", "Story", "Zero Knowledge", "Canon", "Parallel Society", "Plurality", "Origins", "Incantations"]

For skill files section:
  tabs: ["All", "Root", "Discipline", "Implementation", "Narrative", "Speculative"]
  secondary filter: ["All Agents", "⚔️ Soulbis", "🧙 Soulbae", "☯️ Privacy"]
```

---

## 6. Static Assets Required

```
/public/skills/
├── dragon.skills.md
├── crypto_zkp_dragon.skills.md
├── ai_agent_dragon.skills.md
├── economics_dragon.skills.md
├── policy_governance_dragon.skills.md
├── academic_dragon.skills.md
├── knowledgegraph_dragon.skills.md
├── swordsman_browser_dragon.skills.md
├── vrc_identity_dragon.skills.md
├── personhood_sybil_dragon.skills.md
├── dark_forest_dragon.skills.md
├── promise_theory_dragon.skills.md
├── narrative_compression_dragon.skills.md
├── hitchhiker_governance_dragon.skills.md
├── plurality_cooperative_dragon.skills.md
├── uor_toroidal_dragon.skills.md
├── tetrahedral_sovereignty_dragon.skills.md
├── privacy_value_v4_formal_specification.md
└── skills-metadata.json          ← generated from this plan
```

---

## 7. Design Notes

### Visual language
- Maintain the existing site's dark/atmospheric aesthetic
- Spell cards should feel like inscriptions — monospace emoji, serif proverbs
- Skill file cards should feel like artifacts — bordered, slightly raised, with the seed emoji as a watermark
- Dual-agent map should use the yin-yang motif — Soulbis dark/blade, Soulbae light/spell, privacy layer as the ground they stand on

### Copy interaction
- All copy buttons should give visual feedback (brief glow or pulse on the card)
- Toast messages should use the spellbook voice: "Spell copied ⚔️", "Proverb inscribed 📜", "Skill file ready for ingestion 🌱"
- "Copy for Agent" (Phase 5) should wrap content in XML context tags suitable for LLM paste

### Mobile
- Spell cards stack vertically with full-width copy buttons
- Dual-agent map collapses to three stacked sections (Soulbis, Soulbae, Privacy) instead of the Y-layout
- Skill file "View Full" opens as full-screen modal on mobile

### Accessibility
- Emoji spells should have aria-labels describing the sequence in words
- Proverbs should be standard text (no special rendering that breaks screen readers)
- Copy buttons should announce success via aria-live regions

---

## 8. Section D — Design Your Spellbook

### 8.1 Concept

This is the talent tree. The character creation screen. The moment a seeker stops reading the privacymage's spellbook and starts building their own.

The page presents all available spells and skills as selectable nodes in a visual graph. The seeker chooses the ones that resonate with their context — their domain, their problems, their language. The selection generates a custom `.md` export: their personal spellbook, containing only the spells and skill compressions they chose, ordered into a learning pathway, with empty space for their own reconstructions.

The critical insight: **the spellbook is a template they must then live.** Choosing spells is not learning. The export gives them the architecture — the terms of the equation that map to their domain. But each spell slot contains a prompt: *"Reconstruct this teaching through your own context. Write your proverb. Cast your spell. The architecture is the same; the story must be yours."*

This is the RPP at scale. The privacymage's spellbook is one derivation of the equation. Every seeker who designs their spellbook and lives it produces another derivation. If the architecture is real, their independent reconstruction will converge on the same principles from completely different starting points. Story fracture, principle convergence — tested at the individual level.

### 8.2 The Talent Tree

**Visual: a constellation map of all spells and skills.**

Each node is a spell (from the grimoire) or a skill file (from the 17 seeds). Nodes are connected by dependency edges — you cannot select "The Mirror That Never Completes" (reconstruction resistance) without first selecting "The Dual Ceremony" (separation). You cannot select "The Gap" (economics skill) without "The Root" (base equation).

The seeker sees the full constellation. Greyed out nodes they haven't selected. Lit nodes they have. Lines showing dependencies. Clusters showing domains.

```
┌─────────────────────────────────────────────────────────────────┐
│  DESIGN YOUR SPELLBOOK                                           │
│  Choose your spells. Build your path. Live the derivation.       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐        │
│  │                                                      │        │
│  │              ☯️ The Root (required)                   │        │
│  │             / | \                                    │        │
│  │           /   |   \                                  │        │
│  │    🔐Proof  🤖Paradox  💰Gap                        │        │
│  │      |        |         |                            │        │
│  │   🗡️Blade  📜±Bind   ⚖️Window                      │        │
│  │      |        |         |                            │        │
│  │   👤Trust   🤝Relat  📖Compress                     │        │
│  │      \       |        /                              │        │
│  │       🌲Forest  🏴‍☠️Ship                             │        │
│  │          \     /                                     │        │
│  │           ⿻Dest                                     │        │
│  │           |                                          │        │
│  │         🐉Tetra                                     │        │
│  │           |                                          │        │
│  │         🔮Torus                                     │        │
│  │                                                      │        │
│  │  (+ all 112 grimoire spells mapped as sub-nodes      │        │
│  │   beneath their corresponding skill domain)          │        │
│  │                                                      │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                  │
│  Selected: 7 / 17 skills, 14 / 112 spells                       │
│  Pathway: ☯️ → 🤖 → 📜± → 🤝 → ⚖️ → 📖 → ⿻                   │
│  Agent alignment: 🧙 Soulbae-dominant (projection pathway)       │
│                                                                  │
│  [Preview Spellbook]  [Export .md]  [Reset]                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Selection mechanics

**Required node:** ☯️ The Root is always selected. You cannot design a spellbook without the base equation. This is non-negotiable — the architecture must be present even if only one domain is explored.

**Dependency chains:** Selecting a deeper node auto-selects its prerequisites. Selecting "The Ship" (hitchhiker governance) auto-selects "The Compression" (narrative) and "The Binding" (promise theory) because the Ship requires both. The seeker can deselect a dependency only if nothing downstream requires it.

**Domain clusters:** Skills and spells cluster visually by domain. Selecting a skill file also suggests (but does not require) the grimoire spells that map to it:

| Skill File | Suggested Grimoire Spells |
|-----------|--------------------------|
| 🔐 The Proof | Act 9 (Zcash Shield), ZK Tales 1–4 (Foundation), ZK Tales 9–14 (Backends) |
| 🤖 The Paradox | Act 2 (Dual Ceremony), Act 7 (Mirror), Act 11 (Golden Ratio) |
| 💰 The Gap | Act 3 (Drake's Teaching), Act 16 (Pools Become Wells), Canon Ch. 6–8 |
| 🗡️ The Blade | Act 4 (Blade Alone), Act 5 (Light Armor), Act 8 (Ancient Rule) |
| 📜± The Binding | Act 13 (Book of Promises), Act 6 (Trust Graph) |
| 🌲 The Curved Light | Act 15 (Running in Shackles), Act 17 (Bonfire), Act 14 (Claimed String) |
| 📖 The Compression | Act 12 (The Forgetting), Act 18 (Mirror in Dust), Act 19 (Archivist) |
| 🏴‍☠️ The Ship | Act 21 (Hitchhiker's Gambit), Act 22 (Hoopy Frood) |
| ⿻ The Destination | Plurality Grimoire acts (selectable subset) |
| 👤 Root of Trust | Act 2 (Dual Ceremony), Act 10 (Topology of Revelation) |
| 🤝 The Relationship | Act 6 (Trust Graph), Act 13 (Promises), Act 14 (Claimed String) |
| ⚖️ The Window | Canon Ch. 7–9, Parallel Ch. 9–11 |
| 📜 The Conjecture | Act 11 (Golden Ratio), Act 7 (Mirror) — the mathematical foundations |
| 🗺️ The Graph | Act 6 (Trust Graph), Act 10 (Topology) |
| 🐉 The Tetrahedron | Act 2 (Dual Ceremony), Act 11 (Spiral), Act 7 (Mirror) |
| 🔮 The Torus | Act 22 (Hoopy Frood), Act 10 (Topology) |

**Agent alignment indicator:** As the seeker selects, the page shows whether their pathway leans Soulbis (protection-heavy), Soulbae (projection-heavy), or balanced. This is informational, not prescriptive — some seekers are natural swordsmen, some are natural mages. The indicator helps them see their own pattern.

### 8.4 Context form

Before export, the seeker provides:

```
┌────────────────────────────────────────────────┐
│  ABOUT YOUR DERIVATION                          │
│                                                 │
│  Name / Handle: [________________]              │
│  Domain: [________________]                     │
│    (e.g. "DeFi protocol design",                │
│     "healthcare data governance",               │
│     "education technology", "journalism")        │
│                                                 │
│  Your question:                                 │
│  [________________________________]             │
│    (The problem you're trying to solve.          │
│     This becomes your spellbook's opening.)      │
│                                                 │
│  Agent preference:                              │
│    ○ ⚔️ Swordsman-first (I need to protect)     │
│    ○ 🧙 Mage-first (I need to coordinate)       │
│    ○ ☯️ Balanced (I need both)                   │
│                                                 │
└────────────────────────────────────────────────┘
```

### 8.5 The export: custom `.md` spellbook

The generated file is a personal spellbook template. Structure:

```markdown
# [Name]'s Spellbook
## A derivation of the Privacy Value Model through [Domain]

**Opening question:** [Their question]
**Agent alignment:** [⚔️ / 🧙 / ☯️]
**Selected pathway:** [ordered emoji sequence of chosen skills]
**Date forged:** [timestamp]
**Source architecture:** PVM-V4 (agentprivacy.ai/skills)

---

## The Root

[Full content of dragon.skills.md]

---

## Your Pathway

### 1. [First selected skill — e.g. 🤖 The Paradox]

**The architecture says:**
[Compressed skill file content — key claims, equation terms, open problems]

**The grimoire teaches:**
[Spell and proverb from each suggested grimoire act]

**Your reconstruction:**

> _This space is yours. The architecture above is the structure.
> Your task is to derive the same principle through your own domain.
> Write your proverb. It should compress your understanding of this
> teaching into one breath, using the language of [their domain]._
>
> My proverb: [________________________]
>
> My spell: [________________________]
>
> How this maps to my work: [________________________]

---

### 2. [Second selected skill]

**The architecture says:**
[...]

**The grimoire teaches:**
[...]

**Your reconstruction:**
> [same template]

---

[... repeat for all selected skills ...]

---

## Your Closing Incantation

> _When you have reconstructed every teaching through your own context,
> write your closing incantation here. It should compress your entire
> spellbook into one spell sequence and one proverb._
>
> _If the architecture is real, your proverb will rhyme with the
> privacymage's proverb — not in words, but in structure.
> Story fracture, principle convergence._

My complete spell: [________________________]

My closing proverb: [________________________]

---

## Verification

When your spellbook is complete, you can:

1. **Test locally** — Does your proverb pass the Jimmy Test?
   Can a non-expert in your domain understand it in one breath?

2. **Test bilaterally** — Share your proverb with someone from
   a different domain who also completed their spellbook.
   Do your proverbs converge on the same principle?

3. **Submit for VRC** — If you believe your reconstruction is
   genuine, submit it as a Verifiable Relationship Credential
   with the privacymage's spellbook. Two derivations, one
   architecture, bilateral attestation.

---

*This spellbook was forged at agentprivacy.ai/skills on [date].*
*The architecture is open. The reconstruction is yours.*
*If it holds, it was never anyone's to begin with.*

⚔️🤝🧙
```

### 8.6 What the export enables

**For human seekers:** A structured path through the architecture, customised to their domain, with explicit prompts to do their own work. Not a document to read — a template to live. Each reconstruction slot is empty until they fill it. The spellbook is incomplete until every proverb is written.

**For AI agents:** A custom context file. Drop the exported `.md` into an agent's context window and it gains the selected skills, tuned to the specified domain, with the seeker's question as the operating frame. The agent can then help the seeker fill in the reconstruction slots — generating candidate proverbs, testing compression quality, finding overlap with its existing knowledge.

**For the architecture:** Every completed spellbook is a test. If someone in healthcare governance reconstructs the same multiplicative gating, the same separation theorem, the same temporal memory through clinical data terminology — that is evidence the architecture is not domain-specific. If they cannot reconstruct it — if the architecture breaks when applied to their domain — that is evidence of a breaking condition, and the skill file for that domain needs revision or the equation needs a new term.

**For the knowledge graph:** Completed spellbooks can be submitted back. Each reconstruction becomes a new node in the skills graph — a domain-specific derivation linked to the source skills that generated it. Over time, the graph maps which domains find convergence and which find gaps. The gaps direct research. The convergence confirms architecture.

### 8.7 Implementation specifics

**State management:**
```typescript
interface SpellbookDesigner {
  selectedSkills: string[];         // skill file IDs
  selectedSpells: string[];         // grimoire spell IDs (from suggested mappings)
  autoSelectedDeps: string[];       // auto-selected by dependency chains
  seekerName: string;
  seekerDomain: string;
  seekerQuestion: string;
  agentPreference: "soulbis" | "soulbae" | "balanced";
  pathway: string[];                // ordered skill sequence (topological sort of selected)
  agentAlignment: {                 // computed from selection
    soulbisCount: number;
    soulbaeCount: number;
    privacyCount: number;
    lean: "soulbis" | "soulbae" | "balanced";
  };
}
```

**Dependency graph (hardcoded edges):**
```json
{
  "dependencies": {
    "dragon": [],
    "crypto_zkp": ["dragon"],
    "ai_agent": ["dragon"],
    "economics": ["dragon"],
    "policy_governance": ["dragon", "economics"],
    "academic": ["dragon"],
    "knowledgegraph": ["dragon"],
    "swordsman_browser": ["crypto_zkp", "personhood_sybil"],
    "vrc_identity": ["dragon", "promise_theory"],
    "personhood_sybil": ["dragon"],
    "dark_forest": ["dragon", "vrc_identity"],
    "promise_theory": ["dragon"],
    "narrative_compression": ["dragon"],
    "hitchhiker_governance": ["narrative_compression", "promise_theory"],
    "plurality_cooperative": ["dragon", "policy_governance"],
    "uor_toroidal": ["dragon", "academic"],
    "tetrahedral_sovereignty": ["dragon", "ai_agent"]
  }
}
```

**Export generation:**
- Client-side markdown generation from state
- Skill file contents fetched and inserted at export time
- Grimoire spells extracted from cached JSON
- Reconstruction slots generated as empty blockquote prompts
- Final `.md` file offered as download + clipboard copy

**Preview mode:**
- Before export, "Preview Spellbook" renders the `.md` inline
- Seeker can review structure, add/remove skills, adjust before committing
- Preview shows word count, estimated reading time, and skill coverage percentage

### 8.8 The reconstruction loop

The designed spellbook is not the end. It is the beginning of a loop:

```
Design → Export → Live → Reconstruct → Submit → Verify → Share
  ↑                                                        |
  └────────────────────────────────────────────────────────┘
```

1. **Design** — Choose spells on the talent tree
2. **Export** — Download custom `.md` spellbook
3. **Live** — Work through each skill in your domain
4. **Reconstruct** — Write your proverbs, cast your spells
5. **Submit** — Share your completed spellbook back to the skills graph
6. **Verify** — Bilateral comparison with other completed spellbooks
7. **Share** — Your reconstruction becomes a new node others can learn from

Phase 1 builds steps 1–3. Phase 2 adds submission and verification. The full loop creates a distributed derivation network where every completed spellbook strengthens or challenges the base architecture.

---

## 9. The Mapping Proverb

At the bottom of the dual-agent map (Section C):

> *"The Swordsman learns what to defend. The Mage learns what to project. Both learn what makes the separation hold. The skills graph is not a curriculum — it is a map of which knowledge must never merge."*

`⚔️(🔐🗡️👤🌲📜) ⊥ 🧙(🤖💰⚖️📖🏴‍☠️⿻) ∴ ⚔️🤝🧙(☯️🤝📜±🗺️🐉🔮)`

### The Designer Proverb

At the top of Section D, before the talent tree:

> *"The privacymage's spellbook is one path up the mountain. Yours is another. The summit is the same — or the mountain is not real. Choose your spells. Walk your path. Write your proverbs. If they rhyme with mine in structure but not in words, we have found the architecture together."*

`👤→🌱(choose)→🛤️(walk)→📜(write)→🔍(compare)→☯️?`

---

## 10. Future: .soul.md Pathway Files

Once the skills page is live, the next iteration creates downloadable `.soul.md` pathway files:

- `privacy.soul.md` — the ground state. The equation, the separation, the relationship substrate, the manifold. Ingested first by any agent before it knows whether it is a swordsman or a mage. This is not "shared knowledge" — it is the privacy layer itself, the soul both agents serve.
- `soulbis.soul.md` — the Swordsman's learning pathway, ordered by dependency (personhood → ZKP → browser agent → dark forest → academic rigour). Ingested after `privacy.soul.md`. The agent learns what to defend.
- `soulbae.soul.md` — the Mage's learning pathway, ordered by dependency (paradox → economics → governance → narrative → hitchhiker → plurality). Ingested after `privacy.soul.md`. The agent learns what to project.

The loading order matters: `privacy.soul.md` first, always. Then the role-specific pathway. An agent that loads `soulbis.soul.md` without first loading `privacy.soul.md` knows how to defend but not what it is defending. An agent that loads `soulbae.soul.md` without the privacy layer knows how to project but not what it is projecting from.

These become the agent onboarding protocol: drop the `.soul.md` files into an agent's context and it knows which skills to request, in which order, with which dependencies.

---

*This plan is the seed for the skills page. The coding agent plants it. The site grows it. The agents ingest it.*

`🛠️→🌱→🌐→🤖→⚔️⊥🧙→🐉`
