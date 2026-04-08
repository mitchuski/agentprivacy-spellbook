'use client';

import { useExtensionBridge } from '@/contexts/ExtensionBridgeContext';
import { useEffect, useState } from 'react';

interface ExtensionStatusIndicatorProps {
  /** Compact mode shows just the orbs without labels */
  compact?: boolean;
  /** Show constellation node count */
  showConstellation?: boolean;
  /** Show mana balance */
  showMana?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export default function ExtensionStatusIndicator({
  compact = false,
  showConstellation = false,
  showMana = false,
  className = '',
}: ExtensionStatusIndicatorProps) {
  const { state, isConnected, isDualMode } = useExtensionBridge();
  const [pulseOrb, setPulseOrb] = useState<'mage' | 'sword' | null>(null);

  // Pulse animation when new data arrives
  useEffect(() => {
    if (state.mageDetected) {
      setPulseOrb('mage');
      const timer = setTimeout(() => setPulseOrb(null), 500);
      return () => clearTimeout(timer);
    }
  }, [state.mageOrbPosition]);

  useEffect(() => {
    if (state.swordsmanDetected) {
      setPulseOrb('sword');
      const timer = setTimeout(() => setPulseOrb(null), 500);
      return () => clearTimeout(timer);
    }
  }, [state.swordsmanOrbPosition]);

  if (!isConnected) {
    return (
      <div className={`flex items-center gap-2 text-text-muted ${className}`}>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-500 opacity-40" />
          <span className="w-2 h-2 rounded-full bg-gray-500 opacity-40" />
        </div>
        {!compact && (
          <span className="text-xs opacity-60">No extensions detected</span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Extension orbs */}
      <div className="flex items-center gap-1.5">
        {/* Mage orb */}
        <div
          className={`
            w-2.5 h-2.5 rounded-full transition-all duration-300
            ${state.mageDetected
              ? 'bg-[#1D9E75] shadow-[0_0_8px_rgba(29,158,117,0.6)]'
              : 'bg-gray-500 opacity-40'
            }
            ${pulseOrb === 'mage' ? 'scale-150' : 'scale-100'}
          `}
          title={state.mageDetected ? 'Mage connected' : 'Mage not detected'}
        />

        {/* Swordsman orb */}
        <div
          className={`
            w-2.5 h-2.5 rounded-full transition-all duration-300
            ${state.swordsmanDetected
              ? 'bg-[#534AB7] shadow-[0_0_8px_rgba(83,74,183,0.6)]'
              : 'bg-gray-500 opacity-40'
            }
            ${pulseOrb === 'sword' ? 'scale-150' : 'scale-100'}
          `}
          title={state.swordsmanDetected ? 'Swordsman connected' : 'Swordsman not detected'}
        />

        {/* Dual mode indicator */}
        {isDualMode && (
          <span
            className="ml-0.5 text-[#EF9F27] text-xs"
            title="Dual-extension ceremony mode active"
          >
            +
          </span>
        )}
      </div>

      {/* Status text */}
      {!compact && (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-text">
            {isDualMode ? 'Ceremony Mode' : state.mageDetected ? 'Mage' : 'Swordsman'}
          </span>
          {showConstellation && state.constellationNodes.length > 0 && (
            <span className="text-[10px] text-text-muted">
              {state.constellationNodes.length} nodes
            </span>
          )}
        </div>
      )}

      {/* Mana display */}
      {showMana && state.manaBalance > 0 && (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EF9F27]/10 border border-[#EF9F27]/30">
          <span className="text-[#EF9F27] text-xs">✦</span>
          <span className="text-xs font-medium text-[#EF9F27]">{state.manaBalance}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Floating version that appears in bottom-right corner
 */
export function FloatingExtensionStatus() {
  const { isConnected } = useExtensionBridge();

  if (!isConnected) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-surface/80 backdrop-blur-sm border border-surface/50 rounded-full px-3 py-1.5 shadow-lg">
      <ExtensionStatusIndicator compact showMana />
    </div>
  );
}
