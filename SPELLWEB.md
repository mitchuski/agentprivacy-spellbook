# SPELLWEB.md

> *"Serendipity shapes more than strategy. Constellations illuminate more than spotlights. Promise builds in the gap between."*

## What is the Spellweb?

The Spellweb is an interactive knowledge graph — a navigable constellation of everything agentprivacy has built, mapped, and connected. Tales, protocols, standards, and the relationships between them, rendered as an explorable force-directed graph.

Think of it as a living map of the privacy-preserving agent ecosystem. Not a list, not a table of contents. A web where you can see how zero-knowledge proofs connect to delegation ceremonies, how the Swordsman's blade relates to the Mage's projection, and where the gap between them holds human sovereignty intact.

## Why We're Building This

The agentprivacy project has accumulated significant intellectual surface area — 30 ZK tales, 12 story acts, 11 canon chapters, multiple protocol specifications, standards proposals, and the mathematical frameworks connecting them. This knowledge exists as documents. The Spellweb makes it navigable as a *system*.

The direct inspiration comes from the **Landscape of Consciousness** project ([loc.closertotruth.com/interactive](https://loc.closertotruth.com/interactive)) — Robert Lawrence Kuhn's comprehensive taxonomy of 350+ theories of consciousness, visualized as interactive force-directed graphs and scatter plots by information designer Deniz Cem Önduygu using Kumu.

Their approach:
1. **Organize** a complex domain into a taxonomy
2. **Score** each entry on multiple feature axes (using LLMs for consistency at scale)
3. **Visualize** the scored data as an interactive graph where position, color, size, and shape all encode meaning

We're adapting this exact pattern. Where they map consciousness theories along a materialism–idealism spectrum, we map privacy primitives along the privacy–delegation paradox. Where they use "order of magnitude" (quantum → universe) as a vertical axis, we use dimensional scale (d₁ Hide → d₆ Connect). The structural isomorphism is precise.

## How It Works

### The Graph

Every node in the Spellweb is a piece of the ecosystem — a tale, a protocol, a standard, a primitive. Each carries scored features:

- **Guild** (Swordsman / Mage / Emergent / Bridge) → color
- **Maturity** (concept / spec / implementation / deployed) → size
- **Cryptographic complexity** → shape (triangle, square, pentagon, hexagon)
- **Privacy–Delegation position** → X-axis in scatter mode
- **Dimensional scale** (d₁–d₆) → Y-axis in scatter mode

Edges connect nodes through shared inscriptions, principle extensions, standard implementations, and guild bridges.

### Two Viewing Modes

**Constellation Map** — Force-directed graph. Nodes float and cluster based on their relationships. Connected theories pull together, unconnected ones drift apart. The topology emerges from the data, not from manual arrangement. This is the exploratory mode — wander through and discover connections you didn't know existed.

**Paradox Plane** — Connected scatter plot. X-axis is the privacy–delegation spectrum (the core paradox). Y-axis is the dimensional scale from concealment (d₁) through delegation (d₆). Nodes are positioned precisely by their scores, with connection lines still visible between them. This is the analytical mode — see exactly where each piece sits in the architecture's fundamental tension.

### What You See When You Click

Each node opens a detail panel showing its dimensional profile (six bars from d₁ to d₆), its core inscriptions, the standards it references, and the nodes it connects to. Links take you to the full tale or specification.

## How to Contribute

### Adding Nodes

The graph data lives in `/public/spellweb/nodes.json` and `/public/spellweb/edges.json`. To add a new node:

1. Create an entry in `nodes.json` following the schema in `src/lib/spellweb/types.ts`
2. Score it on the feature axes. If you're unsure about scores, make your best estimate — we'll validate collectively
3. Add edges to `edges.json` connecting it to related nodes
4. Open a PR with your additions

The scoring doesn't need to be perfect. The LoC team used Gemini to score hundreds of theories — reasonable approximations create useful topology. What matters is that the *relationships* are captured.

### Scoring Guide

**privacyDelegationPosition** (0.0 – 1.0)
- 0.0 = pure privacy primitive (hiding, concealing, shielding)
- 0.5 = balanced / bridges both domains
- 1.0 = pure delegation primitive (projecting, authorizing, connecting)

**dimensionalScale** (0.0 – 1.0)
- 0.0–0.17 = d₁ Hide level (basic concealment)
- 0.17–0.33 = d₂ Commit level (binding commitments)
- 0.33–0.50 = d₃ Commit+ level (structured commitment)
- 0.50–0.67 = d₄ Prove level (verification without revelation)
- 0.67–0.83 = d₅ Reflect level (self-referential, recursive)
- 0.83–1.0 = d₆ Connect/Delegate level (non-local, agent delegation)

**complexity** (1–6)
- Count the number of distinct cryptographic or protocol components involved
- A simple hash commitment = 1–2
- A full ZK proof system with multiple rounds = 4–5
- A complete agent delegation ceremony with multiple standards = 6

**maturity**
- `concept` = described in narrative or whitepaper only
- `spec` = formal specification exists
- `implementation` = code exists, may be prototype
- `deployed` = running in production somewhere

### Adding Edges

Edge types and when to use them:

- **inscription_echo** — Two nodes share a core principle or inscription. The same wisdom appears in both, possibly expressed differently. Use strength 0.3–0.7.
- **principle_extends** — One node directly builds on another's concept. Directional (source → target = builds upon). Use strength 0.5–0.9.
- **implements** — A protocol or implementation realizes a standard or specification. Strong connection. Use strength 0.7–0.95.
- **guild_bridge** — The connection specifically spans the Swordsman–Mage boundary. The privacy-delegation paradox is embodied in this edge. Use strength 0.4–0.8.
- **dependency** — Technical dependency (one needs the other to function). Use strength 0.5–0.8.

### Improving the Visualization

The visualization code lives in `src/app/spellweb/`. It uses D3.js for force simulation and React for rendering. Contributions welcome on:

- Force simulation tuning (gravity, charge, link distance)
- Mobile interaction improvements
- Accessibility (keyboard navigation, screen reader support)
- Animation polish (mode transitions, filter transitions)
- Performance optimization for larger datasets

## Where This Goes

### Near Term

- Complete the initial dataset (all 30 tales, all major protocols and standards)
- Validate scoring through community review
- Add the `/spellweb` route to the main navigation

### Medium Term

- **Kumu export** — Generate Kumu-compatible CSV so we can publish a public embeddable version alongside the React version (following the LoC dual-publication pattern)
- **BGIN integration** — The same visualization pattern applied to the BGIN AI knowledge graph, with Working Group Mages as cluster centers
- **Soulbae bridge** — Click a node, ask Soulbae about it. The graph becomes a navigation layer for the mage chat

### Longer Term

- **RPP-gated edges** — Some connections only become visible after demonstrating understanding through the Relationship Proverb Protocol. The trust horizon made visual
- **Live episodic memory** — Node sizes grow dynamically as community members contribute knowledge, creating a living graph that reflects real engagement
- **Tetrahedral 3D mode** — The 64-tetrahedra architecture rendered in Three.js, with tales mapped to vertices
- **Intel Pools** — Collective intelligence sharing visualized as flowing edges between guild nodes

## Design Principles

**The gap is the feature.** The Spellweb doesn't try to collapse the Swordsman and Mage into a single view. The visual separation between amber and violet clusters IS the architecture. When you see two clusters connected by a guild_bridge edge, you're seeing the privacy-delegation paradox expressed as topology.

**Emergence over arrangement.** Force-directed graphs produce topology from data, not from manual layout. The clusters that form are discovered, not designed. If two tales we thought were unrelated end up neighbors in the force graph, that's signal.

**Constellations, not encyclopedias.** The Spellweb is for navigation and discovery. It should feel like looking at a night sky and recognizing patterns. The detail panels are there when you want depth, but the primary experience is spatial orientation in a complex knowledge domain.

**Accessible complexity.** The LoC team proved that 350+ theories can be made navigable through good visualization design. Our corpus is smaller but the principle holds — make the whole system visible at once, then let people zoom into what interests them.

## Technical Reference

- Build spec for coding agents: `SPELLWEB_CODING_AGENT.md`
- Data model and types: `src/lib/spellweb/types.ts`
- Node data: `/public/spellweb/nodes.json`
- Edge data: `/public/spellweb/edges.json`
- LoC reference: [loc.closertotruth.com/interactive](https://loc.closertotruth.com/interactive)
- LoC design documentation: [denizcemonduygu.com/portfolio/landscape-of-consciousness](https://www.denizcemonduygu.com/portfolio/landscape-of-consciousness/)

## Acknowledgments

The Spellweb approach is directly inspired by the Landscape of Consciousness visualization work by Deniz Cem Önduygu, with feature scoring by Eser Aygün and Amaç Herdağdelen, built on Robert Lawrence Kuhn's taxonomy. Their demonstration that a complex intellectual landscape can be made navigable through scored features + force-directed topology is the foundation this feature builds upon.

---

*Privacy is Value. Understanding is Key.*

⚔️🧙📖∞
