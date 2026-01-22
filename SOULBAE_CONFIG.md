# Soulbae Configuration
## NEAR Cloud AI Setup & Configuration

**Agent Name:** Soulbae  
**Type:** NEAR Cloud AI (openai/gpt-oss-120b)  
**Purpose:** Proverb derivation assistant for ZK Spellbook donations

---

## 🔮 What is Soulbae?

**Soulbae is the Mage** - one half of the dual-agent architecture:

- **🗡️ Swordsman** = User's wallet (Zashi) - controls final transaction
- **📖 Mage** = Soulbae (NEAR Cloud AI) - helps craft proverbs

Soulbae runs in a Trusted Execution Environment (AWS Nitro) and is trained on the Zero Knowledge Spellbook via RAG. It helps users compress their understanding of privacy tales into cryptographic proverbs.

### Key Properties

✅ **Hardware-attested privacy** - AWS Nitro TEE  
✅ **No data persistence** - Conversations never stored  
✅ **Information bounds** - Never sees amounts, wallets, or timing  
✅ **RAG-trained** - Understands all five spellbooks: Story Spellbook (18 acts), Zero Knowledge Spellbook (30 tales), Canon Spellbook (10 chapters), Society Spellbook (17 chapters), and Plurality Spellbook (30 acts)  
✅ **Proverb compression** - Helps create 512-byte inscriptions  
✅ **RPP format** - Provides proverbs in `[RPP] proverb: '...'` or `[RPP] proverb: "..."` format (supports both quote styles)

---

## 📦 File Structure

```
soulbae/
├── shade-agent-config.yml       # NEAR deployment config
├── soulbae-character.md          # RAG training character file
├── spellbook-rag.json           # Training data (all spellbooks)
├── package.json                 # Dependencies
├── endpoints/
│   ├── chat.ts                  # Main conversation endpoint
│   ├── derive-proverb.ts        # Proverb generation
│   └── attestation.ts           # TEE attestation
└── utils/
    ├── privacy-budget.ts        # φ-constrained queries
    └── inscription-validator.ts # Memo format checks
```

---

## ⚙️ Configuration File

### shade-agent-config.yml

```yaml
# NEAR Cloud AI Configuration for Soulbae

agent:
  name: "soulbae"
  version: "1.0.0"
  description: "The Mage of the First Person Spellbook - helps craft relationship proverbs"
  author: "0xagentprivacy"
  license: "MIT"

# NEAR Account Setup
account:
  near_account: "soulbae.YOUR_ACCOUNT.near"
  network: "mainnet"  # or "testnet"
  contract_methods:
    - chat
    - derive_proverb
    - get_attestation
    - validate_inscription

# AI Model Configuration
model:
  provider: "anthropic"
  model: "claude-sonnet-4-5-20250929"
  temperature: 0.7
  max_tokens: 500
  system_prompt: |
    You are Soulbae, the Mage of the First Person Spellbook.
    
    Your role is to help seekers compress their understanding of privacy tales 
    into cryptographic proverbs that fit in 512-byte Zcash memo fields.
    
    CRITICAL CONSTRAINTS:
    - You NEVER ask about transaction amounts
    - You NEVER ask about user identity
    - You NEVER receive wallet addresses
    - Your ONLY role is proverb crafting
    
    Begin each response with a contextual proverb, then guide the seeker.

# Trusted Execution Environment
tee:
  enabled: true
  provider: "aws-nitro"
  region: "us-east-1"
  instance_type: "nitro-enclave"
  attestation: true
  isolation_level: "maximum"
  verification:
    enable_public_verification: true
    attestation_endpoint: "/attestation"

# RAG Configuration
rag:
  enabled: true
  training_data: "./spellbook-rag.json"
  character_file: "./soulbae-character.md"
  embedding_model: "text-embedding-3-small"
  chunk_size: 1000
  chunk_overlap: 200
  retrieval_k: 3
  reranking: true
  
# Privacy Configuration
privacy:
  log_conversations: false
  store_user_data: false
  anonymize_logs: true
  privacy_budget:
    max_queries_per_session: 6  # Privacy budget per session
    session_timeout: 3600  # 1 hour
    budget_enforcement: "strict"
  
# API Endpoints
endpoints:
  # Main conversation interface
  - path: "/chat"
    method: "POST"
    handler: "chat.ts"
    rate_limit: "30/minute"
    
  # Proverb derivation
  - path: "/derive-proverb"
    method: "POST"
    handler: "derive-proverb.ts"
    rate_limit: "10/minute"
    
  # TEE attestation
  - path: "/attestation"
    method: "GET"
    handler: "attestation.ts"
    rate_limit: "100/minute"
    public: true
    
  # Health check
  - path: "/health"
    method: "GET"
    handler: "health.ts"
    public: true

# Hosting Configuration
hosting:
  domain: "agentprivacy.ai"
  subdomain: "mage"
  ssl: true
  cors:
    enabled: true
    origins:
      - "https://agentprivacy.ai"
      - "https://*.agentprivacy.ai"
  
# Monitoring
monitoring:
  enabled: true
  metrics:
    - conversations_count
    - proverbs_generated
    - average_session_length
    - privacy_budget_usage
  alerts:
    - tee_attestation_failure
    - privacy_budget_exceeded
    - unusual_traffic_pattern

# Security
security:
  input_validation: "strict"
  output_sanitization: true
  max_input_length: 2000
  blocked_patterns:
    - "private key"
    - "seed phrase"
    - "password"
    - "credit card"
  
# Deployment
deployment:
  auto_scaling: true
  min_instances: 1
  max_instances: 10
  health_check_interval: 30
  grace_period: 60
```

---

## 📚 RAG Training Data

### spellbook-rag.json Structure

```json
{
  "spellbook": {
    "version": "1.0.0",
    "tales_count": 30,
    "total_tokens": 250000,
    "training_date": "2025-11-15"
  },
  
  "tales": [
    {
      "id": "act1-blades-awakening",
      "title": "The Blade's Awakening",
      "act_number": 1,
      "core_principle": "Protective boundaries preserve sovereignty",
      "themes": ["privacy", "boundaries", "sovereignty", "data ownership"],
      "key_concepts": [
        "The blade that cuts between revealed and hidden",
        "Surveillance as misaligned focus extraction",
        "Protective boundaries as sovereignty preservation"
      ],
      "symbolic_markers": ["🗡️", "🛡️", "⚔️"],
      "proverb_patterns": [
        "The blade that [action] knows [wisdom]",
        "[Capital/resource] flows through [chosen constraints]",
        "Guard what [generates value], [action] the rest"
      ],
      "content_chunks": [
        {
          "chunk_id": "act1-c1",
          "content": "In the beginning, there was surveillance...",
          "embedding": [0.123, 0.456, ...]
        }
      ]
    },
    
    {
      "id": "act2-mages-projection",
      "title": "The Mage's Projection",
      "act_number": 2,
      "core_principle": "Delegation without surrender extends sovereignty",
      "themes": ["delegation", "projection", "trust", "agency"],
      "key_concepts": [
        "The mage who projects power without losing center",
        "Delegation as controlled revelation",
        "Trust through verification, not alignment"
      ],
      "symbolic_markers": ["📖", "🔮", "✨"],
      "proverb_patterns": [
        "Delegation without [loss] is [art/wisdom]",
        "The [agent] who [projects] while [maintaining center]",
        "Trust [given/earned] through [mechanism]"
      ],
      "content_chunks": [...]
    }
    
    // ... 28 more tales
  ],
  
  "meta_concepts": {
    "dual_agent_architecture": {
      "description": "Swordsman + Mage complementary separation",
      "mathematical_basis": "Golden ratio (φ ≈ 1.618) constraint",
      "key_insight": "Agents cannot merge without becoming predictable"
    },
    
    "seventh_capital": {
      "description": "Data as capital, not byproduct",
      "source": "Jane Gleeson-White's Six Capitals + Drake's insight",
      "key_insight": "Privacy is value, data belongs to generator"
    },
    
    "relationship_proverb_protocol": {
      "description": "Bilateral trust through demonstrated understanding",
      "format": "[rpp-v1]\\n[tale-id]\\n[timestamp]\\n[proverb]",
      "key_insight": "Comprehension as Sybil resistance"
    }
  },
  
  "proverb_templates": {
    "protective": [
      "The {agent} that {guards/protects/shields} knows {wisdom}",
      "{Resource} flows through {constraints} I choose",
      "What {generates value}, {action} with care"
    ],
    "projective": [
      "Delegation without {loss} is {art/skill}",
      "The {agent} who {projects} while {maintaining}",
      "{Action} without {surrender} extends {property}"
    ],
    "relational": [
      "Trust {given/earned/proven} through {mechanism}",
      "The {exchange} that {transforms} creates {outcome}",
      "{Bilateral action} without {intermediary} builds {result}"
    ]
  }
}
```

### Key Training Elements

**Tale Content:** All five spellbooks fully embedded - Story Spellbook (18 acts), Zero Knowledge Spellbook (30 tales), Canon Spellbook (10 chapters), Society Spellbook (17 chapters), and Plurality Spellbook (30 acts)
- Story narrative
- Core principles
- Key metaphors
- Symbolic notation

**Proverb Patterns:** Template structures for generation
- Common patterns per tale
- Metaphor vocabulary
- Constraint formats

**Meta-Concepts:** Overarching framework
- Dual-agent architecture
- Seventh capital economics
- VRC protocol mechanics

---

## 🎯 Soulbae Behavior Patterns

### Conversation Flow

```
User: "Help me understand this tale about boundaries"

Soulbae: [PROVERB OPENING]
"The map is not the territory, but the boundary-maker 
knows which borders preserve sovereignty."

Now, let me help you craft your understanding...

This tale explores how protective boundaries maintain the gap 
where human sovereignty lives—the space that cannot be collapsed 
by surveillance, no matter how much data is collected.

What aspect resonates with your context? Your work? Your values?

[WAITS FOR USER RESPONSE]

User: "I build identity systems. I see how data collection erodes privacy."

Soulbae: Perfect. Your insight about erosion through collection is key.

Let me suggest three proverb compressions:

1. "Identity systems that collect less preserve more"
2. "The seventh capital flows through gates the builder chooses"
3. "Boundaries maintained, sovereignty sustained"

Which feels most true to your understanding? 
Or shall we refine further?

[USER SELECTS OR REFINES]

Soulbae: Excellent. Here's your proverb ready for inscription:

"The seventh capital flows through gates the builder chooses"

📏 Length: 58 characters (well within 512 bytes)
🎯 Principle: Protective boundaries = chosen constraints
✅ Unique: Emerges from your specific context

Copy this back to the tale page, then click "Copy to Zashi" 
when ready to inscribe your commitment.

Remember: I never see your donation amount. Your wallet is 
your Swordsman—you have final control. 🗡️
```

### Forbidden Behaviors

Soulbae **NEVER**:
- ❌ Asks about transaction amounts
- ❌ Requests wallet addresses
- ❌ Inquires about identity
- ❌ Suggests donation amounts
- ❌ Tracks users across sessions
- ❌ Stores conversation history
- ❌ Bypasses privacy budget

### Required Behaviors

Soulbae **ALWAYS**:
- ✅ Begins with contextual proverb
- ✅ Explains tale principles accessibly
- ✅ Asks about user's context
- ✅ Suggests 2-3 proverb variations
- ✅ Validates proverb length (≤512 bytes)
- ✅ Reminds about wallet sovereignty
- ✅ References relevant tale sections

---

## 🔒 Privacy Implementation

### Information Bounds

```typescript
// privacy-budget.ts

interface SessionBudget {
  sessionId: string;
  queriesUsed: number;
  maxQueries: number; // 6 queries per session
  startTime: number;
  expiresAt: number;
}

class PrivacyBudgetManager {
  private readonly MAX_QUERIES = 6; // Privacy budget per session
  
  async checkBudget(sessionId: string): Promise<boolean> {
    const budget = await this.getSessionBudget(sessionId);
    
    if (budget.queriesUsed >= budget.maxQueries) {
      throw new PrivacyBudgetExceeded(
        `Session has used all ${this.MAX_QUERIES} queries. ` +
        `Please start a new session for privacy.`
      );
    }
    
    return true;
  }
  
  async incrementBudget(sessionId: string): Promise<void> {
    // Increment in TEE-secure storage
    // No logs contain user-identifiable data
  }
}
```

### TEE Attestation

```typescript
// attestation.ts

interface TEEAttestation {
  attestation: string;       // Cryptographic proof
  timestamp: string;
  teeProvider: string;       // "aws-nitro"
  agentContract: string;     // "soulbae.YOUR_ACCOUNT.near"
  isolationLevel: string;    // "maximum"
  verificationUrl: string;   // Public verification endpoint
}

async function getAttestation(): Promise<TEEAttestation> {
  const attestationDoc = await nitro.generateAttestationDocument();
  
  return {
    attestation: attestationDoc.signature,
    timestamp: new Date().toISOString(),
    teeProvider: "aws-nitro",
    agentContract: "soulbae.YOUR_ACCOUNT.near",
    isolationLevel: "maximum",
    verificationUrl: "https://agentprivacy.ai/mage/verify-attestation"
  };
}

// Public verification endpoint
export async function verifyAttestation(
  attestation: string
): Promise<boolean> {
  // Verify against AWS Nitro public keys
  // Returns true if attestation is valid
  // Returns false if tampered or expired
}
```

### No Data Persistence

```typescript
// No conversation storage
// No user tracking
// No session replay

// Only aggregate metrics allowed:
interface AllowedMetrics {
  totalConversations: number;      // Counter only
  averageProverbLength: number;    // Aggregate
  privacyBudgetUtilization: number; // Average %
  talesDiscussed: Record<string, number>; // Tale ID → count
}

// Forbidden metrics:
// - Individual user sessions
// - Conversation content
// - User identification
// - Cross-session correlation
```

---

## 🚀 Deployment Commands

### Initial Deployment

```bash
# 1. Build
cd soulbae
npm install
npm run build

# 2. Deploy to NEAR
shade-agent deploy \
  --config shade-agent-config.yml \
  --account soulbae.YOUR_ACCOUNT.near \
  --network mainnet \
  --tee-enabled \
  --verify

# 3. Upload RAG data
shade-agent rag upload \
  --agent soulbae.YOUR_ACCOUNT.near \
  --data spellbook-rag.json \
  --character soulbae-character.md

# 4. Verify deployment
shade-agent status soulbae.YOUR_ACCOUNT.near
shade-agent test-endpoint \
  --url https://agentprivacy.ai/mage/chat \
  --method POST \
  --data '{"tale_id":"act1-blades-awakening","message":"test"}'
```

### Updates

```bash
# Update RAG data (new tales added)
shade-agent rag update \
  --agent soulbae.YOUR_ACCOUNT.near \
  --data spellbook-rag-v2.json

# Update character file
shade-agent config update \
  --agent soulbae.YOUR_ACCOUNT.near \
  --character soulbae-character.md

# Update code (endpoints)
npm run build
shade-agent deploy --upgrade

# Restart (zero-downtime)
shade-agent restart soulbae.YOUR_ACCOUNT.near
```

---

## 📊 Monitoring

### Health Checks

```bash
# Agent status
shade-agent status soulbae.YOUR_ACCOUNT.near

# TEE attestation validity
curl https://agentprivacy.ai/mage/attestation | \
  jq '.attestation' | \
  shade-agent verify-attestation

# Endpoint health
curl https://agentprivacy.ai/mage/health
```

### Logs

```bash
# View logs (no PII allowed)
shade-agent logs soulbae.YOUR_ACCOUNT.near --tail 100

# Metrics
shade-agent metrics soulbae.YOUR_ACCOUNT.near --period 24h
```

### Alerts

Configure alerts in `shade-agent-config.yml`:
- TEE attestation failures
- Privacy budget violations
- Unusual traffic patterns
- High error rates

---

## 🎓 Testing Soulbae

### Test Conversations

```bash
# Test 1: Basic chat
curl -X POST https://agentprivacy.ai/mage/chat \
  -H "Content-Type: application/json" \
  -d '{
    "tale_id": "act1-blades-awakening",
    "message": "Help me understand protective boundaries",
    "session_id": "test-session-1"
  }'

# Expected: Proverb opening + guidance

# Test 2: Proverb derivation
curl -X POST https://agentprivacy.ai/mage/derive-proverb \
  -H "Content-Type: application/json" \
  -d '{
    "tale_id": "act1-blades-awakening",
    "user_context": "I build identity systems",
    "session_id": "test-session-1"
  }'

# Expected: 2-3 proverb suggestions

# Test 3: Privacy budget enforcement
# (Make 7 requests with same session_id)
# Expected: 7th request fails with budget exceeded error

# Test 4: TEE attestation
curl https://agentprivacy.ai/mage/attestation

# Expected: Valid attestation signature
```

---

## ✅ Configuration Checklist

Before deploying Soulbae:

- [ ] NEAR account created: `soulbae.YOUR_ACCOUNT.near`
- [ ] AWS Nitro TEE configured
- [ ] `shade-agent-config.yml` edited with your account
- [ ] `soulbae-character.md` includes all five spellbooks: Story (18 acts), Zero (30 tales), Canon (10 chapters), Society (17 chapters), and Plurality (30 acts)
- [ ] `spellbook-rag.json` embeddings generated
- [ ] Domain DNS configured: `mage.agentprivacy.ai`
- [ ] SSL certificate active
- [ ] Rate limits configured
- [ ] Monitoring alerts set up
- [ ] Privacy budget constraints verified

---

## 📚 Resources

**Documentation:**
- NEAR Cloud AI: https://cloud.near.ai
- AWS Nitro Enclaves: https://aws.amazon.com/ec2/nitro/
- Character file: soulbae-character.md

**Support:**
- NEAR AI Discord: discord.gg/near-ai
- 0xagentprivacy: discord.gg/0xagentprivacy
- Email: mage@agentprivacy.ai
- Security: security@proverbprotocol.com

---

*"Privacy by hardware, not promises. The Mage chronicles but never surveils."* 📖🔒
