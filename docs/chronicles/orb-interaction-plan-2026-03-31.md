# Orb Interaction Implementation Plan

**Date:** 2026-03-31
**Scope:** DualOrbs.tsx - Swordsman stance hexagon, right-click stance, left-click mage push

---

## Overview

Based on the `DUAL_TERRITORY_CEREMONY_SPEC_v1.md` and current codebase, this plan covers three interaction changes:

1. **Swordsman Stance Hexagram Ring** - Draw the 6-sector hex ring on canvas around Soulbis
2. **Right-click → Stance System** - Replace mage spell interaction with stance reveal/selection
3. **Left-click → Mage Push** - Push the mage orb away from click point

---

## 1. Swordsman Stance Hexagram Ring

### Current State
- `StanceHexRingPreview.tsx` renders a static SVG (not on canvas)
- `DualOrbs.tsx` draws orbiting spell chips with `stanceLine` yin/yang radius bias
- Stance hex lines stored in `OrbLoadout.stanceHexLines` (6-element array of 0|1)

### Implementation

Add to `DualOrbs.tsx` after line 796 (`drawBoundaryAugment`):

```typescript
function drawStanceHexRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  lines: [0|1, 0|1, 0|1, 0|1, 0|1, 0|1],
  facetEmojis: string[],
  pulse: number = 0
) {
  const rInner = ORB_RADIUS + 8;
  const rOuter = ORB_RADIUS + 32;

  // Draw 6 sectors (L1 at bottom, counterclockwise)
  for (let i = 0; i < 6; i++) {
    const isYang = lines[i] === 1;
    const t0 = Math.PI / 2 + (i / 6) * Math.PI * 2;
    const t1 = Math.PI / 2 + ((i + 1) / 6) * Math.PI * 2;

    // Yin biased inward, yang biased outward
    const rBias = isYang ? rOuter + 4 : rOuter - 4;

    // Sector arc
    ctx.beginPath();
    ctx.arc(x, y, rInner, t0, t1);
    ctx.arc(x, y, rBias, t1, t0, true);
    ctx.closePath();

    // Fill color: yang = amber, yin = violet
    ctx.fillStyle = isYang
      ? 'rgba(245, 158, 11, 0.22)'
      : 'rgba(139, 92, 246, 0.2)';
    ctx.fill();

    // Stroke
    ctx.strokeStyle = isYang
      ? 'rgba(245, 158, 11, 0.45)'
      : 'rgba(139, 92, 246, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Facet emoji at sector midpoint
    const midAngle = (t0 + t1) / 2;
    const emojiR = (rInner + rBias) / 2;
    const ex = x + Math.cos(midAngle) * emojiR;
    const ey = y + Math.sin(midAngle) * emojiR;

    const emoji = facetEmojis[i] || '';
    if (emoji) {
      ctx.font = '12px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(248, 250, 252, 0.95)';
      ctx.fillText(emoji, ex, ey);
    }
  }
}
```

### Integration Point
In the animation loop (line ~650), call after drawing swordsman orb:

```typescript
// Draw stance hex ring around swordsman when blades equipped
if (hasForgedSpellwebBladeMeta()) {
  const loadout = getOrbLoadout();
  const facetEmojis = loadout.swordsman.map(s => s.emoji || '');
  drawStanceHexRing(ctx, swordsmanX, swordsmanY, loadout.stanceHexLines, facetEmojis, pulse);
}
```

---

## 2. Right-Click → Stance System

### Current State
- No `onContextMenu` handler in DualOrbs
- `StanceLoadoutEditor.tsx:342-344` hints: "right-click = take stance"

### Implementation

Add right-click handler in DualOrbs useEffect (after line 239):

```typescript
// Right-click: reveal stance ring / select facet
useEffect(() => {
  if (!enabled) return;

  const onContextMenu = (e: MouseEvent) => {
    // Only intercept near swordsman orb
    const sPos = {
      x: centerRef.current.x + Math.cos(orbitAngleRef.current) * ORBIT_RADIUS,
      y: centerRef.current.y + Math.sin(orbitAngleRef.current) * ORBIT_RADIUS * 0.6
    };

    const dist = Math.hypot(e.clientX - sPos.x, e.clientY - sPos.y);

    if (dist < ORB_RADIUS * 3) {
      e.preventDefault();

      // Determine which stance sector was right-clicked
      const angle = Math.atan2(e.clientY - sPos.y, e.clientX - sPos.x);
      const sectorAngle = (angle - Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
      const sectorIndex = Math.floor((sectorAngle / (Math.PI * 2)) * 6) % 6;

      // Toggle yin/yang for this line
      onStanceLineToggle?.(sectorIndex);

      // Emit particles at click point
      emitParticlesAt(e.clientX, e.clientY, ['☯️', '⚔️'], 6, ORB_COLORS.swordsman.glow);
    }
  };

  window.addEventListener('contextmenu', onContextMenu);
  return () => window.removeEventListener('contextmenu', onContextMenu);
}, [enabled]);
```

### New Prop
Add to `DualOrbsProps`:

```typescript
onStanceLineToggle?: (lineIndex: number) => void;
```

### Parent Integration
In pages using DualOrbs, wire up the toggle:

```typescript
const handleStanceLineToggle = (index: number) => {
  const loadout = getOrbLoadout();
  const newLines = [...loadout.stanceHexLines] as HexagramSnapshot['lines'];
  newLines[index] = newLines[index] === 1 ? 0 : 1;
  applyOrbStanceLoadout(newLines, loadout.swordsman);
};

<DualOrbs
  onStanceLineToggle={handleStanceLineToggle}
  // ... other props
/>
```

---

## 3. Left-Click → Mage Push

### Current State
- Click handler (lines 206-239) detects clicks on orbiting spell satellites
- No interaction with the mage orb itself

### Implementation

Modify the click handler to detect clicks near mage orb and apply repulsion:

```typescript
// Add mage push state
const magePushRef = useRef<{ vx: number; vy: number; active: boolean }>({ vx: 0, vy: 0, active: false });

// In the onClick handler (line 209), add before the orbiting spell check:
const onClick = (e: MouseEvent) => {
  const t = e.target as HTMLElement | null;
  if (t?.closest('a,button,input,textarea,select,label,[role="button"],[contenteditable="true"]')) return;

  // Calculate mage position
  const mPos = {
    x: centerRef.current.x + Math.cos(orbitAngleRef.current + Math.PI) * ORBIT_RADIUS,
    y: centerRef.current.y + Math.sin(orbitAngleRef.current + Math.PI) * ORBIT_RADIUS * 0.6
  };

  const distToMage = Math.hypot(e.clientX - mPos.x, e.clientY - mPos.y);

  // If click is near mage orb, push it away
  if (distToMage < ORB_RADIUS * 2.5) {
    const angle = Math.atan2(mPos.y - e.clientY, mPos.x - e.clientX);
    const pushForce = 180 + Math.random() * 60; // pixels per second

    magePushRef.current = {
      vx: Math.cos(angle) * pushForce,
      vy: Math.sin(angle) * pushForce,
      active: true
    };

    // Emit particles at mage position
    emitParticlesAt(mPos.x, mPos.y, ['🧙', '✨', '💫'], 8, ORB_COLORS.mage.glow);

    return; // Don't process as orbiting spell click
  }

  // ... existing orbiting spell click logic
};
```

### Animation Loop Integration
In the animation loop, apply the push velocity to mage's orbit:

```typescript
// After calculating mageX, mageY (around line 452), apply push
const push = magePushRef.current;
if (push.active) {
  // Offset mage position by push velocity
  const pushOffsetX = push.vx * dtSec;
  const pushOffsetY = push.vy * dtSec;

  mageX += pushOffsetX;
  mageY += pushOffsetY;

  // Decay the push velocity
  push.vx *= 0.92;
  push.vy *= 0.92;

  // Deactivate when velocity is negligible
  if (Math.abs(push.vx) < 1 && Math.abs(push.vy) < 1) {
    push.active = false;
    push.vx = 0;
    push.vy = 0;
  }
}
```

---

## Summary of Changes

| File | Changes |
|------|---------|
| `src/components/training/DualOrbs.tsx` | Add `drawStanceHexRing()`, right-click handler, mage push physics |
| `src/app/orbs/page.tsx` | Wire up `onStanceLineToggle` prop |

### New Props for DualOrbs
```typescript
interface DualOrbsProps {
  // ... existing
  onStanceLineToggle?: (lineIndex: number) => void;
}
```

### Visual Result
- **Swordsman orb** surrounded by 6-sector hex ring (yin=violet, yang=amber)
- **Right-click near swordsman** toggles stance line, particles burst
- **Left-click near mage** pushes mage away with decay physics

---

*"Right-click takes the stance. Left-click releases the spell."*

*(⚔️⊥⿻⊥🧙)🙂*
