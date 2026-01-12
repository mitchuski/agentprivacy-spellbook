# Oracle Swordsman Inscription Flow Guide

**Last Updated:** 2025-12-03
**Protocol:** STM-rpp v01 (Swordsman to Mage Revelation Proof Protocol)

---

## CRITICAL FIXES DISCOVERED (2025-12-03)

### Fix 1: Reading Shielded Memos
**Problem:** `z_listunspent` returns garbled memos like `f6000...`
**Solution:** Use `z_listtransactions` with Account UUID (not account number!)

```javascript
// Account 0 UUID (Treasury)
const accountUUID = '0b8919a5-441b-4b63-a40f-fb0163e369a2';

// This returns DECRYPTED memos!
const response = await axios.post('http://127.0.0.1:28232', {
  jsonrpc: '2.0',
  id: Date.now(),
  method: 'z_listtransactions',
  params: [accountUUID, 100]  // UUID, not account number!
}, { auth: { username: user, password: pass } });
```

### Fix 2: Zallet z_sendmany Parameters
**Problems & Solutions:**
- `from` parameter: Use FULL UA address, NOT account number or UUID
- `fee` parameter: MUST be `null` (Zallet calculates internally)
- `privacy` parameter: `'AllowRevealedRecipients'` for deshield

```javascript
// CORRECT z_sendmany call
z_sendmany(
  'u1jjrsaxyradv3dq...full_ua_address',  // from: FULL UA, not "0" or UUID
  [{ address: destination, amount: 0.00618034 }],
  1,                                       // minconf
  null,                                    // fee: MUST be null!
  'AllowRevealedRecipients'               // privacy policy
)
```

### Fix 3: Hash Formula
```
H = SHA256(ORACLE_PROVERB + SUBMITTED_PROVERB)[0:16]
```
**CRITICAL:** No separator - proverbs concatenated directly, then take first 16 hex chars!

---

## Quick Reference - Account UUIDs
```
Account 0 (Treasury):     0b8919a5-441b-4b63-a40f-fb0163e369a2
Account 1 (Fee Reserve):  1092061e-c983-4b2d-a30f-3e07648e42f6
```

## Quick Reference - Verification Scripts
```bash
# GPT model (preferred)
node verify-act-gpt.js <ACT_NUMBER> "<PROVERB>" "<EMOJI>"
```

---

## Overview

This document describes the complete inscription flow for the Oracle Swordsman proverb protocol using the NEW key architecture from isolated TEE key ceremony.

---

## Key Architecture (t_keys_zypher)

- **Public Key:** `03a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223`
- **WIF:** `KwJH8HidEKxGUsK2PhRcg3ZXFewnoDvaTYkmhuTjrsM45ehCsFbm`
- **Simple P2SH:** `t3MczrqvRWXSNAFtxt3dqvJPwZ7rmHECoRs`
- **Simple Redeem Script:** `752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac`
- **Simple scriptPubKey:** `a914218bee8db33ab5a93db1439217ad0e9497cc7bc987`

---

## Act P2SH Addresses

| Act | P2SH Address | Redeem Script |
|-----|--------------|---------------|
| 1 | `t3gLXGanUTif8WLpX7EZXtR3kX5f1ZoWuUT` | `51752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac` |
| 2 | `t3UpuXZq8CrX2EubNYVDKo4nWRXbyZ5wVUV` | `52752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac` |
| 3 | `t3PPLb9EbeqSyzQwQgKwF9ugQNeFBxHtfeX` | `53752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac` |
| 4 | `t3hiQfbJ5K45qmm4H1Q6N6CZD3AoppyS63g` | `54752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac` |
| 5 | `t3fepr2dZh1xPEtZLf575kBBGNQa1U4AhuC` | `55752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac` |
| 6 | `t3UrTbeMjjUUbccNKCSEn9qfBRB3jJVF7A6` | `56752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac` |
| 7 | `t3cnddicBRoJDHPqU2NbHdArz7Cd9xEZ9Hs` | `57752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac` |
| 8 | `t3V4tmaxC48diu8qvQT8kPP2Kcr4btXEoDD` | `58752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac` |
| 9 | `t3cY6cRjiba4k3vu2vnKEGBBZWwA21zn6tg` | `59752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac` |
| 10 | `t3MYZJnESAw7tqwcECB611NLEZA6N51YPLj` | `5a752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac` |
| 11 | `t3eEy9gLy4o5Y62zBu2QEherULxfajFTz5R` | `5b752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac` |
| 12 | `t3aQzhfwgvocsrHt9fskS7htBc5brkWFVBm` | `5c752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac` |

**Note:** Redeem script format is `OP_<ACT> OP_DROP <pubkey> OP_CHECKSIG`
- OP_1 = 0x51, OP_2 = 0x52, ... OP_10 = 0x5a, OP_11 = 0x5b, OP_12 = 0x5c

---

## Complete Inscription Flow (9 Steps)

### Step 1: Craft Proverb on Frontend
- Navigate to Story page
- Select the Act number
- Craft the proverb text
- Generate emoji spell

### Step 2: Send Proverb to Oracle UA (Shielded)
User sends 0.01 ZEC to Oracle Unified Address with proverb in memo:
```
Oracle UA: u1jjrsaxyradv3dq03fa4wvk2husu2643v9m6rpnm8x7wmq0zdzv57ca0t5862yq9z7zx4h4d4r42rf85cup3xft6knntz5zglxkqxy8ekr0m2mx4s7cjsg5djq6dzlx9u7l8wlk85ha5t97nh9x3xm27qctlwvcezfeg0a96xnngu4u6fx05css4fzfv50vq0u3zy5vnfswvj5yzx0um
```

### Step 3: Oracle Views Incoming Transaction
Oracle uses viewing key to decrypt memo and extract proverb.
Record the incoming TXID as REF_TXID.

### Step 4: NEAR AI Verification
Call NEAR AI to compare submitted proverb with spellbook.
Record MATCH_SCORE (e.g., 0.86 for 86% match).

### Step 5: Golden Split Calculation
Split the 0.01 ZEC according to golden ratio:
- **61.8%** = 0.00618034 ZEC -> For inscription
- **38.2%** = 0.00381966 ZEC -> Protocol Fee Reserve

### Step 6: Deshield 61.8% to Act P2SH
```bash
# Using Zallet RPC (account-based)
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"z_sendmany",
    "params":[
      0,
      [{"address":"<ACT_P2SH>","amount":0.00618034}],
      1,
      null,
      "AllowRevealedRecipients"
    ]
  }'
```

### Step 7: Move 38.2% to Protocol Fee Reserve
```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"z_sendmany",
    "params":[
      0,
      [{"address":"u1m59drp9gsrkd6u4px5ywlgf2h9933859yeuflal7znm9my5gl6x88zyawsjxmpmyd8q03h98qhljugkrh7dcunuq5uvgj3nyvg32ne2dg0tycwmw5axmw9pg0dwpn70m8sx3340eer0s06khh005vm8s4yadmuj6t74clnxf3dujvmqc0sequ2h44ngx9wmwwzwfh633mrvzk0kkx93","amount":0.00381966}],
      1,
      null,
      "AllowLinkingAccountAddresses"
    ]
  }'
```

### Step 8: Spend Act P2SH to Simple P2SH
Create script `spend-act<N>-to-simple-p2sh.js` with:

```javascript
const UTXO = {
  txid: '<TXID_FROM_DESHIELD>',
  vout: 0,
  amount: 618034,
  scriptPubKey: '<ACT_SCRIPT_PUBKEY>', // From act-p2sh-addresses.json
};

// Act N redeem script from table above
const ACT_REDEEM_SCRIPT = '<ACT_REDEEM_SCRIPT>';

// Destination: Simple P2SH
const SIMPLE_P2SH_SCRIPT_PUBKEY = 'a914218bee8db33ab5a93db1439217ad0e9497cc7bc987';

const PRIVATE_KEY_WIF = 'KwJH8HidEKxGUsK2PhRcg3ZXFewnoDvaTYkmhuTjrsM45ehCsFbm';
```

Output: 608,034 zatoshis to Simple P2SH `t3MczrqvRWXSNAFtxt3dqvJPwZ7rmHECoRs`

### Step 9: Final Inscription Transaction
Create script `inscribe-act<N>.js` with:

```javascript
const UTXO = {
  txid: '<TXID_FROM_STEP_8>',
  vout: 0,
  amount: 608034,
  scriptPubKey: 'a914218bee8db33ab5a93db1439217ad0e9497cc7bc987',
};

// Simple redeem script: OP_DROP <pubkey> OP_CHECKSIG
const REDEEM_SCRIPT = '752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac';

// Treasury output
const OUTPUT_SCRIPT_PUBKEY = '76a914b4c497adf1dede7af6cfb631205dffdc4351ba2988ac';

const PRIVATE_KEY_WIF = 'KwJH8HidEKxGUsK2PhRcg3ZXFewnoDvaTYkmhuTjrsM45ehCsFbm';

// Inscription content
const SUBMITTED = '<ACTUAL_PROVERB_FROM_MEMO>';
const EMOJI_SPELL = '<EMOJI_SPELL>';
const REF_TXID = '<INCOMING_SHIELDED_TXID>';
const MATCH_SCORE = '<NEAR_AI_SCORE>';
```

Output: ~578,034 zatoshis to Treasury `t1aMR9MKx3xLso9c4Uq4MYX3cRvnDTp42av`

---

## Treasury Addresses

- **Treasury t1:** `t1aMR9MKx3xLso9c4Uq4MYX3cRvnDTp42av`
- **Treasury UA (Account 0):** `u1jjrsaxyradv3dq03fa4wvk2husu2643v9m6rpnm8x7wmq0zdzv57ca0t5862yq9z7zx4h4d4r42rf85cup3xft6knntz5zglxkqxy8ekr0m2mx4s7cjsg5djq6dzlx9u7l8wlk85ha5t97nh9x3xm27qctlwvcezfeg0a96xnngu4u6fx05css4fzfv50vq0u3zy5vnfswvj5yzx0um`
- **Protocol Fee Reserve (Account 1):** `u1m59drp9gsrkd6u4px5ywlgf2h9933859yeuflal7znm9my5gl6x88zyawsjxmpmyd8q03h98qhljugkrh7dcunuq5uvgj3nyvg32ne2dg0tycwmw5axmw9pg0dwpn70m8sx3340eer0s06khh005vm8s4yadmuj6t74clnxf3dujvmqc0sequ2h44ngx9wmwwzwfh633mrvzk0kkx93`

---

## Inscription Format (STM-rpp)

```
STM-rpp[v01]|ACT:<N>|E:<EMOJI_SPELL>|<PROVERB>|MS:<MATCH_SCORE>|H:<SHA256_HASH>|REF:<INCOMING_TXID>
```

Hash is computed from:
```javascript
const contentToHash = `STM-rpp[v01]|ACT:${ACT}|E:${EMOJI_SPELL}|${PROVERB}|MS:${MATCH_SCORE}`;
const proverbHash = crypto.createHash('sha256').update(contentToHash).digest('hex');
```

---

## Script Configuration Checklist

Before running inscription scripts, verify:

```javascript
// UTXO - must match previous step's output
const UTXO = {
  txid: '<TXID_FROM_PREVIOUS_STEP>',
  vout: 0,
  amount: <AMOUNT_IN_ZATOSHIS>,
  scriptPubKey: '<CORRECT_SCRIPT_PUBKEY>'
};

// For Act P2SH spend:
// - scriptPubKey from act-p2sh-addresses.json for that act
// - REDEEM_SCRIPT from act-p2sh-addresses.json for that act

// For Simple P2SH spend (inscription):
// - scriptPubKey: a914218bee8db33ab5a93db1439217ad0e9497cc7bc987
// - REDEEM_SCRIPT: 752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac

// Always use NEW WIF:
const PRIVATE_KEY_WIF = 'KwJH8HidEKxGUsK2PhRcg3ZXFewnoDvaTYkmhuTjrsM45ehCsFbm';
```

---

## Common Errors & Fixes Table

| Error | Cause | Fix |
|-------|-------|-----|
| `invalid type: integer 0, expected a string` | Using account number `0` as `from` | Use full UA address |
| `Invalid from address: should be a taddr, zaddr, UA` | Using account UUID as `from` | Use full UA address |
| `fee field must be null` | Specifying fee amount like `10000` | Set fee to `null` |
| Garbled memo `f6000...` in z_listunspent | Wrong RPC method | Use `z_listtransactions` with UUID |
| `Insufficient balance` | Not enough shielded funds | Check balance, wait for confirms |
| Signature validation failed | Wrong UTXO scriptPubKey or key | Verify UTXO matches act-p2sh-addresses.json |

---

## Step-by-Step Quick Commands

### 1. Find All Incoming Proverb Submissions
```bash
cd C:/Users/mitch/agentprivacy_zypher/oracle-swordsman
node -e "
const axios = require('axios');
require('dotenv').config();
async function main() {
  const user = process.env.ZALLET_RPC_USER;
  const pass = process.env.ZALLET_RPC_PASS;
  const response = await axios.post('http://127.0.0.1:28232', {
    jsonrpc: '2.0', id: 1, method: 'z_listtransactions',
    params: ['0b8919a5-441b-4b63-a40f-fb0163e369a2', 100]
  }, { auth: { username: user, password: pass } });
  for (const tx of response.data.result || []) {
    if (tx.outputs?.[0]?.memo) {
      console.log('TXID:', tx.txid);
      console.log('Memo:', tx.outputs[0].memo.substring(0, 100));
      console.log('---');
    }
  }
}
main();
"
```

### 2. Verify Proverb with NEAR AI
```bash
node verify-act-gpt.js 11 "submitted proverb here" "emoji spell here"
```

### 3. Deshield to Act P2SH (61.8%)
```bash
node -e "
const axios = require('axios');
require('dotenv').config();
async function main() {
  const user = process.env.ZALLET_RPC_USER;
  const pass = process.env.ZALLET_RPC_PASS;
  const treasuryUA = 'u1jjrsaxyradv3dq03fa4wvk2husu2643v9m6rpnm8x7wmq0zdzv57ca0t5862yq9z7zx4h4d4r42rf85cup3xft6knntz5zglxkqxy8ekr0m2mx4s7cjsg5djq6dzlx9u7l8wlk85ha5t97nh9x3xm27qctlwvcezfeg0a96xnngu4u6fx05css4fzfv50vq0u3zy5vnfswvj5yzx0um';
  const actP2SH = 'YOUR_ACT_P2SH_ADDRESS';
  const response = await axios.post('http://127.0.0.1:28232', {
    jsonrpc: '2.0', id: 1, method: 'z_sendmany',
    params: [treasuryUA, [{address: actP2SH, amount: 0.00618034}], 1, null, 'AllowRevealedRecipients']
  }, { auth: { username: user, password: pass } });
  console.log('OpID:', response.data.result);
  await new Promise(r => setTimeout(r, 15000));
  const status = await axios.post('http://127.0.0.1:28232', {
    jsonrpc: '2.0', id: 2, method: 'z_getoperationstatus', params: [[response.data.result]]
  }, { auth: { username: user, password: pass } });
  console.log('Status:', status.data.result?.[0]?.status);
  console.log('TXID:', status.data.result?.[0]?.result?.txid);
}
main();
"
```

### 4. Get Account 1 UA for Protocol Fee Reserve
```bash
node -e "
const axios = require('axios');
require('dotenv').config();
async function main() {
  const user = process.env.ZALLET_RPC_USER;
  const pass = process.env.ZALLET_RPC_PASS;
  const response = await axios.post('http://127.0.0.1:28232', {
    jsonrpc: '2.0', id: 1, method: 'z_getaddressforaccount',
    params: ['1092061e-c983-4b2d-a30f-3e07648e42f6']
  }, { auth: { username: user, password: pass } });
  console.log('Account 1 UA:', response.data.result.address);
}
main();
"
```

---

## Completed Inscriptions (2025-12-03)

| Act | Inscription TXID | MS | Hash |
|-----|------------------|-----|------|
| 10 | `7a4ff784935bcaf4ee9d711931ad367ec7e8ed647ce756392800a9729a80c100` | 0.95 | `e2d875d96cb7bfda` |
| 11 | `32a601ed83d2214c776a70b5e1068e892224c4500a20d1ed450d3d72c5bd3c60` | 0.92 | `1efc4f15907686cd` |
| 12 | `293cf3245ac8c58dd85f3a28b94f87f397d81e26f3ed157864bcb7357c3d566e` | 0.78 | `ccd7f0b32c7742be` |

---

## File Locations

- **Keys & Proofs:** `C:/Users/mitch/t_keys_zypher/`
  - `pubkey.txt` - Public key
  - `wif.txt` - Private key WIF
  - `act-p2sh-addresses.json` - All act P2SH addresses
  - `ACT<N>_INSCRIPTION_PROOF.md` - Proof documents
- **Scripts:** `C:/Users/mitch/agentprivacy_zypher/oracle-swordsman/`
  - `verify-act-gpt.js` - NEAR AI verification
  - `spend-act<N>-to-simple-p2sh.js` - Intermediate spend
  - `inscribe-act<N>-final.js` - Final inscription

---

## Speed Tips for Tomorrow

1. **Batch find all incoming submissions first** - Run Step 1 command once
2. **Copy existing scripts** - Just update UTXO, proverbs, and act numbers
3. **Check balance before protocol fee reserve** - May need to skip if insufficient
4. **Use verify-act-gpt.js** (not deepseek version)
5. **Remember:** z_sendmany needs FULL UA, not account number!

---

## Fee Structure

| Step | Fee (zatoshis) | Purpose |
|------|----------------|---------|
| Deshield | ~10,000 | z->t transaction (Zallet auto) |
| Act P2SH -> Simple P2SH | 10,000 | Intermediate hop |
| Inscription | 30,000 | ZIP-317 for larger tx |

---

*Last updated: 2025-12-03*
*Protocol: STM-rpp v01 | Oracle Swordsman | Privacy Spellbook*
