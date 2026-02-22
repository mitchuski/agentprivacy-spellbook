/**
 * Promises storage (localStorage).
 */

import type { PromiseEntry, PromiseStatus } from './types';

const PROMISES_KEY = 'ap-promises';

function uid(): string {
  return `promise-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getPromises(): PromiseEntry[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(PROMISES_KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as PromiseEntry[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addPromise(
  promise: Omit<PromiseEntry, 'id' | 'createdAt' | 'updatedAt'> & { status?: PromiseEntry['status'] }
): PromiseEntry {
  const now = new Date().toISOString();
  const entry: PromiseEntry = {
    status: 'active',
    ...promise,
    id: uid(),
    createdAt: now,
    updatedAt: now,
  };
  const list = getPromises();
  list.push(entry);
  localStorage.setItem(PROMISES_KEY, JSON.stringify(list));
  return entry;
}

export function updatePromiseStatus(id: string, status: PromiseStatus): void {
  const list = getPromises();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return;
  const now = new Date().toISOString();
  list[idx] = {
    ...list[idx]!,
    status,
    updatedAt: now,
    completedAt: status === 'completed' ? now : list[idx]!.completedAt,
  };
  localStorage.setItem(PROMISES_KEY, JSON.stringify(list));
}

export function deletePromise(id: string): void {
  const list = getPromises().filter((p) => p.id !== id);
  localStorage.setItem(PROMISES_KEY, JSON.stringify(list));
}
