'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import StanceLoadoutEditor from '@/components/StanceLoadoutEditor';
import { hasCompletedCeremony } from '@/lib/ceremony/storage';
import {
  getOrbLoadout,
  applyOrbStanceLoadout,
  applyCeremonyEmojisToSwordsmanSlots,
  getCeremonyConstellationEmojis,
  canAccessFullStanceSpellPool,
  ORB_LOADOUT_SLOT_COUNT,
  type OrbLoadoutSlot,
} from '@/lib/orb-loadout';
import type { HexagramSnapshot } from '@/lib/training-progress';

type HexagramFlowProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HexagramFlow({ isOpen, onClose }: HexagramFlowProps) {
  const [lines, setLines] = useState<HexagramSnapshot['lines']>(() => [...getOrbLoadout().stanceHexLines]);
  const [swordsman, setSwordsman] = useState<OrbLoadoutSlot[]>(() => [...getOrbLoadout().swordsman]);
  const [showCeremonyBtn, setShowCeremonyBtn] = useState(false);

  const fullPool = canAccessFullStanceSpellPool();

  useEffect(() => {
    if (!isOpen) return;
    const lo = getOrbLoadout();
    setLines([...lo.stanceHexLines]);
    setSwordsman(lo.swordsman.map((s) => ({ ...s })));
    setShowCeremonyBtn(hasCompletedCeremony() && getCeremonyConstellationEmojis().length > 0);
  }, [isOpen]);

  const toggleLine = useCallback((index: number) => {
    setLines((prev) => {
      const next = [...prev] as HexagramSnapshot['lines'];
      next[index] = prev[index] === 0 ? 1 : 0;
      return next;
    });
  }, []);

  const setSwordSlot = useCallback((index: number, slot: OrbLoadoutSlot) => {
    setSwordsman((prev) => {
      const next = [...prev];
      next[index] = slot;
      return next;
    });
  }, []);

  const handleApply = useCallback(() => {
    applyOrbStanceLoadout(lines, swordsman.slice(0, ORB_LOADOUT_SLOT_COUNT));
    onClose();
  }, [lines, swordsman, onClose]);

  const handleCeremonyEmojis = useCallback(() => {
    applyCeremonyEmojisToSwordsmanSlots();
    const lo = getOrbLoadout();
    setSwordsman(lo.swordsman.map((s) => ({ ...s })));
  }, []);

  const refreshStanceFromStorage = useCallback(() => {
    const lo = getOrbLoadout();
    setLines([...lo.stanceHexLines]);
    setSwordsman(lo.swordsman.map((s) => ({ ...s })));
  }, []);

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
            className="fixed inset-0 z-[10020] bg-black/50"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hex-stance-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed bottom-0 left-0 right-0 z-[10021] max-h-[min(92vh,820px)] flex flex-col rounded-t-2xl border border-surface/50 border-b-0 bg-background shadow-2xl"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-surface/60" />
            <div className="flex items-start justify-between gap-3 px-4 pt-3 pb-2 border-b border-surface/40 shrink-0">
              <div>
                <h2 id="hex-stance-title" className="text-lg font-semibold text-text">
                  Swordsman — MyTerms stance & blades
                </h2>
                <p className="text-xs text-text-muted mt-0.5 max-w-xl">
                  <strong className="text-amber-400/90">Soulbis</strong>: hex posture + repertoire per line; ring shows{' '}
                  <strong className="text-amber-300/80">zk blade facets</strong> (spellweb forged path / witness flow). Grimoire picks from{' '}
                  <Link href="/spells#spellbook" className="text-primary hover:underline" onClick={onClose}>
                    your spell graph
                  </Link>{' '}
                  fill the menus; spellweb sets facet emojis. Press <kbd className="px-1 rounded bg-surface/50 font-mono">M</kbd> for the mage’s six ring spells.
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

            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
              <StanceLoadoutEditor
                lines={lines}
                swordsman={swordsman}
                fullPool={fullPool}
                onToggleLine={toggleLine}
                onSwordSlotChange={setSwordSlot}
                onBladeImportApplied={refreshStanceFromStorage}
              />
            </div>

            <div className="shrink-0 flex flex-wrap gap-2 px-4 pt-2 pb-3 border-t border-surface/40">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-w-[6rem] py-3 rounded-xl border border-surface/50 text-text-muted hover:bg-surface/50"
              >
                Cancel
              </button>
              {showCeremonyBtn && (
                <button
                  type="button"
                  onClick={handleCeremonyEmojis}
                  className="flex-1 min-w-[8rem] py-3 rounded-xl border border-surface/50 text-xs text-text/90 hover:bg-surface/40"
                >
                  Ceremony emojis → Soulbis
                </button>
              )}
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 min-w-[8rem] py-3 rounded-xl font-medium bg-amber-600/90 text-white hover:bg-amber-600 shadow-lg shadow-amber-900/20"
              >
                Apply stance to orbit
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
