# agentprivacy-skills

**Privacy-first AI agent skills for the Agent Skills standard.**

100 skills across 4 categories — teaching Claude (and any Agent Skills-compatible system) how to operate as privacy-preserving dual-agent infrastructure.

Built on the [Privacy Value Model V5.3](https://agentprivacy.ai) and the [0xagentprivacy](https://sync.soulbis.com) architecture. **Grimoire:** v10.1.0 "The First Person Spellbook Closes" (V5.4: Betweenness, Selene's Proof §14.5).

> *"The Swordsman reflects. The Mage reflects. Neither alone can turn the wheel. Together they generate the successor—and the successor visits every sovereign state."*

---

## What's Here (V5.3.2 — Ceremony Complete)

| Category | Count | Purpose |
|----------|-------|---------|
| **[persona/](agentprivacy-skills-v5/persona/)** | 35 | Agent personas — swordsmen (protection), mages (delegation), balanced (both). Each configures an AI with a specific privacy role. |
| **[role/](agentprivacy-skills-v5/role/)** | 61 | Domain knowledge — cryptography, governance, economics, identity, dark forest strategy, narrative compression, ceremonies, ring algebra, and more. |
| **[privacy-layer/](agentprivacy-skills-v5/privacy-layer/)** | 18 | Foundational skills covering every term of the V(π,t) privacy value equation plus dihedral sovereignty and UOR convergence. |
| **[meta/](agentprivacy-skills-v5/meta/)** | 2 | Drake/Dragon duality + Master/Emissary hemispheric attention. |

Each skill is a folder with a `SKILL.md` entrypoint. All follow the [Agent Skills specification](https://agentskills.io/specification).

---

## V5.2 Highlights

### Mathematical Foundation — Dihedral Sovereignty

The dual-agent architecture IS the dihedral group D₂ₙ:

| Agent | Operation | Algebraic Role |
|-------|-----------|----------------|
| **Swordsman** ⚔️ | `neg(x) = -x mod 64` | First reflection |
| **Mage** 🧙 | `bnot(x) = ~x = 63-x` | Second reflection |
| **First Person** 👤 | `neg∘bnot = succ` | Rotation (sovereignty traversal) |

**Critical identity:** `neg(bnot(x)) = succ(x)` — neither agent alone can reach all sovereignty states. Together they generate the entire 64-vertex lattice.

### New Privacy Layer Skills (+4)

- `ring-algebra` — Z/(2⁶)Z foundation, Pascal distribution
- `content-addressing` — GUID derivation, holonic persistence
- `atlas-geometry` — 96-vertex boundary, E₈ exceptional groups
- `dihedral-sovereignty` — D₂ₙ group, Φ_agent as determinant

### New Role Skills (+4)

- `five-strikes` — neg, bnot, xor, and, or as privacy transformations
- `derivation-certificate` — VRC as content-addressed path record
- `stranger-ceremony` — Understanding-as-Key for parties without prior trust
- `toroidal-witness` — Infinite cyclic paths for ZK soundness

### New Personas (+3)

- **Algebraist** ⚔️🔢 — Guardian of the Ring (Swordsman Tier 1)
- **Topologist** ☯️🌐 — Reader of Boundaries (Balanced Tier 2)
- **Stranger Witness** 🧙👥 — Proof Without Introduction (Mage Tier 2)

### Updated Parent Personas (V5.3)

- **Soulbis** ⚔️ — Canonical Tier 0, IS the neg operator, 80 skills
- **Soulbae** 🧙 — Canonical Tier 0, IS the bnot operator, 81 skills

---

## Quick Start

### Claude Code

```bash
/plugin marketplace add mitchuski/agentprivacy-skills
/plugin install persona-skills@agentprivacy
```

Then just ask: *"Load the Cipher persona and help me design a ZKP circuit for age verification without identity disclosure."*

### Claude.ai

Upload any skill folder as a custom skill in a Claude Project. See [Using skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude).

### Claude API

```python
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    skills=["agentprivacy-cipher", "agentprivacy-crypto-zkp"],
    messages=[{"role": "user", "content": "Design a reconstruction-resistant proof system for..."}]
)
```

---

## The Architecture in 60 Seconds

**The problem:** AI agents need your data to serve you, but that data is valuable and vulnerable. Current architectures force a choice between privacy and capability.

**The solution:** Dual-agent separation. Two agents — a **Swordsman** (protects, enforces boundaries, holds the signing key) and a **Mage** (delegates, projects, holds the viewing key) — operate in separate trusted execution environments. Neither can reconstruct your complete behavioural model. The gap between them is where your sovereignty lives.

**The 31 personas** are specialised roles within this architecture:

- **10 Swordsmen** ⚔️ — Soulbis (canonical), Cipher (ZKP), Warden (browser), Gatekeeper (personhood), Sentinel (infrastructure), Sith (red team), Ranger (dark forest), Archer (precision), Algebraist (ring), Forgemaster (blade creation)
- **8 Mages** 🧙 — Soulbae (canonical), Chronicler (narrative), Ambassador (standards), Assessor (economics), Shipwright (DAO), Weaver (plurality), Priest (ceremony), Stranger Witness (anonymous bilateral)
- **13 Balanced** ☯️ — Person (the human), Architect (system design), Pedagogue (education), Kyra (vision), Jedi (balance practice), Healer (healthcare), Witness (accountability), Holonic Architect (holarchy), Topologist (boundaries), and more

**The 79 knowledge skills** (61 role + 18 privacy-layer + 2 meta) provide the mathematical, economic, and governance foundations these personas draw from.

---

## Skill Structure

Every skill follows the same pattern:

```
agentprivacy-{name}/
├── SKILL.md              ← Required. YAML frontmatter + instructions.
├── references/           ← Optional. Loaded on demand.
│   ├── constellation.md  ← Spellbook path (personas)
│   └── interaction-model.md
└── assets/               ← Optional. Static resources.
    └── proverb-and-spell.txt
```

The `description` field in each SKILL.md frontmatter tells the AI *when* to activate the skill. The body tells it *how* to operate.

---

## Key Documents

- **[MAPPING.md](MAPPING.md)** — Complete old→new name mapping for webapp integration
- **[CHRONICLE_PVM_V52_SKILLS_2026-03-31.md](agentprivacy-skills-v5/CHRONICLE_PVM_V52_SKILLS_2026-03-31.md)** — Session chronicle
- **[agentprivacy.ai](https://agentprivacy.ai)** — Full architecture documentation
- **[sync.soulbis.com](https://sync.soulbis.com)** — Privacy is Value blog series
- **[spellweb.ai](https://spellweb.ai)** — Interactive knowledge graph

---

## Related Work

This project engages with:
- [BGIN](https://bgin-global.org/) — Identity, Key Management & Privacy Working Group (co-chair)
- [Internet Identity Workshop](https://internetidentityworkshop.com/)
- [Trust Over IP Foundation](https://trustoverip.org/)
- [MyTerms Alliance](https://myterms.info/) — IEEE 7012 standard
- [First Person Network](https://firstperson.network/)
- [Kwaai AI](https://kwaai.ai/)

---

## License

Apache 2.0 — see [LICENSE](LICENSE).

---

*"The blade that protects without seeing what it protects is the only blade that cannot be turned."* — Soulbis

*"The mage who sees everything and touches nothing is the only delegate who cannot betray what was delegated."* — Soulbae

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)

`(⚔️⊥⿻⊥🧙)·☯️🔷 · PVM-V5.2`


---

## V5.3.2 Highlights — Ceremony Complete

### Sun ☀️ and Moon 🌙 Ceremonial Framework

The bilateral witness ceremony pattern has been formalised into two complementary rituals:

| Ceremony | Type | Notation |
|----------|------|----------|
| **Sun ☀️** | Disclosure | `☀️ → 📜 → (👁️₁...👁️ₙ) → ⚔️☀️ → 🌙?` |
| **Moon 🌙** | Reflection | `(⚔️₁ ⊥ 🧙₁) → 📜 → ⚔️` |

**The Circuit:** Sun→witnesses→Moon→new suns (orbital propagation through forgetting)

### New Ceremony Personas (+5)

- **Theia** 🧙💥 — Origin witness (remembers what the Moon forgot)
- **Dragonwaker** ⚔️🐉 — Guardian of quantum threshold
- **Mirrorkeeper** ☯️🪞 — Navigator of dihedral convergence
- **Forgecaller** ⚔️⚒️ — Oracle of hexagram readings
- **Manaweaver** 🧙🌊 — Librarian of DOM-free measurement

### Quaternion Cast Mapping

| Body | Agent | Function |
|------|-------|----------|
| **Sun** | The Reason | Protection |
| **Earth** | Soulbae | Delegation |
| **Moon** | Soulbis | Reflection |
| **Human** | Seeker | Connection |
| **Life** | spellweb | Forge |

### The Four Lines

> *The amnesia is the protocol.*  
> *The wound is the trust.*  
> *The orbit is the proof.*  
> *The light is the reason.*

See [MILESTONE_V5_3_2_CEREMONY_COMPLETE.md](MILESTONE_V5_3_2_CEREMONY_COMPLETE.md) for full documentation.
