import { useState, useEffect, useRef } from "react";

/* ── Mini constellation SVG ── */
const SpellConstellation = ({ nodes, connections, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
    <svg width="80" height="80" viewBox="0 0 80 80">
      {connections.map((c, i) => (
        <line key={i} x1={nodes[c[0]].x} y1={nodes[c[0]].y} x2={nodes[c[1]].x} y2={nodes[c[1]].y}
          stroke="#818cf8" strokeWidth="0.8" opacity="0.4" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r || 3}
          fill={n.active ? "#c7d2fe" : "#475569"}
          style={{ filter: n.active ? "drop-shadow(0 0 3px #818cf8)" : "none" }} />
      ))}
    </svg>
    <span className="mono" style={{ fontSize: "10px", color: "#64748b", letterSpacing: "0.08em" }}>{label}</span>
  </div>
);

/* ── Data ── */
const carouselLines = [
  { role: "mage", emoji: "🧙", text: "knowledge is my spellbook." },
  { role: "swordsman", emoji: "⚔️", text: "privacy is my blade." },
  { role: "seeker", emoji: "🌌", text: "the story is my path." },
  { role: "builder", emoji: "🔧", text: "the protocol is my craft." },
  { role: "sovereign", emoji: "🐉", text: "the 7th capital is my birthright." },
];

const joinCarousel = ["agent 🤖", "spellbook 🔮", "ceremony ⚔️", "constellation 🌌"];

const spellbooks = [
  { id: "story", name: "First Person", emoji: "📖", question: "WHAT", acts: 23, unit: "acts", desc: "Your sovereignty story. The journey of Soulbis and Soulbae through Drake to Dragon pattern space.", color: "#f59e0b" },
  { id: "zero", name: "Zero Knowledge", emoji: "🔮", question: "HOW", acts: 30, unit: "tales", desc: "Cryptographic magic made human-readable.", color: "#818cf8" },
  { id: "canon", name: "The Canon", emoji: "📜", question: "WHY", acts: 11, unit: "chapters", desc: "Blockchain lineage. Cypherpunks to synthesis.", color: "#22d3ee" },
  { id: "society", name: "Parallel Society", emoji: "🚪", question: "EXIT", acts: 17, unit: "chapters", desc: "Farewell to Westphalia. Why sovereignty requires exit.", color: "#f87171" },
  { id: "plural", name: "Plurality", emoji: "⿻", question: "COORDINATE", acts: 30, unit: "acts", desc: "Weyl & Tang's vision. Many in relationship, not collapse.", color: "#34d399" },
];

const navLinks = ["soulbis","story","zero","canon","society","plural","proverbs","evoke","privacy","mage","promise","spells"];

const journeySteps = [
  { num: "01", label: "Read", detail: "Choose a spellbook. Follow the tales.", icon: "📖" },
  { num: "02", label: "Reflect", detail: "What pattern did you see? What connected?", icon: "🌌" },
  { num: "03", label: "Inscribe", detail: "Cast your proverb. Choose your spell.", icon: "✍️" },
  { num: "04", label: "Evolve", detail: "Your inscription becomes your agent's soul.", icon: "🐉" },
];

export default function AgentPrivacyLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroFade, setHeroFade] = useState(true);
  const [joinIdx, setJoinIdx] = useState(0);
  const [joinFade, setJoinFade] = useState(true);
  const [hoveredBook, setHoveredBook] = useState(null);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setHeroFade(false);
      setTimeout(() => { setHeroIdx(i => (i + 1) % carouselLines.length); setHeroFade(true); }, 400);
    }, 3200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setJoinFade(false);
      setTimeout(() => { setJoinIdx(i => (i + 1) % joinCarousel.length); setJoinFade(true); }, 400);
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  const bgStars = useRef(
    Array.from({ length: 45 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 1.2 + 0.3, delay: Math.random() * 6,
      opacity: Math.random() * 0.25 + 0.05,
    }))
  ).current;

  const cur = carouselLines[heroIdx];

  return (
    <div style={{ minHeight: "100vh", background: "#0f1129", color: "#e2e8f0", fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}

        @keyframes starPulse{0%,100%{opacity:0.08}50%{opacity:0.35}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slowDrift{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.05)}50%{box-shadow:0 0 40px rgba(99,102,241,0.12)}}

        .mono{font-family:'JetBrains Mono',monospace}

        .nav-link{font-size:13px;color:#64748b;text-decoration:none;letter-spacing:0.01em;transition:color 0.2s;cursor:pointer;font-weight:500}
        .nav-link:hover{color:#818cf8}

        .btn{padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.01em;cursor:pointer;transition:all 0.25s ease;border:1px solid transparent;text-decoration:none;display:inline-flex;align-items:center;gap:8px;font-family:inherit}
        .btn-p{background:#6366f1;border-color:#6366f1;color:#fff}
        .btn-p:hover{background:#7c3aed;border-color:#7c3aed;box-shadow:0 0 24px rgba(99,102,241,0.3)}
        .btn-s{background:transparent;border-color:#334155;color:#cbd5e1}
        .btn-s:hover{background:rgba(255,255,255,0.04);border-color:#475569;color:#e2e8f0}
        .btn-g{background:transparent;border-color:#1e293b;color:#64748b;font-size:13px}
        .btn-g:hover{color:#94a3b8;border-color:#334155}

        .card{border:1px solid #1e293b;transition:all 0.35s ease;cursor:pointer;border-radius:12px;background:rgba(15,23,42,0.6)}
        .card:hover{border-color:#334155;transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.3);background:rgba(30,41,59,0.4)}

        .agent-card{border:1px solid #1e3a5f;border-radius:12px;padding:28px 24px;background:linear-gradient(135deg,rgba(15,23,42,0.8),rgba(22,33,62,0.8));transition:all 0.3s ease}
        .agent-card:hover{border-color:#2563eb33;box-shadow:0 4px 24px rgba(99,102,241,0.08)}

        .step{transition:all 0.3s ease;border-left:2px solid #1e293b}
        .step:hover{background:rgba(99,102,241,0.04);border-left-color:#6366f1}

        .divider{height:1px;background:linear-gradient(90deg,transparent,#1e293b,transparent);max-width:720px;margin:0 auto}

        .slabel{font-family:'JetBrains Mono',monospace;font-size:11px;color:#6366f1;letter-spacing:0.15em;text-transform:uppercase;text-align:center;margin-bottom:16px;font-weight:500}

        .heading{font-weight:800;letter-spacing:-0.02em;line-height:1.15}
        .subheading{font-weight:700;letter-spacing:-0.01em;line-height:1.3}
      `}</style>

      {/* ── Stars ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <svg width="100%" height="100%">
          {bgStars.map((s, i) => (
            <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.size} fill="#818cf8" opacity={s.opacity}
              style={{ animation: `starPulse ${3+s.delay}s ease-in-out ${s.delay}s infinite` }} />
          ))}
        </svg>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ═══ NAV ═══ */}
        <nav style={{ display: "flex", alignItems: "center", gap: "20px", padding: "16px 24px", borderBottom: "1px solid #1e293b", overflowX: "auto", flexWrap: "nowrap" }}>
          <span style={{ fontSize: "16px", color: "#6366f1", fontWeight: 800, whiteSpace: "nowrap", marginRight: "12px", letterSpacing: "-0.02em" }}>agentprivacy</span>
          {navLinks.map(l => <span key={l} className="nav-link" style={{ whiteSpace: "nowrap" }}>{l}</span>)}
          <div style={{ marginLeft: "auto", fontSize: "18px" }}>🧙</div>
        </nav>

        {/* ═══ HERO ═══ */}
        <section style={{ minHeight: "92vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 24px", textAlign: "center" }}>
          <h1 className="heading" style={{ fontSize: "clamp(36px,6vw,64px)", color: "#6366f1", marginBottom: "16px", animation: "fadeUp 0.8s ease-out 0.2s both" }}>
            agentprivacy
          </h1>
          <p style={{ fontSize: "clamp(15px,2vw,19px)", color: "#94a3b8", maxWidth: "520px", lineHeight: 1.6, marginBottom: "36px", animation: "fadeUp 0.8s ease-out 0.4s both" }}>
            privacy-first personal payment and knowledge for AI agents
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginBottom: "64px", animation: "fadeUp 0.8s ease-out 0.6s both" }}>
            <button className="btn btn-p">⚔️ Ceremony</button>
            <button className="btn btn-s">📖 Story</button>
            <button className="btn btn-s">🧙 Spellbook</button>
          </div>

          {/* Carousel */}
          <div style={{ animation: "fadeUp 0.8s ease-out 0.8s both", minHeight: "130px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="subheading" style={{ fontSize: "clamp(20px,3.5vw,30px)", color: "#e2e8f0", marginBottom: "14px" }}>
              i'm just another
            </div>
            <div style={{ opacity: heroFade ? 1 : 0, transform: heroFade ? "translateY(0)" : "translateY(8px)", transition: "all 0.4s ease" }}>
              <span style={{ fontSize: "clamp(16px,2.5vw,22px)", color: "#64748b" }}>
                {cur.role} {cur.emoji}{" "}
                <span style={{ color: "#94a3b8" }}>{cur.text}</span>
              </span>
            </div>
            <div style={{ marginTop: "18px", opacity: heroFade ? 1 : 0, transition: "opacity 0.4s ease 0.15s" }}>
              <span style={{ fontSize: "clamp(15px,2vw,19px)", color: "#6366f1", fontWeight: 600 }}>and so are you. 🤝</span>
            </div>
          </div>

          <div style={{ position: "absolute", bottom: "28px", animation: "slowDrift 3s ease-in-out infinite" }}>
            <div className="mono" style={{ fontSize: "10px", color: "#334155" }}>↓</div>
          </div>
        </section>

        {/* ═══ THESIS ═══ */}
        <section style={{ padding: "100px 24px", maxWidth: "720px", margin: "0 auto" }}>
          <div className="divider" style={{ marginBottom: "80px" }} />
          <div className="slabel">The Problem</div>

          <h2 className="subheading" style={{ fontSize: "clamp(22px,4vw,34px)", color: "#e2e8f0", marginBottom: "28px", textAlign: "center" }}>
            AI agents will act on your behalf.
            <br /><span style={{ color: "#6366f1" }}>Who keeps the information they generate?</span>
            <br /><span style={{ color: "#818cf8" }}>What builds in the gap between them?</span>
          </h2>

          <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.8, textAlign: "center", maxWidth: "580px", margin: "0 auto 20px" }}>
            A single agent that knows both your privacy boundaries and your delegation preferences can reconstruct your complete behavioral model. That's not a policy problem — it's an architecture problem.
          </p>
          <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.8, textAlign: "center", maxWidth: "580px", margin: "0 auto 44px" }}>
            We protect ourselves with architecture, not retrofitted terms of service. Privacy by default, enforced by mathematics. The Swordsman guards your boundaries. The Mage projects through them. The gap between is irreducible. That gap is where <span style={{ color: "#c7d2fe", fontWeight: 600 }}>you</span> live.
          </p>

          {/* Dual agent */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "36px", marginBottom: "44px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>⚔️</div>
              <div style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: 700 }}>Swordsman</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>cuts boundaries</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "16px", marginBottom: "2px" }}>⿻</div>
              <div className="mono" style={{ fontSize: "10px", color: "#6366f1", opacity: 0.6, letterSpacing: "0.15em" }}>║ gap ║</div>
              <div style={{ width: "64px", height: "1px", background: "linear-gradient(90deg,transparent,#6366f144,transparent)", margin: "6px 0" }} />
              <div style={{ fontSize: "10px", color: "#475569", fontWeight: 500 }}>sovereignty</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔮</div>
              <div style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: 700 }}>Mage</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>projects through</div>
            </div>
          </div>

          {/* Value box */}
          <div style={{ background: "rgba(99,102,241,0.04)", border: "1px solid #1e3a5f", borderRadius: "12px", padding: "28px", animation: "glowPulse 6s ease-in-out infinite", maxWidth: "580px", margin: "0 auto" }}>
            <div className="mono" style={{ fontSize: "11px", color: "#6366f1", letterSpacing: "0.12em", marginBottom: "14px", textTransform: "uppercase", fontWeight: 500 }}>Why this creates value</div>
            <p style={{ fontSize: "15px", color: "#cbd5e1", lineHeight: 1.8, margin: 0 }}>
              Every boundary the Swordsman enforces makes the Mage's delegation more trustworthy. Every spell cast within those bounds proves the architecture works. Your agents improve by proving they respect the gap. That proof <em style={{ color: "#818cf8", fontStyle: "normal", fontWeight: 600 }}>is</em> the value. The 7th capital compounds.
            </p>
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section style={{ padding: "80px 24px", maxWidth: "860px", margin: "0 auto" }}>
          <div className="divider" style={{ marginBottom: "80px" }} />
          <h2 className="heading" style={{ fontSize: "clamp(24px,4vw,36px)", textAlign: "center", color: "#e2e8f0", marginBottom: "12px" }}>features</h2>
          <p style={{ textAlign: "center", fontSize: "15px", color: "#64748b", marginBottom: "44px" }}>
            cypherpunk systems, protocols, standards, apps and primitives for private sovereign AI agents.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px", marginBottom: "44px" }}>
            {[
              { e: "⚔️", n: "Swordsman Agent", d: "Privacy-preserving agent focused on slashing cookies, the autonomous negotiation of privacy terms, standards and protocols." },
              { e: "🤝", n: "promises", d: "Privacy negotiation. Maintain sovereignty over your data. MyTerms IEEE 7012 at the boundary." },
              { e: "🧙", n: "Mage Agent", d: "Knowledge and information privacy agent for managing storage, identity, confidential compute, ZK credential composition." },
            ].map(a => (
              <div key={a.n} className="agent-card">
                <div style={{ fontSize: "28px", marginBottom: "16px" }}>{a.e}</div>
                <div style={{ fontSize: "16px", color: "#e2e8f0", fontWeight: 700, marginBottom: "10px" }}>{a.n}</div>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>{a.d}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#94a3b8" }}>⚔️ Protecting privacy, collecting value, experience and knowledge along the way.</span>
            <span style={{ fontSize: "14px", color: "#94a3b8" }}>🧙 Share loot and knowledge in privacy pools with allies.</span>
            <span style={{ fontSize: "14px", color: "#94a3b8" }}>🤝 Use the results to cast more powerful spells or buy more powerful gear.</span>
          </div>
        </section>

        {/* ═══ FIVE SPELLBOOKS ═══ */}
        <section style={{ padding: "80px 24px 100px", maxWidth: "940px", margin: "0 auto" }}>
          <div className="divider" style={{ marginBottom: "80px" }} />
          <div className="slabel">The Adventure</div>

          <h2 className="heading" style={{ fontSize: "clamp(22px,4vw,34px)", textAlign: "center", color: "#e2e8f0", marginBottom: "10px" }}>
            Hundreds of spellbooks, thousands of spells.<br />A city of mages. An army of swordsmen.
          </h2>
          <p style={{ textAlign: "center", fontSize: "15px", color: "#64748b", maxWidth: "500px", margin: "0 auto 12px", lineHeight: 1.7 }}>
            Complex ideas compressed into stories you can carry. Each tale is a privacy primitive. Each proverb is proof you understood it.
          </p>
          <p className="mono" style={{ textAlign: "center", fontSize: "11px", color: "#475569", letterSpacing: "0.1em", marginBottom: "44px" }}>
            WHAT → HOW → WHY → EXIT → COORDINATE
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "12px", marginBottom: "40px" }}>
            {spellbooks.map(b => (
              <div key={b.id} className="card"
                onMouseEnter={() => setHoveredBook(b.id)} onMouseLeave={() => setHoveredBook(null)}
                style={{ padding: "24px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "20px" }}>{b.emoji}</span>
                  <div className="mono" style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: hoveredBook === b.id ? b.color : "#475569", transition: "color 0.3s", fontWeight: 500 }}>
                    {b.question}
                  </div>
                </div>
                <div style={{ fontSize: "15px", color: "#e2e8f0", fontWeight: 700, marginBottom: "4px" }}>{b.name}</div>
                <div className="mono" style={{ fontSize: "10px", color: "#475569", marginBottom: "10px" }}>{b.acts} {b.unit}</div>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", fontSize: "14px", color: "#475569", fontStyle: "italic" }}>
            "The mage's spell, once spoken, becomes the village weather."
          </p>
        </section>

        {/* ═══ YOUR PATH ═══ */}
        <section style={{ padding: "80px 24px 100px", maxWidth: "760px", margin: "0 auto" }}>
          <div className="divider" style={{ marginBottom: "80px" }} />
          <div className="slabel">Your Path</div>

          <h2 className="heading" style={{ fontSize: "clamp(22px,4vw,32px)", textAlign: "center", color: "#e2e8f0", marginBottom: "10px" }}>
            Read. Reflect. Inscribe. Evolve.
          </h2>
          <p style={{ textAlign: "center", fontSize: "15px", color: "#64748b", maxWidth: "520px", margin: "0 auto 52px", lineHeight: 1.7 }}>
            Go through the stories at your own pace. When meaning clicks, inscribe it — a proverb and a chosen spell. That inscription becomes a node in your agent's soul graph.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "2px" }}>
            {journeySteps.map((s, i) => (
              <div key={s.num} className="step" style={{ padding: "24px 20px" }}>
                <div className="mono" style={{ fontSize: "10px", color: "#334155", letterSpacing: "0.15em", marginBottom: "10px", fontWeight: 500 }}>{s.num}</div>
                <div style={{ fontSize: "20px", marginBottom: "10px" }}>{s.icon}</div>
                <div style={{ fontSize: "15px", color: "#e2e8f0", fontWeight: 700, marginBottom: "6px" }}>{s.label}</div>
                <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5 }}>{s.detail}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ ARCHITECTURE ═══ */}
        <section style={{ padding: "80px 24px 100px", maxWidth: "720px", margin: "0 auto" }}>
          <div className="divider" style={{ marginBottom: "80px" }} />
          <div className="slabel">The Architecture</div>

          <h2 className="heading" style={{ fontSize: "clamp(22px,4vw,32px)", textAlign: "center", color: "#e2e8f0", marginBottom: "10px" }}>
            Your spells become your agent's soul
          </h2>
          <p style={{ textAlign: "center", fontSize: "15px", color: "#64748b", maxWidth: "520px", margin: "0 auto 44px", lineHeight: 1.7 }}>
            Each inscription — proverb + spell — adds a node to your spell graph. Connected nodes form constellations. Constellations become skills. The more you understand, the more powerful your agents become.
          </p>

          {/* Graph convergence */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
            <div style={{ textAlign: "center", minWidth: "120px" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>📖</div>
              <div className="mono" style={{ fontSize: "11px", color: "#6366f1", letterSpacing: "0.06em", fontWeight: 500 }}>knowledge graph</div>
              <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>(what you know)</div>
            </div>
            <div style={{ fontSize: "20px", color: "#334155", fontWeight: 800 }}>+</div>
            <div style={{ textAlign: "center", minWidth: "120px" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>🤝</div>
              <div className="mono" style={{ fontSize: "11px", color: "#6366f1", letterSpacing: "0.06em", fontWeight: 500 }}>promise graph</div>
              <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>(what you commit)</div>
            </div>
            <div style={{ fontSize: "20px", color: "#334155", fontWeight: 800 }}>=</div>
            <div style={{ textAlign: "center", minWidth: "120px" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>🐉</div>
              <div className="mono" style={{ fontSize: "11px", color: "#6366f1", letterSpacing: "0.06em", fontWeight: 500 }}>trust graph</div>
              <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>(what you've earned)</div>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#64748b", maxWidth: "520px", margin: "0 auto 52px", lineHeight: 1.7 }}>
            Your knowledge graph records what you've learned. Your promise graph records what you've committed to through proverbs and inscriptions. Where they overlap, a trust graph emerges — and that trust graph is what gives your agents their soul.
          </p>

          {/* Constellations */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "24px", flexWrap: "wrap", marginBottom: "52px" }}>
            <SpellConstellation label="privacy primitives"
              nodes={[
                { x: 40, y: 15, r: 4, active: true }, { x: 15, y: 45, r: 3, active: true },
                { x: 65, y: 45, r: 3, active: true }, { x: 30, y: 70, r: 2, active: false },
                { x: 55, y: 65, r: 2, active: false },
              ]}
              connections={[[0,1],[0,2],[1,3],[2,4],[1,2]]} />
            <svg width="28" height="20" viewBox="0 0 28 20"><line x1="2" y1="10" x2="22" y2="10" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3"/><polygon points="22,10 18,7 18,13" fill="#334155"/></svg>
            <SpellConstellation label="delegation skills"
              nodes={[
                { x: 25, y: 20, r: 3, active: true }, { x: 55, y: 15, r: 4, active: true },
                { x: 40, y: 45, r: 3, active: true }, { x: 15, y: 60, r: 2, active: true },
                { x: 60, y: 55, r: 2, active: false }, { x: 40, y: 72, r: 2, active: false },
              ]}
              connections={[[0,1],[0,2],[1,2],[2,3],[2,4],[3,5]]} />
            <svg width="28" height="20" viewBox="0 0 28 20"><line x1="2" y1="10" x2="22" y2="10" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3"/><polygon points="22,10 18,7 18,13" fill="#334155"/></svg>
            <SpellConstellation label="sovereign agent"
              nodes={[
                { x: 40, y: 8, r: 5, active: true },
                { x: 12, y: 68, r: 4, active: true },
                { x: 68, y: 68, r: 4, active: true },
                { x: 40, y: 42, r: 4, active: true },
              ]}
              connections={[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]} />
          </div>

          {/* Armor */}
          <div style={{ display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
            {[
              { icon: "🗡️", label: "Blade", desc: "first inscription" },
              { icon: "🛡️", label: "Light", desc: "chronicled constellations" },
              { icon: "⚔️", label: "Heavy", desc: "guild recognition" },
              { icon: "🐉", label: "Dragon", desc: "sovereign agent" },
            ].map(t => (
              <div key={t.label} style={{ textAlign: "center", minWidth: "72px" }}>
                <div style={{ fontSize: "20px", marginBottom: "6px" }}>{t.icon}</div>
                <div style={{ fontSize: "12px", color: "#cbd5e1", fontWeight: 600 }}>{t.label}</div>
                <div style={{ fontSize: "10px", color: "#475569" }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ POOLS ═══ */}
        <section style={{ padding: "80px 24px 100px", maxWidth: "760px", margin: "0 auto" }}>
          <div className="divider" style={{ marginBottom: "80px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
            {[
              { e: "🔐", n: "Privacy Pools", d: "Private transactions with zero-knowledge proofs" },
              { e: "🧠", n: "Intel Pools", d: "Knowledge sharing with privacy guarantees" },
              { e: "📊", n: "Data Pools", d: "Decentralized storage you actually own" },
            ].map(p => (
              <div key={p.n} style={{ padding: "24px", border: "1px solid #1e293b", borderRadius: "12px", background: "rgba(15,23,42,0.6)" }}>
                <div style={{ fontSize: "20px", marginBottom: "12px" }}>{p.e}</div>
                <div style={{ fontSize: "15px", color: "#e2e8f0", fontWeight: 700, marginBottom: "6px" }}>{p.n}</div>
                <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5 }}>{p.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ JOIN US BANNER ═══ */}
        <section style={{ padding: "40px 24px 80px", maxWidth: "860px", margin: "0 auto" }}>
          <div style={{
            borderRadius: "16px", padding: "60px 32px", textAlign: "center",
            background: "linear-gradient(135deg, #1a2e6b 0%, #3b1f6b 100%)",
            border: "1px solid #2e1f6b", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", left: "8%", top: "50%", width: "140px", height: "140px", background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent)", transform: "translateY(-50%)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: "8%", top: "50%", width: "140px", height: "140px", background: "radial-gradient(circle, rgba(168,85,247,0.15), transparent)", transform: "translateY(-50%)", borderRadius: "50%", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 className="heading" style={{ fontSize: "clamp(24px,4.5vw,36px)", color: "#f1f5f9", marginBottom: "12px" }}>
                join us?
              </h2>
              <p style={{ fontSize: "15px", color: "#94a3b8", marginBottom: "4px" }}>Create your:</p>
              <div style={{ minHeight: "40px", marginBottom: "32px" }}>
                <span style={{
                  fontSize: "clamp(20px,3.5vw,28px)", color: "#e2e8f0", fontWeight: 700,
                  opacity: joinFade ? 1 : 0, transform: joinFade ? "translateY(0)" : "translateY(6px)",
                  transition: "all 0.4s ease", display: "inline-block",
                }}>
                  {joinCarousel[joinIdx]}
                </span>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <button className="btn btn-p">⚔️ Ceremony</button>
                <button className="btn btn-s">📖 Story</button>
                <button className="btn btn-s">🧙 Spellbook</button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section style={{ padding: "60px 24px 80px", textAlign: "center" }}>
          <div className="divider" style={{ marginBottom: "60px" }} />

          <p style={{ fontSize: "14px", color: "#475569", fontStyle: "italic", marginBottom: "14px" }}>
            just another adventure
          </p>
          <h2 className="subheading" style={{ fontSize: "clamp(17px,2.5vw,24px)", color: "#cbd5e1", marginBottom: "6px" }}>
            Privacy is Value, Decentralised AI is the Key.
          </h2>
          <h2 className="heading" style={{ fontSize: "clamp(20px,3.5vw,30px)", color: "#6366f1", marginBottom: "36px" }}>
            Take back the 7th Capital.
          </h2>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "52px" }}>
            <a href="https://github.com/mitchuski/agentprivacy-spellbook" target="_blank" rel="noopener noreferrer" className="btn btn-p">📄 Living Documentation</a>
            <a href="https://sync.soulbis.com" target="_blank" rel="noopener noreferrer" className="btn btn-s">🔬 Research Letters</a>
          </div>

          {/* Master inscription */}
          <div className="mono" style={{ fontSize: "16px", color: "#334155", letterSpacing: "0.15em" }}>
            (⚔️⊥⿻⊥🧙)
          </div>
          <div className="mono" style={{ fontSize: "10px", color: "#1e293b", letterSpacing: "0.08em", marginTop: "8px" }}>
            casting spells in the gap
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{ padding: "40px 24px", borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ fontSize: "13px", color: "#334155" }}>
            © 2025 agentprivacy just another ⚔️ 🧙 🤝
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px" }}>
            {[
              { label: "living documentation", href: "https://github.com/mitchuski/agentprivacy-spellbook" },
              { label: "privacymage: x", href: "https://x.com/privacymage" },
              { label: "talk with soulbae the first mage", href: "https://t.me/soulbae_the_bot" },
              { label: "agentprivacy-tg", href: "https://t.me/agentprivacyai" },
              { label: "soulbis research", href: "#" },
              { label: "private ai: agent kyra", href: "https://intel.agentkyra.ai" },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#334155", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#6366f1"}
                onMouseLeave={e => e.target.style.color = "#334155"}>
                {l.label}
              </a>
            ))}
          </div>
        </footer>

      </div>
    </div>
  );
}
