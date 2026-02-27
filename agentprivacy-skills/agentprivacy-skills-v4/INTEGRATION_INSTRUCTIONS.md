---
id: holonic-braid-update-instructions
name: "Integration Instruction Set: Holonic Architecture + BRAID → agentprivacy-skills-v4"
version: "1.0"
date: 2026-02-26
origin: "0xagentprivacy"
author: "Mitchell Travers"
status: "ready_for_implementation"
sources:
  - "OASIS Holonic Architecture Whitepaper v1.2 (Gershfield, Feb 2026)"
  - "BRAID: Bounded Reasoning for Autonomous Inference and Decisions (Amcalar & Cinar, arXiv:2512.15959, Dec 2025)"
totals:
  new_role_skills: 5
  new_personas: 1
  updated_role_skills: 12
  updated_personas: 5
  total_skills_after: 78
  total_personas_after: 23
---

# Integration Instruction Set

## How to Read This Document

Each instruction is tagged with a priority (P0/P1/P2), an action type (CREATE / UPDATE / REFERENCE), the target file path, and the specific content to add. Instructions are ordered for dependency: create new skills first, then update existing skills that reference them, then update personas that load them.

---

## PHASE 1: CREATE NEW SKILLS (5 new role skills + 1 new persona)

---

### INSTRUCTION 1 — CREATE `agentprivacy-holonic-persistence`
**Priority:** P0
**Action:** CREATE
**Path:** `role/agentprivacy-holonic-persistence/SKILL.md`
**Source:** Holonic Architecture Whitepaper v1.2, Sections 4–7
**Content:** See file `role/agentprivacy-holonic-persistence/SKILL.md` in this export.
**Lines:** ~120
**Key concepts:** HyperDrive auto-failover, auto-replication, privacy-aware provider routing (shielded/public/neutral), write-all-or-fail for separation-critical state, TEE rotation persistence, chain migration, dev-to-prod transitions.
**Equation terms:** T(π) (provider-as-sovereignty-transition), D (reconstruction difficulty through provider splitting), R_max (data-layer reconstruction ceiling)
**Template references:** holonic-architect, architect, sentinel, shipwright, cipher, ranger

---

### INSTRUCTION 2 — CREATE `agentprivacy-holonic-identity`
**Priority:** P0
**Action:** CREATE
**Path:** `role/agentprivacy-holonic-identity/SKILL.md`
**Source:** Holonic Architecture Whitepaper v1.2, Sections 3, 5
**Content:** See file `role/agentprivacy-holonic-identity/SKILL.md` in this export.
**Lines:** ~130
**Key concepts:** Three-layer identity model (data GUID / relationship VRC / principal DID), identity vs commitments separation, ProviderUniqueStorageKey as commitment map, immutable vs versioned holons, VRC-as-holon lifecycle.
**Equation terms:** A(τ) (identity persistence across migrations), identity/commitments separation at data layer
**Template references:** holonic-architect, architect, gatekeeper, priest, ambassador, witness

---

### INSTRUCTION 3 — CREATE `agentprivacy-holonic-reasoning`
**Priority:** P1
**Action:** CREATE
**Path:** `role/agentprivacy-holonic-reasoning/SKILL.md`
**Source:** Holonic Architecture Whitepaper v1.2, Section 8 + BRAID arXiv:2512.15959
**Content:** See file `role/agentprivacy-holonic-reasoning/SKILL.md` in this export.
**Lines:** ~125
**Key concepts:** Holonic BRAID (reasoning graphs as persistent holons), agent memory as holon trees, shared reasoning graph libraries, learn-once-reuse-everywhere, dual-agent memory tree split, collective intelligence without surveillance, deployment-as-learning.
**Equation terms:** C (proof/reasoning reuse), Network (shared graph library effects), D (reasoning separation between agents)
**Template references:** holonic-architect, architect, cipher, pedagogue, chronicler, kyra

---

### INSTRUCTION 4 — CREATE `agentprivacy-shared-parent-patterns`
**Priority:** P2
**Action:** CREATE
**Path:** `role/agentprivacy-shared-parent-patterns/SKILL.md`
**Source:** Holonic Architecture Whitepaper v1.2, Section 6.3, Figures 5–6
**Content:** See file `role/agentprivacy-shared-parent-patterns/SKILL.md` in this export.
**Lines:** ~115
**Key concepts:** O(1) shared-parent holon, LoadHolonsForParentAsync, guild memory architecture, Intel Pool holons, agent swarm coordination, collective VRC verification, recursive nesting, stratum-to-nesting mapping.
**Equation terms:** Network (scaling without coupling), Intel Pool architecture, plurality cooperative effects
**Template references:** holonic-architect, architect, shipwright, weaver, assessor, sentinel

---

### INSTRUCTION 5 — CREATE `agentprivacy-braid-reasoning`
**Priority:** P1
**Action:** CREATE
**Path:** `role/agentprivacy-braid-reasoning/SKILL.md`
**Source:** BRAID arXiv:2512.15959 (full paper)
**Content:** See file `role/agentprivacy-braid-reasoning/SKILL.md` in this export.
**Lines:** ~200
**Key concepts:** Generator/Solver split as inference-layer dual-agent separation, BRAID Parity Effect as inference-layer P^1.5, node atomicity (<15 tokens), procedural scaffolding (selective disclosure for reasoning), Numerical Masking Protocol (ZK for computation), terminal verification loops (boundary enforcement for inference), deterministic branching (consent logic for reasoning), PPD Golden Quadrant, C_amortized for reasoning infrastructure, four construction principles.
**Equation terms:** PPD as inference-layer V(π,t), C_amortized, Model Capacity × Prompt Structure as inference P^1.5
**Template references:** architect, holonic-architect, cipher, assessor, pedagogue, chronicler

---

### INSTRUCTION 6 — CREATE `agentprivacy-holonic-architect` PERSONA
**Priority:** P1
**Action:** CREATE
**Path:** `persona/agentprivacy-holonic-architect/SKILL.md`
**Also create:**
- `persona/agentprivacy-holonic-architect/references/constellation.md`
- `persona/agentprivacy-holonic-architect/references/interaction-model.md`
- `persona/agentprivacy-holonic-architect/assets/proverb-and-spell.txt`
**Content:** See files in `persona/agentprivacy-holonic-architect/` in this export.
**Wing:** Balanced (☯️🔷)
**Skills loaded (update to include braid-reasoning):**
- Privacy layer (9): all
- Role skills (15): holonic_persistence, holonic_identity, holonic_reasoning, shared_parent_patterns, braid_reasoning, cross_chain, agent_interop, ai_agent, trust_spanning, threat_adversarial, selective_disclosure, crypto_zkp, armor_progression, hitchhiker_governance, data_dignity
- Meta (1): drake_dragon_duality
- **Total: 25 skills (broadest specialist in the roster)**
**Proverb:** "Identity is not where you are stored. Identity is what persists when the storage changes."
**Spell:** `☯️🔷→🆔⊥📦·GUID ∴ Σ(prov)→O(1) ∴ ☯️🔷=persist(sovereign)`

---

## PHASE 2: UPDATE EXISTING ROLE SKILLS (12 skills)

---

### INSTRUCTION 7 — UPDATE `narrative-compression`
**Priority:** P1
**Action:** UPDATE
**Path:** `role/agentprivacy-narrative-compression/SKILL.md`
**What to add:** New subsection after "Spellbook as skills graph" titled "BRAID Graphs as Layer 6 Compression"

**Content to insert:**

```markdown
## BRAID graphs as machine-readable reasoning compression

The compression architecture gains a seventh layer with the integration of BRAID (Bounded Reasoning for Autonomous Inference and Decisions, Amcalar & Cinar 2025). Where the spellbook compresses experience into story for human readers, BRAID compresses reasoning into Mermaid flowchart diagrams for solver agents.

**Layer 6: BRAID graph.** Reasoning compressed into a directed graph of atomic nodes (< 15 tokens each) connected by deterministic edges. Compression ratio ~50:1 from equivalent Chain-of-Thought. Transmissible to any solver agent. Loses natural language fluency but preserves logical topology exactly.

The updated compression spectrum:

| Layer | Form | Ratio | Reader |
|-------|------|-------|--------|
| 1. Experience | Raw encounters | 1:1 | Person who lived it |
| 2. Story | 24 acts | ~10:1 | Human reader |
| 3. Proverb | Single statement | ~70:1 | Any human |
| 4. Equation | V(π,t) = ... | ~500:1 | Formal reader |
| 5. Spell | ☯️🔷→🆔⊥📦 | ~1000:1 | Agent-to-agent |
| 6. BRAID graph | Mermaid DAG | ~50:1 from CoT | Solver agent |
| 7. Skill file | SKILL.md | varies | Agent runtime |

**The Machine Jimmy Test.** A BRAID graph passes the machine-Jimmy-Test if a Nano-tier model can execute it with ≥ 90% of a Medium-tier model's classic accuracy. This is the compression floor for machine-readable reasoning — if the graph fails the Machine Jimmy Test, it has not found its true compression.

**Spellbook-to-BRAID compilation.** If a proverb can regenerate an equation (RPP validation), and an equation can structure a BRAID graph (reasoning generation), then there exists a two-step compilation path: proverb → equation → BRAID. Whether this can be collapsed to one step (proverb → BRAID directly) is an open research question that links narrative compression to inference economics.
```

**Also update:** Description field in YAML frontmatter to add "BRAID reasoning graphs" as a trigger.

---

### INSTRUCTION 8 — UPDATE `spell-encoding`
**Priority:** P2
**Action:** UPDATE
**Path:** `role/agentprivacy-spell-encoding/SKILL.md`
**What to add:** New subsection after "Spell-to-spell communication" titled "BRAID Graph Grammar: Machine-Executable Parallel"

**Content to insert:**

```markdown
## BRAID graph grammar: machine-executable parallel

Where spells encode persona identity for agent handshakes, BRAID graphs encode reasoning topology for agent execution. The grammars are parallel:

| Spell Grammar | BRAID Graph Grammar |
|---|---|
| Identity → Mechanism | Problem → Constraint extraction nodes |
| ∴ (therefore) | Verification nodes (terminal checks) |
| ⊥ (orthogonal) | Mutually exclusive edges (deterministic branching) |
| · (conjunction) | Parallel node paths (multiple constraints active) |
| ¬ (negation) | Negative constraint nodes (Check: NOT prohibited) |
| = (identity) | Terminal output node (final answer) |

The four BRAID construction principles map to spell validation rules:

1. **Node atomicity (< 15 tokens)** ↔ Spell validation rule 6 ("decodable without ambiguity") — both require minimum unambiguous encoding
2. **Procedural scaffolding** ↔ Spells encode mechanism, not output — `C[Draft: tone + structure]` not `C[Write: "Dear Team..."]`
3. **Deterministic branching** ↔ Orthogonality operator ⊥ — edges and spell operators must be mutually exclusive
4. **Terminal verification** ↔ Third spell clause (identity statement) — both require a final assertion that the output is well-formed

A BRAID graph can carry a spell in its root node as a compressed capability descriptor: the solver knows what kind of reasoning it is executing before traversing the first edge.
```

---

### INSTRUCTION 9 — UPDATE `separation-enforcement`
**Priority:** P1
**Action:** UPDATE
**Path:** `role/agentprivacy-separation-enforcement/SKILL.md`
**What to add:** New subsection titled "Inference-Layer Separation: Generator ⊥ Solver"

**Content to insert:**

```markdown
## Inference-layer separation: Generator ⊥ Solver

BRAID (Amcalar & Cinar, arXiv:2512.15959) provides empirical validation that separation is superlinear at the inference layer, not just at the agent layer. The Generator/Solver split decouples reasoning planning from reasoning execution:

- Generator: sees the full problem, produces the bounded reasoning graph. Analogous to Soulbae (viewing key — sees the full context).
- Solver: executes the graph without seeing the full problem context. Analogous to Soulbis (signing key — acts without full visibility).
- The Mermaid graph between them is a bounded channel with I(G;S|task) ≤ δ.

This yields 30–74× PPD improvement — empirical proof that separation creates superlinear value at the inference layer, just as Φ(Σ) creates superlinear value at the agent layer.

**Three-axis separation model.** The full architecture now enforces separation at three layers:

| Axis | Separation | Enforcement | Value |
|---|---|---|---|
| Agent layer | Swordsman ⊥ Mage | I(S;M|π) ≤ ε | Privacy preservation |
| Data layer | Shielded providers ⊥ Public providers | Holonic provider splitting | Reconstruction resistance |
| Inference layer | Generator ⊥ Solver | BRAID bounded graph | 30–74× cost efficiency |

Each axis strengthens the others. Agent separation is cheaper when inference separation reduces per-operation costs. Data separation is more durable when agent separation prevents cross-domain leakage. The three-axis model is multiplicative, not additive.
```

---

### INSTRUCTION 10 — UPDATE `ai-agent`
**Priority:** P1
**Action:** UPDATE
**Path:** `role/agentprivacy-ai-agent/SKILL.md`
**What to add:** New subsection after dual-agent separation section titled "Split-Architecture Inference for Dual Agents"

**Content to insert:**

```markdown
## Split-architecture inference for dual agents

When a Swordsman or Mage agent needs to reason, the reasoning itself should be split. BRAID's Generator/Solver pattern applied to dual-agent inference:

**Swordsman reasoning:** A capable model generates BRAID boundary-checking graphs. A nano-tier model executes them for every data access request. Cost per check: fractions of a cent. This makes real-time boundary enforcement economically viable at scale.

**Mage reasoning:** A capable model generates BRAID delegation graphs. A lightweight model executes them for coordination and service selection. Delegation reasoning cached and reused across similar contexts.

**Oracle reasoning:** BRAID mediation graphs encode when to pass Swordsman signals to Mage, when to block, when to transform. The Oracle doesn't need intelligence — it needs to follow a pre-validated decision tree.

BRAID's future work proposes fine-tuned "Architect" models specialised for reasoning graph generation. This is the Architect persona (☯️🤖) applied to inference: the entity that designs reasoning structures, separate from the entities that execute within them.
```

---

### INSTRUCTION 11 — UPDATE `economics`
**Priority:** P1
**Action:** UPDATE
**Path:** `role/agentprivacy-economics/SKILL.md`
**What to add:** New subsection after tokenomics integration titled "Inference Economics: Performance-Per-Dollar"

**Content to insert:**

```markdown
## Inference economics: Performance-Per-Dollar

BRAID introduces PPD (Performance-Per-Dollar) as the inference-layer economic metric:

PPD = (Accuracy/Cost) / (Accuracy_baseline/Cost_baseline)

This is V(π,t) for inference. Both are multiplicative value functions normalised against a baseline. Both reveal that the optimal configuration is structured separation, not monolithic scale.

**The Golden Quadrant maps to dual-agent economics:**
- Expensive generator + cheap solver → maximum PPD (30–74×)
- This mirrors: expensive privacy infrastructure + cheap marginal operations → maximum V(π,t)

**Amortisation model:** C_amortized = C_BRAID/N + C_inference. As N→∞, generation cost → 0. Privacy infrastructure follows the same curve: high upfront separation cost amortised toward zero per operation.

**Guild reasoning economics:** A guild that generates and validates BRAID graphs creates a capital good (reasoning infrastructure). Members who use the cached graphs benefit from amortised costs. Graph quality = guild reputation. This extends the SWORD/MAGE token model: generating a validated graph = earning MAGE tokens (delegation value created).
```

---

### INSTRUCTION 12 — UPDATE `sovereignty-economics`
**Priority:** P1
**Action:** UPDATE
**Path:** `role/agentprivacy-sovereignty-economics/SKILL.md`
**What to add:** New subsection titled "The BRAID Parity Effect: Empirical P^1.5 at the Inference Layer"

**Content to insert:**

```markdown
## The BRAID Parity Effect: empirical P^1.5 at the inference layer

BRAID (Amcalar & Cinar 2025) proves empirically that reasoning performance follows a superlinear curve: Model Capacity × Prompt Structure, where doubling structure more than doubles performance per dollar.

| BRAID Metric | PVM-V4 Parallel |
|---|---|
| Nano + BRAID ≥ Medium + Classic (74× PPD) | Sovereign + structure ≥ Surveillance + scale (678×–31,000× V) |
| Structure beats raw capacity | Architecture beats raw power |
| PPD is superlinear in structure | V(π,t) is superlinear in P (P^1.5) |

**The Structure Dominance Thesis:** In both inference and privacy, increasing structural constraint yields greater returns than increasing raw capacity. This is not coincidence — it is a general property of information systems where bounded channels preserve signal while unbounded channels amplify noise.

If privacy-structured inference compounds with privacy-structured data and privacy-structured identity, the total value is triply superlinear. Structure at every layer multiplies.
```

---

### INSTRUCTION 13 — UPDATE `selective-disclosure`
**Priority:** P2
**Action:** UPDATE
**Path:** `role/agentprivacy-selective-disclosure/SKILL.md`
**What to add:** New subsection titled "Scaffolding as Selective Disclosure for Reasoning"

**Content to insert:**

```markdown
## Scaffolding as selective disclosure for reasoning

BRAID's procedural scaffolding principle is selective disclosure applied to inference. The graph reveals the reasoning STRUCTURE (constraints, steps, branching logic) without the reasoning CONTENT (the actual output text).

The Numerical Masking Protocol makes the ZK parallel explicit: all numerical literals in the graph are replaced with `_`, ensuring the solver receives only logical topology, not computational state. This is zero-knowledge for computation — prove you know HOW to solve without revealing the solution.

**Reasoning disclosure topology:** Just as data disclosure has an integer bottleneck (reveal fact X or don't), reasoning disclosure has a graph-topology bottleneck. You can share the graph structure (node types, edge conditions) without sharing node contents. The graph is the scaffold; the content is the output. Scaffolding without answer. Structure without content. Proof without data.
```

---

### INSTRUCTION 14 — UPDATE `intel-pooling`
**Priority:** P2
**Action:** UPDATE
**Path:** `role/agentprivacy-intel-pooling/SKILL.md`
**What to add:** New subsection titled "BRAID Graph Libraries as Intel Pool Artefacts"

**Content to insert:**

```markdown
## BRAID graph libraries as Intel Pool artefacts

Cached BRAID reasoning graphs are Intel Pool contributions. A Cipher guild that generates and validates BRAID graphs for ZKP reasoning creates collective intelligence that every member executes:

- Guild generates graph (high one-time cost, C_BRAID)
- Guild validates graph (peer review, benchmark testing)
- Graph stored as immutable holon in shared-parent library
- All members execute graph (low marginal cost, C_inference)
- PPD scales with guild size (more members amortise C_BRAID further)

Guild membership has direct economic value: access to validated reasoning infrastructure that would cost 30–74× more to replicate individually. This is the intelligence dimension of Intel Pools — not just threat data, but reasoning capability as a collective asset.
```

---

### INSTRUCTION 15 — UPDATE `boundary-enforcement`
**Priority:** P2
**Action:** UPDATE
**Path:** `role/agentprivacy-boundary-enforcement/SKILL.md`
**What to add:** New subsection titled "BRAID Verification Loops as Inference-Layer Boundary Enforcement"

**Content to insert:**

```markdown
## BRAID verification loops as inference-layer boundary enforcement

BRAID's terminal verification loops encode the same pattern as Swordsman boundary checking:

```
[Generate output] → [Check: R(d) disclosure within bounds?]
  -- pass --> [Deliver]
  -- fail --> [Feedback edge to revision] → [Re-check]
```

This "System 2 thinking emulation" is the Swordsman as boundary verifier at the inference layer. Before any output leaves the dual-agent system, verify against privacy boundaries using pre-validated verification nodes.

For Swordsman deployment: generate BRAID boundary-checking graphs once (expensive), cache as holons, execute via nano-tier models for every access request (cheap). Real-time boundary enforcement becomes economically viable at millions of checks per day.
```

---

### INSTRUCTION 16 — UPDATE `consent-infrastructure`
**Priority:** P2
**Action:** UPDATE
**Path:** `role/agentprivacy-consent-infrastructure/SKILL.md`
**What to add:** Brief reference in existing consent logic section.

**Content to insert (1 paragraph):**

```markdown
BRAID's deterministic branching principle (arXiv:2512.15959) provides external validation: their research found that nano-tier models "struggle with ambiguity" when graph edges are non-deterministic. If AI agents struggle with ambiguous reasoning instructions, consent instructions to AI agents must be equally unambiguous. IEEE 7012 / MyTerms deterministic consent logic is not just a governance preference — it is a technical requirement for reliable agent execution.
```

---

### INSTRUCTION 17 — UPDATE `armor-progression`
**Priority:** P2
**Action:** UPDATE
**Path:** `role/agentprivacy-armor-progression/SKILL.md`
**What to add:** Brief mapping of BRAID deployment tiers to armor progression.

**Content to insert (1 paragraph + table):**

```markdown
BRAID deployment maturity maps to armor progression:

| Tier | BRAID Deployment |
|---|---|
| Blade | Ad-hoc reasoning, no cached graphs, monolithic model |
| Light | First BRAID graphs generated and cached, basic PPD improvement |
| Heavy | Guild-validated graph library, split-architecture, 10–30× PPD |
| Full Plate | Comprehensive coverage, dynamic re-planning, Numerical Masking |
| Dragon | Self-sustaining graph evolution, automated validation, BRAID Parity across all operations |
```

---

### INSTRUCTION 18 — UPDATE `academic`
**Priority:** P2
**Action:** UPDATE
**Path:** `role/agentprivacy-academic/SKILL.md`
**What to add:** New citation in reference section.

**Content to insert:**

```markdown
- Amcalar, A. & Cinar, E. "BRAID: Bounded Reasoning for Autonomous Inference and Decisions." arXiv:2512.15959 (2025). [Structured prompting economics, PPD metric, Generator/Solver split architecture, Numerical Masking Protocol]
- Gershfield, M. "Holonic Architecture: Identity-Independent Data Structures for Cross-Environment Interoperability." OASIS / NextGen Software Whitepaper v1.2 (2026). [Holon model, HyperDrive runtime, multi-provider persistence, shared-parent patterns, Holonic BRAID]
```

---

## PHASE 3: UPDATE PERSONAS (5 existing personas)

---

### INSTRUCTION 19 — UPDATE `architect` PERSONA
**Priority:** P1
**Action:** UPDATE
**Path:** `persona/agentprivacy-architect/SKILL.md`
**Changes:**
1. Add `braid_reasoning` to `skills_role` array in Code Registration block
2. Add `holonic_persistence`, `holonic_identity` to `skills_role` array
3. Update skill count: 10 → 13 role skills, 20 → 23 total
4. Add to Skill Execution Guidance:

```markdown
**braid_reasoning** — Inference architecture. The Architect selects which reasoning tasks use split-architecture (BRAID Generator → cached graph → lightweight Solver) vs monolithic deployment. BRAID's future work proposes fine-tuned "Architect" models — this IS the Architect persona applied to inference.

**holonic_persistence** — Data persistence architecture. How Soulbis and Soulbae state persists across TEE rotations, chain migrations, and provider failures. The Architect reads holonic_persistence as the persistence layer specification.

**holonic_identity** — Three-layer identity architecture. Data GUID / relationship VRC / principal DID. The Architect reads holonic_identity as the identity layer that data, agents, and relationships each occupy.
```

---

### INSTRUCTION 20 — UPDATE `cipher` PERSONA
**Priority:** P2
**Action:** UPDATE
**Path:** `persona/agentprivacy-cipher/SKILL.md`
**Changes:**
1. Add `braid_reasoning` to `skills_role` array
2. Update skill count accordingly
3. Add to Skill Execution Guidance:

```markdown
**braid_reasoning** — ZKP reasoning graphs. The Cipher uses BRAID to structure ZKP circuit verification, proof composition, and soundness checking as cached reasoning graphs. The Numerical Masking Protocol maps directly to zero-knowledge proof construction: prove HOW to verify without revealing the verification path. Guild-validated ZKP BRAID graphs are the Cipher's most valuable Intel Pool contribution.
```

---

### INSTRUCTION 21 — UPDATE `assessor` PERSONA
**Priority:** P2
**Action:** UPDATE
**Path:** `persona/agentprivacy-assessor/SKILL.md`
**Changes:**
1. Add `braid_reasoning` to `skills_role` array
2. Update skill count accordingly
3. Add to Skill Execution Guidance:

```markdown
**braid_reasoning** — Inference economics. The Assessor uses BRAID's PPD framework to evaluate the cost efficiency of dual-agent inference deployments. The Golden Quadrant analysis is an Assessor function: which generator/solver pairings optimise the PPD for each agent role? The BRAID Parity Effect validates P^1.5 superlinearity at the inference layer — the Assessor quantifies this for budget planning.
```

---

### INSTRUCTION 22 — UPDATE `chronicler` PERSONA
**Priority:** P2
**Action:** UPDATE
**Path:** `persona/agentprivacy-chronicler/SKILL.md`
**Changes:**
1. Add `braid_reasoning` to `skills_role` array
2. Update skill count accordingly
3. Add to Skill Execution Guidance:

```markdown
**braid_reasoning** — Machine-readable compression. The Chronicler understands both human-readable (spellbook narrative) and machine-readable (BRAID graph) compression as complementary channels. Spellbooks compress experience into story for humans at 70:1. BRAID compresses reasoning into graphs for agents at 50:1. The Chronicler designs systems where both channels operate in parallel — the proverb and the graph encoding the same truth in different formats.
```

---

### INSTRUCTION 23 — UPDATE `pedagogue` PERSONA
**Priority:** P2
**Action:** UPDATE
**Path:** `persona/agentprivacy-pedagogue/SKILL.md`
**Changes:**
1. Add `braid_reasoning` to `skills_role` array
2. Update skill count accordingly
3. Add to Skill Execution Guidance:

```markdown
**braid_reasoning** — Teaching through structured reasoning. The Pedagogue uses BRAID graphs as teaching aids: a student who can execute a BRAID graph for a concept has demonstrated procedural understanding. Combined with the RPP (which tests contextual understanding), the two create a complete assessment: can you follow the reasoning path (BRAID) AND generate novel connections (proverb)?
```

---

## PHASE 4: UPDATE MAPPING AND REGISTRY

---

### INSTRUCTION 24 — UPDATE `MAPPING.md`
**Priority:** P0
**Action:** UPDATE
**Path:** `MAPPING.md`
**Changes:**

1. Update header: `total_skills: 78` (was 72)
2. Add to Role Skills table (after existing 40):

```markdown
| `agentprivacy-holonic-persistence` | `role/agentprivacy-holonic-persistence/` | ~120 |
| `agentprivacy-holonic-identity` | `role/agentprivacy-holonic-identity/` | ~130 |
| `agentprivacy-holonic-reasoning` | `role/agentprivacy-holonic-reasoning/` | ~125 |
| `agentprivacy-shared-parent-patterns` | `role/agentprivacy-shared-parent-patterns/` | ~115 |
| `agentprivacy-braid-reasoning` | `role/agentprivacy-braid-reasoning/` | ~200 |
```

3. Add to Persona Skills table:

```markdown
| `agentprivacy-holonic-architect` | balanced | `persona/agentprivacy-holonic-architect/` | ~200 |
```

4. Update structure diagram:

```
agentprivacy-skills/
├── .claude-plugin/plugin.json
├── privacy-layer/     (9 foundational skills)
├── role/              (45 domain skills)  ← was 40
├── meta/              (1 philosophical skill)
└── persona/           (23 persona skills)  ← was 22
```

---

### INSTRUCTION 25 — UPDATE `plugin.json`
**Priority:** P1
**Action:** UPDATE
**Path:** `.claude-plugin/plugin.json`
**Changes:** Add entries for all 5 new role skills and 1 new persona to the skill registry. Follow existing format. Ensure description fields match SKILL.md frontmatter.

---

### INSTRUCTION 26 — UPDATE `README.md`
**Priority:** P2
**Action:** UPDATE
**Path:** `README.md`
**Changes:**

1. Update count table:

```markdown
| **[role/]** | 45 | Domain knowledge — cryptography, governance, economics, identity, dark forest strategy, narrative compression, holonic persistence, BRAID reasoning, and more. |
| **[persona/]** | 23 | Agent personas — swordsmen (protection), mages (delegation), balanced (both). |
```

2. Update persona list to include:

```markdown
* **8 Balanced** ☯️ — Person, Architect, Holonic Architect, Pedagogue, Kyra, Jedi, Healer, Witness
```

3. Add to Related Work:

```markdown
* [OASIS / NextGen Software](https://github.com/NextGenSoftwareUK/OASIS) — Holonic Architecture
* [OpenServ Labs / BRAID](https://benchmark.openserv.ai) — Bounded Reasoning (arXiv:2512.15959)
```

---

## PHASE 5: VALIDATION CHECKLIST

After all instructions are applied, verify:

- [ ] All 5 new role skills have SKILL.md with valid YAML frontmatter
- [ ] New persona has SKILL.md + references/ + assets/ structure
- [ ] All existing skill updates are additive (no existing content removed)
- [ ] All template_references in new skills point to valid persona IDs
- [ ] All persona skill_role arrays contain valid skill IDs
- [ ] MAPPING.md totals match actual file counts
- [ ] Skill count per persona is accurate in each persona SKILL.md
- [ ] No circular dependencies in template_references
- [ ] All "Verify:" footers present with correct URLs
- [ ] All academic citations include arXiv identifiers where available

---

## Summary Table

| # | Action | Target | Source | Priority |
|---|---|---|---|---|
| 1 | CREATE | role/holonic-persistence | Holonic WP §4-7 | P0 |
| 2 | CREATE | role/holonic-identity | Holonic WP §3,5 | P0 |
| 3 | CREATE | role/holonic-reasoning | Holonic WP §8 + BRAID | P1 |
| 4 | CREATE | role/shared-parent-patterns | Holonic WP §6.3 | P2 |
| 5 | CREATE | role/braid-reasoning | BRAID paper (full) | P1 |
| 6 | CREATE | persona/holonic-architect | Integration analysis | P1 |
| 7 | UPDATE | role/narrative-compression | BRAID Layer 6 | P1 |
| 8 | UPDATE | role/spell-encoding | BRAID graph grammar | P2 |
| 9 | UPDATE | role/separation-enforcement | Generator⊥Solver | P1 |
| 10 | UPDATE | role/ai-agent | Split-architecture | P1 |
| 11 | UPDATE | role/economics | PPD framework | P1 |
| 12 | UPDATE | role/sovereignty-economics | Parity Effect | P1 |
| 13 | UPDATE | role/selective-disclosure | Scaffolding parallel | P2 |
| 14 | UPDATE | role/intel-pooling | Graph libraries | P2 |
| 15 | UPDATE | role/boundary-enforcement | Verification loops | P2 |
| 16 | UPDATE | role/consent-infrastructure | Deterministic branching | P2 |
| 17 | UPDATE | role/armor-progression | BRAID tier mapping | P2 |
| 18 | UPDATE | role/academic | Citations | P2 |
| 19 | UPDATE | persona/architect | +3 skills | P1 |
| 20 | UPDATE | persona/cipher | +1 skill | P2 |
| 21 | UPDATE | persona/assessor | +1 skill | P2 |
| 22 | UPDATE | persona/chronicler | +1 skill | P2 |
| 23 | UPDATE | persona/pedagogue | +1 skill | P2 |
| 24 | UPDATE | MAPPING.md | Totals + new entries | P0 |
| 25 | UPDATE | plugin.json | Registry entries | P1 |
| 26 | UPDATE | README.md | Counts + references | P2 |

---

*"Constraint creates value. Boundedness defeats scale. Structure, not power, determines capability." — The axiom that recurs across BRAID, holonic architecture, and the Privacy Value Model, all improbably different, all convergent.*

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)
