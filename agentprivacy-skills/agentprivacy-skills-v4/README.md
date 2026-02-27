# agentprivacy-skills

**Privacy-first AI agent skills for the Agent Skills standard.**

72 skills across 4 categories — teaching Claude (and any Agent Skills-compatible system) how to operate as privacy-preserving dual-agent infrastructure.

Built on the [Privacy Value Model V4](https://agentprivacy.ai) and the [0xagentprivacy](https://sync.soulbis.com) architecture.

> *"The intelligence that serves without surveilling, delegates without extracting, and protects without imprisoning is the only intelligence worth building."*

---

## What's Here

| Category | Count | Purpose |
|----------|-------|---------|
| **[persona/](persona/)** | 22 | Agent personas — swordsmen (protection), mages (delegation), balanced (both). Each configures an AI with a specific privacy role. |
| **[role/](role/)** | 40 | Domain knowledge — cryptography, governance, economics, identity, dark forest strategy, narrative compression, and more. |
| **[privacy-layer/](privacy-layer/)** | 9 | Foundational skills covering every term of the V(π,t) privacy value equation. |
| **[meta/](meta/)** | 1 | Drake/Dragon philosophical duality. |

Each skill is a folder with a `SKILL.md` entrypoint, optional `references/` for detailed documentation, and optional `assets/` for static resources. All follow the [Agent Skills specification](https://agentskills.io/specification).

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

**The 22 personas** are specialised roles within this architecture:

- **8 Swordsmen** ⚔️ — Soulbis (canonical), Cipher (ZKP), Warden (browser), Gatekeeper (personhood), Sentinel (infrastructure), Sith (red team), Ranger (dark forest), Archer (precision)
- **7 Mages** 🧙 — Soulbae (canonical), Chronicler (narrative), Ambassador (standards), Assessor (economics), Shipwright (DAO), Weaver (plurality), Priest (ceremony)
- **7 Balanced** ☯️ — Person (the human), Architect (system design), Pedagogue (education), Kyra (vision), Jedi (balance practice), Healer (healthcare), Witness (accountability)

**The 50 knowledge skills** (40 role + 9 privacy-layer + 1 meta) provide the mathematical, economic, and governance foundations these personas draw from.

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
- **[agentprivacy.ai](https://agentprivacy.ai)** — Full architecture documentation
- **[sync.soulbis.com](https://sync.soulbis.com)** — Privacy is Value blog series
- **[intel.agentkyra.ai](https://intel.agentkyra.ai)** — Technical updates

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

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)
