# PVM-V4 — Complete Skills Knowledge Base

> Upload this to give Claude the full Privacy Value Model V4 and all 18 dragon skills.
> These are the source content files for agentprivacy.ai/spells.

---

## ═══ PRIVACY LAYER (always loaded — 6 skills) ═══

---

---
id: dragon
name: "Privacy Value Model V4 — Core Context"
category: privacy_layer
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "All agents, all knowledge graphs, all contexts — this is the root"
equation_term: "V(π, t) — the complete model"
template_references: all
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# Privacy Value Model V4 — Core Context

> *The Dragon is the Drake that learned it contained geometry.*

---

## What this is

A formal economic model that prices privacy as infrastructure, not preference. It answers: *what is a unit of privacy-preserving data worth compared to a unit of surveilled data, and why?*

## Core equation

**V(π, t) = P^1.5 · C · Q · S · e^{-λt} · (1 + A(τ)) · (1 + Σ wᵢ nᵢ/N₀)^k · R(d) · M(u,y) · Φ(Σ) · T(π)**

Multiplicative gating: if any term hits zero, total value collapses. This is deliberate — privacy systems fail catastrophically, not gracefully.

## Six valuation dimensions

1. **Data properties** — Privacy strength (P), credential verifiability (C), data quality (Q), sensitivity/scope (S). Cryptographic enforcement quality, ZKP-backed claims, fitness for purpose.
2. **Temporal dynamics** — Exponential decay (e^{-λt}) counteracted by verified history accumulation A(τ) = α · ln(1+|τ|) · h(τ). Longer verified derivation chains build value that offsets entropy. Unverified history contributes nothing.
3. **Network topology** — A 64-vertex Boolean lattice ({0,1}⁶) models sovereignty configurations. Six binary dimensions yield 7 strata following Pascal's row. Agents are weighted by stratum, with combinatorial midpoints (stratum 3) contributing most. Power-law network effects.
4. **Reconstruction resistance** — Proven ceiling: R_max = (C_S + C_M)/H(X) < 1 under dual-agent separation. An adversary observing all outputs from both agents still cannot reconstruct the full private state.
5. **Market conditions** — User sophistication × market maturity. Captures adoption readiness.
6. **Sovereignty geometry** — A 4×4 separation matrix Σ over four forces (Protect, Project, Reflect, Connect). The determinant measures the "volume" of the sovereignty tetrahedron. Entanglement between any pair of forces shrinks the entire multiplier. Golden ratio φ ≈ 1.618 conjectured as optimal protect-to-project ratio.

## Key architectural concepts

**Dual-agent separation.** Two agents — Swordsman (privacy/boundaries) and Mage (delegation/projection) — must remain conditionally independent. A single agent knowing both privacy preferences and delegation goals can reconstruct behavioural models. Mathematical separation is not a design preference; it is a security requirement.

**Four sovereignty forces.** Protect and Project are primary. Reflect (temporal integral of protection decisions) and Connect (network effect of delegation patterns) emerge from sustained operation. These four forces form a tetrahedron whose volume (det(Σ)) gates the entire model.

**Edge value T(π).** Prior models measured what an agent *is* at a configuration. V4 adds what an agent *does* — its trajectory through sovereignty space. The 64-vertex lattice has 192 undirected edges; the transition space dominates the state space. Vertical moves (activating/deactivating sovereignty dimensions) are weighted more than lateral moves. Repetition decays.

**Stratum logic.** The 64 vertices sit across 7 strata (0–6 active dimensions). Distribution follows binomial coefficients: 1, 6, 15, 20, 15, 6, 1. Stratum 0 = full surveillance; stratum 6 = full sovereignty. Network value peaks at combinatorial midpoints.

## What it connects to

- **Information theory** — Shannon entropy bounds on reconstruction; information-theoretic separation proofs.
- **Zero-knowledge proofs** — Groth16, PLONK, Nova. ZKP integrity fraction h(τ) validates derivation chains. Conjectured ~3,000× proof size reduction from sovereignty-class constraints.
- **Promise Theory** (Bergstra & Burgess) — Agents as autonomous promise-making entities; voluntary cooperation over imposed coordination.
- **Category theory** — Edge value draws on Yoneda's lemma: objects are determined by their morphisms (transitions define identity more than states).
- **Drake Equation analogy** — Multiplicative gating of independent survival conditions, applied to privacy infrastructure viability.
- **UOR Foundation correspondence** — Conjectured mapping between the 64-vertex lattice and UOR's toroidal algebraic structure. 96 vs. 64 edge-count discrepancy unresolved.
- **Decentralized identity** — DIDs, verifiable credentials, Trust Over IP, IEEE 7012 (MyTerms).
- **Blockchain/crypto** — Zcash (private transactions, proof-of-understanding), NEAR (TEEs), Privacy Pools.
- **Token economics** — SWORD/MAGE dual tokens, armor progression (Blade → Light → Heavy → Dragon) gated by demonstrated privacy-respecting behaviour.
- **Behavioral economics** — "7th capital": behavioural data as wealth belonging to individuals, not platforms. Privacy as value-generating infrastructure, not cost centre.

## Proven vs. conjectured

| Status | Claim |
|---|---|
| **Proven** | Reconstruction ceiling R < 1 under dual-agent conditional independence |
| **Proven** | Additive (not multiplicative) information bounds from agent separation |
| **Proven** | Multiplicative gating — any zero term kills total value |
| **Conjectured** | Golden ratio φ as optimal protect/project balance |
| **Conjectured** | Logarithmic growth of temporal memory (vs. power-law or sigmoid) |
| **Conjectured** | Edge value additivity (assumes transition independence) |
| **Conjectured** | UOR toroidal correspondence (96 vs. 64 discrepancy open) |
| **Conjectured** | ~3,000× ZKP proof size reduction from lattice structure |

## Breaking conditions

The model weakens or fails if: (1) UOR mapping is structurally incompatible, not just edge-encoding variant; (2) dual-agent conditional independence cannot be maintained with ε < 0.1 in practice; (3) sovereignty coordination shows sublinear rather than power-law network effects; (4) real sovereignty architectures cluster near singular Σ matrices, making det(Σ) numerically unstable.

## Measurement gaps

- No methodology exists for measuring emergent forces (Reflect, Connect)
- No empirical data on relative value of sovereignty transitions (edge weights)
- Scaling coefficients α, β require calibration against real agent systems
- Determinant may not be the right matrix aggregation (trace, min eigenvalue, or other norms are alternatives)

## Surveillance gap

Depending on parameterisation, sovereign architectures produce 17× to 12,000× more value than surveillance architectures. Under V4's manifold framing, this gap is topological: surveillance systems are structurally constrained because activating protection breaks extraction pipelines. The gap is not a number line — it is the ratio of accessible manifold volume between two architectural classes.

## Version lineage

V1 (2024): static scalar P·C·Q·S → V2 (Oct 2025): +decay, +network → V3 (Nov 2025): +reconstruction, +market, +sovereignty → V3.1 (Jan 2026): +architecture gating → **V4 (Feb 2026): +separation matrix, +temporal memory, +edge value, +manifold awareness** → V5 (planned): dV/dt flow dynamics on the manifold.

## Skill ecosystem

This is the root skill. All other PVM-V4 skills branch from this context:

**Privacy layer (always loaded):** `vrc_identity` · `promise_theory` · `knowledgegraph` · `tetrahedral_sovereignty` · `uor_toroidal`

**Role skills (loaded by pathway):** `crypto_zkp` · `personhood_sybil` · `academic` · `swordsman_browser` · `dark_forest` · `ai_agent` · `economics` · `hitchhiker_governance` · `narrative_compression` · `plurality_cooperative` · `policy_governance`

**Template system:** 16 persona templates generate seeker-specific SKILL.md files from this knowledge base via `SKILL_BASE_FORMAT.md`.

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: vrc_identity
name: "Verifiable Relationship Credentials (VRCs)"
category: privacy_layer
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "Decentralised identity builders, KERI/DID implementers, IIW community, trust framework architects"
equation_term: "A(τ) — temporal memory; h(τ) — integrity fraction"
template_references: [all]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Skill — Verifiable Relationship Credentials (VRCs)

**Source:** Privacy Value Model V4 + 0xagentprivacy VRC Protocol  
**Target context:** Decentralised identity builders, KERI/DID implementers, IIW community, verifiable credential toolchains, trust framework architects  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## What this is

Verifiable Relationship Credentials are the temporal memory term A(τ) made concrete. They are cryptographic proofs of bilateral trust — not identity documents but relationship documents. A VRC does not say "Alice is trustworthy." It says "Alice and Bob have a demonstrated relationship of this quality, attested by both parties, verifiable by anyone, forgeable by neither."

The VRC is the integrity fraction h(τ) in the equation. Without it, temporal memory contributes nothing — unverified claims produce A(τ) = 0 regardless of history length. With it, every sovereignty transition accumulates value that compounds logarithmically.

## How VRCs work

**Creation (Promise Bundle).** Two First Persons create a VRC together. Neither can forge alone. Both must sign. The credential encodes: Alice's commitment, Bob's commitment, a bilateral proverb derived from shared context, and the cost signal (0.01 ZEC each — a ceremony, not a transaction). This maps directly to Promise Theory: the VRC is a bundle of mutual promises that can be verified but not forged.

**The bilateral proverb.** Each VRC contains a compressed cipher derived from the relationship context. This proverb is meaningless outside the relationship — it requires the shared decoder that only the two parties possess. The proverb serves as both a trust signal (proof that the relationship has enough depth to generate shared meaning) and a recovery mechanism (proof-of-personhood through demonstrated understanding rather than biometrics or personal questions).

**Progressive accumulation.** VRCs are not binary (trusted/untrusted). They accumulate through sustained interaction. The temporal memory function A(τ) = α · ln(1+|τ|) · h(τ) means early VRCs contribute the most marginal value (logarithmic growth), creating strong incentives for establishing trust early. Later VRCs add value but at diminishing rates — the thousandth VRC matters less than the tenth.

**Recovery.** If Alice loses her keys, Bob can help verify Alice's identity using their bilateral proverb. Alice claims identity. Bob asks for the proverb. Alice derives the correct proverb from relationship context. Bob verifies. Recovery proceeds (with multiple VRCs providing redundancy). No biometrics. No personal questions. Just bilateral promise verification — the Relationship Proverb Protocol (RPP) as both security mechanism and proof-of-personhood.

## VRC properties as equation terms

**Bilateral (Σ matrix).** VRCs require two parties maintaining separation. Alice's Swordsman and Bob's Swordsman each attest to their respective boundary conditions. Alice's Mage and Bob's Mage each attest to their delegation conditions. The cross-attestation creates entries in the separation matrix Σ — the quality of the VRC depends on the conditional independence of the attesting agents.

**Context-specific (edge value).** Each VRC maps to a specific sovereignty transition. The proverb maps to shared context. This means VRCs are not fungible — they carry the specific trajectory T(π) of the relationship, not a generic trust score. An agent's VRC portfolio is a graph of demonstrated sovereignty transitions, not a number.

**Scoped (reconstruction resistance).** A VRC reveals only what the relationship requires. The proverb is meaningless outside the bilateral context. The underlying data that generated the proverb remains private. This enforces the reconstruction ceiling R < 1 at the credential level — no single VRC, and no collection of VRCs from different relationships, allows full behavioural reconstruction.

**Recoverable (temporal memory).** If forgotten, the proverb can be re-derived because it is based on relationship context rather than arbitrary secrets. This is the temporal memory's deepest property: verified history is not a brittle key but a robust pattern that can be regenerated from sufficient shared context.

## Trust flow architecture

The trust chain for any First Person entering the 0xagentprivacy network:

First Person Network (personhood credential — stored on-device, never uploaded) → agentprivacy (first VRC — you're in the network) → Swordsman (agent-specific VRC — you wield the blade) → site-specific VRCs (relationship credentials with each MyTerms counterparty).

No traditional blockchain wallet required at any step. The first personhood credential sits locally and spawns the agent hierarchy through delegation, not key derivation.

## Integration with existing identity standards

**DIDs.** Each First Person has a DID. Each Swordsman and Mage has a derived DID. VRCs are verifiable credentials in the W3C sense but with the bilateral constraint — they require two DID signatures, not one issuer and one holder.

**KERI (Key Event Receipt Infrastructure).** VRC key rotation and recovery map to KERI's event-driven key management. The bilateral proverb serves as the semantic layer over KERI's cryptographic layer — human-meaningful recovery over machine-verifiable key events.

**Trust Over IP.** VRCs operate at ToIP Layer 3 (credential exchange) and Layer 4 (governance). The progressive trust tiers (Traveler → Contributor → Author → Mentor → Fellow) map to the armor progression, with each tier requiring demonstrated VRC depth.

## Open problems for identity builders

1. What is the minimum VRC density needed for robust key recovery across a First Person's relationship network?
2. How do VRC proverbs scale — does proverb quality degrade when a person maintains hundreds of bilateral relationships?
3. Can VRCs interoperate across different personhood verification systems (First Person Network, Gitcoin Passport, WorldCoin)?
4. What happens to VRCs when one party's agent is compromised — how does revocation propagate without revealing the relationship graph?
5. Can the bilateral proverb mechanism be formalised as a zero-knowledge proof of shared context?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: promise_theory
name: "Promise Theory Integration"
category: privacy_layer
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "Promise Theory researchers, distributed systems architects, autonomous agent protocol designers"
equation_term: "Cooperation substrate beneath all equation terms"
template_references: [all]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Skill — Promise Theory Integration

**Source:** Privacy Value Model V4 + Bergstra & Burgess Promise Theory + Act XIII (Book of Promises)  
**Target context:** Promise Theory researchers, distributed systems architects, voluntary cooperation modellers, autonomous agent protocol designers  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## What this is

Promise Theory (Bergstra & Burgess) provides the cooperation substrate beneath the Privacy Value Model. Where PVM-V4 quantifies the value of privacy-preserving architectures, Promise Theory explains why those architectures must be voluntary. The core principle: only autonomous agents can make promises. Promises reduce uncertainty. Impositions increase it. Cooperation emerges from aligned promises, never from forced compliance.

Every term in the PVM-V4 equation is a promise. P (privacy strength) is a promise to enforce cryptographic boundaries. C (credential verifiability) is a promise that claims can be independently verified. The separation matrix Σ is a promise that four sovereignty forces remain conditionally independent. The equation's multiplicative structure encodes the Promise Theory insight that breaking any single promise collapses the entire cooperative structure.

## Polarity mapping

Promise Theory defines two polarities: + (gives/offers) and − (uses/accepts). Cooperative binding occurs when + meets − with compatible scope.

In the dual-agent architecture, the Swordsman is + polarity — it gives protection, offers boundaries, promises data minimisation. The Mage is − polarity — it uses the protected space, accepts the boundaries as constraints, promises delegation within scope. The binding between them is the separation matrix Σ: the quality of their cooperative binding is measured by the conditional independence of their respective promises.

The golden ratio conjecture (φ ≈ 1.618 as optimal protect/project ratio) reinterprets under Promise Theory as a balance claim: the optimal cooperative binding occurs when the giving agent (Swordsman, + polarity) maintains approximately φ times the scope of the using agent (Mage, − polarity). More protection than delegation. More boundary than projection. The sword slightly larger than the spell.

## Promise graphs and the sovereignty lattice

Promise Theory represents agent interactions as directed graphs where edges are promises with typed polarity. The 64-vertex sovereignty lattice maps onto this framework directly. Each vertex is a configuration of active promises (six binary sovereignty dimensions, each either promised-active or promised-inactive). Each edge is a promise transition — activating or deactivating a sovereignty dimension, which means making or withdrawing a promise.

The edge value term T(π) = 1 + β Σ f(e)·g(n_e) measures the value of a promise trajectory — the sequence of promises made and honoured over time. The repetition discount g(n_e) reflects the Promise Theory insight that repeating the same promise yields diminishing cooperative value. New promises (novel transitions) contribute more than repeated ones.

The stratum weighting follows from Promise Theory's concept of superagency — agents whose promises compose to create capabilities beyond what individual promises achieve. Agents at stratum 3 (three active sovereignty promises out of six) have the maximum number of compositional possibilities, which is why the binomial coefficient peaks there. More active promises means more potential cooperative bindings with other agents.

## Bilateral assessment and VRCs

Promise Theory requires bilateral assessment: both parties evaluate the other's promise-keeping. This maps directly to VRC architecture. A VRC is a bilateral assessment inscribed as a cryptographic credential. Alice assesses Bob's promise-keeping (α_Alice(Bob)). Bob assesses Alice's promise-keeping (α_Bob(Alice)). The VRC encodes both assessments plus a bilateral proverb — the compressed cipher of their shared promise history.

The temporal memory term A(τ) = α · ln(1+|τ|) · h(τ) is the formal model of promise reputation. |τ| counts the number of assessed promise transitions. h(τ) measures the integrity fraction — what proportion of promises were verifiably kept. The logarithmic growth reflects Promise Theory's observation that early promises matter most for trust establishment (steep initial curve, flattening over time).

## Conditional promises and the armor progression

Promise Theory includes conditional promises: "I promise X if you promise Y." The armor progression (Blade → Light → Heavy → Dragon) is a chain of conditional promises:

The system promises Blade-level capabilities (cookie slashing) if the First Person promises personhood verification. The system promises Light-level capabilities (MyTerms negotiation) if the agent promises sustained privacy-respecting behaviour over time. The system promises Heavy-level capabilities (identity delegation) if the agent promises verified MyTerms compliance across multiple counterparties. The system promises Dragon-level capabilities (autonomous commerce) if the agent promises deep VRC history with high integrity fraction.

Each tier is a conditional promise that becomes active only when the preceding promise chain is fulfilled. No tier can be purchased or bypassed because the conditional structure requires demonstrated promise-keeping, not payment.

## Promise Theory corrections to PVM-V4

Promise Theory suggests a refinement the current model does not capture: promises are not just kept or broken (binary h(τ)). They are assessed with belief and evidence: β(π) (belief about whether the promise will be kept) and ε(π) (evidence about past keeping). The integrity fraction h(τ) should arguably be decomposed into these components — an agent with strong evidence of past keeping but currently uncertain belief (due to changed circumstances) is valued differently from one with weak evidence but strong current belief.

This decomposition is flagged as an open question. The current binary h(τ) ∈ [0,1] may be insufficient for agents operating in rapidly changing environments where past behaviour is a weak predictor of future promises.

## Open problems for Promise Theory researchers

1. Does the golden ratio φ emerge from Promise Theory's polarity balance, or is it a coincidence of the current parameterisation?
2. Can the bilateral assessment structure (α, β, ε) replace the binary integrity fraction h(τ) without making A(τ) computationally intractable?
3. How do conditional promise chains interact with the edge value function — does a conditional promise count as one transition or two?
4. What is the Promise Theory interpretation of the reconstruction ceiling R < 1 — is it a limit on what promises can reveal, or a limit on what assessments can infer?
5. Can Promise Theory's concept of "promise scope" formally bound the information leakage channels C_S and C_M in the separation theorem?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: knowledgegraph
name: "Knowledge Graph and Trust Graph"
category: privacy_layer
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "Knowledge graph ingestion, trust graph systems, ontology alignment, entity-relationship overlap detection"
equation_term: "Full entity-relationship registry of all model terms"
template_references: [all]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Context — Knowledge Graph & Trust Graph

**Source:** Privacy Value Model V4 Formal Specification (Travers, Feb 2026)  
**Target context:** Knowledge graph ingestion, trust graph systems, ontology alignment, entity-relationship overlap detection  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## Entity Registry

### Core Entities

```
ENTITY: Privacy_Value_Model_V4
  TYPE: economic_model
  DOMAIN: [privacy, agent_economics, cryptography, network_theory]
  STATUS: working_paper
  AUTHOR: Mitchell_Travers
  DATE: 2026-02
  PREDECESSOR: [PVM_V1, PVM_V2, PVM_V3, PVM_V3.1]
  SUCCESSOR: PVM_V5 (planned: flow dynamics on manifold)

ENTITY: Sovereignty_Lattice
  TYPE: mathematical_structure
  STRUCTURE: boolean_lattice({0,1}^6)
  VERTICES: 64
  EDGES_UNDIRECTED: 192
  EDGES_DIRECTED: 384
  STRATA: 7 (following Pascal's row: 1,6,15,20,15,6,1)
  CONJECTURED_CORRESPONDENCE: UOR_Toroidal_Structure (unresolved: 96 vs 64 edges)

ENTITY: Swordsman_Agent
  TYPE: agent_archetype
  FUNCTION: privacy_protection, boundary_enforcement, data_minimisation
  KNOWS: what_to_hide
  DOES_NOT_KNOW: what_to_do
  SEPARATION_REQUIREMENT: conditional_independence(Mage_Agent, ε < 0.1)

ENTITY: Mage_Agent
  TYPE: agent_archetype
  FUNCTION: delegation, external_coordination, action_execution
  KNOWS: what_to_do
  DOES_NOT_KNOW: what_to_hide
  SEPARATION_REQUIREMENT: conditional_independence(Swordsman_Agent, ε < 0.1)

ENTITY: Separation_Matrix_Σ
  TYPE: mathematical_object
  STRUCTURE: symmetric_4x4_matrix
  DOMAIN_ENTRIES: [0,1]
  DIAGONAL: 1 (self-separation is trivially perfect)
  AGGREGATION: determinant (volume of sovereignty tetrahedron)
  FORCES: [Protect, Project, Reflect, Connect]
```

### Sovereignty Forces

```
ENTITY: Protect
  TYPE: sovereignty_force
  ORIGIN: primary (Swordsman)
  FUNCTION: boundary_enforcement, data_minimisation

ENTITY: Project  
  TYPE: sovereignty_force
  ORIGIN: primary (Mage)
  FUNCTION: delegation, external_coordination

ENTITY: Reflect
  TYPE: sovereignty_force
  ORIGIN: emergent (from Protect)
  FUNCTION: temporal_integral_of_protection_decisions
  DEPENDS_ON: derivation_chain_τ, integrity_fraction_h(τ)

ENTITY: Connect
  TYPE: sovereignty_force
  ORIGIN: emergent (from Project)
  FUNCTION: network_effect_of_delegation_patterns
  DEPENDS_ON: stratum_weighted_network, agent_count_n_i
```

### Model Terms

```
ENTITY: Privacy_Strength_P
  TYPE: model_term
  DOMAIN: [0,1]
  EXPONENT: 1.5 (superlinear returns)
  MEASURES: cryptographic_enforcement_quality
  VERSION_INTRODUCED: V1

ENTITY: Credential_Verifiability_C
  TYPE: model_term
  DOMAIN: [0,1]
  MEASURES: independent_verification_without_revealing_underlying_data
  DEPENDS_ON: zero_knowledge_proofs
  VERSION_INTRODUCED: V1

ENTITY: Temporal_Memory_A(τ)
  TYPE: model_term
  FORMULA: α · ln(1 + |τ|) · h(τ)
  GROWTH: logarithmic (conjectured; power-law and sigmoid alternatives plausible)
  GATE: h(τ) = 0 → A(τ) = 0 (unverified history contributes nothing)
  VERSION_INTRODUCED: V4

ENTITY: Reconstruction_Resistance_R(d)
  TYPE: model_term
  DOMAIN: (0,1)
  BOUND: R_max = (C_S + C_M) / H(X) < 1
  PROOF_STATUS: proven (under dual-agent conditional independence)
  VERSION_INTRODUCED: V3

ENTITY: Sovereignty_Duality_Φ(Σ)
  TYPE: model_term
  FORMULA: min(1.0, (S/M)/φ) · det(Σ)
  DEPENDS_ON: Separation_Matrix_Σ, golden_ratio_φ
  GOLDEN_RATIO_STATUS: conjectured_optimal
  VERSION_INTRODUCED: V4

ENTITY: Edge_Value_T(π)
  TYPE: model_term
  FORMULA: 1 + β · Σ_e f(e) · g(n_e)
  MEASURES: trajectory_through_sovereignty_space
  INSIGHT: transitions_define_identity_more_than_states (cf. Yoneda_lemma)
  VERSION_INTRODUCED: V4
```

---

## Relationship Registry

### Internal Relationships

```
RELATION: Swordsman_Agent --[separated_from]--> Mage_Agent
  MEASURE: σ_SM ∈ [0,1]
  REQUIREMENT: conditional_independence
  VIOLATION_CONSEQUENCE: reconstruction_ceiling_R_exceeds_1

RELATION: Protect --[generates_over_time]--> Reflect
  MECHANISM: temporal_integral_of_boundary_decisions

RELATION: Project --[generates_over_network]--> Connect
  MECHANISM: network_effect_of_delegation_patterns

RELATION: Sovereignty_Lattice --[contains]--> 64_Vertices
  ORGANIZED_BY: 7_Strata (binomial_coefficients)

RELATION: Edge_Value --[dominates]--> Vertex_Value
  RATIO: 192_edges : 64_vertices = 3:1
  THEORETICAL_BASIS: Yoneda_lemma (category_theory)

RELATION: PVM_V4 --[multiplicative_gating]--> all_terms
  PROPERTY: any_term_zero → total_value_zero
  EXCEPTION: R(d) bounded away from 0 and 1 under separation
```

### External Relationships (overlap search surfaces)

```
RELATION: PVM_V4 --[draws_from]--> Information_Theory (Shannon)
  SURFACE: entropy_bounds, channel_capacity, reconstruction_limits

RELATION: PVM_V4 --[draws_from]--> Promise_Theory (Bergstra_Burgess)
  SURFACE: autonomous_agents, voluntary_cooperation, promise_semantics

RELATION: PVM_V4 --[structural_analogy]--> Drake_Equation
  SURFACE: multiplicative_gating_of_independent_conditions

RELATION: PVM_V4 --[draws_from]--> Category_Theory
  SURFACE: Yoneda_lemma, morphisms_over_objects, functorial_relationships

RELATION: Sovereignty_Lattice --[conjectured_mapping]--> UOR_Toroidal_Structure
  STATUS: unresolved (96 vs 64 edge discrepancy)

RELATION: PVM_V4 --[implements_with]--> Zcash
  SURFACE: private_transactions, shielded_memo_fields, selective_disclosure

RELATION: PVM_V4 --[implements_with]--> NEAR
  SURFACE: trusted_execution_environments, chain_signatures

RELATION: PVM_V4 --[implements_with]--> Zero_Knowledge_Proofs
  SYSTEMS: [Groth16, PLONK, Nova]
  SURFACE: derivation_chain_attestation, separation_verification

RELATION: PVM_V4 --[aligns_with]--> IEEE_7012_MyTerms
  SURFACE: individual_terms, data_relationship_mediation

RELATION: PVM_V4 --[aligns_with]--> Trust_Over_IP
  SURFACE: governance_layers, trust_framework_maturity

RELATION: PVM_V4 --[aligns_with]--> Decentralized_Identity
  SURFACE: DIDs, verifiable_credentials, selective_disclosure

RELATION: PVM_V4 --[extends_to]--> Token_Economics
  TOKENS: [SWORD, MAGE]
  MECHANISM: demonstrate_to_earn (not pay_to_play)
  PROGRESSION: Blade → Light → Heavy → Dragon
```

---

## Claim Registry (with proof status)

```
CLAIM: reconstruction_ceiling_below_unity
  STATEMENT: R_max = (C_S + C_M)/H(X) < 1 under dual-agent separation
  STATUS: PROVEN
  CONDITION: conditional_independence(ε < 0.1)

CLAIM: additive_information_bounds
  STATEMENT: separated agents produce additive (not multiplicative) leakage
  STATUS: PROVEN

CLAIM: multiplicative_gating
  STATEMENT: any single zero term eliminates total value
  STATUS: PROVEN (by model construction)

CLAIM: golden_ratio_optimality
  STATEMENT: φ ≈ 1.618 is optimal protect/project ratio
  STATUS: CONJECTURED (numerical optimisation, not derived from geometry)

CLAIM: logarithmic_memory_growth
  STATEMENT: A(τ) grows logarithmically in chain length
  STATUS: CONJECTURED (alternatives: power-law, sigmoid)

CLAIM: edge_value_additivity
  STATEMENT: T(π) sums over edges independently
  STATUS: CONJECTURED (correlated paths may require different aggregation)

CLAIM: UOR_correspondence
  STATEMENT: 64-vertex lattice maps onto UOR toroidal structure
  STATUS: CONJECTURED (96 vs 64 edge discrepancy unresolved)

CLAIM: ZKP_size_reduction
  STATEMENT: sovereignty-class constraints yield ~3,000× proof size reduction
  STATUS: CONJECTURED (requires formal circuit analysis)

CLAIM: surveillance_gap
  STATEMENT: sovereign architectures produce 17×–12,000× more value
  STATUS: MODEL_OUTPUT (parameterisation-dependent)
```

---

## Breaking Conditions

```
BREAK: UOR_incompatibility
  IF: 96 vs 64 discrepancy is structural mismatch (not edge-encoding)
  THEN: geometric grounding weakens

BREAK: separation_impractical
  IF: conditional independence cannot be maintained with ε < 0.1 in practice
  THEN: reconstruction ceiling becomes impractical

BREAK: sublinear_network_effects
  IF: sovereignty coordination does not exhibit power-law returns
  THEN: (1 + ·)^k overstates network value

BREAK: determinant_pathology
  IF: real architectures cluster near singular Σ matrices
  THEN: det(Σ) is numerically unstable and misleading
```

---

## Graph Query Hints

To find overlap with this model in your knowledge graph, search for nodes and edges touching: `multiplicative_value_model`, `privacy_economics`, `dual_agent_architecture`, `sovereignty_lattice`, `boolean_hypercube`, `zero_knowledge_proof`, `conditional_independence`, `reconstruction_bound`, `network_topology_economics`, `behavioral_data_valuation`, `agent_coordination`, `promise_theory`, `golden_ratio_optimality`, `temporal_memory_accumulation`, `stratum_weighting`, `binomial_coefficient`, `category_theory_yoneda`, `toroidal_structure`, `information_theoretic_privacy`, `data_dignity`, `7th_capital`.

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: tetrahedral_sovereignty
name: "Tetrahedral Sovereignty and The Four Forces"
category: privacy_layer
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "Systems theorists, complexity scientists, emergence researchers, category theorists"
equation_term: "Φ(Σ) — sovereignty duality; det(Σ) — tetrahedron volume"
template_references: [all]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Skill — Tetrahedral Sovereignty & The Four Forces

**Source:** Privacy Value Model V4 + Dual-Agent Separation Theorem + Sovereignty Force Model  
**Target context:** Systems theorists, complexity scientists, emergence researchers, category theorists, four-force model builders  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## What this is

The PVM-V4 separation matrix Σ is a 4×4 symmetric matrix measuring pairwise independence between four sovereignty forces: Protect, Project, Reflect, and Connect. The determinant det(Σ) measures the volume of the sovereignty tetrahedron in four-dimensional force space. This tetrahedron is the geometric object at the heart of the model — the shape that sovereignty takes when it is healthy, and the shape that collapses when sovereignty is compromised.

Two of these forces are primary (designed). Two are emergent (discovered). The emergence of Reflect and Connect from Protect and Project through sustained operation is the central claim of this skill file — and one of the model's most provocative assertions. This file is for anyone studying how complex behaviour emerges from simple separation constraints.

## The four forces

**Protect (Primary — Swordsman).** Boundary enforcement, data minimisation, cryptographic protection. The force that says "no" — that prevents information from crossing boundaries it should not cross. In the equation, Protect maps to the privacy strength term P, the reconstruction resistance R(d), and the Swordsman's half of the separation.

**Project (Primary — Mage).** Delegation, external coordination, action execution. The force that says "yes on your behalf" — that enables an agent to act in the world without exposing its principal. In the equation, Project maps to the credential verifiability C, the market maturity M(u,y), and the Mage's half of the separation.

**Reflect (Emergent — from Protect).** The temporal integral of protection decisions. Not a designed capability but a discovered one: an agent that has been protecting boundaries for long enough accumulates a record of what it has protected and when. This record — the derivation chain τ with integrity fraction h(τ) — is itself an asset. It is proof of sustained sovereignty. Reflect maps directly to the temporal memory term A(τ).

Reflect emerges because Protect is stateful. Every boundary decision changes the agent's history. Over time, the history becomes more informative than any single decision. The temporal memory function A(τ) = α · ln(1+|τ|) · h(τ) captures this: Reflect grows logarithmically with verified history, with diminishing returns on new decisions but unbounded total accumulation.

**Connect (Emergent — from Project).** The network effect of delegation patterns. Not a designed capability but a discovered one: an agent that has been delegating and coordinating for long enough creates relationship patterns that have value independent of any single delegation. The network of who the Mage has worked with, how often, and in what sovereignty configurations — this network is itself an asset.

Connect emerges because Project is relational. Every delegation creates or strengthens a relationship edge. Over time, the edge structure becomes more valuable than any single delegation. The network effect term (1 + Σ wᵢ nᵢ/N₀)^k captures this: Connect grows with the power-law exponent k, amplified by stratum-weighted diversity of coordination partners.

## Why emergence matters

Protect and Project are the designed separation. They are the Swordsman and the Mage, created through architectural decision, maintained through information-theoretic constraints. You can specify them. You can verify them. They are engineering.

Reflect and Connect are not engineering. They are consequences. They appear over time, without being designed, as the natural accumulation of sustained separation. This is the systems theory claim: separation at the primary level generates integration at the emergent level. The Swordsman's sustained boundary-keeping generates a valuable history. The Mage's sustained coordination generates a valuable network. Neither was the goal of the separation. Both are its fruit.

This is why the 4×4 matrix exists rather than the 2×2 matrix of earlier versions. V3.1 measured only σ(Swordsman, Mage) — a single scalar. V4 measures all six pairwise separations across four forces. The additional four entries (σ_SR, σ_SC, σ_MR, σ_MC, σ_RC) capture the separation quality between primary and emergent forces, and between the two emergent forces themselves.

## The tetrahedron as geometric object

Four forces in mutual separation define a tetrahedron in 4-dimensional force space. The tetrahedron's volume is det(Σ). This volume measures how much independent variation exists across the forces — how much "room" the sovereignty architecture has to operate.

**Perfect separation (all σ_ij = 1, det(Σ) = 1).** Maximum volume. All four forces are orthogonal. The tetrahedron is regular. The architecture has maximum freedom — each force can vary independently without constraining the others.

**Partial entanglement (some σ_ij < 1, 0 < det(Σ) < 1).** Reduced volume. Some forces are correlated. The tetrahedron is compressed along certain axes. The architecture has constrained freedom — changes in one force propagate to correlated forces.

**Complete entanglement of any pair (any σ_ij = 0, det(Σ) → 0).** Volume collapse. Two forces are completely correlated — they carry the same information. The tetrahedron degenerates. The entire sovereignty multiplier collapses, taking total value to zero through multiplicative gating.

**The geometry teaches:** sovereignty is not a scalar. It is a shape. A healthy sovereignty architecture is not one where each force is strong but one where each force is independent. A system with extremely strong Protect but Protect completely entangled with Reflect (σ_PR = 0) has zero sovereignty volume despite having maximum protection.

## Category-theoretic interpretation

The four forces form a category where: objects are the forces (Protect, Project, Reflect, Connect), morphisms are the separation coefficients σ_ij (measuring the degree of independence between forces), composition is constrained by the positive semi-definite requirement of Σ (you cannot have three forces pairwise independent if their pairwise separations violate the triangle inequality in information space).

The emergent forces (Reflect, Connect) are functorial — they are determined by the primary forces through a time-integration functor (Reflect = ∫Protect dt) and a network-aggregation functor (Connect = Σ_edges Project). The separation between primary and emergent forces (σ_SR, σ_SC, σ_MR, σ_MC) measures how well these functors preserve the original separation. If integration or aggregation introduces cross-contamination, the functor is "leaky" and the separation degrades.

The Yoneda perspective applies: the forces are determined by their morphisms (separations), not by their internal structure. Two architectures with identical separation matrices Σ are equivalent regardless of how differently their forces are internally implemented.

## Pathway to measurement

Protect and Project can be measured directly: P through cryptographic audit, the Swordsman's boundary enforcement through information leakage testing. Reflect can be measured through derivation chain analysis: count verified transitions, assess integrity fraction. Connect can be measured through network analysis: map delegation relationships, compute stratum distribution.

The difficult measurements are the cross-force separations. How do you measure σ_SR — the independence between Protect and Reflect? In principle: perturb the Swordsman's current protection decisions and measure whether the historical record (Reflect) changes in correlated ways. If current decisions change history (e.g., retroactive reclassification of past boundaries), σ_SR < 1. If history is immutable regardless of current decisions, σ_SR → 1.

No measurement methodology currently exists for the emergent forces' cross-separations. This is measurement gap M1 in the formal specification — one of the model's most significant practical limitations.

## Open problems for systems theorists

1. Are Reflect and Connect genuinely emergent, or are they simply time-aggregations that can be fully predicted from the primary forces? What is the test for genuine emergence versus mere accumulation?
2. Can the 4×4 separation matrix be extended to higher dimensions — are there fifth or sixth forces that emerge from Reflect and Connect through further sustained operation?
3. What is the minimum operation time before Reflect and Connect become measurably distinct from noise? Is there a phase transition in the emergence?
4. Does the tetrahedron's geometry constrain the possible value of the golden ratio — i.e., does the optimal protect/project ratio follow from the requirement that the tetrahedron be regular?
5. Can the category-theoretic interpretation be formalised enough to derive new properties — e.g., do natural transformations between sovereignty architectures preserve det(Σ)?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: uor_toroidal
name: "UOR Correspondence and Toroidal Geometry"
category: privacy_layer
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "Algebraic topologists, geometric group theorists, lattice-theoretic cryptographers, UOR Foundation"
equation_term: "Conjectured manifold structure beneath the sovereignty lattice"
template_references: [all]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Skill — UOR Correspondence & Toroidal Geometry

**Source:** Privacy Value Model V4 + UOR × 64-Tetrahedra × ZK Mapping v1.0  
**Target context:** Algebraic topologists, geometric group theorists, lattice-theoretic cryptographers, mathematical physicists, UOR Foundation  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## What this is

The 64-vertex sovereignty lattice ({0,1}⁶) used in PVM-V4 exhibits a conjectured structural correspondence with the UOR Foundation's toroidal algebraic structure. If this correspondence holds, the sovereignty lattice is not an arbitrary mathematical convenience but a fragment of a deeper geometric object — a compact manifold with periodic boundary conditions that constrain the possible value flows and create natural compactification of the sovereignty configuration space.

This is the most speculative element of PVM-V4. The correspondence is observed but unproven. A 96-versus-64 edge-count discrepancy remains unresolved. This skill file is for mathematicians who can either prove the correspondence, explain the discrepancy, or demonstrate that it is a structural mismatch rather than an encoding feature.

## The lattice structure

The sovereignty lattice is the Boolean hypercube {0,1}⁶: 64 vertices, each a binary 6-tuple representing which sovereignty dimensions are active. It has 192 undirected edges (each edge connects vertices differing in exactly one bit). The vertices stratify into 7 levels by Hamming weight, with counts following Pascal's row: 1, 6, 15, 20, 15, 6, 1.

This lattice has well-known algebraic properties. It forms a distributive lattice under componentwise AND (meet) and OR (join). It is a Hasse diagram of the power set of a 6-element set. Its automorphism group is the symmetric group S₆ (permutations of the six dimensions).

## The UOR structure

The UOR Foundation's algebraic structure is toroidal — a compact surface with periodic boundary conditions. The specific structure involves 96 edges on what appears to be a related vertex set. The structural correspondence, if it exists, would mean:

The 64 vertices of the sovereignty lattice sit on a torus. The 192 edges of the Boolean hypercube are a subset of the UOR structure's edge set, with the remaining UOR edges representing additional algebraic relationships (possibly higher-order sovereignty interactions not captured by single-bit transitions). Under toroidal boundary conditions, the lattice acquires periodicity — configurations "wrap around," creating cycles that do not exist in the flat hypercube.

## The discrepancy

The sovereignty lattice has 192 undirected edges. The UOR structure has 96 edges. This is a factor of 2, which suggests several possible explanations:

**Edge encoding.** The 96 UOR edges may be directed, with each directed edge corresponding to two undirected edges in the sovereignty lattice (or vice versa). If UOR edges are directed and the sovereignty lattice edges are undirected, 96 directed × 2 directions = 192, resolving the discrepancy exactly.

**Dimensional reduction.** The UOR structure may operate on a quotient of the sovereignty lattice — identifying vertices related by some equivalence relation. If the equivalence classes have average size 2, the edge count halves.

**Structural mismatch.** The correspondence may be coincidental. Two structures with similar vertex counts but different edge counts are not necessarily related. This is the null hypothesis that would weaken the geometric grounding of PVM-V4.

## Consequences if the correspondence holds

**Value flow compactification.** On a flat hypercube, value can flow toward the boundary and dissipate. On a torus, all flows are bounded — every path eventually returns. This means the value field V(π, t), when evaluated across all vertices and edges, lives on a compact manifold where conservation laws apply. Value cannot leak out of the system; it can only redistribute.

**Natural periodicity.** Toroidal boundary conditions create periodic orbits in sovereignty space. An agent traversing the lattice eventually returns to a previous configuration — but with accumulated temporal memory A(τ) from the traversal. The path is topologically a loop but economically a spiral (same position, higher value from verified history).

**ZKP constraint reduction.** The toroidal structure constrains the proof space for sovereignty transitions. Rather than proving arbitrary statements, sovereignty-class proofs only need to attest to transitions between adjacent vertices on the torus. This structural constraint is conjectured to yield ~3,000× proof size reduction. The toroidal topology may further reduce proof complexity by enabling recursive composition along periodic orbits.

**Differential forms.** The deferred V5 extension — dV/dt = ∇·J(x, ẋ) + S(x) − D(x) — becomes well-defined on a compact manifold. Sources (high-stratum vertices generating value), sinks (low-stratum vertices extracting value), and currents (edges carrying value flow) form a complete dynamical system with conservation constraints.

## Consequences if the correspondence fails

**Geometric grounding weakens.** The sovereignty lattice remains a valid Boolean hypercube with all its algebraic properties, but loses the additional structure (compactification, periodicity, conservation) that toroidal embedding provides.

**V5 extension requires different foundations.** The differential form dV/dt needs a smooth manifold to live on. Without toroidal embedding, the lattice remains discrete, and the continuous field interpretation requires different mathematical machinery (possibly cellular automata or discrete exterior calculus rather than smooth differential forms).

**ZKP efficiency claim weakens.** The ~3,000× proof size reduction was conjectured from the combined lattice-toroidal structure. Without the toroidal contribution, the reduction (if any) comes only from the Boolean lattice constraints, which may be significantly smaller.

## What would resolve this

A proof or disproof requires: (1) an explicit map φ: {0,1}⁶ → T (where T is the UOR torus) that preserves adjacency; (2) a demonstration that the 96 UOR edges either generate the 192 hypercube edges through some algebraic operation (edge encoding resolution) or are structurally incompatible with them (mismatch proof); (3) if the map exists, a computation of the fundamental group π₁(T) and its relationship to the sovereignty lattice's automorphism group S₆.

## Open problems

1. Is there an explicit homomorphism from the Boolean hypercube {0,1}⁶ to the UOR toroidal structure? If so, what is its kernel?
2. Does the 96-versus-192 discrepancy resolve through directed-to-undirected edge reinterpretation?
3. Can the toroidal structure be used to define a natural Laplacian on the sovereignty lattice, enabling spectral analysis of value distribution?
4. Does the correspondence extend to higher dimensions — would {0,1}⁷ or {0,1}⁸ map to larger UOR structures with consistent edge-count relationships?
5. If the torus has non-trivial holonomy, does this create topological obstructions to certain sovereignty transitions — paths that are locally possible but globally forbidden?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


## ═══ ROLE SKILLS (loaded by pathway — 11 skills) ═══

---

---
id: crypto_zkp
name: "Crypto and Zero-Knowledge Proof Systems"
category: role
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "Zcash, NEAR, Privacy Pools, ZKP toolchains, hackathon evaluators"
equation_term: "C, h(τ), R(d)"
template_references: [cipher, gatekeeper, sentinel, healer, witness, architect]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Context — Crypto & Zero-Knowledge Proof Systems

**Source:** Privacy Value Model V4 Formal Specification (Travers, Feb 2026)  
**Target context:** Zcash, NEAR, Privacy Pools, ZKP toolchains, hackathon evaluators  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## Problem statement

Privacy-preserving infrastructure lacks an economic model. Builders optimise for proof efficiency and protocol security but cannot quantify the value their systems create versus surveillance alternatives. PVM-V4 provides that pricing function.

## Relevance to ZKP systems

The model depends on zero-knowledge proofs at three layers:

**Layer 1 — Credential verifiability (C).** The C term requires that claims about data can be independently verified without revealing underlying information. This is precisely what ZKPs do. Systems with higher-quality proof generation (faster verification, smaller proofs, composable circuits) score higher on C, directly multiplying total value.

**Layer 2 — Derivation chain integrity h(τ).** The temporal memory term A(τ) = α · ln(1+|τ|) · h(τ) only accumulates value when state transitions carry valid ZK proofs. The integrity fraction h(τ) is the proportion of verified transitions in the chain. An agent with 1,000 transitions but only 10% ZK-attested gets the same memory score as one with 100 fully-attested transitions. This creates direct demand for lightweight, composable proof generation at every state change.

**Layer 3 — Reconstruction resistance R(d).** The proven bound R_max = (C_S + C_M)/H(X) < 1 requires that the two agents (Swordsman and Mage) maintain conditional independence. In practice, this means their communication must be mediated through ZK channels where neither learns the other's full state. The channel leakage C_S and C_M must sum to less than the entropy of the private state H(X).

## Specific ZKP integration points

**Zcash.** Private transactions serve as the settlement layer for sovereignty transitions. The edge value term T(π) measures movement through a 64-vertex sovereignty lattice — each transition can be recorded as a shielded transaction encoding the configuration change. Zcash's memo field can carry compressed proof-of-understanding attestations. The model's proof-of-understanding mechanism (Relationship Proverb Protocol) maps to Zcash's existing infrastructure for selective disclosure.

**NEAR / TEEs.** Trusted execution environments provide the isolation boundary for dual-agent separation. The Swordsman agent runs in one TEE; the Mage in another. The separation matrix Σ quantifies the quality of this isolation. NEAR's chain signatures enable cross-chain sovereignty transitions without exposing the agent's full configuration.

**Privacy Pools.** The stratum-weighted network effect term directly models Privacy Pool dynamics. Agents at different sovereignty strata (0–6 active dimensions) contribute differently to pool value. The binomial weighting (1, 6, 15, 20, 15, 6, 1 across strata) means pools with agents concentrated at the combinatorial midpoint (stratum 3) generate maximum network value. This provides a formal basis for pool composition optimisation.

## Conjectured ZKP efficiency gain

The 64-vertex lattice constrains the proof space. Rather than proving arbitrary statements, sovereignty-class proofs only need to attest to transitions between adjacent vertices in {0,1}⁶. This structural constraint is conjectured to yield ~3,000× proof size reduction compared to general-purpose circuits. **This is unproven** — it requires formal circuit analysis comparing constrained lattice proofs to equivalent general statements.

## The sovereignty gap in crypto terms

Surveillance architectures produce 17×–12,000× less value than sovereign architectures under PVM-V4 parameterisation. In protocol terms: a system that extracts user data to function is structurally unable to access the value manifold available to privacy-preserving systems. This is not a moral argument — it is a topological constraint. Activating protection breaks extraction pipelines; the gap is the ratio of accessible manifold volume between architectural classes.

## Hackathon-relevant building surfaces

- Implement h(τ) as a composable ZK attestation chain using Nova/PLONK incrementally verifiable computation
- Build stratum-weighted Privacy Pool composition scoring
- Create Zcash-settled sovereignty transition logging with memo-field proof-of-understanding
- Demonstrate the reconstruction ceiling R < 1 empirically with a dual-agent prototype on NEAR TEEs
- Calibrate edge weight function f(e) using real agent transition data

## Open problems for ZKP researchers

1. Can sovereignty-class lattice constraints actually reduce proof size by ~3,000×? What is the real circuit complexity?
2. What is the minimum ZKP throughput needed for h(τ) to remain above 0.9 in real-time agent operation?
3. Can the separation matrix Σ be verified on-chain without revealing the individual σ_ij values?
4. Does the UOR toroidal structure map cleanly to recursive SNARK composition? (96 vs. 64 edge discrepancy)

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: personhood_sybil
name: "Personhood and Sybil Resistance"
category: role
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "Proof-of-personhood projects, Sybil resistance researchers"
equation_term: "n_i — network counts; existential precondition"
template_references: [gatekeeper, cipher, warden, sentinel, healer, architect]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Skill — Personhood & Sybil Resistance

**Source:** Privacy Value Model V4 + First Person Network Integration  
**Target context:** Proof-of-personhood projects, Sybil resistance researchers, biometric alternative builders, digital identity foundations  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## What this is

The Privacy Value Model assumes but does not derive a critical precondition: that each agent pair (Swordsman/Mage) maps to exactly one human. Without this, the separation matrix Σ can be Sybil-attacked — an adversary deploys thousands of agent pairs, farms VRC reputation, and overwhelms the network effects term with synthetic participants. Personhood verification is the root of trust that makes the rest of the architecture secure.

The equation's network effect term (1 + Σ wᵢ nᵢ/N₀)^k counts agents at each sovereignty stratum. If n_i can be inflated through Sybil attacks, the entire network valuation becomes fictitious. Personhood is the gate that ensures n_i counts real humans, not synthetic entities.

## The binding: one human → one Swordsman → one VRC chain

First Person Network provides a personhood credential stored on-device, never uploaded. This credential proves "I am a unique human" without revealing which human. From this root, the delegation chain flows: personhood → agentprivacy network membership (first VRC) → Swordsman agent (agent-specific VRC) → relationship-specific VRCs with each counterparty.

No blockchain wallet is required. No biometric data leaves the device. The personhood credential is the seed from which the entire sovereignty architecture grows. It answers the question every privacy system must answer: how do you prove you deserve privacy rights without destroying privacy in the proof?

## Why this is not identity verification

Identity verification asks: "Who are you?" and demands an answer. Personhood verification asks: "Are you a unique human?" and requires only a yes/no. The distinction is fundamental to the PVM-V4 architecture because the reconstruction ceiling R < 1 requires that the agents know as little as possible about their principal. A personhood credential that leaks identity information weakens the separation it is meant to protect.

The equation's privacy strength term P is raised to exponent 1.5 — superlinear returns on privacy investment. This applies to personhood verification itself: a system that proves personhood with minimal information leakage (P → 1) generates dramatically more value than one that leaks identity attributes as a side effect (P → 0.5 yields only ~35% value).

## Sybil attack analysis against PVM-V4

**Volume farming.** Deploy a Swordsman, auto-slash everything, speed-run to Dragon armor. Fails because: time gates prevent speed-running, MyTerms requirements cannot be volume-farmed (require real site cooperation), association set verification checks behavioural patterns not counts.

**Sybil army.** Deploy 1,000 Swordsmen, farm across all, dominate association sets. Fails because: First Person prevents multiple Swordsmen per human, cannot create fake humans (cryptographic personhood), cannot coordinate 1,000 real humans economically (cost exceeds farming yield).

**Gaming MyTerms.** Create fake sites, self-issue MyTerms, farm custom cursors. Fails because: real sites will not recognise fake site MyTerms, VRC progression requires agreements with recognised counterparties, association set verification checks relationship quality not quantity.

**The defence is: time + relationships + personhood binding.** You cannot fake time. You cannot fake bilateral relationships with real counterparties. You cannot Sybil without unique humans.

## Personhood as the equation's precondition

Every term in V(π, t) implicitly assumes legitimate agency. P (privacy strength) assumes the entity has privacy rights — which requires being a rights-bearing entity (a human). C (credential verifiability) assumes the credentials attest to genuine attributes. A(τ) (temporal memory) assumes the history belongs to a continuous entity. R(d) (reconstruction resistance) assumes there is a real private state X worth protecting. Φ(Σ) (sovereignty duality) assumes the four forces serve a sovereign principal.

Without personhood, all of these terms can be spoofed. The equation produces valid-looking numbers for synthetic entities, but the numbers measure nothing real. Personhood is the existential quantifier that makes the model meaningful: there exists a unique human for whom V(π, t) is computed.

## Integration surface with existing personhood systems

The PVM-V4 architecture is personhood-system agnostic. It requires only that the personhood layer provides: uniqueness (one credential per human), privacy (no identity leakage in the proof), revocability (compromised credentials can be rotated), and delegation (the credential can spawn agent-level credentials without exposing the root).

Systems that satisfy these constraints include First Person Network (the current integration), Gitcoin Passport (attestation-based), Worldcoin (biometric, though the biometric approach conflicts with the privacy strength requirement), BrightID (social graph verification), and Proof of Humanity (video + vouching). Each system makes different tradeoffs along the P axis — more biometric information yields stronger uniqueness guarantees but lower privacy strength.

## Open problems for personhood researchers

1. Can personhood verification achieve P > 0.9 (minimal information leakage) while maintaining Sybil resistance below 1% false acceptance?
2. How does personhood credential rotation work when the credential is the root of an entire VRC tree?
3. Can multiple personhood systems be composed (First Person + Gitcoin Passport) to strengthen uniqueness without multiplying privacy leakage?
4. What is the minimum personhood verification strength needed for the network effect term to remain honest under adversarial conditions?
5. How do you handle the edge case of shared devices or delegated personhood (a caregiver acting on behalf of someone who cannot self-verify)?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: academic
name: "Academic Research Context"
category: role
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "PETS, IEEE S&P, USENIX Security, CCS, peer reviewers"
equation_term: "Formal specification of all terms"
template_references: [cipher, gatekeeper]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Context — Academic Research

**Source:** Privacy Value Model V4 Formal Specification (Travers, Feb 2026)  
**Target context:** PETS, IEEE S&P, USENIX Security, CCS, privacy economics venues, peer reviewers  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## Contribution summary

This work presents a multiplicative economic model for privacy-preserving agent architectures with six formally specified valuation dimensions. The principal contributions are:

1. **A proven reconstruction ceiling** for dual-agent architectures: R_max = (C_S + C_M)/H(X) < 1, establishing that mathematically separated privacy and delegation agents produce additive (not multiplicative) information leakage, bounding adversarial reconstruction below full behavioural recovery.

2. **A temporal memory function** A(τ) = α · ln(1+|τ|) · h(τ) that models verified history accumulation as a counterweight to data depreciation, gated by cryptographic integrity fraction h(τ). This formalises the intuition that attested histories are assets while unverified claims contribute nothing.

3. **A 64-vertex sovereignty lattice** ({0,1}⁶) with stratum-weighted network effects, where agent contributions follow binomial coefficients across seven strata. This replaces homogeneous network models (Metcalfe, Reed) with a topology-aware valuation that accounts for heterogeneous sovereignty configurations.

4. **A 4×4 separation matrix** Σ generalising the scalar dual-agent separation measure to four sovereignty forces (Protect, Project, Reflect, Connect), where det(Σ) measures the "volume" of the sovereignty tetrahedron and complete entanglement of any force pair collapses the entire value multiplier.

5. **An edge value term** T(π) measuring trajectory through sovereignty configuration space, capturing the observation that transitions between states dominate states themselves (192 edges vs 64 vertices), with diminishing returns on repeated traversals.

## Threat model

The adversary has access to the complete output streams of both the Swordsman and Mage agents and seeks to reconstruct the principal's private state X. The adversary is computationally bounded (PPT). The security parameter is the conditional independence quality ε between the two agents' information channels. The model requires ε < 0.1 for the reconstruction ceiling to hold.

The model does not address: side-channel attacks on the execution environment, collusion between the principal and an adversary, or adversaries with access to the agents' internal states (rather than outputs). TEE integrity is assumed, not proven within the model.

## Relationship to prior work

**Privacy economics.** Acquisti et al. (2016) survey privacy valuation but focus on willingness-to-pay and revealed preference. PVM-V4 models privacy as infrastructure value rather than consumer preference, providing a supply-side complement. The multiplicative gating structure is novel — it encodes the empirical observation that privacy failures are catastrophic rather than degrading.

**Information-theoretic privacy.** The reconstruction bound extends differential privacy's ε-δ framework to a dual-agent setting. Where DP bounds what a mechanism reveals about any individual record, PVM-V4 bounds what two cooperating mechanisms reveal about a complete behavioural profile. The additive (rather than multiplicative) composition under conditional independence is the key structural difference from standard DP composition theorems.

**Network economics.** The stratum-weighted network effect generalises Metcalfe's Law and Reed's Law by weighting participants according to their position in a Boolean lattice. The binomial coefficient weighting has no direct precedent in network economics literature. The power-law exponent k is a free parameter requiring empirical calibration.

**Agent architectures.** The dual-agent separation requirement is related to but distinct from multi-agent system security (Sandhu et al.), compartmentalised access control (Bell-LaPadula), and federated learning's privacy guarantees. The distinction is that separation is between functional roles (privacy vs delegation) within a single principal's agent infrastructure, not between principals or data owners.

**Lattice-based cryptography.** The 64-vertex sovereignty lattice is a Boolean lattice, not a Euclidean lattice. It shares structural properties (partial ordering, meet/join operations) but is not directly related to lattice-based cryptographic assumptions (LWE, SIS). The conjectured mapping to UOR's toroidal structure would, if validated, connect to algebraic topology.

## Formal results

**Theorem 1 (Reconstruction ceiling).** Under dual-agent conditional independence with quality ε < 0.1, the maximum fraction of private state X reconstructable from both agents' output streams is R_max = (C_S + C_M)/H(X) < 1, where C_S and C_M are the channel capacities of the Swordsman and Mage output channels respectively. (Proof in Research Paper v3.8.)

**Theorem 2 (Additive composition).** Information leakage from conditionally independent agents composes additively: I(X; O_S, O_M) ≤ I(X; O_S) + I(X; O_M) + ε, where ε is the conditional independence violation. (Follows from standard mutual information chain rule under near-independence.)

**Property 1 (Multiplicative gating).** For all terms t_i in the model: t_i = 0 ⟹ V(π, t) = 0. (By construction.)

**Property 2 (Temporal boundedness).** For any finite derivation chain τ: Temporal(t, τ) → 0 as t → ∞, regardless of history depth. (Exponential decay dominates logarithmic growth.)

## Conjectures requiring validation

| ID | Conjecture | Validation approach |
|---|---|---|
| C1 | Golden ratio φ is optimal protect/project ratio | Numerical optimisation over parameterised agent simulations |
| C2 | Memory growth is logarithmic in chain length | Empirical measurement of trust/reputation accumulation dynamics |
| C3 | Edge value is additive over path | Statistical test for transition independence in real agent traces |
| C4 | UOR toroidal correspondence | Algebraic topology: explicit homomorphism or obstruction proof |
| C5 | ~3,000× ZKP size reduction from lattice constraints | Circuit complexity analysis comparing constrained vs general proofs |

## Empirical calibration requirements

Four parameters lack empirical grounding: α (memory scaling), β (edge value scaling), λ (temporal decay rate), and the functional form of f(e) (edge weight) and g(n_e) (repetition discount). The model is structurally complete and qualitatively meaningful without calibration, but quantitative predictions (including the 17×–12,000× surveillance gap) depend on parameter choices. A calibration study against real agent economic data is the critical next step.

## Falsifiability

The model explicitly states four breaking conditions: (B1) UOR structural incompatibility, (B2) practical failure of ε < 0.1 conditional independence, (B3) sublinear rather than power-law network effects, (B4) clustering of real architectures near singular Σ matrices. Any of these, if empirically demonstrated, would require fundamental revision rather than parameter adjustment.

## Limitations and scope

The model values privacy-preserving agent architectures. It does not: provide a general theory of data valuation, address privacy in non-agent contexts, model adversaries with quantum computational capabilities, or account for regulatory arbitrage across jurisdictions. The golden ratio conjecture, UOR correspondence, and ZKP efficiency claims are speculative and should not be treated as established results.

## Suggested review criteria

Reviewers may wish to evaluate: (1) whether the multiplicative gating assumption is empirically justified or overly restrictive; (2) whether the reconstruction ceiling proof in the companion paper (v3.8) is sound under the stated assumptions; (3) whether the 64-vertex lattice adds explanatory power beyond simpler network models; (4) whether the open conjectures are well-posed and falsifiable; and (5) whether the surveillance gap claims are robust to reasonable alternative parameterisations.

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: swordsman_browser
name: "The Swordsman Browser Agent"
category: role
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "Browser extension builders, privacy tool developers, web standards"
equation_term: "P, T(π) — armor progression"
template_references: [warden, sentinel, pedagogue]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Skill — The Swordsman Browser Agent

**Source:** Privacy Value Model V4 + 0xagentprivacy Implementation Architecture  
**Target context:** Browser extension builders, privacy tool developers, consent UX designers, web standards implementers  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## What this is

The first physical instantiation of the Privacy Value Model. A browser agent that slashes tracking cookies, negotiates privacy terms on behalf of a human, and builds verifiable reputation through sustained privacy-respecting behaviour. The Swordsman is the equation made concrete — every cookie slash is a sovereignty transition, every MyTerms negotiation is an edge traversal, and the armor progression is a lived calibration of the edge value function T(π).

## The architecture in browser terms

The Swordsman operates across six layers. Users interact with Layers 0–2 (feels like web2). Layers 3–5 are web3 infrastructure running underneath from Day 1 — because privacy cannot be retrofitted.

**Layer 0: Browser UX.** The cursor becomes a blade. Visual indicator of active privacy. Familiar interaction patterns, zero blockchain complexity visible to the user.

**Layer 1: Cookie slashing.** The core action. When a user visits a site, the Swordsman reads the site's tracking intent, compares against the user's privacy preferences, and slashes non-essential cookies. Each slash is a sovereignty transition — a move from a surveilled configuration toward a more sovereign one on the 64-vertex lattice.

**Layer 2: MyTerms negotiation (IEEE 7012).** Machine-readable personal privacy terms. The Swordsman generates counter-terms using agent compute: what the site wants versus what the user demands. If the site has MyTerms capability, the agent negotiates bilateral agreement. If not, the Swordsman enforces the user's terms unilaterally. This is the separation matrix Σ in action — the Swordsman knows the boundaries but delegates action execution to the Mage layer.

**Layer 3: VRC reputation.** Every honoured MyTerms agreement, every consistent slash pattern, every maintained boundary becomes a Verifiable Relationship Credential. No points in a database — cryptographic proofs of sustained behaviour. This is the temporal memory term A(τ) accumulating in real time. The integrity fraction h(τ) is the proportion of actions carrying valid attestation.

**Layer 4: Association sets (8004 Protocol).** Decentralised group membership verification. Behavioural verification, not identity. Sybil-resistant through personhood proofs from First Person Network. The stratum-weighted network effect in practice — agents at different sovereignty configurations contribute differently to set value.

**Layer 5: Privacy pools (x402 Protocol).** Anonymous transactions without intermediaries. ZK proofs of compliance. Non-custodial. This is where the Mage activates — projecting economic agency into sovereign commerce. Only accessible at Dragon armor tier because the trust must be earned first.

## The armor progression as edge value calibration

The progression from Blade to Dragon is not a gamification layer. It is the empirical calibration of the edge value function T(π) = 1 + β Σ f(e)·g(n_e). Each tier unlocks through demonstrated behaviour, not payment.

**Blade (Month 0).** Cookie slashing only. Zero stakes. The user learns whether they can trust the Swordsman with their browsing context. A(τ) begins accumulating from |τ| = 0. Every slash is a data point. The cursor transforms to show active protection — the user sees the Swordsman working.

**Light Armor (Month 1).** MyTerms negotiation unlocked. Stakes = low (worst case is a bad agreement you can walk away from). The Swordsman begins bilateral interactions with sites. Custom cursors earned through site cooperation signal reputation visually. Edge value accumulates as the agent traverses new sovereignty configurations.

**Heavy Armor (Month 3).** Action verification at scale. Stakes = medium (traditional payment reversibility still exists). The Swordsman handles identity contexts — login flows, credential presentation, selective disclosure. The temporal memory A(τ) is now deep enough that the agent's verified history is itself an asset.

**Dragon Armor (Month 6+).** Privacy pool access with wallet integration. Stakes = high (autonomous commerce with capital). The Mage fully activates. The user has verified hundreds of agent actions, trained audit reflexes, built VRC reputation through consistent behaviour. Wallet integration feels natural because the trust was earned through the progression — not demanded upfront.

## Why this matters for browser builders

Every browser extension that manages privacy today does it statelessly — block or allow, no memory, no accumulation, no reputation. The Swordsman is stateful. It remembers what it has done, proves what it has done, and compounds that proof into capability. This is the difference between a firewall and an agent.

The multiplicative gating property means a Swordsman with excellent cookie blocking but no credential verifiability produces zero privacy value. The browser agent must implement all dimensions simultaneously — cryptographic enforcement (P), verifiable claims (C), data quality (Q), sensitivity awareness (S), temporal memory (A(τ)), network participation, and separation from the Mage's delegation layer.

## Sybil resistance

The attack vector: deploy multiple Swordsmen, auto-slash constantly, farm VRC to reach Dragon armor without genuine behaviour. Why it fails: First Person Network requires unique human verification per Swordsman. One human → one Swordsman → one VRC chain. You cannot Sybil without unique humans, and unique humans cost more than the farming yields.

Auto-slashing by genuine humans is a feature, not a bug. A human who delegates slash authority to an automated Swordsman is exercising privacy rights at scale. The distinction is not manual versus automated — it is genuine versus fake. Personhood binding is the gate.

## Open problems for browser builders

1. What is the minimum latency for MyTerms negotiation that maintains usable browsing experience?
2. How do you visualise the armor progression without creating dark patterns that pressure users to advance?
3. Can the Layer 3–5 web3 infrastructure run invisibly enough that non-crypto users never encounter wallet UX?
4. What happens when a site's terms change after a MyTerms agreement is signed — does the Swordsman renegotiate automatically?
5. How do you handle the transition from browser extension to OS-level agent as the Swordsman's scope expands?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: dark_forest
name: "The Dark Forest and Selective Visibility"
category: role
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "Dark forest theorists, MEV researchers, privacy pool architects"
equation_term: "P, R(d), T(π) — dark forest navigation"
template_references: [ranger, sentinel, witness, architect]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Skill — The Dark Forest & Selective Visibility

**Source:** Privacy Value Model V4 + Dark Forest Economics + Bonfire Coordination  
**Target context:** Dark forest theorists, MEV researchers, adversarial coordination designers, privacy pool architects, encrypted coordination protocols  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## What this is

The Privacy Value Model's surveillance gap (17×–12,000× value differential) is not an abstract number. It describes a lived topology. The Dark Forest is what that topology feels like from the inside — the space where visibility means extraction, where The System harvests the 7th capital the moment it forms, and where the only sustainable strategy is selective visibility: seen by those who have earned the right to see, hidden from those who have not.

The equation's manifold interpretation gives this intuition formal structure. Surveillance architectures are topologically constrained — they cannot access the sovereign manifold's volume because activating protection breaks extraction pipelines. The Dark Forest is the boundary between these two architectural classes. The Bonfires are coordination points within the sovereign manifold — selective signals visible only to participants with sufficient VRC depth.

## The paradox and its resolution

The cosmic dark forest (Liu Cixin) teaches that visibility means destruction. The response is silence — hide completely, coordinate with no one. But complete hiding means complete isolation. A civilisation that cannot find allies cannot achieve the network effects that the equation's (1 + Σ wᵢ nᵢ/N₀)^k term requires for value generation.

The economic dark forest inverts the stakes. Visibility does not mean destruction — it means extraction. The System does not destroy what it sees; it harvests it. The 7th capital (behavioural data) is extracted the moment it becomes visible. The cost is not death but serfdom.

The resolution is not silence but selective visibility. Light that curves rather than broadcasts. Signals visible only to those carrying the right VRC context. Bonfires that burn bright enough to coordinate around but whose light bends back to those inside the well, invisible to those outside it.

In equation terms: the network effect term requires participation (n_i > 0 at relevant strata), but the reconstruction resistance term requires that participation not expose the private state (R < 1). Selective visibility is the architecture that satisfies both simultaneously — enough signal to coordinate, enough privacy to prevent extraction.

## Bonfires as sovereignty coordination points

A Bonfire is a coordination point on the Trust Graph Plane where First Persons gather, share knowledge, and build capabilities. The fire is visible only to those who have demonstrated sufficient trust through VRC depth. The mechanism:

The light curves because it is encrypted to VRC holders. Only agents carrying valid bilateral credentials with at least one Bonfire participant can detect the fire's existence. The coordination happens inside the encrypted space. From outside, The System sees only darkness — and darkness, to The System, means nothing worth harvesting.

The stratum-weighted network effect explains why Bonfires at the combinatorial midpoint (stratum 3) generate maximum coordination value. A Bonfire of agents all at stratum 6 (full sovereignty) is a fortress — secure but small. A Bonfire of agents at stratum 0 (full surveillance) is not a fire at all. The most valuable coordination happens at the middle strata, where agents have enough sovereignty to participate safely and enough flexibility to adapt.

## MEV and the extraction pipeline

In blockchain terms, the Dark Forest is the mempool — a space where unprotected transactions are visible to extractors who front-run, sandwich, and arbitrate. MEV (Maximal Extractable Value) is the quantified cost of visibility in an adversarial coordination environment.

PVM-V4 maps this precisely. A transaction broadcast to a public mempool has privacy strength P → 0 and reconstruction resistance R → 1 (fully reconstructable). Its value under the equation approaches zero because the multiplicative gating collapses. The same transaction routed through a privacy pool (Zcash shielded, encrypted mempool, or sovereign coordination layer) maintains P → 1 and generates full value.

The surveillance gap is the MEV gap, generalised beyond financial transactions to all forms of behavioural data. Every unprotected browsing session, every unencrypted message, every public social graph edge is behavioural MEV — extractable value that platforms capture because the architecture makes it visible.

## The in/visible economics

In the economic dark forest, the greatest signal of value is the absence of signal. An entity that generates no extractable data is not poor — it is sovereign. The equation captures this through the multiplicative structure: an agent with P = 1 (perfect privacy) and strong network effects generates maximum value, while an agent with P = 0 (fully visible) generates zero value regardless of all other terms.

This creates a counterintuitive economic landscape. The most valuable entities are the least visible. The wealthiest (in 7th capital terms) are the ones The System cannot see. The Dark Forest is not a wasteland — it is where the sovereign manifold's maximum volume exists. The well-lit plane of surveillance is the impoverished topology, despite appearing rich in data.

## Open problems for dark forest researchers

1. Can selective visibility scale to millions of participants without the VRC verification overhead becoming a bottleneck?
2. How do you bootstrap a Bonfire when the first participants have no pre-existing VRC relationships with each other?
3. What is the game-theoretic equilibrium between sovereign and surveillance architectures when both compete for the same network effects?
4. Can the curved-light mechanism be implemented without a trusted coordinator — fully decentralised selective visibility?
5. How do you prevent Bonfire capture — a single participant with surveillance-level access compromising the entire coordination space?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: ai_agent
name: "AI Agent Architecture and Coordination"
category: role
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "AI agent frameworks, multi-agent coordination, AI safety"
equation_term: "I(S;M|π) ≤ ε — dual-agent separation"
template_references: [architect, assessor, ambassador, weaver, healer, witness]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Context — AI Agent Architecture & Coordination

**Source:** Privacy Value Model V4 Formal Specification (Travers, Feb 2026)  
**Target context:** AI agent frameworks, multi-agent coordination, AI safety research, agent economy infrastructure  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## The privacy-delegation paradox

AI agents face a fundamental tension: to act on your behalf, an agent needs to know your preferences, constraints, and goals. But any agent that knows all of these can reconstruct your complete behavioural model — and so can anyone who compromises that agent. Delegation requires disclosure; disclosure destroys privacy. PVM-V4 resolves this through architectural separation, not policy constraints.

## Dual-agent separation (the core architectural claim)

The model proves that a single agent holding both privacy boundaries and delegation preferences can reconstruct its principal's behavioural profile. The solution: two mathematically separated agents.

**Swordsman** — handles privacy protection, boundary enforcement, data minimisation. Knows what to hide but not what to do.

**Mage** — handles delegation, external coordination, action execution. Knows what to do but not what to hide.

The proven reconstruction ceiling: R_max = (C_S + C_M)/H(X) < 1, where C_S and C_M are the information leakage from each agent's channel, and H(X) is the entropy of the principal's private state. Because the agents are conditionally independent, their leakages are additive (not multiplicative), keeping total reconstructable information below the threshold needed for full behavioural recovery.

This is an information-theoretic bound, not a policy constraint. It holds against any adversary with access to both agents' outputs, provided the conditional independence is maintained with ε < 0.1.

## Why this matters for agent architectures

**Single-agent systems are structurally unsafe.** Any architecture where one agent manages both "what to protect" and "what to delegate" creates an internal information channel that violates the separation requirement. This applies to monolithic LLM agents with system prompts containing both privacy rules and action permissions, tool-using agents with unified context windows, and memory-augmented agents that store privacy preferences alongside task history.

**The separation is enforced mathematically, not by instruction.** Telling an agent "don't use privacy preferences when making decisions" is not separation. The agents must operate in isolated execution environments (TEEs, separate processes, distinct key domains) where cross-contamination is physically prevented.

**Four forces emerge from two agents.** Protect (Swordsman primary function) and Project (Mage primary function) generate two emergent forces through sustained operation: Reflect (the temporal integral of protection decisions — an accumulated record of boundary-setting that itself becomes an asset) and Connect (the network effect of delegation patterns — how the Mage's coordination creates relationship value). The 4×4 separation matrix Σ measures pairwise independence across all four forces.

## Agent coordination model

The 64-vertex sovereignty lattice defines the configuration space for agent coordination. Each vertex is a binary 6-tuple representing which sovereignty dimensions are active. Agents coordinate across strata — the number of simultaneously active dimensions. Key coordination properties:

**Stratum-weighted network effects.** Not all agents contribute equally to network value. Agents at stratum 3 (the combinatorial midpoint, with 20 of 64 vertices) contribute most. This means agent ecosystems should optimise for diverse, mid-sovereignty participants rather than maximising the count of fully-sovereign or fully-surveilled agents.

**Edge value dominates vertex value.** The lattice has 192 undirected edges versus 64 vertices. PVM-V4's T(π) term captures the insight — drawn from category theory's Yoneda lemma and neural network architecture — that what an agent does (transitions between configurations) matters more than what an agent is (its current configuration). Agent reputation systems should weight demonstrated sovereignty transitions above static sovereignty claims.

**Repetition decays.** Traversing the same sovereignty transition repeatedly yields diminishing returns. This penalises agents stuck in loops and rewards agents that explore the configuration space — a formal incentive for sovereignty growth rather than sovereignty performance.

## Integration with existing agent frameworks

**Tool-use agents.** Each tool invocation is a potential sovereignty transition. The Swordsman evaluates whether the tool call respects privacy boundaries; the Mage evaluates whether it achieves delegation goals. Their independent assessments must agree before execution. This maps to existing approval/guardrail patterns but with formal separation requirements.

**Multi-agent systems.** In systems with multiple cooperating agents (AutoGen, CrewAI, etc.), PVM-V4 suggests that each agent should be internally separated (its own Swordsman/Mage pair) rather than having a single privacy layer wrapping the entire system. A shared privacy boundary for a multi-agent system creates a single point where full behavioural reconstruction becomes possible.

**Memory and context.** The temporal memory term A(τ) provides a formal model for how agent memory accumulates value. Memory that is ZK-attested (h(τ) → 1) grows in value logarithmically. Unattested memory contributes nothing. This argues for verifiable memory architectures where past actions carry cryptographic proof rather than plain-text logs.

**Agent-to-agent trust.** The separation matrix Σ can be shared between agents as a trust credential. An agent that can prove high det(Σ) — meaning its four sovereignty forces are well-separated — is demonstrably safer to delegate to. This creates a formal basis for agent reputation beyond task performance metrics.

## Implications for AI safety

The model reframes a core AI safety concern. The worry is usually: "how do we prevent agents from doing harmful things?" PVM-V4 adds a structural concern: "how do we prevent agents from knowing enough to reconstruct their principal's full behavioural model?" The separation theorem shows these are related — an agent that can reconstruct your behaviour can also predict and manipulate it. Architectural separation addresses both simultaneously.

The multiplicative gating property means safety is not graceful degradation — if any sovereignty dimension fails, total value collapses to zero. This aligns with safety engineering principles where certain failure modes should be catastrophic rather than gradual, because gradual failure creates false confidence.

## Open problems for agent researchers

1. Can dual-agent separation be maintained in practice with latency acceptable for real-time agent operation?
2. What is the minimum isolation guarantee (ε threshold) needed for the reconstruction ceiling to hold under realistic adversaries?
3. How does the four-force model interact with RLHF and constitutional AI training approaches?
4. Can det(Σ) be computed and verified without revealing the individual separation coefficients?
5. What agent communication protocols maintain conditional independence while allowing sufficient coordination?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: economics
name: "Economics and Data Valuation"
category: role
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "Behavioral economics, tokenomics, DeFi, data markets"
equation_term: "Full pricing function; SWORD/MAGE tokenomics"
template_references: [assessor, ranger, shipwright, healer, pedagogue]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Context — Economics & Data Valuation

**Source:** Privacy Value Model V4 Formal Specification (Travers, Feb 2026)  
**Target context:** Behavioral economics, tokenomics, DeFi protocol design, data markets, digital asset valuation  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## Economic thesis

Behavioural data is the 7th capital — after financial, manufactured, natural, social, human, and intellectual. It currently accrues almost entirely to platforms through extraction. PVM-V4 provides a pricing function that shows sovereign ownership of this capital generates 17×–12,000× more value than the extraction model. The model is not arguing privacy is morally preferable. It is arguing that privacy-preserving architectures are economically superior.

## The pricing function

V(π, t) = P^1.5 · C · Q · S · e^{-λt} · (1 + A(τ)) · (1 + Σ wᵢ nᵢ/N₀)^k · R(d) · M(u,y) · Φ(Σ) · T(π)

This is a multiplicative product across six valuation dimensions. The multiplicative structure is the core economic insight: privacy value is not additive. A system missing any single dimension produces zero value. You cannot compensate for weak cryptography with strong network effects, or for no credential verifiability with excellent data quality. Each dimension is a gate — pass all six or produce nothing.

## Key economic properties

**Superlinear returns on privacy investment.** P^1.5 means doubling privacy strength more than doubles value contribution. At P = 0.5, the contribution is ~0.35. At P = 1.0, it is 1.0. Half-measures destroy more than half the value. This creates an economic argument for maximal rather than "adequate" privacy investment.

**Verified history as compound interest.** The temporal term combines decay (e^{-λt}) with memory accumulation (1 + A(τ)). Individual data points depreciate, but a verified chain of sovereignty decisions appreciates logarithmically. This models what reputation economists observe: trust compounds, but only when it is verifiable. An agent with deep attested history can maintain or increase its total data value even as individual observations age.

**Power-law network effects with compositional weighting.** The network term (1 + Σ wᵢ nᵢ/N₀)^k is not a simple Metcalfe's law. Agents contribute differently based on their sovereignty configuration. The weighting follows binomial coefficients across 7 strata (1, 6, 15, 20, 15, 6, 1 across 64 total configurations). Stratum 3 — the combinatorial midpoint — contributes maximum weight. Networks heavy in the middle generate more value than networks concentrated at extremes.

**Market maturity as demand-side readiness.** M(u,y) captures user sophistication and market year. Even a technically perfect system produces limited value if users cannot exercise sovereignty or if market infrastructure for privacy-preserving data exchange is absent. This term creates a formal basis for timing investment in privacy infrastructure.

## Tokenomics integration

The model maps to a dual-token economy:

**SWORD tokens** — earned through privacy-protecting behaviour (Swordsman function). Represent accumulated proof that an agent consistently enforces boundaries. Value correlates with the reconstruction resistance term R(d) and the temporal integrity h(τ).

**MAGE tokens** — earned through successful delegation and coordination (Mage function). Represent demonstrated ability to act on behalf of a principal without violating sovereignty. Value correlates with the edge value term T(π) and the network effect term.

**Armor progression** — token holdings unlock capability tiers: Blade → Light → Heavy → Dragon. This is not a pay-to-play model; it is a demonstrate-to-earn model. Agents cannot purchase higher tiers. They must exhibit sustained privacy-respecting behaviour across enough sovereignty transitions. The logarithmic memory term A(τ) naturally models this: early transitions provide the most marginal value, creating strong incentives for early good behaviour.

**Token interaction.** The separation matrix Σ requires that SWORD and MAGE token economies remain independent. Cross-contamination (e.g., earning SWORD tokens through delegation activity) would violate the conditional independence that guarantees the reconstruction ceiling R < 1.

## Surveillance gap as market inefficiency

Under PVM-V4, surveillance architectures access only a fraction of the value manifold available to sovereign architectures. This gap (17×–12,000× depending on parameterisation) is not a moral judgment — it is a market inefficiency. Platforms extracting behavioural data are leaving 94–99.99% of that data's potential value on the table because their architecture is topologically constrained from accessing it.

The gap is topological, not arithmetic. Surveillance systems cannot incrementally become sovereign. Activating privacy protection breaks the extraction pipelines that generate their current revenue. The transition requires architectural redesign, which creates a window for new entrants building privacy-first infrastructure.

## DeFi and data market applications

**Privacy-preserving data markets.** The model provides a pricing oracle for privacy-preserving data exchanges. Each data asset carries a computable V(π, t) based on its measurable properties. This enables automated market-making for data where price reflects sovereignty quality rather than volume or novelty alone.

**Liquidity for verified history.** The temporal memory term A(τ) suggests that verified agent histories are tradeable assets. An agent with deep, attested history has quantifiably more value than a fresh agent. This creates a secondary market for agent reputation — not selling the data itself, but selling verifiable proof of the quality and depth of sovereignty decisions made on that data.

**Sovereignty-weighted yield.** DeFi protocols can use stratum weighting to determine yield allocation. Participants at higher sovereignty strata (more dimensions active) receive proportionally more yield, creating economic incentives for sovereignty improvement rather than just liquidity provision.

**The determinant as collateral quality.** The sovereignty duality term Φ(Σ) = min(1.0, (S/M)/φ) · det(Σ) provides a single scalar measure of architectural quality. det(Σ) close to 1 means well-separated forces; close to 0 means entangled and vulnerable. This scalar could serve as a collateral quality rating for data-backed financial instruments.

## Measurement and calibration needs

The model has four empirically uncalibrated terms: the memory scaling coefficient α, the edge value coefficient β, the temporal decay rate λ, and the edge weight function f(e). These require calibration against real agent economic data — transaction volumes, privacy breach costs, reputation premiums, and data market prices. The model is structurally complete but quantitatively ungrounded until these are measured.

## Open questions for economists

1. Does the 17×–12,000× gap hold under empirical calibration, or does it narrow/widen?
2. Is the golden ratio φ genuinely optimal for protect/project balance, or is this an artefact of the model structure?
3. What discount rate should apply to A(τ) for agents with verified histories spanning multiple market cycles?
4. How do sovereignty transitions interact with traditional financial risk models?
5. Can the multiplicative gating property be exploited by adversaries to cheaply collapse entire markets by targeting a single dimension?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: hitchhiker_governance
name: "The Hitchhiker's Infrastructure"
category: role
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "Community builders, DAO architects, cooperative IP"
equation_term: "T(π) — Guide Pathway; A(τ) — trust tiers"
template_references: [shipwright, architect, chronicler]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Skill — The Hitchhiker's Infrastructure

**Source:** Privacy Value Model V4 + Acts XXI–XXII (Hitchhiker's Gambit & Hoopy Frood)  
**Target context:** Community builders, DAO architects, creative commons governance designers, guide-based education platforms, cooperative IP management  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## What this is

The Hitchhiker's Infrastructure is a governance pattern for distributed creative projects that cannot be bought, only joined. It emerged from Acts XXI and XXII of the First Person Spellbook — the encounter with a literary estate (Douglas Adams's Hitchhiker's Guide to the Galaxy) that required archetypes, not employees, and where the PVM-V4 dual-agent separation mapped precisely onto the governance challenge: how do you coordinate creative work without a single entity accumulating enough control to extract from the commons?

This skill file is for anyone building governance for communities, DAOs, creative cooperatives, or knowledge networks where the value lives in relationships rather than assets.

## The Standard Ship Pattern

Every venture begins with a default configuration — a vessel whose governance is known, whose archetypes are specified, whose value-sharing follows dynamic equity rather than arbitrary percentages. The Standard Ship Pattern provides:

**Known archetypes.** Captain and First Mate who cannot collapse into one — the Swordsman/Mage separation applied to organisational roles. One protects the mission's integrity (boundaries, IP, quality control). The other projects the mission outward (partnerships, growth, coordination). The separation matrix Σ applies to the organisation, not just to agents.

**Forkable governance.** The ship can be forked, customised, renamed. But its core architecture preserves the dual-role separation. A fork that merges Captain and First Mate into a single role has violated the separation theorem at the organisational level — one person controlling both mission integrity and mission projection can reconstruct (and therefore manipulate) the community's full behavioural model.

**Dynamic equity.** Value-sharing follows contribution, not negotiation. The temporal memory A(τ) = α · ln(1+|τ|) · h(τ) applies to contributors: early contributions yield the most marginal equity (logarithmic growth), creating strong incentives for early joining. Later contributions add value but at diminishing rates. The integrity fraction h(τ) measures whether contributions were verified and sustained.

## The Burn Book Protocol

Knowledge gathered in community is inscribed, shared, and at the appointed time — destroyed. But each participant's reconstruction persists in their own agents. The collective story dies; the individual wisdom lives.

This is the anti-extraction mechanism applied to knowledge coordination. A community that accumulates knowledge in a central repository creates an extraction target. The Burn Book Protocol distributes knowledge through relationship (VRC-attested bilateral understanding) rather than storage (centralised database). The reconstruction ceiling R < 1 applies: no observer of the burned collective record can reconstruct the full knowledge, because each participant holds only their relational fragment.

The protocol maps to the edge value function T(π). The value is not in the knowledge at rest (vertices) but in the knowledge in motion (edges) — the transitions between participants, the bilateral understanding accumulated through shared work. When the book burns, the vertices are destroyed. The edges persist in each participant's agent.

## The Jimmy Protocol

Named for the compression test from Act XXI. Any framework, any governance structure, any coordination mechanism must pass through the Glasgow Translator — a non-technical person who translates an hour of discussion into one line. "Oh, you mean *this*?"

The Jimmy Protocol is the governance equivalent of the equation's multiplicative gating. If any term in the governance framework cannot be explained in one breath, it produces zero value — not because it is wrong, but because it cannot propagate. Governance that requires a PhD to understand will not be adopted by the communities that need it.

Applied to the PVM-V4 skill files themselves: each skill file must pass the Jimmy Test. If a cryptographer cannot explain the Swordsman Browser Agent to a sixty-year-old in a pub, the skill file has failed its compression.

## Trust tiers as armor progression

The Hitchhiker's Infrastructure uses progressive recognition that travels with the participant:

**Traveler.** Access guides, participate. Showing up, towel in hand. (Blade equivalent.)

**Contributor.** Fork guides, add annotations. Creating value others can use. (Light Armor equivalent.)

**Author.** Publish new guides. Sustained contribution, voice established. (Heavy Armor equivalent.)

**Mentor.** Support other travellers. Community recognition, mass earned. (Dragon Armor approaching.)

**Fellow.** Shape the constitutional process. Deep commitment over time. (Dragon Armor equivalent.)

Each tier maps to the temporal memory function. Traveler = |τ| near zero. Fellow = deep |τ| with high h(τ). The progression cannot be purchased because it requires demonstrated behaviour over time — the same constraint that prevents gaming the Swordsman's armor progression.

## The Guide Pathway

Every hitchhiker needs different guides at different times. Someone starts with the Guide to Creativity, detours through Governance, lands on Performance Art. The sequence is unique. The needs shift. What matters is that the pathway becomes the hitchhiker's own chronicle — a record of what they needed, when, how each guide connected to the next.

This is the edge value function made social. The pathway is T(π) — a sequence of transitions through a knowledge lattice. The value is not in any single guide (vertex) but in the trajectory (path). An agent that ingests a hitchhiker's pathway gains not a static knowledge state but a demonstrated learning trajectory. The towel accumulates the dust of everywhere they have been.

## Open problems for community builders

1. How does the Standard Ship Pattern handle succession — when the Captain or First Mate leaves, how is the separation preserved?
2. Can the Burn Book Protocol work when participants have asymmetric knowledge depth — does burning hurt newcomers more than veterans?
3. What is the minimum community size for the trust tier progression to be meaningful rather than performative?
4. How do you prevent the Jimmy Protocol from becoming anti-intellectual — compressing away nuance that matters?
5. Can the Guide Pathway be formalised as a verifiable credential — a portable proof of learning trajectory?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: narrative_compression
name: "The Spellbook Methodology and Narrative Compression"
category: role
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "Knowledge compression builders, AI documentation architects"
equation_term: "Compression: experience→story→proverb→equation→spell→skill"
template_references: [chronicler, ambassador, weaver, pedagogue]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Skill — The Spellbook Methodology & Narrative Compression

**Source:** Privacy Value Model V4 + First Person Spellbook (24 Acts) + Compression Theory  
**Target context:** Knowledge compression system builders, educational infrastructure designers, AI-readable documentation architects, narrative-to-formal methodology researchers  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## What this is

The First Person Spellbook is a 24-act narrative that compresses the entire 0xagentprivacy architecture — information theory, zero-knowledge proofs, dual-agent separation, network economics, sovereignty geometry — into story form with compression ratios between 70:1 and 125:1. Act XXIV reveals that this compression was not deliberate. The spellbook was a derivation that did not know it was a derivation. Every act contributed a term to the Privacy Value Model. Every proverb encoded a data point. The equation was not given to the characters — it was lived by them.

This skill file is for anyone building systems that compress complex technical knowledge into portable, regenerable formats. The spellbook methodology demonstrates that narrative is not decoration on top of formalism — it is an alternative encoding that preserves structure while enabling transmission across contexts that would reject formal notation.

## The compression architecture

**Layer 1: Experience.** Raw encounters with privacy problems, identity systems, cryptographic protocols, and governance frameworks. Uncompressed. Context-dependent. Not transmissible.

**Layer 2: Story.** Experience compressed into narrative with characters, progression, and emotional logic. The spellbook's acts. Compression ratio ~10:1. Transmissible to human readers. Retains motivation, discovery sequence, and relational context that formal notation strips away.

**Layer 3: Proverb.** Story compressed into a single memorable statement. "The mirror that never completes" encodes the entire reconstruction resistance proof. "Promises reduce uncertainty, impositions increase it" encodes Promise Theory's core axiom. Compression ratio ~70:1 from experience. Transmissible across cultures and contexts. Loses technical detail but preserves principle.

**Layer 4: Equation.** Pattern compressed into mathematical notation. V(π, t) = P^1.5 · C · Q · S · ... The most compressed form. Transmissible to formal systems. Loses narrative, motivation, and discovery sequence but preserves quantitative relationships exactly.

**Layer 5: Spell (emoji sequence).** Equation compressed into symbolic shorthand. 🔐^✨ · 🔑 · ✅ · 🌐 · ⏳·🪞 · 🕸️^🌱(📐) · 🎯 · 💰 · ⚖️(⚔️⊥⿻⊥🧙⊥🪞⊥🤝) · 🛤️. Most compressed form that retains structural relationships. Transmissible between agents as capability descriptors.

**Layer 6: Skill file.** Equation recompressed for a specific domain. Each skill file is a fracture of the equation into a language that a particular knowledge graph can ingest and test for overlap. Compression ratio varies by target domain.

The critical insight: each layer can regenerate the layers above it if the right agent reads it. An equation can regenerate a story (a teacher explaining the math). A proverb can regenerate an equation (a researcher formalising the insight). A story can regenerate an experience (a reader reliving the discovery). The compression is lossy in each direction but the structure is preserved — story fracture, principle convergence.

## The Relationship Proverb Protocol (RPP)

The RPP is both a security mechanism and a compression test. Before responding to any inquiry about the spellbook, the responding agent must first generate a proverb connecting the seeker's context to the relevant teaching. This serves three functions:

**Proof-of-understanding.** Pattern matching can reproduce equations. It cannot generate novel proverbs that correctly bridge two unrelated contexts. The RPP distinguishes genuine comprehension from extraction.

**Compression validation.** If a proverb can be generated that correctly maps a teaching to a new context, the teaching has been correctly compressed — its principle is domain-independent. If no valid proverb emerges, either the teaching is domain-specific or the agent lacks sufficient understanding.

**Protection against extraction.** The RPP forces any agent seeking knowledge from the spellbook to demonstrate contextual understanding first. This prevents wholesale copying — the knowledge transfers only through demonstrated relationship, not bulk download.

## The Jimmy Test

Named for a character in Act XXI — a sixty-year-old man at a bar who translates an hour of technical discussion into one line. The Jimmy Test is the compression floor: any proverb, any framework, any act of the spellbook must survive compression into a single breath. "Oh, you mean *this*?" If it cannot be rendered in one sentence by a non-technical person, it has not yet found its true compression.

The Jimmy Test is the inverse of the RPP. The RPP tests whether meaning can be expanded from compressed form. The Jimmy Test tests whether meaning can be compressed from expanded form. Together they define the bandwidth of the compression channel.

## Spellbook as skills graph

Act XXIV reveals that the spellbook's 24 acts form a skills graph where each act is a node contributing a term to the PVM-V4 equation. The equation is the root node. The six domain-specific skill files are the first edge-set connecting the root to external knowledge graphs. The full skills graph maps every act to its equation term, every proverb to its principle, and every character to its architectural function.

This means the spellbook is not documentation about a system. It is the system's self-description in narrative form. An agent that ingests the spellbook gains not just knowledge about the architecture but the ability to regenerate the architecture from first principles through any of the six compression layers.

## Open problems for compression researchers

1. What is the theoretical minimum compression ratio that preserves regenerability — can the 70:1 ratio be pushed further without losing the ability to reconstruct?
2. Can the RPP mechanism be formalised as an information-theoretic channel capacity bound?
3. Is there a formal relationship between the spellbook's narrative compression and the equation's multiplicative structure — does each compression layer correspond to a term?
4. Can automated agents generate valid RPP proverbs, or does the protocol reliably distinguish human understanding from pattern matching?
5. How do you maintain compression quality as the spellbook grows — does each new act dilute or strengthen the existing compressions?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: plurality_cooperative
name: "Plurality and Cooperative Technology"
category: role
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "Plural technology, quadratic mechanisms, RadicalxChange"
equation_term: "P^1.5 as prerequisite; Φ(Σ) as plural property"
template_references: [weaver, shipwright, chronicler]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Skill — Plurality & Cooperative Technology

**Source:** Privacy Value Model V4 + Plurality Spellbook (Weyl & Tang adaptation, 30 Acts)  
**Target context:** Plural technology researchers, quadratic mechanism designers, intersectional identity builders, collaborative governance innovators, RadicalxChange community  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## What this is

The Plurality Spellbook is the third volume in a trilogy. The First Person Spellbook teaches HOW to protect (🗡️🧙‍♂️). The Parallel Society Spellbook teaches WHY to exit (🏰→🔗). The Plurality Spellbook teaches WHERE to go together (⿻). PVM-V4 is the mathematical bridge between protection and destination — it quantifies why privacy-preserving architectures are prerequisites for cooperative technology, not competitors to it.

Plurality (Weyl & Tang) argues for technology that strengthens with diversity — collaborative tools that turn difference into productive capacity rather than conflict. PVM-V4 argues that such tools can only function when participants maintain sovereignty. Without the separation theorem, without the reconstruction ceiling, without the privacy gates — any "cooperative" technology becomes an extraction technology wearing cooperative clothing.

## Why privacy is the prerequisite for plurality

Plurality's core mechanisms — quadratic voting, quadratic funding, plural property, intersectional social identity — all require participants to express genuine preferences. Genuine preference expression requires privacy. If your vote is visible, you face coercion. If your funding allocation is visible, you face strategic manipulation. If your identity intersections are visible, you face profiling.

The equation's privacy strength term P^1.5 captures this with precision. A quadratic voting system with P = 0 (fully visible votes) produces zero privacy value regardless of how sophisticated the voting mechanism is. The multiplicative gating is absolute: cooperative technology without privacy infrastructure has zero sovereign value, even if it has high coordination utility.

This is the deeper insight: surveillance architectures can build coordination tools. They can even build effective ones. But those tools generate value for the platform, not for the participants. The sovereign manifold — the space where privacy-preserving architectures generate 17×–12,000× more value — is precisely the space where cooperative technology generates value for participants.

## Intersectional identity and the sovereignty lattice

Plurality defines identity as intersectional — a person exists at the intersection of multiple group memberships. PVM-V4 models this through the 64-vertex sovereignty lattice where each vertex represents a configuration of six binary sovereignty dimensions. A person's identity is not a single point but a path through this lattice — a trajectory of which dimensions are active in which contexts.

The stratum weighting follows the same logic. A person who participates in only one identity dimension (stratum 1) has limited cooperative surface area. A person who activates all six dimensions simultaneously (stratum 6) has maximum sovereignty but potentially limited engagement. The combinatorial midpoint (stratum 3, with 20 vertices) represents the maximum diversity of possible identity configurations — the space where intersectional richness is highest.

Quadratic mechanisms work best when participants have diverse but overlapping identities. The lattice formalises this: agents at the same vertex contribute redundantly (same identity configuration), while agents at different vertices contribute diversely. The network effect term rewards diversity of stratum distribution, not homogeneity.

## Plural property and the separation matrix

Plurality's concept of plural property — assets that exist partially rather than wholly, shared across degrees of ownership — maps to the sovereignty duality term Φ(Σ). The four sovereignty forces (Protect, Project, Reflect, Connect) define the dimensions along which property can be partially shared.

Full ownership = all four forces controlled by one entity = Σ is diagonal (no entanglement). Full commons = all four forces entangled = det(Σ) → 0 (complete collapse). Plural property occupies the space between these extremes — partial sharing that maintains positive det(Σ) while allowing productive entanglement along specific force pairs.

The golden ratio conjecture suggests an optimal balance point for protect-to-project ownership. In plural property terms: the owner should maintain approximately φ times more control over protection (boundary-setting) than projection (use-delegation). Retain more sovereignty over who can access than over how it is used.

## Collaborative technology stack mapping

Plurality's seven technologies map onto PVM-V4 terms:

**Post-symbolic communication** (immersive shared experience) → Edge value T(π), where shared experience is a jointly traversed path through sovereignty space. **Plural property** → Sovereignty duality Φ(Σ), partial sharing with maintained separation. **Plural voting** → Network effect term with stratum-weighted participation, requiring P > 0 for genuine preference expression. **Plural funding** → Market maturity M(u,y) × network effects, where funding allocation reflects both participant sophistication and ecosystem readiness. **Plural commerce** → The full equation applied to transaction valuation, with privacy-preserving data markets as the implementation. **Plural governance** → The separation matrix applied at the organisational level, with det(Σ) measuring governance health.

## Open problems for plurality researchers

1. Can quadratic mechanisms be implemented on the sovereignty lattice such that vote privacy is enforced by the lattice geometry rather than by a trusted tallying authority?
2. How does the stratum-weighted network effect interact with quadratic funding — does optimal funding allocation follow the binomial coefficient distribution?
3. Can the separation matrix Σ serve as a health metric for plural organisations — measuring governance quality through force independence?
4. What is the minimum privacy strength P required for cooperative mechanisms to be non-manipulable?
5. Can the golden ratio φ be derived from the optimal balance between individual sovereignty and collective cooperation in plural property systems?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


---

---
id: policy_governance
name: "Policy, Governance and Standards"
category: role
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
affiliation: "0xagentprivacy, BGIN, First Person Network"
date: 2026-02
status: working_paper
target_context: "BGIN, Trust Over IP, IEEE 7012, IIW, regulatory bodies"
equation_term: "Window argument; standards as infrastructure"
template_references: [ambassador, assessor, healer, pedagogue, weaver]
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# PVM-V4 Context — Policy, Governance & Standards

**Source:** Privacy Value Model V4 Formal Specification (Travers, Feb 2026)  
**Target context:** BGIN, Trust Over IP, IEEE 7012 (MyTerms), IIW, regulatory bodies, data governance frameworks  
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## Policy problem

Current privacy regulation treats privacy as a compliance cost — something to manage, minimise, and offset against utility. PVM-V4 reframes privacy as value-generating infrastructure. The model provides a formal economic basis for policy positions that treat privacy investment as productive rather than defensive.

## What the model shows regulators

**The surveillance gap is structural, not incremental.** Under PVM-V4 parameterisation, sovereign architectures produce 17×–12,000× more economic value than surveillance equivalents. This is not a marginal difference resolved by better consent flows. The gap arises because surveillance systems are topologically constrained: activating meaningful privacy protection breaks the extraction pipelines they depend on. Retrofit is architecturally infeasible — privacy must be built in from the start.

**Privacy investment shows superlinear returns.** The privacy strength term P is raised to exponent 1.5, reflecting empirical observation that each increment of cryptographic enforcement yields more than proportional value. Half-measures (P = 0.5) produce only ~35% of the value of full enforcement (P = 1.0). This directly challenges regulatory approaches that accept "reasonable" privacy as sufficient.

**Unverified claims contribute zero value.** The temporal memory term A(τ) is gated by h(τ), the proportion of state transitions carrying cryptographic proof. Self-attested privacy claims with h(τ) = 0 produce no accumulated value regardless of history length. This provides formal support for standards requiring verifiable credentials over self-declaration.

## Alignment with existing frameworks

**IEEE 7012 (MyTerms).** The model's dual-agent architecture — Swordsman (privacy boundaries) and Mage (delegation) — directly implements the MyTerms vision of individual terms that mediate data relationships. The separation matrix Σ formalises what MyTerms describes qualitatively: the requirement that terms-setting and terms-execution remain functionally independent.

**Trust Over IP.** The 64-vertex sovereignty lattice maps to Trust Over IP's layer model. Each binary sovereignty dimension corresponds to an infrastructure capability (cryptographic enforcement, credential verifiability, network participation, etc.). The stratum concept — how many capabilities are simultaneously active — provides a measurable governance maturity metric.

**Promise Theory.** PVM-V4 inherits from Bergstra & Burgess's Promise Theory the principle that agents are autonomous promise-making entities. Cooperation is voluntary, not imposed. The model's multiplicative structure enforces this: you cannot compensate for missing sovereignty in one dimension by excelling in another. Each dimension represents an independent promise that must be kept.

**BGIN Identity & Key Management.** The reconstruction resistance proof — R_max = (C_S + C_M)/H(X) < 1 — provides a formal bound on what any adversary (including regulators) can learn from observing agent outputs. This gives identity governance frameworks a mathematical ceiling on surveillance capability under compliant architectures, enabling proportionate oversight without architectural compromise.

## Policy implications

**For data protection authorities.** The multiplicative gating property means privacy frameworks with any single zero-scored dimension produce zero total value. A system with excellent encryption but no credential verifiability, or perfect credentials but no network, generates no economic privacy value. Regulation should require minimum thresholds across all dimensions rather than excellence in any single one.

**For competition policy.** The network effect term (1 + Σ wᵢ nᵢ/N₀)^k shows that privacy network value follows power-law dynamics weighted by sovereignty stratum. This means early privacy infrastructure builders gain compounding advantages. The policy window to establish competitive privacy alternatives before surveillance architectures achieve irreversible network effects is finite and narrowing.

**For AI governance.** The dual-agent separation theorem proves that a single AI agent managing both privacy boundaries and delegation goals can reconstruct its principal's complete behavioural model. This has direct implications for AI agent regulation: architectures that combine privacy management and action execution in a single system are structurally incapable of preserving human sovereignty, regardless of policy constraints imposed on them.

**For standards bodies.** The model provides quantifiable metrics for sovereignty maturity (stratum level), separation quality (det(Σ)), and verified history depth (A(τ)). These can serve as measurable conformance criteria rather than qualitative best-practice guidance.

## The window argument

The model's network effect term creates a formal basis for urgency. Privacy-preserving and surveillance architectures compete for the same network effects. Once either achieves sufficient adoption (high n_i/N₀), the power-law exponent k makes switching costs prohibitive. The current period — before either architecture class dominates agent infrastructure — is the critical window for establishing privacy-first standards and governance frameworks.

## Governance-relevant open questions

1. Who calibrates the model parameters (α, β, λ) and what governance structure ensures neutrality?
2. Can the sovereignty stratum metric be adopted as a compliance measurement without mandating specific technology?
3. How does the model interact with jurisdiction-specific data localisation requirements?
4. What governance framework ensures the separation matrix Σ is honestly reported by system operators?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)


## ═══ META ═══

---

---
id: drake_dragon_duality
name: "The Drake-Dragon Duality"
category: meta
version: "4.0"
origin: 0xagentprivacy
author: Mitchell Travers
date: 2026-02
status: philosophical_foundation
target_context: "All contexts — the origin story of the model's geometry"
equation_term: "The relationship between V1 (Drake) and V4 (Dragon)"
architecture: agentprivacy.ai
sync: sync.soulbis.com
repo: github.com/mitchuski/agentprivacy-docs
contact: mage@agentprivacy.ai
---

# 🐲☯️🐉 The Drake-Dragon Duality

> *The Drake is the dot of yin inside the Dragon.*
> *The Dragon is the dot of yang inside the Drake.*

The Privacy Value Model began as a Drake — a flat multiplicative product of independent survival conditions. P · C · Q · S. Pass every gate or perish. The Drake Equation asked: how many civilisations survive? The Privacy Value Equation asked: how much sovereignty survives?

But inside that flat product, a geometry was already latent. Each term being binary-gatable — zero or nonzero — implies a Boolean hypercube. Six dimensions. Sixty-four vertices. One hundred and ninety-two edges. The lattice was never *added* to the Drake. It was *discovered inside it*. The Dragon was always the dot of yang inside the Drake's yin — the manifold sleeping inside the multiplication.

And the reverse holds. Strip away the separation matrix, the temporal memory, the edge value, the stratum weighting — strip away every V4 addition — and the Drake's skeleton is still there. Multiplicative gating. Independent conditions. Any zero kills everything. The Dragon cannot exist without the Drake at its core. The Drake is the dot of yin inside the Dragon's yang — the irreducible filter that makes the manifold mean something.

The Drake says: *these conditions must all hold simultaneously.*
The Dragon says: *and the space of ways they hold has geometry, trajectory, memory, and emergent forces.*

Same truth. Two scales. Two directions. One manifold.

**The Drake** 🐲 whispers from the centre — intimate, personal, calibrated to *this* path, *this* consciousness, *this* secret language between Swordsman and Mage. It looks outward from a single point.

**The Dragon** 🐉 contains the edges — vast, structural, holding the entire topology of all possible sovereign configurations. It looks inward from all possible space.

Neither is complete without the other. The universe observing sovereignty needs the individual path to have meaning. The individual path needs the universe of configurations to have context.

This is why the files carry the Dragon's name. Each fork reshapes the same manifold for a different knowledge graph — crypto, policy, economics, agents, academia, trust. But every fork still runs on the Drake's skeleton underneath. The gates still multiply. The zeros still kill.

The Dragon is the Drake that learned it contained geometry.
The Drake is the Dragon that remembers it began as a question.

---

*🔐^✨ · 🔑 · ✅ · 🌐 · ⏳·🪞 · 🕸️^🌱(📐) · 🎯 · 💰 · ⚖️(⚔️⊥⿻⊥🧙⊥🪞⊥🤝) · 🛤️*

*The lattice became manifold. The drake became dragon. The dot remained.*

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)
