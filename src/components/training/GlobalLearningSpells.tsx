'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import DualOrbs, { type DualOrbsHandle } from '@/components/training/DualOrbs';
import SpellPalette from '@/components/training/SpellPalette';
import OrbControlPanel from '@/components/training/OrbControlPanel';
import { recordSectionVisit, recordOrbConvergence, DEFAULT_SPELLS } from '@/lib/training-progress';
import { buildMergedOrbitingChips, getOrbLoadout, saveOrbLoadout, getMageOrbSpellOptions, getEmojiOptionsForSpellId } from '@/lib/orb-loadout';
import { consumeSpellwebBladeFromUrl } from '@/lib/spellweb-blade-bridge';

const HOME_SECTION_IDS = [
  'hero',
  'thesis',
  'features',
  'spellbooks',
  'your-path',
  'architecture',
  'pools',
] as const;

/**
 * Site-wide dual orbs + spell palette.
 * Bottom panel controls selection - selected spell/blade fires on click.
 * S key cycles swordsman, M key cycles mage.
 */
export default function GlobalLearningSpells() {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState('hero');
  const dualOrbsRef = useRef<DualOrbsHandle>(null);
  const visitedHomeSectionsRef = useRef<Set<string>>(new Set());
  const [orbMode, setOrbMode] = useState<'cursor' | 'hidden' | 'wander'>('cursor');
  const [selectedSwordIdx, setSelectedSwordIdx] = useState(0);
  const [selectedMageIdx, setSelectedMageIdx] = useState(0);
  const [statsCollapsed, setStatsCollapsed] = useState(false);

  const syncInscribed = useCallback(() => {
    dualOrbsRef.current?.syncOrbitingFromInscriptions(buildMergedOrbitingChips());
  }, []);

  useEffect(() => {
    syncInscribed();
  }, [syncInscribed]);

  /** spellweb.ai redirect with ?spellwebBlade= */
  useEffect(() => {
    if (consumeSpellwebBladeFromUrl()) {
      syncInscribed();
    }
  }, [syncInscribed]);

  useEffect(() => {
    const onSync = () => syncInscribed();
    window.addEventListener('agentprivacy:learning-spells-sync', onSync);
    window.addEventListener('agentprivacy:orb-loadout-changed', onSync);
    window.addEventListener('agentprivacy:spellbook-changed', onSync);
    window.addEventListener('agentprivacy:blade-inventory-changed', onSync);
    window.addEventListener('agentprivacy:stance-loadout-changed', onSync);
    return () => {
      window.removeEventListener('agentprivacy:learning-spells-sync', onSync);
      window.removeEventListener('agentprivacy:orb-loadout-changed', onSync);
      window.removeEventListener('agentprivacy:spellbook-changed', onSync);
      window.removeEventListener('agentprivacy:blade-inventory-changed', onSync);
      window.removeEventListener('agentprivacy:stance-loadout-changed', onSync);
    };
  }, [syncInscribed]);

  useEffect(() => {
    if (pathname === '/') {
      setCurrentSection('hero');
    } else {
      const seg = pathname.split('/').filter(Boolean)[0] || 'home';
      setCurrentSection(seg);
      recordSectionVisit(seg);
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname !== '/') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id || 'hero';
            setCurrentSection(sectionId);
            if (!visitedHomeSectionsRef.current.has(sectionId)) {
              visitedHomeSectionsRef.current.add(sectionId);
              recordSectionVisit(sectionId);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    HOME_SECTION_IDS.forEach((id) => {
      const element =
        id === 'hero'
          ? document.querySelector('main section:first-of-type')
          : document.getElementById(id);
      if (element) observer.observe(element);
    });

    if (!visitedHomeSectionsRef.current.has('hero')) {
      visitedHomeSectionsRef.current.add('hero');
      recordSectionVisit('hero');
    }

    return () => observer.disconnect();
  }, [pathname]);

  const handleConvergence = useCallback(() => {
    recordOrbConvergence();
  }, []);

  const handleSpellCast = useCallback(
    (spellId: string, position: { x: number; y: number }) => {
      const spell = DEFAULT_SPELLS.find((s) => s.id === spellId);
      if (spell?.emoji && dualOrbsRef.current) {
        const orbiter = spell.yangYin === 'yang' ? 'swordsman' : 'mage';
        dualOrbsRef.current.addOrbitingSpell(spell.emoji, orbiter);
      }
    },
    []
  );

  const handleModeChange = useCallback((mode: 'cursor' | 'hidden' | 'wander') => {
    setOrbMode(mode);
    // Only set DualOrbs mode for cursor/wander (hidden disables orbs entirely)
    if (mode !== 'hidden') {
      dualOrbsRef.current?.setMode(mode);
    }
  }, []);

  const handleSelectionChange = useCallback((swordIdx: number, mageIdx: number) => {
    setSelectedSwordIdx(swordIdx);
    setSelectedMageIdx(mageIdx);
  }, []);

  // Toggle stance line (yin/yang) when right-clicking swordsman in cursor mode
  const handleStanceLineToggle = useCallback((lineIndex: number) => {
    const loadout = getOrbLoadout();
    const newLines = [...loadout.stanceHexLines] as [0|1, 0|1, 0|1, 0|1, 0|1, 0|1];
    newLines[lineIndex] = newLines[lineIndex] === 0 ? 1 : 0;
    const updated = { ...loadout, stanceHexLines: newLines };
    saveOrbLoadout(updated);
    // Sync the orbiting chips to reflect new stance
    syncInscribed();
  }, [syncInscribed]);

  // Cycle mage spell at selected index (R key)
  const cycleMageSpell = useCallback(() => {
    const spells = getMageOrbSpellOptions();
    if (spells.length === 0) return;

    const loadout = getOrbLoadout();
    const current = loadout.mage[selectedMageIdx];
    const currentIdx = spells.findIndex(s => s.id === current?.spellId);
    const nextIdx = (currentIdx + 1) % spells.length;
    const nextSpell = spells[nextIdx];
    const emojis = getEmojiOptionsForSpellId(nextSpell.id);

    const newMage = [...loadout.mage];
    newMage[selectedMageIdx] = { spellId: nextSpell.id, emoji: emojis[0] || '✨' };

    const updated = { ...loadout, mage: newMage };
    saveOrbLoadout(updated);
    syncInscribed();
  }, [selectedMageIdx, syncInscribed]);

  // S key cycles swordsman selection, M key cycles mage selection, R key rotates spell
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setSelectedSwordIdx(prev => (prev + 1) % 6);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setSelectedMageIdx(prev => (prev + 1) % 6);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        cycleMageSpell();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [cycleMageSpell]);

  return (
    <>
      <DualOrbs
        ref={dualOrbsRef}
        onConvergence={handleConvergence}
        mode={orbMode === 'hidden' ? 'cursor' : orbMode}
        selectedSwordsmanIdx={selectedSwordIdx}
        selectedMageIdx={selectedMageIdx}
        onStanceLineToggle={handleStanceLineToggle}
        enabled={orbMode !== 'hidden'}
        pathname={pathname}
      />
      <SpellPalette onSpellCast={handleSpellCast} currentSection={currentSection} collapsed={statsCollapsed} />
      <OrbControlPanel
        currentMode={orbMode}
        onModeChange={handleModeChange}
        onSelectionChange={handleSelectionChange}
        selectedSwordIdx={selectedSwordIdx}
        selectedMageIdx={selectedMageIdx}
        statsCollapsed={statsCollapsed}
        onStatsCollapseToggle={() => setStatsCollapsed(prev => !prev)}
      />
    </>
  );
}
