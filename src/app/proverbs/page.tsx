'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import AppNav from '@/components/AppNav';
import { useMagePanel } from '@/contexts/MagePanelContext';
import ProverbCard from '@/components/ProverbCard';
import EvokeModal from '@/components/EvokeModal';
import UAddressDisplay from '@/components/UAddressDisplay';
import {
  getUserProverbs,
  getGrimoireDisplayName,
  type UserProverb,
  type ProverbSourceType,
} from '@/lib/proverbs/storage';
import {
  getInscribedProverbs,
  getInscribedProverbsRaw,
  getInscribedTaleLabel,
} from '@/lib/spellbook-storage';
import { formatZcashMemo } from '@/lib/zcash-memo';
import { GRIMOIRE_OPTIONS } from '@/lib/ceremony/types';

function getSpellbookLink(taleId: string): { href: string; label: string } | null {
  const storyMatch = taleId.match(/^act-(\d{2})-/);
  if (storyMatch) return { href: `/story?act=${parseInt(storyMatch[1], 10)}`, label: 'Story' };
  if (taleId.match(/^zero-tale-/)) return { href: '/zero', label: 'Zero' };
  if (taleId.startsWith('canon') || taleId === 'guardian') return { href: '/canon', label: 'Canon' };
  if (taleId.startsWith('society')) return { href: '/society', label: 'Society' };
  if (taleId.startsWith('plurality')) return { href: '/plurality', label: 'Plurality' };
  return null;
}

type FilterKind = 'all' | 'grimoire' | 'source';
const GRIMOIRE_FILTERS = GRIMOIRE_OPTIONS.map((g) => ({ id: g, label: getGrimoireDisplayName(g) }));
const SOURCE_FILTERS: { id: ProverbSourceType; label: string }[] = [
  { id: 'mage_response', label: 'From Mage' },
  { id: 'cast_agreement', label: 'Agreed on cast' },
  { id: 'cast_inscription', label: 'Cast inscription' },
];


type InscribedEntry = { taleId: string; proverb: string; markerEmoji?: string };

function ProverbsPageContent() {
  const { openMagePanel } = useMagePanel();
  const [proverbs, setProverbs] = useState<UserProverb[]>([]);
  const [inscribedEntries, setInscribedEntries] = useState<InscribedEntry[]>([]);
  const [filter, setFilter] = useState<FilterKind>('all');
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [revealTaleId, setRevealTaleId] = useState<string | null>(null);
  const [memoCopiedTaleId, setMemoCopiedTaleId] = useState<string | null>(null);
  const [showEvokeModal, setShowEvokeModal] = useState(false);
  const [evokeProverb, setEvokeProverb] = useState<string>("")

  const load = useCallback(() => {
    setProverbs(getUserProverbs());
    const raw = getInscribedProverbs();
    const rawMeta = getInscribedProverbsRaw();
    setInscribedEntries(
      Object.entries(raw)
        .filter(([, p]) => (p ?? '').trim())
        .map(([taleId, proverb]) => ({
          taleId,
          proverb: proverb ?? '',
          markerEmoji:
            typeof rawMeta[taleId] === 'object' && rawMeta[taleId] != null && !Array.isArray(rawMeta[taleId])
              ? (rawMeta[taleId] as { markerEmoji?: string }).markerEmoji
              : undefined,
        }))
    );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [load]);

  const filtered =
    filter === 'all'
      ? proverbs
      : filter === 'grimoire' && filterValue
        ? proverbs.filter((p) => p.grimoire === filterValue)
        : filter === 'source' && filterValue
          ? proverbs.filter((p) => p.sourceType === filterValue)
          : proverbs;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <AppNav />

      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-text mb-2 flex items-center gap-2">
              <span className="text-primary">◆</span> Proverbs
            </h1>
            <p className="text-text-muted mb-6">
              Relationship Proverb Protocol (RPP): proverbs connect seeker context to the tale. Inscribe from Mage
              responses or agree on casts; add to your spell graph or inscribe on the constellation.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="button"
                onClick={() => { setEvokeProverb(''); setShowEvokeModal(true); }}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-background font-medium rounded-xl transition-colors"
              >
                <span>✦ Evoke Proverb</span>
              </button>
              <button
                type="button"
                onClick={openMagePanel}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-surface/50 hover:bg-surface text-text font-medium rounded-xl border border-surface/50 transition-colors"
              >
                🧙 Form Proverb
              </button>
            </div>
          </motion.div>

          {/* Your inscribed proverbs (from constellation) */}
          {inscribedEntries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-text mb-3">From your constellation</h2>
              <p className="text-sm text-text-muted mb-4">
                Proverbs you inscribed on the spellbook path. Evoke, add to your spell graph, or reveal on Zcash.
              </p>
              <div className="space-y-4">
                {inscribedEntries.map(({ taleId, proverb, markerEmoji }) => (
                  <motion.div
                    key={taleId}
                    layout
                    className="p-4 bg-surface/30 border border-surface/50 rounded-xl"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs text-text-muted flex items-center gap-1.5">
                        {markerEmoji && <span>{markerEmoji}</span>}
                        {getInscribedTaleLabel(taleId)}
                      </span>
                      {getSpellbookLink(taleId) && (
                        <Link
                          href={getSpellbookLink(taleId)!.href}
                          className="text-xs text-primary hover:underline flex-shrink-0"
                        >
                          Map to spellbook →
                        </Link>
                      )}
                    </div>
                    <p className="text-text italic mb-3">"{proverb}"</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(proverb);
                          } catch {}
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface/50 hover:bg-surface text-text-muted hover:text-text"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEvokeProverb(proverb); setShowEvokeModal(true); }}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent"
                      >
                        ✦ Evoke
                      </button>
                      <Link
                        href="/spells"
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary"
                      >
                        ✨ Add to spell graph
                      </Link>
                      <button
                        type="button"
                        onClick={() => setRevealTaleId((prev) => (prev === taleId ? null : taleId))}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 text-secondary"
                      >
                        ⚔️ Reveal on Zcash
                      </button>
                    </div>
                    {revealTaleId === taleId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-4 pt-4 border-t border-surface/50"
                      >
                        <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                          <h4 className="text-sm font-semibold text-secondary mb-2">⚔️ Reveal on Zcash</h4>
                          <p className="text-xs text-text-muted mb-4">
                            Copy the memo and send 0.01 ZEC with it to inscribe this proverb on chain.
                          </p>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(formatZcashMemo(taleId, proverb));
                                setMemoCopiedTaleId(taleId);
                                setTimeout(() => setMemoCopiedTaleId(null), 3000);
                              } catch {}
                            }}
                            className="w-full py-2 mb-3 text-sm font-medium rounded-lg bg-secondary hover:bg-secondary/90 text-background"
                          >
                            {memoCopiedTaleId === taleId ? '✓ Memo copied' : '📋 Copy memo for Zodl'}
                          </button>
                          {memoCopiedTaleId === taleId && (
                            <div className="space-y-2 text-xs text-text-muted">
                              <p>Send 0.01 ZEC to:</p>
                              <UAddressDisplay label="zec" variant="small-button" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFilter('all');
                  setFilterValue(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-surface/30 text-text-muted hover:text-text border border-transparent'
                }`}
              >
                All
              </button>
              {GRIMOIRE_FILTERS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setFilter('grimoire');
                    setFilterValue(g.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    filter === 'grimoire' && filterValue === g.id ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-surface/30 text-text-muted hover:text-text border border-transparent'
                  }`}
                >
                  {g.label}
                </button>
              ))}
              {SOURCE_FILTERS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setFilter('source');
                    setFilterValue(s.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'source' && filterValue === s.id ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-surface/30 text-text-muted hover:text-text border border-transparent'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Feed */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-surface/50 bg-surface/10 p-8 text-center text-text-muted">
                {proverbs.length === 0 ? (
                  <>
                    <p className="mb-2">No recorded proverbs yet.</p>
                    <p className="text-sm">
                      Collect proverbs from the Mage, agree on casts in spellbooks, or inscribe on the constellation—they’ll appear here.
                    </p>
                    <button
                    type="button"
                    onClick={() => { setEvokeProverb(''); setShowEvokeModal(true); }}
                    className="mt-4 inline-block text-primary hover:underline"
                  >
                    ✦ Evoke Proverb →
                  </button>
                  </>
                ) : (
                  <p>No proverbs match the current filter.</p>
                )}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.map((proverb) => (
                  <motion.div
                    key={proverb.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProverbCard proverb={proverb} onUpdate={load} showActions={true} showSourceType />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </section>
    </div>

      <EvokeModal
        isOpen={showEvokeModal}
        onClose={() => setShowEvokeModal(false)}
        initialProverb={evokeProverb}
        onEvoked={() => setShowEvokeModal(false)}
      />
    </>
  );
}

export default function ProverbsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-muted">Loading...</p>
          </div>
        </div>
      }
    >
      <ProverbsPageContent />
    </Suspense>
  );
}
