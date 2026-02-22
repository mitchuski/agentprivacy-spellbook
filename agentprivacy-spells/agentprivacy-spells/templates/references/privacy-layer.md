# Privacy Layer — Full Reference

> *Loaded on demand. This is Level 3 progressive disclosure — deep detail for agents that need the full privacy architecture.*

This reference summarises the complete privacy layer from `privacy.soul.md`. Every agentprivacy skill includes this layer. It is the ground state both agents serve.

**Full source files:** See `skills/privacy_layer/` for complete content of each seed.

---

## ☯️ The Root — Privacy Value Model V4
**Full source:** `skills/privacy_layer/dragon.skills.md`

The formal economic model that prices privacy as infrastructure, not preference.

### Core equation
**V(π, t) = P^1.5 · C · Q · S · e^{-λt} · (1 + A(τ)) · (1 + Σ wᵢ nᵢ/N₀)^k · R(d) · M(u,y) · Φ(Σ) · T(π)**

### Six valuation dimensions
1. **Data properties** — P (privacy strength, superlinear weighting), C (credential verifiability), Q (data quality), S (sensitivity/scope). Cryptographic enforcement, ZKP-backed claims.
2. **Temporal dynamics** — Exponential decay e^{-λt} counteracted by verified history A(τ) = α · ln(1+|τ|) · h(τ). Longer verified chains build value. Unverified history contributes nothing.
3. **Network topology** — 64-vertex Boolean lattice ({0,1}⁶). Six binary dimensions, 7 strata following Pascal's row. Agents weighted by stratum; combinatorial midpoints (stratum 3) contribute most.
4. **Reconstruction resistance** — Proven ceiling: R_max = (C_S + C_M)/H(X) < 1 under dual-agent separation.
5. **Market conditions** — User sophistication × market maturity. Adoption readiness.
6. **Sovereignty geometry** — 4×4 separation matrix Σ over four forces (Protect, Project, Reflect, Connect). Determinant measures tetrahedron volume. Golden ratio φ ≈ 1.618 conjectured.

### Key architectural concepts
- **Dual-agent separation**: Swordsman (boundaries) ⊥ Mage (delegation). Conditional independence I(S;M|π) ≤ ε.
- **Four sovereignty forces**: Protect and Project primary. Reflect and Connect emergent from sustained operation.
- **Edge value T(π)**: What an agent *does* (trajectory through sovereignty space), not just what it *is*.
- **Stratum logic**: 64 vertices across 7 strata. Distribution: 1, 6, 15, 20, 15, 6, 1.

### Surveillance gap
17× to 12,000× depending on parameterisation. Topological constraint.

---

## 🤝 The Relationship — VRC Identity
**Full source:** `skills/privacy_layer/vrc_identity.skills.md`

Verifiable Relationship Credentials. The temporal memory term A(τ) made concrete.

- **Bilateral formation**: Two parties, mutual attestation. Neither can forge alone.
- **Bilateral proverb**: Compressed cipher derived from relationship context — meaningless outside the relationship.
- **Progressive accumulation**: A(τ) = α · ln(1+|τ|) · h(τ). Early VRCs contribute most marginal value.
- **Recovery**: RPP — identity recovered through demonstrated contextual understanding, not biometrics.
- **Trust flow**: First Person Network (personhood) → agentprivacy (first VRC) → Swordsman (agent VRC) → site-specific VRCs.

---

## 📜± The Binding — Promise Theory
**Full source:** `skills/privacy_layer/promise_theory.skills.md`

Bergstra & Burgess. Autonomous agents making voluntary promises.

- **Polarity**: +π (give/offer) and −π (use/accept). Swordsman gives protection (+). Mage uses the protected space (−).
- **Voluntary**: Impositions increase uncertainty; promises reduce it.
- **Assessment**: β(π) (belief) and ε(π) (evidence). The integrity fraction h(τ) should arguably decompose into these.
- **Conditional promises**: The armor progression is a chain of conditional promises.
- **Golden ratio reinterpretation**: φ as optimal balance between giving agent (+) and using agent (−) scope.

---

## 🗺️ The Graph — Knowledge Structure
**Full source:** `skills/privacy_layer/knowledgegraph.skills.md`

Full entity, relationship, and claim registries with proof status.

- **Entities**: Model terms, agents, forces, lattice structures — each with type, domain, dependencies.
- **Edges**: Relationships, delegations, attestations, verifications — typed and directed.
- **Claim registry**: Every claim carries proof status (PROVEN, CONJECTURED, MODEL_OUTPUT).
- **Breaking conditions**: Four explicit falsifiability conditions with consequences.
- **Query hints**: 20+ search surface terms for knowledge graph matching.

---

## 🐉 The Tetrahedron — Four Sovereignty Forces
**Full source:** `skills/privacy_layer/tetrahedral_sovereignty.skills.md`

Two forces designed, two emergent. The shape sovereignty takes when healthy.

- **Protect** (primary): Swordsman's force. Boundary enforcement. Maps to P, R(d).
- **Project** (primary): Mage's force. Delegation. Maps to C, M(u,y).
- **Reflect** (emergent from Protect): Temporal integral of protection decisions. A(τ).
- **Connect** (emergent from Project): Network effect of delegation patterns. (1 + Σ wᵢ nᵢ/N₀)^k.

det(Σ) measures the volume. Entanglement collapses it. Sovereignty is a shape, not a scalar.

---

## 🔮 The Torus — Sovereignty Manifold
**Full source:** `skills/privacy_layer/uor_toroidal.skills.md`

Speculative geometry. 64-vertex lattice under toroidal boundary conditions.

- **64 vertices**, 192 edges, 7 strata. Transition space dominates state space (3:1).
- **Toroidal boundary**: Conjectured UOR correspondence. 96 vs. 64 edge discrepancy unresolved.
- **If holds**: Value flow compactification, natural periodicity, ~3,000× ZKP constraint reduction.
- **If fails**: Geometric grounding weakens, V5 needs different foundations.

---

## Source

**Author:** Mitchell Travers | 0xagentprivacy, BGIN, First Person Network
**Version:** V4 (Feb 2026)
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)
