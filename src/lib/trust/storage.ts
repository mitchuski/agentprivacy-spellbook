/**
 * Trust metrics storage for tier calculation (completed promises, studied acts).
 */

const TRUST_METRICS_KEY = 'ap-trust-metrics';

export interface TrustMetrics {
  completedPromises: number;
  studiedActs: number;
}

export function getTrustMetrics(): TrustMetrics {
  if (typeof window === 'undefined') return { completedPromises: 0, studiedActs: 0 };
  try {
    const raw = localStorage.getItem(TRUST_METRICS_KEY);
    if (!raw) return { completedPromises: 0, studiedActs: 0 };
    const o = JSON.parse(raw) as TrustMetrics;
    return {
      completedPromises: Number(o.completedPromises) || 0,
      studiedActs: Number(o.studiedActs) || 0,
    };
  } catch {
    return { completedPromises: 0, studiedActs: 0 };
  }
}

export function setTrustMetrics(metrics: TrustMetrics): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRUST_METRICS_KEY, JSON.stringify(metrics));
  } catch {
    // ignore
  }
}

export function incrementCompletedPromises(): void {
  const m = getTrustMetrics();
  m.completedPromises += 1;
  setTrustMetrics(m);
}

export function setStudiedActs(count: number): void {
  const m = getTrustMetrics();
  m.studiedActs = Math.max(m.studiedActs, count);
  setTrustMetrics(m);
}
