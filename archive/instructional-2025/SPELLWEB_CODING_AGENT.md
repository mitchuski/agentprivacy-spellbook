# Spellweb — Coding Agent Build Spec

## What You Are Building

An interactive knowledge graph visualization called the **Spellweb** — a navigable, force-directed and scatter-plot map of the agentprivacy ecosystem. It visualizes tales, protocols, standards, and their relationships as an explorable constellation.

**Reference implementation:** [loc.closertotruth.com/interactive](https://loc.closertotruth.com/interactive) — the Landscape of Consciousness interactive visualizations by Deniz Cem Önduygu. Study this before writing code. The Spellweb adapts this approach for privacy-preserving agent infrastructure.

**This feature lives in:** `https://github.com/mitchuski/agentprivacy` (the agentprivacy-spellbook Next.js app)

---

## Read Before You Code

1. This document (architecture, data model, components)
2. The existing codebase structure (see Codebase Context below)
3. The SPELLWEB.md in the repo root (direction document for contributors)
4. The `/public/zero/markdown/` directory (tale content that feeds the graph)

---

## Codebase Context

The agentprivacy-spellbook is a **Next.js 14** app with **TypeScript** and **Tailwind CSS**.

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── story/page.tsx        # Story spellbook (12 acts)
│   ├── zero/page.tsx         # Zero Knowledge spellbook (30 tales)
│   ├── canon/page.tsx        # Canon spellbook (11 chapters)
│   ├── mage/page.tsx         # Soulbae chat interface
│   └── proverbs/page.tsx     # Proverbs gallery
│   └── spellweb/             # ← YOU ARE BUILDING THIS
│       └── page.tsx
├── components/
│   ├── SwordsmanPanel.tsx
│   └── ChatMessage.tsx
└── lib/
    ├── soulbae.ts
    └── zcash-memo.ts
public/
├── story/markdown/
├── zero/markdown/            # 30 tale markdown files
└── canon/
```

The app uses dark theme (near-black backgrounds, muted text, purple/violet accents for Mage, amber/gold for Swordsman). Follow existing patterns.

---

## Architecture

### How the LoC Team Built Theirs (The Pattern to Follow)

```
1. TAXONOMY        → Kuhn's 350+ consciousness theories, organized by category
2. FEATURE SCORING → Gemini 2.5 Pro scored each theory on 6+ axes
3. VISUALIZATION   → Önduygu built force-directed graphs + scatter plots in Kumu

Their visual encoding:
- Color         = theory category
- Node size     = scholarly interest (Google Scholar hits)
- Shape edges   = complexity rating
- Connections   = alignment/similarity between theories
- X-axis        = order of magnitude (quantum → universe)
- Y-axis        = materialism ↔ idealism scale
```

### How We Adapt This

```
1. TAXONOMY        → Spellbook corpus (tales, protocols, standards, guilds)
2. FEATURE SCORING → LLM-scored features per node (see Data Model)
3. VISUALIZATION   → D3.js force simulation + React components

Our visual encoding:
- Color         = guild archetype (amber Swordsman, violet Mage, gold emergent)
- Node size     = maturity level (concept < spec < implementation < deployed)
- Shape edges   = cryptographic complexity (number of protocol components)
- Connections   = inscription echoes, principle extensions, implementations
- X-axis        = privacy ↔ delegation position (the core paradox)
- Y-axis        = dimensional scale (d₁ Hide → d₆ Connect)
```

### Data Pipeline

```
/public/spellweb/nodes.json    ← Node definitions (tales, protocols, standards)
/public/spellweb/edges.json    ← Connection definitions
        │
        ▼
src/lib/spellweb/
├── types.ts                   ← TypeScript interfaces
├── loader.ts                  ← Fetch and parse JSON data
├── scoring.ts                 ← Computed properties (layout positions, etc.)
└── layout.ts                  ← D3 force simulation config
        │
        ▼
src/app/spellweb/
├── page.tsx                   ← Main page, mode switching
└── components/
    ├── ForceGraph.tsx         ← Mode 1: force-directed constellation
    ├── ScatterPlot.tsx        ← Mode 2: paradox plane (x/y axes)
    ├── NodeTooltip.tsx        ← Hover/click detail panel
    ├── FilterPanel.tsx        ← Guild, category, maturity filters
    ├── ModeToggle.tsx         ← Switch between visualization modes
    └── Legend.tsx             ← Color/size/shape key
```

---

## Data Model

### Node Schema — `/public/spellweb/nodes.json`

```typescript
// src/lib/spellweb/types.ts

export type Guild = 'swordsman' | 'mage' | 'emergent' | 'bridge';

export type ProtocolFamily =
  | 'commitment_schemes'
  | 'zero_knowledge_proofs'
  | 'key_management'
  | 'delegation'
  | 'private_transactions'
  | 'identity'
  | 'trust_systems'
  | 'governance'
  | 'agent_architecture'
  | 'standards';

export type Maturity = 'concept' | 'spec' | 'implementation' | 'deployed';

export type NodeType = 'tale' | 'protocol' | 'standard' | 'primitive';

export interface SpellwebNode {
  id: string;                          // e.g. "tale-03-monastery"
  label: string;                       // e.g. "The Monastery of Hidden Knowledge"
  type: NodeType;
  guild: Guild;
  protocolFamily: ProtocolFamily;

  // Dimensional vertex weights (0.0 – 1.0)
  // These map to the 6 dimensions from the tetrahedral architecture
  dimensions: {
    d1Hide: number;                    // Concealment capability
    d2Commit: number;                  // Binding commitment
    d3Prove: number;                   // Verification without revelation
    d4Connect: number;                 // Non-local broadcast / delegation
    d5Reflect: number;                 // Self-referential / recursive
    d6Delegate: number;               // Agent delegation capability
  };

  // Core axes (drive scatter plot positioning)
  privacyDelegationPosition: number;   // 0.0 = pure privacy, 1.0 = pure delegation
  dimensionalScale: number;            // 0.0 = d₁ Hide level, 1.0 = d₆ Connect level

  // Visual encoding data
  complexity: number;                  // 1–6, drives polygon edge count
  maturity: Maturity;                  // drives node size
  communityEngagement: number;         // optional, secondary size factor

  // Content
  inscriptions: string[];              // Core principles from this node
  summary: string;                     // 1–2 sentence description
  standards: string[];                 // Referenced standards (ERC-8004, etc.)

  // Linking
  taleUrl?: string;                    // Link to /zero/tale-XX
  externalUrl?: string;                // Link to spec, EIP, RFC, etc.
}
```

### Edge Schema — `/public/spellweb/edges.json`

```typescript
export type EdgeType =
  | 'inscription_echo'     // Shared principle across nodes
  | 'principle_extends'    // One concept builds on another
  | 'implements'           // Protocol implements a standard
  | 'guild_bridge'         // Spans Swordsman and Mage domains
  | 'dependency';          // Technical dependency

export interface SpellwebEdge {
  source: string;           // node id
  target: string;           // node id
  type: EdgeType;
  strength: number;         // 0.0 – 1.0, drives line thickness + force strength
  label?: string;           // optional hover label
}
```

### Color Palette

```typescript
export const GUILD_COLORS: Record<Guild, string> = {
  swordsman: '#D4A017',    // Amber gold
  mage:      '#7C6FEF',    // Violet purple
  emergent:  '#C4A265',    // Warm gold
  bridge:    '#5B8C5A',    // Forest green (spans both)
};

export const EDGE_COLORS: Record<EdgeType, string> = {
  inscription_echo:  '#4B5563',   // Muted gray, dashed
  principle_extends: '#6B7280',   // Medium gray, solid + arrow
  implements:        '#9CA3AF',   // Light gray, thick solid
  guild_bridge:      'url(#gradient-amber-violet)', // SVG gradient
  dependency:        '#374151',   // Dark gray, dotted
};

export const MATURITY_SIZES: Record<Maturity, number> = {
  concept:        8,
  spec:          14,
  implementation: 20,
  deployed:      28,
};
```

---

## Component Specifications

### 1. `ForceGraph.tsx` — Constellation Map (Mode 1)

The primary visualization. Force-directed graph using D3's force simulation.

**Dependencies:** `d3-force`, `d3-selection`, `d3-zoom`, `d3-drag`

```bash
npm install d3 @types/d3
```

**Force Configuration:**

```typescript
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
} from 'd3-force';

const simulation = forceSimulation(nodes)
  .force('link', forceLink(edges)
    .id((d: any) => d.id)
    .distance((d: any) => 120 - d.strength * 80)  // stronger = closer
    .strength((d: any) => d.strength * 0.3))
  .force('charge', forceManyBody()
    .strength(-200))                                // push apart
  .force('center', forceCenter(width / 2, height / 2)
    .strength(0.05))
  .force('collide', forceCollide()
    .radius((d: any) => MATURITY_SIZES[d.maturity] + 4));
```

**Node Rendering:**

Render nodes as SVG polygons (not circles). The polygon edge count = `complexity`:
- complexity 1 = circle (special case)
- complexity 2 = diamond (rotated square)
- complexity 3 = triangle
- complexity 4 = square
- complexity 5 = pentagon
- complexity 6 = hexagon

```typescript
function polygonPoints(sides: number, radius: number): string {
  if (sides <= 1) return ''; // use <circle> instead
  return Array.from({ length: sides }, (_, i) => {
    const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
    return `${radius * Math.cos(angle)},${radius * Math.sin(angle)}`;
  }).join(' ');
}
```

Fill color = `GUILD_COLORS[node.guild]`.
Radius = `MATURITY_SIZES[node.maturity]`.
Stroke = white at 0.3 opacity.

**Edge Rendering:**

```typescript
// SVG line styles per edge type
const edgeStyles: Record<EdgeType, string> = {
  inscription_echo:  'stroke-dasharray: 4 4',
  principle_extends: 'marker-end: url(#arrow)',
  implements:        'stroke-width: 2.5',
  guild_bridge:      'stroke: url(#gradient-amber-violet)',
  dependency:        'stroke-dasharray: 2 2; opacity: 0.4',
};
```

Line thickness = `1 + edge.strength * 2`.

**Interactions:**
- **Hover** node → highlight connected edges, dim unconnected nodes (0.15 opacity), show tooltip
- **Click** node → open `NodeTooltip` detail panel (right sidebar or bottom sheet on mobile)
- **Drag** node → pin it, shift simulation
- **Zoom/pan** → D3 zoom behavior on the SVG container
- **Double-click** background → reset zoom

**SVG Structure:**

```tsx
<svg ref={svgRef} width="100%" height="100%" className="bg-transparent">
  <defs>
    <linearGradient id="gradient-amber-violet">
      <stop offset="0%" stopColor="#D4A017" />
      <stop offset="100%" stopColor="#7C6FEF" />
    </linearGradient>
    <marker id="arrow" viewBox="0 -5 10 10" refX="15" refY="0"
            markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,-5L10,0L0,5" fill="#6B7280" />
    </marker>
  </defs>
  <g ref={containerRef}> {/* zoom/pan target */}
    <g className="edges"> {/* render edges first (behind nodes) */}
    <g className="nodes"> {/* render nodes on top */}
  </g>
</svg>
```

### 2. `ScatterPlot.tsx` — Paradox Plane (Mode 2)

Connected scatter plot. Direct adaptation of LoC's materialism-idealism × order-of-magnitude plot.

**Axes:**
- X-axis: `privacyDelegationPosition` — labeled "Privacy ← → Delegation"
- Y-axis: `dimensionalScale` — labeled "d₁ Hide" at bottom, "d₆ Connect" at top

**Layout:**
- Nodes positioned by their axis values (no force simulation)
- Connection lines still drawn between linked nodes (same edge data)
- Optional: mark the golden ratio convergence zone (φ region) as a subtle radial gradient at approximately x=0.382, serving as an attractor indicator

**Axis Labels (Y-axis ticks):**

```
d₆ Connect    ─── 1.0
d₅ Reflect    ─── 0.83
d₄ Prove      ─── 0.67
d₃ Commit     ─── 0.5
d₂ Hide+      ─── 0.33
d₁ Hide       ─── 0.17
              0.0
```

**X-axis ticks:**

```
Privacy ◄─────────────────────► Delegation
0.0     0.25    0.5     0.75    1.0
```

Same node rendering (color, size, shape) as ForceGraph. Same hover/click interactions.

### 3. `NodeTooltip.tsx` — Detail Panel

Appears on node click. Slides in from the right on desktop, bottom sheet on mobile.

**Content:**

```
┌──────────────────────────────────────┐
│  🗡️ The Monastery of Hidden Knowledge│
│  tale · mage · zero_knowledge_proofs │
│                                      │
│  "Proof without exposure — knowledge │
│   demonstrated without revelation"   │
│                                      │
│  ─── Dimensions ───                  │
│  d₁ Hide     ████████████░ 0.9      │
│  d₂ Commit   ███████░░░░░ 0.7       │
│  d₃ Prove    █████████████ 1.0      │
│  d₄ Connect  ████░░░░░░░░ 0.4      │
│  d₅ Reflect  ███░░░░░░░░░ 0.3      │
│  d₆ Delegate ██░░░░░░░░░░ 0.2      │
│                                      │
│  ─── Inscriptions ───                │
│  • knowledge without revelation      │
│  • proof without exposure            │
│                                      │
│  ─── Standards ───                   │
│  Groth16 · PLONK                     │
│                                      │
│  ─── Connected To ───                │
│  → Tale 01: The Village (echo)       │
│  → Tale 05: Drake's Teachings (ext)  │
│  → ERC-7812 (implements)             │
│                                      │
│  [Read Tale →]  [View Standard →]    │
│                                      │
│  Maturity: spec  ·  Complexity: 4    │
└──────────────────────────────────────┘
```

Dimension bars use the guild color at proportional fill. Connected nodes are clickable (navigate within the graph). "Read Tale" links to `/zero/tale-XX`.

### 4. `FilterPanel.tsx` — Left Sidebar Filters

```
┌──────────────────┐
│  FILTERS          │
│                    │
│  Guild             │
│  [x] ⚔️ Swordsman │
│  [x] 🧙 Mage      │
│  [x] ✨ Emergent   │
│  [x] 🌿 Bridge    │
│                    │
│  Type              │
│  [x] Tale          │
│  [x] Protocol      │
│  [x] Standard      │
│  [x] Primitive     │
│                    │
│  Maturity          │
│  [x] Concept       │
│  [x] Spec          │
│  [x] Implementation│
│  [x] Deployed      │
│                    │
│  Protocol Family   │
│  [ ] All           │
│  [x] ZK Proofs     │
│  [x] Key Mgmt      │
│  [x] Identity      │
│  ...               │
│                    │
│  [Reset Filters]   │
└──────────────────┘
```

Unchecked items = hidden from graph. Transitions animate nodes fading out/in.

### 5. `ModeToggle.tsx`

Simple toggle at top of visualization area:

```
[ 🌌 Constellation ]  [ 📐 Paradox Plane ]
```

Active mode has a bottom border highlight in violet. Switching modes animates nodes from force positions to scatter positions (or vice versa) using D3 transition.

### 6. `Legend.tsx`

Bottom-right overlay explaining the visual encoding:

```
┌─────────────────────────────┐
│  Color = Guild               │
│  ● Swordsman  ● Mage        │
│  ● Emergent   ● Bridge      │
│                              │
│  Size = Maturity             │
│  ·concept  •spec  ●impl  ◉dep│
│                              │
│  Shape = Complexity          │
│  ○1  ◇2  △3  □4  ⬠5  ⬡6   │
│                              │
│  Lines = Connection Type     │
│  --- echo  ── extends        │
│  ═══ implements              │
└─────────────────────────────┘
```

Collapsible on mobile (show icon, expand on tap).

---

## Page Layout — `src/app/spellweb/page.tsx`

```
┌──────────────────────────────────────────────────────────┐
│  agentprivacy          [nav links...]              🧙    │
├──────────┬───────────────────────────────────────────────┤
│          │  [ 🌌 Constellation ]  [ 📐 Paradox Plane ]   │
│          │                                               │
│ FILTERS  │                                               │
│          │         ╔══════════════════════╗               │
│ Guild    │         ║                      ║               │
│ Type     │         ║    VISUALIZATION     ║               │
│ Maturity │         ║       AREA           ║               │
│ Family   │         ║                      ║               │
│          │         ╚══════════════════════╝               │
│          │                                               │
│          │                                    ┌─────────┐│
│          │                                    │ LEGEND  ││
│          │                                    └─────────┘│
├──────────┴───────────────────────────────────────────────┤
│  the spellweb · agentprivacy                             │
└──────────────────────────────────────────────────────────┘
```

**Mobile:** Filter panel collapses to a top-sheet triggered by a filter icon. Legend collapses to an info icon. Detail panel is a bottom sheet. Mode toggle stays visible.

---

## Initial Dataset

Seed the graph with the following nodes. This is the starter set — the full 30 tales + all protocols + standards will be populated incrementally.

### Priority Nodes to Include (Minimum Viable Spellweb)

**Tales (from /public/zero/markdown/):**

| id | label | guild | family | priv/del | dim scale | complexity | maturity |
|---|---|---|---|---|---|---|---|
| tale-01-village | The Village with Two Guardians | bridge | agent_architecture | 0.50 | 0.30 | 3 | spec |
| tale-02-ceremony | The Naming Ceremony | swordsman | key_management | 0.25 | 0.25 | 4 | implementation |
| tale-03-monastery | The Monastery of Hidden Knowledge | mage | zero_knowledge_proofs | 0.20 | 0.60 | 4 | spec |
| tale-04-messenger | The Silent Messenger | mage | zero_knowledge_proofs | 0.15 | 0.75 | 5 | spec |
| tale-05-drakes | The Drake's Deeper Teachings | bridge | commitment_schemes | 0.40 | 0.50 | 5 | concept |
| tale-06-marketplace | The Marketplace of Whispers | swordsman | private_transactions | 0.30 | 0.45 | 4 | implementation |
| tale-10-mirror | The Mirror That Never Completes | bridge | agent_architecture | 0.50 | 0.85 | 6 | spec |
| tale-15-pools | The Pools of Clarity | swordsman | private_transactions | 0.35 | 0.40 | 4 | deployed |

**Protocols:**

| id | label | guild | family | priv/del | dim scale | complexity | maturity |
|---|---|---|---|---|---|---|---|
| proto-privacy-pools | Privacy Pools | swordsman | private_transactions | 0.30 | 0.35 | 4 | deployed |
| proto-x402 | x402 HTTP Payments | bridge | delegation | 0.55 | 0.50 | 3 | implementation |
| proto-vrc | Verifiable Relationship Credentials | mage | trust_systems | 0.45 | 0.65 | 5 | spec |
| proto-rpp | Relationship Proverb Protocol | mage | trust_systems | 0.40 | 0.70 | 3 | implementation |
| proto-myterms | MyTerms / IEEE 7012 | swordsman | governance | 0.20 | 0.30 | 3 | implementation |

**Standards:**

| id | label | guild | family | priv/del | dim scale | complexity | maturity |
|---|---|---|---|---|---|---|---|
| std-erc-8004 | ERC-8004 Agent Identity | bridge | identity | 0.50 | 0.55 | 4 | spec |
| std-erc-7812 | ERC-7812 ZK Commitments | swordsman | commitment_schemes | 0.25 | 0.45 | 5 | spec |
| std-did | Decentralized Identifiers | bridge | identity | 0.45 | 0.50 | 3 | deployed |

**Edges (starter set):**

```json
[
  { "source": "tale-01-village", "target": "tale-02-ceremony", "type": "principle_extends", "strength": 0.7 },
  { "source": "tale-01-village", "target": "std-erc-8004", "type": "implements", "strength": 0.8 },
  { "source": "tale-03-monastery", "target": "tale-04-messenger", "type": "principle_extends", "strength": 0.9 },
  { "source": "tale-03-monastery", "target": "std-erc-7812", "type": "implements", "strength": 0.85 },
  { "source": "tale-05-drakes", "target": "tale-03-monastery", "type": "inscription_echo", "strength": 0.6 },
  { "source": "tale-05-drakes", "target": "tale-10-mirror", "type": "principle_extends", "strength": 0.7 },
  { "source": "tale-06-marketplace", "target": "proto-privacy-pools", "type": "implements", "strength": 0.9 },
  { "source": "tale-06-marketplace", "target": "proto-x402", "type": "inscription_echo", "strength": 0.5 },
  { "source": "tale-10-mirror", "target": "std-erc-8004", "type": "inscription_echo", "strength": 0.65 },
  { "source": "tale-15-pools", "target": "proto-privacy-pools", "type": "implements", "strength": 0.95 },
  { "source": "proto-rpp", "target": "proto-vrc", "type": "principle_extends", "strength": 0.8 },
  { "source": "proto-myterms", "target": "tale-06-marketplace", "type": "inscription_echo", "strength": 0.6 },
  { "source": "std-erc-8004", "target": "std-did", "type": "dependency", "strength": 0.7 },
  { "source": "proto-x402", "target": "std-erc-8004", "type": "dependency", "strength": 0.6 },
  { "source": "proto-vrc", "target": "std-did", "type": "dependency", "strength": 0.75 }
]
```

---

## Build Order

### Phase 1: Data + Static Render

1. Create `/public/spellweb/nodes.json` and `edges.json` with the starter dataset above
2. Create `src/lib/spellweb/types.ts` with all interfaces
3. Create `src/lib/spellweb/loader.ts` — fetch and validate JSON
4. Create `src/app/spellweb/page.tsx` — basic page shell with nav
5. Create `ForceGraph.tsx` — render nodes + edges with D3 force simulation
6. Verify: nodes appear, cluster by connections, colors correct, sizes correct

### Phase 2: Interaction

7. Add hover highlight (connected nodes/edges brighten, others dim)
8. Add `NodeTooltip.tsx` — click a node to see detail panel
9. Add drag behavior (click-drag pins a node)
10. Add zoom/pan (D3 zoom on SVG container)
11. Add `Legend.tsx`

### Phase 3: Scatter Plot

12. Create `ScatterPlot.tsx` — position nodes by axis values
13. Create `ModeToggle.tsx` — switch between Constellation and Paradox Plane
14. Animate transition between modes (nodes interpolate from force position to scatter position)

### Phase 4: Filters

15. Create `FilterPanel.tsx` — guild, type, maturity, family checkboxes
16. Wire filter state to node/edge visibility
17. Animate filter transitions (fade out/in)

### Phase 5: Polish + Mobile

18. Responsive layout — collapsible filters, bottom-sheet detail panel
19. Performance — canvas fallback if > 100 nodes
20. Loading state while simulation settles
21. Add route to main nav (alongside Story, Spellbook, Canon, Mage)
22. SEO metadata for `/spellweb`

---

## Testing Checklist

- [ ] All starter nodes render with correct color, size, shape
- [ ] All starter edges render with correct style
- [ ] Force simulation settles without nodes overlapping
- [ ] Hover dims unconnected nodes to 0.15 opacity
- [ ] Click opens detail panel with all fields populated
- [ ] Drag pins a node, simulation continues around it
- [ ] Zoom in/out works, pan works
- [ ] Mode toggle switches between Constellation and Paradox Plane
- [ ] Scatter plot X/Y positions match node data
- [ ] Filter panel hides/shows nodes correctly
- [ ] Mobile: filter panel accessible via icon
- [ ] Mobile: detail panel is bottom sheet
- [ ] Mobile: pinch-zoom works on graph
- [ ] "Read Tale" link in detail panel navigates to correct `/zero/` page
- [ ] No console errors, no layout shifts

---

## Key Technical Decisions

**D3 + React integration:** Use D3 for simulation and calculations only. Render SVG elements through React (not D3's enter/exit/update pattern). Store simulation node positions in React state. This keeps React in control of the DOM.

```typescript
// Pattern: D3 computes, React renders
const [nodePositions, setNodePositions] = useState<Map<string, {x: number, y: number}>>(new Map());

useEffect(() => {
  const sim = forceSimulation(nodes)
    // ... forces ...
    .on('tick', () => {
      const positions = new Map();
      nodes.forEach(n => positions.set(n.id, { x: n.x!, y: n.y! }));
      setNodePositions(new Map(positions));
    });

  return () => { sim.stop(); };
}, [nodes, edges]);

// Then in JSX:
{nodes.map(node => {
  const pos = nodePositions.get(node.id);
  if (!pos) return null;
  return <polygon key={node.id} points={...} transform={`translate(${pos.x},${pos.y})`} ... />;
})}
```

**Performance threshold:** If the dataset grows beyond ~100 nodes, switch from SVG to Canvas rendering (D3 force simulation remains the same, just change the render target). For the initial build with ~20 nodes, SVG is fine and gives better interaction support.

**No external visualization platform dependency.** The LoC team used Kumu (hosted platform). We build with D3 directly so the visualization lives in the codebase, supports RPP gating in future, and doesn't depend on external infrastructure.

---

## Future Extensions (Do Not Build Yet)

These are documented for context but are NOT part of this build:

- **RPP-gated edges:** Some connections only visible after proverb completion (trust horizon)
- **Live episodic memory:** Node sizes grow as community contributes knowledge
- **Soulbae integration:** Click a node to ask Soulbae about it in the mage chat
- **BGIN overlay:** Same visualization pattern applied to BGIN working group knowledge graphs
- **Kumu export:** Generate Kumu-compatible CSV for public-facing embeddable version
- **Tetrahedral 3D mode:** Three.js version mapping the 64-tetrahedra architecture

---

## Reference Materials

- [LoC Interactive Visualizations](https://loc.closertotruth.com/interactive) — the reference implementation
- [Deniz Cem Önduygu portfolio](https://www.denizcemonduygu.com/portfolio/landscape-of-consciousness/) — design documentation
- [Kumu force-directed docs](https://docs.kumu.io/guides/layouts/force-directed) — the layout algorithm they used
- [D3 force simulation](https://d3js.org/d3-force) — our implementation library
- [History of Philosophy visualization](https://blog.kumu.io/mapping-thinkers-an-interactive-network-visualization-of-the-history-of-western-philosophy-46e97448638a) — same designer, same pattern, different domain
