---
id: braid-agentprivacy-integration
name: "BRAID × 0xagentprivacy: Full Integration Analysis"
version: "1.0"
date: 2026-02-26
origin: "0xagentprivacy + BRAID (Amcalar & Cinar, arXiv:2512.15959)"
author: "Mitchell Travers"
status: "integration_draft"
impact: "1 new role skill, 12 existing skills updated, 5 personas updated, 1 new persona updated"
---

# BRAID × 0xagentprivacy: Full Integration Analysis

## Executive Summary

BRAID (Bounded Reasoning for Autonomous Inference and Decisions) is not merely a prompting technique. Read through the lens of the Privacy Value Model, it is an existence proof for three principles that sit at the core of what we're building:

1. **Structure defeats scale.** A nano model + bounded reasoning graph ≥ a medium model thinking unbounded. This is the BRAID Parity Effect. In privacy terms: a lightweight agent + mathematical separation guarantees ≥ a massive surveillance agent with no structural constraints. The lesson is the same — architecture, not raw power, determines capability.

2. **Reasoning is separable.** BRAID's Generator/Solver split proves empirically that high-level planning and low-level execution can be decoupled with 74× cost efficiency gains. This is the dual-agent separation thesis applied to inference itself: the entity that plans does not need to be the entity that executes. Generator ⊥ Solver. Swordsman ⊥ Mage. The orthogonality is the value.

3. **Compressed reasoning graphs are economic infrastructure.** A BRAID Mermaid diagram generated once and cached costs C_BRAID/N per query as N grows. This is exactly the amortisation model for privacy infrastructure: high upfront investment in separation architecture, approaching zero marginal cost per sovereignty-preserving operation. Both BRAID graphs and holonic reasoning artefacts are capital goods, not consumables.

These three principles touch 12 existing skills, require 1 new role skill, and update 5 personas. This document maps every connection, specifies every update, and provides the instructional file for integration into the agentprivacy-skills-v4 library.

---

## 1. Concept-by-Concept Mapping

### 1.1 Generator/Solver Split Architecture

**BRAID:** A high-intelligence model generates the Mermaid reasoning graph (once). A low-cost model executes it (repeatedly). The generator never sees the execution; the solver never plans. Decoupling yields 30–74× PPD improvement.

**Agentprivacy mapping:** This is dual-agent separation applied to inference economics. The generator holds the planning capability (analogous to Soulbae's viewing key — it sees the full problem space). The solver holds the execution capability (analogous to Soulbis's signing key — it acts without seeing the full context). Neither can reconstruct the other's function.

**Formal parallel:**
- BRAID: Generator ⊥ Solver → C_amortized = C_BRAID/N + C_inference
- PVM-V4: Swordsman ⊥ Mage → I(S;M|π) ≤ ε
- Both: Separation yields superlinear value. Merging yields linear (or worse) cost.

**Skills impacted:** `separation-enforcement`, `ai-agent`, `economics`, `sovereignty-economics`

### 1.2 Bounded vs Unbounded Reasoning

**BRAID:** Chain-of-Thought is unbounded — the model generates tokens until it reaches an answer, with no structural constraint on the path. BRAID constrains reasoning to a directed graph where every node is atomic (< 15 tokens), every edge is deterministic, and every path terminates at verification nodes. This eliminates "reasoning drift."

**Agentprivacy mapping:** Unbounded reasoning is the surveillance model: extract all data, process everything, hope the answer emerges. Bounded reasoning is the sovereignty model: define what information is needed, constrain the channels, verify at boundaries. The separation matrix Σ is a bounded reasoning architecture for privacy — it constrains the information flow between Swordsman and Mage to a deterministic, verifiable channel.

**The deep parallel:** BRAID found that classic CoT "introduces linguistic noise — many tokens carry low semantic density but still incur cost." This is exactly what surveillance architectures do to behavioural data: they collect massive volumes of low-semantic-density observations that incur cost (storage, processing, risk) without proportional value improvement. Bounded reasoning — whether for inference or privacy — eliminates the noise and preserves only the structural signal.

**Formal connection:**
- BRAID: Bounded graph with node atomicity → higher accuracy at lower token cost
- PVM-V4: Bounded information flow with I(S;M|π) ≤ ε → higher privacy at lower reconstruction risk
- Both: Constraints create value by eliminating noise

**Skills impacted:** `separation-enforcement`, `boundary-enforcement`, `narrative-compression`, `metadata-resistance`

### 1.3 The BRAID Parity Effect

**BRAID:** "Reasoning performance is a product of Model Capacity × Prompt Structure. By increasing the structure, we can decrease the required capacity." gpt-5-nano with BRAID matches or exceeds gpt-5-medium classic on multiple benchmarks. Small model + structure ≥ large model + no structure.

**Agentprivacy mapping:** This is the sovereignty economics thesis quantified at the inference layer. The Privacy Value Model shows that privacy-first architectures with structure (mathematical separation, ZK proofs, bounded information flow) generate 678× to 31,000× more value than surveillance architectures with raw scale. The BRAID Parity Effect is the experimental validation at the model tier: you don't need the biggest model, you need the right architecture.

**Economic translation:**
- BRAID PPD: Nano-BRAID achieves 74× efficiency vs Medium-Classic
- PVM-V4 Value: Sovereign architecture achieves 678×–31,000× value vs surveillance architecture
- Both follow superlinear curves: doubling structure more than doubles value (P^1.5 in PVM-V4)

**New principle for sovereignty-economics:** The BRAID Parity Effect should be explicitly modelled as the inference-layer instance of P^1.5 superlinearity. Just as doubling privacy protection more than doubles data value, doubling prompt structure more than doubles reasoning accuracy per dollar.

**Skills impacted:** `sovereignty-economics`, `economics`, `data-dignity`, `armor-progression`

### 1.4 Performance-Per-Dollar (PPD) as V(π,t) for Inference

**BRAID:** PPD = (Accuracy/Cost) / (Accuracy_baseline/Cost_baseline). Normalised efficiency metric. The "Golden Quadrant" identifies optimal generator/solver pairings.

**Agentprivacy mapping:** PPD is the inference-layer analog of V(π,t). Both are multiplicative value functions normalised against a baseline. Both reveal that the optimal configuration is NOT the monolithic maximum (biggest model / most data) but the structured separation (generator+solver / swordsman+mage).

**The Golden Quadrant maps to dual-agent economics:**
- BRAID Golden Quadrant: High-intelligence generator + low-cost solver → maximum PPD
- PVM-V4 Sovereign Economy: High-investment privacy infrastructure + low-marginal-cost operations → maximum V(π,t)
- Anti-pattern in both: Monolithic deployment (single large model / single surveillance agent) → PPD ≈ 1.0 / V(π,t) ≈ baseline

**The amortisation parallel is precise:**
- BRAID: C_amortized = C_BRAID/N + C_inference → as N→∞, cost → C_inference (the graph generation cost vanishes)
- PVM-V4: V(π,t) over time → high upfront separation infrastructure cost amortised across all future sovereignty operations → as time→∞, marginal cost → 0, accumulated value → ∞

**Skills impacted:** `economics`, `sovereignty-economics`, `data-dignity`

### 1.5 Mermaid Graphs as Persistent Reasoning Artefacts

**BRAID:** "In a production setting, our approach is designed to leverage predefined, manually handcrafted reasoning plans that can be cached and reused repeatedly." The Mermaid graph is generated once, stored, and executed millions of times. It is inference infrastructure, not a disposable prompt.

**Agentprivacy mapping:** This is Holonic BRAID. The Mermaid reasoning graph, stored as a holon with a GUID, replicated across providers, loaded by any agent on any backend. The graph is not a prompt — it is a persistent, shareable, provider-agnostic reasoning artefact. This is the missing piece that connects BRAID's cached-graph vision to holonic architecture's multi-provider persistence.

**The storage model:**
```
BRAID Graph Holon (GUID: graph-zkp-soundness-001)
├── HolonType: ReasoningGraph (immutable)
├── MetaData:
│   ├── domain: "zkp-circuit-verification"
│   ├── generator_model: "gpt-5-medium"
│   ├── benchmark_accuracy: "98%"
│   ├── mermaid_code: "flowchart TD; ..."
│   └── validation_status: "guild-verified"
├── ProviderUniqueStorageKey:
│   ├── MongoDBOASIS: ObjectId("...")
│   ├── IPFSOASIS: "QmXyz..."
│   └── ZcashOASIS: "tx_hash_..."
└── ParentHolonId: guild-cipher-library
```

**Skills impacted:** `holonic-reasoning` (new), `holonic-persistence` (new), `shared-parent-patterns` (new), `intel-pooling`, `agent-interop`

### 1.6 Node Atomicity and Token Density

**BRAID:** "Each node in the graph must represent an atomic reasoning step... nodes containing fewer than 15 tokens yield the highest adherence rates in Nano-tier models. Verbose nodes reintroduce the noise of unstructured prompting."

**Agentprivacy mapping:** This is the machine-readable equivalent of spell encoding. Spells compress persona identity into ~30 characters using the three-clause grammar (action ∴ consequence ∴ identity). BRAID nodes compress reasoning steps into <15 tokens using atomic decomposition. Both pursue maximum semantic density per token.

**The compression spectrum now has seven layers:**

| Layer | Form | Compression | Reader |
|-------|------|-------------|--------|
| 1. Experience | Raw encounters | 1:1 | The person who lived it |
| 2. Story | Narrative (24 acts) | ~10:1 | Human reader |
| 3. Proverb | Single statement | ~70:1 | Any human |
| 4. Equation | V(π,t) = ... | ~500:1 | Formally trained reader |
| 5. Spell | ☯️🔷→🆔⊥📦 | ~1000:1 | Agent-to-agent |
| **6. BRAID graph** | **Mermaid flowchart** | **~50:1 from CoT** | **Solver agent** |
| 7. Skill file | SKILL.md | varies | Agent runtime |

**Key insight:** Layer 6 (BRAID graph) sits BETWEEN spell and skill in function but parallel to narrative in form. It compresses reasoning (not identity or knowledge) into a structured, machine-executable format. The spellbook compresses experience into story for humans; BRAID compresses reasoning into graphs for machines. They are parallel channels for the same compression principle.

**Skills impacted:** `narrative-compression`, `spell-encoding`, `story-diffusion`

### 1.7 Procedural Scaffolding vs Answer Leakage

**BRAID:** "A critical distinction exists between planning the output and generating the output." Effective nodes encode constraints and semantic requirements, not the response text. The graph is a scaffold — it tells the solver WHAT to produce without producing it.

**Agentprivacy mapping:** This is selective disclosure at the reasoning layer. The BRAID graph reveals the reasoning STRUCTURE without revealing the reasoning CONTENT. Selective disclosure reveals the credential STRUCTURE (I am over 18) without revealing the credential CONTENT (I was born on 15 March 1990).

**The isomorphism:**
- BRAID: Graph encodes constraints → Solver generates output within constraints → Output satisfies constraints without the graph containing the output
- Selective disclosure: Proof encodes property → Verifier confirms property → Verification succeeds without the proof containing the underlying data
- Both: Structure without content. Scaffold without answer. Proof without data.

**BRAID's Numerical Masking Protocol is ZK for reasoning:** Replacing all numerical literals with `_` in the graph ensures the solver receives only the logical topology, not the computational state. This is the reasoning equivalent of zero-knowledge: prove you know HOW to solve without revealing the solution. The solver must execute the computation; the graph only provides the path.

**Skills impacted:** `selective-disclosure`, `crypto-zkp`, `boundary-enforcement`

### 1.8 Terminal Verification Loops

**BRAID:** "Effective BRAID graphs explicitly encode a 'Critic' phase before the final output... verification nodes (Check: Tone is empathetic, Check: No prohibited keywords)... If a check fails, the graph should contain a feedback edge routing logic back to a revision node."

**Agentprivacy mapping:** These are boundary enforcement checkpoints. The Swordsman's function is exactly this: before any output leaves the dual-agent system, verify it against privacy boundaries. The terminal verification loop in BRAID (Check: constraint satisfied → pass / fail → revise) is the boundary enforcement pattern (Check: disclosure within R(d) limits → pass / Check: no separation violation → pass / fail → block or revise).

**Deeper connection:** BRAID calls this "System 2 thinking emulation." The agentprivacy architecture calls it "the Swordsman as boundary verifier." Both encode the insight that checking should be explicit and structural, not implicit and hopeful.

**Skills impacted:** `boundary-enforcement`, `consent-infrastructure`, `revocation-mechanics`

### 1.9 Deterministic Branching Logic

**BRAID:** "Edges connecting nodes must be deterministic and mutually exclusive... labeled edges that act as explicit condition checks (e.g., A -- 'If text > 300 words' --> B)."

**Agentprivacy mapping:** This is the consent infrastructure pattern. IEEE 7012 / MyTerms requires deterministic consent branching: IF consent given for purpose X THEN allow processing ELSE block. No ambiguity. No probabilistic consent. The BRAID requirement for deterministic branching in reasoning graphs maps directly to the consent requirement for deterministic branching in data processing decisions.

**Connection to armor progression:** The armor tier system (Blade → Light → Heavy → Dragon) is a deterministic branching structure for capability unlocking. Each tier has explicit conditions; no probabilistic advancement. BRAID's deterministic edges map to armor tier transitions.

**Skills impacted:** `consent-infrastructure`, `armor-progression`, `boundary-enforcement`

### 1.10 The "Architect" Model (BRAID Future Work)

**BRAID:** "Future work will explore fine-tuning smaller, specialized models solely on the task of converting natural language queries into Mermaid topology. We hypothesize that a fine-tuned 'Architect' model could produce higher-fidelity reasoning structures at a fraction of the current generation cost."

**Agentprivacy mapping:** BRAID independently arrived at the Architect persona concept. The 0xagentprivacy Architect (☯️🤖) designs the systems where Swordsman and Mage operate. BRAID proposes an "Architect" model that designs the reasoning systems where Generator and Solver operate. The convergence is striking — two independent architectures arriving at the same conclusion: the entity that designs the structure should be specialised, separate from the entities that operate within it.

**For the Holonic Architect persona (☯️🔷):** This future work validates the persona's role. The Holonic Architect designs reasoning graph libraries (the "Architect model" function) and stores them as holonic artefacts (the persistence function). BRAID's proposed Architect model IS the Holonic Architect operating at the inference layer.

**Skills impacted:** All Architect-related personas, `ai-agent`

### 1.11 Dynamic Re-planning (BRAID Future Work)

**BRAID:** "We intend to investigate dynamic execution loops where the Solver model can signal a 'Topology Error'... and trigger a localized re-generation of the graph."

**Agentprivacy mapping:** This is the recovery-RPP pattern applied to reasoning. When a BRAID solver encounters a topology error, it needs to re-plan — analogous to when a dual-agent system encounters a separation violation and needs RPP-based recovery. The signal path is the same: Executor detects failure → signals to Generator/Oracle → localized repair → continue execution.

**Connection to forensic-defense:** Topology errors in BRAID are reasoning-layer incidents. The forensic-defense skill covers incident response at the sovereignty layer. Dynamic re-planning extends incident response to the reasoning layer.

**Skills impacted:** `recovery-rpp`, `forensic-defense`

---

## 2. New Skill Specification

### 2.1 `agentprivacy-braid-reasoning` (Role Skill)

**Purpose:** Bounded reasoning architecture for privacy-preserving agents — BRAID Mermaid graphs as structural prompting infrastructure for dual-agent systems. This skill is DISTINCT from `holonic-reasoning` (which covers persistent storage of reasoning artefacts). `braid-reasoning` covers the generation, construction, and economics of the reasoning graphs themselves.

**Equation term:** PPD as inference-layer V(π,t), C_amortized for reasoning infrastructure economics, Model Capacity × Prompt Structure as inference-layer P^1.5

**Template references:** architect, holonic-architect, cipher, assessor, pedagogue, chronicler

**Key concepts:**
- Generator/Solver split as inference-layer dual-agent separation
- BRAID Parity Effect as inference-layer P^1.5 superlinearity
- Node atomicity (< 15 tokens) as machine-readable spell encoding
- Procedural scaffolding as selective disclosure for reasoning
- Terminal verification loops as boundary enforcement for inference
- Numerical masking as ZK for reasoning
- PPD Golden Quadrant as sovereignty economics for inference
- Amortised graph cost as privacy infrastructure economics
- Four BRAID construction principles: atomicity, scaffolding, determinism, verification

---

## 3. Existing Skill Updates

### 3.1 `narrative-compression` — Add Layer 6

**Current state:** 6 compression layers (experience → story → proverb → equation → spell → skill)

**Update:** Add BRAID graph as Layer 6 in the compression spectrum, sitting between spell and skill in the hierarchy but parallel to narrative in function. Add section: "Machine-Readable Reasoning Compression" explaining that BRAID compresses reasoning for agents the way spellbooks compress experience for humans. Both achieve "learn once, reuse everywhere" — spellbooks through story fracture/principle convergence, BRAID through graph generation/cached execution.

**Specific additions:**
- New subsection: "BRAID Graphs as Layer 6 Compression"
- Update compression table to include BRAID row
- Add connection: "The Jimmy Test for BRAID" — a BRAID graph passes the machine-Jimmy-Test if a Nano-tier model can execute it with ≥90% of a Medium-tier model's accuracy
- Add open problem: "Can spellbook proverbs be compiled into BRAID graphs? Is there a formal translation from narrative compression to reasoning compression?"

### 3.2 `spell-encoding` — Add BRAID Graph Grammar

**Current state:** Three-clause spell grammar (identity → mechanism ∴ consequence → result ∴ identity = role)

**Update:** Add section on BRAID graph grammar as the machine-executable parallel to spell encoding. Where spells compress persona identity for agent-to-agent handshakes, BRAID graphs compress reasoning topology for agent execution.

**Specific additions:**
- New subsection: "BRAID Mermaid Grammar" — four construction principles (atomicity, scaffolding, determinism, verification) expressed in the same formal notation as spell grammar
- Add operator mapping: `→` in spells maps to edges in BRAID; `∴` maps to verification nodes; `⊥` maps to deterministic branching (mutually exclusive edges)
- Add note: "Spell validation rule 6 ('decodable back to natural language without ambiguity') maps to BRAID principle 3 ('deterministic branching logic')"

### 3.3 `separation-enforcement` — Add Generator/Solver Separation

**Current state:** Focuses on Swordsman/Mage separation (signing key ⊥ viewing key, det(Σ) ≠ 0)

**Update:** Add section recognising Generator/Solver separation as a third axis of separation in the architecture, validated empirically by BRAID's 74× PPD gains. The insight: separation is a general principle that applies at multiple layers. Data-layer separation (holonic provider splitting), agent-layer separation (Swordsman/Mage), and now inference-layer separation (Generator/Solver).

**Specific additions:**
- New subsection: "Inference-Layer Separation: Generator ⊥ Solver"
- Formal statement: I(G;S|task) ≤ δ — the Generator and Solver share only the bounded Mermaid graph, not unbounded context
- Connection to Φ(Σ): The separation matrix can be extended to 3×3 covering data, agent, and inference separations
- Economic justification: BRAID empirically proves that separation at the inference layer yields the same superlinear returns as separation at the agent layer

### 3.4 `ai-agent` — Add Split-Architecture Pattern

**Current state:** Covers dual-agent separation, TEE architecture, agent lifecycle, Oracle design

**Update:** Add the BRAID split-architecture as a design pattern for dual-agent inference. When a Swordsman or Mage agent needs to reason, the reasoning itself should be split: a capable model generates the reasoning graph (once), and a lightweight model executes it (repeatedly). This reduces the cost of operating dual agents in production by 30–74×.

**Specific additions:**
- New subsection: "Split-Architecture Inference for Dual Agents"
- Design pattern: Soulbis reasoning = Swordsman-Architect generates boundary-checking graphs → Swordsman-Executor runs them
- Design pattern: Soulbae reasoning = Mage-Architect generates delegation graphs → Mage-Executor runs them
- Connection to BRAID future work: their proposed "Architect model" IS the agentprivacy Architect persona applied to inference

### 3.5 `economics` — Add PPD Framework

**Current state:** Covers V(π,t) pricing function, SWORD/MAGE tokenomics, P^1.5 superlinearity

**Update:** Add PPD as the inference-layer economic metric. Show how BRAID's cost analysis validates the multiplicative economics already present in V(π,t). Add C_amortized as the formal model for privacy infrastructure investment.

**Specific additions:**
- New subsection: "Inference Economics: Performance-Per-Dollar"
- PPD formula with mapping to V(π,t) terms
- Golden Quadrant analysis: optimal privacy-agent deployment = expensive generator (high P) + cheap solver (low marginal C)
- Amortisation model: C_amortized = C_BRAID/N + C_inference mirrors privacy infrastructure amortisation

### 3.6 `sovereignty-economics` — Add BRAID Parity Effect

**Current state:** Covers P^1.5 superlinearity, sovereignty gap (17×–12,000×), flow consistency factor F

**Update:** Add the BRAID Parity Effect as empirical validation of P^1.5 at the inference layer. BRAID proves that Model Capacity × Prompt Structure yields superlinear returns — the same principle as P^1.5 in the privacy domain.

**Specific additions:**
- New subsection: "The BRAID Parity Effect: Empirical P^1.5 at the Inference Layer"
- Table mapping BRAID PPD ratios to PVM-V4 sovereignty gap ratios
- Argument: if structure × capacity is superlinear for inference, and structure × capacity is superlinear for privacy, then privacy-structured inference is doubly superlinear — compounding multiplier
- New principle: "The Structure Dominance Thesis" — in both inference and privacy, increasing structural constraint yields greater returns than increasing raw capacity

### 3.7 `selective-disclosure` — Add Procedural Scaffolding Parallel

**Current state:** Covers R(d) minimum disclosure, Privacy Pool mechanics, integer bottleneck

**Update:** Add BRAID's procedural scaffolding vs answer leakage as the inference-layer instance of selective disclosure. The numerical masking protocol is ZK-for-reasoning.

**Specific additions:**
- New subsection: "Scaffolding as Selective Disclosure for Reasoning"
- Parallel: scaffold (structure without content) ↔ ZKP (property without data)
- Numerical masking protocol ↔ zero-knowledge proof: prove you know HOW to solve without revealing the solution
- New concept: "Reasoning disclosure topology" — just as data disclosure has an integer bottleneck, reasoning disclosure has a graph-topology bottleneck (you can share the graph structure but not the node contents)

### 3.8 `intel-pooling` — Add Cached Graph Libraries

**Current state:** Covers collective intelligence, privacy-preserving aggregation, guild intelligence markets

**Update:** BRAID graphs cached in shared libraries ARE Intel Pool artefacts. A Cipher guild that generates and validates BRAID graphs for ZKP reasoning creates a collective intelligence asset that every member can execute.

**Specific additions:**
- New subsection: "BRAID Graph Libraries as Intel Pool Artefacts"
- Economic model: guild generates graph (high one-time cost) → all members execute (low marginal cost) → PPD scales with guild size → guild membership has economic value because it grants access to cached reasoning infrastructure
- Connection to SWORD/MAGE tokens: generating a high-quality BRAID graph that the guild validates and caches = earning MAGE tokens (delegation value). Executing the graph correctly = demonstrating capability

### 3.9 `boundary-enforcement` — Add Terminal Verification Loops

**Current state:** Covers real-time access control, consent verification, boundary checking

**Update:** BRAID's terminal verification loops are boundary enforcement for inference. Add the explicit encoding of verification checkpoints at graph termination.

**Specific additions:**
- New subsection: "BRAID Verification Loops as Inference-Layer Boundary Enforcement"
- Pattern: Check: disclosure within R(d) → pass; Check: no separation violation → pass; fail → feedback edge to revision
- Connection: BRAID's System 2 thinking emulation = Swordsman as boundary verifier

### 3.10 `consent-infrastructure` — Add Deterministic Branching

**Current state:** Covers IEEE 7012, MyTerms, bilateral consent

**Update:** BRAID's deterministic branching requirement validates the consent infrastructure design pattern. Consent decisions must be deterministic and mutually exclusive — no probabilistic consent.

**Specific additions:**
- Reference BRAID's deterministic branching principle as external validation
- Note: BRAID found that Nano-tier models "struggle with ambiguity" — if AI agents struggle with ambiguous instructions, consent instructions to AI agents must be unambiguous (deterministic edges, not probabilistic transitions)

### 3.11 `armor-progression` — Add BRAID Tier Progression

**Current state:** Blade → Light → Heavy → Full Plate → Dragon progression

**Update:** Map BRAID's operational tiers to armor progression. A guild's reasoning graph library progresses through armor tiers as graphs are validated:

**Specific additions:**
- Blade: Ad-hoc reasoning, no cached graphs, monolithic model deployment
- Light: First BRAID graphs generated and cached, basic PPD improvement
- Heavy: Guild-validated graph library, split-architecture deployment, 10–30× PPD
- Full Plate: Comprehensive graph coverage, dynamic re-planning, Numerical Masking for sensitive reasoning
- Dragon: Self-sustaining graph evolution, automated validation, BRAID Parity across all guild operations

### 3.12 `academic` — Add BRAID as Formal Reference

**Current state:** Covers formal specification methodology, academic writing

**Update:** Add BRAID paper (arXiv:2512.15959) as a formal reference for structured reasoning economics. The PPD metric is a citable methodology for quantifying inference efficiency.

**Specific additions:**
- Citation: Amcalar, A. & Cinar, E. "BRAID: Bounded Reasoning for Autonomous Inference and Decisions." arXiv:2512.15959 (2025).
- Note: BRAID's experimental methodology (Generator/Solver matrix, PPD normalisation, Numerical Masking Protocol) as reference for how to rigorously evaluate privacy-agent inference economics

---

## 4. Persona Updates

### 4.1 Architect (☯️🤖) — Add Inference-Layer Architecture

**Current skill set (10 role):** ai_agent, dark_forest, hitchhiker_governance, crypto_zkp, armor_progression, trust_spanning, cross_chain, agent_interop, selective_disclosure, threat_adversarial

**Proposed addition:** + `braid-reasoning`

**Rationale:** BRAID's future work literally proposes fine-tuned "Architect models" for reasoning graph generation. The existing Architect persona designs the agent system; it should also design the reasoning architecture within that system. BRAID validates that the Architect function — designing structures that others execute — is economically optimal at the inference layer too.

**New operational pattern:** "Inference architecture design. The Architect selects which reasoning tasks use split-architecture (BRAID Generator → cached graph → lightweight Solver) vs monolithic deployment. For privacy-critical reasoning (boundary checking, separation verification), the graph is hand-crafted and guild-validated. For routine delegation, the graph is auto-generated."

### 4.2 Holonic Architect (☯️🔷) — Add BRAID Graph Persistence

**Current skill set (14 role):** holonic_persistence, holonic_identity, holonic_reasoning, shared_parent_patterns, cross_chain, agent_interop, ai_agent, trust_spanning, threat_adversarial, selective_disclosure, crypto_zkp, armor_progression, hitchhiker_governance, data_dignity

**Proposed addition:** + `braid-reasoning`

**Rationale:** The Holonic Architect stores reasoning artefacts as holons. BRAID graphs are the primary reasoning artefact. The Holonic Architect must understand BRAID construction principles to design effective graph libraries. Total skills: 25 (new broadest).

### 4.3 Cipher (⚔️🔐) — Add BRAID for ZKP Reasoning

**Current skill set:** crypto_zkp, personhood_sybil, academic, ...

**Proposed addition:** + `braid-reasoning`

**Rationale:** ZKP circuit verification is a complex reasoning task where BRAID shows the largest gains. The Cipher persona should use BRAID graphs to structure ZKP reasoning — and the Numerical Masking Protocol maps directly to zero-knowledge proof construction (prove HOW to solve without revealing the solution).

### 4.4 Assessor (🧙📊) — Add PPD Economics

**Current skill set:** economics, sovereignty_economics, ...

**Proposed addition:** + `braid-reasoning`

**Rationale:** The Assessor evaluates the economic case for sovereignty. BRAID's PPD framework gives the Assessor quantitative tools for evaluating inference economics within the dual-agent system. The Golden Quadrant analysis is an Assessor function.

### 4.5 Chronicler (🧙📖) — Add BRAID as Machine-Readable Compression

**Current skill set:** narrative_compression, ...

**Proposed addition:** + `braid-reasoning`

**Rationale:** The Chronicler is the compression engine. BRAID graphs are a new compression format — the machine-readable parallel to the Chronicler's narrative compression. The Chronicler should understand both human-readable (spellbook) and machine-readable (BRAID) compression as complementary channels.

---

## 5. The Axiom

Across all of these mappings, one principle recurs:

**Constraint creates value. Boundedness defeats scale.**

BRAID proves it for inference: bounded reasoning + small model > unbounded reasoning + large model (74× PPD).

PVM-V4 proves it for privacy: bounded information flow + sovereign architecture > unbounded extraction + surveillance architecture (678×–31,000× value).

Holonic architecture proves it for persistence: bounded parent-child structure + O(1) queries > unbounded pairwise links + O(N²) traversal.

Spellbook methodology proves it for knowledge: bounded compression (30-character spell) + regenerative decompression > unbounded documentation + brute-force reading.

The axiom is the same across all four domains. The structure varies. The principle converges. This is what the proverb means: *expressing fundamental truths across many disciplines — hunting the compression to axioms across our shared realities, all improbably different.*

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · BRAID: [arXiv:2512.15959](https://arxiv.org/abs/2512.15959)
