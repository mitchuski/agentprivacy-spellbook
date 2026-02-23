# Skills, Personas & Spellbook — Management Plan

This document is the single place to understand how **skills** (`.skills.md`), **personas** (templates), and **spellbook mapping** (live spells + skills per agent/path) are authored, where they are duplicated, and how export per agent/path works. This is the area that will be iterated the most.

---

## 1. Current state & duplication

### 1.1 Personas (16 templates)

| Location | What it holds | Used by |
|----------|----------------|---------|
| **`public/persona/_index.json`** | Full template defs: id, name, emoji, tagline, alignment, category, **skills_role**, domain, question, file, grimoire_sources, phase_1/2/3, coverage_skills, coverage_grimoire | Referenced in comments only; **not loaded by the app** |
| **`src/lib/persona-index.ts`** | `PERSONA_TEMPLATES`: id, name, emoji, tagline, alignment, category, **skills_role** | Spells page (persona alignment in export), matching “which personas fit this spell graph” |
| **`src/lib/spellbook-templates.ts`** | `SPELLBOOK_TEMPLATES`: id, name, emoji, tagline, alignment, **spellIds**, **skillIds** (and uses `getSkillIdsForPersona()` from persona-index) | Spells page (template selector, “Use this persona” → load spells + skills into graph) |

**Duplication:** Persona identity (id, name, emoji, tagline, alignment, category) and **skills_role** exist in both `_index.json` and `persona-index.ts`. Spellbook templates duplicate name/emoji/tagline/alignment again and add spellIds/skillIds. So **personas are defined in three places**; only the TS modules are actually used at runtime.

### 1.2 Skills (agentprivacy .skills.md)

| Location | What it holds | Used by |
|----------|----------------|---------|
| **`public/skills/agentprivacy/*.skills.md`** | The actual markdown files served to the app and included in spellbook export | `src/app/spells/page.tsx` (fetch `/skills/${filename}`), `src/lib/skills-data.ts` (filename = `agentprivacy/xxx.skills.md`) |
| **`src/lib/skills-data.ts`** | **DUAL_AGENT_SKILL_MAP**: id, filename, seedEmoji, seedName, proverb, spell, agent (soulbis | soulbae | privacy), reason. One source of truth for *which* skills exist and their metadata. | Spells page (skill list, filters, export), skills page redirect |
| **`agentprivacy-spells/agentprivacy-spells/skills/`** | Same skills in different layout: `privacy_layer/`, `role/`, `meta/` (e.g. `privacy_layer/dragon.skills.md`, `role/crypto_zkp.skills.md`) | Not imported by this app. Likely source/reference or another distribution. |
| **`public/skills/_index.md`** | Master index doc describing 18 skills, loading order, privacy vs role vs meta. References paths like `privacy_layer/...` and `role/...` (agentprivacy-spells layout). | Human-facing doc; path names don’t match flat `public/skills/agentprivacy/` |

**Duplication:** Skill *content* lives in `public/skills/agentprivacy/` (flat). Skill *metadata* (id, proverb, spell, agent, etc.) lives only in `skills-data.ts`. The agentprivacy-spells tree is a parallel layout; if it’s the canonical source, a copy/build step to `public/skills/agentprivacy/` is implied but not documented.

**Loose files:** `public/skills/` also has `narrative_compression.skills (1).md`, `academic.skills (1).md`, `PrivacyisValue_v4_drake_dragon_duality.md`, `_index.md` — mixed naming and possible duplicates; need a single convention.

### 1.3 Spellbook (live spells mapping)

| Location | What it holds | Used by |
|----------|----------------|---------|
| **`src/lib/spellbook-templates.ts`** | For each template: **spellIds** (act-*, zero-tale-*, chapter-*, etc.) and **skillIds**. Soulbis/Soulbae/Cipher/etc. have hardcoded spell arrays; some use `getSkillIdsForPersona(id)`. | Spells page: “Use this persona” loads these spellIds + skillIds into the spell graph (storage + UI). |
| **`src/lib/grimoire-baked.ts`** | Baked list of spell cards (id, title, proverb, spell, spellbook). | Defines *available* spells; spellbook-templates reference these ids. |

**Single source:** Spellbook mapping (which spells + skills per persona/path) lives only in `spellbook-templates.ts`. There is no JSON or markdown source that the app reads for this.

---

## 2. How skills export per agent and path works

1. **Spells page** (`src/app/spells/page.tsx`):
   - User selects spells (from grimoire) and skills (from `ALL_SKILL_FILES` in `skills-data.ts`).
   - Selections are stored in localStorage and/or loaded from a **template** (e.g. Soulbis, Soulbae, Cipher) via `SPELLBOOK_TEMPLATES` in `spellbook-templates.ts`.
   - **Export (Download spellbook):**
     - Reads current selection (union of storage + state).
     - Builds markdown: pathway, Spells & Proverbs, Saved/Inscribed proverbs, **Persona alignment** (from `getMatchingPersonas(selectedSkillIds)` in `persona-index.ts`), then **Skill files**.
     - For each selected skill, loads content with `fetch('/skills/${filename}')` (e.g. `/skills/agentprivacy/dragon.skills.md`). If missing/empty, fallback is proverb + spell from `skills-data.ts`.

2. **Agent filter:** The page has an “agent” filter (soulbis | soulbae | privacy | all). It filters the *list* of skills and can change the export filename (e.g. `soulbis_spellbook.md`). It does **not** change which skills are included in the export — that’s purely “selected skill IDs”.

3. **Persona alignment:** Export includes a “Persona alignment” section when the set of selected *role* skills fully covers one or more persona’s `skills_role` (from `persona-index.ts`). So persona definitions drive “this spell graph matches these personas,” not which skills are in the export.

4. **Pipeline summary:**
   - **Skills available in UI:** `src/lib/skills-data.ts` → `ALL_SKILL_FILES` / `DUAL_AGENT_SKILL_MAP`.
   - **Skill file content:** `public/skills/agentprivacy/<id>.skills.md` (path from `meta.filename`).
   - **Per-path skill set:** `spellbook-templates.ts` → `skillIds` per template; templates are the “path” (Soulbis path, Soulbae path, Cipher path, etc.).
   - **Per-path spell set:** Same file → `spellIds` per template.

---

## 3. Recommended single-source layout (for you to iterate)

A single place for “content we edit most” keeps things predictable and leaves room for deeper analysis.

```
content/
  skills/                    # Canonical skill .md files (source)
    agentprivacy/            # Flat list: dragon.skills.md, crypto_zkp.skills.md, ...
    analysis/                # Optional: per-skill or cross-skill analysis (your “sophisticated” docs)
  personas/                  # Single source for persona definitions
    _index.json              # Full 16 templates (id, name, emoji, tagline, alignment, category, skills_role, …)
    spellbook-mapping.json   # Optional: spellIds + skillIds per persona (could replace hardcoding in spellbook-templates)
  spellbook/                 # Live spell ↔ path mapping and export config
    README.md                # How spell IDs map to grimoire sources; how export is built
```

**App vs content:**

- **Today:** App reads skills from `public/skills/` and persona/spellbook from TS. So either:
  - You keep authoring in `content/` and add a **build/copy step**: e.g. `content/skills/agentprivacy/*` → `public/skills/agentprivacy/`, and (if you want) generate `persona-index.ts` / `spellbook-templates.ts` from `content/personas/_index.json` (+ spellbook-mapping).
  - Or you move the app to read from `content/` in dev and only copy to `public/` for production static export.

**Recommendation:** Treat **`content/`** as the single place to manage skills, personas, and spellbook mapping. Add your “sophisticated analysis” under `content/skills/analysis/` (or similar). Then either:
- Manually sync `content/skills/agentprivacy/` → `public/skills/agentprivacy/` until tooling exists, or
- Add a small script: copy skills, optionally generate TS from JSON so persona-index and spellbook-templates stay in sync with `content/personas/`.

---

## 4. Reducing duplication (concrete steps)

1. **Personas**
   - Make **`public/persona/_index.json`** (or `content/personas/_index.json`) the single source. Extend it if needed with `spellIds` / `skillIds` per template.
   - Change **`persona-index.ts`** to either:
     - Import and re-export from that JSON (e.g. at build time), or
     - Be generated from that JSON so id/name/emoji/tagline/alignment/category/skills_role are never hand-edited in TS.
   - Same for **spellbook-templates.ts**: derive from the same JSON (plus a spellbook-mapping file) so spellIds/skillIds are not duplicated in code.

2. **Skills**
   - Decide canonical source of truth for **content**: either `public/skills/agentprivacy/` or `content/skills/agentprivacy/`. If the latter, add a copy step to `public/skills/agentprivacy/`.
   - Keep **metadata** (id, proverb, spell, agent, filename) in one place: today that’s `skills-data.ts`. Optionally move to a JSON or YAML in `content/skills/` and generate the TS, so the app stays in sync with the content tree.
   - Align **`public/skills/_index.md`** with the layout you use (flat agentprivacy/ vs privacy_layer/role/meta). If agentprivacy-spells stays the “reference” layout, document that and how it maps to `public/skills/agentprivacy/`.

3. **Spellbook mapping**
   - Move “which spellIds and skillIds per persona” into a data file (e.g. `content/personas/spellbook-mapping.json` or inside `_index.json`). Then **spellbook-templates.ts** becomes a thin layer that reads that file (or generated TS from it), so you don’t edit long arrays in code.

---

## 5. Where to add “sophisticated analysis”

- **Per-skill:** e.g. `content/skills/analysis/dragon.md`, `content/skills/analysis/crypto_zkp.md` — linked from or alongside the main `.skills.md` if you want.
- **Per-persona:** e.g. `content/personas/analysis/soulbis.md`, `content/personas/analysis/assessor.md` — for deeper pathway/template rationale.
- **Cross-cutting:** e.g. `content/skills/analysis/pvm-v4-cross-skill.md`, `content/personas/analysis/path-comparison.md`.

Keeping analysis under `content/.../analysis/` keeps the “one place to manage” rule and makes it easy to plug in without touching the app until you want to surface it (e.g. links from the spells page or export).

---

## 6. Quick reference — files that matter

| Concern | Primary file(s) | Backup / doc |
|--------|-----------------|--------------|
| Which skills exist + metadata | `src/lib/skills-data.ts` | `public/skills/_index.md` |
| Skill .md content | `public/skills/agentprivacy/*.skills.md` | (future) `content/skills/agentprivacy/` |
| Persona list + skills_role | `src/lib/persona-index.ts` | `public/persona/_index.json` |
| Spell + skill IDs per path | `src/lib/spellbook-templates.ts` | — |
| Export logic | `src/app/spells/page.tsx` (handleDownloadSpellbook, loadSkillContent) | — |

This plan doc: **`docs/SKILLS_PERSONAS_SPELLBOOK_MANAGEMENT.md`**.
