'use client';

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { recordOrbConvergence } from '@/lib/training-progress';
import { getEquippedBlade } from '@/lib/spellweb-blade-bridge';

/**
 * Dual Orbs System - Training Grounds
 *
 * Inspired by spellweb's WanderingOrbs and SpellEffects:
 * - Swordsman (⚔️) and Mage (🧙) orbit each other around a shared center
 * - Center follows cursor with spring physics OR drifts autonomously
 * - Constellation tracing mode with glowing cut trails
 * - Spell particles emit and float upward with physics
 * - Text displacement using circle intersection math
 */

// ============================================
// TYPES
// ============================================

interface OrbState {
  x: number
  y: number
  vx: number
  vy: number
}

interface SpellParticle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  emoji: string
  opacity: number
  scale: number
  rotation: number
  lifetime: number
  maxLifetime: number
  color: string
}

interface CutSegment {
  x1: number
  y1: number
  x2: number
  y2: number
  opacity: number
  color: string
}

interface ConstellationNode {
  id: string
  x: number
  y: number
  emoji?: string
}

import { getOrbLoadout, ORB_LOADOUT_SLOT_COUNT, type OrbitingSyncSpell } from '@/lib/orb-loadout'
import { linesToBinaryIndex } from '@/lib/hexagram'

interface DualOrbsProps {
  onConvergence?: () => void
  onSpellCast?: (position: { x: number; y: number }) => void
  enabled?: boolean
  mode?: 'cursor' | 'wander' | 'trace'
  constellationNodes?: ConstellationNode[]
  traceColor?: string
  /** When true (default), body text stays fixed; augmentation is drawn on canvas only. */
  anchorText?: boolean
  /** Show hex ring around swordsman (default: true when blades equipped) */
  showStanceRing?: boolean
  /** Selected swordsman slot index (from panel) - this fires on right-click */
  selectedSwordsmanIdx?: number
  /** Selected mage slot index (from panel) - this fires on left-click */
  selectedMageIdx?: number
  /** Callback when stance line is toggled (cursor mode right-click) */
  onStanceLineToggle?: (lineIndex: number) => void
  /** Current page pathname - used for per-page soul orb positioning */
  pathname?: string
}

export interface DualOrbsHandle {
  addOrbitingSpell: (emoji: string, orbiter?: 'swordsman' | 'mage') => void
  syncOrbitingFromInscriptions: (spells: OrbitingSyncSpell[]) => void
  emitParticles: (x: number, y: number, emojis: string[], count: number) => void
  getSwordsmanPosition: () => { x: number; y: number }
  getMagePosition: () => { x: number; y: number }
  getCenterPosition: () => { x: number; y: number }
  setMode: (mode: 'cursor' | 'wander' | 'trace') => void
}

// ============================================
// CONSTANTS
// ============================================

const ORB_COLORS = {
  swordsman: {
    primary: '#e74c3c',
    glow: '#ff6b6b',
    symbol: '⚔️'
  },
  mage: {
    primary: '#9b59b6',
    glow: '#a78bfa',
    symbol: '🧙'
  },
  convergence: '#ffd700'
}

const ORB_RADIUS = 18
const ORBIT_RADIUS = 40 // Distance orbs orbit from center
const ORBIT_SPEED = 0.0012 // Slow graceful orbit
/** Clicked orbiting spell: coast away (ms), then ease back to Soulbis/Soulbae */
const SPELL_FLIGHT_OUT_MS = 1600 // Longer flight duration

// Spring physics for cursor following
const SPRING_STIFFNESS = 0.03
const SPRING_DAMPING = 0.88

// Drift physics for wander mode
const WANDER_FRICTION = 0.995
const WANDER_JITTER = 0.15 // Random acceleration each frame
const WANDER_BOUNCE = 0.6 // Velocity retention on wall bounce
const WANDER_DROP_SPEED = 2.5 // Initial drop velocity when entering wander

// Trace mode
const TRACE_SPEED = 0.006

// Soul orb (invisible convergence point)
const SOUL_ORB_GRAVITY = 0.00008 // Very subtle gravity pull
const SOUL_ORB_PROXIMITY = 80 // Distance at which soul orb reveals itself
const SOUL_ORB_CONVERGE_DIST = 50 // Distance at which click can trigger convergence

// ============================================
// COMPONENT
// ============================================

const DualOrbs = forwardRef<DualOrbsHandle, DualOrbsProps>(function DualOrbs({
  onConvergence,
  enabled = true,
  mode: initialMode = 'cursor',
  constellationNodes = [],
  traceColor = '#ffd700',
  anchorText = true,
  showStanceRing = true,
  selectedSwordsmanIdx = 0,
  selectedMageIdx = 0,
  onStanceLineToggle,
  pathname = '/',
}, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  // Shared center that both orbs orbit around
  const centerRef = useRef<OrbState>({ x: 0, y: 0, vx: 0, vy: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })
  const orbitAngleRef = useRef(0)
  /** Rotates swordsman micro-orbit chips from hex stance (0…63 → full turn) */
  const stancePhaseRef = useRef(0)
  const timeRef = useRef(0)

  // Mode state
  const [currentMode, setCurrentMode] = useState<'cursor' | 'wander' | 'trace'>(initialMode)

  // Particles and effects
  const particlesRef = useRef<SpellParticle[]>([])
  const cutSegmentsRef = useRef<CutSegment[]>([])

  // Orbiting spells
  const orbitingSpellsRef = useRef<Array<{
    id: string
    emoji: string
    orbiter: 'swordsman' | 'mage'
    angle: number
    taleId?: string
    stanceLine?: 0 | 1
  }>>([])
  const orbitingHitRef = useRef<Array<{ id: string; x: number; y: number; emoji: string }>>([])
  const highlightRef = useRef<{ id: string; until: number } | null>(null)

  /** Clicked orbiting spell: flies away from soulbis/soulbae, then eases back into orbit */
  const spellFlightRef = useRef<{
    id: string
    emoji: string
    x: number
    y: number
    vx: number
    vy: number
    phase: 'out' | 'return'
    phaseStart: number
  } | null>(null)
  const lastAnimFrameTsRef = useRef(0)

  // Trace state
  const traceIndexRef = useRef(0)
  const traceProgressRef = useRef(0)
  const wasTracingRef = useRef(false)
  const prevModeRef = useRef<'cursor' | 'wander' | 'trace'>(initialMode)
  const wanderDroppedRef = useRef(false)

  // Convergence
  const [hasConverged, setHasConverged] = useState(false)
  const convergeCooldownRef = useRef(false)

  // Soul orb (invisible convergence easter egg)
  const soulOrbRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const convergedPagesRef = useRef<Set<string>>(new Set())
  const [soulOrbProximity, setSoulOrbProximity] = useState(false) // True when orbs are close enough

  // Mage push physics state (legacy - now used for spell flight)
  const magePushRef = useRef<{ vx: number; vy: number; active: boolean }>({ vx: 0, vy: 0, active: false })

  // Swordsman: equipped blade angle (rotates around stance hex)
  const bladeAngleRef = useRef(0)

  // Mage: next spell to fire (cycles 0-5)
  const mageFireIndexRef = useRef(0)

  // Initialize
  useEffect(() => {
    if (typeof window === 'undefined') return

    const w = window.innerWidth
    const h = window.innerHeight

    centerRef.current = { x: w / 2, y: h / 2, vx: 0, vy: 0 }
    targetRef.current = { x: w / 2, y: h / 2 }
    mouseRef.current = { x: w / 2, y: h / 2 }
  }, [])

  // Generate random soul orb position for each page
  useEffect(() => {
    if (typeof window === 'undefined') return

    const w = window.innerWidth
    const h = window.innerHeight
    // Random position avoiding edges (20% margin) and bottom control bar
    const margin = 0.2
    const bottomMargin = 120 // Avoid the control panel
    soulOrbRef.current = {
      x: w * margin + Math.random() * w * (1 - 2 * margin),
      y: h * margin + Math.random() * (h * (1 - 2 * margin) - bottomMargin),
    }
    setSoulOrbProximity(false) // Reset proximity state for new page
  }, [pathname])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Keyboard hotkeys: [h] home, [w] wander
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      const target = e.target as HTMLElement
      if (target.matches('input, textarea, select, [contenteditable="true"]')) return

      const key = e.key.toLowerCase()

      if (key === 'h') {
        // [h] Home - return to cursor mode and center on cursor
        setCurrentMode('cursor')
        wanderDroppedRef.current = false
        // Snap center toward current cursor position
        const center = centerRef.current
        const mouse = mouseRef.current
        center.x = mouse.x
        center.y = mouse.y
        center.vx = 0
        center.vy = 0
      } else if (key === 'w') {
        // [w] Wander - toggle wander mode
        setCurrentMode(prev => prev === 'wander' ? 'cursor' : 'wander')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled])

  // Left-click near mage orb → fire SELECTED mage spell
  useEffect(() => {
    if (!enabled) return

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest('a,button,input,textarea,select,label,[role="button"],[contenteditable="true"]')) return
      if (spellFlightRef.current) return

      // Check for mage spell fire (left-click near mage orb)
      const mAngle = orbitAngleRef.current + Math.PI
      const mPos = {
        x: centerRef.current.x + Math.cos(mAngle) * ORBIT_RADIUS,
        y: centerRef.current.y + Math.sin(mAngle) * ORBIT_RADIUS * 0.6
      }
      const distToMage = Math.hypot(e.clientX - mPos.x, e.clientY - mPos.y)

      if (distToMage < ORB_RADIUS * 4) {
        // Fire SELECTED mage spell (from panel)
        const mageSpells = orbitingSpellsRef.current.filter(s => s.orbiter === 'mage')
        if (mageSpells.length > 0 && selectedMageIdx < mageSpells.length) {
          const spell = mageSpells[selectedMageIdx]

          // Launch this spell outward
          const spellPos = orbitingHitRef.current.find(h => h.id === spell.id)
          if (spellPos) {
            // Fire toward click position - faster for longer flight
            const angle = Math.atan2(e.clientY - mPos.y, e.clientX - mPos.x)
            const speed = 500 + Math.random() * 150
            spellFlightRef.current = {
              id: spell.id,
              emoji: spell.emoji,
              x: spellPos.x,
              y: spellPos.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              phase: 'out',
              phaseStart: performance.now(),
            }
            highlightRef.current = { id: spell.id, until: Date.now() + 2000 }
          }
        }
        return
      }
    }

    window.addEventListener('click', onClick, true)
    return () => window.removeEventListener('click', onClick, true)
  }, [enabled, selectedMageIdx])

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    addOrbitingSpell: (emoji: string, orbiter: 'swordsman' | 'mage' = 'swordsman') => {
      orbitingSpellsRef.current.push({
        id: `spell-${Date.now()}-${Math.random()}`,
        emoji,
        orbiter,
        angle: Math.random() * Math.PI * 2
      })
      // Match loadout: six micro-orbits per Soulbis / Soulbae
      const filtered = orbitingSpellsRef.current.filter(s => s.orbiter === orbiter)
      if (filtered.length > ORB_LOADOUT_SLOT_COUNT) {
        orbitingSpellsRef.current = orbitingSpellsRef.current.filter(s => s.id !== filtered[0].id)
      }
    },
    syncOrbitingFromInscriptions: (spells: OrbitingSyncSpell[]) => {
      try {
        stancePhaseRef.current =
          (linesToBinaryIndex(getOrbLoadout().stanceHexLines) / 64) * Math.PI * 2
      } catch {
        stancePhaseRef.current = 0
      }
      orbitingSpellsRef.current = spells.map((s) => ({
        id: s.id,
        emoji: s.emoji,
        orbiter: s.orbiter,
        angle: 0,
        taleId: s.taleId,
        stanceLine: s.stanceLine,
      }))
    },
    emitParticles: (x: number, y: number, emojis: string[], count: number) => {
      emitParticlesAt(x, y, emojis, count, ORB_COLORS.convergence)
    },
    getSwordsmanPosition: () => {
      const angle = orbitAngleRef.current
      return {
        x: centerRef.current.x + Math.cos(angle) * ORBIT_RADIUS,
        y: centerRef.current.y + Math.sin(angle) * ORBIT_RADIUS * 0.6
      }
    },
    getMagePosition: () => {
      const angle = orbitAngleRef.current + Math.PI
      return {
        x: centerRef.current.x + Math.cos(angle) * ORBIT_RADIUS,
        y: centerRef.current.y + Math.sin(angle) * ORBIT_RADIUS * 0.6
      }
    },
    getCenterPosition: () => ({ x: centerRef.current.x, y: centerRef.current.y }),
    setMode: (mode: 'cursor' | 'wander' | 'trace') => setCurrentMode(mode)
  }), [])

  // Emit particles helper
  const emitParticlesAt = useCallback((x: number, y: number, emojis: string[], count: number, color: string) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const speed = 1.5 + Math.random() * 2.5

      particlesRef.current.push({
        id: `p-${Date.now()}-${i}-${Math.random()}`,
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        opacity: 1,
        scale: 0.6 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI * 2,
        lifetime: 0,
        maxLifetime: 1500 + Math.random() * 1000,
        color
      })
    }
    // Limit particles
    if (particlesRef.current.length > 80) {
      particlesRef.current = particlesRef.current.slice(-60)
    }
  }, [])

  // Soul orb convergence click handler
  useEffect(() => {
    if (!enabled || !soulOrbProximity || hasConverged) return

    const onSoulClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest('a,button,input,textarea,select,label,[role="button"],[contenteditable="true"]')) return

      // Check if click is near the soul orb
      const soulOrb = soulOrbRef.current
      const distToSoul = Math.hypot(e.clientX - soulOrb.x, e.clientY - soulOrb.y)

      if (distToSoul < SOUL_ORB_CONVERGE_DIST && !convergedPagesRef.current.has(pathname)) {
        // Trigger convergence!
        setHasConverged(true)
        convergedPagesRef.current.add(pathname)
        recordOrbConvergence()
        onConvergence?.()
        emitParticlesAt(soulOrb.x, soulOrb.y, ['✦', '⚡', '💫', '🔮', '✧', '⭐'], 20, ORB_COLORS.convergence)

        // Reset after burst animation
        setTimeout(() => {
          setHasConverged(false)
          setSoulOrbProximity(false)
        }, 3000)
      }
    }

    window.addEventListener('click', onSoulClick, true)
    return () => window.removeEventListener('click', onSoulClick, true)
  }, [enabled, soulOrbProximity, hasConverged, pathname, onConvergence, emitParticlesAt])

  // Right-click near swordsman:
  // - Cursor mode: toggle stance line (yin/yang) only - no particles
  // - Wander mode: cast equipped blade (fire it like mage spell)
  useEffect(() => {
    if (!enabled) return

    const onContextMenu = (e: MouseEvent) => {
      // Calculate swordsman position
      const angle = orbitAngleRef.current
      const sPos = {
        x: centerRef.current.x + Math.cos(angle) * ORBIT_RADIUS,
        y: centerRef.current.y + Math.sin(angle) * ORBIT_RADIUS * 0.6
      }

      const dist = Math.hypot(e.clientX - sPos.x, e.clientY - sPos.y)

      // Only intercept if within 4x orb radius of swordsman
      if (dist < ORB_RADIUS * 4) {
        e.preventDefault()
        e.stopImmediatePropagation()

        if (currentMode === 'wander') {
          // Wander mode: cast equipped blade
          const equippedBlade = getEquippedBlade()
          if (equippedBlade && !spellFlightRef.current) {
            const fireAngle = Math.atan2(e.clientY - sPos.y, e.clientX - sPos.x)
            const speed = 500 + Math.random() * 150

            spellFlightRef.current = {
              id: `blade-cast-${Date.now()}`,
              emoji: equippedBlade.primaryEmoji,
              x: sPos.x,
              y: sPos.y,
              vx: Math.cos(fireAngle) * speed,
              vy: Math.sin(fireAngle) * speed,
              phase: 'out',
              phaseStart: performance.now(),
            }
          }
        } else {
          // Cursor mode: just toggle stance line (active/passive boundary)
          onStanceLineToggle?.(selectedSwordsmanIdx)
        }
      }
    }

    window.addEventListener('contextmenu', onContextMenu, true)
    return () => window.removeEventListener('contextmenu', onContextMenu, true)
  }, [enabled, selectedSwordsmanIdx, currentMode, onStanceLineToggle])

  // Animation loop
  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = (timestamp: number) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const center = centerRef.current
      const deltaTime = 16

      const prevTs = lastAnimFrameTsRef.current
      lastAnimFrameTsRef.current = timestamp
      const dtSec = prevTs ? Math.min(0.05, (timestamp - prevTs) / 1000) : 0.016

      ctx.clearRect(0, 0, w, h)

      // === UPDATE CENTER POSITION ===
      if (currentMode === 'cursor') {
        // Reset wander drop flag when back in cursor mode
        if (prevModeRef.current !== 'cursor') {
          prevModeRef.current = 'cursor'
          wanderDroppedRef.current = false
        }
        // Spring physics toward cursor
        const mouse = mouseRef.current
        const dx = mouse.x - center.x
        const dy = mouse.y - center.y
        center.vx = (center.vx + dx * SPRING_STIFFNESS) * SPRING_DAMPING
        center.vy = (center.vy + dy * SPRING_STIFFNESS) * SPRING_DAMPING

        // Soul orb gravity (subtle pull toward invisible convergence point)
        const soulOrb = soulOrbRef.current
        const soulDx = soulOrb.x - center.x
        const soulDy = soulOrb.y - center.y
        const soulDist = Math.hypot(soulDx, soulDy)
        if (soulDist > 1) {
          // Gravity increases slightly as you get closer (inverse square-ish)
          const gravityStrength = SOUL_ORB_GRAVITY * Math.min(1, 200 / soulDist)
          center.vx += (soulDx / soulDist) * gravityStrength * soulDist
          center.vy += (soulDy / soulDist) * gravityStrength * soulDist
        }

        center.x += center.vx
        center.y += center.vy

      } else if (currentMode === 'wander') {
        // Handle mode switch - "drop" from cursor with initial velocity
        if (prevModeRef.current !== 'wander' || !wanderDroppedRef.current) {
          prevModeRef.current = 'wander'
          wanderDroppedRef.current = true
          // Give initial "drop" velocity - continue momentum + random push
          const angle = Math.random() * Math.PI * 2
          center.vx = center.vx * 0.5 + Math.cos(angle) * WANDER_DROP_SPEED
          center.vy = center.vy * 0.5 + Math.sin(angle) * WANDER_DROP_SPEED + 1.5 // slight downward bias
        }

        // Random jitter - organic wandering
        center.vx += (Math.random() - 0.5) * WANDER_JITTER
        center.vy += (Math.random() - 0.5) * WANDER_JITTER

        // Soul orb gravity (subtle pull toward invisible convergence point)
        const soulOrb = soulOrbRef.current
        const soulDx = soulOrb.x - center.x
        const soulDy = soulOrb.y - center.y
        const soulDist = Math.hypot(soulDx, soulDy)
        if (soulDist > 1) {
          const gravityStrength = SOUL_ORB_GRAVITY * 2 * Math.min(1, 200 / soulDist) // Slightly stronger in wander
          center.vx += (soulDx / soulDist) * gravityStrength * soulDist
          center.vy += (soulDy / soulDist) * gravityStrength * soulDist
        }

        // Apply friction
        center.vx *= WANDER_FRICTION
        center.vy *= WANDER_FRICTION

        // Update position
        center.x += center.vx
        center.y += center.vy

        // Bounce off walls
        const margin = ORBIT_RADIUS + 30
        if (center.x < margin) {
          center.x = margin
          center.vx = Math.abs(center.vx) * WANDER_BOUNCE
        } else if (center.x > w - margin) {
          center.x = w - margin
          center.vx = -Math.abs(center.vx) * WANDER_BOUNCE
        }
        if (center.y < margin) {
          center.y = margin
          center.vy = Math.abs(center.vy) * WANDER_BOUNCE
        } else if (center.y > h - margin) {
          center.y = h - margin
          center.vy = -Math.abs(center.vy) * WANDER_BOUNCE
        }

      } else if (currentMode === 'trace' && constellationNodes.length >= 2) {
        // Trace constellation path
        if (!wasTracingRef.current) {
          wasTracingRef.current = true
          traceIndexRef.current = 0
          traceProgressRef.current = 0
          cutSegmentsRef.current = []
          center.x = constellationNodes[0].x
          center.y = constellationNodes[0].y
        }

        const currentIndex = traceIndexRef.current
        const nextIndex = (currentIndex + 1) % constellationNodes.length
        const currentNode = constellationNodes[currentIndex]
        const nextNode = constellationNodes[nextIndex]

        traceProgressRef.current += TRACE_SPEED

        if (traceProgressRef.current >= 1) {
          // Add cut segment
          cutSegmentsRef.current.push({
            x1: currentNode.x,
            y1: currentNode.y,
            x2: nextNode.x,
            y2: nextNode.y,
            opacity: 1,
            color: traceColor
          })

          // Emit particles at node
          const emojis = nextNode.emoji ? [nextNode.emoji] : ['✦', '💫']
          emitParticlesAt(nextNode.x, nextNode.y, emojis, 8, traceColor)

          traceIndexRef.current = nextIndex
          traceProgressRef.current = 0
        }

        // Interpolate position
        const t = traceProgressRef.current
        center.x = currentNode.x + (nextNode.x - currentNode.x) * t
        center.y = currentNode.y + (nextNode.y - currentNode.y) * t
      } else {
        wasTracingRef.current = false
      }

      // Clamp center to viewport
      center.x = Math.max(ORBIT_RADIUS + 20, Math.min(w - ORBIT_RADIUS - 20, center.x))
      center.y = Math.max(ORBIT_RADIUS + 20, Math.min(h - ORBIT_RADIUS - 20, center.y))

      // === UPDATE ORBIT ANGLE ===
      orbitAngleRef.current += ORBIT_SPEED * deltaTime
      timeRef.current += deltaTime

      // === CALCULATE ORB POSITIONS ===
      // Wider orbit over reading surface (main) — text stays anchored; gap widens visually
      let orbitScale = 1
      const mainEl = typeof document !== 'undefined' ? document.querySelector('main') : null
      if (mainEl) {
        const mr = mainEl.getBoundingClientRect()
        const cx = mr.left + mr.width / 2
        const cy = mr.top + mr.height / 2
        const d = Math.hypot(center.x - cx, center.y - cy)
        const reach = Math.hypot(mr.width, mr.height) * 0.45
        if (d < reach) orbitScale = 1.35 + (1 - d / Math.max(reach, 1)) * 0.55
      }
      const orbitR = ORBIT_RADIUS * orbitScale

      const swordsmanX = center.x + Math.cos(orbitAngleRef.current) * orbitR
      const swordsmanY = center.y + Math.sin(orbitAngleRef.current) * orbitR * 0.6
      let mageX = center.x + Math.cos(orbitAngleRef.current + Math.PI) * orbitR
      let mageY = center.y + Math.sin(orbitAngleRef.current + Math.PI) * orbitR * 0.6

      // Update blade angle (rotates around swordsman stance hex)
      bladeAngleRef.current += ORBIT_SPEED * deltaTime * 0.8 // Slightly slower than orb orbit

      const tOrbit = timeRef.current

      // === ORBITING SPELL FLIGHT (click: break orbit → coast → settle back) ===
      const flight = spellFlightRef.current
      if (flight) {
        const spells = orbitingSpellsRef.current
        const spell = spells.find(s => s.id === flight.id)
        const isBladeCast = flight.id.startsWith('blade-cast-')
        const now = performance.now()

        // Blade casts don't need to be in orbiting spells
        if (!spell && !isBladeCast) {
          spellFlightRef.current = null
        } else {
          const f = spellFlightRef.current
          if (f.phase === 'out') {
            const elapsed = now - f.phaseStart
            if (elapsed < SPELL_FLIGHT_OUT_MS) {
              f.x += f.vx * dtSec
              f.y += f.vy * dtSec
              const drag = Math.pow(0.988, dtSec * 60)
              f.vx *= drag
              f.vy *= drag
              f.x = Math.max(20, Math.min(w - 20, f.x))
              f.y = Math.max(20, Math.min(h - 20, f.y))
            } else {
              f.phase = 'return'
              f.phaseStart = now
            }
          }
          const fr = spellFlightRef.current
          if (fr && fr.phase === 'return') {
            // Blade casts return directly to swordsman, orbiting spells return to orbit
            let target: { x: number; y: number }
            if (isBladeCast) {
              target = { x: swordsmanX, y: swordsmanY }
            } else {
              const idx = spells.findIndex(s => s.id === fr.id)
              target = computeOrbitingSpellXY(
                spell!,
                Math.max(0, idx),
                spells,
                swordsmanX,
                swordsmanY,
                mageX,
                mageY,
                tOrbit,
                stancePhaseRef.current
              )
            }
            const dx = target.x - fr.x
            const dy = target.y - fr.y
            const dist = Math.hypot(dx, dy)
            if (dist < 5) {
              spellFlightRef.current = null
              if (!isBladeCast) {
                highlightRef.current = { id: fr.id, until: now + 1600 }
              }
            } else {
              const k = 1 - Math.exp(-dtSec * 3.4)
              fr.x += dx * k
              fr.y += dy * k
            }
          }
        }
      }

      // === ANCHORED TEXT: augment at orb boundaries (canvas only) ===
      if (anchorText) {
        drawBoundaryAugment(ctx, swordsmanX, swordsmanY, ORB_COLORS.swordsman.glow)
        drawBoundaryAugment(ctx, mageX, mageY, ORB_COLORS.mage.glow)
      }

      // === FADE CUT SEGMENTS ===
      cutSegmentsRef.current = cutSegmentsRef.current
        .map(seg => ({ ...seg, opacity: seg.opacity - 0.004 }))
        .filter(seg => seg.opacity > 0)

      // === DRAW CUT SEGMENTS ===
      cutSegmentsRef.current.forEach(seg => {
        ctx.beginPath()
        ctx.moveTo(seg.x1, seg.y1)
        ctx.lineTo(seg.x2, seg.y2)
        const alpha = Math.floor(seg.opacity * 255).toString(16).padStart(2, '0')
        ctx.strokeStyle = seg.color + alpha
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.shadowColor = seg.color
        ctx.shadowBlur = 12 * seg.opacity
        ctx.stroke()
        ctx.shadowBlur = 0
      })

      // === DRAW CONSTELLATION PREVIEW (trace mode) ===
      if (currentMode === 'trace' && constellationNodes.length >= 2) {
        ctx.beginPath()
        ctx.moveTo(constellationNodes[0].x, constellationNodes[0].y)
        constellationNodes.forEach((node, i) => {
          if (i > 0) ctx.lineTo(node.x, node.y)
        })
        ctx.lineTo(constellationNodes[0].x, constellationNodes[0].y)
        ctx.strokeStyle = traceColor + '25'
        ctx.lineWidth = 1
        ctx.setLineDash([6, 6])
        ctx.stroke()
        ctx.setLineDash([])

        // Draw nodes
        constellationNodes.forEach(node => {
          ctx.beginPath()
          ctx.arc(node.x, node.y, 6, 0, Math.PI * 2)
          ctx.fillStyle = traceColor + '60'
          ctx.fill()
        })
      }

      // === DRAW CENTER GLOW ===
      const centerGlow = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, ORBIT_RADIUS * 1.3 * orbitScale)
      centerGlow.addColorStop(0, 'rgba(255, 215, 0, 0.08)')
      centerGlow.addColorStop(1, 'rgba(255, 215, 0, 0)')
      ctx.beginPath()
      ctx.arc(center.x, center.y, ORBIT_RADIUS * 1.3 * orbitScale, 0, Math.PI * 2)
      ctx.fillStyle = centerGlow
      ctx.fill()

      // === DRAW CONNECTION LINE ===
      ctx.beginPath()
      ctx.moveTo(swordsmanX, swordsmanY)
      ctx.lineTo(mageX, mageY)
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.12)'
      ctx.lineWidth = 1
      ctx.stroke()

      // === UPDATE & DRAW PARTICLES ===
      particlesRef.current = particlesRef.current
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.04,
          vx: p.vx * 0.98,
          opacity: Math.max(0, 1 - p.lifetime / p.maxLifetime),
          rotation: p.rotation + 0.02,
          lifetime: p.lifetime + deltaTime
        }))
        .filter(p => p.lifetime < p.maxLifetime)

      particlesRef.current.forEach(p => {
        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.scale(p.scale, p.scale)
        ctx.shadowColor = p.color
        ctx.shadowBlur = 6
        ctx.font = '20px "Segoe UI Emoji", "Apple Color Emoji", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.emoji, 0, 0)
        ctx.restore()
      })

      // === DRAW ORBITING SPELLS ===
      const t = timeRef.current
      const flyingId = spellFlightRef.current?.id
      const hits: Array<{ id: string; x: number; y: number; emoji: string }> = []

      // Separate swordsman (fixed facets) and mage (rotating) spells
      const swordsmanSpells = orbitingSpellsRef.current.filter(s => s.orbiter === 'swordsman')
      const mageSpells = orbitingSpellsRef.current.filter(s => s.orbiter === 'mage')

      // Draw SWORDSMAN facets - FIXED positions in hex ring
      swordsmanSpells.forEach((spell, i) => {
        if (flyingId === spell.id) {
          const fl = spellFlightRef.current
          if (fl) hits.push({ id: spell.id, x: fl.x, y: fl.y, emoji: spell.emoji })
          return
        }

        // Fixed position: L1 at bottom (π/2), counterclockwise
        const facetAngle = Math.PI / 2 + (i / 6) * Math.PI * 2
        const facetR = ORB_RADIUS + 18 // Fixed radius in stance ring

        const sx = swordsmanX + Math.cos(facetAngle) * facetR
        const sy = swordsmanY + Math.sin(facetAngle) * facetR

        // Highlight SELECTED facet (from panel) - radiant beam through emoji toward center
        const isSelected = i === selectedSwordsmanIdx

        if (isSelected) {
          const toCenter = Math.atan2(swordsmanY - sy, swordsmanX - sx)
          // Beam starts outside the emoji, passes through, extends toward center
          const beamStartDist = -20 // Start outside (negative = away from center)
          const beamEndDist = 35 // End closer to center
          const startX = sx + Math.cos(toCenter) * beamStartDist
          const startY = sy + Math.sin(toCenter) * beamStartDist
          const endX = sx + Math.cos(toCenter) * beamEndDist
          const endY = sy + Math.sin(toCenter) * beamEndDist

          // Create gradient beam
          const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
          gradient.addColorStop(0, ORB_COLORS.swordsman.glow + '00')
          gradient.addColorStop(0.3, ORB_COLORS.swordsman.glow + '60')
          gradient.addColorStop(0.7, ORB_COLORS.swordsman.glow + '40')
          gradient.addColorStop(1, ORB_COLORS.swordsman.glow + '00')

          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(endX, endY)
          ctx.strokeStyle = gradient
          ctx.lineWidth = 3
          ctx.lineCap = 'round'
          ctx.stroke()
        }

        // Facet emoji - yin (protected) gets orange glow, yang (open) is normal
        const isYin = spell.stanceLine === 0
        ctx.save()
        ctx.globalAlpha = 1
        ctx.font = `${isSelected ? 20 : 16}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const displayEmoji = [...spell.emoji][0] || spell.emoji
        if (isYin) {
          // Protected state - orange glow
          ctx.shadowColor = '#f59e0b'
          ctx.shadowBlur = 10
        } else if (isSelected) {
          ctx.shadowColor = ORB_COLORS.convergence
          ctx.shadowBlur = 8
        }
        ctx.fillText(displayEmoji, sx, sy)
        ctx.restore()
        hits.push({ id: spell.id, x: sx, y: sy, emoji: spell.emoji })
      })

      // No rotating blade - selection is from panel now

      // Draw MAGE spells - ROTATING around mage
      mageSpells.forEach((spell, i) => {
        if (flyingId === spell.id) {
          const fl = spellFlightRef.current
          if (fl) hits.push({ id: spell.id, x: fl.x, y: fl.y, emoji: spell.emoji })
          return
        }

        const angleOffset = (i / Math.max(mageSpells.length, 1)) * Math.PI * 2
        const spellOrbitR = 36 // Fixed radius
        const angle = t * 0.0015 + angleOffset // Rotating

        const sx = mageX + Math.cos(angle) * spellOrbitR
        const sy = mageY + Math.sin(angle) * spellOrbitR

        // Highlight SELECTED spell (from panel) - radiant beam through emoji toward center
        const isSelected = i === selectedMageIdx
        if (isSelected) {
          const toCenter = Math.atan2(mageY - sy, mageX - sx)
          const beamStartDist = -18
          const beamEndDist = 30
          const startX = sx + Math.cos(toCenter) * beamStartDist
          const startY = sy + Math.sin(toCenter) * beamStartDist
          const endX = sx + Math.cos(toCenter) * beamEndDist
          const endY = sy + Math.sin(toCenter) * beamEndDist

          const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
          gradient.addColorStop(0, ORB_COLORS.mage.glow + '00')
          gradient.addColorStop(0.3, ORB_COLORS.mage.glow + '60')
          gradient.addColorStop(0.7, ORB_COLORS.mage.glow + '40')
          gradient.addColorStop(1, ORB_COLORS.mage.glow + '00')

          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(endX, endY)
          ctx.strokeStyle = gradient
          ctx.lineWidth = 3
          ctx.lineCap = 'round'
          ctx.stroke()
        }

        // Trail (only for selected)
        if (isSelected) {
          ctx.beginPath()
          ctx.arc(mageX, mageY, spellOrbitR, angle - 0.4, angle)
          ctx.strokeStyle = ORB_COLORS.mage.glow + '50'
          ctx.lineWidth = 2.5
          ctx.stroke()
        }

        // Spell emoji - crisp rendering, subtle glow only when selected
        ctx.save()
        ctx.globalAlpha = 1
        ctx.font = `${isSelected ? 20 : 16}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const displayEmoji = [...spell.emoji][0] || spell.emoji
        if (isSelected) {
          ctx.shadowColor = ORB_COLORS.convergence
          ctx.shadowBlur = 8
        }
        ctx.fillText(displayEmoji, sx, sy)
        ctx.restore()
        hits.push({ id: spell.id, x: sx, y: sy, emoji: spell.emoji })
      })

      orbitingHitRef.current = hits

      // === DRAW ORBS ===
      drawOrb(ctx, swordsmanX, swordsmanY, ORB_COLORS.swordsman, t, hasConverged)
      drawOrb(ctx, mageX, mageY, ORB_COLORS.mage, t, hasConverged)

      // === DRAW STANCE HEX RING (around swordsman) ===
      if (showStanceRing) {
        const loadout = getOrbLoadout()
        // Draw ring sectors only (facet emojis drawn with orbiting spells above)
        drawStanceHexRing(ctx, swordsmanX, swordsmanY, loadout.stanceHexLines, [], 0)
      }

      // === FLYING SPELL (on top of orbs — “lost gravity” arc) ===
      const flDraw = spellFlightRef.current
      if (flDraw) {
        const pulse = 1 + Math.sin(t * 0.012) * 0.08
        ctx.save()
        ctx.globalAlpha = 0.95
        ctx.shadowColor = 'rgba(255, 215, 0, 0.45)'
        ctx.shadowBlur = 14 * pulse
        ctx.font = `${Math.round(18 * pulse)}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(flDraw.emoji, flDraw.x, flDraw.y)
        ctx.restore()
      }

      // === CLICK HIGHLIGHT PATTERN (follows orbiting or flying spell) ===
      const hi = highlightRef.current
      if (hi && Date.now() < hi.until) {
        let hx: number | undefined
        let hy: number | undefined
        const flH = spellFlightRef.current
        if (flH && flH.id === hi.id) {
          hx = flH.x
          hy = flH.y
        } else {
          const hp = orbitingHitRef.current.find(o => o.id === hi.id)
          if (hp) {
            hx = hp.x
            hy = hp.y
          }
        }
        if (hx !== undefined && hy !== undefined) {
          drawHighlightPattern(ctx, hx, hy, t * 0.001)
        }
      } else if (hi && Date.now() >= hi.until) {
        highlightRef.current = null
      }

      // === CHECK SOUL ORB PROXIMITY (invisible convergence point) ===
      const soulOrb = soulOrbRef.current
      const pageAlreadyConverged = convergedPagesRef.current.has(pathname)
      const distToSoul = Math.hypot(center.x - soulOrb.x, center.y - soulOrb.y)
      const isNearSoul = distToSoul < SOUL_ORB_PROXIMITY && !pageAlreadyConverged

      // Update proximity state (triggers re-render for click handler)
      if (isNearSoul !== soulOrbProximity) {
        setSoulOrbProximity(isNearSoul)
      }

      // === DRAW SOUL ORB INDICATOR (only when close enough) ===
      if (isNearSoul && !hasConverged) {
        // Pulsing glow that gets brighter as you get closer
        const proximityRatio = 1 - (distToSoul / SOUL_ORB_PROXIMITY)
        const pulse = Math.sin(t * 0.003) * 0.3 + 0.7
        const alpha = proximityRatio * pulse * 0.6

        // Outer glow rings
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        for (let ring = 3; ring > 0; ring--) {
          const ringRadius = 12 + ring * 8
          const ringAlpha = alpha * (0.3 / ring)
          ctx.beginPath()
          ctx.arc(soulOrb.x, soulOrb.y, ringRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255, 215, 0, ${ringAlpha})`
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Core glow
        const gradient = ctx.createRadialGradient(soulOrb.x, soulOrb.y, 0, soulOrb.x, soulOrb.y, 20)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`)
        gradient.addColorStop(0.4, `rgba(255, 215, 0, ${alpha * 0.5})`)
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(soulOrb.x, soulOrb.y, 20, 0, Math.PI * 2)
        ctx.fill()

        // Soul emoji hint (very faint when far, clearer when close)
        if (proximityRatio > 0.5) {
          ctx.font = `${14 + proximityRatio * 6}px sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.globalAlpha = proximityRatio * 0.8
          ctx.fillText('✧', soulOrb.x, soulOrb.y)
        }
        ctx.restore()
      }

      // === CONVERGENCE BURST (after click) ===
      if (hasConverged) {
        const burstProgress = Math.min(1, (Date.now() % 3000) / 600)
        const burstRadius = 15 + burstProgress * 50
        const burstAlpha = (1 - burstProgress) * 0.4

        ctx.beginPath()
        ctx.arc(soulOrb.x, soulOrb.y, burstRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 215, 0, ${burstAlpha})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [enabled, currentMode, constellationNodes, traceColor, hasConverged, onConvergence, emitParticlesAt, anchorText, pathname, soulOrbProximity])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden
    />
  )
})

export default DualOrbs

// ============================================
// DRAWING HELPERS
// ============================================

/** Orbit slot for one spell chip (must match draw loop math). */
function computeOrbitingSpellXY(
  spell: { id: string; orbiter: 'swordsman' | 'mage'; angle: number; stanceLine?: 0 | 1 },
  spellIndex: number,
  allSpells: Array<{ id: string; orbiter: 'swordsman' | 'mage'; angle: number; stanceLine?: 0 | 1 }>,
  swordsmanX: number,
  swordsmanY: number,
  mageX: number,
  mageY: number,
  t: number,
  stancePhase: number
): { x: number; y: number } {
  const isSwordsman = spell.orbiter === 'swordsman'
  const baseX = isSwordsman ? swordsmanX : mageX
  const baseY = isSwordsman ? swordsmanY : mageY
  const spellsForOrb = allSpells.filter(s => s.orbiter === spell.orbiter)
  const i = Math.max(0, spellsForOrb.findIndex(s => s.id === spell.id))
  const angleOffset = (i / Math.max(spellsForOrb.length, 1)) * Math.PI * 2
  const yinYangR =
    isSwordsman && spell.stanceLine !== undefined ? (spell.stanceLine === 0 ? -2.75 : 2.75) : 0
  const spellOrbitR = 32 + Math.sin(t * 0.001 + spellIndex) * 4 + yinYangR
  const angle = spell.angle + t * 0.0015 + angleOffset + (isSwordsman ? stancePhase : 0)
  return {
    x: baseX + Math.cos(angle) * spellOrbitR,
    y: baseY + Math.sin(angle) * spellOrbitR,
  }
}

/** Soft rings at orb boundary — text stays in DOM; this reads as “augmentation” over the page. */
function drawBoundaryAugment(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  for (let i = 3; i >= 1; i--) {
    const r = ORB_RADIUS + i * 14
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.strokeStyle = color + (i === 3 ? '0d' : i === 2 ? '18' : '22')
    ctx.lineWidth = 1.6
    ctx.stroke()
  }
  const g = ctx.createRadialGradient(x, y, ORB_RADIUS * 0.5, x, y, ORB_RADIUS * 3.2)
  g.addColorStop(0, 'rgba(255,255,255,0)')
  g.addColorStop(0.55, color + '08')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.beginPath()
  ctx.arc(x, y, ORB_RADIUS * 3.2, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()
}

function drawHighlightPattern(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number) {
  const r = 28 + Math.sin(phase * 8) * 4
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(phase * 2)
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.28)'
  ctx.lineWidth = 1.5
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(Math.cos(a) * (r * 0.35), Math.sin(a) * (r * 0.35))
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.18)'
  ctx.stroke()
  ctx.restore()
}

function drawOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  colors: typeof ORB_COLORS.swordsman,
  time: number,
  converged: boolean
) {
  const pulse = converged
    ? 1 + Math.sin(time * 0.008) * 0.12
    : 1 + Math.sin(time * 0.002) * 0.04

  const radius = ORB_RADIUS * pulse

  // Outer glow
  const gradient = ctx.createRadialGradient(x, y, radius * 0.4, x, y, radius * 2.2)
  gradient.addColorStop(0, colors.glow + '50')
  gradient.addColorStop(0.5, colors.glow + '25')
  gradient.addColorStop(1, colors.glow + '00')

  ctx.beginPath()
  ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // Core with inner highlight
  const coreGradient = ctx.createRadialGradient(
    x - radius * 0.25, y - radius * 0.25, 0,
    x, y, radius
  )
  coreGradient.addColorStop(0, '#ffffff')
  coreGradient.addColorStop(0.35, colors.primary)
  coreGradient.addColorStop(1, colors.primary + '90')

  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = coreGradient
  ctx.fill()
  ctx.strokeStyle = colors.primary
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Symbol
  ctx.fillStyle = '#ffffff'
  ctx.font = `${radius * 0.85}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(colors.symbol, x, y)
}

/**
 * Draw stance hexagram ring around swordsman orb
 * 6 sectors (L1 at bottom, counterclockwise), yin=violet, yang=amber
 */
function drawStanceHexRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  lines: (0 | 1)[],
  facetEmojis: string[],
  pulse: number = 0
) {
  const rInner = ORB_RADIUS + 8
  const rOuter = ORB_RADIUS + 28

  // Draw 6 sectors (L1 at bottom = π/2, counterclockwise)
  for (let i = 0; i < 6; i++) {
    const isYang = lines[i] === 1
    // Start at bottom (π/2), go counterclockwise
    const t0 = Math.PI / 2 + (i / 6) * Math.PI * 2
    const t1 = Math.PI / 2 + ((i + 1) / 6) * Math.PI * 2

    // Yin biased inward, yang biased outward (subtle)
    const rBias = isYang ? rOuter + 2 : rOuter - 1

    // Draw sector arc
    ctx.beginPath()
    ctx.arc(x, y, rInner, t0, t1)
    ctx.arc(x, y, rBias, t1, t0, true)
    ctx.closePath()

    // Fill color: yang = amber, yin = violet
    ctx.fillStyle = isYang
      ? 'rgba(245, 158, 11, 0.22)'
      : 'rgba(139, 92, 246, 0.2)'
    ctx.fill()

    // Stroke
    ctx.strokeStyle = isYang
      ? 'rgba(245, 158, 11, 0.45)'
      : 'rgba(139, 92, 246, 0.45)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Facet emoji at sector midpoint
    const midAngle = (t0 + t1) / 2
    const emojiR = (rInner + rBias) / 2
    const ex = x + Math.cos(midAngle) * emojiR
    const ey = y + Math.sin(midAngle) * emojiR

    const emoji = facetEmojis[i] || ''
    if (emoji) {
      ctx.font = '10px "Segoe UI Emoji", "Apple Color Emoji", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'rgba(248, 250, 252, 0.95)'
      ctx.fillText(emoji, ex, ey)
    }
  }
}
