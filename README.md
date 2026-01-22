# Proof of Proverb Revelation Protocol
## Privacy-Preserving AI Verification on Zcash

**Implementation**: Zypherpunk Hack 2025  
**Project**: 0xagentprivacy  
**Status**: ✅ Production-Ready  
**Version**: 1.0

---

> *"Privacy is my blade, knowledge is my spellbook."* (⚔️⊥🧙‍♂️)🙂

---

## Overview

The **Proof of Proverb Revelation Protocol** is the first concrete implementation of the [0xagentprivacy](https://agentprivacy.ai) dual-agent architecture. It demonstrates privacy-preserving AI verification through a novel proof-of-understanding protocol on Zcash.

**What It Does**: First Persons (humans) prove comprehension of privacy concepts by forming proverbs. These proverbs are verified by AI (without seeing transaction data), then inscribed onchain as immutable proof of understanding—creating Verifiable Relationship Credentials (VRCs) through demonstrated comprehension rather than surveillance.

**Why It Matters**: This is infrastructure for the relationship economy where trust comes from understanding, not data extraction.

---

## Relationship to 0xagentprivacy

```
0xagentprivacy (Broader Project)
├── Living Documentation Suite
│   ├── Whitepaper v4.3 - Architecture specification
│   ├── Research Paper v3.2 - Mathematical foundations
│   ├── Tokenomics v2.0 - Economic model
│   ├── Spellbook v4.0.1-canonical - Narrative framework
│   └── Glossary v2.1 - Canonical terminology
│
└── Implementations
    └── Proof of Proverb Revelation Protocol ← YOU ARE HERE
        └── First expression of dual-agent architecture
```

**0xagentprivacy** solves the privacy-delegation paradox: AI agents need information to act on your behalf, but that same information enables surveillance. The solution is **dual-agent architecture**—splitting observation rights (Swordsman) from action capabilities (Mage) with mathematical separation guarantees.

This hackathon implementation proves the architecture works:
- ✅ Cryptographic separation of viewing/spending keys
- ✅ Privacy-preserving AI verification
- ✅ Onchain proof inscriptions
- ✅ VRC formation through RPP compression

---

## The Dual-Agent Model

```
                    ┌─────────────────────┐
                    │    FIRST PERSON     │
                    │       (😊)          │
                    │   Human Sovereignty │
                    └─────────┬───────────┘
                              │
               Private Context (complete)
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
      ┌───────────────┐               ┌───────────────┐
      │  SWORDSMAN ⚔️  │               │    MAGE 🧙    │
      │   (Oracle)    │               │  (Frontend)   │
      │   Soulbis     │               │   Soulbae     │
      └───────────────┘               └───────────────┘
              │                               │
      Holds viewing key           Helps craft proverbs
      Verifies proverbs           Optional assistance
      Enforces boundaries         Never sees transactions
              │                               │
              └───────────────┬───────────────┘
                              │
                     THE GAP (s ⊥ m | X)
                              │
               Separation preserves sovereignty
```

**Mathematical Guarantee** [Research Paper v3.2]:
- `I(X; Y_S, Y_M) = I(X; Y_S) + I(X; Y_M)` — Information leakage is additive, not multiplicative
- `R_max < 1` — Perfect reconstruction is impossible
- The gap between agents preserves human dignity

---

## How It Works

### The Signal Flow

```
First Person reads Spellbook
         │
         ▼
    Forms proverb (RPP compression)
    Using own model/context for uniqueness
         │
         ▼
    Sends shielded z→z transaction
    Memo: [rpp-v1][act-id][timestamp][proverb]
         │
         ▼
┌─────────────────────────────────────────┐
│            ORACLE (Swordsman)           │
│                                         │
│  1. Viewing key decrypts memo           │
│  2. Fetches canonical proverb (IPFS)    │
│  3. AI verifies semantic match          │
│     (AI NEVER sees amounts/addresses)   │
│  4. Calculates golden split (61.8/38.2) │
│  5. Inscribes proof onchain            │
└─────────────────────────────────────────┘
         │
         ▼
    VRC Created (Verifiable Relationship Credential)
```

### Terminology [Glossary v2.1]

| Term | Meaning | In This Implementation |
|------|---------|----------------------|
| **Signal** | 0.01 ZEC ongoing proof of comprehension | Proverb submission fee |
| **Ceremony** | 1 ZEC one-time agent pair genesis | Not implemented (future) |
| **First Person** | Human whose sovereignty is protected | The person forming proverbs |
| **VRC** | Verifiable Relationship Credential | Onchain inscription proof |
| **RPP** | Relationship Proverb Protocol | Compression through proverbs |

---

## Current Status

### ✅ Complete

| Component | Description |
|-----------|-------------|
| **Frontend** | Next.js 16 with story reader, Mage chat, signal flow |
| **Backend** | Oracle with transaction monitoring, AI verification |
| **Blockchain** | Zebra + Zallet integration, inscription system |
| **AI Verification** | NEAR Cloud AI (privacy-preserving) |
| **Golden Split** | 61.8% transparent / 38.2% shielded |
| **Inscriptions** | Act 1 confirmed on mainnet |

### ⏸️ On Hold

| Component | Status |
|-----------|--------|
| **Nillion TEE** | Code complete, integration paused |

**Note**: Zallet doesn't support clean viewing/spending key separation. Nillion TEE integration would enable true dual-agent architecture with hardware-enforced key isolation.

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- Zebra (Zcash full node)
- Zallet (Zcash wallet)

### Setup

```bash
# Clone repository
git clone https://github.com/mitchuski/agentprivacy
cd agentprivacy_master

# Install dependencies
npm install
cd oracle-swordsman && npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Start services
npm run dev              # Frontend (port 5000)
npm run oracle           # Backend (port 3001)
```

### First Person Flow

1. Visit `/story` to read spellbook tales
2. Click "Learn" to copy content into your context
3. Form a proverb using your own model/understanding
4. Open `/mage` for optional Soulbae assistance
5. Format signal memo and copy to Zashi wallet
6. Send shielded z→z transaction (0.01 ZEC)
7. Oracle verifies and inscribes proof
8. View your VRC in `/proverbs` gallery

---

## Architecture

```
agentprivacy_zypher/
├── src/                          # Frontend (Mage interface)
│   ├── app/                      # Routes
│   │   ├── story/                # Spellbook reader
│   │   ├── mage/                 # Soulbae chat
│   │   └── proverbs/             # VRC gallery
│   ├── components/               # React components
│   └── lib/                      # Utilities
│
├── oracle-swordsman/             # Backend (Oracle)
│   ├── src/
│   │   ├── index.ts              # Main loop
│   │   ├── transaction-monitor.ts # Blockchain scanning
│   │   ├── memo-parser.ts        # Proverb extraction
│   │   ├── nearcloudai-verifier.ts # AI verification
│   │   ├── golden-split.ts       # 61.8/38.2 calculator
│   │   ├── inscription-builder.ts # Onchain inscriptions
│   │   └── signing-service.ts    # Key separation
│   └── inscribe-act*.js          # Inscription scripts
│
├── public/
│   ├── story/markdown/           # 18 Acts content
│   └── zero/markdown/            # 30 Tales content
│
└── spellbook/                    # Canonical proverbs (JSON)
```

---

## Privacy Guarantees

### Information Bounds

```
I(Soulbae; Transaction_Amount) = 0
I(Soulbae; First_Person_Identity) = 0  
I(Soulbae; Wallet_Address) = 0
I(Soulbae; Transaction_Timing) = 0
```

**Soulbae (Mage) only processes**: Tale principle → Understanding → Proverb suggestion

### What's Public vs Private

| Public (by design) | Private (guaranteed) |
|-------------------|---------------------|
| Story content | Signal amounts |
| Inscribed proverbs | Wallet addresses |
| VRC existence | First Person identity |
| TEE attestation | Transaction timing |

---

## Economic Model [Tokenomics v2.0]

### Signal Fee: 0.01 ZEC

Every signal (proverb submission) follows the golden ratio split:

```
Signal (0.01 ZEC)
├── 61.8% → Transparent Pool
│   └── Onchain inscription (public proof)
│
└── 38.2% → Shielded Pool
    └── Protocol operations (private)
```

**Why Golden Ratio**: φ ≈ 1.618 emerges as conjectured optimal balance between privacy protection and delegation capability. The 61.8/38.2 split creates natural equilibrium.

### Trust Tier Progression [Tokenomics v2.0, §5]

| Tier | Signals | Capabilities |
|------|---------|--------------|
| 🗡️ **Blade** | 0-50 | Basic participation |
| 🛡️ **Light** | 50-150 | Multi-site coordination |
| ⚔️ **Heavy** | 150-500 | Template creation |
| 🐉 **Dragon** | 500+ | Guardian eligibility |

*Note: Tier tracking not yet implemented in this version.*

---

## Document Alignment

This implementation aligns with the 0xagentprivacy living documentation:

| Document | Version | Reference |
|----------|---------|-----------|
| **Glossary** | 2.1 | Canonical terminology |
| **Whitepaper** | 4.4 | Dual-agent architecture |
| **Research Paper** | 3.2 | Mathematical foundations |
| **Tokenomics** | 2.1 | Signal economics |
| **Spellbook** | 4.0.2-canonical | Narrative framework |
| **Visual Guide** | 1.2 | Architecture diagrams |

**Citation Format**: When referencing across documents, use `[Document v#.#, §Section]`

---

## Key Innovations

### From 0xagentprivacy (implemented here)

1. **Dual-Agent Architecture**: Cryptographic separation of viewing (Swordsman) and spending (Mage) authority
2. **The Gap**: Mathematical space where reconstruction becomes impossible
3. **VRC Formation**: Bilateral trust from demonstrated understanding

### From First Person Project (credentials used)

1. **VRCs**: Verifiable Relationship Credentials
2. **7th Capital**: Behavioral data as personal wealth to reclaim

### Novel to This Implementation

1. **Proof-of-Proverb**: Understanding as cryptographic proof
2. **Golden Split Economics**: 61.8/38.2 transparent/shielded balance
3. **Human-in-the-Loop Trust**: Opening the door to agent trust

---

## Resources

### Project Links

- **Website**: [agentprivacy.ai](https://agentprivacy.ai)
- **GitHub**: [@mitchuski/agentprivacy](https://github.com/mitchuski/agentprivacy)

### Spellbook

- **Version**: 4.0.0-canonical
- **IPFS CID**: `bafkreigopjrfwjsz56oft7nmv26q2oddq6j4fexj27zjirzgkdeogm2myq`
- **Content**: 18 Acts + 30 Tales

### Collaborators

- BGIN (Blockchain Governance Initiative Network)
- Internet Identity Workshop (IIW)
- Agentic Internet Workshop (AIW)
- First Person Network
- Kwaai AI
- MyTerms / Customer Commons
- Zypherpunks

---

## The Vision

We're not building a donation button. We're building **infrastructure for the relationship economy**.

Where:
- Trust comes from understanding, not surveillance
- Relationships are bilateral, not mediated by platforms
- Reputation is earned through comprehension
- Privacy is preserved by architecture, not policy
- AI agents extend sovereignty without surrendering it

**This is the foundation for privacy-preserving AI agents.**

---

## License

CC BY-SA 4.0

---

*"The proverb is the spell. The inscription is the commitment. The bilateral exchange is the relationship."*

**⚔️ ⊥ 🧙‍♂️ | 😊**  
*Separation between Swordsman and Mage preserves the First Person*

---

**Privacy is Value. Take back the 7th Capital.**

---

## Security Documentation

- [Inscription Key Architecture](oracle-swordsman/docs/security/INSCRIPTION_KEY_ARCHITECTURE.md) - Zero-leakage key isolation design
- [Key Rotation Process](oracle-swordsman/docs/security/KEY_ROTATION_PROCESS.md) - How to safely rotate inscription keys
