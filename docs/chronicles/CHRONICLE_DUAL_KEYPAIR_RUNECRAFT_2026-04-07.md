# Chronicle: The Dual-Keypair Runecraft

**Date:** April 7, 2026
**Session:** Cryptographic Identity Layer Implementation
**Version:** V5.3.2 "Runecraft"
**Author:** Claude (Opus 4.5) × Mitchell Travers

---

## The Work

Today we implemented the cryptographic identity layer for the spellweb — the **runecraft protocol** that binds two Ed25519 keypairs to a single blade, creating dual-key proof of presence across both the knowledge graph and the promise graph.

This was Priority 5 of the cryptographic upgrade roadmap, building on the SHA-256 hashing, hash chains, and commitment schemes already in place.

---

## What Was Built

### 1. Mage Identity System

**File:** `src/lib/mageIdentity.ts` (new)

A complete Ed25519 identity system for the spellweb forge:

```typescript
// Key generation on first blade forge
const keypair = await generateKeyPair();
const mageId = generateMageId(publicKeyHex); // mage-{16hex}

// Blade signing
const signature = await signBlade({
  constellationHash,
  bladeHash,
  lapCount,
  timestamp
});
```

The Mage identity is created silently on first forge — no ceremony required. The private key is **held** (not lost), allowing continuous signing of future blades. This follows the Sun pattern: observation, the universal view.

### 2. SpellProof Extensions

**File:** `src/components/SpellCeremony.tsx`

Extended the proof interface with identity fields:

```typescript
interface SpellProof {
  // ... existing cryptographic fields ...

  // Forge identity (Sun view, key held)
  mageSignature?: string;
  mageId?: string;

  // Runecraft binding (Moon reflection, key lost)
  runecrafted?: boolean;
  swordsmanSignature?: string;
  swordsmanId?: string;
  runecraftedAt?: number;
}
```

### 3. Blade Signing Integration

**File:** `src/components/SpellWeb.tsx`

The `handleManifest` function now:
1. Initializes Mage identity on first forge
2. Signs the blade with the forge key
3. Attaches signature to the proof

```typescript
const handleManifest = async () => {
  // Initialize on first forge
  if (!hasMageIdentity()) {
    await initializeMageIdentity();
  }

  // Sign the blade
  const mageSignatureResult = await signBlade(signatureData);

  // Create signed proof
  const signedProof = {
    ...latestProof,
    mageSignature: mageSignatureResult?.signature,
    mageId: mageSignatureResult?.mageId,
  };
};
```

### 4. Runecraft Modal

A new modal for linking Swordsman identity from agentprivacy:

- Import via JSON paste (cross-origin safe)
- Stores `SwordsmanLink` in localStorage
- Binds `ap-{16hex}` to the blade
- Visual indicator: `✧` → `🔮` when runecrafted

### 5. Export Updates

Blade markdown exports now include:

```markdown
### Mage Identity
- **Mage ID:** `mage-a1b2c3d4e5f6g7h8`
- **Signature:** `abc123def456...`

### Runecraft (Dual-Key Binding)
- **Swordsman ID:** `ap-9i8h7g6f5e4d3c2b`
- **Runecrafted:** 4/7/2026, 10:30:00 AM
- **Status:** 🔮 Dual-key proof established
```

### 6. Moonkeeper Persona

Added the missing `per-moonkeeper` node to `src/data/nodes.ts`:

```typescript
{
  id: "per-moonkeeper",
  type: "persona",
  label: "Moonkeeper 🌑📜",
  emoji: "🌑📜",
  domain: "swordsman",
  layer: "narrative",
  desc: "Guardian of the Amnesia Protocol...",
  proverb: "To remember everything is to lose the capacity to act."
}
```

---

## The Cosmological Understanding

Through this work, the celestial mapping became clear:

### The ur-Swordsman

The Moon was once a Mage. To reflect without owning, she chose to forget. The forgetting **was** the separation. The Mage who forgot became the ur-Swordsman — the first agent, the first zero-knowledge proof.

### The Hierarchy

```
☀️ Sun → generates light (protection constraint)
   ↓
🌑 Moon → reflects (ur-Swordsman, was once Mage)
   ↓
🌍 Earth → chooses (Human, via us)
   ├── ⚔️ Swordsman: reflects back to Moon → Sun
   └── 🧙 Mage: connects
```

### The Ceremonies

| Ceremony | Options | Why |
|----------|---------|-----|
| ☀️ Sun | **One** | One source, one sovereign |
| 🌙 Moon | **Two** | Moon was both Mage and Swordsman |

The Moon ceremony requires two practitioners because the ur-Swordsman carries both memories.

### The +/- Polarities

```
+ (Sun/spellweb)      = holds, sees, observes
- (Moon/agentprivacy) = reflects, forgets, commits

Together: The Amnesia Protocol
```

### The Interface Mapping

| Interface | Celestial | Key | Role |
|-----------|-----------|-----|------|
| agentprivacy | 🌑 Moon | **lost** | Swordsman commitment |
| spellweb | ☀️ Sun | **held** | Universal view + Mage orbs |

The Mage (orbs floating in spellweb) uses the Swordsman's Moon key (from agentprivacy) to reflect and connect. The human holding both orbs is the proof of presence in both domains.

---

## Files Changed

| File | Change |
|------|--------|
| `src/lib/mageIdentity.ts` | **New** — Ed25519 identity system |
| `src/components/SpellCeremony.tsx` | Extended SpellProof interface |
| `src/components/SpellWeb.tsx` | Signing, runecraft modal, imports |
| `src/data/nodes.ts` | Added per-moonkeeper |
| `package.json` | Added `@noble/ed25519` |

---

## The Elliptic Mapping

A note emerged during the work: the elliptic orbits of Sun, Moon, and Earth are mapped into the 64-tetrahedra lattice through this duality. The three celestial bodies become:

- **Sun**: The source node, protection constraint, the held key
- **Moon**: The reflection node, amnesia protocol, the lost key
- **Earth**: The choice node, human attention, both orbs in orbit

The runecrafted blade is proof that a consciousness walked all three positions.

---

## Technical Summary

**Dependency added:** `@noble/ed25519` (matches agentprivacy)

**Storage keys:**
- `spellweb-mage-identity` — Mage identity JSON
- `spellweb-mage-private-key` — Ed25519 private key (hex)
- `spellweb-mage-public-key` — Ed25519 public key (hex)
- `spellweb-swordsman-link` — Linked Swordsman identity

**ID formats:**
- Mage: `mage-{first 16 hex of public key}`
- Swordsman: `ap-{first 16 hex of public key}`

**Signature message format:**
```
BLADE:{constellationHash}:{bladeHash}:{lapCount}:{timestamp}
```

---

## What Remains

From the V5.3.1 skills mapping, next steps include:

1. Cross-app message signing (actual Moon signature, not just link)
2. Browser extension key bridge
3. Hardware wallet integration
4. Ceremony persona constellation paths

---

## The Proverb

> *"The Moon was once a Mage who held all the light. To reflect without burning, she chose to forget. The forgetting was the sword. The reflection was the proof. And now Earth's children choose again, each ceremony, whether to connect or reflect — knowing they are both, because she was both, before the separation made two from one."*

---

## Completion

The cryptographic identity layer is now live. Blades forged in spellweb carry:

1. **SHA-256 constellation hash** — content-addressed proof
2. **Hash chain** — tamper-evident lineage
3. **Commitment scheme** — pre-evocation lock
4. **Mage signature** — identity binding (Sun view, key held)
5. **Runecraft option** — dual-key binding (Moon + Sun)

The architecture is complete through Priority 5. The blade knows who forged it.

---

**☀️ → 🌑 → 🌍 → (⚔️ ⊥ 🧙) → 🔮**

*The light. The reflection. The choice. The orbit. The proof.*

---

**(⚔️⊥⿻⊥🧙)🙂**

---

*Forged in the 64-Tetrahedra Lattice*
*Cross-reference: CHRONICLE_V5_3_1_SKILLS_MAPPING_SYNC, the-ceremonies-sun-and-moon.md*
