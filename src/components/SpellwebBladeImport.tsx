'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  applySpellwebBladeToSwordsmanSlots,
  parseSpellwebBladeImportJson,
  getSpellwebBladeMeta,
  parseAndAddBladeToInventory,
  getBladeInventory,
  getEquippedBladeId,
  equipBlade,
  unequipBlade,
  removeBladeFromInventory,
  type InventoryBlade,
} from '@/lib/spellweb-blade-bridge';

type SpellwebBladeImportProps = {
  onApplied?: () => void;
  className?: string;
};

/**
 * Import forged blade from spellweb.ai:
 * - Upload .md blade file (witness sword export)
 * - Paste JSON payload
 * - Manage blade inventory and equip blades
 */
export default function SpellwebBladeImport({ onApplied, className = '' }: SpellwebBladeImportProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryBlade[]>([]);
  const [equippedId, setEquippedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const meta = typeof window !== 'undefined' ? getSpellwebBladeMeta() : null;

  // Load inventory on mount
  useEffect(() => {
    setInventory(getBladeInventory());
    setEquippedId(getEquippedBladeId());

    const onInventoryChange = () => {
      setInventory(getBladeInventory());
      setEquippedId(getEquippedBladeId());
    };
    window.addEventListener('agentprivacy:blade-inventory-changed', onInventoryChange);
    window.addEventListener('agentprivacy:blade-equipped', onInventoryChange);
    window.addEventListener('agentprivacy:blade-unequipped', onInventoryChange);
    return () => {
      window.removeEventListener('agentprivacy:blade-inventory-changed', onInventoryChange);
      window.removeEventListener('agentprivacy:blade-equipped', onInventoryChange);
      window.removeEventListener('agentprivacy:blade-unequipped', onInventoryChange);
    };
  }, []);

  const handleFileImport = useCallback((file: File) => {
    setError(null);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (!content) {
        setError('Could not read file');
        return;
      }
      const blade = parseAndAddBladeToInventory(content);
      if (!blade) {
        setError('Invalid blade markdown — expected spellweb export format');
        return;
      }
      // Auto-equip the imported blade
      equipBlade(blade.id);
      setToast(`${blade.primaryEmoji} ${blade.name} added & equipped`);
      setTimeout(() => setToast(null), 3200);
      onApplied?.();
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  }, [onApplied]);

  const apply = useCallback(() => {
    setError(null);
    const trimmed = text.trim();

    // Try JSON first
    const jsonPayload = parseSpellwebBladeImportJson(trimmed);
    if (jsonPayload) {
      applySpellwebBladeToSwordsmanSlots(jsonPayload);
      setText('');
      setToast(`Blade "${jsonPayload.name}" facets applied to Soulbis ring`);
      setTimeout(() => setToast(null), 3200);
      onApplied?.();
      return;
    }

    // Try markdown format - add to inventory
    if (trimmed.startsWith('#') || trimmed.includes('Signature:')) {
      const blade = parseAndAddBladeToInventory(trimmed);
      if (blade) {
        equipBlade(blade.id);
        setText('');
        setToast(`${blade.primaryEmoji} ${blade.name} added & equipped`);
        setTimeout(() => setToast(null), 3200);
        onApplied?.();
        return;
      }
    }

    setError('Invalid format — paste blade .md content or JSON payload');
  }, [text, onApplied]);

  const handleEquip = useCallback((bladeId: string) => {
    if (equippedId === bladeId) {
      unequipBlade();
      setToast('Blade unequipped');
    } else {
      equipBlade(bladeId);
      const blade = inventory.find(b => b.id === bladeId);
      if (blade) setToast(`${blade.primaryEmoji} ${blade.name} equipped`);
    }
    setTimeout(() => setToast(null), 2000);
    onApplied?.();
  }, [equippedId, inventory, onApplied]);

  const handleRemove = useCallback((bladeId: string) => {
    const blade = inventory.find(b => b.id === bladeId);
    removeBladeFromInventory(bladeId);
    if (blade) setToast(`${blade.primaryEmoji} ${blade.name} removed`);
    setTimeout(() => setToast(null), 2000);
  }, [inventory]);

  const tierColors = {
    dragon: 'border-amber-500/60 bg-amber-500/10',
    heavy: 'border-slate-400/60 bg-slate-400/10',
    light: 'border-sky-400/60 bg-sky-400/10',
  };

  return (
    <div className={`rounded-lg border border-cyan-500/25 bg-cyan-500/5 px-3 py-3 ${className}`}>
      <p className="text-[11px] font-medium text-text/90 mb-1 flex items-center gap-2">
        <span aria-hidden>🗡️</span>
        spellweb.ai — forged blades → Soulbis orbit
      </p>
      <p className="text-[10px] text-text-muted mb-2 leading-relaxed">
        Import <strong className="text-text/80">forged blade .md</strong> files from spellweb. Equip a blade to unlock its facets for your stance lines.
      </p>

      {/* Blade Inventory */}
      {inventory.length > 0 && (
        <div className="mb-3 space-y-1">
          <p className="text-[10px] text-text-muted font-medium">Blade Inventory ({inventory.length})</p>
          <div className="grid grid-cols-1 gap-1.5">
            {inventory.map((blade) => {
              const isEquipped = equippedId === blade.id;
              return (
                <div
                  key={blade.id}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border transition-all ${
                    isEquipped
                      ? 'border-emerald-500/60 bg-emerald-500/15 ring-1 ring-emerald-500/30'
                      : tierColors[blade.tier]
                  }`}
                >
                  <span className="text-lg" title={blade.name}>{blade.primaryEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-text truncate">
                      {blade.name}
                      {blade.isWitness && <span className="text-cyan-400/70 ml-1">👁️</span>}
                    </p>
                    <p className="text-[9px] text-text-muted">
                      {blade.tier} · hex {blade.bladeHex} · {blade.stratum}/6
                      {blade.proofSignature && <span className="ml-1 opacity-60">{blade.proofSignature}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEquip(blade.id)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                        isEquipped
                          ? 'bg-emerald-500/30 text-emerald-300 hover:bg-emerald-500/40'
                          : 'bg-surface/50 text-text-muted hover:bg-surface hover:text-text'
                      }`}
                      title={isEquipped ? 'Unequip blade' : 'Equip blade'}
                    >
                      {isEquipped ? '⚔️ Equipped' : 'Equip'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(blade.id)}
                      className="p-1 rounded text-text-muted/50 hover:text-red-400 hover:bg-red-500/10"
                      title="Remove blade"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Equipped blade facets preview */}
      {equippedId && (() => {
        const equipped = inventory.find(b => b.id === equippedId);
        if (!equipped) return null;
        return (
          <div className="mb-3 p-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
            <p className="text-[10px] text-emerald-400/90 font-medium mb-1">
              {equipped.primaryEmoji} {equipped.name} — 6 facets unlocked
            </p>
            <div className="flex gap-1">
              {equipped.facets.map((f, i) => (
                <div
                  key={i}
                  className="flex-1 text-center py-1 rounded bg-surface/30 border border-surface/50"
                  title={`L${i + 1}: ${f.label}`}
                >
                  <span className="text-sm">{f.emoji}</span>
                  <p className="text-[8px] text-text-muted mt-0.5">L{i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* File upload */}
      <label
        className="flex items-center justify-center gap-2 w-full px-3 py-2 mb-2 rounded-lg border-2 border-dashed border-cyan-500/30 bg-cyan-500/5 text-xs text-cyan-300 cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors"
      >
        <span aria-hidden>👁️</span>
        <span>Witness Blade — drop .md file or click</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileImport(file);
            e.target.value = '';
          }}
        />
      </label>

      <details className="mb-2">
        <summary className="text-[10px] text-text-muted cursor-pointer hover:text-text/80">
          Or paste blade content / JSON...
        </summary>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste blade .md content or JSON payload..."
          rows={4}
          className="w-full mt-2 rounded-lg border border-surface/50 bg-background px-2 py-1.5 text-[11px] font-mono text-text placeholder:text-text-muted/50"
          aria-label="Paste spellweb blade content"
        />
      </details>

      {error && <p className="text-[10px] text-red-400 mb-2">{error}</p>}
      {toast && (
        <p className="text-[10px] text-emerald-400 mb-2" role="status">
          {toast}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={apply}
          disabled={!text.trim()}
          className="px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-500/15 text-xs font-medium text-cyan-200 hover:bg-cyan-500/25 disabled:opacity-40 disabled:pointer-events-none"
        >
          Import blade
        </button>
        <a
          href="https://spellweb.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-primary hover:underline"
        >
          Forge at spellweb.ai
        </a>
      </div>
    </div>
  );
}
