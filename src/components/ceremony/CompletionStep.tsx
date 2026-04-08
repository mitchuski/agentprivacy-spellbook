'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAgentCard, getCeremonyConstellation } from '@/lib/ceremony/storage';
import { CEREMONY_MOON, getTierMoonPhase, MOON_PHASES } from '@/lib/ceremony/moon-phase';

/** The Four Lines - ceremony proverb */
function TheFourLines() {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-left">
      <p className="text-xs text-amber-500/70 mb-2 uppercase tracking-wide font-medium">The Four Lines</p>
      <div className="space-y-1 text-sm text-text/80 italic">
        <p>The amnesia is the protocol.</p>
        <p>The wound is the trust.</p>
        <p>The orbit is the proof.</p>
        <p>The light is the reason.</p>
      </div>
    </div>
  );
}

/** Next step navigation buttons */
function NextSteps() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-text/50 uppercase tracking-wide">Continue Your Journey</p>
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

      {/* Manage identity link */}
      <Link
        href="/ceremony"
        className="block text-center text-sm text-text/50 hover:text-text/70 transition-colors mt-4"
      >
        ← Manage identity settings
      </Link>
    </div>
  );
}

export default function CompletionStep({ returnTo = '/spells' }: { returnTo?: string }) {
  const [constellationPath, setConstellationPath] = useState<string | null>(null);

  useEffect(() => {
    const c = getCeremonyConstellation();
    if (c?.constellationPath) setConstellationPath(c.constellationPath);
  }, []);

  const handleDownloadCard = () => {
    const card = getAgentCard();
    if (!card) return;
    const blob = new Blob([JSON.stringify(card, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-card-${card.participantId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get the card to determine final moon phase
  const card = getAgentCard();
  const tierPhase = card ? getTierMoonPhase(card.trustTier) : MOON_PHASES[1]!;

  return (
    <div className="space-y-6 text-center">
      {/* Moon Phase Progression */}
      <div className="flex items-center justify-center gap-2 text-3xl">
        <span title="Ceremony start — total darkness">{CEREMONY_MOON}</span>
        <span className="text-text/30 text-lg">→</span>
        <span className="text-primary text-4xl" title={`${tierPhase.name}: ${tierPhase.meaning}`}>
          {tierPhase.emoji}
        </span>
      </div>
      <p className="text-xs text-text/50">{CEREMONY_MOON} New Moon → {tierPhase.emoji} {tierPhase.name}</p>

      <h2 className="text-2xl font-semibold text-text">Moon Made Operational</h2>
      <p className="text-text/80">
        Your Swordsman identity is ready. {tierPhase.dimensionsActive} dimensions active.
      </p>

      {constellationPath && (
        <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
          <p className="text-xs text-text/70 mb-1">Your constellation path</p>
          <p className="text-xl font-mono text-primary break-all" aria-label="Constellation path">
            {constellationPath}
          </p>
        </div>
      )}

      <TheFourLines />

      <div className="rounded-xl border border-surface/30 bg-surface/5 px-4 py-3">
        <p className="text-xs text-text/50 mb-2">Key Lifecycle</p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-green-500">●</span>
            <span className="text-text/70">Public key persists</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500">●</span>
            <span className="text-text/70">Private key burns on tab close</span>
          </div>
        </div>
        <p className="text-xs text-text/40 mt-2">Like the Moon — reflects without remembering</p>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleDownloadCard}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-surface/50 hover:bg-surface/30"
        >
          Download agent card (backup)
        </button>
      </div>

      {/* Next Steps Navigation */}
      <div className="pt-4 border-t border-surface/30">
        <NextSteps />
      </div>
    </div>
  );
}
