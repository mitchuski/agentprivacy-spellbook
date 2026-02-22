'use client';

import type { PromiseEntry, PromiseStatus } from '@/lib/promises/types';
import { FORCE_SYMBOLS } from '@/lib/promises/types';

const STATUS_OPTIONS: PromiseStatus[] = ['active', 'in_progress', 'completed', 'withdrawn'];

export default function PromiseCard({
  promise,
  onStatusChange,
  onDelete,
  locked = false,
}: {
  promise: PromiseEntry;
  onStatusChange: (id: string, status: PromiseStatus) => void;
  onDelete: (id: string) => void;
  locked?: boolean;
}) {
  const proverb = promise.proverb ?? promise.connectedProverb;
  const spell = promise.spell;
  const tags = promise.tags ?? [];
  const forceSymbol = promise.force ? FORCE_SYMBOLS[promise.force] : null;

  /** Show separation notation (spell) when present, e.g. (⚔️⊥⿻⊥🧙)🙂; else constellation path. */
  const notationDisplay = spell ?? promise.constellation ?? '';

  return (
    <div className={`p-4 rounded-xl border bg-surface/20 transition-colors ${locked ? 'border-primary/30 bg-primary/5' : 'border-surface/50 hover:border-surface/80'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-primary uppercase tracking-wide flex items-center gap-1.5">
          {locked && <span className="text-sm" aria-hidden>🔒</span>}
          {forceSymbol && <span aria-hidden>{forceSymbol}</span>}
          {promise.type}
        </span>
        {!locked && (
          <select
            value={promise.status}
            onChange={(e) => onStatusChange(promise.id, e.target.value as PromiseStatus)}
            className="text-xs rounded border border-surface/50 bg-background text-text px-2 py-1"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        )}
      </div>
      {notationDisplay && (
        <p className="text-sm text-text/70 mb-1.5 font-mono whitespace-nowrap" title="Spell / separation">
          {notationDisplay}
        </p>
      )}
      <p className="text-text text-sm mb-2">{promise.description}</p>
      {proverb && (
        <p className="text-text/60 text-xs italic border-l-2 border-primary/50 pl-2 mb-2">
          {proverb}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-text/50">
        <span>{promise.grimoire && `Grimoire: ${promise.grimoire}`}</span>
        {tags.length > 0 && (
          <span className="flex flex-wrap gap-1">
            {tags.map((t) => (
              <span key={t} className="bg-surface/50 px-1.5 py-0.5 rounded">{t.startsWith('#') ? t : `#${t}`}</span>
            ))}
          </span>
        )}
        {!locked && (
          <button
            type="button"
            onClick={() => onDelete(promise.id)}
            className="text-red-500/80 hover:text-red-500"
            aria-label="Delete promise"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
