'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AppNav from '@/components/AppNav';
import UAddressDisplay from '@/components/UAddressDisplay';
import { useMagePanel } from '@/contexts/MagePanelContext';
import { addEvokedMessage, getEvokedMessages, type EvokedMessage } from '@/lib/evoked-storage';
import { getRevealedProverbs } from '@/lib/proverbs/storage';
import { getAgentCard } from '@/lib/ceremony/storage';
import { sendToPrivacymage } from '@/lib/send-to-privacymage';
import { formatZcashMemo, getTaleIdFromAct } from '@/lib/zcash-memo';

type RevelationSpellbook = 'story' | 'zero' | 'plurality';

function getTaleIdForRevelation(spellbook: RevelationSpellbook, nodeId: number): string {
  if (spellbook === 'story') return getTaleIdFromAct(nodeId);
  if (spellbook === 'zero') return `zero-tale-${nodeId}`;
  return `plurality-act-${nodeId}`;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

// Act titles for selection
const actTitles: { [actNumber: number]: string } = {
  1: "Venice, 1494 / The Drake's First Whisper",
  2: 'The Dual Ceremony / Sovereignty Divided',
  3: "The Drake's Teaching / A Tale of Conditions",
  4: 'The Blade Alone / First Adventures',
  5: 'Light Armor / Multi-Site Coordination',
  6: 'Trust Graph Plane / Where Agents Gather',
  7: 'The Mirror That Never Completes',
  8: 'The Ancient Rule / Two-of-Three Locks',
  9: 'Zcash Shield / Forging Cryptographic Privacy',
  10: 'Topology of Revelation / Triangle Geometry',
  11: 'Balanced Spiral of Sovereignty',
  12: 'The Forgetting / Proverbiogenesis',
  13: 'The Book of Promises',
  14: 'Rain on the Mountain of Entropy',
  15: 'Running in Shackles Through the Dark Forest',
  16: 'When Pools Become Wells',
  17: 'Bonfire in the Dark Forest',
  18: 'A Mirror in Dust, Vibed into Scrying Glass',
  19: 'The Anthropic Archivist',
  20: 'The Infinite Vault',
  21: "The Hitchhiker's Gambit",
  22: "Don't Panic Hoopy Frood",
  23: 'The Manifold Dragon',
};

function getRomanNumeral(num: number): string {
  const roman: { [key: number]: string } = {
    1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
    7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII',
    13: 'XIII', 14: 'XIV', 15: 'XV', 16: 'XVI', 17: 'XVII', 18: 'XVIII',
    19: 'XIX', 20: 'XX', 21: 'XXI', 22: 'XXII', 23: 'XXIII',
  };
  return roman[num] || String(num);
}

function EvokePageContent() {
  const searchParams = useSearchParams();
  const { openMagePanel } = useMagePanel();

  // Proverb from URL (from ProverbCard evoke link)
  const [proverb, setProverb] = useState('');
  const [selectedSpellbook, setSelectedSpellbook] = useState<RevelationSpellbook>('story');
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [memoCopied, setMemoCopied] = useState(false);

  // Contact form state
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [includeEmail, setIncludeEmail] = useState(false);
  const [includeSwordsmanId, setIncludeSwordsmanId] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [agentCard, setAgentCard] = useState<ReturnType<typeof getAgentCard>>(null);
  useEffect(() => setAgentCard(getAgentCard()), []);

  // Donation bubble copy state
  const [copiedDonation, setCopiedDonation] = useState(false);
  const [copiedZec, setCopiedZec] = useState(false);
  const DONATION_ADDRESS = '0x421D2BAd83484D658aEEaCC6035be2cD5115FE5D';
  const ZEC_DONATION_ADDRESS = 'u1m9f98243nm8998jrj7azzzm8qfud9ycl0z8hj8t9wwh59zn9xz0nq0qc0u67n3l72es6w9yt5wcv96jhmjslsh7cvu2hftgcr0t5s5d3l5r3lrk43cun26z30c2kzqm2dwhygygd4c0xzl8hrvdc5yt68c68zu89zd5kkguahccvthnw';

  // Published proverbs (evoked + revealed) for list on this page
  const [evoked, setEvoked] = useState<EvokedMessage[]>([]);
  const [revealed, setRevealed] = useState(getRevealedProverbs());
  const [evokedOpen, setEvokedOpen] = useState(true);
  const [revealedOpen, setRevealedOpen] = useState(true);

  const loadPublished = useCallback(() => {
    setEvoked(getEvokedMessages());
    setRevealed(getRevealedProverbs());
  }, []);

  useEffect(() => {
    loadPublished();
  }, [loadPublished]);

  useEffect(() => {
    const onFocus = () => loadPublished();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadPublished]);

  // Load proverb from URL param
  useEffect(() => {
    const proverbParam = searchParams.get('proverb');
    if (proverbParam) {
      setProverb(decodeURIComponent(proverbParam));
    }
  }, [searchParams]);

  const handleCopyMemo = async () => {
    if (!proverb.trim() || selectedNode == null) return;

    const taleId = getTaleIdForRevelation(selectedSpellbook, selectedNode);
    const memo = formatZcashMemo(taleId, proverb.trim());

    try {
      await navigator.clipboard.writeText(memo);
      setMemoCopied(true);
      setTimeout(() => setMemoCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy memo:', err);
    }
  };

  // Reset constellation selection when spellbook changes so user picks a valid node
  useEffect(() => {
    setSelectedNode(null);
  }, [selectedSpellbook]);

  const handleContactSubmit = async () => {
    const message = contactMessage.trim();
    if (!message) return;
    setContactError(null);
    setContactSending(true);
    addEvokedMessage(message);
    loadPublished();

    const participantId = includeSwordsmanId ? agentCard?.participantId : undefined;
    let body = message;
    if (participantId) body += `\n\nSwordsman ID (participant id): ${participantId}`;
    if (includeEmail && contactEmail.trim()) body += `\n\nSubmitted by: ${contactEmail.trim()}`;

    const subject = 'Contact Evocation - agentprivacy';
    try {
      if (includeEmail && contactEmail.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail.trim())) {
          setContactError('Please enter a valid email address.');
          setContactSending(false);
          return;
        }
        await sendToPrivacymage({
          subject,
          body,
          fromEmail: contactEmail.trim(),
          replyTo: contactEmail.trim(),
        });
      } else {
        await sendToPrivacymage({ subject, body });
      }
    } catch (err: unknown) {
      setContactError(err instanceof Error ? err.message : 'Failed to send. Try again or use your email client.');
      setContactSending(false);
      return;
    }
    setContactSending(false);
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      <AppNav />

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-light italic text-text-muted mb-4">
            the mage's spell, once spoken, becomes the village weather
          </h1>
          <p className="text-lg text-text-muted">
            Two paths of evocation: private communion or public revelation
          </p>
        </motion.div>

        {/* Donate — first */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-10"
        >
          <div className="p-5 rounded-2xl bg-surface/40 border border-surface/60 text-center">
            <p className="text-2xl mb-2 flex items-center justify-center gap-2 flex-wrap" aria-hidden="true">
              <span>⿻</span>
              <span className="text-lg font-medium text-text">donate</span>
            </p>
            <p className="text-sm text-text-muted mb-2 max-w-md mx-auto italic">
              The right people arrive, the right thing happens, the right moment opens, and the right ending closes—trust the pattern, for it trusts you.
            </p>
            <p className="text-xs text-text-muted mb-4">
              ZEC is private and ETH is a public donation address.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(DONATION_ADDRESS);
                    setCopiedDonation(true);
                    setTimeout(() => setCopiedDonation(false), 2500);
                  } catch {}
                }}
                className="px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
              >
                {copiedDonation ? '✓ Copied' : 'privacymage.eth (public)'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(ZEC_DONATION_ADDRESS);
                    setCopiedZec(true);
                    setTimeout(() => setCopiedZec(false), 2500);
                  } catch {}
                }}
                className="px-4 py-2.5 rounded-xl border border-secondary/30 bg-secondary/10 hover:bg-secondary/20 text-secondary text-sm font-medium transition-colors"
              >
                {copiedZec ? '✓ Copied' : 'ZEC shielded spellbook (private)'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Evocation — includes contact section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="mb-12"
        >
          <div className="p-6 rounded-xl bg-primary/10 border border-primary/30">
            <h2 className="text-xl font-semibold text-text mb-2">Contact Evocation</h2>
            <p className="text-text-muted text-sm mb-6">
              Direct mage contact is ephemeral. Perfect for learning, questioning, and refining your understanding before public revelation.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">
                  Your message or proverb:
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Share your understanding, ask a question, or propose a proverb..."
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-text-muted hover:text-text">
                  <input
                    type="checkbox"
                    checked={includeEmail}
                    onChange={(e) => { setIncludeEmail(e.target.checked); setContactError(null); }}
                    className="rounded border-surface/50"
                  />
                  <span>Share my email</span>
                </label>
                {includeEmail && (
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => { setContactEmail(e.target.value); setContactError(null); }}
                    placeholder="your@email.example"
                    className="w-full max-w-sm px-3 py-2 bg-background border border-primary/30 rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
                <label className="flex items-center gap-2 cursor-pointer text-text-muted hover:text-text">
                  <input
                    type="checkbox"
                    checked={includeSwordsmanId}
                    onChange={(e) => setIncludeSwordsmanId(e.target.checked)}
                    className="rounded border-surface/50"
                    disabled={!agentCard}
                  />
                  <span>
                    {agentCard
                      ? `Include Swordsman ID (participant id): ${agentCard.participantId.slice(0, 12)}…`
                      : 'Include Swordsman ID (participant id) — complete the ceremony first'}
                  </span>
                </label>
              </div>
              {contactError && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">
                  {contactError}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleContactSubmit}
                  disabled={!contactMessage.trim() || contactSending}
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-background font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contactSending ? 'Sending…' : contactSubmitted ? '✓ Message Received' : 'send to privacymage'}
                </button>
                <button
                  onClick={openMagePanel}
                  className="px-6 py-3 bg-surface/50 hover:bg-surface text-text font-medium rounded-lg border border-surface/50 transition-colors"
                >
                  🧙 Form Proverb
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Your published proverbs — first after donate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-text mb-4">Your shared proverbs</h2>
          <p className="text-sm text-text-muted mb-4">
            Messages you've sent to the Mage (evoked) and proverbs you've inscribed on Zcash (revealed). Recorded proverbs live on the <Link href="/proverbs" className="text-primary hover:underline">Proverbs</Link> page.
          </p>

          <div className="space-y-4">
            <div className="rounded-xl border border-primary/30 bg-primary/5 overflow-hidden">
              <button
                type="button"
                onClick={() => setEvokedOpen(!evokedOpen)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-primary/10 transition-colors text-left"
              >
                <span className="font-medium text-text">✨ Evoked</span>
                <span className="text-text-muted text-sm">{evoked.length}</span>
                <span className="text-text-muted">{evokedOpen ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {evokedOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-primary/20"
                  >
                    <div className="p-4">
                      {evoked.length === 0 ? (
                        <p className="text-sm text-text-muted">No evoked messages yet. Use the form below to contact the Mage.</p>
                      ) : (
                        <ul className="space-y-2">
                          {evoked.map((msg) => (
                            <li key={msg.id} className="text-sm border-b border-surface/30 pb-2 last:border-0 last:pb-0">
                              <time className="text-text-muted text-xs block">{formatDate(msg.createdAt)}</time>
                              <p className="text-text mt-0.5">{msg.content}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="rounded-xl border border-secondary/30 bg-secondary/5 overflow-hidden">
              <button
                type="button"
                onClick={() => setRevealedOpen(!revealedOpen)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/10 transition-colors text-left"
              >
                <span className="font-medium text-text">⚔️ Revealed</span>
                <span className="text-text-muted text-sm">{revealed.length}</span>
                <span className="text-text-muted">{revealedOpen ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {revealedOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-secondary/20"
                  >
                    <div className="p-4">
                      {revealed.length === 0 ? (
                        <p className="text-sm text-text-muted">No revealed proverbs yet. Copy a memo below and send minimum 0.01 ZEC to the shielded spellbook address to inscribe.</p>
                      ) : (
                        <ul className="space-y-2">
                          {revealed.map((p) => (
                            <li key={p.id} className="text-sm border-b border-surface/30 pb-2 last:border-0 last:pb-0">
                              <time className="text-text-muted text-xs block">{p.revealedAt ? formatDate(p.revealedAt) : formatDate(p.createdAt)}</time>
                              <p className="text-text mt-0.5">{p.content}</p>
                              {p.revealedTxid && (
                                <a href={`https://mainnet.zcashexplorer.app/transactions/${p.revealedTxid}`} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline text-xs mt-1 inline-block">
                                  View on chain →
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Progressive Trust (VRC) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="p-5 rounded-xl bg-accent/10 border border-accent/30">
            <h2 className="font-semibold text-text mb-2">Progressive Trust (VRC)</h2>
            <p className="text-text-muted text-sm mb-3">
              Both evocation types contribute to your trust portfolio. Private communion builds local understanding while revelations form Verifiable Relationship Credentials (VRCs)—bilateral trust proofs that unlock higher armor tiers.
            </p>
            <ul className="text-sm text-text-muted space-y-1 list-disc list-inside">
              <li>Signals prove comprehension</li>
              <li>Bilateral proverbs form VRCs</li>
              <li>VRCs unlock guardian candidacy</li>
            </ul>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-surface/50" />
          <span className="text-text-muted text-sm">or</span>
          <div className="flex-1 h-px bg-surface/50" />
        </div>

        {/* Revelation > Proverb Revelation Protocol (evoke) — no duplicate emoji */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-12"
        >
          <div className="p-6 rounded-xl bg-secondary/10 border border-secondary/30">
            <h2 className="text-xl font-semibold text-text mb-1">Revelation</h2>
            <p className="text-secondary/90 text-sm font-medium mb-4">Proverb Revelation Protocol</p>

            <p className="text-text-muted mb-6">
              Inscribe your proverb on the Zcash blockchain as permanent proof of understanding.
              Revelation that contributes to the collective wisdom.
            </p>

            <div className="space-y-4">
              {/* First Person (Story) only */}
              <div>
                <p className="text-sm text-text-muted mb-2">
                  Spellbook: <span className="text-text font-medium">First Person (Story) · Acts 1–23</span>
                </p>
              </div>

              {/* Act selection */}
              <div>
                <label className="block text-sm text-text-muted mb-2">
                  Select the Act your proverb relates to:
                </label>
                <select
                  value={selectedNode ?? ''}
                  onChange={(e) => setSelectedNode(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Choose an Act...</option>
                  {Array.from({ length: 23 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      Act {getRomanNumeral(num)}: {actTitles[num]?.split(' / ')[0]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proverb Input */}
              <div>
                <label className="block text-sm text-text-muted mb-2">
                  Your proverb:
                </label>
                <textarea
                  value={proverb}
                  onChange={(e) => setProverb(e.target.value)}
                  placeholder="Enter your compressed understanding..."
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                />
              </div>

              {/* Copy Memo Button */}
              {selectedNode != null && proverb.trim() && (
                <button
                  onClick={handleCopyMemo}
                  className="w-full px-6 py-3 bg-secondary hover:bg-secondary/90 text-background font-medium rounded-lg transition-colors"
                >
                  {memoCopied ? '✓ Memo Copied!' : '📋 Copy Memo for Zodl'}
                </button>
              )}

              {/* Instructions — stay expanded when proverb has text and Copy Memo is showing */}
              {selectedNode != null && proverb.trim() && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg"
                >
                  <h4 className="font-medium text-text mb-3">Complete your revelation:</h4>
                  <ol className="space-y-2 text-sm text-text-muted">
                    <li className="flex gap-2">
                      <span className="text-secondary font-medium">1.</span>
                      <span>Open your Zodl wallet</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-secondary font-medium">2.</span>
                      <span>Create a new send transaction</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-secondary font-medium">3.</span>
                      <span>Set amount to <strong className="text-secondary">minimum 0.01 ZEC</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-secondary font-medium">4.</span>
                      <span>Send to the shielded spellbook address:</span>
                    </li>
                  </ol>
                  <div className="mt-3">
                    <UAddressDisplay label="Shielded spellbook address" variant="small-button" />
                  </div>
                  <ol start={5} className="space-y-2 text-sm text-text-muted mt-3">
                    <li className="flex gap-2">
                      <span className="text-secondary font-medium">5.</span>
                      <span>Paste the memo in the message field</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-secondary font-medium">6.</span>
                      <span>Send as a shielded transaction</span>
                    </li>
                  </ol>
                </motion.div>
              )}

              {/* Zcash Address Display */}
              <div className="pt-4 border-t border-secondary/20">
                <p className="text-sm text-text-muted mb-3">
                  Shielded spellbook address (minimum 0.01 ZEC for proverb revelations):
                </p>
                <UAddressDisplay variant="proverb-button" />
              </div>
            </div>
          </div>
        </motion.div>

      </section>
    </div>
  );
}

export default function EvokePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-background to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    }>
      <EvokePageContent />
    </Suspense>
  );
}
