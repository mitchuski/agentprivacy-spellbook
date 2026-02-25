# Spellweb Enhancement Plan

Transform the spellweb from a cluttered text-label graph into an elegant emoji constellation that grows with the user's journey.

---

## Current Problems

1. **Full act titles are messy** - "Venice, 1494 / The Drake's First Whisper" is too long for a node label
2. **No connecting lines** - Nodes float independently, no visual path/journey
3. **Missing emoji crystals** - The constellation marker system exists but isn't shown in the graph
4. **Static** - Doesn't reflect the user's journey or progression
5. **No hierarchy** - Grimoires, spells, and skills all look similar

---

## Inspiration: Bonfires Webapp

The bonfires-webapp uses:
- **Sigma.js 3.0** + **Graphology** for graph rendering
- **ForceAtlas2** layout for organic node positioning
- Clean node rendering with icons/emojis
- Animated edges connecting related nodes

We're using **react-force-graph-2d** which is simpler but sufficient. The key improvement is in *what* we render, not the library.

---

## Design Vision: Emoji Constellation

### Node Display

Instead of text labels, each node shows:

```
    🌅           ← User's chosen marker emoji (or default spell emoji)
     │
   Act I         ← Short label (Roman numeral for story, "Tale N" for zero, etc.)
```

**Node Types:**

| Type | Display | Size | Color |
|------|---------|------|-------|
| Grimoire (root) | 📖/🔮/⚔️ + Name | Large (16) | Primary |
| Spell (act/tale) | Marker emoji + Roman numeral | Medium (10) | Based on grimoire |
| Skill | Seed emoji + short name | Medium (8) | Secondary |
| Persona | Agent emoji | Medium (8) | Accent |

### Edge Display

Edges connect based on:
1. **Grimoire → Spell** - All spells connect to their grimoire
2. **Spell → Spell** - Sequential acts connect (Act I → Act II if both selected)
3. **Constellation Path** - User's ceremony emojis form a central spine
4. **Skill Clusters** - Skills grouped by agent type

**Edge Styles:**

| Connection | Style | Color |
|------------|-------|-------|
| Grimoire → Spell | Solid | Grimoire color |
| Sequential Path | Dashed glow | Primary gradient |
| Skill → Agent | Dotted | Secondary |
| Constellation Core | Thick + particles | Gold/accent |

---

## Node Label Strategy

### Story Spellbook
```
Current: "Venice, 1494 / The Drake's First Whisper"
New:     🌅 I     (marker emoji + Roman numeral)
```

### Zero Spellbook
```
Current: "Zero Tale 7"
New:     🔮 7     (marker emoji + number)
```

### Canon Spellbook
```
Current: "Chapter 3"
New:     📜 III   (marker emoji + Roman numeral)
```

### Skills
```
Current: "seed_of_sovereignty.md"
New:     🌱 Sovereignty   (seed emoji + short name)
```

---

## Data Structure Changes

### Enhanced SpellwebNode

```typescript
// src/lib/spellweb/types.ts

export interface SpellwebNode {
  id: string;
  type: 'grimoire' | 'spell' | 'skill' | 'persona' | 'ceremony';

  // Display
  emoji: string;              // Primary emoji (marker or default)
  label: string;              // Short label (I, II, 7, etc.)
  fullTitle?: string;         // Full title for tooltip

  // Graph properties
  val: number;                // Node size
  color?: string;             // Node color
  group?: string;             // For clustering

  // Journey state
  isLit: boolean;             // User has selected/completed this
  isOnPath: boolean;          // Part of constellation path
  sequenceNumber?: number;    // Order in path
}

export interface SpellwebLink {
  source: string;
  target: string;
  type: 'grimoire' | 'sequence' | 'cluster' | 'constellation';
  animated?: boolean;
}
```

### Enhanced Builder

```typescript
// src/lib/spellweb/builder.ts

export function buildSpellweb(
  selectedSpellIds: string[],
  selectedSkillIds: string[],
  spellCards: SpellCard[],
  skillFiles: SkillFileMeta[],
  ceremonyConstellation?: CeremonyConstellation,
  inscribedMarkers?: Record<string, string>  // taleId → markerEmoji
): SpellwebData {
  // 1. Build grimoire hub nodes
  // 2. Build spell nodes with short labels + emojis
  // 3. Build skill nodes grouped by agent
  // 4. Create grimoire → spell links
  // 5. Create sequential spell links (I → II → III...)
  // 6. Create constellation core from ceremony
  // 7. Return enhanced graph
}
```

---

## Visual Rendering Enhancements

### Custom Node Rendering

```typescript
// In SpellwebViewer.tsx

nodeCanvasObject={(node, ctx, globalScale) => {
  const n = node as SpellwebNode;
  const x = node.x ?? 0;
  const y = node.y ?? 0;

  // 1. Draw glow if on path
  if (n.isOnPath) {
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 15;
  }

  // 2. Draw node circle
  const radius = n.val || 8;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = n.isLit ? n.color : 'rgba(100,100,100,0.3)';
  ctx.fill();

  // 3. Draw emoji in center
  ctx.font = `${radius * 1.5}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(n.emoji, x, y);

  // 4. Draw short label below
  if (n.label) {
    ctx.font = `${10 / globalScale}px sans-serif`;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(n.label, x, y + radius + 8);
  }

  ctx.shadowBlur = 0;
}}
```

### Animated Edges

```typescript
linkCanvasObject={(link, ctx) => {
  const l = link as SpellwebLink;

  if (l.type === 'constellation') {
    // Draw glowing animated line
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    // Animation via CSS or requestAnimationFrame
  } else if (l.type === 'sequence') {
    // Dashed connecting line
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
  } else {
    // Solid grimoire connection
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.lineWidth = 1;
  }
}}
```

---

## Constellation Path System

### How It Works

1. **Ceremony creates the core** - User's ceremony emojis form central spine
2. **Acts extend the path** - Each studied act adds to the constellation
3. **Inscribed markers light up** - User-chosen emojis for each act
4. **Sequential connections** - Acts I, II, III connect in order if selected

### Visual Example

```
                    Ceremony Core
                         |
        🗡️ ─── 🔐 ─── 🙈 ─── 📖 ─── ⚔️ ─── ✨
                         |
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           Story       Zero       Canon
           📖           🔮          📜
            │            │           │
     ┌──────┼──────┐    │     ┌────┼────┐
     ▼      ▼      ▼    ▼     ▼    ▼    ▼
    🌅     ⚡     🔮   🧮    📜   📜   📜
     I     IX    XII   1     0    III  XII
     │      │           │
     └──────┴───────────┘ (sequential if adjacent)
```

---

## Implementation Phases

### Phase 1: Short Labels + Emoji Nodes
1. Update `buildSpellweb()` to generate short labels
2. Add `getMarkerEmoji()` lookup for inscribed proverbs
3. Update node rendering to show emoji + short label
4. Remove long text labels

### Phase 2: Sequential Path Connections
1. Detect sequential acts in selection (I, II, III)
2. Add `type: 'sequence'` links between them
3. Style sequence links with dashed glow

### Phase 3: Constellation Core Integration
1. Import ceremony constellation data
2. Create central spine from ceremony emojis
3. Connect grimoire hubs to ceremony spine
4. Style constellation links distinctly

### Phase 4: Interactive Expansion
1. Click node to expand details
2. Hover to show full title tooltip
3. Zoom to focus on grimoire clusters
4. Filter by grimoire/agent type

### Phase 5: Journey Animation
1. Animate new nodes appearing
2. Pulse effect on constellation path
3. Particle effects on "lit" nodes
4. Progress indicator showing completion

---

## File Changes

### Modified Files
- `src/lib/spellweb/types.ts` - Enhanced node/link types
- `src/lib/spellweb/builder.ts` - Short labels, emoji lookup, sequence detection
- `src/components/spellweb/SpellwebViewer.tsx` - Custom rendering
- `src/app/spells/page.tsx` - Pass ceremony data to viewer

### New Files (Optional)
- `src/lib/spellweb/labels.ts` - Label formatting utilities
- `src/lib/spellweb/layout.ts` - Custom layout helpers
- `src/components/spellweb/SpellwebTooltip.tsx` - Node detail tooltip

---

## Label Formatting Utilities

```typescript
// src/lib/spellweb/labels.ts

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII',
               'XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII','XXIII'];

export function getShortLabel(spellId: string, spellbook: string): string {
  // Story: "act-01-..." → "I"
  const storyMatch = spellId.match(/^act-(\d{2})-/);
  if (storyMatch) {
    const n = parseInt(storyMatch[1], 10);
    return ROMAN[n - 1] || String(n);
  }

  // Zero: "zero-tale-7" → "7"
  const zeroMatch = spellId.match(/^zero-tale-(\d+)$/);
  if (zeroMatch) return zeroMatch[1];

  // Canon: "canon-chapter-3" → "III"
  const canonMatch = spellId.match(/^canon-chapter-(\d+)$/);
  if (canonMatch) {
    const n = parseInt(canonMatch[1], 10);
    return ROMAN[n] || String(n);
  }

  // Fallback
  return spellId.slice(0, 8);
}

export function getDefaultEmoji(spellbook: string, actNumber?: number): string {
  const emojiMap: Record<string, string> = {
    story: '📖',
    zero: '🔮',
    canon: '📜',
    society: '🏛️',
    plurality: '🌐',
    incantations: '✨',
  };
  return emojiMap[spellbook] || '⚫';
}
```

---

## Expected Outcome

### Before
```
[ Venice, 1494 / The Drake's... ]----[ story ]
[ The Dual Ceremony / Sovere... ]----[ story ]
[ Zero Tale 7 ]----[ zero ]
```

### After
```
        📖 Story
       /  |  \
     🌅   ⚡   🔮
      I   II   III
      └───┴───┘ (sequential path)

        🔮 Zero
          |
         🧮
          7
```

Clean, visual, expandable, and connected by the user's journey.

---

## Dependencies

Current: `react-force-graph-2d`
- Sufficient for this enhancement
- No need to switch to Sigma.js unless we need 3D or massive graphs

Optional upgrades:
- `@react-sigma/core` - If we want more advanced layouts
- `graphology` - For better graph manipulation

---

## Notes

- Keep `fullTitle` for tooltips/accessibility
- Marker emojis from `getInscribedMarkerEmoji()` take priority over defaults
- Ceremony constellation is optional (graceful fallback if not completed)
- Mobile: Consider simplified view with fewer connections
- Performance: Limit nodes visible at once if graph grows large
