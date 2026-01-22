# Documentation Archive Candidates

This document identifies files that can be archived as prior/completed work.

## 📦 Category 1: Completed Merge Documentation (Historical)

These files document the merge process from `agentprivacy-zypher` to `agentprivacy`, which has been completed:

- **MERGE_CHECKLIST.md** - Checklist for merging repositories (completed)
- **MERGE_PLAN.md** - Detailed plan for the merge (completed)
- **MERGE_EXECUTION.md** - Step-by-step execution guide (completed)
- **MERGE_SUMMARY.md** - Summary of what was merged (completed)

**Status**: ✅ Merge completed - these are historical records
**Action**: Move to `archive/merge-docs/`

---

## 📦 Category 2: Completed Integration Checklists (Historical)

These are implementation checklists for features that have already been completed:

- **CANON_INTEGRATION_CHECKLIST.md** - Checklist for integrating Canon spellbook
  - **Status**: ✅ Already implemented (see `src/lib/zcash-memo.ts` with `getSpellemojiForCanonChapter`, `src/lib/soulbae.ts` with canon support)
  - **Action**: Move to `archive/integration-docs/`

- **U_ADDRESS_COMPONENT_SPEC.md** - Specification for U Address component
  - **Status**: ✅ Already implemented (see `src/components/UAddressDisplay.tsx`)
  - **Action**: Move to `archive/spec-docs/`

---

## 📦 Category 3: Completed Fix Documentation (Historical)

These document fixes that have been implemented:

- **CORS_FIX.md** - CORS fix documentation for NEAR AI
- **QUICK_CORS_FIX.md** - Quick CORS fix guide
  - **Status**: ✅ Likely completed (system is in production)
  - **Action**: Move to `archive/fix-docs/`

---

## 📦 Category 4: Completed Setup/Deployment Guides (Historical)

These are setup guides that may have been completed:

- **PUSH_TO_PRODUCTION.md** - Guide for pushing audio updates to production
  - **Status**: ⚠️ May be historical if audio is already deployed
  - **Action**: Review and move to `archive/deployment-docs/` if completed

- **WORKER_SETUP_STEPS.md** - Step-by-step Cloudflare Worker setup
- **cloudflare-worker-setup.md** - Cloudflare Worker email setup guide
  - **Status**: ⚠️ May be historical if workers are already deployed
  - **Action**: Review and move to `archive/setup-docs/` if completed

- **TUNNEL_ARCHITECTURE.md** - Cloudflare Tunnel architecture guide
  - **Status**: ⚠️ May be historical if tunnel is already set up
  - **Action**: Review and move to `archive/architecture-docs/` if completed

---

## 📦 Category 5: Potentially Historical Scripts

- **check-sync-status.ps1** - Script for checking sync status
  - **Status**: ⚠️ Review if still needed
  - **Action**: Review usage and archive if obsolete

---

## 📦 Category 6: Keep (Current/Reference)

These files should be kept as they are current or serve as reference:

- **CLOUDFLARE_DEPLOYMENT.md** - Deployment guide (keep as reference)
- **DEPLOYMENT_GUIDE.md** - General deployment guide (keep as reference)
- **PRODUCTION_READINESS.md** - Production readiness checklist (keep as reference)
- **PRODUCTION_TEST_GUIDE.md** - Production testing guide (keep as reference)
- **PRE_PUSH_SECURITY_CHECK.md** - Security checklist (keep as reference)
- **TROUBLESHOOTING.md** - Troubleshooting guide (keep as reference)
- **QUICKSTART.md** - Quick start guide (keep as reference)
- **HOW_IT_WORKS.md** - Technical explanation (keep as reference)
- **DEVELOPER_GUIDE.md** - Developer guide (keep as reference)
- **CONTRIBUTING.md** - Contribution guidelines (keep as reference)
- **README.md** - Main readme (keep)
- **STATUS.md** - Current status (keep)
- **PROJECT_OVERVIEW.md** - Project overview (keep)
- **PROJECT_STATE_AND_REVIEW.md** - Project state (keep)
- **01-SETUP.md** through **05-ROADMAP.md** - Core documentation (keep)
- **02-ARCHITECTURE.md** - Architecture docs (keep)
- **03-BUILD_GUIDE.md** - Build guide (keep)
- **04-API_REFERENCE.md** - API reference (keep)
- **SOULBAE_CONFIG.md** - Soulbae configuration (keep)
- **soulbae-character.md** - Character definition (keep)
- **soulbae-character-v2-detailed.md** - Character definition v2 (keep)
- **SPELLBOOK_DEPLOYMENT_GUIDE.md** - Spellbook deployment (keep)
- **NEAR_AI_SETUP.md** - NEAR AI setup (keep)
- **DOCUMENTATION_REVIEW.md** - Documentation review (keep)

---

## 📋 Recommended Archive Structure

```
archive/
├── merge-docs/
│   ├── MERGE_CHECKLIST.md
│   ├── MERGE_PLAN.md
│   ├── MERGE_EXECUTION.md
│   └── MERGE_SUMMARY.md
├── integration-docs/
│   ├── CANON_INTEGRATION_CHECKLIST.md
│   └── U_ADDRESS_COMPONENT_SPEC.md
├── fix-docs/
│   ├── CORS_FIX.md
│   └── QUICK_CORS_FIX.md
├── deployment-docs/
│   └── PUSH_TO_PRODUCTION.md (if completed)
├── setup-docs/
│   ├── WORKER_SETUP_STEPS.md (if completed)
│   └── cloudflare-worker-setup.md (if completed)
└── architecture-docs/
    └── TUNNEL_ARCHITECTURE.md (if completed)
```

---

## 🎯 Summary

**Total files to archive**: ~10-13 files

**Categories**:
- ✅ **Definitely Archive** (4 files): MERGE_* files
- ✅ **Definitely Archive** (2 files): CANON_INTEGRATION_CHECKLIST.md, U_ADDRESS_COMPONENT_SPEC.md
- ⚠️ **Review & Archive** (5-7 files): CORS fixes, setup guides, deployment guides
- ✅ **Keep** (30+ files): Current documentation, guides, references

