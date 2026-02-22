/**
 * Ceremony and Agent Card storage (localStorage).
 * Keys are stored as hex strings for persistence across sessions.
 */

import type { AgentCard } from './types';
import type { CeremonyConstellation } from './constellation';
import { bytesToHex, hexToBytes } from './keygen';

const KEYS = {
  AGENT_CARD: 'ap-agent-card',
  CEREMONY_COMPLETE: 'ap-ceremony-complete',
  PRIVATE_KEY: 'ap-private-key',
  PUBLIC_KEY: 'ap-public-key',
  CONSTELLATION: 'ap-ceremony-constellation',
} as const;

export function hasCompletedCeremony(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(KEYS.CEREMONY_COMPLETE) === 'true';
}

export function getAgentCard(): AgentCard | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEYS.AGENT_CARD);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AgentCard;
  } catch {
    return null;
  }
}

const IDENTITY_EVENT = 'ap-identity-changed';

export function saveAgentCard(card: AgentCard): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.AGENT_CARD, JSON.stringify(card));
  localStorage.setItem(KEYS.CEREMONY_COMPLETE, 'true');
  window.dispatchEvent(new Event(IDENTITY_EVENT));
}

/**
 * Save the keypair to localStorage as hex strings.
 * This allows the identity to persist across page refreshes.
 */
export function saveKeys(keypair: { privateKey: Uint8Array; publicKey: Uint8Array }): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.PRIVATE_KEY, bytesToHex(keypair.privateKey));
  localStorage.setItem(KEYS.PUBLIC_KEY, bytesToHex(keypair.publicKey));
}

/**
 * Load the keypair from localStorage.
 * Returns null if keys are not stored.
 */
export function getKeys(): { privateKey: Uint8Array; publicKey: Uint8Array } | null {
  if (typeof window === 'undefined') return null;
  const privateKeyHex = localStorage.getItem(KEYS.PRIVATE_KEY);
  const publicKeyHex = localStorage.getItem(KEYS.PUBLIC_KEY);
  if (!privateKeyHex || !publicKeyHex) return null;
  try {
    return {
      privateKey: hexToBytes(privateKeyHex),
      publicKey: hexToBytes(publicKeyHex),
    };
  } catch {
    return null;
  }
}

/**
 * Check if keys are stored (identity can sign).
 */
export function hasStoredKeys(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(localStorage.getItem(KEYS.PRIVATE_KEY) && localStorage.getItem(KEYS.PUBLIC_KEY));
}

export function clearIdentity(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.AGENT_CARD);
  localStorage.removeItem(KEYS.CEREMONY_COMPLETE);
  localStorage.removeItem(KEYS.PRIVATE_KEY);
  localStorage.removeItem(KEYS.PUBLIC_KEY);
  localStorage.removeItem(KEYS.CONSTELLATION);
  window.dispatchEvent(new Event(IDENTITY_EVENT));
}

/** Save ceremony constellation (emoji path + step inscriptions). */
export function saveCeremonyConstellation(constellation: CeremonyConstellation): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.CONSTELLATION, JSON.stringify(constellation));
}

/** Load ceremony constellation; null if not set. */
export function getCeremonyConstellation(): CeremonyConstellation | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEYS.CONSTELLATION);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CeremonyConstellation;
  } catch {
    return null;
  }
}
