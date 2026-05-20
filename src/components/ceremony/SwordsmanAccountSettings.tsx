'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { AgentCard, TrustTier } from '@/lib/ceremony/types';
import { clearIdentity, saveKeys, saveAgentCard } from '@/lib/ceremony/storage';
import { hexToBytes } from '@/lib/ceremony/keygen';
import { getTierMoonPhase } from '@/lib/ceremony/moon-phase';

interface ArchonBundle {
  version: number;
  type: string;
  participantId: string;
  displayName: string;
  publicKeyHex: string;
  privateKeyHex: string;
  archonDid: string;
  grimoires: string[];
  privacy: { attribution: 'full' | 'pseudonymous' | 'anonymous'; shareProverbs: boolean };
  trustTier: TrustTier;
  signature: string;
  exportedAt: string;
}

function parseArchonBundle(raw: string): ArchonBundle | string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return 'Invalid JSON';
  }
  const b = parsed as Record<string, unknown>;
  if (b.type !== 'archon-swordsman-session') return 'Not an Archon swordsman bundle (wrong type)';
  if (!b.participantId || !b.publicKeyHex || !b.privateKeyHex || !b.signature) {
    return 'Bundle missing required fields (participantId, publicKeyHex, privateKeyHex, signature)';
  }
  if (typeof b.privateKeyHex !== 'string' || b.privateKeyHex.length !== 64) {
    return 'privateKeyHex must be a 64-char hex string (32-byte Ed25519 seed)';
  }
  if (typeof b.publicKeyHex !== 'string' || b.publicKeyHex.length !== 64) {
    return 'publicKeyHex must be a 64-char hex string';
  }
  return b as unknown as ArchonBundle;
}

export default function SwordsmanAccountSettings({ card, onClear }: { card: AgentCard; onClear: () => void }) {
  const [copied, setCopied] = useState(false);
  const [showRerollConfirm, setShowRerollConfirm] = useState(false);
  const [exportCopied, setExportCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showArchonImport, setShowArchonImport] = useState(false);
  const [archonInput, setArchonInput] = useState('');
  const [archonError, setArchonError] = useState<string | null>(null);
  const [archonBundle, setArchonBundle] = useState<ArchonBundle | null>(null);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(card.participantId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };


  const handleExportToSpellweb = async () => {
    try {
      // Export data format for spellweb SwordsmanImport
      // Fields: publicKeyHex, participantId, displayName, trustTier, constellationPath
      const exportData = {
        publicKeyHex: card.publicKeyHex,
        participantId: card.participantId,
        displayName: card.displayName,
        trustTier: card.trustTier,
        constellationPath: card.constellationPath,
        grimoires: card.grimoires,
        exportedAt: new Date().toISOString(),
      };
      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 3000);
    } catch {}
  };
  const handleRerollConfirm = () => {
    clearIdentity();
    setShowRerollConfirm(false);
    onClear();
  };

  const handleArchonInputChange = (raw: string) => {
    setArchonInput(raw);
    setArchonError(null);
    setArchonBundle(null);
    if (!raw.trim()) return;
    const result = parseArchonBundle(raw.trim());
    if (typeof result === 'string') {
      setArchonError(result);
    } else {
      setArchonBundle(result);
    }
  };

  const handleArchonImportConfirm = async () => {
    if (!archonBundle) return;
    saveKeys({
      privateKey: hexToBytes(archonBundle.privateKeyHex),
      publicKey: hexToBytes(archonBundle.publicKeyHex),
    });
    saveAgentCard({
      participantId: archonBundle.participantId,
      displayName: archonBundle.displayName,
      publicKeyHex: archonBundle.publicKeyHex,
      grimoires: archonBundle.grimoires,
      privacy: archonBundle.privacy,
      trustTier: archonBundle.trustTier,
      createdAt: archonBundle.exportedAt,
      signature: archonBundle.signature,
    });
    window.location.reload();
  };

  // Get moon phase based on trust tier
  const moonPhase = getTierMoonPhase(card.trustTier);

  return (
    <div className="rounded-xl border border-surface/50 bg-surface/10 p-6 mb-10">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl" title={`${moonPhase.name}: ${moonPhase.meaning}`}>
          {moonPhase.emoji}⚔️
        </span>
        <h2 className="text-xl font-semibold text-text">Swordsman Identity</h2>
      </div>
      <p className="text-sm text-text-muted mb-6">
        Moon made operational — {moonPhase.name} ({moonPhase.dimensionsActive}).
      </p>
      <dl className="space-y-4">
        <div>
          <dt className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Display name</dt>
          <dd className="text-text font-medium">{card.displayName}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Participant ID</dt>
          <dd className="flex items-center gap-2 flex-wrap">
            <code className="text-sm text-text/80 bg-surface/50 px-2 py-1 rounded font-mono break-all">
              {card.participantId}
            </code>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </dd>
        </div>
        {card.constellationPath && (
          <div>
            <dt className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Constellation path</dt>
            <dd className="text-lg">{card.constellationPath}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Trust tier</dt>
          <dd className="flex items-center gap-2">
            <span className="text-text capitalize">{card.trustTier}</span>
            <span className="text-lg" title={moonPhase.meaning}>{moonPhase.emoji}</span>
            <span className="text-xs text-text/50">({moonPhase.dimensionsActive})</span>
          </dd>
        </div>
      </dl>

      {/* Bilateral Ceremony Section */}
      <div className="mt-6 pt-6 border-t border-surface/50">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚔️🔗🧙</span>
            <div>
              <p className="text-sm font-medium text-red-400 mb-1">Bilateral Ceremony</p>
              <p className="text-xs text-text/70 mb-3">
                Carry your Swordsman identity to <strong>spellweb.ai</strong> to forge blades.
                The export is manual by design — <em>you</em> participate by bridging territories.
              </p>
              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 font-medium hover:bg-red-500/30 transition-colors text-sm"
              >
                ⚔️ Export to Spellweb
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Your Journey - same as CompletionStep */}
      <div className="mt-6 pt-6 border-t border-surface/50">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">Continue Your Journey</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Sun Ceremony - Poems - Reflect */}
          <Link
            href="/poems"
            className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors text-left"
          >
            <span className="text-2xl">☀️</span>
            <div>
              <p className="font-medium text-amber-500">Sun Ceremony</p>
              <p className="text-xs text-text/60">Reflect — read the poems</p>
            </div>
          </Link>

          {/* Story - Connect */}
          <Link
            href="/story"
            className="flex items-center gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors text-left"
          >
            <span className="text-2xl">📖</span>
            <div>
              <p className="font-medium text-primary">Story</p>
              <p className="text-xs text-text/60">Connect — the First Person origin</p>
            </div>
          </Link>

          {/* Spells - Choose Agent Persona */}
          <Link
            href="/spells"
            className="flex items-center gap-3 p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 transition-colors text-left"
          >
            <span className="text-2xl">🔮</span>
            <div>
              <p className="font-medium text-purple-400">Spells</p>
              <p className="text-xs text-text/60">Choose your agent persona</p>
            </div>
          </Link>

          {/* Spellweb - Draw Constellation */}
          <a
            href="https://spellweb.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-colors text-left"
          >
            <span className="text-2xl">⚔️🕸️</span>
            <div>
              <p className="font-medium text-red-400">Spellweb</p>
              <p className="text-xs text-text/60">Forge — draw your constellation</p>
            </div>
          </a>
        </div>

        {/* Reroll / Import Archon - at bottom */}
        <div className="mt-4 pt-4 border-t border-surface/30 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowArchonImport(true)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-amber-500/80 hover:text-amber-500 border border-amber-500/30 hover:border-amber-500/60 transition-colors"
          >
            ⚔️ Import Archon
          </button>
          <button
            type="button"
            onClick={() => setShowRerollConfirm(true)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-text-muted hover:text-text border border-surface/50 hover:border-surface transition-colors"
          >
            Reroll keys
          </button>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" aria-modal="true" role="dialog">
          <div className="rounded-xl border border-red-500/30 bg-background p-6 max-w-lg w-full shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚔️🔗🧙</span>
              <h3 className="text-lg font-semibold text-text">Export to Spellweb</h3>
            </div>
            <div className="space-y-4 mb-6">
              <p className="text-sm text-text/80">
                Your <strong>public identity</strong> for bilateral ceremony. Paste into spellweb.ai's Blades modal.
              </p>

              {/* Public Key Info Display */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
                <div>
                  <p className="text-xs text-text/50 mb-1">Public Key</p>
                  <code className="text-xs text-primary font-mono break-all block">{card.publicKeyHex}</code>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-text/50 mb-1">Participant ID</p>
                    <code className="text-xs text-text/80 font-mono break-all block">{card.participantId}</code>
                  </div>
                  <div>
                    <p className="text-xs text-text/50 mb-1">Display Name</p>
                    <p className="text-sm text-text/80">{card.displayName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-text/50 mb-1">Trust Tier</p>
                    <p className="text-sm text-text/80 capitalize">{card.trustTier} {moonPhase.emoji}</p>
                  </div>
                  {card.constellationPath && (
                    <div>
                      <p className="text-xs text-text/50 mb-1">Constellation</p>
                      <p className="text-sm">{card.constellationPath}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-surface/50 bg-surface/20 p-3">
                <p className="text-xs text-text/50 mb-2">The bilateral ceremony:</p>
                <div className="flex items-center gap-2 text-sm">
                  <span>🌍</span>
                  <span className="text-text/70">agentprivacy.ai</span>
                  <span className="text-primary">→</span>
                  <span className="text-text/70">you carry</span>
                  <span className="text-primary">→</span>
                  <span>⚔️</span>
                  <span className="text-text/70">spellweb.ai</span>
                </div>
              </div>
              <p className="text-xs text-amber-500/80">
                No private keys are exported. Your signing capability stays here.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-lg border border-surface/50 text-text hover:bg-surface/30"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleExportToSpellweb}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 font-medium"
              >
                {exportCopied ? '✓ Copied!' : 'Copy as JSON'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showArchonImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" aria-modal="true" role="dialog">
          <div className="rounded-xl border border-amber-500/30 bg-background p-6 max-w-lg w-full shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚔️🔗🌐</span>
              <h3 className="text-lg font-semibold text-text">Import Archon Swordsman</h3>
            </div>
            <div className="space-y-4 mb-6">
              <p className="text-sm text-text/80">
                Paste the session bundle from{' '}
                <code className="text-xs bg-surface/50 px-1 py-0.5 rounded font-mono">export-swordsman-key.ts</code>.
                This replaces your current identity with a stable Archon-derived one.
              </p>
              <div className="rounded-lg border border-surface/40 bg-surface/10 p-3">
                <p className="text-xs text-text/50 mb-1 font-mono">CLI</p>
                <code className="text-xs text-amber-400/80 font-mono break-all">
                  node --experimental-strip-types export-swordsman-key.ts --name Excalibur
                </code>
              </div>
              <textarea
                className={`w-full h-40 rounded-lg border bg-surface/10 p-3 text-xs font-mono text-text resize-none focus:outline-none transition-colors ${
                  archonError
                    ? 'border-red-500/60 focus:border-red-500'
                    : archonBundle
                    ? 'border-green-500/60 focus:border-green-500'
                    : 'border-surface/50 focus:border-amber-500/60'
                }`}
                placeholder={'{\n  "type": "archon-swordsman-session",\n  "participantId": "ap-...",\n  ...\n}'}
                value={archonInput}
                onChange={e => handleArchonInputChange(e.target.value)}
                spellCheck={false}
              />
              {archonError && (
                <p className="text-xs text-red-400">{archonError}</p>
              )}
              {archonBundle && (
                <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3 space-y-1">
                  <p className="text-xs font-medium text-green-400">Bundle valid</p>
                  <p className="text-xs text-text/70">
                    <span className="text-text/50">ID:</span> {archonBundle.participantId}
                  </p>
                  <p className="text-xs text-text/70">
                    <span className="text-text/50">Name:</span> {archonBundle.displayName}
                  </p>
                  <p className="text-xs text-text/70">
                    <span className="text-text/50">Archon DID:</span>{' '}
                    <span className="font-mono break-all">{archonBundle.archonDid}</span>
                  </p>
                  <p className="text-xs text-text/70">
                    <span className="text-text/50">Tier:</span> {archonBundle.trustTier}
                  </p>
                </div>
              )}
              <p className="text-xs text-amber-500/70">
                The private key lives in sessionStorage (burned on tab close). Public key and identity card persist in localStorage.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => { setShowArchonImport(false); setArchonInput(''); setArchonError(null); setArchonBundle(null); }}
                className="px-4 py-2 rounded-lg border border-surface/50 text-text hover:bg-surface/30"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleArchonImportConfirm}
                disabled={!archonBundle}
                className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Import & Reload
              </button>
            </div>
          </div>
        </div>
      )}

      {showRerollConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" aria-modal="true" role="dialog">
          <div className="rounded-xl border border-surface/50 bg-background p-6 max-w-sm w-full shadow-xl">
            <p className="text-text font-medium mb-4">
              This clears your history with the website. Are you sure?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowRerollConfirm(false)}
                className="px-4 py-2 rounded-lg border border-surface/50 text-text hover:bg-surface/30"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRerollConfirm}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 border border-red-500/40 hover:bg-red-500/30 font-medium"
              >
                Yes, clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
