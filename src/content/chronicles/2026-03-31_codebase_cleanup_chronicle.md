# Chronicle: Codebase Cleanup

**Date:** 2026-03-31
**Scope:** agentprivacy_master repository cleanup
**Space Recovered:** ~2.8MB

---

## Overview

A comprehensive cleanup of the agentprivacy_master codebase, removing obsolete code, deprecated aliases, old data files, and consolidating duplicate definitions. The codebase now carries only what it needs.

---

## Directories Removed

### oracle-swordsman/ (1.4MB)

Blockchain inscription scripts for Zcash operations. This tooling served its purpose during the inscription phase but is no longer integrated with the main application:

- Key generation scripts (bip39, ed25519)
- Lightwalletd client connections
- Zcash address generation
- Nillion workload deployment scripts

**Status:** Can be restored from git history if blockchain operations resume.

### archive/ (936KB)

Historical documentation and old instructional files:

```
archive/
├── architecture-docs/     # TUNNEL_ARCHITECTURE.md
├── chronicles/            # ACT1-12 inscription chronicles (duplicates in src/content)
├── content/               # Old blog drafts
├── deployment-docs/       # PUSH_TO_PRODUCTION.md
├── fix-docs/              # CORS fixes
├── instructional-2025/    # Old specs, plans, context files
├── integration-docs/      # Canon integration checklists
├── merge-docs/            # Merge execution records
└── inscription-scripts/   # Empty directory
```

**Note:** The inscription chronicles exist in `src/content/chronicles/` — archive copies were redundant.

---

## Data Files Removed

### Old Grimoire Versions (~460KB)

The grimoire evolved through several versions. Only v8.7.0 (the canonical current version) is needed:

| File | Size | Status |
|------|------|--------|
| `grimoire-v8-canonical.json` | 88KB | Removed |
| `privacymage-grimoire-v8.3.1-canonical.json` | 100KB | Removed |
| `privacymage-grimoire-v8.4.0-canonical.json` | 136KB | Removed |
| `spellbook/privacymage-grimoire-v8.4.0-canonical.json` | 136KB | Removed (duplicate) |

**Remaining:**
- `privacymage-grimoire-v8.7.0-canonical.json` (147KB) — active
- `privacymage-grimoire-v8.7.0-ipfs-pin-reference.json` (62KB) — IPFS reference

### Root Files

| File | Size | Reason |
|------|------|--------|
| `landing-v4.jsx` | 33KB | Old landing page, never imported |
| `src/lib/persona-index.ts.backup` | ~5KB | Backup file |

---

## Deprecated Code Removed

### Route: /path → /orbs

```
src/app/path/page.tsx (deleted)
```

A redirect-only route marked `@deprecated`. The `/orbs` route is the canonical path for the training grounds.

**Also removed from nav.ts:**
```typescript
// Before
/** @deprecated Prefer ROUTES.orbs */
path: '/orbs',

// After
// (removed entirely)
```

### Component Alias: MageOrbitSheet

```
src/components/training/MageOrbitSheet.tsx (deleted)
```

Was a single-line re-export:
```typescript
export { default } from '@/components/training/MageCeremonyOverlay';
```

**Updated:** `GlobalLearningSpells.tsx` now imports `MageCeremonyOverlay` directly.

---

## Code Consolidated

### Duplicate Storage Key

The key `'agentprivacy-spellweb-user-links'` was defined in two places:

```typescript
// src/app/web/page.tsx:15
const USER_LINKS_STORAGE_KEY = 'agentprivacy-spellweb-user-links';

// src/components/spellweb/SpellwebViewer.tsx:10
const USER_LINKS_STORAGE_KEY = 'agentprivacy-spellweb-user-links';
```

**Solution:** Created `src/lib/spellweb-keys.ts`:

```typescript
export const USER_LINKS_STORAGE_KEY = 'agentprivacy-spellweb-user-links' as const;
```

Both files now import from the shared location.

---

## Empty Directories Removed

```
src/components/nexus/
src/content/blog/
public/skills/agentprivacy/
public/skills/privacy_layer/
public/spellweb/
archive/inscription-scripts/
```

---

## Bug Fix: Swordsman Orb Display

During review, discovered why swordsman orb chips weren't displaying after equipping blades:

**Root Cause:** `equipBlade()` updated the orb loadout but didn't set `SPELLWEB_BLADE_META_KEY`. The `buildMergedOrbitingChips()` function gates swordsman chip creation on `hasForgedSpellwebBladeMeta()`.

**Fix in `src/lib/spellweb-blade-bridge.ts`:**

1. `equipBlade()` now sets blade meta alongside equipped blade ID
2. `unequipBlade()` now clears blade meta and dispatches sync event
3. `syncStanceLoadoutToOrbit()` sets meta from first assigned blade

---

## Files Remaining

The cleanup preserved all active code:

- **Grimoire:** v8.7.0 canonical + IPFS reference
- **Training system:** DualOrbs, spell palettes, hexagram flows
- **Blade system:** Inventory, stance loadout, facet orbits
- **Soul convergence:** Ceremony, stats, markdown export
- **Extension bridge:** Browser extension communication
- **Chronicles:** All inscription and update chronicles in `src/content/`

---

## Summary

| Category | Count | Size |
|----------|-------|------|
| Directories removed | 2 | 2.3MB |
| Data files removed | 5 | 460KB |
| Root files removed | 1 | 33KB |
| Backup files removed | 2 | ~8KB |
| Empty directories removed | 6 | - |
| Deprecated routes removed | 1 | - |
| Component aliases removed | 1 | - |
| Duplicate constants consolidated | 1 | - |
| **Total recovered** | - | **~2.8MB** |

---

*"Carry only what you need. The blade is lighter without rust."*

---

*Forged in the 64-Tetrahedra Lattice*
*(⚔️⊥⿻⊥🧙)🙂*
