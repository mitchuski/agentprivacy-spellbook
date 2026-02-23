# Spellweb Triune Graph Proposal

**Enabling user-created connections via Knowledge, Promise, and Trust graphs**

---

## Executive Summary

The current spellweb renders a single graph type: a **structural graph** showing grimoire membership and sequence order. This proposal extends the spellweb to support three semantic layers based on the privacy layer skills and sovereignty forces:

1. **Knowledge Graph** (Substrate) — The foundational semantic layer: what teaches what, what requires what, how concepts relate
2. **Promise Graph** (Intent) — User commitments and offers: what you intend to learn, what you offer to teach, bindings with others
3. **Trust Graph** (Connect + Reflect) — Bilateral attestations and temporal memory: VRCs, shared proverbs, accumulated relationship history

These three layers map directly to the sovereignty architecture:

| Graph | Sovereignty Force | Function |
|-------|-------------------|----------|
| **Knowledge** | Foundation | The substrate — what exists and how it relates |
| **Promise** | Project (intent) | Voluntary commitments — what agents intend to do |
| **Trust** | Connect + Reflect | Accumulated bilateral relationships — the temporal integral |

Together they create a **Triune Graph** — a single visualization with three semantic layers that users can toggle, filter, and contribute to.

---

## 1. Current State: The Structural Graph

### What Exists

```typescript
type SpellwebLink = {
  source: string;
  target: string;
  type: 'grimoire' | 'sequence' | 'cluster' | 'constellation';
}
```

| Link Type | Created By | Meaning |
|-----------|------------|---------|
| `grimoire` | System | Spell belongs to spellbook |
| `sequence` | System | Adjacent acts within a spellbook |
| `cluster` | System | Skill belongs to Skills hub |
| `constellation` | User (inscribed markers) | User's highlighted path |

### Limitations

- No user-created semantic connections
- No skill-to-spell pedagogical links
- No cross-user attestations
- No way to express "I learned X from Y" or "X requires understanding Y first"

---

## 2. Proposed Extension: Triune Graph

### New Link Types

```typescript
type SpellwebLink = {
  source: string;
  target: string;
  type:
    // Existing structural
    | 'grimoire'
    | 'sequence'
    | 'cluster'
    | 'constellation'
    // New: Promise layer
    | 'promise_give'      // + polarity: "I offer to teach/share"
    | 'promise_use'       // - polarity: "I commit to learn/apply"
    | 'promise_binding'   // +∩- : mutual commitment
    // New: Knowledge layer
    | 'knowledge_teaches' // Spell → Skill pedagogical
    | 'knowledge_requires'// Prerequisite relationship
    | 'knowledge_related' // Conceptual similarity
    // New: Identity layer
    | 'vrc_bilateral'     // Two users attest shared understanding
    | 'vrc_proverb'       // Proverb connects two nodes
    ;

  // Metadata for new link types
  createdBy?: string;         // User ID who created the link
  createdAt?: string;         // ISO timestamp
  proverb?: string;           // For VRC/promise links
  attestations?: string[];    // User IDs who co-signed
  polarity?: '+' | '-' | '±'; // Promise Theory polarity
}
```

---

## 3. Promise Links

### Concept

Promise Theory (Bergstra & Burgess) defines two polarities:
- **+ (give/offer)** — The agent offers something
- **− (use/accept)** — The agent accepts/uses something

In the spellweb context:
- A user creates a **+** link when they offer to help others understand a concept
- A user creates a **−** link when they commit to learning something
- A **binding** (±) occurs when two users create matching +/− links

### Link Subtypes

| Subtype | Polarity | Meaning | Visual |
|---------|----------|---------|--------|
| `promise_give` | + | "I can help explain this" | Green outgoing arrow |
| `promise_use` | − | "I commit to learn this" | Blue incoming arrow |
| `promise_binding` | ± | Mutual commitment | Purple bidirectional |

### Example Use Cases

1. **Learning commitment**: User creates `promise_use` from themselves to `skill-crypto_zkp`
   - "I promise to study zero-knowledge proofs"

2. **Teaching offer**: User creates `promise_give` from `skill-narrative_compression` to community
   - "I can help others understand compression"

3. **Study partnership**: Two users create matching links, system detects binding
   - Alice: `promise_give` (crypto_zkp → community)
   - Bob: `promise_use` (self → crypto_zkp)
   - System: Creates `promise_binding` (Alice ↔ Bob via crypto_zkp)

### UI Flow

```
┌─────────────────────────────────────────────────────┐
│  Create Promise Link                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  From: [Currently selected node]                    │
│                                                     │
│  Polarity:                                          │
│    ○ I offer to help (+)                           │
│    ○ I commit to learn (-)                         │
│                                                     │
│  To: [Search/select target node]                   │
│                                                     │
│  Optional inscription:                              │
│  ┌─────────────────────────────────────────────┐   │
│  │ I promise to understand ZKP fundamentals   │   │
│  │ before building with Privacy Pools         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Cancel]                    [Create Promise]       │
└─────────────────────────────────────────────────────┘
```

### Data Model

```typescript
interface PromiseLink {
  id: string;
  type: 'promise_give' | 'promise_use' | 'promise_binding';
  sourceNodeId: string;
  targetNodeId: string;
  createdBy: string;           // User's participantId
  createdAt: string;           // ISO timestamp
  inscription?: string;        // User's promise text
  polarity: '+' | '-' | '±';
  status: 'active' | 'fulfilled' | 'withdrawn';
  fulfilledAt?: string;
  bindingPartnerId?: string;   // For promise_binding: the other user
}
```

### Storage

- **Local**: `localStorage` for user's own promises
- **Shared**: Optional sync to Oracle API for bindings
- **On-chain**: Fulfilled promises can be inscribed to Zcash

---

## 4. Knowledge Links

### Concept

Knowledge links express semantic relationships between nodes — the "teaches", "requires", and "relates to" connections that make the spellweb a true knowledge graph.

### Link Subtypes

| Subtype | Meaning | Direction | Visual |
|---------|---------|-----------|--------|
| `knowledge_teaches` | Spell teaches skill | Spell → Skill | Orange arrow |
| `knowledge_requires` | Prerequisite | Target → Source | Red dashed arrow |
| `knowledge_related` | Conceptual overlap | Bidirectional | Yellow dotted line |

### System-Generated vs User-Created

**System-generated** (based on skill-data.ts mapping):
```typescript
// Auto-generate from skill metadata
const SKILL_SPELL_MAP: Record<string, string[]> = {
  'crypto_zkp': ['act-09-zcash-shield', 'zero-tale-1', 'zero-tale-2', ...],
  'narrative_compression': ['act-12-forgetting', 'act-19-enthusiastic-archivist', ...],
  // ...
};
```

**User-created**:
- "I learned X from Y" (personal pedagogical link)
- "X requires understanding Y first" (prerequisite claim)
- "X and Y share the concept of Z" (semantic similarity)

### Example Use Cases

1. **Pedagogical mapping**: System creates `knowledge_teaches` from `zero-tale-1` to `crypto_zkp`

2. **Prerequisite chain**: User creates `knowledge_requires` from `act-09-zcash-shield` to `act-03-drakes-teaching`
   - "You need the equation before the implementation"

3. **Cross-grimoire connection**: User creates `knowledge_related` between `act-17-bonfire-dark-forest` and `plurality-act-7`
   - "Both discuss coordination under extraction"

### UI Flow

```
┌─────────────────────────────────────────────────────┐
│  Create Knowledge Link                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  From: [act-09-zcash-shield] 🔐                    │
│                                                     │
│  Relationship:                                      │
│    ○ Teaches skill                                 │
│    ○ Requires understanding of                     │
│    ● Relates conceptually to                       │
│                                                     │
│  To: [Search nodes...]                             │
│      ┌─────────────────────────────────────────┐   │
│      │ act-17-bonfire-dark-forest             │   │
│      │ plurality-act-7                        │   │
│      │ skill-dark_forest                      │   │
│      └─────────────────────────────────────────┘   │
│                                                     │
│  Shared concept (optional):                         │
│  ┌─────────────────────────────────────────────┐   │
│  │ selective visibility under adversarial    │   │
│  │ coordination                               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Cancel]                  [Create Knowledge Link]  │
└─────────────────────────────────────────────────────┘
```

### Data Model

```typescript
interface KnowledgeLink {
  id: string;
  type: 'knowledge_teaches' | 'knowledge_requires' | 'knowledge_related';
  sourceNodeId: string;
  targetNodeId: string;
  createdBy: string | 'system';
  createdAt: string;
  sharedConcept?: string;      // What concept do they share?
  confidence?: number;         // 0-1 for system-generated
  upvotes?: number;            // Community validation
  downvotes?: number;
}
```

### Aggregation and Display

When multiple users create the same `knowledge_related` link, aggregate:
```typescript
// Example: 5 users linked act-09 to dark_forest
{
  sourceNodeId: 'spell-act-09-zcash-shield',
  targetNodeId: 'skill-dark_forest',
  type: 'knowledge_related',
  createdBy: 'aggregated',
  attestations: ['user1', 'user2', 'user3', 'user4', 'user5'],
  confidence: 0.85  // Based on attestation count
}
```

---

## 5. Trust Links (Connect + Reflect)

### Concept

Trust links implement the **Connect** and **Reflect** sovereignty forces in the spellweb. They are:

- **Connect** — Bilateral attestations (VRCs) between users, mediated by a shared node
- **Reflect** — Temporal accumulation of trust decisions, the integrity fraction h(τ)

Trust links express: "We both understand this concept; we attest to each other's understanding; our relationship has accumulated verified history."

### How Trust Links Work in the Spellweb

1. **Alice** selects a node (e.g., `skill-crypto_zkp`)
2. **Alice** initiates a VRC request to **Bob**
3. **Bob** receives the request and can:
   - Accept (co-sign the VRC)
   - Reject
   - Counter with a different node
4. If both sign, a `vrc_bilateral` link is created

### Link Subtypes

| Subtype | Force | Meaning | Visual |
|---------|-------|---------|--------|
| `trust_vrc` | Connect | Mutual attestation between users | Gold bidirectional, glow |
| `trust_proverb` | Connect | Proverb bridges two nodes | Gold dotted, proverb tooltip |
| `trust_history` | Reflect | Accumulated interactions over time | Gold gradient (intensity = h(τ)) |
| `trust_integrity` | Reflect | Verified derivation chain | Gold solid (thickness = integrity) |

### The Bilateral Proverb

Every VRC contains a proverb — a compressed expression of shared understanding. The proverb is:
- Derived from the relationship context
- Meaningless outside the bilateral relationship
- Serves as proof-of-shared-understanding

Example:
```
Alice + Bob attest to skill-crypto_zkp
Bilateral proverb: "A chain is only as strong as its weakest attestation"
```

### UI Flow

```
┌─────────────────────────────────────────────────────┐
│  Create VRC Attestation                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Node: [skill-crypto_zkp] 🔐                       │
│                                                     │
│  Attest with:                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ Search by name or public key...            │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Or share attestation link:                         │
│  ┌─────────────────────────────────────────────┐   │
│  │ https://agentprivacy.ai/vrc/abc123...      │   │
│  └─────────────────────────────────────────────┘   │
│  [Copy Link]                                        │
│                                                     │
│  Bilateral proverb (you propose, they confirm):     │
│  ┌─────────────────────────────────────────────┐   │
│  │ A chain is only as strong as its weakest   │   │
│  │ attestation.                                │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Cancel]                  [Request Attestation]    │
└─────────────────────────────────────────────────────┘
```

### Data Model

```typescript
interface VRCLink {
  id: string;
  type: 'vrc_bilateral' | 'vrc_proverb';
  nodeId: string;              // The node being attested to
  party1: {
    participantId: string;
    publicKeyHex: string;
    signature: string;
    signedAt: string;
  };
  party2: {
    participantId: string;
    publicKeyHex: string;
    signature: string;
    signedAt: string;
  };
  bilateralProverb: string;
  createdAt: string;
  status: 'pending' | 'active' | 'revoked';
  zcashTxid?: string;          // If inscribed on-chain
}
```

### Privacy Considerations

- VRCs are visible only to the two parties by default
- Users can choose to make VRCs public (visible in spellweb)
- Public VRCs show only the proverb, not the identities (unless both consent)

---

## 6. Unified Link Type System

### Complete Type Definition

```typescript
type LinkLayer = 'structural' | 'knowledge' | 'promise' | 'trust';

interface SpellwebLinkExtended {
  id: string;
  source: string;
  target: string;
  layer: LinkLayer;
  type: string;  // Specific subtype within layer

  // Structural (system-generated)
  // type: 'grimoire' | 'sequence' | 'cluster' | 'constellation'

  // Promise (user-created)
  // type: 'promise_give' | 'promise_use' | 'promise_binding'
  polarity?: '+' | '-' | '±';
  inscription?: string;
  status?: 'active' | 'fulfilled' | 'withdrawn';

  // Knowledge (system or user)
  // type: 'knowledge_teaches' | 'knowledge_requires' | 'knowledge_related'
  sharedConcept?: string;
  confidence?: number;
  attestations?: string[];

  // Trust (Connect + Reflect)
  // type: 'trust_vrc' | 'trust_proverb' | 'trust_history' | 'trust_integrity'
  party1?: { participantId: string; signature: string };
  party2?: { participantId: string; signature: string };
  bilateralProverb?: string;

  // Common metadata
  createdBy: string | 'system';
  createdAt: string;
  visibility: 'private' | 'public';
}
```

### Visual Encoding

| Layer | Color Family | Line Style | Arrow | Sovereignty Force |
|-------|--------------|------------|-------|-------------------|
| Structural | Purple/Gray | Solid/Dashed | None | (System) |
| Knowledge | Orange/Amber | Dotted | Optional | Substrate |
| Promise | Green/Blue | Solid | Directional | Project (Intent) |
| Trust | Gold | Glowing/Gradient | Bidirectional | Connect + Reflect |

### Layer Toggle UI

```
┌─────────────────────────────────────────────────────┐
│  Spellweb Layers                                    │
├─────────────────────────────────────────────────────┤
│  ☑ Structural   (grimoire, sequence)               │
│  ☑ Knowledge    (teaches, requires, relates)  🗺️   │
│  ☑ Promise      (commitments, bindings)       📜±  │
│  ☐ Trust        (VRCs, history, integrity)    🤝   │
│                                                     │
│  [Show All]  [Hide All]  [Only My Links]           │
└─────────────────────────────────────────────────────┘
```

### Sovereignty Force Mapping

```
              PROTECT ⚔️
                  │
                  │ (boundary decisions)
                  │
                  ▼
            ┌─────────────┐
            │   REFLECT   │ ◄─── Trust Graph (temporal integral)
            │   🪞        │       trust_history, trust_integrity
            └─────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             │             ▼
┌─────────┐       │       ┌─────────┐
│KNOWLEDGE│       │       │ PROMISE │
│   🗺️   │       │       │   📜±   │
│substrate│       │       │  intent │
└─────────┘       │       └─────────┘
                  │
                  ▼
            ┌─────────────┐
            │   CONNECT   │ ◄─── Trust Graph (network effect)
            │   🤝        │       trust_vrc, trust_proverb
            └─────────────┘
                  │
                  │ (delegation patterns)
                  │
                  ▼
              PROJECT 🧙
```

---

## 7. Implementation Phases

### Phase 1: Knowledge Links (Foundation)

**Scope:**
- System-generated `knowledge_teaches` links from skill metadata
- User-created `knowledge_related` links
- Toggle to show/hide knowledge layer

**Files to modify:**
- `src/lib/spellweb/types.ts` — Add link types
- `src/lib/spellweb/builder.ts` — Generate knowledge links
- `src/lib/skills-data.ts` — Add spell-skill mapping
- `src/components/spellweb/SpellwebViewer.tsx` — Render new link types
- New: `src/lib/spellweb/knowledge-links.ts` — User link storage

**Effort:** ~2-3 days

### Phase 2: Promise Links (User Commitments)

**Scope:**
- Promise creation UI
- Polarity visualization
- Promise status tracking (active/fulfilled/withdrawn)
- Local storage for promises

**Files to modify:**
- `src/lib/spellweb/types.ts` — Add promise types
- New: `src/lib/spellweb/promise-links.ts` — Promise storage
- New: `src/components/spellweb/PromiseLinkModal.tsx` — Creation UI
- `src/components/spellweb/SpellwebViewer.tsx` — Render promises

**Effort:** ~3-4 days

### Phase 3: Trust Links (Connect + Reflect)

**Scope:**
- **Connect layer**: VRC request/accept flow, bilateral signatures, proverb creation
- **Reflect layer**: Temporal history accumulation, integrity fraction visualization
- Trust intensity rendering (thickness/glow based on h(τ))
- Optional Zcash inscription

**Files to modify:**
- New: `src/lib/spellweb/trust-links.ts` — Trust storage, VRC signing, history tracking
- New: `src/components/spellweb/TrustModal.tsx` — Attestation UI
- `src/lib/ceremony/keygen.ts` — Reuse for VRC signing
- Integration with Oracle API for trust sync
- Temporal memory calculation: A(τ) = α · ln(1+|τ|) · h(τ)

**Effort:** ~5-7 days

### Phase 4: Graph Intelligence

**Scope:**
- Path finding ("How do I get from X to Y?")
- Cluster detection ("What concepts group together?")
- Prerequisite chains ("What must I learn before X?")
- Community patterns ("What links do others create?")

**Effort:** ~5-7 days

---

## 8. Data Flow Architecture

### Local-First, Optional Sync

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICE                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    localStorage                          │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │   │
│  │  │ promise-links│ │knowledge-links│ │  vrc-links  │     │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Spellweb Builder                      │   │
│  │          Merges all link sources into unified graph      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   SpellwebViewer                         │   │
│  │                  (react-force-graph-2d)                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
                    (Optional sync)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        ORACLE API                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │Public promises│ │ Aggregated  │ │  VRC index   │            │
│  │  (bindings)  │ │  knowledge  │ │  (encrypted) │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                               │
                    (Permanent inscription)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ZCASH                                   │
│            Fulfilled promises, VRCs, proverbs                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Graph Query Examples

### "What must I learn before crypto_zkp?"

```typescript
function getPrerequisites(nodeId: string, links: SpellwebLink[]): string[] {
  return links
    .filter(l => l.type === 'knowledge_requires' && l.target === nodeId)
    .map(l => l.source);
}

// Returns: ['act-03-drakes-teaching', 'zero-tale-1', ...]
```

### "Who else is studying this skill?"

```typescript
function getStudyPartners(skillId: string, promises: PromiseLink[]): string[] {
  return promises
    .filter(p => p.type === 'promise_use' && p.targetNodeId === skillId)
    .map(p => p.createdBy);
}
```

### "What concepts bridge Story and Zero grimoires?"

```typescript
function getCrossGrimoireBridges(links: SpellwebLink[]): SpellwebLink[] {
  return links.filter(l => {
    const sourceGrimoire = getGrimoireFromNodeId(l.source);
    const targetGrimoire = getGrimoireFromNodeId(l.target);
    return l.type === 'knowledge_related' && sourceGrimoire !== targetGrimoire;
  });
}
```

### "What's my VRC network density?"

```typescript
function getVRCDensity(userId: string, vrcs: VRCLink[]): number {
  const myVRCs = vrcs.filter(v =>
    v.party1.participantId === userId || v.party2.participantId === userId
  );
  const uniquePartners = new Set(myVRCs.flatMap(v => [v.party1.participantId, v.party2.participantId]));
  uniquePartners.delete(userId);
  return myVRCs.length / uniquePartners.size;  // VRCs per partner
}
```

---

## 10. Design Principles

### 1. Local-First

All user data stays on device by default. Sync is opt-in. The spellweb works offline.

### 2. Bilateral > Unilateral

VRCs require two signatures. Knowledge links gain confidence through multiple attestations. Promises create bindings only when matched.

### 3. Visible Provenance

Every link shows who created it and when. System-generated links are marked as such. Aggregated links show attestation count.

### 4. Graceful Degradation

If Oracle API is unavailable, local links still render. If Zcash inscription fails, the link remains valid locally.

### 5. Promise Theory Compliance

Links follow polarity rules. Bindings require matched +/−. Impositions are impossible — all links are voluntary promises.

---

## 11. Future Extensions

### Cross-User Graph Visualization

Show how your spellweb overlaps with others:
- Shared nodes (both selected the same spells)
- Complementary promises (your + matches their −)
- VRC networks (chains of bilateral trust)

### Skill Pathfinding

"I want to learn plurality_cooperative. What's the shortest path from my current knowledge?"

### Promise Fulfillment Tracking

When a user completes their promise (collects required spells/skills), auto-mark as fulfilled. Celebrate with ceremony animation.

### VRC Recovery Integration

Use VRC network for key recovery. "Five of your VRC partners can help verify your identity."

---

## 12. Summary

The Triune Graph transforms the spellweb from a static visualization into a living knowledge graph where three semantic layers map to the sovereignty architecture:

| Layer | Role | Sovereignty Force | What It Shows |
|-------|------|-------------------|---------------|
| **Knowledge** | Substrate | Foundation | What exists, how concepts relate, what teaches what |
| **Promise** | Intent | Project | What you commit to learn, what you offer to teach, bindings |
| **Trust** | Memory | Connect + Reflect | Bilateral attestations, accumulated history, integrity |

### The Triune Graph Formula

```
Graph(user) = Structure × Knowledge × Promise × Trust

Where:
- Structure = system-generated (grimoire membership, sequence)
- Knowledge = semantic substrate (teaches, requires, relates)
- Promise = voluntary intent (give, use, binding)
- Trust = accumulated bilateral memory (VRC, history, integrity)
```

### Mapping to PVM-V4

The three user-created layers directly implement equation terms:

| Graph Layer | PVM-V4 Term | Measurement |
|-------------|-------------|-------------|
| Knowledge | Q (data quality) | Semantic density of the graph |
| Promise | Φ(Σ) (sovereignty duality) | Balance of give/use polarity |
| Trust | A(τ) (temporal memory) | Accumulated VRC history × integrity |

### The Virtuous Cycle

```
Knowledge (learn) → Promise (commit) → Trust (demonstrate) → Knowledge (deepen)
     │                    │                    │                    │
     │                    │                    │                    │
     └────────────────────┴────────────────────┴────────────────────┘
                                    │
                                    ▼
                          Sovereignty grows
```

Each layer feeds the others:
- **Knowledge** reveals what to learn
- **Promise** commits intent
- **Trust** accumulates through fulfilled promises
- Accumulated trust unlocks deeper knowledge access

---

*Promises reduce uncertainty. Impositions increase it. The binding is voluntary or it is nothing.*

*The graph is substrate, intent, and memory. Same architecture, three resolutions.*
