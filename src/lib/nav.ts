/**
 * Single source of truth for site navigation.
 * Matches AGENTPRIVACY_LANDING_SPEC: soulbis, story, zero, canon, society, plural, proverbs, evoke, privacy, mage, promise, spells, web. 🧙 right.
 */

export interface NavLink {
  href: string;
  label: string;
  key: string;
}

/** Nav order and labels per spec. Hrefs use actual app routes so client-side navigation works. */
export const NAV_LINKS: NavLink[] = [
  { href: '/ceremony', label: '⚔️', key: 'soulbis' },
  { href: '/story', label: 'story', key: 'story' },
  { href: '/zero', label: 'zero', key: 'zero' },
  { href: '/canon', label: 'canon', key: 'canon' },
  { href: '/society', label: 'society', key: 'society' },
  { href: '/plurality', label: 'plural', key: 'plural' },
  { href: '/proverbs', label: 'proverbs', key: 'proverbs' },
  { href: '/evoke', label: 'evoke', key: 'evoke' },
  { href: '/privacy', label: 'privacy', key: 'privacy' },
  { href: '/mage', label: 'mage', key: 'mage' },
  { href: '/promises', label: 'promise', key: 'promise' },
  { href: '/spells', label: 'spells', key: 'spells' },
  { href: '/web', label: 'web', key: 'web' },
];

/** Hero / CTA links. Use actual routes so client-side nav works. */
export const ROUTES = {
  ceremony: '/ceremony',
  story: '/story',
  spellbook: '/spells',
  spells: '/spells',
  promises: '/promises',
  plurality: '/plurality',
} as const;
