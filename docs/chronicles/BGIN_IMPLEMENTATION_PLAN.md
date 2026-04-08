# BGIN Features Implementation Plan for AgentPrivacy

## Overview

Integrating select BGIN AI features into agentprivacy.ai while keeping the current architecture intact.

**Selected Features:**
1. Identity Ceremony (Swordsman keygen) → redirects to /spells
2. Promises System
3. Spellweb Visualization (on /spells page)
4. Trust Tier Badges

**NOT changing:** MagePanel sidebar - works great as-is.

---

## Current Architecture (Unchanged)

| Aspect | Current State |
|--------|---------------|
| **Framework** | Next.js 16 with static export |
| **State** | localStorage + React hooks |
| **Mage** | MagePanel.tsx sidebar - **KEEP AS-IS** |
| **Spells** | /spells page with skill graph sidebar |

---

## Phase 1: Identity Ceremony

### What It Does
Creates a Swordsman identity with Ed25519 keypair → redirects to /spells to build skill graph.

### Step 1.1: Create Ceremony Route
**File:** `src/app/ceremony/page.tsx`

```
/ceremony - 6-step wizard:
1. Welcome - Set Swordsman display name
2. Key Generation - Ed25519 via WebCrypto
3. Privacy Preferences - Attribution levels
4. Grimoire Selection - Which spellbooks to engage
5. Agent Card Preview - Review signed identity
6. Completion - Redirect to /spells
```

**Flow:** Ceremony → /spells (user builds their skill graph with their new identity)

### Step 1.2: Create Crypto Library
**File:** `src/lib/ceremony/keygen.ts`

```typescript
// Use @noble/ed25519 for broad browser support
import * as ed from '@noble/ed25519';

export async function generateKeyPair(): Promise<{ privateKey: Uint8Array; publicKey: Uint8Array }>
export function publicKeyToHex(publicKey: Uint8Array): string
export async function signMessage(privateKey: Uint8Array, message: string): Promise<string>
export function generateParticipantId(publicKeyHex: string): string // ap-{first16hex}
```

**Package:** `npm install @noble/ed25519`

### Step 1.3: Create Types
**File:** `src/lib/ceremony/types.ts`

```typescript
export interface AgentCard {
  participantId: string;        // ap-{hash}
  displayName: string;          // User-chosen Swordsman name
  publicKeyHex: string;         // Ed25519 public key
  grimoires: string[];          // ['story', 'zero', 'canon', etc.]
  privacy: {
    attribution: 'full' | 'pseudonymous' | 'anonymous';
    shareProverbs: boolean;
  };
  trustTier: 'blade' | 'light' | 'heavy' | 'dragon';
  createdAt: string;
  signature: string;
}
```

### Step 1.4: Create Storage
**File:** `src/lib/ceremony/storage.ts`

```typescript
const KEYS = {
  AGENT_CARD: 'ap-agent-card',
  PRIVATE_KEY: 'ap-private-key',  // Encrypted with passphrase
  CEREMONY_COMPLETE: 'ap-ceremony-complete',
};

export function hasCompletedCeremony(): boolean
export function getAgentCard(): AgentCard | null
export function saveAgentCard(card: AgentCard): void
export function savePrivateKey(key: string, passphrase: string): void
export function clearIdentity(): void
```

### Step 1.5: Create Ceremony Components
**Files:**
- `src/components/ceremony/CeremonyWizard.tsx` - Main wrapper with step navigation
- `src/components/ceremony/WelcomeStep.tsx`
- `src/components/ceremony/KeyGenStep.tsx` - Shows key generation animation
- `src/components/ceremony/PrivacyStep.tsx`
- `src/components/ceremony/GrimoireStep.tsx` - Checkbox grid of spellbooks
- `src/components/ceremony/AgentCardStep.tsx` - Preview card before signing
- `src/components/ceremony/CompletionStep.tsx` - Success + redirect to /spells

### Step 1.6: Completion Redirect
```tsx
// In CompletionStep.tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

// After 2-second success animation
setTimeout(() => {
  router.push('/spells');
}, 2000);
```

**DECIDED:**
- Ceremony is **mandatory for saving spellbooks**
- Your unique proverbs and learning path attach to your key profile
- Anonymous browsing allowed, but "Save spellbook" triggers ceremony if not completed
- Key backup: Passphrase-encrypted download recommended

---

## Phase 2: Promises System

### What It Does
Voluntary commitments tied to learning journey, optionally connected to proverbs.

### Step 2.1: Create Types
**File:** `src/lib/promises/types.ts`

```typescript
export type PromiseType = 'inscribe' | 'study' | 'share' | 'contribute' | 'custom';
export type PromiseStatus = 'active' | 'in_progress' | 'completed' | 'withdrawn';

export interface Promise {
  id: string;
  type: PromiseType;
  description: string;
  status: PromiseStatus;
  grimoire?: string;
  actNumber?: number;
  connectedProverb?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

### Step 2.2: Create Storage
**File:** `src/lib/promises/storage.ts`

```typescript
const PROMISES_KEY = 'ap-promises';

export function getPromises(): Promise[]
export function addPromise(promise: Omit<Promise, 'id' | 'createdAt' | 'updatedAt'>): Promise
export function updatePromiseStatus(id: string, status: PromiseStatus): void
export function deletePromise(id: string): void
```

### Step 2.3: Create Promises Page
**File:** `src/app/promises/page.tsx`

Layout - Kanban-style board:
```
+--------------------------------------------------+
|  My Promises                    [+ New Promise]  |
+--------------------------------------------------+
|  ACTIVE         | IN PROGRESS    | COMPLETED     |
|  +-----------+  | +-----------+  | +-----------+ |
|  | Promise 1 |  | | Promise 3 |  | | Promise 4 | |
|  +-----------+  | +-----------+  | +-----------+ |
|  | Promise 2 |  |                | | Promise 5 | |
|  +-----------+  |                | +-----------+ |
+--------------------------------------------------+
```

### Step 2.4: Create Components
**Files:**
- `src/components/promises/PromiseBoard.tsx` - 3-column Kanban
- `src/components/promises/PromiseCard.tsx` - Individual card with status buttons
- `src/components/promises/NewPromiseModal.tsx` - Creation form

### Step 2.5: Integration with MagePanel (Light Touch)
**In existing MagePanel.tsx**, after proverb detection:

Add a button below "Copy Proverb":
```tsx
<button onClick={() => openPromiseModal(detectedProverb)}>
  Make Promise
</button>
```

This opens NewPromiseModal with the proverb pre-filled in `connectedProverb`.

**MINIMAL CHANGE** - just add one button, modal handles the rest.

---

## Phase 3: Spellweb Visualization

### What It Does
Visual graph of selected spells/skills on /spells page.

### Step 3.1: Install Graph Library
```bash
npm install react-force-graph-2d
```

Simple, React-native, ~50KB.

### Step 3.2: Create Types
**File:** `src/lib/spellweb/types.ts`

```typescript
export interface SpellwebNode {
  id: string;
  name: string;
  type: 'spell' | 'skill' | 'grimoire';
  emoji?: string;
  val?: number;  // Node size
}

export interface SpellwebLink {
  source: string;
  target: string;
}
```

### Step 3.3: Create Graph Builder
**File:** `src/lib/spellweb/builder.ts`

```typescript
export function buildSpellweb(
  selectedSpellIds: string[],
  selectedSkillIds: string[],
  spellCards: SpellCard[],
  skillFiles: SkillFileMeta[]
): { nodes: SpellwebNode[]; links: SpellwebLink[] } {
  // 1. Create grimoire nodes (story, zero, canon, etc.)
  // 2. Create spell/skill nodes
  // 3. Link spells to their grimoire
  // 4. Link skills to their agent type
}
```

### Step 3.4: Create Component
**File:** `src/components/spellweb/SpellwebViewer.tsx`

```tsx
'use client';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function SpellwebViewer({ selectedSpellIds, selectedSkillIds, spellCards, skillFiles }) {
  const graphData = useMemo(() => buildSpellweb(...), [selectedSpellIds, selectedSkillIds]);

  return (
    <div className="h-[400px] border border-surface/50 rounded-xl overflow-hidden">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeColor={node => node.type === 'grimoire' ? '#6366f1' : '#8b5cf6'}
        // ... config
      />
    </div>
  );
}
```

### Step 3.5: Add to /spells Page
**File:** `src/app/spells/page.tsx`

Add new section between "Dual-Agent Pathway Map" and the sidebar:

```tsx
<section id="spellweb" className="scroll-mt-24 mb-16">
  <h2 className="text-2xl font-semibold text-text mb-4">Your Spellweb</h2>
  <p className="text-text/70 mb-6">
    Visual map of your skill graph. Spells and skills connected by grimoire and agent.
  </p>
  {selectionCount > 0 ? (
    <SpellwebViewer
      selectedSpellIds={[...selectedSpellIds]}
      selectedSkillIds={[...selectedSkillIds]}
      spellCards={spellCards}
      skillFiles={ALL_SKILL_FILES}
    />
  ) : (
    <div className="h-[200px] border border-surface/50 rounded-xl flex items-center justify-center text-text/50">
      Add spells and skills to see your spellweb
    </div>
  )}
</section>
```

---

## Phase 4: Trust Tier Badges

### Step 4.1: Create Tier Logic
**File:** `src/lib/trust/tiers.ts`

```typescript
export type TrustTier = 'blade' | 'light' | 'heavy' | 'dragon';

export function calculateTier(metrics: {
  completedPromises: number;
  studiedActs: number;
}): TrustTier {
  const score = metrics.completedPromises * 3 + metrics.studiedActs;
  if (score >= 500) return 'dragon';
  if (score >= 150) return 'heavy';
  if (score >= 50) return 'light';
  return 'blade';
}
```

### Step 4.2: Create Badge Component
**File:** `src/components/trust/TierBadge.tsx`

```tsx
const TIER_CONFIG = {
  blade: { emoji: '🗡️', label: 'Blade', color: 'text-gray-400' },
  light: { emoji: '⚔️', label: 'Light', color: 'text-blue-400' },
  heavy: { emoji: '🛡️', label: 'Heavy', color: 'text-purple-400' },
  dragon: { emoji: '🐉', label: 'Dragon', color: 'text-amber-400' },
};

export default function TierBadge({ tier, showLabel = true }) {
  const config = TIER_CONFIG[tier];
  return (
    <span className={`inline-flex items-center gap-1 ${config.color}`}>
      <span>{config.emoji}</span>
      {showLabel && <span className="text-sm">{config.label}</span>}
    </span>
  );
}
```

### Step 4.3: Display Locations
- **Ceremony completion** - Show starting tier (Blade)
- **Agent Card** - Display tier badge
- **/spells sidebar** - Show tier with progress

---

## Navigation Updates

Add to navigation (in each page or extract to shared component):

```tsx
<Link href="/ceremony">ceremony</Link>  // or "identity"
<Link href="/promises">promises</Link>
```

---

## localStorage Keys Summary

```typescript
// Existing (unchanged)
'soulbae-session-{taleId}'
'soulbae-chat-{taleId}-{sessionId}'
'soulbae-budget-{taleId}-{sessionId}'
'ap-spellbook-current'

// New - Ceremony
'ap-agent-card'
'ap-private-key'
'ap-ceremony-complete'

// New - Promises
'ap-promises'

// New - Trust
'ap-trust-metrics'
```

---

## Implementation Order

### Week 1: Foundation + Ceremony
- [ ] `npm install @noble/ed25519`
- [ ] Create `src/lib/ceremony/` (keygen, types, storage)
- [ ] Create `src/app/ceremony/page.tsx`
- [ ] Create ceremony step components
- [ ] Test: Complete ceremony → lands on /spells

### Week 2: Promises
- [ ] Create `src/lib/promises/` (types, storage)
- [ ] Create `src/app/promises/page.tsx`
- [ ] Create PromiseBoard, PromiseCard, NewPromiseModal
- [ ] Add "Make Promise" button to MagePanel (light touch)

### Week 3: Spellweb + Trust
- [ ] `npm install react-force-graph-2d`
- [ ] Create `src/lib/spellweb/` (types, builder)
- [ ] Create SpellwebViewer component
- [ ] Add Spellweb section to /spells
- [ ] Create TierBadge component
- [ ] Add tier display to ceremony completion + /spells

### Week 4: Polish
- [ ] Update navigation across pages
- [ ] Mobile testing
- [ ] Add ceremony link to landing page

---

## Design Decisions (Confirmed)

### Ceremony is mandatory for saving spellbooks

**Rationale:** Your unique proverbs and learning path attach to your key profile.

| Action | Requires Ceremony? |
|--------|-------------------|
| Browse spellbooks | No |
| Use Mage chat | No |
| Add spells to skill graph | No |
| **Save spellbook** | **Yes** |
| **Create promises** | **Yes** |
| **Export skill graph** | **Yes** |

### Save Flow (when no ceremony)
```
User clicks "Save spellbook" →
Check hasCompletedCeremony() →
If false: Show modal "Create your Swordsman identity to save" →
User clicks "Begin Ceremony" →
Redirect to /ceremony?returnTo=/spells →
After ceremony completion → Return to /spells →
Spellbook auto-saves with new identity attached
```

### Key Backup
Passphrase-encrypted JSON file download (during ceremony step 5)

---

## File Structure After Implementation

```
src/
├── app/
│   ├── ceremony/
│   │   └── page.tsx           # NEW
│   ├── promises/
│   │   └── page.tsx           # NEW
│   └── spells/
│       └── page.tsx           # UPDATED: Add spellweb section
│
├── components/
│   ├── ceremony/              # NEW
│   │   ├── CeremonyWizard.tsx
│   │   ├── WelcomeStep.tsx
│   │   ├── KeyGenStep.tsx
│   │   ├── PrivacyStep.tsx
│   │   ├── GrimoireStep.tsx
│   │   ├── AgentCardStep.tsx
│   │   └── CompletionStep.tsx
│   ├── promises/              # NEW
│   │   ├── PromiseBoard.tsx
│   │   ├── PromiseCard.tsx
│   │   └── NewPromiseModal.tsx
│   ├── spellweb/              # NEW
│   │   └── SpellwebViewer.tsx
│   ├── trust/                 # NEW
│   │   └── TierBadge.tsx
│   └── MagePanel.tsx          # UNCHANGED (just add one button)
│
├── lib/
│   ├── ceremony/              # NEW
│   │   ├── keygen.ts
│   │   ├── types.ts
│   │   └── storage.ts
│   ├── promises/              # NEW
│   │   ├── types.ts
│   │   └── storage.ts
│   ├── spellweb/              # NEW
│   │   ├── types.ts
│   │   └── builder.ts
│   └── trust/                 # NEW
│       └── tiers.ts
```

---

*MagePanel stays as-is - the sidebar popout interface works perfectly.*
