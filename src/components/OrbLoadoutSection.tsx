'use client';

import { useCallback, useEffect, useState } from 'react';
import OrbMageSlots from '@/components/OrbMageSlots';
import BladeInventory from '@/components/BladeInventory';
import { hasCompletedCeremony } from '@/lib/ceremony/storage';
import {
  ORB_LOADOUT_SLOT_COUNT,
  getOrbLoadout,
  getDefaultOrbLoadout,
  saveOrbLoadout,
  applyCeremonyEmojisToSwordsmanSlots,
  getCeremonyConstellationEmojis,
  type OrbLoadout,
  type OrbLoadoutSlot,
} from '@/lib/orb-loadout';
import {
  getBladeInventory,
  getStanceBladeLoadout,
  assignBladeToLine,
  unassignBlade,
  getBladeForLine,
  syncStanceLoadoutToOrbit,
  type InventoryBlade,
  type StanceBladeLoadout,
} from '@/lib/spellweb-blade-bridge';

/** I Ching six lines mapped to privacy dimensions */
const STANCE_DIMENSIONS = [
  { line: 'L1', name: 'Protection', yinDesc: 'open', yangDesc: 'guarded', hex: '🛡️' },
  { line: 'L2', name: 'Delegation', yinDesc: 'direct', yangDesc: 'delegated', hex: '🤝' },
  { line: 'L3', name: 'Memory', yinDesc: 'ephemeral', yangDesc: 'persistent', hex: '📜' },
  { line: 'L4', name: 'Connection', yinDesc: 'isolated', yangDesc: 'networked', hex: '🔗' },
  { line: 'L5', name: 'Computation', yinDesc: 'local', yangDesc: 'distributed', hex: '⚡' },
  { line: 'L6', name: 'Value', yinDesc: 'free', yangDesc: 'economic', hex: '💎' },
];

const LINE_KEYS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'] as const;

export default function OrbLoadoutSection() {
  // Initialize with defaults to avoid hydration mismatch
  const [loadout, setLoadout] = useState<OrbLoadout>(() => getDefaultOrbLoadout());
  const [inventory, setInventory] = useState<InventoryBlade[]>([]);
  const [stanceLoadout, setStanceLoadout] = useState<StanceBladeLoadout>({
    L1: null, L2: null, L3: null, L4: null, L5: null, L6: null, swap: null,
  });
  const [showCeremonyApply, setShowCeremonyApply] = useState(false);

  const syncFromStorage = useCallback(() => {
    setLoadout(getOrbLoadout());
    setInventory(getBladeInventory());
    setStanceLoadout(getStanceBladeLoadout());
  }, []);

  useEffect(() => {
    // Force resync blade emojis to orbit on mount (picks up latest emoji logic)
    syncStanceLoadoutToOrbit();
    syncFromStorage();
    // Check ceremony state client-side only to avoid hydration mismatch
    const emojis = getCeremonyConstellationEmojis();
    setShowCeremonyApply(hasCompletedCeremony() && emojis.length > 0);
  }, [syncFromStorage]);

  useEffect(() => {
    const onStorage = () => syncFromStorage();
    window.addEventListener('agentprivacy:orb-loadout-changed', onStorage);
    window.addEventListener('agentprivacy:spellbook-changed', onStorage);
    window.addEventListener('agentprivacy:blade-inventory-changed', onStorage);
    window.addEventListener('agentprivacy:stance-loadout-changed', onStorage);
    return () => {
      window.removeEventListener('agentprivacy:orb-loadout-changed', onStorage);
      window.removeEventListener('agentprivacy:spellbook-changed', onStorage);
      window.removeEventListener('agentprivacy:blade-inventory-changed', onStorage);
      window.removeEventListener('agentprivacy:stance-loadout-changed', onStorage);
    };
  }, [syncFromStorage]);

  const setMageSlot = useCallback(
    (index: number, slot: OrbLoadoutSlot) => {
      const mage = [...loadout.mage];
      mage[index] = slot;
      const updated = {
        ...loadout,
        version: 2 as const,
        mage: mage.slice(0, ORB_LOADOUT_SLOT_COUNT),
      };
      setLoadout(updated);
      saveOrbLoadout(updated);
    },
    [loadout]
  );

  const resetDefaults = useCallback(() => {
    const fresh = getDefaultOrbLoadout();
    saveOrbLoadout(fresh);
    setLoadout(fresh);
  }, []);

  const applyCeremonyEmojis = useCallback(() => {
    applyCeremonyEmojisToSwordsmanSlots();
    syncFromStorage();
  }, [syncFromStorage]);

  // Toggle yin/yang for a stance line
  const toggleStanceLine = useCallback((lineIndex: number) => {
    const newLines = [...loadout.stanceHexLines] as [0|1, 0|1, 0|1, 0|1, 0|1, 0|1];
    newLines[lineIndex] = newLines[lineIndex] === 0 ? 1 : 0;
    const updated = { ...loadout, stanceHexLines: newLines };
    saveOrbLoadout(updated);
    setLoadout(updated);
  }, [loadout]);

  // Assign blade to line
  const handleBladeAssign = useCallback((lineKey: typeof LINE_KEYS[number] | 'swap', bladeId: string) => {
    if (bladeId === '') {
      const currentBlade = getBladeForLine(lineKey);
      if (currentBlade) {
        unassignBlade(currentBlade.id);
      }
    } else {
      assignBladeToLine(bladeId, lineKey);
    }
    syncFromStorage();
  }, [syncFromStorage]);

  // Get blades assigned to each line
  const lineBlades = LINE_KEYS.map(k => getBladeForLine(k));
  const swapBlade = getBladeForLine('swap');
  const equippedCount = [...lineBlades, swapBlade].filter(Boolean).length;

  // Get current orbit emojis (from loadout.swordsman)
  const orbitEmojis = loadout.swordsman.map(s => s.emoji || '·');

  return (
    <section id="orb-loadout" className="mb-10 space-y-6 scroll-mt-24">
      {showCeremonyApply && (
        <button
          type="button"
          onClick={applyCeremonyEmojis}
          className="float-right px-3 py-1.5 rounded-lg border border-surface/50 bg-surface/20 text-xs text-text/70 hover:bg-surface/35"
          title="Apply ceremony emojis"
        >
          Apply ceremony
        </button>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MAGE ORB */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="p-5 rounded-xl border border-violet-500/30 bg-violet-500/5">
        <h3 className="text-sm font-semibold text-violet-300 mb-4 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          Mage Orb
          <span className="text-[10px] text-text-muted font-normal ml-auto">
            left-click to cast spell
          </span>
        </h3>
        <OrbMageSlots slots={loadout.mage} onChangeSlot={setMageSlot} variant="page" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SWORD ORB */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5">
        <h3 className="text-sm font-semibold text-amber-300 mb-4 flex items-center gap-2">
          <span className="text-lg">⚔️</span>
          Sword Orb
          <span className="text-[10px] text-text-muted font-normal ml-auto">
            right-click to cut sticker
          </span>
        </h3>

        {/* Blade Equip Slots (7 = 6 lines + 1 reserve) */}
        <div className="mb-5">
          <p className="text-[10px] text-text-muted mb-2">
            Equip blades — first blade covers all 6 positions, others override specific lines
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {LINE_KEYS.map((lineKey, i) => {
              const blade = lineBlades[i];
              return (
                <div key={lineKey} className="space-y-1">
                  <label className="text-[9px] text-text-muted font-mono block text-center">
                    {lineKey}
                  </label>
                  <select
                    value={blade?.id || ''}
                    onChange={(e) => handleBladeAssign(lineKey, e.target.value)}
                    className={`w-full rounded-lg border px-1.5 py-2 text-center text-lg ${
                      blade
                        ? 'border-amber-500/50 bg-amber-500/10'
                        : 'border-surface/50 bg-background'
                    }`}
                    title={blade ? blade.name : 'Empty'}
                  >
                    <option value="">·</option>
                    {inventory.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.primaryEmoji}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
            {/* Reserve/Swap slot */}
            <div className="space-y-1">
              <label className="text-[9px] text-cyan-400/70 font-mono block text-center">
                ⇄
              </label>
              <select
                value={swapBlade?.id || ''}
                onChange={(e) => handleBladeAssign('swap', e.target.value)}
                className={`w-full rounded-lg border px-1.5 py-2 text-center text-lg ${
                  swapBlade
                    ? 'border-cyan-500/50 bg-cyan-500/10'
                    : 'border-surface/50 bg-background'
                }`}
                title={swapBlade ? `Reserve: ${swapBlade.name}` : 'Reserve slot'}
              >
                <option value="">·</option>
                {inventory.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.primaryEmoji}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[9px] text-text-muted/60 mt-1 text-center">
            {equippedCount}/7 blades equipped
          </p>
        </div>

        {/* Visual Hexagram + Orbit Emoji Assignment */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Hexagram Visualization (clickable sectors to toggle yin/yang) */}
          <div className="flex-shrink-0">
            <p className="text-[10px] text-text-muted mb-2 text-center">
              Click sector to toggle stance
            </p>
            <div className="relative w-48 h-48 mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Hexagon sectors */}
                {[0, 1, 2, 3, 4, 5].map(i => {
                  const angle = (i * 60 - 90) * (Math.PI / 180);
                  const nextAngle = ((i + 1) * 60 - 90) * (Math.PI / 180);
                  const cx = 100, cy = 100, r = 85;
                  const x1 = cx + Math.cos(angle) * r;
                  const y1 = cy + Math.sin(angle) * r;
                  const x2 = cx + Math.cos(nextAngle) * r;
                  const y2 = cy + Math.sin(nextAngle) * r;
                  const isYang = loadout.stanceHexLines[i] === 1;
                  const midAngle = ((i * 60 + 30) - 90) * (Math.PI / 180);
                  const labelR = 60;
                  const lx = cx + Math.cos(midAngle) * labelR;
                  const ly = cy + Math.sin(midAngle) * labelR;
                  const emoji = orbitEmojis[i] || '·';

                  return (
                    <g key={i}>
                      {/* Sector - click to toggle stance */}
                      <path
                        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                        fill={isYang ? 'rgba(245, 158, 11, 0.25)' : 'rgba(139, 92, 246, 0.2)'}
                        stroke={isYang ? 'rgba(245, 158, 11, 0.6)' : 'rgba(139, 92, 246, 0.5)'}
                        strokeWidth="2"
                        className="cursor-pointer hover:brightness-125 transition-all"
                        onClick={() => toggleStanceLine(i)}
                      />
                      {/* Emoji in sector - displays from blade slots */}
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xl select-none pointer-events-none"
                      >
                        {emoji}
                      </text>
                      {/* Line label */}
                      <text
                        x={cx + Math.cos(midAngle) * 42}
                        y={cy + Math.sin(midAngle) * 42}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-[8px] fill-text-muted/50 font-mono pointer-events-none"
                      >
                        {LINE_KEYS[i]}
                      </text>
                    </g>
                  );
                })}
                {/* Center */}
                <circle cx="100" cy="100" r="25" fill="rgba(30, 30, 40, 0.9)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="text-2xl">
                  ⚔️
                </text>
              </svg>
            </div>
          </div>

          {/* Stance Descriptions */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-text-muted mb-2">
              Stance Hexagram — click to toggle open/closed
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {STANCE_DIMENSIONS.map((dim, i) => {
                const isYang = loadout.stanceHexLines[i] === 1;
                const blade = lineBlades[i];
                const emoji = orbitEmojis[i] || dim.hex;

                return (
                  <button
                    key={dim.line}
                    onClick={() => toggleStanceLine(i)}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 text-left transition-all ${
                      isYang
                        ? 'bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25'
                        : 'bg-violet-500/15 border border-violet-500/30 hover:bg-violet-500/25'
                    }`}
                  >
                    <span className="text-lg">{emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-text-muted">{dim.line}</span>
                        <span className={`text-xs font-medium ${isYang ? 'text-amber-300' : 'text-violet-300'}`}>
                          {dim.name}
                        </span>
                      </div>
                      <div className="text-[9px] text-text-muted/70">
                        {isYang ? `☰ ${dim.yangDesc}` : `☷ ${dim.yinDesc}`}
                        {blade && <span className="ml-1 text-amber-400/60">← {blade.name}</span>}
                      </div>
                    </div>
                    <span className={`text-lg ${isYang ? 'text-amber-400' : 'text-violet-400'}`}>
                      {isYang ? '━━' : '━ ━'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reset button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={resetDefaults}
          className="px-3 py-1.5 rounded-lg border border-surface/40 text-xs text-text-muted/70 hover:bg-surface/30"
        >
          Reset defaults
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BLADE INVENTORY */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="p-5 rounded-xl border border-surface/50 bg-surface/5">
        <BladeInventory onBladeChange={syncFromStorage} />
      </div>
    </section>
  );
}
