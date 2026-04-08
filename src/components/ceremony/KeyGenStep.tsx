'use client';

import { useState, useEffect } from 'react';
import type { CeremonyStepDef } from '@/lib/ceremony/constellation';
import EmojiPicker from './EmojiPicker';

export default function KeyGenStep({
  onKeyGenerated,
  onNext,
  constellationStep,
  chosenEmoji,
  onChosenEmoji,
  inscription,
  setInscription,
}: {
  onKeyGenerated: (keypair: { privateKey: Uint8Array; publicKey: Uint8Array }) => void;
  onNext: () => void;
  constellationStep?: CeremonyStepDef;
  chosenEmoji?: string | null;
  onChosenEmoji?: (emoji: string) => void;
  inscription?: string;
  setInscription?: (v: string) => void;
}) {
  const [status, setStatus] = useState<'idle' | 'generating' | 'done'>('idle');
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'idle') return;
    setStatus('generating');
    setErr(null);
    import('@/lib/ceremony/keygen')
      .then((m) => m.generateKeyPair())
      .then((keypair) => {
        onKeyGenerated(keypair);
        setStatus('done');
      })
      .catch((e) => {
        setErr(e instanceof Error ? e.message : 'Key generation failed');
        setStatus('idle');
      });
  }, [status, onKeyGenerated]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-text">{constellationStep?.title ?? 'Key Generation'}</h2>
      <p className="text-text/80">
        {constellationStep?.description ?? 'An Ed25519 keypair is being generated in your browser. Your private key never leaves this device.'}
      </p>
      {constellationStep?.cosmologicalNote && (
        <p className="text-xs text-primary/70 italic">🪨 {constellationStep.cosmologicalNote}</p>
      )}
      {constellationStep && onChosenEmoji && (
        <EmojiPicker options={constellationStep.emojiOptions} value={chosenEmoji ?? null} onChange={onChosenEmoji} />
      )}
      <div className="min-h-[120px] flex flex-col items-center justify-center rounded-xl border border-surface/50 bg-surface/20 p-6">
        {status === 'generating' && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-text/70">Generating keypair...</span>
          </div>
        )}
        {status === 'done' && (
          <div className="flex flex-col items-center gap-3 text-primary">
            <span className="text-3xl">OK</span>
            <span className="font-medium">Keypair ready</span>
          </div>
        )}
        {err && <p className="text-red-500 text-sm">{err}</p>}
      </div>
      {constellationStep && setInscription && (
        <label className="block">
          <span className="text-sm font-medium text-text/80">Inscription (optional)</span>
          <textarea
            value={inscription ?? ''}
            onChange={(e) => setInscription(e.target.value)}
            placeholder="A note about this key..."
            rows={2}
            className="mt-2 w-full px-4 py-3 rounded-xl border border-surface/50 bg-background text-text placeholder:text-text/50 focus:border-primary focus:outline-none resize-none"
          />
        </label>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={status !== 'done'}
        className="w-full py-3 rounded-xl font-medium bg-primary text-background hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
      >
        {constellationStep ? 'Inscribe & Continue' : 'Continue'}
      </button>
    </div>
  );
}
