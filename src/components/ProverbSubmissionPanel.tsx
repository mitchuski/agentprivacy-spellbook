'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatZcashMemo, validateProverb } from '@/lib/zcash-memo';
import UAddressDisplay from '@/components/UAddressDisplay';

interface ProverbSubmissionPanelProps {
  taleId: string;
  actNumber: number;
  spellbook?: 'story' | 'zero' | 'canon' | 'society' | 'plurality';
  actName?: string;
  spell?: string;
}

export default function ProverbSubmissionPanel({ taleId, actNumber, spellbook, actName, spell }: ProverbSubmissionPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userProverb, setUserProverb] = useState('');
  const [copied, setCopied] = useState(false);
  const [spellCopied, setSpellCopied] = useState(false);

  // Check if proverb is valid
  const validation = userProverb ? validateProverb(userProverb) : null;

  // Handle copy to Zashi (optional Zcash flow)
  const handleCopyToZashi = async () => {
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

  // Handle copy proverb (simple copy without Zcash)
  const handleCopyProverb = async () => {
    if (!userProverb.trim()) return;

    try {
      await navigator.clipboard.writeText(userProverb.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy proverb:', err);
    }
  };

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
          data-proverb-submission-toggle
        >
          <div className="bg-primary/90 hover:bg-primary text-white px-4 py-6 rounded-l-lg shadow-lg flex items-center gap-2 transition-all">
            <span className="text-xl">⚔️</span>
            <span className="font-medium hidden sm:inline">Submit Proverb</span>
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
                      <h2 className="text-xl font-bold text-text">Submit Proverb</h2>
                      <p className="text-sm text-text-muted">Share your understanding</p>
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
                  <p className="text-sm text-text-muted">
                    <strong className="text-text">Protect this knowledge.</strong> A donation to the story flow (0.01 ZEC) gives you a proof of understanding.
                  </p>
                </div>

                {/* Step 1: Enter Proverb */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    <span>Enter Your Proverb</span>
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

                {/* Protect This Knowledge - Primary Action */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                    <span className="text-lg">⚔️</span>
                    <span>Protect This Knowledge</span>
                  </h3>
                  <button
                    onClick={handleCopyToZashi}
                    disabled={!userProverb.trim() || (validation !== null && !validation.valid)}
                    className="w-full btn-secondary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
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
                        <span>Copy Memo to Zashi</span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-text-muted mb-2">
                    Paste the memo into your Zashi wallet, set amount to <strong className="text-secondary">0.01 ZEC</strong>, and send to:
                  </p>
                  <div className="mt-2">
                    <UAddressDisplay
                      label="zec"
                      variant="small-button"
                    />
                  </div>
                </div>

                {/* Optional: Simple Copy */}
                <div className="mb-6">
                  <button
                    onClick={handleCopyProverb}
                    disabled={!userProverb.trim()}
                    className="w-full py-2 text-sm text-text-muted hover:text-text transition-colors border border-surface/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {copied ? '✓ Copied!' : 'Copy Proverb (Local Use)'}
                  </button>
                </div>

                {/* Act/Spell Info */}
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

