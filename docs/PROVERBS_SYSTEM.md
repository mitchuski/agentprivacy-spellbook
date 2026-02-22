# Proverbs System Architecture

This document describes the proverbs collection, evocation, and revelation system.

## Overview

Proverbs are compressed insights that demonstrate deep engagement with the spellbook content. Users can:
1. **Collect** proverbs while studying spellbooks
2. **Evoke** with the Privacy Mage (direct contact or public stream)
3. **Reveal** on Zcash blockchain for permanent proof

---

## System Components

### 1. Proverb Storage (`src/lib/proverbs/storage.ts`)

Local storage for user's proverb collection.

```typescript
// Source types - how the proverb was created
type ProverbSourceType =
  | 'mage_response'     // Generated from MagePanel chat
  | 'cast_inscription'  // Direct inscription by user
  | 'cast_agreement';   // Agreement with existing content

// Status flow
type ProverbStatus =
  | 'collected'         // In local collection
  | 'added_to_spells'   // Added to skill graph
  | 'pending_reveal'    // Waiting for Zcash submission
  | 'revealed';         // Inscribed on Zcash

// Proverb data structure
interface UserProverb {
  id: string;
  content: string;              // The proverb text
  grimoire: string;             // 'story', 'zero', 'canon', etc.
  taleId: string;               // e.g., 'story-3'
  actNumber?: number;           // For story spellbook
  sourceType: ProverbSourceType;
  castEntryId?: string;         // Links to spellbook entry if agreement
  createdAt: string;            // ISO timestamp
  status: ProverbStatus;
  revealedTxid?: string;        // If inscribed on Zcash
  revealedAt?: string;          // When revealed
}
```

**Key Functions:**
- `getUserProverbs()` - Get all user proverbs
- `addUserProverb(proverb)` - Add new proverb (deduplicates by content)
- `updateProverbStatus(id, status, txid?)` - Update status
- `deleteUserProverb(id)` - Remove proverb
- `getProverbsByStatus(status)` - Filter by status
- `getRevealedProverbs()` - Get onchain proverbs

### 2. ProverbCard Component (`src/components/ProverbCard.tsx`)

Displays a proverb with action buttons based on status.

**Actions for `collected` status:**
- **Copy** - Copy proverb text to clipboard
- **Add to Spells** - Add to skill graph (changes status to `added_to_spells`)
- **Evoke** - Link to `/evoke?proverb={encoded}` for mage interaction
- **Reveal on Zcash** - Expands revelation flow with memo copy

**Actions for `revealed` status:**
- **View on Chain** - Link to Zcash explorer with txid

### 3. InscribeProverbButton (`src/components/InscribeProverbButton.tsx`)

Modal button for inscribing new proverbs directly from spellbook pages.

Props:
- `taleId` - Current tale identifier
- `sourceType` - How proverb is being created
- `prefillContent` - Optional pre-filled proverb text
- `onSuccess` - Callback after successful inscription

---

## Two Types of Evocation

### Type 1: Direct Mage Contact (Private)

Contact the Privacy Mage directly via the MagePanel sidebar.

**Flow:**
1. User opens MagePanel (sidebar popout)
2. Sends proverb or question to the mage
3. Mage responds with insights, confirmations, or new proverbs
4. User can save proverbs from conversation to collection

**Implementation:**
- MagePanel already exists as sidebar component
- Uses NEAR AI for chat responses
- Proverbs detected in mage responses can be saved

### Type 2: Proverb Revelation Protocol (Public/Zcash)

Inscribe proverb on Zcash blockchain as permanent proof of understanding.

**Flow:**
1. User selects a collected proverb
2. Clicks "Reveal on Zcash"
3. System formats memo with taleId and proverb content
4. User copies memo to Zashi wallet
5. Sends 0.01 ZEC to oracle address
6. Oracle indexes the inscription
7. Proverb appears in onchain inscriptions

**Zcash Addresses:**
- **Unified Address (UA):** For shielded sends (privacy-preserving)
- **Transparent Address (t-addr):** For inscription indexing

**Memo Format:**
```
{taleId}|{proverb_content}
```

Example:
```
story-3|The swordsman alone rages, mage alone dreams—sovereignty demands all three to intertwine.
```

---

## Page Structure

### `/proverbs` Page

**Sections (top to bottom):**
1. **My Proverbs** - User's collection with status breakdown
2. **Zcash Revelation Addresses** - UA and t-addr for submissions
3. **VRC System Info** - Trust credential explanation
4. **Learn a Spell** - Act selector for new submissions
5. **Submit Proverb** - Direct submission form
6. **Onchain Proof Inscriptions** - All revealed proverbs by act

### `/evoke` Page (Redesigned)

**Two evocation modes:**

1. **Contact the Privacy Mage** (Top section)
   - Form to send proverb/question
   - Links to MagePanel sidebar
   - Private, direct communication

2. **Proverb Revelation Protocol** (Bottom section)
   - Zcash-based permanent inscription
   - Address display (UA and t-addr)
   - Memo format instructions
   - Steps for Zashi wallet submission

---

## Integration Points

### MagePanel → Proverbs Storage

When MagePanel detects a proverb in conversation:
```typescript
import { addUserProverb } from '@/lib/proverbs/storage';

// Save mage-generated proverb
addUserProverb({
  content: detectedProverb,
  grimoire: currentGrimoire,
  taleId: currentTaleId,
  actNumber: currentAct,
  sourceType: 'mage_response',
});
```

### Spellbook Pages → InscribeProverbButton

Add inscription button to spellbook act pages:
```tsx
import InscribeProverbButton from '@/components/InscribeProverbButton';

<InscribeProverbButton
  taleId="story-3"
  sourceType="cast_inscription"
/>
```

### ProverbCard → Evoke Page

Evoke link passes proverb content:
```tsx
<Link href={`/evoke?proverb=${encodeURIComponent(proverb.content)}`}>
  Evoke
</Link>
```

### ProverbCard → Zcash Revelation

Revelation flow uses:
```typescript
import { formatZcashMemo, getTaleIdFromAct } from '@/lib/zcash-memo';

const memo = formatZcashMemo(taleId, proverbContent);
// Copy memo to clipboard for Zashi wallet
```

---

## Status Flow Diagram

```
┌─────────────┐
│  collected  │ ← User inscribes or saves from mage
└──────┬──────┘
       │
       ├────────────────┬───────────────────┐
       ▼                ▼                   ▼
┌──────────────┐  ┌──────────┐      ┌──────────────┐
│added_to_spells│  │  evoke   │      │pending_reveal│
│  (in skills) │  │(mage chat)│      │(memo copied) │
└──────────────┘  └──────────┘      └──────┬───────┘
                                           │
                                           ▼ (oracle indexes)
                                    ┌──────────────┐
                                    │   revealed   │
                                    │  (on chain)  │
                                    └──────────────┘
```

---

## File Locations

| Component | Path |
|-----------|------|
| Proverb storage | `src/lib/proverbs/storage.ts` |
| ProverbCard | `src/components/ProverbCard.tsx` |
| InscribeProverbButton | `src/components/InscribeProverbButton.tsx` |
| Zcash memo utils | `src/lib/zcash-memo.ts` |
| Oracle API | `src/lib/oracle-api.ts` |
| Proverbs page | `src/app/proverbs/page.tsx` |
| Evoke page | `src/app/evoke/page.tsx` |
| MagePanel | `src/components/MagePanel.tsx` |

---

## Building the System

### Step 1: Ensure storage is working
```bash
# Storage is localStorage-based, works automatically in browser
# No server setup needed
```

### Step 2: Add InscribeProverbButton to spellbook pages

In any spellbook act page:
```tsx
import InscribeProverbButton from '@/components/InscribeProverbButton';

// In the component JSX
<InscribeProverbButton
  taleId={`story-${actNumber}`}
  buttonLabel="Inscribe your understanding"
/>
```

### Step 3: Wire MagePanel proverb detection (optional)

In MagePanel, when detecting proverbs:
```typescript
// Dispatch event for other components
window.dispatchEvent(
  new CustomEvent('mage-proverb-detected', {
    detail: { proverb: extractedProverb }
  })
);
```

### Step 4: Build and deploy
```bash
npm run build
# Deploys as static export
```

---

## Notes

- All proverb data is stored in localStorage (`ap-user-proverbs` key)
- Proverbs are deduplicated by normalized content (trim + lowercase)
- Ceremony keys (identity) must be generated before proverbs can be linked to profile
- Zcash revelations are permanent and public once confirmed
