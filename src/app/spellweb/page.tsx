'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getSpellbookFromStorage, getAllInscribedMarkers } from '@/lib/spellbook-storage';
import { getBakedSpellCards } from '@/lib/grimoire-baked';
import { ALL_SKILL_FILES } from '@/lib/skills-data';
import AppNav from '@/components/AppNav';
import SpellwebViewer from '@/components/spellweb/SpellwebViewer';

export default function SpellwebPage() {
  const [selectedSpellIds, setSelectedSpellIds] = useState<string[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [spellCards, setSpellCards] = useState<ReturnType<typeof getBakedSpellCards>>([]);
  const [inscribedMarkers, setInscribedMarkers] = useState<Record<string, string>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadSpellwebData = useCallback(() => {
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

  useEffect(() => {
    loadSpellwebData();
  }, [loadSpellwebData]);

  useEffect(() => {
    const onFocus = () => loadSpellwebData();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadSpellwebData]);

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-text">Your Spellweb</h1>
          <p className="text-text-muted mt-1">
            Your journey through the grimoires. Light spells, forge connections.
          </p>
          <Link href="/nexus" className="text-accent hover:underline text-sm mt-2 inline-block">
            Explore the full Nexus →
          </Link>
        </div>
        {loadError && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200 mb-4">
            {loadError}
          </div>
        )}
        <div className="rounded-2xl overflow-hidden border border-surface/50 bg-surface/10 min-h-[560px]">
          <SpellwebViewer
            selectedSpellIds={selectedSpellIds}
            selectedSkillIds={selectedSkillIds}
            spellCards={spellCards}
            skillFiles={ALL_SKILL_FILES}
            inscribedMarkers={inscribedMarkers}
            showTerms={true}
          />
        </div>
      </main>
    </div>
  );
}
