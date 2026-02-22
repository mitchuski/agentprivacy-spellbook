# Ceremony Constellation Enhancement Plan

Transform the identity ceremony into an interactive constellation-building experience where each step lights up a path with emojis chosen by the user.

## Current State

The ceremony currently has 6 steps:
1. **Welcome** - Enter swordsman display name
2. **Key Generation** - Ed25519 keypair generated in browser
3. **Privacy** - Attribution level and proverb sharing preferences
4. **Grimoires** - Select which spellbooks to engage with
5. **Agent Card** - Preview the signed identity
6. **Completion** - Download card backup, redirect to /spells

**What's working:**
- Key generation and persistence (`src/lib/ceremony/storage.ts`) - FIXED
- `saveKeys()` persists private key as hex in localStorage
- `getKeys()` retrieves keypair for signing operations
- AgentCard saved with signature

**What's missing:**
- No emoji assignments per step
- No visual constellation/path illumination
- No scroll-based ceremony flow (steps feel like a form)
- Not linked to the existing constellation marker system in `spellbook-storage.ts`

---

## Constellation Pattern (From spellbook-storage.ts)

The codebase already has `markerEmoji` support for inscribed proverbs:

```typescript
interface InscribedEntry {
  proverb: string;
  markerEmoji?: string;  // User-chosen emoji that "lights up" the path
}

function setInscribedProverb(taleId: string, proverb: string, markerEmoji?: string): void
function getInscribedMarkerEmoji(taleId: string): string | undefined
```

This same pattern should apply to ceremony steps.

---

## Proposed Ceremony Constellation Structure

### New Data Structure

```typescript
// src/lib/ceremony/constellation.ts

export interface CeremonyStep {
  id: string;
  title: string;
  description: string;
  emojiOptions: string[];        // Suggested emojis for this step
  dataKey: string;               // What info is captured (name, privacy, etc.)
  requiredForComplete: boolean;
}

export interface CeremonyConstellation {
  steps: {
    stepId: string;
    chosenEmoji: string;
    inscription: string;         // User's written input for this step
    completedAt: string;         // ISO timestamp
  }[];
  constellationPath: string;     // Combined emoji path: "🗡️→🔐→🙈→📖→⚔️→✨"
}

export const CEREMONY_STEPS: CeremonyStep[] = [
  {
    id: 'naming',
    title: 'Name Your Swordsman',
    description: 'Choose a display name for your identity',
    emojiOptions: ['🗡️', '⚔️', '🛡️', '🏹', '🗿', '🌟'],
    dataKey: 'displayName',
    requiredForComplete: true,
  },
  {
    id: 'keygen',
    title: 'Forge Your Key',
    description: 'Ed25519 keypair generated in your browser',
    emojiOptions: ['🔐', '🔑', '🗝️', '💎', '⚡', '🔮'],
    dataKey: 'publicKeyHex',
    requiredForComplete: true,
  },
  {
    id: 'privacy',
    title: 'Set Your Boundaries',
    description: 'Define how you appear when sharing',
    emojiOptions: ['🙈', '👁️', '🎭', '🌑', '🔒', '🕶️'],
    dataKey: 'privacyLevel',
    requiredForComplete: true,
  },
  {
    id: 'grimoires',
    title: 'Choose Your Grimoires',
    description: 'Select which spellbooks to study',
    emojiOptions: ['📖', '📚', '📜', '🌀', '🧙', '✨'],
    dataKey: 'selectedGrimoires',
    requiredForComplete: true,
  },
  {
    id: 'seal',
    title: 'Seal Your Identity',
    description: 'Sign your agent card with your key',
    emojiOptions: ['⚔️', '🖋️', '💫', '🔥', '🌟', '👤'],
    dataKey: 'signature',
    requiredForComplete: true,
  },
  {
    id: 'activation',
    title: 'Activation',
    description: 'Your swordsman enters the constellation',
    emojiOptions: ['✨', '🌅', '🎆', '💥', '🌟', '🚀'],
    dataKey: 'activatedAt',
    requiredForComplete: true,
  },
];
```

### Storage

```typescript
// Add to src/lib/ceremony/storage.ts

const KEYS = {
  // ... existing keys ...
  CONSTELLATION: 'ap-ceremony-constellation',
} as const;

export function saveCeremonyConstellation(constellation: CeremonyConstellation): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.CONSTELLATION, JSON.stringify(constellation));
}

export function getCeremonyConstellation(): CeremonyConstellation | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEYS.CONSTELLATION);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CeremonyConstellation;
  } catch {
    return null;
  }
}
```

---

## UI/UX Enhancement

### Visual Constellation Path

At the top of the ceremony wizard, display a horizontal or circular constellation:

```
  🗡️ ─── 🔐 ─── ○ ─── ○ ─── ○ ─── ○
  lit    lit   next  dim   dim   dim
```

- **Lit steps**: User has completed and chosen emoji
- **Next step**: Current step (pulsing/glowing)
- **Dim steps**: Not yet reached

### Step Card Design

Each step should feel like inscribing onto the constellation:

```
┌─────────────────────────────────────────────────┐
│  STEP 1: Name Your Swordsman                   │
│                                                 │
│  Your chosen marker:                            │
│  [ 🗡️ ] [ ⚔️ ] [ 🛡️ ] [ 🏹 ] [ 🗿 ] [ 🌟 ]    │
│        ↑ selected                               │
│                                                 │
│  Swordsman display name:                        │
│  ┌─────────────────────────────────────────┐   │
│  │ just another swordsman                   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Inscription (optional): What this name means   │
│  ┌─────────────────────────────────────────┐   │
│  │ A wanderer seeking sovereignty...        │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│                          [ Inscribe & Continue ]│
└─────────────────────────────────────────────────┘
```

### Scroll-Based Flow

Instead of discrete steps with "Continue" buttons, use a scroll-based flow where:

1. User scrolls down to reveal each step
2. Completing a step "lights up" its emoji in the constellation header
3. Header stays sticky at top showing progress
4. Smooth scroll to next step on completion

---

## Implementation Steps

### Phase 1: Data Layer
1. Create `src/lib/ceremony/constellation.ts` with types and step definitions
2. Add constellation storage functions to `storage.ts`
3. Create `src/lib/ceremony/emoji-options.ts` with curated emoji sets per step

### Phase 2: UI Components
1. Create `ConstellationHeader.tsx` - sticky header showing emoji path
2. Create `CeremonyStepCard.tsx` - individual step with emoji picker
3. Create `EmojiPicker.tsx` - reusable emoji selection component
4. Update `CeremonyWizard.tsx` to use scroll-based flow

### Phase 3: Integration
1. Wire constellation data to AgentCard creation
2. Store constellation alongside agent card
3. Display constellation path on completion screen
4. Show constellation in profile/spells page

### Phase 4: Polish
1. Add animations for step completion (emoji "lights up")
2. Add particle effects on inscription
3. Smooth scroll behavior
4. Mobile-optimized layout

---

## File Changes Required

### New Files
- `src/lib/ceremony/constellation.ts` - Types and step definitions
- `src/lib/ceremony/emoji-options.ts` - Curated emoji sets
- `src/components/ceremony/ConstellationHeader.tsx` - Progress header
- `src/components/ceremony/EmojiPicker.tsx` - Emoji selection UI

### Modified Files
- `src/lib/ceremony/storage.ts` - Add constellation storage
- `src/lib/ceremony/types.ts` - Add constellation to AgentCard
- `src/components/ceremony/CeremonyWizard.tsx` - Scroll-based flow
- `src/components/ceremony/WelcomeStep.tsx` - Add emoji picker
- `src/components/ceremony/KeyGenStep.tsx` - Add emoji picker
- `src/components/ceremony/PrivacyStep.tsx` - Add emoji picker
- `src/components/ceremony/GrimoireStep.tsx` - Add emoji picker
- `src/components/ceremony/AgentCardStep.tsx` - Add emoji picker
- `src/components/ceremony/CompletionStep.tsx` - Show full constellation

---

## Visual Concept: Constellation Path

The completed constellation could look like:

```
     🗡️
    /   \
   🔐    🙈
    \   /
     📖
      |
     ⚔️
      |
     ✨

"The path of just another swordsman"
```

Or as a linear path:

```
🗡️ ─ naming ─ 🔐 ─ keygen ─ 🙈 ─ privacy ─ 📖 ─ grimoires ─ ⚔️ ─ seal ─ ✨ ─ activation
```

This path becomes part of the user's identity and can be displayed:
- On their profile
- In the spells page header
- When sharing proverbs (optional)
- As part of their "swordsman card" export

---

## Connection to Existing Systems

### Spellbook Constellation
The ceremony constellation becomes the "root" of the user's path. As they study spellbooks and inscribe proverbs, each tale gets its own `markerEmoji`, extending their constellation:

```
Identity Constellation: 🗡️→🔐→🙈→📖→⚔️→✨

Story Path: 🌅(Act I)→⚡(Act IX)→🔮(Act XII)
Zero Path: 🧮(Tale 1)→🔒(Tale 7)
```

### Trust Tiers
The constellation could visually evolve with trust tier:
- **Blade**: Single path line
- **Light Armor**: Path with glow effect
- **Heavy Armor**: Path with shield borders
- **Dragon Armor**: Full constellation with connections

---

## Notes

- Keep ceremony completion time ~2-3 minutes
- Emoji picker should support custom input (not just presets)
- Inscription text per step is optional but encouraged
- The constellation path should feel personal and meaningful
- Consider accessibility: ensure emojis have alt text
