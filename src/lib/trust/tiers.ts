/**
 * Trust tier calculation (BGIN-style: blade → light → heavy → dragon).
 */

import type { TrustTier } from '@/lib/ceremony/types';

export type { TrustTier } from '@/lib/ceremony/types';

export function calculateTier(metrics: {
  completedPromises: number;
  studiedActs: number;
}): TrustTier {
  const score = metrics.completedPromises * 3 + metrics.studiedActs;
  if (score >= 500) return 'dragon';
  if (score >= 150) return 'heavy';
  if (score >= 50) return 'light';
  return 'blade';
}
