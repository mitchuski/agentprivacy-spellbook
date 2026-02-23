'use client';

import { useState, useEffect } from 'react';
import { CEREMONY_STEPS } from '@/lib/ceremony/constellation';

const NEUTRAL_STEP_CLASS = 'inline-flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-lg text-lg sm:text-xl border-2 transition-all border-surface/30 bg-surface/10 text-text/40';

export default function ConstellationHeader({
  completedStepIds,
  currentStepId,
  chosenEmojis,
  onStepSelect,
}: {
  completedStepIds: string[];
  currentStepId: string | null;
  chosenEmojis: Record<string, string>;
  /** When set, emojis are clickable to navigate to that step (stepIndex 0-based). */
  onStepSelect?: (stepIndex: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Until mounted, render a fixed neutral state so server and client HTML match (avoids hydration mismatch).
  if (!mounted) {
    return (
      <div className="sticky top-0 z-10 py-4 -mx-2 px-2 rounded-lg bg-background/95 border-b border-surface/30 mb-6">
        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap" role="list" aria-label="Ceremony progress">
          {CEREMONY_STEPS.map((step, i) => (
            <span key={step.id} className="flex items-center gap-1 sm:gap-2">
              <span className={NEUTRAL_STEP_CLASS} aria-label={step.title} title={step.title}>
                ○
              </span>
              {i < CEREMONY_STEPS.length - 1 && (
                <span className="text-text/30 text-sm hidden sm:inline" aria-hidden>→</span>
              )}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 py-4 -mx-2 px-2 rounded-lg bg-background/95 border-b border-surface/30 mb-6">
      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap" role="list" aria-label="Ceremony progress">
        {CEREMONY_STEPS.map((step, i) => {
          const isCompleted = completedStepIds.includes(step.id);
          const isCurrent = step.id === currentStepId;
          const emoji = chosenEmojis[step.id];
          const display = emoji ?? '○';
          const stepClassName =
            isCompleted
              ? 'inline-flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-lg text-lg sm:text-xl border-2 transition-all border-primary bg-primary/20 text-primary'
              : isCurrent
                ? 'inline-flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-lg text-lg sm:text-xl border-2 transition-all border-primary bg-primary/10 text-primary animate-pulse'
                : NEUTRAL_STEP_CLASS;
          const clickable = !!onStepSelect;
          const content = (
            <>
              {display}
            </>
          );
          return (
            <span key={step.id} className="flex items-center gap-1 sm:gap-2">
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepSelect(i)}
                  className={`${stepClassName} cursor-pointer hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
                  aria-label={`${step.title}${isCurrent ? ' (current)' : ''}`}
                  title={step.title}
                >
                  {content}
                </button>
              ) : (
                <span className={stepClassName} aria-label={step.title} title={step.title}>
                  {content}
                </span>
              )}
              {i < CEREMONY_STEPS.length - 1 && (
                <span className="text-text/30 text-sm hidden sm:inline" aria-hidden>→</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
