'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import OrbMageSlots from '@/components/OrbMageSlots';
import {
  getOrbLoadout,
  saveOrbLoadout,
  ORB_LOADOUT_SLOT_COUNT,
  type OrbLoadoutSlot,
} from '@/lib/orb-loadout';

type MageCeremonyOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

function MageSpellStrip({ slots }: { slots: OrbLoadoutSlot[] }) {
  return (
    <div className="flex gap-1.5 justify-between" aria-hidden>
      {slots.map((s, i) => (
        <div
          key={`strip-${i}`}
          className={`flex-1 aspect-square max-w-[2.75rem] rounded-lg border text-center text-base leading-none flex items-center justify-center select-none ${
            s.spellId ? 'border-violet-500/50 bg-violet-500/15 text-text' : 'border-surface/40 bg-surface/10 text-text-muted'
          }`}
        >
          {s.spellId ? s.emoji || '·' : '·'}
        </div>
      ))}
    </div>
  );
}

/**
 * Layered mage HUD: left rail (sixfold ring editor) + center ceremony card — Soulbae semantics, not swordsman blade UI.
 * @see docs/MAGE_CEREMONY_OVERLAY_PLAN.md
 */
export default function MageCeremonyOverlay({ isOpen, onClose }: MageCeremonyOverlayProps) {
  const [mage, setMage] = useState<OrbLoadoutSlot[]>(() =>
    getOrbLoadout().mage.map((s) => ({ ...s }))
  );
  const [spellbookKey, setSpellbookKey] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const lo = getOrbLoadout();
    setMage(lo.mage.map((s) => ({ ...s })));
  }, [isOpen]);

  useEffect(() => {
    const onSb = () => setSpellbookKey((k) => k + 1);
    window.addEventListener('agentprivacy:spellbook-changed', onSb);
    return () => window.removeEventListener('agentprivacy:spellbook-changed', onSb);
  }, []);

  const filledCount = useMemo(() => mage.filter((s) => Boolean(s.spellId)).length, [mage]);

  const setSlot = useCallback((index: number, slot: OrbLoadoutSlot) => {
    setMage((prev) => {
      const next = [...prev];
      next[index] = slot;
      return next;
    });
  }, []);

  const apply = useCallback(() => {
    const lo = getOrbLoadout();
    saveOrbLoadout({
      ...lo,
      mage: mage.slice(0, ORB_LOADOUT_SLOT_COUNT),
    });
    onClose();
  }, [mage, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10020] bg-black/55 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mage-ceremony-title"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-[10021] flex items-center justify-center p-3 sm:p-5 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-5xl max-h-[min(92vh,880px)] flex flex-col rounded-2xl border border-violet-500/35 bg-background/95 shadow-2xl shadow-violet-950/40 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 px-4 pt-3 pb-2 border-b border-surface/40 shrink-0">
                <div>
                  <h2 id="mage-ceremony-title" className="text-lg font-semibold text-text tracking-tight">
                    Soulbae · Mage ceremony
                  </h2>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Yin ring editor — same loadout as{' '}
                    <Link href="/orbs#orb-loadout" className="text-primary hover:underline" onClick={onClose}>
                      /orbs
                    </Link>
                    . Press <kbd className="px-1 rounded bg-surface/50 font-mono">M</kbd> to toggle.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface/50 text-xl leading-none"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="flex flex-col lg:flex-row flex-1 min-h-0">
                <div className="w-full lg:w-[min(100%,320px)] lg:shrink-0 border-b lg:border-b-0 lg:border-r border-surface/40 p-4 flex flex-col gap-4 overflow-y-auto min-h-0 max-h-[min(52vh,420px)] lg:max-h-none">
                  <div>
                    <p className="text-[10px] font-medium text-violet-300/90 uppercase tracking-wider mb-2">
                      Mage spells ({filledCount}/{ORB_LOADOUT_SLOT_COUNT})
                    </p>
                    <MageSpellStrip slots={mage} />
                  </div>
                  <OrbMageSlots key={spellbookKey} slots={mage} onChangeSlot={setSlot} variant="sheet" />
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 min-w-[6rem] py-2.5 rounded-xl border border-surface/50 text-sm text-text-muted hover:bg-surface/50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={apply}
                      className="flex-1 min-w-[8rem] py-2.5 rounded-xl text-sm font-medium bg-violet-600/90 text-white hover:bg-violet-600 shadow-lg shadow-violet-900/25"
                    >
                      Apply mage ring
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 min-h-[220px] bg-gradient-to-b from-transparent to-violet-950/20">
                  <div className="rounded-2xl border border-violet-500/25 bg-violet-500/[0.07] px-6 py-8 sm:py-10 text-center space-y-4 max-w-md w-full">
                    <p className="text-sm font-medium text-violet-200/95">Weave the ring</p>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Choose spells from your{' '}
                      <Link href="/spells#spellbook" className="text-primary hover:underline" onClick={onClose}>
                        persona graph
                      </Link>{' '}
                      first, then set each orbit emoji. The sixfold wheel syncs to the Soulbae orb and training casts.
                    </p>
                    <div className="flex items-center justify-center gap-5 pt-2">
                      <span className="text-4xl drop-shadow-[0_0_12px_rgba(139,92,246,0.45)]" aria-hidden>
                        🧙
                      </span>
                      <div
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500/50 via-purple-900/40 to-violet-950/60 border border-violet-400/35 shadow-[0_0_24px_rgba(139,92,246,0.25)]"
                        aria-hidden
                      />
                    </div>
                    <p className="text-[10px] text-text-muted/80 pt-1">agentprivacy — Soulbae layer</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
