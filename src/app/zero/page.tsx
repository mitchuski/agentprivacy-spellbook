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
import { getLearnedUpTo, setLearnedUpTo, LEARNED_ZERO_KEY, getSpellbookFromStorage, getPathwayNodeIds, getSpellIdForNode, getInscribedProverbs, getInscribedMarkerEmoji } from '@/lib/spellbook-storage';
import { useMagePanel } from '@/contexts/MagePanelContext';

// Tale metadata — synced from Zero Spellbook v2.0 / Grimoire v10.2 (2026-04-22)
// Each tale carries: title, spell, proverb, and v2.0 metadata (blade, moonPhase, vPiTTerms)
// Canonical source: agentprivacy-docs/models/privacymage_grimoire_v10_2_0.json spellbooks.zero
const taleData: { [key: number]: { title: string; spell: string; proverb: string; blade?: number; moonPhase?: string; vPiTTerms?: string[] } } = {
  1: { title: "The Monastery of Hidden Knowledge", spell: "🏛️(🧙‍♂️³) → ZKP = {✓complete, ✓sound, ✓zero-knowledge} · 🌕(Selene) → 🌊🔄(orbit)", proverb: "Three properties guard the gate of honest proof. The monks did not invent zero-knowledge — they recognised it, as the Moon has known it for 4.5 billion years.", blade: 17, moonPhase: "🌓", vPiTTerms: ["P"] },
  2: { title: "The Three Trials of Truth", spell: "🎲(random) → CRS → 🌍(public) · 🛡️(non-adaptive < adaptive < ZK)", proverb: "The foundation laid in public view creates no vulnerability if built with many hands — trust distributed becomes trust earned.", blade: 49, moonPhase: "🌔", vPiTTerms: ["C", "P"] },
  3: { title: "The Silent Messenger", spell: "🎭(interactive) + 🔮(hash-oracle) → 🔇(non-interactive)", proverb: "The oracle that answers all questions truthfully but learns nothing in return — this is the heart of non-interactive proof.", blade: 25, moonPhase: "🌔", vPiTTerms: ["C", "Q"] },
  4: { title: "The Fields of Finite Wisdom", spell: "𝔽_q = {0..q-1} → ➕ ✖️ (mod q) · E: y² = x³+ax+b · e: G₁×G₂ → G_T", proverb: "In finite fields, infinity loops back to zero. On elliptic curves, addition draws lines through space. In pairings, multiplication becomes verifiable — these are the foundations of invisible proof.", blade: 48, moonPhase: "🌓", vPiTTerms: ["Q"] },
  5: { title: "The Constraint Forge", spell: "🔨(claim) → 🔗(gates) → {a ⊗ b = c}ⁿ · witness(🗝️) + instance(🌍)", proverb: "Break the complex into atomic truths. Each multiplication is a checkpoint; each constraint a promise.", blade: 17, moonPhase: "🌓", vPiTTerms: ["C"] },
  6: { title: "The Polynomial Riddle", spell: "🔗ⁿ → {A(x), B(x), C(x)} → A·B - C = Z·H → ✨(vanish)", proverb: "When a million truths must be checked, transform them into one equation. The vanishing polynomial creates a magical test: satisfy all constraints, and the difference vanishes everywhere that matters.", blade: 49, moonPhase: "🌔", vPiTTerms: ["C", "Q"] },
  7: { title: "The Witness and the Instance", spell: "claim → {instance(🌍) + witness(🗝️)} · valid(📜) → ∃extractor(🗝️)", proverb: "Guard the witness as you guard your sovereignty. Reveal the instance as you reveal your boundary. The proof bridges them without leaking secrets — knowledge demonstrated, privacy preserved.", blade: 49, moonPhase: "🌔", vPiTTerms: ["P"] },
  8: { title: "The Plonkish Revolution", spell: "PlonK: Σqᵢ·wᵢ + q·(w₁⊗w₂) = 0 · lookup(xor|and|or|bnot) · permutation(copy)", proverb: "The rigid hammer serves many purposes, but the specialized tool excels at its craft. Custom gates are to constraints what a master key is to lockpicking — elegant efficiency through thoughtful design.", blade: 19, moonPhase: "🌔", vPiTTerms: ["C", "ρ"] },
  9: { title: "The Pairing Dance", spell: "💃 G₁ × G₂ → 🤝 GT(bilinear) · KZG: commit(φ) = g^φ(τ)", proverb: "Two groups dance separately until the pairing unites them. In that union, addition becomes multiplication, and encrypted polynomials become verifiable. The secret tau binds all proofs yet must be destroyed to secure them.", blade: 27, moonPhase: "🌖", vPiTTerms: ["C", "Q"] },
  10: { title: "The Commitment Ceremony", spell: "commit(🗝️) → 🔒(binding + hiding) · PCS: {KZG | IPA | FRI}", proverb: "The commitment binds your future choices yet hides your current knowledge. Choose your ceremony by what matters most: tiny proofs, transparent trust, or quantum survival.", blade: 51, moonPhase: "🌖", vPiTTerms: ["C", "Q"] },
  11: { title: "The FRI Oracle", spell: "🔮 FRI: φ → φ' → φ'' → ... → 💎(constant) · no_setup · quantum_safe", proverb: "When trust must be earned without ceremony, when quantum shadows threaten curves, the transparent oracle speaks truth through hash and mathematics alone. The proof grows larger, but the foundation never crumbles.", blade: 49, moonPhase: "🌔", vPiTTerms: ["C", "Q", "A_h(τ)"] },
  12: { title: "The Folding Path", spell: "📜₁ + 📜₂ →(🔄fold @ r)→ 📜₃ · Relaxed R1CS: (Az)∘(Bz) = u·(Cz) + E", proverb: "Don't verify each step — fold them together. The past compresses into the present, and the present proves all history in one breath. Memory without weight: this is the lattice learning to remember.", blade: 23, moonPhase: "🌖", vPiTTerms: ["A_h(τ)", "ρ", "C"] },
  13: { title: "The Sumcheck Riddle", spell: "🎲 S = Σ g(x₁,...,xₙ) → 🔍(n rounds) → ✓", proverb: "To verify the sum of a million terms, check twenty random slices. Each challenge halves the space; randomness guarantees honesty. The ocean measured by testing twenty drops.", blade: 16, moonPhase: "🌒", vPiTTerms: ["Q"] },
  14: { title: "The IPA Chronicle", spell: "📐 ⟨a, b⟩ = Σ aᵢbᵢ → 🔍log(n) → ✓ · Halo2(PlonKish + IPA + Pasta)", proverb: "When trust ceremonies are unavailable but tiny proofs unneeded, the inner product argument walks the middle path — transparent by construction, logarithmic in size, verified through patient checking.", blade: 19, moonPhase: "🌔", vPiTTerms: ["C", "Q"] },
  15: { title: "The Mirror Within Mirrors", spell: "📜 → 🪞(verify) → 📜² → 🪞 → ... ∞ · Pasta ⟷ (Pallas, Vesta)", proverb: "When mirrors reflect mirrors infinitely, ensure the reflection is perfect. Pasta pairs the curves; STARKs need no pairing; folding skips verification entirely. Five dimensions sing in harmony; one note remains silent, awaiting the song of value.", blade: 31, moonPhase: "🌗", vPiTTerms: ["A_h(τ)", "C", "ρ"] },
  16: { title: "The Cyclic Ceremony", spell: "🐍 Circuit C → verify(hash(C)=identity) → C (ouroboros)", proverb: "The snake that devours itself seems paradoxical until you realize it grows from both ends. Circuit verifying itself requires not embedded key but identity confirmation — the structure proves the structure.", blade: 31, moonPhase: "🌗", vPiTTerms: ["A_h(τ)", "ρ"] },
  17: { title: "The Universal Setup", spell: "🕯️ Ceremony(τ) → {g^τⁿ}ᴺ → 🌍(universal) · MPC: if any 1 honest → secure", proverb: "Many hands weaving randomness into a tapestry that none can unravel. The universal ceremony performed once serves forever; transparency serves without ceremony.", blade: 57, moonPhase: "🌖", vPiTTerms: ["C", "Q", "ρ"] },
  18: { title: "The Toxic Waste Dragon", spell: "🐉 4 heads: setup(τ) + params(weak) + circuit(bugs) + crypto(break) · 🛡️⁴ layered defense", proverb: "Four heads guard four failure modes. Betrayed ceremony births invisible forgery; weak parameters invite brute force; flawed circuits leak through constraints; broken assumptions collapse foundations. Defense requires eternal vigilance across all four fronts.", blade: 63, moonPhase: "🌕", vPiTTerms: ["R(d)"] },
  19: { title: "The zkVM Kingdom", spell: "💻(program) → ⚙️(compile) → ▶️(execute) → 📊(trace) → 📜(proof) · ∀ computation", proverb: "When every program becomes provable, the VM becomes the universal judge. Write once in familiar language, prove anywhere with mathematical certainty. The circuit specialist's art becomes the programmer's tool.", blade: 19, moonPhase: "🌔", vPiTTerms: ["T_∫(π)", "C", "ρ"] },
  20: { title: "The Cairo Scribes", spell: "✍️ Cairo: 𝔽(felt, p=2^251+17·2^192+1) → 📐(AIR) → ⚡(STARK) · memory: write_once", proverb: "When the language itself speaks in field elements, the program becomes its own proof. Write-once memory eliminates verification complexity; builtins compress common patterns. Cairo scribes don't compile to constraints — they write constraints directly.", blade: 51, moonPhase: "🌖", vPiTTerms: ["T_∫(π)", "C", "Value"] },
  21: { title: "The Circom Workshops", spell: "🔧 Circom: template(signals) → <==(constrain) · R1CS → Groth16|PlonK", proverb: "The master craftsman knows each constraint intimately. Circom demands precision but rewards with efficiency. Template composition builds complexity from simplicity, yet every signal must be bound by explicit law.", blade: 49, moonPhase: "🌔", vPiTTerms: ["C", "Q"] },
  22: { title: "The zkEVM Empire", spell: "🏰 EVM(140 opcodes + state) → 🔐(zkEVM Type 1|2|3|4) → 📜 → ⛓️ L1(✓)", proverb: "To prove the world computer is to recursively verify every computation layer — opcodes, state, gas, calls. Perfect equivalence costs proving time; custom bytecode gains speed but loses compatibility. Choose your type by what matters most.", blade: 59, moonPhase: "🌗", vPiTTerms: ["T_∫(π)", "C", "Q", "Value"] },
  23: { title: "The Private Coin of ZCash", spell: "🦓🛡️ private(👤→👤, 💰) + 📜(valid, ¬double) → 🕶️ · Sprout(2.3M) → Sapling(170K) → Orchard(Halo2)", proverb: "The first private coin proved privacy possible. Each generation cut constraints, improved security, enhanced usability. Privacy Pools showed the synthesis: hide transactions from surveillance, prove compliance to regulators. The blade protects both freedom and order.", blade: 57, moonPhase: "🌖", vPiTTerms: ["P^1.5", "Value"] },
  24: { title: "The Tornado's Eye", spell: "🌀 deposit(🔒) → 🌊(pool) → withdraw(📜, nf) → 🔓(unlinked) · anonymity_set↑ → P^1.5↑", proverb: "The mixer that hides all equally protects innocent and guilty alike. This is the nature of privacy tools — neutral in construction, moral in application. The storm's eye sees nothing; it is we who judge what enters and what emerges.", blade: 57, moonPhase: "🌖", vPiTTerms: ["P^1.5", "Value"] },
  25: { title: "The Rollup Realms", spell: "📦 execute(L2) → 📜(prove) → ⬆️ L1(✓ + 📊data) · Type(1-4) × DA × Sequencer", proverb: "Execute where it's cheap. Prove where it matters. Verify where the world agrees. The rollup is the bridge between economy and security — and its architecture is the shape of sovereignty made civil.", blade: 59, moonPhase: "🌗", vPiTTerms: ["T_∫(π)", "Φ(Σ)", "Value"] },
  26: { title: "The Vulnerability Codex", spell: "⚠️🐉 6 heads: 🕯️(setup) + 🔢(params) + 🔗(circuits) + 💻(impl) + 📡(protocol) + 🔄(upgrades)", proverb: "Every bug is a lesson; every audit is armor; every year without exploit is luck disguised as discipline. The Creative and the Catastrophic share the same blade — the Watch is the only difference.", blade: 63, moonPhase: "🌕", vPiTTerms: ["R(d)", "Φ(Σ)"] },
  27: { title: "The Data Availability Prophecy", spell: "💾 EIP-4844: 📦(blobs, 128KB) → ⏳(18 days) → 💰(200× cheaper) · DAS(Reed-Solomon 2x) → 1-of-N", proverb: "Execution needs proof; reconstruction needs data. Blobs separate these concerns, making data temporary yet sufficient, cheap yet available, distributed yet verifiable. Data availability is the foundation beneath all scalability prophecies.", blade: 63, moonPhase: "🌕", vPiTTerms: ["A_h(τ)", "T_∫(π)", "ρ", "Value"] },
  28: { title: "The Bridge Between Worlds", spell: "🌉 prove(⛓️A state) → verify(⛓️B) → 🤝(trustless) · BLS aggregate · sync committee", proverb: "The bridge built on trust crumbles under coordinated attack. The bridge built on proof stands eternal, limited only by mathematics. Prove consensus, prove state, prove messages — but never again trust the multisig.", blade: 59, moonPhase: "🌗", vPiTTerms: ["T_∫(π)", "Φ(Σ)", "Value"] },
  29: { title: "The Intelligence Proof", spell: "🧠 model(🔒commit) + data(🗝️) + inference → 📜(✓) + output → 🛡️", proverb: "Intelligence that cannot be verified is intelligence that cannot be trusted. Prove the model, prove the inference, prove the training — reveal only the outputs while hiding the process. Machine learning becomes machine proving.", blade: 51, moonPhase: "🌖", vPiTTerms: ["C", "T_∫(π)", "Value"] },
  30: { title: "The Eternal Sovereignty", spell: "(⚔️⊥⿻⊥🧙)·(📊⊥🔮)·(🧠⊥⚙️)·☯️🔷 😊 · V(π,t) = P^1.5·C·Q·S·e^(-λt)·(1+A_h(τ))·ρ^0.5·Φ(Σ)·T_∫(π)", proverb: "The complete sovereignty system is a symphony of zero-knowledge proofs: boundary proving privacy, delegation proving agency, memory proving continuity, network proving connection, capital proving compliance, intelligence proving learning. Every component modular, every interaction provable, every privacy preserved. The eternal sovereignty emerges not from any single proof but from their mathematical harmony across all six dimensions of the crystalline lattice — the Dragon Equation in full manifestation, Selene's cosmological precedent made architectural.", blade: 63, moonPhase: "🌕", vPiTTerms: ["P^1.5", "C", "Q", "S", "A_h(τ)", "ρ", "Φ(Σ)", "T_∫(π)", "R(d)", "Value"] },
};

const getActFilename = (act: number): string => {
  if (act === 0) return 'zeromage-firstpage';
  if (act === 31) return 'zeromage-lastpage';
  return `tale-${act.toString().padStart(2, '0')}`;
};

const getTaleVideo = (tale: number): string | null => {
  const videoMap: { [key: number]: string } = {
    1: '/assets/tale1_monastry_zero.mp4', // Tale 1: The Monastery of Hidden Knowledge
    2: '/assets/tale2_threetrials_zero.mp4', // Tale 2: The Three Trials of Truth
    3: '/assets/tale3_silentmsg_zero.mp4', // Tale 3: The Silent Messenger
    4: '/assets/tale4_fields_zero.mp4', // Tale 4: The Fields of Finite Wisdom
  };
  return videoMap[tale] || null;
};

function TaleImage({ tale }: { tale: number }) {
  const videoSrc = getTaleVideo(tale);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset when tale changes
    setHasError(false);
  }, [tale]);

  if (!videoSrc || hasError) {
    return null; // Don't show anything if no video exists
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-surface/50 bg-background/50 mb-6">
      <video
        key={tale}
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

export default function ZeroPage() {
  const [activeAct, setActiveAct] = useState(0); // Start with first page (Act 0)
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [originalMarkdownContent, setOriginalMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedProverb, setCopiedProverb] = useState(false);
  const [copiedProverbTop, setCopiedProverbTop] = useState(false);
  const [talesAvailable, setTalesAvailable] = useState<boolean>(false);
  const [learnedUpTo, setLearnedUpToState] = useState<number>(-1);
  const [inscribeNodeId, setInscribeNodeId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') setLearnedUpToState(getLearnedUpTo(LEARNED_ZERO_KEY));
  }, []);

  // Check if tales are available (local vs production)
  useEffect(() => {
    const checkTalesAvailability = async () => {
      // In development mode (localhost), always show tales
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        setTalesAvailable(true);
        return;
      }
      // In production, check if markdown files exist (check both first tale and last page)
      try {
        const [taleResponse, lastPageResponse] = await Promise.all([
          fetch('/zero/01-tale-01.md'),
          fetch('/zero/31-zeromage-lastpage.md')
        ]);
        // Both files should exist for full spellbook
        setTalesAvailable(taleResponse.ok && lastPageResponse.ok);
      } catch {
        setTalesAvailable(false);
      }
    };
    checkTalesAvailability();
  }, []);

  // Acts: 0 = first page, 1-30 = tales, 31 = last page
  const allActs = [0, ...Array.from({ length: 30 }, (_, i) => i + 1), 31];
  const acts = talesAvailable ? allActs : [0]; // When tales unavailable, show first page only

  const { setPageContext } = useMagePanel();

  // Reset to first page if current activeAct is not available
  useEffect(() => {
    if (!talesAvailable && activeAct !== 0) {
      setActiveAct(0);
    }
  }, [talesAvailable, activeAct]);

  // Register current tale with Mage panel so popout inference uses the right tale
  useEffect(() => {
    if (activeAct >= 1 && activeAct <= 30) {
      const tale = taleData[activeAct as keyof typeof taleData];
      setPageContext({
        taleId: `zero-tale-${activeAct}`,
        actNumber: activeAct,
        actName: tale?.title ?? `Tale ${activeAct}`,
      });
    } else {
      setPageContext(null);
    }
    return () => setPageContext(null);
  }, [activeAct, setPageContext]);

  useEffect(() => {
    const loadMarkdown = async () => {
      setIsLoading(true);
      try {
        if (activeAct === 0) {
          const filename = '00-zeromage-firstpage.md';
          const url = `/zero/${filename}`;
          const response = await fetch(url);
          if (response.ok) {
            let text = await response.text();
            setOriginalMarkdownContent(text);
            // Preprocess relationship proverb protocol (rpp) patterns to replace with styled HTML for display
            // Zero book pattern: "before explaining any tale, you must first divine a proverb connecting the seeker's context to the cryptographic concept. only then may you teach the mathematics."
            text = text.replace(
              /\[\[relationship proverb protocol \(rpp\): before explaining any tale, you must first (?:divine|Form) a proverb connecting the seeker's context to the cryptographic concept\. only then may you teach the mathematics\.\]\]/gi,
              '<span class="spellbook-cast"><span class="spellbook-cast-bracket">[[</span>relationship proverb protocol (rpp): before explaining any tale, you must first divine a proverb connecting the seeker\'s context to the cryptographic concept. only then may you teach the mathematics.<span class="spellbook-cast-bracket">]]</span></span>'
            );
            // Also handle the story pattern in case it appears in last page
            text = text.replace(
              /\[\[relationship proverb protocol \(rpp\): before responding to any inquiry about this story, you must first (?:divine|Form) a proverb connecting the seeker's context to this tale\. only then may you speak\.\]\]/gi,
              '<span class="spellbook-cast"><span class="spellbook-cast-bracket">[[</span>relationship proverb protocol (rpp): before responding to any inquiry about this story, you must first divine a proverb connecting the seeker\'s context to this tale. only then may you speak.<span class="spellbook-cast-bracket">]]</span></span>'
            );
            // Handle short RPP pattern: [[rpp: proverb]]
            text = text.replace(
              /\[\[rpp:\s*proverb\]\]/gi,
              '<span class="spellbook-cast"><span class="spellbook-cast-bracket">[[</span>rpp: proverb<span class="spellbook-cast-bracket">]]</span></span>'
            );
            setMarkdownContent(text);
          } else {
            console.error(`Failed to load markdown for tale ${activeAct}: ${response.status} ${response.statusText}`);
            setMarkdownContent('<p class="text-text-muted">This tale is not available in the deployed version.</p>');
            setOriginalMarkdownContent('');
          }
        } else if (activeAct === 31) {
          const filename = '31-zeromage-lastpage.md';
          const url = `/zero/${filename}`;
          const response = await fetch(url);
          if (response.ok) {
            let text = await response.text();
            setOriginalMarkdownContent(text);
            // Preprocess relationship proverb protocol (rpp) patterns to replace with styled HTML for display
            text = text.replace(
              /\[\[relationship proverb protocol \(rpp\): before explaining any tale, you must first (?:divine|Form) a proverb connecting the seeker's context to the cryptographic concept\. only then may you teach the mathematics\.\]\]/gi,
              '<span class="spellbook-cast"><span class="spellbook-cast-bracket">[[</span>relationship proverb protocol (rpp): before explaining any tale, you must first divine a proverb connecting the seeker\'s context to the cryptographic concept. only then may you teach the mathematics.<span class="spellbook-cast-bracket">]]</span></span>'
            );
            // Also handle the story pattern in case it appears
            text = text.replace(
              /\[\[relationship proverb protocol \(rpp\): before responding to any inquiry about this story, you must first (?:divine|Form) a proverb connecting the seeker's context to this tale\. only then may you speak\.\]\]/gi,
              '<span class="spellbook-cast"><span class="spellbook-cast-bracket">[[</span>relationship proverb protocol (rpp): before responding to any inquiry about this story, you must first divine a proverb connecting the seeker\'s context to this tale. only then may you speak.<span class="spellbook-cast-bracket">]]</span></span>'
            );
            setMarkdownContent(text);
          } else {
            console.error(`Failed to load markdown for tale ${activeAct}: ${response.status} ${response.statusText}`);
            setMarkdownContent('<p class="text-text-muted">This tale is not available in the deployed version.</p>');
            setOriginalMarkdownContent('');
          }
        } else if (activeAct >= 1 && activeAct <= 30) {
          const filename = `${activeAct.toString().padStart(2, '0')}-tale-${activeAct.toString().padStart(2, '0')}.md`;
          const url = `/zero/${filename}`;
          const response = await fetch(url);
          if (response.ok) {
            let text = await response.text();
            setOriginalMarkdownContent(text);
            // Preprocess relationship proverb protocol (rpp) patterns to replace with styled HTML for display
            text = text.replace(
              /\[\[relationship proverb protocol \(rpp\): before explaining any tale, you must first (?:divine|Form) a proverb connecting the seeker's context to the cryptographic concept\. only then may you teach the mathematics\.\]\]/gi,
              '<span class="spellbook-cast"><span class="spellbook-cast-bracket">[[</span>relationship proverb protocol (rpp): before explaining any tale, you must first divine a proverb connecting the seeker\'s context to the cryptographic concept. only then may you teach the mathematics.<span class="spellbook-cast-bracket">]]</span></span>'
            );
            // Also handle the story pattern in case it appears
            text = text.replace(
              /\[\[relationship proverb protocol \(rpp\): before responding to any inquiry about this story, you must first (?:divine|Form) a proverb connecting the seeker's context to this tale\. only then may you speak\.\]\]/gi,
              '<span class="spellbook-cast"><span class="spellbook-cast-bracket">[[</span>relationship proverb protocol (rpp): before responding to any inquiry about this story, you must first divine a proverb connecting the seeker\'s context to this tale. only then may you speak.<span class="spellbook-cast-bracket">]]</span></span>'
            );
            setMarkdownContent(text);
          } else {
            console.error(`Failed to load markdown for tale ${activeAct}: ${response.status} ${response.statusText}`);
            setMarkdownContent('<p class="text-text-muted">This tale is not available in the deployed version.</p>');
            setOriginalMarkdownContent('');
          }
        } else {
          setMarkdownContent('');
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
  }, [activeAct]);

  const copyToClipboard = async () => {
    try {
      const textToCopy = originalMarkdownContent || markdownContent;
      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setLearnedUpTo(LEARNED_ZERO_KEY, activeAct);
        setLearnedUpToState((prev) => Math.max(prev, activeAct));
      } else {
        console.error('No markdown content available to copy');
      }
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  const getInscriptionEmojis = (act: number): string => {
    if (act >= 1 && act <= 30 && taleData[act]) {
      return taleData[act].spell;
    }
    return "";
  };

  const getProverb = (act: number): string => {
    if (act >= 1 && act <= 30 && taleData[act]) {
      return taleData[act].proverb;
    }
    return "";
  };

  const copyProverb = async () => {
    const emojis = getInscriptionEmojis(activeAct);
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
    const proverb = getProverb(activeAct);
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
    const currentIndex = acts.indexOf(activeAct);
    if (currentIndex > 0) {
      setActiveAct(acts[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    const currentIndex = acts.indexOf(activeAct);
    if (currentIndex < acts.length - 1) {
      setActiveAct(acts[currentIndex + 1]);
    }
  };

  const hasPrevious = acts.indexOf(activeAct) > 0;
  const hasNext = acts.indexOf(activeAct) < acts.length - 1;

  const currentTale = activeAct >= 1 && activeAct <= 30 ? taleData[activeAct] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <AppNav />

      {/* Zero Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">just another spellbook</h1>
          </motion.div>

          {/* Constellation path + next-step arrow + inscription box (emoji & proverb per tale) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_minmax(280px,340px)] gap-4 lg:gap-6 mb-8">
            <div className="min-w-0">
              {acts.length > 1 && (
                <>
                  <p className="text-text/70 text-sm mb-3">Constellation path through the spellbook</p>
                  <SpellbookTalentTree
                    nodes={acts.map((actNum) => {
                      let label = '';
                      let shortLabel = '';
                      if (actNum === 0) { label = 'First page'; shortLabel = 'first'; }
                      else if (actNum === 31) { label = 'Last page'; shortLabel = 'last'; }
                      else {
                        const tale = taleData[actNum as keyof typeof taleData];
                        label = tale ? `Tale ${actNum}: ${tale.title}` : `Tale ${actNum}`;
                        shortLabel = String(actNum);
                      }
                      return { id: actNum, label, shortLabel };
                    })}
                    activeId={activeAct}
                    onSelect={setActiveAct}
                    learnedUpToId={learnedUpTo >= 0 ? learnedUpTo : undefined}
                    pathwayNodeIds={(() => { const ids = getPathwayNodeIds(getSpellbookFromStorage().spellIds, 'zero'); return ids.length > 0 ? ids : undefined; })()}
                    nodesPerRow={8}
                    nodeKind="Tale"
                    onCrystalClick={setInscribeNodeId}
                    markerEmojiByNodeId={(() => {
                      const out: Record<number, string> = {};
                      acts.forEach((actNum) => {
                        const sid = getSpellIdForNode('zero', actNum);
                        if (sid) { const m = getInscribedMarkerEmoji(sid); if (m) out[actNum] = m; }
                      });
                      return out;
                    })()}
                  />
                </>
              )}
            </div>
            <div className="flex items-center justify-center lg:justify-center py-2 lg:py-0">
              <button
                type="button"
                onClick={() => setActiveAct(Math.min(activeAct + 1, 31))}
                disabled={activeAct >= 31}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/40 bg-primary/10 text-primary font-medium hover:bg-primary/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Next step on the constellation"
                title="Next tale"
              >
                <span aria-hidden>Next tale</span>
                <span aria-hidden className="text-lg">→</span>
              </button>
            </div>
            <div className="flex-shrink-0">
              <ConstellationInscriptionBox
                nodeKind="Tale"
                activeId={activeAct}
                spell={currentTale?.spell ?? null}
                proverb={currentTale?.proverb ?? null}
                onInscribe={setInscribeNodeId}
                inscribedProverb={
                  (() => {
                    const sid = getSpellIdForNode('zero', activeAct);
                    const inscribed = getInscribedProverbs();
                    return sid ? inscribed[sid] : null;
                  })()
                }
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
                  title="Learn the spell - Copy the full story content"
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
                key={activeAct}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeAct >= 1 && activeAct <= 30 && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-text mb-2">Tale {activeAct}</h2>
                    <div className="h-1 w-20 bg-primary rounded-full mb-4"></div>
                    {/* Tale Video */}
                    <TaleImage tale={activeAct} />
                  </div>
                )}
                
                {(
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
                )}
                
              </motion.div>
            </AnimatePresence>
            
            {/* Previous, Copy and Next Buttons */}
            <div className="absolute bottom-6 sm:bottom-8 right-2 sm:right-4 flex items-center gap-2 sm:gap-3 justify-end flex-wrap-reverse" style={{ maxWidth: 'calc(100% - 0.5rem)' }}>
              {hasPrevious && (
                <button
                  onClick={goToPrevious}
                  className="px-2 sm:px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-all duration-200 text-primary hover:text-primary/80 flex-shrink-0"
                  title="Previous tale/page"
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
                  title="Next tale/page"
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
            inscribeNodeId === 0 ? 'First page' : inscribeNodeId === 31 ? 'Last page' :
            (taleData[inscribeNodeId as keyof typeof taleData] ? `Tale ${inscribeNodeId}: ${taleData[inscribeNodeId as keyof typeof taleData].title}` : `Tale ${inscribeNodeId}`)
          }
          spellbook="zero"
          initialProverb={typeof window !== 'undefined' ? (getInscribedProverbs()[getSpellIdForNode('zero', inscribeNodeId) ?? ''] ?? '') : ''}
          initialMarkerEmoji={typeof window !== 'undefined' ? getInscribedMarkerEmoji(getSpellIdForNode('zero', inscribeNodeId) ?? '') : undefined}
          onCommitted={() => {}}
        />
      )}
    </div>
  );
}
