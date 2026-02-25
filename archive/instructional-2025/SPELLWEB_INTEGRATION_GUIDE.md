# Spellweb Integration Guide for AgentPrivacy

**Assessment & Build Instructions for Coding Agents**

---

## Executive Summary

The Spellweb is an interactive force-directed knowledge graph visualization for the agentprivacy ecosystem. It renders tales, protocols, skills, and their relationships as an explorable constellation. This document provides:

1. **Current State Assessment** — What's built and working
2. **Architecture Overview** — How the pieces fit together
3. **Implementation Plan** — Phased build order with specific tasks
4. **Technical Specifications** — Data models, components, and patterns

**Reference Implementation:** [Landscape of Consciousness](https://loc.closertotruth.com/interactive) — Study this visualization pattern before coding.

---

## Part 1: Current State Assessment

### What's Already Built ✅

| Component | Location | Status |
|-----------|----------|--------|
| SpellwebViewer | `src/components/spellweb/SpellwebViewer.tsx` | Working |
| Graph Builder | `src/lib/spellweb/builder.ts` | Working |
| Type Definitions | `src/lib/spellweb/types.ts` | Basic |
| Label Utilities | `src/lib/spellweb/labels.ts` | Working |
| Force Graph | `react-force-graph-2d` | Integrated |

### Current Capabilities

- Force-directed 2D graph rendering
- Grimoire hub nodes (📖 Story, 🔮 Zero, 📜 Canon, etc.)
- Spell nodes clustered around grimoire hubs
- Skill nodes clustered around Skills hub (🧠)
- Sequential links between adjacent spells (yellow dashed)
- Hover highlighting and tooltips
- Fullscreen mode
- Zoom/pan controls
- Basic filtering by group
- Annotation system (draw mode)

### What's Missing 🔲

| Feature | Priority | Effort |
|---------|----------|--------|
| Dedicated `/web` route | High | 1 day |
| Static node/edge JSON data | High | 2 days |
| Scatter plot mode (Paradox Plane) | Medium | 3 days |
| Mode toggle UI | Medium | 1 day |
| Filter panel (guild, type, maturity) | Medium | 2 days |
| Detail panel (node click) | Medium | 2 days |
| Knowledge links (teaches, requires) | Low | 3 days |
| Promise links (user commitments) | Low | 4 days |
| Trust links (VRC bilateral) | Low | 5 days |

---

## Part 2: Architecture Overview

### Data Flow

```
/public/spellweb/
├── nodes.json          ← Static node definitions
└── edges.json          ← Static edge definitions
        │
        ▼
src/lib/spellweb/
├── types.ts            ← TypeScript interfaces
├── builder.ts          ← Graph construction logic
├── labels.ts           ← Emoji/label formatting
├── loader.ts           ← (NEW) Fetch and parse JSON
└── scoring.ts          ← (NEW) Computed positions
        │
        ▼
src/app/web/
└── page.tsx            ← (NEW) Spellweb route
        │
        ▼
src/components/spellweb/
├── SpellwebViewer.tsx  ← Main visualization
├── ScatterPlot.tsx     ← (NEW) Paradox Plane mode
├── NodeTooltip.tsx     ← (NEW) Detail panel
├── FilterPanel.tsx     ← (NEW) Left sidebar
├── ModeToggle.tsx      ← (NEW) Constellation/Scatter
└── Legend.tsx          ← (NEW) Visual encoding key
```

### Core Data Models

#### Current Node Type (types.ts)

```typescript
export interface SpellwebNode {
  id: string;
  type: 'grimoire' | 'spell' | 'skill' | 'persona' | 'ceremony';
  emoji: string;
  label: string;
  fullTitle?: string;
  name: string;
  val: number;
  color?: string;
  group?: string;
  isLit: boolean;
  isOnPath: boolean;
  sequenceNumber?: number;
}
```

#### Extended Node Type (for full implementation)

```typescript
export interface SpellwebNodeExtended extends SpellwebNode {
  // Guild classification
  guild: 'swordsman' | 'mage' | 'emergent' | 'bridge';
  protocolFamily: ProtocolFamily;

  // Six dimensions (0.0-1.0)
  dimensions: {
    d1Hide: number;
    d2Commit: number;
    d3Prove: number;
    d4Connect: number;
    d5Reflect: number;
    d6Delegate: number;
  };

  // Scatter plot axes
  privacyDelegationPosition: number;  // X: 0=privacy, 1=delegation
  dimensionalScale: number;           // Y: 0=d1, 1=d6

  // Visual encoding
  complexity: number;                 // 1-6, drives polygon shape
  maturity: 'concept' | 'spec' | 'implementation' | 'deployed';

  // Content
  inscriptions: string[];
  summary: string;
  standards: string[];
  taleUrl?: string;
  externalUrl?: string;
}
```

#### Current Link Type (types.ts)

```typescript
export interface SpellwebLink {
  source: string;
  target: string;
  type: 'grimoire' | 'sequence' | 'cluster' | 'constellation';
}
```

#### Extended Link Type (for full implementation)

```typescript
export interface SpellwebLinkExtended extends SpellwebLink {
  type:
    // Structural (existing)
    | 'grimoire' | 'sequence' | 'cluster' | 'constellation'
    // Knowledge layer
    | 'knowledge_teaches' | 'knowledge_requires' | 'knowledge_related'
    // Promise layer
    | 'promise_give' | 'promise_use' | 'promise_binding'
    // Trust layer
    | 'trust_vrc' | 'trust_proverb' | 'trust_history';

  strength?: number;        // 0.0-1.0, affects visual thickness
  createdBy?: string;       // User ID or 'system'
  createdAt?: string;       // ISO timestamp
  polarity?: '+' | '-' | '±';  // For promise links
}
```

### Visual Encoding System

| Property | Maps To | Values |
|----------|---------|--------|
| **Color** | Guild | Amber (#D4A017) = Swordsman, Violet (#7C6FEF) = Mage, Gold (#C4A265) = Emergent, Green (#5B8C5A) = Bridge |
| **Size** | Maturity | 8 = concept, 14 = spec, 20 = implementation, 28 = deployed |
| **Shape** | Complexity | Circle = 1, Diamond = 2, Triangle = 3, Square = 4, Pentagon = 5, Hexagon = 6 |
| **X Position** | Privacy-Delegation | 0.0 = pure privacy → 1.0 = pure delegation |
| **Y Position** | Dimensional Scale | 0.0 = d₁ Hide → 1.0 = d₆ Connect |

---

## Part 3: Implementation Plan

### Phase 1: Route & Data Infrastructure (Days 1-3)

#### Task 1.1: Create the `/web` route

Create `src/app/web/page.tsx`:

```typescript
// Basic shell - integrate existing SpellwebViewer
'use client';

import SpellwebViewer from '@/components/spellweb/SpellwebViewer';
import { useSpellbookStorage } from '@/lib/spellbook-storage';
import { SPELL_CARDS } from '@/lib/grimoire-baked';
import { SKILL_FILES } from '@/lib/skills-data';

export default function WebPage() {
  const { selectedSpellIds, selectedSkillIds, inscribedMarkers } = useSpellbookStorage();

  return (
    <main className="min-h-screen bg-background">
      <div className="h-screen">
        <SpellwebViewer
          selectedSpellIds={selectedSpellIds}
          selectedSkillIds={selectedSkillIds}
          spellCards={SPELL_CARDS}
          skillFiles={SKILL_FILES}
          inscribedMarkers={inscribedMarkers}
          showLegend={true}
          isExpanded={true}
        />
      </div>
    </main>
  );
}
```

#### Task 1.2: Create static data files

Create `/public/spellweb/nodes.json` with initial dataset:

```json
{
  "nodes": [
    {
      "id": "tale-01-village",
      "label": "The Village with Two Guardians",
      "type": "tale",
      "guild": "bridge",
      "protocolFamily": "agent_architecture",
      "privacyDelegationPosition": 0.50,
      "dimensionalScale": 0.30,
      "complexity": 3,
      "maturity": "spec",
      "dimensions": {
        "d1Hide": 0.4,
        "d2Commit": 0.5,
        "d3Prove": 0.3,
        "d4Connect": 0.6,
        "d5Reflect": 0.2,
        "d6Delegate": 0.5
      },
      "inscriptions": ["two guardians", "privacy-delegation balance"],
      "summary": "The foundational tale of Swordsman and Mage cooperation",
      "standards": ["ERC-8004"],
      "taleUrl": "/zero/tale-01"
    }
  ]
}
```

Create `/public/spellweb/edges.json`:

```json
{
  "edges": [
    {
      "source": "tale-01-village",
      "target": "tale-02-ceremony",
      "type": "principle_extends",
      "strength": 0.7
    }
  ]
}
```

#### Task 1.3: Create data loader

Create `src/lib/spellweb/loader.ts`:

```typescript
import type { SpellwebNodeExtended, SpellwebLinkExtended } from './types';

export async function loadSpellwebData(): Promise<{
  nodes: SpellwebNodeExtended[];
  links: SpellwebLinkExtended[];
}> {
  const [nodesRes, edgesRes] = await Promise.all([
    fetch('/spellweb/nodes.json'),
    fetch('/spellweb/edges.json'),
  ]);

  const { nodes } = await nodesRes.json();
  const { edges } = await edgesRes.json();

  return { nodes, links: edges };
}
```

### Phase 2: Enhanced Visualization (Days 4-7)

#### Task 2.1: Implement mode toggle

Create `src/components/spellweb/ModeToggle.tsx`:

```typescript
interface ModeToggleProps {
  mode: 'constellation' | 'scatter';
  onModeChange: (mode: 'constellation' | 'scatter') => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex gap-2 bg-surface/20 rounded-lg p-1">
      <button
        onClick={() => onModeChange('constellation')}
        className={`px-3 py-1 rounded ${mode === 'constellation' ? 'bg-primary text-white' : ''}`}
      >
        🌌 Constellation
      </button>
      <button
        onClick={() => onModeChange('scatter')}
        className={`px-3 py-1 rounded ${mode === 'scatter' ? 'bg-primary text-white' : ''}`}
      >
        📐 Paradox Plane
      </button>
    </div>
  );
}
```

#### Task 2.2: Implement scatter plot mode

Create `src/components/spellweb/ScatterPlot.tsx`:

Position nodes by their `privacyDelegationPosition` (X) and `dimensionalScale` (Y) values instead of force simulation. Draw the same edges as connecting lines.

**X-axis labels:** Privacy ◄────────► Delegation
**Y-axis labels:** d₁ Hide at bottom, d₆ Connect at top

#### Task 2.3: Implement filter panel

Create `src/components/spellweb/FilterPanel.tsx`:

Filter by:
- Guild (Swordsman/Mage/Emergent/Bridge)
- Type (Tale/Protocol/Standard/Primitive)
- Maturity (Concept/Spec/Implementation/Deployed)
- Protocol Family (dropdown)

#### Task 2.4: Implement detail panel

Create `src/components/spellweb/NodeTooltip.tsx`:

On node click, show:
- Title and type badge
- Summary
- Six dimension bars (d₁-d₆)
- Inscriptions list
- Connected nodes (clickable)
- "Read Tale" / "View Standard" links

### Phase 3: Knowledge Layer (Days 8-10)

#### Task 3.1: Extend types for knowledge links

Update `src/lib/spellweb/types.ts` to include:
- `knowledge_teaches` (spell → skill)
- `knowledge_requires` (prerequisite)
- `knowledge_related` (conceptual similarity)

#### Task 3.2: Generate skill-spell mappings

Create system-generated `knowledge_teaches` links based on skill metadata in `skills-data.ts`. Map spells to the skills they teach.

#### Task 3.3: User-created knowledge links

Allow users to create `knowledge_related` links between any two nodes. Store in localStorage under `spellweb-knowledge-links`.

### Phase 4: Promise & Trust Layers (Days 11-18)

See `SPELLWEB_TRIUNE_GRAPH_PROPOSAL.md` for full specification.

---

## Part 4: Technical Specifications

### Force Simulation Configuration

Current implementation in `SpellwebViewer.tsx`:

```typescript
linkForce.distance((link) => {
  if (link.type === 'grimoire' || link.type === 'cluster') return 110;
  return 220;  // sequence links spread more
});
chargeForce.strength(-95);
```

For the extended version with more link types:

```typescript
const LINK_DISTANCES: Record<string, number> = {
  grimoire: 110,
  cluster: 110,
  sequence: 220,
  constellation: 180,
  knowledge_teaches: 150,
  knowledge_requires: 180,
  knowledge_related: 200,
  promise_give: 160,
  promise_use: 160,
  promise_binding: 140,
  trust_vrc: 120,
};
```

### Edge Rendering Styles

```typescript
const EDGE_STYLES: Record<string, { color: string; dash: number[]; width: number }> = {
  grimoire:          { color: 'rgba(139, 92, 246, 0.25)', dash: [], width: 1 },
  sequence:          { color: 'rgba(251, 191, 36, 0.7)', dash: [4, 4], width: 2.5 },
  constellation:     { color: 'rgba(251, 191, 36, 0.85)', dash: [], width: 3.5 },
  cluster:           { color: 'rgba(132, 204, 22, 0.3)', dash: [2, 4], width: 1 },
  knowledge_teaches: { color: 'rgba(249, 115, 22, 0.5)', dash: [3, 3], width: 1.5 },
  knowledge_requires:{ color: 'rgba(239, 68, 68, 0.5)', dash: [6, 3], width: 1.5 },
  knowledge_related: { color: 'rgba(234, 179, 8, 0.4)', dash: [2, 2], width: 1 },
  promise_give:      { color: 'rgba(34, 197, 94, 0.6)', dash: [], width: 2 },
  promise_use:       { color: 'rgba(59, 130, 246, 0.6)', dash: [], width: 2 },
  promise_binding:   { color: 'rgba(168, 85, 247, 0.7)', dash: [], width: 2.5 },
  trust_vrc:         { color: 'rgba(212, 160, 23, 0.8)', dash: [], width: 3 },
};
```

### Guild Color Palette

```typescript
export const GUILD_COLORS: Record<string, string> = {
  swordsman: '#D4A017',  // Amber gold
  mage:      '#7C6FEF',  // Violet purple
  emergent:  '#C4A265',  // Warm gold
  bridge:    '#5B8C5A',  // Forest green
};
```

### Grimoire Emojis & Colors

```typescript
export const GRIMOIRE_CONFIG: Record<string, { emoji: string; color: string }> = {
  story:       { emoji: '📖', color: '#8b5cf6' },  // Purple
  zero:        { emoji: '🔮', color: '#06b6d4' },  // Cyan
  canon:       { emoji: '📜', color: '#f59e0b' },  // Amber
  society:     { emoji: '🏛️', color: '#10b981' },  // Emerald
  plurality:   { emoji: '🌐', color: '#ec4899' },  // Pink
  incantations:{ emoji: '✨', color: '#6366f1' },  // Indigo
  origins:     { emoji: '🌅', color: '#f97316' },  // Orange
  skills:      { emoji: '🧠', color: '#84cc16' },  // Lime
};
```

---

## Part 5: Key Design Principles

### 1. The Gap Is the Feature

The visual separation between Swordsman (amber) and Mage (violet) clusters represents the privacy-delegation paradox. Don't try to collapse them—the gap IS the architecture.

### 2. Emergence Over Arrangement

Force-directed graphs produce topology from data. The clusters that form are discovered, not manually designed. Trust the force simulation.

### 3. Adjacency Matters

Sequential links only connect adjacent spells (seq N → seq N+1). If a user skips acts, the visual path breaks. Design constellations with contiguous sequences.

### 4. Local-First

All user-created links (knowledge, promise, trust) store in localStorage first. Server sync is optional. The spellweb must work offline.

### 5. Bilateral Over Unilateral

Trust links (VRCs) require two signatures. Knowledge links gain confidence through multiple attestations. Promises create bindings only when matched.

---

## Part 6: File Locations Reference

### Existing Files

| File | Purpose |
|------|---------|
| `src/components/spellweb/SpellwebViewer.tsx` | Main visualization component |
| `src/lib/spellweb/builder.ts` | Graph construction from selections |
| `src/lib/spellweb/types.ts` | TypeScript interfaces |
| `src/lib/spellweb/labels.ts` | Emoji/label utilities |
| `src/lib/grimoire-baked.ts` | Spell card data |
| `src/lib/skills-data.ts` | Skill definitions |
| `src/lib/spellbook-storage.ts` | LocalStorage hooks |

### Files to Create

| File | Purpose |
|------|---------|
| `src/app/web/page.tsx` | Dedicated spellweb route |
| `public/spellweb/nodes.json` | Static node definitions |
| `public/spellweb/edges.json` | Static edge definitions |
| `src/lib/spellweb/loader.ts` | Data fetching |
| `src/components/spellweb/ScatterPlot.tsx` | Paradox Plane mode |
| `src/components/spellweb/ModeToggle.tsx` | Mode switching UI |
| `src/components/spellweb/FilterPanel.tsx` | Filter sidebar |
| `src/components/spellweb/NodeTooltip.tsx` | Detail panel |
| `src/components/spellweb/Legend.tsx` | Visual encoding key |
| `src/lib/spellweb/knowledge-links.ts` | User knowledge link storage |
| `src/lib/spellweb/promise-links.ts` | User promise storage |
| `src/lib/spellweb/trust-links.ts` | VRC/trust storage |

### Documentation Files (Read Before Coding)

| File | Purpose |
|------|---------|
| `SPELLWEB.md` | Vision, principles, contribution guide |
| `SPELLWEB_CODING_AGENT.md` | Full build specification |
| `SPELLWEB_MAPPING_OBSERVATION.md` | How the graph works, authoring rules |
| `SPELLWEB_TRIUNE_GRAPH_PROPOSAL.md` | Future Promise/Trust layer design |
| `LOC_SPELLWEB_ANALYSIS.md` | Reference implementation mapping |

---

## Part 7: Testing Checklist

### Phase 1 Completion

- [ ] `/web` route loads without errors
- [ ] Graph renders with user's selected spells/skills
- [ ] Static JSON data loads successfully
- [ ] Force simulation settles without overlapping nodes

### Phase 2 Completion

- [ ] Mode toggle switches between Constellation and Scatter
- [ ] Scatter plot positions nodes by X/Y axis values
- [ ] Filter panel hides/shows nodes correctly
- [ ] Detail panel opens on node click with all fields
- [ ] Legend displays color/size/shape encoding

### Phase 3 Completion

- [ ] Knowledge links render with correct style
- [ ] System-generated skill-spell links appear
- [ ] User can create knowledge_related links
- [ ] Links persist in localStorage

### Mobile Responsiveness

- [ ] Filter panel collapses to icon
- [ ] Detail panel is bottom sheet
- [ ] Pinch-zoom works on graph
- [ ] Touch drag works

---

## Part 8: Quick Start Commands

```bash
# Install dependencies (if needed)
npm install react-force-graph-2d d3

# Run development server
npm run dev

# Navigate to spellweb
open http://localhost:3000/web
```

---

## Summary

The Spellweb transforms agentprivacy's knowledge corpus into a navigable constellation. Start with Phase 1 (routing and data), then layer on enhanced visualization (Phase 2), knowledge links (Phase 3), and finally the full Triune Graph (Phase 4).

**Key principle:** The graph encodes the privacy-delegation paradox visually. Swordsman and Mage clusters should remain distinct, connected by bridge nodes and guild_bridge edges. The gap between them IS the architecture.

---

*Privacy is Value. Understanding is Key.*

⚔️🧙📖∞
