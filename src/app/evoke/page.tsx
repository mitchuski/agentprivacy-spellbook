'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import MagePanel from '@/components/MagePanel';

// Stream entry interface
interface StreamEntry {
  id: string;
  proverb: string;
  spellbook?: 'story' | 'zero' | 'canon' | 'society' | 'plurality';
  actNumber?: number;
  actTitle?: string;
  spell?: string;
  date: string;
  author?: string;
}

// Sample stream entries - in production, these would come from a database/API
const sampleEntries: StreamEntry[] = [
  {
    id: '1',
    proverb: 'Dawn whispers, "Ask the wind what it carries, and you\'ll hear the stories of the unseen."',
    spellbook: 'story',
    actNumber: 1,
    actTitle: 'Act I: Venice',
    spell: '📖💰 → 🐉⏳ → ⚔️🔮',
    date: 'Jan 20, 2026',
  },
  {
    id: '2',
    proverb: 'Whispers of raindrops, roars of thunder, glimmers of focused light compose the symphony of sovereign data.',
    spellbook: undefined,
    actNumber: undefined,
    actTitle: 'privacy',
    spell: '📖💰 → 🐉⏳ → ⚔️🔮 → 💰∞',
    date: 'Jan 20, 2026',
  },
  {
    id: '3',
    proverb: 'A blade that sings alone still echoes in the canyon of trust.',
    spellbook: 'story',
    actNumber: 4,
    actTitle: 'Act IV: Blade Alone',
    spell: '🗡️ → 🍪⚔️ → 🔒 → 📖📝 → 🤝📜₁',
    date: 'Jan 20, 2026',
  },
  {
    id: '4',
    proverb: 'A sunrise over the Grand Canal reminds us that every new day is a fresh ledger, waiting for only the entries we consent to write.',
    spellbook: 'story',
    actNumber: 1,
    actTitle: 'Act I: Venice',
    spell: '📖💰 → 🐉⏳ → ⚔️🔮',
    date: 'Jan 20, 2026',
  },
  {
    id: '5',
    proverb: 'When the sunrise kisses the harbor, the city whispers its secrets to those who listen.',
    spellbook: 'society',
    actNumber: 4,
    actTitle: 'Chapter 4: The Manifesto',
    spell: '📜(May) → 🔓(Gilmore) → 💻(hacktivists) → 🔮(cyberstate) → ⚡(prophecy)',
    date: 'Jan 20, 2026',
  },
  {
    id: '6',
    proverb: 'The swordsman who never strikes guards nothing; the mage who never casts commands nothing.',
    spellbook: 'story',
    actNumber: 1,
    actTitle: 'Act I: Venice',
    spell: '📖💰 → 🐉⏳ → ⚔️🔮',
    date: 'Jan 20, 2026',
  },
  {
    id: '7',
    proverb: 'What the swordsman executes, the mage authorised; what the mage composes, the swordsman proves capable.',
    spellbook: 'story',
    actNumber: 2,
    actTitle: 'Act II: Dual Ceremony',
    spell: '🗡️🔮 ← 👤✓ → 🔒📝 → 🤝📜 → 🕸️',
    date: 'Jan 19, 2026',
  },
];

// Spellbook structures
type SpellbookType = 'story' | 'zero' | 'canon' | 'society' | 'plurality' | null;

const spellbookOptions: { value: SpellbookType; label: string }[] = [
  { value: null, label: 'All Spellbooks' },
  { value: 'story', label: 'Story' },
  { value: 'zero', label: 'Zero' },
  { value: 'canon', label: 'Canon' },
  { value: 'society', label: 'Society' },
  { value: 'plurality', label: 'Plurality' },
];

// Story acts (1-18)
const storyActs: { [key: number]: string } = {
  1: 'Act I: Venice',
  2: 'Act II: Dual Ceremony',
  3: 'Act III: Drake\'s Teaching',
  4: 'Act IV: Blade Alone',
  5: 'Act V: Light Armour',
  6: 'Act VI: Trust Graph Plane',
  7: 'Act VII: Mirror Enhanced',
  8: 'Act VIII: Ancient Rule',
  9: 'Act IX: Zcash Shield',
  10: 'Act X: Topology of Revelation',
  11: 'Act XI: Balanced Spiral',
  12: 'Act XII: The Forgetting',
  13: 'Act XIII: The Book of Promises',
  14: 'Act XIV: Rain on the Mountain of Entropy',
  15: 'Act XV: Running in Shackles Through the Dark Forest',
  16: 'Act XVI: When Pools Become Wells',
  17: 'Act XVII: Bonfire in the Dark Forest',
  18: 'Act XVIII: A Mirror in Dust, Vibed into Scrying Glass',
};

// Zero tales (1-30)
const zeroTales: { [key: number]: string } = {
  1: 'Tale 1: The Monastery of Hidden Knowledge',
  2: 'Tale 2: The Three Trials of Truth',
  3: 'Tale 3: The Silent Messenger',
  4: 'Tale 4: The Fields of Finite Wisdom',
  5: 'Tale 5: The Constraint Forge',
  6: 'Tale 6: The Polynomial Riddle',
  7: 'Tale 7: The Witness and the Instance',
  8: 'Tale 8: The Plonkish Revolution',
  9: 'Tale 9: The Pairing Dance',
  10: 'Tale 10: The Commitment Ceremony',
  11: 'Tale 11: The FRI Oracle',
  12: 'Tale 12: The Folding Path',
  13: 'Tale 13: The Sumcheck Riddle',
  14: 'Tale 14: The IPA Chronicle',
  15: 'Tale 15: The Mirror Within Mirrors',
  16: 'Tale 16: The Cyclic Ceremony',
  17: 'Tale 17: The Universal Setup',
  18: 'Tale 18: The Toxic Waste Dragon',
  19: 'Tale 19: The zkVM Kingdom',
  20: 'Tale 20: The Cairo Scribes',
  21: 'Tale 21: The Circom Workshops',
  22: 'Tale 22: The zkEVM Empire',
  23: 'Tale 23: The Private Coin of ZCash',
  24: 'Tale 24: The Tornado\'s Eye',
  25: 'Tale 25: The Rollup Realms',
  26: 'Tale 26: The Vulnerability Codex',
  27: 'Tale 27: The Data Availability Prophecy',
  28: 'Tale 28: The Bridge Between Worlds',
  29: 'Tale 29: The Intelligence Proof',
  30: 'Tale 30: The Eternal Sovereignty',
};

// Canon chapters (1-10)
const canonChapters: { [key: number]: string } = {
  1: 'Chapter 1: The Cypherpunk Whispers',
  2: 'Chapter 2: The Early Incantations',
  3: 'Chapter 3: The Synthesis',
  4: 'Chapter 4: The World Computer',
  5: 'Chapter 5: The First Fracture',
  6: 'Chapter 6: The Great Schism',
  7: 'Chapter 7: The Surveillance Truth',
  8: 'Chapter 8: The Missing Primitive',
  9: 'Chapter 9: The Open Canon',
  10: 'Chapter 10: The Timeline Archive',
};

// Society chapters (1-17)
const societyChapters: { [key: number]: string } = {
  1: 'Chapter 1: The Westphalian Warning',
  2: 'Chapter 2: The Elder Remembers',
  3: 'Chapter 3: The Pirate\'s Republic',
  4: 'Chapter 4: The Manifesto',
  5: 'Chapter 5: Leibniz Dreams',
  6: 'Chapter 6: The Arsenal Opened',
  7: 'Chapter 7: The Banker\'s Confession',
  8: 'Chapter 8: The Network State Vision',
  9: 'Chapter 9: The Three Doors',
  10: 'Chapter 10: The Leibniz Overlap',
  11: 'Chapter 11: Rights Became Real',
  12: 'Chapter 12: Treaty Protocol',
  13: 'Chapter 13: Head Was Cut',
  14: 'Chapter 14: Tools That Breathe',
  15: 'Chapter 15: Trust Reassignment',
  16: 'Chapter 16: Garden Bloomed',
  17: 'Chapter 17: Values Met Code',
};

// Plurality acts (1-30) - placeholder structure
const pluralityActs: { [key: number]: string } = {
  1: 'Act 1', 2: 'Act 2', 3: 'Act 3', 4: 'Act 4', 5: 'Act 5',
  6: 'Act 6', 7: 'Act 7', 8: 'Act 8', 9: 'Act 9', 10: 'Act 10',
  11: 'Act 11', 12: 'Act 12', 13: 'Act 13', 14: 'Act 14', 15: 'Act 15',
  16: 'Act 16', 17: 'Act 17', 18: 'Act 18', 19: 'Act 19', 20: 'Act 20',
  21: 'Act 21', 22: 'Act 22', 23: 'Act 23', 24: 'Act 24', 25: 'Act 25',
  26: 'Act 26', 27: 'Act 27', 28: 'Act 28', 29: 'Act 29', 30: 'Act 30',
};

// Get available acts/chapters for a spellbook
const getSpellbookItems = (spellbook: SpellbookType): { [key: number]: string } | null => {
  switch (spellbook) {
    case 'story': return storyActs;
    case 'zero': return zeroTales;
    case 'canon': return canonChapters;
    case 'society': return societyChapters;
    case 'plurality': return pluralityActs;
    default: return null;
  }
};

export default function StreamPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'curated'>('all');
  const [selectedSpellbook, setSelectedSpellbook] = useState<SpellbookType>(null);
  const [selectedAct, setSelectedAct] = useState<number | null>(null);
  const [entries] = useState<StreamEntry[]>(sampleEntries);

  // Get available items for selected spellbook
  const availableItems = selectedSpellbook ? getSpellbookItems(selectedSpellbook) : null;

  // Reset act selection when spellbook changes
  useEffect(() => {
    setSelectedAct(null);
  }, [selectedSpellbook]);

  // Filter entries based on search, spellbook, and act selection
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = searchQuery === '' || 
      entry.proverb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.actTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpellbook = selectedSpellbook === null || entry.spellbook === selectedSpellbook;
    const matchesAct = selectedAct === null || entry.actNumber === selectedAct;
    
    return matchesSearch && matchesSpellbook && matchesAct;
  });


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 md:gap-8">
              <a href="/" className="text-xl font-bold text-text hover:text-primary transition-colors">
                agentprivacy
              </a>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4 sm:gap-6">
                <a
                  href="/story"
                  className="text-text-muted hover:text-text transition-colors font-medium"
                >
                  story
                </a>
                <a
                  href="/zero"
                  className="text-text-muted hover:text-text transition-colors font-medium"
                >
                  zero
                </a>
                <a
                  href="/canon"
                  className="text-text-muted hover:text-text transition-colors font-medium"
                >
                  canon
                </a>
                <a
                  href="/society"
                  className="text-text-muted hover:text-text transition-colors font-medium"
                >
                  society
                </a>
                <a
                  href="/plurality"
                  className="text-text-muted hover:text-text transition-colors font-medium"
                >
                  plural
                </a>
                <a
                  href="/privacy"
                  className="text-text-muted hover:text-text transition-colors font-medium"
                >
                  privacy
                </a>
                <a
                  href="/mage"
                  className="text-text-muted hover:text-text transition-colors font-medium"
                >
                  mage
                </a>
                <a
                  href="/evoke"
                  className="text-primary border-b-2 border-primary pb-1 font-medium"
                >
                  evoke
                </a>
                <a
                  href="/proverbs"
                  className="text-text-muted hover:text-text transition-colors font-medium"
                >
                  proverbs
                </a>
              </div>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text hover:text-primary transition-colors"
              aria-label="Toggle menu"
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
          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-4 space-y-3 border-t border-surface/50">
                  <a
                    href="/story"
                    className="block text-text-muted hover:text-text transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    story
                  </a>
                  <a
                    href="/zero"
                    className="block text-text-muted hover:text-text transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    zero
                  </a>
                  <a
                    href="/canon"
                    className="block text-text-muted hover:text-text transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    canon
                  </a>
                  <a
                    href="/society"
                    className="block text-text-muted hover:text-text transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    society
                  </a>
                  <a
                    href="/plurality"
                    className="block text-text-muted hover:text-text transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    plural
                  </a>
                  <a
                    href="/privacy"
                    className="block text-text-muted hover:text-text transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    privacy
                  </a>
                  <a
                    href="/mage"
                    className="block text-text-muted hover:text-text transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    mage
                  </a>
                  <a
                    href="/evoke"
                    className="block text-primary border-b-2 border-primary pb-1 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    evoke
                  </a>
                  <a
                    href="/proverbs"
                    className="block text-text-muted hover:text-text transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    proverbs
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-light italic text-text-muted mb-4">
            the mages spell, once spoken, becomes the village weather
          </h1>
          <p className="text-lg text-text-muted mb-8">
            a stream of understanding and spells casted to the privacymage:
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-text-muted"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-text-muted text-sm">?</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search proverbs..."
              className="w-full pl-16 pr-4 py-3 bg-surface/50 border border-surface/50 rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-surface/30 text-text-muted border border-surface/30 hover:bg-surface/50'
              }`}
            >
              all
            </button>
            <button
              onClick={() => setFilter('curated')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'curated'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-surface/30 text-text-muted border border-surface/30 hover:bg-surface/50'
              }`}
            >
              curated
            </button>
            <select
              value={selectedSpellbook || ''}
              onChange={(e) => setSelectedSpellbook(e.target.value ? e.target.value as SpellbookType : null)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-surface/30 text-text border border-surface/30 hover:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {spellbookOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value || ''}>
                  {option.label}
                </option>
              ))}
            </select>
            {availableItems && (
              <select
                value={selectedAct || ''}
                onChange={(e) => setSelectedAct(e.target.value ? parseInt(e.target.value) : null)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-surface/30 text-text border border-surface/30 hover:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">
                  All {selectedSpellbook === 'zero' ? 'Tales' : selectedSpellbook === 'canon' || selectedSpellbook === 'society' ? 'Chapters' : 'Acts'}
                </option>
                {Object.entries(availableItems).map(([num, title]) => (
                  <option key={num} value={num}>
                    {title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </motion.div>

        {/* Stream Entries */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-surface/30 pb-6 last:border-b-0"
              >
                <div className="space-y-3">
                  {/* Proverb */}
                  <p className="text-lg md:text-xl text-text leading-relaxed italic">
                    "{entry.proverb}"
                  </p>
                  
                  {/* Act and Spell Info */}
                  {(entry.actNumber || entry.actTitle || entry.spell) && (
                    <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
                      {entry.actTitle && (
                        <span className="font-medium">{entry.actTitle}</span>
                      )}
                      {entry.spell && (
                        <span className="font-mono text-xs">{entry.spell}</span>
                      )}
                    </div>
                  )}
                  
                  {/* Date */}
                  <p className="text-xs text-text-muted">{entry.date}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              <p>No proverbs found. Be the first to share your understanding.</p>
            </div>
          )}
        </div>
      </section>

      {/* Mage Panel - Base Soulbae prompt for evoke page */}
      <MagePanel
        taleId="evoke-base"
        actNumber={undefined}
        actName={undefined}
      />
    </div>
  );
}
