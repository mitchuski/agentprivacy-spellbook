'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SwordsmanPanel from '@/components/SwordsmanPanel';
import UAddressDisplay from '@/components/UAddressDisplay';
import TAddressDisplay from '@/components/TAddressDisplay';
import { getTaleIdFromAct, getSpellemojiForAct } from '@/lib/zcash-memo';
import { getInscriptions } from '@/lib/oracle-api';

// Onchain inscription from the inscription indexer
interface Inscription {
  txid: string;
  blockHeight: number;
  blockTime: number;
  actNumber: number;
  actTitle: string;
  proverb: string;
  emojiSpell: string;
  matchScore: number;
  contentHash: string;
  refTxid: string;
  rawContent: string;
  sourceAddress: string;
  confirmations: number;
}

// Spell mappings for Story spellbook
const spellMappings: { [actNumber: number]: string } = {
  1: '📖💰 → 🐉⏳ → ⚔️🔮',
  2: '🗡️🔮 ← 👤✓ → 🔒📝 → 🤝📜 → 🕸️',
  3: '👤✓ → ⚔️📖 → 🔒📝 → 🤝📜 → 🕸️✓ → 🌐🏛️',
  4: '🗡️ → 🍪⚔️ → 🔒 → 📖📝 → 🤝📜₁',
  5: '🗡️📖 + 🤝📜₃ → 🛡️ → ⚔️⚔️⚔️ → 🔒📝₊',
  6: '🤝📜 + 🤝📜 + 🤝📜 = 🚪🌐',
  7: '1️⃣🤖 → 🪞→👤\n2️⃣🤖 → 🪞→✨ + 👤',
  8: '🗡️📖 + 🤝📜₁₅ → 🛡️🛡️ → 💎🏛️',
  9: '🛡️ → 🛡️⚡ → 💰🔒 → 🕶️🦓',
  10: '🌳 ⊥ 🐦‍⬛🧠 → 🐦‍⬛💭 → △{🌳, 🐦‍⬛💭, 🐦‍⬛🧠}',
  11: '⚔️ ➗ 📖 = 🌀',
  12: '🔮 → 📖 → ∞',
};

// Act titles
const actTitles: { [actNumber: number]: string } = {
  1: "Venice, 1494 / The Drake's First Whisper",
  2: 'The Dual Ceremony / Sovereignty Divided to Be Extended',
  3: "The Drake's Teaching / A Tale of Conditions",
  4: 'The Blade Alone / First Adventures',
  5: 'Light Armor / Multi-Site Coordination',
  6: 'Trust Graph Plane / Where Agents Gather',
  7: 'The Mirror That Never Completes / The Anti-Mirror',
  8: 'The Ancient Rule / Two-of-Three Locks',
  9: 'Zcash Shield / Forging Cryptographic Privacy',
  10: 'Topology of Revelation / Triangle Geometry',
  11: 'Balanced Spiral of Sovereignty / The Golden Ratio',
  12: 'The Forgetting / Proverbiogenesis',
};

// Helper to get Roman numeral
function getRomanNumeral(num: number): string {
  const roman: { [key: number]: string } = {
    1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
    7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII',
  };
  return roman[num] || String(num);
}

export default function ProverbsPage() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [inscriptionsLoading, setInscriptionsLoading] = useState(true);
  const [inscriptionCountByAct, setInscriptionCountByAct] = useState<Record<number, number>>({});
  const [expandedActs, setExpandedActs] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])); // Expand all acts by default
  const [donationAct, setDonationAct] = useState<number | null>(null);
  const [copiedSpellIndex, setCopiedSpellIndex] = useState<number | null>(null);
  const [copiedProverbIndex, setCopiedProverbIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch onchain inscriptions
  useEffect(() => {
    const loadInscriptions = async () => {
      try {
        setInscriptionsLoading(true);
        const data = await getInscriptions();
        if (data) {
          setInscriptions(data.inscriptions || []);
          setInscriptionCountByAct(data.countByAct || {});
        }
      } catch (error) {
        console.error('Error loading inscriptions:', error);
      } finally {
        setInscriptionsLoading(false);
      }
    };

    loadInscriptions();
  }, []);

  const toggleAct = (actNumber: number) => {
    setExpandedActs((prev) => {
      const next = new Set(prev);
      if (next.has(actNumber)) {
        next.delete(actNumber);
      } else {
        next.add(actNumber);
      }
      return next;
    });
  };

  const handleCopySpell = async (emojiString: string, actNum: number) => {
    if (emojiString) {
      try {
        await navigator.clipboard.writeText(emojiString);
        setCopiedSpellIndex(actNum);
        setTimeout(() => setCopiedSpellIndex(null), 2000);
      } catch (err) {
        console.error('Failed to copy spell:', err);
      }
    }
  };

  const getOracleProverb = (actNum: number): string => {
    const oracleProverbs: { [key: number]: string } = {
      1: "The swordsman who never strikes guards nothing; the mage who never casts commands nothing.",
      2: "What the swordsman executes, the mage authorised; what the mage composes, the swordsman proves capable; what both accomplish, the spellbook verifies.",
      3: "the swordsman alone rages, mage alone dreams, action alone blinds—sovereignty demands all three to intertwine.",
      4: "Trust begins unarmored—the swordsman and mage test small betrayals before the first person may grant the keys to more powerful treasures.",
      5: "Solo combat sets the terms and proves the swordsman; coordinated spells prove the mage; spellbooks weave both into campaigns worthy of legend.",
      6: "The guild admits only verified identities and authentic deeds—one impostor poisons the entire covenant.",
      7: "One mirror observing both swordsman and mage collapses dignity into surveillance; two mirrors, each watching the other, preserve dignity through mutual witness.",
      8: "When one holds the sword, the vault, and the pen, corruption conceals itself—divide these across swordsman and mage, and betrayal becomes impossible to hide.",
      9: "The two-faced shield is not duplicitous but sovereign—for true power lies not in choosing privacy or transparency, but in wielding both with mathematical certainty, where comprehension proves personhood.",
      10: "The ravens fly 🐦‍⬛. The tree dreams 🌳. The All-Father wakes △.",
      11: "The blade that becomes the spell loses both edges.",
      12: "The mage's spell, once spoken, becomes the village weather.",
    };
    return oracleProverbs[actNum] || "";
  };

  const handleCopyProverb = async (actNum: number) => {
    const proverb = getOracleProverb(actNum);
    if (proverb) {
      try {
        await navigator.clipboard.writeText(proverb);
        setCopiedProverbIndex(actNum);
        setTimeout(() => setCopiedProverbIndex(null), 2000);
      } catch (err) {
        console.error('Failed to copy proverb:', err);
      }
    }
  };

  // Get act info for donation panel
  const donationActInfo = donationAct ? {
    actNumber: donationAct,
    actName: `Act ${getRomanNumeral(donationAct)}: ${actTitles[donationAct]?.split(' / ')[0] || ''}`,
    spell: spellMappings[donationAct],
    taleId: getTaleIdFromAct(donationAct),
  } : null;

  // Calculate totals
  const totalInscriptions = inscriptions.length;
  const actsWithInscriptions = Object.keys(inscriptionCountByAct).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Swordsman Panel */}
      {donationActInfo && (
        <SwordsmanPanel
          taleId={donationActInfo.taleId}
          actNumber={donationActInfo.actNumber}
          spellbook="story"
          actName={donationActInfo.actName}
          spell={donationActInfo.spell}
        />
      )}

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 md:gap-8">
              <Link href="/" className="text-xl font-bold text-text hover:text-primary transition-colors">
                agentprivacy
              </Link>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4 sm:gap-6">
                <Link href="/story" className="text-text hover:text-primary transition-colors font-medium">
                  story
                </Link>
                <Link href="/zero" className="text-text hover:text-primary transition-colors font-medium">
                  zero
                </Link>
                <Link href="/canon" className="text-text hover:text-primary transition-colors font-medium">
                  canon
                </Link>
                <Link href="/society" className="text-text hover:text-primary transition-colors font-medium">
                  society
                </Link>
                <Link href="/plurality" className="text-text hover:text-primary transition-colors font-medium">
                  plural
                </Link>
                <Link href="/proverbs" className="text-primary border-b-2 border-primary pb-1 font-medium">
                  proverbs
                </Link>
                <Link href="/mage" className="text-text hover:text-primary transition-colors font-medium">
                  mage
                </Link>
                <Link href="/privacy" className="text-text hover:text-primary transition-colors font-medium">
                  privacy
                </Link>
              </div>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-4 space-y-3 border-t border-surface/50">
                  <Link
                    href="/story"
                    className="block text-text hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    story
                  </Link>
                  <Link
                    href="/zero"
                    className="block text-text hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    zero
                  </Link>
                  <Link
                    href="/canon"
                    className="block text-text hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    canon
                  </Link>
                  <Link
                    href="/society"
                    className="block text-text hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    society
                  </Link>
                  <Link
                    href="/plurality"
                    className="block text-text hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    plural
                  </Link>
                  <Link
                    href="/proverbs"
                    className="block text-primary border-b-2 border-primary pb-1 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    proverbs
                  </Link>
                  <Link
                    href="/mage"
                    className="block text-text hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    mage
                  </Link>
                  <Link
                    href="/privacy"
                    className="block text-text hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    privacy
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">Proverb Revelation Proofs</h1>
            <p className="text-text-muted text-lg mb-4">
              All published inscriptions of shared meaning. Unique compressions demonstrating deep engagement with each tale, agentic trust task primitives.
            </p>
            <p className="text-text-muted">
              A <strong className="text-text">public proverb proof</strong> is a published inscription that serves as a commitment to understanding. A verifiable demonstration of deep engagement with each tale. While proverb proofs can be used locally in peer-to-peer private exchanges, the public proof makes your engagement visible and verifiable on the blockchain, creating a permanent record that contributes to the collective wisdom of the community.
            </p>
          </motion.div>

          {/* Address Display Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UAddressDisplay variant="proverb-button" />
              <TAddressDisplay variant="proverb-button" label="inscription address" />
            </div>
          </motion.div>

          {/* VRC System Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-4">
              <div className="bg-primary/10 border border-primary/30 rounded p-3 opacity-50">
                <div className="font-semibold text-primary mb-1 flex items-center gap-2">
                  <span>⚔️</span>
                  <span>Protecting the Spell (1 ZEC)</span>
                  <span className="text-xs text-text-muted italic ml-auto">(Future Release)</span>
                </div>
                <div className="text-text-muted mb-2">Swordsmen stake 1 ZEC to protect the spellbook. Guardians store their proverb privately in the spellbook, with public stake proof.</div>
                <div className="text-xs text-primary/80 border-t border-primary/20 pt-2 mt-2">
                  <strong>Private:</strong> Proverb in spellbook • <strong>Public:</strong> 1 ZEC stake proof
                </div>
              </div>
              <div className="bg-secondary/10 border border-secondary/30 rounded p-3">
                <div className="font-semibold text-secondary mb-1 flex items-center gap-2">
                  <span>🧙‍♂️</span>
                  <span>Learning the Spell (0.01 ZEC)</span>
                </div>
                <div className="text-text-muted mb-2">Publish proverb linked to public Zcash address after shielded proverb share. Unlimited supply.</div>
                <div className="text-xs text-secondary/80 border-t border-secondary/20 pt-2 mt-2">
                  <strong>Public:</strong> Proverb commitment • <strong>Private:</strong> Fees in treasury
                </div>
                <div className="text-xs mt-2 pt-2 border-t border-secondary/20 text-text-muted">
                  <p className="text-secondary/80"><strong>Progressive Trust:</strong> Signals accumulate → VRCs form → Armor earned → Guardian candidacy</p>
                </div>
              </div>
            </div>

            {/* VRC System Card */}
            <div className="card bg-accent/10 border-accent/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text">(⚔️⊥🧙‍♂️)🙂 Progressive Relationship Trust System (VRC)</h3>
              </div>
              <div className="text-xs text-text-muted mb-3 pb-3 border-b border-accent/20">
                <p><strong className="text-text">VRCs (Verifiable Relationship Credentials)</strong> are bilateral trust relationships established through demonstrated comprehension. Each learning signal builds your trust portfolio.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-text-muted">
                <p>• Signals prove comprehension</p>
                <p>• Bilateral proverbs → VRC formation</p>
                <p>• VRC portfolio → Trust Graph entry</p>
                <p>• Progressive armor → Guardian candidacy</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="text-center p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-1">{totalInscriptions}</div>
              <div className="text-xs text-text-muted">Total Inscriptions</div>
            </div>
            <div className="text-center p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
              <div className="text-3xl font-bold text-secondary mb-1">{actsWithInscriptions}</div>
              <div className="text-xs text-text-muted">Acts with Proofs</div>
            </div>
            <div className="text-center p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <div className="text-3xl font-bold text-accent mb-1">12</div>
              <div className="text-xs text-text-muted">Total Acts</div>
            </div>
            <div className="text-center p-4 bg-surface/50 border border-surface/50 rounded-lg">
              <div className="text-3xl font-bold text-text mb-1">{(totalInscriptions * 0.01).toFixed(2)}</div>
              <div className="text-xs text-text-muted">ZEC Committed</div>
            </div>
          </motion.div>

          {/* Learn a Spell Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-4 bg-secondary/10 border border-secondary/30 rounded-lg"
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-secondary">🧙‍♂️ Learn a Spell:</span>
                <select
                  value={donationAct || ''}
                  onChange={(e) => setDonationAct(e.target.value ? parseInt(e.target.value) : null)}
                  className="px-3 py-1 bg-background border border-secondary/50 rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Select Act...</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(actNum => (
                    <option key={actNum} value={actNum}>
                      Act {getRomanNumeral(actNum)}: {actTitles[actNum]?.split(' / ')[0] || `Act ${actNum}`}
                    </option>
                  ))}
                </select>
                {donationAct && (
                  <button
                    onClick={() => setDonationAct(null)}
                    className="text-xs text-text-muted hover:text-text px-2"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-xs text-text-muted">
                Select an act to open the Swordsman Panel and submit your proverb proof (0.01 ZEC)
              </p>
            </div>
          </motion.div>

          {/* Onchain Inscriptions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-text mb-4">Onchain Proof Inscriptions</h2>

            {inscriptionsLoading ? (
              <div className="text-center py-12 text-text-muted">
                Loading inscriptions from blockchain...
              </div>
            ) : inscriptions.length === 0 ? (
              <div className="text-center py-12 text-text-muted bg-surface/20 rounded-lg border border-surface/30">
                No inscriptions found yet. Be the first to inscribe your proverb proof!
              </div>
            ) : (
              <div className="space-y-4">
                {/* Group inscriptions by act */}
                {Array.from({ length: 12 }, (_, i) => i + 1).map((actNum) => {
                  const actInscriptions = inscriptions.filter(i => i.actNumber === actNum);
                  const isExpanded = expandedActs.has(actNum);
                  const hasInscriptions = actInscriptions.length > 0;
                  // Only show spell for Act 1
                  const showSpell = actNum === 1;

                  return (
                    <motion.div
                      key={`act-${actNum}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 sm:p-4 rounded-lg border transition-colors overflow-hidden ${
                        hasInscriptions
                          ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 hover:border-primary/50'
                          : 'bg-surface/20 border-surface/30 opacity-60'
                      }`}
                    >
                      {/* Act Header */}
                      <div
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 cursor-pointer"
                        onClick={() => toggleAct(actNum)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                          <span className={`text-lg font-bold ${hasInscriptions ? 'text-primary' : 'text-text-muted'}`}>
                            Act {getRomanNumeral(actNum)}
                          </span>
                          <span className="hidden sm:inline text-text-muted">•</span>
                          <span className={`text-sm ${hasInscriptions ? 'text-text' : 'text-text-muted'} truncate`}>
                            {actTitles[actNum]?.split(' / ')[0] || `Act ${actNum}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Inscribe and Proverb buttons */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopySpell(getSpellemojiForAct(actNum), actNum);
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary transition-all duration-200 whitespace-nowrap"
                            title="Copy emoji spell"
                          >
                            {copiedSpellIndex === actNum ? (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-primary"
                              >
                                cast
                              </motion.span>
                            ) : (
                              "inscribe"
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyProverb(actNum);
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary transition-all duration-200 whitespace-nowrap"
                            title="Copy oracle proverb"
                          >
                            {copiedProverbIndex === actNum ? (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-primary"
                              >
                                cast
                              </motion.span>
                            ) : (
                              "proverb"
                            )}
                          </button>
                          <span className={`px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ${
                            hasInscriptions
                              ? 'bg-primary/20 text-primary border border-primary/30'
                              : 'bg-surface/30 text-text-muted border border-surface/30'
                          }`}>
                            {actInscriptions.length} inscription{actInscriptions.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-text-muted text-sm flex-shrink-0">
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        </div>
                      </div>

                      {/* Emoji Spell String - Under act title, above proverb tiles */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-surface/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-text-muted font-medium">Spell:</span>
                            <div className="flex-1 overflow-x-auto scrollbar-hide">
                              <p className="text-sm sm:text-base text-text font-mono whitespace-nowrap min-w-max">
                                {getSpellemojiForAct(actNum)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Expanded Inscriptions */}
                      <AnimatePresence>
                        {isExpanded && hasInscriptions && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-surface/30 space-y-3">
                              {actInscriptions.map((inscription, idx) => {
                                // Ensure we use the unique txid for each inscription
                                // For Act 1, if txid equals refTxid, it might be incorrectly using the reference
                                // But we'll use txid as-is since it should be unique per inscription
                                const displayTxid = inscription.txid || inscription.refTxid;
                                
                                return (
                                  <div
                                    key={`${inscription.txid || inscription.refTxid}-${idx}-${inscription.blockHeight}`}
                                    className="p-3 sm:p-4 bg-background/60 border border-surface/40 rounded-lg"
                                  >
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                      {/* Clean proverb quote - remove emoji prefix if present */}
                                      <p className="text-sm sm:text-base text-text italic mb-3 leading-relaxed break-words">
                                        {(() => {
                                          const proverb = inscription.proverb || '';
                                          // If proverb contains |, take the part after the last |
                                          if (proverb.includes('|')) {
                                            const parts = proverb.split('|');
                                            const cleanQuote = parts[parts.length - 1].trim();
                                            return `"${cleanQuote}"`;
                                          }
                                          return `"${proverb.trim()}"`;
                                        })()}
                                      </p>
                                      <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs text-text-muted">
                                        <span title="Block Height">
                                          Block: {inscription.blockHeight.toLocaleString()}
                                        </span>
                                        <span title="Confirmations">
                                          {inscription.confirmations.toLocaleString()} conf.
                                        </span>
                                        <a
                                          href={`https://mainnet.zcashexplorer.app/transactions/${displayTxid}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="font-mono text-primary hover:text-primary/80 transition-colors break-all"
                                          title={displayTxid}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {displayTxid.substring(0, 12)}...
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Empty state for acts without inscriptions */}
                      <AnimatePresence>
                        {isExpanded && !hasInscriptions && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-surface/30 text-center py-4 text-sm text-text-muted">
                              No inscriptions yet for this act.{' '}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDonationAct(actNum);
                                }}
                                className="text-secondary hover:text-secondary/80 underline"
                              >
                                Be the first to inscribe!
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xs text-text-muted pt-8 border-t border-surface/30"
          >
            <p className="mb-2">
              All inscriptions are permanently stored on the Zcash blockchain.
            </p>
            <p>
              Privacy-preserving: Only proverb content shown. Wallet addresses remain private through shielded transactions.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
