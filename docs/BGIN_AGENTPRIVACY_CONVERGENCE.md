# BGIN AI × AgentPrivacy Convergence Plan

## Executive Summary

Both projects share the **Swordsman ⚔️ / Mage 🧙** dual-agent architecture and the **Relationship Proverb Protocol (RPP)**. BGIN AI focuses on governance intelligence for conferences, while AgentPrivacy focuses on privacy-preserving AI with blockchain verification. This document outlines features from BGIN AI that could enhance AgentPrivacy.

---

## Feature Comparison Matrix

| Feature | BGIN AI | AgentPrivacy | Convergence Opportunity |
|---------|---------|--------------|------------------------|
| **Identity Ceremony** | 8-step Ed25519 keygen | None | ⭐ High Value |
| **Promises System** | Full Kanban board | None | ⭐ High Value |
| **Spellbook by Session** | Conference sessions | By grimoire | Medium Value |
| **Privacy Budget** | 16 queries/session | 6 queries/session | Already similar |
| **Trust Tiers** | Blade → Dragon | Planned | ⭐ High Value |
| **Proverb Feed** | WG-filtered stream | Basic stream | Medium Value |
| **Knowledge Graph** | Graphology + Sigma.js | None | Medium Value |
| **Cross-WG References** | Automatic hints | None | Low Value |
| **Collaborative Sessions** | Yjs CRDTs | None | Future consideration |
| **MyTerms Agreements** | Ceremony integration | None | ⭐ High Value |
| **Agent Cards** | Signed identity objects | None | ⭐ High Value |

---

## Recommended Features to Adopt

### Tier 1: High Priority (Strong Alignment with AgentPrivacy Vision)

---

### 1. 🎭 Identity Ceremony System
**BGIN Implementation**: 8-step wizard with Ed25519 key generation, privacy preferences, working group selection, and encrypted backup.

**Why Adopt**: AgentPrivacy talks about Swordsman identity but doesn't have a formal ceremony. This would:
- Formalize the "First Person" concept
- Generate verifiable credentials locally
- Set privacy preferences upfront
- Create signed Agent Cards

**Adaptation for AgentPrivacy**:
```
Ceremony Steps:
1. Welcome - Set Swordsman display name
2. Key Generation - Ed25519 keypair (WebCrypto)
3. Privacy Preferences - Attribution levels for proverbs
4. MyTerms Agreement - Data sovereignty acknowledgment
5. Grimoire Selection - Which spellbooks to engage with
6. Agent Card Creation - Signed identity object
7. Key Backup - Encrypted with passphrase
8. Completion - Ready to evoke
```

**Files to Reference**:
- `BGINAI/src/app/ceremony/page.tsx`
- `BGINAI/src/lib/ceremony/keygen.ts`
- `BGINAI/src/lib/ceremony/agentCard.ts`

**Effort**: Medium (3-5 days)

---

### 2. 📜 Promises System
**BGIN Implementation**: Voluntary commitments with types (author, review, attend, present, research, coordinate, custom), lifecycle states, and optional proverb connections.

**Why Adopt**: AgentPrivacy focuses on proverbs as "proof of understanding" but lacks a commitment mechanism. Promises would:
- Let users commit to actions based on their understanding
- Create a trust graph from fulfilled promises
- Connect proverbs → promises → outcomes
- Enable "promise-to-inscribe" flows

**Adaptation for AgentPrivacy**:
```
Promise Types:
- 'inscribe' - Commit to inscribing a proverb
- 'study' - Commit to studying a spellbook act
- 'share' - Commit to sharing knowledge
- 'contribute' - Commit to protocol contribution
- 'custom' - Free-form commitment

States: active → in_progress → completed / withdrawn

UI: Kanban board on /promises page
```

**Files to Reference**:
- `BGINAI/src/app/promises/page.tsx`
- `BGINAI/src/lib/promises/types.ts`
- `BGINAI/src/components/workspace/PromiseBoard.tsx`

**Effort**: Medium (3-5 days)

---

### 3. 🏆 Trust Tier System (Visual)
**BGIN Implementation**: Trust tiers (Blade, Light, Heavy, Dragon) based on participation metrics, displayed with badges and progress bars.

**Why Adopt**: AgentPrivacy already has this in tokenomics but no UI. BGIN has the visual components ready:
- Trust tier badges with iconography
- Progress indicators
- Profile integration

**Adaptation**:
```
Tier Calculation (from AgentPrivacy tokenomics):
- Blade: 0-50 signals (inscribed proverbs)
- Light: 50-150 signals
- Heavy: 150-500 signals
- Dragon: 500+ signals

Visual: Badge on profile, progress bar to next tier
```

**Files to Reference**:
- `BGINAI/src/components/trust/TierBadge.tsx`
- `BGINAI/src/components/trust/TrustProfile.tsx`

**Effort**: Low (1-2 days)

---

### 4. 🤝 MyTerms / Agreements Chronicle
**BGIN Implementation**: Bilateral data agreements recorded before access, stored in an "Agreement Chronicle."

**Why Adopt**: AgentPrivacy talks about human sovereignty but doesn't formalize consent. This would:
- Make data sovereignty explicit
- Create audit trail of agreements
- Integrate with ceremony flow
- Align with Customer Commons / MyTerms standards

**Adaptation**:
```
Agreement Types:
- Proverb Attribution (how proverbs are shared)
- Oracle Interaction (what Swordsman sees)
- Data Retention (session persistence)
- Inscription Consent (before onchain writes)
```

**Files to Reference**:
- `BGINAI/src/lib/myterms/chronicle.ts`
- Ceremony step 4 integration

**Effort**: Medium (2-3 days)

---

### 5. 🪪 Agent Card System
**BGIN Implementation**: Signed JSON objects containing identity, working groups, privacy settings, and cryptographic proof.

**Why Adopt**: Creates portable, verifiable identity that:
- Can be shared selectively
- Proves participation without revealing keys
- Integrates with Zcash memo field
- Enables cross-platform recognition

**Adaptation**:
```typescript
interface AgentCard {
  participantId: string;        // ap-{hash}
  displayName: string;          // Swordsman name
  publicKeyHex: string;         // Ed25519 public
  grimoires: string[];          // Engaged spellbooks
  privacy: PrivacyPreferences;  // Attribution settings
  trustTier: TrustTier;         // Current tier
  signature: string;            // Self-signature
  createdAt: string;
}
```

**Files to Reference**:
- `BGINAI/src/lib/ceremony/agentCard.ts`

**Effort**: Low-Medium (2-3 days)

---

### Tier 2: Medium Priority (Nice to Have)

---

### 6. 📊 Proverb Feed with Filtering
**BGIN Implementation**: Proverb stream with working-group filtering, "my proverbs" view, and expandable details.

**Current AgentPrivacy**: Basic proverb stream on `/proverbs`

**Enhancement**:
- Filter by grimoire (story, zero, canon, etc.)
- Filter by trust tier
- "My proverbs" toggle
- Search functionality
- Sort by recency or relevance

**Files to Reference**:
- `BGINAI/src/app/proverb/page.tsx`

**Effort**: Low (1-2 days)

---

### 7. 🗺️ Knowledge Map / Spellweb
**BGIN Implementation**: Interactive graph visualization using Graphology + Sigma.js showing topics, connections, and exploration depth.

**Why Consider**: Visual representation of:
- Which acts user has explored
- Connections between concepts
- Learning path visualization
- Community knowledge distribution

**Adaptation**:
```
Nodes: Acts/Tales from spellbooks
Edges: Conceptual connections, user exploration paths
Metadata: Depth (interaction count), relevance scores
```

**Files to Reference**:
- `BGINAI/src/components/spellbook/SpellwebNavigator.tsx`
- `BGINAI/src/lib/spellweb/types.ts`

**Effort**: High (5-7 days)

---

### 8. 📅 Session-Based Organization
**BGIN Implementation**: Casts organized by conference sessions (Block 14 timetable).

**Adaptation for AgentPrivacy**:
Instead of conference sessions, organize by:
- Learning sessions (user-defined)
- Study groups
- Time-based "chapters" of engagement
- Inscription batches

**Effort**: Medium (2-3 days)

---

### 9. 🔐 Signed Request Authentication
**BGIN Implementation**: All API calls include Ed25519 signatures in headers for verification.

**Why Consider**: Currently AgentPrivacy uses API keys. Signed requests would:
- Prove identity without sharing secrets
- Enable audit trails
- Integrate with Agent Card system

**Files to Reference**:
- `BGINAI/src/lib/swordsman/signedFetch.ts`
- `BGINAI/src/lib/auth/verify.ts`

**Effort**: Medium (3-4 days)

---

### 10. 🧙 Mage Panel (Side Panel Chat)
**BGIN Implementation**: Floating side panel for quick Mage chat without leaving current page.

**Current AgentPrivacy**: Full-page Mage interface or modal

**Enhancement**: Add floating panel that:
- Opens from any page
- Preserves context across navigation
- Allows quick proverb composition
- Shows privacy budget

**Files to Reference**:
- `BGINAI/src/components/layout/MagePanel.tsx`
- `BGINAI/src/contexts/MagePanelContext.tsx`

**Effort**: Low-Medium (2-3 days)

---

### Tier 3: Lower Priority / Future Consideration

---

### 11. 🤝 Collaborative Sessions (Yjs CRDTs)
**BGIN Implementation**: Multi-participant sessions with shared state via conflict-free replicated data types.

**Future Consideration**: Could enable:
- Group proverb composition
- Shared study sessions
- Community spellbook contributions

**Effort**: High (7-10 days)

---

### 12. 📚 Episodic Memory System
**BGIN Implementation**: Client-side memory of topics explored, documents cited, patterns.

**Enhancement**: Track user's learning journey:
- Which acts they've read
- What proverbs they've composed
- Conversation history per grimoire

**Effort**: Medium (3-4 days)

---

### 13. 🔍 Cross-Reference Hints
**BGIN Implementation**: Automatic hints when content relates to other working groups.

**Adaptation**: When user reads an act, suggest:
- Related acts in other grimoires
- Similar proverbs from community
- Conceptual connections

**Effort**: Medium (3-4 days)

---

## Implementation Roadmap Suggestion

### Phase 1: Identity Foundation
1. Identity Ceremony (adapted 8-step)
2. Agent Card generation
3. Trust Tier badges (visual)
4. MyTerms agreement flow

### Phase 2: Commitment Layer
5. Promises system
6. Promise → Proverb connections
7. Enhanced proverb feed with filtering

### Phase 3: Experience Polish
8. Mage Panel (floating sidebar)
9. Signed request authentication
10. Knowledge map visualization

### Phase 4: Advanced Features
11. Episodic memory
12. Cross-reference hints
13. Collaborative sessions

---

## Quick Wins (1-2 Days Each)

| Feature | Impact | Effort |
|---------|--------|--------|
| Trust Tier Badges | High visual impact | 1-2 days |
| Proverb Feed Filtering | Better UX | 1-2 days |
| Mage Panel Toggle | Consistent access | 2 days |
| Privacy Budget UI | Already have data | 1 day |

---

## Architecture Alignment

Both projects share:
- **Swordsman / Mage duality** ✓
- **RPP (Relationship Proverb Protocol)** ✓
- **Privacy-first design** ✓
- **Ed25519 cryptography** (BGIN has it, AP can adopt)
- **Local-first storage** ✓
- **Session-based privacy budgets** ✓

Key differences:
- BGIN uses WebCrypto + Dexie.js; AP uses localStorage
- BGIN has server component; AP is static export
- BGIN focuses on governance; AP focuses on learning + inscription

---

## Files Worth Directly Porting

These files have minimal dependencies and could be adapted quickly:

1. **`ceremony/keygen.ts`** - Ed25519 key generation
2. **`ceremony/agentCard.ts`** - Agent card structure
3. **`trust/TierBadge.tsx`** - Visual badge component
4. **`promises/types.ts`** - Promise type definitions
5. **`layout/MagePanel.tsx`** - Floating panel pattern
6. **`mage/privacyBudget.ts`** - Budget tracking logic

---

## Conclusion

The highest-value convergence opportunities are:

1. **Identity Ceremony** - Formalizes the Swordsman concept
2. **Promises System** - Creates commitment → outcome flow
3. **Trust Tier Visuals** - Shows progression
4. **Agent Cards** - Portable identity
5. **MyTerms Integration** - Explicit consent

These align with AgentPrivacy's vision of human sovereignty and would enhance the "understanding as proof" model by adding:
- **Verifiable identity** (ceremony + cards)
- **Explicit commitments** (promises)
- **Visual progression** (trust tiers)
- **Formal consent** (MyTerms)

The BGIN AI codebase provides working implementations that can be adapted rather than built from scratch.

---

## Decision Checklist

Mark your choices:

- [ ] **Identity Ceremony** - Full 8-step wizard
- [ ] **Agent Cards** - Signed identity objects
- [ ] **Promises System** - Commitment tracking
- [ ] **Trust Tier Badges** - Visual progression
- [ ] **MyTerms Agreements** - Consent chronicle
- [ ] **Proverb Feed Filtering** - Enhanced `/proverbs`
- [ ] **Mage Panel** - Floating sidebar chat
- [ ] **Knowledge Map** - Graph visualization
- [ ] **Signed Requests** - Cryptographic auth
- [ ] **Episodic Memory** - Journey tracking
- [ ] **Session Organization** - Time-based grouping
- [ ] **Cross-References** - Related content hints
- [ ] **Collaborative Sessions** - Multi-user (future)

---

*Generated: February 2026*
*Source: BGIN AI Block 14 + AgentPrivacy Master comparison*
