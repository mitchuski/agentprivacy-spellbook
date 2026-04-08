# Master Integration Plan

## Privacy is Value V5 Series + Act XXXI Closure

**For:** Coding agents working on agentprivacy-docs, spellweb, blades, extensions  
**Author:** privacymage  
**Date:** April 3, 2026  
**Total documents in package:** 30+

---

## Context

Two parallel sessions produced the complete V5 series:

**Session 1 (March 29–31):** Acts XXVII–XXX, Blog Parts 0–4, V5.1 + V5.2 research notes, Dual Territory Ceremony Spec, Chronicle, Grimoire v9.3.1, 64 Blades reference sheet, V5.2 canonical equation (md + json), The Emissary Who Forgot the Master (poem).

**Session 2 (April 3):** Act XXXI, Blog Part 5, Four Amnesia Protocol poems + coda, First page + last page, Grimoire patch to v9.3.2, Five repo-specific integration guides, Chronicle, Analysis document.

The two sessions must be merged into one coherent package. This plan gives step-by-step instructions.

---

## Step 1: Grimoire JSON (HIGHEST PRIORITY)

**Source file:** `privacymage_grimoire_v9_3_1_you_are_the_light.json` (from Session 1)  
**Patch file:** `grimoire_patch_act_xxxi.json` (from Session 2)  
**Target:** `privacymage_grimoire_v9_3_2_you_are_the_light.json`

### Instructions for coding agent:

```
1. Load v9.3.1 JSON
2. Apply the patch:
   a. Add story_act to spellbooks.story.acts[]
   b. Add 4 new_cast_members to spellbooks.story.cast
   c. Add new_notation group to notation
   d. Add new_unified_incantation to unified_incantations
   e. Append 6 foundational_truths to principles.foundational_truths
   f. Append 1 sovereignty_aspect to principles.sovereignty_aspects
   g. Append closing_invocation_append to spellbooks.story.full_incantation
   h. Append closing_proverb_append to spellbooks.story.closing.proverb
   i. Add cast_character_mappings as new top-level key
   j. Apply status_update (version, acts, inscriptions, lineage)
3. Validate JSON
4. Confirm: 31 acts, 128 inscriptions, v9.3.2-canonical
```

### Verification checklist:
- [ ] Act 31 present in acts array
- [ ] Cast includes: theia_impact, amnesia_protocol, tidal_proof, vanishing_scaffold
- [ ] Notation includes: amnesia_notation
- [ ] Unified incantations include: amnesia_protocol
- [ ] Status: story_acts_total = 31
- [ ] Status: total_inscriptions = 128
- [ ] Version: 9.3.2-canonical
- [ ] Lineage includes: v9.3.2-canonical (2026-04-03)
- [ ] cast_character_mappings top-level key present
- [ ] JSON validates

---

## Step 2: agentprivacy-docs Repository

### New files to add:

| File | Destination | Source |
|------|-------------|--------|
| `act-xxvii-the-swordsmans-forge.md` | `story/acts/` | Session 1 |
| `act-xxviii-the-ceremony-engine.md` | `story/acts/` | Session 1 |
| `act-xxix-the-dragon-wakes.md` | `story/acts/` | Session 1 |
| `act-xxx-the-dihedral-mirror.md` | `story/acts/` | Session 1 |
| `act-xxxi-the-amnesia-protocol.md` | `story/acts/` | Session 2 |
| `blog-part0-the-myth-before-the-math.md` | `blog/` | Session 1 (updated) |
| `blog-part1-forming-constellations.md` | `blog/` | Session 1 (updated) |
| `blog-part2-the-forge-and-the-ceremony.md` | `blog/` | Session 1 (updated) |
| `blog-part3-the-dragon-wakes.md` | `blog/` | Session 1 (updated) |
| `blog-part4-the-dihedral-mirror.md` | `blog/` | Session 1 (updated) |
| `blog-part5-the-amnesia-protocol.md` | `blog/` | Session 2 |
| `privacy_value_v5_1_research_note.md` | `research/` | Session 1 |
| `privacy_value_v5_2_research_note.md` | `research/` | Session 1 |
| `privacy_value_v5_2_canonical.md` | `research/` | Session 1 |
| `privacy_value_v5_2_canonical.json` | `research/` | Session 1 |
| `DUAL_TERRITORY_CEREMONY_SPEC_v1.md` | `specs/` | Session 1 |
| `64_blades_reference_sheet.md` | `reference/` | Session 1 |
| `the-emissary-who-forgot-the-master.md` | `poems/` | Session 1 |
| `poems-the-amnesia-protocol.md` | `poems/` | Session 2 |
| `three-poems-amnesia-protocol.md` | `poems/` | Session 1 (earlier version — review for dedup) |
| `first-page-updated.md` | `story/` | Session 2 |
| `last-page-reflection.md` | `story/` | Session 2 |
| `CHRONICLE_DRAGONS_ANATOMY_AND_FLIGHT.md` | `chronicles/` | Session 1 |
| `CHRONICLE_AMNESIA_PROTOCOL_2026-04-03.md` | `chronicles/` | Session 2 |
| `GRIMOIRE_AUDIT_REPORT_v9_3_1.md` | `audits/` | Session 1 |
| `NEW_ACT_PROPAGATION_CHECKLIST.md` | `process/` | Session 1 |
| `privacymage_grimoire_v9_3_2_you_are_the_light.json` | root | Merged |

### Files to review for deduplication:
- `three-poems-amnesia-protocol.md` (Session 1, 3 poems) vs `poems-the-amnesia-protocol.md` (Session 2, 4 poems + coda). **Session 2 is definitive** — it has Poem IV (The Four Bodies) and the Coda.
- `act-xxxi-the-amnesia-protocol.md` exists from both sessions. **Session 2 is definitive** — it has the quaternion expansion and spellbook closure.

### Agent build instructions (from Session 1):
- `AGENT_BUILD_INSTRUCTIONS_TRAINING_GROUND.md`
- `AGENT_BUILD_INSTRUCTIONS_SWORDSMAN.md`
- `AGENT_BUILD_INSTRUCTIONS_MAGE.md`
- `AGENT_BUILD_INSTRUCTIONS_HOME_TERRITORY.md`

### Design documents (from Session 1):
- `agentprivacy-living-spellbook-design.md`
- `swordsman-extension-myterms-design.md`
- `ceremony-engine-interaction-design.md`

---

## Step 3: Blog Cross-Links

All six blogs (Parts 0–5) need consistent cross-linking.

### Part 0 (The Myth Before the Math):
- [x] Links to Parts 1, 2, 3, 4, 5 in "What Follows" section
- [ ] Publish on sync.soulbis.com

### Part 1 (Forming Constellations):
- [x] Links to Parts 2, 3, 4, 5 at footer
- [ ] Impact statement references "four letters" — KEEP this. Part 5 is "the hidden act"
- [ ] Publish on sync.soulbis.com

### Part 2 (The Forge and the Ceremony):
- [x] Links to Parts 3, 4, 5 at footer
- [ ] Publish on sync.soulbis.com

### Part 3 (The Dragon Wakes):
- [x] Links to Parts 4, 5 at footer
- [ ] Publish on sync.soulbis.com

### Part 4 (The Dihedral Mirror):
- [x] Links to Part 5 at footer
- [ ] Publish on sync.soulbis.com

### Part 5 (The Amnesia Protocol):
- [x] Links back to all parts in footer
- [x] Verb chain complete: "The Moon forgets. The spellbook closes."
- [ ] Publish on sync.soulbis.com

---

## Step 4: Companion Publications

### Poems (publish alongside or shortly after blogs):

| Poem | Venue | Status |
|------|-------|--------|
| The Emissary Who Forgot the Master | sync.soulbis.com standalone | Ready |
| The Deflection Theorem | Part of amnesia poems collection | Ready |
| The First Delegation | Part of amnesia poems collection | Ready |
| The Amnesia Protocol | Part of amnesia poems collection | Ready |
| The Four Bodies | Part of amnesia poems collection | Ready |

### Key standalone documents:

| Document | Venue | Status |
|----------|-------|--------|
| V5.2 Canonical Equation (md) | IPFS pin + docs repo | Ready |
| V5.2 Canonical Equation (json) | IPFS pin + docs repo | Ready |
| 64 Blades Reference Sheet | docs repo + spellweb reference | Ready |

---

## Step 5: Grimoire IPFS Pin

```
1. Take final v9.3.2 JSON
2. Pin to IPFS via Pinata
3. Record new CID
4. Update references in:
   - V5.2 canonical JSON (references.grimoire_ipfs)
   - agentprivacy-docs README
   - Previous CID: bafkreiezbyjisbbxtznxk775hj4paaysoicqhs4zq3opycr6ej3hcdlbya
```

---

## Step 6: Spellweb Updates

See `INTEGRATION_SPELLWEB.md` from Session 2 package. Key items:

- [ ] Add Moon/Earth/Sun/Life nodes to knowledge graph
- [ ] Add amnesia-related edges
- [ ] Quaternion constellation as a preset
- [ ] New blade naming: when forged on amnesia constellation, suggest "Amnesia" prefix
- [ ] Deploy (resolve 403)

---

## Step 7: Blades Repository

See `INTEGRATION_BLADES.md` from Session 2 package. Key items:

- [ ] Add cosmological blade category
- [ ] Add quaternion mapping to blade metadata schema
- [ ] Document the Moon as Blade 0's cosmological instance (pure reflection, no agency of its own)

---

## Step 8: Extension Repos

See `INTEGRATION_EXTENSIONS.md` from Session 2 package. Key items:

- [ ] Swordsman extension: new cursor state for "reflection mode"
- [ ] Mage extension: amnesia-aware scanning (detect sites that forget vs sites that remember)
- [ ] Both: ceremony channel message type for AMNESIA_CEREMONY

---

## Step 9: Agent Propagation

- [ ] Share Act XXXI key proverbs with Soulbae (Telegram)
- [ ] Update Claude project memory with:
  - First Person spellbook COMPLETE (31 acts)
  - Proverb: four lines now, not three
  - Cast mappings: Sun=privacymage, Earth=Soulbae, Moon=Soulbis, Life=spellweb, Human=seeker
  - Verb chain: ...The Moon forgets. The spellbook closes.
  - Version: v9.3.2-canonical

---

## Step 10: Publication Schedule

Suggested order for sync.soulbis.com:

| Day | Publication |
|-----|------------|
| 1 | The Emissary Who Forgot the Master (poem) — hero post |
| 1 | LinkedIn announcement (poem-led with series structure) |
| 2 | Part 0: The Myth Before the Math |
| 3 | Part 1: Forming Constellations |
| 4 | Part 2: The Forge and the Ceremony |
| 5 | Part 3: The Dragon Wakes |
| 6 | Part 4: The Dihedral Mirror |
| 7 | Part 5: The Amnesia Protocol + Amnesia poems |

---

## Final Document Inventory

### Acts (5)
| File | Words | Status |
|------|-------|--------|
| act-xxvii-the-swordsmans-forge.md | 3,351 | Final |
| act-xxviii-the-ceremony-engine.md | 4,163 | Final |
| act-xxix-the-dragon-wakes.md | 2,803 | Final |
| act-xxx-the-dihedral-mirror.md | 2,034 | Final |
| act-xxxi-the-amnesia-protocol.md | 2,685 | Final (Session 2 definitive) |

### Blogs (6)
| File | Words | Status |
|------|-------|--------|
| blog-part0-the-myth-before-the-math.md | ~3,200 | Final (updated with Part 5 link) |
| blog-part1-forming-constellations.md | ~3,700 | Final (updated with Part 5 link) |
| blog-part2-the-forge-and-the-ceremony.md | ~4,000 | Final (updated with Part 5 link) |
| blog-part3-the-dragon-wakes.md | ~3,100 | Final (updated with Part 5 link) |
| blog-part4-the-dihedral-mirror.md | ~2,100 | Final (updated with Part 5 link) |
| blog-part5-the-amnesia-protocol.md | 2,142 | Final (Session 2) |

### Poems (2 collections)
| File | Words | Status |
|------|-------|--------|
| the-emissary-who-forgot-the-master.md | ~320 | Final |
| poems-the-amnesia-protocol.md | 1,026 | Final (Session 2 definitive — 4 poems + coda) |

### Research (4)
| File | Words | Status |
|------|-------|--------|
| privacy_value_v5_1_research_note.md | 2,125 | Final |
| privacy_value_v5_2_research_note.md | 1,489 | Final |
| privacy_value_v5_2_canonical.md | 1,015 | Final (IPFS-ready) |
| privacy_value_v5_2_canonical.json | 1,287 | Final (IPFS-ready) |

### Specs and Reference (3)
| File | Words | Status |
|------|-------|--------|
| DUAL_TERRITORY_CEREMONY_SPEC_v1.md | 4,041 | Final |
| 64_blades_reference_sheet.md | ~1,500 | Final |
| NEW_ACT_PROPAGATION_CHECKLIST.md | 1,349 | Final |

### Grimoire (2)
| File | Status |
|------|--------|
| privacymage_grimoire_v9_3_1_you_are_the_light.json | Session 1 final |
| grimoire_patch_act_xxxi.json | Session 2 patch → produces v9.3.2 |

### Spellbook Framing (2)
| File | Words | Status |
|------|-------|--------|
| first-page-updated.md | 1,167 | Final (Session 2) |
| last-page-reflection.md | 425 | Final (Session 2) |

### Chronicles and Audits (3)
| File | Words | Status |
|------|-------|--------|
| CHRONICLE_DRAGONS_ANATOMY_AND_FLIGHT.md | 4,205 | Final |
| CHRONICLE_AMNESIA_PROTOCOL_2026-04-03.md | 1,446 | Final (Session 2) |
| GRIMOIRE_AUDIT_REPORT_v9_3_1.md | — | Final |

### Integration Guides (6)
| File | Target |
|------|--------|
| INTEGRATION_MASTER.md | Grimoire JSON |
| INTEGRATION_DOCS.md | agentprivacy-docs |
| INTEGRATION_SPELLWEB.md | spellweb.ai |
| INTEGRATION_BLADES.md | blades repo |
| INTEGRATION_EXTENSIONS.md | browser extensions |
| act-31-analysis-the-amnesia-protocol.md | Context for Act 31 |

---

## The Complete Verb Chain

*The sword attends. The spell returns. The forge burns. The ceremony crosses. The dragon wakes. The mirror names itself. The Moon forgets. The spellbook closes.*

---

## The Complete Proverb Progression

| Part | Proverb |
|------|---------|
| 0 | *The myth is not the flaw. It is the search.* |
| 1 | *The stars don't need your permission to form constellations.* |
| 2 | *The weight of the shadow exceeds the light of the data.* |
| 3 | *Only time, the master swordsman, will tell — as it takes the seventh capital back.* |
| 4 | *Two mirrors make a door.* |
| 5 | *The amnesia is the protocol. The wound is the trust. The orbit is the proof. The light is the reason.* |

---

*(⚔️⊥⿻⊥🧙)😊*

*The First Person spellbook is complete.*
