# Mobile Compatibility Chronicle

**Date:** 2026-04-08
**Status:** Pending Implementation

---

## Summary

The mobile navigation menu (hamburger menu) has grown too long with all navigation items displayed in a flat list. This chronicle documents the planned restructuring to improve mobile UX.

---

## Current State

The mobile menu displays all navigation links in a single flat list:
- ceremony, story, zero, canon, society, plural, proverbs, evoke, poems, mage, promise, spells, web, orbs

This creates excessive scrolling on mobile devices.

---

## Proposed Solution

Split the mobile menu into **two collapsible sub-sections**:

### 1. Narrative Section
Items related to the story/spellbook experience:
- ceremony (soulbis)
- story, zero, canon, society, plural
- proverbs, spells
- promise, web, orbs

### 2. Knowledge Section
Items related to interaction and learning:
- evoke
- poems
- mage (Soulbae panel)

---

## Implementation Notes

The `AppNav.tsx` component handles mobile menu rendering. Changes needed:

1. Add `narrativeOpen` and `knowledgeOpen` state
2. Filter `NAV_LINKS` into two arrays by key
3. Replace flat list with two collapsible `<AnimatePresence>` sections
4. Each section has a toggle button showing section name and +/- indicator

---

## Related Work Completed This Session

- EvokeModal created with Reflect and Connect options
- Proverbs page updated with Evoke button that opens modal
- MagePanel and ProverbCard updated to use EvokeModal
- Proverb storage extended with `reflection`, `connectedTo`, `connectedTaleId` fields

---

## Files to Modify

- `src/components/AppNav.tsx` - Mobile menu restructure
- `src/lib/nav.ts` - No changes needed (existing NAV_LINKS suffice)

---

## Priority

Medium - Improves mobile UX but site remains functional without it.
