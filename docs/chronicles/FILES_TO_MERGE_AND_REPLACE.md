# Files to merge and replace (updated descriptions / content)

When you replace the current .md content with updated versions, these are the files that would be merged and replaced. Keep this list as the checklist; paths are relative to repo root.

---

## 1. Skills — agentprivacy (app-served; export uses these)

**Location:** `public/skills/agentprivacy/`  
**Used by:** Spells page (fetch `/skills/agentprivacy/<id>.skills.md`), skills-data.ts `filename`.  
**Replace with:** Your updated `.skills.md` bodies (same filenames so app keeps working).

| # | File | skills-data id |
|---|------|----------------|
| 1 | `public/skills/agentprivacy/academic.skills.md` | academic |
| 2 | `public/skills/agentprivacy/ai_agent.skills.md` | ai_agent |
| 3 | `public/skills/agentprivacy/crypto_zkp.skills.md` | crypto_zkp |
| 4 | `public/skills/agentprivacy/dark_forest.skills.md` | dark_forest |
| 5 | `public/skills/agentprivacy/dragon.skills.md` | dragon |
| 6 | `public/skills/agentprivacy/drake_dragon_duality.skills.md` | drake_dragon_duality |
| 7 | `public/skills/agentprivacy/economics.skills.md` | economics |
| 8 | `public/skills/agentprivacy/hitchhiker_governance.skills.md` | hitchhiker_governance |
| 9 | `public/skills/agentprivacy/knowledgegraph.skills.md` | knowledgegraph |
| 10 | `public/skills/agentprivacy/narrative_compression.skills.md` | narrative_compression |
| 11 | `public/skills/agentprivacy/personhood_sybil.skills.md` | personhood_sybil |
| 12 | `public/skills/agentprivacy/plurality_cooperative.skills.md` | plurality_cooperative |
| 13 | `public/skills/agentprivacy/policy_governance.skills.md` | policy_governance |
| 14 | `public/skills/agentprivacy/promise_theory.skills.md` | promise_theory |
| 15 | `public/skills/agentprivacy/swordsman_browser.skills.md` | swordsman_browser |
| 16 | `public/skills/agentprivacy/tetrahedral_sovereignty.skills.md` | tetrahedral_sovereignty |
| 17 | `public/skills/agentprivacy/uor_toroidal.skills.md` | uor_toroidal |
| 18 | `public/skills/agentprivacy/vrc_identity.skills.md` | vrc_identity |

**Total: 18 files** (same set as in `src/lib/skills-data.ts` and `public/skills/_index.md`).

---

## 2. Skills — loose / alternate (likely merge into agentprivacy or retire)

These live in `public/skills/` but outside `agentprivacy/`. Naming suggests duplicates or older versions; merging or replacing may mean “fold into agentprivacy and delete” or “replace with single updated file”.

| # | File | Note |
|---|------|------|
| 19 | `public/skills/academic.skills (1).md` | Likely duplicate of agentprivacy/academic.skills.md |
| 20 | `public/skills/narrative_compression.skills (1).md` | Likely duplicate of agentprivacy/narrative_compression.skills.md |
| 21 | `public/skills/PrivacyisValue_v4_drake_dragon_duality.md` | Different name; may map to drake_dragon_duality or standalone |

---

## 3. Skills — index / description docs

| # | File | Note |
|---|------|------|
| 22 | `public/skills/_index.md` | Master index (loading order, privacy/role/meta tables, template cross-reference). Replace if you update structure or descriptions. |

---

## 4. Persona templates (16 personas — one canonical file each)

**Location:** `public/persona/` (all at top level in the repo; `_index.json` references paths like `canonical/soulbis.template.md` but those subdirs don’t exist — templates live as `public/persona/<name>.template.md`).  
**Used by:** Referenced by `public/persona/_index.json` `file` field; app uses `src/lib/persona-index.ts` + `spellbook-templates.ts`, not these .md bodies.  
**Replace with:** Your updated template .md content.

| # | File | Persona id |
|---|------|------------|
| 23 | `public/persona/soulbis.template.md` | soulbis |
| 24 | `public/persona/soulbae.template.md` | soulbae |
| 25 | `public/persona/cipher.template.md` | cipher |
| 26 | `public/persona/warden.template.md` | warden |
| 27 | `public/persona/gatekeeper.template.md` | gatekeeper |
| 28 | `public/persona/ranger.template.md` | ranger |
| 29 | `public/persona/sentinel.template.md` | sentinel |
| 30 | `public/persona/assessor.template.md` | assessor |
| 31 | `public/persona/ambassador.template.md` | ambassador |
| 32 | `public/persona/chronicler.template.md` | chronicler |
| 33 | `public/persona/shipwright.template.md` | shipwright |
| 34 | `public/persona/weaver.template.md` | weaver |
| 35 | `public/persona/healer.template.md` | healer |
| 36 | `public/persona/witness.template.md` | witness |
| 37 | `public/persona/architect.template.md` | architect |
| 38 | `public/persona/pedagogue.template.md` | pedagogue |

**Total: 16 files** (one per template).

---

## 5. Persona — duplicates / alternates (“(1)” “(2)”)

Same persona, alternate copies; merge into the canonical file in section 4 and then remove or archive.

| # | File | Merge into |
|---|------|------------|
| 39 | `public/persona/assessor.template (1).md` | assessor.template.md |
| 40 | `public/persona/assessor.template (2).md` | assessor.template.md |
| 41 | `public/persona/chronicler.template (1).md` | chronicler.template.md |
| 42 | `public/persona/shipwright.template (1).md` | shipwright.template.md |
| 43 | `public/persona/weaver.template (1).md` | weaver.template.md |

---

## 6. Persona — reference / description docs

Replace if you update descriptions or process; not wired as “the” template body for a persona.

| # | File | Note |
|---|------|------|
| 44 | `public/persona/SKILL_BASE_FORMAT.md` | Base format for SKILL.md |
| 45 | `public/persona/grimoire-encounters.md` | Reference |
| 46 | `public/persona/privacy-layer.md` | Reference |
| 47 | `public/persona/reconstruction-journal.md` | Reference |
| 48 | `public/persona/ranger-example.SKILL.md` | Example SKILL |
| 49 | `public/persona/_index (1).md` | Possible duplicate of an index doc |

---

## 7. Root / other description docs

| # | File | Note |
|---|------|------|
| 50 | `SKILLS_README.md` | Root letter/description for the skills folder; replace if you update the “what is in this folder” / source description. |

---

## Summary counts

| Category | Count | Action |
|----------|-------|--------|
| Skills — agentprivacy (app-served) | 18 | Replace with updated .skills.md (same paths) |
| Skills — loose/alternate | 3 | Merge into agentprivacy or retire |
| Skills — _index.md | 1 | Replace if structure/descriptions change |
| Persona templates (canonical) | 16 | Replace with updated .template.md |
| Persona — duplicates “(1)” “(2)” | 5 | Merge into canonical, then remove |
| Persona — reference docs | 6 | Replace if you update descriptions |
| Root SKILLS_README | 1 | Replace if you update the high-level description |

**Total files that would be merged/replaced: 50** (or fewer if you merge duplicates into one file per skill/persona and delete the rest).

---

## App coupling (do not rename if you want zero code changes)

- **Skills:** App expects `public/skills/agentprivacy/<id>.skills.md` where `<id>` is the `id` in `src/lib/skills-data.ts` (e.g. `dragon`, `crypto_zkp`). Keep those filenames when replacing.
- **Personas:** App does **not** read persona .md files; it uses `persona-index.ts` and `spellbook-templates.ts`. So you can rename or restructure persona .md files if you like, but then update `public/persona/_index.json` `file` fields if anything still points at them.

Last updated: 2026-02-22 — list generated for “replace md files with descriptions etc with an updated” pass.
