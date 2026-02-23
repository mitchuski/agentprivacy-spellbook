# Personas — single source (target)

- **`_index.json`** — Copy or move the 16 template definitions here from `public/persona/_index.json` to make this the canonical source. Today the app uses `src/lib/persona-index.ts` and `src/lib/spellbook-templates.ts` (hardcoded); the plan is to derive those from this JSON (and optional spellbook-mapping) so you don’t maintain three places.
- **`spellbook-mapping.json`** — Optional. Per-persona `spellIds` and `skillIds` so “live spells mapping” is data-driven instead of hardcoded in `spellbook-templates.ts`.
- **`analysis/`** — Optional. Deeper per-persona or path-comparison analysis.

See **docs/SKILLS_PERSONAS_SPELLBOOK_MANAGEMENT.md** for the full plan.
