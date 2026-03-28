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
