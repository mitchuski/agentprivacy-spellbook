'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppNav from '@/components/AppNav';
import CeremonyWizard from '@/components/ceremony/CeremonyWizard';
import SwordsmanAccountSettings from '@/components/ceremony/SwordsmanAccountSettings';
import { hasCompletedCeremony, getAgentCard } from '@/lib/ceremony/storage';
import type { AgentCard } from '@/lib/ceremony/types';

const ALLOWED_RETURN_TO = ['/spells', '/promises', '/story', '/mage'];

function CeremonyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnTo = searchParams.get('returnTo');
  const safeReturnTo = returnTo && ALLOWED_RETURN_TO.includes(returnTo) ? returnTo : '/spells';

  const [mounted, setMounted] = useState(false);
  const [agentCard, setAgentCard] = useState<AgentCard | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(hasCompletedCeremony());
    setAgentCard(getAgentCard());
    setMounted(true);
  }, []);

  const handleClearIdentity = () => {
    setAgentCard(null);
    setCompleted(false);
    router.refresh();
  };

  if (!mounted) {
    return (
      <>
        <h1 className="text-3xl font-bold text-text mb-2">Dual Ceremony</h1>
        <p className="text-text/70 mb-10">
          Create your Swordsman identity. Your key anchors your spellbooks and proverbs.
        </p>
        <div className="h-48 rounded-xl border border-surface/50 bg-surface/10 flex items-center justify-center text-text-muted">
          Loading…
        </div>
      </>
    );
  }

  if (completed && agentCard) {
    return (
      <>
        <h1 className="text-3xl font-bold text-text mb-2">Dual Ceremony</h1>
        <p className="text-text/70 mb-6">
          Your Swordsman identity is saved. Manage your account below or continue to Spells.
        </p>
        <SwordsmanAccountSettings card={agentCard} onClear={handleClearIdentity} />
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-text mb-2">Dual Ceremony</h1>
      <p className="text-text/70 mb-10">
        Create your Swordsman identity. Your key anchors your spellbooks and proverbs. After completion you will be taken to Spells to build your skill graph.
      </p>
      <CeremonyWizard returnTo={safeReturnTo} />
    </>
  );
}

export default function CeremonyPage() {
  return (
    <div className="min-h-screen bg-background text-text">
      <AppNav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Suspense fallback={<div className="text-text/60">Loading…</div>}>
          <CeremonyContent />
        </Suspense>
      </main>
    </div>
  );
}
