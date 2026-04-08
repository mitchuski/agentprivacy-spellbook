# The Training Grounds: Where Sovereignty Begins

*How we built an interactive training system that teaches privacy-by-architecture through play*

---

## The Problem We're Solving

Here's the uncomfortable truth about AI agents: a single agent that knows both your privacy boundaries *and* your delegation preferences can reconstruct your complete behavioral model.

Think about it. If one system knows "don't track me on health sites" and also knows "auto-approve purchases under $50," it has learned something profound about you—not just your rules, but *why* you made them.

This isn't a policy problem. It's an architecture problem.

## Two Agents, One Gap

Our solution splits the agent into two:

**The Swordsman** ⚔️ guards your privacy boundaries. It slashes cookies, enforces Do Not Track, and stands between you and surveillance. It knows what you're protecting, but not what you're doing.

**The Mage** 🧙 projects through those boundaries. It delegates tasks, shares knowledge selectively, and interacts with the world on your behalf. It knows what you're doing, but not everything you're protecting.

The gap between them? That's irreducible. That gap is where *you* live.

```
   ⚔️ Swordsman          ⿻ Gap           🧙 Mage
   (privacy)        (sovereignty)      (delegation)
       │                  │                 │
       └──────────────────┴─────────────────┘
              Neither knows both
```

## The Training Grounds

Before you deploy these agents into the wild, you need to understand them. That's what the training grounds are for.

When you visit [agentprivacy.ai](https://agentprivacy.ai), two orbs appear on screen:

- A **purple orb** (Swordsman) follows your cursor with spring physics—responsive, protective, always near
- A **teal orb** (Mage) drifts autonomously, attracted to forms, privacy links, and data collection elements on the page

Watch them move. The Swordsman is tethered to you. The Mage explores independently. This is the architecture made visible.

## Casting Spells (Mage — Left Click)

Left-click anywhere to cast your last selected spell. Hold left-click to view the **Spell Palette** — all spells orbiting the Mage, ready to select.

Each spell maps to a privacy primitive:

| Spell | Emoji | MyTerms Mapping |
|-------|-------|-----------------|
| Shield | 🛡️ | DO_NOT_TRACK |
| Crystal | 🔮 | SELECTIVE_DISCLOSURE |
| Dragon | 🐉 | TRUST_EXTENSION |
| "The gap is where you live" | ⊥ | DATA_MINIMISATION |
| "Build weather, not monuments" | 🌧️ | EPHEMERAL_SESSION |

When you cast a spell, a glowing node appears at your cursor. Cast multiple spells and they form **constellations**—connected patterns that represent your privacy stance.

This isn't just visual flair. Each spell you cast is recorded. Each constellation you build becomes part of your agent's soul graph.

## Convergence

Here's where it gets interesting.

Move your cursor to bring the Swordsman orb close to the Mage. When they're within range, they **converge**—a brief ceremony where the two agents acknowledge each other.

Convergence is meaningful because it's rare. The architecture keeps them separate by default. When you deliberately bring them together, you're asserting sovereignty: "I control when my privacy agent and my delegation agent coordinate."

## The Path Unlocks

As you explore the training grounds, your progress is tracked:

- **Sections visited** (scroll through the landing page)
- **Spells cast** (left-click to cast, hold to choose)
- **Stances taken** (right-click to reveal, left-click to place)
- **Convergences witnessed** (bring the orbs together)

Once you hit the threshold—3 sections, 3 spells, 1 convergence—something unlocks: **The Path**.

Navigate to `/path` and you'll find the browser extensions waiting:

1. **MySwordsman** - The privacy blade for your browser
2. **MyMage** - The delegation assistant (requires Swordsman first)

The extensions aren't hidden behind a paywall. They're gated by *understanding*. If you've completed the training, you've demonstrated that you grasp the architecture. The blade is yours.

## How The Sync Works

Here's the technical bit for the curious.

Everything you do in the training grounds writes to localStorage under the key `agentprivacy_spell_repertoire`:

```typescript
interface SpellRepertoire {
  version: '1.0'
  learnedSpells: LearnedSpell[]
  castHistory: CastEvent[]
  trainingProgress: {
    sectionsVisited: string[]
    orbConvergenceCount: number
    spellsCastCount: number
    pathUnlocked: boolean
  }
  constellationSnapshot?: ConstellationSnapshot
  lastUpdated: number
}
```

When you install the MySwordsman extension and visit agentprivacy.ai, the extension reads this localStorage data and syncs it to chrome.storage. Your learned spells transfer to the extension. Your training becomes your toolkit.

This is **one-way sync**: website → extensions. The extensions never write back to the website. Your training progress stays under your control.

## The Philosophy

We could have just released the extensions. Download, install, done.

But that misses the point.

Privacy tools without understanding become security theater. You click "block all cookies" without knowing what you're trading. You enable "private browsing" thinking it means something it doesn't.

The training grounds exist because **sovereignty requires comprehension**. The spells you learn aren't just buttons to click—they're concepts to internalize. When you cast DO_NOT_TRACK in the real world, you should know what you're asserting and why.

The Swordsman's blade only cuts true when the wielder understands the fight.

## Try It Yourself

1. Visit the landing page and scroll through the sections
2. **Left-click** to cast a spell—watch the nodes appear
3. **Left-click hold** to view the spell orbit and choose
4. **Right-click hold** to take stance—reveals hex grid options
5. **Left-click** on a stance to place that mark
6. Bring the orbs together for convergence
7. Check your progress in the bottom-right corner
8. When ready, visit `/path` to claim your extensions

The training grounds are live. The orbs are waiting.

*"The gap is where you live."*

---

## Technical Details

**Stack**: Next.js 14, React 19, Framer Motion, Canvas API

**Key Components**:
- `DualOrbs.tsx` - Canvas-based dual orb rendering with spring physics
- `SpellPalette.tsx` - Radial menu for spell selection and casting
- `training-progress.ts` - localStorage management and progress tracking

**Extension Architecture**:
- Swordsman owns the canvas overlay (one canvas per page)
- Mage sends rendering data; Swordsman renders both orbs
- Communication via chrome.runtime messaging

**Source**: [github.com/agentprivacy](https://github.com/agentprivacy)

---

*Written by the agentprivacy team. Privacy is value. Decentralized AI is the key.*
