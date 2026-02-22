// Zcash Memo Formatting Utilities
// Formats proverbs for Zcash shielded transaction memos

import type { PathwaySpellbook } from './spellbook-storage';

export interface ZcashMemo {
  protocol: string;
  taleId: string;
  timestamp: number;
  spellemoji: string;
  proverb: string;
}

/**
 * Get act number from tale ID
 * Supports story spellbook (act-01-venice, act-i-venice), zero (zero-tale-X), canon (canon-chapter-X, guardian), society (society-chapter-X), plurality (plurality-act-X)
 */
export function getActFromTaleId(taleId: string): number | null {
  // Spell-id style: act-01-venice, act-13-book-of-promises
  const storySpellMatch = taleId.match(/^act-(\d{2})-/);
  if (storySpellMatch) {
    const n = parseInt(storySpellMatch[1], 10);
    return Number.isFinite(n) ? n : null;
  }
  // Zero spellbook format: zero-tale-X
  const zeroMatch = taleId.match(/^zero-tale-(\d+)$/);
  if (zeroMatch) {
    return parseInt(zeroMatch[1], 10);
  }
  // Canon: canon-chapter-X or guardian
  const canonMatch = taleId.match(/^canon-chapter-(\d+)$/);
  if (canonMatch) {
    return parseInt(canonMatch[1], 10);
  }
  if (taleId === 'guardian') {
    return 12; // Guardian is chapter 12
  }
  // Society: society-chapter-X
  const societyMatch = taleId.match(/^society-chapter-(\d+)$/);
  if (societyMatch) {
    return parseInt(societyMatch[1], 10);
  }
  // Plurality: plurality-act-X
  const pluralityMatch = taleId.match(/^plurality-act-(\d+)$/);
  if (pluralityMatch) {
    return parseInt(pluralityMatch[1], 10);
  }
  // Legacy story spellbook tale IDs (act-i-venice, etc.)
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
    'act-xxi-hitchhikers-gambit': 21,
    'act-xxii-hoopy-frood': 22,
    'act-xxiii-the-manifold-dragon': 23,
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
    21: "🌑4️⃣2️⃣ → 🩸⚔️⚔️ → ✈️7️⃣C → 😉 → 🍺🐴 → 👂✨ → 📖🌟 → 🚀4️⃣2️⃣ → ⚔️🧙‍♂️🧙‍♂️ → 🌌∞",
    22: "🚫😱 → 🧣👤✓ → 🤝📜 → 📶↗️ → ⚔️║🧙‍♂️ → 🔊💫 → 🚫📹 → 🌐📖∞",
    23: "⬢△🚀 → ⚔️⊥🧙→📐⁴🪞 → 🐦‍⬛²🔷>🔷 → 📚🤞🕸️⭐ → 🗣️🐲🐉 → 🛤️∞",
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
 * Get spellemoji for zero spellbook tale.
 * Kept in sync with Zero page taleData.spell so constellation picker and memos match.
 */
function getSpellemojiForZeroTale(taleNumber: number): string {
  const zeroSpellemojiMap: { [key: number]: string } = {
    1: "🏛️(🧙‍♂️³) → ZKP = {✓complete, ✓sound, ✓zero-knowledge}",
    2: "🎲(random) → CRS → 🌍(public)",
    3: "🎭(interactive) + 🔮(hash-oracle) → 🔇(non-interactive)",
    4: "𝔽_q = {0, 1, ..., q-1} → ➕ ✖️ (mod q)",
    5: "🔨(claim) → 🔗(gates) → {a ⊗ b = c}ⁿ",
    6: "🔗ⁿ → 🔮{A(x), B(x), C(x)} → A·B - C = Z·H → ✨(vanish)",
    7: "claim → {instance(🌍) + witness(🗝️)}",
    8: "⚙️ PlonK: Σqᵢ·wᵢ + q·(w₁⊗w₂) = 0 → 🔧(flexible)",
    9: "💃 G₁ × G₂ → 🤝 GT(bilinear)",
    10: "commit(🗝️) → 🔒(binding + hiding)",
    11: "🔮 FRI: φ → φ' → φ'' → ... → 💎(constant)",
    12: "📜₁ + 📜₂ →(🔄fold)→ 📜₃",
    13: "🎲 S = Σ g(x₁,...,xₙ) → 🔍(n rounds) → ✓",
    14: "📐 ⟨a, b⟩ = Σ aᵢbᵢ → 🔍log(n) → ✓",
    15: "📜 → 🪞(verify) → 📜² → 🪞 → ... ∞",
    16: "🐍 Circuit C → verify(C) → C (ouroboros)",
    17: "🕯️ Ceremony(τ) → {g^τⁿ}ᴺ → 🌍(universal)",
    18: "🐉 Head 1: τ leaked → forge_proofs(∞) → 🚨",
    19: "💻(program) → ⚙️(compile) → ▶️(execute) → 📊(trace) → 📜(proof)",
    20: "✍️ Cairo: 𝔽(felt) → 📐(AIR) → ⚡(STARK)",
    21: "🔧 Circom: 📋(template) → 🔗(R1CS) → 📜(Groth16|PlonK)",
    22: "🏰 EVM(opcodes + state) → 🔐(zkEVM) → 📜 → ⛓️ L1(✓)",
    23: "🦓🛡️ private(👤→👤, 💰) + 📜(valid, ¬double) → 🕶️",
    24: "🌀 deposit(🔒) → 🌊(pool) → withdraw(📜, nf) → 🔓(unlinked)",
    25: "📦 execute(L2) → 📜(prove) → ⬆️ L1(✓ + 📊data)",
    26: "⚠️🐉 6 heads: 🕯️(setup) + 🔢(params) + 🔗(circuits) + 💻(impl) + 📡(protocol) + 🔄(upgrades)",
    27: "💾 EIP-4844: 📦(blobs, 128KB) → ⏳(18 days) → 💰(16× cheaper)",
    28: "🌉 prove(⛓️A state) → verify(⛓️B) → 🤝(trustless)",
    29: "🧠 model(🔒) + data(🗝️) + inference → 📜(✓) + output → 🛡️",
    30: "⚔️🧙‍♂️🪞🕸️ = {👤, 🗡️, 🔮, 🪞, 🤝, 💎, 🧠}",
  };
  return zeroSpellemojiMap[taleNumber] || '';
}

/**
 * Get spellemoji for Parallel Society spellbook chapter (for constellation marker picker).
 * Must match society page chapterData.spell so inscribe modal shows the same emojis.
 */
function getSpellemojiForSocietyChapter(chapterNumber: number): string {
  const societySpellMap: { [key: number]: string } = {
    0: "👑⛓️ → 💀 → 🗺️ → 🕯️ → ⚔️❓ → 🧮 → 🔗 → 🌱 → 🏛️ → ✨",
    1: "👑⛓️(1648) → 💣⚖️(44%) → ⚔️❓(tradeoff) → 📜(archive) → 🐍(corrupt) → ⚖️(divide) → 🌱(seeds) → 🕯️(warning)",
    2: "👑💀(775) → 📊(67%) → 🎭(mirage) → 💸(extract) → 🗺️⛓️(kettle) → 🌱(seeds)",
    3: "🏴‍☠️(pirates) → 🌲(Cherán) → 🏙️(SEZ) → 🔧(architecture) → 🌱(bloom)",
    4: "📜(May) → 🔓(Gilmore) → 💻(hacktivists) → 🔮(cyberstate) → ⚡(prophecy)",
    5: "📚(Leibniz) → 🔄(overlap) → ⚔️❓(General) → 🧮(BFT) → ✅(solved)",
    6: "📜💻(contracts) → 🔮(oracles) → 🏛️(DAO) → 🌐(emerge)",
    7: "💰🐍(FinCEN) → 📊(99.95%) → 💸(extract) → 💻⚡(cure)",
    8: "🌐(Balaji) → 🗺️❌(landless) → 👥(community) → ❓(state?) → 🔄(rethink)",
    9: "🚪(exit) → 🌍(exile) → 🔑(access) → ⚖️(rights) → 🔓(freedom)",
    10: "🔄(five-place) → 🏰🏰(medieval) → 👥(shared) → 🔓(distributed)",
    11: "🗽(Lafayette) → 📜(17 articles) → 👥(community) → ⚖️(rights) → ✨(real)",
    12: "🤝(relational) → 📜(contracts) → 🦁❓(incomprehensible) → 🔗(protocol)",
    13: "🎭(PSYOP) → ⚔️💻(softwar) → 🔗(network) → 💚(heal) → 🔄(adapt)",
    14: "🔧(Reed-Solomon) → 🛡️(zk-SNARKs) → 📡(Waku) → 🏛️(Nomos) → ✨(breathe)",
    15: "🏛️💥(DAO hack) → 📜❌(code≠law) → 👥(social) → ⚖️(limits) → 🔄(iterate)",
    16: "🍷(1847 banquet) → 🌱(future here) → 📊(6500 nodes) → ✨(inevitable)",
    17: "🏠(two floors) → 💻(tech) → ❤️(values) → 🔗(align) → ⚡(barbed wire falls)",
    18: "👑💀 → 🌱 → 🔗 → ⚔️ → 🧙‍♂️ → ✨ → 🏛️ → 🔓 → △",
  };
  return societySpellMap[chapterNumber] ?? '';
}

/**
 * Get the spell emoji string for a spellbook node (for constellation marker picker).
 * Society now has a map; plurality still has no map and returns ''.
 */
export function getSpellemojiForSpellbook(spellbook: PathwaySpellbook, nodeId: number): string {
  switch (spellbook) {
    case 'story':
      return getSpellemojiForAct(nodeId);
    case 'zero':
      return getSpellemojiForZeroTale(nodeId);
    case 'canon':
      return getSpellemojiForCanonChapter(nodeId === 12 ? 12 : nodeId);
    case 'society':
      return getSpellemojiForSocietyChapter(nodeId);
    case 'plurality':
      return '';
    default:
      return '';
  }
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
  const isPluralitySpellbook = taleId.startsWith('plurality-act-');
  
  // Get appropriate spellemoji (plurality has no map in this module; story uses getSpellemojiForAct)
  let spellemoji = '';
  if (act !== null) {
    if (isZeroSpellbook) {
      spellemoji = getSpellemojiForZeroTale(act);
    } else if (isCanonSpellbook) {
      spellemoji = getSpellemojiForCanonChapter(act);
    } else if (isPluralitySpellbook) {
      spellemoji = ''; // Plurality spellemoji not mapped here; memo still valid
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
    21: 'act-xxi-hitchhikers-gambit',
    22: 'act-xxii-hoopy-frood',
    23: 'act-xxiii-the-manifold-dragon',
  };
  return taleMap[act] || `act-${act}`;
}

