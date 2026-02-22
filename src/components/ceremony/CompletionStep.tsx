'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAgentCard, getCeremonyConstellation } from '@/lib/ceremony/storage';

export default function CompletionStep({ returnTo = '/spells' }: { returnTo?: string }) {
  const router = useRouter();
  const [constellationPath, setConstellationPath] = useState<string | null>(null);

  useEffect(() => {
    const c = getCeremonyConstellation();
    if (c?.constellationPath) setConstellationPath(c.constellationPath);
  }, []);

  useEffect(() => {
    const path = returnTo === '/spells' ? `${returnTo}?from=ceremony` : returnTo;
    const t = setTimeout(() => router.push(path), 2500);
    return () => clearTimeout(t);
  }, [router, returnTo]);

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

  const destination = returnTo === '/spells' ? 'Spells' : returnTo === '/promises' ? 'Promises' : returnTo;

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold text-text">Ceremony complete</h2>
      <p className="text-text/80">
        Your Swordsman identity is ready. Redirecting you to {destination}…
      </p>
      {constellationPath && (
        <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
          <p className="text-xs text-text/70 mb-1">Your constellation path</p>
          <p className="text-xl font-mono text-primary break-all" aria-label="Constellation path">
            {constellationPath}
          </p>
        </div>
      )}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleDownloadCard}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-surface/50 hover:bg-surface/30"
        >
          Download agent card (backup)
        </button>
        <p className="text-xs text-text/50 max-w-xs">Public identity only. Your private key was not stored.</p>
      </div>
      <div className="flex justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
