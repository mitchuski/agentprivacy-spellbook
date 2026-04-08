'use client';

import Link from 'next/link';
import {
  getEmojiOptionsForSpellId,
  getMageOrbSpellOptions,
  type OrbLoadoutSlot,
} from '@/lib/orb-loadout';

type OrbMageSlotsProps = {
  slots: OrbLoadoutSlot[];
  onChangeSlot: (index: number, next: OrbLoadoutSlot) => void;
  /** Sheet mode: no outer card (parent provides chrome) */
  variant?: 'page' | 'sheet';
};

export default function OrbMageSlots({ slots, onChangeSlot, variant = 'page' }: OrbMageSlotsProps) {
  const spells = getMageOrbSpellOptions();

  const rows = (
    <div className="space-y-2">
      {slots.map((slot, index) => {
        const emojiOptions = getEmojiOptionsForSpellId(slot.spellId);
        return (
          <div
            key={`mage-${index}`}
            className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm"
          >
            <span className="text-[10px] text-text-muted font-mono w-8 shrink-0">M{index + 1}</span>
            <select
              value={slot.spellId}
              onChange={(e) => {
                const spellId = e.target.value;
                const opts = getEmojiOptionsForSpellId(spellId);
                onChangeSlot(index, { spellId, emoji: opts[0] ?? '✨' });
              }}
              className="flex-1 min-w-[10rem] rounded-lg border border-surface/50 bg-background px-2 py-1.5 text-xs text-text"
              aria-label={`Mage slot ${index + 1} spell`}
            >
              {spells.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {s.content.slice(0, 42)}
                  {s.content.length > 42 ? '…' : ''}
                </option>
              ))}
            </select>
            <select
              value={slot.emoji}
              onChange={(e) => onChangeSlot(index, { ...slot, emoji: e.target.value })}
              className="w-[4.5rem] rounded-lg border border-surface/50 bg-background px-1 py-1.5 text-center text-lg leading-none"
              title="Emoji in orbit"
              aria-label={`Mage slot ${index + 1} orbit emoji`}
            >
              {emojiOptions.map((em) => (
                <option key={em} value={em}>
                  {em}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );

  if (variant === 'sheet') {
    return rows;
  }

  return (
    <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
      <h3 className="text-sm font-semibold text-text mb-1 flex items-center gap-2">
        <span aria-hidden>🧙</span>
        Mage — six ring spells
      </h3>
      <p className="text-[11px] text-text-muted mb-3">
        Your <strong className="text-text/90">persona spell graph</strong> from{' '}
        <Link href="/spells#spellbook" className="text-primary hover:underline">
          /spells
        </Link>{' '}
        is listed first in each menu; then the training repertoire. Pick the spell, then the orbit emoji. Left‑click tap casts, hold to view orbit. Press{' '}
        <kbd className="px-1 rounded bg-surface/50 font-mono">M</kbd> in training to open this sheet.
      </p>
      {rows}
    </div>
  );
}
