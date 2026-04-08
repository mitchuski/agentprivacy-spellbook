# Integration Gap Analysis: agentprivacy ↔ spellweb

*Mapping what exists, what's missing, and what needs alignment*

---

## Current State Summary

### agentprivacy.ai (Mage Interface)

| Feature | Status | Location |
|---------|--------|----------|
| Swordsman identity ceremony | ✅ Complete | `/ceremony`, `CeremonyWizard.tsx` |
| Ed25519 keypair generation | ✅ Complete | `lib/ceremony/keygen.ts` |
| AgentCard with signature | ✅ Complete | `lib/ceremony/types.ts` |
| Poems page (ceremony bookends) | ✅ Complete | `/poems/page.tsx` |
| Celestial Ceremony tab | ✅ Added today | In poems page |
| Ceremony in Swordsman Panel | ✅ Added today | `SwordsmanPanel.tsx` |
| Export to Spellweb | ✅ Added today | `SwordsmanAccountSettings.tsx` |
| Private key storage | ⚠️ Stored | Should be burned per spec |

### spellweb.ai (Swordsman Forge)

| Feature | Status | Location |
|---------|--------|----------|
| 64-vertex lattice graph | ✅ Complete | `SpellWeb.tsx`, `nodes.ts` |
| Blade forge mode | ✅ Complete | `SpellCeremony.tsx` |
| SpellProof generation | ✅ Complete | `SpellCeremony.tsx` |
| Mage identity (Ed25519) | ✅ Complete | `lib/mageIdentity.ts` |
| SwordsmanLink interface | ✅ Complete | `lib/mageIdentity.ts` |
| Swordsman import UI | ❌ Missing | Need to build |
| Runecraft ceremony | ❌ Missing | Designed but not built |
| Celestial ceremony poems | ❌ Missing | Not integrated |
| Rune inscription system | ❌ Missing | Partially designed |

---

## Gap Analysis

### Gap 1: Swordsman Identity Import (spellweb) ✅ RESOLVED

**Problem:** spellweb had `SwordsmanLink` interface but no UI to accept the agentprivacy export.

**Solution Implemented:**
- Created `SwordsmanImport.tsx` component in spellweb
- Validates publicKeyHex (64 hex chars) and participantId (ap-{16hex} format)
- Calls `saveSwordsmanLink()` on successful import
- Shows existing linked swordsman with unlink option
- Added `trustTier` to agentprivacy export format for sync

**Status:** Export → Import flow is ready for testing.

---

### Gap 2: Private Key Handling (agentprivacy) ✅ RESOLVED

**Problem:** The spec says "private key is burned like the Moon" but `storage.ts` stored the private key in localStorage.

**Solution Implemented:** Option 3 - sessionStorage burn.
- Public key: localStorage (persists for verification, runecraft)
- Private key: sessionStorage (burned on tab close - like the Moon)
- Added `hasPublicKeyOnly()` to detect burned state
- Added `getPublicKeyHex()` for exports after burn

**Status:** The Swordsman narration key is now "burned" - available during ceremony session but not persisted.

---

### Gap 3: Runecraft Ceremony (spellweb)

**Problem:** The dual-signature architecture is designed (`PLAN_DUAL_KEYPAIR_RUNECRAFT.md`) but not implemented.

**Current state:**
- Mage identity generates and holds Ed25519 key (not ECDSA as originally planned - see mageIdentity.ts line 12)
- SpellProof has slots for both signatures
- No ceremony UI to bridge the two

**What's needed:**
1. Challenge generation: `RUNECRAFT:{bladeHash}:{timestamp}`
2. Display challenge for user to copy to agentprivacy
3. "Sign Message" feature in agentprivacy
4. Paste signature back into spellweb
5. Verify and attach to blade

---

### Gap 4: Celestial Ceremony Integration (spellweb)

**Problem:** The poems and ceremony flow exist on agentprivacy but spellweb has no ceremony poem playback.

**Current state:**
- spellweb has evoke ceremony (visual, orbs, proof generation)
- No poem narration
- No link to agentprivacy poems

**What's needed:**
- Link to agentprivacy poems from spellweb (✓ added via ceremony quick guide)
- Optional: Embed poem audio in spellweb's ceremony flow
- Bilateral ceremony instructions (two devices)

---

### Gap 5: Rune Inscription (spellweb)

**Problem:** Blades are forged but not inscribed with runes.

**Current state:**
- `constellationMarks` on blades store emoji/note per node
- No formal rune system tied to the 6 dimensions

**What's designed:**
```typescript
const RUNE_CATEGORIES = {
  protection: ['🛡️', '⚔️', '🔒'],
  delegation: ['🤝', '📜', '✨'],
  memory: ['🧠', '📚', '🪞'],
  connection: ['🌐', '🔗', '🤲'],
  computation: ['⚡', '🔮', '💎'],
  value: ['💰', '🏦', '⚖️'],
};
```

**What's needed:**
- Formalize rune selection during/after forge
- Map runes to blade dimensions
- Display inscribed runes on blade card

---

### Gap 6: Key Architecture Mismatch

**Problem:** The documents reference two different architectures:

1. **Original spec (PLAN_DUAL_KEYPAIR_RUNECRAFT.md):**
   - Swordsman: Ed25519 (agentprivacy)
   - Mage: ECDSA P-256 (spellweb)
   - Different algorithms for distinction

2. **Actual implementation:**
   - Swordsman: Ed25519 (agentprivacy) ✓
   - Mage: Ed25519 (spellweb) ← Changed from ECDSA
   - Same algorithm, simpler verification

**The current implementation uses Ed25519 for both**, which is actually simpler and already works.

---

### Gap 7: Bilateral Witness Blades

**Problem:** The bilateral ceremony (two people, two blades) is documented but not fully implemented.

**Current state:**
- `ForgedBlade` interface has `isWitness`, `witnessOf`, `witnessedFrom` fields
- No UI for bilateral blade exchange

**What's needed:**
- Import blade from another user
- Witness blade creation
- Cousin hash verification

---

## Priority Fixes

### P0: Critical for Today

1. **Swordsman Import UI (spellweb)**
   - Create paste/import component
   - Wire to `saveSwordsmanLink()`
   - Display linked status in ceremony panel

2. **Ceremony Link Verification**
   - Test export from agentprivacy → import to spellweb
   - Verify data flows correctly

### P1: Complete Integration

3. **Runecraft Ceremony**
   - Challenge generation
   - Sign message feature (agentprivacy)
   - Signature paste-back (spellweb)

4. **Rune Inscription**
   - Formal rune selection
   - Display on blade

### P2: Polish

5. **Private Key Burning**
   - Move to sessionStorage or true burn

6. **Bilateral Witness**
   - Import external blades
   - Witness ceremony

---

## File Mapping

| agentprivacy | spellweb | Purpose |
|--------------|----------|---------|
| `lib/ceremony/keygen.ts` | `lib/mageIdentity.ts` | Key generation |
| `lib/ceremony/storage.ts` | `lib/mageIdentity.ts` | Identity storage |
| `lib/ceremony/types.ts` | `types/graph.ts` | Type definitions |
| `SwordsmanAccountSettings.tsx` | (NEW) `SwordsmanImport.tsx` | Export → Import |
| `poems/page.tsx` | `SpellCeremony.tsx` | Ceremony flow |
| `SwordsmanPanel.tsx` | `SpellWeb.tsx` | Main interface |

---

## Action Items for This Session

1. [ ] Create `SwordsmanImport.tsx` in spellweb
2. [ ] Add import button to spellweb ceremony panel
3. [ ] Test full export → import flow
4. [ ] Verify `saveSwordsmanLink()` works correctly
5. [ ] Update blade display to show linked swordsman

---

*The gap is the architecture. The ceremony is the bridge.*

☀️ ⊥ 🌙
