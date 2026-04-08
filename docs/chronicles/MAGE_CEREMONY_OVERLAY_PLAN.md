# Mage ceremony overlay — plan

**Status:** Phase 1 implemented (layered HUD + Soulbae ring editor).  
**Related:** `docs/SPELLWEB_AGENTPRIVACY_BLADE_BRIDGE.md` (Soulbis / forged blade), `src/components/training/HexagramFlow.tsx` (swordsman stance sheet).

## Intent

Spellweb.ai presents the graph as the **world** and the swordsman HUD as a **separate layer** (floating panels, central “ceremony” glass card, actions like Witness Blade and Send to Soulbis). Agentprivacy should offer a **mage-parallel** experience: same *interaction model* (overlay in front of the site / dual orbs), **different semantics** from the swordsman view—Soulbae, yin ring, weaving/attunement—not blades, witnesses, or Send to Soulbis.

## Design principles

1. **Layered UI** — Backdrop dims the page; primary content sits in a raised surface (not only a bottom sheet), with a **left rail** for controls and a **center ceremony card** as focal chrome.
2. **Mage vocabulary** — Ring, weave, lattice, reflection, Soulbae; violet accents; avoid “blade / witness / forged” as hero nouns here.
3. **Data continuity** — Still edits the same `OrbLoadout.mage` six slots (`saveOrbLoadout`), `buildMergedOrbitingChips()`, and `DualOrbs` sync. No duplicate storage; this is a **presentation** upgrade.
4. **Keyboard** — `M` toggles the overlay (existing global handler in `GlobalLearningSpells`).

## Phase 1 (done)

- Replace the mage-only bottom sheet with **`MageCeremonyOverlay`**: full-viewport-style panel (`z-index` aligned with `HexagramFlow`), backdrop, left column with **MAGE SPELLS (n/6)** and `OrbMageSlots`, center card with weave copy and light Soulbae visual, apply/cancel, Escape to close.
- **`MageOrbitSheet.tsx`** re-exports the new overlay so imports stay stable.

## Phase 2 (optional next)

- **Spellweb parity (optional):** outbound “Send to Soulbae” deep link or `?soulbaeRing=` import (mirror `spellwebBlade` pattern) if spellweb exposes a mage ring export.
- **Attune / crystallized panel:** placeholder panels on the left rail (e.g. “Crystallized rites”, “Witness lattice”) wired to real data when specs exist.
- **Responsive polish:** tighter breakpoints, focus trap, reduced motion.
- **Orb page:** Optional “open ceremony overlay” button that dispatches `agentprivacy:open-mage-orbit` (already used from `/orbs`).

## Files

| File | Role |
|------|------|
| `src/components/training/MageCeremonyOverlay.tsx` | Mage layered overlay UI + loadout state |
| `src/components/training/MageOrbitSheet.tsx` | Re-exports `MageCeremonyOverlay` for existing imports |
| `src/components/training/GlobalLearningSpells.tsx` | Mounts overlay, `M` hotkey |
| `src/components/OrbMageSlots.tsx` | Six mage rows (shared with `/orbs`) |
| `src/lib/orb-loadout.ts` | `mage` slots, `buildMergedOrbitingChips()` |

## Copy reference

- Center card headline: **Weave the ring** (or: Hold the six) — invitation to fill the sixfold Soulbae wheel.
- Left rail: **Soulbae · Mage ceremony**, **MAGE SPELLS (n/6)**.

---

*Last updated: 2026-03-27*
