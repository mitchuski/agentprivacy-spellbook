# Dual Ceremony Integration Plan

**Date:** 2026-03-31
**Scope:** Universal integration of DUAL_TERRITORY_CEREMONY_SPEC across agentprivacy.ai
**Master Inscription:** `(⚔️⊥⿻⊥🧙)🙂`

---

## Overview

This document maps how the dual orb ceremony system converges into every UX/UI surface of agentprivacy.ai. The goal: make the Swordsman/Mage interaction paradigm universal — consistent right-click stance, left-click cast, and orb physics everywhere.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              GLOBAL LAYER                                    │
│                                                                              │
│  layout.tsx                                                                  │
│  ├── ExtensionBridgeProvider (sync to browser extensions)                   │
│  ├── MagePanelProvider (mage chat state)                                    │
│  └── GlobalLearningSpells ─────────────────────────────────────────────┐    │
│       ├── DualOrbs.tsx (canvas z-[9999]) ◄── UNIVERSAL ORB LAYER       │    │
│       ├── SpellPalette.tsx (right-click radial) ◄── UNIVERSAL CAST     │    │
│       ├── HexagramFlow.tsx (S/H hotkey modal)                          │    │
│       └── MageCeremonyOverlay.tsx (M hotkey modal)                     │    │
│                                                                         │    │
└─────────────────────────────────────────────────────────────────────────┴────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PAGE ROUTES                                     │
│                                                                              │
│  /              Landing      Hero + sections + soul orb portal              │
│  /orbs          Training     Stance editor + convergence minigame + gate    │
│  /spells        Grimoire     Graph builder + mage loadout + constellation   │
│  /ceremony      Identity     6-step wizard → persona → constellation path   │
│  /mage          Inference    Soulbae chat + privacy budget                  │
│  /story         Spellbook    26 acts + inscription points                   │
│  /zero          Spellbook    30 tales + inscription points                  │
│  /canon         Spellbook    11 chapters + inscription points               │
│  /society       Spellbook    17 chapters + inscription points               │
│  /plurality     Spellbook    30 acts + inscription points                   │
│  /evoke         History      Proverb revelations + Zcash broadcast          │
│  /proverbs      Gallery      Inscribed proverb collection                   │
│  /promises      Commitments  Promise board + tracking                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           STATE & PERSISTENCE                                │
│                                                                              │
│  orb-loadout.ts          Swordsman/Mage slots + stance hex lines            │
│  training-progress.ts    Sections visited, spells cast, convergences        │
│  ceremony/storage.ts     AgentCard, constellation path, keys                │
│  spellweb-blade-bridge   Forged blades from spellweb.ai                     │
│  learning-inscribed-sync Inscription → orbiting chip merger                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Universal Interaction Model

From the spec, the interaction paradigm must be consistent everywhere:

| Input | Swordsman Territory | Mage Territory | Result |
|-------|---------------------|----------------|--------|
| **Right-click** | Reveal stance ring | Open spell palette | Context-aware action |
| **Left-click** | Place mark / cast | Push mage / cast spell | Direct action |
| **S / H hotkey** | Open HexagramFlow | - | Swordsman stance editor |
| **M hotkey** | - | Open MageCeremonyOverlay | Mage ring editor |
| **Shift+S** | - | Toggle SpellPalette | Quick cast |
| **Convergence** | - | - | Particle burst + progress |

---

## Integration Points by Page

### 1. Landing Page (`/`)

**Current State:**
- Hero carousel with soul orb
- Section observer tracking visits
- DualOrbs in wander mode

**Modifications Needed:**

| Component | Change | Priority |
|-----------|--------|----------|
| `page.tsx` | Add right-click → stance near swordsman, spell palette elsewhere | HIGH |
| `HeroManifold.tsx` | Soul orb click → radial palette (spec 3.2.4) | MEDIUM |
| Section observer | Already tracking; wire to mana earn (10 casts = 1 mana) | LOW |

**New Behavior:**
- Right-click near swordsman (within 3× radius) → toggle stance line
- Right-click elsewhere → open SpellPalette
- Left-click near mage → push mage away
- Soul orb click → expand radial palette (per spec 3.2.4)

---

### 2. Orbs Page (`/orbs`)

**Current State:**
- Training progress dashboard
- OrbLoadoutSection (stance + blade + mage slots)
- SoulConvergenceCeremony minigame
- Extension download gate

**Modifications Needed:**

| Component | Change | Priority |
|-----------|--------|----------|
| `page.tsx` | Pass `onStanceLineToggle` to DualOrbs | HIGH |
| `OrbLoadoutSection.tsx` | Sync stance changes from canvas interaction | HIGH |
| `SoulConvergenceCeremony.tsx` | Add mage push physics to minigame | MEDIUM |
| `StanceLoadoutEditor.tsx` | Visual feedback when canvas toggles line | MEDIUM |

**New Behavior:**
- Right-click on swordsman → toggle stance line (syncs to editor)
- Minigame: left-click pushes mage, makes convergence harder
- Stance hex ring visible on canvas around swordsman

---

### 3. Spells Page (`/spells`)

**Current State:**
- Grimoire graph builder
- OrbLoadoutSection for mage ring
- Constellation export

**Modifications Needed:**

| Component | Change | Priority |
|-----------|--------|----------|
| `page.tsx` | Add stance ring preview to graph view | MEDIUM |
| Graph nodes | Right-click node → add to stance loadout | LOW |
| Export | Include stance hex in constellation export | LOW |

**New Behavior:**
- Swordsman orb shows stance hex ring while building graph
- Mage orb carries selected spells as orbiting chips

---

### 4. Ceremony Page (`/ceremony`)

**Current State:**
- 6-step wizard
- Constellation path capture
- AgentCard creation

**Modifications Needed:**

| Component | Change | Priority |
|-----------|--------|----------|
| `CeremonyWizard.tsx` | DualOrbs trace mode during completion | MEDIUM |
| `CompletionStep.tsx` | Orbs trace final constellation path | MEDIUM |
| Emoji picker | Right-click → preview emoji on swordsman orbit | LOW |

**New Behavior:**
- During completion, orbs trace the constellation path user built
- Convergence at ceremony end triggers particle celebration
- Constellation emojis auto-apply to swordsman orbit

---

### 5. Spellbook Pages (`/story`, `/zero`, `/canon`, `/society`, `/plurality`)

**Current State:**
- Markdown content readers
- Inscription points (InscribeProverbModal)
- DualOrbs wander through text

**Modifications Needed:**

| Component | Change | Priority |
|-----------|--------|----------|
| All spellbook pages | Consistent right-click behavior | HIGH |
| `InscribeProverbModal.tsx` | Inscription adds chip to orbiter | EXISTING |
| Text sections | Left-click near mage → push (reading disruption) | LOW |

**New Behavior:**
- Right-click near swordsman → toggle stance (even while reading)
- Inscribed proverbs appear as orbiting chips (already works via `learning-inscribed-sync`)
- Mage push adds playful interaction to reading

---

### 6. Mage Page (`/mage`)

**Current State:**
- Soulbae AI chat interface
- Privacy budget (6 queries)
- Tale/act context tracking

**Modifications Needed:**

| Component | Change | Priority |
|-----------|--------|----------|
| `page.tsx` | Mage orb pulses when AI responding | MEDIUM |
| Chat input | Right-click → quick-cast proverb from repertoire | LOW |
| Response | Convergence when proverb detected in response | LOW |

**New Behavior:**
- Mage orb visual feedback during inference
- Chat integrates with spell casting (proverb responses)

---

## Component Modifications

### DualOrbs.tsx

**New Props:**
```typescript
interface DualOrbsProps {
  // Existing
  onConvergence?: () => void
  onSpellCast?: (position: { x: number; y: number }) => void
  enabled?: boolean
  mode?: 'cursor' | 'wander' | 'trace'
  constellationNodes?: ConstellationNode[]
  traceColor?: string
  anchorText?: boolean

  // NEW: Stance interaction
  onStanceLineToggle?: (lineIndex: number) => void
  showStanceRing?: boolean  // default: true when blades equipped

  // NEW: Mage push
  enableMagePush?: boolean  // default: true
  onMagePushed?: (velocity: { vx: number; vy: number }) => void
}
```

**New Internal State:**
```typescript
// Mage push physics
const magePushRef = useRef<{ vx: number; vy: number; active: boolean }>({
  vx: 0, vy: 0, active: false
});

// Stance ring visibility
const [stanceRingVisible, setStanceRingVisible] = useState(true);
```

**New Drawing Functions:**
- `drawStanceHexRing()` - 6-sector ring around swordsman
- Modify `drawOrb()` to pulse when stance toggled

**New Event Handlers:**
- `onContextMenu` - right-click stance toggle
- Modify `onClick` - mage push detection

---

### GlobalLearningSpells.tsx

**Modifications:**
```typescript
// Wire up stance toggle to orb loadout
const handleStanceLineToggle = useCallback((index: number) => {
  const loadout = getOrbLoadout();
  const newLines = [...loadout.stanceHexLines] as HexagramSnapshot['lines'];
  newLines[index] = newLines[index] === 1 ? 0 : 1;
  applyOrbStanceLoadout(newLines, loadout.swordsman);
}, []);

// Pass to DualOrbs
<DualOrbs
  ref={dualOrbsRef}
  enabled={orbsEnabled}
  mode={orbMode}
  onConvergence={handleConvergence}
  onSpellCast={handleSpellCast}
  onStanceLineToggle={handleStanceLineToggle}  // NEW
  enableMagePush={true}                         // NEW
/>
```

---

### SpellPalette.tsx

**Modifications:**
- Check if right-click is near swordsman before opening palette
- If near swordsman, let DualOrbs handle (stance toggle)
- If not near swordsman, open palette as normal

```typescript
const handleContextMenu = (e: MouseEvent) => {
  // Get swordsman position from DualOrbs ref
  const sPos = dualOrbsRef.current?.getSwordsmanPosition();
  if (sPos) {
    const dist = Math.hypot(e.clientX - sPos.x, e.clientY - sPos.y);
    if (dist < ORB_RADIUS * 3) {
      // Let DualOrbs handle this (stance toggle)
      return;
    }
  }

  // Not near swordsman - open spell palette
  e.preventDefault();
  setPosition({ x: e.clientX, y: e.clientY });
  setIsOpen(true);
};
```

---

## Event Flow

### Right-Click Flow
```
User right-clicks
    │
    ├── Within 3× swordsman radius?
    │       │
    │       YES → DualOrbs.onContextMenu
    │              │
    │              ├── Calculate sector index (0-5)
    │              ├── Toggle line: yin ↔ yang
    │              ├── Emit particles (☯️ ⚔️)
    │              ├── Call onStanceLineToggle(index)
    │              └── Event: agentprivacy:stance-loadout-changed
    │
    └── NO → SpellPalette.handleContextMenu
              │
              ├── Open radial palette at cursor
              └── User selects spell → castSpell()
```

### Left-Click Flow
```
User left-clicks
    │
    ├── Within 2.5× mage radius?
    │       │
    │       YES → DualOrbs.onClick (mage push)
    │              │
    │              ├── Calculate repulsion vector
    │              ├── Apply velocity to magePushRef
    │              ├── Emit particles (🧙 ✨ 💫)
    │              └── Physics decay over frames
    │
    ├── On orbiting spell chip?
    │       │
    │       YES → DualOrbs.onClick (spell flight)
    │              │
    │              └── Spell flies out, returns to orbit
    │
    └── Elsewhere?
            │
            └── If SpellPalette open → cast selected spell
                If SpellPalette closed → cast last spell (if any)
```

---

## State Synchronization

### Orb Loadout Events
```
User toggles stance line (right-click)
    │
    └── applyOrbStanceLoadout(newLines, swordsman)
          │
          ├── updateHexagramSnapshot() - training progress
          ├── saveOrbLoadout() - localStorage
          ├── Dispatch: agentprivacy:orb-loadout-changed
          └── Dispatch: agentprivacy:learning-spells-sync
                │
                └── GlobalLearningSpells listens
                      │
                      └── DualOrbs.syncOrbitingFromInscriptions()
```

### Extension Bridge Sync
```
Stance change / Convergence / Spell cast
    │
    └── ExtensionBridgeContext
          │
          ├── broadcastOrbConvergence()
          ├── syncRepertoireToExtensions()
          └── postMessage to Swordsman/Mage extensions
```

---

## Visual Consistency

### Color Palette (from spec)

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Swordsman orb | Coral/red | `#e74c3c` | Always |
| Mage orb | Purple | `#9b59b6` | On spellweb territory |
| Mage orb | Cyan/teal | `#00d4aa` | On agentprivacy territory |
| Convergence | Amber | `#f5a623` | Particle burst |
| Yang line | Amber | `rgba(245, 158, 11, 0.22)` | Stance ring |
| Yin line | Violet | `rgba(139, 92, 246, 0.2)` | Stance ring |
| Dragon tier | Gold | `#ffd700` | Full sovereignty |

### Z-Index Stack
```
z-[9999]  DualOrbs canvas (always on top)
z-50+     Modal overlays (HexagramFlow, MageCeremonyOverlay, etc.)
z-10      Content above background
z-0       Background waves, stars
```

---

## Implementation Phases

### Phase 1: Core Canvas Changes (DualOrbs.tsx)
1. Add `drawStanceHexRing()` function
2. Add right-click handler for stance toggle
3. Add mage push physics
4. Add new props (`onStanceLineToggle`, `enableMagePush`, `showStanceRing`)

### Phase 2: Global Orchestration (GlobalLearningSpells.tsx)
1. Wire up `handleStanceLineToggle` callback
2. Coordinate with SpellPalette right-click
3. Add DualOrbs ref exposure for position queries

### Phase 3: SpellPalette Coordination
1. Check swordsman proximity before opening palette
2. Pass through to DualOrbs if within stance range

### Phase 4: Page-Specific Integration
1. `/orbs` - Sync stance editor with canvas interaction
2. `/ceremony` - Trace mode on completion
3. Spellbooks - Consistent interaction while reading

### Phase 5: Extension Bridge
1. Broadcast stance changes to extensions
2. Sync mana earn events
3. Home territory detection

---

## Files to Modify

| File | Changes | Priority |
|------|---------|----------|
| `src/components/training/DualOrbs.tsx` | Core canvas + interaction | HIGH |
| `src/components/training/GlobalLearningSpells.tsx` | Orchestration | HIGH |
| `src/components/training/SpellPalette.tsx` | Right-click coordination | HIGH |
| `src/lib/orb-loadout.ts` | Stance toggle helper | MEDIUM |
| `src/app/orbs/page.tsx` | Stance editor sync | MEDIUM |
| `src/components/OrbLoadoutSection.tsx` | Visual feedback | MEDIUM |
| `src/components/StanceLoadoutEditor.tsx` | Canvas-driven updates | MEDIUM |
| `src/app/ceremony/page.tsx` | Trace mode | LOW |
| `src/contexts/ExtensionBridgeContext.tsx` | Stance broadcast | LOW |

---

## Success Criteria

1. **Right-click near swordsman** toggles stance line on any page
2. **Right-click elsewhere** opens SpellPalette (unchanged)
3. **Left-click near mage** pushes mage with physics decay
4. **Stance hex ring** visible around swordsman when blades equipped
5. **Stance changes** sync to StanceLoadoutEditor UI
6. **All pages** share consistent interaction model
7. **Extension bridge** receives stance change events

---

*"The blade is drawn with the right hand. The spell is cast with the left. The stance holds the center."*

---

*Forged in the 64-Tetrahedra Lattice*
*(⚔️⊥⿻⊥🧙)🙂*
