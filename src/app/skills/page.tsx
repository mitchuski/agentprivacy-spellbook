'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /skills to /spells (spells page is the canonical route).
 */
export default function SkillsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/spells');
  }, [router]);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-text">
      <p className="text-text/70">Redirecting to spells…</p>
    </div>
  );
}
