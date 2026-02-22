'use client';

import type { AgentCard } from '@/lib/ceremony/types';
import type { CeremonyStepDef } from '@/lib/ceremony/constellation';
import TierBadge from '@/components/trust/TierBadge';
import EmojiPicker from './EmojiPicker';

export default function AgentCardStep({
  card,
  onNext,
  constellationStep,
  chosenEmoji,
  onChosenEmoji,
  inscription,
  setInscription,
}: {
  card: AgentCard;
  onNext: () => void;
  constellationStep?: CeremonyStepDef;
  chosenEmoji?: string | null;
  onChosenEmoji?: (emoji: string) => void;
  inscription?: string;
  setInscription?: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-text">{constellationStep?.title ?? 'Your Agent Card'}</h2>
      <p className="text-text/80">
        {constellationStep?.description ?? 'This is your signed Swordsman identity. It will be saved locally; your private key is not stored—back it up in the next step if you need to re-sign later.'}
      </p>
      {constellationStep && onChosenEmoji && (
        <EmojiPicker options={constellationStep.emojiOptions} value={chosenEmoji ?? null} onChange={onChosenEmoji} />
      )}
      <div className="rounded-xl border border-surface/50 bg-surface/20 p-6 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-text">{card.displayName}</span>
          <TierBadge tier={card.trustTier} showLabel={true} />
        </div>
        <div className="text-sm text-text/70 font-mono break-all">{card.participantId}</div>
        <div className="text-xs text-text/50">Public key: {card.publicKeyHex.slice(0, 24)}…</div>
        <div className="text-xs text-text/50">
          Grimoires: {card.grimoires.join(', ') || 'none'} · Attribution: {card.privacy.attribution}
        </div>
      </div>
      {constellationStep && setInscription && (
        <label className="block">
          <span className="text-sm font-medium text-text/80">Inscription (optional)</span>
          <textarea
            value={inscription ?? ''}
            onChange={(e) => setInscription(e.target.value)}
            placeholder="A note as you seal your identity..."
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
        {constellationStep ? 'Inscribe & Complete' : 'Continue to completion'}
      </button>
    </div>
  );
}
