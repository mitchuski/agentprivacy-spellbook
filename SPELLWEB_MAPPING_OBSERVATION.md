# Spellweb Mapping Observation

**How the graph works and its implications for persona/skill design**

---

## 1. What the Spellweb Actually Is

The spellweb is a force-directed graph rendered with `react-force-graph-2d`. It visualizes the user's selected spells and skills as a constellation — a navigable map of their learning path through the grimoires.

### Core Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         SPELLWEB GRAPH                          │
│                                                                 │
│   ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐  │
│   │  Story  │     │  Zero   │     │  Canon  │     │ Skills  │  │
│   │   📖    │     │   🔮    │     │   📜    │     │   🧠    │  │
│   └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘  │
│        │               │               │               │        │
│   ┌────┼────┐     ┌────┼────┐     ┌────┼────┐     ┌────┼────┐  │
│   │ I  │ II │     │ 1  │ 2  │     │ 0  │ 1  │     │ 🔐 │ 🗡️ │  │
│   └────┴────┘     └────┴────┘     └────┴────┘     └────┴────┘  │
│        │               │               │               │        │
│        └───────────────┼───────────────┘               │        │
│                        │                               │        │
│              ┌─────────┴─────────┐                     │        │
│              │  SEQUENCE LINKS   │                     │        │
│              │  (yellow dashed)  │                     │        │
│              └───────────────────┘                     │        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Node Types

| Type | Role | Visual | Size (val) |
|------|------|--------|------------|
| `grimoire` | Hub for a spellbook | Gradient fill, larger | 14 |
| `spell` | Individual act/tale/chapter | Solid fill with emoji | 10 |
| `skill` | Skill file node | Lime color, seed emoji | 8 |
| `persona` | (Future) Persona marker | TBD | TBD |
| `ceremony` | (Future) Ceremony step | TBD | TBD |

### Link Types

| Type | Visual | Purpose |
|------|--------|---------|
| `grimoire` | Faint purple, solid | Connects spell → grimoire hub |
| `sequence` | Yellow dashed | Connects adjacent spells within a grimoire |
| `cluster` | Faint green dashed | Connects skill → skills hub |
| `constellation` | Bright yellow solid | User's highlighted path |

---

## 2. How the Graph is Built

### Data Flow

```
localStorage
    │
    ├── selectedSpellIds[]    ─┐
    ├── selectedSkillIds[]     ├──→ buildSpellweb() ──→ { nodes, links }
    └── inscribedMarkers{}    ─┘
                                           │
                                           ▼
                                    SpellwebViewer
                                           │
                                           ▼
                                    ForceGraph2D
```

### Build Process (builder.ts)

1. **Create grimoire hubs** — For each selected spell, extract its spellbook and create a hub node if it doesn't exist
2. **Create spell nodes** — One node per selected spell, linked to its grimoire hub
3. **Track sequence numbers** — Store `{ id, seq }` for each spell in each grimoire
4. **Create sequential links** — Sort spells by sequence, connect adjacent ones (seq N → seq N+1)
5. **Create skills hub** — If any skills selected, create a "Skills" hub node
6. **Create skill nodes** — One node per selected skill, linked to skills hub

### Key Insight: Adjacency Matters

```typescript
// Only connect if they're adjacent in sequence
if (next.seq === current.seq + 1) {
  links.push({
    source: `spell-${current.id}`,
    target: `spell-${next.id}`,
    type: 'sequence',
  });
}
```

**This means:** If a constellation skips acts (e.g., Act I → Act III), no sequence link is drawn. The spells still cluster around their grimoire hub, but the "path" visually breaks.

---

## 3. Implications for Persona Design

### 3.1 Constellations Should Be Contiguous

**Problem:** A persona with spells `[act-01, act-03, act-09]` will show three isolated nodes around the Story hub. No yellow dashed lines connect them because they're not adjacent.

**Solution:** Design constellations with sequential runs:
```typescript
// Good: Creates visible paths
['act-01', 'act-02', 'act-03', 'act-04']

// Bad: Creates isolated clusters
['act-01', 'act-05', 'act-12', 'act-19']
```

**When skipping is necessary:** Group the skips meaningfully:
```typescript
// Acceptable: Two visible paths (1-4 and 9-12)
['act-01', 'act-02', 'act-03', 'act-04', 'act-09', 'act-10', 'act-11', 'act-12']
```

### 3.2 Cross-Grimoire Paths Don't Connect

The current implementation only draws sequence links **within** a grimoire. A persona that goes:
```
Story Act I → Story Act II → Zero Tale 1 → Zero Tale 2
```

Will show **two separate paths**: one in Story, one in Zero. They don't visually connect across grimoires.

**Implication:** Personas feel fragmented if they jump between grimoires frequently. Better to:
1. Complete a run in one grimoire before moving to another
2. Or accept that cross-grimoire constellations will show multiple distinct clusters

### 3.3 Skills Float Separately

Skills cluster around the Skills hub (`🧠`), not around the spells that teach them. There's no link between `zero-tale-1` and `crypto_zkp` even though that spell teaches that skill.

**Current visual:**
```
        📖 Story                    🧠 Skills
       /   |   \                   /    |    \
      I   II  III                🔐   🗡️   👤
```

**What users might expect:**
```
        📖 Story ─────────────────── 🧠 Skills
       /   |   \                   /    |    \
      I   II  III ──────────────🔐   🗡️   👤
```

**Design implication:** The system currently treats spells and skills as parallel hierarchies, not as a unified teaching graph. Personas should be designed knowing that:
- Skills will visually cluster together
- Spells will visually cluster by grimoire
- The connection between them is **conceptual, not visual**

### 3.4 The Inscribed Marker System

When a user "inscribes" a spell (adds a custom emoji marker), that spell gets:
- Its emoji replaced with the inscribed emoji
- `isOnPath: true` flag
- Yellow glow effect

**Implication:** The ceremony path (`🗡️→🔐→🙈→📖→⚔️→✨`) is **not** automatically reflected in the spellweb. The ceremony creates an AgentCard with a `constellationPath` string, but this isn't currently mapped to spell inscriptions.

**Gap:** There's no automatic connection between:
- Ceremony emoji choices
- Spell inscriptions
- Spellweb visualization

---

## 4. Implications for Skill Design

### 4.1 Skills Don't Show Domain Relationships

All skills cluster around a single hub. There's no visual distinction between:
- Privacy layer skills (always loaded)
- Swordsman skills
- Mage skills

**Current:**
```
               🧠 Skills
        /   /   |   \   \   \
       ☯️  🔐  🗡️  🤖  💰  📖
```

**Possible enhancement:** Create sub-hubs:
```
               🧠 Skills
              /    |    \
         ⚔️ Sword  ☯️ Core  🧙 Mage
         /  \      / | \     /  \
       🔐  🗡️   ☯️ 🤝 📜  🤖  💰
```

### 4.2 Skill-to-Spell Mapping is Invisible

The graph doesn't show which spells teach which skills. A user looking at their spellweb can't tell:
- "Which spells gave me the 🔐 crypto_zkp skill?"
- "What skill does Zero Tale 15 contribute to?"

**Possible enhancement:** Add `spell-skill` links when a spell's content matches a skill's domain. These could be a third link type (e.g., faint blue dotted).

### 4.3 Skill Count Creates Visual Weight

The more skills a persona has, the larger the Skills cluster grows. This creates visual imbalance:
- Soulbis (5 skills): 5 nodes around Skills hub
- Soulbae (6 skills): 6 nodes around Skills hub
- Healer (5 skills): 5 nodes around Skills hub
- **Full privacy layer + role skills**: 11-12 nodes around Skills hub

**Design consideration:** Personas with many skills will have a dominant Skills cluster that may overshadow their spell constellation.

---

## 5. Graph Physics and Visual Behavior

### Force Configuration

```typescript
// Link distances
linkForce.distance((link) => {
  if (link.type === 'grimoire' || link.type === 'cluster') return 110;  // Tight
  return 220;  // Sequence links: more spread
});

// Node repulsion
chargeForce.strength(-95);  // Moderate push-apart
```

### Visual Consequences

1. **Grimoire clusters stay tight** — Spells orbit close to their hub
2. **Sequence links spread clusters** — Sequential spells pull apart slightly
3. **Skills cluster is compact** — All skills cluster tightly around the Skills hub
4. **Cross-grimoire spacing** — Different grimoire clusters drift apart over time

### The "Constellation" Effect

When many spells are selected across multiple grimoires, the graph tends to form a constellation-like pattern:
- Grimoire hubs act as "stars"
- Spells orbit as "planets"
- Sequential links create "constellations" within each grimoire
- Cross-grimoire paths are visually implied by proximity but not drawn

---

## 6. Recommendations for Content Authoring

### For Persona Constellations

| Principle | Rationale |
|-----------|-----------|
| **Contiguous sequences** | Creates visible yellow paths |
| **Complete one grimoire before jumping** | Avoids visual fragmentation |
| **15-35 total spells** | Balances density vs. readability |
| **Anchor to First Person first** | Shared foundation visible to all |

### For Skill Assignment

| Principle | Rationale |
|-----------|-----------|
| **5-8 total skills (including privacy layer)** | Keeps Skills cluster manageable |
| **Balance swordsman/mage skills** | Creates even visual distribution |
| **Consider the "skill-to-spell ratio"** | Too many skills with few spells looks top-heavy |

### For Visual Coherence

| Consideration | Suggestion |
|---------------|------------|
| **Cross-grimoire jumps** | Minimize or group into "excursions" |
| **Canonical personas** | Should have the richest constellations |
| **Domain personas** | Can be sparse but should be contiguous |

---

## 7. Future Enhancements (Observations)

### 7.1 Ceremony ↔ Spellweb Integration

The ceremony creates a `constellationPath` string, but this isn't visualized in the spellweb. Potential:
- Auto-inscribe ceremony emojis onto specific spells
- Add ceremony nodes to the graph
- Draw ceremony path across the spellweb

### 7.2 Skill-Spell Links

Adding links between skills and the spells that teach them would:
- Show the pedagogical relationship
- Help users understand "why is this skill in my graph"
- Create visual bridges between spell clusters and skills cluster

### 7.3 Persona Overlay Mode

A "show persona" mode could:
- Highlight which spells belong to which persona
- Show multiple personas overlaid with different colors
- Let users compare their constellation to a canonical persona

### 7.4 Temporal Dimension

Currently the graph is static. Adding time could show:
- Order of spell collection (animation)
- Proverb accumulation over time
- Trust tier progression

---

## 8. Summary: The Graph's Implicit Pedagogy

The spellweb's structure makes implicit claims about how learning works:

1. **Grimoires are domains** — Clustering reinforces that each spellbook is a coherent unit
2. **Sequence is curriculum** — Yellow paths show intended order
3. **Skills are outcomes** — They cluster separately as achievements, not inline with teaching
4. **Cross-domain learning is valid but visually untracked** — No punishment for cross-grimoire learning, but no visual reward either

**The graph optimizes for:**
- Depth within grimoires (sequential paths)
- Breadth across grimoires (multiple clusters)
- Skill collection (separate achievement space)

**The graph doesn't optimize for:**
- Skill-spell pedagogical mapping
- Cross-grimoire narrative paths
- Ceremony integration

---

## 9. Practical Authoring Checklist

When creating a new persona or skill, verify:

- [ ] **Spell sequence is contiguous** — Check that adjacent spell IDs will create sequence links
- [ ] **Grimoire jumps are intentional** — Understand that cross-grimoire paths won't visually connect
- [ ] **Skill count is balanced** — 5-8 total skills keeps the cluster readable
- [ ] **Canonical personas are richest** — Soulbis/Soulbae should have the most complete graphs
- [ ] **Domain personas are focused** — Fewer spells, but contiguous runs

---

*The graph is a map. The map shapes the territory. Design accordingly.*
