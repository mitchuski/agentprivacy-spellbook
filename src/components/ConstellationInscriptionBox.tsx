'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export interface ConstellationInscriptionBoxProps {
  /** e.g. "Tale", "Act", "Chapter" */
  nodeKind: string;
  /** Current node id (act/tale/chapter number). */
  activeId: number;
  /** Emoji spell / inscription for this node. */
  spell: string | null;
  /** Oracle/canonical proverb for this node. */
  proverb?: string | null;
  /** Optional: user's inscribed proverb (shows when they've inscribed). */
  inscribedProverb?: string | null;
  onCopyProverb?: (text: string) => void;
  onCopySpell?: (text: string) => void;
  /** When set, a crystal ball button is shown (bottom right) to open inscribe-proverb for this node. */
  onInscribe?: (nodeId: number) => void;
}

export default function ConstellationInscriptionBox({
  nodeKind,
  activeId,
  spell,
  proverb,
  inscribedProverb,
  onCopyProverb,
  onCopySpell,
  onInscribe,
}: ConstellationInscriptionBoxProps) {
  const [copiedProverb, setCopiedProverb] = useState(false);
  const [copiedSpell, setCopiedSpell] = useState(false);

  const proverbText = inscribedProverb?.trim() || proverb?.trim();

  const handleCopyProverb = async () => {
    if (!proverbText) return;
    try {
      await navigator.clipboard.writeText(proverbText);
      setCopiedProverb(true);
      onCopyProverb?.(proverbText);
      setTimeout(() => setCopiedProverb(false), 2000);
    } catch (err) {
      console.error('Failed to copy proverb:', err);
    }
  };

  const handleCopySpell = async () => {
    if (!spell) return;
    try {
      await navigator.clipboard.writeText(spell);
      setCopiedSpell(true);
      onCopySpell?.(spell);
      setTimeout(() => setCopiedSpell(false), 2000);
    } catch (err) {
      console.error('Failed to copy spell:', err);
    }
  };

  const hasContent = !!spell?.trim() || !!proverbText;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl border border-surface/50 bg-surface/20 p-4 flex flex-col min-h-[140px] lg:min-h-[200px] relative"
    >
      <h3 className="text-sm font-semibold text-text mb-2">
        {nodeKind} {activeId}
      </h3>
      {!hasContent ? (
        <p className="text-xs text-text-muted flex-1">Select a {nodeKind.toLowerCase()} on the path to see its inscription and proverb.</p>
      ) : (
        <>
          {spell?.trim() && (
            <div className="mb-3">
              <p className="text-xs text-text-muted mb-1">Inscription</p>
              <p className="text-sm font-mono text-text whitespace-pre-line break-all leading-relaxed">{spell}</p>
              <button
                type="button"
                onClick={handleCopySpell}
                className="mt-1.5 px-2 py-1 text-xs font-medium rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary transition-colors"
              >
                {copiedSpell ? '✓ Copied' : 'Copy spell'}
              </button>
            </div>
          )}
          {proverbText && (
            <div className="flex-1 min-h-0">
              <p className="text-xs text-text-muted mb-1">Proverb</p>
              <p className="text-sm text-text italic leading-relaxed">"{proverbText}"</p>
              <button
                type="button"
                onClick={handleCopyProverb}
                className="mt-1.5 px-2 py-1 text-xs font-medium rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary transition-colors"
                title="Copy proverb"
              >
                {copiedProverb ? '✓ Copied' : 'Copy proverb'}
              </button>
            </div>
          )}
        </>
      )}
      {hasContent && onInscribe && (
        <div className="absolute bottom-3 right-3">
          <button
            type="button"
            onClick={() => onInscribe(activeId)}
            className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary transition-colors"
            title="Inscribe proverb"
            aria-label="Inscribe proverb"
          >
            <span className="text-lg" role="img" aria-hidden>🔮</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
