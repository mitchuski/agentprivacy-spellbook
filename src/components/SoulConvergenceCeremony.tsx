'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  checkConvergenceReady,
  getConvergenceProgress,
  getConvergenceState,
  startCeremony,
  advanceCeremonyPhase,
  updateCeremonyElapsed,
  interruptCeremony,
  resetCeremony,
  generateSoulFile,
  generateSoulMarkdown,
  downloadSoulMarkdown,
  getSoulExportHistory,
  CONVERGENCE_TIERS,
  type CeremonyState,
  type CeremonyPhase,
  type ConvergenceType,
  type SoulFile,
} from '@/lib/soul-convergence';
import { getBladeInventory, getStanceBladeLoadout } from '@/lib/spellweb-blade-bridge';
import { getOrbLoadout } from '@/lib/orb-loadout';

// ============================================
// CEREMONY MINIGAME COMPONENT
// ============================================

const TRACKING_RADIUS = 180; // Must keep cursor within this distance
const CAST_COOLDOWN = 800; // ms between spell casts
const WANDER_SPEED = 0.4; // How fast the window drifts
const REQUIRED_CASTS = 6; // Minimum spells to cast

type CastRecord = {
  emoji: string;
  x: number;
  y: number;
  timestamp: number;
};

function CeremonyOverlay({
  state,
  onComplete,
  onInterrupt,
}: {
  state: CeremonyState;
  onComplete: (soul: SoulFile, casts: CastRecord[]) => void;
  onInterrupt: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [activeTime, setActiveTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<CeremonyPhase>(state.phase);
  const [windowPos, setWindowPos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTracking, setIsTracking] = useState(false);
  const [casts, setCasts] = useState<CastRecord[]>([]);
  const [lastCastTime, setLastCastTime] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string; vx: number; vy: number }[]>([]);

  const startTimeRef = useRef<number>(Date.now());
  const animRef = useRef<number | null>(null);
  const wanderAngleRef = useRef(Math.random() * Math.PI * 2);
  const particleIdRef = useRef(0);
  const accumulatedActiveRef = useRef(0); // Persist across re-renders

  // Get constellation nodes
  const inventory = getBladeInventory();
  const bladeLoadout = getStanceBladeLoadout();
  const orbLoadout = getOrbLoadout();

  const bladeEmojis = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].map((line) => {
    const bladeId = bladeLoadout[line as keyof typeof bladeLoadout];
    const blade = bladeId ? inventory.find((b) => b.id === bladeId) : null;
    return blade?.primaryEmoji || '⚔️';
  });

  const spellEmojis = orbLoadout.mage.map((s) => s.emoji || '✨').slice(0, 6);
  while (spellEmojis.length < 6) spellEmojis.push('✨');

  // Initialize window position
  useEffect(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setWindowPos({ x: centerX, y: centerY });
    setMousePos({ x: centerX, y: centerY });

    // ESC to cancel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onInterrupt();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInterrupt]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main animation loop
  useEffect(() => {
    startTimeRef.current = Date.now();
    let lastTs = performance.now();
    // accumulatedActiveRef persists across re-renders, so the timer continues

    const animate = (ts: number) => {
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(elapsedSec);

      // Calculate distance from cursor to window
      const dist = Math.hypot(mousePos.x - windowPos.x, mousePos.y - windowPos.y);
      const tracking = dist < TRACKING_RADIUS;
      setIsTracking(tracking);

      // Only accumulate active time when tracking
      if (tracking && currentPhase !== 'complete') {
        accumulatedActiveRef.current += dt;
        setActiveTime(Math.floor(accumulatedActiveRef.current));
      }

      // Wander the window around
      if (currentPhase !== 'complete') {
        wanderAngleRef.current += (Math.random() - 0.5) * 0.1;
        const speed = tracking ? WANDER_SPEED : WANDER_SPEED * 2; // Moves faster when not tracking

        setWindowPos((prev) => {
          let newX = prev.x + Math.cos(wanderAngleRef.current) * speed * dt * 60;
          let newY = prev.y + Math.sin(wanderAngleRef.current) * speed * dt * 60;

          // Bounce off edges with padding
          const pad = 200;
          if (newX < pad || newX > window.innerWidth - pad) {
            wanderAngleRef.current = Math.PI - wanderAngleRef.current;
            newX = Math.max(pad, Math.min(window.innerWidth - pad, newX));
          }
          if (newY < pad || newY > window.innerHeight - pad) {
            wanderAngleRef.current = -wanderAngleRef.current;
            newY = Math.max(pad, Math.min(window.innerHeight - pad, newY));
          }

          return { x: newX, y: newY };
        });
      }

      // Update particles
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt * 60,
            y: p.y + p.vy * dt * 60,
            vy: p.vy + 0.02, // gravity
          }))
          .filter((p) => p.y < window.innerHeight + 50)
      );

      // Phase progression based on active time
      const accActive = accumulatedActiveRef.current;
      let phase: CeremonyPhase = 'initiation';
      if (accActive >= 3) phase = 'activation';
      if (accActive >= 8) phase = 'observation';
      if (accActive >= state.required - 7) phase = 'convergence';
      if (accActive >= state.required - 3) phase = 'crystallization';

      if (phase !== currentPhase) {
        setCurrentPhase(phase);
      }

      // Check completion
      if (accActive >= state.required && casts.length >= REQUIRED_CASTS) {
        setCurrentPhase('complete');
        const soul = generateSoulFile(Math.floor(accActive));
        if (soul) {
          onComplete(soul, casts);
        }
        return; // Stop animation
      }

      updateCeremonyElapsed(Math.floor(accActive));
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [state.required, onComplete, mousePos, windowPos, currentPhase, casts]);

  // Handle spell cast click
  const handleCast = useCallback((emoji: string, clientX: number, clientY: number) => {
    const now = Date.now();
    if (now - lastCastTime < CAST_COOLDOWN) return;
    if (!isTracking) return;

    setLastCastTime(now);
    setCasts((prev) => [...prev, { emoji, x: clientX, y: clientY, timestamp: now }]);

    // Emit particles
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      setParticles((prev) => [
        ...prev,
        {
          id: particleIdRef.current++,
          x: clientX,
          y: clientY,
          emoji,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3 - 2,
        },
      ]);
    }
  }, [lastCastTime, isTracking]);

  const progress = Math.min(100, (activeTime / state.required) * 100);
  const castProgress = Math.min(100, (casts.length / REQUIRED_CASTS) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-background/95 backdrop-blur-md cursor-crosshair overflow-hidden"
    >
      {/* Tracking radius indicator */}
      <div
        className={`fixed rounded-full border-2 transition-colors duration-300 pointer-events-none ${
          isTracking ? 'border-emerald-500/30' : 'border-red-500/50'
        }`}
        style={{
          left: windowPos.x - TRACKING_RADIUS,
          top: windowPos.y - TRACKING_RADIUS,
          width: TRACKING_RADIUS * 2,
          height: TRACKING_RADIUS * 2,
        }}
      />

      {/* Wandering ceremony window */}
      <motion.div
        className="fixed"
        style={{
          left: windowPos.x,
          top: windowPos.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className={`relative transition-all duration-300 ${isTracking ? 'scale-100' : 'scale-90 opacity-70'}`}>
          {/* Phase indicator */}
          <div className="text-center mb-4">
            <h2 className={`text-xl font-bold transition-colors ${isTracking ? 'text-text' : 'text-red-400'}`}>
              {!isTracking && 'Track the ritual!'}
              {isTracking && currentPhase === 'initiation' && 'Convergence Detected'}
              {isTracking && currentPhase === 'activation' && 'Click spells to cast!'}
              {isTracking && currentPhase === 'observation' && 'Keep casting...'}
              {isTracking && currentPhase === 'convergence' && 'Almost there!'}
              {isTracking && currentPhase === 'crystallization' && 'Crystallizing...'}
            </h2>
            <p className="text-text-muted text-xs mt-1">
              {!isTracking && 'Move cursor closer to continue'}
              {isTracking && casts.length < REQUIRED_CASTS && `Cast ${REQUIRED_CASTS - casts.length} more spells`}
              {isTracking && casts.length >= REQUIRED_CASTS && 'Hold steady...'}
            </p>
          </div>

          {/* Constellation - clickable emojis */}
          <div className="relative w-64 h-64 mx-auto">
            {/* Outer ring - blades */}
            {bladeEmojis.map((emoji, i) => {
              const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const radius = 100;
              const x = Math.cos(angle) * radius + 128 - 20;
              const y = Math.sin(angle) * radius + 128 - 20;

              return (
                <button
                  key={`blade-${i}`}
                  onClick={(e) => handleCast(emoji, e.clientX, e.clientY)}
                  disabled={!isTracking}
                  className={`absolute w-10 h-10 flex items-center justify-center text-2xl rounded-full transition-all
                    ${isTracking ? 'hover:scale-125 hover:bg-amber-500/20 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                  `}
                  style={{
                    left: x,
                    top: y,
                    filter: isTracking ? 'drop-shadow(0 0 8px rgba(239, 159, 39, 0.6))' : 'none',
                  }}
                >
                  {emoji}
                </button>
              );
            })}

            {/* Inner ring - spells */}
            {spellEmojis.map((emoji, i) => {
              const angle = (i / 6) * Math.PI * 2 - Math.PI / 2 + Math.PI / 6;
              const radius = 50;
              const x = Math.cos(angle) * radius + 128 - 16;
              const y = Math.sin(angle) * radius + 128 - 16;

              return (
                <button
                  key={`spell-${i}`}
                  onClick={(e) => handleCast(emoji, e.clientX, e.clientY)}
                  disabled={!isTracking}
                  className={`absolute w-8 h-8 flex items-center justify-center text-xl rounded-full transition-all
                    ${isTracking ? 'hover:scale-125 hover:bg-violet-500/20 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                  `}
                  style={{
                    left: x,
                    top: y,
                    filter: isTracking ? 'drop-shadow(0 0 6px rgba(147, 112, 219, 0.6))' : 'none',
                  }}
                >
                  {emoji}
                </button>
              );
            })}

            {/* Center symbol */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl pointer-events-none"
              style={{
                filter: currentPhase === 'convergence' ? 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))' : 'none',
              }}
            >
              {currentPhase === 'crystallization' ? '💎' : '⊥'}
            </div>
          </div>

          {/* Progress bars */}
          <div className="mt-4 space-y-2 w-64 mx-auto">
            <div>
              <div className="flex justify-between text-[10px] text-text-muted mb-1">
                <span>Time {isTracking ? '▶' : '⏸'}</span>
                <span>{activeTime}s / {state.required}s</span>
              </div>
              <div className="h-2 bg-surface rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${isTracking ? 'bg-gradient-to-r from-amber-500 to-violet-500' : 'bg-red-500/50'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-text-muted mb-1">
                <span>Casts</span>
                <span>{casts.length} / {REQUIRED_CASTS}</span>
              </div>
              <div className="h-2 bg-surface rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  style={{ width: `${castProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed text-xl pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            transform: 'translate(-50%, -50%)',
            opacity: Math.max(0, 1 - p.y / window.innerHeight),
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Cancel button */}
      <button
        onClick={onInterrupt}
        className="fixed top-4 right-4 px-4 py-2 rounded-lg bg-surface/50 text-text-muted text-sm hover:bg-surface"
      >
        Cancel (ESC)
      </button>

      {/* Cast history trail */}
      <div className="fixed bottom-4 left-4 flex gap-1">
        {casts.slice(-12).map((c, i) => (
          <span key={i} className="text-lg opacity-60">{c.emoji}</span>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function SoulConvergenceCeremony() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(getConvergenceProgress());
  const [ceremonyState, setCeremonyState] = useState<CeremonyState | null>(null);
  const [completedSoul, setCompletedSoul] = useState<SoulFile | null>(null);
  const [ceremonyCasts, setCeremonyCasts] = useState<CastRecord[]>([]);
  const [exportHistory, setExportHistory] = useState(getSoulExportHistory());
  const [soulName, setSoulName] = useState('');
  const [showNaming, setShowNaming] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(getConvergenceProgress());
    setExportHistory(getSoulExportHistory());

    // Listen for changes
    const handleChange = () => {
      setProgress(getConvergenceProgress());
    };

    window.addEventListener('agentprivacy:blade-inventory-changed', handleChange);
    window.addEventListener('agentprivacy:orb-loadout-changed', handleChange);
    window.addEventListener('agentprivacy:spellbook-changed', handleChange);

    return () => {
      window.removeEventListener('agentprivacy:blade-inventory-changed', handleChange);
      window.removeEventListener('agentprivacy:orb-loadout-changed', handleChange);
      window.removeEventListener('agentprivacy:spellbook-changed', handleChange);
    };
  }, []);

  const handleStartCeremony = useCallback(() => {
    const state = startCeremony();
    if (state) {
      setCeremonyState(state);
    }
  }, []);

  const handleCeremonyComplete = useCallback((soul: SoulFile, casts: CastRecord[]) => {
    setCompletedSoul(soul);
    setCeremonyCasts(casts);
    setCeremonyState(null);
    resetCeremony();
    // Default name from persona
    setSoulName(soul.identity.personaName || 'mysoul');
    setShowNaming(true);
  }, []);

  const handleCeremonyInterrupt = useCallback(() => {
    interruptCeremony();
    setCeremonyState(null);
  }, []);

  const handleDownload = useCallback(() => {
    if (completedSoul) {
      const castEmojis = ceremonyCasts.map(c => c.emoji);
      downloadSoulMarkdown(completedSoul, soulName || 'mysoul', castEmojis);
      setExportHistory(getSoulExportHistory());
      setShowNaming(false);
      setCompletedSoul(null);
    }
  }, [completedSoul, soulName, ceremonyCasts]);

  const handleDismiss = useCallback(() => {
    setCompletedSoul(null);
    setShowNaming(false);
  }, []);

  if (!mounted) {
    return (
      <div className="p-5 rounded-xl border border-surface/50 bg-surface/5">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  const convergenceReady = progress.convergenceReady;
  const tier = convergenceReady ? CONVERGENCE_TIERS[convergenceReady] : null;

  return (
    <>
      <section className="p-5 rounded-xl border border-surface/50 bg-surface/5">
        <h2 className="text-lg font-semibold text-text mb-2 flex items-center gap-2">
          <span>💎</span>
          Soul Ritual
        </h2>
        <p className="text-sm text-text/70 mb-4">
          Complete your blade ring (7 blades: 6 equipped + 1 swap), spell orbit (8 spells: 6 equipped + 2 in pool), or fill the experience bar to unlock the convergence ceremony.
          The ceremony witnesses your journey and crystallizes it into a portable <code className="text-primary">.soul</code> file.
        </p>

        {/* Progress indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ProgressCard
            label="Blade Ring"
            icon="⚔️"
            current={progress.bladesCount}
            required={progress.bladesRequired}
            complete={progress.bladesComplete}
            description={`${progress.bladesEquipped}/6 equipped, 7 total needed`}
          />
          <ProgressCard
            label="Spell Orbit"
            icon="🧙"
            current={progress.spellsCount}
            required={progress.spellsRequired}
            complete={progress.spellsComplete}
            description={`${progress.spellsEquipped}/6 equipped, 8 total needed`}
          />
          <ProgressCard
            label="Experience"
            icon="✨"
            current={progress.experiencePercent}
            required={100}
            complete={progress.experienceComplete}
            isPercent
            description="Training progress"
          />
        </div>

        {/* Convergence status */}
        {convergenceReady && tier ? (
          <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 via-violet-500/10 to-emerald-500/10 border border-amber-500/30 mb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-amber-400">{tier.label} Ready</h3>
                <p className="text-sm text-text-muted">{tier.description}</p>
                <p className="text-xs text-text-muted/70 mt-1">
                  Requires {tier.requiredObservation}s observation
                </p>
              </div>
              <button
                onClick={handleStartCeremony}
                className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-amber-500 to-violet-500 text-white hover:from-amber-600 hover:to-violet-600 shadow-lg shadow-amber-500/20"
              >
                Begin Ceremony
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-surface/30 border border-surface/50 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl opacity-50">🔒</span>
              <div>
                <h3 className="font-semibold text-text/70">Convergence Not Ready</h3>
                <p className="text-sm text-text-muted">
                  {!progress.bladesComplete && `Need ${Math.max(0, progress.bladesRequired - progress.bladesCount)} more blades (${progress.bladesCount}/7). `}
                  {!progress.spellsComplete && `Need ${Math.max(0, progress.spellsRequired - progress.spellsCount)} more spells (${progress.spellsCount}/8). `}
                  {!progress.experienceComplete && `Experience at ${progress.experiencePercent}%.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Export history */}
        {exportHistory.length > 0 && (
          <div className="mt-4 pt-4 border-t border-surface/30">
            <h4 className="text-sm font-medium text-text-muted mb-2">Previous Exports</h4>
            <div className="flex flex-wrap gap-2">
              {exportHistory.map((exp) => (
                <div
                  key={exp.signature}
                  className="px-3 py-1.5 rounded-lg bg-surface/30 text-xs text-text-muted font-mono"
                  title={`Exported ${new Date(exp.timestamp).toLocaleString()}`}
                >
                  {exp.signature}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Ceremony overlay */}
      <AnimatePresence>
        {ceremonyState && ceremonyState.phase !== 'idle' && (
          <CeremonyOverlay
            state={ceremonyState}
            onComplete={handleCeremonyComplete}
            onInterrupt={handleCeremonyInterrupt}
          />
        )}
      </AnimatePresence>

      {/* Naming and download modal */}
      <AnimatePresence>
        {showNaming && completedSoul && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-background/90 backdrop-blur-sm flex items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleDismiss();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full mx-4 p-6 rounded-xl bg-surface border border-primary/30 shadow-xl"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">💎</div>
                <h2 className="text-2xl font-bold text-text mb-2">Soul Crystallized</h2>
                <p className="text-text-muted">
                  Name your soul and download the ceremony record.
                </p>
              </div>

              {/* Soul naming input */}
              <div className="mb-6">
                <label className="block text-sm text-text-muted mb-2">Soul name</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={soulName}
                    onChange={(e) => setSoulName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                    placeholder="mysoul"
                    className="flex-1 px-4 py-3 rounded-lg bg-background border border-surface/50 text-text font-mono focus:outline-none focus:border-primary"
                    maxLength={32}
                  />
                  <span className="text-text-muted">.soul.md</span>
                </div>
              </div>

              {/* Ceremony stats */}
              <div className="space-y-2 mb-6 p-4 rounded-lg bg-background/50">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Convergence</span>
                  <span className="text-amber-400">{CONVERGENCE_TIERS[completedSoul.convergenceType].label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Signature</span>
                  <span className="text-primary font-mono text-xs">{completedSoul.proof.signature}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Ceremony casts</span>
                  <span className="text-text">{ceremonyCasts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Blades</span>
                  <span className="text-text">
                    {Object.values(completedSoul.swordsman.bladeRing).filter(Boolean).length}/7
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Spells</span>
                  <span className="text-text">{completedSoul.mage.totalSpells}</span>
                </div>
                {/* Ceremony cast trail */}
                {ceremonyCasts.length > 0 && (
                  <div className="pt-2 border-t border-surface/30">
                    <span className="text-xs text-text-muted">Cast trail: </span>
                    <span className="text-sm">{ceremonyCasts.map(c => c.emoji).join(' ')}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  disabled={!soulName.trim()}
                  className="flex-1 px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-amber-500 to-violet-500 text-white hover:from-amber-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download {soulName || 'mysoul'}.soul.md
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-3 rounded-lg font-medium border border-surface/50 text-text-muted hover:bg-surface/30"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function ProgressCard({
  label,
  icon,
  current,
  required,
  complete,
  description,
  isPercent = false,
}: {
  label: string;
  icon: string;
  current: number;
  required: number;
  complete: boolean;
  description: string;
  isPercent?: boolean;
}) {
  const progress = Math.min(100, (current / required) * 100);

  return (
    <div
      className={`p-4 rounded-lg border ${
        complete
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-surface/30 border-surface/50'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium text-text">{label}</span>
        {complete && <span className="text-emerald-400 ml-auto">✓</span>}
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={`text-2xl font-bold ${complete ? 'text-emerald-400' : 'text-text'}`}>
          {current}{isPercent && '%'}
        </span>
        {!isPercent && <span className="text-text-muted">/ {required}</span>}
      </div>
      <div className="h-1.5 bg-surface rounded-full overflow-hidden mb-2">
        <motion.div
          className={`h-full ${complete ? 'bg-emerald-500' : 'bg-primary'}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-[10px] text-text-muted">{description}</p>
    </div>
  );
}
