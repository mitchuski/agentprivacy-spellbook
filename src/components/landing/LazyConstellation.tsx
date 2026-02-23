'use client';

import { useState, useEffect, useRef } from 'react';
import HeroConstellation from './HeroConstellation';

const ROOT_MARGIN = '200px';
const THRESHOLD = 0.01;

/**
 * Renders HeroConstellation only when the section is near the viewport.
 * Reduces paint/layout work on mobile when scrolling; uses reduced star count on small screens.
 */
export default function LazyConstellation({
  variant,
  sectionAngle,
  sectionIndex,
}: {
  variant: 'section';
  sectionAngle: 0 | 1;
  sectionIndex: number;
}) {
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkWidth = () => {
      setReduced(window.innerWidth < 768);
    };

    checkWidth();

    let timeoutId: ReturnType<typeof setTimeout>;
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

  useEffect(() => {
    const el = placeholderRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setInView(true);
      },
      { rootMargin: ROOT_MARGIN, threshold: THRESHOLD }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={placeholderRef} className="absolute inset-0 pointer-events-none z-0" aria-hidden />
      {inView && (
        <HeroConstellation
          variant={variant}
          sectionAngle={sectionAngle}
          sectionIndex={sectionIndex}
          reduced={reduced}
        />
      )}
    </>
  );
}
