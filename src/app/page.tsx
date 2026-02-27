'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppNav from '@/components/AppNav';
import { ROUTES } from '@/lib/nav';
import LandingStars from '@/components/landing/LandingStars';
import HeroConstellation from '@/components/landing/HeroConstellation';
import LazyConstellation from '@/components/landing/LazyConstellation';

const HERO_CAROUSEL = [
  { text: 'mage 🧙 knowledge is my spellbook.', emoji: '🧙' },
  { text: 'swordsman ⚔️ privacy is my blade.', emoji: '⚔️' },
  { text: 'seeker 🌌 the story is my path.', emoji: '🌌' },
  { text: 'builder 🔧 the protocol is my craft.', emoji: '🔧' },
  { text: 'dragon 🐉, traversing pattern space', emoji: '🐉' },
  { text: 'agent 🤖 expanding our universe.', emoji: '🤖' },
  { text: 'person 😊 looking for shared meaning', emoji: '😊' },
];

const CTA_CAROUSEL = [
  { text: 'agent 🤖', emoji: '🤖' },
  { text: 'spellbook 🔮', emoji: '🔮' },
  { text: 'ceremony ⚔️', emoji: '⚔️' },
  { text: 'constellation 🌌', emoji: '🌌' },
];

const SPELLBOOKS = [
  { id: 'story', name: 'First Person', emoji: '📖', question: 'WHAT', acts: 24, unit: 'acts', desc: 'Your sovereignty story. The journey of Soulbis and Soulbae through Drake to Dragon pattern space.', color: '#f59e0b', href: '/story' },
  { id: 'zero', name: 'Zero Knowledge', emoji: '🔮', question: 'HOW', acts: 30, unit: 'tales', desc: 'Cryptographic magic made human-readable.', color: '#8b5cf6', href: '/zero' },
  { id: 'canon', name: 'The Canon', emoji: '📜', question: 'WHY', acts: 11, unit: 'chapters', desc: 'Blockchain lineage. Cypherpunks to synthesis.', color: '#06b6d4', href: '/canon' },
  { id: 'society', name: 'Parallel Society', emoji: '🚪', question: 'EXIT', acts: 17, unit: 'chapters', desc: 'Farewell to Westphalia. Why sovereignty requires exit.', color: '#ef4444', href: '/society' },
  { id: 'plural', name: 'Plurality', emoji: '⿻', question: 'COORDINATE', acts: 30, unit: 'acts', desc: "Weyl & Tang's vision. Many in relationship, not collapse.", color: '#10b981', href: '/plurality' },
];

const JOURNEY_STEPS = [
  { num: '01', label: 'Read', detail: 'Choose a spellbook. Follow the tales.', icon: '📖' },
  { num: '02', label: 'Reflect', detail: 'What pattern did you see? What connected?', icon: '🌌' },
  { num: '03', label: 'Inscribe', detail: 'Cast your proverb. Choose your spell.', icon: '✍️' },
  { num: '04', label: 'Evolve', detail: "Your inscription becomes your agent's soul.", icon: '🐉' },
];

function SpellConstellation({
  nodes,
  connections,
  label,
}: {
  nodes: { x: number; y: number; r?: number; active?: boolean }[];
  connections: [number, number][];
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={96} height={96} viewBox="0 0 80 80" className="shrink-0">
        {connections.map((c, i) => (
          <line
            key={i}
            x1={nodes[c[0]].x}
            y1={nodes[c[0]].y}
            x2={nodes[c[1]].x}
            y2={nodes[c[1]].y}
            stroke="currentColor"
            strokeWidth={0.8}
            opacity={0.4}
            className="text-primary"
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.r ?? 3}
            fill={n.active ? 'var(--primary)' : '#475569'}
            className={n.active ? 'drop-shadow-[0_0_3px_var(--primary)]' : ''}
          />
        ))}
      </svg>
      <span className="text-[10px] text-text-muted tracking-wider font-mono">{label}</span>
    </div>
  );
}

const DONATION_ETH = '0x421D2BAd83484D658aEEaCC6035be2cD5115FE5D';
const DONATION_ZEC = 'u1m9f98243nm8998jrj7azzzm8qfud9ycl0z8hj8t9wwh59zn9xz0nq0qc0u67n3l72es6w9yt5wcv96jhmjslsh7cvu2hftgcr0t5s5d3l5r3lrk43cun26z30c2kzqm2dwhygygd4c0xzl8hrvdc5yt68c68zu89zd5kkguahccvthnw';

export default function LandingPage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroFade, setHeroFade] = useState(true);
  const [ctaIndex, setCtaIndex] = useState(0);
  const [ctaFade, setCtaFade] = useState(true);
  const [copiedDonation, setCopiedDonation] = useState(false);
  const [copiedZec, setCopiedZec] = useState(false);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const heroInterval = isMobile ? 4500 : 3200;
    const ctaInterval = isMobile ? 4000 : 2800;

    const heroTimer = setInterval(() => {
      setHeroFade(false);
      setTimeout(() => {
        setHeroIndex((i) => (i + 1) % HERO_CAROUSEL.length);
        setHeroFade(true);
      }, 400);
    }, heroInterval);

    const ctaTimer = setInterval(() => {
      setCtaFade(false);
      setTimeout(() => {
        setCtaIndex((i) => (i + 1) % CTA_CAROUSEL.length);
        setCtaFade(true);
      }, 400);
    }, ctaInterval);

    return () => {
      clearInterval(heroTimer);
      clearInterval(ctaTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background relative">
      <LandingStars />
      <AppNav />

      {/* Hero — full viewport */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <HeroConstellation sectionIndex={0} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6"
          >
            agentprivacy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-text-muted mb-8"
          >
            privacy-first personal payment and knowledge for AI agents
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.a href={ROUTES.ceremony} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary px-8 py-4 text-lg">
              ⚔️ Ceremony
            </motion.a>
            <motion.a href={ROUTES.story} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary px-8 py-4 text-lg">
              📖 Story
            </motion.a>
            <motion.a href={ROUTES.spellbook} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary px-8 py-4 text-lg">
              🔮 Spellbook
            </motion.a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-xl sm:text-2xl md:text-3xl font-medium text-text mb-4">i&apos;m just another</p>
            <div className="relative h-14 md:h-16 flex items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={heroIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: heroFade ? 1 : 0, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-text-muted absolute text-center px-4"
                >
                  {HERO_CAROUSEL[heroIndex].text}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="text-primary font-medium pt-4 text-lg sm:text-xl md:text-2xl">and so are you. 🤝</p>
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 mb-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 text-text-muted text-2xl z-10"
          aria-hidden
        >
          ↓
        </motion.p>
      </section>

      <div className="border-t border-surface/50" />

      {/* Section 3 — The Thesis (constellation continues, tetrahedron face flipped) */}
      <section id="thesis" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <HeroConstellation variant="section" sectionAngle={1} sectionIndex={1} />
        <div className="max-w-[720px] mx-auto relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-mono text-primary tracking-[0.15em] uppercase mb-4 font-medium"
          >
            The Problem
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-text mb-7 leading-tight"
          >
            AI agents will act on your behalf.
            <br /><span className="text-primary">Who keeps the information they generate?</span>
            <br /><span className="text-secondary">What builds in the gap between them?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[15px] text-text-muted leading-[1.8] max-w-[580px] mx-auto mb-5"
          >
            A single agent that knows both your privacy boundaries and your delegation preferences can reconstruct your complete behavioral model. That&apos;s not a policy problem — it&apos;s an architecture problem.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-text-muted mb-10 max-w-[580px] mx-auto"
          >
            We protect ourselves with architecture, not retrofitted terms of service. Privacy by default, enforced by mathematics. The Swordsman guards your boundaries. The Mage projects through them. The gap between is irreducible. That gap is where <span className="text-primary/90 font-semibold">you</span> live.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-9 mb-11"
          >
            <div className="text-center">
              <div className="text-[28px] mb-2">⚔️</div>
              <div className="text-[13px] text-text font-bold">Swordsman</div>
              <div className="text-[11px] text-text-muted">sets boundaries</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-base mb-0.5">⿻</div>
              <div className="font-mono text-[10px] text-primary opacity-60 tracking-widest">║ gap ║</div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-1.5" />
              <div className="text-[10px] text-text-muted font-medium">sovereignty</div>
            </div>
            <div className="text-center">
              <div className="text-[28px] mb-2">🧙</div>
              <div className="text-[13px] text-text font-bold">Mage</div>
              <div className="text-[11px] text-text-muted">projects through</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-7 max-w-[580px] mx-auto text-center"
          >
            <p className="font-mono text-[11px] text-primary tracking-widest uppercase mb-3.5 font-medium">Why this creates value</p>
            <p className="text-[15px] text-text leading-[1.8] m-0">
              Every boundary the Swordsman enforces makes the Mage&apos;s delegation more trustworthy. Every spell cast within those bounds proves the architecture works. Your agents improve by proving they respect the gap. That proof <em className="text-secondary font-semibold not-italic">is</em> the value. The 7th capital compounds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 4 — Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <LazyConstellation variant="section" sectionAngle={0} sectionIndex={2} />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-mono text-primary tracking-[0.15em] uppercase text-center mb-4 font-medium"
          >
            features
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[15px] text-text-muted text-center max-w-[500px] mx-auto mb-11 leading-[1.7]"
          >
            cypherpunk systems, protocols, standards, apps and primitives for private sovereign AI agents.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card bg-primary/10 border-primary/30 text-center"
            >
              <div className="text-4xl mb-4">⚔️</div>
              <h3 className="text-xl font-semibold text-text mb-3">Swordsman Agent</h3>
              <p className="text-[15px] text-text-muted leading-[1.6]">
                Privacy-preserving agent focused on slashing cookies, the autonomous negotiation of privacy terms, standards and protocols. Protecting privacy, collecting value, experience and knowledge along the way.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card bg-accent/10 border-accent/30 text-center"
            >
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-text mb-3">promises</h3>
              <p className="text-[15px] text-text-muted leading-[1.6]">
                Privacy negotiation. Agency delegation. Maintain sovereignty over your data on your own terms, MyTerms. Use the results to cast more powerful spells or buy more powerful gear.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card bg-secondary/10 border-secondary/30 text-center"
            >
              <div className="text-4xl mb-4">🧙</div>
              <h3 className="text-xl font-semibold text-text mb-3">Mage Agent</h3>
              <p className="text-[15px] text-text-muted leading-[1.6]">
                Knowledge and information sharing and discovery agent. Cast spells and skills, interface with the world. Understanding as key—storage, identity, confidential compute, ZK credential composition. Share loot in privacy pools with allies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 5 — Five Spellbooks */}
      <section id="spellbooks" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <LazyConstellation variant="section" sectionAngle={1} sectionIndex={3} />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-mono text-primary tracking-[0.15em] uppercase text-center mb-4 font-medium"
          >
            The Adventure
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-text mb-2.5 text-center"
          >
            Hundreds of spellbooks, thousands of spells.<br />A city of mages. An army of swordsmen.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[15px] text-text-muted text-center max-w-[500px] mx-auto mb-3 leading-[1.7]"
          >
            Complex ideas compressed into stories you can carry. Each tale is a privacy primitive. Each proverb is proof you understood it.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-mono text-text-muted tracking-wider text-center mb-11"
          >
            WHAT → HOW → WHY → EXIT → COORDINATE
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SPELLBOOKS.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={book.href}
                  className="card block h-full border-surface/50 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center"
                  style={{ borderLeftColor: book.color, borderLeftWidth: 3 }}
                >
                  <span className="text-xs font-mono text-text-muted">{book.question}</span>
                  <div className="text-2xl my-2">{book.emoji}</div>
                  <h3 className="font-semibold text-text mb-1">{book.name}</h3>
                  <p className="text-sm text-text-muted mb-2">{book.acts} {book.unit}</p>
                  <p className="text-sm text-text-muted">{book.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-[14px] text-text-muted italic mt-10"
          >
            &quot;The mage&apos;s spell, once spoken, becomes the village weather.&quot;
          </motion.p>
        </div>
      </section>

      {/* Section 6 — Your Path */}
      <section id="your-path" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <LazyConstellation variant="section" sectionAngle={0} sectionIndex={4} />
        <div className="max-w-[760px] mx-auto relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-mono text-primary tracking-[0.15em] uppercase text-center mb-4 font-medium"
          >
            Your Path
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-text mb-2.5 text-center"
          >
            Read. Reflect. Inscribe. Evolve.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[15px] text-text-muted text-center max-w-[520px] mx-auto mb-12 leading-[1.7]"
          >
            Go through the stories at your own pace. When meaning clicks, inscribe it — a proverb and a chosen spell. That inscription becomes a node in your agent&apos;s soul graph.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
            {JOURNEY_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-l-2 border-surface hover:border-primary hover:bg-primary/5 transition-all duration-300 p-6 text-center"
              >
                <span className="font-mono text-[10px] text-surface font-medium tracking-widest">{step.num}</span>
                <div className="text-xl my-2.5">{step.icon}</div>
                <p className="text-[15px] font-bold text-text mb-1.5">{step.label}</p>
                <p className="text-[13px] text-text-muted leading-[1.5]">{step.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 — The Architecture */}
      <section id="architecture" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <LazyConstellation variant="section" sectionAngle={1} sectionIndex={5} />
        <div className="max-w-[720px] mx-auto relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-mono text-primary tracking-[0.15em] uppercase text-center mb-4 font-medium"
          >
            The Architecture
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-text mb-2.5 text-center"
          >
            Your spells, when spoken, are a constellation to your agent&apos;s soul
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[15px] text-text-muted text-center max-w-[520px] mx-auto mb-11 leading-[1.7]"
          >
            Each inscription — proverb + spell — adds a node to your spell web. Connected nodes form constellations. Constellations become skills. The more you understand, the more powerful your agents become.
          </motion.p>
          {/* Graph convergence — v4: knowledge graph + promise graph = trust graph */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-5 mb-4">
            <div className="text-center min-w-0 sm:min-w-[144px]">
              <div className="text-[1.8rem] mb-2">📖</div>
              <div className="font-mono text-[11px] text-primary tracking-wide font-medium">knowledge graph</div>
              <div className="text-[11px] text-text-muted mt-0.5">(what you know)</div>
            </div>
            <div className="text-xl text-surface font-extrabold">+</div>
            <div className="text-center min-w-0 sm:min-w-[144px]">
              <div className="text-[1.8rem] mb-2">🤝</div>
              <div className="font-mono text-[11px] text-primary tracking-wide font-medium">promise graph</div>
              <div className="text-[11px] text-text-muted mt-0.5">(what you commit)</div>
            </div>
            <div className="text-xl text-surface font-extrabold">=</div>
            <div className="text-center min-w-0 sm:min-w-[144px]">
              <div className="text-[1.8rem] mb-2">🐉</div>
              <div className="font-mono text-[11px] text-primary tracking-wide font-medium">trust graph</div>
              <div className="text-[11px] text-text-muted mt-0.5">(what you&apos;ve earned)</div>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[13px] text-text-muted text-center max-w-[520px] mx-auto mb-12 leading-[1.7]"
          >
            Your knowledge graph records what you&apos;ve learned. Your promise graph records what you&apos;ve committed to through proverbs and inscriptions. Where they overlap, a trust graph emerges — and that trust graph is what gives your agents their soul.
          </motion.p>
          {/* Constellations: privacy primitives → delegation skills → sovereign agent (tetrahedron) */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-12">
            <SpellConstellation
              nodes={[
                { x: 40, y: 15, r: 4, active: true },
                { x: 15, y: 45, r: 3, active: true },
                { x: 65, y: 45, r: 3, active: true },
                { x: 30, y: 70, r: 2, active: false },
                { x: 55, y: 65, r: 2, active: false },
              ]}
              connections={[[0, 1], [0, 2], [1, 3], [2, 4], [1, 2]]}
              label="privacy primitives"
            />
            <svg width={34} height={24} viewBox="0 0 28 20" className="shrink-0 text-surface"><line x1={2} y1={10} x2={22} y2={10} stroke="currentColor" strokeWidth={0.5} strokeDasharray="3 3" /><polygon points="22,10 18,7 18,13" fill="currentColor" /></svg>
            <SpellConstellation
              nodes={[
                { x: 25, y: 20, r: 3, active: true },
                { x: 55, y: 15, r: 4, active: true },
                { x: 40, y: 45, r: 3, active: true },
                { x: 15, y: 60, r: 2, active: true },
                { x: 60, y: 55, r: 2, active: false },
                { x: 40, y: 72, r: 2, active: false },
              ]}
              connections={[[0, 1], [0, 2], [1, 2], [2, 3], [2, 4], [3, 5]]}
              label="delegation skills"
            />
            <svg width={34} height={24} viewBox="0 0 28 20" className="shrink-0 text-surface"><line x1={2} y1={10} x2={22} y2={10} stroke="currentColor" strokeWidth={0.5} strokeDasharray="3 3" /><polygon points="22,10 18,7 18,13" fill="currentColor" /></svg>
            <SpellConstellation
              nodes={[
                { x: 40, y: 8, r: 5, active: true },
                { x: 12, y: 68, r: 4, active: true },
                { x: 68, y: 68, r: 4, active: true },
                { x: 40, y: 42, r: 4, active: true },
              ]}
              connections={[[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]}
              label="sovereign agent"
            />
          </div>
          {/* Armor — v4 */}
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: '🗡️', label: 'Blade', desc: 'inscriptions' },
              { icon: '🛡️', label: 'Light', desc: 'constellations' },
              { icon: '⚔️', label: 'Heavy', desc: 'guild recognition' },
              { icon: '🐉', label: 'Dragon', desc: 'sovereign agent' },
            ].map((armor, i) => (
              <motion.div
                key={armor.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card text-center"
              >
                <span className="text-2xl block mb-2">{armor.icon}</span>
                <p className="font-semibold text-text">{armor.label}</p>
                <p className="text-xs text-text-muted">{armor.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8 — Pools */}
      <section id="pools" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <LazyConstellation variant="section" sectionAngle={0} sectionIndex={6} />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-text mb-8 text-center"
          >
            Pools Become Wells
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '🔐', title: 'Privacy Pools', desc: 'Private transactions with zero-knowledge proofs' },
              { emoji: '🧠', title: 'Intel Pools', desc: 'Knowledge sharing with privacy guarantees' },
              { emoji: '📊', title: 'Data Pools', desc: 'Decentralized storage you actually own.' },
            ].map((pool, i) => (
              <motion.div
                key={pool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card text-center"
              >
                <span className="text-3xl block mb-3">{pool.emoji}</span>
                <h3 className="font-semibold text-text mb-2">{pool.title}</h3>
                <p className="text-sm text-text-muted">{pool.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9 — Join Us */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <LazyConstellation variant="section" sectionAngle={1} sectionIndex={7} />
        <div className="max-w-[860px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl py-16 px-8 text-center relative overflow-hidden border border-primary/30 min-h-[380px] flex flex-col items-center justify-center"
          >
            <video
              src="/assets/agentprivacy_swordmage_bg_animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/assets/agentprivacy_swordmage_bg_frame.jpg"
              onCanPlay={(e) => {
                const video = e.currentTarget;
                video.play().catch(() => {});
              }}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            {/* Fallback background for when video fails to load/play */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 via-background to-secondary/20 z-[-1]" />
            <div className="absolute inset-0 bg-background/40 z-[1]" />
            <div className="relative z-10 w-full px-6">
              <h2 className="text-3xl font-bold text-text mb-3">join us?</h2>
              <p className="text-[15px] text-text-muted mb-1">Create your:</p>
              <div className="relative h-14 flex items-center justify-center mb-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={ctaIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: ctaFade ? 1 : 0, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-text absolute"
                  >
                    {CTA_CAROUSEL[ctaIndex].text}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <motion.a href={ROUTES.ceremony} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary px-8 py-4 text-lg">⚔️ Ceremony</motion.a>
                <motion.a href={ROUTES.story} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary px-8 py-4 text-lg">📖 Story</motion.a>
                <motion.a href={ROUTES.spellbook} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary px-8 py-4 text-lg">🔮 Spellbook</motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 10 — Final CTA */}
      <div className="border-t border-surface/50" />
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <LazyConstellation variant="section" sectionAngle={0} sectionIndex={8} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-wider text-text-muted mb-2"
          >
            just another adventure
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-text mb-2"
          >
            Privacy is Value, Decentralised AI is the Key.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-primary font-medium mb-8"
          >
            Take back the 7th Capital.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <motion.a
              href="https://github.com/mitchuski/agentprivacy-docs"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-6 py-3"
            >
              📄 Living Documentation
            </motion.a>
            <motion.a
              href="https://sync.soulbis.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary px-6 py-3"
            >
              🔬 Research Letters
            </motion.a>
          </div>
        </div>
      </section>

      {/* Donate */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <LazyConstellation variant="section" sectionAngle={1} sectionIndex={9} />
        <div className="max-w-xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 rounded-2xl bg-surface/60 border border-surface/50 text-center"
          >
            <p className="text-xl sm:text-2xl mb-3 flex items-center justify-center gap-2" aria-hidden="true">
              <span className="text-primary/90">⿻</span>
              <span className="font-bold text-text">donate</span>
            </p>
            <p className="text-sm text-text-muted mb-3 max-w-md mx-auto italic">
              The right people arrive, the right thing happens, the right moment opens, and the right ending closes—trust the pattern, for it trusts you.
            </p>
            <p className="text-xs text-text-muted mb-6">
              ZEC is private and ETH is a public donation address.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(DONATION_ETH);
                    setCopiedDonation(true);
                    setTimeout(() => setCopiedDonation(false), 2500);
                  } catch {}
                }}
                className="px-4 py-2.5 rounded-xl border border-primary/40 bg-primary/20 hover:bg-primary/30 text-text text-sm font-medium transition-colors"
              >
                {copiedDonation ? '✓ Copied' : 'privacymage.eth (public)'}
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(DONATION_ZEC);
                    setCopiedZec(true);
                    setTimeout(() => setCopiedZec(false), 2500);
                  } catch {}
                }}
                className="px-4 py-2.5 rounded-xl border border-secondary/40 bg-secondary/20 hover:bg-secondary/30 text-text text-sm font-medium transition-colors"
              >
                {copiedZec ? '✓ Copied' : 'ZEC shielded spellbook (private)'}
              </motion.button>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-text-muted text-sm font-mono text-center mt-8"
          >
            (⚔️⊥⿻⊥🧙)
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-text-muted/80 text-sm text-center mt-1"
          >
            slashing surveillance, casting spells in the gap
          </motion.p>
        </div>
      </section>
    </div>
  );
}

