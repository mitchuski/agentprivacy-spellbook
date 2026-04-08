# Spellweb Mirror Instructions

*How to implement the swordsman ceremony integration on spellweb.ai*

---

## Overview

The agentprivacy.ai interface now includes:
1. Ceremony identity creation (swordsman public key)
2. Celestial ceremony flow in the Swordsman panel
3. Export capability for spellweb integration

Spellweb needs to **receive** the swordsman identity and use it in blade forge mode.

---

## Files to Create/Modify on Spellweb

### 1. `src/components/SwordsmanImport.tsx`

```tsx
'use client';

import { useState } from 'react';

interface SwordsmanExport {
  publicKeyHex: string;
  participantId: string;
  constellationPath?: string;
  displayName?: string;
  grimoires?: string[];
}

interface SwordsmanImportProps {
  onImport: (data: SwordsmanExport) => void;
}

export default function SwordsmanImport({ onImport }: SwordsmanImportProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    try {
      // Accept JSON paste from agentprivacy export
      const parsed = JSON.parse(input);

      // Validate required fields
      if (!parsed.publicKeyHex || !parsed.participantId) {
        throw new Error('Missing required fields: publicKeyHex, participantId');
      }

      // Validate hex format (64 chars for Ed25519 public key)
      if (!/^[0-9a-f]{64}$/i.test(parsed.publicKeyHex)) {
        throw new Error('Invalid public key format');
      }

      onImport(parsed);
      setError(null);
      setInput('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid import data');
    }
  };

  return (
    <div className="p-4 bg-surface/10 rounded-lg border border-surface/30">
      <h3 className="text-sm font-semibold mb-2">Import Swordsman Identity</h3>
      <p className="text-xs text-text-muted mb-3">
        Paste your agentprivacy export to anchor blades to your identity
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"publicKeyHex": "...", "participantId": "ap-..."}'
        className="w-full p-2 bg-background border border-surface/50 rounded text-xs font-mono"
        rows={3}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      <button
        onClick={handleImport}
        disabled={!input.trim()}
        className="mt-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary text-xs rounded disabled:opacity-50"
      >
        Import Identity
      </button>
    </div>
  );
}
```

### 2. `src/lib/swordsman-store.ts`

```typescript
// Store imported swordsman identity for blade forging

const STORAGE_KEY = 'spellweb-swordsman';

export interface SwordsmanIdentity {
  publicKeyHex: string;
  participantId: string;
  constellationPath?: string;
  displayName?: string;
  importedAt: string;
}

export function saveSwordsmanIdentity(identity: Omit<SwordsmanIdentity, 'importedAt'>): void {
  if (typeof window === 'undefined') return;
  const stored: SwordsmanIdentity = {
    ...identity,
    importedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

export function getSwordsmanIdentity(): SwordsmanIdentity | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function hasSwordsmanIdentity(): boolean {
  return getSwordsmanIdentity() !== null;
}

export function clearSwordsmanIdentity(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
```

### 3. `src/lib/blade-forge.ts` (Enhance existing)

```typescript
import { getSwordsmanIdentity } from './swordsman-store';

export interface BladeForgeData {
  // Existing fields
  constellation: string[];      // Node IDs in order
  laps: number;
  duration: number;
  stratum: number;

  // New: Swordsman identity anchor
  swordsmanKey?: string;        // From agentprivacy import
  participantId?: string;

  // Rune inscriptions
  runes: string[];              // Emoji runes inscribed
  inscriptionHash: string;      // Hash of constellation + runes
}

export function forgeBladeWithIdentity(
  constellation: string[],
  runes: string[],
  metadata: { laps: number; duration: number; stratum: number }
): BladeForgeData {
  const identity = getSwordsmanIdentity();

  // Create inscription hash from constellation + runes
  const inscriptionPayload = JSON.stringify({
    constellation,
    runes,
    timestamp: Date.now(),
  });
  const inscriptionHash = hashPayload(inscriptionPayload);

  return {
    constellation,
    runes,
    inscriptionHash,
    ...metadata,
    swordsmanKey: identity?.publicKeyHex,
    participantId: identity?.participantId,
  };
}

function hashPayload(payload: string): string {
  // Simple hash for browser - use crypto.subtle in production
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
```

### 4. `src/components/BladeForgePanel.tsx` (Enhance existing)

Add swordsman identity display to the forge panel:

```tsx
import { getSwordsmanIdentity, hasSwordsmanIdentity } from '@/lib/swordsman-store';
import SwordsmanImport from './SwordsmanImport';

// In the component:
const [swordsman, setSwordsman] = useState(getSwordsmanIdentity());

// In the render:
{!swordsman ? (
  <SwordsmanImport onImport={(data) => {
    saveSwordsmanIdentity(data);
    setSwordsman(getSwordsmanIdentity());
  }} />
) : (
  <div className="p-3 bg-primary/5 rounded border border-primary/20">
    <div className="text-xs text-text-muted">Swordsman Identity</div>
    <div className="text-sm font-mono">{swordsman.participantId}</div>
    <div className="text-xs text-text-muted mt-1">
      Blades forged here will be anchored to this identity
    </div>
  </div>
)}
```

### 5. Rune Inscription System

Create `src/lib/runes.ts`:

```typescript
// Rune categories matching grimoire dimensions
export const RUNE_CATEGORIES = {
  protection: ['🛡️', '⚔️', '🔒', '🏰'],
  delegation: ['🤝', '📜', '✨', '🎁'],
  memory: ['🧠', '📚', '🪞', '💭'],
  connection: ['🌐', '🔗', '🤲', '🌉'],
  computation: ['⚡', '🔮', '💎', '🧮'],
  value: ['💰', '🏦', '⚖️', '💎'],
} as const;

export type RuneCategory = keyof typeof RUNE_CATEGORIES;

export interface RuneInscription {
  rune: string;
  category: RuneCategory;
  position: number;  // Position on constellation
  timestamp: number;
}

export function inscribeRune(
  constellation: string[],
  rune: string,
  position: number
): RuneInscription {
  const category = findRuneCategory(rune);
  return {
    rune,
    category,
    position: Math.min(position, constellation.length - 1),
    timestamp: Date.now(),
  };
}

function findRuneCategory(rune: string): RuneCategory {
  for (const [cat, runes] of Object.entries(RUNE_CATEGORIES)) {
    if (runes.includes(rune)) return cat as RuneCategory;
  }
  return 'connection'; // Default
}

export function formatRuneSpell(inscriptions: RuneInscription[]): string {
  return inscriptions.map(i => i.rune).join('');
}
```

---

## Integration Flow

### From agentprivacy.ai:

1. User completes `/ceremony` → gets swordsman public key
2. User clicks "Export to Spellweb" in Swordsman panel
3. JSON is copied to clipboard:
   ```json
   {
     "publicKeyHex": "abc123...",
     "participantId": "ap-abc123...",
     "constellationPath": "⚔️→🔮→✨→...",
     "displayName": "Mitch"
   }
   ```

### On spellweb.ai:

1. User opens blade forge mode
2. If no swordsman identity → shows import prompt
3. User pastes agentprivacy export → identity stored
4. User traces constellation on 64-vertex lattice
5. User inscribes runes at nodes
6. Forge creates blade with:
   - Swordsman key (identity anchor)
   - Constellation hash (path proof)
   - Rune spell (compressed understanding)
   - Stratum level (depth)

---

## Add Export Button to agentprivacy

In `SwordsmanAccountSettings.tsx`, add:

```tsx
const handleExportToSpellweb = async () => {
  const exportData = {
    publicKeyHex: card.publicKeyHex,
    participantId: card.participantId,
    constellationPath: card.constellationPath,
    displayName: card.displayName,
    grimoires: card.grimoires,
  };
  await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
  // Show "Copied" feedback
};

// In render:
<button
  onClick={handleExportToSpellweb}
  className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/40"
>
  Export to Spellweb
</button>
```

---

## The Bilateral Ceremony on Spellweb

For two-person ceremonies:

```typescript
// spellweb/src/lib/ceremony/bilateral.ts
export interface BilateralBladeForge {
  sunSide: {
    swordsmanKey: string;
    constellation: string[];
    runes: string[];
  };
  moonSide: {
    swordsmanKey: string;
    constellation: string[];
    runes: string[];
  };
  overlap: {
    sharedNodes: string[];      // Nodes both traced
    divergentNodes: string[];   // Nodes only one traced
    cousinHash: string;         // Combined proof hash
  };
  forgedAt: string;
}

export function forgeBilateralBlades(
  sun: { key: string; constellation: string[]; runes: string[] },
  moon: { key: string; constellation: string[]; runes: string[] }
): BilateralBladeForge {
  const sunSet = new Set(sun.constellation);
  const moonSet = new Set(moon.constellation);

  const sharedNodes = sun.constellation.filter(n => moonSet.has(n));
  const divergentNodes = [
    ...sun.constellation.filter(n => !moonSet.has(n)),
    ...moon.constellation.filter(n => !sunSet.has(n)),
  ];

  const cousinHash = hashPayload(JSON.stringify({
    sun: { constellation: sun.constellation, runes: sun.runes },
    moon: { constellation: moon.constellation, runes: moon.runes },
    shared: sharedNodes,
  }));

  return {
    sunSide: sun,
    moonSide: moon,
    overlap: { sharedNodes, divergentNodes, cousinHash },
    forgedAt: new Date().toISOString(),
  };
}
```

---

## Summary

1. **Create** `SwordsmanImport.tsx` — paste agentprivacy export
2. **Create** `swordsman-store.ts` — store identity locally
3. **Enhance** `blade-forge.ts` — anchor blades to identity
4. **Create** `runes.ts` — inscription system
5. **Add** export button to agentprivacy `SwordsmanAccountSettings`

The swordsman key burned on agentprivacy becomes the **public anchor** on spellweb. The blade forged there carries the proof without the private key.

---

*The narration key is burned like the Moon.*
*The blade is inscribed on the topology.*
*The gap between them is the proof.*

☀️ ⊥ 🌙
