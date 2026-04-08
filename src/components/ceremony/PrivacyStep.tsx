'use client';

import type { AgentCard } from '@/lib/ceremony/types';
import type { CeremonyStepDef } from '@/lib/ceremony/constellation';
import EmojiPicker from './EmojiPicker';

export default function PrivacyStep({
  privacy,
  setPrivacy,
  onNext,
  constellationStep,
  chosenEmoji,
  onChosenEmoji,
  inscription,
  setInscription,
}: {
  privacy: AgentCard['privacy'];
  setPrivacy: (p: AgentCard['privacy']) => void;
  onNext: () => void;
  constellationStep?: CeremonyStepDef;
  chosenEmoji?: string | null;
  onChosenEmoji?: (emoji: string) => void;
  inscription?: string;
  setInscription?: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-text">{constellationStep?.title ?? 'Privacy Preferences'}</h2>
      <p className="text-text/80">
        {constellationStep?.description ?? 'How you appear when sharing proverbs or contributing. You can change this later in settings.'}
      </p>
      {constellationStep?.cosmologicalNote && (
        <p className="text-xs text-primary/70 italic">🌑 {constellationStep.cosmologicalNote}</p>
      )}
      {constellationStep && onChosenEmoji && (
        <EmojiPicker options={constellationStep.emojiOptions} value={chosenEmoji ?? null} onChange={onChosenEmoji} />
      )}
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-text/80">Attribution</span>
          <select
            value={privacy.attribution}
            onChange={(e) => setPrivacy({ ...privacy, attribution: e.target.value as AgentCard['privacy']['attribution'] })}
            className="mt-2 w-full px-4 py-3 rounded-xl border border-surface/50 bg-background text-text focus:border-primary focus:outline-none"
          >
            <option value="full">Full — use my display name</option>
            <option value="pseudonymous">Pseudonymous — participant id only</option>
            <option value="anonymous">Anonymous — no attribution</option>
          </select>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={privacy.shareProverbs}
            onChange={(e) => setPrivacy({ ...privacy, shareProverbs: e.target.checked })}
            className="rounded border-surface/50 text-primary focus:ring-primary"
          />
          <span className="text-text/80">Allow my proverbs to be shared in the stream (with chosen attribution)</span>
        </label>
      </div>
      {constellationStep && setInscription && (
        <label className="block">
          <span className="text-sm font-medium text-text/80">Inscription (optional)</span>
          <textarea
            value={inscription ?? ''}
            onChange={(e) => setInscription(e.target.value)}
            placeholder="A note about your boundaries..."
            rows={2}
            className="mt-2 w-full px-4 py-3 rounded-xl border border-surface/50 bg-background text-text placeholder:text-text/50 focus:border-primary focus:outline-none resize-none"
          />
        </label>
      )}
      <button
        type="button"
        onClick={onNext}
        className="w-full py-3 rounded-xl font-medium bg-primary text-background hover:bg-primary/90"
      >
        {constellationStep ? 'Inscribe & Continue' : 'Continue'}
      </button>
    </div>
  );
}
