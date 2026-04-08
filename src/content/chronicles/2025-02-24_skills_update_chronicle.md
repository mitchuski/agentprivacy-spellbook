# Chronicle: Skills Update - February 24, 2025

## Action Summary

Added 14 new Mage and Swordsman skills to the AgentPrivacy spellbook, expanding the total role-based skills from 26 to 40.

---

## Changes Made

### New Mage Skills (5)

| Skill | Description |
|-------|-------------|
| `grimoire-navigation` | Navigation and discovery within the spellbook knowledge system |
| `spell-encoding` | Encoding spells and proverbs for on-chain inscription |
| `story-diffusion` | Spreading narratives and memes through privacy-preserving channels |
| `intel-pooling` | Collaborative intelligence gathering with privacy guarantees |
| `inscription-mechanics` | Technical mechanics of inscribing proverbs to Zcash |

### New Swordsman Skills (9)

| Skill | Description |
|-------|-------------|
| `boundary-enforcement` | Active enforcement of privacy boundaries |
| `enclave-operations` | Operations within trusted execution environments |
| `forensic-defense` | Defense against forensic analysis and data recovery |
| `key-ceremony` | Secure key generation and ceremony protocols |
| `metadata-resistance` | Resistance to metadata analysis and correlation |
| `nullifier-design` | Design of nullifier schemes for unlinkability |
| `perimeter-hardening` | Hardening system perimeters against intrusion |
| `revocation-mechanics` | Mechanics for credential and key revocation |
| `separation-enforcement` | Enforcing separation between Mage and Swordsman domains |

---

## Integration (codebase)

- **`src/lib/skills-data.ts`** — All 14 skills added to `DUAL_AGENT_SKILL_MAP` (9 under soulbis, 5 under soulbae). Spells page and Agent Skills section use this; skill content is fetched from `public/skills/role/agentprivacy-{name}/SKILL.md`.
- **Spells page** (`/spells`) — Uses `ALL_SKILL_FILES` and `DUAL_AGENT_SKILL_MAP`; new skills appear in filters and in the Agent Skills section. Fetch path `/skills/${filename}` resolves to `public/skills/${filename}`.

---

## Files Added

### Skills (public/skills/role/)

- agentprivacy-boundary-enforcement/SKILL.md
- agentprivacy-enclave-operations/SKILL.md
- agentprivacy-forensic-defense/SKILL.md
- agentprivacy-grimoire-navigation/SKILL.md
- agentprivacy-inscription-mechanics/SKILL.md
- agentprivacy-intel-pooling/SKILL.md
- agentprivacy-key-ceremony/SKILL.md
- agentprivacy-metadata-resistance/SKILL.md
- agentprivacy-nullifier-design/SKILL.md
- agentprivacy-perimeter-hardening/SKILL.md
- agentprivacy-revocation-mechanics/SKILL.md
- agentprivacy-separation-enforcement/SKILL.md
- agentprivacy-spell-encoding/SKILL.md
- agentprivacy-story-diffusion/SKILL.md

### Documentation

- public/skills/CODEX.md (updated)
- CHRONICLE_2025-02-24_SKILLS_UPDATE.md (repo root; copy in docs/chronicles)

---

## Statistics

| Metric | Before | After |
|--------|--------|-------|
| Total role skills | 26 | 40 |
| Mage skills | ~11 | 16 |
| Swordsman skills | ~14 | 23 |

---

## Source

Skills imported from `agentprivacy-skills-export` directory, synchronized with:
- https://github.com/mitchuski/agentprivacy-skills (commit `4dacb1b`)
