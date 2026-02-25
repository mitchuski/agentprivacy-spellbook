'use client';

import { useState, useEffect } from 'react';
import AppNav from '@/components/AppNav';
import { loadSpellwebKG } from '@/lib/spellweb/loader';
import type { SpellwebKGData } from '@/lib/spellweb/loader';
import ForceGraph from './components/ForceGraph';

export default function SpellwebPage() {
  const [data, setData] = useState<SpellwebKGData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSpellwebKG()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load spellweb'));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-text">Spellweb</h1>
          <p className="text-text-muted mt-1">
            Tales, protocols, and standards as a constellation. Same data as SPELLWEB_CODING_AGENT.md.
          </p>
        </div>
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            {error}
          </div>
        )}
        {data && !error && (
          <div className="rounded-2xl overflow-hidden border border-surface/50 bg-surface/10 min-h-[560px]">
            <ForceGraph nodes={data.nodes} edges={data.edges} />
          </div>
        )}
        {!data && !error && (
          <div className="rounded-2xl border border-surface/50 bg-surface/10 min-h-[320px] flex items-center justify-center text-text-muted">
            Loading spellweb…
          </div>
        )}
      </main>
    </div>
  );
}
