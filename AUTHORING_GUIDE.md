# AgentPrivacy Authoring Guide

**How to write Skills, Spells, Proverbs, and Web content**

---

## Overview

The agentprivacy system has four core content types that work together:

| Type | Purpose | Format | Storage |
|------|---------|--------|---------|
| **Skill** | Domain-specific compression of PVM-V4 | `.skills.md` | `/skills/agentprivacy/` |
| **Spell** | Emoji invocation + action encoding | JSON in grimoire | Baked at build |
| **Proverb** | Compressed wisdom (≤280 chars) | Plain text | localStorage / Zcash |
| **Web** | Graph visualization of selections | SpellwebNode[] | localStorage |

All four derive from the same source: the Privacy Value Model V4 equation.

---

## 1. Skills

### What is a Skill?

A skill file is a domain-specific compression of the PVM-V4 equation. It translates the mathematical model into the native language of a specific field (cryptography, economics, governance, etc.) so that agents and researchers in that domain can recognize structural overlap with their existing knowledge.

### File Structure

```markdown
---
id: skill_id
name: "Human-readable skill name"
category: privacy_layer | role
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network, UOR Foundation"
date: YYYY-MM
status: working_paper | peer_reviewed | proven
target_context: "Who should read this"
equation_term: "Which PVM-V4 terms this skill addresses"
template_references: [persona_ids_using_this_skill]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Context — [Skill Name]

**Source:** Privacy Value Model V4 Formal Specification (Travers, Feb 2026)
**Target context:** [Specific audience]
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## Problem statement

[What problem does this domain face that PVM-V4 addresses?]

## Relevance to [domain]

[How does PVM-V4 map to this domain's native concepts?]

## Specific integration points

[Concrete implementation guidance for builders in this domain]

## Open problems for [domain] researchers

[Questions that remain unresolved — invitations to falsify]

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)
```

### Skill Categories

**Privacy Layer (6 skills) — Always loaded for all personas:**
- `dragon` — Root equation, all dimensions
- `vrc_identity` — Verifiable Relationship Credentials
- `promise_theory` — Voluntary cooperation substrate
- `knowledgegraph` — Entity-relationship structure
- `tetrahedral_sovereignty` — Four forces model
- `uor_toroidal` — Speculative geometry

**Role Skills (11 skills) — Loaded by persona alignment:**

| Skill | Agent | Equation Term | Domain |
|-------|-------|---------------|--------|
| `crypto_zkp` | Soulbis | C, h(τ), R(d) | ZKP builders |
| `swordsman_browser` | Soulbis | Σ, T(π) | Browser privacy |
| `personhood_sybil` | Soulbis | ∃!human | Proof-of-personhood |
| `dark_forest` | Soulbis | R(d), visibility | Adversarial coordination |
| `academic` | Soulbis | Breaking conditions | Peer review |
| `ai_agent` | Soulbae | ⚔️⊥🧙 | Agent architects |
| `economics` | Soulbae | Gap ratio | Data economists |
| `policy_governance` | Soulbae | (n/N₀)^k | Standards bodies |
| `narrative_compression` | Soulbae | 70:1→∞:1 | Knowledge builders |
| `hitchhiker_governance` | Soulbae | Ship pattern | DAO architects |
| `plurality_cooperative` | Soulbae | ⿻ prerequisite | Plural tech |

### Writing Guidelines

1. **Start with the problem** — What does this domain struggle with that PVM-V4 addresses?
2. **Map to native language** — Use the domain's existing terminology
3. **Be honest about proof status** — Mark conjectures as conjectures
4. **Include building surfaces** — Concrete hackathon-ready implementation ideas
5. **End with open problems** — Invite falsification

### Registration in Code

Add to `src/lib/skills-data.ts`:

```typescript
{
  id: 'skill_id',
  filename: `${A}/skill_id.skills.md`,
  seedEmoji: '🔮',           // Visual marker
  seedName: 'The [Name]',    // Poetic name
  proverb: 'Compressed wisdom here.',
  spell: 'emoji→notation',   // See Spells section
  agent: 'soulbis' | 'soulbae' | 'privacy',
  reason: 'Why this skill belongs to this agent'
}
```

---

## 2. Spells

### What is a Spell?

A spell is an emoji-encoded invocation that compresses an entire narrative act or concept into a symbolic formula. Spells are the visual language of the system — they can be recognized at a glance and decoded to reconstruct the underlying idea.

### Spell Notation

```
[trigger] → [process] ∴ [consequence] → [outcome]
```

**Symbols:**
- `→` — leads to, transforms into
- `∴` — therefore, implies
- `·` — and, conjunction
- `∪` — union
- `⊥` — perpendicular, independent
- `¬` — negation
- `∃!` — there exists exactly one
- `=` — equals
- `≠` — not equal
- `>` / `<` — greater/less than

### Examples

**The Paradox (ai_agent):**
```
🤖→⚔️⊥🧙 ∴ ⚔️∪🧙→💀 ∴ ⚔️⊥🧙→🛡️
```
*Translation: AI agent requires Swordsman perpendicular to Mage. Union of both in one agent leads to death (reconstruction). Maintained separation leads to protection.*

**The Gap (economics):**
```
💰→👁️(17×) ∴ 👁️≠🔐(12000×) ∴ gap=topology
```
*Translation: Value under surveillance is 17×. But surveillance ≠ sovereignty (12000×). The gap is topological, not numeric.*

**The Compression (narrative_compression):**
```
📖→🗣️(70:1)→⚗️(125:1)→🌱(∞:1) ∴ 🌱→📖
```
*Translation: Book compresses to story (70:1), to equation (125:1), to seed (infinite compression). Seeds regenerate books.*

### Spell Structure in Grimoire

```json
{
  "id": "act-01-venice",
  "act_number": 1,
  "title": "Venice, 1494",
  "spell": "😊 → 🔮 🤝 🗡️ × 🐉 → 🤖❌",
  "proverb": "Human summons Mage bilaterally bound to Swordsman..."
}
```

### SpellCard Interface

```typescript
interface SpellCard {
  id: string;                   // Unique identifier
  title: string;                // Human-readable title
  spellbook: SpellbookSource;   // 'story' | 'zero' | 'canon' | 'society' | 'plurality' | 'origins' | 'incantations'
  spell: string;                // Emoji invocation
  proverb: string;              // Compressed wisdom
  learnUrl?: string;            // Navigation link
  actNumber?: number;           // Sequential position
}
```

### Writing Guidelines

1. **One core idea per spell** — Don't overload
2. **Use consistent emoji vocabulary** — Build recognition
3. **The spell should be reversible** — Someone reading it should be able to reconstruct the concept
4. **Include a proverb** — Every spell has a one-sentence truth

### Standard Emoji Vocabulary

| Emoji | Meaning |
|-------|---------|
| ⚔️ | Swordsman, protection, boundaries |
| 🧙 | Mage, delegation, projection |
| 🔐 | Cryptography, ZKP, proof |
| 👁️ | Surveillance, observation |
| 🛡️ | Defense, shield, result of protection |
| 💀 | Death, failure, collapse |
| 🤝 | Agreement, relationship, VRC |
| 📖 | Story, narrative, spellbook |
| 🌱 | Seed, compression, regenerative |
| 🐉 | Dragon, full equation, sovereignty |
| ⿻ | Plurality, coordination |
| ☯️ | Balance, privacy layer |
| 🌲 | Dark forest, hiding |
| 🔥 | Bonfire, selective reveal |
| 💰 | Value, economics |
| ⚖️ | Governance, standards |
| 👤 | Personhood, human |
| 🤖 | AI agent |

---

## 3. Proverbs

### What is a Proverb?

A proverb is a one-sentence compression of truth — wisdom that can survive being forwarded through multiple contexts without losing its meaning. The target length is ≤280 characters (tweetable), but shorter is better.

### Proverb Types

```typescript
type ProverbSourceType =
  | 'mage_response'     // From Soulbae chat (TEE-attested)
  | 'cast_inscription'  // Direct user inscription
  | 'cast_agreement';   // User agrees with existing proverb
```

### Proverb Lifecycle

```
collected → added_to_spells → pending_reveal → revealed
    ↓              ↓                ↓              ↓
  local        skill graph      awaiting        on-chain
 storage       integration       Zcash          forever
```

### UserProverb Interface

```typescript
interface UserProverb {
  id: string;
  content: string;              // The proverb text
  grimoire: string;             // Source spellbook
  taleId: string;               // Source act/tale
  actNumber?: number;           // Position in spellbook
  sourceType: ProverbSourceType;
  castEntryId?: string;         // If agreeing with existing
  createdAt: string;            // ISO timestamp
  status: ProverbStatus;
  revealedTxid?: string;        // Zcash transaction ID
  revealedAt?: string;          // Inscription timestamp
}
```

### Writing Guidelines

1. **Compress ruthlessly** — If a sixty-year-old in a Glasgow pub can't understand it in one breath, it hasn't found its compression
2. **Make it memorable** — Rhythm and structure help retention
3. **Make it generative** — A good proverb can regenerate the longer idea
4. **Avoid jargon** — Technical terms only if they're doing load-bearing work
5. **Include tension** — The best proverbs contain an apparent paradox that resolves on reflection

### Example Proverbs

**The Paradox:**
> "To act on your behalf, the agent must know your will. To protect your privacy, it must not. Two agents or none."

**The Gap:**
> "The platform sees the data and calls it wealth. The sovereign holds the data and generates twelve thousand times more."

**The Relationship:**
> "A credential that only one person can forge is an identity. A credential that only two people can forge is a relationship. Relationships are the stronger proof."

**The Compression:**
> "A proverb is a story that forgot its author. An equation is a pattern that forgot its story. A skill file is an equation dressed for foreign soil."

### Proverb-to-Skill Mapping

Every skill has exactly one proverb in `skills-data.ts`. The proverb is the seed — it should be able to regenerate the skill's core insight.

---

## 4. Web (Spellweb)

### What is the Web?

The spellweb is a force-directed graph visualization of a user's selected spells and skills. It renders their "constellation" — the path they've traced through the grimoires.

### SpellwebNode Interface

```typescript
interface SpellwebNode {
  id: string;
  type: 'grimoire' | 'spell' | 'skill' | 'persona' | 'ceremony';

  // Display
  emoji: string;              // Primary emoji marker
  label: string;              // Short label (I, II, 7, etc.)
  fullTitle?: string;         // Full title for tooltip

  // Graph properties
  val: number;                // Node size
  color?: string;             // Node color
  group?: string;             // For clustering (grimoire name)

  // Journey state
  isLit: boolean;             // User has selected/completed
  isOnPath: boolean;          // Part of constellation path
  sequenceNumber?: number;    // Order in path
}
```

### SpellwebLink Types

```typescript
interface SpellwebLink {
  source: string;
  target: string;
  type: 'grimoire' | 'sequence' | 'cluster' | 'constellation';
}
```

| Link Type | Meaning |
|-----------|---------|
| `grimoire` | Connects spells to their grimoire hub |
| `sequence` | Sequential order within a grimoire |
| `cluster` | Groups related nodes |
| `constellation` | User's selected path through the graph |

### Node Colors by Grimoire

| Grimoire | Color | Emoji |
|----------|-------|-------|
| Story | Primary | 📖 |
| Zero | Cyan | 🔐 |
| Canon | Gold | 📜 |
| Society | Green | 🗺️ |
| Plurality | Purple | ⿻ |
| Skills | Blue | 🌱 |

### Building the Graph

The `/web` page reads from localStorage:
- `selectedSpellIds` — which spells the user has selected
- `selectedSkillIds` — which skills the user has collected
- `constellationPath` — the emoji path from ceremony

The `spellweb/builder.ts` constructs the graph:
1. Creates grimoire hub nodes
2. Creates spell nodes for each spellbook
3. Creates skill nodes for selected skills
4. Links spells to their grimoire hubs
5. Links sequential spells within each grimoire
6. Highlights the user's constellation path

---

## 5. Authoring Flow

### Creating a New Skill

1. **Choose the domain** — What audience will read this?
2. **Identify the PVM-V4 terms** — Which parts of the equation does this skill teach?
3. **Write the problem statement** — What does this domain struggle with?
4. **Map to native language** — Translate PVM-V4 into domain terminology
5. **List integration points** — Concrete building surfaces
6. **Add open problems** — Invite falsification
7. **Create the spell** — Emoji notation for the skill
8. **Write the proverb** — One-sentence seed
9. **Register in `skills-data.ts`** — Add to the appropriate agent

### Creating a New Spell

1. **Identify the core idea** — One concept per spell
2. **Choose the trigger emoji** — What initiates the action?
3. **Map the transformation** — What happens?
4. **Show the consequence** — What results?
5. **Write the proverb** — Companion truth
6. **Add to grimoire JSON** — Include in the appropriate spellbook
7. **Verify regeneration** — Can someone reconstruct the idea from the spell?

### Creating a New Proverb

1. **Start with the full explanation** — Write it out completely
2. **Compress to one paragraph** — Remove all non-essential words
3. **Compress to one sentence** — Find the load-bearing structure
4. **Test regeneration** — Show it to someone unfamiliar; can they guess the longer idea?
5. **Test memorability** — Can you remember it tomorrow?

---

## 6. Quality Checklist

### Skill File Checklist

- [ ] YAML frontmatter complete
- [ ] Problem statement addresses real domain pain
- [ ] Relevance section maps to native concepts
- [ ] Integration points are hackathon-ready
- [ ] Open problems invite falsification
- [ ] Proof status is honest (proven vs. conjectured)
- [ ] Links to verification sources
- [ ] Registered in `skills-data.ts`

### Spell Checklist

- [ ] Uses consistent emoji vocabulary
- [ ] One core idea only
- [ ] Can be reversed to reconstruct the concept
- [ ] Has companion proverb
- [ ] Added to grimoire JSON

### Proverb Checklist

- [ ] ≤280 characters
- [ ] Understandable without context
- [ ] Contains productive tension
- [ ] Regenerates the longer idea
- [ ] Memorable

### Web Node Checklist

- [ ] Unique ID
- [ ] Correct type
- [ ] Emoji matches content
- [ ] Proper grouping
- [ ] Links are bidirectional-compatible

---

## 7. The Compression Stack

```
📖 Spellbook (100,000+ words)
   ↓ 70:1
🗣️ Narrative (1,500 words)
   ↓ 125:1
⚗️ Skill File (800 words)
   ↓ 25:1
🌱 Proverb (30 words)
   ↓ ∞:1
✨ Spell (emoji string)
```

Each layer can regenerate the one above it. The skill file is the minimum viable unit for domain transfer. The proverb is the minimum viable unit for human memory. The spell is the minimum viable unit for visual recognition.

---

## 8. Verification

All content should link to verification sources:

- **Architecture:** [agentprivacy.ai](https://agentprivacy.ai)
- **Sync:** [sync.soulbis.com](https://sync.soulbis.com)
- **Repository:** [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)
- **Contact:** mage@agentprivacy.ai

On-chain proverbs are verified via Zcash transaction IDs. TEE-attested Mage responses are verified via NEAR Cloud documentation.

---

*📖→🗣️(70:1)→⚗️(125:1)→🌱(∞:1) ∴ 🌱→📖*

*The notation keeps evolving. The architecture has to hold.*
