# Spellbook — live spells mapping and export

This folder is for **documentation and optional data** about:

- How spell IDs (act-*, zero-tale-*, chapter-*, etc.) map to grimoire sources.
- How each path (Soulbis, Soulbae, Cipher, …) is defined in terms of spell IDs + skill IDs.
- How the export (skills.md / spellbook download) is built and what “per agent” and “per path” mean.

Today the live mapping lives in **`src/lib/spellbook-templates.ts`** (and spell cards in `src/lib/grimoire-baked.ts`). If you add a `spellbook-mapping.json` (e.g. under `content/personas/`), it can drive that mapping so you don’t edit TS by hand. See **docs/SKILLS_PERSONAS_SPELLBOOK_MANAGEMENT.md** for the export flow and consolidation steps.
