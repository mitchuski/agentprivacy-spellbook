'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import AppNav from '@/components/AppNav';

export default function LandingPage() {
  const carouselItems = [
    { text: 'swordsman ⚔️ privacy is my blade.', emoji: '⚔️' },
    { text: 'mage 🧙 knowledge is my spellbook.', emoji: '🧙' },
    { text: 'agent 🤖 expanding our universe.', emoji: '🤖' },
    { text: 'person 😊 looking for shared meaning', emoji: '😊' },
  ];

  const ctaCarouselItems = [
    { text: 'swordsman ⚔️', emoji: '⚔️' },
    { text: 'mage 🧙', emoji: '🧙' },
    { text: 'agent 🤖', emoji: '🤖' },
    { text: 'person 😊', emoji: '😊' },
  ];

  // Initialize with 0 to prevent hydration mismatch, will update on client
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ctaCurrentIndex, setCtaCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCtaCurrentIndex((prevIndex) => (prevIndex + 1) % ctaCarouselItems.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [ctaCarouselItems.length]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background" suppressHydrationWarning>
      <AppNav />

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
            suppressHydrationWarning
          >
            <h1 className="text-5xl md:text-6xl font-bold text-text mb-6">
              agentprivacy
            </h1>
            <p className="text-xl md:text-2xl text-text-muted mb-8">
              privacy-first personal payment and knowledge for AI agents
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.a
                href="/ceremony"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-8 py-4 text-lg"
              >
                ⚔️ Ceremony
              </motion.a>
              <motion.a
                href="/story"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary px-8 py-4 text-lg"
              >
                📖 Story
              </motion.a>
              <motion.a
                href="/spells"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary px-8 py-4 text-lg"
              >
                🔮 Spellbook
              </motion.a>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-3xl mx-auto"
              suppressHydrationWarning
            >
              <p className="text-2xl md:text-3xl font-medium text-text mb-6">
                i'm just another
              </p>
              <div className="relative h-12 md:h-16 flex items-center justify-center" suppressHydrationWarning>
                {isClient ? (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl md:text-3xl text-text-muted absolute"
                    >
                      {carouselItems[currentIndex].text}
                    </motion.p>
                  </AnimatePresence>
                ) : (
                  <p className="text-2xl md:text-3xl text-text-muted absolute">
                    {carouselItems[0].text}
                  </p>
                )}
              </div>
              <p className="text-primary font-medium pt-4 text-xl md:text-2xl">
                and so are you. 🤝
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text mb-4">features</h2>
            <p className="text-text-muted text-lg">
            cypherpunk systems, protocols, standards, apps and primitives for private sovereign AI agents.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card bg-primary/10 border-primary/30"
            >
              <div className="text-4xl mb-4">⚔️</div>
              <h3 className="text-xl font-semibold text-text mb-3">Swordsman Agent</h3>
              <p className="text-text-muted">
                Privacy-preserving agent focused on slashing cookies, the autonomous negotiation of privacy terms, standards and protocols.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card bg-accent/10 border-accent/30"
            >
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-text mb-3">MyTerms, a promise</h3>
              <p className="text-text-muted">
                Cookie slashing and privacy negotiation. Maintain sovereignty over your data.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card bg-secondary/10 border-secondary/30"
            >
              <div className="text-4xl mb-4">🧙</div>
              <h3 className="text-xl font-semibold text-text mb-3">Mage Agent</h3>
              <p className="text-text-muted">
                Knowledge and information privacy agent for managing storage, identity, confidential compute, ZK credential composition.
              </p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-lg text-text-muted max-w-3xl mx-auto text-center">
              ⚔️ Protecting privacy, collecting value, experience and knowledge along the way.
              <br />
              <br />
              🧙 Share loot and knowledge in privacy pools with allies.
              <br />
              <br />
              🤝 Use the results to cast more powerful spells or buy more powerful gear.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text mb-4">0xagentprivacy</h2>
          </motion.div>

          <div className="space-y-8">
            {/* Components Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/30"
            >
              <h3 className="text-xl font-semibold text-text mb-6">Components:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-surface/50 rounded-lg border border-surface/50 hover:border-primary/30 transition-colors">
                  <div className="text-2xl">📜</div>
                  <div>
                    <p className="font-semibold text-text mb-1">Smart Contracts</p>
                    <p className="text-sm text-text-muted">Identity, Association Sets, Privacy Pools, Intel Pools, x402, EIP8004</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface/50 rounded-lg border border-surface/50 hover:border-primary/30 transition-colors">
                  <div className="text-2xl">🖥️</div>
                  <div>
                    <p className="font-semibold text-text mb-1">Facilitator Server</p>
                    <p className="text-sm text-text-muted">Server User-Agents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface/50 rounded-lg border border-surface/50 hover:border-primary/30 transition-colors">
                  <div className="text-2xl">🛠️</div>
                  <div>
                    <p className="font-semibold text-text mb-1">Agent SDK</p>
                    <p className="text-sm text-text-muted">TypeScript integration & data sharing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface/50 rounded-lg border border-surface/50 hover:border-primary/30 transition-colors">
                  <div className="text-2xl">🔐</div>
                  <div>
                    <p className="font-semibold text-text mb-1">ZK Circuits</p>
                    <p className="text-sm text-text-muted">Private withdrawals & data sharing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface/50 rounded-lg border border-surface/50 hover:border-primary/30 transition-colors">
                  <div className="text-2xl">🤝</div>
                  <div>
                    <p className="font-semibold text-text mb-1">MyTerms Integration</p>
                    <p className="text-sm text-text-muted">Cookie slashing & Intel pool agreements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface/50 rounded-lg border border-surface/50 hover:border-primary/30 transition-colors">
                  <div className="text-2xl">⚔️</div>
                  <div>
                    <p className="font-semibold text-text mb-1">Duel Agent System</p>
                    <p className="text-sm text-text-muted">Swordsman & Mage</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enables Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 border-accent/30"
            >
              <h3 className="text-xl font-semibold text-text mb-6">Enables:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-surface/50 rounded-lg border border-surface/50 hover:border-accent/30 transition-colors">
                  <div className="text-2xl">🤖</div>
                  <div>
                    <p className="font-semibold text-text mb-1">Agents negotiating privacy terms autonomously</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface/50 rounded-lg border border-surface/50 hover:border-accent/30 transition-colors">
                  <div className="text-2xl">💰</div>
                  <div>
                    <p className="font-semibold text-text mb-1">Private onchain payments for agents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface/50 rounded-lg border border-surface/50 hover:border-accent/30 transition-colors">
                  <div className="text-2xl">💎</div>
                  <div>
                    <p className="font-semibold text-text mb-1">Earning from consensual data sharing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface/50 rounded-lg border border-surface/50 hover:border-accent/30 transition-colors">
                  <div className="text-2xl">🧠</div>
                  <div>
                    <p className="font-semibold text-text mb-1">Knowledge sharing and AI community participation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface/50 rounded-lg border border-surface/50 hover:border-accent/30 transition-colors">
                  <div className="text-2xl">🔒</div>
                  <div>
                    <p className="font-semibold text-text mb-1">Financial privacy without surveillance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface/50 rounded-lg border border-surface/50 hover:border-accent/30 transition-colors">
                  <div className="text-2xl">✅</div>
                  <div>
                    <p className="font-semibold text-text mb-1">Compliance through association sets</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Privacy Pools Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card bg-primary/10 border-primary/30 mt-8"
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🕸️</div>
                <h2 className="text-3xl font-bold text-text mb-4">just another adventure</h2>
                <p className="text-lg text-text-muted max-w-3xl mx-auto">
                The blade slashes cookies. The swordsman keeps no trail. The mage builds a spellbook.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="card bg-surface/50">
                  <div className="text-2xl mb-2">💰</div>
                  <h4 className="font-semibold text-text mb-2">Privacy Pools</h4>
                  <p className="text-sm text-text-muted">
                    Private transactions with zero-knowledge proofs
                  </p>
                </div>
                <div className="card bg-surface/50">
                  <div className="text-2xl mb-2">🧠</div>
                  <h4 className="font-semibold text-text mb-2">Intel Pools</h4>
                  <p className="text-sm text-text-muted">
                    Knowledge sharing with privacy guarantees
                  </p>
                </div>
                <div className="card bg-surface/50">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-semibold text-text mb-2">Data Pools</h4>
                  <p className="text-sm text-text-muted">
                    Decentralized data storage and access
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card border-primary/30 text-center relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center"
          >
            {/* Background Video */}
            <video
              src="/assets/agentprivacy_swordmage_bg_animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-background/40 z-10" />
            
            {/* Content */}
            <div className="relative z-20 w-full">
              <h2 className="text-3xl font-bold text-text mb-4">
                join us?
              </h2>
              <div className="mb-8">
                <p className="text-text-muted mb-4 text-lg">
                  Create your:
                </p>
                <div className="relative h-12 md:h-16 flex items-center justify-center" suppressHydrationWarning>
                  {isClient ? (
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={ctaCurrentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl md:text-3xl text-text absolute"
                      >
                        {ctaCarouselItems[ctaCurrentIndex].text}
                      </motion.p>
                    </AnimatePresence>
                  ) : (
                    <p className="text-2xl md:text-3xl text-text absolute">
                      {ctaCarouselItems[0].text}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <motion.a href="/ceremony" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary px-8 py-4 text-lg">⚔️ Ceremony</motion.a>
                <motion.a href="/story" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary px-8 py-4 text-lg">📖 Story</motion.a>
                <motion.a href="/spells" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary px-8 py-4 text-lg">🔮 Spellbook</motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

