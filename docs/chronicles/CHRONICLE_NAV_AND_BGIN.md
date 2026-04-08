# Chronicle: Navigation and BGIN Build (as of this point)

A record of navigation changes and the BGIN/proverb/trust build for coherence and future reference.

---

## 1. Navigation

### 1.1 AppNav (global header)

**File:** `src/components/AppNav.tsx`

**Current link order and labels:**

| Order | Path       | Label     | Notes                    |
|-------|------------|-----------|--------------------------|
| 1     | `/story`   | story     | First Person spellbook   |
| 2     | `/spells`  | spells    | Skill graph + spellweb   |
| 3     | `/ceremony`| ceremony  | **Added** – Identity     |
| 4     | `/promises`| promises  | **Added** – Kanban       |
| 5     | `/zero`    | zero      | ZKP spellbook            |
| 6     | `/canon`   | canon     | Blockchain canon         |
| 7     | `/society` | society   | Parallel society         |
| 8     | `/plurality` | plural  | Plurality                 |
| 9     | `/privacy` | privacy   | Privacy page             |
| 10    | `/mage`    | mage      | Mage chat                |
| 11    | `/evoke`   | evoke     | Evoke                    |
| 12    | `/proverbs`| proverbs  | Proverbs / inscriptions  |
| 13    | `/the-first` | the first | The First              |

- **Added:** `ceremony`, `promises` (after spells, before zero).
- **Behaviour:** Same `NAV_LINKS` for desktop and mobile; mobile closes menu on link click. Active state: `pathname === href` or `pathname.startsWith(href)` for non-home.

### 1.2 Landing page CTAs

**File:** `src/app/page.tsx`

- **Hero:** Three CTAs – “Learn More” → `/story`, “Create identity” → `/ceremony`, “Build spellbook” → `/spells`.
- **Lower CTA block:** Same three links (Learn More, Create identity, Build spellbook).
- **Rationale:** Ceremony and spellbook are first-class entry points; story remains “Learn More”.

### 1.3 In-page and cross-app links

| Source                    | Target                    | Purpose                          |
|---------------------------|---------------------------|----------------------------------|
| Ceremony completion       | `returnTo` or `/spells`   | Redirect after identity; when `returnTo=/spells`, adds `?from=ceremony` so Spells shows toast |
| Ceremony page             | Reads `?returnTo=`         | Allowed: `/spells`, `/promises`, `/story`, `/mage`; default `/spells` |
| Spells page               | “Begin Ceremony” modal    | `/ceremony?returnTo=/spells`     |
| Spells page               | On load with `?from=ceremony` | Toast “Identity ready—you can now save spellbooks.”; URL replaced with `/spells` |
| Spells page               | Spell cards               | `card.learnUrl` (e.g. `/story?act=…`) |
| Story page                | `/spells`                 | “Add to skill graph” CTA         |
| MagePanel                 | `/promises?proverb=…`     | “Make Promise” with current text |
| PromiseBoard              | “Begin Ceremony”          | `/ceremony?returnTo=/promises`   |
| Canon / story / etc.      | `/proverbs?act=…`         | Inscription → proverbs           |

No other global nav components; all primary nav goes through `AppNav`.

---

## 2. BGIN and identity

### 2.1 Identity ceremony

- **Route:** `/ceremony`. Optional query: `?returnTo=/spells` (or `/promises`, `/story`, `/mage`). Default return `/spells`.
- **Flow:** Welcome → Key generation (Ed25519) → Privacy → Grimoires → Agent card (signed) → Completion → “Download agent card (backup)” (public JSON) → redirect to `returnTo` (when `/spells`, redirect includes `?from=ceremony` so Spells shows a toast).
- **Lib:** `src/lib/ceremony/` (types, keygen, storage). No private key in localStorage; key used in-session then discarded.
- **Guards:** Save spellbook and Download skills.md on `/spells` require ceremony; “+ New Promise” and “Make Promise” (and opening with `?proverb=`) on `/promises` require ceremony. Modals link to “Begin Ceremony” with `returnTo` so user returns to the same page after completion.

### 2.2 Promises

- **Route:** `/promises`. Kanban: Active | In progress | Completed. “+ New Promise” opens modal (or ceremony-required modal).
- **Lib:** `src/lib/promises/` (types, storage). `ap-promises` in localStorage.
- **MagePanel:** “Make Promise” links to `/promises?proverb=…` with current proverb.

### 2.3 Spellweb

- **Location:** `/spells`, section “Your Spellweb”. Renders when there is at least one spell or skill selected.
- **Lib:** `src/lib/spellweb/` (types, builder). Uses `react-force-graph-2d` (dynamic, no SSR).

### 2.4 Trust tiers

- **Tiers:** Blade → Light → Heavy → Dragon from `completedPromises` and `studiedActs`.
- **Lib:** `src/lib/trust/` (tiers, storage, TierBadge). Metrics in `ap-trust-metrics`; updated when a promise is set to completed and when story-act count on spellbook changes.
- **Display:** Spells sidebar shows display name + live tier (from metrics). Ceremony Agent Card step shows tier (starts Blade).

---

## 3. Proverb system

### 3.1 Save your proverbs (Story / Spells context)

- **Component:** `src/components/SaveYourProverbs.tsx`.
- **Behaviour:** One “current” input + “Add” appends to saved list (one per line) and clears the input. Enter (no Shift) also adds and clears. Second textarea shows saved list (editable).
- **Storage:** `agentprivacy-custom-proverbs` (same as before). Used in skills.md export on `/spells`.

### 3.2 MagePanel “just another proverb formed”

- **File:** `src/components/MagePanel.tsx`.
- **Actions when there is text:** Copy Proverb | **Add to my proverbs** | Make Promise.
- **“Add to my proverbs”:** Appends to `getCustomProverbs()` / `setCustomProverbs()` then clears the textarea so the user can paste another.

---

## 4. localStorage keys (summary)

| Key                     | Purpose                          |
|-------------------------|----------------------------------|
| `ap-agent-card`         | Signed identity (post-ceremony)  |
| `ap-ceremony-complete`  | Ceremony done flag               |
| `ap-promises`           | Promise entries (Kanban)         |
| `ap-trust-metrics`      | `completedPromises`, `studiedActs` |
| `agentprivacy-spellbook`| Current spellbook (spellIds, skillIds, saved names) |
| `agentprivacy-custom-proverbs` | User proverbs list (export) |
| (existing)              | Soulbae session/chat/budget, learned-up-to, etc. |

---

## 5. New and updated files (concise)

**New:**

- `src/app/ceremony/page.tsx`
- `src/app/promises/page.tsx`
- `src/lib/ceremony/types.ts`, `keygen.ts`, `storage.ts`
- `src/lib/promises/types.ts`, `storage.ts`
- `src/lib/spellweb/types.ts`, `builder.ts`
- `src/lib/trust/tiers.ts`, `storage.ts`
- `src/components/ceremony/*` (CeremonyWizard, WelcomeStep, KeyGenStep, PrivacyStep, GrimoireStep, AgentCardStep, CompletionStep)
- `src/components/promises/PromiseBoard.tsx`, `PromiseCard.tsx`, `NewPromiseModal.tsx`
- `src/components/spellweb/SpellwebViewer.tsx`
- `src/components/trust/TierBadge.tsx`

**Updated:**

- `src/components/AppNav.tsx` – added ceremony, promises.
- `src/app/page.tsx` – hero and CTA: Learn More, Create identity, Build spellbook.
- `src/app/ceremony/page.tsx` – reads `?returnTo=`, passes to wizard; content wrapped in `Suspense` for `useSearchParams`.
- `src/app/spells/page.tsx` – spellweb section, ceremony guard (save/download), trust tier from metrics, studiedActs from selection; on load with `?from=ceremony` shows toast and replaces URL.
- `src/components/ceremony/CeremonyWizard.tsx` – accepts `returnTo` prop.
- `src/components/ceremony/CompletionStep.tsx` – uses `returnTo` for redirect; when `returnTo=/spells` appends `?from=ceremony`; “Download agent card (backup)” button (public JSON).
- `src/components/MagePanel.tsx` – Add to my proverbs, Make Promise link.
- `src/components/SaveYourProverbs.tsx` – add-then-clear flow and second textarea.
- `src/components/promises/PromiseBoard.tsx` – ceremony guard, increment completed promises, ceremony-required modal; Begin Ceremony → `/ceremony?returnTo=/promises`.

---

## 6. Coherence checks

- **Nav:** One global nav (AppNav); ceremony and promises in same place on every page. Landing reinforces story, ceremony, spells.
- **Ceremony:** Required for save spellbook, download skills.md, and creating promises; modals point to `/ceremony`.
- **Proverbs:** One saved list; add from SaveYourProverbs (add-then-clear) or MagePanel (“Add to my proverbs” then clear).
- **Trust:** Single metrics source; tier computed from metrics and shown on spells sidebar and in ceremony.

---

*Chronicle as of the navigation + BGIN + proverb + trust build. Update this doc when adding or changing nav or these flows.*
