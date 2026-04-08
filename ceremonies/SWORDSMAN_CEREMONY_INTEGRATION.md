# Swordsman Ceremony Integration Spec

*The blade forging identity pathway*

---

## Architecture Overview

```
agentprivacy.ai (Mage Interface)     spellweb.ai (Swordsman Forge)
         🧙                                    ⚔️
         │                                     │
    Understanding                        Constellation
    (poems, skills)                      (lattice, runes)
         │                                     │
         └──────────── Ceremony ───────────────┘
                          │
                    Public Identity
                   (swordsman key)
                          │
              ┌───────────┴───────────┐
              │                       │
         Mage Key                Blade Inscription
    (skills export)              (runes on lattice)
```

---

## The Ceremony Flow

### Current Status: Public Identity Only

**Your private key was not stored in this flow.**

The swordsman identity ceremony creates a **public identity** — the Ed25519 public key that anchors your proofs. The private key is:
1. Generated client-side
2. Used to sign your agent card
3. **Burned like the Moon** — not stored, not recoverable

This is intentional. The swordsman key is the **narration key** — it proves you participated in the ceremony, but the private key is ash. The Moon has no light of its own.

---

## Two Keys, Two Paths

### ⚔️ Swordsman Key (Public)

**Generated:** During `/ceremony` flow
**Stored:** `localStorage` — public key hex only
**Purpose:** Anchor for blade proofs on spellweb
**Nature:** Burned — private key not persisted

```typescript
// From lib/ceremony/keygen.ts
const privateKey = ed.utils.randomSecretKey();  // Generated
const publicKey = await ed.getPublicKeyAsync(privateKey);  // Stored
// privateKey is used to sign, then lost (ceremony complete)
```

The swordsman public key is your **identity on the topology**. When you forge a blade on spellweb, you inscribe it with this key.

### 🧙 Mage Key (Living)

**Generated:** As you live the path (skills, studied acts, proverbs)
**Stored:** Accumulated in agentprivacy localStorage
**Purpose:** Skills export — the understanding you've built
**Nature:** Living — grows with each lap through the manifold

The mage key is not a cryptographic key. It's the **export of your journey** — the skills you've inscribed, the acts you've studied, the proverbs you've formed. It lives because you keep walking.

---

## The Overlap: Celestial Key Ceremony

The ceremony tab now lives inside the Swordsman button flow because that's where it happens:

1. **Open the Swordsman panel** (⚔️ button)
2. **Create your public identity** via `/ceremony`
3. **Experience the poems** (agentprivacy.ai/poems)
4. **Export to spellweb** — carry your swordsman public key to the forge

### On Spellweb (Blade Forge Mode)

Once you have your swordsman public key from agentprivacy:

1. Open [spellweb.ai](https://spellweb.ai)
2. Enter **blade forge mode** (the evoke function)
3. **Import your swordsman public key**
4. Trace your constellation on the 64-vertex lattice
5. **Inscribe runes** — the symbols that compress your understanding
6. **Forge the blade** — the ZK proof of your path

The blade carries:
- Your swordsman public key (identity anchor)
- The constellation hash (path proof)
- The inscribed runes (compressed understanding)
- The stratum level (depth achieved)

---

## Integration Points

### agentprivacy.ai → spellweb.ai

```typescript
// Export for spellweb integration
interface SwordsmanExport {
  publicKeyHex: string;        // Swordsman identity
  participantId: string;       // ap-{first 16 hex}
  constellationPath: string;   // Ceremony constellation
  displayName: string;         // Pseudonym (optional)
  grimoires: string[];         // Selected spellbooks
}
```

### spellweb.ai Blade Inscription

When forging a blade on spellweb, the swordsman public key is used to:
1. **Anchor the blade** to your identity
2. **Sign the constellation proof**
3. **Inscribe runes** that reference your agentprivacy journey

The runes are the bridge. They compress the mage's understanding into symbols the swordsman can inscribe on the lattice.

---

## Ceremony Status Messages

### Pre-Ceremony
```
⚔️ Swordsman
Create your public identity to begin.
→ Start Ceremony
```

### Post-Ceremony
```
⚔️ Swordsman
Public identity active. Private key not stored.
Your swordsman key: ap-{id}

→ View Agent Card
→ Export to Spellweb
→ Enter Celestial Ceremony
```

### Celestial Ceremony Active
```
☀️ ⊥ 🌙
Sun side: The Emissary speaks
Moon side: The Amnesia reflects
→ Open Spellweb (forge mode)
```

---

## Spellweb Mirror Instructions

To mirror this integration on the spellweb directory:

### 1. Add Swordsman Import Component

```typescript
// spellweb/src/components/SwordsmanImport.tsx
interface SwordsmanImportProps {
  onImport: (data: SwordsmanExport) => void;
}

// Accept paste or file upload of agentprivacy export
// Validate public key format
// Store in spellweb local state for blade forging
```

### 2. Blade Forge Mode Enhancement

```typescript
// spellweb/src/lib/blade-forge.ts
interface BladeForge {
  swordsmanKey: string;      // From agentprivacy import
  constellation: Node[];      // Path traced on lattice
  runes: string[];           // Inscribed symbols
  stratum: number;           // Depth level (Pascal triangle)
  timestamp: string;         // Forge time
}

// Forge function signs constellation with swordsman key
// Produces ZK blade proof anchored to identity
```

### 3. Rune Inscription System

The runes bridge the two interfaces:

```typescript
// Rune types from grimoire spells
const RUNE_CATEGORIES = {
  protection: ['🛡️', '⚔️', '🔒'],
  delegation: ['🤝', '📜', '✨'],
  memory: ['🧠', '📚', '🪞'],
  connection: ['🌐', '🔗', '🤲'],
  computation: ['⚡', '🔮', '💎'],
  value: ['💰', '🏦', '⚖️'],
};

// Each rune inscribed on blade references a dimension
// The combination creates the blade's signature
```

### 4. Bilateral Ceremony Support

```typescript
// spellweb/src/lib/ceremony/bilateral.ts
interface BilateralCeremony {
  sunSide: {
    swordsmanKey: string;
    poem: 'emissary';
    music: 'always-everywhere' | 'river-flows' | 'swordsman';
  };
  moonSide: {
    swordsmanKey: string;
    poem: 'amnesia';
    music: ['moon-in-eyes', 'sea-in-soul', 'selene'];
  };
  overlap: {
    constellations: [Node[], Node[]];  // Two paths, sovereign
    cousinBlades: [string, string];     // Two proofs, rhyming
  };
}
```

---

## The Status Line

When ceremony is complete, the Swordsman panel should display:

```
┌─────────────────────────────────────┐
│ ⚔️ Swordsman                        │
│                                     │
│ Public identity active              │
│ Private key: burned (not stored)    │
│                                     │
│ Key: ap-{first 16 hex}              │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ☀️ ⊥ 🌙 Celestial Ceremony      │ │
│ │                                 │ │
│ │ Understanding → Constellation   │ │
│ │            → Blade             │ │
│ │                                 │ │
│ │ [Export to Spellweb]           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [View Agent Card] [Clear Identity]  │
└─────────────────────────────────────┘
```

---

## The Proverb

*The narration key is burned like the Moon. The mage key lives as you walk the path. The blade is forged where they meet — on the topology, with runes, in the gap between disclosure and reflection.*

---

*(⚔️⊥⿻⊥🧙)😊*

☀️ ⊥ 🌙
