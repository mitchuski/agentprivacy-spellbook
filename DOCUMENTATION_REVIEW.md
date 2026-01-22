# Documentation Review - Outdated Files
**Date:** January 2025  
**Status:** Comprehensive review of all markdown documentation files

---

## 🚨 Critical Outdated Information

### 1. Story Spellbook Act Count
**Issue:** Multiple files reference "13 acts" but the codebase has **18 acts**

**Files that need updating:**
- `SOULBAE_CONFIG.md` - Line 24, 304, 635: Says "13 acts"
- `soulbae-character.md` - Line 23: Mentions "13 acts" 
- `PROJECT_OVERVIEW.md` - Multiple references to "13 acts"
- `DEPLOYMENT_GUIDE.md` - References "13 acts"
- `PROJECT_STATE_AND_REVIEW.md` - Line 178: Says "13 acts"
- `02-ARCHITECTURE.md` - Line 91, 166: Says "13 acts"
- `README.md` - Line 221, 332: Says "13 acts"
- `docs/spellbook-canonical.md` - Line 47, 159: Says "13 acts"
- `docs/DOCUMENT_SET_OVERVIEW.md` - Line 33: Says "13 acts"
- `oracle-swordsman/docs/integration/INTEGRATION_REPORT.md` - Line 94, 227: Says "13 acts"
- `oracle-swordsman/docs/integration/SPELLBOOK_INTEGRATION.md` - Line 5: Says "13 acts"
- `01-SETUP.md` - Line 506: Says "13 acts"

**Current Reality:**
- Story Spellbook has **18 acts** (Acts I through XVIII)
- Acts 1-18 are fully implemented in `src/components/MagePanel.tsx`
- All 18 acts have markdown files in `public/story/`

**Fix Required:**
- Replace all instances of "13 acts" with "18 acts" for Story Spellbook
- Update act lists to include Acts XIII-XVIII:
  - Act XIII: The Book of Promises
  - Act XIV: Rain on the Mountain of Entropy
  - Act XV: Running in Shackles Through the Dark Forest
  - Act XVI: When Pools Become Wells
  - Act XVII: Bonfire in the Dark Forest
  - Act XVIII: A Mirror in Dust, Vibed into Scrying Glass

---

### 2. Spellbook Coverage
**Issue:** Documentation only mentions Story and Zero spellbooks, but codebase has 5 spellbooks

**Files that need updating:**
- `SOULBAE_CONFIG.md` - Only mentions Story (13 acts) and Zero (30 tales)
- `soulbae-character.md` - Line 23: Only mentions Story, Zero, and Canon
- `PROJECT_OVERVIEW.md` - Likely incomplete spellbook list
- `DEPLOYMENT_GUIDE.md` - References only Story and Zero

**Current Reality:**
The codebase implements **5 spellbooks**:
1. **Story** - 18 acts (not 13)
2. **Zero** - 30 tales ✅ (correctly documented)
3. **Canon** - 10 chapters (Chapter 0-10, plus Guardian/Chapter 12)
4. **Society** - 17 chapters
5. **Plurality** - 30 acts

**Evidence:**
- `src/components/MagePanel.tsx` lines 12-21 define all 5 spellbooks
- `src/app/evoke/page.tsx` has all 5 spellbooks
- All spellbooks have corresponding pages in `src/app/`

**Fix Required:**
- Update all documentation to list all 5 spellbooks
- Update RAG training data references to include all spellbooks
- Update Soulbae character file to mention all spellbooks

---

### 3. Soulbae Character File (`soulbae-character.md`)
**Issues:**
- Line 23: Says "trained on the First Person Spellbook, Zero Knowledge Spellbook, and Canon Spellbook" - missing Society and Plurality
- References "13 acts" instead of "18 acts"
- May not reflect current implementation details

**Current Implementation:**
- Soulbae is integrated via NEAR Cloud AI API (`src/lib/soulbae.ts`)
- Uses system prompts that reference all spellbooks
- Supports taleId-based context switching
- Privacy budget: 6 queries per session (not 16 as some docs say)

**Fix Required:**
- Update to mention all 5 spellbooks
- Update act count to 18
- Verify all examples match current behavior
- Update privacy budget to 6 (MAX_QUERIES in MagePanel.tsx)

---

### 4. SOULBAE_CONFIG.md
**Issues:**
- Line 24: "RAG-trained - Understands Story Spellbook (13 acts)" - should be 18 acts
- Line 36: "spellbook-rag.json # Training data (30 tales)" - should mention all spellbooks
- Line 304: "Tale Content: Story Spellbook (13 acts)" - should be 18 acts
- Line 635: Checklist says "13 acts" - should be 18 acts
- References old file structure (`soulbae/` directory) that may not exist
- References NEAR Cloud AI deployment commands that may not match current setup

**Current Implementation:**
- Soulbae uses NEAR Cloud AI API directly (`https://cloud-api.near.ai/v1`)
- No separate `soulbae/` directory with shade-agent config
- Uses environment variables: `NEXT_PUBLIC_NEAR_API_KEY`, `NEXT_PUBLIC_NEAR_API_URL`, `NEXT_PUBLIC_NEAR_MODEL`
- Privacy budget is 6 queries (not 16)
- No TEE attestation in current implementation (uses direct API calls)

**Fix Required:**
- Update all act counts
- Update to reflect current API-based implementation
- Remove references to shade-agent deployment if not used
- Update privacy budget to 6
- Update file structure to match actual codebase

---

### 5. DEPLOYMENT_GUIDE.md
**Issues:**
- References old repository structure (`agentprivacy-zypher`, `zkspellbook-final`)
- References NEAR Cloud AI setup that may not match current implementation
- References "13 acts" instead of "18 acts"
- May reference old deployment methods

**Current Reality:**
- Repository is `agentprivacy_master`
- Uses Next.js static export
- Deploys to Cloudflare Pages (based on `cloudflare-worker-setup.md`)
- NEAR AI setup is simpler (just environment variables, see `NEAR_AI_SETUP.md`)

**Fix Required:**
- Update repository references
- Update deployment steps to match current process
- Update act counts
- Reference `NEAR_AI_SETUP.md` for NEAR AI configuration

---

### 6. PROJECT_OVERVIEW.md
**Issues:**
- Likely references old architecture
- May have outdated spellbook counts
- May reference features that don't exist or have changed

**Fix Required:**
- Full review needed
- Update spellbook counts
- Verify all features mentioned actually exist
- Update architecture diagrams if present

---

### 7. PROJECT_STATE_AND_REVIEW.md
**Issues:**
- Line 178: Says "13 acts + 30 tales" - should be "18 acts + 30 tales"
- May have outdated status information
- May reference old features

**Fix Required:**
- Update act count
- Verify all status information is current
- Update feature lists

---

### 8. Architecture and Setup Files
**Files to review:**
- `02-ARCHITECTURE.md` - Likely has outdated spellbook counts
- `01-SETUP.md` - May have outdated setup instructions
- `03-BUILD_GUIDE.md` - May need updating
- `04-API_REFERENCE.md` - May need updating for current API structure

---

### 9. Oracle Swordsman Documentation
**Files to review:**
- `oracle-swordsman/docs/integration/INTEGRATION_REPORT.md` - Says "13 acts"
- `oracle-swordsman/docs/integration/SPELLBOOK_INTEGRATION.md` - Says "13 acts"
- May need updates to reflect current spellbook structure

---

## ✅ Files That Appear Current

These files seem to be up-to-date or less critical:
- `NEAR_AI_SETUP.md` - Current implementation details
- `QUICKSTART.md` - Likely current
- `TROUBLESHOOTING.md` - May need minor updates
- `README.md` - Needs act count update but otherwise may be OK

---

## 📋 Recommended Action Plan

### Priority 1: Critical Updates (Do First)
1. **Update all "13 acts" → "18 acts"** across all files
2. **Update spellbook lists** to include all 5 spellbooks (Story, Zero, Canon, Society, Plurality)
3. **Update `soulbae-character.md`** to reflect all spellbooks and correct act counts
4. **Update `SOULBAE_CONFIG.md`** to match current implementation

### Priority 2: Architecture Updates
1. **Review `PROJECT_OVERVIEW.md`** - Full update needed
2. **Review `DEPLOYMENT_GUIDE.md`** - Update to current deployment process
3. **Review `02-ARCHITECTURE.md`** - Update spellbook counts and structure

### Priority 3: Supporting Documentation
1. **Update oracle-swordsman docs** - Fix act counts
2. **Review `PROJECT_STATE_AND_REVIEW.md`** - Update status and counts
3. **Review setup/build guides** - Ensure they match current process

---

## 🔍 Verification Checklist

Before marking documentation as updated, verify:
- [ ] All "13 acts" references changed to "18 acts"
- [ ] All spellbook lists include all 5 spellbooks
- [ ] Act/chapter counts match codebase:
  - Story: 18 acts ✅
  - Zero: 30 tales ✅
  - Canon: 10 chapters (+ Guardian) ✅
  - Society: 17 chapters ✅
  - Plurality: 30 acts ✅
- [ ] Privacy budget matches code (6 queries, not 16)
- [ ] File structure references match actual codebase
- [ ] API endpoints match current implementation
- [ ] Deployment steps match current process
- [ ] Repository references are correct

---

## 📝 Notes

- The codebase has evolved significantly since initial documentation
- Many docs were written when Story had 13 acts, but it now has 18
- The spellbook ecosystem has expanded from 2 to 5 spellbooks
- Implementation details (NEAR AI, deployment) have simplified
- Some docs reference features (TEE attestation, shade-agent) that may not be in current implementation

---

**Last Updated:** January 2025  
**Next Review:** After documentation updates are complete

