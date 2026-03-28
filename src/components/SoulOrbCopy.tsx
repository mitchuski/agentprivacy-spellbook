'use client';

import { useState } from 'react';

const SOUL_ORB = '(⚔️⊥⿻⊥🧙)🙂';

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

type SoulOrbCopyProps = {
  /** Inline footer text | footer wave orb | hero focal orb (Soulbis-style) */
  variant?: 'inline' | 'footerOrb' | 'heroOrb';
};

export default function SoulOrbCopy({ variant = 'inline' }: SoulOrbCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(SOUL_ORB);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (variant === 'heroOrb') {
    return (
      <div
        className="hero-soul-orb-container group pointer-events-none absolute left-1/2 top-[56%] z-[15] flex h-[5rem] w-[5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center md:left-[65%] md:top-[46%] md:z-[8]"
        data-hero-orb-hitbox
      >
        <span
          aria-hidden
          className={`footer-orb-idle-halo pointer-events-none absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out motion-reduce:transition-none md:h-12 md:w-12 ${
            copied ? 'scale-[2] opacity-0' : 'scale-100 opacity-[0.5] group-hover:opacity-75'
          }`}
        />
        {copied && (
          <>
            <span
              aria-hidden
              className="footer-orb-combust-burst pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[4.5rem] md:w-[4.5rem]"
            />
            <span
              aria-hidden
              className="footer-orb-combust-ring pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400/90"
            />
            <span
              aria-hidden
              className="footer-orb-combust-ring footer-orb-combust-ring--delay pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#e8523a]/80"
            />
          </>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className={`footer-orb-hit pointer-events-auto relative z-[2] h-14 w-14 min-h-[56px] min-w-[56px] rounded-full border-0 bg-transparent p-0
            cursor-pointer transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none
            hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c20]
            ${copied ? 'footer-orb-hit--copied scale-110' : ''}`}
          title="Click to copy soul orb"
          aria-label={`Copy soul orb inscription: ${SOUL_ORB}`}
        >
          <span className="sr-only">{SOUL_ORB}</span>
        </button>
      </div>
    );
  }

  if (variant === 'footerOrb') {
    return (
      <div
        className="group absolute left-[22%] top-[42%] z-30 flex h-[4.75rem] w-[4.75rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        data-footer-orb-hitbox
      >
        {/* Idle halo — aligns with canvas orb (~32px), visible overlap */}
        <span
          aria-hidden
          className={`footer-orb-idle-halo pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out motion-reduce:transition-none ${
            copied ? 'scale-[2] opacity-0' : 'scale-100 opacity-[0.55] group-hover:opacity-80'
          }`}
        />

        {/* Combustion: cyan/coral burst + expanding rings (on successful copy) */}
        {copied && (
          <>
            <span
              aria-hidden
              className="footer-orb-combust-burst pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
            />
            <span
              aria-hidden
              className="footer-orb-combust-ring pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400/90"
            />
            <span
              aria-hidden
              className="footer-orb-combust-ring footer-orb-combust-ring--delay pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#e8523a]/80"
            />
          </>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className={`footer-orb-hit relative z-[2] h-12 w-12 min-h-[48px] min-w-[48px] rounded-full border-0 bg-transparent p-0
            cursor-pointer pointer-events-auto
            transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none
            hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c20]
            ${copied ? 'footer-orb-hit--copied scale-110' : ''}`}
          title="Click to copy soul orb"
          aria-label={`Copy soul orb inscription: ${SOUL_ORB}`}
        >
          <span className="sr-only">{SOUL_ORB}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="relative z-50 pointer-events-auto hover:text-primary transition-all duration-300 cursor-pointer bg-transparent border-0 p-0 font-inherit text-inherit align-baseline"
      title="Click to copy"
    >
      <span
        className={`inline-block transition-all duration-300 ${
          copied ? 'scale-150 drop-shadow-[0_0_12px_rgba(77,217,232,1)]' : 'hover:scale-110'
        }`}
      >
        {SOUL_ORB}
      </span>
    </button>
  );
}
