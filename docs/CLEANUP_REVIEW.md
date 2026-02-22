# Repository Cleanup Review

Review of files that may be redundant, historical, or no longer needed.

---

## Category 1: Planning/Session Documents (Likely Redundant)

These appear to be AI session planning docs that helped build features:

| File | Purpose | Recommendation |
|------|---------|----------------|
| `PROVERBS_AND_FLOW_CLEANUP.md` | Session planning doc for proverbs work | DELETE - session artifact |
| `SKILLS_PAGE_PLAN.md` | Planning doc for skills page (45KB!) | ARCHIVE or DELETE - work done |
| `SKILLS_PROVERB_INDEX.md` | Index created during session | ARCHIVE or DELETE |
| `SKILLS_README.md` | Skills documentation | KEEP if used, else DELETE |
| `SPELLBOOK_TEMPLATES.md` | Template documentation | REVIEW - may be stale |

---

## Category 2: Docs Directory (Session Artifacts)

Files in `docs/` from recent sessions:

| File | Purpose | Recommendation |
|------|---------|----------------|
| `docs/BGIN_AGENTPRIVACY_CONVERGENCE.md` | Convergence planning | KEEP - reference for future work |
| `docs/BGIN_IMPLEMENTATION_PLAN.md` | Implementation steps | KEEP - roadmap reference |
| `docs/CEREMONY_CONSTELLATION_PLAN.md` | Ceremony enhancement plan | KEEP - next feature plan |
| `docs/CHRONICLE_NAV_AND_BGIN.md` | Navigation planning | REVIEW - may be stale |
| `docs/PROVERBS_SYSTEM.md` | Proverbs architecture | KEEP - active documentation |
| `docs/DOCUMENT_SET_OVERVIEW.md` | Document overview | REVIEW - may be stale |
| `docs/oracleswordsmanproofofproverbblogzypherpunk.md` | Blog post content | ARCHIVE - content piece |
| `docs/understanding-as-key.md` | Blog/concept piece | ARCHIVE - content piece |
| `docs/spellbook-canonical.md` | Canonical spellbook | REVIEW - may duplicate JSON |
| `docs/complete-spellbook-v5.0.0-canonical.json` | JSON spellbook data | KEEP - data file |

---

## Category 3: Root Level Documentation Overload

The root has 30+ markdown files. Consider consolidating:

### Definitely Keep
- `README.md` - Main readme
- `CONTRIBUTING.md` - Contribution guide
- `LICENSE` - License file

### Core Documentation (Keep or Consolidate)
- `01-SETUP.md`, `02-ARCHITECTURE.md`, `03-BUILD_GUIDE.md`, `04-API_REFERENCE.md`, `05-ROADMAP.md`
  - **Recommendation**: Keep, or consolidate into `docs/` folder

### Deployment/Operations (Keep)
- `CLOUDFLARE_DEPLOYMENT.md`
- `DEPLOYMENT_GUIDE.md`
- `PRODUCTION_READINESS.md`
- `PRODUCTION_TEST_GUIDE.md`
- `QUICKSTART.md`
- `TROUBLESHOOTING.md`
- `NEAR_AI_SETUP.md`

### Possibly Redundant/Stale
| File | Notes | Recommendation |
|------|-------|----------------|
| `DEVELOPER_GUIDE.md` | May overlap with BUILD_GUIDE | REVIEW |
| `HOW_IT_WORKS.md` | May overlap with ARCHITECTURE | REVIEW |
| `PROJECT_OVERVIEW.md` | May overlap with README | REVIEW |
| `PROJECT_STATE_AND_REVIEW.md` | Snapshot in time | ARCHIVE |
| `DOCUMENTATION_REVIEW.md` | Meta-documentation | DELETE |
| `PRE_PUSH_SECURITY_CHECK.md` | Checklist | KEEP |
| `STATUS.md` | Status snapshot | UPDATE or DELETE |

### Soulbae Files (Keep or Consolidate)
- `soulbae-character.md`
- `soulbae-character-v2-detailed.md`
- `SOULBAE_CONFIG.md`
  - **Recommendation**: Consolidate into one file or move to `docs/soulbae/`

### Spellbook Documentation
- `SPELLBOOK_DEPLOYMENT_GUIDE.md`
- `SPELLBOOK_TEMPLATES.md`
  - **Recommendation**: Move to `docs/spellbook/`

---

## Category 4: Archive Directory

Already have archived docs in `archive/`. This is good! Contains:
- `archive/merge-docs/` - Completed merge documentation
- `archive/deployment-docs/` - Historical deployment docs
- `archive/fix-docs/` - Historical fix docs
- `archive/architecture-docs/` - Historical architecture docs
- `archive/setup-docs/` - Historical setup docs
- `archive/integration-docs/` - Historical integration docs

**Recommendation**: Archive structure is good. Continue using it.

---

## Category 5: Scripts Directory

Files in `scripts/`:

| File | Purpose | Recommendation |
|------|---------|----------------|
| `merge-to-website.ps1` | Merge script | ARCHIVE - if merge done |
| `schema.sql` | DB schema | KEEP if DB used |
| `setup-postgresql.ps1` | DB setup | ARCHIVE - if not using PostgreSQL |
| `setup-zcash-wallet.ps1` | Zcash setup | KEEP - operational |
| `setup-zcash-wallet-interactive.ps1` | Zcash setup | KEEP - operational |
| `test-flow.sh` | Test script | KEEP |
| `test-requirements.ps1` | Test script | KEEP |
| `update-inscriptions-static.ps1` | Update inscriptions | KEEP - operational |
| `verify-rust-path.ps1` | Rust verification | ARCHIVE - one-time setup |

---

## Category 6: Root Level Scripts

| File | Purpose | Recommendation |
|------|---------|----------------|
| `check-sync-status.ps1` | Sync checking | ARCHIVE - if not used |
| `cloudflare-worker-email.js` | CF Worker code | KEEP if deployed |
| `cloudflare-worker-proxy.js` | CF Worker code | KEEP if deployed |
| `server.js` | Local server | KEEP |
| `setup-db-with-password.ps1` | DB setup | ARCHIVE - if not using |
| `setup-keys.sh` | Key setup | KEEP - operational |

---

## Category 7: Oracle-Swordsman Directory

The `oracle-swordsman/` directory contains many inscription scripts:

| Pattern | Count | Recommendation |
|---------|-------|----------------|
| `inscribe-act*-final.js` | Multiple | ARCHIVE - one-time use |
| `inscribe-act*.js` | Multiple | ARCHIVE - one-time use |
| `generate-acts-*.js` | Multiple | ARCHIVE - one-time use |
| `.env` | 1 | KEEP - operational |
| `check-*.js` | Multiple | REVIEW - may be operational |

**Recommendation**: Most inscription scripts were one-time use. Archive completed acts, keep monitoring scripts.

---

## Category 8: Misc Root Files

| File | Purpose | Recommendation |
|------|---------|----------------|
| `ARCHITECTURE_DIAGRAM.txt` | ASCII diagram | KEEP or move to docs |
| `serve.json` | Serve config | KEEP - config |
| `docker-compose.yml` | Docker config | REVIEW - is Docker used? |
| `wrangler.toml` | CF config | KEEP - config |

---

## Recommended Actions Summary

### Immediate Deletions (Session Artifacts)
1. `DOCUMENTATION_REVIEW.md` - meta doc
2. `PROVERBS_AND_FLOW_CLEANUP.md` - session planning

### Archive (Completed Work)
1. `SKILLS_PAGE_PLAN.md` → `archive/planning/`
2. `SKILLS_PROVERB_INDEX.md` → `archive/planning/`
3. `PROJECT_STATE_AND_REVIEW.md` → `archive/`
4. `docs/oracleswordsmanproofofproverbblogzypherpunk.md` → `archive/content/`
5. `docs/understanding-as-key.md` → `archive/content/`
6. `oracle-swordsman/inscribe-*` scripts → `archive/inscription-scripts/`

### Move to Docs Subdirectories
1. Soulbae files → `docs/soulbae/`
2. Spellbook files → `docs/spellbook/`
3. Numbered docs (01-05) → `docs/guides/`

### Review for Staleness
1. `STATUS.md` - is it current?
2. `docs/CHRONICLE_NAV_AND_BGIN.md` - still relevant?
3. `docs/DOCUMENT_SET_OVERVIEW.md` - still relevant?
4. `docker-compose.yml` - is Docker being used?
5. PostgreSQL scripts - is DB being used?

---

## Quick Cleanup Commands

```bash
# Create archive subdirectories
mkdir -p archive/planning archive/content archive/inscription-scripts

# Move session planning docs
mv SKILLS_PAGE_PLAN.md archive/planning/
mv SKILLS_PROVERB_INDEX.md archive/planning/
mv PROVERBS_AND_FLOW_CLEANUP.md archive/planning/

# Delete meta docs
rm DOCUMENTATION_REVIEW.md

# Move content pieces
mv docs/oracleswordsmanproofofproverbblogzypherpunk.md archive/content/
mv docs/understanding-as-key.md archive/content/

# Archive inscription scripts (from oracle-swordsman/)
mv oracle-swordsman/inscribe-*.js archive/inscription-scripts/
mv oracle-swordsman/generate-*.js archive/inscription-scripts/
```

---

## File Count Summary

| Category | Count | Action |
|----------|-------|--------|
| Root .md files | 30 | Consolidate/organize |
| docs/ files | 12 | Keep most, archive 2 |
| archive/ files | Already organized | Good |
| scripts/ | 10 | Archive 3-4 |
| oracle-swordsman/ | 20+ | Archive inscription scripts |

**Estimated reduction**: 15-20 files can be archived or deleted

---

## Category 9: Directory Assessment

### Directory Sizes (Sorted)

| Directory | Size | Status |
|-----------|------|--------|
| `spellbook/` | 40K | KEEP - active data |
| `scripts/` | 56K | KEEP - some can archive |
| `archive/` | 120K | KEEP - organized archives |
| `docs/` | 428K | KEEP - clean up some files |
| `src/` | 2.1M | KEEP - source code |
| `oracle-swordsman/` | **175M** | REVIEW - has nested node_modules |
| `node_modules/` | 445M | KEEP - dependencies |
| `out/` | **1.2G** | REGENERATED - can delete before commit |
| `public/` | **1.2G** | KEEP - but large media files |

### Large Directories Analysis

#### `public/` (1.2GB) - Media Assets
| Subdirectory | Size | Contents | Recommendation |
|--------------|------|----------|----------------|
| `assets/` | 813M | Act MP4 videos (23 files) | KEEP - core content |
| `audio_soulbae/` | 393M | MP3 audio files | KEEP - core content |
| `society/` | 2.6M | Society spellbook content | KEEP |
| `story/` | 544K | Story content | KEEP |
| `plurality/` | 496K | Plurality content | KEEP |
| `zero/` | 380K | Zero content | KEEP |
| `canon/` | 236K | Canon content | KEEP |
| `persona/` | 192K | Persona assets | KEEP |
| `skills/` | 160K | Skills assets | KEEP |
| `privacy/` | 48K | Privacy content | KEEP |
| `data/` | 16K | Data files | KEEP |

**Note**: Media files are large but necessary. Consider external hosting (CDN) for production.

#### `oracle-swordsman/` (175M) - Inscription Tools
| Subdirectory | Size | Contents | Recommendation |
|--------------|------|----------|----------------|
| `node_modules/` | **171M** | Nested dependencies | DELETE or .gitignore |
| `logs/` | 1.4M | Log files | DELETE - not needed in repo |
| `dist/` | 1.2M | Build output | DELETE - regenerated |
| `legacy/` | 404K | Old scripts (15+ files) | ARCHIVE |
| `scripts/` | 188K | Utility scripts | REVIEW |
| `docs/` | 80K | Documentation | KEEP |
| `src/` | 24K | Source code | KEEP |
| `tests/` | 8K | Tests | KEEP |
| `temp/` | 0 | Empty | DELETE |

**37 JS files in root** - Most are one-time inscription scripts. Archive completed work.

#### `out/` (1.2GB) - Build Output
- Static export output from `next build`
- Regenerated on every build
- **Should NOT be committed to git** (add to .gitignore if not already)

#### `.next/` - Dev Build Cache
- Development build cache
- Should be in .gitignore

#### `.wrangler/` - Cloudflare Cache
- Contains `tmp/` directory
- Should be in .gitignore

---

## Category 10: Potentially Stale Directories

### `docs/chronicles/` (144K)
Contains inscription chronicles for Acts 1-12:
- `ACT1_INSCRIPTION_CHRONICLE.md` through `ACT12_INSCRIPTION_CHRONICLE.md`
- **Status**: Historical records of inscription process
- **Recommendation**: ARCHIVE to `archive/chronicles/` - one-time records

### `spellbook/` (40K)
Contains `spellbook-acts.json` (39KB)
- **Status**: Active data file
- **Recommendation**: KEEP

### `oracle-swordsman/legacy/` (404K)
Contains 15+ old scripts:
- `check-act3-memo.js`, `check-memos.js`, etc.
- Various debugging/testing scripts
- **Status**: Historical, likely not needed
- **Recommendation**: Already in legacy folder - good. Could delete entirely.

### `oracle-swordsman/logs/` (1.4M)
Contains:
- `proverb-protocol.log` (296KB)
- `proverb-protocol-combined.log` (1.1MB)
- **Status**: Development logs
- **Recommendation**: DELETE - should not be in repo

---

## Category 11: Git Hygiene

### Should Be in .gitignore (if not already)

```gitignore
# Build outputs
out/
.next/
dist/

# Dependencies
node_modules/
oracle-swordsman/node_modules/

# Logs
*.log
oracle-swordsman/logs/

# Temp files
.wrangler/
oracle-swordsman/temp/

# Environment
.env
.env.local
oracle-swordsman/.env
```

### Current .gitignore Status

The `.gitignore` already has:
- `/node_modules` - Root node_modules
- `/.next/` - Next.js build cache
- `/out/` - Static export output

**Missing from .gitignore**:
- `oracle-swordsman/node_modules/` - Nested dependencies (171M!)
- `oracle-swordsman/logs/` - Log files
- `oracle-swordsman/dist/` - Build output
- `oracle-swordsman/temp/` - Temp files
- `.wrangler/` - Cloudflare cache
- `*.log` - General log files

### Suggested .gitignore Additions

```gitignore
# Oracle swordsman build artifacts
oracle-swordsman/node_modules/
oracle-swordsman/logs/
oracle-swordsman/dist/
oracle-swordsman/temp/

# Cloudflare
.wrangler/

# Additional logs
*.log
```

---

## Disk Space Savings Potential

| Action | Space Saved |
|--------|-------------|
| Remove `oracle-swordsman/node_modules/` | ~171M |
| Remove `oracle-swordsman/logs/` | ~1.4M |
| Remove `oracle-swordsman/dist/` | ~1.2M |
| Remove `out/` (if committed) | ~1.2G |
| Archive inscription scripts | - (organization) |

**Total potential savings**: ~1.4GB if `out/` is committed

---

## Recommended Directory Cleanup Commands

```bash
# Remove nested node_modules (if not needed for deployment)
rm -rf oracle-swordsman/node_modules

# Remove logs
rm -rf oracle-swordsman/logs

# Remove build outputs
rm -rf oracle-swordsman/dist
rm -rf oracle-swordsman/temp

# Archive chronicles
mv docs/chronicles archive/

# Archive legacy oracle scripts
mv oracle-swordsman/legacy archive/oracle-legacy

# Archive inscription scripts (keep only active ones)
mkdir -p archive/inscription-scripts
mv oracle-swordsman/inscribe-*.js archive/inscription-scripts/
mv oracle-swordsman/generate-*.js archive/inscription-scripts/
```

---

## Summary: Directory Health

| Directory | Health | Action |
|-----------|--------|--------|
| `src/` | Good | None |
| `public/` | Large but necessary | Consider CDN |
| `docs/` | Needs cleanup | Archive old files |
| `scripts/` | Good | Archive some |
| `archive/` | Good | Continue using |
| `spellbook/` | Good | None |
| `oracle-swordsman/` | Bloated | Major cleanup needed |
| `out/` | Should not commit | Add to .gitignore |
| `.next/` | Dev cache | Should be ignored |
| `.wrangler/` | CF cache | Should be ignored |
| `node_modules/` | Normal | Ignored |

**Priority**: Clean up `oracle-swordsman/` directory - it has 175M that shouldn't be in the repo
