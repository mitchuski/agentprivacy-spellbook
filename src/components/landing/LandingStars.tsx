'use client';

import { useMemo } from 'react';

/** Star field for landing background - cyan and coral stars representing the dual-agent axis */
export default function LandingStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => {
        const s1 = (i * 9301 + 49297) % 233280;
        const s2 = (i * 7919 + 31) % 233280;
        const s3 = (i * 7829 + 7) % 233280;
        const s4 = (i * 6271 + 17) % 233280;
        // Mix of cyan and coral stars based on position
        const isCyan = s4 % 3 !== 0; // ~67% cyan, ~33% coral
        return {
          x: (s1 / 233280) * 97 + 1,
          y: (s2 / 233280) * 97 + 1,
          size: 0.4 + (s3 % 100) / 100 * 2,
          opacity: 0.08 + (s1 % 100) / 100 * 0.4,
          delay: (s2 % 80) / 10,
          duration: 2.5 + (s3 % 50) / 10,
          color: isCyan ? '#4dd9e8' : '#e8523a',
        };
      }),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <style>{`
            @keyframes starPulse {
              0%, 100% { opacity: 0.1; }
              50% { opacity: 0.6; }
            }
          `}</style>
        </defs>
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={`${Number(s.x).toFixed(2)}%`}
            cy={`${Number(s.y).toFixed(2)}%`}
            r={s.size}
            fill={s.color}
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
