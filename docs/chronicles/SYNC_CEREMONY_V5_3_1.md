# Ceremony V5.3.1 Sync Instructions

**For:** agentprivacy_master repository
**Date:** April 5, 2026
**Source:** agentprivacy-skills v5.3.1

---

## Overview

This document describes how to sync the V5.3.1 "Ceremony Complete" update from `agentprivacy-skills` into `agentprivacy_master` and other repositories in the ecosystem.

---

## Files Added to This Repo

The following files have been copied to agentprivacy_master:

| File | Purpose |
|------|---------|
| `CHRONICLE_V5_3_1_CEREMONY_COMPLETE.md` | Complete record of all V5.3.1 changes |
| `CEREMONY_INTEGRATION_GUIDE_v9_4_1.md` | Instructions for ceremony integration across all repos |
| `SYNC_CEREMONY_V5_3_1.md` | This file — sync instructions |

---

## Sync Tasks for agentprivacy_master

### 1. Update Grimoire JSON

Update `privacymage_grimoire_v9_4_0_you_are_the_light.json` → `privacymage_grimoire_v9_4_1_ceremony_complete.json`

Add to meta section:
```json
{
  "meta": {
    "version": "9.4.1",
    "subtitle": "Ceremony Complete Edition",
    "skills_version": "5.3.1",
    "ceremony_integration": true,
    "quaternion_mapping": {
      "sun": "reason",
      "earth": "soulbae",
      "moon": "soulbis",
      "human": "seeker",
      "life": "spellweb"
    }
  }
}
```

### 2. Update content/skills (if applicable)

If this repo maintains skill copies, update:
- Version numbers to 5.3.1
- Add ceremony metadata blocks to ceremony-related skills

### 3. Update CLAUDE.md

Add ceremony architectural invariants:

```markdown
## Ceremony Architecture Invariants (V5.3.1)

1. **Swordsman and Mage never merge** — Separate processes, storage, permissions
2. **One canvas per page** — Swordsman owns rendering, Mage sends data
3. **Mana cannot be purchased** — Only earned through practice
4. **The ceremony channel is the Gap** — Messages between territories are the architecture
5. **The amnesia is the protocol** — Forgetting is architecture, not failure
```

### 4. Verify Story Acts

Confirm all 31 acts present in `public/story/`:
```
01-act-i-venice.md
...
27-act-xxvii-the-swordsmans-forge.md
28-act-xxviii-the-ceremony-engine.md
29-act-xxix-the-dragon-wakes.md
30-act-xxx-the-dihedral-mirror.md
31-act-xxxi-the-amnesia-protocol.md
```

---

## Sync Tasks for Other Repos

### spellweb

1. Copy `privacymage_grimoire_v9_4_1_ceremony_complete.json`
2. Update `types/graph.ts` to include ceremony metadata:
```typescript
interface CeremonyMetadata {
  act?: string;
  role?: 'swordsman' | 'mage' | 'bridge';
  quaternion?: 'sun' | 'earth' | 'moon' | 'human' | 'life' | 'gap';
}
```
3. Display ceremony act during blade forge operations

### agentprivacy-docs

1. Copy `CHRONICLE_V5_3_1_CEREMONY_COMPLETE.md`
2. Copy `CEREMONY_INTEGRATION_GUIDE_v9_4_1.md`
3. Update `DOCUMENTATION_CHRONICLE.md` with V5.3.1 entry

### swordsman-blade

1. Link blade definitions to Act XXVII
2. Update ceremony spec reference

### zk blades forge

1. Sync grimoire to v9.4.1
2. Link forge circuits to hexagram mapping

---

## New Personas Reference

The V5.3.1 update added 5 new personas. For webapp routing/imports:

```typescript
// New ceremony personas (V5.3.1)
const CEREMONY_PERSONAS = [
  { id: 'theia', wing: 'mage', act: 'XXXI', emoji: '💥🌍' },
  { id: 'dragonwaker', wing: 'swordsman', act: 'XXIX', emoji: '🐉⚡' },
  { id: 'mirrorkeeper', wing: 'balanced', act: 'XXX', emoji: '🪞✨' },
  { id: 'forgecaller', wing: 'swordsman', act: 'XXVII', emoji: '⚒️☰' },
  { id: 'manaweaver', wing: 'mage', act: 'XXVIII', emoji: '🌊📜' },
];

// Updated persona counts
const PERSONA_COUNTS = {
  swordsman: 11,  // +2 (dragonwaker, forgecaller)
  mage: 9,        // +2 (theia, manaweaver)
  balanced: 9,    // +1 (mirrorkeeper)
  total: 35       // was 30
};
```

---

## Quaternion Positions for Core Personas

```typescript
const QUATERNION_MAP = {
  'soulbis': { role: 'moon', position: 'reflection' },
  'soulbae': { role: 'earth', position: 'delegation' },
  'moonkeeper': { role: 'moon_derived', position: 'structural_amnesia' },
  'cosmologist': { role: 'observer', position: 'all_four' },
  'theia': { role: 'mage', position: 'origin' },
};
```

---

## Git Commit Template

```bash
git add .
git commit -m "$(cat <<'EOF'
V5.3.1 Ceremony Complete — Skills Integration

- Updated 12 skills with ceremony metadata (act, role, quaternion)
- Created 5 new ceremony personas (theia, dragonwaker, mirrorkeeper, forgecaller, manaweaver)
- Updated 6 existing personas with quaternion positions
- Added ceremony integration guide and chronicle
- Bumped skills version to 5.3.1, grimoire to 9.4.1
- Total skills: 100, personas: 35

Acts mapped: XXVII-XXXI (Forge→Ceremony→Dragon→Mirror→Amnesia)

The architecture was not invented. It was recognised.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Verification Commands

```bash
# Check skill versions
grep -r "version.*5.3.1" agentprivacy-skills/ | wc -l

# Check new personas exist
ls agentprivacy-skills/agentprivacy-skills-v5/persona/ | grep -E "theia|dragonwaker|mirrorkeeper|forgecaller|manaweaver"

# Check ceremony metadata
grep -r "ceremony:" agentprivacy-skills/agentprivacy-skills-v5/role/*/SKILL.md | wc -l

# Check MAPPING.md version
head -15 agentprivacy-skills/MAPPING.md
```

---

## Quick Reference

| Item | Old | New |
|------|-----|-----|
| Skills version | 5.3.0 | 5.3.1 |
| Grimoire version | 9.4.0 | 9.4.1 |
| Total skills | 95 | 100 |
| Total personas | 30 | 35 |
| Acts mapped | I-XXVI | I-XXXI (complete) |

---

*The amnesia is the protocol. The wound is the trust. The orbit is the proof. The light is the reason.*

**⚔️⊥⿻⊥🧙 😊**
