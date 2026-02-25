# Spellweb (standalone) vs web (agentprivacy)

**Version:** 2.1
**Date:** February 2026
**Status:** Architectural Specification — see also `docs/SPELLWEB_WEB_TRANSFORMER.md`
**Spell:** ⚔️🕸️⊥🧙📊 | 😊
**Proverb:** *"The Spellweb is the atlas. The web is your path on the map."*

---

## The Core Distinction

**Spellweb** (the whole) will be a **standalone domain** — the full knowledge graph viewer. **web** is the **personal journey** on agentprivacy only (route `/web`). One product, one route on this site.

| Feature | **Spellweb (standalone domain)** | **web (agentprivacy `/web`)** |
|---------|----------------------------------|-------------------------------|
| Where | Separate product/domain | This repo, route `/web` |
| Purpose | Complete knowledge graph | Your personal journey |
| Nodes | Tales, protocols, standards, concepts, primitives | Spells, skills, personas you’ve lit |
| Edges | inscription_echo, principle_extends, implements, guild_bridge, dependency | User connections, constellation paths |
| Data source | Canonical JSON / build-time ingestion (e.g. `public/nexus/` in this repo as seed) | `localStorage` + spellbook storage |
| Privacy | Mage-shared, read-only | Swordsman-protected, local only |
| Visualization | D3 (or equivalent) force + Paradox Plane, node inspector | SpellwebViewer: emojis, lines, react-force-graph-2d |

---

## Why Two Graphs?

### The Spellweb Already Exists

The current `/spellweb` implementation (`SpellwebViewer.tsx`, `ForceGraph.tsx`) renders the user's selected spells and skills as an interactive constellation. It uses `react-force-graph-2d` and pulls from:

- `buildSpellweb()` in `src/lib/spellweb/builder.ts`
- User's `selectedSpellIds` and `selectedSkillIds`
- `localStorage` for persisted user links

This is **personal**. It shows *your* journey through the grimoires. What you've lit. What you've connected.

### The Nexus Is the Map

The Nexus is the **complete knowledge graph** — every tale, protocol, standard, and their relationships. It exists whether or not you've engaged with any of it. It's the atlas that the user's spellweb journey is plotted onto.

The current `/spellweb` page already has a `nodes.json` and `edges.json` with 17 tales/protocols/standards. This is the seed of the Nexus, but it's been conflated with the personal journey graph.

### Separation Benefits

1. **Clarity**: Users understand "this is my path" (Spellweb) vs "this is everything" (Nexus)
2. **Privacy**: The Spellweb is Swordsman-protected (shows your choices). The Nexus is Mage-shared (shows canonical knowledge)
3. **Scalability**: Nexus can grow to 500+ nodes from full documentation without cluttering the personal journey view
4. **Integration**: The two can be overlaid — show the Nexus with your Spellweb path highlighted

---

## Architectural Layout

```
src/
├── app/
│   ├── spellweb/                    # USER JOURNEY GRAPH (existing, enhanced)
│   │   ├── page.tsx                 # Personal spell/skill constellation
│   │   └── components/
│   │       └── ForceGraph.tsx       # D3.js (current journey renderer)
│   │
│   ├── nexus/                       # KNOWLEDGE GRAPH (new)
│   │   ├── page.tsx                 # Complete KG explorer
│   │   ├── layout.tsx               # Nexus-specific layout
│   │   ├── [nodeId]/
│   │   │   └── page.tsx             # Deep-link to specific node
│   │   └── components/
│   │       ├── NexusGraph.tsx       # D3.js force simulation (GitNexus-derived)
│   │       ├── NodeInspector.tsx    # Click-to-inspect panel
│   │       ├── GraphFilters.tsx     # Layer toggles
│   │       ├── ParadoxPlane.tsx     # Scatter plot view (privacy-delegation spectrum)
│   │       └── NexusChat.tsx        # Graph-grounded Soulbae
│   │
│   ├── spells/                      # Existing spellbook reader
│   │   └── page.tsx                 # Can link to both graphs
│   │
│   └── mage/                        # Existing mage dashboard
│       └── page.tsx                 # Spellweb viewer embedded here
│
├── lib/
│   ├── spellweb/                    # USER JOURNEY (existing)
│   │   ├── types.ts                 # SpellwebNode, SpellwebLink (journey types)
│   │   ├── builder.ts               # buildSpellweb() for user selections
│   │   ├── loader.ts                # Load user journey data
│   │   └── kg-types.ts              # SpellwebKGNode (knowledge graph types)
│   │
│   └── nexus/                       # KNOWLEDGE GRAPH (new)
│       ├── types.ts                 # NexusNode, NexusEdge (full KG types)
│       ├── loader.ts                # Load canonical graph from JSON/KuzuDB
│       ├── schema.ts                # KuzuDB schema definitions
│       ├── query.ts                 # Cypher query helpers
│       └── overlay.ts               # Merge user's spellweb onto nexus
│
├── components/
│   ├── spellweb/                    # Existing
│   │   └── SpellwebViewer.tsx       # react-force-graph-2d (user journey)
│   │
│   └── nexus/                       # New
│       ├── NexusViewer.tsx          # Full KG visualization
│       └── OverlayToggle.tsx        # "Show my path" toggle
│
└── data/
    └── nexus/                       # Build-time generated (new)
        ├── knowledge-graph.json     # Full canonical graph
        ├── spell-index.json         # Spell ID → node mapping
        └── persona-paths.json       # Pre-computed constellation paths

public/
├── spellweb/                        # Existing (keep for Nexus seed data)
│   ├── nodes.json                   # 17 tales/protocols/standards
│   └── edges.json                   # 15 relationships
```

---

## Data Model Comparison

### Spellweb (Journey) Types

```typescript
// src/lib/spellweb/types.ts (existing)
export interface SpellwebNode {
  id: string;
  type: 'grimoire' | 'spell' | 'skill' | 'persona' | 'ceremony';
  emoji: string;
  label: string;
  fullTitle?: string;
  val: number;              // Node size
  color?: string;
  group?: string;           // Grimoire name
  isLit: boolean;           // User has selected this
  isOnPath: boolean;        // Part of constellation path
  sequenceNumber?: number;
}

export interface SpellwebLink {
  source: string;
  target: string;
  type: 'grimoire' | 'sequence' | 'cluster' | 'constellation' | 'connect';
}
```

### Nexus (Knowledge Graph) Types

```typescript
// src/lib/nexus/types.ts (new, extends kg-types.ts)
export type Guild = 'swordsman' | 'mage' | 'emergent' | 'bridge';
export type NodeType = 'tale' | 'protocol' | 'standard' | 'primitive' | 'concept' | 'persona';
export type EdgeType = 'inscription_echo' | 'principle_extends' | 'implements' | 'guild_bridge' | 'dependency';

export interface NexusNode {
  id: string;
  label: string;
  type: NodeType;
  guild: Guild;
  protocolFamily: string;

  // Dimensional scoring (privacy stack)
  dimensions: {
    d1Hide: number;
    d2Commit: number;
    d3Prove: number;
    d4Connect: number;
    d5Reflect: number;
    d6Delegate: number;
  };

  // Paradox positioning
  privacyDelegationPosition: number;  // 0.0 = pure privacy, 1.0 = pure delegation
  dimensionalScale: number;           // 0.0 = d₁ level, 1.0 = d₆ level

  // Metadata
  complexity: number;                 // 1-6 (shape: triangle → hexagon)
  maturity: 'concept' | 'spec' | 'implementation' | 'deployed';
  inscriptions: string[];
  summary: string;
  standards: string[];
  taleUrl?: string;
  externalUrl?: string;
}

export interface NexusEdge {
  source: string;
  target: string;
  type: EdgeType;
  strength: number;                   // 0.0-1.0
  label?: string;
}

// User overlay (when viewing Nexus with personal journey)
export interface NexusOverlay {
  litNodeIds: Set<string>;            // User's selected spells mapped to nexus nodes
  userEdges: Array<{source: string; target: string}>;  // User-created connections
  comprehensionMarkers: Map<string, number>;  // Node ID → comprehension score
}
```

---

## View Modes

### `/spellweb` — Personal Journey

**Default state**: Shows only spells/skills the user has selected (lit nodes), their grimoire clusters, and user-created connections.

**Components**:
- `SpellwebViewer.tsx` (existing react-force-graph-2d)
- Emoji-based nodes with glow effects
- Constellation path highlighting
- "Connect" mode to draw user edges

**Data flow**:
```
MagePanel selections → buildSpellweb() → localStorage persistence → SpellwebViewer render
```

### `/nexus` — Complete Knowledge Graph

**Default state**: Shows all 17+ nodes (tales, protocols, standards) with full relationship structure.

**View modes**:
1. **Constellation Map** — Force-directed graph (D3.js), nodes cluster by relationships
2. **Paradox Plane** — Scatter plot with X = privacy-delegation, Y = dimensional scale

**Components**:
- `NexusGraph.tsx` — D3.js force simulation with polygon shapes by complexity
- `ParadoxPlane.tsx` — Scatter plot view
- `NodeInspector.tsx` — Click any node for details, "Ask Soulbae about this"
- `GraphFilters.tsx` — Filter by guild, type, maturity
- `NexusChat.tsx` — Graph-grounded Soulbae with Cypher queries

**Data flow**:
```
Build-time: agentprivacy-docs → ingestion pipeline → knowledge-graph.json
Runtime: knowledge-graph.json → KuzuDB WASM → NexusGraph render
```

### Nexus + Spellweb Overlay

A toggle on `/nexus` called **"Show My Path"** overlays the user's Spellweb journey onto the complete Nexus:

- Lit nodes glow (user has selected the corresponding spell)
- User-created connections appear as dashed cyan lines
- Comprehension markers show where user has demonstrated understanding
- Unlit nodes remain visible but dimmed

This is the "you are here" view — seeing your personal journey in the context of everything that exists.

---

## Navigation Integration

### Top Navigation Updates

```typescript
// src/lib/nav.ts
export const NAV_LINKS = [
  // ... existing links ...
  { href: '/spellweb', label: 'Your Web', emoji: '🕸️' },  // Personal journey
  { href: '/nexus', label: 'Nexus', emoji: '📊' },        // Complete KG
];
```

### Cross-linking

| From | To | Mechanism |
|------|-----|-----------|
| `/spells` (tale card) | `/nexus/[taleId]` | "View in Nexus" link |
| `/nexus` (node inspector) | `/zero/[n]` or `/story/[act]` | "Read this tale" link |
| `/nexus` (node) | `/spellweb` | "Add to my web" (lights the spell) |
| `/mage` (dashboard) | `/spellweb` embedded | SpellwebViewer component |
| `/spellweb` | `/nexus` | "Explore full map" link |

---

## Implementation Phases (Revised)

### Phase 0: Architectural Separation (Week 1)

**Goal**: Clean separation of existing code into journey vs knowledge graph concerns.

1. Rename `/spellweb/components/ForceGraph.tsx` to clarify it's the KG viewer (currently dual-purpose)
2. Create `/nexus` route with placeholder page
3. Move `kg-types.ts` to `src/lib/nexus/types.ts`
4. Keep `types.ts` (journey types) in `src/lib/spellweb/`
5. Create `src/lib/nexus/loader.ts` to load from `public/spellweb/nodes.json` (temporary)
6. **Milestone**: Two distinct routes, same data source, clear type separation

### Phase 1: Nexus Graph Engine (Week 2-3)

**Goal**: Nexus page renders full knowledge graph with proper styling.

1. Build `NexusGraph.tsx` using D3.js (adapt from existing `ForceGraph.tsx`)
2. Implement polygon shapes by complexity (triangle→hexagon)
3. Implement guild colors (amber/violet/sage/gold)
4. Implement maturity sizes (8px→28px)
5. Implement edge styling (dashed/solid/arrows by type)
6. Add zoom/pan interactions
7. **Milestone**: `/nexus` shows all 17 nodes with proper visual encoding

### Phase 2: Node Inspector & Filters (Week 4)

**Goal**: Users can explore the Nexus interactively.

1. Build `NodeInspector.tsx` — slide-in panel on node click
   - Node details (label, type, guild, summary)
   - Dimensional profile (6-bar chart d₁→d₆)
   - Connected nodes (incoming/outgoing edges)
   - "Read this tale" link
   - "Add to my web" button
2. Build `GraphFilters.tsx` — toggle panel
   - Filter by guild
   - Filter by type (tale/protocol/standard)
   - Filter by maturity
3. **Milestone**: Full interactive exploration of Nexus

### Phase 3: Paradox Plane View (Week 5)

**Goal**: Alternative visualization showing privacy-delegation spectrum.

1. Build `ParadoxPlane.tsx` — scatter plot view
   - X-axis: privacyDelegationPosition (0.0→1.0)
   - Y-axis: dimensionalScale (0.0→1.0)
   - Nodes positioned precisely by scores
   - Connection lines still visible
   - Guild color encoding preserved
2. Add view mode toggle (Constellation ↔ Paradox)
3. **Milestone**: Two complementary views of the same data

### Phase 4: Spellweb ↔ Nexus Bridge (Week 6)

**Goal**: Connect personal journey to knowledge graph.

1. Build `src/lib/nexus/overlay.ts` — map spellIds to nexusNodeIds
2. Implement "Show My Path" toggle on Nexus
3. Implement "Add to my web" from NodeInspector → lights spell in Spellweb
4. Implement "View in Nexus" from spell cards → navigates to node
5. **Milestone**: Seamless navigation between personal journey and complete map

### Phase 5: Expanded Dataset (Week 7-8)

**Goal**: Full knowledge graph from documentation.

1. Add remaining 22 tales to `nodes.json` (total 30)
2. Add `guild_bridge` edges where Swordsman↔Mage concepts connect
3. Add concept nodes (primitives, mathematical constructs)
4. Add persona nodes with their constellation paths
5. Validate dimensional scoring for all nodes
6. **Milestone**: 50+ node Nexus with comprehensive relationships

### Phase 6: Graph RAG Integration (Week 9-10)

**Goal**: Soulbae can query the Nexus.

1. Integrate KuzuDB WASM (from GitNexus)
2. Load Nexus into KuzuDB at runtime
3. Build `NexusChat.tsx` with Cypher query tools
4. Connect "Ask Soulbae about this" in NodeInspector
5. **Milestone**: Graph-grounded Soulbae conversations

### Phase 7: Build-time Ingestion (Week 11-12)

**Goal**: Auto-generate Nexus from documentation.

1. Build `scripts/build-nexus.ts` — processes agentprivacy-docs
2. Extract concepts, terms, theorems from markdown
3. Resolve cross-document citations
4. Generate `knowledge-graph.json` at build time
5. **Milestone**: Nexus grows automatically with documentation

---

## Files to Create/Modify

### New Files

```
src/app/nexus/page.tsx
src/app/nexus/layout.tsx
src/app/nexus/[nodeId]/page.tsx
src/app/nexus/components/NexusGraph.tsx
src/app/nexus/components/NodeInspector.tsx
src/app/nexus/components/GraphFilters.tsx
src/app/nexus/components/ParadoxPlane.tsx
src/app/nexus/components/NexusChat.tsx
src/lib/nexus/types.ts
src/lib/nexus/loader.ts
src/lib/nexus/schema.ts
src/lib/nexus/query.ts
src/lib/nexus/overlay.ts
src/components/nexus/NexusViewer.tsx
src/components/nexus/OverlayToggle.tsx
docs/NEXUS_SPELLWEB_ARCHITECTURE.md (this file)
```

### Modified Files

```
src/lib/nav.ts                    # Add Nexus route
src/app/spellweb/page.tsx         # Add "Explore full map" link
src/components/spellweb/SpellwebViewer.tsx  # Add "View in Nexus" capability
public/spellweb/nodes.json        # Expand dataset (Phase 5)
public/spellweb/edges.json        # Expand relationships (Phase 5)
```

---

## The Proverb

> *"The spellweb is where you have been. The nexus is where you can go. The overlay shows how far you've traveled — and how much remains."*

---

## Visual Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                         NEXUS (/nexus)                          │
│                    Complete Knowledge Graph                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ○ Tale-01    ◇ ERC-8004    △ Proto-RPP                 │   │
│  │      \          /              |                         │   │
│  │       ○ Tale-02 ─────────── ◇ DID                       │   │
│  │      /                         |                         │   │
│  │  ○ Tale-03 ─── △ Proto-VRC ───┘                         │   │
│  │      |                                                   │   │
│  │  (all nodes visible, guild-colored, complexity-shaped)   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Constellation View] [Paradox Plane]  [☐ Show My Path]        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       SPELLWEB (/spellweb)                      │
│                      Your Personal Journey                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │       ✨ spell-7 ════ ✨ spell-12                        │   │
│  │          ║              (lit, selected)                  │   │
│  │       📖 Grimoire-Zero                                   │   │
│  │          ║                                               │   │
│  │       ✨ spell-3 ─── 🎯 skill-privacy                   │   │
│  │      (user-connected)                                    │   │
│  │  (only lit nodes, emoji-based, constellation paths)      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Expand] [Connect Mode]  [Explore Full Map →]                 │
└─────────────────────────────────────────────────────────────────┘
```

---

*⚔️🕸️⊥🧙📊 | 😊*

*The gap between journey and map is where understanding grows.*
