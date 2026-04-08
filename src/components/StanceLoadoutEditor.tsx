'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StanceHexRingPreview from '@/components/StanceHexRingPreview';
import SpellwebBladeImport from '@/components/SpellwebBladeImport';
import { resolveHexagram } from '@/lib/hexagram';
import {
  getEmojiOptionsForSpellId,
  getSwordsmanOrbSpellOptions,
  type OrbLoadoutSlot,
} from '@/lib/orb-loadout';
import {
  getBladeInventory,
  getStanceBladeLoadout,
  assignBladeToLine,
  unassignBlade,
  swapBladeWithLine,
  getBladeForLine,
  getBladeAssignment,
  isStanceLoadoutComplete,
  type InventoryBlade,
  type StanceBladeLoadout,
} from '@/lib/spellweb-blade-bridge';
import type { HexagramSnapshot } from '@/lib/training-progress';

export type StanceLoadoutEditorProps = {
  lines: HexagramSnapshot['lines'];
  swordsman: OrbLoadoutSlot[];
  fullPool: boolean;
  onToggleLine: (index: number) => void;
  onSwordSlotChange: (index: number, slot: OrbLoadoutSlot) => void;
  /** After spellweb blade import updates localStorage */
  onBladeImportApplied?: () => void;
  /** Where the unlock banner should link for “training gate” */
  orbsHref?: string;
  className?: string;
};

export default function StanceLoadoutEditor({
  lines,
  swordsman,
  fullPool,
  onToggleLine,
  onSwordSlotChange,
  onBladeImportApplied,
  orbsHref = '/orbs',
  className = '',
}: StanceLoadoutEditorProps) {
  const { kingWenNumber, glyph, name } = resolveHexagram(lines);
  const stanceSpells = getSwordsmanOrbSpellOptions();
  const [bladeInventory, setBladeInventory] = useState<InventoryBlade[]>([]);
  const [stanceLoadout, setStanceLoadout] = useState<StanceBladeLoadout>({ L1: null, L2: null, L3: null, L4: null, L5: null, L6: null, swap: null });
  const [dragBlade, setDragBlade] = useState<string | null>(null);

  // Listen for blade and loadout changes
  useEffect(() => {
    const refresh = () => {
      setBladeInventory(getBladeInventory());
      setStanceLoadout(getStanceBladeLoadout());
    };
    refresh();
    window.addEventListener('agentprivacy:blade-inventory-changed', refresh);
    window.addEventListener('agentprivacy:stance-loadout-changed', refresh);
    return () => {
      window.removeEventListener('agentprivacy:blade-inventory-changed', refresh);
      window.removeEventListener('agentprivacy:stance-loadout-changed', refresh);
    };
  }, []);

  const handleAssignBlade = (bladeId: string, line: keyof StanceBladeLoadout) => {
    assignBladeToLine(bladeId, line);
    onBladeImportApplied?.();
  };

  const handleUnassign = (bladeId: string) => {
    unassignBlade(bladeId);
    onBladeImportApplied?.();
  };

  const handleSwap = (line: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6') => {
    swapBladeWithLine(line);
    onBladeImportApplied?.();
  };

  const tierColors = {
    dragon: { border: 'border-amber-500/60', bg: 'bg-amber-500/10', text: 'text-amber-300', ring: 'ring-amber-500/30' },
    heavy: { border: 'border-slate-400/60', bg: 'bg-slate-400/10', text: 'text-slate-300', ring: 'ring-slate-400/30' },
    light: { border: 'border-sky-400/60', bg: 'bg-sky-400/10', text: 'text-sky-300', ring: 'ring-sky-400/30' },
  };

  // Get unassigned blades (not in any slot)
  const unassignedBlades = bladeInventory.filter(b => !getBladeAssignment(b.id));
  const loadoutComplete = isStanceLoadoutComplete();

  return (
    <div className={`space-y-5 ${className}`}>
      {!fullPool && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[11px] text-text/80">
          Full stance pool unlocks with a <strong>persona</strong> (ceremony),{' '}
          <Link href={orbsHref} className="text-primary hover:underline">
            orbs
          </Link>{' '}
          (training gate), or any <strong>story inscription</strong> with a marker — proverb work unlocks picks you <em>feel</em> here.
        </div>
      )}

      <SpellwebBladeImport onApplied={onBladeImportApplied} />

      {/* Posture + blade ring map side by side (S hotkey sheet) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="space-y-3 min-w-0">
          <div className="flex flex-row items-center gap-4">
            <div
              className="flex items-center justify-center rounded-2xl border border-amber-500/35 bg-amber-500/5 px-6 py-5 shrink-0"
              aria-live="polite"
            >
              <span className="text-6xl sm:text-7xl leading-none select-none" title={name}>
                {glyph}
              </span>
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-medium text-text">{name}</p>
              <p className="text-xs text-text-muted font-mono">
                King Wen {kingWenNumber} · bottom line first · syncs to training
              </p>
            </div>
          </div>
          <p className="text-[11px] text-text/80 leading-relaxed">
            Posture sets <strong className="text-amber-200/90">which of 64 figures</strong> you hold. The ring around Soulbis carries{' '}
            <strong className="text-amber-200/90">zk blade facets</strong> (forged on spellweb.ai)—not “spells orbiting.” Yin lines bias facets{' '}
            <em>inward</em>, yang <em>outward</em> in live training.
          </p>
        </div>
        <StanceHexRingPreview lines={lines} swordsman={swordsman} className="lg:sticky lg:top-4" />
      </div>

      {/* Stance Blade Loadout - 6 Lines + Swap */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-text-muted">
            Blade Ring — {loadoutComplete ? (
              <span className="text-emerald-400">complete (6/6)</span>
            ) : (
              <span className="text-amber-400">assign blades to each line</span>
            )}
          </p>
          {stanceLoadout.swap && (
            <span className="text-[10px] text-cyan-400">+ 1 swap ready</span>
          )}
        </div>

        {/* 6 Stance Lines + Swap Slot */}
        <div className="grid grid-cols-1 gap-2 max-w-2xl">
          {(['L1', 'L2', 'L3', 'L4', 'L5', 'L6'] as const).map((lineKey, index) => {
            const blade = getBladeForLine(lineKey);
            const colors = blade ? tierColors[blade.tier] : null;
            const hasSwap = !!stanceLoadout.swap;

            return (
              <div key={lineKey} className="flex items-center gap-2">
                {/* Line label */}
                <span className={`text-xs font-mono w-8 shrink-0 ${blade ? 'text-emerald-400' : 'text-text-muted'}`}>
                  {lineKey}
                </span>

                {/* Blade slot */}
                {blade ? (
                  <div className={`flex-1 flex items-center gap-2 p-2 rounded-lg border ${colors?.border} ${colors?.bg}`}>
                    <span className="text-xl">{blade.primaryEmoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-medium truncate ${colors?.text}`}>{blade.name}</p>
                      <p className="text-[9px] text-text-muted">
                        facet: {blade.facets[index]?.emoji} {blade.facets[index]?.label}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {hasSwap && (
                        <button
                          type="button"
                          onClick={() => handleSwap(lineKey)}
                          className="px-2 py-1 rounded text-[10px] bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                          title="Swap with bench blade"
                        >
                          ⇄
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleUnassign(blade.id)}
                        className="px-2 py-1 rounded text-[10px] text-text-muted hover:text-red-400 hover:bg-red-500/10"
                        title="Remove from slot"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border-2 border-dashed border-surface/50 bg-surface/10">
                    <span className="text-xl opacity-30">⚔️</span>
                    <span className="text-xs text-text-muted">empty — assign blade below</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Swap Slot (7th blade) */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-surface/30">
            <span className="text-xs font-mono w-8 shrink-0 text-cyan-400">⇄</span>
            {(() => {
              const swapBlade = getBladeForLine('swap');
              if (swapBlade) {
                const colors = tierColors[swapBlade.tier];
                return (
                  <div className={`flex-1 flex items-center gap-2 p-2 rounded-lg border ${colors.border} ${colors.bg}`}>
                    <span className="text-xl">{swapBlade.primaryEmoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-medium truncate ${colors.text}`}>{swapBlade.name}</p>
                      <p className="text-[9px] text-cyan-400/80">swap slot — ready to rotate in</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUnassign(swapBlade.id)}
                      className="px-2 py-1 rounded text-[10px] text-text-muted hover:text-red-400 hover:bg-red-500/10"
                      title="Remove from swap"
                    >
                      ✕
                    </button>
                  </div>
                );
              }
              return (
                <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border-2 border-dashed border-cyan-500/30 bg-cyan-500/5">
                  <span className="text-xl opacity-30">🔄</span>
                  <span className="text-xs text-cyan-400/60">swap slot — 7th blade for rotation</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Unassigned Blades */}
      {unassignedBlades.length > 0 && (
        <div>
          <p className="text-xs font-medium text-text-muted mb-2">
            Unassigned Blades ({unassignedBlades.length}) — tap to assign
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {unassignedBlades.map((blade) => {
              const colors = tierColors[blade.tier];
              return (
                <div
                  key={blade.id}
                  className={`p-2 rounded-lg border ${colors.border} ${colors.bg}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{blade.primaryEmoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-medium truncate ${colors.text}`}>{blade.name}</p>
                      <p className="text-[9px] text-text-muted">{blade.tier} · {blade.stratum}/6</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(['L1', 'L2', 'L3', 'L4', 'L5', 'L6'] as const).map((line) => {
                      const occupied = !!stanceLoadout[line];
                      return (
                        <button
                          key={line}
                          type="button"
                          onClick={() => handleAssignBlade(blade.id, line)}
                          disabled={occupied}
                          className={`px-2 py-1 rounded text-[10px] font-mono ${
                            occupied
                              ? 'bg-surface/30 text-text-muted/40 cursor-not-allowed'
                              : 'bg-surface/50 text-text-muted hover:bg-surface hover:text-text'
                          }`}
                          title={occupied ? `${line} occupied` : `Assign to ${line}`}
                        >
                          {line}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => handleAssignBlade(blade.id, 'swap')}
                      disabled={!!stanceLoadout.swap}
                      className={`px-2 py-1 rounded text-[10px] ${
                        stanceLoadout.swap
                          ? 'bg-surface/30 text-text-muted/40 cursor-not-allowed'
                          : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                      }`}
                      title={stanceLoadout.swap ? 'Swap slot occupied' : 'Assign to swap slot'}
                    >
                      ⇄
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {bladeInventory.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-surface/30 rounded-xl">
          <p className="text-2xl mb-2">⚔️</p>
          <p className="text-sm text-text-muted">No blades imported yet</p>
          <p className="text-xs text-text-muted/70 mt-1">Import forged blades from spellweb.ai to fill your stance ring</p>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-text-muted mb-2">Six lines — stance (tap to flip)</p>
        <div className="grid grid-cols-6 gap-2 max-w-xl">
          {lines.map((bit, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onToggleLine(i)}
              className={`rounded-xl border-2 py-2.5 text-xs font-mono transition-colors ${
                bit === 1
                  ? 'border-amber-400/80 bg-amber-500/10 text-amber-200'
                  : 'border-surface/60 bg-surface/20 text-text-muted'
              }`}
              title={bit === 1 ? 'Yang (unbroken)' : 'Yin (broken)'}
              aria-pressed={bit === 1}
            >
              <span className="block text-[10px] opacity-70 mb-1">L{i + 1}</span>
              <span className="block text-sm tracking-tight">{bit === 1 ? '━━━' : '━ ━'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Stance Preview - right-click reveals, left-click places */}
      <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-amber-300">
            ⚔️ Stance Ring (Right Click → Left Click)
          </p>
          <p className="text-[10px] text-text-muted">right-click = take stance · left-click = place mark · S = editor</p>
        </div>
        <div className="flex gap-1">
          {(['L1', 'L2', 'L3', 'L4', 'L5', 'L6'] as const).map((lineKey, i) => {
            const blade = getBladeForLine(lineKey);
            return (
              <div
                key={lineKey}
                className={`flex-1 text-center py-2 rounded-lg ${
                  blade
                    ? 'bg-amber-500/20 border border-amber-500/40'
                    : 'bg-surface/20 border border-surface/40'
                }`}
                title={blade ? `${lineKey}: ${blade.name}` : `${lineKey}: empty`}
              >
                <span className="text-lg">{blade?.facets[i]?.emoji || '·'}</span>
                <p className="text-[8px] text-text-muted mt-0.5">{lineKey}</p>
              </div>
            );
          })}
        </div>
        {!loadoutComplete && (
          <p className="text-[10px] text-amber-400/70 mt-2 text-center">
            Assign blades to all 6 lines to complete your stance ring
          </p>
        )}
      </div>
    </div>
  );
}
