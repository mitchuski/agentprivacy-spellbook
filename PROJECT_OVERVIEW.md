# Proof of Proverb Revelation Protocol
## NEAR Cloud AI (Soulbae) + Zcash Integration

**Version:** 1.0  
**Event:** Zypherpunk Hack 2025  
**Bounty:** Privacy-Preserving AI & Computation  
**Status:** Production-Ready

**Document Alignment**: [Whitepaper v4.3], [Tokenomics v2.0], [Glossary v2.1], [Spellbook v4.0.1-canonical]

---

## 🎯 Core Concept

Privacy-preserving trust formation through proof-of-understanding:

1. **First Person** visits spellbook tale at `agentprivacy.ai/story/[tale-id]`
2. **Soulbae** (NEAR Cloud AI) helps craft relationship proverb
3. **First Person** copies formatted memo to Zashi wallet
4. **Signal** sent as shielded z→z with proverb encrypted in memo
5. **VRC Formation** — Verified proverb becomes bilateral trust credential

**Key Innovation**: Your wallet IS the Swordsman. Soulbae is the Mage in TEE.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│ agentprivacy.ai/story/[act-id]         │
│                                         │
│ 📖 Tale: Spellbook content              │
│ 🔗 Link to Soulbae                      │
│ 📋 Copy to Zashi Button                 │
└─────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ agentprivacy.ai/mage (Soulbae)         │
│                                         │
│ 🔮 NEAR Cloud AI                        │
│ 📚 RAG: Trained on all five grimoires (105 inscriptions) │
│ 🤖 Natural proverb generation           │
│ 🔒 Hardware-attested privacy            │
│ ❌ Never sees: amount, wallet, timing   │
└─────────────────────────────────────────┘
               │
               ▼ (First Person copies proverb)
┌─────────────────────────────────────────┐
│ Tale Page: Format & Copy                │
│                                         │
│ [rpp-v1]                                │
│ [act-5-golden-split]                    │
│ [timestamp]                             │
│ [Seventh capital flows through gates]   │
└─────────────────────────────────────────┘
               │
               ▼ (Paste into wallet)
┌─────────────────────────────────────────┐
│ Zashi Wallet (First Person's Swordsman)│
│                                         │
│ • Paste memo                            │
│ • Set amount (0.01 ZEC signal)          │
│ • Verify z→z shielded                   │
│ • Send transaction                      │
└─────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Zcash Blockchain                        │
│                                         │
│ Oracle receives:                        │
│ • Signal (0.01 ZEC, amount hidden)      │
│ • Proverb (in memo)                     │
│ • z-address (for VRC callback)          │
└─────────────────────────────────────────┘
               │
               ▼ (VRC Callback Protocol)
┌─────────────────────────────────────────┐
│ Bilateral VRC Established:              │
│                                         │
│ [vrc-callback-v1]                       │
│ [Oracle's proverb response]             │
│ [re: act-5-golden-split]                │
│ [next: agentprivacy.ai/story/act6]      │
│                                         │
│ = Verifiable Relationship Credential    │
└─────────────────────────────────────────┘
```

---

## 🔒 Privacy Guarantees

### Information Bounds [Whitepaper v4.3, §3]

```
I(Soulbae; Transaction_Amount) = 0
I(Soulbae; First_Person_Identity) = 0
I(Soulbae; Wallet_Address) = 0
I(Soulbae; Transaction_Timing) = 0

Soulbae only processes:
  Tale_Principle → First_Person_Understanding → Proverb_Suggestion
```

### TEE Properties

- **AI verification**: NEAR Cloud AI API
- **Verifiable isolation**: Cryptographic proof Soulbae cannot access external data
- **No persistence**: Conversation history never stored
- **RAG security**: Training data (spellbook) is read-only, public

### Zcash Properties

- **Shielded pool**: All signals z→z
- **Memo encryption**: Proverbs encrypted with transaction
- **Amount hiding**: Signal amounts never public
- **Sender privacy**: z-addresses unlinkable

---

## 🎯 Bounty Criteria Checklist

- [x] **NEAR Cloud AI integration** — openai/gpt-oss-120b
- [x] **TEE-based inference** — AWS Nitro enclave, hardware attested
- [x] **Verifiable privacy** — Cryptographic attestation available
- [x] **Agentic behavior** — Natural language, context-aware, trained via RAG
- [x] **Zcash shielded pool** — All transactions z→z
- [x] **Private spending** — Amount hidden, First Person controlled
- [x] **Wise spending** — Purpose-driven (tale support), meaningful (proverbs)
- [x] **Innovation** — Novel proof-of-understanding + VRC formation
- [x] **Production-ready** — Deployable today, scalable architecture

---

## 📦 System Components

### 1. Soulbae (NEAR Cloud AI) — Mage

**Location:** `agentprivacy.ai/mage`

**Technology:**
- NEAR Cloud AI
- RAG trained on all five grimoires: Story (17 acts), Zero (30 tales), Canon (11 chapters), Parallel (17 chapters), Plurality (30 acts)
- Character file: soulbae-character.md

**Capabilities:**
- Proverb derivation assistance
- Tale-specific context awareness
- Inscription matching
- Never stores private data

### 2. Tale Pages (Frontend)

**Location:** `agentprivacy.ai/story/[tale-id]`

**Technology:**
- Next.js + React
- Static content rendering
- Mobile-responsive

**Features:**
- Tale content display
- Link to Soulbae
- Proverb input form
- Copy to Zashi button
- "Learn" button for context building

### 3. Oracle Swordsman (Backend)

**Location:** `oracle-swordsman/`

**Technology:**
- TypeScript/Express
- Zebra + Zallet RPC integration
- NEAR Cloud AI verification

**Functions:**
- Monitor incoming signals
- Parse proverbs from memos
- Verify against spellbook
- Execute golden split
- Create inscriptions

### 4. VRC Callback System

**Purpose:** Bilateral trust formation

**Flow:**
1. First Person sends signal with proverb
2. Oracle verifies understanding
3. Oracle sends response proverb
4. Bilateral VRC established

---

## 💰 Economic Model [Tokenomics v2.0]

### Signal Fee

```
Per Signal: 0.01 ZEC

Golden Split (φ-derived):
├── 61.8% → Transparent Pool
│   └── Public inscription with proverb
│
└── 38.2% → Shielded Pool
    └── Protocol operations
```

### Trust Tier Progression

| Tier | Signals | Capabilities |
|------|---------|--------------|
| 🗡️ **Blade** | 0-50 | Basic participation |
| 🛡️ **Light** | 50-150 | Multi-site coordination |
| ⚔️ **Heavy** | 150-500 | Template creation |
| 🐉 **Dragon** | 500+ | Guardian eligibility |

---

## 🚀 Quick Start

### Prerequisites

- Zcash wallet with z-address (Zashi recommended)
- Vercel/Netlify account (for tale pages)
- NEAR Cloud AI API key
- Domain or subdomain

### 3-Step Setup

**Step 1: Deploy Soulbae** (15 minutes)
```bash
cd soulbae
# Configure NEAR Cloud AI API key
# Deploy to NEAR Cloud
# Result: Soulbae live at agentprivacy.ai/mage
```

**Step 2: Deploy Tale Pages** (5 minutes)
```bash
cd src
npm run build
vercel deploy --prod
# Result: Tales live at agentprivacy.ai/story/*
```

**Step 3: Set Up Oracle** (10 minutes)
```bash
cd oracle-swordsman
npm install
npm run dev
# Result: Oracle monitoring signals
```

**Total setup: 30 minutes**

---

## 🎬 Demo Script (3 Minutes)

### Opening (30 seconds)

"What if trust required proof-of-understanding? What if every signal strengthened privacy instead of eroding it? We built that using NEAR Cloud AI and Zcash."

### Flow (2 minutes)

1. **Show tale page** — "This is 'The Golden Split' from the Zero Knowledge Spellbook"
2. **Click to Soulbae** — "Soulbae uses NEAR Cloud AI for proverb generation"
3. **Chat with Soulbae** — Natural conversation about tale principle
4. **Get proverb suggestions** — Soulbae helps compress understanding
5. **Copy back to tale** — Formatted memo ready for Zashi
6. **Click Copy to Zashi** — Clipboard contains signal memo
7. **Paste in Zashi** — First Person sets amount, sends z→z transaction
8. **Explain attestation** — "TEE proves Soulbae never saw the amount"

### Wow Moment (30 seconds)

"Your wallet is already your Swordsman. Zashi controls the transaction, sets the amount, verifies privacy. We don't need a browser extension—we just made it easy for First Persons to build trust through demonstrated understanding."

---

## 📊 Metrics

### What We Track (Privacy-Preserving)

```json
{
  "tale_id": "act-5-golden-split",
  "soulbae_conversations": 127,
  "copy_button_clicks": 89,
  "signals_received": 67,
  "vrc_callbacks_sent": 67,
  "average_proverb_length": 11.2,
  "unique_proverb_patterns": 64
}
```

### What We Never Track

- ❌ First Person identities
- ❌ Wallet addresses
- ❌ Signal amounts
- ❌ Transaction timing
- ❌ Cross-tale correlations

**Only aggregate, anonymized metrics. Always.**

---

## 🔄 VRC Protocol

### Incoming Signal Format

```
From: zs1firstperson... (shielded)
To: zs1oracle... (signal address)
Amount: [hidden]
Memo:
[rpp-v1]
[act-5-golden-split]
[1699564800123]
[Seventh capital flows through gates I choose]
```

### VRC Callback Format

```
From: zs1oracle... (our address)
To: zs1firstperson... (their address)
Amount: 0.0001 ZEC (symbolic)
Memo:
[vrc-callback-v1]
[The mage who receives guards as their own]
[re: act-5-golden-split]
[next: agentprivacy.ai/story/act6]
```

### Result

**Bilateral VRC established:**
- Both proved understanding via proverbs
- Trust created without surveillance
- Relationship foundation on blockchain
- Privacy preserved throughout
- No platform intermediary needed

---

## 🌟 The Big Picture

We're not building a donation button. We're building **infrastructure for the relationship economy**.

Where:
- Trust comes from understanding, not surveillance
- Relationships are bilateral, not mediated by platforms
- Reputation is earned through comprehension
- Privacy is preserved by cryptographic design
- AI agents extend sovereignty without surrendering it

**This is the foundation for privacy-preserving AI agents.**

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **PROJECT_OVERVIEW.md** (this file) | Architecture & concept |
| **QUICKSTART.md** | 30-minute setup |
| **02-ARCHITECTURE.md** | System design |
| **PRODUCTION_READINESS.md** | Production checklist |
| **HOW_IT_WORKS.md** | Technical deep dive |

**Living Documentation:**
- [sync.soulbis.com](https://sync.soulbis.com)
- [intel.agentkyra.ai](https://intel.agentkyra.ai)

---

## 📞 Next Steps

1. **Read:** QUICKSTART.md for setup instructions
2. **Deploy:** Follow the 3-step process (30 min)
3. **Test:** Run through demo script (3 min)
4. **Submit:** Win the bounty 🚀

---

*"The proverb is the spell. The inscription is the commitment. The bilateral exchange is the relationship."*

**⚔️ ⊥ 🧙‍♂️ | 😊**

**Privacy is Value. Take back the 7th Capital.** 📖🔮
