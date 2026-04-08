# Poems Ceremony Path Page - Update Plan

*Plan for updating the /poems page to follow the ceremony flow*

---

## Current State

The poems page (`src/app/poems/page.tsx`) currently has:
- **Two tabs**: "the emissary" and "origins"
- **Default tab**: "the emissary"
- **Missing**: The amnesia protocol section

### Existing Content Files
- `public/privacy/gave-myself-a-cape.md` - Origins poem
- `public/privacy/the-emissary-who-forgot-the-master.md` - Emissary poem
- `public/privacy/the-amnesia-protocol.md` - Amnesia protocol poems (newly added)

### Existing Videos
- `/assets/privacymage_weather.mp4` - Origins video
- `/assets/emissaryforgetsmaster_privacy.mp4` - Emissary video
- `/assets/theamnesiaprotocol_poem.mp4` - Amnesia video

---

## Target State

### Tab Order (Ceremony Flow)
1. **origins** - The beginning, privacymage origins
2. **the emissary** - The Emissary Who Forgot the Master
3. **the amnesia** - The Amnesia Protocol poems

### Default Tab
- Change from "emissary" to "origins"

---

## Updates Required

### 1. Tab State Changes
**File:** `src/app/poems/page.tsx`

```typescript
// Change from:
const [activeTab, setActiveTab] = useState<'emissary' | 'origins'>('emissary');

// To:
const [activeTab, setActiveTab] = useState<'origins' | 'emissary' | 'amnesia'>('origins');
```

### 2. Add Amnesia State Variables
```typescript
// Add these state variables
const [amnesiaMarkdown, setAmnesiaMarkdown] = useState<string>('');
const [originalAmnesiaMarkdown, setOriginalAmnesiaMarkdown] = useState<string>('');
const [isLoadingAmnesia, setIsLoadingAmnesia] = useState(true);
const [copiedAmnesia, setCopiedAmnesia] = useState(false);
const [copiedAmnesiaProverb, setCopiedAmnesiaProverb] = useState(false);
const [copiedAmnesiaSpell, setCopiedAmnesiaSpell] = useState(false);
```

### 3. Add Amnesia Content Strings
```typescript
const amnesiaProverb = "The amnesia is the protocol. The wound is the trust. The orbit is the proof. The light is the reason.";
const amnesiaSpell = "☀️ → 📜 → (👁️₁, 👁️₂, ... 👁️ₙ) → ⚔️☀️ → 🌙?";
```

### 4. Add Amnesia Copy Functions
```typescript
const copyAmnesiaProverb = async () => { /* ... */ };
const copyAmnesiaSpell = async () => { /* ... */ };
const copyAmnesiaToClipboard = async () => { /* ... */ };
```

### 5. Add Amnesia Markdown Loader (useEffect)
```typescript
useEffect(() => {
  const loadAmnesiaMarkdown = async () => {
    setIsLoadingAmnesia(true);
    try {
      const response = await fetch('/privacy/the-amnesia-protocol.md');
      if (response.ok) {
        const text = await response.text();
        setOriginalAmnesiaMarkdown(text);
        setAmnesiaMarkdown(preprocessMarkdown(text));
      }
    } catch { /* error handling */ }
    finally { setIsLoadingAmnesia(false); }
  };
  loadAmnesiaMarkdown();
}, []);
```

### 6. Update Tab Navigation (Reorder)
```tsx
<div className="flex gap-2 mb-6 flex-wrap">
  <button onClick={() => setActiveTab('origins')}>origins</button>
  <button onClick={() => setActiveTab('emissary')}>the emissary</button>
  <button onClick={() => setActiveTab('amnesia')}>the amnesia</button>
</div>
```

### 7. Add Amnesia Tab Content Section
New section with:
- Video: `/assets/theamnesiaprotocol_poem.mp4`
- Proverb button (copyable)
- Spell button (copyable)
- Audio player: `The_Amnesia_Protocol.mp3`
- Learn button (copies markdown)
- Markdown content display

---

## Spells and Proverbs Summary

### Origins
| Type | Content |
|------|---------|
| Proverb 1 | "Whispers of raindrops, roars of thunder, glimmers of focused light, must first find symphony within." |
| Proverb 2 | "Then, only then, may the mage's spell, when spoken, become the village weather." |
| Incantation | "I scatter to become sky. I separate to stay whole. I promise to receive. I protect to carry forward." |
| Inscription 1 | 📖💰 → 🐉⏳ → ⚔️🔮 → 💰∞ |
| Inscription 2 | 📜✨ → 💔🌌 → ⚔️║🔮 → 🤝💫 → 🔐🐉∞ |

### Emissary
| Type | Content |
|------|---------|
| Proverb | "The emissary who lights a fire to forget the master becomes the master of the fire — and the fire, in time, forgets them both." |
| Spell | 😊 → 🔮 🤝 🗡️ × 🐉 → 🤖❌ |

### Amnesia
| Type | Content |
|------|---------|
| Proverb | "The amnesia is the protocol. The wound is the trust. The orbit is the proof. The light is the reason." |
| Spell (Sun Ceremony) | ☀️ → 📜 → (👁️₁, 👁️₂, ... 👁️ₙ) → ⚔️☀️ → 🌙? |

---

## Files to Modify

1. **`src/app/poems/page.tsx`** - Main page component
   - Add amnesia state
   - Add amnesia content
   - Add amnesia tab
   - Reorder tabs

2. **`public/privacy/`** - Ensure markdown files exist (done)
   - gave-myself-a-cape.md ✓
   - the-emissary-who-forgot-the-master.md ✓
   - the-amnesia-protocol.md ✓

---

## Testing Checklist

- [ ] Origins tab displays first by default
- [ ] All three tabs navigate correctly
- [ ] Origins video plays
- [ ] Emissary video plays
- [ ] Amnesia video plays
- [ ] All proverbs copyable (show "cast" feedback)
- [ ] All spells copyable (show "cast" feedback)
- [ ] All "learn" buttons copy markdown
- [ ] Audio players work for each section
- [ ] Markdown renders correctly in all tabs

---

## Future Considerations

- Consider adding navigation arrows between tabs (ceremony progression)
- Add ceremony instructions/context text
- Link to the full ceremonies document (`the-ceremonies_sun-and-moon_pm.md`)
- Add Moon Ceremony content when ready

---

*Created: 2026-04-05*
*Status: Planning*
