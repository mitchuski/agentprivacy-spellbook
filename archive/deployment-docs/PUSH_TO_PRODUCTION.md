# Push to Production - Website Branch Instructions

## Overview
This document provides clear instructions for pushing the story spellbook audio updates to the production `website` branch of the `agentprivacy` repository, while **excluding** the canon spellbook files.

---

## ✅ WHAT IS BEING PUSHED

### 1. Audio Files (Story Spellbook)
All 14 audio files in `public/audio_soulbae/`:
- `00_firstpage.mp3` - First page audio
- `01_Venice, 1494—The Drake's First Whisper.mp3` - Act I
- `02_The Dual Ceremony—Sovereignty Divided to Be Extended.mp3` - Act II
- `03_The Drake's Teaching—The First Fracture.mp3` - Act III
- `04_Blade Alone—The Swordsman's Path.mp3` - Act IV
- `05_Light Armour—The Mage's Protection.mp3` - Act V
- `06_Trust Graph Plane—The Network of Truth.mp3` - Act VI
- `07_The Mirror That Never Completes.mp3` - Act VII
- `08_Ancient Rule—The Law of Two.mp3` - Act VIII
- `09_Zcash Shield—Forging Privacy.mp3` - Act IX
- `10_Topology of Revelation.mp3` - Act X
- `11_Balanced Spiral of Sovereignty.mp3` - Act XI
- `12_Forgetting_Proverbiogenesis.mp3` - Act XII
- `13_lastpage.mp3` - Last page audio

### 2. Story Page Updates
- `src/app/story/page.tsx` - Complete audio player integration with:
  - `ActAudioPlayer` component with progress bar (health bar style)
  - "🔮 Listen" text and play/pause controls
  - Mobile-responsive layout
  - Audio mapping for all 14 acts (0-12, 14)
  - Console logs conditionally disabled for production

### 3. Story Markdown Files
All updated markdown files in `public/story/markdown/`:
- `00-privacymage-firstpage.md`
- `01-act-i-venice.md`
- `02-act-ii-dual-ceremony.md`
- `03-act-iii-drakes-teaching.md`
- `04-act-iv-blade-alone.md`
- `05-act-v-light-armour.md`
- `06-act-vi-trust-graph-plane.md`
- `07-act-vii-theantimirrorenhanced.md`
- `08-act-viii-ancient-rule.md`
- `09-act-ix-zcash-shield.md`
- `10-topology-of-revelation.md`
- `11-act-xi-balanced-spiral-of-sovereignty.md`
- `12-act-xii-the-forgetting.md`
- `111-privacymage-lastpage.md` (mapped as act 14)

### 4. Navigation Updates
Canon links **removed** from all navigation headers:
- `src/app/page.tsx` - Landing page navigation
- `src/app/story/page.tsx` - Story page navigation
- `src/app/proverbs/page.tsx` - Proverbs page navigation
- `src/app/mage/page.tsx` - Mage page navigation

### 5. Mage Page Updates
- `src/app/mage/page.tsx` - Canon section shows "🔒 Locked - Coming Soon" (non-interactive)

### 6. Git Configuration
- `.gitignore` - Updated to exclude canon files:
  ```
  # canon spellbook (excluded from git)
  /public/canon/
  /src/app/canon/
  ```

---

## ❌ WHAT IS NOT BEING PUSHED (Excluded via .gitignore)

### Canon Spellbook Files
- `/public/canon/` - All canon markdown files and assets
- `/src/app/canon/` - Canon page component
- These files remain in your local repository but are **excluded from Git tracking**

### Other Excluded Files (Standard)
- `node_modules/`
- `.env` files (except `.env.example`)
- Build artifacts (`/.next/`, `/out/`, `/build/`)
- Log files
- Sensitive keys and secrets
- Database files

---

## 📋 PREPARATION STATUS

### ✅ Already Completed

1. **Branch Created**: `website` branch created locally
2. **Files Staged**: All changes have been staged with `git add -A`
3. **Commit Ready**: Changes committed with message:
   ```
   "Add audio player to story spellbook with all audio files, remove canon from navigation, exclude canon from production"
   ```
4. **Gitignore Configured**: Canon files are excluded via `.gitignore`
5. **Remote Configured**: Remote `agentprivacy` points to `https://github.com/mitchuski/agentprivacy.git`
6. **Credential Helper**: Windows Credential Manager configured for authentication

### ⚠️ Verification Needed

Before pushing, verify:
- [ ] You have a GitHub Personal Access Token ready (if not authenticated)
- [ ] The `website` branch exists locally: `git branch` should show `* website`
- [ ] All changes are committed: `git status` should show "nothing to commit"

---

## 🚀 STEP-BY-STEP PUSH INSTRUCTIONS

### Step 1: Verify Current State
```powershell
cd c:\Users\mitch\agentprivacy_zypher
git status
git branch
```

**Expected Output:**
- Current branch: `website` (marked with `*`)
- Status: "nothing to commit, working tree clean" (or shows only untracked files that are gitignored)

### Step 2: Verify Remote Configuration
```powershell
git remote -v
```

**Expected Output:**
```
agentprivacy  https://github.com/mitchuski/agentprivacy.git (fetch)
agentprivacy  https://github.com/mitchuski/agentprivacy.git (push)
```

### Step 3: Push to Production
```powershell
git push -u agentprivacy website
```

**What Happens:**
- If authenticated: Push will proceed automatically
- If not authenticated: You'll be prompted for credentials:
  - **Username**: Your GitHub username
  - **Password**: Use a Personal Access Token (NOT your GitHub password)
    - Create token at: https://github.com/settings/tokens/new
    - Name: `agentprivacy-push`
    - Expiration: Your choice
    - Scopes: Check `repo` (full control of private repositories)
    - Click "Generate token" and copy it immediately
    - Paste the token as the password

### Step 4: Verify Push Success
```powershell
git ls-remote --heads agentprivacy website
```

**Expected Output:**
- Should show a commit hash, confirming the branch exists on remote

### Step 5: Confirm on GitHub
Visit: https://github.com/mitchuski/agentprivacy/tree/website

You should see:
- All audio files in `public/audio_soulbae/`
- Updated story page with audio player
- Updated navigation (no canon links)
- Updated mage page with locked canon section
- **NO** canon files in `/public/canon/` or `/src/app/canon/`

---

## 🔍 TROUBLESHOOTING

### Error: "src refspec website does not match any"
**Solution**: The `website` branch doesn't exist locally. Create it:
```powershell
git checkout -b website
git add -A
git commit -m "Add audio player to story spellbook with all audio files, remove canon from navigation, exclude canon from production"
git push -u agentprivacy website
```

### Error: "Authentication failed" or "Permission denied"
**Solution**: 
1. Create a Personal Access Token at https://github.com/settings/tokens/new
2. Use the token as your password (not your GitHub password)
3. Ensure the token has `repo` scope

### Error: "Remote branch website already exists"
**Solution**: This is normal if the branch exists on remote. Use:
```powershell
git push agentprivacy website
```
Or force push (only if you're sure):
```powershell
git push -f agentprivacy website
```

### Canon Files Appearing in Push
**Solution**: Verify `.gitignore` contains:
```
/public/canon/
/src/app/canon/
```
Then check what's being tracked:
```powershell
git ls-files | Select-String -Pattern "canon"
```
If canon files appear, they were committed before `.gitignore` was updated. Remove them:
```powershell
git rm -r --cached public/canon/ src/app/canon/
git commit -m "Remove canon files from tracking"
git push agentprivacy website
```

---

## 📝 SUMMARY

**What's Included:**
- ✅ 14 audio files for story spellbook
- ✅ Audio player component with progress bar
- ✅ Updated story markdown files
- ✅ Navigation headers (canon links removed)
- ✅ Mage page (canon section locked)
- ✅ Updated `.gitignore` (canon excluded)

**What's Excluded:**
- ❌ All canon spellbook files (`/public/canon/`, `/src/app/canon/`)
- ❌ Standard build artifacts and sensitive files

**Ready to Push:**
- ✅ Branch: `website`
- ✅ Remote: `agentprivacy` → `https://github.com/mitchuski/agentprivacy.git`
- ✅ Commit: Ready with descriptive message
- ✅ Authentication: Configured (may need token on first push)

---

## 🎯 FINAL COMMAND

When ready, execute:
```powershell
cd c:\Users\mitch\agentprivacy_zypher
git push -u agentprivacy website
```

If authentication is required, use your GitHub username and a Personal Access Token (with `repo` scope) as the password.

---

**Last Updated**: Current session
**Repository**: https://github.com/mitchuski/agentprivacy
**Target Branch**: `website`
**Status**: Ready for production push
