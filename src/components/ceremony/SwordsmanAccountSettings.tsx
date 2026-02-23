'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { AgentCard } from '@/lib/ceremony/types';
import { clearIdentity } from '@/lib/ceremony/storage';

export default function SwordsmanAccountSettings({ card, onClear }: { card: AgentCard; onClear: () => void }) {
  const [copied, setCopied] = useState(false);
  const [showRerollConfirm, setShowRerollConfirm] = useState(false);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(card.participantId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleRerollConfirm = () => {
    clearIdentity();
    setShowRerollConfirm(false);
    onClear();
  };

  return (
    <div className="rounded-xl border border-surface/50 bg-surface/10 p-6 mb-10">
      <h2 className="text-xl font-semibold text-text mb-1">Account</h2>
      <p className="text-sm text-text-muted mb-6">
        Your Swordsman identity is saved to this browser. Your spellbooks and proverbs are tied to this key.
      </p>
      <dl className="space-y-4">
        <div>
          <dt className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Display name</dt>
          <dd className="text-text font-medium">{card.displayName}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Participant ID</dt>
          <dd className="flex items-center gap-2 flex-wrap">
            <code className="text-sm text-text/80 bg-surface/50 px-2 py-1 rounded font-mono break-all">
              {card.participantId}
            </code>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </dd>
        </div>
        {card.constellationPath && (
          <div>
            <dt className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Constellation path</dt>
            <dd className="text-lg">{card.constellationPath}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Trust tier</dt>
          <dd className="text-text capitalize">{card.trustTier}</dd>
        </div>
      </dl>
      <div className="mt-6 pt-6 border-t border-surface/50">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">Next steps</p>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="px-4 py-2 rounded-lg bg-surface/50 text-text-muted border border-surface/50 font-medium cursor-not-allowed"
            aria-current="page"
          >
            ⚔️ Ceremony
          </span>
          <Link
            href="/story"
            className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/40 font-medium hover:bg-primary/30 transition-colors"
          >
            📖 Story
          </Link>
          <Link
            href="/spells"
            className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/40 font-medium hover:bg-primary/30 transition-colors"
          >
            🔮 Spellbook
          </Link>
          <button
            type="button"
            onClick={() => setShowRerollConfirm(true)}
            className="px-4 py-2 rounded-lg font-medium text-text-muted hover:text-text border border-surface/50 hover:border-surface transition-colors"
          >
            Reroll keys
          </button>
        </div>
      </div>

      {showRerollConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" aria-modal="true" role="dialog">
          <div className="rounded-xl border border-surface/50 bg-background p-6 max-w-sm w-full shadow-xl">
            <p className="text-text font-medium mb-4">
              This clears your history with the website. Are you sure?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowRerollConfirm(false)}
                className="px-4 py-2 rounded-lg border border-surface/50 text-text hover:bg-surface/30"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRerollConfirm}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 border border-red-500/40 hover:bg-red-500/30 font-medium"
              >
                Yes, clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
