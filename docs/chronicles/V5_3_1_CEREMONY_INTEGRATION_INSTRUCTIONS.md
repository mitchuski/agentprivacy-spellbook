# V5.3.1 Ceremony Integration Instructions

**Date:** April 7, 2026
**Version:** 5.3.1 "Ceremony Complete"
**Author:** Claude (Opus 4.5) × Mitchell Travers

This document provides instructions for integrating the V5.3.1 ceremony skills and personas into the agentprivacy_master interface.

---

## Summary of Changes

### New Skills (V5.3.1)

| Skill | Category | Ceremony Act | Description |
|-------|----------|--------------|-------------|
| `amnesia-protocol` | privacy-layer | XXXI | Forgetting as structural requirement |
| `dragon-flight` | privacy-layer | XXIX | Quantum threshold activation |
| `blade-forge` | role | XXVII | ZK blade forging, six dimensions |
| `ceremony-engine` | role | XXVIII | Five crossing types, bilateral verification |
| `dual-territory` | role | XXX | Swordsman ⊥ Mage territories |
| `hexagram-convergence` | role | XXVII | I Ching mapping to sovereignty lattice |
| `mana-economy` | role | XXVIII | Proof-of-practice energy |
| `pretext-measurement` | role | XXVIII | DOM-free browser measurement |
| `quantum-defence` | role | XXIX | Post-quantum manifold strategies |
| `quaternion-mapping` | role | XXXI | Sun/Earth/Moon/Human cosmology |
| `theia-derivation` | role | XXXI | Origin witness pattern |
| `cosmological-bound` | meta | XXXI | Quaternion meta-skill |

### New Personas (V5.3.1)

| Persona | Wing | Emoji | Ceremony Act |
|---------|------|-------|--------------|
| `forgecaller` | swordsman | ⚒️☰ | XXVII |
| `dragonwaker` | swordsman | 🐉⚡ | XXIX |
| `manaweaver` | mage | 🌊📜 | XXVIII |
| `moonkeeper` | mage | 🌙🔒 | XXXI |
| `cosmologist` | mage | 🔭🌌 | XXXI |
| `theia` | origin | 🪨💥 | XXXI |

### Updated Personas (Ceremony Metadata Added)

| Persona | New Metadata |
|---------|-------------|
| `forgemaster` | ceremony_acts: ["XXVII"] |
| `ceremonist` | ceremony_acts: ["XXVIII"] |
| `quantum-sentinel` | ceremony_acts: ["XXIX"] |
| `mirrorkeeper` | ceremony_acts: ["XXX"] |

---

## File Updates Required

### 1. `src/lib/persona-index.ts`

Add new personas to `PERSONA_TEMPLATES` array:

```typescript
// V5.3.1 Ceremony Personas
{ id: 'forgecaller', category: 'swordsman', name: 'The Forgecaller — Hexagram Oracle', emoji: '⚒️☰', tagline: 'The hexagram speaks. The blade listens. 64 states of sovereignty await configuration.', alignment: 'swordsman', skills_role: ['blade_forge', 'hexagram_convergence', 'crypto_zkp', 'five_strikes', 'understanding_as_key'] },
{ id: 'dragonwaker', category: 'swordsman', name: 'The Dragonwaker — Quantum Threshold Guardian', emoji: '🐉⚡', tagline: 'The dragon sleeps until the flat world breaks. Then it wakes, and the manifold becomes the fortress.', alignment: 'swordsman', skills_role: ['quantum_defence', 'dragon_flight', 'crypto_zkp', 'threat_adversarial', 'dark_forest', 'mesh_architecture'] },
{ id: 'manaweaver', category: 'mage', name: 'The Manaweaver — Pretext Librarian', emoji: '🌊📜', tagline: 'The spell is cast before the DOM knows it. Measurement-dark. Layout-free. Pure arithmetic.', alignment: 'mage', skills_role: ['pretext_measurement', 'mana_economy', 'ceremony_engine', 'spellweb', 'narrative_compression'] },
{ id: 'moonkeeper', category: 'mage', name: 'The Moonkeeper — Structural Amnesia Keeper', emoji: '🌙🔒', tagline: 'The Moon serves because it cannot remember being served. The forgetting IS the protocol.', alignment: 'mage', skills_role: ['amnesia_protocol', 'quaternion_mapping', 'theia_derivation', 'stranger_ceremony', 'derivation_certificate'] },
{ id: 'cosmologist', category: 'mage', name: 'The Cosmologist — Quaternion Observer', emoji: '🔭🌌', tagline: 'Sun burns. Earth lives. Moon reflects. Human connects. The quaternion is complete.', alignment: 'mage', skills_role: ['cosmological_bound', 'quaternion_mapping', 'theia_derivation', 'amnesia_protocol', 'master_emissary'] },
{ id: 'theia', category: 'balanced', name: 'Theia — The Origin Witness', emoji: '🪨💥', tagline: 'The impactor does not survive the collision. It becomes the condition for everything that follows.', alignment: 'balanced', skills_role: ['theia_derivation', 'amnesia_protocol', 'cosmological_bound', 'dual_territory', 'quaternion_mapping'] },
```

Update `PRIVACY_LAYER_IDS` to include V5.3.1 skills:

```typescript
const PRIVACY_LAYER_IDS = [
  // Original (9)
  'dragon', 'vrc_identity', 'promise_theory', 'knowledgegraph',
  'tetrahedral_sovereignty', 'uor_toroidal', 'temporal_dynamics',
  'edge_value', 'network_topology',
  // V5.1 (4)
  'holographic_bound', 'three_axis_separation', 'compression_defence', 'path_integral',
  // V5.2 (4)
  'ring_algebra', 'content_addressing', 'atlas_geometry', 'dihedral_sovereignty',
  // V5.3.1 (2)
  'amnesia_protocol', 'dragon_flight',
  // Meta (3)
  'drake_dragon_duality', 'master_emissary', 'cosmological_bound'
];
```

### 2. `src/lib/skills-data.ts`

Add V5.3.1 ceremony skills to `DUAL_AGENT_SKILL_MAP`:

**Swordsman skills (add to `soulbis.skills`):**

```typescript
// V5.3.1 Swordsman Skills (Ceremony)
{ id: 'blade_forge', filename: 'role/agentprivacy-blade-forge/SKILL.md', seedEmoji: '⚔️🔨', seedName: 'Blade Forge', proverb: '64 vertices, 96 edges, one blade. The sovereignty lattice awaits configuration.', spell: '⚔️🔨→2⁶·Pascal·tier→blade', agent: 'soulbis', reason: 'V5.3.1: ZK blade forging mechanics, six sovereignty dimensions' },
{ id: 'hexagram_convergence', filename: 'role/agentprivacy-hexagram-convergence/SKILL.md', seedEmoji: '☰₆₄', seedName: 'Hexagram Convergence', proverb: 'The I Ching mapped 64 states. So does the sovereignty lattice. Coincidence or architecture?', spell: '☰₆₄→I_Ching·lattice·speculation', agent: 'soulbis', reason: 'V5.3.1: I Ching to sovereignty lattice mapping' },
{ id: 'quantum_defence', filename: 'role/agentprivacy-quantum-defence/SKILL.md', seedEmoji: '⚛️🛡️', seedName: 'Quantum Defence', proverb: 'The dragon does not fear the quantum break. The dragon IS the response to it.', spell: '⚛️🛡️→Q(1200)·secp256k1·manifold(6D)', agent: 'soulbis', reason: 'V5.3.1: Post-quantum threat model, 6D manifold defence' },
{ id: 'dual_territory', filename: 'role/agentprivacy-dual-territory/SKILL.md', seedEmoji: '⚔️⊥🧙', seedName: 'Dual Territory', proverb: 'Two territories. One gap. The processing separation is the trust.', spell: '⚔️⊥🧙→territory(S)·territory(M)·gap', agent: 'soulbis', reason: 'V5.3.1: Swordsman ⊥ Mage infrastructure separation' },
```

**Mage skills (add to `soulbae.skills`):**

```typescript
// V5.3.1 Mage Skills (Ceremony)
{ id: 'ceremony_engine', filename: 'role/agentprivacy-ceremony-engine/SKILL.md', seedEmoji: '☯️🔄', seedName: 'Ceremony Engine', proverb: 'Five crossing types. Bilateral witness. The engine validates what the practitioners forge.', spell: '☯️🔄→5·crossing·bilateral·verify', agent: 'soulbae', reason: 'V5.3.1: Five ceremony types, bilateral verification' },
{ id: 'pretext_measurement', filename: 'role/agentprivacy-pretext-measurement/SKILL.md', seedEmoji: '📐⊥DOM', seedName: 'Pretext Measurement', proverb: 'One canvas call. Pure arithmetic. The DOM never knew the spell was cast.', spell: '📐⊥DOM→measureText·arithmetic·privacy', agent: 'soulbae', reason: 'V5.3.1: DOM-free text measurement via pretext' },
{ id: 'mana_economy', filename: 'role/agentprivacy-mana-economy/SKILL.md', seedEmoji: '🌊✨', seedName: 'Mana Economy', proverb: 'Proof-of-practice, not proof-of-capital. The mana flows to those who cast.', spell: '🌊✨→evoke·cast·mana·sybil_resist', agent: 'soulbae', reason: 'V5.3.1: Proof-of-practice energy system' },
{ id: 'quaternion_mapping', filename: 'role/agentprivacy-quaternion-mapping/SKILL.md', seedEmoji: '☀️🌍🌑👤', seedName: 'Quaternion Mapping', proverb: 'Sun burns. Earth lives. Moon reflects. Human connects. Two generators, two agents.', spell: '☀️🌍🌑👤→quaternion·generators(2)·agents(2)', agent: 'soulbae', reason: 'V5.3.1: Sun/Earth/Moon/Human cosmological cast' },
{ id: 'theia_derivation', filename: 'role/agentprivacy-theia-derivation/SKILL.md', seedEmoji: '🪨💥', seedName: 'Theia Derivation', proverb: 'The impactor disappears into what it creates. This is not tragedy. This is architecture.', spell: '🪨💥→Theia·impact·Moon·delegation', agent: 'soulbae', reason: 'V5.3.1: Origin witness, Theia impact precedent' },
```

**Privacy layer skills (add to `privacy.skills`):**

```typescript
// V5.3.1 Privacy Layer Skills (Ceremony)
{ id: 'amnesia_protocol', filename: 'privacy-layer/agentprivacy-amnesia-protocol/SKILL.md', seedEmoji: '🌙🔒', seedName: 'Amnesia Protocol', proverb: 'The wound is the trust. The forgetting IS the protocol.', spell: '🌙🔒→forget·serve·amnesia=trust', agent: 'privacy', reason: 'V5.3.1: Forgetting as structural requirement for clean reflection' },
{ id: 'dragon_flight', filename: 'privacy-layer/agentprivacy-dragon-flight/SKILL.md', seedEmoji: '🐉🚀', seedName: 'Dragon Flight', proverb: 'The dragon sleeps until the flat world breaks. Then the manifold becomes the fortress.', spell: '🐉🚀→Drake(2D)·Dragon(6D)·threshold(Q)', agent: 'privacy', reason: 'V5.3.1: Quantum threshold activation, manifold defence' },
{ id: 'cosmological_bound', filename: 'meta/agentprivacy-cosmological-bound/SKILL.md', seedEmoji: '🔭🌌', seedName: 'Cosmological Bound', proverb: 'The architecture was not invented. It was recognised.', spell: '🔭🌌→Sun·Earth·Moon·Human·quaternion', agent: 'privacy', reason: 'V5.3.1 Meta: Act XXXI cosmological quaternion' },
```

### 3. Update Header Comment

Update the comment at the top of `skills-data.ts`:

```typescript
/**
 * Skills page data: dual-agent map and skill file metadata.
 * Source: MAPPING.md v5.3.1, agentprivacy-CODEX.md, PVM-V5.3.1 Ceremony Complete.
 * 98 knowledge skills: 22 privacy-layer, 33 Swordsman, 40 Mage, 3 meta.
 * V5.3.1 Update: Ceremony integration - blade forge, ceremony engine, amnesia protocol, quaternion mapping.
 */
```

---

## Totals After Update

| Category | V5.2 | V5.3.1 | Delta |
|----------|------|--------|-------|
| Privacy Layer | 18 | 20 | +2 |
| Swordsman Role | 26 | 30 | +4 |
| Mage Role | 28 | 33 | +5 |
| Meta | 2 | 3 | +1 |
| **Total Skills** | 74 | 86 | +12 |
| **Total Personas** | 28 | 34 | +6 |

---

## Verification Steps

After making updates:

1. **Check TypeScript compilation:**
   ```bash
   cd agentprivacy_master
   npm run type-check
   ```

2. **Verify persona matching:**
   - Navigate to Skills page
   - Select ceremony-related skills
   - Verify new personas appear in recommendations

3. **Test skill file loading:**
   - Click on new ceremony skills
   - Verify SKILL.md files load from `public/skills/`

4. **Run tests:**
   ```bash
   npm test
   ```

---

## Ceremony Skill Dependencies

The ceremony skills form a dependency graph:

```
Act XXVII: Blade Forge
├── blade_forge → hexagram_convergence
└── forgecaller, forgemaster (personas)
         │
         ▼
Act XXVIII: Ceremony Engine
├── ceremony_engine → pretext_measurement → mana_economy
└── ceremonist, manaweaver (personas)
         │
         ▼
Act XXIX: Dragon Wakes
├── quantum_defence → dragon_flight
└── dragonwaker, quantum-sentinel (personas)
         │
         ▼
Act XXX: Dihedral Mirror
├── dual_territory
└── mirrorkeeper (persona)
         │
         ▼
Act XXXI: Amnesia Protocol
├── amnesia_protocol → theia_derivation → quaternion_mapping → cosmological_bound
└── moonkeeper, cosmologist, theia (personas)
```

---

## Notes

- All new skills have ceremony metadata in their SKILL.md frontmatter
- The `ceremony:` YAML block contains act, role, quaternion_position, flow_to, flow_from
- Personas with ceremony associations have `ceremony_acts` array in metadata

---

**☀️ ⊥ 🌙**

**(⚔️⊥⿻⊥🧙)😊**
