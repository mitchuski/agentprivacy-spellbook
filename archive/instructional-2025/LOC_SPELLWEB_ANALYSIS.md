# Landscape of Consciousness → Spellweb: Architecture Analysis

## Reference: How the LoC Interactive Visualizations Were Built

The interactive visualizations at [loc.closertotruth.com/interactive](https://loc.closertotruth.com/interactive) were designed and implemented by information designer **Deniz Cem Önduygu** using **[Kumu](https://kumu.io)** — a relationship-mapping and network visualization platform.

### The Pipeline

```
350+ Consciousness Theories (Kuhn's taxonomy)
    │
    ▼
Feature Scoring (Eser Aygün + Amaç Herdağdelen)
    ├── Used Gemini 2.5 Pro to generate scores per theory
    ├── Order of magnitude (quantum → cellular → neuronal → brain → body → extended mind → universe)
    ├── Materialism–Idealism scale position
    ├── Complexity rating
    ├── Scholarly interest (Google Scholar hit count)
    ├── Public interest (Google Search hit count)
    ├── "Degree brain matters" score
    └── Similarity/alignment degrees between each theory pair
    │
    ▼
Kumu Visualization (Deniz Cem Önduygu)
    ├── Force-directed graphs (alignment connections)
    ├── Connected scatter plots (multi-axis positioning)
    └── Embeddable interactive maps
```

### Visual Encoding Schema

| Data Dimension | Visual Encoding |
|---|---|
| Theory category (Materialism, Panpsychism, Dualism, Idealism...) | **Color** of node |
| Scholarly interest (Google Scholar hits) | **Size** of shape |
| Complexity rating | **Number of edges** on the shape (polygon type) |
| Alignment/similarity between theories | **Connection lines** (force-directed layout) |
| Order of magnitude | **X-axis position** (scatter plot mode) |
| Materialism–Idealism scale | **Y-axis position** (scatter plot mode) |
| Public vs scholarly interest discrepancy | **Separate scatter comparing ranks** |

### Visualization Modes

**Mode 1: Force-Directed Graph** — Theories float as nodes, pulled together by alignment/similarity connections. The algorithm automatically clusters related theories. Colors show category, sizes show scholarly interest, shape complexity shows theory complexity.

**Mode 2: Connected Scatter Plot** — X-axis = order of magnitude, Y-axis = materialism–idealism scale. Connection lines still visible between aligned theories. This reveals both the taxonomy position AND the relational structure simultaneously.

**Mode 3: Category Deep Dive** — Focused scatter plots for specific categories (e.g., Materialism only), showing subcategory, order of magnitude, degree brain matters, scholarly interest, complexity, and internal connections.

**Mode 4: Interest Discrepancy** — Scatter plot comparing Google Search rank vs Google Scholar rank per theory, surfacing gaps between public fascination and academic attention.

### Why Kumu

Kumu is specifically designed for relationship mapping — stakeholder networks, systems maps, knowledge graphs. Key capabilities:

- Force-directed layout with tunable gravity, charge, and connection forces
- Spreadsheet-backed data model (CSV/Google Sheets import)
- Embeddable interactive maps via URL
- Built-in Social Network Analysis (SNA) metrics
- Color, size, shape decorations driven by data fields
- Focus/filter features for progressive disclosure
- No code required for basic maps; Advanced Editor for custom CSS-like styling
- Export to JSON, XLSX, PDF, PNG

The same designer (Önduygu) previously built an [interactive network visualization of the History of Western Philosophy](https://blog.kumu.io/mapping-thinkers-an-interactive-network-visualization-of-the-history-of-western-philosophy-46e97448638a) using the same Kumu + force-directed approach — mapping agreement/disagreement connections between philosophers as nodes.

---

## Mapping to the Spellweb

### Structural Parallels

The Landscape of Consciousness and the agentprivacy spellweb share a deep structural isomorphism:

| LoC Element | Spellweb Equivalent |
|---|---|
| 350+ theories of consciousness | 30+ ZK tales + protocol primitives + standards |
| Categories (Materialism → Idealism spectrum) | Protocol families (commitment → proof → verification → delegation) |
| Order of magnitude (quantum → universe) | Dimensional scale (d₁ Hide → d₆ Connect) |
| Materialism–Idealism scale | Privacy–Delegation axis (the core paradox) |
| Alignment connections between theories | Tale-to-tale principle connections (inscriptions that echo) |
| Scholarly interest | Community engagement / citation density |
| Complexity rating | Cryptographic complexity (number of protocol components) |
| Category color coding | Guild/archetype color coding (Swordsman amber, Mage violet, etc.) |
| Theorist authentication | RPP (Relationship Proverb Protocol) — demonstrated understanding |

### Proposed Spellweb Architecture

```
Spellbook Corpus (tales, protocols, standards, proofs)
    │
    ▼
Feature Scoring Layer
    ├── Dimensional vertex mapping (d₁–d₆ positions per tale)
    ├── Protocol family classification
    ├── Complexity score (number of cryptographic primitives)
    ├── Maturity level (concept → spec → implementation → deployed)
    ├── Cross-tale inscription similarity (shared principles)
    ├── Standard body alignment (BGIN, ToIP, IEEE, W3C)
    └── Guild relevance (Swordsman, Mage, both, emergent)
    │
    ▼
Visualization Layer (Kumu or D3.js/React equivalent)
    ├── Force-directed graph: tales as nodes, inscription echoes as edges
    ├── Connected scatter: x = privacy–delegation axis, y = dimensional scale
    ├── Category deep dive: per-guild or per-protocol-family views
    └── Trust graph overlay: progressive disclosure based on RPP completion
```

### Visualization Modes for Spellweb

**Mode 1: The Constellation Map** (Force-Directed)
- Each tale/protocol = a node
- Shared inscriptions/principles = connection edges
- Color = guild archetype (amber Swordsman, violet Mage, gold emergent)
- Size = maturity level (concept < spec < implementation < deployed)
- Shape complexity = cryptographic complexity
- Clusters naturally form around protocol families

**Mode 2: The Paradox Plane** (Connected Scatter)
- X-axis = Privacy ← → Delegation (the core paradox axis)
- Y-axis = Dimensional scale (d₁ Hide through d₆ Connect)
- Connection lines show principle echoes between tales
- This is the direct analog of LoC's materialism–idealism × order-of-magnitude plot
- The golden ratio convergence zone (φ ≈ 1.618) can be marked as an attractor region

**Mode 3: The Guild Chamber** (Category Deep Dive)
- Filter to Swordsman protocols only, or Mage protocols only
- Show subcategory, maturity, standard body alignment, internal connections
- Reveals the internal structure of each archetype's toolkit

**Mode 4: The Standards Lattice** (Cross-Reference)
- Nodes = standards (ERC-8004, ERC-7812, x402, IEEE 7012, VRCs, Privacy Pools)
- Edges = which tales/protocols invoke which standards
- Reveals dependency chains and integration points

**Mode 5: The Trust Horizon** (Progressive Disclosure)
- Default view: only public-facing summaries visible
- RPP completion unlocks deeper layers of the graph
- Proverb-holders see connection edges that non-holders don't
- This is the anti-extraction mechanism made visual

### Implementation Paths

**Path A: Kumu (Quick, Embeddable, No-Code)**
- Use Kumu exactly as Önduygu did for LoC
- Build spreadsheet with tales as rows, features as columns
- Import into Kumu, configure force-directed layout
- Embed via iframe on agentprivacy.ai
- Advantages: fast, proven approach, beautiful out-of-box
- Trade-offs: hosted platform dependency, limited RPP-gated disclosure, no on-chain integration

**Path B: D3.js + React (Custom, Self-Hosted)**
- Build custom force-directed graph using D3.js force simulation
- React components for node rendering, tooltips, filters
- WebSocket/API integration for live data
- Advantages: full control, RPP gating possible, on-chain data integration, runs in agent context
- Trade-offs: significant development effort, must build all interactions from scratch

**Path C: Hybrid (Kumu for exploration, D3 for agent-integrated views)**
- Kumu maps embedded on public-facing documentation site
- D3.js/React visualization embedded in agent interfaces (BGIN AI frontend, Soulbae)
- Shared data model (JSON/CSV) feeds both
- Advantages: best of both — fast public-facing maps + deep agent integration
- Trade-offs: maintaining two rendering systems

### Recommended Path: C (Hybrid)

For the immediate term, Kumu gets the spellweb visible and interactive with minimal engineering. The LoC team's pipeline (LLM-scored features → Kumu visualization) is directly replicable. For the BGIN AI frontend and agent-integrated views, D3.js/React provides the programmability needed for RPP gating, trust graph overlays, and live episodic memory integration.

---

## Data Model: Spellweb Node Schema

Each node in the spellweb carries these fields (matching the LoC approach of feature scoring + visualization):

```json
{
  "id": "tale-03-monastery",
  "label": "The Monastery of Hidden Knowledge",
  "type": "tale",
  "guild": "mage",
  "protocol_family": "zero_knowledge_proofs",
  "dimensions": {
    "d1_hide": 0.9,
    "d2_commit": 0.7,
    "d3_prove": 1.0,
    "d4_connect": 0.4,
    "d5_reflect": 0.3,
    "d6_delegate": 0.2
  },
  "privacy_delegation_position": 0.35,
  "complexity": 4,
  "maturity": "spec",
  "standards": ["groth16", "plonk"],
  "inscriptions": ["knowledge without revelation", "proof without exposure"],
  "scholarly_interest": null,
  "community_engagement": 12,
  "rpp_required": false,
  "rpp_depth": 0,
  "connections": [
    { "target": "tale-01-village", "type": "inscription_echo", "strength": 0.6 },
    { "target": "tale-05-drakes", "type": "principle_extends", "strength": 0.8 },
    { "target": "erc-7812", "type": "implements", "strength": 0.9 }
  ]
}
```

### Edge Types

| Edge Type | Meaning | Visual |
|---|---|---|
| `inscription_echo` | Shared principle/inscription across tales | Thin dashed line |
| `principle_extends` | One concept builds on another | Solid directional arrow |
| `implements` | Tale/protocol implements a standard | Thick solid line |
| `guild_overlap` | Spans Swordsman and Mage domains | Gradient line (amber→violet) |
| `rpp_gated` | Connection only visible after RPP completion | Hidden until unlocked |

---

## Integration Points with Existing Repos

### agentprivacy repo
- Spellweb becomes a navigable frontend for the spellbook corpus
- Node data lives alongside tale markdown in `/public/zero/markdown/`
- React visualization component for the agent dashboard
- RPP gating integrates with the trust graph system

### bgin repo
- Knowledge graph visualization for each Working Group Mage
- Cross-WG edge discovery (like LoC's cross-category connections)
- Promise graph rendered as force-directed network
- Episodic memory contributions visualized as growing node sizes

### Shared Data Layer
- JSON/CSV feature matrix (one row per node, columns = features)
- Importable to both Kumu (public-facing) and D3/React (agent-integrated)
- LLM-assisted feature scoring (following the LoC precedent of using Gemini for scoring)
- Version-controlled in repo, updated as new tales/protocols emerge

---

## Key Takeaway from the LoC Approach

The LoC team's most transferable insight is their **separation of concerns**:

1. **Taxonomy** (Kuhn) — the intellectual framework organizing 350+ theories
2. **Feature scoring** (Aygün + Herdağdelen + Gemini) — quantifying each theory's position on multiple axes
3. **Visualization design** (Önduygu + Kumu) — making the scored data navigable and beautiful

The spellweb can follow exactly this pattern:

1. **Taxonomy** — your existing spellbook structure (tales, protocols, standards, guilds)
2. **Feature scoring** — LLM-assisted scoring of each node on the dimensional axes
3. **Visualization** — Kumu for public maps, D3/React for agent-integrated views

The LLM scoring step is particularly elegant. Just as they used Gemini to score 350+ consciousness theories on multiple axes, you can use Claude to score the spellbook corpus on privacy–delegation position, dimensional weight, complexity, and cross-tale similarity. This creates a principled, reproducible feature matrix that drives the visualization automatically.

---

*Reference: [Deniz Cem Önduygu portfolio](https://www.denizcemonduygu.com/portfolio/landscape-of-consciousness/) | [Kumu platform](https://kumu.io) | [LoC Interactive](https://loc.closertotruth.com/interactive) | [LoC Team & Acknowledgments](https://loc.closertotruth.com/landscape/team-and-acknowledgments)*
