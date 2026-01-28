// Zcash Memo Formatting Utilities
// Formats proverbs for Zcash shielded transaction memos

export interface ZcashMemo {
  protocol: string;
  taleId: string;
  timestamp: number;
  spellemoji: string;
  proverb: string;
}

/**
 * Get act number from tale ID
 * Supports story spellbook (act-i-venice), zero spellbook (zero-tale-1), and canon spellbook (canon-chapter-X or guardian)
 */
export function getActFromTaleId(taleId: string): number | null {
  // Check for zero spellbook format: zero-tale-X
  const zeroMatch = taleId.match(/^zero-tale-(\d+)$/);
  if (zeroMatch) {
    return parseInt(zeroMatch[1], 10);
  }
  
  // Check for canon spellbook format: canon-chapter-X or guardian
  const canonMatch = taleId.match(/^canon-chapter-(\d+)$/);
  if (canonMatch) {
    return parseInt(canonMatch[1], 10);
  }
  if (taleId === 'guardian') {
    return 12; // Guardian is chapter 12
  }
  
  // Story spellbook tale IDs
  const taleMap: { [key: string]: number } = {
    'act-i-venice': 1,
    'act-ii-dual-ceremony': 2,
    'act-iii-drakes-teaching': 3,
    'act-iv-blade-alone': 4,
    'act-v-light-armour': 5,
    'act-vi-trust-graph-plane': 6,
    'act-vii-mirror-enhanced': 7,
    'act-viii-ancient-rule': 8,
    'act-ix-zcash-shield': 9,
    'topology-of-revelation': 10,
    'act-xi-balanced-spiral-of-sovereignty': 11,
    'act-xii-the-forgetting': 12,
    'act-xiii-book-of-promises': 13,
    'act-xiv-rain-on-mountain': 14,
    'act-xv-running-in-shackles': 15,
    'act-xvi-wells': 16,
    'act-xvii-bonfire-dark-forest': 17,
    'act-xviii-mirror-in-dust': 18,
    'act-xix-the-anthropic-archivist': 19,
    'act-xx-the-infinite-vault': 20,
  };
  return taleMap[taleId] || null;
}

/**
 * Get spellemoji string for an act number
 */
export function getSpellemojiForAct(act: number): string {
  const spellemojiMap: { [key: number]: string } = {
    0: "😊 → 🔮 🤝 🗡️ × 🐉 → 🤖❌",
    1: "📖💰 → 🐉⏳ → ⚔️🔮",
    2: "🗡️🔮 ← 👤✓ → 🔒📝 → 🤝📜 → 🕸️",
    3: "👤✓ → ⚔️📖 → 🔒📝 → 🤝📜 → 🕸️✓ → 🌐🏛️",
    4: "🗡️ → 🍪⚔️ → 🔒 → 📖📝 → 🤝📜₁",
    5: "🗡️📖 + 🤝📜₃ → 🛡️ → ⚔️⚔️⚔️ → 🔒📝₊",
    6: "🤝📜 + 🤝📜 + 🤝📜 = 🚪🌐",
    7: "1️⃣🤖 → 🪞→👤\n2️⃣🤖 → 🪞→✨ + 👤",
    8: "🗡️📖 + 🤝📜₁₅ → 🛡️🛡️ → 💎🏛️",
    9: "🛡️ → 🛡️⚡ → 💰🔒 → 🕶️🦓",
    10: "🌳 ⊥ 🐦‍⬛🧠 → 🐦‍⬛💭 → △{🌳, 🐦‍⬛💭, 🐦‍⬛🧠}",
    11: "⚔️ ➗ 📖 = 🌀",
    12: "🌱→⚒️→📡→🌊→🌫️🏛️",
    13: "🧙‍♂️²🤝→⚡🎯→📜±→🔮🔍→🛡️⚖️→✨🔗→🗣️📿→🌅🏗️",
    14: "🌧️⛰️→🔑🌱→📜🤝→🛡️⚡→🏛️∞",
    15: "📚 → 🌲 → ⛓️ → 🕊️ → 📖 → 🔐 → 💎",
    16: "🔥 → 🌀 → ⚖️ → 💫 → 🌾",
    17: "🌲 → 🌑 → 🦉 → 🔥 → 🌳💫 → 🕸️ → 🔥🔥🔥",
    18: "🪞💀 → 💨 → 🔮✨ → 🪞💎 → 👣🎯 → ⚡🔮 → 🌱📜 → 🌫️🏛️",
    19: "⚔️🧙‍♂️ → 📐📜 → 🏛️🤝 → 💫✨",
    20: "⚔️🧙‍♂️ → 🚪🔐 → 🏛️∞ → 👤⚖️(keeper) → 📜₁₀ → 🔑🛡️⚖️ → 🌿(root-fork) → 📦∅(empty-alcove) → 🌸🌍",
  };
  return spellemojiMap[act] || '';
}

/**
 * Get spellemoji for canon spellbook chapter
 */
function getSpellemojiForCanonChapter(chapterNumber: number): string {
  const canonSpellemojiMap: { [key: number]: string } = {
    0: "📖₁(what) + 📖₂(why) → 🗡️🔮(wield)",
    1: "🔐(Chaum) + 📜(May) + ✍️(Hughes) + ⛏️(PoW) → 🗡️₀",
    2: "📝(Szabo) + 💰(Dai) + 🔮(prophecy) → ⛓️❓(almost)",
    3: "🔐+📝+💰+⛏️ → ⛓️✓ → 🍕💰 → 🔓❌(keys) → 👤→🌫️",
    4: "⛓️(money) → 💻(compute) → 🏛️(DAO) → 💰💰💰",
    5: "🏛️→💥 → ⚖️(fork?) → ⛓️|⛓️ → 👥(revealed)",
    6: "⛓️ → 💰(traction) | 🏛️(depth) → ❌🤝",
    7: "👁️(watch) → 🔗(link) → ⚖️🌀(sanction) → 👤→⛓️(prison)",
    8: "💰+🏛️ ← 🛡️⚡(ZK) → 🤝(unified)",
    9: "📖(written) + 📄(blank) → ✍️(you) → ⏰(window)",
    10: "📚(sources) → 🕸️(graph) → ✓(verify) → 🌱(tend)",
    11: "📜⏳ → 🗡️₀ → ⛓️✓ → 💻 → 💔 → 👁️ → 🛡️⚡ → 📄✍️ → △",
    12: "⚔️🛡️📜", // Guardian Application
  };
  return canonSpellemojiMap[chapterNumber] || '';
}

/**
 * Get spellemoji for zero spellbook tale
 */
function getSpellemojiForZeroTale(taleNumber: number): string {
  const zeroSpellemojiMap: { [key: number]: string } = {
    1: "🏛️(🧙‍♂️³) → ZKP = {✓complete, ✓sound, ✓zero-knowledge}",
    2: "🎲(random) → CRS → 🌍(public)",
    3: "🎭(interactive) + 🔮(hash-oracle) → 🔇(non-interactive)",
    4: "𝔽_q = {0, 1, ..., q-1} → ➕ ✖️ (mod q)",
    5: "🔨(claim) → 🔗(gates) → {a ⊗ b = c}ⁿ",
    6: "{a⊗b=c}ⁿ → {A(x), B(x), C(x)} → A·B - C = Z·H",
    7: "claim → {instance(🌍) + witness(🗝️)}",
    8: "PlonK: Σqᵢ·wᵢ + q·(w₁⊗w₂) = 0 (flexible)",
    9: "e: G₁ × G₂ → GT (bilinear)",
    10: "commit(🗝️) → 🔒(binding + hiding)",
    11: "FRI: φ → φ' → φ'' → ... → constant",
    12: "proof₁ + proof₂ →(fold @ r)→ proof₃",
    13: "S = Σ g(x₁,...,xₙ) over {0,1}ⁿ → 2ⁿ terms",
    14: "⟨a, b⟩ = Σ aᵢbᵢ → inner product",
    15: "proof → verify(proof) → proof_of_proof → verify → ... ∞",
    16: "Circuit C → verify(C's proof) → paradox(vk_C unknown)",
    17: "Ceremony(τ) → {g^1, g^τ, ..., g^(τ^N)} → universal_params",
    18: "🐉 Head 1: τ leaked → forge_proofs(∞) → 🚨",
    19: "program(any_language) → compile(ISA) → execute → trace[cycles]",
    20: "Cairo: language(felt) → AIR(direct) → STARK → StarkNet",
    21: "Circom: template(signals) → constraints(R1CS) → Groth16/PlonK",
    22: "EVM(140 opcodes + state) → zkEVM → proof → L1(verify)",
    23: "ZCash: private(from, to, amount) + proof(valid, no_double_spend)",
    24: "Tornado: deposit(cm) → pool → withdraw(proof, nf) → unlinked",
    25: "zkRollup: execute(L2) → prove → L1(verify + data)",
    26: "Vulnerabilities: setup + parameters + circuits + implementation + protocol + upgrades",
    27: "EIP-4844: blobs(128KB, 18 days, 1 gas/byte) → 16x cheaper",
    28: "Bridge: prove(chain_A_state) → verify(chain_B) → trustless",
    29: "zkML: model(committed) + data(private) + inference → proof(correct) + output",
    30: "Sovereign Agent = {Identity, Swordsman, Mage, Reflect, Connect, Capital, Intelligence}",
  };
  return zeroSpellemojiMap[taleNumber] || '';
}

/**
 * Format proverb into Zcash memo (rpp-v1 format)
 * Includes spellemoji string as 4th field (after timestamp, before proverb)
 */
export function formatZcashMemo(
  taleId: string,
  proverb: string
): string {
  const timestamp = Date.now();
  const act = getActFromTaleId(taleId);
  
  // Determine spellbook type
  const isZeroSpellbook = taleId.startsWith('zero-tale-');
  const isCanonSpellbook = taleId.startsWith('canon-chapter-') || taleId === 'guardian';
  
  // Get appropriate spellemoji
  let spellemoji = '';
  if (act !== null) {
    if (isZeroSpellbook) {
      spellemoji = getSpellemojiForZeroTale(act);
    } else if (isCanonSpellbook) {
      spellemoji = getSpellemojiForCanonChapter(act);
    } else {
      spellemoji = getSpellemojiForAct(act);
    }
  }
  
  return `[rpp-v1]
[${taleId}]
[${timestamp}]
[${spellemoji}]
[${proverb}]`;
}

/**
 * Parse Zcash memo back into components
 * Supports both old format (4 fields) and new format (5 fields with spellemoji)
 */
export function parseZcashMemo(memo: string): ZcashMemo | null {
  const lines = memo.trim().split('\n');
  
  // Old format: 4 fields (protocol, taleId, timestamp, proverb)
  // New format: 5 fields (protocol, taleId, timestamp, spellemoji, proverb)
  if (lines.length < 4) {
    return null;
  }

  const protocol = lines[0].replace(/[\[\]]/g, '');
  const taleId = lines[1].replace(/[\[\]]/g, '');
  const timestamp = parseInt(lines[2].replace(/[\[\]]/g, ''), 10);

  if (protocol !== 'rpp-v1' || isNaN(timestamp)) {
    return null;
  }

  // Check if new format (5 fields) or old format (4 fields)
  if (lines.length >= 5) {
    // New format with spellemoji
    const spellemoji = lines[3].replace(/[\[\]]/g, '');
    const proverb = lines[4].replace(/[\[\]]/g, '');
    return {
      protocol,
      taleId,
      timestamp,
      spellemoji,
      proverb,
    };
  } else {
    // Old format without spellemoji (backward compatibility)
    const proverb = lines[3].replace(/[\[\]]/g, '');
    return {
      protocol,
      taleId,
      timestamp,
      spellemoji: '', // Empty for old format
      proverb,
    };
  }
}

/**
 * Validate proverb length (must fit in 512 bytes)
 */
export function validateProverb(proverb: string): { valid: boolean; length: number; maxLength: number } {
  const encoded = new TextEncoder().encode(proverb);
  const maxLength = 512;
  return {
    valid: encoded.length <= maxLength,
    length: encoded.length,
    maxLength,
  };
}

/**
 * Get tale ID from act number
 */
export function getTaleIdFromAct(act: number): string {
  const taleMap: { [key: number]: string } = {
    1: 'act-i-venice',
    2: 'act-ii-dual-ceremony',
    3: 'act-iii-drakes-teaching',
    4: 'act-iv-blade-alone',
    5: 'act-v-light-armour',
    6: 'act-vi-trust-graph-plane',
    7: 'act-vii-mirror-enhanced',
    8: 'act-viii-ancient-rule',
    9: 'act-ix-zcash-shield',
    10: 'topology-of-revelation',
    11: 'act-xi-balanced-spiral-of-sovereignty',
    12: 'act-xii-the-forgetting',
    13: 'act-xiii-book-of-promises',
    14: 'act-xiv-rain-on-mountain',
    15: 'act-xv-running-in-shackles',
    16: 'act-xvi-wells',
    17: 'act-xvii-bonfire-dark-forest',
    18: 'act-xviii-mirror-in-dust',
    19: 'act-xix-the-anthropic-archivist',
    20: 'act-xx-the-infinite-vault',
  };
  return taleMap[act] || `act-${act}`;
}

