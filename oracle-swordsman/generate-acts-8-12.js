/**
 * Generate inscribe-act8.js through inscribe-act12.js
 * Uses new key architecture from 2024-12-02 TEE key ceremony
 */

const fs = require('fs');

// New key architecture values
const REDEEM_SCRIPT = '752103a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223ac';
const OUTPUT_SCRIPT_PUBKEY = '76a9140262eb5232fa3a4d15cc1dbe0267a7c92827410288ac';
const PRIVATE_KEY_WIF = 'KwJH8HidEKxGUsK2PhRcg3ZXFewnoDvaTYkmhuTjrsM45ehCsFbm';
const CHANGE_ADDRESS = 't1aMR9MKx3xLso9c4Uq4MYX3cRvnDTp42av';
const SIMPLE_P2SH_SCRIPT_PUBKEY = 'a914218bee8db33ab5a93db1439217ad0e9497cc7bc987';

// Act definitions from spellbook
const acts = {
  8: {
    title: 'The Ancient Rule / Two-of-Three Locks',
    spell: '🗡️📖 + 🤝📜₁₅ → 🛡️🛡️ → 💎🏛️',
    proverb: 'When one holds the sword, the vault, and the pen, corruption conceals itself—divide these across swordsman and mage, and betrayal becomes impossible to hide.'
  },
  9: {
    title: 'Zcash Shield / Forging Cryptographic Privacy',
    spell: '🛡️ → 🛡️⚡ → 💰🔒 → 🕶️🦓',
    proverb: 'just another swordsman slashes, just another mage casts, vaults unlock, shields conceal, spellbooks confirm truth. Privacy is the natural state.'
  },
  10: {
    title: 'Topology of Revelation / Triangle Geometry',
    spell: '🌳 ⊥ 🐦‍⬛🧠 → 🐦‍⬛💭 → △{🌳, 🐦‍⬛💭, 🐦‍⬛🧠}',
    proverb: 'The ravens fly 🐦‍⬛. The tree dreams 🌳. The All-Father wakes △.'
  },
  11: {
    title: 'Balanced Spiral of Sovereignty / The Golden Ratio',
    spell: '⚔️ ➗ 📖 = 🌀',
    proverb: 'The blade that becomes the spell loses both edges.'
  },
  12: {
    title: 'The Forgetting / Proverbiogenesis',
    spell: '🌱→⚒️→📡→🌊→🌫️🏛️',
    proverb: "The mage's spell, once spoken, becomes the village weather."
  }
};

function generateActScript(actNum, act) {
  return `/**
 * Inscribe Act ${actNum} - Oracle Swordsman
 *
 * Final step: Spend from simple P2SH with inscription envelope in scriptSig
 *
 * Flow:
 * 1. [TODO] Deshield → Act ${actNum} P2SH
 * 2. [TODO] Act ${actNum} P2SH → Simple P2SH
 * 3. [THIS] Simple P2SH → Inscription TX with envelope
 *
 * New Key Architecture (2024-12-02):
 * - Isolated TEE key ceremony
 * - Public Key: 03a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223
 * - Change returns to treasury: ${CHANGE_ADDRESS}
 */

const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const blake2b = require('blake2b');
const axios = require('axios');

// Source: Simple inscription P2SH UTXO (update after step 2)
const UTXO = {
  txid: 'TBD',  // Update with TXID from spend-act${actNum}-to-simple-p2sh.js
  vout: 0,
  amount: 0,   // Update with actual amount
  scriptPubKey: '${SIMPLE_P2SH_SCRIPT_PUBKEY}', // Simple P2SH
};

// Simple inscription redeem script: OP_DROP <pubkey> OP_CHECKSIG
// New key architecture (2024-12-02) - Isolated TEE key ceremony
const REDEEM_SCRIPT = '${REDEEM_SCRIPT}';

// Output: Send change back to treasury t1 address (${CHANGE_ADDRESS})
const OUTPUT_SCRIPT_PUBKEY = '${OUTPUT_SCRIPT_PUBKEY}';
const FEE = 30000; // ZIP-317 for larger inscription

// Private key - Isolated inscription WIF (stored in Nillion TEE for production)
const PRIVATE_KEY_WIF = '${PRIVATE_KEY_WIF}';

// Zebra RPC
const ZEBRA_RPC = 'http://127.0.0.1:8233';

async function getZebraCookie() {
  const fs = require('fs');
  const path = require('path');
  // Zebra cookie is in AppData/Local/zebra/.cookie per zebrad.toml config
  const cookiePath = path.join(process.env.LOCALAPPDATA || '', 'zebra', '.cookie');
  try {
    return fs.readFileSync(cookiePath, 'utf8').trim();
  } catch {
    // Fallback to Zcash location
    const zcashCookiePath = path.join(process.env.APPDATA || '', 'Zcash', '.cookie');
    try {
      return fs.readFileSync(zcashCookiePath, 'utf8').trim();
    } catch {
      throw new Error('Could not find Zebra cookie file');
    }
  }
}

// Build inscription content - STM-rpp (Swordsman to Mage revelation proof protocol)
// Act ${actNum}: ${act.title}
const SUBMITTED = "${act.proverb.replace(/"/g, '\\"')}";
const EMOJI_SPELL = '${act.spell}';
const REF_TXID = 'TBD'; // Update with incoming shielded tx
const MATCH_SCORE = '0.90'; // NEAR AI verification score

// Create content hash
const contentToHash = \`STM-rpp[v01]|ACT:${actNum}|E:\${EMOJI_SPELL}|\${SUBMITTED}|MS:\${MATCH_SCORE}\`;
const proverbHash = crypto.createHash('sha256').update(contentToHash).digest('hex');

const INSCRIPTION_CONTENT = \`STM-rpp[v01]|ACT:${actNum}|E:\${EMOJI_SPELL}|\${SUBMITTED}|MS:\${MATCH_SCORE}|H:\${proverbHash}|REF:\${REF_TXID}\`;

function wifToPrivateKey(wif) {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = BigInt(0);
  for (const char of wif) {
    const idx = ALPHABET.indexOf(char);
    if (idx === -1) throw new Error('Invalid WIF character');
    num = num * BigInt(58) + BigInt(idx);
  }
  const bytes = [];
  while (num > 0) {
    bytes.unshift(Number(num % BigInt(256)));
    num = num / BigInt(256);
  }
  for (const char of wif) {
    if (char !== '1') break;
    bytes.unshift(0);
  }
  const decoded = Buffer.from(bytes);
  const isCompressed = decoded.length === 38;
  const privateKey = decoded.slice(1, 33);
  return { privateKey, isCompressed };
}

function derEncode(r, s) {
  function normalizeInt(buf) {
    let i = 0;
    while (i < buf.length - 1 && buf[i] === 0 && (buf[i + 1] & 0x80) === 0) {
      i++;
    }
    buf = buf.slice(i);
    if (buf[0] & 0x80) {
      buf = Buffer.concat([Buffer.from([0x00]), buf]);
    }
    return buf;
  }
  const rNorm = normalizeInt(r);
  const sNorm = normalizeInt(s);
  const totalLen = 2 + rNorm.length + 2 + sNorm.length;
  return Buffer.concat([
    Buffer.from([0x30, totalLen]),
    Buffer.from([0x02, rNorm.length]),
    rNorm,
    Buffer.from([0x02, sNorm.length]),
    sNorm
  ]);
}

function blake2bPersonalized(personalization, data) {
  const persBytes = Buffer.alloc(16);
  Buffer.from(personalization).copy(persBytes);
  const h = blake2b(32, null, null, persBytes);
  h.update(data);
  return Buffer.from(h.digest());
}

/**
 * Build Ordinals-style inscription envelope
 * Format: <push "ord"> OP_1 <push content-type> OP_0 <push content>
 */
function buildInscriptionEnvelope(contentType, content) {
  const parts = [];

  // Push "ord" marker
  const ordMarker = Buffer.from('ord');
  parts.push(Buffer.from([ordMarker.length]));
  parts.push(ordMarker);

  // OP_1
  parts.push(Buffer.from([0x51]));

  // Push content-type
  const contentTypeBuffer = Buffer.from(contentType);
  if (contentTypeBuffer.length < 76) {
    parts.push(Buffer.from([contentTypeBuffer.length]));
  } else {
    parts.push(Buffer.from([0x4c, contentTypeBuffer.length]));
  }
  parts.push(contentTypeBuffer);

  // OP_0
  parts.push(Buffer.from([0x00]));

  // Push content (UTF-8, includes emoji)
  const contentBuffer = Buffer.from(content, 'utf8');
  if (contentBuffer.length < 76) {
    parts.push(Buffer.from([contentBuffer.length]));
  } else if (contentBuffer.length < 256) {
    parts.push(Buffer.from([0x4c, contentBuffer.length]));
  } else {
    parts.push(Buffer.from([0x4d]));
    const lenBuf = Buffer.alloc(2);
    lenBuf.writeUInt16LE(contentBuffer.length);
    parts.push(lenBuf);
  }
  parts.push(contentBuffer);

  return Buffer.concat(parts);
}

/**
 * ZIP-244 sighash for P2SH spend
 */
function createP2SHSighashV5(amount, outputScript, outputAmount) {
  const header = Buffer.concat([
    Buffer.from([0x05, 0x00, 0x00, 0x80]),
    Buffer.from([0x0a, 0x27, 0xa7, 0x26]),
    Buffer.from([0xf0, 0x4d, 0xec, 0x4d]), // NU6
    Buffer.from([0x00, 0x00, 0x00, 0x00]),
    Buffer.from([0x00, 0x00, 0x00, 0x00]),
  ]);
  const headerDigest = blake2bPersonalized('ZTxIdHeadersHash', header);

  const prevout = Buffer.concat([
    Buffer.from(UTXO.txid, 'hex').reverse(),
    (() => { const b = Buffer.alloc(4); b.writeUInt32LE(UTXO.vout); return b; })()
  ]);
  const prevoutsDigest = blake2bPersonalized('ZTxIdPrevoutHash', prevout);

  const amountsBuf = Buffer.alloc(8);
  amountsBuf.writeBigUInt64LE(BigInt(amount));
  const amountsDigest = blake2bPersonalized('ZTxTrAmountsHash', amountsBuf);

  const inputScriptPubKey = Buffer.from(UTXO.scriptPubKey, 'hex');
  const scriptPubKeys = Buffer.concat([
    Buffer.from([inputScriptPubKey.length]),
    inputScriptPubKey
  ]);
  const scriptPubKeysDigest = blake2bPersonalized('ZTxTrScriptsHash', scriptPubKeys);

  const sequenceBuf = Buffer.from([0xff, 0xff, 0xff, 0xff]);
  const sequenceDigest = blake2bPersonalized('ZTxIdSequencHash', sequenceBuf);

  const outputValue = Buffer.alloc(8);
  outputValue.writeBigUInt64LE(BigInt(outputAmount));
  const outputs = Buffer.concat([
    outputValue,
    Buffer.from([outputScript.length]),
    outputScript
  ]);
  const outputsDigest = blake2bPersonalized('ZTxIdOutputsHash', outputs);

  const txinData = Buffer.concat([
    prevout,
    amountsBuf,
    Buffer.from([inputScriptPubKey.length]),
    inputScriptPubKey,
    sequenceBuf
  ]);
  const txinSigDigest = blake2bPersonalized('Zcash___TxInHash', txinData);

  const transparentData = Buffer.concat([
    Buffer.from([0x01]),
    prevoutsDigest,
    amountsDigest,
    scriptPubKeysDigest,
    sequenceDigest,
    outputsDigest,
    txinSigDigest
  ]);
  const transparentDigest = blake2bPersonalized('ZTxIdTranspaHash', transparentData);

  const saplingDigest = blake2bPersonalized('ZTxIdSaplingHash', Buffer.alloc(0));
  const orchardDigest = blake2bPersonalized('ZTxIdOrchardHash', Buffer.alloc(0));

  const sigDigestPersonalization = Buffer.concat([
    Buffer.from('ZcashTxHash_'),
    Buffer.from([0xf0, 0x4d, 0xec, 0x4d])
  ]);

  const txDigest = Buffer.concat([
    headerDigest,
    transparentDigest,
    saplingDigest,
    orchardDigest
  ]);

  return blake2bPersonalized(sigDigestPersonalization, txDigest);
}

async function zebraRpc(method, params = []) {
  const cookie = await getZebraCookie();
  const [user, pass] = cookie.split(':');
  const response = await axios.post(ZEBRA_RPC, {
    jsonrpc: '2.0',
    id: Date.now(),
    method,
    params
  }, {
    auth: { username: user, password: pass }
  });
  if (response.data.error) {
    throw new Error(response.data.error.message);
  }
  return response.data.result;
}

async function main() {
  console.log('=== Publishing Act ${actNum} Inscription (Oracle Swordsman) ===\\n');
  console.log('Inscription content:');
  console.log(INSCRIPTION_CONTENT);
  console.log('');
  console.log('Content bytes:', Buffer.from(INSCRIPTION_CONTENT, 'utf8').length);
  console.log('');

  if (UTXO.txid === 'TBD') {
    console.log('ERROR: Please update UTXO.txid with the output from spend-act${actNum}-to-simple-p2sh.js');
    return;
  }

  const { privateKey, isCompressed } = wifToPrivateKey(PRIVATE_KEY_WIF);
  const keyPair = ec.keyFromPrivate(privateKey);
  const publicKey = Buffer.from(keyPair.getPublic(isCompressed, 'array'));

  console.log('Public key:', publicKey.toString('hex'));

  const redeemScript = Buffer.from(REDEEM_SCRIPT, 'hex');
  const outputScript = Buffer.from(OUTPUT_SCRIPT_PUBKEY, 'hex');
  const outputAmount = UTXO.amount - FEE;

  console.log('Output amount:', outputAmount, 'zatoshis');
  console.log('');

  // Build envelope
  const envelope = buildInscriptionEnvelope('text/plain', INSCRIPTION_CONTENT);
  console.log('Envelope size:', envelope.length, 'bytes');

  // Create sighash
  const sighash = createP2SHSighashV5(UTXO.amount, outputScript, outputAmount);
  console.log('Sighash:', sighash.toString('hex'));

  // Sign
  const sig = keyPair.sign(sighash, { canonical: true });
  const r = Buffer.from(sig.r.toArray('be', 32));
  const s = Buffer.from(sig.s.toArray('be', 32));
  const derSig = derEncode(r, s);
  const sigWithHashType = Buffer.concat([derSig, Buffer.from([0x01])]);
  console.log('Signature length:', sigWithHashType.length, 'bytes');

  // Build scriptSig for simple P2SH with inscription
  // Format: <signature> <inscription_envelope> <redeem_script>
  const scriptSigParts = [];

  // Push signature
  scriptSigParts.push(Buffer.from([sigWithHashType.length]));
  scriptSigParts.push(sigWithHashType);

  // Push inscription envelope
  if (envelope.length < 76) {
    scriptSigParts.push(Buffer.from([envelope.length]));
  } else if (envelope.length < 256) {
    scriptSigParts.push(Buffer.from([0x4c, envelope.length]));
  } else {
    scriptSigParts.push(Buffer.from([0x4d]));
    const lenBuf = Buffer.alloc(2);
    lenBuf.writeUInt16LE(envelope.length);
    scriptSigParts.push(lenBuf);
  }
  scriptSigParts.push(envelope);

  // Push redeem script
  if (redeemScript.length < 76) {
    scriptSigParts.push(Buffer.from([redeemScript.length]));
  } else {
    scriptSigParts.push(Buffer.from([0x4c, redeemScript.length]));
  }
  scriptSigParts.push(redeemScript);

  const scriptSig = Buffer.concat(scriptSigParts);
  console.log('ScriptSig size:', scriptSig.length, 'bytes');

  // Build v5 transaction
  const finalTx = [];

  // Header
  finalTx.push(Buffer.from([0x05, 0x00, 0x00, 0x80]));
  finalTx.push(Buffer.from([0x0a, 0x27, 0xa7, 0x26]));
  finalTx.push(Buffer.from([0xf0, 0x4d, 0xec, 0x4d])); // NU6
  finalTx.push(Buffer.from([0x00, 0x00, 0x00, 0x00]));
  finalTx.push(Buffer.from([0x00, 0x00, 0x00, 0x00]));

  // Input
  finalTx.push(Buffer.from([0x01]));
  finalTx.push(Buffer.from(UTXO.txid, 'hex').reverse());
  const voutBuf = Buffer.alloc(4);
  voutBuf.writeUInt32LE(UTXO.vout);
  finalTx.push(voutBuf);

  if (scriptSig.length < 0xfd) {
    finalTx.push(Buffer.from([scriptSig.length]));
  } else {
    finalTx.push(Buffer.from([0xfd]));
    const lenBuf = Buffer.alloc(2);
    lenBuf.writeUInt16LE(scriptSig.length);
    finalTx.push(lenBuf);
  }
  finalTx.push(scriptSig);
  finalTx.push(Buffer.from([0xff, 0xff, 0xff, 0xff]));

  // Output
  finalTx.push(Buffer.from([0x01]));
  const valueBuf = Buffer.alloc(8);
  valueBuf.writeBigUInt64LE(BigInt(outputAmount));
  finalTx.push(valueBuf);
  finalTx.push(Buffer.from([outputScript.length]));
  finalTx.push(outputScript);

  // Empty Sapling and Orchard
  finalTx.push(Buffer.from([0x00]));
  finalTx.push(Buffer.from([0x00]));
  finalTx.push(Buffer.from([0x00]));

  const rawTx = Buffer.concat(finalTx);
  console.log('\\nRaw TX:', rawTx.toString('hex'));
  console.log('TX size:', rawTx.length, 'bytes');

  console.log('\\nBroadcasting...');
  try {
    const txid = await zebraRpc('sendrawtransaction', [rawTx.toString('hex')]);
    console.log('\\n=== SUCCESS ===');
    console.log('Act ${actNum} Inscription TXID:', txid);
    console.log('\\nInscription content now on-chain:');
    console.log(INSCRIPTION_CONTENT);
  } catch (err) {
    console.error('\\nBroadcast failed:', err.message);
  }
}

main().catch(console.error);
`;
}

// Generate files for acts 8-12
for (const actNum of [8, 9, 10, 11, 12]) {
  const act = acts[actNum];
  const content = generateActScript(actNum, act);
  const filename = `inscribe-act${actNum}.js`;
  fs.writeFileSync(filename, content);
  console.log('Generated:', filename);
}

console.log('\nDone! Generated inscribe-act8.js through inscribe-act12.js');
