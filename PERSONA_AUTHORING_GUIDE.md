# Persona Authoring Guide

**How to create personas, assign skills, and path spell constellations**

---

## Overview

A persona is a domain-specific instantiation of the dual-agent framework. Each persona:
- Has an **alignment** (swordsman, mage, or balanced)
- Inherits the **privacy layer skills** (6 skills, always loaded)
- Adds **role skills** specific to their domain (2-6 skills)
- Follows a **spell constellation** through the grimoires
- Speaks with a **voice** (tagline, proverbs, aesthetic)

---

## 1. Persona Architecture

### The 16-Persona System

```
CANONICAL (2)
├── Soulbis ⚔️ — The First Swordsman
└── Soulbae 🧙 — The First Mage

SWORDSMAN (5)
├── Cipher 🗡️🔐 — ZKP Protocol Engineer
├── Warden 🗡️🌐 — Browser Privacy Builder
├── Gatekeeper 🗡️👤 — Proof-of-Personhood Researcher
├── Ranger 🗡️🌲 — Dark Forest Strategist
└── Sentinel 🗡️🛡️ — Infrastructure Security Architect

MAGE (5)
├── Assessor 🧙💰 — Privacy Data Economist
├── Ambassador 🧙⚖️ — Standards & Governance Architect
├── Chronicler 🧙📖 — Knowledge Compression Builder
├── Shipwright 🧙🏴‍☠️ — DAO & Community Architect
└── Weaver 🧙⿻ — Plural Technology Researcher

BALANCED (4)
├── Healer ☯️🏥 — Healthcare Privacy Architect
├── Witness ☯️📰 — Privacy-Preserving Journalist
├── Architect ☯️🤖 — AI Agent System Designer
└── Pedagogue ☯️🎓 — Privacy Education Designer
```

### Alignment Logic

| Alignment | Primary Force | Emergent Force | Skill Bias |
|-----------|---------------|----------------|------------|
| **Swordsman** | Protect | Reflect | `crypto_zkp`, `swordsman_browser`, `personhood_sybil`, `dark_forest`, `academic` |
| **Mage** | Project | Connect | `ai_agent`, `economics`, `policy_governance`, `narrative_compression`, `hitchhiker_governance`, `plurality_cooperative` |
| **Balanced** | Both | Both | Cross-cutting combination from both pools |

---

## 2. Persona Template Structure

### TypeScript Interface

```typescript
interface PersonaTemplate {
  id: string;                           // Unique identifier (lowercase, underscore)
  name: string;                         // Display name with title
  emoji: string;                        // 1-2 emoji visual marker
  tagline: string;                      // First-person identity statement
  alignment: 'swordsman' | 'mage' | 'balanced';
  category: 'canonical' | 'swordsman' | 'mage' | 'balanced';
  skills_role: string[];                // Role skill IDs (privacy layer implicit)
}
```

### Example: The Healer

```typescript
{
  id: 'healer',
  category: 'balanced',
  name: 'The Healer — Healthcare Privacy Architect',
  emoji: '☯️🏥',
  tagline: "Trust is architectural, not contractual. The patient's data saves lives only if the patient trusts the system.",
  alignment: 'balanced',
  skills_role: ['crypto_zkp', 'policy_governance', 'ai_agent', 'personhood_sybil', 'economics']
}
```

---

## 3. Creating a New Persona

### Step 1: Define the Domain

**Questions to answer:**
1. What real-world role does this persona represent?
2. What privacy challenges does this domain face?
3. Does this domain lean toward protection (swordsman) or projection (mage)?
4. What existing personas might this overlap with?

**Example domains not yet covered:**
- Financial auditor (balanced: crypto + economics + policy)
- Whistleblower support (swordsman: dark_forest + crypto + narrative)
- Family privacy coordinator (balanced: swordsman_browser + ai_agent + personhood)
- Research data steward (mage: academic + policy + narrative)

### Step 2: Choose Alignment

| If the domain... | Then alignment is... |
|------------------|---------------------|
| Primarily defends boundaries | **swordsman** |
| Primarily coordinates/delegates | **mage** |
| Does both equally | **balanced** |

**Swordsman emoji prefix:** `🗡️`
**Mage emoji prefix:** `🧙`
**Balanced emoji prefix:** `☯️`

### Step 3: Select Role Skills

**Rule:** 3-6 role skills per persona. More than 6 loses focus; fewer than 3 lacks depth.

**Privacy layer (always included):**
- `dragon` — Root equation
- `vrc_identity` — Verifiable Relationship Credentials
- `promise_theory` — Voluntary cooperation
- `knowledgegraph` — Entity-relationship structure
- `tetrahedral_sovereignty` — Four forces model
- `uor_toroidal` — Speculative geometry

**Swordsman role skills:**
| Skill | When to include |
|-------|-----------------|
| `crypto_zkp` | Building/evaluating proof systems |
| `swordsman_browser` | User-facing privacy tools |
| `personhood_sybil` | Identity verification matters |
| `dark_forest` | Adversarial environments |
| `academic` | Publishing/reviewing research |

**Mage role skills:**
| Skill | When to include |
|-------|-----------------|
| `ai_agent` | Designing/using AI agents |
| `economics` | Valuing privacy, market dynamics |
| `policy_governance` | Standards, regulations, institutions |
| `narrative_compression` | Teaching, documenting, storytelling |
| `hitchhiker_governance` | DAO, community, ship-building |
| `plurality_cooperative` | Plural tech, coordination mechanisms |

### Step 4: Write the Tagline

**Formula:** First-person statement that encodes the persona's core insight.

**Patterns that work:**
- **Paradox resolution:** "The hardest problem in X is not Y. It is Z."
- **Architectural claim:** "Trust is architectural, not contractual."
- **Value statement:** "The gap between X and Y is not a number. It is a topology."
- **Negation-affirmation:** "Without X, every Y is Z."

**Constraints:**
- First person ("I" statements are optional but powerful)
- One breath (can be spoken aloud without pausing)
- Domain-native language (use the field's vocabulary)
- Contains a productive tension

### Step 5: Choose the Emoji

**Structure:** `[alignment_prefix][domain_symbol]`

| Alignment | Prefix |
|-----------|--------|
| Swordsman | `🗡️` |
| Mage | `🧙` |
| Balanced | `☯️` |

**Domain symbols already used:**
- 🔐 (crypto), 🌐 (browser), 👤 (personhood), 🌲 (dark forest), 🛡️ (security)
- 💰 (economics), ⚖️ (governance), 📖 (narrative), 🏴‍☠️ (DAO), ⿻ (plurality)
- 🏥 (healthcare), 📰 (journalism), 🤖 (AI), 🎓 (education)

**Available symbols for new personas:**
- 🔬 (research), 💼 (business), 🏛️ (government), 🌍 (environment)
- 👨‍👩‍👧‍👦 (family), 🎨 (creative), 🏦 (finance), 📡 (infrastructure)

### Step 6: Register the Persona

Add to `src/lib/persona-index.ts`:

```typescript
{
  id: 'new_persona_id',
  category: 'balanced',  // or 'swordsman' or 'mage'
  name: 'The [Title] — [Subtitle]',
  emoji: '☯️🔬',
  tagline: 'Your tagline here.',
  alignment: 'balanced',
  skills_role: ['skill_1', 'skill_2', 'skill_3']
}
```

Add to `src/lib/spellbook-templates.ts`:

```typescript
{
  id: 'new_persona_id',
  name: 'The [Title] — [Subtitle]',
  emoji: '☯️🔬',
  tagline: 'Your tagline here.',
  alignment: 'balanced',
  spellIds: NEW_PERSONA_SPELL_IDS,  // Define the constellation
  skillIds: getSkillIdsForPersona('new_persona_id'),
}
```

---

## 4. Skill Coverage Matrix

### Current Coverage

Each skill should appear in 2-5 personas to ensure:
- Multiple entry points for learners
- Cross-domain validation
- No skill is orphaned

| Skill | Personas Using It | Coverage |
|-------|-------------------|----------|
| `crypto_zkp` | Cipher, Warden, Gatekeeper, Sentinel, Ranger, Healer, Witness, Architect | Heavy (8) |
| `swordsman_browser` | Warden, Sentinel, Ranger, Pedagogue | Medium (4) |
| `personhood_sybil` | Cipher, Gatekeeper, Warden, Sentinel, Healer, Architect | Heavy (6) |
| `dark_forest` | Ranger, Sentinel, Witness, Architect | Medium (4) |
| `academic` | Cipher, Gatekeeper | Low (2) |
| `ai_agent` | Assessor, Ambassador, Weaver, Healer, Witness, Architect | Heavy (6) |
| `economics` | Assessor, Ranger, Shipwright, Healer, Pedagogue | Heavy (5) |
| `policy_governance` | Ambassador, Assessor, Healer, Pedagogue, Weaver | Heavy (5) |
| `narrative_compression` | Chronicler, Ambassador, Weaver, Pedagogue, Witness | Heavy (5) |
| `hitchhiker_governance` | Shipwright, Architect, Chronicler | Medium (3) |
| `plurality_cooperative` | Weaver, Shipwright, Chronicler | Medium (3) |

### Gap Analysis

**Underused skills (need more personas):**
- `academic` — Only 2 personas. Consider: Research Data Steward, Peer Review Specialist
- `hitchhiker_governance` — Only 3 personas. Consider: Community Manager, Open Source Maintainer
- `plurality_cooperative` — Only 3 personas. Consider: Cooperative Economist, Democratic Technologist

**Overused skills (may need splitting):**
- `crypto_zkp` at 8 personas is fine (it's foundational)
- `ai_agent` at 6 is fine (it's the current frontier)

---

## 5. Spell Constellation Pathing

### What is a Constellation?

A constellation is the ordered path of spells a persona studies through the grimoires. It defines:
- **Entry point** — Where the persona starts learning
- **Progression** — The order of concepts
- **Emphasis** — Which spellbooks weight more heavily
- **Divergence point** — Where swordsman and mage paths split

### Constellation Structure

```typescript
interface SpellbookTemplate {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  alignment: 'swordsman' | 'mage' | 'balanced';
  spellIds: string[];     // The constellation path
  skillIds: string[];     // Skills unlocked by this path
}
```

### Canonical Paths

**Soulbis (Swordsman) Path:**
```
First Person (all 23 acts)
  → Zero Knowledge (defensive tales: 1-4, 9-14, 26)

Total: 34 spells
```

**Soulbae (Mage) Path:**
```
First Person (all 23 acts)
  → Canon (preface, cypherpunk, early, synthesis, missing primitive, open canon)
  → Parallel Society (Exit, Exile, Access)
  → Plurality (opening + closing)
  → Incantations (Triune Graph, Manifold Dragon)

Total: 35 spells
```

### Path Design Principles

1. **All paths start with First Person** — The shared foundation
2. **Divergence reflects alignment** — Swordsman goes to Zero; Mage goes to Canon
3. **Depth over breadth** — Better to deeply cover one spellbook than skim all
4. **Skills map to spells** — Each skill should have 2-4 spells that teach it

### Creating a New Constellation

**Step 1: Choose entry spells**

Everyone starts with these (shared understanding):
```typescript
const SHARED_ENTRY = [
  'act-01-venice',        // The founding ceremony
  'act-02-dual-ceremony', // The separation theorem
  'act-03-drakes-teaching', // The equation
];
```

**Step 2: Add alignment-specific spells**

**For Swordsman personas:**
```typescript
// Blade formation
'act-04-blade-alone',
'act-05-light-armor',

// Protection mechanisms
'act-09-zcash-shield',
'act-17-bonfire-dark-forest',

// Zero Knowledge grimoire
'zero-tale-1', 'zero-tale-2', 'zero-tale-3', // Foundations
'zero-tale-9', 'zero-tale-10', // Applications
```

**For Mage personas:**
```typescript
// Projection mechanisms
'act-12-forgetting',
'act-19-enthusiastic-archivist',

// Canon grimoire
'chapter-00-preface',
'chapter-01-cypherpunk-whispers',
'chapter-03-synthesis',

// Plurality
'plurality-opening',
'plurality-act-7', 'plurality-act-8', // Coordination mechanisms
```

**For Balanced personas:**
```typescript
// Take from both pools
const BALANCED_CORE = [
  'act-01-venice',
  'act-03-drakes-teaching',
  'act-09-zcash-shield',    // Swordsman
  'act-12-forgetting',       // Mage
  'chapter-00-preface',      // Canon entry
  'chapter-03-synthesis',    // Unified view
];
```

**Step 3: Add domain-specific spells**

Map the persona's skills to relevant spells:

| Skill | Relevant Spells |
|-------|-----------------|
| `crypto_zkp` | zero-tale-1 through zero-tale-18 |
| `swordsman_browser` | act-04, act-05, act-08, act-15 |
| `personhood_sybil` | act-06, act-07, zero-tale-23 |
| `dark_forest` | act-17, zero-tale-26 |
| `academic` | act-03, chapter-09 (open canon) |
| `ai_agent` | act-02, act-19, act-20 |
| `economics` | act-10, act-16, chapter-08 |
| `policy_governance` | chapter-01, chapter-03, parallel-9 |
| `narrative_compression` | act-12, act-19, chapter-00 |
| `hitchhiker_governance` | act-21, act-22 |
| `plurality_cooperative` | plurality-opening through plurality-closing |

### Example: Building the Healer Constellation

**Persona:** Healer — Healthcare Privacy Architect
**Alignment:** Balanced
**Skills:** `crypto_zkp`, `policy_governance`, `ai_agent`, `personhood_sybil`, `economics`

**Constellation design:**

```typescript
const HEALER_SPELL_IDS = [
  // Shared entry
  'act-01-venice',
  'act-02-dual-ceremony',
  'act-03-drakes-teaching',

  // Personhood (critical for healthcare)
  'act-06-trust-graph',
  'act-07-mirror',

  // Protection (patient data)
  'act-09-zcash-shield',

  // Delegation (clinical AI)
  'act-19-enthusiastic-archivist',
  'act-20-infinite-vault',

  // Policy (healthcare regulations)
  'chapter-00-preface',
  'chapter-01-cypherpunk-whispers',
  'chapter-03-synthesis',

  // Economics (health data value)
  'act-16-pools-become-wells',
];
```

**Rationale:**
- Heavy on personhood (patients must be verified)
- Includes protection (HIPAA, data sovereignty)
- Includes delegation (clinical decision support AI)
- Includes policy (regulatory navigation)
- Includes economics (health data markets)

---

## 6. Ceremony Constellation

### What is the Ceremony?

The ceremony is the onboarding flow where users create their AgentCard. Each step lets them choose an emoji marker, building their unique "constellation path."

### Ceremony Steps

| Step | ID | Purpose | Emoji Options |
|------|-----|---------|---------------|
| 1 | `naming` | Display name | 🗡️ ⚔️ 🛡️ 🏹 🗿 🌟 |
| 2 | `keygen` | Ed25519 keypair | 🔐 🔑 🗝️ 💎 ⚡ 🔮 |
| 3 | `privacy` | Attribution level | 🙈 👁️ 🎭 🌑 🔒 🕶️ |
| 4 | `grimoires` | Spellbook selection | 📖 📚 📜 🌀 🧙 ✨ |
| 5 | `seal` | Sign agent card | ⚔️ 🖋️ 💫 🔥 🌟 👤 |
| 6 | `activation` | Enter constellation | ✨ 🌅 🎆 💥 🌟 🚀 |

### Constellation Path Format

```
🗡️→🔐→🙈→📖→⚔️→✨
```

Each arrow (`→`) connects ceremony steps in order. The path is stored on the AgentCard and displayed in the spellweb visualization.

### Adding New Ceremony Steps

To add a step, update `src/lib/ceremony/constellation.ts`:

```typescript
{
  id: 'new_step',
  title: 'Step Title',
  description: 'What this step does',
  emojiOptions: ['emoji1', 'emoji2', 'emoji3', 'emoji4', 'emoji5', 'emoji6'],
  dataKey: 'fieldToPopulate',
  requiredForComplete: true,
}
```

---

## 7. Trust Tiers and Progression

### Trust Tier System

| Tier | Name | Requirements | Unlocks |
|------|------|--------------|---------|
| 0 | `blade` | Complete ceremony | Basic spellbook access |
| 1 | `light` | Collect 10+ proverbs | Proverb sharing |
| 2 | `heavy` | Inscribe 1+ proverb on Zcash | Full spellweb access |
| 3 | `dragon` | TEE attestation + VRC | Agent-to-agent trust |

### Armor Progression

The tier maps to the "armor progression" narrative:
- **Blade** — The swordsman exists but is unarmored
- **Light Armor** — Basic protection, visible to community
- **Heavy Armor** — Full sovereignty, on-chain presence
- **Dragon** — TEE-verified, can establish VRCs with other dragons

---

## 8. Quality Checklist

### Persona Checklist

- [ ] Unique ID (lowercase, underscores)
- [ ] Alignment matches skill selection
- [ ] 3-6 role skills assigned
- [ ] Tagline is first-person and one-breath
- [ ] Emoji follows `[prefix][domain]` pattern
- [ ] No duplicate emoji with existing personas
- [ ] Registered in `persona-index.ts`
- [ ] Registered in `spellbook-templates.ts`
- [ ] Constellation path designed
- [ ] Skills map to spells in constellation

### Constellation Checklist

- [ ] Starts with shared entry spells
- [ ] Includes alignment-divergence point
- [ ] Each skill has 2-4 supporting spells
- [ ] Total 15-40 spells (not too broad, not too narrow)
- [ ] No duplicate spell IDs
- [ ] Spells exist in grimoire-baked.ts

### Skill Coverage Checklist

- [ ] No skill appears in fewer than 2 personas
- [ ] No skill appears in more than 8 personas
- [ ] Balanced personas draw from both pools
- [ ] Canonical personas (Soulbis/Soulbae) have maximum coverage

---

## 9. Persona Writing Examples

### Swordsman Persona: The Auditor

```typescript
{
  id: 'auditor',
  category: 'swordsman',
  name: 'The Auditor — Privacy Compliance Verifier',
  emoji: '🗡️🔍',
  tagline: 'Compliance without surveillance is possible. I verify the proof, not the data.',
  alignment: 'swordsman',
  skills_role: ['crypto_zkp', 'policy_governance', 'academic', 'economics']
}
```

**Constellation:**
```typescript
const AUDITOR_SPELL_IDS = [
  'act-01-venice', 'act-02-dual-ceremony', 'act-03-drakes-teaching',
  'act-09-zcash-shield', 'act-10-topology',
  'zero-tale-1', 'zero-tale-2', 'zero-tale-3', 'zero-tale-4',
  'zero-tale-15', 'zero-tale-16', 'zero-tale-17', 'zero-tale-18',
  'chapter-03-synthesis', 'chapter-08-missing-primitive',
];
```

### Mage Persona: The Curator

```typescript
{
  id: 'curator',
  category: 'mage',
  name: 'The Curator — Knowledge Commons Steward',
  emoji: '🧙🏛️',
  tagline: 'The commons thrives when contributors are protected. I tend the garden without harvesting the gardeners.',
  alignment: 'mage',
  skills_role: ['narrative_compression', 'hitchhiker_governance', 'plurality_cooperative', 'policy_governance']
}
```

**Constellation:**
```typescript
const CURATOR_SPELL_IDS = [
  'act-01-venice', 'act-02-dual-ceremony', 'act-03-drakes-teaching',
  'act-12-forgetting', 'act-19-enthusiastic-archivist', 'act-20-infinite-vault',
  'act-21-hitchhikers-gambit', 'act-22-hoopy-frood',
  'chapter-00-preface', 'chapter-01-cypherpunk-whispers',
  'plurality-opening', 'plurality-act-7', 'plurality-act-8', 'plurality-closing',
];
```

### Balanced Persona: The Steward

```typescript
{
  id: 'steward',
  category: 'balanced',
  name: 'The Steward — Family Privacy Coordinator',
  emoji: '☯️👨‍👩‍👧‍👦',
  tagline: 'Children deserve sovereignty before they can spell it. I hold the keys until they can hold their own.',
  alignment: 'balanced',
  skills_role: ['swordsman_browser', 'ai_agent', 'personhood_sybil', 'narrative_compression']
}
```

**Constellation:**
```typescript
const STEWARD_SPELL_IDS = [
  'act-01-venice', 'act-02-dual-ceremony', 'act-03-drakes-teaching',
  'act-04-blade-alone', 'act-05-light-armor',
  'act-06-trust-graph', 'act-07-mirror',
  'act-12-forgetting',
  'act-15-running-in-shackles',
  'chapter-00-preface',
];
```

---

## 10. The Persona Lattice

All personas exist on a lattice defined by:
- **X-axis:** Protection ↔ Projection (Swordsman ↔ Mage)
- **Y-axis:** Foundational ↔ Applied (Theory ↔ Practice)

```
              PROJECTION (Mage)
                    │
    Weaver ⿻       │       📖 Chronicler
         ⚖️ Ambassador    🏴‍☠️ Shipwright
                    │    💰 Assessor
                    │
FOUNDATIONAL ───────┼─────── APPLIED
                    │
    📜 Gatekeeper   │       🌐 Warden
    🔐 Cipher       │    🌲 Ranger
                    │    🛡️ Sentinel
                    │
              PROTECTION (Swordsman)
```

Balanced personas sit at the center, drawing from both axes.

---

*The notation keeps evolving. The architecture has to hold.*
