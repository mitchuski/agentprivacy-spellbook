'use client';

import { useState, useEffect, useCallback } from 'react';
import SpellwebBladeImport from '@/components/SpellwebBladeImport';
import {
  getBladeInventory,
  getStanceBladeLoadout,
  assignBladeToLine,
  unassignBlade,
  getBladeForLine,
  getEquippedBladeId,
  equipBlade,
  unequipBlade,
  setLineEmoji,
  type InventoryBlade,
  type StanceBladeLoadout,
} from '@/lib/spellweb-blade-bridge';
import { getOrbLoadout } from '@/lib/orb-loadout';

type SwordsmanBladeSlotsProps = {
  onBladeChange?: () => void;
  /** Sheet mode: no outer card (parent provides chrome) */
  variant?: 'page' | 'sheet';
};

const SLOT_LABELS: Record<string, string> = {
  L1: 'Protection',
  L2: 'Delegation',
  L3: 'Memory',
  L4: 'Connection',
  L5: 'Computation',
  L6: 'Value',
};

const LINE_KEYS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'] as const;

export default function SwordsmanBladeSlots({ onBladeChange, variant = 'page' }: SwordsmanBladeSlotsProps) {
  const [inventory, setInventory] = useState<InventoryBlade[]>([]);
  const [loadout, setLoadout] = useState<StanceBladeLoadout>({
    L1: null, L2: null, L3: null, L4: null, L5: null, L6: null, swap: null,
  });
  const [equippedId, setEquippedId] = useState<string | null>(null);
  const [slotEmojis, setSlotEmojis] = useState<string[]>(['', '', '', '', '', '']);

  const refresh = useCallback(() => {
    setInventory(getBladeInventory());
    setLoadout(getStanceBladeLoadout());
    setEquippedId(getEquippedBladeId());
    const orbLoadout = getOrbLoadout();
    setSlotEmojis(orbLoadout.swordsman.map(s => s.emoji || ''));
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('agentprivacy:blade-inventory-changed', refresh);
    window.addEventListener('agentprivacy:stance-loadout-changed', refresh);
    window.addEventListener('agentprivacy:orb-loadout-changed', refresh);
    return () => {
      window.removeEventListener('agentprivacy:blade-inventory-changed', refresh);
      window.removeEventListener('agentprivacy:stance-loadout-changed', refresh);
      window.removeEventListener('agentprivacy:orb-loadout-changed', refresh);
    };
  }, [refresh]);

  const handleBladeChange = useCallback((lineKey: typeof LINE_KEYS[number], bladeId: string) => {
    if (bladeId === '') {
      // Unassign current blade
      const currentBlade = getBladeForLine(lineKey);
      if (currentBlade) {
        unassignBlade(currentBlade.id);
      }
    } else {
      assignBladeToLine(bladeId, lineKey);
    }
    onBladeChange?.();
  }, [onBladeChange]);

  const handleEmojiChange = useCallback((lineKey: typeof LINE_KEYS[number], emoji: string) => {
    setLineEmoji(lineKey, emoji);
    onBladeChange?.();
  }, [onBladeChange]);

  const handleEquip = useCallback((bladeId: string) => {
    if (equippedId === bladeId) {
      unequipBlade();
    } else {
      equipBlade(bladeId);
    }
    onBladeChange?.();
  }, [equippedId, onBladeChange]);

  // Get emoji options for a blade (its facets + primary emoji, deduplicated)
  const getEmojiOptionsForBlade = (blade: InventoryBlade | null): string[] => {
    if (!blade) return ['⚔️'];
    const emojis = blade.facets.map(f => f.emoji).filter(e => e && e !== '·');
    if (!emojis.includes(blade.primaryEmoji)) {
      emojis.unshift(blade.primaryEmoji);
    }
    // Deduplicate to avoid React key warnings
    const unique = [...new Set(emojis)];
    return unique.length > 0 ? unique : ['⚔️'];
  };

  const filledSlots = LINE_KEYS.filter(l => loadout[l]).length;

  const rows = (
    <div className="space-y-2">
      {LINE_KEYS.map((lineKey, index) => {
        const blade = getBladeForLine(lineKey);
        const emojiOptions = getEmojiOptionsForBlade(blade);
        const isEquipped = blade && equippedId === blade.id;

        return (
          <div
            key={lineKey}
            className={`flex flex-wrap items-center gap-2 sm:gap-3 text-sm ${
              isEquipped ? 'bg-emerald-500/10 rounded-lg px-2 py-1 -mx-2' : ''
            }`}
          >
            {/* Slot label */}
            <span className="text-[10px] text-text-muted font-mono w-16 shrink-0">
              {lineKey} <span className="text-text-muted/60">{SLOT_LABELS[lineKey]}</span>
            </span>

            {/* Blade selector dropdown */}
            <select
              value={blade?.id || ''}
              onChange={(e) => handleBladeChange(lineKey, e.target.value)}
              className="flex-1 min-w-[8rem] rounded-lg border border-surface/50 bg-background px-2 py-1.5 text-xs text-text"
              aria-label={`${lineKey} ${SLOT_LABELS[lineKey]} blade`}
            >
              <option value="">— empty —</option>
              {inventory.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.primaryEmoji} {b.name}
                </option>
              ))}
            </select>

            {/* Emoji dropdown (only if blade assigned) */}
            {blade ? (
              <select
                value={slotEmojis[index] || emojiOptions[0]}
                onChange={(e) => handleEmojiChange(lineKey, e.target.value)}
                className="w-[4.5rem] rounded-lg border border-surface/50 bg-background px-1 py-1.5 text-center text-lg leading-none"
                title="Emoji in orbit"
                aria-label={`${lineKey} orbit emoji`}
              >
                {emojiOptions.map((em) => (
                  <option key={em} value={em}>
                    {em}
                  </option>
                ))}
              </select>
            ) : (
              <span className="w-[4.5rem] text-center text-lg text-text-muted/30">·</span>
            )}

            {/* Equip button (only if blade assigned) */}
            {blade && (
              <button
                type="button"
                onClick={() => handleEquip(blade.id)}
                className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                  isEquipped
                    ? 'bg-emerald-500/30 text-emerald-300'
                    : 'bg-surface/30 text-text-muted hover:bg-amber-500/20 hover:text-amber-300'
                }`}
                title={isEquipped ? 'Unequip blade' : 'Equip for wander cut sticker'}
              >
                {isEquipped ? '✓ equipped' : 'equip'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  if (variant === 'sheet') {
    return rows;
  }

  return (
    <div className="space-y-4">
      {/* Equipped Blade Banner */}
      {equippedId && (() => {
        const blade = inventory.find(b => b.id === equippedId);
        if (!blade) return null;
        return (
          <div className="p-3 rounded-xl border-2 border-emerald-500/50 bg-emerald-500/10 flex items-center gap-3">
            <span className="text-2xl">{blade.primaryEmoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-300">Equipped: {blade.name}</p>
              <p className="text-[10px] text-text-muted">Right-click swordsman in wander mode to cut sticker</p>
            </div>
            <button
              type="button"
              onClick={() => unequipBlade()}
              className="px-3 py-1.5 rounded-lg text-xs bg-surface/30 text-text-muted hover:bg-surface/50"
            >
              Unequip
            </button>
          </div>
        );
      })()}

      {/* Slot rows */}
      {rows}

      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-text-muted pt-2">
        <span>{filledSlots}/6 stance slots filled</span>
        {!equippedId && filledSlots > 0 && (
          <span className="text-amber-400/70">Equip a blade to cast in wander mode</span>
        )}
      </div>

      {/* Import Section */}
      <div className="pt-4 border-t border-surface/30">
        <SpellwebBladeImport onApplied={onBladeChange} />
      </div>
    </div>
  );
}
