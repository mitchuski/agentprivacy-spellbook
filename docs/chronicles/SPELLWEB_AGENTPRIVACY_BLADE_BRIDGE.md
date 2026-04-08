# Spellweb ↔ agentprivacy: zk blade ring bridge

## Intent

On **spellweb.ai**, a **forged blade** (or **witness blade**) is a structured object with a `SpellProof`, constellation marks, and tier metadata (`spellweb/src/components/SpellWeb.tsx`: `ForgedBlade`, `spellweb-equipped-blade` in `localStorage`). The swordsman’s orb is meant to carry **up to six mark emojis** along the blade path—not generic “spells orbiting.”

On **agentprivacy.ai**, the Soulbis **hex stance** UI assigns **six facet emojis** per stance line. These should be the **same conceptual object**: **zk-forged blade facets** tied to proof, with agentprivacy as the **training-ground** surface and spellweb as the **forge + witness** surface.

## Cross-origin reality

`spellweb.ai` and `agentprivacy.ai` do **not** share `localStorage`. The bridge is:

1. **Query parameter** — spellweb (or a tool) opens agentprivacy with a compact payload:  
   `https://agentprivacy.ai/?spellwebBlade=<base64url(json)>`  
   The app **consumes** the param once, applies emojis to Soulbis slots, then **strips** the query via `history.replaceState` so the URL is clean and the import is not replayed.

2. **Paste JSON** — user copies an export from spellweb (future: explicit “Export for agentprivacy” button in spellweb) and pastes into the Soulbis panel. Same payload shape as (1).

## Payload shape (`v: 1`)

```ts
{
  "v": 1,
  "bladeId": string,
  "name": string,
  "primaryEmoji": string,
  "markEmojis": string[], // length ≤ 6, order = constellation path / marks
  "proofSignature"?: string,
  "isWitness"?: boolean
}
```

- **markEmojis** map to Soulbis slots **S1–S6** in order; shorter arrays only fill the first *n* slots (remaining slots unchanged unless we pad—implementation fills up to 6, missing indices keep previous emoji).
- **proofSignature** is optional metadata for display/logging; verification against on-chain or server truth is **out of scope** for this bridge (future: verify via spellweb API).

## Spellweb repo reference (local)

- `c:\Users\mitch\spellweb\src\components\SpellWeb.tsx` — `ForgedBlade`, `equippedBlade`, `constellationMarks`, witness fields.
- `c:\Users\mitch\spellweb\src\components\WanderingOrbs.tsx` — `swordsmanOrbitEmojis?: string[]` (equipped blade drives orb chips; wiring may be extended in spellweb to pass marks → emojis).
- `c:\Users\mitch\spellweb\docs\chronicle-2026-03-30-bilateral-witness.md` — witness blade semantics.

## Next steps (spellweb repo, not this PR)

- Add **“Open in agentprivacy”** or **“Copy blade for Soulbis”** that builds the same JSON and either navigates with `spellwebBlade=` or copies to clipboard.
- Optionally align `constellationMarks` order with `markEmojis` export order.

## This repo (agentprivacy)

- `src/lib/spellweb-blade-bridge.ts` — encode/decode, apply to `swordsman` slots, optional `localStorage` metadata key `agentprivacy_spellweb_blade_meta`.
- `src/components/SpellwebBladeImport.tsx` — paste + short explanation + link to spellweb.ai.
- Soulbis stance UI — orbit map **beside** posture; copy uses **blade / zk facet** language, not “spells orbiting.”
- `GlobalLearningSpells` — on mount, `consumeSpellwebBladeFromUrl()` + sync orbs.
