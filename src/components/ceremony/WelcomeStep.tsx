'use client';

import type { CeremonyStepDef } from '@/lib/ceremony/constellation';
import EmojiPicker from './EmojiPicker';

export default function WelcomeStep({
  displayName,
  setDisplayName,
  onNext,
  constellationStep,
  chosenEmoji,
  onChosenEmoji,
  inscription,
  setInscription,
}: {
  displayName: string;
  setDisplayName: (v: string) => void;
  onNext: () => void;
  constellationStep?: CeremonyStepDef;
  chosenEmoji?: string | null;
  onChosenEmoji?: (emoji: string) => void;
  inscription?: string;
  setInscription?: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-text">
        {constellationStep?.title ?? 'Welcome to the Dual Ceremony'}
      </h2>
      <p className="text-text/80">
        {constellationStep?.description ?? 'You are about to create your Swordsman identity. This key will anchor your spellbooks and proverbs. Choose a display name—it can be pseudonymous.'}
      </p>
      {constellationStep?.cosmologicalNote && (
        <p className="text-xs text-primary/70 italic">🌑 {constellationStep.cosmologicalNote}</p>
      )}
      {constellationStep && onChosenEmoji && (
        <EmojiPicker options={constellationStep.emojiOptions} value={chosenEmoji ?? null} onChange={onChosenEmoji} />
      )}
      <label className="block">
        <span className="text-sm font-medium text-text/80">Swordsman display name</span>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. just another swordsman"
          className="mt-2 w-full px-4 py-3 rounded-xl border border-surface/50 bg-background text-text placeholder:text-text/50 focus:border-primary focus:outline-none"
          autoFocus
        />
      </label>
      {constellationStep && setInscription && (
        <label className="block">
          <span className="text-sm font-medium text-text/80">Inscription (optional)</span>
          <textarea
            value={inscription ?? ''}
            onChange={(e) => setInscription(e.target.value)}
            placeholder="What this name means to you..."
            rows={2}
            className="mt-2 w-full px-4 py-3 rounded-xl border border-surface/50 bg-background text-text placeholder:text-text/50 focus:border-primary focus:outline-none resize-none"
          />
        </label>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!displayName.trim()}
        className="w-full py-3 rounded-xl font-medium bg-primary text-background hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
      >
        {constellationStep ? 'Inscribe & Continue' : 'Continue'}
      </button>
    </div>
  );
}
