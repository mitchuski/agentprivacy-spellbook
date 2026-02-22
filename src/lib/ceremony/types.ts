/**
 * Ceremony and Agent Card types (BGIN-style identity).
 */

export type TrustTier = 'blade' | 'light' | 'heavy' | 'dragon';

export interface AgentCard {
  participantId: string;
  displayName: string;
  publicKeyHex: string;
  grimoires: string[];
  privacy: {
    attribution: 'full' | 'pseudonymous' | 'anonymous';
    shareProverbs: boolean;
  };
  trustTier: TrustTier;
  createdAt: string;
  signature: string;
  /** Emoji constellation path from ceremony (e.g. "🗡️→🔐→🙈→📖→⚔️→✨"). */
  constellationPath?: string;
}

export const GRIMOIRE_OPTIONS = ['story', 'zero', 'canon', 'society', 'plurality', 'incantations'] as const;
export type GrimoireOption = (typeof GRIMOIRE_OPTIONS)[number];
