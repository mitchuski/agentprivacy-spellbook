# Spellweb ↔ Web: Transformer Instructions

**Purpose:** Single source of truth for the relationship between **Spellweb** (standalone knowledge-graph product) and **web** (agentprivacy personal journey). Use this doc when building the standalone Spellweb domain, maintaining agentprivacy, or integrating the two.

**Date:** February 2026  
**Status:** Canonical  
**Spell:** 🕸️↔🌐 | 😊

---

## The Revelation

| System | Scope | Where it lives | Purpose |
|--------|--------|----------------|---------|
| **Spellweb** | The whole | **Standalone domain** (separate product) | Full knowledge graph viewer: all tales, protocols, standards, Paradox Plane, node inspector, filters, Graph RAG. The complete map. |
| **web** | Personal slice | **agentprivacy** (this repo, route `/web`) | Personal journey only: your lit spells, skills, grimoire clusters, user connections, reflections, "path the stars." Emojis, lines, constellation. |

**Spellweb** = the atlas. **web** = your path on the map. The standalone Spellweb domain will host the atlas; agentprivacy keeps the personal journey.

---

## Definitions

### Spellweb (standalone)

- **Product:** Full interactive knowledge graph of the agentprivacy (and broader) ecosystem.
- **Data:** Canonical nodes (tales, protocols, standards, concepts, primitives) and edges (inscription_echo, principle_extends, implements, guild_bridge, dependency). Scores: guild, maturity, complexity, privacyDelegationPosition, dimensionalScale.
- **Views:** Constellation (force-directed), Paradox Plane (scatter). Node inspector, filters, optional Graph RAG / Soulbae.
- **Data source:** Static JSON or build-time ingestion from docs (e.g. `nodes.json`, `edges.json`). In this repo, seed data lives under `public/nexus/` for reference; the standalone product will have its own pipeline.
- **Privacy:** Mage-shared, read-only canonical knowledge. No user-specific data required to view.

### web (agentprivacy)

- **Product:** Personal journey view on agentprivacy.
- **Data:** User-selected spell IDs and skill IDs (from spellbook storage), user-created links, reflections. Built by `buildSpellweb()` from grimoire cards and skills.
- **Views:** Single view: SpellwebViewer (react-force-graph-2d). Emoji nodes, lines, grimoire clusters, constellation paths, "path the stars," Connect mode, Reflect.
- **Data source:** `localStorage`, spellbook storage, `getBakedSpellCards()`, `ALL_SKILL_FILES`, `getAllInscribedMarkers()`.
- **Privacy:** Swordsman-protected. All journey data stays in the browser.

---

## ID and Data Mapping (Transformer)

Use these when translating between Spellweb (standalone) and web (agentprivacy), or when designing deep links or "Add to my web" flows.

### Node identity

| Context | Identifier | Example |
|---------|------------|--------|
| **Spellweb (KG)** | Node `id` in `nodes.json` | `tale-03-monastery`, `proto-rpp`, `std-erc-8004` |
| **web (journey)** | Spell/skill ID from grimoire | `zero-tale-3`, `story-act-5`, skill file IDs |

**Mapping (conceptual):** A tale node `tale-03-monastery` in the KG corresponds to spell ID `zero-tale-3` (or the appropriate grimoire prefix + tale number) in the journey. Protocol/standard nodes may not have a direct spell equivalent; they are KG-only until we define "add protocol to my web" semantics.

### Data shapes

**Spellweb (KG) node** (standalone):  
`id`, `label`, `type` (tale | protocol | standard | primitive), `guild`, `protocolFamily`, `dimensions` (d1Hide–d6Delegate), `privacyDelegationPosition`, `dimensionalScale`, `complexity`, `maturity`, `inscriptions`, `summary`, `standards`, `taleUrl` (e.g. `/zero/3`).

**web (journey) node** (SpellwebViewer):  
`id`, `type` (grimoire | spell | skill | persona | ceremony), `emoji`, `label`, `fullTitle`, `val`, `color`, `group`, `isLit`, `isOnPath`, `sequenceNumber`. Built by `buildSpellweb()` from spell cards and skills.

**Transformer direction (Spellweb → web):**  
Given a KG node with `taleUrl` (e.g. `/zero/3`), derive the spell ID used in agentprivacy (e.g. from the grimoire + tale index). Journey does not store KG node IDs; it stores spell/skill IDs. So "Add to my web" from the standalone Spellweb would need to emit or open agentprivacy with the corresponding spell/skill ID (e.g. `?light=zero-tale-3` or write to spellbook storage if same origin).

**Transformer direction (web → Spellweb):**  
Given a spell ID (e.g. `zero-tale-3`), the standalone Spellweb can resolve to KG node `tale-03-monastery` via a fixed mapping (e.g. grimoire + index → `tale-{nn}-{slug}`). Used for "View in Spellweb" or "Show my path" overlay on the standalone product.

### Edges

- **Spellweb (KG):** Typed edges (principle_extends, implements, inscription_echo, guild_bridge, dependency) with strength. Stored in `edges.json`.
- **web (journey):** User links (type `connect`), plus structural links (grimoire, sequence, cluster, constellation) from `buildSpellweb()`. Stored in localStorage (`agentprivacy-spellweb-user-links`).

No automatic sync. Overlay or "Show my path" on the standalone Spellweb would consume a list of lit node IDs (derived from spell/skill IDs via the mapping above) and optionally user edges (source/target as spell or node IDs).

---

## What Lives Where (This Repo)

| Asset | Location | Used by |
|-------|----------|--------|
| Journey UI (SpellwebViewer) | `src/components/spellweb/SpellwebViewer.tsx` | **web** (`/web`) |
| Journey builder | `src/lib/spellweb/builder.ts`, `types.ts`, `labels.ts` | **web** |
| Journey page | `src/app/web/page.tsx` | **web** |
| Nav | **web** only: single tab `web` → `/web` | agentprivacy |

This repo contains **only the journey** (web). There are no `/nexus` or `/spellweb` routes. The **standalone Spellweb domain** will implement the full KG viewer (and its own data pipeline) from the specs in these docs.

---

## Documentation Files to Keep Aligned

When updating the relationship between Spellweb and web, touch:

1. **This file** — `docs/SPELLWEB_WEB_TRANSFORMER.md` (canonical transformer instructions).
2. **SPELLWEB.md** (root) — Add a short "Spellweb vs web" section pointing to this doc; clarify that Spellweb = standalone product, web = journey on agentprivacy.
3. **docs/NEXUS_SPELLWEB_ARCHITECTURE.md** — Reframe as "Spellweb (standalone) vs web (agentprivacy)"; optional rename to spellweb-web-architecture.
4. **docs/SPELLWEB_INTEGRATION_SPEC_v2.md** — State that full KG viewer is for the standalone Spellweb domain; agentprivacy keeps only web (journey).
5. **docs/IMPLEMENTATION_PATH.md** — Note product direction: standalone Spellweb domain for KG; Phase 0 nexus work in this repo is reference/optional.
6. **CHRONICLE_SPELLWEB_GENESIS.md** — Add a short "Resolution" note: Spellweb = standalone domain; agentprivacy = web (personal journey).

---

## Quick Reference for Implementers

- **Building the standalone Spellweb:** Use KG node/edge schema and scoring from the specs in this repo (e.g. `docs/NEXUS_SPELLWEB_ARCHITECTURE.md`, `docs/SPELLWEB_INTEGRATION_SPEC_v2.md`). Implement Constellation + Paradox Plane, node inspector, filters. Graph RAG optional. No dependency on agentprivacy’s journey data. This repo does not ship nexus/spellweb routes or KG data.
- **Maintaining agentprivacy web:** Keep `/web` as the single journey route. SpellwebViewer + spellbook storage + reflections + Connect + "path the stars." No requirement to host the full KG here.
- **Linking the two (future):** "Add to my web" from Spellweb → map KG node to spell/skill ID, open agentprivacy with that ID or pass via query/API. "View in Spellweb" from web → map spell ID to KG node ID, open standalone Spellweb with highlight or focus on that node.
- **Linking to full map:** The journey page (`/web`) does not currently link to the full KG. When the standalone Spellweb domain is live, you can optionally add a "Full map" link (e.g. in the web top bar) pointing to the standalone URL.

---

*"The atlas is one place. Your path is another. The transformer is the bridge."*

🕸️↔🌐 | 😊
