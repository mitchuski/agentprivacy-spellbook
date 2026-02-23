'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSpellbookFromStorage, getAllInscribedMarkers } from '@/lib/spellbook-storage';
import { getBakedSpellCards } from '@/lib/grimoire-baked';
import { ALL_SKILL_FILES } from '@/lib/skills-data';
import AppNav from '@/components/AppNav';
import SpellwebViewer from '@/components/spellweb/SpellwebViewer';

export default function WebPage() {
  const [selectedSpellIds, setSelectedSpellIds] = useState<string[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [spellCards, setSpellCards] = useState<ReturnType<typeof getBakedSpellCards>>([]);
  const [inscribedMarkers, setInscribedMarkers] = useState<Record<string, string>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const { spellIds, skillIds } = getSpellbookFromStorage();
      setSelectedSpellIds(spellIds);
      setSelectedSkillIds(skillIds);
      setSpellCards(getBakedSpellCards());
      setInscribedMarkers(getAllInscribedMarkers());
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load spellweb data');
    }
  }, []);

  const selectionCount = selectedSpellIds.length + selectedSkillIds.length;

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text">Web</h1>
          <p className="text-text-muted mt-1">
            Your spell graph as a constellation. Same selection as on Spells—expand to fullscreen.
          </p>
        </div>
        {loadError ? (
          <div className="rounded-2xl border border-surface/50 bg-surface/10 min-h-[320px] flex flex-col items-center justify-center text-center px-6">
            <p className="text-text-muted mb-4">Something went wrong loading the spellweb.</p>
            <p className="text-text/80 mb-6 font-mono text-sm">{loadError}</p>
            <Link
              href="/spells"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Go to Spells
            </Link>
          </div>
        ) : selectionCount > 0 ? (
          <div className="rounded-2xl overflow-hidden border border-surface/50 bg-surface/10 min-h-[480px]">
            <SpellwebViewer
              selectedSpellIds={selectedSpellIds}
              selectedSkillIds={selectedSkillIds}
              spellCards={spellCards}
              skillFiles={ALL_SKILL_FILES}
              inscribedMarkers={inscribedMarkers}
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-surface/50 bg-surface/10 min-h-[320px] flex flex-col items-center justify-center text-center px-6">
            <p className="text-text-muted mb-4">No spells or skills in your graph yet.</p>
            <p className="text-text/80 mb-6">Add spells and skills on the Spells page to build your spellweb.</p>
            <Link
              href="/spells"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Go to Spells
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
