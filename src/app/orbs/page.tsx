'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppNav from '@/components/AppNav';
import OrbLoadoutSection from '@/components/OrbLoadoutSection';
import SoulConvergenceCeremony from '@/components/SoulConvergenceCeremony';
import SoulImportSection from '@/components/SoulImportSection';
import {
  getTrainingStats,
  isPathUnlocked,
  PATH_UNLOCK_CRITERIA,
  getActiveHexSpells,
  getBenchedHexSpells,
  swapHexSpell,
} from '@/lib/training-progress';

/**
 * Orbs — training progress, extension gate, and dual-orb stance / ring loadout in one place.
 */

export default function OrbsPage() {
  const [stats, setStats] = useState(getTrainingStats());
  const [unlocked, setUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(getTrainingStats());
    setUnlocked(isPathUnlocked());

    const interval = setInterval(() => {
      setStats(getTrainingStats());
      setUnlocked(isPathUnlocked());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">⚔️ Soulbis & Soulbae 🧙</h1>
            <p className="text-base text-text-muted max-w-xl mx-auto">
              Configure your dual orb loadout. <span className="text-amber-400">Swordsman</span> holds 6 blades for stance combat. <span className="text-violet-400">Mage</span> holds 6 spells for casting.
            </p>
          </motion.div>

          {/* 1. Soul Ritual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.02 }}
            className="max-w-3xl mx-auto mb-10"
          >
            <SoulConvergenceCeremony />
          </motion.div>

          {/* 2. MyTerms Sticker Spells - Universal Hex Actions */}
          <HexStickerSpells />

          {/* 3. Controls Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="max-w-3xl mx-auto mb-10"
          >
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-surface/30 bg-surface/5">
              <div className="text-center">
                <div className="text-2xl mb-2">⚔️</div>
                <div className="text-xs text-text-muted space-y-1">
                  <p><kbd className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">S</kbd> cycle blade</p>
                  <p><span className="text-amber-400">right-click</span> toggle stance</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🧙</div>
                <div className="text-xs text-text-muted space-y-1">
                  <p><kbd className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px]">M</kbd> cycle spell</p>
                  <p><span className="text-violet-400">left-click</span> cast spell</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4. Training Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="max-w-3xl mx-auto card mb-10"
          >
            <h2 className="text-lg font-semibold text-text mb-4">Training Progress</h2>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-text-muted mb-2">
                <span>Overall</span>
                <span>{stats.progress}%</span>
              </div>
              <div className="h-2 bg-surface rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    unlocked ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-gradient-to-r from-primary to-secondary'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <RequirementCard
                label="Sections"
                current={stats.sectionsVisited}
                required={PATH_UNLOCK_CRITERIA.minSectionsVisited}
                icon="📖"
              />
              <RequirementCard
                label="Spells"
                current={stats.spellsCast}
                required={PATH_UNLOCK_CRITERIA.minSpellsCast}
                icon="✨"
              />
              <RequirementCard
                label="Converge"
                current={stats.convergences}
                required={PATH_UNLOCK_CRITERIA.minConvergences}
                icon="⊥"
              />
            </div>
          </motion.div>

          {/* 5. Your Arsenal - Blades & Spells */}
          <OrbLoadoutSection />

          {/* 6. Extensions (only if unlocked) */}
          {unlocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="max-w-3xl mx-auto mb-10"
            >
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">🎉</div>
                <h2 className="text-xl font-semibold text-emerald-400 mb-2">Blade formed — orbs unlocked</h2>
                <p className="text-text-muted">Extensions below; your loadout above stays in sync with training.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExtensionCard
                  name="Swordsman"
                  emoji="⚔️"
                  color="#534AB7"
                  description="Assert MyTerms, slash cookies, guard your privacy boundaries across the web."
                  features={[
                    'Spring-physics orb follows cursor',
                    'MyTerms assertion on every site',
                    'Spell casting from your repertoire',
                    'Constellation building',
                  ]}
                  downloadReady={false}
                  downloadUrl="/extensions/myswordsman-v1.0.0.zip"
                  installInstructions="Load unpacked extension in Chrome DevTools"
                />

                <ExtensionCard
                  name="Mage"
                  emoji="🧙"
                  color="#1D9E75"
                  description="Deep page scanning, hexagram calculations, Drake emergence. Requires Swordsman."
                  features={[
                    'Autonomous orb movement',
                    'Tracker categorization',
                    'Dark pattern detection',
                    'Drake summoning',
                  ]}
                  downloadReady={false}
                  requiresSwordsman={true}
                  downloadUrl="/extensions/mymage-v1.0.0.zip"
                  installInstructions="Install after Swordsman has 50+ VRC score"
                />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-8 p-4 bg-surface/50 rounded-lg border border-surface text-center"
              >
                <p className="text-sm text-text-muted mb-2">Your learned spells will sync to the extensions automatically</p>
                <p className="text-xs text-text-muted/60 font-mono">{stats.spellsLearned} spells ready to transfer</p>
              </motion.div>
            </motion.div>
          )}

          {/* 7. Soul.md Import Section - at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="max-w-3xl mx-auto card mb-10"
          >
            <SoulImportSection />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center text-sm text-text-muted italic mt-12"
          >
            &quot;The blade goes first. Always.&quot;
          </motion.p>
        </div>
      </main>
    </div>
  );
}

function RequirementCard({
  label,
  current,
  required,
  icon,
}: {
  label: string;
  current: number;
  required: number;
  icon: string;
}) {
  const completed = current >= required;

  return (
    <div
      className={`p-3 rounded-lg border text-center ${
        completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-surface/30 border-surface'
      }`}
    >
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <span className="text-base">{icon}</span>
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <div className="flex items-baseline justify-center gap-1">
        <span className={`text-xl font-bold ${completed ? 'text-emerald-400' : 'text-text'}`}>{current}</span>
        <span className="text-text-muted text-sm">/ {required}</span>
        {completed && <span className="text-emerald-400 ml-1">✓</span>}
      </div>
    </div>
  );
}

function ExtensionCard({
  name,
  emoji,
  color,
  description,
  features,
  downloadReady,
  downloadUrl,
  installInstructions,
  requiresSwordsman,
}: {
  name: string;
  emoji: string;
  color: string;
  description: string;
  features: string[];
  downloadReady: boolean;
  downloadUrl: string;
  installInstructions: string;
  requiresSwordsman?: boolean;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (!downloadReady) return;
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div className="card" style={{ borderLeftColor: color, borderLeftWidth: 4 }}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h3 className="text-lg font-semibold text-text">{name}</h3>
          {requiresSwordsman && (
            <span className="text-xs text-amber-400 font-mono">Requires Swordsman</span>
          )}
        </div>
      </div>

      <p className="text-sm text-text-muted mb-4">{description}</p>

      <ul className="space-y-1 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="text-xs text-text-muted flex items-center gap-2">
            <span className="text-primary">•</span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={handleDownload}
        disabled={!downloadReady}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
          downloadReady ? 'bg-primary text-white hover:bg-primary/80' : 'bg-surface text-text-muted cursor-not-allowed'
        }`}
      >
        {downloading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Downloading...
          </span>
        ) : downloadReady ? (
          '⬇️ Download Extension'
        ) : (
          '🔒 Coming Soon'
        )}
      </button>

      {downloadReady && (
        <p className="text-[10px] text-text-muted/60 text-center mt-2 font-mono">{installInstructions}</p>
      )}
    </div>
  );
}

function HexStickerSpells() {
  const [activeSpells, setActiveSpells] = useState(getActiveHexSpells());
  const [benchedSpells, setBenchedSpells] = useState(getBenchedHexSpells());
  const [swapFrom, setSwapFrom] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      setActiveSpells(getActiveHexSpells());
      setBenchedSpells(getBenchedHexSpells());
    };
    window.addEventListener('agentprivacy:hex-spells-changed', refresh);
    return () => window.removeEventListener('agentprivacy:hex-spells-changed', refresh);
  }, []);

  const handleSwap = (benchedId: string) => {
    if (!swapFrom) return;
    swapHexSpell(swapFrom, benchedId);
    setSwapFrom(null);
    setActiveSpells(getActiveHexSpells());
    setBenchedSpells(getBenchedHexSpells());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 }}
      className="max-w-3xl mx-auto mb-10"
    >
      <div className="p-5 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <span>⬡</span>
            MyTerms Sticker Spells
          </h3>
          <span className="text-[10px] text-text-muted">8 total · 6 active · both orbs</span>
        </div>

        <p className="text-xs text-text-muted mb-4">
          These are the <strong className="text-cyan-200">default myterms spells</strong> —
          universal privacy actions for both Swordsman and Mage.
          <em className="text-text-muted/70 block mt-1">
            Separate from blade facets and mage spellbook. Tap active to swap.
          </em>
        </p>

        {/* Active Hex (6) */}
        <div className="mb-4">
          <p className="text-[10px] text-text-muted mb-2">Active in Hex (6)</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {activeSpells.map((spell) => (
              <button
                key={spell.id}
                type="button"
                onClick={() => setSwapFrom(swapFrom === spell.id ? null : spell.id)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  swapFrom === spell.id
                    ? 'ring-2 ring-cyan-400 border-cyan-400/50 bg-cyan-500/20'
                    : spell.yangYin === 'yang'
                      ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20'
                      : 'border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20'
                }`}
              >
                <span className="text-xl block mb-1">{spell.emoji}</span>
                <p className="text-[8px] text-text-muted font-mono truncate">
                  {spell.myTermsMapping?.replace(/_/g, ' ') || spell.id}
                </p>
                <span className={`text-[7px] ${spell.yangYin === 'yang' ? 'text-amber-400' : 'text-violet-400'}`}>
                  {spell.yangYin}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Benched (2) */}
        <div>
          <p className="text-[10px] text-text-muted mb-2">
            Benched (2) {swapFrom && <span className="text-cyan-400 ml-1">— tap to swap in</span>}
          </p>
          <div className="grid grid-cols-2 gap-2 max-w-xs">
            {benchedSpells.map((spell) => (
              <button
                key={spell.id}
                type="button"
                onClick={() => swapFrom && handleSwap(spell.id)}
                disabled={!swapFrom}
                className={`p-2 rounded-lg border text-center transition-all ${
                  swapFrom
                    ? 'border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 cursor-pointer'
                    : 'border-surface/40 bg-surface/20 opacity-60 cursor-not-allowed'
                } ${spell.yangYin === 'yang' ? 'border-l-amber-500/50' : 'border-l-violet-500/50'}`}
                style={{ borderLeftWidth: 3 }}
              >
                <span className="text-lg block mb-1">{spell.emoji}</span>
                <p className="text-[8px] text-text-muted font-mono truncate">
                  {spell.myTermsMapping?.replace(/_/g, ' ') || spell.id}
                </p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-text-muted/60 mt-3 text-center">
          Yang = outward assertion · Yin = inward concealment
        </p>
      </div>
    </motion.div>
  );
}
