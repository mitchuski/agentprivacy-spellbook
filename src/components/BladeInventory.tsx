'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getBladeInventory,
  getStanceBladeLoadout,
  assignBladeToLine,
  unassignBlade,
  removeBladeFromInventory,
  getBladeAssignment,
  parseAndAddBladeToInventory,
  applySpellwebBladeToSwordsmanSlots,
  parseSpellwebBladeImportJson,
  equipBlade,
  getEquippedBladeId,
  type InventoryBlade,
  type StanceBladeLoadout,
} from '@/lib/spellweb-blade-bridge';

type BladeInventoryProps = {
  onBladeChange?: () => void;
};

export default function BladeInventory({ onBladeChange }: BladeInventoryProps) {
  const [inventory, setInventory] = useState<InventoryBlade[]>([]);
  const [loadout, setLoadout] = useState<StanceBladeLoadout>({
    L1: null, L2: null, L3: null, L4: null, L5: null, L6: null, swap: null,
  });
  const [expandedBlade, setExpandedBlade] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(() => {
    setInventory(getBladeInventory());
    setLoadout(getStanceBladeLoadout());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('agentprivacy:blade-inventory-changed', refresh);
    window.addEventListener('agentprivacy:stance-loadout-changed', refresh);
    return () => {
      window.removeEventListener('agentprivacy:blade-inventory-changed', refresh);
      window.removeEventListener('agentprivacy:stance-loadout-changed', refresh);
    };
  }, [refresh]);

  // Import handlers
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
      equipBlade(blade.id);
      setToast(`${blade.primaryEmoji} ${blade.name} added & equipped`);
      setTimeout(() => setToast(null), 3200);
      onBladeChange?.();
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  }, [onBladeChange]);

  const handleImportText = useCallback(() => {
    setError(null);
    const trimmed = importText.trim();

    const jsonPayload = parseSpellwebBladeImportJson(trimmed);
    if (jsonPayload) {
      applySpellwebBladeToSwordsmanSlots(jsonPayload);
      setImportText('');
      setToast(`Blade "${jsonPayload.name}" facets applied to Soulbis ring`);
      setTimeout(() => setToast(null), 3200);
      onBladeChange?.();
      return;
    }

    if (trimmed.startsWith('#') || trimmed.includes('Signature:')) {
      const blade = parseAndAddBladeToInventory(trimmed);
      if (blade) {
        equipBlade(blade.id);
        setImportText('');
        setToast(`${blade.primaryEmoji} ${blade.name} added & equipped`);
        setTimeout(() => setToast(null), 3200);
        onBladeChange?.();
        return;
      }
    }

    setError('Invalid format — paste blade .md content or JSON payload');
  }, [importText, onBladeChange]);

  const handleAssign = useCallback((bladeId: string, line: keyof StanceBladeLoadout) => {
    assignBladeToLine(bladeId, line);
    onBladeChange?.();
  }, [onBladeChange]);

  const handleUnassign = useCallback((bladeId: string) => {
    unassignBlade(bladeId);
    onBladeChange?.();
  }, [onBladeChange]);

  const handleDelete = useCallback((bladeId: string) => {
    removeBladeFromInventory(bladeId);
    setConfirmDelete(null);
    setExpandedBlade(null);
    onBladeChange?.();
  }, [onBladeChange]);

  const tierColors = {
    dragon: {
      border: 'border-amber-500/60',
      bg: 'bg-amber-500/10',
      text: 'text-amber-300',
      badge: 'bg-amber-500/20 text-amber-300',
    },
    heavy: {
      border: 'border-slate-400/60',
      bg: 'bg-slate-400/10',
      text: 'text-slate-300',
      badge: 'bg-slate-400/20 text-slate-300',
    },
    light: {
      border: 'border-sky-400/60',
      bg: 'bg-sky-400/10',
      text: 'text-sky-300',
      badge: 'bg-sky-400/20 text-sky-300',
    },
  };

  const lineLabels = {
    L1: 'Protection',
    L2: 'Delegation',
    L3: 'Memory',
    L4: 'Connection',
    L5: 'Computation',
    L6: 'Value',
  };

  const assignedCount = Object.values(loadout).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header with Import */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-semibold text-text">Blade Inventory</h3>
          <p className="text-xs text-text-muted">
            {inventory.length} blade{inventory.length !== 1 ? 's' : ''} · {assignedCount}/7 assigned
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Witness Blade Button */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-xs text-cyan-300 cursor-pointer hover:bg-cyan-500/20 transition-colors">
            <span>👁️</span>
            <span>Witness Blade</span>
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
          {/* Forge Link */}
          <a
            href="https://spellweb.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg border border-surface/40 bg-surface/10 text-xs text-text-muted hover:bg-surface/20"
          >
            🕸️ Forge at spellweb
          </a>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <p className="text-xs text-emerald-400 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30" role="status">
          {toast}
        </p>
      )}

      {/* Blade Grid */}
      {inventory.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {inventory.map((blade) => {
            const colors = tierColors[blade.tier];
            const assignment = getBladeAssignment(blade.id);
            const isExpanded = expandedBlade === blade.id;
            const isDeleting = confirmDelete === blade.id;

            return (
              <motion.div
                key={blade.id}
                layout
                className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden`}
              >
                {/* Blade Header */}
                <button
                  type="button"
                  onClick={() => setExpandedBlade(isExpanded ? null : blade.id)}
                  className="w-full p-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="text-3xl shrink-0">{blade.primaryEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-sm font-semibold truncate ${colors.text}`}>
                        {blade.name}
                      </h4>
                      {blade.isWitness && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-violet-500/20 text-violet-300">
                          witness
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-text-muted">
                      <span>{blade.tier} · stratum {blade.stratum}/6</span>
                      <span className="font-mono">hex: {blade.bladeHex}</span>
                      {blade.proofSignature && (
                        <span className="font-mono text-primary/70">{blade.proofSignature}</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {assignment ? (
                      <span className={`px-2 py-1 rounded text-xs font-mono ${
                        assignment === 'swap'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {assignment}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-surface/30 text-text-muted">
                        unassigned
                      </span>
                    )}
                  </div>
                  <span className={`text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-surface/30"
                    >
                      <div className="p-3 space-y-3">
                        {/* Facets */}
                        <div>
                          <p className="text-[10px] text-text-muted mb-2">Facets (constellation path)</p>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {blade.facets.map((facet, i) => (
                              <div
                                key={i}
                                className="p-2 rounded-lg bg-surface/30 text-center"
                                title={facet.label}
                              >
                                <div className="text-xl mb-1">{facet.emoji}</div>
                                <div className="text-[9px] text-text-muted truncate">
                                  {facet.label || `L${i + 1}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Assignment Controls */}
                        <div>
                          <p className="text-[10px] text-text-muted mb-2">
                            {assignment ? 'Currently assigned — change slot or unassign' : 'Assign to stance line'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(['L1', 'L2', 'L3', 'L4', 'L5', 'L6'] as const).map((line) => {
                              const occupied = loadout[line];
                              const isCurrentSlot = assignment === line;

                              return (
                                <button
                                  key={line}
                                  type="button"
                                  onClick={() => handleAssign(blade.id, line)}
                                  className={`px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                                    isCurrentSlot
                                      ? 'bg-emerald-500/30 text-emerald-300 ring-2 ring-emerald-500/50'
                                      : occupied
                                        ? 'bg-surface/30 text-text-muted/50'
                                        : 'bg-surface/50 text-text-muted hover:bg-surface hover:text-text'
                                  }`}
                                  title={isCurrentSlot ? 'Current slot' : occupied ? `${line} has another blade` : `Assign to ${line} (${lineLabels[line]})`}
                                >
                                  {line}
                                  {isCurrentSlot && ' ✓'}
                                </button>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => handleAssign(blade.id, 'swap')}
                              className={`px-3 py-2 rounded-lg text-xs transition-colors ${
                                assignment === 'swap'
                                  ? 'bg-cyan-500/30 text-cyan-300 ring-2 ring-cyan-500/50'
                                  : loadout.swap
                                    ? 'bg-surface/30 text-text-muted/50'
                                    : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                              }`}
                              title={assignment === 'swap' ? 'Current slot' : loadout.swap ? 'Swap slot occupied' : 'Assign to swap (7th slot)'}
                            >
                              ⇄ Swap{assignment === 'swap' && ' ✓'}
                            </button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-surface/30">
                          {assignment && (
                            <button
                              type="button"
                              onClick={() => handleUnassign(blade.id)}
                              className="px-3 py-1.5 rounded text-xs text-text-muted hover:text-amber-400 hover:bg-amber-500/10"
                            >
                              Unassign from {assignment}
                            </button>
                          )}
                          <div className="ml-auto">
                            {isDeleting ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-red-400">Delete blade?</span>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(blade.id)}
                                  className="px-3 py-1.5 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                >
                                  Yes, delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-3 py-1.5 rounded text-xs text-text-muted hover:bg-surface/30"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDelete(blade.id)}
                                className="px-3 py-1.5 rounded text-xs text-text-muted/50 hover:text-red-400 hover:bg-red-500/10"
                              >
                                Delete blade
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-[9px] text-text-muted/50 text-right">
                          Imported {new Date(blade.importedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 rounded-xl border-2 border-dashed border-surface/30 text-center">
          <div className="text-4xl mb-3">⚔️</div>
          <h4 className="text-base font-semibold text-text mb-2">No Blades Yet</h4>
          <p className="text-sm text-text-muted mb-4">
            Import forged blades from spellweb.ai to fill your stance ring.
          </p>
        </div>
      )}

      {/* Paste Import (collapsed by default) */}
      <details className="rounded-lg border border-surface/30 bg-surface/5">
        <summary className="px-3 py-2 text-xs text-text-muted cursor-pointer hover:text-text/80">
          Paste blade content / JSON...
        </summary>
        <div className="px-3 pb-3 space-y-2">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste blade .md content or JSON payload..."
            rows={4}
            className="w-full rounded-lg border border-surface/50 bg-background px-2 py-1.5 text-[11px] font-mono text-text placeholder:text-text-muted/50"
          />
          {error && <p className="text-[10px] text-red-400">{error}</p>}
          <button
            type="button"
            onClick={handleImportText}
            disabled={!importText.trim()}
            className="px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-500/15 text-xs font-medium text-cyan-200 hover:bg-cyan-500/25 disabled:opacity-40 disabled:pointer-events-none"
          >
            Import blade
          </button>
        </div>
      </details>

      {/* Quick Stance Ring Overview */}
      {inventory.length > 0 && (
        <div className="p-3 rounded-xl border border-surface/30 bg-surface/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-text-muted">Stance Ring</p>
            <p className="text-[10px] text-text-muted">
              {assignedCount >= 7 ? (
                <span className="text-emerald-400">Complete!</span>
              ) : (
                <span>{7 - assignedCount} slot{7 - assignedCount !== 1 ? 's' : ''} empty</span>
              )}
            </p>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {(['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'swap'] as const).map((slot) => {
              const bladeId = loadout[slot];
              const blade = bladeId ? inventory.find((b) => b.id === bladeId) : null;

              return (
                <div
                  key={slot}
                  className={`p-2 rounded-lg text-center ${
                    blade
                      ? 'bg-emerald-500/20 border border-emerald-500/30'
                      : 'bg-surface/20 border border-surface/30'
                  }`}
                  title={blade ? `${slot}: ${blade.name}` : `${slot}: empty`}
                >
                  <div className="text-lg">{blade?.primaryEmoji || '·'}</div>
                  <div className="text-[8px] text-text-muted">
                    {slot === 'swap' ? '⇄' : slot}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
