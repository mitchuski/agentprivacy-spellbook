# Integration Plan: agentprivacy-skills → agentprivacy_master

**Date**: 2026-02-23
**Planner**: Claude (Opus 4.5)
**Source**: `C:\Users\mitch\agentprivacy-skills`
**Target**: `C:\Users\mitch\agentprivacy_master`

---

## Overview

This plan details the step-by-step process for integrating the `agentprivacy-skills` repository into `agentprivacy_master`. The integration will be performed in phases to minimize risk and allow for validation at each stage.

---

## Pre-Integration Checklist

- [ ] Backup `agentprivacy_master` (git commit or zip)
- [ ] Verify skills repo is at expected version (v4/v5.0)
- [ ] Review LICENSE alignment (see License Section below)
- [ ] Ensure no uncommitted changes in master

---

## Phase 1: Foundation (Claude Code Plugin Setup)

**Goal**: Enable Claude Code plugin discovery in master repo

### Step 1.1: Create Plugin Directory

```bash
mkdir agentprivacy_master\.claude-plugin
```

### Step 1.2: Copy Plugin Configuration

Copy from: `agentprivacy-skills\agentprivacy-skills-v4\.claude-plugin\plugin.json`
To: `agentprivacy_master\.claude-plugin\plugin.json`

**Modify paths** to reflect new structure:

```json
{
  "name": "agentprivacy",
  "skillsets": [
    {
      "name": "persona-skills",
      "skills_dir": "skills/persona",
      "strict": false
    },
    {
      "name": "role-skills",
      "skills_dir": "skills/role",
      "strict": false
    },
    {
      "name": "privacy-layer-skills",
      "skills_dir": "skills/privacy-layer",
      "strict": false
    }
  ]
}
```

### Step 1.3: Copy Migration Mapping

Copy from: `agentprivacy-skills\MAPPING.md`
To: `agentprivacy_master\MAPPING.md`

---

## Phase 2: Skills Directory Structure

**Goal**: Create unified skills directory in master

### Step 2.1: Create Skills Directory Hierarchy

```bash
mkdir agentprivacy_master\skills
mkdir agentprivacy_master\skills\privacy-layer
mkdir agentprivacy_master\skills\role
mkdir agentprivacy_master\skills\persona
mkdir agentprivacy_master\skills\meta
```

### Step 2.2: Copy Privacy-Layer Skills (CRITICAL)

These are foundational and should be copied first:

```
Source: agentprivacy-skills\agentprivacy-skills-v4\privacy-layer\*
Target: agentprivacy_master\skills\privacy-layer\

Skills to copy (9):
├── agentprivacy-dragon\
├── agentprivacy-edge-value\
├── agentprivacy-knowledgegraph\
├── agentprivacy-network-topology\
├── agentprivacy-promise-theory\
├── agentprivacy-temporal-dynamics\
├── agentprivacy-tetrahedral-sovereignty\
├── agentprivacy-uor-toroidal\
└── agentprivacy-vrc-identity\
```

### Step 2.3: Copy Role Skills

```
Source: agentprivacy-skills\agentprivacy-skills-v4\role\*
Target: agentprivacy_master\skills\role\

Skills to copy (26):
├── agentprivacy-academic\
├── agentprivacy-agent-interop\
├── agentprivacy-ai-agent\
├── agentprivacy-armor-progression\
├── agentprivacy-consent-infrastructure\
├── agentprivacy-constellation-method\
├── agentprivacy-cross-chain\
├── agentprivacy-crypto-zkp\
├── agentprivacy-dark-forest\
├── agentprivacy-data-dignity\
├── agentprivacy-economics\
├── agentprivacy-governance-agents\
├── agentprivacy-hitchhiker-governance\
├── agentprivacy-narrative-compression\
├── agentprivacy-personhood-sybil\
├── agentprivacy-plurality-cooperative\
├── agentprivacy-policy-governance\
├── agentprivacy-proverbiogenesis\
├── agentprivacy-recovery-rpp\
├── agentprivacy-reputation-credentials\
├── agentprivacy-selective-disclosure\
├── agentprivacy-sovereignty-economics\
├── agentprivacy-swordsman-browser\
├── agentprivacy-threat-adversarial\
├── agentprivacy-trust-spanning\
└── agentprivacy-understanding-as-key\
```

### Step 2.4: Copy Meta Skills

```
Source: agentprivacy-skills\agentprivacy-skills-v4\meta\*
Target: agentprivacy_master\skills\meta\

Skills to copy (1):
└── agentprivacy-drake-dragon-duality\
```

---

## Phase 3: Persona Reconciliation

**Goal**: Merge persona skills with existing master personas

### Step 3.1: Identify Existing Personas in Master

Check `agentprivacy_master\content\personas\` for existing definitions.

### Step 3.2: Copy New Personas (No Conflict)

Copy directly from skills repo (15 new personas):

```
agentprivacy-ambassador\
agentprivacy-archer\
agentprivacy-assessor\
agentprivacy-gatekeeper\
agentprivacy-healer\
agentprivacy-jedi\
agentprivacy-kyra\
agentprivacy-pedagogue\
agentprivacy-person\
agentprivacy-priest\
agentprivacy-ranger\
agentprivacy-shipwright\
agentprivacy-sith\
agentprivacy-weaver\
agentprivacy-witness\
```

### Step 3.3: Reconcile Overlapping Personas (7 conflicts)

For each overlapping persona, follow this process:

#### 3.3.1 agentprivacy-soulbae (Canonical Mage)

1. **Backup** existing: `content/personas/soulbae/` → `content/personas/soulbae.backup/`
2. **Copy** skills version: `agentprivacy-skills/.../agentprivacy-soulbae/` → `skills/persona/agentprivacy-soulbae/`
3. **Preserve** runtime config: Keep any NEAR Cloud AI system prompts from master
4. **Add symlink/reference** from old location if needed for runtime compatibility

#### 3.3.2 agentprivacy-soulbis (Canonical Swordsman)

Same process as Soulbae.

#### 3.3.3 Other Overlapping Personas

Apply same pattern to:
- agentprivacy-chronicler
- agentprivacy-cipher
- agentprivacy-architect
- agentprivacy-sentinel
- agentprivacy-warden

### Step 3.4: Create Persona Index

Create `skills/persona/index.json` listing all personas:

```json
{
  "personas": [
    {"name": "agentprivacy-soulbae", "alignment": "mage", "tier": 0},
    {"name": "agentprivacy-soulbis", "alignment": "swordsman", "tier": 0},
    ...
  ]
}
```

---

## Phase 4: Content Migration

**Goal**: Move existing master content to unified structure

### Step 4.1: Migrate Existing Skills

```
Source: agentprivacy_master\content\skills\agentprivacy\*
Target: agentprivacy_master\skills\role\ (merge with existing)
```

If conflicts exist, skills repo version takes precedence.

### Step 4.2: Update Content References

Update any references in:
- `src/lib/skills-data.ts`
- `src/lib/persona-index.ts`
- `public/skills/`
- `public/persona/`

### Step 4.3: Deprecate Old Locations

Create `content/personas/MIGRATED.md`:
```markdown
# Personas Migrated

Persona definitions have been moved to `/skills/persona/`.

See MAPPING.md for the complete migration mapping.
```

---

## Phase 5: Context File Updates

**Goal**: Align context files with new skill structure

### Step 5.1: Update context_1_pvmv4_skills.md

Add references to new privacy-layer skills:
- Link to `skills/privacy-layer/agentprivacy-dragon/SKILL.md` for V(π,t) equation
- Link to other foundational skills

### Step 5.2: Update context_2_personas.md

Add table of all 22 personas with:
- Alignment (swordsman/mage/balanced)
- Tier (0/1/2/3)
- Location path

### Step 5.3: Create context_4_skills_index.md (NEW)

```markdown
# Skills Index

## Privacy-Layer (9 foundational skills)
[List with links]

## Role (26 domain skills)
[List with links]

## Persona (22 behavioral configs)
[List with links]

## Meta (1 philosophical skill)
[List with links]
```

---

## Phase 6: Validation

**Goal**: Verify integration integrity

### Step 6.1: File Count Validation

Expected counts after integration:
- `skills/privacy-layer/`: 9 directories
- `skills/role/`: 26 directories
- `skills/persona/`: 22 directories
- `skills/meta/`: 1 directory
- Total skill directories: 58

### Step 6.2: Link Validation

Run validation script to check:
- All SKILL.md files have valid YAML frontmatter
- All referenced files in `references/` exist
- All `assets/` files exist

### Step 6.3: Runtime Validation

1. Start Next.js dev server
2. Navigate to /skills page
3. Verify personas load correctly
4. Test Evoke interface with new skill context

### Step 6.4: Claude Code Validation

```bash
cd agentprivacy_master
claude --plugin .
# Verify skills are discovered
```

---

## Phase 7: Documentation Updates

### Step 7.1: Update Root README.md

Add section:
```markdown
## Skills System

This repository includes 58 Agent Skills for Claude Code integration:
- 9 Privacy-Layer skills (foundational)
- 26 Role skills (domain expertise)
- 22 Persona skills (behavioral configs)
- 1 Meta skill (philosophical)

See `MAPPING.md` for skill naming conventions.
```

### Step 7.2: Update DEVELOPER_GUIDE.md

Add skills development section explaining:
- SKILL.md format
- YAML frontmatter requirements
- References directory usage

### Step 7.3: Create skills/README.md

```markdown
# AgentPrivacy Skills

This directory contains the Agent Skills Specification implementation for AgentPrivacy.

## Structure
- `privacy-layer/` - Foundational skills (always loaded)
- `role/` - Domain expertise skills
- `persona/` - Behavioral configuration skills
- `meta/` - Philosophical/meta skills

## Usage
[Claude Code integration instructions]
```

---

## Phase 8: Cleanup

### Step 8.1: Remove Redundant Files

After validation, remove:
- `content/personas/` (if fully migrated)
- `content/skills/agentprivacy/` (if fully migrated)
- Any `.backup` directories created during reconciliation

### Step 8.2: Update .gitignore

Add:
```
# Backup files from integration
*.backup/
```

### Step 8.3: Final Commit

```bash
git add .
git commit -m "Integrate agentprivacy-skills repository (58 skills)

- Add Claude Code plugin configuration
- Add 9 privacy-layer foundational skills
- Add 26 role domain skills
- Add 22 persona behavioral configs
- Add 1 meta philosophical skill
- Update context files
- Add MAPPING.md for migration reference"
```

---

## Rollback Plan

If integration causes issues:

1. **Partial Rollback**: Remove only the problematic skill directories
2. **Full Rollback**: `git reset --hard HEAD~1` to undo commit
3. **Restore from Backup**: Use pre-integration backup

---

## Post-Integration Tasks

- [ ] Update agentprivacy-skills repo README to reference master as canonical
- [ ] Consider archiving agentprivacy-skills repo (or making it a submodule)
- [ ] Test Claude API skill loading with new paths
- [ ] Update any CI/CD pipelines referencing old paths

---

## Timeline Estimate

| Phase | Description |
|-------|-------------|
| Phase 1 | Plugin setup |
| Phase 2 | Skills directory structure |
| Phase 3 | Persona reconciliation |
| Phase 4 | Content migration |
| Phase 5 | Context file updates |
| Phase 6 | Validation |
| Phase 7 | Documentation |
| Phase 8 | Cleanup |

---

## Quick Reference Commands

```powershell
# Copy entire skills structure (PowerShell)
Copy-Item -Path "C:\Users\mitch\agentprivacy-skills\agentprivacy-skills-v4\privacy-layer" -Destination "C:\Users\mitch\agentprivacy_master\skills\privacy-layer" -Recurse

Copy-Item -Path "C:\Users\mitch\agentprivacy-skills\agentprivacy-skills-v4\role" -Destination "C:\Users\mitch\agentprivacy_master\skills\role" -Recurse

Copy-Item -Path "C:\Users\mitch\agentprivacy-skills\agentprivacy-skills-v4\persona" -Destination "C:\Users\mitch\agentprivacy_master\skills\persona" -Recurse

Copy-Item -Path "C:\Users\mitch\agentprivacy-skills\agentprivacy-skills-v4\meta" -Destination "C:\Users\mitch\agentprivacy_master\skills\meta" -Recurse

Copy-Item -Path "C:\Users\mitch\agentprivacy-skills\agentprivacy-skills-v4\.claude-plugin" -Destination "C:\Users\mitch\agentprivacy_master\.claude-plugin" -Recurse

Copy-Item -Path "C:\Users\mitch\agentprivacy-skills\MAPPING.md" -Destination "C:\Users\mitch\agentprivacy_master\MAPPING.md"
```

---

**End of Integration Plan**

*Execute phases sequentially. Validate after each phase before proceeding.*
