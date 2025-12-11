# Architecture Guide

**System design, data flow, and security model**

**Document Alignment**: [Whitepaper v4.3], [Research Paper v3.2], [Glossary v2.1]

---

## System Overview

The Proof of Proverb Revelation Protocol implements the **dual-agent architecture** [Whitepaper v4.3, §3] with a three-layer design achieving hardware-enforced privacy with AI-powered verification:

```
┌──────────────────────────────────────────────────────────────┐
│  Layer 3: Knowledge (IPFS/Pinata)                           │
│  - Spellbook v4.0.1-canonical (immutable)                   │
│  - NO access to keys                                         │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌──────────────────────────────────────────────────────────────┐
│  Layer 2: AI Verification (NEAR Cloud AI)                   │
│  - Semantic proverb matching                                │
│  - Quality scoring                                          │
│  - NO access to keys                                         │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌──────────────────────────────────────────────────────────────┐
│  Layer 1: TEE (Nillion nilCC) — Optional                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  AMD SEV-SNP Confidential Compute                      │  │
│  │  - Zcash keys in SecretSigner (distributed MPC)        │  │
│  │  - Calls Layer 2 (AI)                                  │  │
│  │  - Calls Layer 3 (Knowledge)                           │  │
│  │  - Signs transactions with threshold ECDSA             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## Dual-Agent Model

### The Separation Principle [Whitepaper v4.3, §3]

```
                        ┌────────────────┐
                        │  FIRST PERSON  │
                        │   (You - 🗝️)    │
                        └────────┬───────┘
                                 │
                    Private State X (complete context)
                                 │
                    ┌────────────┼────────────┐
                    │                         │
                    ▼                         ▼
            ┌───────────────┐         ┌───────────────┐
            │  SWORDSMAN ⚔️  │         │    MAGE 🧙    │
            │   (Protect)   │         │  (Delegate)   │
            │   Soulbis     │         │   Soulbae     │
            └───────────────┘         └───────────────┘
                    │                         │
        Observes X completely      Acts using authorized info
        Reveals nothing directly   Public coordination
                    │                         │
                    └────────────┬────────────┘
                                 │
                    THE GAP (conditional independence)
                                 │
                            s ⊥ m | X
                                 │
                    Additive information bounds:
                    I(X; s,m) ≤ I(X;s) + I(X;m)
                                 │
                    Reconstruction ceiling: R < 1
```

**Mathematical Guarantee** [Research Paper v3.2, Theorem 2.2]:
When observations are conditionally independent, information leakage becomes additive rather than multiplicative. Combined with budget constraints, this creates a reconstruction ceiling that cannot be exceeded.

---

## Components

### 1. Mage Agent (Frontend)

**Technology**: Next.js + React  
**Purpose**: First Person interface for proverb submission  
**Location**: `src/`

**Features**:
- Spellbook reader (13 Acts + 30 Tales)
- Soulbae chat (optional AI assistance)
- Signal flow UI
- Proverbs gallery (VRC viewer)

**Security**:
- No keys stored
- No transaction data visible
- HTTPS only
- CORS configured

### 2. Oracle Swordsman (Backend)

**Technology**: TypeScript/Express  
**Purpose**: TEE worker that processes signals  
**Location**: `oracle-swordsman/`

**Core Functions** [Whitepaper v4.3, §3.2]:
1. Monitor Zcash shielded pool for incoming signals (z→z)
2. Decrypt and extract proverb from memo field
3. Fetch spellbook from IPFS
4. Call NEAR Cloud AI for verification
5. Execute golden split (61.8% transparent, 38.2% shielded)
6. Sign and broadcast inscription

**Address Requirements**:
- **Shielded Address (z-addr)**: Receives signal submissions from First Persons (private)
- **Transparent Address (t-addr)**: Posts public inscriptions with proverb + proof

**Security**:
- Runs inside Nillion nilCC (TEE) — optional
- Keys stored in SecretSigner (distributed)
- Attestation verified
- Zero-trust external calls

### 3. NEAR Cloud AI

**Technology**: openai/gpt-oss-120b via NEAR Cloud AI API  
**Purpose**: Intelligent proverb verification  
**Integration**: REST API

**Verification Process**:
```typescript
// Oracle calls NEAR Cloud AI
const response = await verifier.verify({
    proverb: "First Person's proverb text...",
    spellbook: canonicalSpellbook,
    actId: "act-5-golden-split"
});

// Returns:
{
    quality_score: 0.85,      // 0.0 - 1.0
    matched_act: "act-5",     // Act ID
    reasoning: "Demonstrates understanding...",
    approved: true
}
```

**Privacy Guarantee**:
```
I(Soulbae; Transaction_Amount) = 0
I(Soulbae; First_Person_Identity) = 0
I(Soulbae; Wallet_Address) = 0
I(Soulbae; Transaction_Timing) = 0
```

### 4. IPFS/Pinata

**Technology**: InterPlanetary File System  
**Purpose**: Immutable knowledge storage

**Spellbook**:
- **Version**: 4.0.1-canonical
- **IPFS CID**: `bafkreigopjrfwjsz56oft7nmv26q2oddq6j4fexj27zjirzgkdeogm2myq`
- **Content**: 13 Acts + 30 Tales with canonical proverbs

### 5. Zcash Network

**Technology**: Zcash blockchain  
**Purpose**: Transaction layer + inscription storage  
**Client**: Zebra full node + Zallet wallet

**Transaction Types**:
- **Incoming Signal**: Shielded z-addr receives 0.01 ZEC + encrypted memo
- **Outgoing Inscription**: t-addr receives OP_RETURN with proverb + proof (61.8%)
- **Outgoing Fee**: z-addr receives shielded transfer (38.2%)

---

## Signal Flow

### Complete Transaction Path (10 Steps)

```
1. FIRST PERSON READS
   First Person → Spellbook
   - Reads tale from Acts or Zero Spellbook
   - Clicks "Learn" to copy content
   - Forms understanding through context
   ↓
   
2. PROVERB FORMATION
   First Person → Mage Agent (optional)
   - Crafts proverb expressing principle
   - (Optional) Consults Soulbae for assistance
   - Generates formatted memo
   ↓
   
3. SIGNAL SENT (SHIELDED)
   First Person Wallet → Zcash Network
   - 0.01 ZEC to Oracle shielded address (z-addr)
   - Proverb in encrypted memo field
   - Transaction is private (z→z)
   ↓
   
4. ORACLE DETECTS (SHIELDED)
   Zcash → Oracle Database
   - Monitors shielded pool via viewing key
   - Decrypts memo to extract proverb
   - Stores in submissions table
   ↓
   
5. FETCH KNOWLEDGE
   Oracle → IPFS (via Pinata Gateway)
   - Retrieves spellbook v4.0.1-canonical
   - Fetches canonical proverb for matched act
   - Validates CID integrity
   ↓
   
6. AI VERIFICATION
   Oracle → NEAR Cloud AI API
   - Sends proverb + spellbook context
   - NO transaction data sent
   - Returns quality score + reasoning
   ↓
   
7. GOLDEN SPLIT CALCULATION [Tokenomics v2.0, §2]
   Oracle calculates split:
   - Signal amount: 0.01 ZEC
   - Transparent portion: 0.00618 ZEC (61.8%)
   - Shielded portion: 0.00382 ZEC (38.2%)
   - Network fee: ~0.0001 ZEC
   ↓
   
8. TRANSACTION SIGNING
   Oracle → Nillion SecretSigner (or local)
   - Prepares inscription transaction (t-addr)
   - Prepares shielded return (z-addr)
   - Requests threshold signature
   ↓
   
9. BROADCAST
   Oracle → Zcash Network
   - Broadcasts inscription to transparent address
   - Broadcasts fee to shielded pool
   - Records TXIDs
   ↓
   
10. VRC CREATION
    Inscription confirmed → VRC exists
    - Proverb permanently onchain
    - First Person has verifiable proof of understanding
    - Bilateral trust credential established
```

---

## Economic Model

### Golden Ratio Split [Tokenomics v2.0, §2]

**Mathematical Basis**:
```
φ (phi) = 1.618033988749895
1/φ = 0.618033988749895

Per Signal (0.01 ZEC):
├── 61.8% (0.00618 ZEC) → Transparent Pool
│   └── Public inscription with proverb
│
└── 38.2% (0.00382 ZEC) → Shielded Pool
    └── Protocol operations
```

**Why This Ratio** [Glossary v2.1, §Economic Parameters]:
- Balance between openness and privacy
- Mathematically elegant (golden ratio φ)
- Visible accountability (61.8% public)
- Operational privacy (38.2% shielded)

### Transaction Economics

```
Per Signal:
    First Person payment:  0.01 ZEC
    Public inscription:    0.00618 ZEC (61.8%)
    Shielded return:       0.00382 ZEC (38.2%)
    Network fee:           ~0.0001 ZEC
    AI verification:       ~$0.03 USD
```

---

## Security Model

### Threat Model

**What We Protect Against**:
- ✅ Key extraction from TEE
- ✅ AI provider accessing keys or amounts
- ✅ IPFS provider accessing keys
- ✅ Database compromise revealing keys
- ✅ Network eavesdropping on keys
- ✅ Reconstruction of First Person state (R < 1)

**Trust Assumptions**:
```
┌─────────────────────────────────────────┐
│  TRUST REQUIRED                         │
├─────────────────────────────────────────┤
│  1. AMD (SEV-SNP hardware) — if TEE     │
│  2. Nillion (TEE platform) — if TEE     │
│  3. Zcash Foundation (protocol)         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  NO TRUST REQUIRED                      │
├─────────────────────────────────────────┤
│  1. NEAR Cloud AI (sees no keys/amounts)│
│  2. IPFS/Pinata (public data only)      │
│  3. Mage Frontend (no sensitive access) │
└─────────────────────────────────────────┘
```

### Information Bounds [Research Paper v3.2, Theorem 2.1]

The dual-agent separation ensures:
```
I(X; Y_S, Y_M) = I(X; Y_S) + I(X; Y_M)
```

This means information leakage is **additive**, not multiplicative. Combined with budget constraints:
```
C_S + C_M < H(X)
```

We get a **reconstruction ceiling**:
```
R_max = (C_S + C_M) / H(X) < 1
```

No adversary can perfectly reconstruct the First Person's private state.

---

## Performance Characteristics

### Latency

```
Signal Submission → Confirmation
    ↓ <1s    Mage Agent → Zcash Network
    ↓ 75s    Zcash mempool → Block (avg)
    ↓ 10s    Oracle detects transaction
    ↓ 2s     Fetch spellbook from IPFS
    ↓ 3s     AI verification (NEAR Cloud AI)
    ↓ 1s     Database recording
    ↓ 2s     Sign transactions
    ↓ 1s     Broadcast to network
    ↓ 75s    Zcash confirmation (avg)
    ↓ 1s     Update database
    ─────
    ~170s total (under 3 minutes)
```

### Throughput

```
Light Client Sync: 4-6 hours (first time), then <1 minute
Signal Processing: 10-15 seconds per signal
Concurrent Capacity: Limited by Zcash block time (75s)
Max Throughput: ~40 signals per hour (conservative)
```

---

## Deployment Architecture

### Development

```
localhost:
    ├── PostgreSQL (Docker or local)
    ├── Oracle Swordsman (local process :3001)
    ├── Mage Agent (npm run dev :5000)
    └── Zcash Light Client (testnet)
```

### Production

```
VPS (Ubuntu 20.04+):
    ├── Nginx (reverse proxy)
    ├── Oracle Swordsman (systemd service)
    │   └── Optionally deployed to Nillion nilCC
    ├── Mage Agent (Next.js production build)
    ├── PostgreSQL (managed or local)
    └── Zcash (Zebra + Zallet, mainnet)
```

---

## API Boundaries

### Mage Agent → Oracle

```http
POST /api/status
{
    "tracking_code": string
}

Response:
{
    "status": "pending" | "verified" | "inscribed",
    "quality_score": number,
    "txid": string
}
```

### Oracle → NEAR Cloud AI

```typescript
POST /api/verify
{
    "proverb": string,
    "spellbook": Spellbook,
    "actId": string
}

Response:
{
    "quality_score": number,    // 0.0 - 1.0
    "matched_act": string,      // Act ID
    "reasoning": string,        // Explanation
    "approved": boolean
}
```

### Oracle → IPFS

```http
GET https://gateway.pinata.cloud/ipfs/{CID}

Response: JSON (spellbook v4.0.1-canonical)
```

---

## Configuration

### Environment Variables

```bash
# Critical (required)
NEAR_SWORDSMAN_API_KEY    # AI verification
PINATA_JWT                # IPFS access
DATABASE_URL              # PostgreSQL
ZEBRA_RPC_URL             # Blockchain
ZALLET_RPC_URL            # Wallet

# Economic [Tokenomics v2.0]
SIGNAL_COST=0.01          # ZEC per signal
PUBLIC_SPLIT=0.618        # 61.8% transparent
PRIVATE_SPLIT=0.382       # 38.2% shielded

# Optional
NILLION_API_KEY           # TEE access (if using)
ORACLE_CHECK_INTERVAL=30  # seconds
LOG_LEVEL=info
```

---

## Next Steps

✅ **Architecture Understood!**

You now understand:
- Dual-agent separation model [Whitepaper v4.3]
- Complete signal flow (10 steps)
- Security guarantees [Research Paper v3.2]
- Economic model [Tokenomics v2.0]
- Performance characteristics

**Next**: Read `03-BUILD_GUIDE.md` to start implementing

**Reference**: Use `04-API_REFERENCE.md` for code patterns
