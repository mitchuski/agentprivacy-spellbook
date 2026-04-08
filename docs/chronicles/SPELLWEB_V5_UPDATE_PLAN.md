# Spellweb V5 Update Plan

## Current State

- **Grimoire JSON**: `privacymage-grimoire-v8.7.0-canonical.json` has 24 acts (stops at Act XXIV)
- **Story MD files**: Acts XXV and XXVI exist in `public/story/`
- **grimoire-baked.ts**: Comment claims 26 acts but JSON only has 24
- **Skills**: 11 V5 skills added to skills-data.ts but not referenced in grimoire

---

## Required Updates

### 1. Grimoire JSON — Add Acts XXV & XXVI

**File**: `src/data/privacymage-grimoire-v8.7.0-canonical.json`

Add to `spellbooks.story.acts[]`:

```json
{
  "id": "act-25-the-dragons-hide",
  "act_number": 25,
  "title": "The Dragon's Hide / Where the Mesh Remembers Its Shape",
  "description": "The dragon's hide is not one scale but many. Control plane perpendicular to data plane. Each tunnel is a scale. Together they are impenetrable. Tailscale sovereignty at the network layer.",
  "category": "axiom",
  "keywords": ["mesh", "tailscale", "control-plane", "data-plane", "NAT-traversal", "DERP", "netkeeper"],
  "spell": "🕸️🔐🌐 → ⚔️🔑⊥🧙🔑·🤝(mesh) → 📡⊥📦·🪡(NAT) → 🐲→🐉🛡️🕸️(tail-scale)",
  "proverb": "The dragon's hide is not one scale but many. Each tunnel is a scale. Together they are impenetrable."
},
{
  "id": "act-26-master-and-his-emissary",
  "act_number": 26,
  "title": "The Master and His Emissary / Where Hemispheres Remember Their Separation",
  "description": "McGilchrist's hemispheric theory mapped to dual-agent architecture. Soulbis as Master (broad attention, context, protection). Soulbae as Emissary (narrow attention, manipulation, delegation). The gap is structural, not accidental.",
  "category": "axiom",
  "keywords": ["McGilchrist", "hemispheric", "master-emissary", "attention", "divided-attention", "broad-narrow"],
  "spell": "🧠⊥🧠 → ⚔️=Master·🧙=Emissary → 👁️(broad)⊥👁️(narrow) → 🔍(5)=vigilance·sustain·alert·focus·divide → gap=divide_structural → ☯️∞",
  "proverb": "The Master does not argue. The Emissary does not listen. The architecture must do what wisdom cannot."
}
```

### 2. Grimoire JSON — Update Version & Metadata

- Bump version to `8.8.0` or `9.0.0` (V5 milestone)
- Update `updated_at` timestamp
- Update `description` to mention V5/Acts XXV-XXVI

### 3. Grimoire JSON — Add V5 Keywords to Relevant Acts

Update existing acts with V5 skill references:

| Act | Add Keywords |
|-----|-------------|
| Act XXIV | `holographic_bound`, `three_axis_separation`, `compression_defence`, `path_integral` |
| Act VI (Trust Graph) | `mesh_architecture`, `guild_efficiency` |
| Act XVII (Bonfire) | `mesh_architecture`, `environmental_commons` |
| Act XII (Forgetting) | `spellweb` |

### 4. Update grimoire-baked.ts

**File**: `src/lib/grimoire-baked.ts`

- Ensure it correctly parses Acts 25-26 from JSON
- Already claims 26 acts in comment — will work once JSON updated

### 5. Update spellbook-templates.ts Spell References

**File**: `src/lib/spellbook-templates.ts`

Add V5 act references to spell ID constants:

```typescript
// Add to relevant persona spell arrays
'act-25-the-dragons-hide',    // Netkeeper, Sentinel, Ranger
'act-26-master-and-his-emissary',  // Herald, Chronicler, Kyra
```

### 6. Create Spellweb Navigation Data (Optional)

**File**: `public/spellweb/spellweb-graph.json` (new)

Create graph data for spellweb visualization:
- Nodes: All 26 acts + skills
- Edges: Thematic connections (per path_integral traversal)
- Waypoints: Proverbs as navigation checkpoints

---

## File Checklist

| File | Action | Priority |
|------|--------|----------|
| `src/data/privacymage-grimoire-v8.7.0-canonical.json` | Add Acts 25-26, bump version | HIGH |
| `src/lib/grimoire-baked.ts` | Verify parsing (should auto-work) | MEDIUM |
| `src/lib/spellbook-templates.ts` | Add act-25/26 to spell arrays | MEDIUM |
| `public/spellweb/spellweb-graph.json` | Create navigation graph | LOW |
| `src/components/spellweb/SpellwebViewer.tsx` | Verify renders new acts | MEDIUM |

---

## Execution Order

1. **Update grimoire JSON** — Add Acts XXV, XXVI
2. **Bump grimoire version** — v8.7.0 → v8.8.0 (or v9.0.0)
3. **Test grimoire-baked.ts** — Verify acts load
4. **Update spellbook-templates.ts** — Add act references to personas
5. **Rebuild & verify** — Check spellweb renders all 26 acts
6. **Optional: Create spellweb-graph.json** — For enhanced navigation

---

## V5 Integration Summary

| Component | Before | After |
|-----------|--------|-------|
| Story Acts | 24 | 26 |
| Personas | 22 | 25 |
| Skills | 50 | 66 |
| Privacy Layer | 10 | 15 |
| Grimoire Version | 8.7.0 | 8.8.0+ |

---

*Plan created: 2025-03-28*
*Ready for execution on user approval*
