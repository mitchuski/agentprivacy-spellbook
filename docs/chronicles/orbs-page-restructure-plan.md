# Orbs Page Restructure Plan

## Current Order (Problems)
1. **Import Section** - Too soon, user doesn't know what they're importing into
2. **Training Progress** - Stats before seeing what you're training
3. **OrbLoadoutSection** - Contains duplicate blade data (StanceLoadoutEditor + BladeInventory)
4. **Soul Ritual** - Makes sense after loadout
5. **Extensions** - Locked/unlocked gate

## Proposed New Order

### 1. Header
Keep: "Soulbis & Soulbae" - Configure your dual orb loadout

### 2. Your Arsenal (NEW - condensed from OrbLoadoutSection)
**Goal:** Show ALL spells and blades in a clean, scannable format

- **Left column: Swordsman Blades**
  - 6 stance slots (L1-L6) with yin/yang toggles
  - Blade Inventory below (collapsible?)
  - "Apply stance" button

- **Right column: Mage Spells**
  - 6 spell slots (M1-M6)
  - Available spell pool (collapsible?)

**Key change:** Remove the duplicate blade display. Currently:
- StanceLoadoutEditor shows 6 blade slots
- BladeInventory shows all blades again
- Condense: Show blade inventory inline, selected blades populate slots

### 3. Selection & Controls
Brief explanation of how selection works:
- Click panel slot to select
- S/M keys to cycle
- Left-click fires mage spell, right-click fires swordsman blade

### 4. Training Stats
Move here - now user understands WHAT they're training:
- Sections visited
- Spells cast
- Convergences

### 5. Soul Ritual
Keep SoulConvergenceCeremony here - natural progression after stats

### 6. Import (Moved to end)
SoulImportSection - now makes sense:
- User has seen the loadout system
- Understands what .soul, skills.md, blade.md contain
- Ready to import previous progress

### 7. Extensions (if unlocked)
Keep at end - reward for completing requirements

---

## Specific Changes Needed

### orbs/page.tsx
- Reorder sections
- Add "Selection & Controls" brief section

### OrbLoadoutSection.tsx
- Condense blade display
- Option 1: Blade inventory as dropdown/selector within each slot
- Option 2: Blade inventory collapsed by default, expands on "manage blades"
- Remove visual duplication

### Components to potentially merge/simplify
- StanceLoadoutEditor blade slots + BladeInventory overlap
- Could make slots clickable to open blade picker from inventory

---

## Flow Summary

```
[Header]
    |
[Your Arsenal] - See all your blades/spells
    |
[Controls] - Learn how to use them
    |
[Training Stats] - See your progress
    |
[Soul Ritual] - Crystallize your journey
    |
[Import] - Bring in previous data
    |
[Extensions] - Download the tools
```
