'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  castSpell,
  getAvailableSpells,
  getTrainingStats,
  DEFAULT_SPELLS
} from '@/lib/training-progress';
import { LEARNING_SPELLS_FORMING_BLADE } from '@/lib/learning-inscribed-sync';
import { getSoulStats, type SoulStats } from '@/lib/soul-stats';

/**
 * Spell palette — learning spells, forming blades
 *
 * Mage (Emissary): Left-click tap to cast last spell, hold to view orbit/palette.
 * Swordsman (Master): Right-click hold to take stance (reveals options), left-click to place mark.
 * S = full stance editor, M = full mage spell editor.
 */

// ============================================
// TYPES
// ============================================

interface SpellPaletteProps {
  onSpellCast?: (spellId: string, position: { x: number; y: number }) => void
  currentSection?: string
  /** When true, the training stats panel is hidden */
  collapsed?: boolean
}

interface SpellNode {
  id: string
  x: number
  y: number
  content: string
  emoji: string
  opacity: number
  pulse: number
}

// ============================================
// COMPONENT
// ============================================

export default function SpellPalette({
  onSpellCast,
  currentSection = 'hero',
  collapsed = false
}: SpellPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [selectedSpell, setSelectedSpell] = useState<string | null>(null)
  const [spellNodes, setSpellNodes] = useState<SpellNode[]>([])
  // Initialize with defaults to avoid hydration mismatch (localStorage not available on server)
  const [stats, setStats] = useState({ spellsCast: 0, convergences: 0, sectionsVisited: 0, totalSections: 0 })
  const [soulStats, setSoulStats] = useState<SoulStats | null>(null)

  // Get available spells
  const spells = getAvailableSpells()

  // Load stats from localStorage after mount, then refresh periodically
  useEffect(() => {
    // Initial load from localStorage (client-side only)
    setStats(getTrainingStats())
    setSoulStats(getSoulStats())

    const interval = setInterval(() => {
      setStats(getTrainingStats())
      setSoulStats(getSoulStats())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Handle left-click hold to open mage spell palette (emissary)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      setPosition({ x: e.clientX, y: e.clientY })
      setIsOpen(true)
    }

    const handleClick = () => {
      if (isOpen && !selectedSpell) {
        setIsOpen(false)
      } else if (selectedSpell) {
        // Cast the selected spell
        handleCast(selectedSpell)
        setSelectedSpell(null)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift+S toggles radial cast palette (S alone opens Soulbis stance site-wide)
      if (
        (e.key === 's' || e.key === 'S') &&
        e.shiftKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        const mouseX = window.innerWidth / 2
        const mouseY = window.innerHeight / 2
        setPosition({ x: mouseX, y: mouseY })
        setIsOpen(prev => !prev)
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false)
        setSelectedSpell(null)
      }

      // Number keys to quick-cast
      if (e.key >= '1' && e.key <= '7' && isOpen) {
        const index = parseInt(e.key) - 1
        if (index < spells.length) {
          handleCast(spells[index].id)
          setIsOpen(false)
        }
      }
    }

    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('click', handleClick)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, selectedSpell, spells])

  // Handle spell selection
  const handleSelect = (spellId: string) => {
    setSelectedSpell(spellId)
    setIsOpen(false)
  }

  // Handle spell cast
  const handleCast = useCallback((spellId: string) => {
    const mousePos = position
    const event = castSpell(spellId, mousePos, currentSection)

    if (event) {
      // Find spell info
      const spell = DEFAULT_SPELLS.find(s => s.id === spellId)

      // Add visual node
      const node: SpellNode = {
        id: `${spellId}-${Date.now()}`,
        x: mousePos.x,
        y: mousePos.y,
        content: spell?.content || spellId,
        emoji: spell?.emoji || '✨',
        opacity: 1,
        pulse: 1
      }

      setSpellNodes(prev => [...prev, node])

      // Fade out after delay
      setTimeout(() => {
        setSpellNodes(prev =>
          prev.map(n =>
            n.id === node.id ? { ...n, opacity: 0.4 } : n
          )
        )
      }, 5000)

      // Remove after longer delay
      setTimeout(() => {
        setSpellNodes(prev => prev.filter(n => n.id !== node.id))
      }, 60000)

      // Callback
      onSpellCast?.(spellId, mousePos)

      // Update stats
      setStats(getTrainingStats())
    }
  }, [position, currentSection, onSpellCast])

  return (
    <>
      {/* Spell Palette Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-[10000] pointer-events-auto"
            style={{
              left: position.x,
              top: position.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Radial spell buttons */}
            <div className="relative w-48 h-48">
              {spells.map((spell, i) => {
                const angle = (i / spells.length) * Math.PI * 2 - Math.PI / 2
                const radius = 70
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                  <motion.button
                    key={spell.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="absolute w-12 h-12 rounded-full bg-surface/90 border border-primary/30 hover:border-primary hover:bg-primary/20 flex items-center justify-center text-2xl cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{
                      left: `calc(50% + ${x}px - 24px)`,
                      top: `calc(50% + ${y}px - 24px)`
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect(spell.id)
                    }}
                    title={`${spell.content} (${spell.myTermsMapping})`}
                  >
                    {spell.emoji}
                    <span className="absolute -bottom-5 text-[10px] text-text-muted font-mono">
                      {i + 1}
                    </span>
                  </motion.button>
                )
              })}

              {/* Center info */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="text-xs text-text-muted">cast spell</div>
                <div className="text-[10px] text-primary/60 font-mono mt-1">
                  {stats.spellsCast} cast
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rendered spell nodes */}
      {spellNodes.map(node => (
        <motion.div
          key={node.id}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: node.opacity }}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: node.x,
            top: node.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div
            className="relative"
            style={{
              filter: `drop-shadow(0 0 ${node.opacity * 8}px rgba(239, 159, 39, ${node.opacity * 0.5}))`
            }}
          >
            <span className="text-3xl">{node.emoji}</span>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[9px] text-amber-400/80 font-mono">
                {node.content.length > 12 ? node.emoji : node.content}
              </span>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Selected spell cursor indicator */}
      {selectedSpell && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9997] pointer-events-none"
        >
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface/90 px-4 py-2 rounded-full border border-primary/30 text-sm text-text-muted">
            Click to cast {DEFAULT_SPELLS.find(s => s.id === selectedSpell)?.emoji} • ESC to cancel
          </div>
        </motion.div>
      )}

      {/* Training progress indicator - comprehensive .soul stats (hidden on mobile) */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:block fixed bottom-4 right-4 z-[9990] pointer-events-none"
          >
            <div className="bg-surface/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-surface/50 text-right max-w-[320px]">
          <div className="text-[10px] text-text-muted font-mono tracking-wide mb-1 leading-tight">
            {LEARNING_SPELLS_FORMING_BLADE}
          </div>

          {/* Primary stats row */}
          <div className="flex items-center gap-3 justify-end flex-wrap">
            <div className="text-xs text-text-muted">
              <span className="text-amber-400">{stats.spellsCast}</span> cast
            </div>
            <div className="text-xs text-text-muted">
              <span className="text-emerald-400">{stats.convergences}</span> ⊥
            </div>
            <div className="text-xs text-text-muted">
              <span className="text-primary">{stats.sectionsVisited}</span>/{stats.totalSections}
            </div>
          </div>

          {/* Soul stats row */}
          {soulStats && (
            <div
              className="flex flex-wrap justify-end gap-x-3 gap-y-0.5 mt-1.5 pt-1.5 border-t border-surface/40 text-[10px] text-text-muted"
              title="Proverbs inscribed, blades witnessed, skills selected"
            >
              <span title="Proverbs inscribed + custom">
                <span className="text-violet-400">{soulStats.totalProverbs}</span> proverbs
              </span>
              <span title="Blades in inventory">
                <span className="text-amber-300">{soulStats.bladesWitnessed}</span> blades
              </span>
              {soulStats.skillsSelected > 0 && (
                <span title="Skills selected">
                  <span className="text-cyan-400">{soulStats.skillsSelected}</span> skills
                </span>
              )}
            </div>
          )}

          {/* Spellbook progress row */}
          {soulStats && soulStats.totalSpellbookNodesComplete > 0 && (
            <div
              className="flex flex-wrap justify-end gap-x-2 gap-y-0.5 mt-1 text-[9px] text-text-muted/70"
              title="Spellbook nodes completed"
            >
              {soulStats.spellbooks.story.acts > 0 && (
                <span>story:{soulStats.spellbooks.story.acts}</span>
              )}
              {soulStats.spellbooks.zero.tales > 0 && (
                <span>zero:{soulStats.spellbooks.zero.tales}</span>
              )}
              {soulStats.spellbooks.canon.chapters > 0 && (
                <span>canon:{soulStats.spellbooks.canon.chapters}</span>
              )}
              {soulStats.spellbooks.society.chapters > 0 && (
                <span>society:{soulStats.spellbooks.society.chapters}</span>
              )}
              {soulStats.spellbooks.plurality.acts > 0 && (
                <span>plurality:{soulStats.spellbooks.plurality.acts}</span>
              )}
            </div>
          )}

          {/* Extended stats row */}
          {soulStats && (
            <div
              className="flex flex-wrap justify-end gap-x-3 gap-y-0.5 mt-1 text-[10px] text-text-muted"
              title="Hexagram casts, web connections, inscribed acts"
            >
              {stats.hexagramCasts > 0 && (
                <span>
                  <span className="text-violet-400">{stats.hexagramCasts}</span> 卦
                </span>
              )}
              {soulStats.webConnections > 0 && (
                <span title="Constellation web connections">
                  <span className="text-sky-400">{soulStats.webConnections}</span> links
                </span>
              )}
              {stats.inscribedActs > 0 && (
                <span>
                  <span className="text-amber-300/90">{stats.inscribedActs}</span> inscribed
                </span>
              )}
              {stats.drakeUnlocked && (
                <span className="text-amber-400" title="Drake spell unlocked">
                  🐉
                </span>
              )}
            </div>
          )}

          {/* Progress bar */}
          <div className="mt-2 h-1.5 bg-surface rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                soulStats?.soulReady
                  ? 'bg-gradient-to-r from-amber-500 via-violet-500 to-emerald-400'
                  : 'bg-gradient-to-r from-primary via-amber-400 to-emerald-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${soulStats?.overallProgress ?? stats.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-[9px] text-text-muted/50">
              {soulStats?.overallProgress ?? stats.progress}% soul
            </span>
            {soulStats?.soulReady && (
              <span className="text-[10px] text-emerald-400 font-mono">
                ✓ .soul ready
              </span>
            )}
            {!soulStats?.soulReady && stats.pathUnlocked && (
              <span className="text-[10px] text-emerald-400/70 font-mono">
                ✓ orbs unlocked
              </span>
            )}
          </div>

          {/* Convergence status */}
          {soulStats?.convergenceReady && (
            <div className="mt-1.5 pt-1.5 border-t border-emerald-500/30">
              <span className="text-[10px] text-emerald-400">
                💎 {soulStats.convergenceReady === 'true' ? 'True' : soulStats.convergenceReady} convergence ready
              </span>
            </div>
          )}

          {/* Persona indicator */}
              {soulStats?.personaName && (
                <div className="mt-1 text-[9px] text-primary/70">
                  persona: {soulStats.personaName}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint removed - using OrbControlPanel instead */}
    </>
  )
}
