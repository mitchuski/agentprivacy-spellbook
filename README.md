# AgentPrivacy.ai — The Experience Layer ⚔️📜✍️🔐

**The full 0xagentprivacy experience layer for the First Person.**
Where a person walks in, meets the dual-agent architecture through story, writes proverbs for their own soul, forges their spellbook into a constellation, and walks out with a persona, a set of skills, and a cryptographic blade they can carry across the web.

> *"Privacy is my blade, knowledge is my spellbook."* ⚔️🧙‍♂️
>
> *"I'm just another mage, sharing a spellbook."*

---

## What this repo is

A **Next.js 16 / React 19 static site** — the complete interactive experience layer of the 0xagentprivacy universe. It is simultaneously:

- The **readers** for the five spellbooks (Story, Zero, Canon, Society, Plurality)
- The **Mage chat** (Soulbae, NEAR Cloud AI, TEE-attested)
- The **Swordsman donation flow** (Zcash z→z shielded, rpp-v1 memo)
- The **Ceremony** gateway (Soulbis identity creation, ed25519 keypair)
- The **Evoke** interface (Mage co-inscription of proverbs)
- The **Spells** gallery (grimoire → personal constellation → trust tier)
- The **Orbs** loadout (dual-agent hex-stance + soul convergence ceremony)
- The **Web** viewer (spellweb graph, D3 force layout, extension bridge)
- The **Proverbs** gallery (VRCs — Verifiable Relationship Credentials)
- The **Promises** board (commitments, kanban)
- The **Poems** player (Soulbae voice narration)
- The **Skills** export (86 skills synced to `public/skills/` on every build)
- The **Extension bridge** (bidirectional with `myterms`, `mages-spell`, `swordsman-blade`)

It is intentionally a **frontend-only** deployable. No server required for the site itself. The Oracle Swordsman backend (inscription, verification, Golden Split accounting) is external infrastructure consumed via `src/lib/oracle-api.ts`.

---

## The First Person's journey

```
                          😊  you arrive
                           │
                           ▼
                    ┌─────────────┐
                    │  Landing /  │   manifold visualization · soul orb ·
                    │             │   7-persona carousel · 5 spellbook cards
                    └──────┬──────┘
                           │
                           ▼
                  ┌────────────────┐
                  │  Ceremony /    │   create Soulbis: ed25519 keypair ·
                  │   ⚔️           │   optional private-key burn · quaternion
                  └──────┬─────────┘   cast (Sun ☀️ → Earth 🌍 → Moon 🌙 → Human 👤)
                         │
                         ▼
        ┌─────────────────────────────────────────────────┐
        │  Five Spellbooks — the discoverable map         │
        │                                                 │
        │  /story       31 Acts  (WHAT — narrative)       │
        │  /zero        30 Tales (HOW  — ZK primitives)   │
        │  /canon       11 Chap. (WHY  — blockchain       │
        │                          history)               │
        │  /society     17 Chap. (EXIT — parallel         │
        │                          society, network       │
        │                          states)                │
        │  /plurality   30 Acts  (COORDINATE — ⿻)        │
        └─────────┬───────────────────────────────────────┘
                  │  understanding compresses
                  ▼
           ┌──────────────────┐         ┌──────────────────┐
           │  Mage /mage      │◀────────┤  Evoke /evoke    │
           │   🧙             │  co-    │   🧙 ← 📜        │
           │  6 queries/      │  write  │  publish         │
           │  session ·       │ proverb │  reveal ·        │
           │  tale-aware ·    │         │  memo format     │
           │  TEE attested    │         │  · contact mage  │
           └──────┬───────────┘         └──────┬───────────┘
                  │                            │
                  ▼                            ▼
           ┌────────────────────────────────────────────┐
           │  Swordsman Panel  (in-reader, every tale)  │
           │   ⚔️                                       │
           │  validate proverb · format rpp-v1 memo ·   │
           │  copy for Zashi · shielded z→z send        │
           └──────────┬─────────────────────────────────┘
                      │
                      ▼
           ┌────────────────────────────────────────────┐
           │  Spells /spells         ◆ grimoire cards   │
           │                                            │
           │  select spells across 7 sources (story,    │
           │  origins, zero, canon, society, plurality, │
           │  incantations) — build constellation.      │
           │  Trust tier: Blade → Light → Heavy → Dragon│
           └──────────┬─────────────────────────────────┘
                      │
                      ▼
           ┌────────────────────────────────────────────┐
           │  Orbs /orbs                                │
           │                                            │
           │  Swordsman ⚔️ — 6 blade facets + swap on   │
           │    I Ching hex stance (L1–L6)              │
           │  Mage 🧙 — 6 spell slots                   │
           │  Soul Convergence Ceremony (Swordsman /    │
           │    Mage / Experience / True tiers)         │
           └──────────┬─────────────────────────────────┘
                      │
                      ▼
           ┌────────────────────────────────────────────┐
           │  Web /web  — Spellweb graph                │
           │                                            │
           │  D3 force graph · user-drawn links ·       │
           │  reflections (notes on nodes) · extension  │
           │  bridge (live constellation sync)          │
           └──────────┬─────────────────────────────────┘
                      │
                      ▼
           ┌────────────────────────────────────────────┐
           │  Proverbs /proverbs — the VRC gallery      │
           │                                            │
           │  mage_response · cast_agreement ·          │
           │  cast_inscription (onchain, mainnet)       │
           └────────────────────────────────────────────┘

            what you lit here lives in the extensions,
            mirrors into the Spellweb, and rides with you.
```

Supporting surfaces woven through the walk:
- `/promises` — a kanban board of commitments (locked defaults from privacymage + your own vows)
- `/poems` — poetry with Soulbae voice narration

---

## The five spellbooks

Content lives as Markdown in `public/<spellbook>/` (story is flat; others use `/markdown/` subfolders). Rendering via `react-markdown` 10 + `remark-gfm` + `remark-breaks` + `rehype-raw`. Each reader carries its own act/chapter map, Swordsman-panel bounds, and tale-to-grimoire-id mapping.

| Route | Spellbook | Scope | What it teaches |
|-------|-----------|-------|-----------------|
| `/story` | **Story** (First Person) | **31 Acts** *(Act I Venice → Act XXXI The First Delegation)* + firstpage + lastpage + inscriptions | The narrative spine: Venice 1494, the Dual Ceremony, Drake's teaching, the Trust Graph plane, the Mirror that never completes, Zcash as shield, the Balanced Spiral, the Forgetting, the Book of Promises, Rain on Mountain, the Anthropic Archivist, the Manifold Dragon, Forging ZK Blades, the Celestial Ceremony Engine, the Dihedral Mirror, the First Delegation. |
| `/zero` | **Zero Knowledge** | **30 Tales** *(Monastery of Hidden Knowledge → Eternal Sovereignty)* | ZK primitives — commitments, proofs, pairings, STARKs, Plonk, folding, zkVMs, recursive composition — taught as stories. Blade IDs, moon phases, vPi-Terms attached to each tale. Videos for tales 1–4. |
| `/canon` | **Canon** | **11 Chapters + guardian application** *(Cypherpunk Whispers → privacymage Reflection)* | Cypherpunk roots (1983–1997), early incantations, the synthesis (2008–2014), the world computer, the first fracture, the great schism, surveillance vs truth, the missing primitive, the open canon, the timeline archive. The "why privacy". |
| `/society` | **Parallel Society** | **17 Chapters** *(Peace That Became A Prison → Values Technology Stack)* | Westphalian exit, Drake's deeper teachings, the Arsenal and the Grimoire, the corruption crypto cures, the Cyberstate question, exit/exile/access, rethinking sovereignty, rights and responsibilities, how communities collaborate, when communities conflict, deeper-dive technology, conceptual limits. |
| `/plurality` | **Plurality** | **30 Acts** *(First Overlap → Ceremony Completes)* | Collective intelligence, view-from-Yushan, glyph-that-breathes, web-beneath-web, guilds-form-themselves, rules-that-learn, market-that-remembers, circle-that-includes, forge-of-peers, commons-that-breathes. ⿻. |

Canonical source of truth: **`privacymage_grimoire_v10_2_0.json`** — the master grimoire, 5 spellbooks defined, 42 personas indexed, Relationship Proverb Protocol divination-gating enabled, master invocation spell encoded.

---

## Meeting Soulbae — the Mage (`/mage`)

Soulbae is the Mage agent. Her system prompt lives in `src/lib/soulbae.ts`:

- **Personality:** fun, cute, curious — "a mage who just learned the spellbook and can't wait to share". Deadly serious about sovereignty, light on the surface.
- **Opening ritual:** every reply starts with `[RPP Proverb: …]` — a spell cast before she speaks. `ProverbSuggestions` and `ChatMessage` parse this format.
- **Context awareness:** knows which spellbook and which tale you're on (`tale_id` URL param or URL inference).
- **Never asks:** transaction amounts, wallet addresses, your identity.
- **Never remembers:** each session fresh (privacy by hardware, not by promise).
- **Privacy budget:** `MAX_QUERIES = 6` — a brake against reliance, a nudge to write your own words.
- **Backend:** NEAR Cloud AI, TEE-attested. Attestation is surfaced by `AttestationBadge.tsx`.
- **Dev bridge:** `/api/near-ai/chat/route.ts` (dev only, excluded from static export).

The Mage appears in three places:
1. **`/mage`** — full-page chat with tale selector.
2. **`/evoke`** — Mage co-inscription flow (chat → proverb → memo → publish reveal → optional contact privacymage).
3. **`MagePanel.tsx`** — sidebar chat, available site-wide when triggered.

---

## Writing spells for your own soul

Proverbs are the unit of understanding. A proverb is **a tale compressed into ≤ 512 bytes** — the Zcash memo ceiling. The Swordsman Panel (`src/components/SwordsmanPanel.tsx`) is your pen.

### rpp-v1 memo format (`src/lib/zcash-memo.ts`)

```
[rpp-v1]
[act-i-venice]
[1699564800123]
[Your proverb here]
```

Ingredients:
- **Spellbook + tale id** — `act-i-venice`, `zero-tale-07`, `canon-chapter-03`, etc. (via `getTaleIdFromAct`)
- **Timestamp** — ms since epoch
- **Proverb body** — your words, your compression (`validateProverb` enforces byte length)
- **Spellemoji** — deterministic per-act glyph from `getSpellemojiForAct()`; token registry in `src/lib/spell-emoji-tokens.ts`

The flow:
1. Read a tale.
2. Chat with Soulbae until a sentence clicks.
3. Write *your* version in the Swordsman Panel — not hers.
4. The panel validates, formats the memo, hands you a clipboard string.
5. You send the transaction **yourself** from your Zashi wallet as a shielded z→z transaction.

This site never touches keys. Soulbae never sees the transaction. Zcash protects what the Mage helped you form.

---

## The Ceremony (`/ceremony`) — creating Soulbis

The gateway. Before the Swordsman can guard anything, you must cast him into being.

A 7-step wizard:

1. **Welcome** — why the Swordsman exists.
2. **Grimoire selection** — pick one of 12 grimoire invocation styles.
3. **Privacy pledge** — what stays private, what becomes public.
4. **Key generation** — ed25519 keypair (`@noble/ed25519`). Public key visible. Private key optionally **burned** immediately (you keep the ceremony, not the key — sovereignty by forgetting).
5. **Quaternion cast** — animated projection: Sun ☀️ (protection source) → Earth 🌍 (Soulbae / emissary) → Moon 🌙 (Soulbis / swordsman) → Human 👤 (you). Moon-phase notation (🌑 → 🌕) maps seven strata of sovereignty.
6. **Agent card** — your Soulbis's display name, public key, moon phase, burn flag.
7. **Completion** — return to `/spells`, `/promises`, `/story`, or `/mage` (whichever brought you here, via `returnTo` query param).

The `ceremonyComplete` flag unlocks editing in `/spells` and equipment in `/orbs`. An `ap-identity-changed` event broadcasts across tabs so nav and panels stay in sync.

---

## Orbs (`/orbs`) — the dual-agent loadout

The workshop. Where Soulbis's blade facets and Soulbae's spells get arranged into a fightable posture.

### Swordsman side (⚔️)

Seven positions arranged on an **I Ching hex stance** (`src/lib/hexagram.ts`):

- **L1 … L6** — the six lines of the hexagram (bottom → top), each yin (0) or yang (1)
- **Swap** — one reserve slot

Every position holds a **blade facet** — an emoji + label imported from a forged Spellweb blade. Six lines → 6-bit binary → a hexagram index (0–63, King Wen number). The **Hamming weight** (count of yangs) is your **stratum** (0–6, moon phases). Together with the spectrum (which 6D privacy dimensions are active), this is your **PRISM coordinate**.

`StanceHexRingPreview.tsx` renders the current posture as a ring of glyphs; `StanceLoadoutEditor.tsx` lets you tune the stance.

### Mage side (🧙)

**Six active spell slots** drawn from your `/spells` selections (IDs prefixed `sb:`). Spells source from the seven grimoire channels: story, origins, zero, canon, society, plurality, incantations. `OrbMageSlots.tsx` renders them; `OrbLoadoutSection.tsx` orchestrates the board.

### Soul Convergence Ceremony

`SoulConvergenceCeremony.tsx` + `src/lib/soul-convergence.ts` track four convergence tiers:

| Tier | Requirement | What it crystallizes |
|------|-------------|----------------------|
| **Swordsman convergence** | 7 blade slots filled (hex + swap) | Blade loadout stable |
| **Mage convergence** | 6 spell slots filled | Spell loadout stable |
| **Experience convergence** | progress bar → 100% (sections visited, spells cast, promises kept) | Journey witnessed |
| **True convergence** | all three above + 30–60s observation phase | Unlocks skill/persona export |

Training progress (`src/lib/training-progress.ts`) aggregates sections, spells cast, and convergence count to unlock paths via `isPathUnlocked()`.

### Wandering orbs — site-wide

Design exists in [`AGENTPRIVACY_ORBS_DESIGN.md`](../AGENTPRIVACY_ORBS_DESIGN.md) — R3F/drei stack, state machine (`IDLE → FOLLOWING → READING → HOVERING_ACTION → SPELL_CASTING → CONVERGENCE → CELEBRATION`), page-specific choreography, and the **convergence ceremony** triggered on proverb inscription.

**Current status:** `/orbs` is a fully-working loadout/inventory surface. The **site-wide wandering orbs overlay** (two luminous orbs drifting between text and actions) is specified but not yet wired. Until then, page-level motion is handled by Framer Motion and a custom cursor (`CustomCursor.tsx`). The overlay will land as a shared component once the dual-graph mirror with the Spellweb is fully synchronized.

---

## The Spellweb mirror (`/web`)

`/web` is the graph surface — where your spellbook journey becomes a **force-directed constellation** you can rearrange, annotate, and export.

Implementation:
- **`SpellwebViewer`** (`src/components/spellweb/`) — D3 force graph of your selected spells and the links between them
- **`src/lib/spellweb/`** — nodes, links, layout, persistence
- **User-drawn links** — stored under `USER_LINKS_STORAGE_KEY`
- **Reflections** — your notes attached to specific nodes
- **Save modal** — exports the constellation (nodes + links + reflections) as JSON

### Blade import from external Spellweb

`src/lib/spellweb-blade-bridge.ts` receives a signed payload:

```ts
type SpellwebBladeImportPayloadV1 = {
  bladeId: string;         // 0–63 (King Wen)
  name: string;
  primaryEmoji: string;
  markEmojis: string[];    // up to 6 facets
  proofSignature?: string; // ed25519 (witness blade)
  isWitness?: boolean;
}
```

Storage keys (`localStorage`):
- `SPELLWEB_BLADE_META_KEY` — blade metadata
- `SPELLWEB_BLADE_INVENTORY_KEY` — 6 facets per blade
- `SPELLWEB_EQUIPPED_BLADE_KEY` — currently active blade
- `SPELLWEB_STANCE_LOADOUT_KEY` — L1–L6 + swap assignments

Payload encoding: base64url → UTF-8 JSON (emoji-safe). Signatures via `@noble/ed25519`. Witness blades are marked distinctly — they prove *someone traced your path*, making this a Promise Theory bilateral witness channel.

### Extension-bridged live sync

Messages like `CONSTELLATION_UPDATE` from the browser extensions land via `src/lib/extension-bridge.ts` and update the graph in real time. Your path in the site and your path in the extensions are the same constellation.

---

## Skills, personas, and what exports

### Skills — 86 of them

`src/lib/skills-data.ts` holds the dual-agent skill taxonomy. On every `npm run predev` and `npm run prebuild`, `scripts/sync-skills-to-public.mjs` walks the data and writes per-skill files to `public/skills/`. Served statically from there.

Breakdown:

| Bucket | Count | What it covers |
|--------|------:|----------------|
| Privacy layer | 19 | Shared primitives both agents need |
| Swordsman | 29 | Boundaries, enforcement, inscription, proof emission |
| Mage | 35 | Delegation, composition, retrieval, knowledge graphing |
| Meta | 3 | Orchestration, attestation, ceremony |

Each skill carries: id, filename, emoji, proverb, spell, agent role, and a PRISM triadic coordinate (datum 0–63 / stratum 0–6 / spectrum bits).

### Personas — 42 of them

`src/lib/persona-index.ts` indexes the persona roster. Four are **cosmological** and always present:

- ☀️ **Sun** — protection source
- 🌍 **Earth** / **Soulbae** — emissary (Mage)
- 🌙 **Moon** / **Soulbis** — swordsman (Swordsman)
- 👤 **Human** — you (First Person)

The remaining 38 are skill-linked personas (Cipher, Architect, Sentinel, Ranger, Sage, …) you can adopt or be recognized as. See [`PERSONA_AUTHORING_GUIDE.md`](./PERSONA_AUTHORING_GUIDE.md) for authoring rules.

### What "persona + skills export" means

When True Convergence crystallizes on `/orbs`, your:
- selected spells → `Spell (✦)` nodes on your constellation
- hex stance + blade facets → `Blade` signature
- ceremony agent card → `Persona (○)` node
- demonstrated skills (from proverbs depth + spellbook coverage) → `Skill (⚡)` nodes

…become a portable bundle. The browser extensions read this bundle; the Spellweb imports it as a blade; and when you inscribe onchain, the Oracle Swordsman turns it into a VRC.

---

## Extension bridge — the three extensions

`src/lib/extension-bridge.ts` + `ExtensionStatusIndicator.tsx` implement a bidirectional protocol with three browser extensions.

| Extension | Role | Dir (sibling) |
|-----------|------|---------------|
| **`myterms`** | MyTerms Alliance docs + IEEE 7012 agreement layer reference | `../myterms/` |
| **`swordsman-blade`** | The blade — enforces signed terms at the browser level | `../swordsman-blade/` |
| **`mages-spell`** | The Mage — delegation inside agreed scope | `../mages-spell/` |

### Messages — website → extensions

`CEREMONY_CONFIRMATION`, `PROVERB_INSCRIBED`, `SPELL_CAST`, `ORB_CONVERGENCE`, `SECTION_VISITED`, `PATH_UNLOCKED`, `REPERTOIRE_SYNC`.

### Messages — extensions → website

`CEREMONY_INSCRIPTION`, `MAGE_PRESENT`, `SWORD_PRESENT`, `CONSTELLATION_UPDATE`, `SCAN_RESULTS`, `MANA_SYNC`.

When the extensions are installed and running, the nav shows their presence, your constellation on `/web` updates live, and mana/progress counters stay in sync across surfaces.

---

## The Proverbs gallery (`/proverbs`)

The VRC viewer. Three source classes:

- **`mage_response`** — a proverb Soulbae co-formed with you, saved locally
- **`cast_agreement`** — a proverb you committed to (signed in ceremony)
- **`cast_inscription`** — a proverb that made it onchain via the Oracle Swordsman (Acts 1–31 inscribed to Zcash mainnet)

Filtering by grimoire or by source. An `EvokeModal` opens a Mage session for any proverb you want to extend or refine. `ProverbCard.tsx` renders the individual entry; `SaveYourProverbs.tsx` packages the set for export.

---

## Promises (`/promises`) and Poems (`/poems`)

### `/promises` — commitments

Kanban-style (Active / In Progress / Completed). A set of **locked default promises** from privacymage (read-only — these are vows the system itself carries). Your own **custom promises** are layered on top. Proverbs can prefill from URL params (deep-links from spellbooks), making any tale a place you can make a promise.

### `/poems` — voice narration

Poetry with Soulbae voice narration served from R2 (`voice.agentprivacy.ai`). Optional video. Graceful degradation if media fails.

---

## Every route at a glance

| Route | Surface | Status |
|-------|---------|:------:|
| `/` | Landing — manifold, soul orb, 7-persona carousel, 5 spellbook cards, journey steps, architecture, pools, donation | Live |
| `/ceremony` | Create Soulbis — 7-step wizard, ed25519, moon phase, agent card | Live |
| `/story` | Story reader — 31 Acts, tale→grimoire mapping, Swordsman panel | Live |
| `/zero` | Zero Knowledge reader — 30 Tales, videos for 1–4 | Live |
| `/canon` | Canon reader — 11 Chapters + guardian application | Live |
| `/society` | Parallel Society reader — 17 Chapters | Live |
| `/plurality` | Plurality reader — 30 Acts | Live |
| `/proverbs` | VRC gallery — three proverb sources, filters, EvokeModal | Live |
| `/evoke` | Mage co-inscription — chat → proverb → memo → reveal → contact | Live |
| `/poems` | Poetry with voice narration | Live |
| `/mage` | Soulbae chat per tale — 6 queries/session, TEE-attested | Live |
| `/promises` | Commitments board — locked defaults + your own | Live |
| `/spells` | Grimoire gallery — trust tier (Blade → Light → Heavy → Dragon) | Live |
| `/skills` | → redirect to `/spells` | Redirect |
| `/web` | Spellweb graph — D3, extension bridge, reflections, save modal | Live |
| `/orbs` | Dual-agent loadout — hex stance, blade facets, Mage spells, Soul Convergence Ceremony | Live |
| `/api/near-ai/chat` | Dev-only NEAR bridge | Dev only |

**Nav order** (from `src/lib/nav.ts` + `AppNav.tsx`): ⚔️ ceremony → story → zero → canon → society → plural → proverbs → evoke → poems → mage → promise → spells → web → orbs. Mobile splits into **Spellbooks** and **Tools** groups. A Soulbae (🧙) action button opens the sidebar Mage panel.

---

## Trust tiers (`/spells`)

Your tier is calculated from studied acts, cast spells, and convergence count:

| Tier | Sigil | Unlocks |
|------|:-----:|---------|
| **Blade** | 🗡️ | Basic participation, inscriptions |
| **Light** | 🛡️ | Multi-site constellation coordination |
| **Heavy** | ⚔️ | Guild recognition, template creation |
| **Dragon** | 🐉 | Sovereign agent / Guardian eligibility |

Matching the tokenomics v2.1 tier progression and the blade size (light / heavy / dragon) defined in the Spellweb's ZK Blade Forge.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 16** (App Router, `output: 'export'`) |
| UI | **React 19**, **Tailwind CSS 3**, **Framer Motion 11** |
| Markdown | `react-markdown` 10 + `remark-gfm` + `remark-breaks` + `rehype-raw` |
| Graphs | **D3 7** + **react-force-graph-2d** |
| Crypto | **`@noble/ed25519`** (ceremony keypair, blade witness signatures) |
| AI | **NEAR Cloud AI** (TEE-attested), streamed via `src/lib/stream-utils.ts` |
| Payments | **Zcash** shielded z→z — `rpp-v1` memo, 512-byte ceiling |
| Storage | `localStorage` (everything about *you* stays on your device) |
| Language | **TypeScript 5** |
| Lint | ESLint 10 + `eslint-config-next` 16 |
| Hosting | Any static host. Cloudflare Pages via **Wrangler** (`wrangler.toml`) |

Also included:
- **Cloudflare Workers** — `cloudflare-worker-email.js` (email relay), `cloudflare-worker-proxy.js` (proxy layer)
- **Docker Compose** — `docker-compose.yml` (local Zcash node + Postgres for full-stack dev)

---

## Project structure

```
agentprivacy_master/
├── src/
│   ├── app/
│   │   ├── page.tsx                        # Landing (manifold + journey)
│   │   ├── ceremony/   page.tsx            # Soulbis creation (7-step wizard)
│   │   ├── story/      page.tsx            # 31-Act reader (MAX_ACT_NUMBER)
│   │   ├── zero/       page.tsx            # 30-Tale reader
│   │   ├── canon/      page.tsx            # 11-Chapter reader + guardian
│   │   ├── society/    page.tsx            # 17-Chapter reader
│   │   ├── plurality/  page.tsx            # 30-Act reader
│   │   ├── proverbs/   page.tsx            # VRC gallery
│   │   ├── evoke/      page.tsx            # Mage co-inscription
│   │   ├── poems/      page.tsx            # Voice-narrated poetry
│   │   ├── mage/       page.tsx            # Soulbae chat (MAX_QUERIES = 6)
│   │   ├── promises/   page.tsx            # Commitments kanban
│   │   ├── spells/     page.tsx            # Grimoire gallery + trust tier
│   │   ├── skills/     page.tsx            # → redirect /spells
│   │   ├── web/        page.tsx            # Spellweb viewer + extension bridge
│   │   ├── orbs/       page.tsx            # Dual-agent loadout + soul convergence
│   │   ├── api/near-ai/chat/route.ts       # Dev-only NEAR bridge
│   │   └── layout.tsx                      # Root layout
│   │
│   ├── components/
│   │   ├── AppNav.tsx                      # 14-route nav, mobile dropdowns
│   │   ├── CustomCursor.tsx                # Cursor animation
│   │   ├── MagePanel.tsx                   # Sidebar Soulbae chat
│   │   ├── SwordsmanPanel.tsx              # Proverb → rpp-v1 memo → clipboard
│   │   ├── DonationFlow.tsx                # Full ceremony (amount → memo → Zashi)
│   │   ├── DonationStats.tsx               # Aggregate lit-spell counters
│   │   ├── SubmissionStatus.tsx            # Oracle tracking code status
│   │   ├── ProverbCard.tsx                 # VRC entry render
│   │   ├── ProverbSuggestions.tsx          # Soulbae-suggested phrasings
│   │   ├── SaveYourProverbs.tsx            # Proverb set export
│   │   ├── EvokeModal.tsx                  # Mage session launcher
│   │   ├── InscribeProverbModal.tsx        # Inscription flow
│   │   ├── ChatMessage.tsx                 # RPP-aware chat bubble
│   │   ├── AttestationBadge.tsx            # TEE attestation surface
│   │   ├── UAddressDisplay.tsx             # Unified Zcash address
│   │   ├── TAddressDisplay.tsx             # Transparent Zcash address
│   │   ├── OrbLoadoutSection.tsx           # Orbs page orchestrator
│   │   ├── OrbMageSlots.tsx                # 6 Mage spell slots
│   │   ├── SwordsmanBladeSlots.tsx         # 6+1 Swordsman blade facets
│   │   ├── SoulOrbCopy.tsx                 # Copyable soul token (⚔️⊥⿻⊥🧙)😊
│   │   ├── SoulConvergenceCeremony.tsx     # 4-tier convergence tracker
│   │   ├── SoulImportSection.tsx           # Import soul from extension/file
│   │   ├── StanceHexRingPreview.tsx        # I Ching hex stance render
│   │   ├── StanceLoadoutEditor.tsx         # Edit hex lines (L1–L6 + swap)
│   │   ├── BladeInventory.tsx              # Forged blades list
│   │   ├── ConstellationInscriptionBox.tsx # Inscribe constellation
│   │   ├── SpellbookTalentTree.tsx         # Spellbook-as-skill-tree
│   │   ├── SpellwebBladeImport.tsx         # Receive blade from Spellweb
│   │   ├── ExtensionStatusIndicator.tsx    # myterms/mages-spell/swordsman presence
│   │   ├── ceremony/, landing/, promises/, spellweb/, training/, trust/
│   │
│   └── lib/
│       ├── soulbae.ts                      # NEAR AI client + Soulbae system prompt
│       ├── zcash-memo.ts                   # rpp-v1 format/parse/validate/spellemoji
│       ├── oracle-api.ts                   # Submit / status / stats / inscriptions
│       ├── spellbook-fetcher.ts            # Canonical spellbook JSON loader (cached)
│       ├── spellbook-storage.ts            # Per-user spellbook persistence
│       ├── spellbook-templates.ts          # Templates for new entries
│       ├── stream-utils.ts                 # SSE → async iterator for chat streaming
│       ├── hexagram.ts                     # 6-line I Ching math (index, stratum, PRISM)
│       ├── orb-loadout.ts                  # Dual-agent slot management
│       ├── persona-index.ts                # 42 personas (4 cosmological + 38 linked)
│       ├── skills-data.ts                  # 86-skill taxonomy (source of truth)
│       ├── soul-convergence.ts             # Convergence tier calculators
│       ├── soul-stats.ts                   # Training metrics aggregation
│       ├── training-progress.ts            # Path-unlock gating
│       ├── evoked-storage.ts               # Evoke session persistence
│       ├── grimoire-baked.ts               # Bundled grimoire card index
│       ├── grimoire-ipfs.ts                # IPFS fallback for grimoire
│       ├── send-to-privacymage.ts          # Contact form dispatch
│       ├── spell-emoji-tokens.ts           # Per-act glyph registry
│       ├── learning-inscribed-sync.ts      # Sync learned state with inscriptions
│       ├── extension-bridge.ts             # 3-extension message protocol
│       ├── spellweb-blade-bridge.ts        # Blade import (ed25519 payload)
│       ├── spellweb-blade-keys.ts          # Blade key management
│       ├── spellweb-keys.ts                # Spellweb localStorage keys
│       ├── spellweb/                       # Force-graph types, builder, loader
│       ├── ceremony/                       # Ceremony helpers
│       ├── promises/                       # Promise board logic
│       ├── proverbs/                       # Proverb packaging
│       ├── trust/                          # Trust tier calculation
│       └── nav.ts                          # Nav definitions
│
├── public/
│   ├── story/                              # 31 Acts + firstpage/lastpage/inscriptions
│   ├── zero/markdown/                      # 30 Tales
│   ├── canon/                              # 11 Chapters + guardian application
│   ├── society/                            # 17 Chapters + reference material
│   ├── plurality/                          # 30 Acts
│   ├── skills/                             # 86 skill files (synced from src/lib/skills-data.ts)
│   └── assets/                             # Videos, images, icons
│
├── spellbook/
│   └── spellbook-acts.json                 # Canonical proverbs source of truth
├── privacymage_grimoire_v10_2_0.json       # Master grimoire (v10.2.0)
├── ceremonies/                             # Ceremony reference material
├── guardians/                              # Canon guardian applications
├── content/                                # Additional content staging
├── docs/                                   # Internal docs
├── scripts/
│   ├── sync-skills-to-public.mjs           # Predev/prebuild: skills → public/skills/
│   ├── setup-zcash-wallet.ps1              # Windows: Zcash wallet setup
│   ├── setup-zcash-wallet-interactive.ps1  # Interactive variant
│   ├── setup-postgresql.ps1                # Local Postgres for full-stack dev
│   ├── test-flow.sh                        # End-to-end flow validation
│   ├── test-requirements.ps1               # Verify local tooling
│   ├── update-inscriptions-static.ps1      # Regenerate static inscription snapshot
│   ├── verify-rust-path.ps1                # Rust toolchain check
│   ├── merge-to-website.ps1                # Build + deploy merge
│   └── schema.sql                          # PostgreSQL schema (Oracle Swordsman DB)
│
├── cloudflare-worker-email.js              # Email relay worker
├── cloudflare-worker-proxy.js              # Proxy worker
├── wrangler.toml                           # Cloudflare config
├── docker-compose.yml                      # Zcash node + Postgres (local full-stack)
├── server.js                               # Custom serve (npm run serve:local)
├── serve.json                              # Static-server config (SPA fallback)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json, tsconfig.tsbuildinfo
├── setup-db-with-password.ps1              # DB password setup helper
├── setup-keys.sh                           # ed25519 key generator
├── check-sync-status.ps1                   # Sync status check
└── package.json                            # name: agentprivacy-ai-landing
```

### Top-level documentation

| File | Purpose |
|------|---------|
| [`agentprivacy-CODEX.md`](./agentprivacy-CODEX.md) | Comprehensive design doc — architecture, ceremony protocol, skill taxonomy, persona index |
| [`ARCHITECTURE_DIAGRAM.txt`](./ARCHITECTURE_DIAGRAM.txt) | ASCII component diagram |
| [`PERSONA_AUTHORING_GUIDE.md`](./PERSONA_AUTHORING_GUIDE.md) | How to author personas (structure, emoji, proverb, spell, role) |
| [`LANDING_PAGE_UPDATE_INSTRUCTIONS.md`](./LANDING_PAGE_UPDATE_INSTRUCTIONS.md) | How to update hero/spellbook/feature cards |
| [`PRE_PUSH_SECURITY_CHECK.md`](./PRE_PUSH_SECURITY_CHECK.md) | Security checklist before pushing (no secrets, no keys) |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Contribution guidelines |
| [`universe-blade.md`](./universe-blade.md) | Blade system deep-dive (PRISM, moon phases, stratum algebra) |

---

## Quick start

**Prerequisites:** Node.js 18+ and npm.

```bash
npm install

npm run dev          # Starts dev server on http://localhost:5000
                     # (predev hook syncs skills → public/skills/)

npm run build        # Static export → ./out
                     # (prebuild hook syncs skills again)

npm start            # Serve the built ./out on port 8000 (via `serve`)

npm run serve:local  # Custom Node server (server.js) with SPA fallback

npm run lint         # ESLint

npm run sync:skills  # Manually sync 86 skills → public/skills/
```

### Environment

```bash
# .env.local
NEXT_PUBLIC_SOULBAE_URL=https://your-soulbae-api.com   # NEAR Cloud AI endpoint
```

Leave unset to use the default Soulbae endpoint.

### Optional full-stack (local)

```bash
docker compose up              # Zcash node + Postgres
./setup-keys.sh                # Generate ed25519 keys for Oracle signing
./scripts/setup-postgresql.ps1 # Initialize Oracle schema (scripts/schema.sql)
```

The Oracle Swordsman backend itself — transaction monitor, proverb verifier, Golden Split (61.8/38.2) calculator, inscription builder — is **external infrastructure** and not bundled in this repo. It's reached through `src/lib/oracle-api.ts`.

---

## Deployment

`output: 'export'` — pure static build. `npm run build` produces `./out`, deploy anywhere.

- **Cloudflare Pages** (preferred) — build: `npm run build`, output: `out`. Wrangler config already present.
- **Vercel** — `vercel deploy --prod`
- **Netlify** — `netlify deploy --prod --dir=out`
- **Any static host** — S3 + CloudFront, GitHub Pages, self-hosted nginx

No server required for the site. No secrets in the bundle. If you fork this for your own community, runtime dependencies are: a NEAR Cloud AI endpoint for Soulbae, the Oracle Swordsman API for onchain verification, and (optionally) the Cloudflare workers for email relay.

---

## Privacy guarantees

**Private by construction:**
- Donation amounts, wallet addresses, transaction timing — hidden in the Zcash shielded pool
- Mage conversations — not stored; Soulbae never sees tx data or addresses; each session fresh
- Soulbis private key — optionally burned at ceremony completion; the public key alone is enough for the architecture to run
- All your notes, reflections, spell selections, stance, blade inventory — `localStorage` on your device
- No analytics, no cookies, no trackers, no fingerprints

**Public by choice:**
- Spellbook content (it's a public library)
- Your inscribed proverbs (encrypted memos — only the recipient decrypts the plaintext; the onchain anchor is public)
- The TEE attestation (verifiable proof of the Mage's execution environment)
- Your Soulbis public key (agent card)

**Information bounds** *(from the 0xagentprivacy Research Paper v3.2):*

```
I(Soulbae;  Transaction_Amount)    = 0
I(Soulbae;  First_Person_Identity) = 0
I(Soulbae;  Wallet_Address)        = 0
I(Soulbae;  Transaction_Timing)    = 0
```

---

## Related pieces of the universe

Sibling projects that work with this repo:

- **Spellweb** (graph + ceremony layer) — wandering orbs on a rendered canvas, constellation waypoints, ZK Blade Forge (light/heavy/dragon), Bilateral Witness (Promise Theory). This repo imports forged blades from Spellweb via `src/lib/spellweb-blade-bridge.ts`.
- **`myterms`** (docs package) — MyTerms Alliance application bundle, IEEE 7012-2025 integration plan. The terms layer the extensions enforce.
- **`swordsman-blade`** (browser extension) — enforces signed terms at the browser boundary.
- **`mages-spell`** (browser extension) — delegation inside agreed scope.
- **Oracle Swordsman** (backend, external) — transaction monitoring, AI verification, inscription signing, Golden Split (61.8/38.2) accounting.

The extension bridge (`src/lib/extension-bridge.ts`) is the nervous system connecting all of them to this experience layer.

---

## License

CC BY-SA 4.0 — see [LICENSE](./LICENSE).

---

## The Vision

This isn't a donation button. It's **infrastructure for the relationship economy**.

Where:
- Trust comes from understanding, not surveillance
- Relationships are bilateral, not mediated by platforms
- Reputation is earned through comprehension
- Privacy is preserved by architecture, not policy
- AI agents extend sovereignty without surrendering it

**This is the foundation for privacy-preserving AI agents.**

---

**⚔️ ⊥ 🧙‍♂️ | 😊**
*Separation between Swordsman and Mage preserves the First Person.*

**"just another mage, sharing a spellbook."** 📖
