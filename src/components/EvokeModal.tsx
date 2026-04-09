'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addUserProverb, getUserProverbs, type UserProverb } from '@/lib/proverbs/storage';
import { getInscribedProverbs, getInscribedTaleLabel } from '@/lib/spellbook-storage';

export interface EvokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProverb?: string;
  onEvoked?: (proverb: UserProverb) => void;
}

type InscribedEntry = { taleId: string; proverb: string };

export default function EvokeModal({ isOpen, onClose, initialProverb = '', onEvoked }: EvokeModalProps) {
  const [proverbText, setProverbText] = useState(initialProverb);
  const [reflection, setReflection] = useState('');
  const [connectMode, setConnectMode] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [inscribedEntries, setInscribedEntries] = useState<InscribedEntry[]>([]);
  const [existingProverbs, setExistingProverbs] = useState<UserProverb[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const raw = getInscribedProverbs();
      setInscribedEntries(
        Object.entries(raw)
          .filter(([, p]) => (p ?? '').trim())
          .map(([taleId, proverb]) => ({ taleId, proverb: proverb ?? '' }))
      );
      setExistingProverbs(getUserProverbs());
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setProverbText(initialProverb);
      setReflection('');
      setConnectMode(false);
      setSelectedConnection(null);
      setSaved(false);
      setError(null);
    }
  }, [isOpen, initialProverb]);

  const handleEvoke = () => {
    if (!proverbText.trim()) {
      setError('Please enter a proverb');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const newProverb = addUserProverb({
        content: proverbText.trim(),
        grimoire: selectedConnection ? 'connected' : 'standalone',
        taleId: selectedConnection || 'standalone',
        sourceType: 'evoked',
        reflection: reflection.trim() || undefined,
        connectedTaleId: selectedConnection || undefined,
      });
      if (newProverb) {
        setSaved(true);
        onEvoked?.(newProverb);
        setTimeout(() => onClose(), 1500);
      } else {
        setError('This proverb already exists in your collection');
      }
    } catch (err) {
      setError('Failed to save proverb');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-surface/50 bg-background shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-surface/50 flex items-center justify-between shrink-0">
            <h2 className="text-lg font-semibold text-text flex items-center gap-2">
              <span>✦</span>
              Evoke
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface/50 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            {/* Proverb Input */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">Your Proverb</label>
              <textarea
                value={proverbText}
                onChange={(e) => setProverbText(e.target.value)}
                placeholder="Enter your proverb..."
                rows={3}
                className="w-full px-3 py-2 bg-surface/20 border border-surface/50 rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Reflect Section */}
            <div className="rounded-xl border border-surface/50 bg-surface/10 p-4">
              <div className="font-medium text-text text-sm mb-2 flex items-center gap-2">
                <span>🪞</span>
                Reflect
              </div>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Personal notes on this proverb..."
                rows={2}
                className="w-full px-3 py-2 bg-surface/20 border border-surface/50 rounded-lg text-text text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              />
            </div>

            {/* Connect Section */}
            <div className="rounded-xl border border-surface/50 bg-surface/10 p-4">
              <button
                type="button"
                onClick={() => setConnectMode(!connectMode)}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  connectMode
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'text-text-muted hover:text-text hover:bg-surface/50'
                }`}
              >
                <span>🔗</span>
                Connect to existing proverb
              </button>

              {connectMode && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-3 space-y-2"
                >
                  <p className="text-xs text-text-muted">
                    Link this proverb to one you've already inscribed:
                  </p>

                  {inscribedEntries.length === 0 && existingProverbs.length === 0 ? (
                    <p className="text-sm text-text-muted italic py-2">
                      No existing proverbs to connect to yet.
                    </p>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {inscribedEntries.map(({ taleId, proverb }) => (
                        <button
                          key={taleId}
                          type="button"
                          onClick={() => setSelectedConnection(selectedConnection === taleId ? null : taleId)}
                          className={`w-full text-left p-2 rounded-lg border transition-colors ${
                            selectedConnection === taleId
                              ? 'border-primary bg-primary/10'
                              : 'border-surface/50 hover:border-surface hover:bg-surface/20'
                          }`}
                        >
                          <div className="text-xs text-text-muted mb-1">{getInscribedTaleLabel(taleId)}</div>
                          <div className="text-sm text-text line-clamp-2">"{proverb}"</div>
                        </button>
                      ))}
                      {existingProverbs.slice(0, 10).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedConnection(selectedConnection === p.id ? null : p.id)}
                          className={`w-full text-left p-2 rounded-lg border transition-colors ${
                            selectedConnection === p.id
                              ? 'border-primary bg-primary/10'
                              : 'border-surface/50 hover:border-surface hover:bg-surface/20'
                          }`}
                        >
                          <div className="text-xs text-text-muted mb-1">{p.grimoire} proverb</div>
                          <div className="text-sm text-text line-clamp-2">"{p.content}"</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedConnection && (
                    <p className="text-xs text-primary">Connected to selected proverb</p>
                  )}
                </motion.div>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-surface/50 flex gap-2 justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-surface/50 text-text hover:bg-surface/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEvoke}
              disabled={!proverbText.trim() || saving || saved}
              className="px-4 py-2 rounded-lg bg-primary text-background font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Evoking...
                </>
              ) : saved ? (
                <>
                  <span>✓</span>
                  Evoked!
                </>
              ) : (
                <>
                  <span>✦</span>
                  Evoke
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
