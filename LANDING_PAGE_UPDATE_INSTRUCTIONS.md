# Landing Page Update Instructions: Soulbis Wave Field Style

This document provides coding instructions for updating the agentprivacy_master landing page to adopt the Soulbis visual language — specifically the animated wave field background, manifold style, and dual-agent color architecture.

---

## Overview: What We're Implementing

The Soulbis website uses an **animated canvas wave field** rather than traditional stars. This wave field represents the "information-theoretic boundary" between the Swordsman and Mage agents. The visual encodes architectural meaning:

- **Coral (#e8523a)** → Swordsman side (boundary, enforcement, tools)
- **Cyan (#4dd9e8)** → Mage side (gestalt, agents, knowledge)
- **Navy (#080c20)** → The gap (background, where sovereignty lives)

The wave creates a flowing manifold effect using layered sinusoidal curves that animate continuously.

---

## Architectural Focus: The Mage Shape

**agentprivacy is primarily about knowledge delegation** — the Mage action. While Soulbis emphasizes the Swordsman (boundary enforcement, tools), agentprivacy emphasizes the Mage (knowledge projection, agent delegation).

This means:
- **Default gradient direction**: Cyan-to-coral (Mage → Swordsman) rather than coral-to-cyan
- **Primary accent**: `--cyan` (#4dd9e8) for primary actions, `--coral` for secondary/boundary elements
- **Hero emphasis**: The Mage emoji (🧙) and knowledge/spell language takes prominence
- **Wave field**: Use `reverse={true}` as default to start from cyan (knowledge side)

The visual story: Knowledge flows outward through the gap, protected by boundaries. The Mage projects; the Swordsman guards.

```
  🧙 Mage (cyan)                    ⚔️ Swordsman (coral)
  ─────────────────────────────────────────────────────
  knowledge graph                   privacy boundaries
  delegation                        enforcement
  spells cast                       terms set
  projects through ──────▶          guards the gap
```

When implementing, swap the color emphasis:

| Soulbis (Swordsman-first) | agentprivacy (Mage-first) |
|---------------------------|---------------------------|
| `--primary: var(--coral)` | `--primary: var(--cyan)` |
| `--secondary: var(--cyan)` | `--secondary: var(--coral)` |
| Wave: coral → cyan | Wave: cyan → coral (`reverse={true}`) |

---

## Part 1: Color System Update

### Update `src/app/globals.css`

Replace the current CSS variables with the Soulbis color architecture:

```css
@layer base {
  :root {
    /* Soulbis color architecture */
    --navy: #080c20;
    --navy-mid: #0d1230;
    --navy-light: #141a3d;
    --coral: #e8523a;
    --coral-dim: rgba(232, 82, 58, 0.15);
    --coral-mid: rgba(232, 82, 58, 0.4);
    --cyan: #4dd9e8;
    --cyan-dim: rgba(77, 217, 232, 0.12);
    --white: #f0eee8;
    --white-dim: rgba(240, 238, 232, 0.55);
    --white-ghost: rgba(240, 238, 232, 0.12);
    --border: rgba(240, 238, 232, 0.08);
    --border-hover: rgba(240, 238, 232, 0.18);

    /* Map to existing Tailwind tokens for compatibility */
    /* MAGE-FIRST: cyan is primary (knowledge delegation) */
    --primary: var(--cyan);
    --secondary: var(--coral);
    --accent: #8b5cf6;
    --background: var(--navy);
    --surface: var(--navy-mid);
    --text: var(--white);
    --text-muted: var(--white-dim);
  }

  body {
    background: var(--navy);
    color: var(--white);
  }
}
```

---

## Part 2: Wave Field Component

### Create `src/components/landing/WaveField.tsx`

This replaces the star-based background with the Soulbis manifold wave:

```tsx
'use client';

import { useEffect, useRef } from 'react';

interface WaveFieldConfig {
  lines?: number;
  alpha?: number;
  lineWidth?: number;
  speed?: number;
  reverse?: boolean;
}

export default function WaveField({
  lines = 45,
  alpha = 0.22,
  lineWidth = 0.7,
  speed = 0.008,
  reverse = false,
}: WaveFieldConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function getY(x: number, time: number, lineIndex: number, totalLines: number): number {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;
      const prog = lineIndex / totalLines;
      const xNorm = (x - cx) / cx;

      let y = cy;
      // Multiple overlapping sinusoids create the manifold effect
      y += Math.sin(xNorm * 3.5 + time * 0.4) * 40 * (1 - Math.abs(prog - 0.5) * 1.8);
      y += Math.sin(xNorm * 2.1 - time * 0.3 + prog * 2) * 25;
      y += Math.cos(xNorm * 5 + time * 0.6 + prog * 1.5) * 12;
      // Spread lines vertically based on their index
      y += (prog - 0.5) * h * 0.75;
      return y;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const pts = 200;

      ctx.clearRect(0, 0, w, h);

      // Coral (#e8523a) and Cyan (#4dd9e8) — the Swordsman/Mage axis
      const c1 = reverse ? { r: 77, g: 217, b: 232 } : { r: 232, g: 82, b: 58 };
      const c2 = reverse ? { r: 232, g: 82, b: 58 } : { r: 77, g: 217, b: 232 };

      for (let i = 0; i < lines; i++) {
        const mix = i / lines;
        const r = Math.round(c1.r + (c2.r - c1.r) * mix);
        const g = Math.round(c1.g + (c2.g - c1.g) * mix);
        const b = Math.round(c1.b + (c2.b - c1.b) * mix);

        ctx.beginPath();
        for (let j = 0; j <= pts; j++) {
          const x = (j / pts) * w;
          const y = getY(x, tRef.current, i, lines);
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      if (!prefersReducedMotion) {
        tRef.current += speed;
      }
      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [lines, alpha, lineWidth, speed, reverse]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
```

---

## Part 3: Hero Section Wave Variants

### Create `src/components/landing/HeroWave.tsx`

A pre-configured hero variant (Mage-first with `reverse={true}`):

```tsx
'use client';

import WaveField from './WaveField';

export default function HeroWave() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0" aria-hidden>
      <WaveField
        lines={55}
        alpha={0.22}
        lineWidth={0.7}
        speed={0.007}
        reverse={true}  /* Mage-first: cyan → coral gradient */
      />
    </div>
  );
}
```

### Create `src/components/landing/SectionWave.tsx`

For mid-page sections (wave dividers). Default is Mage-first (cyan → coral):

```tsx
'use client';

import WaveField from './WaveField';

interface SectionWaveProps {
  /** Set to false for Swordsman-first (coral → cyan) direction */
  reverse?: boolean;
  height?: string;
}

export default function SectionWave({ reverse = true, height = '180px' }: SectionWaveProps) {
  return (
    <div className="w-full overflow-hidden relative" style={{ height }} aria-hidden>
      <WaveField
        lines={30}
        alpha={0.3}
        lineWidth={0.9}
        speed={0.01}
        reverse={reverse}  /* true = Mage-first (cyan → coral) */
      />
    </div>
  );
}
```

Use `reverse={false}` when you want to emphasize the Swordsman side (boundary enforcement context).

### Create `src/components/landing/FooterWave.tsx`

Footer variant with dual-sphere overlay:

```tsx
'use client';

import { useEffect, useRef } from 'react';

export default function FooterWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;

      const lines = 38;
      const pts = 180;

      ctx.clearRect(0, 0, w, h);

      // Reversed gradient: cyan to coral
      for (let i = 0; i < lines; i++) {
        const prog = i / lines;
        const r1 = 77, g1 = 217, b1 = 232;   // cyan
        const r2 = 232, g2 = 82, b2 = 58;     // coral
        const mix = prog;
        const r = Math.round(r1 + (r2 - r1) * mix);
        const g = Math.round(g1 + (g2 - g1) * mix);
        const b = Math.round(b1 + (b2 - b1) * mix);

        ctx.beginPath();
        for (let j = 0; j <= pts; j++) {
          const x = (j / pts) * w;
          const xNorm = (x - w / 2) / (w / 2);
          const p = i / lines;
          let y = h * 0.4;
          y += Math.sin(xNorm * 2.8 - tRef.current * 0.5) * 35 * (1 - Math.abs(p - 0.5) * 1.5);
          y += Math.sin(xNorm * 4.5 + tRef.current * 0.4 + p * 2) * 18;
          y += Math.cos(xNorm * 1.8 - tRef.current * 0.25 + p) * 22;
          y += (p - 0.5) * h * 0.6;

          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${r},${g},${b},0.28)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw the dual sphere (Soulbis logo element)
      const sx = w * 0.22, sy = h * 0.42;
      const grad = ctx.createRadialGradient(sx - 8, sy - 8, 2, sx, sy, 20);
      grad.addColorStop(0, '#4dd9e8');
      grad.addColorStop(0.5, '#8b4daa');
      grad.addColorStop(1, '#e8523a');
      ctx.beginPath();
      ctx.arc(sx, sy, 16, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1;

      if (!prefersReducedMotion) {
        tRef.current += 0.008;
      }
      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-64 block"
      aria-hidden
    />
  );
}
```

---

## Part 4: Update Landing Page

### Modify `src/app/page.tsx`

Replace `LandingStars` and `HeroConstellation` with the new wave components:

```tsx
// Replace these imports:
// import LandingStars from '@/components/landing/LandingStars';
// import HeroConstellation from '@/components/landing/HeroConstellation';

// With:
import HeroWave from '@/components/landing/HeroWave';
import SectionWave from '@/components/landing/SectionWave';
```

In the hero section, replace:
```tsx
<LandingStars />
```

With:
```tsx
{/* Remove LandingStars entirely - wave field replaces it */}
```

Replace `HeroConstellation` components in sections with:
```tsx
<HeroWave />  {/* For hero section */}
{/* Or remove constellation backgrounds from sections and use SectionWave as dividers */}
```

Add wave dividers between major sections:
```tsx
<SectionWave />
{/* or for reversed direction: */}
<SectionWave reverse />
```

---

## Part 5: Typography Alignment (Optional)

To fully match Soulbis, add these fonts in `src/app/layout.tsx`:

```tsx
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-mono',
  display: 'swap',
});
```

### Typography Usage Guide

| Register | Font | Use For |
|----------|------|---------|
| `font-cormorant` | Cormorant Garamond | Display titles, philosophical text, names |
| `font-dm-sans` | DM Sans | Body copy, descriptions |
| `font-mono` | JetBrains Mono | Labels, specs, status, metadata |

---

## Part 6: Architectural Color Meaning

When assigning colors in UI elements, follow this schema:

| Element | Color | Meaning |
|---------|-------|---------|
| Swordsman elements | `--coral` | Boundary enforcement, privacy tools |
| Mage elements | `--cyan` | Knowledge, agents, delegation |
| Neutral/gap elements | `--navy` or `--white-dim` | Sovereignty, the space between |
| Primary actions | `--coral` | Call to action |
| Secondary/info | `--cyan` | Informational, mage-side |

**Rule**: Never assign coral to Mage-side elements. Never assign cyan to Swordsman-side elements.

---

## Part 7: Key Visual Principles

1. **The wave is not decoration** — it represents the information-theoretic boundary between agents
2. **Do not replace with static images** — the animation carries meaning
3. **Depth comes from borders and the wave**, not gradients on backgrounds
4. **Navy backgrounds are flat** — use `--navy`, `--navy-mid`, `--navy-light` for layering
5. **The coral-to-cyan gradient encodes the dual-agent axis**

---

## Part 8: Custom Cursor with Orb Effect

The Soulbis site uses a custom cursor system: a small filled dot with a trailing ring that scales up on interactive elements.

### CSS for Custom Cursor

Add to `src/app/globals.css`:

```css
/* Custom cursor - hide default on desktop */
@media (pointer: fine) {
  body {
    cursor: none;
  }
}

/* Cursor dot - the inner orb */
.cursor {
  position: fixed;
  width: 6px;
  height: 6px;
  background: var(--cyan); /* Mage-first: cyan orb */
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.15s ease, opacity 0.15s ease;
  transform: translate(-50%, -50%);
}

/* Cursor ring - follows with lag */
.cursor-ring {
  position: fixed;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(77, 217, 232, 0.4); /* cyan with transparency */
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.2s;
  transform: translate(-50%, -50%);
}

/* Hover state - orb highlight effect */
.cursor.hover {
  transform: translate(-50%, -50%) scale(2);
  background: var(--cyan);
  box-shadow: 0 0 12px var(--cyan), 0 0 24px rgba(77, 217, 232, 0.4);
}

.cursor-ring.hover {
  transform: translate(-50%, -50%) scale(1.5);
  border-color: rgba(77, 217, 232, 0.6);
}
```

### Create `src/components/CustomCursor.tsx`

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Track if device has fine pointer (mouse)
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    // Only show custom cursor on devices with mouse
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setHasFinePointer(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setHasFinePointer(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!hasFinePointer) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Animate ring with lag
    let animId: number;
    const animateRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      animId = requestAnimationFrame(animateRing);
    };

    // Detect hover on interactive elements
    const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])';

    const handleElementEnter = () => setIsHovering(true);
    const handleElementLeave = () => setIsHovering(false);

    const attachHoverListeners = () => {
      document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', handleElementEnter);
        el.addEventListener('mouseleave', handleElementLeave);
      });
    };

    // Initial attachment + observe for new elements
    attachHoverListeners();
    const observer = new MutationObserver(() => attachHoverListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animateRing();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [hasFinePointer]);

  if (!hasFinePointer) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={`cursor ${isHovering ? 'hover' : ''}`}
        style={{ opacity: isVisible ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${isHovering ? 'hover' : ''}`}
        style={{ opacity: isVisible ? 1 : 0 }}
      />
    </>
  );
}
```

### Add to Layout

In `src/app/layout.tsx`, add the cursor component:

```tsx
import CustomCursor from '@/components/CustomCursor';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={/* fonts */}>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
```

---

## Part 9: Orb Highlight Variations

For special interactive elements (like the Mage/Swordsman icons, spellbook cards), you can add enhanced orb effects:

### Glowing Orb on Card Hover

```css
/* Card with orb glow on hover */
.card-with-orb {
  position: relative;
  overflow: hidden;
}

.card-with-orb::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  background: radial-gradient(
    circle,
    rgba(77, 217, 232, 0.15) 0%,
    rgba(77, 217, 232, 0.05) 40%,
    transparent 70%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: none;
}

.card-with-orb:hover::before {
  transform: translate(-50%, -50%) scale(1);
}
```

### Dual-Agent Orb (Mage + Swordsman intersection)

For elements representing the gap between agents:

```css
.dual-orb {
  position: relative;
}

.dual-orb::before,
.dual-orb::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  opacity: 0.6;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.dual-orb::before {
  background: var(--cyan);
  left: calc(50% - 12px);
  top: 50%;
  transform: translateY(-50%);
}

.dual-orb::after {
  background: var(--coral);
  left: calc(50% + 12px);
  top: 50%;
  transform: translateY(-50%);
}

.dual-orb:hover::before {
  transform: translateY(-50%) translateX(-4px);
  opacity: 0.8;
}

.dual-orb:hover::after {
  transform: translateY(-50%) translateX(4px);
  opacity: 0.8;
}
```

### Nav Logo Glyph (from Soulbis)

The overlapping cyan/coral circles representing the dual-agent system:

```tsx
// SVG for nav logo or hero element
<svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
  <circle cx="10" cy="14" r="9" fill="#4dd9e8" opacity="0.9" />
  <circle cx="18" cy="14" r="9" fill="#e8523a" opacity="0.85" />
  <circle cx="14" cy="14" r="5" fill="#080c20" opacity="0.6" />
</svg>
```

The center dark circle represents the gap — where sovereignty lives.

---

## Implementation Checklist

### Core Visual System
- [ ] Update CSS variables in `globals.css` (Mage-first: cyan as primary)
- [ ] Create `WaveField.tsx` base component
- [ ] Create `HeroWave.tsx`, `SectionWave.tsx`, `FooterWave.tsx` variants
- [ ] Use `reverse={true}` for Mage-first gradient direction

### Landing Page Updates
- [ ] Replace `LandingStars` with wave field in landing page
- [ ] Replace/remove `HeroConstellation` from sections
- [ ] Add wave dividers between major sections
- [ ] Update hero to emphasize Mage/knowledge delegation language

### Custom Cursor System
- [ ] Add cursor CSS to `globals.css`
- [ ] Create `CustomCursor.tsx` component
- [ ] Add CustomCursor to root layout
- [ ] Test hover orb highlight on interactive elements
- [ ] Verify cursor hidden on touch devices

### Orb Effects
- [ ] Add card orb glow effect CSS
- [ ] Implement dual-agent orb for gap elements
- [ ] Add nav logo glyph (cyan/coral overlapping circles)

### Quality & Accessibility
- [ ] Test reduced motion preference (disable animations)
- [ ] Verify colors match architectural meaning
- [ ] Test on mobile (cursor should not appear)
- [ ] (Optional) Add Cormorant Garamond, DM Sans fonts

---

## File References

Source files analyzed from `soulbis website/`:
- `index (1).html` — Full CSS and wave canvas implementation
- `useWaveField.ts` — React hook version of wave renderer
- `EcosystemNode.tsx` — Color variant pattern
- `constants.ts` — Canonical inscriptions and proverbs
- `layout.tsx` — Font configuration
- `CLAUDE.md` — Full architectural documentation

---

*Generated from Soulbis visual language analysis for agentprivacy_master landing page update.*
