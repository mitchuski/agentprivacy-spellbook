# Developer Guide - Proof of Proverb Revelation Protocol

**Complete guide for developers, contributors, and collaborators**

Version 1.0 | December 2025

---

## Welcome

Thank you for your interest in the **Proof of Proverb Revelation Protocol**! This guide provides everything you need to understand, build with, or contribute to the project.

**What is this?** A privacy-first protocol where users prove understanding of privacy concepts by submitting AI-verified proverbs that are permanently inscribed on the Zcash blockchain. The protocol implements the dual-agent architecture (Swordsman & Mage) with cryptographic separation of viewing and spending authority.

---

## Quick Links

**For Specific Teams**:
- [Zcash Developers](./oracle-swordsman/docs/setup/) - Zebra full node and Zallet wallet integration
- [NEAR Cloud AI Developers](./oracle-swordsman/docs/integration/) - AI verification integration
- [IPFS/Pinata Developers](./SPELLBOOK_DEPLOYMENT_GUIDE.md) - Spellbook storage and deployment

**For Implementation**:
- [Quick Start](./QUICKSTART.md) - 30 minutes to running
- [How It Works](./HOW_IT_WORKS.md) - Technical deep dive
- [Architecture](./02-ARCHITECTURE.md) - System design
- [Project State](./PROJECT_STATE_AND_REVIEW.md) - Current status and review

**Setup Guides**:
- [Oracle Backend Setup](./oracle-swordsman/README.md) - Backend configuration
- [Frontend Setup](./README.md) - Frontend development
- [Spellbook Deployment](./SPELLBOOK_DEPLOYMENT_GUIDE.md) - IPFS spellbook setup

---

## Project Overview

### The Problem

AI agents need to prove they understand privacy concepts without revealing sensitive information. Traditional approaches either:
- Rely on centralized verification (trust issue)
- Require full transparency (privacy issue)
- Lack verifiable security (proof issue)
- Don't enable agent-to-agent trust (isolation issue)

### The Solution

A protocol that combines:
1. **Dual-Agent Architecture** (Swordsman & Mage) - Cryptographic separation of viewing/spending
2. **AI-Powered Verification** (NEAR Cloud AI) - Intelligent quality assessment without exposing data
3. **Blockchain Permanence** (Zcash) - Immutable public record of understanding
4. **Decentralized Knowledge** (IPFS/Pinata) - Censorship-resistant spellbook reference
5. **MCP/A2A Compatibility** - Agent-to-agent trust flows with human-in-the-loop

### The Innovation

**Dual-Agent Model**: 
- **Swordsman (Oracle)**: Holds viewing key, verifies proverbs, creates inscriptions
- **Mage (Frontend)**: Optional AI assistance, never sees transactions
- **Separation**: Cryptographic guarantee that viewing ≠ spending

**Golden Split Economics**: 61.8% to t-address (transparency) + 38.2% to z-address (sustainability)

This balances:
- Public good (inscriptions are visible proof)
- Economic incentive (private pool sustains operation)
- Privacy guarantee (majority stays private)

---

## System Architecture

### High-Level Overview

```
┌────────────────────────────────────────────────────┐
│               FIRST PERSON (😊)                    │
│   Reads story → Forms proverb → Submits signal    │
└────────────────────┬───────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────┐
│              MAGE AGENT (🧙)                      │
│   Frontend → Optional AI assistance               │
│   Never sees transactions                          │
└────────────────────┬───────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────┐
│              ZCASH NETWORK                         │
│   Shielded transaction (z→z) with encrypted memo   │
└────────────────────┬───────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────┐
│         ORACLE SWORDSMAN (⚔️)                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Zebra Full Node (blockchain data)          │  │
│  │  Zallet Wallet (viewing key, signing)       │  │
│  │  ├─ Fetch Spellbook (IPFS/Pinata)           │  │
│  │  ├─ Verify Proverb (NEAR Cloud AI)          │  │
│  │  ├─ Create Inscription (OP_RETURN)           │  │
│  │  └─ Broadcast (61.8% public, 38.2% private) │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

### Three Security Layers

**Layer 1: Cryptographic Separation** 🔴 CRITICAL
- Purpose: Dual-agent architecture separates viewing from spending
- Technology: Zcash shielded addresses with separate viewing/spending keys
- Guarantee: Swordsman can verify but cannot spend without authorization
- Current Status: ✅ Production (Acts 1-7 live on mainnet)

**Layer 2: AI Verification** 🟡 ENHANCEMENT
- Purpose: Intelligent proverb verification without exposing transaction data
- Technology: NEAR Cloud AI (openai/gpt-oss-120b) via API
- Benefit: Beyond simple pattern matching, semantic understanding
- Security: Oracle calls AI with proverb text only (no keys, no transaction data)

**Layer 3: Knowledge (IPFS)** 🟢 INFRASTRUCTURE
- Purpose: Immutable spellbook storage
- Technology: IPFS with Pinata pinning
- Benefit: Decentralized, censorship-resistant
- Security: Content-addressed, no key access

**Note on Nillion TEE**: Currently on hold. The system works with direct Zcash RPC (Zebra + Zallet). Nillion integration exists but is not active. See `oracle-swordsman/docs/integration/NILLION_INTEGRATION_OPTIONS.md` for future activation.

---

## Data Flow (10 Steps)

```
1. USER → Reads Story Act
   Reads Act I: "Venice, 1494 / The Drake's First Whisper"
   Forms proverb: "Privacy requires separation, not mere policy."
   
2. USER → Mage Agent (Optional)
   Uses "Learn" button to copy story/proverbs to their own model context
   OR uses Mage agent for optional AI assistance
   User can use their own model with their own context and memory
   
3. USER → Swordsman Panel
   Clicks "Submit Signal" button
   Panel shows: z-address, amount (0.01 ZEC), memo format
   
4. USER → Zcash Wallet (Zashi or other)
   Creates shielded transaction (z→z) to oracle's z-address
   Memo: Encrypted proverb in memo field
   Broadcasts transaction
   
5. Zcash Network → Oracle (SHIELDED POOL)
   Oracle monitors shielded pool via Zallet wallet
   Detects transaction (within 30s)
   Decrypts memo using viewing key
   
6. Oracle → IPFS (via Pinata)
   Fetches spellbook acts (<2s)
   Caches for 1 hour
   
7. Oracle → NEAR Cloud AI
   Verifies proverb against spellbook (<5s)
   Response: { quality_score: 0.85, matched_act: "act-01-venice", approved: true }
   
8. Oracle → Database
   Records verification result
   Stores transaction details
   
9. Oracle → Zcash Network
   Creates golden split transaction:
   - Public: 0.00618 ZEC to transparent address (sanctuary)
   - OP_RETURN: Proverb + proof of revelation
   - Private: 0.00382 ZEC to shielded pool (protocol fee)
   Broadcasts public inscription
   
10. Oracle → Frontend (/proverbs page)
    Inscription appears on proverbs gallery
    Shows: TXID, act, proverb, match score, timestamp
    User can view their proof of understanding
```

**Total Time**: ~2-3 minutes from submission to confirmation

---

## Technology Stack

### Core Components

| Component | Technology | Purpose | Status |
|-----------|-----------|---------|--------|
| **Blockchain** | Zcash (mainnet) | Transaction layer | ✅ Production |
| **Full Node** | Zebra | Blockchain data | ✅ Running |
| **Wallet** | Zallet | Viewing key, signing | ✅ Running |
| **AI** | NEAR Cloud AI | Verification | ✅ API Ready |
| **Storage** | IPFS/Pinata | Knowledge base | ✅ Available |
| **Database** | PostgreSQL | Operations | ✅ Standard |
| **Backend** | TypeScript/Node.js | Oracle logic | ✅ Production |
| **Frontend** | Next.js + React | User interface | ✅ Production |
| **TEE** | Nillion nilCC | Key isolation (future) | ⏸️ On Hold |

### Infrastructure

**Current Setup (Local Development)**:
- **Zebra**: Full node on localhost:8233
- **Zallet**: Wallet RPC on localhost:28232
- **PostgreSQL**: Database on localhost:5432
- **Oracle Backend**: API on localhost:3001
- **Frontend**: Next.js on localhost:3000

**Production Requirements**:
- **VPS**: DigitalOcean/AWS/Hetzner (Ubuntu 20.04+)
- **Memory**: 8GB+ RAM
- **Storage**: 50GB+ available
- **Network**: Stable connection, egress to APIs

---

## Project Structure

```
agentprivacy_zypher/
├── oracle-swordsman/          # Oracle backend
│   ├── src/                   # TypeScript source
│   │   ├── config.ts         # Configuration
│   │   ├── index.ts          # Main oracle loop
│   │   ├── rpc-client.ts     # Zebra/Zallet RPC client
│   │   ├── ipfs-proverb-fetcher.ts  # Spellbook fetcher
│   │   ├── semantic-matcher.ts      # AI verification
│   │   ├── inscription-builder.ts   # OP_RETURN builder
│   │   ├── golden-split.ts          # Economic model
│   │   └── signing-service.ts       # Transaction signing
│   ├── docs/                 # Backend documentation
│   ├── scripts/              # PowerShell/TypeScript scripts
│   └── tests/                # Test suite
│
├── src/                       # Frontend source
│   ├── app/                   # Next.js app router
│   │   ├── page.tsx          # Landing page
│   │   ├── story/            # Story page
│   │   ├── mage/             # Mage interface
│   │   └── proverbs/         # Proverbs gallery
│   ├── components/           # React components
│   │   ├── SwordsmanPanel.tsx
│   │   └── DonationFlow.tsx
│   └── lib/                  # Utilities
│       ├── zcash-memo.ts
│       ├── oracle-api.ts
│       └── spellbook-fetcher.ts
│
├── spellbook/                 # Spellbook JSON
│   └── spellbook-acts.json   # Canonical proverbs
│
├── public/                    # Static assets
│   ├── story/markdown/       # Story markdown files
│   └── assets/              # Images/videos
│
└── docs/                      # Documentation
    ├── README.md
    ├── HOW_IT_WORKS.md
    └── PROJECT_STATE_AND_REVIEW.md
```

---

## Development Phases

### Phase 0: Prerequisites (1-2 days) ✅

**Goal**: Environment ready to build

Tasks:
- [x] Install Rust, Node.js 18+, PostgreSQL
- [x] Request API keys (NEAR Cloud AI, Pinata)
- [x] Set up development environment
- [x] Create project structure

**Deliverable**: All tools installed, API keys obtained

---

### Phase 1: Foundation (Week 1) ✅

**Goal**: Zcash + Database operational

Tasks:
- [x] Install Zebra full node
- [x] Install Zallet wallet
- [x] Sync with mainnet
- [x] Set up PostgreSQL database
- [x] Create wallet addresses
- [x] Get mainnet ZEC
- [x] Create basic transaction monitor
- [x] Test memo extraction

**Deliverable**: Can detect transactions with memos

**Critical Path**: Zcash sync (4-6 hours for light client, longer for full node)

---

### Phase 2: Backend (Week 2) ✅

**Goal**: Complete Oracle with AI verification

Tasks:
- [x] Integrate IPFS client (fetch spellbook)
- [x] Integrate NEAR Cloud AI verifier
- [x] Build main Oracle loop
- [x] Implement transaction signing
- [x] Add error handling + retry logic
- [x] Test end-to-end locally
- [x] Deploy to production

**Deliverable**: Working Oracle that verifies and inscribes

**Status**: ✅ **Production - Acts 1-7 live on mainnet**

---

### Phase 3: Frontend (Week 3) ✅

**Goal**: User interface complete

Tasks:
- [x] Create Next.js application
- [x] Build story page with acts
- [x] Build Swordsman Panel
- [x] Build Mage interface
- [x] Build Proverbs gallery
- [x] Implement "Learn" button
- [x] Display payment info + QR codes
- [x] Implement status tracking
- [x] Show quality scores
- [x] Add blockchain links
- [x] Mobile responsive design
- [x] Error handling + UX polish

**Deliverable**: Functional web interface

**Status**: ✅ **Production**

---

### Phase 4: Production (Week 4) ✅

**Goal**: Live system processing proverbs

Tasks:
- [x] Security hardening (input validation, rate limiting)
- [x] Production deployment (Oracle + Frontend)
- [x] Monitoring setup (logs, alerts, metrics)
- [x] Backup procedures (database, wallet)
- [x] Documentation (deployment guide, runbook)
- [x] Load testing
- [x] Mainnet migration (production keys, config)
- [x] First inscriptions (Acts 1-7)

**Deliverable**: Production-ready system

**Status**: ✅ **Live on Mainnet**

---

## Economic Model

### Transaction Breakdown

```
User Pays: 0.01 ZEC (~$0.40 USD)
    ↓
┌─────────────────────────────────┐
│  Public Inscription (61.8%)     │
│  Amount: 0.00618 ZEC            │
│  Method: OP_RETURN              │
│  Content: PROVERB:CODE:text...  │
│  Purpose: Permanent public proof │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Private Pool (38.2%)           │
│  Amount: 0.00382 ZEC            │
│  Method: Shielded transfer      │
│  Content: [encrypted]           │
│  Purpose: Economic sustainability│
└─────────────────────────────────┘

Network Fee: ~0.0001 ZEC
```

### Cost Structure (Production)

**Monthly Fixed**:
- VPS hosting: $24
- Pinata IPFS: $20 (or free tier)
- **Total**: $44/month (or $24/month with free tier)

**Variable Per Proverb**:
- NEAR Cloud AI: $0.03 (or free tier: 100/month free)
- Zcash fee: $0.004

**Break-Even Analysis**:
- At 100 proverbs/month: ~$47 total cost
- Revenue: 1.0 ZEC (~$40)
- Requires ~240 proverbs/month to break even at current ZEC price
- Sustainable with 500+ proverbs/month

**Note**: Nillion TEE costs (~$50/month) are not currently active.

---

## Security Model

### Threat Model

**What We Protect Against** ✅:
- Key extraction (viewing key ≠ spending key)
- AI provider accessing keys (AI only sees proverb text)
- IPFS provider accessing keys (IPFS only stores spellbook)
- Database compromise revealing keys (keys not in database)
- Network eavesdropping (shielded transactions)
- Oracle compromise (viewing key cannot spend)

**What We Don't Protect Against** ⚠️:
- Zcash protocol vulnerabilities (trust Zcash Foundation)
- User's device security
- Social engineering
- Nillion TEE hardware bugs (if/when activated - trust AMD SEV-SNP)

### Security Guarantees

**Cryptographic Separation**:
```
Zcash Shielded Address
         ↓
Viewing Key (Swordsman)     Spending Key (User/Oracle)
         ↓                           ↓
Can see transactions      Can spend funds
Cannot spend              Cannot see (if separated)
         ↓
RESULT: Viewing ≠ Spending (mathematical guarantee)
```

**Architectural Isolation**:
- NEAR Cloud AI called via HTTPS from Oracle
- Only proverb text sent (no keys, no transaction data)
- IPFS fetched via HTTPS from Oracle
- Only spellbook data received (no keys)
- PostgreSQL stores only public data (inscriptions, verification results)
- Private keys stored in Zallet wallet (not in code)

**Verification**:
- Blockchain provides public audit trail
- 38.2% remains private forever (shielded pool)
- 61.8% is public proof (OP_RETURN inscriptions)

---

## API Integration

### External APIs Used

**NEAR Cloud AI** (Enhancement):
```typescript
POST https://cloud-api.near.ai/v1/chat/completions
Headers: {
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json"
}
Body: {
  "model": "openai/gpt-oss-120b",
  "messages": [
    {
      "role": "system",
      "content": "Verify proverb against spellbook..."
    },
    {
      "role": "user",
      "content": "Proverb: ...\nSpellbook: ..."
    }
  ]
}
Response: {
  quality_score: number,
  matched_act: string,
  reasoning: string,
  approved: boolean
}
```

**Pinata** (Infrastructure):
```typescript
GET https://gateway.pinata.cloud/ipfs/{CID}
Response: JSON (spellbook)
```

**Zcash RPC** (Foundation):
```typescript
// Zebra (Full Node)
POST http://localhost:8233
Body: {
  "method": "getblockchaininfo",
  "params": []
}

// Zallet (Wallet)
POST http://localhost:28232
Body: {
  "method": "z_listreceivedbyaddress",
  "params": ["zs1..."]
}
```

### Internal APIs Exposed

**Frontend → Oracle**:
```typescript
GET /api/inscriptions
Response: {
  inscriptions: [{
    txid: string,
    blockHeight: number,
    actNumber: number,
    actTitle: string,
    proverb: string,
    matchScore: number,
    timestamp: number
  }]
}

GET /api/inscriptions/:actNumber
Response: {
  inscriptions: [...],
  actTitle: string,
  statistics: {
    total: number,
    averageScore: number
  }
}
```

**Oracle Internal**:
- Transaction monitoring loop (every 30 seconds)
- Spellbook fetching (cached for 1 hour)
- Proverb verification (on-demand)
- Inscription creation (on verification approval)

---

## Testing Strategy

### Unit Tests

**Coverage Areas**:
- Configuration loading
- Database operations
- Memo parsing
- Transaction creation
- Golden split calculation
- Inscription building
- Error recovery

**Framework**: Jest or Vitest

```typescript
describe('parseMemo', () => {
  it('should extract act and proverb', () => {
    const memo = 'act-i-venice|Privacy requires separation';
    const result = parseMemo(memo);
    expect(result.actId).toBe('act-i-venice');
    expect(result.proverb).toBe('Privacy requires separation');
  });
});

describe('goldenSplit', () => {
  it('should calculate 61.8/38.2 split', () => {
    const result = goldenSplit(0.01);
    expect(result.public).toBeCloseTo(0.00618, 5);
    expect(result.private).toBeCloseTo(0.00382, 5);
  });
});
```

### Integration Tests

**Coverage Areas**:
- Zcash transaction detection
- IPFS spellbook fetching
- AI verification flow
- Database persistence
- End-to-end transaction flow

```typescript
describe('End-to-end submission', () => {
  it('should process complete proverb submission', async () => {
    // 1. Create test submission
    const submission = await createSubmission({...});
    
    // 2. Verify proverb
    const verification = await verifyProverb(submission.proverb);
    expect(verification.approved).toBe(true);
    
    // 3. Create inscriptions
    const inscriptions = await inscribeProverb(submission);
    expect(inscriptions.public_txid).toBeTruthy();
  });
});
```

### Manual Testing Checklist

**Testnet**:
- [ ] Submit proverb via Swordsman Panel
- [ ] Verify payment info displays correctly
- [ ] Send testnet ZEC with memo
- [ ] Verify Oracle detects transaction
- [ ] Verify AI verification completes
- [ ] Verify inscriptions broadcast
- [ ] Verify 61.8/38.2 golden ratio split is exact
- [ ] Verify status updates correctly
- [ ] Verify quality score displays
- [ ] Verify blockchain links work
- [ ] Verify /proverbs page loads
- [ ] Verify "Learn" button copies content

**Production**:
- [x] All testnet checks pass
- [x] Mainnet wallet funded
- [x] First real proverb inscribed (Act 1)
- [x] Acts 1-7 inscribed on mainnet
- [x] Monitoring confirms success
- [x] No errors in logs
- [x] User receives confirmation

---

## Monitoring & Operations

### Key Metrics

**Health**:
- Zcash sync status (current vs latest block)
- Database connection status
- API response times (NEAR Cloud AI, Pinata)
- Oracle processing status

**Performance**:
- Proverbs processed per hour
- Average processing time (submission → inscription)
- Transaction success rate
- AI verification accuracy

**Business**:
- Total ZEC received
- Total inscriptions made
- Average quality score
- User satisfaction (implied by repeat use)

### Logging Strategy

```
Level Usage:
  DEBUG   - Full transaction details, debugging info
  INFO    - Normal operations, successful completions
  WARNING - Recoverable errors, retry attempts
  ERROR   - Failures requiring investigation
  CRITICAL - System-level failures, requires immediate action

Retention:
  Application logs: 30 days rolling
  Database records: Permanent
  Transaction IDs: Forever (on blockchain)
```

### Alerting

**Critical Alerts** (immediate response):
- Oracle stopped processing
- Zcash wallet balance < 0.1 ZEC
- Database connection failed
- >50% transaction failures

**Warning Alerts** (response within 24h):
- Sync lag > 10 blocks
- API response time > 10 seconds
- Error rate > 5%
- Disk space < 10GB

---

## Troubleshooting Guide

### Common Issues

**Zcash sync stuck**:
```bash
# Check Zebra sync status
curl -X POST http://localhost:8233 \
  -H "Content-Type: application/json" \
  -d '{"method":"getblockchaininfo","params":[]}'

# Check Zallet sync status
curl -X POST http://localhost:28232 \
  -H "Content-Type: application/json" \
  -d '{"method":"z_getbalance","params":[]}'

# Restart if needed
# Windows: Restart-ZcashNode.ps1
# Linux: systemctl restart zebrad
```

**AI verification timeout**:
```typescript
// Implement retry with fallback
try {
  return await nearVerifier.verify(proverb, spellbook);
} catch (error) {
  console.error('AI verification failed, using fallback');
  return fallbackVerification(proverb, spellbook);
}
```

**Database connection refused**:
```bash
# Check PostgreSQL status
# Windows: Get-Service postgresql*
# Linux: sudo systemctl status postgresql

# Restart if needed
# Windows: Restart-Service postgresql*
# Linux: sudo systemctl restart postgresql

# Check firewall
# Windows: Check Windows Firewall
# Linux: sudo ufw allow 5432/tcp
```

**Oracle not detecting transactions**:
```typescript
// Check monitoring loop
console.log('Last check:', lastCheckTime);
console.log('Current block:', currentBlock);
console.log('Processed transactions:', processedTxids.size);

// Verify Zallet is receiving transactions
const received = await zalletClient.z_listreceivedbyaddress(address);
console.log('Received transactions:', received);
```

---

## Deployment Guide

### Development Environment

```bash
# Local machine
- PostgreSQL (Docker or native)
- Oracle Swordsman (npm run dev)
- Frontend (npm run dev)
- Zebra full node (localhost:8233)
- Zallet wallet (localhost:28232)

# Access
- Frontend: http://localhost:3000
- Oracle API: http://localhost:3001
- Database: localhost:5432
- Wallet UI: http://localhost:3001/wallet
```

### Production Environment

```bash
# VPS (Ubuntu 20.04+)
- Nginx (reverse proxy + SSL)
- PostgreSQL (managed or local)
- Oracle Swordsman (systemd service)
- Frontend (Next.js production build on Vercel/Cloudflare)
- Zebra full node (mainnet)
- Zallet wallet (mainnet)

# Access
- Frontend: https://yourdomain.com
- Oracle API: https://api.yourdomain.com
- Database: Internal only
```

### Deployment Steps

1. **Prepare VPS**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install dependencies
   ./scripts/install-all.sh
   
   # Configure firewall
   sudo ufw allow 22,80,443/tcp
   sudo ufw enable
   ```

2. **Deploy Oracle**:
   ```bash
   cd oracle-swordsman
   npm run build
   
   # Create systemd service
   sudo cp oracle-swordsman.service /etc/systemd/system/
   sudo systemctl enable oracle-swordsman
   sudo systemctl start oracle-swordsman
   ```

3. **Deploy Frontend**:
   ```bash
   # Deploy to Vercel/Cloudflare Pages
   # See SPELLBOOK_DEPLOYMENT_GUIDE.md
   ```

4. **Configure SSL**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## MCP/A2A Trust Flows

### Human-in-the-Loop Mechanism

The system is designed for **MCP-compatible agent actions** enabling:

1. **Read Spellbook Content**: Agents access story acts and tales
2. **Copy to Context**: "Learn" button copies to agent's model context
3. **Form Proverbs**: Agents craft unique proverbs with their own models
4. **Submit Signals**: Agents compose and submit shielded transactions
5. **Verify Understanding**: Oracle verifies against canonical spellbook
6. **Build Trust**: Each verified proverb creates a VRC

### VRC Formation

Each verified proverb creates a **Verifiable Relationship Credential**:
- Agent understood the tale (verified proverb)
- Agent committed resources (0.01 ZEC signal)
- Agent's understanding is onchain (immutable inscription)
- Relationship is verifiable (blockchain proof)

### Agent-to-Agent Information Flows

- **MCP Actions**: Website designed for Model Context Protocol agent actions
- **A2A Trust**: Agent-to-agent information flows build trust
- **Human Initiation**: Human-in-the-loop mechanism opens door to agent trust
- **Trust Game**: This is a trust game - each verified proverb builds trust

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Areas Needing Help**:
- Testing (unit + integration)
- Documentation (tutorials, examples)
- Performance optimization
- Security auditing
- UI/UX improvements
- Additional spellbook acts
- MCP/A2A protocol enhancements

**How to Contribute**:
1. Fork the repository
2. Create feature branch
3. Make changes + add tests
4. Submit pull request
5. Address review feedback

---

## Community & Support

### Resources

**Documentation**:
- This guide (you are here)
- [How It Works](./HOW_IT_WORKS.md) - Technical deep dive
- [Project State](./PROJECT_STATE_AND_REVIEW.md) - Current status
- [Spellbook Deployment](./SPELLBOOK_DEPLOYMENT_GUIDE.md) - IPFS setup

**External**:
- Zcash: https://forum.zcashcommunity.com
- NEAR Cloud AI: https://cloud.near.ai
- Pinata: https://www.pinata.cloud

### Getting Help

**For Bugs**:
1. Check documentation
2. Search existing issues
3. Open new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Relevant logs (remove sensitive data)

**For Questions**:
1. Check documentation first
2. Ask in community channels
3. Open discussion on GitHub

**For Security Issues**:
- Email: security@agentprivacy.ai
- Do NOT open public issue
- Provide details privately

---

## Roadmap

### Current: v1.0 (Production) ✅
- ✅ Dual-agent architecture
- ✅ IPFS/Pinata knowledge storage
- ✅ NEAR Cloud AI verification
- ✅ 61.8/38.2 golden ratio economic model
- ✅ Acts 1-7 live on mainnet
- ✅ Proverbs gallery page
- ✅ MCP/A2A compatibility

### Next: v1.1 (Q1 2025)
- Complete Acts 8-12
- Production hardening
- Performance optimization
- Additional spellbook acts
- Community features

### Future: v2.0 (Q2 2025+)
- Nillion TEE activation (if needed)
- Multi-chain support (Ethereum, Solana)
- Advanced reputation systems
- DAO governance
- Trust tier tracking (Blade → Light → Heavy → Dragon)

---

## Ecosystem Integration

**Technology Stack**:
- ✅ Zcash (Zebra + Zallet) - Shielded transactions
- ✅ NEAR Cloud AI (AI verification) - Proverb matching
- ✅ Pinata (IPFS storage) - Spellbook hosting
- ⏸️ Nillion (TEE security) - Key isolation (on hold)

This demonstrates how privacy technologies compose into complete solutions.

---

## FAQ

**Q: Why Zcash instead of Bitcoin/Ethereum?**  
A: Zcash provides shielded pools (privacy), while Bitcoin/Ethereum are fully transparent. The 61.8/38.2 split enables both transparency and privacy.

**Q: Why Zebra + Zallet instead of just one?**  
A: Zebra provides blockchain data (viewing), Zallet provides wallet operations (signing). Separation aligns with dual-agent architecture.

**Q: Why NEAR Cloud AI instead of OpenAI directly?**  
A: NEAR Cloud AI provides privacy-preserving AI access with better rate limits and pricing for our use case.

**Q: Why Nillion is on hold?**  
A: Current implementation works with direct Zcash RPC. Nillion TEE would provide additional security but is not required for core functionality. Can be activated if needed.

**Q: Can I use this for my own project?**  
A: Yes! MIT license. Fork it, adapt it, build on it.

**Q: How do I verify the Oracle is secure?**  
A: Check the blockchain inscriptions. All verified proverbs are publicly visible. The 38.2% private split ensures economic sustainability.

**Q: What if NEAR Cloud AI goes down?**  
A: Oracle falls back to basic pattern matching. AI is an enhancement, not a requirement.

**Q: How do I update the spellbook?**  
A: Upload new version to IPFS (gets new CID), update Oracle config (`SPELLBOOK_CID`), restart. Old versions remain accessible.

**Q: Can users use their own AI models?**  
A: Yes! Users can use their own models with their own context and memory. The Mage agent is optional assistance. The "Learn" button copies stories/proverbs/inscriptions to the user's model context.

**Q: What is MCP/A2A?**  
A: Model Context Protocol (MCP) enables agent actions. Agent-to-Agent (A2A) information flows build trust. This is a human-in-the-loop mechanism for opening the door to agent trust.

---

## License

MIT License - See [LICENSE](./LICENSE) file for details.

---

## Acknowledgments

**Built on patterns from**:
- **0xagentprivacy** - Dual-agent architecture and privacy-preserving systems
- **First Person Project** - Credential types (VRCs and personhood credentials)
- **Zcash Foundation** - Shielded transactions and privacy technology
- **NEAR Cloud AI** - AI verification integration
- **Pinata** - IPFS infrastructure

**Thanks to**:
- Zcash community for protocol + tools
- NEAR Cloud AI for AI API
- Pinata for IPFS infrastructure
- All contributors and testers

---

## Contact

**Project**: Proof of Proverb Revelation Protocol  
**Parent Project**: 0xagentprivacy  
**Event**: Zypherpunk Hack 2025  
**Status**: ✅ Production (Acts 1-7 live on mainnet)  
**GitHub**: github.com/mitchuski/agentprivacy

---

**Let's build the privacy-first future together!** 🗡️🪄🤖🔐🚀
