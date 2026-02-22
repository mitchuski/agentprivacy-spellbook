'use client';

import { GRIMOIRE_OPTIONS, type GrimoireOption } from '@/lib/ceremony/types';
import type { CeremonyStepDef } from '@/lib/ceremony/constellation';
import EmojiPicker from './EmojiPicker';

const LABELS: Record<GrimoireOption, string> = {
  story: 'Story (First Person)',
  zero: 'Zero (ZKP)',
  canon: 'Canon',
  society: 'Society',
  plurality: 'Plurality',
  incantations: 'Incantations',
};

export default function GrimoireStep({
  grimoires,
  setGrimoires,
  onNext,
  constellationStep,
  chosenEmoji,
  onChosenEmoji,
  inscription,
  setInscription,
}: {
  grimoires: string[];
  setGrimoires: (g: string[]) => void;
  onNext: () => void;
  constellationStep?: CeremonyStepDef;
  chosenEmoji?: string | null;
  onChosenEmoji?: (emoji: string) => void;
  inscription?: string;
  setInscription?: (v: string) => void;
}) {
  const toggle = (id: GrimoireOption) => {
    if (grimoires.includes(id)) setGrimoires(grimoires.filter((x) => x !== id));
    else setGrimoires([...grimoires, id]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-text">{constellationStep?.title ?? 'Grimoire Selection'}</h2>
      <p className="text-text/80">
        {constellationStep?.description ?? 'Which spellbooks do you want to engage with? You can change this on the Spells page later.'}
      </p>
      {constellationStep && onChosenEmoji && (
        <EmojiPicker options={constellationStep.emojiOptions} value={chosenEmoji ?? null} onChange={onChosenEmoji} />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GRIMOIRE_OPTIONS.map((id) => (
          <label
            key={id}
            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
              grimoires.includes(id) ? 'border-primary bg-primary/10' : 'border-surface/50 bg-surface/20 hover:border-surface'
            }`}
          >
            <input
              type="checkbox"
              checked={grimoires.includes(id)}
              onChange={() => toggle(id)}
              className="rounded border-surface/50 text-primary focus:ring-primary"
            />
            <span className="text-text font-medium">{LABELS[id]}</span>
          </label>
        ))}
      </div>
      {constellationStep && setInscription && (
        <label className="block">
          <span className="text-sm font-medium text-text/80">Inscription (optional)</span>
          <textarea
            value={inscription ?? ''}
            onChange={(e) => setInscription(e.target.value)}
            placeholder="A note about your path..."
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
