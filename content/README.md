# Content — Skills, Personas, Spellbook

This directory is the **single place to manage** the content that changes most often:

- **Skills** — agentprivacy `.skills.md` files and any per-skill or cross-skill analysis.
- **Personas** — the 16 templates (Soulbis, Soulbae, Cipher, …) and their role skills; optional spellbook mapping (spell IDs + skill IDs per path).
- **Spellbook** — documentation and (optionally) data for how live spells map to paths and how export is built.

**See:** [../docs/SKILLS_PERSONAS_SPELLBOOK_MANAGEMENT.md](../docs/SKILLS_PERSONAS_SPELLBOOK_MANAGEMENT.md) for the full plan, current duplication, and how export per agent/path works.

## Layout

- `skills/` — Canonical skill markdown and analysis. Add sophisticated per-skill or cross-skill analysis under `skills/analysis/`.
- `personas/` — Persona definitions and optional spellbook-mapping data. Add deeper persona/path analysis under `personas/analysis/` if needed.
- `spellbook/` — Docs (and optional data) for spell ↔ path mapping and export behaviour.

The app currently reads from **`public/skills/`** and **`src/lib/`** (persona-index, spellbook-templates, skills-data). As you consolidate, you can copy or generate from this tree into those targets.
