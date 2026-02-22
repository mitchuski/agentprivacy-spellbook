'use client';

import { useState, useEffect } from 'react';
import type { PromiseType, PromiseForce } from '@/lib/promises/types';
import { DEFAULT_SPELL, spellToConstellation, FORCE_SYMBOLS } from '@/lib/promises/types';

const TYPES: PromiseType[] = ['study', 'inscribe', 'share', 'contribute', 'affirm', 'practice', 'custom'];
const FORCES: PromiseForce[] = ['protect', 'project', 'reflect', 'connect'];

type AddParams = {
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
};

export default function NewPromiseModal({
  initialProverb,
  onAdd,
  onClose,
}: {
  initialProverb?: string;
  onAdd: (params: AddParams) => void;
  onClose: () => void;
}) {
  const [type, setType] = useState<PromiseType>('study');
  const [description, setDescription] = useState('');
  const [proverb, setProverb] = useState(initialProverb ?? '');
  const [spell, setSpell] = useState(DEFAULT_SPELL);
  const [tagsStr, setTagsStr] = useState('');
  const [force, setForce] = useState<PromiseForce | ''>('');

  useEffect(() => {
    if (initialProverb !== undefined) setProverb(initialProverb);
  }, [initialProverb]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    const tags = tagsStr.trim()
      ? tagsStr.split(/[\s,]+/).map((t) => t.trim().replace(/^#+/, '')).filter(Boolean).map((t) => `#${t}`)
      : undefined;
    const constellation = spellToConstellation(spell.trim() || DEFAULT_SPELL);
    onAdd({
      type,
      description: description.trim(),
      proverb: proverb.trim() || undefined,
      connectedProverb: proverb.trim() || undefined,
      spell: spell.trim() || DEFAULT_SPELL,
      constellation,
      tags,
      force: force || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-label="New promise">
      <div className="w-full max-w-md rounded-2xl border border-surface/50 bg-background p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-text mb-4">New Promise</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text/80 mb-1">Action</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PromiseType)}
              className="w-full px-3 py-2 rounded-lg border border-surface/50 bg-background text-text"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text/80 mb-1">Force (optional)</label>
            <select
              value={force}
              onChange={(e) => setForce(e.target.value as PromiseForce | '')}
              className="w-full px-3 py-2 rounded-lg border border-surface/50 bg-background text-text"
            >
              <option value="">—</option>
              {FORCES.map((f) => (
                <option key={f} value={f}>{FORCE_SYMBOLS[f]} {f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text/80 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you commit to?"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-surface/50 bg-background text-text placeholder:text-text/50 resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text/80 mb-1">Proverb (optional)</label>
            <textarea
              value={proverb}
              onChange={(e) => setProverb(e.target.value)}
              placeholder="Your contextual compression"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-surface/50 bg-background text-text placeholder:text-text/50 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text/80 mb-1">Spell (optional)</label>
            <input
              type="text"
              value={spell}
              onChange={(e) => setSpell(e.target.value)}
              placeholder={DEFAULT_SPELL}
              className="w-full px-3 py-2 rounded-lg border border-surface/50 bg-background text-text placeholder:text-text/50 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text/80 mb-1">Tags (optional)</label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="#gap #vrc #swordsman"
              className="w-full px-3 py-2 rounded-lg border border-surface/50 bg-background text-text placeholder:text-text/50 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-surface/50 hover:bg-surface/30">
              Cancel
            </button>
            <button type="submit" disabled={!description.trim()} className="flex-1 py-2 rounded-lg font-medium bg-primary text-background hover:bg-primary/90 disabled:opacity-50">
              Add promise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
