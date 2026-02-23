# Re-upload checklist — files needed for spells page & export

The persona and skills `.md` files that were in use have been removed. When you add your new package, provide the files below. They will be placed in the paths listed so the spells page and spellbook export work with no duplicates.

**Required for export:** The app loads skill content from `public/skills/agentprivacy/<filename>`. If any of the 18 skill files are missing, export still runs but those skills will appear in the download as fallback (proverb + spell from `src/lib/skills-data.ts` only).

**Persona templates:** The app does not read persona `.md` files at runtime (it uses `src/lib/persona-index.ts` and `spellbook-templates.ts`). Providing the 16 template files restores reference content and keeps `public/persona/_index.json` `file` paths valid if you use them elsewhere.

---

## 1. Skills (required for full export) — 18 files

**Destination:** `public/skills/agentprivacy/`  
**Exact filenames required** (app looks up by these names):

| # | Filename | skills-data id |
|---|----------|----------------|
| 1 | `academic.skills.md` | academic |
| 2 | `ai_agent.skills.md` | ai_agent |
| 3 | `crypto_zkp.skills.md` | crypto_zkp |
| 4 | `dark_forest.skills.md` | dark_forest |
| 5 | `dragon.skills.md` | dragon |
| 6 | `drake_dragon_duality.skills.md` | drake_dragon_duality |
| 7 | `economics.skills.md` | economics |
| 8 | `hitchhiker_governance.skills.md` | hitchhiker_governance |
| 9 | `knowledgegraph.skills.md` | knowledgegraph |
| 10 | `narrative_compression.skills.md` | narrative_compression |
| 11 | `personhood_sybil.skills.md` | personhood_sybil |
| 12 | `plurality_cooperative.skills.md` | plurality_cooperative |
| 13 | `policy_governance.skills.md` | policy_governance |
| 14 | `promise_theory.skills.md` | promise_theory |
| 15 | `swordsman_browser.skills.md` | swordsman_browser |
| 16 | `tetrahedral_sovereignty.skills.md` | tetrahedral_sovereignty |
| 17 | `uor_toroidal.skills.md` | uor_toroidal |
| 18 | `vrc_identity.skills.md` | vrc_identity |

**Rule:** One file per id, no `(1)` or alternate names. Place all 18 under `public/skills/agentprivacy/`.

---

## 2. Persona templates (16 files) — for reference / _index.json

**Destination:** `public/persona/` (top level; no canonical/swordsman/mage/balanced subdirs in this app)

| # | Filename | Persona id |
|---|----------|------------|
| 1 | `soulbis.template.md` | soulbis |
| 2 | `soulbae.template.md` | soulbae |
| 3 | `cipher.template.md` | cipher |
| 4 | `warden.template.md` | warden |
| 5 | `gatekeeper.template.md` | gatekeeper |
| 6 | `ranger.template.md` | ranger |
| 7 | `sentinel.template.md` | sentinel |
| 8 | `assessor.template.md` | assessor |
| 9 | `ambassador.template.md` | ambassador |
| 10 | `chronicler.template.md` | chronicler |
| 11 | `shipwright.template.md` | shipwright |
| 12 | `weaver.template.md` | weaver |
| 13 | `healer.template.md` | healer |
| 14 | `witness.template.md` | witness |
| 15 | `architect.template.md` | architect |
| 16 | `pedagogue.template.md` | pedagogue |

**Rule:** One file per persona, exact names above. No `(1)` / `(2)` copies — merge any alternates into this single file per persona before uploading.

---

## 3. Optional (not required for spells/export)

- `public/skills/_index.md` — master index doc (still present; replace if you update structure).
- `SKILLS_README.md` — root skills letter (replace if you update).
- Persona reference docs: `SKILL_BASE_FORMAT.md`, `grimoire-encounters.md`, `privacy-layer.md`, `reconstruction-journal.md`, `ranger-example.SKILL.md`, `_index (1).md` — only needed if you use them; not read by the app.

---

## 4. Summary: minimum to re-upload for features to work

| What | Count | Destination |
|------|-------|-------------|
| Skill files | **18** | `public/skills/agentprivacy/<filename>` |
| Persona template files | **16** | `public/persona/<filename>` |

**Total: 34 files.** Use the exact filenames in the tables above so the app and any scripts can place them without duplicates.

---

*Last updated after removal of previous persona and skills .md files. Use this list when adding the new package.*
