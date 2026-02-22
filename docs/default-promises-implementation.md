# Default Promises Implementation Guide

## Overview

This document describes the default promises that should be auto-filled for every user's promise tab. These promises are authored by the PrivacyMage and are grounded in:

- **Promise Theory** (Bergstra & Burgess 2019)
- **Privacy is Value V4** equation and its terms
- The core insight: *"Sovereignty is the right to make promises only about your own behavior."*

---

## Theoretical Foundation

### Promise Theory Mapping

| Promise Theory Concept | Implementation |
|------------------------|----------------|
| **Autonomy Axiom** | First Person sovereignty — no agent promises on behalf of another |
| **Irreducible Promise** | The Gap (⿻) — emerges from separation, owned by neither agent |
| **Assessment α(π)** | Compression ratio proves promise kept (70:1+ = strong) |
| **Trust (0-1)** | Trust tiers: Blade → Light → Heavy → Dragon |
| **Invitation vs Attack** | Consent-first architecture vs surveillance extraction |
| **Promise Bundle** | VRC — bilateral commitments with shared compression |

### Privacy Value V4 Terms

Each promise maps to a term in the equation:

```
V(π, t) = P^1.5 · C · Q · S · e^(-λt) · (1 + A(τ)) · (1 + Σ wᵢnᵢ/N₀)^k · R(d) · M(u,y) · Φ(Σ) · T(π)
```

```
🔐^✨ · 🔑 · ✅ · 🌐 · ⏳·🪞 · 🕸️^🌱(📐) · 🎯 · 💰 · ⚖️(⚔️⊥⿻⊥🧙⊥🪞⊥🤝) · 🛤️ 😊
```

---

## Files to Create/Modify

### 1. Already Created: `src/lib/promises/default-promises.ts`

This file now contains 12 promises aligned with Promise Theory and V4.

### 2. Modify: `src/lib/promises/storage.ts`

Add these imports and constants at the top:

```typescript
import { getDefaultPromisesForUser } from './default-promises';

const DEFAULTS_INITIALIZED_KEY = 'ap-promises-defaults-initialized';
```

Add these functions at the bottom:

```typescript
/**
 * Check if default promises from the PrivacyMage have been initialized.
 */
export function hasInitializedDefaults(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DEFAULTS_INITIALIZED_KEY) === 'true';
}

/**
 * Initialize default promises from the PrivacyMage.
 * Only runs once per user (idempotent).
 */
export function initializeDefaultPromises(): void {
  if (typeof window === 'undefined') return;
  if (hasInitializedDefaults()) return;

  const defaults = getDefaultPromisesForUser();
  const now = new Date().toISOString();

  const entries: PromiseEntry[] = defaults.map((p, i) => ({
    ...p,
    id: `privacymage-${i + 1}`,
    createdAt: now,
    updatedAt: now,
  }));

  const existing = getPromises();
  const combined = [...entries, ...existing];
  localStorage.setItem(PROMISES_KEY, JSON.stringify(combined));
  localStorage.setItem(DEFAULTS_INITIALIZED_KEY, 'true');
}

/**
 * Reset default promises (for development/testing).
 * Clears the initialization flag so defaults will be re-added on next init.
 */
export function resetDefaultPromises(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DEFAULTS_INITIALIZED_KEY);
  // Remove all privacymage-prefixed promises
  const list = getPromises().filter((p) => !p.id.startsWith('privacymage-'));
  localStorage.setItem(PROMISES_KEY, JSON.stringify(list));
}
```

---

### 3. Modify: `src/components/promises/PromiseBoard.tsx` (or wherever promises are loaded)

Call `initializeDefaultPromises()` on component mount:

```typescript
import { initializeDefaultPromises } from '@/lib/promises/storage';

// In useEffect or component initialization:
useEffect(() => {
  initializeDefaultPromises();
  // ... rest of initialization
}, []);
```

---

## The 12 Default Promises (V4-Aligned)

| # | Category | Type | V4 Term | Core Concept |
|---|----------|------|---------|--------------|
| 1 | **Autonomy Axiom** | study | Foundation | "I can only promise my own behavior" |
| 2 | **The Gap ⿻** | study | Φ(Σ) | Irreducible promise — where dignity resides |
| 3 | **Four Forces** | study | Σ matrix | Protect, Project → Reflect, Connect emerge |
| 4 | **Three Graphs** | study | Identity | Knowledge × Promise × Trust = First Person |
| 5 | **Edge Value 🛤️** | custom | T(π) | "The equation rewards the dance, not the stance" |
| 6 | **Invitation** | study | Consent | Acceptance BEFORE proposal (vs attack) |
| 7 | **Temporal Memory 🪞** | inscribe | A(τ) | Verified history compounds logarithmically |
| 8 | **VRC Bundle** | contribute | Assessment | Bilateral promises, compression proves kept |
| 9 | **Trust Tiers** | custom | Trust | Blade → Light → Heavy → Dragon |
| 10 | **Secret Language** | custom | Internal | Private cipher between S and M |
| 11 | **7th Capital** | custom | Value | Trajectory > observable surface |
| 12 | **R < 1** | study | R(d) | Perfect reconstruction mathematically impossible |

---

## Key Quotes from Source Documents

### From Promise Theory Reference v1.2:

> "An agent can only make promises about its own behavior. No agent can make a promise on behalf of another agent."
> — Bergstra & Burgess, *Promise Theory* (2019)

> "The Gap is an irreducible promise. It cannot be attributed to any single agent within it, but requires the cooperation of multiple agents."

### From Privacy is Value V4:

> "The equation rewards the dance, not the stance."

> "You are defined by what you promise, not what you contain."

> "The path you take is the path that makes you valuable for the questions you need answered, not necessarily the ones you asked."

> "The trajectory through the lattice is larger than any observable surface."

---

## Design Notes

- **IDs**: Default promises use `privacymage-{n}` prefix to distinguish from user-created promises
- **Idempotent**: `initializeDefaultPromises()` only runs once (checks localStorage flag)
- **Preserves User Data**: Existing promises are kept; defaults are prepended
- **Grimoire Links**: Study/inscribe promises link to relevant spellbooks (story, zero, plurality, society)
- **All Active**: Defaults start as `'active'` status for users to work through
- **V4 Grounded**: Each promise connects to a specific term or concept from the Privacy Value Model V4

---

## Promise Theory Types Used

| Type | Promise Theory Mapping | Usage |
|------|------------------------|-------|
| `study` | Assessment preparation | Understanding concepts before action |
| `inscribe` | Give promise (+b) | Outbound commitment via inscription |
| `contribute` | Coordination promise C(b) | Participation in protocol |
| `custom` | Personal µ-promise | Commitments to self |

---

**⚔️ ⊥ 🧙 | 😊**

*"Agents can only promise their own behavior."*
*"No agent extracts without consent."*
