# Proof of Proverb Revelation Protocol
## Evoke: The Primary Mage Interface | Zcash: The Swordsman's Shield

**Project**: 0xagentprivacy  
**Status**: ✅ Production-Ready  
**Version**: 1.0

---

> *"Privacy is my blade, knowledge is my spellbook."* (⚔️⊥🧙‍♂️)🙂

---

## Overview

The **Proof of Proverb Revelation Protocol** is the first concrete implementation of the [0xagentprivacy](https://agentprivacy.ai) dual-agent architecture. It demonstrates privacy-preserving AI interaction through **Evoke**—the primary Mage interface where First Persons form proverbs with Soulbae's assistance—protected by **Zcash**—the Swordsman's infrastructure that verifies and inscribes proofs onchain.

**What It Does**: First Persons interact with **Soulbae (the Mage)** through the **Evoke interface** (`/evoke`) to form proverbs that express their understanding of privacy concepts. These proverbs are then protected and verified by **Zcash (the Swordsman)**—inscribed onchain as immutable proof of understanding, creating Verifiable Relationship Credentials (VRCs) through demonstrated comprehension rather than surveillance.

**Why It Matters**: This is infrastructure for the relationship economy where trust comes from understanding, not data extraction. The Mage (Evoke) enables comprehension; the Swordsman (Zcash) protects the spell.

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
      │    Zcash      │               │    Evoke      │
      │  (Protection) │               │  (Primary)    │
      │   Soulbis     │               │   Soulbae     │
      └───────────────┘               └───────────────┘
              │                               │
      Protects the spell        Primary interaction
      Verifies proverbs         Forms proverbs
      Inscribes onchain         AI assistance
      Enforces boundaries       Never sees transactions
              │                               │
              └───────────────┬───────────────┘
                              │
                     THE GAP (s ⊥ m | X)
                              │
               Separation preserves sovereignty
```

**The Architecture**:
- **Mage (Evoke)**: The primary interface where First Persons interact with Soulbae to form proverbs. This is where understanding happens, where the spell is crafted.
- **Swordsman (Zcash)**: The protection layer that verifies proverbs, inscribes them onchain, and enforces boundaries. The Swordsman protects what the Mage creates.

**Mathematical Guarantee** [Research Paper v3.2]:
- `I(X; Y_S, Y_M) = I(X; Y_S) + I(X; Y_M)` — Information leakage is additive, not multiplicative
- `R_max < 1` — Perfect reconstruction is impossible
- The gap between agents preserves human dignity

---

## How It Works

### The Flow: Evoke → Zcash Protection

```
First Person visits /evoke
         │
         ▼
    Interacts with Soulbae (Mage)
    Reads spellbook content
    Forms proverb with AI assistance
         │
         ▼
┌─────────────────────────────────────────┐
│         EVOKE (Mage Interface)          │
│                                         │
│  • Primary interaction with Soulbae    │
│  • Context-aware AI assistance          │
│  • Proverb formation and refinement    │
│  • Privacy-preserving: no transaction  │
│    data, no wallet addresses            │
└─────────────────────────────────────────┘
         │
         ▼
    Proverb ready for protection
         │
         ▼
    Sends shielded z→z transaction
    Memo: [rpp-v1][act-id][timestamp][proverb]
         │
         ▼
┌─────────────────────────────────────────┐
│      ZCASH (Swordsman Protection)        │
│                                         │
│  1. Viewing key decrypts memo           │
│  2. Fetches canonical proverb (IPFS)    │
│  3. AI verifies semantic match          │
│     (AI NEVER sees amounts/addresses)   │
│  4. Calculates golden split (61.8/38.2) │
│  5. Inscribes proof onchain            │
│                                         │
│  The Swordsman protects the spell       │
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
| **Evoke Interface** | Primary Mage interaction—Soulbae AI assistance for proverb formation |
| **Zcash Protection** | Swordsman infrastructure—verifies and inscribes proverbs onchain |
| **Frontend** | Next.js 16 with story reader, Evoke interface, spellbook navigation |
| **Backend** | Oracle with transaction monitoring, AI verification |
| **Blockchain** | Zebra + Zallet integration, inscription system |
| **AI Verification** | NEAR Cloud AI (privacy-preserving) |
| **Golden Split** | 61.8% transparent / 38.2% shielded |
| **Inscriptions** | Acts 1-12 confirmed on mainnet |

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

1. **Visit Evoke**: Go to `/evoke`—the primary Mage interface for interacting with Soulbae
2. **Read Spellbook**: Browse spellbook content from any of the 5 grimoires
3. **Interact with Soulbae**: Use the Mage panel to get context-aware AI assistance
4. **Form Proverb**: Create a proverb connecting your understanding to the tale with Soulbae's help
5. **Protect the Spell**: When ready, format your proverb for protection:
   - Spellbook type (Story, Zero, Canon, Society, Plurality)
   - Act/Tale/Chapter number
   - Your proverb
   - Spellemoji (auto-generated)
6. **Swordsman Protection**: Send shielded z→z transaction (0.01 ZEC) to Zcash—the Swordsman protects your spell
7. **Verification**: Zcash (Swordsman) verifies proverb and inscribes proof onchain
8. **View VRC**: See your Verifiable Relationship Credential in `/proverbs` gallery

**Key Point**: Evoke is where you interact with the Mage; Zcash is where the Swordsman protects what you create.

---

## Website Structure & Routes

The website is a Next.js application with the following main routes:

| Route | Description | Content |
|-------|-------------|---------|
| `/` | Landing page | Introduction to the protocol |
| `/story` | Story Spellbook | 18 Acts of narrative tales about privacy and sovereignty |
| `/zero` | Zero Knowledge Spellbook | 30 Tales teaching cryptographic concepts |
| `/canon` | Canon Spellbook | 10 Chapters of blockchain history from cypherpunks to present |
| `/society` | Society/Parallel Spellbook | 17 Chapters on parallel society and network states |
| `/plurality` | Plurality Spellbook | 30 Acts on collective intelligence and coordination |
| `/privacy` | Privacy page | Privacy policy and information |
| `/evoke` | **Evoke (Primary Mage Interface)** | Primary interaction with Soulbae—form proverbs with AI assistance |
| `/mage` | Mage Interface | Alternative Soulbae chat interface with context-aware responses |
| `/proverbs` | Proverbs Gallery | Onchain inscription viewer (VRC gallery) |
| `/the-first` | The First | Coming soon page |

### Spellbook Mapping

The website hosts **5 complete spellbooks** (grimoires):

1. **Story Spellbook** (`/story`) - 18 Acts
   - Narrative tales about privacy, sovereignty, and the dual-agent architecture
   - Acts 1-12 inscribed on Zcash mainnet

2. **Zero Knowledge Spellbook** (`/zero`) - 30 Tales
   - Mathematical foundations of zero-knowledge proofs
   - Cryptographic concepts explained through stories

3. **Canon Spellbook** (`/canon`) - 10 Chapters
   - Blockchain history and lineage from cypherpunks to present
   - The "why" behind privacy-preserving architecture

4. **Society/Parallel Spellbook** (`/society`) - 17 Chapters
   - Parallel society, network states, and alternative governance structures

5. **Plurality Spellbook** (`/plurality`) - 30 Acts
   - Collective intelligence, coordination mechanisms, and digital democracy

### Evoke: Primary Mage Interface (`/evoke`)

**Evoke** is the primary Mage interface where First Persons interact with Soulbae:
- **Primary Interaction**: Evoke is where you form proverbs with Soulbae's assistance
- **Stream Interface**: View the stream of proverbs from the community
- **Context-Aware**: Automatically detects which spellbook/tale/chapter you're viewing
- **Proverb Formation**: Get AI assistance in crafting your understanding into proverbs
- **Privacy-Preserving**: Never sees transaction data or wallet addresses
- **Privacy Budget**: 6 queries per session to prevent over-reliance

### Mage Interface (`/mage`)

The `/mage` route provides an alternative interface for Soulbae interactions:
- Context-aware AI assistance across all spellbooks
- Proverb suggestions and refinement
- Integration with spellbook reading pages

---

## Architecture

```
agentprivacy_master/
├── src/                          # Frontend (Next.js 16)
│   ├── app/                      # Routes
│   │   ├── page.tsx              # Landing page (/)
│   │   ├── story/                # Story Spellbook reader (/story)
│   │   ├── zero/                 # Zero Knowledge Spellbook (/zero)
│   │   ├── canon/                # Canon Spellbook (/canon)
│   │   ├── society/              # Society Spellbook (/society)
│   │   ├── plurality/            # Plurality Spellbook (/plurality)
│   │   ├── evoke/                # Evoke: Primary Mage interface (/evoke)
│   │   ├── mage/                 # Alternative Soulbae chat interface (/mage)
│   │   ├── proverbs/             # VRC gallery (/proverbs)
│   │   └── privacy/              # Privacy page (/privacy)
│   ├── components/               # React components
│   │   ├── MagePanel.tsx         # Mage chat panel
│   │   ├── SwordsmanPanel.tsx    # Donation flow
│   │   ├── UAddressDisplay.tsx   # Unified address display
│   │   └── ...
│   └── lib/                      # Utilities
│       ├── soulbae.ts            # NEAR AI integration
│       ├── zcash-memo.ts         # Memo formatting
│       └── ...
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
│   ├── zero/markdown/            # 30 Tales content
│   ├── canon/markdown/           # 10 Chapters content
│   ├── society/markdown/         # 17 Chapters content
│   └── plurality/markdown/       # 30 Acts content
│
├── spellbook/                    # Canonical proverbs (JSON)
│   └── spellbook-acts.json       # Complete spellbook data
│
└── archive/                      # Historical documentation
    ├── merge-docs/               # Completed merge documentation
    ├── integration-docs/          # Completed integration checklists
    └── ...
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

**Soulbae (Mage/Evoke) only processes**: Tale principle → Understanding → Proverb suggestion

**Zcash (Swordsman) protects**: Proverb verification → Onchain inscription → VRC creation

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

### Spellbooks

- **Story Spellbook**: 18 Acts (narrative tales)
- **Zero Knowledge Spellbook**: 30 Tales (cryptographic concepts)
- **Canon Spellbook**: 10 Chapters (blockchain history)
- **Society/Parallel Spellbook**: 17 Chapters (network states)
- **Plurality Spellbook**: 30 Acts (collective intelligence)
- **Total**: 105 spellbook entries across 5 grimoires

### Collaborators

- BGIN (Blockchain Governance Initiative Network)
- Internet Identity Workshop (IIW)
- Agentic Internet Workshop (AIW)
- First Person Network
- Kwaai AI
- MyTerms / Customer Commons

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
