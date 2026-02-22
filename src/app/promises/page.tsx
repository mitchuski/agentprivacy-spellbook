'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPromises } from '@/lib/promises/storage';
import type { PromiseEntry } from '@/lib/promises/types';
import { DEFAULT_PROMISES } from '@/lib/promises/default-promises';
import AppNav from '@/components/AppNav';
import PromiseBoard from '@/components/promises/PromiseBoard';
import PromiseCard from '@/components/promises/PromiseCard';

/** Locked-in default promises as PromiseEntry-shaped items (read-only). */
const LOCKED_PROMISES: PromiseEntry[] = DEFAULT_PROMISES.map(({ category: _c, ...rest }, i) => ({
  ...rest,
  id: `locked-${i}`,
  createdAt: '',
  updatedAt: '',
}));

export default function PromisesPage() {
  const [promises, setPromises] = useState<PromiseEntry[]>([]);
  const [prefillProverb, setPrefillProverb] = useState<string | undefined>(undefined);

  const refresh = useCallback(() => {
    setPromises(getPromises());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const proverb = params.get('proverb');
    if (proverb) setPrefillProverb(proverb);
  }, []);

  return (
    <div className="min-h-screen bg-background text-text">
      <AppNav />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-text mb-2">My Promises</h1>
        <p className="text-text/70 mb-4">
          Voluntary commitments tied to your learning journey. Move cards between Active, In progress, and Completed.
        </p>
        <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 mb-8">
          <p className="text-sm text-text/80 italic mb-2">
            &ldquo;Agents can only promise their own behaviour.&rdquo;
          </p>
          <p className="text-sm text-text/80">
            These are my promises first — but the idea is this board evolves to become a city of mages and an army of swordsmen, all doing their duties and keeping their promises to each other as agents and humans.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-text mb-3">Your promises</h2>
          <PromiseBoard promises={promises} refresh={refresh} prefillProverb={prefillProverb} />
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-text mb-3">Locked-in promises</h2>
          <p className="text-text/60 text-sm mb-4">
            Core commitments from the privacymage. These anchor the dual-agent architecture and your learning path.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {LOCKED_PROMISES.map((p) => (
              <PromiseCard
                key={p.id}
                promise={p}
                onStatusChange={() => {}}
                onDelete={() => {}}
                locked
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
