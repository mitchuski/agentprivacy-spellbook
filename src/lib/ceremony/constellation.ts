/**
 * Ceremony constellation: emoji path and step definitions for the dual ceremony.
 * Each step lets the user choose a marker emoji and optional inscription.
 */

export interface CeremonyStepDef {
  id: string;
  title: string;
  description: string;
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
    emojiOptions: ['🗡️', '⚔️', '🛡️', '🏹', '🗿', '🌟'],
    dataKey: 'displayName',
    requiredForComplete: true,
  },
  {
    id: 'keygen',
    title: 'Forge Your Key',
    description: 'Ed25519 keypair generated in your browser',
    emojiOptions: ['🔐', '🔑', '🗝️', '💎', '⚡', '🔮'],
    dataKey: 'publicKeyHex',
    requiredForComplete: true,
  },
  {
    id: 'privacy',
    title: 'Set Your Boundaries',
    description: 'Define how you appear when sharing',
    emojiOptions: ['🙈', '👁️', '🎭', '🌑', '🔒', '🕶️'],
    dataKey: 'privacyLevel',
    requiredForComplete: true,
  },
  {
    id: 'grimoires',
    title: 'Choose Your Grimoires',
    description: 'Select which spellbooks to study',
    emojiOptions: ['📖', '📚', '📜', '🌀', '🧙', '✨'],
    dataKey: 'selectedGrimoires',
    requiredForComplete: true,
  },
  {
    id: 'seal',
    title: 'Seal Your Identity',
    description: 'Sign your agent card with your key',
    emojiOptions: ['⚔️', '🖋️', '💫', '🔥', '🌟', '👤'],
    dataKey: 'signature',
    requiredForComplete: true,
  },
  {
    id: 'activation',
    title: 'Activation',
    description: 'Your swordsman enters the constellation',
    emojiOptions: ['✨', '🌅', '🎆', '💥', '🌟', '🚀'],
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
