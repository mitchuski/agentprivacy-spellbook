'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppNav from '@/components/AppNav';
import CeremonyWizard from '@/components/ceremony/CeremonyWizard';
import SwordsmanAccountSettings from '@/components/ceremony/SwordsmanAccountSettings';
import { hasCompletedCeremony, getAgentCard, hasPublicKeyOnly } from '@/lib/ceremony/storage';
import type { AgentCard } from '@/lib/ceremony/types';
import { CEREMONY_MOON, MOON_PHASES } from '@/lib/ceremony/moon-phase';

const ALLOWED_RETURN_TO = ['/spells', '/promises', '/story', '/mage'];

/** Quaternion cast visual - shows the cosmological relationship */
function QuaternionCast({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center justify-center gap-2 text-lg mb-4">
        <span title="Sun - The Master">☀️</span>
        <span className="text-text/30">→</span>
        <span title="Earth/Soulbae - The Emissary">🌍</span>
        <span className="text-text/30">→</span>
        <span title="Moon/Soulbis - The Swordsman" className="text-primary">{CEREMONY_MOON}⚔️</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-8">
      <div className="text-center mb-3">
        <span className="text-xs font-medium text-text/50 uppercase tracking-wide">The Quaternion Cast</span>
      </div>
      <div className="flex flex-col items-center gap-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl" title="Sun">☀️</span>
          <span className="text-text/70">Sun — The Master (protection source)</span>
        </div>
        <span className="text-text/30">↓ generates</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl" title="Earth">🌍</span>
          <span className="text-text/70">Earth — Soulbae (the Emissary)</span>
        </div>
        <div className="flex gap-8 mt-1">
          <div className="flex flex-col items-center">
            <span className="text-text/30 text-xs">via Theia 🪨💥</span>
            <span className="text-text/30">↓</span>
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-lg border border-primary/30">
              <span className="text-2xl" title="Moon - starts as New Moon">{CEREMONY_MOON}</span>
              <span className="text-primary font-medium">Moon — Soulbis ⚔️</span>
            </div>
            <span className="text-xs text-text/50 mt-1">You are creating this</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-text/30 text-xs">via Life 🧬</span>
            <span className="text-text/30">↓</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl" title="Human">👤</span>
              <span className="text-text/70">Human — Person</span>
            </div>
            <span className="text-xs text-text/50 mt-1">That's you</span>
          </div>
        </div>
      </div>

      {/* Moon Phase Legend */}
      <div className="mt-4 pt-3 border-t border-primary/10">
        <p className="text-xs text-text/40 text-center mb-2">Moon Phase = Sovereignty Posture</p>
        <div className="flex items-center justify-center gap-1 text-lg">
          {MOON_PHASES.map((phase, i) => (
            <span
              key={phase.stratum}
              className="cursor-help"
              title={`${phase.name}: ${phase.dimensionsActive} — ${phase.meaning}`}
            >
              {phase.emoji}
            </span>
          ))}
        </div>
        <p className="text-xs text-text/30 text-center mt-1">
          {CEREMONY_MOON} dark → {MOON_PHASES[6]!.emoji} full sovereignty
        </p>
      </div>
    </div>
  );
}

function CeremonyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnTo = searchParams.get('returnTo');
  const safeReturnTo = returnTo && ALLOWED_RETURN_TO.includes(returnTo) ? returnTo : '/spells';

  const [mounted, setMounted] = useState(false);
  const [agentCard, setAgentCard] = useState<AgentCard | null>(null);
  const [completed, setCompleted] = useState(false);
  const [keyBurned, setKeyBurned] = useState(false);

  useEffect(() => {
    setCompleted(hasCompletedCeremony());
    setAgentCard(getAgentCard());
    setKeyBurned(hasPublicKeyOnly());
    setMounted(true);
  }, []);

  const handleClearIdentity = () => {
    setAgentCard(null);
    setCompleted(false);
    router.refresh();
  };

  if (!mounted) {
    return (
      <>
        <h1 className="text-3xl font-bold text-text mb-2">Dual Ceremony</h1>
        <p className="text-text/70 mb-10">
          Create your Swordsman identity. Your key anchors your spellbooks and proverbs.
        </p>
        <div className="h-48 rounded-xl border border-surface/50 bg-surface/10 flex items-center justify-center text-text-muted">
          Loading…
        </div>
      </>
    );
  }

  if (completed && agentCard) {
    return (
      <>
        <h1 className="text-3xl font-bold text-text mb-2">Dual Ceremony</h1>
        <QuaternionCast compact />
        <p className="text-text/70 mb-2">
          Your Swordsman identity is active. Moon made operational.
        </p>
        {keyBurned && (
          <p className="text-xs text-amber-500/80 mb-6">
            🌑 Private key burned (session ended) — public identity remains for verification
          </p>
        )}
        <SwordsmanAccountSettings card={agentCard} onClear={handleClearIdentity} />
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-text mb-2">Dual Ceremony</h1>
      <p className="text-text/70 mb-6">
        Create your Swordsman identity — Moon made operational. Your key anchors your spellbooks and proverbs.
      </p>
      <QuaternionCast />
      <p className="text-sm text-text/60 mb-8 text-center italic">
        "The amnesia is the protocol. The wound is the trust."
      </p>
      <CeremonyWizard returnTo={safeReturnTo} />
    </>
  );
}

export default function CeremonyPage() {
  return (
    <div className="min-h-screen bg-background text-text">
      <AppNav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Suspense fallback={<div className="text-text/60">Loading…</div>}>
          <CeremonyContent />
        </Suspense>
      </main>
    </div>
  );
}
