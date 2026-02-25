# Mobile Compatibility Fix Plan - Landing Page

## Overview

The landing page has several mobile compatibility issues causing:
- "Background scrolling only" - video plays but content doesn't appear
- "Info loads and disappears" - carousel text flashes in/out
- General mobile unfriendliness (overflow, text sizing, performance)

---

## Issue 1: Video Autoplay Fails on iOS (Critical)

**File:** `src/app/page.tsx` (lines 636-643)

**Problem:** Mobile browsers (especially iOS Safari) have strict autoplay policies. The video silently fails to load, showing only the gradient overlay.

**Current Code:**
```tsx
<video
  src="/assets/agentprivacy_swordmage_bg_animation.mp4"
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover z-0"
/>
```

**Fix - Replace with:**
```tsx
<video
  src="/assets/agentprivacy_swordmage_bg_animation.mp4"
  autoPlay
  loop
  muted
  playsInline
  preload="metadata"
  poster="/assets/agentprivacy_swordmage_bg_frame.jpg"
  onCanPlay={(e) => {
    const video = e.currentTarget;
    video.play().catch(() => {});
  }}
  className="absolute inset-0 w-full h-full object-cover z-0"
/>
{/* Fallback background for when video fails to load/play */}
<div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 via-background to-secondary/20 z-[-1]" />
```

**Additional Step:** Extract a frame from the video and save as `/public/assets/agentprivacy_swordmage_bg_frame.jpg` for the poster image.

---

## Issue 2: Hydration Mismatch Causing Content to Disappear (Critical)

**File:** `src/app/page.tsx` (lines 93-99, 171-187, 648-665)

**Problem:** The `isClient` state causes conditional rendering that creates a flash - SSR renders one thing, then client hydration replaces it, causing content to appear then disappear.

**Current Code (lines 93-99):**
```tsx
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);
```

**Current Code (lines 171-187):**
```tsx
<div className="relative h-14 md:h-16 flex items-center justify-center" suppressHydrationWarning>
  {isClient ? (
    <AnimatePresence mode="wait">
      <motion.p
        key={heroIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: heroFade ? 1 : 0, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="text-2xl md:text-3xl text-text-muted absolute text-center"
      >
        {HERO_CAROUSEL[heroIndex].text}
      </motion.p>
    </AnimatePresence>
  ) : (
    <p className="text-2xl md:text-3xl text-text-muted absolute">{HERO_CAROUSEL[0].text}</p>
  )}
</div>
```

**Fix:**

1. Remove the `isClient` state entirely (delete lines 93 and 97-99)

2. Replace lines 171-187 with:
```tsx
<div className="relative h-14 md:h-16 flex items-center justify-center">
  <AnimatePresence mode="wait" initial={false}>
    <motion.p
      key={heroIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: heroFade ? 1 : 0, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-text-muted absolute text-center px-4"
    >
      {HERO_CAROUSEL[heroIndex].text}
    </motion.p>
  </AnimatePresence>
</div>
```

3. Replace lines 648-665 (CTA carousel) with:
```tsx
<div className="relative h-14 flex items-center justify-center mb-8">
  <AnimatePresence mode="wait" initial={false}>
    <motion.p
      key={ctaIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: ctaFade ? 1 : 0, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-text absolute"
    >
      {CTA_CAROUSEL[ctaIndex].text}
    </motion.p>
  </AnimatePresence>
</div>
```

**Key changes:**
- Removed `isClient` conditional
- Added `initial={false}` to AnimatePresence to prevent initial animation on mount
- Removed `suppressHydrationWarning` (no longer needed)

---

## Issue 3: Dual Carousel Intervals Causing Jank (High)

**File:** `src/app/page.tsx` (lines 101-121)

**Problem:** Two separate `setInterval` loops cause excessive re-renders on slower mobile devices.

**Current Code:**
```tsx
useEffect(() => {
  const t = setInterval(() => {
    setHeroFade(false);
    setTimeout(() => {
      setHeroIndex((i) => (i + 1) % HERO_CAROUSEL.length);
      setHeroFade(true);
    }, 400);
  }, 3200);
  return () => clearInterval(t);
}, []);

useEffect(() => {
  const t = setInterval(() => {
    setCtaFade(false);
    setTimeout(() => {
      setCtaIndex((i) => (i + 1) % CTA_CAROUSEL.length);
      setCtaFade(true);
    }, 400);
  }, 2800);
  return () => clearInterval(t);
}, []);
```

**Fix - Replace both useEffects with:**
```tsx
useEffect(() => {
  // Slower intervals on mobile for better performance
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const heroInterval = isMobile ? 4500 : 3200;
  const ctaInterval = isMobile ? 4000 : 2800;

  const heroTimer = setInterval(() => {
    setHeroFade(false);
    setTimeout(() => {
      setHeroIndex((i) => (i + 1) % HERO_CAROUSEL.length);
      setHeroFade(true);
    }, 400);
  }, heroInterval);

  const ctaTimer = setInterval(() => {
    setCtaFade(false);
    setTimeout(() => {
      setCtaIndex((i) => (i + 1) % CTA_CAROUSEL.length);
      setCtaFade(true);
    }, 400);
  }, ctaInterval);

  return () => {
    clearInterval(heroTimer);
    clearInterval(ctaTimer);
  };
}, []);
```

---

## Issue 4: Fixed-Width Containers Causing Horizontal Overflow (High)

**File:** `src/app/page.tsx` (lines 501-519)

**Problem:** `min-w-[144px]` on elements causes overflow on narrow screens (320px iPhone SE).

**Current Code (line 502, 508, 514):**
```tsx
<div className="text-center min-w-[144px]">
```

**Fix - Replace each instance with:**
```tsx
<div className="text-center min-w-0 sm:min-w-[144px]">
```

**Also update the parent container (line 501):**
```tsx
// Current:
<div className="flex flex-wrap justify-center items-center gap-5 mb-4">

// Change to:
<div className="flex flex-wrap justify-center items-center gap-3 sm:gap-5 mb-4">
```

---

## Issue 5: Oversized Typography on Mobile (Medium)

**File:** `src/app/page.tsx`

**Changes needed at these lines:**

| Line | Current | Change to |
|------|---------|-----------|
| 136 | `text-5xl md:text-6xl` | `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` |
| 144 | `text-xl md:text-2xl` | `text-base sm:text-lg md:text-xl lg:text-2xl` |
| 170 | `text-2xl md:text-3xl` | `text-xl sm:text-2xl md:text-3xl` |
| 189 | `text-xl md:text-2xl` | `text-lg sm:text-xl md:text-2xl` |

---

## Issue 6: LazyConstellation Missing Resize Listener (Medium)

**File:** `src/components/landing/LazyConstellation.tsx` (lines 26-28)

**Problem:** The `reduced` state is only set once on mount, so orientation changes don't update it.

**Current Code:**
```tsx
useEffect(() => {
  setReduced(typeof window !== 'undefined' && window.innerWidth < 768);
}, []);
```

**Fix - Replace with:**
```tsx
useEffect(() => {
  const checkWidth = () => {
    setReduced(window.innerWidth < 768);
  };

  checkWidth(); // Initial check

  // Debounced resize handler
  let timeoutId: NodeJS.Timeout;
  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(checkWidth, 150);
  };

  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
    clearTimeout(timeoutId);
  };
}, []);
```

---

## Issue 7: Heavy SVG Animations on Mobile (Medium)

**File:** `src/components/landing/HeroConstellation.tsx`

**Problem:** Complex SVG filters and many animated elements drain battery and cause jank on mobile.

**Fix - Add this check at the start of the component (after line 102):**
```tsx
// Disable animations on mobile or when user prefers reduced motion
const disableAnimations = reduced ||
  (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
```

**Then update the animation styles (lines 197, 210, 216, 244):**
```tsx
// Change from:
style={{ animation: `constellationTwinkle 6s ease-in-out ${s.delay}s infinite` }}

// To:
style={disableAnimations ? {} : { animation: `constellationTwinkle 6s ease-in-out ${s.delay}s infinite` }}
```

Apply this pattern to all four animation style attributes.

---

## Issue 8: Add Reduced Motion CSS Support (Low)

**File:** `src/app/globals.css`

**Add at the end of the file:**
```css
/* Respect user's reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Improve tap targets on mobile */
@media (max-width: 640px) {
  .btn-primary,
  .btn-secondary {
    min-height: 44px;
    min-width: 44px;
  }
}
```

---

## Issue 9: Safe Area Handling for Notched Phones (Low)

**File:** `src/app/page.tsx`

**Update line 129:**
```tsx
// Current:
<section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative pb-[env(safe-area-inset-bottom)]">

// Change to:
<section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
```

**Update line 196 (scroll indicator):**
```tsx
// Current:
className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-muted text-2xl z-10"

// Change to:
className="absolute bottom-8 mb-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 text-text-muted text-2xl z-10"
```

---

## Testing Checklist

After implementing all fixes:

- [ ] Test on iOS Safari (iPhone SE at 320px width)
- [ ] Test on iOS Safari (iPhone 12/13/14/15)
- [ ] Test on Android Chrome (budget device)
- [ ] Test on Android Chrome (flagship)
- [ ] Test landscape orientation on both platforms
- [ ] Test with iOS keyboard appearing/disappearing
- [ ] Enable "Reduce Motion" in device settings and verify
- [ ] Verify no horizontal scroll at 320px viewport width
- [ ] Confirm video plays OR graceful fallback gradient shows
- [ ] Verify carousel text doesn't flash/disappear on load
- [ ] Check Lighthouse mobile performance score (target: 80+)
- [ ] Test on slow 3G network throttling

---

## Files to Modify Summary

1. `src/app/page.tsx` - Main landing page (most changes)
2. `src/components/landing/LazyConstellation.tsx` - Add resize listener
3. `src/components/landing/HeroConstellation.tsx` - Disable animations on mobile
4. `src/app/globals.css` - Add reduced motion + tap target CSS
5. `public/assets/agentprivacy_swordmage_bg_frame.jpg` - Create video poster image

---

## Priority Order for Implementation

1. **Critical:** Fix video autoplay (Issue 1)
2. **Critical:** Fix hydration mismatch (Issue 2)
3. **High:** Fix carousel intervals (Issue 3)
4. **High:** Fix container overflow (Issue 4)
5. **Medium:** Fix typography (Issue 5)
6. **Medium:** Add resize listener (Issue 6)
7. **Medium:** Reduce SVG animations (Issue 7)
8. **Low:** Add reduced motion CSS (Issue 8)
9. **Low:** Safe area handling (Issue 9)
