# OrbitPort cTRNG Integration Plan for Key Ceremony

## Overview

This document outlines the integration of SpaceComputer's OrbitPort cosmic True Random Number Generator (cTRNG) into the AgentPrivacy key ceremony. The goal is to use space-derived randomness to generate a password/passphrase that protects the user's Ed25519 private key.

---

## Current State Analysis

### Existing Key Ceremony Flow

```
/ceremony
    ↓
Step 1: Name Your Swordsman (display name input)
    ↓
Step 2: Forge Your Key (Ed25519 keypair generation)
    → Uses @noble/ed25519 with ed.utils.randomSecretKey()
    → Randomness from Web Crypto API (crypto.getRandomValues())
    → Keys stored as unencrypted hex in localStorage
    ↓
Step 3: Set Your Boundaries (privacy preferences)
    ↓
Step 4: Choose Your Grimoires (spellbook selection)
    ↓
Step 5: Seal Your Identity (sign agent card)
    ↓
Step 6: Activation (completion)
```

### Current Security Gap

- **Private keys stored unencrypted** in localStorage (`ap-private-key`)
- No password/passphrase protection
- No key wrapping or encryption at rest

---

## OrbitPort cTRNG Service

### What It Provides

SpaceComputer's OrbitPort delivers cryptographically secure random numbers from:
- **`aptosorbital`**: Space-based randomness from cEDGE or Crypto2 satellites in low Earth orbit
- **`derived`**: BIP32-derived randomness from a cosmic master seed (fallback when satellites unavailable)

### API Details

| Endpoint | Method | Description |
|----------|--------|-------------|
| `${ORBITPORT_AUTH_URL}/oauth/token` | POST | OAuth2 token acquisition |
| `${ORBITPORT_API_URL}/api/v1/services/trng` | GET | Fetch 32 bytes of random data |

### Response Format

```typescript
interface OrbitPortResponse {
  service: string;
  src: 'aptosorbital' | 'derived';
  data: string;          // 32-byte hex string (64 chars)
  signature: {
    value: string;       // Signature over the data
    pk: string;          // Public key for verification
  };
}
```

### Authentication

- **Grant Type**: `client_credentials` (OAuth2)
- **Audience**: `https://op.spacecomputer.io/api`
- **Required Credentials**:
  - `ORBITPORT_CLIENT_ID`
  - `ORBITPORT_CLIENT_SECRET`
  - `ORBITPORT_AUTH_URL`
  - `ORBITPORT_API_URL`

---

## Integration Options

### Option A: OrbitPort Randomness for Password Generation (Recommended)

Use OrbitPort cTRNG to generate a cryptographically secure password that encrypts the locally-generated Ed25519 private key.

```
┌─────────────────────────────────────────────────────────────┐
│                     KEY CEREMONY FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Browser                          Server (API Route)        │
│  ───────                          ──────────────────        │
│                                                             │
│  1. User reaches "Forge Key" step                           │
│           │                                                 │
│           ▼                                                 │
│  2. Generate Ed25519 keypair locally                        │
│     (ed.utils.randomSecretKey())                            │
│           │                                                 │
│           ▼                                                 │
│  3. Request cosmic password ────────► Fetch OrbitPort token │
│                                              │               │
│                                              ▼               │
│                                       GET /api/v1/services/trng
│                                              │               │
│                              ◄────────── Return 32-byte hex │
│           │                                                 │
│           ▼                                                 │
│  4. Convert hex to passphrase                               │
│     (e.g., BIP39 mnemonic or                                │
│      readable word sequence)                                │
│           │                                                 │
│           ▼                                                 │
│  5. Display passphrase to user                              │
│     "Write this down!"                                      │
│           │                                                 │
│           ▼                                                 │
│  6. Derive encryption key from                              │
│     passphrase (PBKDF2/Argon2)                              │
│           │                                                 │
│           ▼                                                 │
│  7. Encrypt private key with                                │
│     derived key (AES-GCM)                                   │
│           │                                                 │
│           ▼                                                 │
│  8. Store encrypted key in localStorage                     │
│     (not plaintext!)                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Advantages**:
- Ed25519 keypair still generated locally (no private key leaves browser)
- OrbitPort provides verifiable cosmic entropy for password
- Password can be verified via OrbitPort's signature
- Adds encryption at rest for stored keys

### Option B: OrbitPort for Full Keypair Entropy

Use OrbitPort randomness as the seed for Ed25519 key generation itself.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. Fetch 32 bytes from OrbitPort                           │
│           │                                                 │
│           ▼                                                 │
│  2. Use as Ed25519 private key seed                         │
│     (instead of ed.utils.randomSecretKey())                 │
│           │                                                 │
│           ▼                                                 │
│  3. Derive public key from seed                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Advantages**:
- Key derived from space-based entropy (marketing/trust value)
- Verifiable source via OrbitPort signature

**Disadvantages**:
- Still need password protection for storage
- Adds network dependency to key generation
- More complex failure modes

### Option C: Hybrid - User Choice

Allow users to select their entropy source:

- **"Local"**: Browser's Web Crypto API (current behavior)
- **"Cosmic"**: OrbitPort cTRNG
- **"Combined"**: XOR of both sources

---

## Recommended Implementation: Option A

### Phase 1: Server-Side API Route

Create a Next.js API route to proxy OrbitPort requests (keeps credentials secure).

**File**: `src/app/api/cosmic-entropy/route.ts`

```typescript
import { NextResponse } from 'next/server';

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60000) {
    return tokenCache.accessToken;
  }

  const response = await fetch(`${process.env.ORBITPORT_AUTH_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.ORBITPORT_CLIENT_ID,
      client_secret: process.env.ORBITPORT_CLIENT_SECRET,
      audience: 'https://op.spacecomputer.io/api',
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to obtain OrbitPort access token');
  }

  const data = await response.json();
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return tokenCache.accessToken;
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${process.env.ORBITPORT_API_URL}/api/v1/services/trng?src=aptosorbital&src=derived`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch cosmic entropy');
    }

    const data = await response.json();

    return NextResponse.json({
      entropy: data.data,        // 32-byte hex string
      source: data.src,          // 'aptosorbital' or 'derived'
      signature: data.signature, // For verification
    });
  } catch (error) {
    console.error('Cosmic entropy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cosmic entropy' },
      { status: 500 }
    );
  }
}
```

### Phase 2: Environment Configuration

**Add to `.env.local`**:

```env
# OrbitPort cTRNG Configuration
ORBITPORT_CLIENT_ID=your_client_id
ORBITPORT_CLIENT_SECRET=your_client_secret
ORBITPORT_AUTH_URL=https://auth.spacecomputer.io
ORBITPORT_API_URL=https://op.spacecomputer.io
```

**Update `.env.example`**:

```env
# OrbitPort cTRNG (apply at spacecomputer.deform.cc/ctrngearlyaccess)
ORBITPORT_CLIENT_ID=
ORBITPORT_CLIENT_SECRET=
ORBITPORT_AUTH_URL=https://auth.spacecomputer.io
ORBITPORT_API_URL=https://op.spacecomputer.io
```

### Phase 3: Passphrase Generation Library

**File**: `src/lib/ceremony/cosmic-passphrase.ts`

```typescript
import { hexToBytes } from './keygen';

// BIP39 English wordlist (2048 words) - import from a library or embed
import { wordlist } from '@scure/bip39/wordlists/english';

export interface CosmicEntropy {
  entropy: string;           // 32-byte hex
  source: 'aptosorbital' | 'derived';
  signature: {
    value: string;
    pk: string;
  };
}

/**
 * Fetch cosmic entropy from OrbitPort via our API route.
 */
export async function fetchCosmicEntropy(): Promise<CosmicEntropy> {
  const response = await fetch('/api/cosmic-entropy');
  if (!response.ok) {
    throw new Error('Failed to fetch cosmic entropy');
  }
  return response.json();
}

/**
 * Convert 32 bytes of entropy to a 24-word BIP39 mnemonic.
 * (256 bits = 24 words)
 */
export function entropyToMnemonic(entropyHex: string): string {
  const entropyBytes = hexToBytes(entropyHex);

  // Use @scure/bip39 for proper mnemonic generation
  // This is a simplified example - use the actual library
  const words: string[] = [];

  // 256 bits / 11 bits per word ≈ 23.3, plus checksum = 24 words
  // Proper implementation requires checksum calculation
  for (let i = 0; i < 24; i++) {
    const startBit = i * 11;
    const byteIndex = Math.floor(startBit / 8);
    const bitOffset = startBit % 8;

    let value = (entropyBytes[byteIndex] << 8) | (entropyBytes[byteIndex + 1] || 0);
    value = (value >> (16 - 11 - bitOffset)) & 0x7ff;

    words.push(wordlist[value % 2048]);
  }

  return words.join(' ');
}

/**
 * Alternative: Generate a shorter, more memorable passphrase.
 * Uses 6 words (66 bits of entropy) for usability.
 */
export function entropyToShortPassphrase(entropyHex: string): string {
  const entropyBytes = hexToBytes(entropyHex);
  const words: string[] = [];

  // Take 6 words (2 bytes each = 12 bytes used)
  for (let i = 0; i < 6; i++) {
    const index = (entropyBytes[i * 2] << 8) | entropyBytes[i * 2 + 1];
    words.push(wordlist[index % 2048]);
  }

  return words.join('-');
}
```

### Phase 4: Key Encryption Library

**File**: `src/lib/ceremony/key-encryption.ts`

```typescript
import { hexToBytes, bytesToHex } from './keygen';

/**
 * Derive an encryption key from a passphrase using PBKDF2.
 */
export async function deriveKeyFromPassphrase(
  passphrase: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passphraseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a private key with a passphrase-derived key.
 */
export async function encryptPrivateKey(
  privateKey: Uint8Array,
  passphrase: string
): Promise<{ encrypted: string; salt: string; iv: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptionKey = await deriveKeyFromPassphrase(passphrase, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    encryptionKey,
    privateKey
  );

  return {
    encrypted: bytesToHex(new Uint8Array(encrypted)),
    salt: bytesToHex(salt),
    iv: bytesToHex(iv),
  };
}

/**
 * Decrypt a private key with a passphrase.
 */
export async function decryptPrivateKey(
  encryptedHex: string,
  saltHex: string,
  ivHex: string,
  passphrase: string
): Promise<Uint8Array> {
  const encrypted = hexToBytes(encryptedHex);
  const salt = hexToBytes(saltHex);
  const iv = hexToBytes(ivHex);

  const encryptionKey = await deriveKeyFromPassphrase(passphrase, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    encryptionKey,
    encrypted
  );

  return new Uint8Array(decrypted);
}
```

### Phase 5: Updated Storage Schema

**File**: `src/lib/ceremony/storage.ts` (modifications)

```typescript
// New storage keys
const KEYS = {
  // ... existing keys ...
  ENCRYPTED_PRIVATE_KEY: 'ap-encrypted-private-key',
  ENCRYPTION_SALT: 'ap-encryption-salt',
  ENCRYPTION_IV: 'ap-encryption-iv',
  ENTROPY_SOURCE: 'ap-entropy-source',    // 'aptosorbital' | 'derived' | 'local'
  ENTROPY_SIGNATURE: 'ap-entropy-signature', // OrbitPort signature for verification
} as const;

export interface EncryptedKeyData {
  encrypted: string;
  salt: string;
  iv: string;
  entropySource: 'aptosorbital' | 'derived' | 'local';
  entropySignature?: {
    value: string;
    pk: string;
  };
}

export function saveEncryptedKey(data: EncryptedKeyData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.ENCRYPTED_PRIVATE_KEY, data.encrypted);
  localStorage.setItem(KEYS.ENCRYPTION_SALT, data.salt);
  localStorage.setItem(KEYS.ENCRYPTION_IV, data.iv);
  localStorage.setItem(KEYS.ENTROPY_SOURCE, data.entropySource);
  if (data.entropySignature) {
    localStorage.setItem(KEYS.ENTROPY_SIGNATURE, JSON.stringify(data.entropySignature));
  }
}
```

### Phase 6: Updated KeyGenStep Component

**File**: `src/components/ceremony/KeyGenStep.tsx` (modifications)

```typescript
// Add cosmic passphrase generation after keypair creation
useEffect(() => {
  if (status !== 'idle') return;
  setStatus('generating');

  Promise.all([
    import('@/lib/ceremony/keygen').then((m) => m.generateKeyPair()),
    import('@/lib/ceremony/cosmic-passphrase').then((m) => m.fetchCosmicEntropy()),
  ])
    .then(async ([keypair, cosmicEntropy]) => {
      const { entropyToShortPassphrase } = await import('@/lib/ceremony/cosmic-passphrase');
      const { encryptPrivateKey } = await import('@/lib/ceremony/key-encryption');

      // Generate passphrase from cosmic entropy
      const passphrase = entropyToShortPassphrase(cosmicEntropy.entropy);

      // Encrypt the private key
      const encryptedData = await encryptPrivateKey(keypair.privateKey, passphrase);

      // Store encrypted (not plaintext!)
      // saveEncryptedKey({ ...encryptedData, entropySource: cosmicEntropy.source });

      onKeyGenerated(keypair);
      onPassphraseGenerated(passphrase, cosmicEntropy.source);
      setStatus('done');
    })
    .catch((e) => {
      // Fallback to local-only if OrbitPort unavailable
      console.warn('Cosmic entropy unavailable, using local fallback');
      // ... fallback logic ...
    });
}, [status]);
```

---

## New Ceremony UX Flow

### Step 2: "Forge Your Key" (Updated)

```
┌────────────────────────────────────────────────────────────┐
│                    🔐 FORGE YOUR KEY                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Your Ed25519 keypair is being forged...                   │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [Spinner] Generating keypair locally...      ✓      │  │
│  │  [Spinner] Fetching cosmic entropy...         ✓      │  │
│  │  [Spinner] Forging your passphrase...         ✓      │  │
│  │  [Spinner] Encrypting your key...             ✓      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🛰️ COSMIC PASSPHRASE                                │  │
│  │  Source: aptosorbital (satellite-derived)            │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  alpine-horizon-crystal-nebula-forge-dawn     │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │  ⚠️  WRITE THIS DOWN! You'll need it to unlock      │  │
│  │     your identity on other devices.                  │  │
│  │                                                      │  │
│  │  [ ] I have written down my passphrase              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  [🔐🔑🗝️💎⚡🔮] ← Choose your constellation emoji          │
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Inscription (optional): __________________________ │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
│  [ Inscribe & Continue ]                                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Dependencies to Add

```json
{
  "dependencies": {
    "@scure/bip39": "^1.2.1"
  }
}
```

---

## Error Handling & Fallbacks

| Scenario | Handling |
|----------|----------|
| OrbitPort API unavailable | Fall back to local `crypto.getRandomValues()` for passphrase entropy |
| Network timeout | Retry once, then fallback to local |
| Invalid credentials | Log error, use local fallback, alert ops |
| Rate limited | Queue and retry with exponential backoff |

### Fallback Flow

```typescript
async function getPassphraseEntropy(): Promise<{ hex: string; source: string }> {
  try {
    const cosmic = await fetchCosmicEntropy();
    return { hex: cosmic.entropy, source: cosmic.source };
  } catch (error) {
    console.warn('OrbitPort unavailable, using local entropy');
    const localEntropy = crypto.getRandomValues(new Uint8Array(32));
    return { hex: bytesToHex(localEntropy), source: 'local' };
  }
}
```

---

## Security Considerations

1. **Private key never leaves browser** - Ed25519 generation remains local
2. **Passphrase displayed once** - User must write it down; not stored
3. **Encrypted at rest** - Only encrypted key stored in localStorage
4. **Credentials server-side** - OrbitPort API keys never exposed to client
5. **Signature verification** - OrbitPort's signature proves entropy provenance

---

## Implementation Checklist

- [ ] Apply for OrbitPort early access at `spacecomputer.deform.cc/ctrngearlyaccess`
- [ ] Receive and configure OrbitPort credentials
- [ ] Create `/api/cosmic-entropy` route
- [ ] Install `@scure/bip39` dependency
- [ ] Create `cosmic-passphrase.ts` library
- [ ] Create `key-encryption.ts` library
- [ ] Update `storage.ts` with encrypted key schema
- [ ] Update `KeyGenStep.tsx` component
- [ ] Add passphrase display UI with confirmation checkbox
- [ ] Add "unlock with passphrase" flow for returning users
- [ ] Write tests for encryption/decryption round-trip
- [ ] Add fallback to local entropy when OrbitPort unavailable
- [ ] Update `.env.example` with OrbitPort variables

---

## Future Enhancements

1. **Hardware wallet support** - Allow Ledger/Trezor to hold Ed25519 key
2. **Social recovery** - Shamir secret sharing of passphrase
3. **OrbitPort signature display** - Show proof of cosmic origin in UI
4. **Key export** - Password-protected key backup file
5. **Multi-device sync** - Encrypted key blob in IPFS/cloud

---

## Timeline-Free Milestones

1. **Milestone 1**: API route and basic integration
2. **Milestone 2**: Passphrase generation and display
3. **Milestone 3**: Key encryption and updated storage
4. **Milestone 4**: Unlock flow for returning users
5. **Milestone 5**: Fallback handling and error states
6. **Milestone 6**: Testing and polish
