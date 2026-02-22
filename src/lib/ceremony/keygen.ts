/**
 * Ed25519 key generation and signing for Swordsman identity (BGIN-style).
 * Uses @noble/ed25519 for broad browser support.
 */

import * as ed from '@noble/ed25519';

const HEX = '0123456789abcdef';

export function bytesToHex(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += HEX[bytes[i]! >> 4] + HEX[bytes[i]! & 15];
  }
  return out;
}

export function hexToBytes(hex: string): Uint8Array {
  const len = hex.length >> 1;
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export async function generateKeyPair(): Promise<{ privateKey: Uint8Array; publicKey: Uint8Array }> {
  const privateKey = ed.utils.randomSecretKey();
  const publicKey = await ed.getPublicKeyAsync(privateKey);
  return { privateKey, publicKey };
}

export function publicKeyToHex(publicKey: Uint8Array): string {
  return bytesToHex(publicKey);
}

export async function signMessage(privateKey: Uint8Array, message: string): Promise<string> {
  const msgBytes = new TextEncoder().encode(message);
  // Use signAsync (does not require hashes.sha512); sync sign() would need ed.hashes.sha512 set.
  const sig = await ed.signAsync(msgBytes, privateKey);
  return bytesToHex(sig);
}

/** Participant id: ap-{first 16 hex chars of publicKeyHex}. */
export function generateParticipantId(publicKeyHex: string): string {
  const trimmed = publicKeyHex.replace(/^0x/i, '').slice(0, 16);
  return `ap-${trimmed}`;
}
