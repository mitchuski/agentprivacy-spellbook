'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatZcashMemo, validateProverb } from '@/lib/zcash-memo';
import Link from 'next/link';
import { hasCompletedCeremony, getAgentCard } from '@/lib/ceremony/storage';
import type { AgentCard } from '@/lib/ceremony/types';
import UAddressDisplay from '@/components/UAddressDisplay';

interface SwordsmanPanelProps {
  taleId: string;
  actNumber: number;
  spellbook?: 'story' | 'zero' | 'canon' | 'society' | 'plurality';
  actName?: string;
  spell?: string;
}

export default function SwordsmanPanel({ taleId, actNumber, spellbook, actName, spell }: SwordsmanPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userProverb, setUserProverb] = useState('');
  const [copied, setCopied] = useState(false);
  const [spellCopied, setSpellCopied] = useState(false);
  const [mageWindow, setMageWindow] = useState<Window | null>(null);
  const [ceremonyComplete, setCeremonyComplete] = useState(false);
  const [agentCard, setAgentCard] = useState<AgentCard | null>(null);
  const [showCeremonySection, setShowCeremonySection] = useState(false);

  // Check ceremony status on mount
  useEffect(() => {
    setCeremonyComplete(hasCompletedCeremony());
    setAgentCard(getAgentCard());
  }, []);

  // Check if proverb is valid
  const validation = userProverb ? validateProverb(userProverb) : null;

  // Handle opening mage page
  const handleTalkToSoulbae = () => {
    const mageUrl = `/mage?tale_id=${taleId}&context=donation`;
    const newWindow = window.open(mageUrl, '_blank', 'width=800,height=900');
    setMageWindow(newWindow);
  };

  // Handle copy to Zodl
  const handleCopyToZodl = async () => {
    if (!userProverb.trim()) return;

    const memo = formatZcashMemo(taleId, userProverb.trim());
    
    try {
      await navigator.clipboard.writeText(memo);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy memo:', err);
    }
  };

  // Handle copy spell
  const handleCopySpell = async () => {
    if (!spell) return;

    try {
      await navigator.clipboard.writeText(spell);
      setSpellCopied(true);
      setTimeout(() => setSpellCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy spell:', err);
    }
  };

  // Listen for messages from mage window (if user copies proverb there)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from same origin
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'PROVERB_COPIED' && event.data.proverb) {
        setUserProverb(event.data.proverb);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
      {/* Toggle Button - Fixed on right side */}
      {!isOpen && (
        <motion.button
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          onClick={() => setIsOpen(!isOpen)}
          className="fixed right-0 top-1/2 z-[60] transform -translate-y-1/2"
          data-swordsman-toggle
        >
          <div className="bg-primary/90 hover:bg-primary text-white px-4 py-6 rounded-l-lg shadow-lg flex items-center gap-2 transition-all">
            <span className="text-xl">⚔️</span>
            <span className="font-medium hidden sm:inline">Swordsman</span>
          </div>
        </motion.button>
      )}

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[55] md:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-surface border-l border-surface/50 z-[60] shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚔️</span>
                    <div>
                      <h2 className="text-xl font-bold text-text">Swordsman</h2>
                      <p className="text-sm text-text-muted">Your wallet, your control</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-text-muted hover:text-text text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                {/* Info Card */}
                <div className="card bg-primary/10 border-primary/30 mb-6">
                  <p className="text-sm text-text-muted mb-2">
                    <strong className="text-text">The Swordsman</strong> is your wallet. You control the transaction amount, verify privacy, and approve spending.
                  </p>
                  <p className="text-xs text-text-muted">
                    Soulbae (the Mage) helps craft your proverb but never sees your amount or wallet.
                  </p>
                </div>

                {/* Progressive System - Learning First */}
                <div className="mb-6">
                  {/* Learning the Spell - Active & Focused */}
                  <div className="w-full text-left p-4 rounded-lg border-2 border-secondary bg-secondary/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>🧙‍♂️</span>
                        <h3 className="font-semibold text-text">Learning the Spell</h3>
                        <span className="text-xs bg-secondary/30 text-secondary px-2 py-0.5 rounded">Active</span>
                      </div>
                      <span className="text-secondary text-lg">✓</span>
                    </div>
                    <div className="text-2xl font-bold text-secondary mb-1">0.01 ZEC</div>
                    <div className="text-sm text-text-muted mb-2">Send shielded transaction with your proverb</div>
                    <div className="text-xs text-text-muted mb-2">Via Zodl wallet • Unlimited signals</div>
                    <div className="text-xs text-secondary/80 border-t border-secondary/20 pt-2 mt-2">
                      <strong>Public:</strong> Proverb commitment • <strong>Private:</strong> Fees in treasury
                    </div>
                    <div className="mt-3 pt-3 border-t border-secondary/20">
                      <p className="text-xs text-text-muted">
                        <strong className="text-text">Experiment:</strong> Create your proverb, signal your understanding, and see how compression reveals meaning.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 1: Talk to Soulbae */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                    <span className="text-lg">🧙‍♀️</span>
                    <span>Step 1: Form Your Proverb</span>
                  </h3>
                  <button
                    onClick={handleTalkToSoulbae}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    <span>Talk to Soulbae</span>
                    <span className="text-sm">→</span>
                  </button>
                  <p className="text-xs text-text-muted mt-2">
                    You may Form your proverb from your own memory and context—Soulbae (the first mage) is an optional helper. Opens in new window.
                  </p>
                </div>

                {/* Step 2: Paste Proverb */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    <span>Step 2: Paste Your Proverb</span>
                  </h3>
                  <textarea
                    value={userProverb}
                    onChange={(e) => setUserProverb(e.target.value)}
                    placeholder="Paste your proverbial wisdom here..."
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-surface/50 rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  {validation && (
                    <div className={`mt-2 text-xs px-3 py-2 rounded ${
                      validation.valid
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {validation.valid ? (
                        <span>✓ {validation.length}/{validation.maxLength} bytes - Valid</span>
                      ) : (
                        <span>⚠ Proverb too long ({validation.length}/{validation.maxLength} bytes)</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Step 3: Copy to Zodl */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    <span>Step 3: Send Shielded Transaction (0.01 ZEC)</span>
                  </h3>
                  <button
                    onClick={handleCopyToZodl}
                    disabled={!userProverb.trim() || (validation !== null && !validation.valid)}
                    className="w-full btn-secondary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {copied ? (
                      <>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-lg"
                        >
                          ✓
                        </motion.span>
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <span>📋</span>
                        <span>Copy Memo to Zodl</span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-text-muted mt-2">
                    Paste the memo into your Zodl wallet, set amount to <strong className="text-secondary">0.01 ZEC</strong>, and send to:
                  </p>
                  <div className="mt-2">
                    <UAddressDisplay
                      label="zec"
                      variant="small-button"
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div className="card bg-secondary/10 border-secondary/30">
                  <h4 className="text-sm font-semibold text-text mb-2">Mage Learning Flow:</h4>
                  <ol className="text-xs text-text-muted space-y-1 list-decimal list-inside">
                    <li>Open your Zodl wallet</li>
                    <li>Create a new z→z (shielded) transaction</li>
                    <li>Paste the memo into the memo field</li>
                    <li>Set amount to <strong className="text-secondary">0.01 ZEC</strong></li>
                    <li>Send to the address above</li>
                  </ol>
                  <div className="mt-3 pt-3 border-t border-secondary/20">
                    <p className="text-xs text-text-muted">
                      <strong className="text-text">v1 Focus:</strong> Experiment with creating proverbs and signaling your understanding.
                      Protection features will be available in future versions.
                    </p>
                  </div>
                  <p className="text-xs text-text-muted mt-3 italic">
                    Your wallet is your Swordsman. You control the transaction. The Mage signals your learning. ⚔️🧙‍♂️
                  </p>
                </div>

                {/* Protecting the Spell - Locked */}
                <div className="mt-6 w-full text-left p-4 rounded-lg border-2 border-surface/30 bg-surface/10 opacity-60 relative">
                  <div className="absolute inset-0 bg-black/5 rounded-lg flex items-center justify-center">
                    <div className="bg-surface/90 px-3 py-1 rounded border border-surface/50 shadow-lg">
                      <span className="text-xs font-semibold text-text-muted">🔒 Locked</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>🛡️</span>
                      <h3 className="font-semibold text-text-muted">Protecting the Spell</h3>
                      <span className="text-xs bg-surface/30 text-text-muted px-2 py-0.5 rounded">Coming Soon</span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-text-muted mb-1">1 ZEC</div>
                  <div className="text-sm text-text-muted mb-2">Swordsmen stake 1 ZEC to protect the spellbook</div>
                  <div className="text-xs text-text-muted mb-2">Via Zodl wallet • Guardians store proverb privately</div>
                  <div className="text-xs text-text-muted/60 border-t border-surface/20 pt-2 mt-2">
                    <strong>Private:</strong> Proverb in spellbook • <strong>Public:</strong> 1 ZEC stake proof
                  </div>
                </div>

                {/* Celestial Ceremony Section */}
                <div className="mt-6 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
                  <button
                    type="button"
                    onClick={() => setShowCeremonySection(!showCeremonySection)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">☀️ ⊥ 🌕</span>
                      <h3 className="font-semibold text-text">Celestial Ceremony</h3>
                    </div>
                    <span className="text-text-muted">{showCeremonySection ? '−' : '+'}</span>
                  </button>

                  {showCeremonySection && (
                    <div className="mt-4 space-y-4">
                      {/* Ceremony Status */}
                      <div className="p-3 bg-background/50 rounded-lg border border-surface/30">
                        <div className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Identity Status</div>
                        {ceremonyComplete && agentCard ? (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-green-400">✓</span>
                              <span className="text-text text-sm">Public identity active</span>
                            </div>
                            <div className="text-xs text-text-muted mb-2">Private key: burned (not stored)</div>
                            <div className="text-xs font-mono text-text/70 break-all">{agentCard.participantId}</div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-amber-400">○</span>
                              <span className="text-text-muted text-sm">No identity created</span>
                            </div>
                            <Link
                              href="/ceremony"
                              className="inline-block mt-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-medium rounded transition-colors"
                            >
                              Start Ceremony →
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Progression */}
                      <div className="text-center text-text-muted text-xs">
                        <span className="font-mono">Understanding</span>
                        <span className="mx-1 text-primary">→</span>
                        <span className="font-mono">Constellation</span>
                        <span className="mx-1 text-primary">→</span>
                        <span className="font-mono">Blade</span>
                      </div>

                      {/* Quick links */}
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href="/poems"
                          className="px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 rounded text-xs text-secondary transition-colors"
                        >
                          Poems
                        </Link>
                        <a
                          href="https://spellweb.ai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded text-xs text-primary transition-colors"
                        >
                          Spellweb ↗
                        </a>
                        {ceremonyComplete && (
                          <Link
                            href="/ceremony"
                            className="px-3 py-1.5 bg-surface/20 hover:bg-surface/30 border border-surface/30 rounded text-xs text-text-muted transition-colors"
                          >
                            View Card
                          </Link>
                        )}
                      </div>

                      {/* Proverb */}
                      <div className="text-xs text-text-muted italic text-center pt-2 border-t border-surface/30">
                        The overlap is the ceremony. The amnesia is the protocol.
                      </div>
                    </div>
                  )}
                </div>

                {/* Act/Spell Matching Info */}
                <div className="mt-6 pt-6 border-t border-surface/50 space-y-3">
                  {actName && (
                    <div>
                      <p className="text-xs text-text-muted mb-1">
                        <strong className="text-text">Act Name:</strong>
                      </p>
                      <p className="text-sm font-semibold text-text">{actName}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-text-muted mb-1">
                      <strong className="text-text">Act Number:</strong>
                    </p>
                    <p className="text-sm font-semibold text-text">Act {actNumber}</p>
                  </div>
                  {spellbook && (
                    <div>
                      <p className="text-xs text-text-muted mb-1">
                        <strong className="text-text">Spellbook:</strong>
                      </p>
                      <p className={`text-sm font-semibold ${
                        spellbook === 'story' ? 'text-primary' :
                        spellbook === 'canon' ? 'text-secondary' :
                        spellbook === 'society' ? 'text-amber-400' :
                        spellbook === 'plurality' ? 'text-cyan-400' :
                        'text-accent'
                      }`}>
                        {spellbook === 'story' ? 'Story' :
                         spellbook === 'canon' ? 'Canon' :
                         spellbook === 'society' ? 'Society' :
                         spellbook === 'plurality' ? 'Plurality' :
                         'Zero'} Spellbook
                      </p>
                    </div>
                  )}
                  {spell && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-text-muted">
                          <strong className="text-text">Compression Spell:</strong>
                        </p>
                        <button
                          onClick={handleCopySpell}
                          className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                          title="Copy spell"
                        >
                          {spellCopied ? (
                            <>
                              <span className="text-lg">✓</span>
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <span>📋</span>
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-2 bg-primary/5 border border-primary/20 rounded text-xs font-mono text-text break-all cursor-pointer hover:bg-primary/10 transition-colors" onClick={handleCopySpell} title="Click to copy">
                        {spell}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-text-muted mb-1">
                      <strong className="text-text">Tale ID:</strong>
                    </p>
                    <p className="text-xs font-mono text-text-muted break-all">{taleId}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

