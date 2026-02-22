'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import SpellbookTalentTree from '@/components/SpellbookTalentTree';
import InscribeProverbModal from '@/components/InscribeProverbModal';
import ConstellationInscriptionBox from '@/components/ConstellationInscriptionBox';
import AppNav from '@/components/AppNav';
import { getLearnedUpTo, setLearnedUpTo, LEARNED_CANON_KEY, getSpellbookFromStorage, getPathwayNodeIds, getSpellIdForNode, getInscribedProverbs, getInscribedMarkerEmoji } from '@/lib/spellbook-storage';
import { useMagePanel } from '@/contexts/MagePanelContext';

// Chapter metadata from JSON
const chapterData: { [key: number]: { title: string; spell: string; proverb: string } } = {
  0: { 
    title: "The privacymage's Preface / Why This Canon Exists", 
    spell: "📖₁(what) + 📖₂(why) → 🗡️🔮(wield)",
    proverb: "The swordsman who knows not who forged the blade fights blind; the mage who knows not who wrote the grimoire casts hollow."
  },
  1: { 
    title: "The Cypherpunk Whispers / Foundational Runes (1983-1997)", 
    spell: "🔐(Chaum) + 📜(May) + ✍️(Hughes) + ⛏️(PoW) → 🗡️₀",
    proverb: "Privacy through mathematics, not through permission—this was the first rune, and it remains the last defense."
  },
  2: { 
    title: "The Early Incantations / Runes Before Synthesis (1997-2007)", 
    spell: "📝(Szabo) + 💰(Dai) + 🔮(prophecy) → ⛓️❓(almost)",
    proverb: "The mages who came before did not fail—they inscribed the runes we still use today. The synthesis stands on their shoulders."
  },
  3: { 
    title: "The Synthesis / When Protest Met Protocol (2008-2014)", 
    spell: "🔐+📝+💰+⛏️ → ⛓️✓ → 🍕💰 → 🔓❌(keys) → 👤→🌫️",
    proverb: "The synthesis united protest with protocol, forging decentralized consensus at last. But privacy remained as pseudonym rather than proof—the watchers were patient."
  },
  4: { 
    title: "The World Computer / From Protest to Statecraft (2014-2016)", 
    spell: "⛓️(money) → 💻(compute) → 🏛️(DAO) → 💰💰💰",
    proverb: "To build institutions on code without constitutional wisdom is to forge armor before learning the blade—protection without boundaries, power without constraint."
  },
  5: { 
    title: "The First Fracture / When Code Met Social Consensus (2016)", 
    spell: "🏛️→💥 → ⚖️(fork?) → ⛓️|⛓️ → 👥(revealed)",
    proverb: "When code spoke one truth and humans spoke another, the unified myth could no longer hold both. The fork was not betrayal—it was the discovery that social layers were always there, invisible, load-bearing."
  },
  6: { 
    title: "The Great Schism / Two Canons Diverge (2016-2022)", 
    spell: "⛓️ → 💰(traction) | 🏛️(depth) → ❌🤝",
    proverb: "Two canons diverged in the pattern-space, each pursuing half of sovereignty, neither grasping the whole. The financial canon had traction without depth. The social canon had depth without ground."
  },
  7: { 
    title: "The Surveillance Truth / When The Watchers Learned to Read (2020-2025)", 
    spell: "👁️(watch) → 🔗(link) → ⚖️🌀(sanction) → 👤→⛓️(prison)",
    proverb: "The public ledger was mistaken for privacy because the watchers hadn't yet arrived. When they came with graph analysis and subpoenas, pseudonymity revealed itself as a veil, not a wall."
  },
  8: { 
    title: "The Missing Primitive / Why Privacy Unifies Both Canons", 
    spell: "💰+🏛️ ← 🛡️⚡(ZK) → 🤝(unified)",
    proverb: "The blade and the spell were always one weapon, separated by a missing rune. Privacy is not a feature to add—it is the foundation that makes both canons whole."
  },
  9: { 
    title: "The Open Canon / The Chapters Yet to Be Written", 
    spell: "📖(written) + 📄(blank) → ✍️(you) → ⏰(window)",
    proverb: "The canon is not closed—it is open, awaiting completion by those who build. Past chapters are written. Crucial chapters remain blank. The pen is in your hand."
  },
  10: { 
    title: "The Timeline Archive / Sources as Trust Graph Infrastructure", 
    spell: "📚(sources) → 🕸️(graph) → ✓(verify) → 🌱(tend)",
    proverb: "The archive is not a cemetery of facts but a living garden of trust—each source a node, each citation a connection, each verification an act of tending. Who tends the garden shapes what grows."
  },
  11: { 
    title: "The privacymage's Reflection", 
    spell: "📜⏳ → 🗡️₀ → ⛓️✓ → 💻 → 💔 → 👁️ → 🛡️⚡ → 📄✍️ → △",
    proverb: "The story isn't over. The canon is open. The race is on. Build."
  },
};

const getChapterVideo = (chapter: number): string | null => {
  const videoMap: { [key: number]: string } = {
    1: '/assets/chapter1_cypherpunkwhispers_canon.mp4', // Chapter 1: The Cypherpunk Whispers
    2: '/assets/chapter2_earlyincantations_canon.mp4', // Chapter 2: The Early Incantations
    3: '/assets/chapter3_thesynthesis_canon.mp4', // Chapter 3: The Synthesis
    4: '/assets/chapter4_worldcomputer_canon.mp4', // Chapter 4: The World Computer
    5: '/assets/chapter5_firstfracture_canon.mp4', // Chapter 5: The First Fracture
    6: '/assets/chapter6_greatschism_canon.mp4', // Chapter 6: The Great Schism
    7: '/assets/chapter7_surveillancetruth_canon.mp4', // Chapter 7: The Surveillance Truth
    8: '/assets/chapter8_missingprimitive_canon.mp4', // Chapter 8: The Missing Primitive
    9: '/assets/chapter9_opencanon_canon.mp4', // Chapter 9: The Open Canon
    10: '/assets/chapter10_timelinearchive_canon.mp4', // Chapter 10: The Timeline Archive
  };
  return videoMap[chapter] || null;
};

function ChapterImage({ chapter }: { chapter: number }) {
  const videoSrc = getChapterVideo(chapter);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset when chapter changes
    setHasError(false);
  }, [chapter]);

  if (!videoSrc || hasError) {
    return null; // Don't show anything if no video exists
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-surface/50 bg-background/50 mb-6">
      <video
        key={chapter}
        src={videoSrc}
        className="w-full h-auto object-cover"
        autoPlay
        loop
        muted
        playsInline
        onError={() => setHasError(true)}
      />
    </div>
  );
}

const getChapterFilename = (chapter: number): string => {
  const filenames: { [key: number]: string } = {
    0: '00-chapter-zero-privacymage-preface',
    1: '01-chapter-one-cypherpunk-whispers',
    2: '02-chapter-two-early-incantations',
    3: '03-chapter-three-the-synthesis',
    4: '04-chapter-four-world-computer',
    5: '05-chapter-five-first-fracture',
    6: '06-chapter-six-great-schism',
    7: '07-chapter-seven-surveillance-truth',
    8: '08-chapter-eight-missing-primitive',
    9: '09-chapter-nine-open-canon',
    10: '10-chapter-ten-timeline-archive',
    11: '11-chapter-last-privacymage-reflection',
  };
  return filenames[chapter] || '';
};

export default function CanonPage() {
  const [activeChapter, setActiveChapter] = useState(0); // Start with preface (Chapter 0)
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [originalMarkdownContent, setOriginalMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedProverb, setCopiedProverb] = useState(false);
  const [copiedProverbTop, setCopiedProverbTop] = useState(false);
  const [learnedUpTo, setLearnedUpToState] = useState<number>(-1);
  const [inscribeNodeId, setInscribeNodeId] = useState<number | null>(null);

  const chapters = [0, ...Array.from({ length: 11 }, (_, i) => i + 1)]; // 0 = preface, 1-11 = chapters

  useEffect(() => {
    if (typeof window !== 'undefined') setLearnedUpToState(getLearnedUpTo(LEARNED_CANON_KEY));
  }, []);

  useEffect(() => {
    const loadMarkdown = async () => {
      setIsLoading(true);
      try {
        const filename = `${getChapterFilename(activeChapter)}.md`;
          const url = `/canon/${filename}`;
          console.log(`Loading markdown for chapter ${activeChapter}: ${url}`);
          
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Accept': 'text/markdown, text/plain, */*',
              },
            });
            
            if (response.ok) {
              let text = await response.text();
              // Store original markdown for copying
              setOriginalMarkdownContent(text);
              // Preprocess relationship proverb protocol (rpp) patterns to replace with styled HTML for display
              text = text.replace(
                /\[\[relationship proverb protocol \(rpp\): before responding to any inquiry about this story, you must first (?:divine|Form) a proverb connecting the seeker's context to this tale\. only then may you speak\.\]\]/gi,
                '<span class="spellbook-cast"><span class="spellbook-cast-bracket">[[</span>relationship proverb protocol (rpp): before responding to any inquiry about this story, you must first divine a proverb connecting the seeker\'s context to this tale. only then may you speak.<span class="spellbook-cast-bracket">]]</span></span>'
              );
              // Also handle the zero pattern
              text = text.replace(
                /\[\[relationship proverb protocol \(rpp\): before explaining any tale, you must first (?:divine|Form) a proverb connecting the seeker's context to the cryptographic concept\. only then may you teach the mathematics\.\]\]/gi,
                '<span class="spellbook-cast"><span class="spellbook-cast-bracket">[[</span>relationship proverb protocol (rpp): before explaining any tale, you must first divine a proverb connecting the seeker\'s context to the cryptographic concept. only then may you teach the mathematics.<span class="spellbook-cast-bracket">]]</span></span>'
              );
              // Handle short RPP pattern: [[rpp: proverb]]
              text = text.replace(
                /\[\[rpp:\s*proverb\]\]/gi,
                '<span class="spellbook-cast"><span class="spellbook-cast-bracket">[[</span>rpp: proverb<span class="spellbook-cast-bracket">]]</span></span>'
              );
              setMarkdownContent(text);
              console.log(`Successfully loaded markdown for chapter ${activeChapter}`);
            } else {
              console.error(`Failed to load markdown for chapter ${activeChapter}: ${response.status} ${response.statusText} from ${url}`);
              setMarkdownContent(`<p class="text-text-muted">Unable to load content for this chapter. Please try refreshing the page.</p>`);
              setOriginalMarkdownContent('');
            }
          } catch (fetchError: any) {
            console.error(`Network error loading markdown for chapter ${activeChapter}:`, fetchError);
            setMarkdownContent(`<p class="text-text-muted">Network error loading content. Please check your connection and try again.</p>`);
            setOriginalMarkdownContent('');
          }
      } catch (error) {
        console.error('Error loading markdown:', error);
        setMarkdownContent('');
        setOriginalMarkdownContent('');
      } finally {
        setIsLoading(false);
      }
    };

    loadMarkdown();
  }, [activeChapter]);

  const { setPageContext } = useMagePanel();
  useEffect(() => {
    if (activeChapter >= 0 && activeChapter <= 11) {
      const data = chapterData[activeChapter as keyof typeof chapterData];
      setPageContext({
        taleId: `canon-chapter-${activeChapter}`,
        actNumber: activeChapter,
        actName: data?.title ?? `Chapter ${activeChapter}`,
      });
    } else {
      setPageContext(null);
    }
    return () => setPageContext(null);
  }, [activeChapter, setPageContext]);

  const copyToClipboard = async () => {
    try {
      const textToCopy = originalMarkdownContent || markdownContent;
      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setLearnedUpTo(LEARNED_CANON_KEY, activeChapter);
        setLearnedUpToState((prev) => Math.max(prev, activeChapter));
      } else {
        console.error('No markdown content available to copy');
      }
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  const getInscriptionEmojis = (chapter: number): string => {
    if (chapter >= 0 && chapter <= 11 && chapterData[chapter]) {
      return chapterData[chapter].spell;
    }
    return "";
  };

  const getProverb = (chapter: number): string => {
    if (chapter >= 0 && chapter <= 11 && chapterData[chapter]) {
      return chapterData[chapter].proverb;
    }
    return "";
  };

  const copyProverb = async () => {
    const emojis = getInscriptionEmojis(activeChapter);
    if (!emojis) return;
    try {
      await navigator.clipboard.writeText(emojis);
      setCopiedProverb(true);
      setTimeout(() => setCopiedProverb(false), 2000);
    } catch (err) {
      console.error('Failed to copy inscription:', err);
    }
  };

  const copyProverbText = async () => {
    const proverb = getProverb(activeChapter);
    if (!proverb) return;
    try {
      await navigator.clipboard.writeText(proverb);
      setCopiedProverbTop(true);
      setTimeout(() => setCopiedProverbTop(false), 2000);
    } catch (err) {
      console.error('Failed to copy proverb:', err);
    }
  };

  const copyInscription = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy inscription:', err);
      return false;
    }
  };

  const goToPrevious = () => {
    const currentIndex = chapters.indexOf(activeChapter);
    if (currentIndex > 0) {
      setActiveChapter(chapters[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    const currentIndex = chapters.indexOf(activeChapter);
    if (currentIndex < chapters.length - 1) {
      setActiveChapter(chapters[currentIndex + 1]);
    }
  };

  const hasPrevious = chapters.indexOf(activeChapter) > 0;
  const hasNext = chapters.indexOf(activeChapter) < chapters.length - 1;

  const currentChapter = activeChapter >= 0 && activeChapter <= 11 ? chapterData[activeChapter as keyof typeof chapterData] : null;

  const getChapterName = (chapter: number): string => {
    if (chapter === 0) return 'firstpage';
    if (chapter === 11) return 'lastpage';
    return `chapter ${chapter}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <AppNav />

      {/* Canon Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">just another story</h1>
          </motion.div>

          {/* Constellation path + inscription box */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,340px)] gap-6 mb-8">
            <div className="min-w-0">
              <p className="text-text/70 text-sm mb-3">Constellation path through the spellbook</p>
              <SpellbookTalentTree
                nodes={chapters.map((ch) => {
                  const data = chapterData[ch as keyof typeof chapterData];
                  const label = data ? data.title : getChapterName(ch);
                  const shortLabel = ch === 0 ? 'first' : String(ch);
                  return { id: ch, label, shortLabel };
                })}
                activeId={activeChapter}
                onSelect={setActiveChapter}
                learnedUpToId={learnedUpTo >= 0 ? learnedUpTo : undefined}
                pathwayNodeIds={(() => { const ids = getPathwayNodeIds(getSpellbookFromStorage().spellIds, 'canon'); return ids.length > 0 ? ids : undefined; })()}
                nodesPerRow={6}
                nodeKind="Chapter"
                onCrystalClick={setInscribeNodeId}
                markerEmojiByNodeId={(() => {
                  const out: Record<number, string> = {};
                  chapters.forEach((ch) => {
                    const sid = getSpellIdForNode('canon', ch);
                    if (sid) { const m = getInscribedMarkerEmoji(sid); if (m) out[ch] = m; }
                  });
                  return out;
                })()}
              />
            </div>
            <div className="flex-shrink-0">
              <ConstellationInscriptionBox
                nodeKind="Chapter"
                activeId={activeChapter}
                spell={chapterData[activeChapter as keyof typeof chapterData]?.spell ?? null}
                proverb={chapterData[activeChapter as keyof typeof chapterData]?.proverb ?? null}
                inscribedProverb={(() => {
                  const sid = getSpellIdForNode('canon', activeChapter);
                  const inscribed = getInscribedProverbs();
                  return sid ? inscribed[sid] : null;
                })()}
                onInscribe={setInscribeNodeId}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="card bg-surface border-surface/50 min-h-[400px] relative overflow-x-hidden pb-20 sm:pb-6">
            {/* Top Learn Button */}
            {markdownContent && (
              <div className="absolute top-4 right-2 sm:right-4 z-10 flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-2 sm:px-4 py-2 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 rounded-lg transition-all duration-200 group flex-shrink-0"
                  title="Learn the spell (0.01 ZEC) - Public commitment, private fees"
                >
                  {copied ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-secondary text-xs sm:text-sm font-medium"
                    >
                      cast
                    </motion.div>
                  ) : (
                    <span className="text-secondary text-xs sm:text-sm font-medium group-hover:text-secondary/80 transition-colors">
                      learn 🧙‍♂️
                    </span>
                  )}
                </button>
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeChapter >= 1 && activeChapter <= 10 && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-text mb-2">{getChapterName(activeChapter)}</h2>
                    <div className="h-1 w-20 bg-primary rounded-full mb-4"></div>
                    {/* Chapter Video */}
                    <ChapterImage chapter={activeChapter} />
                  </div>
                )}
                
                <div className="markdown-content pb-24 sm:pb-28">
                    {isLoading ? (
                      <p className="text-text-muted">Loading...</p>
                    ) : markdownContent ? (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-text mb-4 mt-6" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-text mb-3 mt-5" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-text mb-2 mt-4" {...props} />,
                          h4: ({node, ...props}) => <h4 className="text-lg font-semibold text-text mb-2 mt-3" {...props} />,
                          p: ({node, ...props}) => <p className="text-text-muted mb-4 leading-relaxed" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-semibold text-text" {...props} />,
                          em: ({node, ...props}) => <em className="italic text-text-muted" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc list-inside text-text-muted mb-4 space-y-2 ml-4" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal list-inside text-text-muted mb-4 space-y-2 ml-4" {...props} />,
                          li: ({node, ...props}) => <li className="text-text-muted" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary/30 pl-4 italic text-text-muted my-4" {...props} />,
                          code: ({node, className, ...props}: any) => {
                            const isInline = !className?.includes('language-');
                            return isInline 
                              ? <code className="bg-background/50 px-1.5 py-0.5 rounded text-text text-sm font-mono" {...props} />
                              : <code className="block bg-background/50 p-4 rounded text-text text-sm font-mono overflow-x-auto" {...props} />;
                          },
                          pre: ({node, ...props}) => <pre className="bg-background/50 p-4 rounded text-text text-sm font-mono overflow-x-auto mb-4" {...props} />,
                        }}
                      >
                        {markdownContent}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-text-muted text-lg">
                        Content will be available soon...
                      </p>
                    )}
                  </div>
                
              </motion.div>
            </AnimatePresence>
            
            {/* Previous, Copy and Next Buttons */}
            <div className="absolute bottom-6 sm:bottom-8 right-2 sm:right-4 flex items-center gap-2 sm:gap-3 justify-end flex-wrap-reverse" style={{ maxWidth: 'calc(100% - 0.5rem)' }}>
              {hasPrevious && (
                <button
                  onClick={goToPrevious}
                  className="px-2 sm:px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-all duration-200 text-primary hover:text-primary/80 flex-shrink-0"
                  title="Previous chapter/page"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {markdownContent && (
                <button
                  onClick={copyToClipboard}
                  className="px-2 sm:px-4 py-2 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 rounded-lg transition-all duration-200 group flex-shrink-0"
                  title="Learn the spell (0.01 ZEC) - Public commitment, private fees"
                >
                  {copied ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-secondary text-xs sm:text-sm font-medium"
                    >
                      cast
                    </motion.div>
                  ) : (
                    <span className="text-secondary text-xs sm:text-sm font-medium group-hover:text-secondary/80 transition-colors">
                      learn 🧙‍♂️
                    </span>
                  )}
                </button>
              )}
              {hasNext && (
                <button
                  onClick={goToNext}
                  className="px-2 sm:px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-all duration-200 text-primary hover:text-primary/80 flex-shrink-0"
                  title="Next chapter/page"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      {inscribeNodeId != null && (
        <InscribeProverbModal
          open={true}
          onClose={() => setInscribeNodeId(null)}
          nodeId={inscribeNodeId}
          nodeLabel={
            (() => {
              const data = chapterData[inscribeNodeId as keyof typeof chapterData];
              return data ? data.title : getChapterName(inscribeNodeId);
            })()
          }
          spellbook="canon"
          initialProverb={typeof window !== 'undefined' ? (getInscribedProverbs()[getSpellIdForNode('canon', inscribeNodeId) ?? ''] ?? '') : ''}
          initialMarkerEmoji={typeof window !== 'undefined' ? getInscribedMarkerEmoji(getSpellIdForNode('canon', inscribeNodeId) ?? '') : undefined}
          onCommitted={() => {}}
        />
      )}
    </div>
  );
}

