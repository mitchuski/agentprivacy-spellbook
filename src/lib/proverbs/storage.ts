/**
 * User proverb storage (localStorage).
 * Follows BGIN pattern with source types and cast linking.
 */

export type ProverbSourceType =
  | 'mage_response'     // From MagePanel chat
  | 'cast_inscription'  // Direct inscription
  | 'cast_agreement'    // Agreement with existing content
  | 'evoked';           // Evoked via modal (standalone or connected)

export type ProverbStatus =
  | 'collected'         // In local collection
  | 'added_to_spells'   // Added to skill graph
  | 'pending_reveal'    // Waiting for Zcash submission
  | 'revealed';         // Inscribed on Zcash

export interface UserProverb {
  id: string;
  content: string;              // The proverb text
  grimoire: string;             // 'story', 'zero', 'canon', etc.
  taleId: string;               // e.g., 'story-3'
  actNumber?: number;           // For story spellbook
  sourceType: ProverbSourceType;
  castEntryId?: string;         // Links to spellbook entry if agreement
  reflection?: string;          // Personal notes/reflection on this proverb
  connectedTo?: string;         // ID of proverb this is connected to
  connectedTaleId?: string;     // TaleId of inscribed proverb this connects to
  createdAt: string;            // ISO timestamp
  status: ProverbStatus;
  revealedTxid?: string;        // If inscribed on Zcash
  revealedAt?: string;          // When revealed
}

const PROVERBS_KEY = 'ap-user-proverbs';

/**
 * Get all user proverbs
 */
export function getUserProverbs(): UserProverb[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(PROVERBS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as UserProverb[];
  } catch {
    return [];
  }
}

/**
 * Add a new proverb (deduplicates by content)
 */
export function addUserProverb(
  proverb: Omit<UserProverb, 'id' | 'createdAt' | 'status'>
): UserProverb | null {
  const existing = getUserProverbs();

  // Check if proverb content already exists
  const normalizedContent = proverb.content.trim().toLowerCase();
  if (existing.some(p => p.content.trim().toLowerCase() === normalizedContent)) {
    return null; // Already exists
  }

  const newProverb: UserProverb = {
    ...proverb,
    id: `proverb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: 'collected',
  };

  const updated = [newProverb, ...existing];
  localStorage.setItem(PROVERBS_KEY, JSON.stringify(updated));
  return newProverb;
}

/**
 * Update proverb status
 */
export function updateProverbStatus(
  id: string,
  status: ProverbStatus,
  revealedTxid?: string
): void {
  const proverbs = getUserProverbs();
  const updated = proverbs.map(p => {
    if (p.id === id) {
      return {
        ...p,
        status,
        ...(revealedTxid ? { revealedTxid, revealedAt: new Date().toISOString() } : {}),
      };
    }
    return p;
  });
  localStorage.setItem(PROVERBS_KEY, JSON.stringify(updated));
}

/**
 * Delete a proverb
 */
export function deleteUserProverb(id: string): void {
  const proverbs = getUserProverbs();
  const updated = proverbs.filter(p => p.id !== id);
  localStorage.setItem(PROVERBS_KEY, JSON.stringify(updated));
}

/**
 * Get proverb by ID
 */
export function getProverbById(id: string): UserProverb | null {
  return getUserProverbs().find(p => p.id === id) || null;
}

/**
 * Get proverbs by grimoire
 */
export function getProverbsByGrimoire(grimoire: string): UserProverb[] {
  return getUserProverbs().filter(p => p.grimoire === grimoire);
}

/**
 * Get proverbs by status
 */
export function getProverbsByStatus(status: ProverbStatus): UserProverb[] {
  return getUserProverbs().filter(p => p.status === status);
}

/**
 * Get proverbs by source type
 */
export function getProverbsBySourceType(sourceType: ProverbSourceType): UserProverb[] {
  return getUserProverbs().filter(p => p.sourceType === sourceType);
}

/**
 * Get revealed proverbs (on Zcash)
 */
export function getRevealedProverbs(): UserProverb[] {
  return getUserProverbs().filter(p => p.status === 'revealed' && p.revealedTxid);
}

/**
 * Parse taleId to extract grimoire and act number
 */
export function parseTaleId(taleId: string): { grimoire: string; actNumber?: number } {
  const match = taleId.match(/^([a-z]+)-(\d+)$/i);
  if (match) {
    return {
      grimoire: match[1].toLowerCase(),
      actNumber: parseInt(match[2], 10),
    };
  }
  // Fallback for non-numbered tales
  return { grimoire: taleId.split('-')[0] || 'unknown' };
}

/**
 * Get grimoire display name
 */
export function getGrimoireDisplayName(grimoire: string): string {
  const names: Record<string, string> = {
    story: 'Story Spellbook',
    zero: 'Zero Knowledge',
    canon: 'Canon',
    society: 'Society',
    plurality: 'Plurality',
    incantations: 'Incantations',
    standalone: 'Standalone',
    connected: 'Connected',
  };
  return names[grimoire] || grimoire;
}

/**
 * Get status display info
 */
export function getStatusDisplay(status: ProverbStatus): { label: string; color: string; icon: string } {
  const displays: Record<ProverbStatus, { label: string; color: string; icon: string }> = {
    collected: { label: 'Collected', color: 'text-text-muted', icon: '📝' },
    added_to_spells: { label: 'In spell graph', color: 'text-primary', icon: '✨' },
    pending_reveal: { label: 'Pending Reveal', color: 'text-secondary', icon: '⏳' },
    revealed: { label: 'Revealed', color: 'text-accent', icon: '⚔️' },
  };
  return displays[status];
}

/**
 * Get source type display (for feed badges)
 */
export function getSourceTypeDisplay(sourceType: ProverbSourceType): { label: string; icon: string } {
  const displays: Record<ProverbSourceType, { label: string; icon: string }> = {
    mage_response: { label: 'From Mage', icon: '🧙' },
    cast_inscription: { label: 'Cast inscription', icon: '📜' },
    cast_agreement: { label: 'Agreed on cast', icon: '🤝' },
    evoked: { label: 'Evoked', icon: '✦' },
  };
  return displays[sourceType];
}
