# Implementation Path: Nexus + Spellweb Integration

**Date:** February 25, 2026
**Status:** Ready to Execute
**Spell:** ⚔️🛤️🧙📊 | 😊

---

## Overview

This document provides the step-by-step implementation path for separating the Spellweb (user journey) from the Nexus (complete knowledge graph) and building out the full GitNexus-powered visualization system.

**Related Documents:**
- `docs/SPELLWEB_WEB_TRANSFORMER.md` — **Canonical:** Spellweb (standalone domain) vs web (agentprivacy journey); transformer instructions
- `docs/NEXUS_SPELLWEB_ARCHITECTURE.md` — Architectural rationale (Spellweb vs web)
- `docs/SPELLWEB_INTEGRATION_SPEC_v2.md` — Technical specification (full KG viewer = standalone Spellweb product)

---

## Phase 0: Foundation (Day 1-2)

### Objective
Clean file separation, two working routes, no broken functionality.

### Tasks

- [x] **0.1 Create directory structure**
  ```
  mkdir -p src/app/nexus/components
  mkdir -p src/lib/nexus
  mkdir -p src/components/nexus
  mkdir -p public/nexus
  ```

- [x] **0.2 Move data files**
  - Move `public/spellweb/nodes.json` → `public/nexus/nodes.json`
  - Move `public/spellweb/edges.json` → `public/nexus/edges.json`

- [x] **0.3 Create `src/lib/nexus/types.ts`**
  - Copy from `src/lib/spellweb/kg-types.ts`
  - Rename `SpellwebKGNode` → `NexusNode`
  - Rename `SpellwebKGEdge` → `NexusEdge`
  - Keep `GUILD_COLORS`, `MATURITY_SIZES`, `DIM_LABELS`

- [x] **0.4 Create `src/lib/nexus/loader.ts`**
  - Copy from `src/lib/spellweb/loader.ts`
  - Update fetch paths to `/nexus/*.json`
  - Rename exports to `loadNexusGraph()`, `NexusGraphData`

- [x] **0.5 Create `src/app/nexus/components/NexusGraph.tsx`**
  - Copy from `src/app/spellweb/components/ForceGraph.tsx`
  - Update imports to use `src/lib/nexus/types`
  - Keep all D3.js logic intact

- [x] **0.6 Create `src/app/nexus/page.tsx`**
  - New page that loads and renders NexusGraph
  - Dynamic import with `ssr: false`
  - Basic layout with title and description

- [x] **0.7 Update `src/app/spellweb/page.tsx`**
  - Remove KG loading (was using loader.ts)
  - Focus on SpellwebViewer for journey display
  - Add link to Nexus: "Explore full map →"

- [x] **0.8 Update `src/lib/nav.ts`**
  - Add: `{ href: '/nexus', label: 'Nexus', emoji: '📊' }`
  - Optionally rename spellweb to "Your Web"

- [x] **0.9 Verify both routes work**
  - `/spellweb` — Shows journey graph (SpellwebViewer)
  - `/nexus` — Shows full KG (NexusGraph)

### Acceptance Criteria
- [x] Two distinct routes load without errors
- [x] Nexus shows 17 nodes, 15 edges
- [x] Spellweb shows user journey (may be empty if no selections)
- [x] Navigation includes both links

---

## Phase 1: Nexus Visual Polish (Week 1)

### Objective
Full visual encoding on Nexus matching the spec.

### Tasks

- [ ] **1.1 Implement polygon shapes by complexity**
  - `complexity: 3` → triangle
  - `complexity: 4` → square
  - `complexity: 5` → pentagon
  - `complexity: 6` → hexagon

- [ ] **1.2 Implement guild colors**
  - Swordsman: `#D4A017` (amber)
  - Mage: `#7C6FEF` (violet)
  - Bridge: `#5B8C5A` (sage)
  - Emergent: `#C4A265` (gold)

- [ ] **1.3 Implement maturity-based sizing**
  - concept: 8px
  - spec: 14px
  - implementation: 20px
  - deployed: 28px

- [ ] **1.4 Implement edge styling**
  - `principle_extends`: solid with arrow
  - `implements`: solid cyan with arrow
  - `inscription_echo`: dashed grey
  - `guild_bridge`: gradient (amber→violet)
  - `dependency`: dotted with arrow

- [ ] **1.5 Add hover tooltips**
  - Show full label, type, guild, summary
  - Use Framer Motion for smooth appearance

- [ ] **1.6 Add zoom/pan controls**
  - D3 zoom already works, add reset button
  - Add zoom level indicator

### Acceptance Criteria
- [ ] Nodes visually distinct by guild, complexity, maturity
- [ ] Edges visually distinct by type
- [ ] Smooth interactions with tooltips

---

## Phase 2: Node Inspector & Filters (Week 2)

### Objective
Interactive exploration of the Nexus.

### Tasks

- [ ] **2.1 Create `NodeInspector.tsx`**
  - Slide-in panel from right on node click
  - Shows: label, type, guild, summary
  - Shows: dimensional profile (6-bar chart)
  - Shows: connected nodes (incoming/outgoing)
  - Shows: inscriptions
  - Button: "Read this tale" → link to `/zero/[n]`
  - Button: "Add to my web" → lights spell in Spellweb

- [ ] **2.2 Create `GraphFilters.tsx`**
  - Toggle panel (sidebar or floating)
  - Filter by guild (checkboxes)
  - Filter by type (tale/protocol/standard)
  - Filter by maturity
  - "Reset" button

- [ ] **2.3 Create dimensional profile component**
  - 6 horizontal bars for d₁→d₆
  - Color-coded by value intensity
  - Labels: Hide, Commit, Prove, Connect, Reflect, Delegate

- [ ] **2.4 Wire up node click → inspector**
  - Click node opens inspector
  - Click elsewhere closes inspector
  - Mobile: tap to toggle

### Acceptance Criteria
- [ ] Click any node, see detailed inspector
- [ ] Filters reduce visible nodes in real-time
- [ ] "Read this tale" navigates correctly

---

## Phase 3: Paradox Plane View (Week 3)

### Objective
Alternative scatter plot visualization.

### Tasks

- [ ] **3.1 Create `ParadoxPlane.tsx`**
  - X-axis: `privacyDelegationPosition` (0.0 → 1.0)
  - Y-axis: `dimensionalScale` (0.0 → 1.0)
  - Nodes positioned precisely by scores
  - Guild color preserved
  - Connection lines visible between linked nodes

- [ ] **3.2 Add axis labels**
  - X: "Pure Privacy ← → Pure Delegation"
  - Y: "d₁ Hide ← → d₆ Delegate"
  - Quadrant labels (optional)

- [ ] **3.3 Add view mode toggle**
  - Button group: [Constellation] [Paradox Plane]
  - Smooth transition between views (optional)

- [ ] **3.4 Share inspector between views**
  - Click node in either view opens same inspector
  - Filters apply to both views

### Acceptance Criteria
- [ ] Two view modes toggle cleanly
- [ ] Paradox Plane shows meaningful clustering
- [ ] Swordsman nodes cluster left, Mage nodes cluster right

---

## Phase 4: Spellweb ↔ Nexus Bridge (Week 4)

### Objective
Connect personal journey to knowledge graph.

### Tasks

- [ ] **4.1 Create `src/lib/nexus/overlay.ts`**
  - Map spell IDs (e.g., `zero-tale-1`) to Nexus node IDs (e.g., `tale-03-monastery`)
  - Return `Set<string>` of lit nexus node IDs

- [ ] **4.2 Create `OverlayToggle.tsx`**
  - Checkbox: "Show My Path"
  - When enabled, overlay user's lit nodes onto Nexus

- [ ] **4.3 Implement overlay rendering**
  - Lit nodes: glow effect, full opacity
  - Unlit nodes: dimmed, reduced opacity
  - User connections: dashed cyan lines

- [ ] **4.4 Implement "Add to my web" from Nexus**
  - NodeInspector button lights corresponding spell
  - Writes to localStorage (spellbook storage)
  - Shows confirmation toast

- [ ] **4.5 Implement "View in Nexus" from Spellweb**
  - Spell node click option: "View in Nexus"
  - Navigates to `/nexus?highlight=[nodeId]`

- [ ] **4.6 Add comprehension markers (visual only)**
  - If user has comprehension data, show checkmarks on nodes
  - Stored in localStorage, displayed on overlay

### Acceptance Criteria
- [ ] Toggle shows/hides user's path on Nexus
- [ ] Bidirectional navigation between graphs
- [ ] User's journey visible in context of full knowledge

---

## Phase 5: Expanded Dataset (Week 5-6)

### Objective
Complete the knowledge graph data.

### Tasks

- [ ] **5.1 Add remaining tales to nodes.json**
  - Tales 7-30 (currently have 1-6, 10, 15)
  - Score each on 6 dimensions
  - Assign guild, protocolFamily, maturity

- [ ] **5.2 Add guild_bridge edges**
  - Identify Swordsman↔Mage connections
  - E.g., `proto-rpp` → `tale-10-mirror` (trust meets agent)

- [ ] **5.3 Add concept nodes**
  - Privacy-delegation paradox
  - 7th capital
  - Reconstruction ceiling
  - Separation theorem

- [ ] **5.4 Add persona nodes**
  - Soulbis, Soulbae, Warden, Gatekeeper, etc.
  - Connect via `persona_knows` edges to concepts

- [ ] **5.5 Validate all scores**
  - Review dimensional scoring for consistency
  - Ensure no orphaned nodes

- [ ] **5.6 Update persona-paths.json**
  - Pre-compute constellation paths for each persona
  - Store as ordered node ID arrays

### Acceptance Criteria
- [ ] 50+ nodes in Nexus
- [ ] All 30 tales represented
- [ ] Guild bridges illuminate core architectural tension
- [ ] Persona paths pre-computed

---

## Phase 6: Graph RAG Integration (Week 7-8)

### Objective
Soulbae queries the Nexus via Cypher.

### Tasks

- [ ] **6.1 Integrate KuzuDB WASM**
  - Install `kuzu-wasm` package
  - Create `src/lib/nexus/schema.ts` with table definitions
  - Create `src/lib/nexus/query.ts` with helper functions

- [ ] **6.2 Load Nexus into KuzuDB at runtime**
  - On `/nexus` load, populate KuzuDB from JSON
  - Cache connection for session

- [ ] **6.3 Create `NexusChat.tsx`**
  - Chat panel (slide-in or modal)
  - Context: clicked node
  - Queries KuzuDB for related nodes

- [ ] **6.4 Create Cypher query tools**
  - `getConnectedNodes(nodeId)` — find neighbors
  - `findPathBetween(a, b)` — shortest path
  - `searchByLabel(query)` — fuzzy search

- [ ] **6.5 Connect "Ask Soulbae about this"**
  - Button in NodeInspector opens NexusChat
  - Pre-loads node context into chat

- [ ] **6.6 Implement privacy budget**
  - φ×10 (≈16) queries per session
  - Visual counter in chat panel
  - Reset on new session

### Acceptance Criteria
- [ ] "Ask Soulbae about this" returns graph-grounded response
- [ ] Cypher queries execute in browser
- [ ] Privacy budget enforced

---

## Phase 7: Build-Time Ingestion (Week 9-10)

### Objective
Auto-generate Nexus from documentation.

### Tasks

- [ ] **7.1 Create `scripts/build-nexus.ts`**
  - Input: `agentprivacy-docs/` markdown files
  - Output: `src/data/nexus/knowledge-graph.json`

- [ ] **7.2 Implement markdown parser**
  - Use `remark/unified` for AST
  - Extract headings, sections, references

- [ ] **7.3 Implement term extractor**
  - Load glossary, find occurrences
  - Create term nodes and DEFINES edges

- [ ] **7.4 Implement reference resolver**
  - Parse `[Whitepaper §3]` citations
  - Create REFERENCES edges

- [ ] **7.5 Implement concept extractor**
  - Identify key concepts from headings
  - Score on 6 dimensions (initially manual, later LLM-assisted)

- [ ] **7.6 Wire into build process**
  - Add to `package.json`: `"prebuild": "tsx scripts/build-nexus.ts"`
  - Verify outputs before `next build`

### Acceptance Criteria
- [ ] `npm run build` auto-generates Nexus from docs
- [ ] New docs → new nodes automatically
- [ ] Reproducible, version-controlled outputs

---

## Quick Start: Today's Actions

If you want to start immediately, here's the minimum viable path:

### Hour 1: Phase 0.1-0.4
- Create directories
- Move data files
- Create types and loader in `src/lib/nexus/`

### Hour 2: Phase 0.5-0.6
- Copy ForceGraph → NexusGraph
- Create Nexus page

### Hour 3: Phase 0.7-0.9
- Update Spellweb page
- Add nav links
- Test both routes

### End of Day
- Two working routes
- Clear separation
- Foundation for all future phases

---

## Success Metrics

| Phase | Key Metric |
|-------|------------|
| 0 | Two routes load without errors |
| 1 | Nodes visually distinct by guild/complexity/maturity |
| 2 | Node inspector shows all metadata |
| 3 | Paradox Plane reveals privacy-delegation spectrum |
| 4 | User's journey visible in Nexus context |
| 5 | 50+ nodes, comprehensive relationships |
| 6 | Soulbae answers graph-grounded questions |
| 7 | Build regenerates Nexus automatically |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| KuzuDB WASM instability | Fallback to in-memory graph with custom queries |
| Large bundle size | Dynamic imports, code splitting, lazy loading |
| Complex D3.js debugging | Use existing ForceGraph as reference, incremental changes |
| Data inconsistency | Validate all nodes/edges before rendering |

---

*"The path is clear. The first step is the hardest — then momentum carries you."*

*⚔️🛤️🧙📊 | 😊*
