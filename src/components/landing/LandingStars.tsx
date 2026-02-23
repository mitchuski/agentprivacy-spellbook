'use client';

import { useMemo } from 'react';

/** Fixed star field for landing background. Deterministic positions to avoid hydration mismatch. */
export default function LandingStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const s1 = (i * 9301 + 49297) % 233280;
        const s2 = (i * 7919 + 31) % 233280;
        const s3 = (i * 7829 + 7) % 233280;
        return {
          x: (s1 / 233280) * 97 + 1,
          y: (s2 / 233280) * 97 + 1,
          size: 0.3 + (s3 % 100) / 100 * 1.5,
          opacity: 0.05 + (s1 % 100) / 100 * 0.35,
          delay: (s2 % 60) / 10,
          duration: 3 + (s3 % 60) / 10,
        };
      }),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <style>{`
            @keyframes starPulse {
              0%, 100% { opacity: 0.1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </defs>
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={`${Number(s.x).toFixed(2)}%`}
            cy={`${Number(s.y).toFixed(2)}%`}
            r={s.size}
            fill="#6366f1"
            opacity={s.opacity}
            style={{
              animation: `starPulse ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
