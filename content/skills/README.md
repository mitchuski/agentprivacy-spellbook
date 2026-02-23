# Skills — source and analysis

- **`agentprivacy/`** — Intended canonical source for `*.skills.md` files (e.g. `dragon.skills.md`, `crypto_zkp.skills.md`). The app today serves from `public/skills/agentprivacy/`; sync or copy from here when you want this to be the single source.
- **`analysis/`** — Place for more sophisticated per-skill or cross-skill analysis. Add markdown (or other) files here; they are not yet wired into the app.

Metadata (id, proverb, spell, agent, filename) is still defined in `src/lib/skills-data.ts` until you move it to a generated source (e.g. JSON/YAML in this tree).
