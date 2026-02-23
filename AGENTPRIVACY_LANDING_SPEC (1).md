# AgentPrivacy Landing Page — Implementation Spec

**Target:** `src/app/page.tsx` (Next.js App Router, static export)
**Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion
**Design language:** Dark constellation aesthetic. Bold geometric sans (Plus Jakarta Sans) with JetBrains Mono for protocol. Deep navy background with indigo accent (#6366f1). Generous negative space. No generic AI aesthetics.

---

## Design Tokens

```
Colors (matching existing site):
  --bg:              #0f1129       (deep navy, NOT near-black)
  --bg-card:         rgba(15, 23, 42, 0.6)
  --bg-card-hover:   rgba(30, 41, 59, 0.4)
  --bg-accent-box:   rgba(99, 102, 241, 0.04)
  --text-primary:    #e2e8f0
  --text-secondary:  #cbd5e1
  --text-muted:      #94a3b8
  --text-dim:        #64748b
  --text-ghost:      #475569
  --text-faint:      #334155
  --accent:          #6366f1       (indigo, matching existing site)
  --accent-light:    #818cf8
  --accent-pale:     #c7d2fe
  --border:          #1e293b
  --border-card:     #1e3a5f       (teal-tinted, matching existing agent cards)
  --border-hover:    #334155
  --divider:         linear-gradient(90deg, transparent, #1e293b, transparent)

Fonts:
  --font-body:       'Plus Jakarta Sans', 'Inter', system-ui   → all text, headings, buttons
  --font-mono:       'JetBrains Mono', monospace               → labels, nav, protocol text
  NOTE: NO serif font. Headings use the same sans-serif with font-weight 800 and tight letter-spacing (-0.02em).

Radius:
  Cards: 12px
  Buttons: 8px
  Accent boxes: 12px
  Join banner: 16px

Weight scale:
  Body: 400
  Labels/nav: 500
  Subheadings: 700
  Headings: 800 (with letter-spacing: -0.02em)
```

---

## Background Layer

Fixed position star field. ~50 small circles (`r: 0.3–1.8px`, fill: `--accent`, opacity: `0.05–0.4`). Each star has a slow pulse animation with randomized duration (3–9s) and delay. Subtle. Not overwhelming.

---

## Section 1: Navigation Bar

Sticky top. One row. Horizontal scroll on mobile.

```
[agentprivacy]  soulbis  story  zero  canon  society  plural  proverbs  evoke  privacy  mage  promise  spells    [🧙]
```

- "agentprivacy" in body font, 16px, font-weight 800, color --accent, --text-primary
- All nav links in JetBrains Mono, 11px, --text-dim, hover → --accent
- Mage emoji right-aligned
- Border bottom: 1px solid rgba(255,255,255,0.04)

---

## Section 2: Hero (full viewport height)

Centered vertically and horizontally. Text-align center.

### Content (top to bottom):

**Title:**
```
agentprivacy
```
Body font, clamp(36px, 6vw, 64px), font-weight 800, letter-spacing -0.02em, --text-primary. Fade-up animation 0.2s delay.

**Subtitle:**
```
privacy-first personal payment and knowledge for AI agents
```
Body font, clamp(15px, 2vw, 19px), --text-muted, max-width 480px. Fade-up 0.4s delay.

**Three CTA buttons** (horizontal row, wrap on mobile, fade-up 0.6s delay):

| Button | Style | Icon |
|--------|-------|------|
| Ceremony | Primary (violet bg, violet border) | ⚔️ |
| Story | Secondary (transparent, subtle border) | 📖 |
| Spellbook | Secondary | 🧙 |

Primary button: `background: rgba(139,92,246,0.25)`, `border: 1px solid rgba(139,92,246,0.5)`, color: --accent-bright. Hover: brighter bg + subtle box-shadow glow.

Secondary button: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.1)`, color: --text-muted. Hover: slightly brighter.

Both: JetBrains Mono 12px, letter-spacing 0.08em, padding 12px 28px, border-radius 6px.

### Carousel: "i'm just another" (fade-up 0.8s delay)

Fixed text above rotating line. Interval: ~3.2 seconds. Fade transition (opacity + translateY 8px, 400ms ease).

**Fixed line:**
```
i'm just another
```
Body font, clamp(20px, 3.5vw, 30px), font-weight 700, --text-secondary.

**Rotating lines (cycle through):**

| Role | Emoji | Text |
|------|-------|------|
| mage | 🧙 | knowledge is my spellbook. |
| swordsman | ⚔️ | privacy is my blade. |
| seeker | 🌌 | the story is my path. |
| builder | 🔧 | the protocol is my craft. |
| sovereign | 🐉 | the 7th capital is my birthright. |

Role in --text-dim, text in --text-muted. Body font, clamp(16px, 2.5vw, 22px).

**Payoff line** (fades with carousel):
```
and so are you. 🤝
```
--accent-violet, clamp(14px, 2vw, 17px).

**Scroll hint** at absolute bottom (slow vertical drift animation):
```
↓
```
JetBrains Mono, 9px, --text-ghost.

---

## Section 3: The Thesis

Max-width 720px, centered. Padding: 100px vertical.

Horizontal divider line at top (--divider gradient, max-width 720px).

**Section label:**
```
The Problem
```
JetBrains Mono, 10px, --accent, letter-spacing 0.2em, uppercase, centered.

**Heading:**
```
AI agents will act on your behalf.
Who keeps the information they generate?
What builds in the gap between them?
```
Body font, clamp(22px, 4vw, 34px), font-weight 700, letter-spacing -0.01em, --text-primary. Second line in --accent (#6366f1). Third line in --accent-light (#818cf8). Centered.

**Body paragraphs** (Body font, 15px, --text-muted, line-height 1.8, centered, max-width 580px):

Paragraph 1:
```
A single agent that knows both your privacy boundaries and your delegation preferences can reconstruct your complete behavioral model. That's not a policy problem — it's an architecture problem.
```

Paragraph 2:
```
We protect ourselves with architecture, not retrofitted terms of service. Privacy by default, enforced by mathematics. The Swordsman guards your boundaries. The Mage projects through them. The gap between is irreducible. That gap is where you live.
```
("you" in --accent-bright)

### Dual Agent Visual (centered row)

```
  ⚔️              ⿻              🔮
                ║ gap ║
 Swordsman       sovereignty          Mage
cuts boundaries                  projects through
```

- Emojis: 24px
- Agent names: JetBrains Mono, 10px, --text-muted
- Descriptors: 9px, --text-ghost
- Gap: JetBrains Mono 9px, --accent at 0.5 opacity, with a thin gradient line and "sovereignty" label beneath

### Value Box

Rounded card, --bg-accent-box background, --border-accent border, 28px padding, max-width 580px centered. Slow glow-pulse animation on box-shadow.

**Label:**
```
Why this creates value
```
JetBrains Mono, 10px, --accent, uppercase.

**Copy:**
```
Every boundary the Swordsman enforces makes the Mage's delegation more trustworthy. Every spell cast within those bounds proves the architecture works. Your agents improve by proving they respect the gap. That proof is the value. The 7th capital compounds.
```
("is" in italic --accent)

---

## Section 4: Features (Three Agents)

Max-width 860px. Divider at top.

**Section label:**
```
Features
```

**Subtitle:**
```
cypherpunk systems, protocols, standards, apps and primitives for private sovereign AI agents.
```
14px, --text-dim, centered.

### Three agent cards (grid, 3 columns, min 240px per card, gap 16px)

Each card: --border-accent border, 8px radius, 28px 24px padding, --bg-accent-box background. Hover: brighter border + subtle shadow.

| Emoji | Name | Description |
|-------|------|-------------|
| ⚔️ | Swordsman Agent | Privacy-preserving agent focused on slashing cookies, the autonomous negotiation of privacy terms, standards and protocols. |
| 🤝 | promises | Privacy negotiation. Maintain sovereignty over your data. MyTerms IEEE 7012 at the boundary. |
| 🧙 | Mage Agent | Knowledge and information privacy agent for managing storage, identity, confidential compute, ZK credential composition. |

Card structure: emoji (24px) → name (15px, --text-primary, font-weight 500) → description (12px, --text-dim, line-height 1.6).

### Three-line summary (centered column, 13px, --text-muted)

```
⚔️ Protecting privacy, collecting value, experience and knowledge along the way.
🧙 Share loot and knowledge in privacy pools with allies.
🤝 Use the results to cast more powerful spells or buy more powerful gear.
```

---

## Section 5: Five Spellbooks

Max-width 900px. Divider at top.

**Section label:**
```
The Adventure
```

**Heading:**
```
Hundreds of spellbooks, thousands of spells.
A city of mages. An army of swordsmen.
```
Body font, clamp(22px, 4vw, 34px), font-weight 800, letter-spacing -0.02em, centered.

**Subtitle:**
```
Complex ideas compressed into stories you can carry.
Each tale is a privacy primitive. Each proverb is proof you understood it.
```
15px, --text-dim, centered, max-width 500px.

**Journey label:**
```
WHAT → HOW → WHY → EXIT → COORDINATE
```
JetBrains Mono, 10px, --text-ghost, letter-spacing 0.1em, centered.

### Spellbook card grid (5 columns, min 155px, gap 10px)

Each card: --border border, 8px radius, --bg-card background, 22px 18px padding. Hover: --border-hover, translateY(-2px), subtle shadow, --bg-card-hover.

**Spellbook data:**

| ID | Emoji | Question | Name | Count | Unit | Description | Accent Color |
|----|-------|----------|------|-------|------|-------------|-------------|
| story | 📖 | WHAT | First Person | 23 | acts | Your sovereignty story. The journey of Soulbis and Soulbae through Drake to Dragon pattern space. | #f59e0b |
| zero | 🔮 | HOW | Zero Knowledge | 30 | tales | Cryptographic magic made human-readable. | #8b5cf6 |
| canon | 📜 | WHY | The Canon | 11 | chapters | Blockchain lineage. Cypherpunks to synthesis. | #06b6d4 |
| society | 🚪 | EXIT | Parallel Society | 17 | chapters | Farewell to Westphalia. Why sovereignty requires exit. | #ef4444 |
| plural | ⿻ | COORDINATE | Plurality | 30 | acts | Weyl & Tang's vision. Many in relationship, not collapse. | #10b981 |

Card layout:
- Row: emoji (18px) + question label (JetBrains Mono, 9px, uppercase, --text-ghost → accent color on hover)
- Name: body font, 15px, --text-primary, font-weight 700
- Count: JetBrains Mono, 9px, --text-ghost (e.g. "23 acts")
- Description: 11px, --text-dim, line-height 1.5

### Tagline (centered, italic)
```
"The mage's spell, once spoken, becomes the village weather."
```
13px, --text-ghost.

---

## Section 6: Your Path

Max-width 760px. Divider at top.

**Section label:**
```
Your Path
```

**Heading:**
```
Read. Reflect. Inscribe. Evolve.
```
Body font, clamp(22px, 4vw, 32px), font-weight 800, letter-spacing -0.02em, centered.

**Subtitle:**
```
Go through the stories at your own pace. When meaning clicks, inscribe it — a proverb and a chosen spell. That inscription becomes a node in your agent's soul graph.
```
13px, --text-dim, max-width 500px, centered.

### Four step cards (grid, 4 columns min 155px, gap 2px)

Each card: left border 1px --border (→ --accent at 0.3 on hover), padding 24px 18px, hover bg --bg-card-hover.

| Num | Icon | Label | Detail |
|-----|------|-------|--------|
| 01 | 📖 | Read | Choose a spellbook. Follow the tales. |
| 02 | 🌌 | Reflect | What pattern did you see? What connected? |
| 03 | ✍️ | Inscribe | Cast your proverb. Choose your spell. |
| 04 | 🐉 | Evolve | Your inscription becomes your agent's soul. |

Card layout:
- Num: JetBrains Mono, 9px, --text-ghost
- Icon: 18px
- Label: body font, 15px, --text-primary, font-weight 700
- Detail: 11px, --text-dim

---

## Section 7: Spell Graph → Agent Soul

Max-width 720px. Divider at top.

**Section label:**
```
The Architecture
```

**Heading:**
```
Your spells become your agent's soul
```
Body font, clamp(22px, 4vw, 32px), font-weight 800, letter-spacing -0.02em, centered.

**Subtitle:**
```
Each inscription — proverb + spell — adds a node to your spell graph. Connected nodes form constellations. Constellations become skills. The more you understand, the more powerful your agents become.
```
13px, --text-dim, max-width 500px, centered.

### Graph Convergence Visual

Below the subtitle, before the constellation SVGs. A simple conceptual diagram showing three graphs merging. Can be rendered as styled text/boxes or a minimal SVG.

```
  knowledge graph        promise graph          trust graph
   (what you know)    +   (what you commit)   =   (what you've earned)
       📖                     🤝                      🐉
```

Layout: three columns, centered. Each column has:
- Label: JetBrains Mono, 10px, --accent, letter-spacing 0.1em
- Parenthetical: 10px, --text-ghost
- Emoji: 20px
- Between columns: `+` and `=` in body font, 20px, font-weight 800, --text-faint

**Explanatory line** (centered beneath, 12px, --text-dim, max-width 500px):
```
Your knowledge graph records what you've learned. Your promise graph records what you've committed to through proverbs and inscriptions. Where they overlap, a trust graph emerges — and that trust graph is what gives your agents their soul.
```

### Constellation Progression Visual

Three small SVG constellation diagrams in a row with arrows between them. Each diagram is ~80x80px.

**Constellation 1: "privacy primitives"**
- 5 nodes, 5 connections, 3 nodes lit (--accent-bright), 2 dim (--text-dim)
- Triangle-ish formation

**Arrow** (dashed line + small triangle, --text-ghost)

**Constellation 2: "delegation skills"**
- 6 nodes, 6 connections, 4 nodes lit, 2 dim
- More interconnected

**Arrow**

**Constellation 3: "sovereign agent"**
- 4 nodes, 6 connections, all lit — forms a **tetrahedron** (triangle with center point, all vertices connected to each other)
- Top vertex, bottom-left, bottom-right, and center point — every node connects to every other node
- Represents the tetrahedral sovereignty architecture (Protect ⊥ Reflect ⊥ Project ⊥ Connect)

Labels beneath each: JetBrains Mono, 10px, --text-dim.

### Armor Progression (centered row, flex-wrap)

Four tiers shown horizontally:

| Icon | Label | Description |
|------|-------|-------------|
| 🗡️ | Blade | first inscription |
| 🛡️ | Light | chronicled constellations |
| ⚔️ | Heavy | guild recognition |
| 🐉 | Dragon | sovereign agent |

- Icon: 18px
- Label: JetBrains Mono, 10px, --text-muted
- Desc: 9px, --text-ghost

---

## Section 8: Pools

Max-width 760px. Divider at top. Grid, 3 columns min 200px, gap 12px.

Three pool cards (same style as agent cards but simpler):

| Emoji | Name | Description |
|-------|------|-------------|
| 🔐 | Privacy Pools | Private transactions with zero-knowledge proofs |
| 🧠 | Intel Pools | Knowledge sharing with privacy guarantees |
| 📊 | Data Pools | Decentralized storage you actually own |

Card: 22px padding, --border, 8px radius, --bg-card.

---

## Section 9: Join Us Banner

Max-width 860px. Centered. This is the existing Swordsman/Mage hero illustration repurposed as a call-to-action.

**Layout:** A wide card/banner with rounded corners (12px), split background (blue-left for Swordsman, purple-right for Mage). The existing character illustrations (Swordsman with blade on left, Mage casting on right) frame the central text.

If the illustrations are available as assets, use them. If not, use a gradient split: `linear-gradient(90deg, #1a3a6b 0%, #1a3a6b 50%, #4a2a6b 50%, #4a2a6b 100%)` as a suggestive background.

**Central text (overlaid on the banner, centered):**

```
join us?
```
Body font, clamp(24px, 4.5vw, 36px), font-weight 800, --text-primary.

```
Create your:
```
14px, --text-muted.

**Carousel within banner** (same mechanic as hero carousel, rotating through):
```
agent 🤖
spellbook 🔮
ceremony ⚔️
constellation 🌌
```
Body font, clamp(20px, 3.5vw, 28px), font-weight 700, --text-primary.

**Three buttons** (centered beneath text, within the banner):
Same Ceremony / Story / Spellbook buttons as hero section.

---

## Section 10: Final CTA

Centered. Divider at top.

**Tagline:**
```
just another adventure
```
13px, --text-ghost, italic.

**Heading (two lines):**
```
Privacy is Value, Decentralised AI is the Key.
Take back the 7th Capital.
```
Line 1: Body font, clamp(17px, 2.5vw, 24px), font-weight 700, --text-secondary.
Line 2: Body font, clamp(20px, 3.5vw, 30px), font-weight 800, --accent (#6366f1). This is the mission statement — it should land.

**Four buttons** (same styles as hero, row with wrap):

| Button | Style | Route |
|--------|-------|-------|
| 📄 Living Documentation | Primary (highlighted) | https://github.com/mitchuski/agentprivacy-spellbook (external, opens new tab) |
| 🔬 Research Letters | Secondary | https://sync.soulbis.com (external, opens new tab) |

### Footer Sigil

```
(⚔️⊥⿻⊥🧙)
casting spells in the gap
```
Master inscription `(⚔️⊥⿻⊥🧙)` in JetBrains Mono, 14px, --text-ghost. The `⊥` orthogonality symbols and `⿻` overlap glyph should render clearly — use sufficient letter-spacing (0.15em). Subtitle line in 8px, near-invisible.

---

## Section 11: Site Footer

Full-width, padding 40px 24px. Two columns on desktop (left-aligned / right-aligned), stack on mobile.

**Left column:**
```
© 2025 agentprivacy just another ⚔️ 🧙 🤝
```
Body font, 13px, --text-faint. Include small agentprivacy logo/avatar if available.

**Right column** (right-aligned, stacked lines):
```
living documentation
privacymage: x
agentprivacy-tg
soulbis research
private ai: agent kyra
```
JetBrains Mono, 11px, --text-ghost. Each line is a link:

| Label | Link |
|-------|------|
| living documentation | https://github.com/mitchuski/agentprivacy-spellbook |
| privacymage: x | https://x.com/privacymage |
| agentprivacy-tg | https://t.me/agentprivacy (or relevant TG link) |
| soulbis research | relevant soulbis link |
| private ai: agent kyra | https://intel.agentkyra.ai |

Links: --text-ghost default, --accent on hover. No underlines.

---

## Animations

| Name | Use | Spec |
|------|-----|------|
| fadeUp | Section content on load | opacity 0→1, translateY 20→0, 0.8s ease-out, staggered delays |
| starPulse | Background stars | opacity oscillates 0.1↔0.5, 3–9s ease-in-out, infinite |
| slowDrift | Scroll hint | translateY 0↔-5px, 3s ease-in-out, infinite |
| glowPulse | Value box | box-shadow oscillates subtle purple glow, 6s, infinite |
| carouselFade | "just another" text | opacity 1→0→1, translateY 0→8→0, 400ms transitions |

Intersection observer recommended for fade-up animations on scroll (sections 3–10).

---

## Responsive Breakpoints

| Breakpoint | Adjustments |
|------------|-------------|
| < 640px | Spellbook grid → 2 columns. Step cards → 2 columns. Nav horizontal-scroll. Constellation row wraps vertically. |
| < 480px | Spellbook grid → 1 column. Agent cards → 1 column. Hero buttons stack. |
| > 1024px | Full 5-column spellbook grid. Everything at max clamp sizes. |

---

## Route Links

| Element | Route |
|---------|-------|
| Ceremony button (hero) | /ceremony |
| Story button (hero) | /story |
| Spellbook button (hero) | /spellbook |
| 📄 Living Documentation (final CTA) | https://github.com/mitchuski/agentprivacy-spellbook (external) |
| 🔬 Research Letters (final CTA) | https://sync.soulbis.com (external) |
| Nav: soulbis | /soulbis |
| Nav: story | /story |
| Nav: zero | /zero |
| Nav: canon | /canon |
| Nav: society | /society |
| Nav: plural | /plural |
| Nav: proverbs | /proverbs |
| Nav: evoke | /evoke |
| Nav: privacy | /privacy |
| Nav: mage | /mage |
| Nav: promise | /promise |
| Nav: spells | /spells |
| Each spellbook card | /{id} (e.g. /story, /zero, /canon, /society, /plural) |
| Footer: living documentation | https://github.com/mitchuski/agentprivacy-spellbook |
| Footer: privacymage: x | https://x.com/privacymage |
| Footer: agentprivacy-tg | Telegram link |
| Footer: soulbis research | Soulbis link |
| Footer: private ai: agent kyra | https://intel.agentkyra.ai |

---

## Notes for Implementation

1. **No external API calls needed** — this is a fully static landing page.
2. **Carousel state** — use `useState` + `setInterval` (~3200ms). Fade out 400ms, swap index, fade in 400ms.
3. **Star field** — generate star positions once with `useRef` to avoid re-renders. Fixed position div behind all content.
4. **Constellation SVGs** — can be inline SVG components or static. No interactivity needed, just visual.
5. **Fonts** — load via Google Fonts: `Plus+Jakarta+Sans:300,400,500,600,700,800` and `JetBrains+Mono:300,400,500`.. Add to `layout.tsx` or `<Head>`.
6. **Dividers** — reusable component. Just a 1px div with the gradient background, max-width 720px, margin auto.
7. **All copy is final** — implement exactly as written above.
8. **Total inscription count** is 111 (23 + 30 + 11 + 17 + 30). Use "one hundred and eleven" in heading, "111" in footer.
