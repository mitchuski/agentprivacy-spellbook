'use client';

import type { TrustTier } from '@/lib/ceremony/types';

const TIER_CONFIG: Record<TrustTier, { emoji: string; label: string; color: string }> = {
  blade: { emoji: '🗡️', label: 'Blade', color: 'text-gray-400' },
  light: { emoji: '⚔️', label: 'Light', color: 'text-blue-400' },
  heavy: { emoji: '🛡️', label: 'Heavy', color: 'text-purple-400' },
  dragon: { emoji: '🐉', label: 'Dragon', color: 'text-amber-400' },
};

export default function TierBadge({
  tier,
  showLabel = true,
}: {
  tier: TrustTier;
  showLabel?: boolean;
}) {
  const config = TIER_CONFIG[tier] ?? TIER_CONFIG.blade;
  return (
    <span className={`inline-flex items-center gap-1 ${config.color}`}>
      <span aria-hidden>{config.emoji}</span>
      {showLabel && <span className="text-sm">{config.label}</span>}
    </span>
  );
}
