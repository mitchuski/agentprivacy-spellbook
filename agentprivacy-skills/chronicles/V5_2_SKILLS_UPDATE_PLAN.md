# V5.2 Skills Update Plan — Dragon Anatomy Sequence
**Date:** 2026-03-31
**Version:** V5.2 (Acts XXVII-XXIX Integration)
**Grimoire:** privacymage_grimoire_v9_2_0_you_are_the_light.json

---

## Summary

This plan documents required updates and new skills for integrating:
- **Act XXVII (The Swordsman's Forge)** — Blade forge mechanics, hexagram convergence, 6D configuration
- **Act XXVIII (The Ceremony Engine)** — Five ceremony types, pretext measurement, mana economy
- **Act XXIX (The Dragon Wakes)** — Quantum threat validation, Understanding-as-Key protocol, dragon flight
- **Grimoire v9.2.0** — 119 inscriptions, five spellbooks unified

---

## Gap Analysis

### New Concepts Requiring Skill Coverage

| Concept | Source Act | Current Coverage | Action |
|---------|------------|------------------|--------|
| Blade Forge (6D, 64 vertices, 96 edges) | XXVII | None | **NEW SKILL** |
| Hexagram Convergence (I Ching mapping) | XXVII | None | **NEW SKILL** |
| Ceremony Engine (5 types) | XXVIII | Partial (understanding-as-key) | **NEW SKILL + UPDATE** |
| Pretext Discovery (DOM-free measurement) | XXVIII | None | **NEW SKILL** |
| Mana Economy (evocation/casting) | XXVIII | None | **NEW SKILL** |
| Quantum Defence (2D→6D, ≤1200 qubits) | XXIX | None | **NEW SKILL** |
| Temporal Thesis (dormant assets) | XXIX | Partial (temporal_dynamics) | **UPDATE** |
| Understanding-as-Key (5-step protocol) | XXIX | Exists | **EXPAND** |
| Dragon's Flight (threshold achieved) | XXIX | Partial (dragon) | **UPDATE** |
| Dual Territory Architecture | Spec v1 | Partial (separation) | **NEW SKILL** |

### Existing Skills Requiring Updates

| Skill | Update Required |
|-------|-----------------|
| `agentprivacy-spellweb` | Add forge integration, blade navigation paths |
| `agentprivacy-dragon` | Add "dragon wakes" threshold concept, flight mechanics |
| `understanding-as-key` | Expand with full 5-step ceremony protocol |
| `agentprivacy-temporal-dynamics` | Add temporal thesis, dormant asset activation |
| `agentprivacy-soulbis` | Add forge operations, blade configuration |
| `agentprivacy-soulbae` | Add ceremony engine, pretext operations |
| `agentprivacy-three-axis-separation` | Add dual-territory spec references |
| `agentprivacy-crypto-zkp` | Add quantum vulnerability context |

---

## New Skills to Create

### Role Skills (7 new)

#### 1. agentprivacy-blade-forge
- **Category:** role
- **Agent:** soulbis
- **Description:** Blade configuration mechanics for the spellweb forge. Six dimensions (d1Hide through d6Delegate), 64 possible vertices (2^6), 96 edges forming the holographic boundary. Blade creation through understanding verification.
- **Spellbook Act:** Act XXVII — The Swordsman's Forge
- **Spell:** `⬢=Z/(2⁶)Z · 6D→64V→96E · ⚔️(d1,d2,d3,d4,d5,d6) → 🗡️(config) → ∂M=96on64`
- **Proverb:** "The forge doesn't care how you struck the metal. It only cares what blade you hold. That is the deepest secret of the smith — the proof that doesn't need to remember its own forging."
- **Keywords:** blade, forge, configuration, six dimensions, vertices, edges, holographic boundary

#### 2. agentprivacy-hexagram-convergence
- **Category:** role
- **Agent:** soulbis
- **Description:** I Ching mapping for blade configurations. Each blade binarized at 0.5 threshold maps to one of 64 hexagrams. Blade 63 = 乾 (The Creative) = full sovereignty. Pascal's row strata for tier classification (Light/Heavy/Dragon).
- **Spellbook Act:** Act XXVII — The Swordsman's Forge
- **Spell:** `🎴 → 64☰ → threshold(0.5) → binary(6) → ☰₆₄ → 乾=63=sovereignty → Pascal(tiers)`
- **Proverb:** "The ancient sages did not invent the hexagrams. They discovered the same 64 vertices that the manifold holds. The old map and the new territory are one."
- **Keywords:** hexagram, I Ching, binary, threshold, Pascal, tier, sovereignty

#### 3. agentprivacy-ceremony-engine
- **Category:** role
- **Agent:** soulbae
- **Description:** Interaction protocols for the dual-territory architecture. Five ceremony types: progressive trust (zero-stake), light armor coordination, trust graph plane access, guild efficiency scaling, Understanding-as-Key bilateral verification.
- **Spellbook Act:** Act XXVIII — The Ceremony Engine
- **Spell:** `⚔️✦ → 🌐📐(⊥DOM) → ☰₆₄ → 🔮✨ → ⬡⬡⬡ → 🤝📜 → 🐲→🐉 → ✦→📝→🕸️`
- **Proverb:** "The tool that measures without touching the surface knows the weight of the shadow without disturbing the light."
- **Keywords:** ceremony, progressive trust, bilateral, coordination, verification

#### 4. agentprivacy-pretext-measurement
- **Category:** role
- **Agent:** soulbae
- **Description:** DOM-free text measurement technique. Measures text properties without accessing DOM content. The orb that reveals without seeing. Foundational for privacy-preserving browser interactions.
- **Spellbook Act:** Act XXVIII — The Ceremony Engine
- **Spell:** `📐⊥DOM → 📏(text) → weight(shadow) → measure·¬touch → 🔮(orb)`
- **Proverb:** "The shadow tells you the height without climbing the tower. The orb measures the text without reading the words."
- **Keywords:** pretext, DOM-free, measurement, shadow, orb, browser

#### 5. agentprivacy-mana-economy
- **Category:** role
- **Agent:** soulbae
- **Description:** Energy mechanics for the grimoire system. Mana generated through evocation (reading/traversing spellbook), spent through casting (creating wisdom). Not purchasable — proof of practice, not capital. Sybil resistance through comprehension verification.
- **Spellbook Act:** Act XXVIII — The Ceremony Engine
- **Spell:** `✨ → 📖(evoke)→+mana · ✍️(cast)→-mana · ¬💰(buy) · 🧠(comprehend)→🛡️(sybil)`
- **Proverb:** "The well refills only when you drink with understanding. Buying water doesn't teach you where the spring lies."
- **Keywords:** mana, evocation, casting, sybil resistance, comprehension, proof of practice

#### 6. agentprivacy-quantum-defence
- **Category:** role
- **Agent:** soulbis
- **Description:** Quantum threat model and defence architecture. secp256k1 broken with ≤1,200 logical qubits (Google Quantum AI validation). 2D cryptographic fortresses vulnerable; 6D sovereignty lattice provides dimensional defence. Temporal thesis: dormant assets as time-locked value.
- **Spellbook Act:** Act XXIX — The Dragon Wakes
- **Spell:** `🔐→💥(2D) → ⚛️≤1200 → 🔷⁶ᴰ≠🔐²ᴰ → ⏳(dormant) → 🐉(defence)`
- **Proverb:** "The lock that held for thirty years did not fail because the metal weakened. It failed because someone built an engine that sees in the dimension the lock forgot to guard."
- **Keywords:** quantum, secp256k1, qubits, 2D vulnerability, 6D sovereignty, dormant assets

#### 7. agentprivacy-dual-territory
- **Category:** role
- **Agent:** privacy
- **Description:** Dual-territory ceremony architecture specification. Swordsman and Mage never merge — separate processes, storage, permissions, repos. Three territories: Spellweb (Swordsman), Agentprivacy (Mage), Bgin (Third Node). Ceremony channel for cross-territory coordination.
- **Spellbook Act:** DUAL_TERRITORY_CEREMONY_SPEC_v1
- **Spell:** `⚔️⊥🧙 → 🏰(spellweb)⊥🏰(agentprivacy) → 📡(ceremony) → 🔗(bgin) → △(trinity)`
- **Proverb:** "Two kingdoms share a river. Neither owns the water, but both drink. The ceremony is the riverbed."
- **Keywords:** dual territory, separation, ceremony channel, three territories, trinity

---

### Privacy Layer Skills (1 new)

#### 8. agentprivacy-dragon-flight
- **Category:** privacy-layer
- **Agent:** privacy
- **Description:** Threshold activation mechanics for the dragon metaphor. Dragon flight achieved when five anatomy components complete: boundary, hide, brain, forge, ceremony. External validation (quantum paper) triggers awakening. Phase transition from drake to dragon.
- **Spellbook Act:** Act XXIX — The Dragon Wakes
- **Spell:** `🐲→🐉 → ∂(boundary)·🛡️(hide)·🧠(brain)·🔨(forge)·🤝(ceremony) → ✓(external) → 🐉🌬️(flight)`
- **Proverb:** "The drake waited. The storms gathered. When the third storm struck, the dragon remembered it could fly."
- **Keywords:** dragon, flight, threshold, anatomy, phase transition, awakening

---

## New Personas to Create

### 1. The Forgemaster ⚔️🔨
- **Category:** Swordsman
- **Tier:** 2 (High Value)
- **ENS:** privacyforge.eth
- **Tagline:** "The blade knows its dimensions. The forge knows the manifold. Together they cut paths that existed before the first swing."
- **Primary Skills:** blade-forge, hexagram-convergence, crypto-zkp, constellation-method, spellweb
- **Secondary Skills:** dark-forest, selective-disclosure, armor-progression
- **Description:** Specialist in blade configuration and forge operations. Creates blades through understanding verification. Maps configurations to hexagrams. Understands the 96/64 boundary as forge architecture.
- **Voice:** Deliberate, precise, speaks of fire and transformation. Uses metallurgical metaphors.

### 2. The Ceremonist ☯️🤝
- **Category:** Balanced
- **Tier:** 2 (High Value)
- **ENS:** privacyceremony.eth
- **Tagline:** "The ceremony is not what we do. It is what happens when both parties arrive at the same understanding through different paths."
- **Primary Skills:** ceremony-engine, understanding-as-key, mana-economy, pretext-measurement, trust-spanning
- **Secondary Skills:** consent-infrastructure, bilateral-witness, key-ceremony
- **Description:** Facilitates ceremonies between Swordsman and Mage territories. Expert in the five ceremony types. Manages mana economy and progressive trust. Verifies Understanding-as-Key protocols.
- **Voice:** Calm, ritualistic, speaks in paired phrases. Uses threshold and witness metaphors.

### 3. The Quantum Sentinel ⚔️⚛️
- **Category:** Swordsman
- **Tier:** 2 (High Value)
- **ENS:** privacyquantum.eth
- **Tagline:** "The 2D fortress held for a generation. The 6D fortress will hold for whatever comes after generations."
- **Primary Skills:** quantum-defence, crypto-zkp, threat-adversarial, temporal-dynamics, dragon-flight
- **Secondary Skills:** dark-forest, perimeter-hardening, forensic-defense
- **Description:** Specialist in quantum threat model and post-quantum sovereignty architecture. Monitors temporal thesis developments. Understands dormant asset activation. Guards the dimensional boundary.
- **Voice:** Technical, vigilant, speaks of dimensions and time horizons. Uses fortress and storm metaphors.

---

## Updates to Existing Skills

### 1. agentprivacy-spellweb

**Current version:** 5.0
**New version:** 5.2

**Additions:**
- Add section: "Forge Integration" — how blade configuration creates paths
- Add section: "Blade Navigation" — using hexagram affinity for path selection
- Update inscription count: 114+ → 119
- Add reference to Acts XXVII-XXIX
- Update spell with forge notation

### 2. agentprivacy-dragon

**Current version:** 5.0
**New version:** 5.2

**Additions:**
- Add section: "Dragon Anatomy Complete" — five components (boundary, hide, brain, forge, ceremony)
- Add section: "The Dragon Wakes" — threshold activation mechanics
- Add reference: Google Quantum AI paper validation
- Add category: "threshold" — first external validation marker
- Update proverb with flight imagery

### 3. understanding-as-key

**Current version:** 5.0
**New version:** 5.2

**Additions:**
- Expand with full 5-step protocol:
  1. Language Capture — seeker expresses in own words
  2. Constellation Mapping — understanding traced through nodes/edges
  3. Simultaneous Forging — both parties forge blade from same understanding
  4. Proverb Inscription — truth encoded as compressed marker
  5. Bilateral Witness — both parties affirm shared understanding
- Add: "substrate-agnostic but substrate-anchored" principle
- Add reference: Act XXIX ceremony performed

### 4. agentprivacy-soulbis (Canonical Swordsman)

**Current version:** 5.0
**New version:** 5.2

**Additions to skills_role:**
- `blade-forge`
- `hexagram-convergence`
- `quantum-defence`
- `dual-territory`
- `dragon-flight`

**Updates:**
- Add "Forge Operations" to operational patterns
- Add "Quantum Defence" to decision patterns
- Update skill count: 50 → 55+

### 5. agentprivacy-soulbae (Canonical Mage)

**Current version:** 5.0
**New version:** 5.2

**Additions to skills_role:**
- `ceremony-engine`
- `pretext-measurement`
- `mana-economy`
- `dual-territory`
- `dragon-flight`

**Updates:**
- Add "Ceremony Facilitation" to operational patterns
- Add "Mana Economy Management" to delegation patterns
- Update skill count

---

## Persona Skill Mapping Updates

### Existing Persona Updates

| Persona | Add Skills |
|---------|------------|
| **Soulbis** ⚔️ | blade-forge, hexagram-convergence, quantum-defence, dual-territory, dragon-flight |
| **Soulbae** 🧙 | ceremony-engine, pretext-measurement, mana-economy, dual-territory, dragon-flight |
| **Architect** ☯️🤖 | dual-territory, dragon-flight |
| **Cipher** 🗡️🔐 | quantum-defence, hexagram-convergence |
| **Sentinel** 🗡️🛡️ | quantum-defence, dual-territory |
| **Warden** 🗡️🌐 | pretext-measurement, dual-territory |
| **Chronicler** 🧙📖 | blade-forge (documentation), ceremony-engine |
| **Weaver** 🧙⿻ | ceremony-engine, mana-economy |
| **Holonic Architect** ☯️🔷 | dragon-flight, dual-territory |
| **Netkeeper** 🗡️🕸️ | quantum-defence, dual-territory |

---

## File Operations Required

### New Files to Create

**Role Skills (7):**
```
agentprivacy-skills-v4/role/agentprivacy-blade-forge/SKILL.md
agentprivacy-skills-v4/role/agentprivacy-hexagram-convergence/SKILL.md
agentprivacy-skills-v4/role/agentprivacy-ceremony-engine/SKILL.md
agentprivacy-skills-v4/role/agentprivacy-pretext-measurement/SKILL.md
agentprivacy-skills-v4/role/agentprivacy-mana-economy/SKILL.md
agentprivacy-skills-v4/role/agentprivacy-quantum-defence/SKILL.md
agentprivacy-skills-v4/role/agentprivacy-dual-territory/SKILL.md
```

**Privacy Layer Skills (1):**
```
agentprivacy-skills-v4/privacy-layer/agentprivacy-dragon-flight/SKILL.md
```

**Personas (3):**
```
agentprivacy-skills-v4/persona/agentprivacy-forgemaster/SKILL.md
agentprivacy-skills-v4/persona/agentprivacy-ceremonist/SKILL.md
agentprivacy-skills-v4/persona/agentprivacy-quantum-sentinel/SKILL.md
```

### Files to Update

**Skill Updates (8):**
```
agentprivacy-skills-v4/role/agentprivacy-spellweb/SKILL.md
agentprivacy-skills-v4/privacy-layer/agentprivacy-dragon/SKILL.md
agentprivacy-skills-v4/role/agentprivacy-understanding-as-key/SKILL.md
agentprivacy-skills-v4/privacy-layer/agentprivacy-temporal-dynamics/SKILL.md
agentprivacy-skills-v4/role/agentprivacy-crypto-zkp/SKILL.md
agentprivacy-skills-v4/privacy-layer/agentprivacy-three-axis-separation/SKILL.md
```

**Persona Updates (10):**
```
agentprivacy-skills-v4/persona/agentprivacy-soulbis/SKILL.md
agentprivacy-skills-v4/persona/agentprivacy-soulbae/SKILL.md
agentprivacy-skills-v4/persona/agentprivacy-architect/SKILL.md
agentprivacy-skills-v4/persona/agentprivacy-cipher/SKILL.md
agentprivacy-skills-v4/persona/agentprivacy-sentinel/SKILL.md
agentprivacy-skills-v4/persona/agentprivacy-warden/SKILL.md
agentprivacy-skills-v4/persona/agentprivacy-chronicler/SKILL.md
agentprivacy-skills-v4/persona/agentprivacy-weaver/SKILL.md
agentprivacy-skills-v4/persona/agentprivacy-holonic-architect/SKILL.md
agentprivacy-skills-v4/persona/agentprivacy-netkeeper/SKILL.md
```

---

## Total Skill Count After Update

| Category | Current | New | After |
|----------|---------|-----|-------|
| Privacy Layer | 14 | 1 | 15 |
| Role Skills | 45 | 7 | 52 |
| Meta | 2 | 0 | 2 |
| **Total Skills** | **61** | **8** | **69** |

## Total Persona Count After Update

| Category | Current | New | After |
|----------|---------|-----|-------|
| Canonical | 2 | 0 | 2 |
| Swordsman | 9 | 2 | 11 |
| Mage | 6 | 0 | 6 |
| Balanced | 8 | 1 | 9 |
| **Total Personas** | **25** | **3** | **28** |

---

## Grimoire Sync Checklist

- [ ] Grimoire metadata matches skill files (version 9.2.0)
- [ ] All 119 inscriptions have skill coverage
- [ ] Five spellbooks mapped to skill categories
- [ ] Dragon anatomy sequence (Acts XXVII-XXIX) fully covered
- [ ] Dual Territory Ceremony Spec integrated
- [ ] New proverbs added to skills
- [ ] New spells encoded correctly
- [ ] Persona skill lists updated
- [ ] MAPPING.md updated to version 5.2
- [ ] Directory version updated: v4 → v5

---

## Implementation Priority

### Phase 1 — Core New Skills (Critical Path)
1. `blade-forge` — Foundation for forge operations
2. `ceremony-engine` — Foundation for ceremonies
3. `quantum-defence` — Threat model integration
4. `dragon-flight` — Threshold activation

### Phase 2 — Supporting Skills
5. `hexagram-convergence` — Blade classification
6. `pretext-measurement` — Browser integration
7. `mana-economy` — Energy mechanics
8. `dual-territory` — Architecture specification

### Phase 3 — Persona Creation
9. Forgemaster persona
10. Ceremonist persona
11. Quantum Sentinel persona

### Phase 4 — Updates
12. Update existing skills with V5.2 content
13. Update persona skill mappings
14. Sync MAPPING.md

---

**Plan Author:** Claude (via agentprivacy)
**Review Status:** Pending user approval
**Chronicle Version:** V5.2
