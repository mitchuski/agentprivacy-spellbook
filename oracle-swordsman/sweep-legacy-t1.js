/**
 * Sweep funds from legacy t1 address to new wallet
 * Leaves 0.001337 ZEC (1337 easter egg) in the old address
 *
 * Spends 9 UTXOs from t1Ko5s5CrSnAPxg3kq6JUwsz4paxzLBJY2Q
 * Total: 5,265,467 zatoshis (0.05265467 ZEC)
 */

const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const blake2b = require('blake2b');

// All UTXOs to sweep
const UTXOS = [
  { txid: '8d10b5dff7aa09e7f07cdc6431dc6fd418e190ae176c22af3ba3deeebb693e8d', vout: 0, satoshis: 558000 },
  { txid: '16ff875586e414393695b4395f77938fb0bcf4889476fc8399e534f5385d3c7f', vout: 0, satoshis: 618000 },
  { txid: 'f34b41aac8bfc75453eb419b577c59b186f26bc2fdd3b730fdd9533d0816195f', vout: 0, satoshis: 618000 },
  { txid: 'a9580a2fec5b3413822b9349965b9ef502e7836975236c6050b90fbec3d41061', vout: 0, satoshis: 520000 },
  { txid: '16437aa6dc0830fd53253a42e28fd3581086db396616636c3c57de2a9a2b97b3', vout: 0, satoshis: 570000 },
  { txid: '53bd4f1591bfefbec80d170cafd3f7af603dbd7e10abc5c8db1315d7a38f27a7', vout: 0, satoshis: 647365 },
  { txid: 'd68729de207b1c5f33d27de363695f4f2514d440f35fe96717bad599928b1163', vout: 0, satoshis: 578034 },
  { txid: '02c6573b555d10ef85826693a25cd438148c7981dfdfcf3bc0edd29f32586ebf', vout: 0, satoshis: 578034 },
  { txid: '93ca15f64ea3b067921286df86dd02efdea94ba54b1c35e270fcbe6b2931c864', vout: 0, satoshis: 578034 },
];

// Source address scriptPubKey (P2PKH for t1Ko5s5CrSnAPxg3kq6JUwsz4paxzLBJY2Q)
const SOURCE_SCRIPT_PUBKEY = '76a91415156d12c747a448279d0eb8128e726c83e1860388ac';
const LEGACY_ADDRESS = 't1Ko5s5CrSnAPxg3kq6JUwsz4paxzLBJY2Q';

// Private key for t1Ko5s5CrSnAPxg3kq6JUwsz4paxzLBJY2Q
const PRIVATE_KEY_WIF = 'KzoH5Lehi3AM4TagFAto1V3Pj18hsMR4oNDMf5oDzskJeTi2xty1';

// Leave 0.001337 ZEC in legacy address (leet bounty!)
const CHANGE_AMOUNT = 133700; // 0.001337 ZEC in zatoshis

// Fee calculation: ZIP-317 for 9 inputs, 2 outputs
// logical_actions = max(9, 2) = 9
// fee = max(5000, marginal_fee) * 9 = 5000 * 9 = 45000 zatoshis minimum
const FEE = 50000; // 0.0005 ZEC - slightly higher for safety

const TOTAL_INPUT = UTXOS.reduce((sum, u) => sum + u.satoshis, 0);
const OUTPUT_AMOUNT = TOTAL_INPUT - FEE - CHANGE_AMOUNT;

console.log('=== Legacy T1 Sweep Transaction (with 1337 bounty) ===');
console.log('From: t1Ko5s5CrSnAPxg3kq6JUwsz4paxzLBJY2Q');
console.log('UTXOs:', UTXOS.length);
console.log('Total input:', TOTAL_INPUT, 'zatoshis (', TOTAL_INPUT / 100000000, 'ZEC)');
console.log('Fee:', FEE, 'zatoshis (', FEE / 100000000, 'ZEC)');
console.log('Change (1337 bounty):', CHANGE_AMOUNT, 'zatoshis (', CHANGE_AMOUNT / 100000000, 'ZEC)');
console.log('Output to new wallet:', OUTPUT_AMOUNT, 'zatoshis (', OUTPUT_AMOUNT / 100000000, 'ZEC)');
console.log('');

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
    while (i < buf.length - 1 && buf[i] === 0 && (buf[i + 1] & 0x80) === 0) i++;
    buf = buf.slice(i);
    if (buf[0] & 0x80) buf = Buffer.concat([Buffer.from([0x00]), buf]);
    return buf;
  }
  const rNorm = normalizeInt(r);
  const sNorm = normalizeInt(s);
  const totalLen = 2 + rNorm.length + 2 + sNorm.length;
  return Buffer.concat([
    Buffer.from([0x30, totalLen]),
    Buffer.from([0x02, rNorm.length]), rNorm,
    Buffer.from([0x02, sNorm.length]), sNorm
  ]);
}

function blake2bPersonalized(personalization, data) {
  const persBytes = Buffer.alloc(16);
  Buffer.from(personalization).copy(persBytes);
  const h = blake2b(32, null, null, persBytes);
  h.update(data);
  return Buffer.from(h.digest());
}

// Convert t-address to scriptPubKey
function t1AddressToScriptPubKey(address) {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = BigInt(0);
  for (const char of address) {
    const idx = ALPHABET.indexOf(char);
    if (idx === -1) throw new Error('Invalid address character');
    num = num * BigInt(58) + BigInt(idx);
  }
  const bytes = [];
  while (num > 0) {
    bytes.unshift(Number(num % BigInt(256)));
    num = num / BigInt(256);
  }
  for (const char of address) {
    if (char !== '1') break;
    bytes.unshift(0);
  }

  const decoded = Buffer.from(bytes);
  const hash160 = decoded.slice(2, 22);

  return Buffer.concat([
    Buffer.from([0x76, 0xa9, 0x14]),
    hash160,
    Buffer.from([0x88, 0xac])
  ]);
}

/**
 * ZIP-244 sighash for multi-input, multi-output transaction
 */
function createSighashForInput(inputIndex, allUtxos, outputs) {
  // Header digest
  const header = Buffer.concat([
    Buffer.from([0x05, 0x00, 0x00, 0x80]),
    Buffer.from([0x0a, 0x27, 0xa7, 0x26]),
    Buffer.from([0xf0, 0x4d, 0xec, 0x4d]),
    Buffer.from([0x00, 0x00, 0x00, 0x00]),
    Buffer.from([0x00, 0x00, 0x00, 0x00]),
  ]);
  const headerDigest = blake2bPersonalized('ZTxIdHeadersHash', header);

  // Prevouts digest
  const prevoutsData = Buffer.concat(allUtxos.map(utxo => {
    const voutBuf = Buffer.alloc(4);
    voutBuf.writeUInt32LE(utxo.vout);
    return Buffer.concat([Buffer.from(utxo.txid, 'hex').reverse(), voutBuf]);
  }));
  const prevoutsDigest = blake2bPersonalized('ZTxIdPrevoutHash', prevoutsData);

  // Amounts digest
  const amountsData = Buffer.concat(allUtxos.map(utxo => {
    const buf = Buffer.alloc(8);
    buf.writeBigUInt64LE(BigInt(utxo.satoshis));
    return buf;
  }));
  const amountsDigest = blake2bPersonalized('ZTxTrAmountsHash', amountsData);

  // ScriptPubKeys digest
  const scriptCode = Buffer.from(SOURCE_SCRIPT_PUBKEY, 'hex');
  const scriptPubKeysData = Buffer.concat(allUtxos.map(() => {
    return Buffer.concat([Buffer.from([scriptCode.length]), scriptCode]);
  }));
  const scriptPubKeysDigest = blake2bPersonalized('ZTxTrScriptsHash', scriptPubKeysData);

  // Sequence digest
  const sequenceData = Buffer.concat(allUtxos.map(() => Buffer.from([0xff, 0xff, 0xff, 0xff])));
  const sequenceDigest = blake2bPersonalized('ZTxIdSequencHash', sequenceData);

  // Outputs digest (multiple outputs!)
  const outputsData = Buffer.concat(outputs.map(out => {
    const valueBuf = Buffer.alloc(8);
    valueBuf.writeBigUInt64LE(BigInt(out.amount));
    return Buffer.concat([
      valueBuf,
      Buffer.from([out.scriptPubKey.length]),
      out.scriptPubKey
    ]);
  }));
  const outputsDigest = blake2bPersonalized('ZTxIdOutputsHash', outputsData);

  // TxIn digest for THIS input
  const thisUtxo = allUtxos[inputIndex];
  const thisPrevout = Buffer.concat([
    Buffer.from(thisUtxo.txid, 'hex').reverse(),
    (() => { const b = Buffer.alloc(4); b.writeUInt32LE(thisUtxo.vout); return b; })()
  ]);
  const thisAmount = Buffer.alloc(8);
  thisAmount.writeBigUInt64LE(BigInt(thisUtxo.satoshis));

  const txinData = Buffer.concat([
    thisPrevout,
    thisAmount,
    Buffer.from([scriptCode.length]),
    scriptCode,
    Buffer.from([0xff, 0xff, 0xff, 0xff])
  ]);
  const txinSigDigest = blake2bPersonalized('Zcash___TxInHash', txinData);

  // Transparent bundle digest
  // Flag 0x01 for non-anyonecanpay SIGHASH_ALL
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

  // Empty sapling and orchard
  const saplingDigest = blake2bPersonalized('ZTxIdSaplingHash', Buffer.alloc(0));
  const orchardDigest = blake2bPersonalized('ZTxIdOrchardHash', Buffer.alloc(0));

  // Final sighash
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

function buildTransaction(destScriptPubKey, changeScriptPubKey) {
  const { privateKey, isCompressed } = wifToPrivateKey(PRIVATE_KEY_WIF);
  const keyPair = ec.keyFromPrivate(privateKey);
  const publicKey = Buffer.from(keyPair.getPublic(isCompressed, 'array'));

  console.log('Public key:', publicKey.toString('hex'));

  // Define outputs: [destination, change]
  const outputs = [
    { amount: OUTPUT_AMOUNT, scriptPubKey: destScriptPubKey },
    { amount: CHANGE_AMOUNT, scriptPubKey: changeScriptPubKey }
  ];

  console.log('Signing', UTXOS.length, 'inputs...');

  // Sign each input
  const signatures = [];
  for (let i = 0; i < UTXOS.length; i++) {
    const sighash = createSighashForInput(i, UTXOS, outputs);
    const sig = keyPair.sign(sighash, { canonical: true });
    const r = Buffer.from(sig.r.toArray('be', 32));
    const s = Buffer.from(sig.s.toArray('be', 32));
    const derSig = derEncode(r, s);
    const sigWithHashType = Buffer.concat([derSig, Buffer.from([0x01])]);
    signatures.push(sigWithHashType);
    console.log('  Input', i, '- sig length:', sigWithHashType.length);
  }

  // Build transaction
  const txParts = [];

  // Header
  txParts.push(Buffer.from([0x05, 0x00, 0x00, 0x80]));
  txParts.push(Buffer.from([0x0a, 0x27, 0xa7, 0x26]));
  txParts.push(Buffer.from([0xf0, 0x4d, 0xec, 0x4d]));
  txParts.push(Buffer.from([0x00, 0x00, 0x00, 0x00]));
  txParts.push(Buffer.from([0x00, 0x00, 0x00, 0x00]));

  // Input count
  txParts.push(Buffer.from([UTXOS.length]));

  // Inputs
  for (let i = 0; i < UTXOS.length; i++) {
    const utxo = UTXOS[i];
    const sig = signatures[i];

    txParts.push(Buffer.from(utxo.txid, 'hex').reverse());
    const voutBuf = Buffer.alloc(4);
    voutBuf.writeUInt32LE(utxo.vout);
    txParts.push(voutBuf);

    const scriptSig = Buffer.concat([
      Buffer.from([sig.length]),
      sig,
      Buffer.from([publicKey.length]),
      publicKey
    ]);
    txParts.push(Buffer.from([scriptSig.length]));
    txParts.push(scriptSig);

    txParts.push(Buffer.from([0xff, 0xff, 0xff, 0xff]));
  }

  // Output count (2 outputs)
  txParts.push(Buffer.from([0x02]));

  // Output 1: Destination
  const destValue = Buffer.alloc(8);
  destValue.writeBigUInt64LE(BigInt(OUTPUT_AMOUNT));
  txParts.push(destValue);
  txParts.push(Buffer.from([destScriptPubKey.length]));
  txParts.push(destScriptPubKey);

  // Output 2: Change (1337 bounty)
  const changeValue = Buffer.alloc(8);
  changeValue.writeBigUInt64LE(BigInt(CHANGE_AMOUNT));
  txParts.push(changeValue);
  txParts.push(Buffer.from([changeScriptPubKey.length]));
  txParts.push(changeScriptPubKey);

  // Trailing
  txParts.push(Buffer.from([0x00]));
  txParts.push(Buffer.from([0x00]));
  txParts.push(Buffer.from([0x00]));

  return Buffer.concat(txParts).toString('hex');
}

async function main() {
  const destAddress = process.argv[2];

  if (!destAddress) {
    console.log('Usage: node sweep-legacy-t1.js <destination_t1_address>');
    console.log('');
    console.log('Example:');
    console.log('  node sweep-legacy-t1.js t1aMR9MKx3xLso9c4Uq4MYX3cRvnDTp42av');
    console.log('');
    console.log('Leaves 0.001337 ZEC in the legacy address as a bounty.');
    return;
  }

  if (!destAddress.startsWith('t1')) {
    console.log('Error: Destination must be a t1 address (transparent)');
    return;
  }

  const destScriptPubKey = t1AddressToScriptPubKey(destAddress);
  const changeScriptPubKey = Buffer.from(SOURCE_SCRIPT_PUBKEY, 'hex');

  console.log('Destination:', destAddress);
  console.log('Dest scriptPubKey:', destScriptPubKey.toString('hex'));
  console.log('Change to:', LEGACY_ADDRESS);
  console.log('');

  const rawTx = buildTransaction(destScriptPubKey, changeScriptPubKey);

  console.log('\n=== RAW TRANSACTION HEX ===');
  console.log(rawTx);
  console.log('\nTransaction size:', rawTx.length / 2, 'bytes');

  console.log('\n=== TO BROADCAST ===');
  console.log('Run this command to broadcast:');
  console.log('');
  console.log('node -e "');
  console.log('const fs = require(\'fs\');');
  console.log('const axios = require(\'axios\');');
  console.log('async function broadcast() {');
  console.log('  const cookie = fs.readFileSync(\'C:/Users/mitch/AppData/Local/zebra/.cookie\', \'utf8\').trim();');
  console.log('  const [user, pass] = cookie.split(\':\');');
  console.log('  const auth = Buffer.from(user + \':\' + pass).toString(\'base64\');');
  console.log('  const r = await axios.post(\'http://127.0.0.1:8233\', {');
  console.log('    jsonrpc: \'2.0\', id: 1, method: \'sendrawtransaction\', params: [\'' + rawTx + '\']');
  console.log('  }, { headers: { \'Content-Type\': \'application/json\', \'Authorization\': \'Basic \' + auth }});');
  console.log('  console.log(r.data);');
  console.log('}');
  console.log('broadcast();');
  console.log('"');
}

main().catch(console.error);
