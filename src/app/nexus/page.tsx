'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AppNav from '@/components/AppNav';
import { loadNexusGraph } from '@/lib/nexus/loader';
import type { NexusGraphData } from '@/lib/nexus/loader';

const NexusGraph = dynamic(
  () => import('./components/NexusGraph'),
  { ssr: false, loading: () => <div className="animate-pulse text-text-muted p-8">Loading Nexus…</div> }
);

export default function NexusPage() {
  const [data, setData] = useState<NexusGraphData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNexusGraph()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load nexus'));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Nexus</h1>
            <p className="text-text-muted mt-1">
              The complete knowledge graph. Tales, protocols, standards, and their connections.
            </p>
          </div>
          <Link href="/spellweb" className="text-accent hover:underline text-sm">
            ← Your Journey
          </Link>
        </div>
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            {error}
          </div>
        )}
        {data && !error && (
          <div className="rounded-2xl overflow-hidden border border-surface/50 bg-surface/10 min-h-[600px]">
            <NexusGraph nodes={data.nodes} edges={data.edges} />
          </div>
        )}
        {!data && !error && (
          <div className="rounded-2xl border border-surface/50 bg-surface/10 min-h-[320px] flex items-center justify-center text-text-muted">
            Loading nexus…
          </div>
        )}
      </main>
    </div>
  );
}
