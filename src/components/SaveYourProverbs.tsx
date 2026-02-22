'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCustomProverbs, setCustomProverbs } from '@/lib/spellbook-storage';

export default function SaveYourProverbs() {
  const [listValue, setListValue] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [saved, setSaved] = useState(false);

  const refreshList = useCallback(() => {
    setListValue(getCustomProverbs());
  }, []);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const handleAdd = useCallback(() => {
    const trimmed = currentInput.trim();
    if (!trimmed) return;
    const existing = getCustomProverbs();
    const newList = existing ? `${existing}\n${trimmed}` : trimmed;
    setCustomProverbs(newList);
    setCurrentInput('');
    setListValue(newList);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, [currentInput]);

  const handleListChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setListValue(v);
    setCustomProverbs(v);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, []);

  const handleListBlur = useCallback(() => {
    setCustomProverbs(listValue);
  }, [listValue]);

  return (
    <div className="rounded-xl border border-surface/50 bg-surface/20 p-4 flex flex-col min-h-[140px]">
      <h3 className="text-sm font-semibold text-text mb-1">Save your proverbs</h3>
      <p className="text-xs text-text/60 mb-2">
        Paste a proverb below and click Add; the field clears so you can add another. They are included when you download skills.md on the Spells page.
      </p>
      <div className="flex gap-2 mb-3">
        <textarea
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder="Paste or type a proverb..."
          rows={2}
          className="flex-1 min-h-[60px] w-full px-3 py-2 rounded-lg border border-surface/50 bg-background text-text text-sm placeholder:text-text/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Proverb to add"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!currentInput.trim()}
          className="self-end px-4 py-2 rounded-lg font-medium bg-primary text-background hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
        >
          Add
        </button>
      </div>
      <p className="text-xs text-text/60 mb-1">Saved proverbs (one per line)</p>
      <textarea
        value={listValue}
        onChange={handleListChange}
        onBlur={handleListBlur}
        placeholder="Add proverbs above; they appear here..."
        className="flex-1 min-h-[80px] w-full px-3 py-2 rounded-lg border border-surface/50 bg-background text-text text-sm placeholder:text-text/40 resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Your saved proverbs list"
      />
      {saved && <p className="text-xs text-primary mt-1">Saved</p>}
    </div>
  );
}
