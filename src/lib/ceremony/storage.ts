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
 * Save the keypair to storage.
 * PUBLIC KEY: localStorage (persists across sessions)
 * PRIVATE KEY: sessionStorage (burned on tab close - like the Moon)
 *
 * The Swordsman narration key is "burned" - only available during the ceremony session.
 * This matches the spec: "Your private key was not stored."
 */
export function saveKeys(keypair: { privateKey: Uint8Array; publicKey: Uint8Array }): void {
  if (typeof window === 'undefined') return;
  // Public key persists (for verification, runecraft)
  localStorage.setItem(KEYS.PUBLIC_KEY, bytesToHex(keypair.publicKey));
  // Private key is session-only (burned like the Moon)
  sessionStorage.setItem(KEYS.PRIVATE_KEY, bytesToHex(keypair.privateKey));
}

/**
 * Load the keypair from storage.
 * Private key comes from sessionStorage (if still in session).
 * Public key comes from localStorage (persists).
 * Returns null if either key is unavailable.
 */
export function getKeys(): { privateKey: Uint8Array; publicKey: Uint8Array } | null {
  if (typeof window === 'undefined') return null;
  // Private key from session (burned on tab close)
  const privateKeyHex = sessionStorage.getItem(KEYS.PRIVATE_KEY);
  // Public key from localStorage (persists)
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
 * Returns true only if BOTH private (session) and public (local) keys exist.
 */
export function hasStoredKeys(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(sessionStorage.getItem(KEYS.PRIVATE_KEY) && localStorage.getItem(KEYS.PUBLIC_KEY));
}

/**
 * Check if only public key exists (private was burned).
 * This is the normal state after a ceremony session ends.
 */
export function hasPublicKeyOnly(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(localStorage.getItem(KEYS.PUBLIC_KEY) && !sessionStorage.getItem(KEYS.PRIVATE_KEY));
}

/**
 * Get public key hex string (persisted in localStorage).
 * Available even after private key is burned.
 */
export function getPublicKeyHex(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEYS.PUBLIC_KEY);
}

export function clearIdentity(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.AGENT_CARD);
  localStorage.removeItem(KEYS.CEREMONY_COMPLETE);
  localStorage.removeItem(KEYS.PUBLIC_KEY);
  localStorage.removeItem(KEYS.CONSTELLATION);
  // Also clear session storage private key if still present
  sessionStorage.removeItem(KEYS.PRIVATE_KEY);
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
