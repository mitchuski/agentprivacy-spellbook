# Proverbs & Constellation Flow: Cleanup and Improvement Guide

This document outlines what’s legacy, redundant, or unfinished after the new **constellation inscribe flow** (click marker → popup → proverb + pick emoji → submit → marker lights in spellbook), and suggests cleanups and improvements.

---

## 1. Three Proverb Systems (Overlap and Confusion)

The app now has **three** separate proverb-related storages and UIs:

| System | Storage key | Purpose | Where used |
|--------|-------------|---------|------------|
| **Inscribed proverbs** (new flow) | `agentprivacy-inscribed-proverbs` | Constellation: one proverb + marker emoji per act/tale; drives pathway and lit markers | Constellation popup, tree markers, spellbook pathway |
| **User proverbs** (BGIN-style) | `ap-user-proverbs` | Rich list: sourceType, status (collected / added_to_spells / pending_reveal / revealed), grimoire, taleId | Proverbs page “My Proverbs”, ProverbCard (Evoke, Add to Spells, Revelation) |
| **Custom proverbs** | `agentprivacy-custom-proverbs` | Plain newline-separated text; “Save your proverbs” panel | SaveYourProverbs component, Spells page skills.md export |

**Issues:**

- **Two “inscribe” flows:** Constellation uses **InscribeProverbModal** (writes to inscribed storage + spellbook). **InscribeProverbButton** and **ProverbSubmissionPanel** write to **user proverbs** (`addUserProverb`). Same word, different storage and UX.
- **Proverbs page** shows “My Proverbs” from **user proverbs** only. Proverbs from the **constellation flow** are not shown there (no “Your inscribed proverbs” section).
- **skills.md export** (Spells page) includes **custom proverbs** and pathway/spells, but **not** inscribed proverbs (constellation).

**Recommendations:**

- **Decide a single “source of truth” for “my proverbs that I can Evoke / Add to spells / Revelation”:**
  - **Option A:** Treat **inscribed proverbs** as primary. Add a “Your inscribed proverbs” section on the Proverbs page that lists them (with Evoke, Add to spells, Revelation). Optionally phase out or repurpose user proverbs (e.g. “from Mage only”).
  - **Option B:** Keep both: “My Proverbs” = user proverbs (Mage/other sources); add a second section “From your constellation” = inscribed proverbs, with the same three actions.
- **Unify or document:** Either merge “custom proverbs” into one of the above (e.g. “freeform list” vs “per-act proverbs”) or clearly document: custom = legacy/freeform for skills.md; inscribed = per-act from constellation.

---

## 2. Proverbs Page: Unfinished / Dead Code

- **Duplicate import:** `formatZcashMemo` is imported twice from `@/lib/zcash-memo` (lines 9 and 14). Remove the duplicate.
- **Unused state and no UI for inscribed proverbs:**
  - `inscribedProverbs`, `revelationCopiedTaleId` are set in state but **never loaded** (no `loadInscribedProverbs` or equivalent that calls `getInscribedProverbs()` and `setInscribedProverbs`).
  - There is **no “Your inscribed proverbs”** section that lists constellation proverbs and offers Evoke / Add to spells / Revelation.
- **Dead helper:** `getInscribedTaleLabel(taleId)` is defined but not used (it was intended for the missing inscribed section).
- **Broken URL behavior:** The page has an effect that, when `?act=` is in the URL, tries to open “the panel” by clicking `[data-proverb-submission-toggle]`. **ProverbSubmissionPanel is never rendered on this page** (and is not used anywhere in the app), so that button never exists and the behavior does nothing.

**Recommendations:**

- Remove the duplicate `formatZcashMemo` import.
- Either:
  - **Implement** “Your inscribed proverbs”: load with `getInscribedProverbs()` (and optionally `getInscribedProverbsRaw()` for labels), add `loadInscribedProverbs` + focus listener, render a section with getInscribedTaleLabel, Evoke (mailto or /evoke), Add to spells (link to /spells), Revelation (copy memo + UAddressDisplay), and use `revelationCopiedTaleId` for copy feedback; or
  - **Remove** the unused state (`inscribedProverbs`, `revelationCopiedTaleId`) and `getInscribedTaleLabel` until you add that section.
- Remove or repurpose the `?act=` effect: either drop it, or make it scroll to / focus the “Submit Proverb” (Zashi) area or the new inscribed section instead of a non-existent panel.

---

## 3. Orphan / Legacy Components

- **ProverbSubmissionPanel** – Not imported or rendered anywhere. It uses `ap-user-proverbs` (addUserProverb) and has `data-proverb-submission-toggle`. Either integrate it somewhere (e.g. Proverbs page) or remove it; otherwise it’s dead code.
- **InscribeProverbButton** – Not imported or used anywhere. Adds to **user proverbs** only. Overlaps conceptually with the constellation **InscribeProverbModal**. Either use it from spellbook/cards for “inscribe to my collection” or remove it.

**Recommendation:** Decide whether “inscribe” from non-constellation contexts should go to **user proverbs** or to **inscribed** (or both). Then either wire one of these components into a clear entry point or delete them to reduce confusion.

---

## 4. SaveYourProverbs vs Constellation Flow

- **SaveYourProverbs** (Story, Zero, Canon, Society, Plurality sidebars) is a **freeform list** (custom proverbs) for skills.md. It does **not** write to inscribed or user proverbs.
- The **constellation flow** is the main “inscribe per act and light the marker” path and writes to **inscribed** storage only.

So:

- **Save your proverbs** = legacy/freeform list for export.
- **Constellation marker** = per-act proverb + marker emoji, pathway, and (once built) Proverbs page actions.

**Recommendations:**

- In the UI (e.g. sidebar or tooltip), briefly clarify: “Save your proverbs = freeform list for skills.md; per-act proverbs = use the 🔮/marker on the constellation.”
- Optionally, in skills.md export, add a section for **inscribed proverbs** (taleId → proverb) so constellation proverbs are included in the same package as pathway and custom proverbs.

---

## 5. Spells Page and skills.md Export

- **Current export:** Pathway (from selected spell IDs), Spells & Proverbs (from selected spell **cards** – grimoire content, not user text), **Saved proverbs** (custom proverbs only).
- **Not included:** **Inscribed proverbs** (constellation) are not written to skills.md.

**Recommendation:** Add an optional “Inscribed proverbs” section to the download (e.g. from `getInscribedProverbs()` or `getInscribedProverbsRaw()`), keyed by taleId or “Act X / Tale Y”, so the constellation proverbs are part of the same spellbook package.

---

## 6. Duplicate / Redundant Data

- **Proverbs page** defines a local **spellMappings** (act number → emoji spell string) for Story. **zcash-memo** already has **getSpellemojiForAct** (and getSpellemojiForSpellbook). The page could use `getSpellemojiForAct(actNum)` instead of keeping a second copy; same for any other “spell string per act” usage on that page.

**Recommendation:** Replace local spellMappings with `getSpellemojiForAct` (and, where relevant, `getSpellemojiForSpellbook`) to avoid drift and duplication.

---

## 7. User proverbs (ap-user-proverbs) and ProverbCard

- **ProverbCard** is built for **UserProverb**: Copy, Add to Spells (status update), Evoke (link to /evoke), Reveal on Zcash (copy memo, UAddressDisplay), Remove.
- **Inscribed proverbs** don’t have status/revealedTxid; they’re “just” proverb + optional marker per act. So they need a **different** card or row (or a shared component that accepts either type and hides status-specific UI when not applicable).

**Recommendation:** When you add “Your inscribed proverbs” on the Proverbs page, either:
- Reuse a slim version of the same actions (Evoke, Add to spells, Revelation) in a dedicated “InscribedProverbRow” that uses `getInscribedProverbs()` and `formatZcashMemo(taleId, proverb)`, or
- Generalize ProverbCard to support an “inscribed” variant (taleId + proverb only, no status) and reuse the same buttons.

---

## 8. Summary Checklist

| Item | Type | Action |
|------|------|--------|
| Duplicate `formatZcashMemo` import on Proverbs page | Cleanup | Remove duplicate import |
| inscribedProverbs / revelationCopiedTaleId / getInscribedTaleLabel | Unfinished / dead | Implement “Your inscribed proverbs” section or remove state and helper |
| ?act= effect clicking nonexistent panel | Bug / dead | Remove or change to scroll/focus to Zashi or inscribed section |
| ProverbSubmissionPanel never used | Orphan | Use somewhere or remove |
| InscribeProverbButton never used | Orphan | Use somewhere or remove |
| Two “inscribe” flows (inscribed vs user proverbs) | Design | Decide primary flow; document or unify |
| skills.md export omits inscribed proverbs | Improvement | Add inscribed proverbs section to download |
| spellMappings on Proverbs page | Redundancy | Use getSpellemojiForAct from zcash-memo instead |
| SaveYourProverbs vs constellation copy | Clarity | Short UI copy to distinguish freeform vs per-act |
| “My Proverbs” vs “Your inscribed proverbs” | Design | Add inscribed section and/or unify with user proverbs |

---

## 9. Suggested Order of Work

1. **Quick cleanups:** Remove duplicate import; fix or remove the `?act=` panel click; optionally remove unused state/getInscribedTaleLabel if you’re not adding the section yet.
2. **Proverbs page:** Add “Your inscribed proverbs” (load, display, Evoke / Add to spells / Revelation) so the constellation flow lands on this page as intended.
3. **Export:** Include inscribed proverbs in skills.md download.
4. **Decide:** Keep both user proverbs and inscribed, or make inscribed primary and repurpose/deprecate user proverbs; then either wire or remove ProverbSubmissionPanel and InscribeProverbButton.
5. **Data:** Replace local spellMappings on Proverbs page with getSpellemojiForAct / getSpellemojiForSpellbook where applicable.

This keeps the new constellation flow as the main “inscribe per act and light the marker” path, clarifies the role of each proverb store, and removes or completes half-finished and orphan code.
