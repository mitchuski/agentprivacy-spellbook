'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { updatePromiseStatus, deletePromise, addPromise } from '@/lib/promises/storage';
import type { PromiseEntry, PromiseStatus, PromiseType, PromiseForce } from '@/lib/promises/types';
import { hasCompletedCeremony } from '@/lib/ceremony/storage';
import { incrementCompletedPromises } from '@/lib/trust/storage';
import PromiseCard from './PromiseCard';
import NewPromiseModal from './NewPromiseModal';

export default function PromiseBoard({
  promises,
  refresh,
  prefillProverb,
}: {
  promises: PromiseEntry[];
  refresh: () => void;
  prefillProverb?: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [showCeremonyRequired, setShowCeremonyRequired] = useState(false);
  const [initialProverb, setInitialProverb] = useState(prefillProverb ?? '');

  const openNewPromise = (proverb?: string) => {
    if (!hasCompletedCeremony()) {
      setShowCeremonyRequired(true);
      return;
    }
    setInitialProverb(proverb ?? '');
    setShowModal(true);
  };

  useEffect(() => {
    if (prefillProverb) {
      if (!hasCompletedCeremony()) setShowCeremonyRequired(true);
      else {
        setInitialProverb(prefillProverb);
        setShowModal(true);
      }
    }
  }, [prefillProverb]);

  const byStatus = useMemo(() => {
    const active: PromiseEntry[] = [];
    const inProgress: PromiseEntry[] = [];
    const completed: PromiseEntry[] = [];
    for (const p of promises) {
      if (p.status === 'active') active.push(p);
      else if (p.status === 'in_progress') inProgress.push(p);
      else if (p.status === 'completed') completed.push(p);
    }
    return { active, inProgress, completed };
  }, [promises]);

  const handleStatusChange = (id: string, status: PromiseStatus) => {
    const prev = promises.find((p) => p.id === id);
    updatePromiseStatus(id, status);
    if (prev?.status !== 'completed' && status === 'completed') incrementCompletedPromises();
    refresh();
  };

  const handleDelete = (id: string) => {
    deletePromise(id);
    refresh();
  };

  const handleAdd = (params: {
    type: PromiseType;
    description: string;
    proverb?: string;
    spell?: string;
    constellation?: string;
    tags?: string[];
    force?: PromiseForce;
    connectedProverb?: string;
    grimoire?: string;
    actNumber?: number;
  }) => {
    addPromise({ ...params, status: 'active' });
    refresh();
    setShowModal(false);
    setInitialProverb('');
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => openNewPromise()}
          className="px-4 py-2 rounded-xl font-medium bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30"
        >
          + New Promise
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-surface/50 bg-surface/10 p-4">
          <h3 className="font-semibold text-text mb-3">Active</h3>
          <div className="space-y-3">
            {byStatus.active.map((p) => (
              <PromiseCard
                key={p.id}
                promise={p}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-surface/50 bg-surface/10 p-4">
          <h3 className="font-semibold text-text mb-3">In progress</h3>
          <div className="space-y-3">
            {byStatus.inProgress.map((p) => (
              <PromiseCard
                key={p.id}
                promise={p}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-surface/50 bg-surface/10 p-4">
          <h3 className="font-semibold text-text mb-3">Completed</h3>
          <div className="space-y-3">
            {byStatus.completed.map((p) => (
              <PromiseCard
                key={p.id}
                promise={p}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <NewPromiseModal
          initialProverb={initialProverb}
          onAdd={handleAdd}
          onClose={() => { setShowModal(false); setInitialProverb(''); }}
        />
      )}

      {showCeremonyRequired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-label="Ceremony required">
          <div className="w-full max-w-md rounded-2xl border border-surface/50 bg-background p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-text mb-2">Create your Swordsman identity to make promises</h2>
            <p className="text-text/70 text-sm mb-6">
              Promises are tied to your identity. Complete the ceremony once to add and track promises.
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowCeremonyRequired(false)} className="flex-1 py-2 rounded-lg border border-surface/50 hover:bg-surface/30">Cancel</button>
              <Link href="/ceremony?returnTo=/promises" className="flex-1 py-2 rounded-lg font-medium bg-primary text-background hover:bg-primary/90 text-center">Begin Ceremony</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
