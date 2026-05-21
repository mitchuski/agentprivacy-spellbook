'use client';

import { useState, useCallback } from 'react';
import type { AgentCard, TrustTier } from '@/lib/ceremony/types';
import { GRIMOIRE_OPTIONS } from '@/lib/ceremony/types';
import { calculateTier } from '@/lib/trust/tiers';
import { saveAgentCard, saveKeys, saveCeremonyConstellation, getCeremonyConstellation } from '@/lib/ceremony/storage';
import {
  publicKeyToHex,
  signMessage,
  generateParticipantId,
  hexToBytes,
} from '@/lib/ceremony/keygen';

interface ArchonBundle {
  version: number;
  type: string;
  participantId: string;
  displayName: string;
  publicKeyHex: string;
  privateKeyHex: string;
  archonDid: string;
  grimoires: string[];
  privacy: { attribution: 'full' | 'pseudonymous' | 'anonymous'; shareProverbs: boolean };
  trustTier: TrustTier;
  signature: string;
  exportedAt: string;
}

function parseArchonBundle(raw: string): ArchonBundle | string {
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return 'Invalid JSON'; }
  const b = parsed as Record<string, unknown>;
  if (b.type !== 'archon-swordsman-session') return 'Not an Archon swordsman bundle (wrong type field)';
  if (!b.participantId || !b.publicKeyHex || !b.privateKeyHex || !b.signature) {
    return 'Bundle missing required fields';
  }
  if (typeof b.privateKeyHex !== 'string' || b.privateKeyHex.length !== 64) {
    return 'privateKeyHex must be 64 hex chars (32-byte Ed25519 seed)';
  }
  if (typeof b.publicKeyHex !== 'string' || b.publicKeyHex.length !== 64) {
    return 'publicKeyHex must be 64 hex chars';
  }
  return b as unknown as ArchonBundle;
}
import {
  CEREMONY_STEPS,
  buildConstellationPath,
  type CeremonyStepEntry,
  type CeremonyConstellation,
} from '@/lib/ceremony/constellation';
import WelcomeStep from './WelcomeStep';
import KeyGenStep from './KeyGenStep';
import PrivacyStep from './PrivacyStep';
import GrimoireStep from './GrimoireStep';
import AgentCardStep from './AgentCardStep';
import CompletionStep from './CompletionStep';
import ConstellationHeader from './ConstellationHeader';

const STEP_IDS = CEREMONY_STEPS.map((s) => s.id);

export default function CeremonyWizard({ returnTo = '/spells' }: { returnTo?: string }) {
  const [step, setStep] = useState(1);
  const [showArchonImport, setShowArchonImport] = useState(false);
  const [archonInput, setArchonInput] = useState('');
  const [archonBundle, setArchonBundle] = useState<ArchonBundle | null>(null);
  const [archonError, setArchonError] = useState<string | null>(null);

  const handleArchonInputChange = (raw: string) => {
    setArchonInput(raw);
    setArchonError(null);
    setArchonBundle(null);
    if (!raw.trim()) return;
    const result = parseArchonBundle(raw.trim());
    if (typeof result === 'string') setArchonError(result);
    else setArchonBundle(result);
  };

  const handleArchonImport = () => {
    if (!archonBundle) return;
    saveKeys({
      privateKey: hexToBytes(archonBundle.privateKeyHex),
      publicKey: hexToBytes(archonBundle.publicKeyHex),
    });
    saveAgentCard({
      participantId: archonBundle.participantId,
      displayName: archonBundle.displayName,
      publicKeyHex: archonBundle.publicKeyHex,
      grimoires: archonBundle.grimoires,
      privacy: archonBundle.privacy,
      trustTier: archonBundle.trustTier,
      createdAt: archonBundle.exportedAt,
      signature: archonBundle.signature,
    });
    window.location.reload();
  };
  const [displayName, setDisplayName] = useState('');
  const [keypair, setKeypair] = useState<{ privateKey: Uint8Array; publicKey: Uint8Array } | null>(null);
  const [privacy, setPrivacy] = useState<AgentCard['privacy']>({
    attribution: 'pseudonymous',
    shareProverbs: true,
  });
  const [grimoires, setGrimoires] = useState<string[]>(() => [...GRIMOIRE_OPTIONS]);

  // Constellation: step entries + current step's chosen emoji / inscription (before commit)
  const [constellationSteps, setConstellationSteps] = useState<CeremonyStepEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = getCeremonyConstellation();
    return saved?.steps ?? [];
  });
  const [currentChosenEmoji, setCurrentChosenEmoji] = useState<string | null>(null);
  const [currentInscription, setCurrentInscription] = useState('');

  const currentStepId = step >= 1 && step <= STEP_IDS.length ? STEP_IDS[step - 1]! : null;
  const completedStepIds = constellationSteps.map((s) => s.stepId);
  const chosenEmojis: Record<string, string> = {};
  constellationSteps.forEach((e) => {
    chosenEmojis[e.stepId] = e.chosenEmoji;
  });
  if (currentChosenEmoji && currentStepId) chosenEmojis[currentStepId] = currentChosenEmoji;

  const commitStepAndNext = useCallback(
    (nextStep: number) => {
      if (!currentStepId) {
        setStep(nextStep);
        return;
      }
      const def = CEREMONY_STEPS.find((d) => d.id === currentStepId);
      const emoji = currentChosenEmoji ?? def?.emojiOptions[0] ?? '✨';
      const entry: CeremonyStepEntry = {
        stepId: currentStepId,
        chosenEmoji: emoji,
        inscription: currentInscription.trim(),
        completedAt: new Date().toISOString(),
      };
      setConstellationSteps((prev) => {
        const filtered = prev.filter((s) => s.stepId !== currentStepId);
        const next = [...filtered, entry];
        const path = buildConstellationPath(next);
        saveCeremonyConstellation({ steps: next, constellationPath: path });
        return next;
      });
      setCurrentChosenEmoji(null);
      setCurrentInscription('');
      setStep(nextStep);
    },
    [currentStepId, currentChosenEmoji, currentInscription]
  );

  const handleKeyGenerated = useCallback((kp: { privateKey: Uint8Array; publicKey: Uint8Array }) => {
    setKeypair(kp);
    saveKeys(kp);
  }, []);

  const handleAgentCardNext = useCallback(async () => {
    if (!keypair) return;
    const publicKeyHex = publicKeyToHex(keypair.publicKey);
    const participantId = generateParticipantId(publicKeyHex);
    const cardPayload: Omit<AgentCard, 'signature' | 'createdAt' | 'constellationPath'> = {
      participantId,
      displayName: displayName.trim(),
      publicKeyHex,
      grimoires,
      privacy,
      trustTier: calculateTier({ completedPromises: 0, studiedActs: 0 }),
    };
    const toSign = JSON.stringify({
      participantId: cardPayload.participantId,
      displayName: cardPayload.displayName,
      publicKeyHex: cardPayload.publicKeyHex,
      grimoires: cardPayload.grimoires,
      privacy: cardPayload.privacy,
      trustTier: cardPayload.trustTier,
    });
    const signature = await signMessage(keypair.privateKey, toSign);
    const finalSteps: CeremonyStepEntry[] = [
      ...constellationSteps,
      ...(currentStepId
        ? [
            {
              stepId: currentStepId,
              chosenEmoji: currentChosenEmoji ?? CEREMONY_STEPS.find((d) => d.id === currentStepId)?.emojiOptions[0] ?? '✨',
              inscription: currentInscription.trim(),
              completedAt: new Date().toISOString(),
            },
          ]
        : []),
    ];
    const activationEntry: CeremonyStepEntry = {
      stepId: 'activation',
      chosenEmoji: CEREMONY_STEPS.find((d) => d.id === 'activation')?.emojiOptions[0] ?? '✨',
      inscription: '',
      completedAt: new Date().toISOString(),
    };
    const allSteps = [...finalSteps.filter((s) => s.stepId !== 'activation'), activationEntry];
    const constellationPath = buildConstellationPath(allSteps);
    saveCeremonyConstellation({ steps: allSteps, constellationPath });

    const card: AgentCard = {
      ...cardPayload,
      createdAt: new Date().toISOString(),
      signature,
      constellationPath,
    };
    saveAgentCard(card);
    setCurrentChosenEmoji(null);
    setCurrentInscription('');
    setConstellationSteps(allSteps);
    setStep(6);
  }, [keypair, displayName, grimoires, privacy, constellationSteps, currentStepId, currentChosenEmoji, currentInscription]);

  const redirectTo = returnTo || '/spells';

  return (
    <div className="max-w-lg mx-auto">
      {/* Archon import bypass — above the ceremony steps */}
      <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5">
        <button
          type="button"
          onClick={() => setShowArchonImport((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-left"
        >
          <span className="text-sm font-medium text-amber-400">⚔️ Already have an Archon Swordsman?</span>
          <span className="text-amber-500/60 text-xs">{showArchonImport ? '▲' : '▼'}</span>
        </button>
        {showArchonImport && (
          <div className="px-5 pb-5 space-y-3 border-t border-amber-500/20 pt-4">
            <p className="text-xs text-text/70">
              Generate a session bundle with the CLI, then paste it below to skip the ceremony.
            </p>
            <div className="rounded-lg bg-surface/20 px-3 py-2">
              <code className="text-xs text-amber-400/80 font-mono break-all">
                node --experimental-strip-types export-swordsman-key.ts --name Excalibur
              </code>
            </div>
            <textarea
              className={`w-full h-36 rounded-lg border bg-surface/10 p-3 text-xs font-mono text-text resize-none focus:outline-none transition-colors ${
                archonError
                  ? 'border-red-500/60'
                  : archonBundle
                  ? 'border-green-500/60'
                  : 'border-amber-500/30 focus:border-amber-500/60'
              }`}
              placeholder={'{\n  "type": "archon-swordsman-session",\n  ...\n}'}
              value={archonInput}
              onChange={(e) => handleArchonInputChange(e.target.value)}
              spellCheck={false}
            />
            {archonError && <p className="text-xs text-red-400">{archonError}</p>}
            {archonBundle && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/5 px-3 py-2 space-y-1">
                <p className="text-xs font-medium text-green-400">Bundle valid</p>
                <p className="text-xs text-text/70">{archonBundle.participantId} · {archonBundle.displayName} · {archonBundle.trustTier}</p>
                <p className="text-xs text-text/50 font-mono break-all">{archonBundle.archonDid}</p>
              </div>
            )}
            <button
              type="button"
              onClick={handleArchonImport}
              disabled={!archonBundle}
              className="w-full py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-sm font-medium hover:bg-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Import & Begin
            </button>
          </div>
        )}
      </div>

      <ConstellationHeader
        completedStepIds={completedStepIds}
        currentStepId={currentStepId}
        chosenEmojis={chosenEmojis}
        onStepSelect={(stepIndex) => setStep(stepIndex + 1)}
      />

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {CEREMONY_STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(i + 1)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              step === i + 1 ? 'bg-primary/20 text-primary' : 'bg-surface/20 text-text/70'
            }`}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-surface/50 bg-surface/10 p-6 sm:p-8">
        {step === 1 && (
          <WelcomeStep
            displayName={displayName}
            setDisplayName={setDisplayName}
            onNext={() => commitStepAndNext(2)}
            constellationStep={CEREMONY_STEPS[0]}
            chosenEmoji={currentChosenEmoji}
            onChosenEmoji={setCurrentChosenEmoji}
            inscription={currentInscription}
            setInscription={setCurrentInscription}
          />
        )}
        {step === 2 && (
          <KeyGenStep
            onKeyGenerated={handleKeyGenerated}
            onNext={() => commitStepAndNext(3)}
            constellationStep={CEREMONY_STEPS[1]}
            chosenEmoji={currentChosenEmoji}
            onChosenEmoji={setCurrentChosenEmoji}
            inscription={currentInscription}
            setInscription={setCurrentInscription}
          />
        )}
        {step === 3 && (
          <PrivacyStep
            privacy={privacy}
            setPrivacy={setPrivacy}
            onNext={() => commitStepAndNext(4)}
            constellationStep={CEREMONY_STEPS[2]}
            chosenEmoji={currentChosenEmoji}
            onChosenEmoji={setCurrentChosenEmoji}
            inscription={currentInscription}
            setInscription={setCurrentInscription}
          />
        )}
        {step === 4 && (
          <GrimoireStep
            grimoires={grimoires}
            setGrimoires={setGrimoires}
            onNext={() => commitStepAndNext(5)}
            constellationStep={CEREMONY_STEPS[3]}
            chosenEmoji={currentChosenEmoji}
            onChosenEmoji={setCurrentChosenEmoji}
            inscription={currentInscription}
            setInscription={setCurrentInscription}
          />
        )}
        {step === 5 && keypair && (
          <AgentCardStep
            card={{
              participantId: generateParticipantId(publicKeyToHex(keypair.publicKey)),
              displayName: displayName.trim() || 'Swordsman',
              publicKeyHex: publicKeyToHex(keypair.publicKey),
              grimoires,
              privacy,
              trustTier: calculateTier({ completedPromises: 0, studiedActs: 0 }),
              createdAt: new Date().toISOString(),
              signature: '',
            }}
            onNext={handleAgentCardNext}
            constellationStep={CEREMONY_STEPS[4]}
            chosenEmoji={currentChosenEmoji}
            onChosenEmoji={setCurrentChosenEmoji}
            inscription={currentInscription}
            setInscription={setCurrentInscription}
          />
        )}
        {step === 6 && <CompletionStep returnTo={redirectTo} />}
      </div>
    </div>
  );
}
