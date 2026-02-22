'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useMagePanel } from '@/contexts/MagePanelContext';
import { getAgentCard } from '@/lib/ceremony/storage';

/** Nav order: ⚔️(ceremony) - story - zero - canon - society - plural - proverbs - evoke - privacy - mage - promise - spells. 🧙 far right opens AI panel. */
const NAV_LINKS_BASE: { href: string; label: string; key: string }[] = [
  { href: '/ceremony', label: '⚔️', key: 'ceremony' },
  { href: '/story', label: 'story', key: 'story' },
  { href: '/zero', label: 'zero', key: 'zero' },
  { href: '/canon', label: 'canon', key: 'canon' },
  { href: '/society', label: 'society', key: 'society' },
  { href: '/plurality', label: 'plural', key: 'plurality' },
  { href: '/proverbs', label: 'proverbs', key: 'proverbs' },
  { href: '/evoke', label: 'evoke', key: 'evoke' },
  { href: '/privacy', label: 'privacy', key: 'privacy' },
  { href: '/mage', label: 'mage', key: 'mage' },
  { href: '/promises', label: 'promise', key: 'promises' },
  { href: '/spells', label: 'spells', key: 'spells' },
];

export default function AppNav() {
  const pathname = usePathname();
  const { openMagePanel } = useMagePanel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [swordsmanName, setSwordsmanName] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const card = getAgentCard();
      setSwordsmanName(card?.displayName ?? null);
    };
    sync();
    window.addEventListener('ap-identity-changed', sync);
    return () => window.removeEventListener('ap-identity-changed', sync);
  }, []);

  const navLinks = NAV_LINKS_BASE.map((link) =>
    link.key === 'ceremony' && swordsmanName
      ? { ...link, label: `⚔️ ${swordsmanName}` }
      : link
  );

  const linkClass = (href: string) => {
    const isCurrent = pathname === href || (href !== '/' && pathname?.startsWith(href));
    return isCurrent
      ? 'text-primary border-b-2 border-primary pb-1 font-medium'
      : 'text-text-muted hover:text-text transition-colors font-medium';
  };

  const mobileLinkClass = (href: string) => {
    const isCurrent = pathname === href || (href !== '/' && pathname?.startsWith(href));
    return isCurrent
      ? 'block text-primary border-b-2 border-primary pb-1 font-medium py-2'
      : 'block text-text-muted hover:text-text transition-colors font-medium py-2';
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-8 min-w-0">
            <Link href="/" className="text-xl font-bold text-text hover:text-primary transition-colors flex-shrink-0">
              agentprivacy
            </Link>
            <div className="hidden md:flex items-center gap-4 sm:gap-6 min-w-0">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className={`flex-shrink-0 ${linkClass(href)}`}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={openMagePanel}
              className="p-2 rounded-lg hover:bg-surface/50 transition-colors text-text-muted hover:text-text hidden md:block"
              aria-label="Open AI panel"
              title="Open AI panel"
            >
              <span className="text-2xl leading-none" aria-hidden>🧙</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text hover:text-primary transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-3 border-t border-surface/50">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={mobileLinkClass(href)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => { openMagePanel(); setMobileMenuOpen(false); }}
                  className="block text-text-muted hover:text-text transition-colors font-medium py-2 w-full text-left"
                >
                  🧙 Open AI panel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
