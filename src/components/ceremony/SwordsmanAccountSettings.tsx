'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { AgentCard } from '@/lib/ceremony/types';
import { clearIdentity } from '@/lib/ceremony/storage';

export default function SwordsmanAccountSettings({ card, onClear }: { card: AgentCard; onClear: () => void }) {
  const [copied, setCopied] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(card.participantId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearIdentity();
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
      <div className="mt-6 pt-6 border-t border-surface/50 flex flex-wrap items-center gap-3">
        <Link
          href="/spells"
          className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/40 font-medium hover:bg-primary/30 transition-colors"
        >
          Go to Spells
        </Link>
        <button
          type="button"
          onClick={handleClear}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            confirmClear
              ? 'bg-red-500/20 text-red-500 border border-red-500/40 hover:bg-red-500/30'
              : 'text-text-muted hover:text-text border border-surface/50 hover:border-surface'
          }`}
        >
          {confirmClear ? 'Click again to clear identity' : 'Clear identity'}
        </button>
        {confirmClear && (
          <button
            type="button"
            onClick={() => setConfirmClear(false)}
            className="text-sm text-text-muted hover:text-text"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
