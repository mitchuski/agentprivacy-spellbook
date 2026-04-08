# Codebase Review: Cleanup Opportunities & Orb-Text Effects Planning

**Date:** 2026-03-31
**Scope:** agentprivacy_master codebase review

---

## Part 1: Code Cleanup Opportunities

### HIGH PRIORITY - Files to Remove

| File | Reason | Size Saved |
|------|--------|------------|
| `src/lib/persona-index.ts.backup` | Backup file, no references | ~5KB |
| `oracle-swordsman/src/zcash-client-patch.ts.bak` | Old patch backup | ~3KB |
| `src/data/grimoire-v8-canonical.json` | Superseded by v8.7.0 | 86KB |
| `src/data/privacymage-grimoire-v8.3.1-canonical.json` | Superseded by v8.7.0 | 98KB |
| `src/data/privacymage-grimoire-v8.4.0-canonical.json` | Superseded by v8.7.0 | 136KB |
| `src/components/nexus/` | Empty directory | - |
| `landing-v4.jsx` | Root file, not imported anywhere | 33KB |

**Total recoverable:** ~360KB

### MEDIUM PRIORITY - Deprecated Aliases to Clean

#### 1. Route Redirect (`/path` → `/orbs`)
```
src/app/path/page.tsx
```
- Marked `@deprecated`, just redirects to `/orbs`
- Update any external links, then delete

#### 2. Component Alias (MageOrbitSheet)
```
src/components/training/MageOrbitSheet.tsx
```
- Re-exports MageCeremonyOverlay
- Only imported in `GlobalLearningSpells.tsx`
- Update import, delete alias file

#### 3. Nav Route Alias
```typescript
// src/lib/nav.ts line 41
/** @deprecated Prefer ROUTES.orbs */
path: '/orbs',
```

### LOW PRIORITY - Code Consolidation

#### Duplicate Storage Key Definitions
```typescript
// Defined in TWO places with same value:
const USER_LINKS_STORAGE_KEY = 'agentprivacy-spellweb-user-links';

// src/app/web/page.tsx:31
// src/components/spellweb/SpellwebViewer.tsx:20
```
**Recommendation:** Move to `src/lib/spellweb-keys.ts`

#### Storage Keys Without Version Suffixes
Many keys lack version suffixes which could cause schema migration issues:
- `SPELLBOOK_STORAGE_KEY`
- `ORB_LOADOUT_STORAGE_KEY`
- `REPERTOIRE_STORAGE_KEY`

### Already Archived (No Action Needed)
- `archive/` directory - Documentation and old scripts, properly organized
- `oracle-swordsman/` - Blockchain inscription scripts, may still be needed for operations

---

## Part 2: Story UI Complexity Analysis

### Current Architecture

#### Text Rendering Pipeline
```
/public/story/*.md (26 acts)
       ↓
ReactMarkdown (remarkGfm + rehypeRaw)
       ↓
Custom component overrides (h1, h2, p, blockquote, etc.)
       ↓
DOM: <p class="text-text-muted mb-4 leading-relaxed">
       ↓
Canvas overlay: DualOrbs.tsx (868 lines)
```

#### Key Files
| File | Lines | Purpose |
|------|-------|---------|
| `src/app/story/page.tsx` | 1400 | Main story renderer |
| `src/components/training/DualOrbs.tsx` | 868 | Orb system with canvas |
| `src/app/page.tsx` | 798 | Landing with narrative |

### Existing Orb System Capabilities

**DualOrbs.tsx already has:**
- Canvas-based rendering (60fps animation loop)
- Spring physics for cursor following
- Wander/trace movement modes
- Particle emission system (up to 80 particles)
- Convergence detection (circle collision math)
- Orbiting spell satellites (6 per orb)
- `drawBoundaryAugment()` - draws soft rings around orbs

**Animation loop structure (line 320-730):**
```javascript
const animate = (timestamp) => {
  // 1. Update center position (spring physics)
  // 2. Calculate orb positions
  // 3. Draw elements (glow, lines, particles, orbs)
  animRef.current = requestAnimationFrame(animate)
}
```

---

## Part 3: Orb-Through-Text Effect Planning

### Concept
When orbs pass through story text, create visual effects like:
- Text ripples outward from orb center
- Characters glow or shift color
- Particle emission at text collision
- Subtle displacement/wave effect

### Implementation Options

#### Option A: Canvas Overlay (Recommended)
**Pros:** Best performance, already have canvas infrastructure
**Cons:** Text effects are visual-only, not interactive

```typescript
// Extend DualOrbs.tsx after line 452
if (enableTextAugmentation) {
  const textElements = document.querySelectorAll('.markdown-content p');
  textElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const dist = Math.hypot(
      center.x - (rect.left + rect.width/2),
      center.y - (rect.top + rect.height/2)
    );
    if (dist < TEXT_EFFECT_RADIUS) {
      // Draw glow/ripple on canvas at text position
      drawTextProximityEffect(ctx, rect, dist, orbAngle);
    }
  });
}
```

#### Option B: DOM Transforms
**Pros:** Real text manipulation, more dramatic effects
**Cons:** Performance concerns with many paragraphs

```typescript
// Apply CSS transforms based on orb proximity
el.style.transform = `translateX(${pushX}px) translateY(${pushY}px)`;
el.style.filter = `brightness(${1 + glow})`;
```

#### Option C: Per-Character Effects (Most Complex)
**Pros:** Most immersive, "reading" visualization
**Cons:** Requires text re-rendering, complex performance

```typescript
// Wrap each character in <span>
// Calculate distance per character
// Apply individual transforms/colors
```

### Recommended Implementation

**Phase 1: Canvas Glow Effect**
- Add `textProximityEnabled` prop to DualOrbs
- Query paragraph bounding boxes (cached, updated on scroll)
- Draw radial glow on canvas where orb overlaps text
- Emit particles at text boundaries

**Phase 2: Text Ripple**
- Calculate intersection point with text blocks
- Draw concentric ripples emanating from contact point
- Fade ripples over 500ms

**Phase 3: Character Highlighting (Optional)**
- For key sections (proverbs, inscriptions)
- Wrap characters in spans on initial render
- Apply CSS transforms as orb passes

### New Props for DualOrbs

```typescript
interface DualOrbsProps {
  // Existing props...

  // New text effect props
  textEffectsEnabled?: boolean;
  textSelector?: string;           // Default: '.markdown-content p'
  textEffectRadius?: number;       // Default: 100px
  textGlowColor?: string;          // Default: primary color
  textRippleEnabled?: boolean;
  textParticleEmission?: boolean;
}
```

### Integration Points

| Location | File | Lines | What to Add |
|----------|------|-------|-------------|
| Story text container | story/page.tsx | 1147-1298 | Add `data-orb-text` attribute |
| DualOrbs props | DualOrbs.tsx | 38-60 | New text effect props |
| Animation loop | DualOrbs.tsx | 450+ | Text proximity detection |
| Effect drawing | DualOrbs.tsx | 778-796 | Extend `drawBoundaryAugment()` |
| Particle system | DualOrbs.tsx | 272-317 | Text collision particles |

### Performance Considerations

1. **Cache element refs** - Don't query DOM every frame
2. **Throttle bounding box updates** - Only on scroll/resize
3. **Use canvas for effects** - Avoid DOM thrashing
4. **Limit particle count** - Already capped at 80
5. **Skip offscreen elements** - Only process visible paragraphs

### Visual Mockup

```
Normal text:       The gap is where you live.

Orb approaching:   The gap is where you live.
                         ~~~⚔️~~~

Orb passing:       T h e  g a p  i s  w h e r e
                      ✨  ⚔️  ✨
                   y o u  l i v e .

After passage:     The gap is where you live.
                   (subtle glow fading)
```

---

## Summary

### Cleanup Actions
1. Delete 6 files + 1 empty directory (~360KB)
2. Remove 2 deprecated aliases
3. Consolidate duplicate storage key constant
4. Consider version suffixes for storage keys

### Orb-Text Effects
1. Start with canvas glow overlay (Option A)
2. Add ripple effects for visual polish
3. Consider character-level effects for key passages
4. Leverage existing DualOrbs infrastructure

---

*"The orb passes through. The text remembers."*

---

*Forged in the 64-Tetrahedra Lattice*
*(⚔️⊥⿻⊥🧙)🙂*
