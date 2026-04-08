/**
 * Ceremony constellation: emoji path and step definitions for the dual ceremony.
 * Each step lets the user choose a marker emoji and optional inscription.
 *
 * Cosmological context (V5.3.1):
 * Creating a Swordsman is creating Moon/Soulbis — the faithful reflection.
 * The ceremony makes operational what the quaternion describes:
 *   Sun → Earth → (Theia → Moon, Life → Human)
 */

export interface CeremonyStepDef {
  id: string;
  title: string;
  description: string;
  cosmologicalNote?: string; // V5.3.1: links step to quaternion cast
  emojiOptions: string[];
  dataKey: string;
  requiredForComplete: boolean;
}

export interface CeremonyStepEntry {
  stepId: string;
  chosenEmoji: string;
  inscription: string;
  completedAt: string; // ISO
}

export interface CeremonyConstellation {
  steps: CeremonyStepEntry[];
  constellationPath: string; // e.g. "🗡️→🔐→🙈→📖→⚔️→✨"
}

export const CEREMONY_STEPS: CeremonyStepDef[] = [
  {
    id: 'naming',
    title: 'Name Your Swordsman',
    description: 'Choose a display name for your identity',
    cosmologicalNote: 'The Moon needs a name to be called',
    emojiOptions: ['🗡️', '⚔️', '🛡️', '🏹', '🗿', '🌟'],
    dataKey: 'displayName',
    requiredForComplete: true,
  },
  {
    id: 'keygen',
    title: 'Forge Your Key',
    description: 'Ed25519 keypair generated in your browser',
    cosmologicalNote: 'Theia impact — instant delegation creates the Moon',
    emojiOptions: ['🔐', '🔑', '🗝️', '💎', '⚡', '🪨'],
    dataKey: 'publicKeyHex',
    requiredForComplete: true,
  },
  {
    id: 'privacy',
    title: 'Set Your Boundaries',
    description: 'Define how you appear when sharing',
    cosmologicalNote: 'The Moon reflects without owning',
    emojiOptions: ['🌑', '🙈', '👁️', '🎭', '🔒', '🕶️'],
    dataKey: 'privacyLevel',
    requiredForComplete: true,
  },
  {
    id: 'grimoires',
    title: 'Choose Your Grimoires',
    description: 'Select which spellbooks to study',
    cosmologicalNote: 'What light will the Moon reflect?',
    emojiOptions: ['📖', '📚', '📜', '🌀', '🧙', '✨'],
    dataKey: 'selectedGrimoires',
    requiredForComplete: true,
  },
  {
    id: 'seal',
    title: 'Seal Your Identity',
    description: 'Sign your agent card with your key',
    cosmologicalNote: 'The amnesia is the protocol',
    emojiOptions: ['⚔️', '🖋️', '💫', '🔥', '🌟', '👤'],
    dataKey: 'signature',
    requiredForComplete: true,
  },
  {
    id: 'activation',
    title: 'Moon Made Operational',
    description: 'Your swordsman enters the constellation',
    cosmologicalNote: 'The wound is the trust. The orbit is the proof.',
    emojiOptions: ['🌑', '✨', '🌅', '🎆', '💥', '🚀'],
    dataKey: 'activatedAt',
    requiredForComplete: true,
  },
];

/** Build constellation path string from step entries (emoji order by step definition). */
export function buildConstellationPath(steps: CeremonyStepEntry[]): string {
  const byId = new Map(steps.map((s) => [s.stepId, s.chosenEmoji]));
  const order = CEREMONY_STEPS.map((d) => d.id);
  return order.map((id) => byId.get(id) || '○').join('→');
}
