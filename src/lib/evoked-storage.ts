/**
 * Local storage for messages the user has "evoked" (sent to the Mage).
 * Used on the Proverbs page to list private notes from the user's journey.
 */

export interface EvokedMessage {
  id: string;
  content: string;
  createdAt: string; // ISO
}

const EVOKED_KEY = 'ap-evoked-messages';

export function getEvokedMessages(): EvokedMessage[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(EVOKED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as EvokedMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addEvokedMessage(content: string): EvokedMessage {
  const msg: EvokedMessage = {
    id: `evoked-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };
  const existing = getEvokedMessages();
  const updated = [msg, ...existing];
  localStorage.setItem(EVOKED_KEY, JSON.stringify(updated));
  return msg;
}

export function deleteEvokedMessage(id: string): void {
  const messages = getEvokedMessages().filter((m) => m.id !== id);
  localStorage.setItem(EVOKED_KEY, JSON.stringify(messages));
}
