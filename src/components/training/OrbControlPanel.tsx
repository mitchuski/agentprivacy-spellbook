'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  getOrbLoadout,
  saveOrbLoadout,
  getMageOrbSpellOptions,
  getEmojiOptionsForSpellId,
  type OrbLoadout,
} from '@/lib/orb-loadout';
import { getBladeForLine, type InventoryBlade } from '@/lib/spellweb-blade-bridge';

// Static empty loadout for SSR hydration - no localStorage/dynamic values
const EMPTY_LOADOUT: OrbLoadout = {
  version: 2,
  stanceHexLines: [0, 0, 0, 0, 0, 0],
  swordsman: Array.from({ length: 6 }, () => ({ spellId: '', emoji: '' })),
  mage: Array.from({ length: 6 }, () => ({ spellId: '', emoji: '' })),
};

interface OrbControlPanelProps {
  onModeChange?: (mode: 'cursor' | 'hidden' | 'wander') => void;
  onSelectionChange?: (swordsmanIdx: number, mageIdx: number) => void;
  currentMode?: 'cursor' | 'hidden' | 'wander';
  selectedSwordIdx?: number;
  selectedMageIdx?: number;
}

/**
 * Orb Control Panel - bottom inventory and mode controls
 * Click slot to SELECT it - selected slot fires on orb click
 */
export default function OrbControlPanel({
  onModeChange,
  onSelectionChange,
  currentMode = 'cursor',
  selectedSwordIdx: propSwordIdx = 0,
  selectedMageIdx: propMageIdx = 0,
}: OrbControlPanelProps) {
  // Initialize with static empty values to avoid hydration mismatch (localStorage not available on server)
  const [loadout, setLoadout] = useState<OrbLoadout>(EMPTY_LOADOUT);
  const [blades, setBlades] = useState<(InventoryBlade | null)[]>([null, null, null, null, null, null]);
  // Use props as source of truth
  const selectedSwordIdx = propSwordIdx;
  const selectedMageIdx = propMageIdx;

  // Load from localStorage after mount, sync on changes
  useEffect(() => {
    const sync = () => {
      setLoadout(getOrbLoadout());
      setBlades((['L1', 'L2', 'L3', 'L4', 'L5', 'L6'] as const).map(line => getBladeForLine(line)));
    };
    sync();
    window.addEventListener('agentprivacy:orb-loadout-changed', sync);
    window.addEventListener('agentprivacy:stance-loadout-changed', sync);
    window.addEventListener('agentprivacy:blade-inventory-changed', sync);
    return () => {
      window.removeEventListener('agentprivacy:orb-loadout-changed', sync);
      window.removeEventListener('agentprivacy:stance-loadout-changed', sync);
      window.removeEventListener('agentprivacy:blade-inventory-changed', sync);
    };
  }, []);

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionChange?.(selectedSwordIdx, selectedMageIdx);
  }, [selectedSwordIdx, selectedMageIdx, onSelectionChange]);

  // Select swordsman slot - notify parent
  const selectSwordsmanSlot = useCallback((index: number) => {
    onSelectionChange?.(index, selectedMageIdx);
  }, [onSelectionChange, selectedMageIdx]);

  // Select mage slot - notify parent
  const selectMageSlot = useCallback((index: number) => {
    onSelectionChange?.(selectedSwordIdx, index);
  }, [onSelectionChange, selectedSwordIdx]);

  // Cycle mage spell at selected index (shift+click)
  const cycleMageSpell = useCallback(() => {
    const spells = getMageOrbSpellOptions();
    if (spells.length === 0) return;

    const current = loadout.mage[selectedMageIdx];
    const currentIdx = spells.findIndex(s => s.id === current?.spellId);
    const nextIdx = (currentIdx + 1) % spells.length;
    const nextSpell = spells[nextIdx];
    const emojis = getEmojiOptionsForSpellId(nextSpell.id);

    const newMage = [...loadout.mage];
    newMage[selectedMageIdx] = { spellId: nextSpell.id, emoji: emojis[0] || '✨' };

    const updated = { ...loadout, mage: newMage };
    saveOrbLoadout(updated);
    setLoadout(updated);
  }, [loadout, selectedMageIdx]);

  const swordsmanSlots = loadout.swordsman;
  const mageSlots = loadout.mage;

  return (
    <div className="hidden sm:block fixed bottom-4 left-1/2 -translate-x-1/2 z-[9990] pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 bg-surface/90 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-lg"
      >
        {/* Swordsman Blades - click to select */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-amber-400/60 font-mono mr-0.5" title="Press S to cycle">[s]</span>
          <span className="text-lg mr-1" title="Right-click orb to cast selected">⚔️</span>
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4, 5].map(i => {
              const blade = blades[i];
              const isSelected = selectedSwordIdx === i;
              return (
                <button
                  key={`s-${i}`}
                  onClick={() => selectSwordsmanSlot(i)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${
                    isSelected
                      ? 'bg-amber-500/40 border-2 border-amber-400 scale-110 shadow-lg shadow-amber-500/30'
                      : blade
                        ? 'bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25'
                        : 'bg-surface/30 border border-surface/50 hover:bg-surface/50'
                  }`}
                  title={`L${i + 1}${blade ? `: ${blade.name}` : ''} ${isSelected ? '(selected - right-click to cast)' : '(click to select)'}`}
                >
                  {swordsmanSlots[i]?.emoji || '·'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Controls - separate section */}
        <div className="flex items-center gap-1 px-2 border-l border-r border-white/10">
          <button
            onClick={() => onModeChange?.('cursor')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentMode === 'cursor'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
            }`}
            title="Follow cursor (home)"
          >
            🏠
          </button>
          <button
            onClick={() => onModeChange?.('hidden')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentMode === 'hidden'
                ? 'bg-slate-500/25 text-slate-300 border border-slate-500/40'
                : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
            }`}
            title="Hide orbs"
          >
            👁️‍🗨️
          </button>
          <button
            onClick={() => onModeChange?.('wander')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentMode === 'wander'
                ? 'bg-violet-500/25 text-violet-300 border border-violet-500/40'
                : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
            }`}
            title="Wander freely"
          >
            🌀
          </button>
        </div>

        {/* Mage Spells - click to select */}
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4, 5].map(i => {
              const isSelected = selectedMageIdx === i;
              return (
                <button
                  key={`m-${i}`}
                  onClick={() => selectMageSlot(i)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${
                    isSelected
                      ? 'bg-violet-500/40 border-2 border-violet-400 scale-110 shadow-lg shadow-violet-500/30'
                      : mageSlots[i]?.emoji
                        ? 'bg-violet-500/15 border border-violet-500/30 hover:bg-violet-500/25'
                        : 'bg-surface/30 border border-surface/50 hover:bg-surface/50'
                  }`}
                  title={`M${i + 1}: ${mageSlots[i]?.emoji || 'empty'} ${isSelected ? '(selected - left-click to cast)' : '(click to select)'}`}
                >
                  {mageSlots[i]?.emoji || '·'}
                </button>
              );
            })}
          </div>
          <span className="text-lg ml-1" title="Left-click orb to cast selected">🧙</span>
          <span className="text-[9px] text-violet-400/60 font-mono ml-0.5" title="Press M to cycle">[m]</span>
          <button
            onClick={cycleMageSpell}
            className="px-1.5 py-1 rounded text-xs font-medium bg-white/5 text-white/50 border border-transparent hover:bg-violet-500/15 hover:text-violet-400 transition-all ml-1"
            title="Rotate selected spell emoji [r]"
          >
            ↻
          </button>
          <span className="text-[9px] text-violet-400/60 font-mono ml-0.5" title="Press R to rotate spell">[r]</span>
        </div>
      </motion.div>
    </div>
  );
}
