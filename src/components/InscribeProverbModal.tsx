'use client';

import { useState, useEffect, useMemo } from 'react';
import { setInscribedProverb, addSpellToSpellbook, getSpellIdForNode, getInscribedProverbsRaw } from '@/lib/spellbook-storage';
import type { PathwaySpellbook } from '@/lib/spellbook-storage';
import { getSpellemojiForSpellbook } from '@/lib/zcash-memo';
import { tokenizeSpellEmoji } from '@/lib/spell-emoji-tokens';

/** Fallback constellation markers when the spell has fewer than 2 emoji tokens (ensure user always has choice). */
const FALLBACK_MARKERS: Record<PathwaySpellbook, string[]> = {
  zero: ['🔐', '📜'],
  plurality: ['⿻', '🤝'],
  story: ['⚔️', '🔮'],
  canon: ['📜', '⏳'],
  society: ['🏰', '🔗'],
};

export interface InscribeProverbModalProps {
  open: boolean;
  onClose: () => void;
  /** Act/tale/chapter number for this node */
  nodeId: number;
  /** e.g. "Act 13", "Tale 7" */
  nodeLabel: string;
  spellbook: PathwaySpellbook;
  /** Existing proverb if already inscribed (for edit) */
  initialProverb?: string;
  /** Existing constellation marker emoji if already set */
  initialMarkerEmoji?: string;
  /** Called after commit so parent can refresh pathway / UI */
  onCommitted?: () => void;
}

export default function InscribeProverbModal({
  open,
  onClose,
  nodeId,
  nodeLabel,
  spellbook,
  initialProverb = '',
  initialMarkerEmoji: initialMarkerProp,
  onCommitted,
}: InscribeProverbModalProps) {
  const [proverb, setProverb] = useState(initialProverb);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(initialMarkerProp ?? null);

  const spellId = useMemo(() => getSpellIdForNode(spellbook, nodeId), [spellbook, nodeId]);
  const spellEmojiString = useMemo(() => getSpellemojiForSpellbook(spellbook, nodeId), [spellbook, nodeId]);
  const emojiTokens = useMemo(() => {
    const tokens = tokenizeSpellEmoji(spellEmojiString);
    if (tokens.length >= 2) return tokens;
    const fallback = FALLBACK_MARKERS[spellbook] ?? ['✨', '🔮'];
    const combined = [...tokens];
    for (const emoji of fallback) {
      if (combined.length >= 2) break;
      if (!combined.includes(emoji)) combined.push(emoji);
    }
    return combined.slice(0, Math.max(2, combined.length));
  }, [spellEmojiString, spellbook]);

  useEffect(() => {
    if (!open) return;
    setProverb(initialProverb);
    const raw = spellId && typeof window !== 'undefined' ? getInscribedProverbsRaw()[spellId] : undefined;
    const entry = raw && typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? raw : undefined;
    setSelectedMarker(initialMarkerProp ?? entry?.markerEmoji ?? null);
  }, [open, initialProverb, initialMarkerProp, spellId]);

  // Default to first emoji token when none chosen yet
  useEffect(() => {
    if (!open || selectedMarker != null || emojiTokens.length === 0) return;
    setSelectedMarker(emojiTokens[0]);
  }, [open, emojiTokens, selectedMarker]);

  const handleCommit = () => {
    const trimmed = proverb.trim();
    if (!trimmed) return;
    if (!spellId) return;
    setInscribedProverb(spellId, trimmed, selectedMarker ?? undefined);
    addSpellToSpellbook(spellId);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('agentprivacy:learning-spells-sync'));
    }
    onCommitted?.();
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inscribe-proverb-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-surface/50 bg-background p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 id="inscribe-proverb-title" className="text-xl font-semibold text-text mb-2">
          Inscribe your proverb
        </h2>
        <p className="text-sm text-text/70 mb-3">
          For {nodeLabel}. Align your proverb to this act and choose an emoji from its spell as your constellation marker—once you submit, that marker stays lit in your spellbook.
        </p>

        {spellEmojiString && (
          <div className="mb-3">
            <p className="text-xs font-medium text-text/70 mb-1">Spell for this act</p>
            <p className="text-sm text-text font-mono break-all bg-surface/30 rounded px-2 py-1.5">
              {spellEmojiString}
            </p>
          </div>
        )}

        {emojiTokens.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-text/70 mb-2">Pick your constellation marker</p>
            <div className="flex flex-wrap gap-1.5">
              {emojiTokens.map((token) => {
                const isSelected = selectedMarker === token;
                return (
                  <button
                    key={token}
                    type="button"
                    onClick={() => setSelectedMarker(token)}
                    className={`text-lg px-2 py-1 rounded border transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/20 ring-1 ring-primary/50'
                        : 'border-surface/50 bg-surface/20 hover:border-surface hover:bg-surface/40'
                    }`}
                    title={isSelected ? 'Selected as constellation marker' : 'Select as constellation marker'}
                    aria-pressed={isSelected}
                  >
                    {token}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-medium text-text/70 mb-1">Your proverb</label>
          <textarea
            value={proverb}
            onChange={(e) => setProverb(e.target.value)}
            placeholder="Your proverb for this act..."
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-surface/50 bg-background text-text placeholder:text-text/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Proverb text"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-surface/50 hover:bg-surface/30 text-text"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCommit}
            disabled={!proverb.trim()}
            className="flex-1 py-2 rounded-lg font-medium bg-primary text-background hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
