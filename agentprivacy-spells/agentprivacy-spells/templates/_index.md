# Spellbook Template Index v2.0

16 templates. 6 privacy layer skills (always loaded). 11 role skills (selected by pathway). 5 grimoire sources (interlocked by need).

Every template generates a spec-compliant SKILL.md via `SKILL_BASE_FORMAT.md`.

## ⚔️🧙 Canonical (source agents — full grimoire coverage)

| ID | Name | Alignment | Skills | Grimoire Coverage |
|----|------|-----------|--------|-------------------|
| `soulbis` | Soulbis — The First Swordsman | ⚔️ Full Swordsman | 11/17 | 80+ (Full FPS + Full ZK + Canon/Parallel/Plurality interlocks) |
| `soulbae` | Soulbae — The First Mage | 🧙 Full Mage | 12/17 | 85+ (Full FPS + Full Canon + Full Parallel + Full Plurality + ZK selected) |

## ⚔️ Swordsman Paths (protection archetypes)

| ID | Name | Skills | Grimoire Sources |
|----|------|--------|-----------------|
| `cipher` | The Cipher — ZKP Protocol Engineer | 9/17 | FPS, ZK (deep), Canon |
| `warden` | The Warden — Browser Privacy Builder | 10/17 | FPS, ZK |
| `gatekeeper` | The Gatekeeper — Proof-of-Personhood Researcher | 9/17 | FPS, ZK, Canon |
| `ranger` | The Ranger — Dark Forest Strategist | 10/17 | FPS, ZK, Canon, Parallel |
| `sentinel` | The Sentinel — Infrastructure Security Architect | 10/17 | FPS, ZK, Canon, Parallel |

## 🧙 Mage Paths (projection archetypes)

| ID | Name | Skills | Grimoire Sources |
|----|------|--------|-----------------|
| `assessor` | The Assessor — Privacy Data Economist | 9/17 | FPS, Canon, Parallel |
| `ambassador` | The Ambassador — Standards & Governance Architect | 10/17 | FPS, Canon, Parallel, Plurality |
| `chronicler` | The Chronicler — Knowledge Compression Builder | 9/17 | FPS, Canon, Parallel, Plurality |
| `shipwright` | The Shipwright — DAO & Community Architect | 9/17 | FPS, Canon, Parallel, Plurality |
| `weaver` | The Weaver — Plural Technology Researcher | 10/17 | FPS, Plurality, Parallel, Canon |

## ☯️ Balanced Paths (cross-domain archetypes)

| ID | Name | Skills | Grimoire Sources |
|----|------|--------|-----------------|
| `healer` | The Healer — Healthcare Privacy Architect | 11/17 | FPS, ZK, Parallel, Canon |
| `witness` | The Witness — Privacy-Preserving Journalist | 10/17 | FPS, ZK, Parallel |
| `architect` | The Architect — AI Agent System Designer | 11/17 | FPS, ZK, Canon, Parallel, Plurality |
| `pedagogue` | The Pedagogue — Privacy Education Designer | 10/17 | FPS, Canon, Parallel, Plurality |

## Template Structure (v2.0)

Every template contains:
1. **YAML frontmatter** — id, alignment, skills, grimoire_sources, output_format
2. **Phase 0 — Privacy Layer** — All 6 seeds with persona-specific reading
3. **Phase 1 — First Person Spellbook Encounters** — Selected acts with spell, why-here
4. **Phase 2+ — Grimoire Interlocks** — ZK tales, Canon chapters, Parallel chapters, Plurality acts as needed
5. **Reconstruction Prompts** — Domain-specific derivation questions
6. **Generated SKILL.md** — Reference to SKILL_BASE_FORMAT.md output
7. **Closing Incantation** — Fill-in-the-blank synthesis

## File Map

- `SKILL_BASE_FORMAT.md` — The generative spec (immutable + dynamic sections)
- `_index.json` — Machine-readable registry for coding agent
- `references/` — Shared reference templates (privacy-layer, grimoire-encounters, reconstruction-journal)
- `assets/pathway-map.json` — Machine-readable dependency graph template
- `examples/ranger-example.SKILL.md` — Working generated output (251 lines)
