'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useMagePanel } from '@/contexts/MagePanelContext';
import { getAgentCard, hasCompletedCeremony } from '@/lib/ceremony/storage';
import { NAV_LINKS } from '@/lib/nav';

// Split nav links into two groups for mobile dropdowns
const SPELLBOOKS_KEYS = ['story', 'zero', 'canon', 'society', 'plural'];
const TOOLS_KEYS = ['proverbs', 'evoke', 'poems', 'mage', 'promise', 'spells', 'web', 'orbs'];

// Plain <a> for nav so static server serves the right HTML on click (no RSC fetch).
const NavLink = ({ href, className, onClick, title, children }: { href: string; className: string; onClick?: () => void; title?: string; children: React.ReactNode }) => (
  <a href={href} className={className} onClick={onClick} title={title}>{children}</a>
);

export default function AppNav() {
  const pathname = usePathname();
  const { openMagePanel } = useMagePanel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [spellbooksOpen, setSpellbooksOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [ceremonyComplete, setCeremonyComplete] = useState(false);
  const [swordsmanName, setSwordsmanName] = useState<string | null>(null);

  // Filter nav links into groups
  const soulbisLink = NAV_LINKS.find(l => l.key === 'soulbis');
  const spellbookLinks = NAV_LINKS.filter(l => SPELLBOOKS_KEYS.includes(l.key));
  const toolLinks = NAV_LINKS.filter(l => TOOLS_KEYS.includes(l.key));

  useEffect(() => {
    const sync = () => {
      const card = getAgentCard();
      setSwordsmanName(card?.displayName ?? null);
      setCeremonyComplete(hasCompletedCeremony());
    };
    sync();
    window.addEventListener('ap-identity-changed', sync);
    return () => window.removeEventListener('ap-identity-changed', sync);
  }, []);

  // Nav: soulbis is emoji-only (no name) so layout doesn't shift; same size as mage for symmetry
  const navLinks = NAV_LINKS;

  const isCurrentPage = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href));

  const linkClass = (href: string) => {
    return isCurrentPage(href)
      ? 'text-primary border-b-2 border-primary pb-1 font-medium'
      : 'text-text-muted hover:text-text transition-colors font-medium';
  };

  const mobileLinkClass = (href: string) => {
    return isCurrentPage(href)
      ? 'block text-primary border-b-2 border-primary pb-1 font-medium py-2'
      : 'block text-text-muted hover:text-text transition-colors font-medium py-2';
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-8 min-w-0">
            <a href="/" className="text-xl font-bold text-text hover:text-primary transition-colors flex-shrink-0">
              agentprivacy
            </a>
            <div className="hidden lg:flex items-center gap-4 sm:gap-6 min-w-0">
              {navLinks.map(({ href, label, key }) => (
                <NavLink key={href} href={href} className={`flex-shrink-0 ${linkClass(href)} ${key === 'soulbis' ? 'inline-flex items-center' : ''}`} title={key === 'soulbis' ? (ceremonyComplete && swordsmanName ? `Ceremony: ${swordsmanName}` : 'Ceremony') : undefined}>
                  {key === 'soulbis' ? <span className="text-2xl leading-none" aria-hidden>⚔️</span> : label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={openMagePanel}
              className="p-2 rounded-lg hover:bg-surface/50 transition-colors text-text-muted hover:text-text hidden lg:block"
              aria-label="Soulbae"
              title="Soulbae"
            >
              <span className="text-2xl leading-none" aria-hidden>🧙</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-text hover:text-primary transition-colors"
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
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-surface/50">
                {/* Soulbis (Ceremony) - standalone */}
                {soulbisLink && (
                  <NavLink
                    href={soulbisLink.href}
                    className={mobileLinkClass(soulbisLink.href)}
                    title={ceremonyComplete && swordsmanName ? `Ceremony: ${swordsmanName}` : 'Ceremony'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-2xl leading-none" aria-hidden>⚔️</span>
                    <span className="ml-2 text-sm text-text-muted">ceremony</span>
                  </NavLink>
                )}

                {/* Spellbooks Dropdown */}
                <div className="border-t border-surface/30 pt-2">
                  <button
                    type="button"
                    onClick={() => setSpellbooksOpen(!spellbooksOpen)}
                    className="flex items-center justify-between w-full text-text-muted hover:text-text transition-colors font-medium py-2"
                  >
                    <span>📚 Spellbooks</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${spellbooksOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {spellbooksOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-4 border-l-2 border-primary/30 ml-2"
                      >
                        {spellbookLinks.map(({ href, label }) => (
                          <NavLink
                            key={href}
                            href={href}
                            className={mobileLinkClass(href)}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Tools Dropdown */}
                <div className="border-t border-surface/30 pt-2">
                  <button
                    type="button"
                    onClick={() => setToolsOpen(!toolsOpen)}
                    className="flex items-center justify-between w-full text-text-muted hover:text-text transition-colors font-medium py-2"
                  >
                    <span>🛠️ Tools</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${toolsOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {toolsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-4 border-l-2 border-amber-500/30 ml-2"
                      >
                        {toolLinks.map(({ href, label }) => (
                          <NavLink
                            key={href}
                            href={href}
                            className={mobileLinkClass(href)}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Soulbae button */}
                <div className="border-t border-surface/30 pt-2">
                  <button
                    type="button"
                    onClick={() => { openMagePanel(); setMobileMenuOpen(false); }}
                    className="block text-text-muted hover:text-text transition-colors font-medium py-2 w-full text-left"
                  >
                    🧙 Soulbae
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
