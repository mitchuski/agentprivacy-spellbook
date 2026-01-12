# Canon Spellbook Integration Checklist

## Overview
To enable Soulbae to speak about the Canon Spellbook, you need to update several components. Here's what needs to change:

---

## 1. **Update `src/lib/soulbae.ts` - System Prompt Builder**

### Current State:
- Only handles `zero-tale-*` (zero spellbook)
- Everything else defaults to "story spellbook"
- No canon spellbook detection

### Required Changes:

#### A. Update `buildSystemPrompt()` function (lines 104-122):
```typescript
if (taleId) {
  // Check spellbook type
  const isZeroSpellbook = taleId.startsWith('zero-tale-');
  const isCanonSpellbook = taleId.startsWith('canon-chapter-') || taleId === 'guardian';
  
  // Determine spellbook context
  let spellbookContext: string;
  if (isZeroSpellbook) {
    spellbookContext = 'zero spellbook (mathematical foundations of zero-knowledge proofs)';
  } else if (isCanonSpellbook) {
    spellbookContext = 'canon spellbook (blockchain history and lineage from cypherpunks to present)';
  } else {
    spellbookContext = 'story spellbook (narrative tales about privacy and sovereignty)';
  }
  
  // Get tale/chapter-specific context
  let taleContext: string;
  if (isZeroSpellbook) {
    const taleNumber = taleId.replace('zero-tale-', '');
    taleContext = `You are currently helping with Tale ${taleNumber} from the Zero Knowledge Spellbook. This tale teaches specific cryptographic concepts and mathematical foundations.`;
  } else if (isCanonSpellbook) {
    const chapterNumber = taleId === 'guardian' ? 'guardian' : taleId.replace('canon-chapter-', '');
    // Import chapter metadata from canon page or create mapping
    const chapterTitle = getCanonChapterTitle(parseInt(chapterNumber));
    taleContext = `You are currently helping with Chapter ${chapterNumber} (${chapterTitle}) from the Canon Spellbook. This chapter tells the historical lineage of blockchain, privacy, and sovereignty from cypherpunks to the present. Focus on the historical narrative, key figures, and how this history connects to why we build privacy-preserving systems today.`;
  } else {
    taleContext = `You are currently helping with ${taleId} from the Story Spellbook. This tale tells a specific story about privacy and sovereignty.`;
  }
  
  return `${taleContext}

${basePrompt}

MOST IMPORTANT: Focus primarily on the specific ${isCanonSpellbook ? 'chapter' : 'tale'} (${taleId}) and how it relates to what the seeker is asking. The ${isCanonSpellbook ? 'chapter' : 'tale'} itself should guide your response more than general spellbook knowledge. Connect everything back to this specific ${isCanonSpellbook ? 'chapter' : 'tale'}'s story, concepts, and lessons.`;
}
```

#### B. Add helper function to get canon chapter metadata:
```typescript
function getCanonChapterTitle(chapterNumber: number): string {
  const chapterTitles: { [key: number]: string } = {
    0: "The Privacymage's Preface / Why This Canon Exists",
    1: "The Cypherpunk Whispers / Foundational Runes (1983-1997)",
    2: "The Early Incantations / Runes Before Synthesis (1997-2007)",
    3: "The Synthesis / When Protest Met Protocol (2008-2014)",
    4: "The World Computer / From Protest to Statecraft (2014-2016)",
    5: "The First Fracture / When Code Met Social Consensus (2016)",
    6: "The Great Schism / Two Canons Diverge (2016-2022)",
    7: "The Surveillance Truth / When The Watchers Learned to Read (2020-2025)",
    8: "The Missing Primitive / Why Privacy Unifies Both Canons",
    9: "The Open Canon / The Chapters Yet to Be Written",
    10: "The Timeline Archive / Sources as Trust Graph Infrastructure",
    11: "The Privacymage's Reflection",
    12: "Guardian Application",
  };
  return chapterTitles[chapterNumber] || `Chapter ${chapterNumber}`;
}
```

#### C. Update base prompt to mention canon spellbook:
Add to the "YOUR KNOWLEDGE" section (around line 97):
```typescript
YOUR KNOWLEDGE:
You learned about zero-knowledge proofs, the Drake's teachings, Zcash, the 7th capital, dual-agent architecture, and the topology of revelation. You also learned the blockchain canon - the history from cypherpunks to the present, how two canons (financial and social) diverged, and why privacy became the missing primitive that unifies them. But you explain them through stories, not technical manuals.
```

---

## 2. **Update `src/app/mage/page.tsx` - Canon Chapter Links**

### Current State:
- Canon links just go to `/canon` (no `tale_id` parameter)
- No way to pass canon chapter context to Soulbae

### Required Changes:

#### Update canon chapter links (around line 970-973):
```typescript
<a
  key={chapterId}
  href={`/mage?tale_id=${chapterId}`}  // Changed from `/canon`
  className="p-3 bg-background border border-surface/50 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-center block"
>
  <div className="font-semibold text-text text-sm">
    {chapter.num === 12 ? 'Guardian' : `Chapter ${chapter.num}`}
  </div>
  <div className="text-xs text-text-muted mt-1">{chapter.title}</div>
</a>
```

---

## 3. **Update `src/lib/zcash-memo.ts` - Memo Formatting**

### Current State:
- Only handles story spellbook acts and zero spellbook tales
- No canon chapter support

### Required Changes:

#### A. Update `getActFromTaleId()` function (lines 16-39):
```typescript
export function getActFromTaleId(taleId: string): number | null {
  // Check for zero spellbook format: zero-tale-X
  const zeroMatch = taleId.match(/^zero-tale-(\d+)$/);
  if (zeroMatch) {
    return parseInt(zeroMatch[1], 10);
  }
  
  // Check for canon spellbook format: canon-chapter-X or guardian
  const canonMatch = taleId.match(/^canon-chapter-(\d+)$/);
  if (canonMatch) {
    return parseInt(canonMatch[1], 10);
  }
  if (taleId === 'guardian') {
    return 12; // Guardian is chapter 12
  }
  
  // Story spellbook tale IDs (existing code)
  const taleMap: { [key: string]: number } = {
    // ... existing mapping
  };
  return taleMap[taleId] || null;
}
```

#### B. Add spellemoji mapping for canon chapters:
```typescript
function getSpellemojiForCanonChapter(chapterNumber: number): string {
  const canonSpellemojiMap: { [key: number]: string } = {
    0: "📖₁(what) + 📖₂(why) → 🗡️🔮(wield)",
    1: "🔐(Chaum) + 📜(May) + ✍️(Hughes) + ⛏️(PoW) → 🗡️₀",
    2: "📝(Szabo) + 💰(Dai) + 🔮(prophecy) → ⛓️❓(almost)",
    3: "🔐+📝+💰+⛏️ → ⛓️✓ → 🍕💰 → 🔓❌(keys) → 👤→🌫️",
    4: "⛓️(money) → 💻(compute) → 🏛️(DAO) → 💰💰💰",
    5: "🏛️→💥 → ⚖️(fork?) → ⛓️|⛓️ → 👥(revealed)",
    6: "⛓️ → 💰(traction) | 🏛️(depth) → ❌🤝",
    7: "👁️(watch) → 🔗(link) → ⚖️🌀(sanction) → 👤→⛓️(prison)",
    8: "💰+🏛️ ← 🛡️⚡(ZK) → 🤝(unified)",
    9: "📖(written) + 📄(blank) → ✍️(you) → ⏰(window)",
    10: "📚(sources) → 🕸️(graph) → ✓(verify) → 🌱(tend)",
    11: "📜⏳ → 🗡️₀ → ⛓️✓ → 💻 → 💔 → 👁️ → 🛡️⚡ → 📄✍️ → △",
    12: "⚔️🛡️📜 (Guardian Application)",
  };
  return canonSpellemojiMap[chapterNumber] || '';
}
```

#### C. Update `formatZcashMemo()` function (lines 106-124):
```typescript
export function formatZcashMemo(
  taleId: string,
  proverb: string
): string {
  const timestamp = Date.now();
  const act = getActFromTaleId(taleId);
  
  // Determine spellbook type
  const isZeroSpellbook = taleId.startsWith('zero-tale-');
  const isCanonSpellbook = taleId.startsWith('canon-chapter-') || taleId === 'guardian';
  
  // Get appropriate spellemoji
  let spellemoji = '';
  if (act !== null) {
    if (isZeroSpellbook) {
      spellemoji = getSpellemojiForZeroTale(act);
    } else if (isCanonSpellbook) {
      spellemoji = getSpellemojiForCanonChapter(act);
    } else {
      spellemoji = getSpellemojiForAct(act);
    }
  }
  
  return `[rpp-v1]
[${taleId}]
[${timestamp}]
[${spellemoji}]
[${proverb}]`;
}
```

---

## 4. **Update `src/app/mage/page.tsx` - Proverb Context Messages**

### Current State:
- Only mentions zero spellbook in proverb context (line 1128)

### Required Changes:

#### Update proverb description (around line 1128):
```typescript
{hasTaleSelected && (
  <div className="text-sm text-text-muted mb-4">
    {taleIdParam?.startsWith('zero-tale-') 
      ? 'This proverb connects your context to the cryptographic concepts in the Zero Knowledge Spellbook. Click "learn" to copy it.'
      : taleIdParam?.startsWith('canon-chapter-') || taleIdParam === 'guardian'
      ? 'This proverb connects your understanding of blockchain history and lineage from the Canon Spellbook. Click "learn" to copy it.'
      : 'This proverb connects your context to the narrative in the Story Spellbook. Click "learn" to copy it.'
    }
  </div>
)}
```

---

## 5. **Optional: Update Character File/System Prompt**

If you have a separate character file (like `soulbae-character.md`), you may want to add:

```
THE CANON SPELLBOOK:
You also learned the Blockchain Canon Spellbook - the historical lineage from cypherpunk whispers to the open canon. This spellbook tells WHY we're building (the second spellbook), while the First Person Spellbook tells WHAT (the first spellbook). You understand how two canons (financial and social) diverged from one origin, and why privacy became the missing primitive that unifies them. When helping with canon chapters, you speak about history, lineage, and the "why" behind the architecture.
```

---

## 6. **Testing Checklist**

After making these changes, test:

- [ ] Canon chapter links in mage page navigate with correct `tale_id` parameter
- [ ] Soulbae recognizes canon spellbook context in system prompt
- [ ] Proverb formatting works for canon chapters (correct spellemoji)
- [ ] Zcash memo format includes correct `canon-chapter-X` or `guardian` tale_id
- [ ] Soulbae responses reference canon-specific content appropriately
- [ ] Privacy budget and session management work with canon chapters
- [ ] Proverb suggestions work correctly for canon chapters

---

## Summary

**Files to Modify:**
1. `src/lib/soulbae.ts` - System prompt builder
2. `src/app/mage/page.tsx` - Canon links and proverb context
3. `src/lib/zcash-memo.ts` - Memo formatting and spellemoji

**Key Changes:**
- Add canon spellbook detection (`canon-chapter-*` and `guardian`)
- Add canon chapter metadata (titles, spellemojis)
- Update system prompts to include canon context
- Update links to pass `tale_id` parameter
- Update memo formatting to support canon chapters

