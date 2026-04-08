# Chronicle — Observation of unpushed work (post `7b64b17`)

**Recorded:** 2026-03-29  
**Baseline:** Last push to `origin/main` is commit `7b64b17` — *Landing hero manifold, soul orb, acts 25–26, skills & grimoire v8.7*.  
**Current:** `main` matches `origin/main` at that commit; **all items below are local-only** (uncommitted or untracked).

---

## Summary

The tree layers three themes on top of the shipped landing/story/grimoire work: **(1)** canonical grimoire alignment for Acts XXV–XXVI and IPFS discoverability, **(2)** a **training grounds** loop on the home page with progress persisted in the browser, and **(3)** a **Path** route plus **browser-extension** bridge UI and packaged zips—moving from “read the spellbook” to “earn the path to carry tools off-site.”

---

## 1. Grimoire, spells, personas

- **`src/data/privacymage-grimoire-v8.7.0-canonical.json`** — Story acts now include the full First Person arc through **Act XXV (Dragon’s Hide)** and **Act XXVI (Master and Emissary)** (merged with the canonical IPFS document), with `status` bumped to **8.7.0** semantics (26 acts, inscription counts).
- **`src/lib/grimoire-baked.ts`** — **`FIRST_PERSON_ACT_PERSONA_HINTS`** maps Acts XXV/XXVI to persona template ids (e.g. netkeeper, herald, holonic-architect, architect, kyra, soulbis/soulbae) for display on `/spells`.
- **`src/lib/spellbook-templates.ts`** — Holonic Architect gains Act XXV; Architect and Kyra use a **balanced + mesh + hemisphere** spell list; comments tie templates to the new acts.
- **`src/lib/grimoire-ipfs.ts`** *(new)* — Single **`PRIVACYMAGE_GRIMOIRE_IPFS_URL`** for the v8.7.0 Pinata CID.
- **`src/app/spells/page.tsx`** — Imports that URL for Open/Copy; shows persona hints where defined.
- **`src/lib/spellbook-fetcher.ts`** — Fetches from the same canonical URL (replacing the older CID).

---

## 2. Training grounds (landing)

- **`src/app/page.tsx`** — `IntersectionObserver` records section visits (`hero`, `thesis`, `features`, `spellbooks`, `your-path`, `architecture`, `pools`); integrates **DualOrbs**, **SpellPalette**, and **`recordOrbConvergence` / `recordSectionVisit`** from `training-progress`.
- **`src/components/training/DualOrbs.tsx`**, **`SpellPalette.tsx`** *(new)* — Interactive orbs and spell palette; ties into progress.
- **`src/lib/training-progress.ts`** *(new)* — localStorage-backed stats, unlock criteria, repertoire.

---

## 3. Path & extensions

- **`src/app/path/page.tsx`** *(new)* — **The Path**: gated extension downloads when training criteria are met; links to `/extensions/myswordsman-v1.0.0.zip` and `/extensions/mymage-v1.0.0.zip`.
- **`public/extensions/mymage-v1.0.0.zip`**, **`myswordsman-v1.0.0.zip`** *(new)* — Packaged extensions.
- **`src/contexts/ExtensionBridgeContext.tsx`**, **`src/lib/extension-bridge.ts`** *(new)* — Bridge between site and extension.
- **`src/contexts/MagePanelContext.tsx`** *(new)* — Used with layout providers.
- **`src/app/layout.tsx`** — Wraps app in **`ExtensionBridgeProvider`** and **`MagePanelProvider`**; **`FloatingExtensionStatus`** from **`ExtensionStatusIndicator`**.
- **`src/components/ExtensionStatusIndicator.tsx`** *(new)* — Floating status for extension connection.

---

## 4. Web & navigation

- **`src/app/web/page.tsx`** — Substantial addition (constellation / spellweb / training-adjacent UX; ~100+ lines in the diff).
- **`src/lib/nav.ts`** — New **`/path`** route and **`ROUTES.path`**.

---

## 5. Docs & content (untracked)

- **`SPELLWEB_V5_UPDATE_PLAN.md`** — Planning doc.
- **`src/content/chronicles/`** — Multiple chronicle and inscription markdown files (skills, acts, training grounds, etc.); this file is one more chronicle in that vein.

---

## 6. Hygiene note

- **`src/lib/persona-index.ts.backup`** — Local backup; **do not commit** unless intentionally versioning it (prefer `.gitignore` or delete after merge).

---

## Risk / follow-up

- **Binary size:** Extension zips in `public/` will increase repo and clone size; consider Git LFS or release artifacts if this grows.
- **Dual dev servers:** `npm run dev` (e.g. 5000) vs `npm start` (8000 static) — different workflows; confirm API routes if any are needed (static export may omit some server behavior).
- **Commit strategy:** One logical commit per theme (grimoire, training, path/extensions) may ease review and bisect.

---

*End of observation.*
