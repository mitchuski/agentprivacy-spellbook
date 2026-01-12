# Merge Plan: agentprivacy-zypher → agentprivacy Website Repository

**Date**: December 2025  
**Source Repo**: `agentprivacy-zypher` (this repo) - ✅ Production-Ready  
**Target Repo**: `https://github.com/mitchuski/agentprivacy` - ⚠️ Outdated  
**Purpose**: Replace/update the outdated website with the production-ready Proof of Proverb Revelation Protocol implementation

---

## 📋 Overview

This document outlines the strategy for merging the `agentprivacy-zypher` repository (Zypherpunk Hack 2025 implementation) into the main `agentprivacy` website repository. Since the target repo is "very much out of date," this will be more of a **replacement/update** than a traditional merge.

### Current State

**Source Repository (`agentprivacy-zypher`)** - ✅ Production-Ready:
- ✅ Next.js 16 application (static export)
- ✅ Production-ready frontend with 4 main routes:
  - `/` - Landing page
  - `/story` - Story reader (12 Acts + 30 Zero tales)
  - `/mage` - Soulbae chat interface
  - `/proverbs` - Onchain inscription gallery
- ✅ Oracle backend (`oracle-swordsman/`) - Optional, can remain separate
- ✅ Complete documentation
- ✅ Static build output in `out/` directory
- ✅ Acts 1-12 inscribed on Zcash mainnet
- ✅ All features tested and working

**Target Repository (`agentprivacy`)** - ⚠️ Outdated:
- Old version of the website
- Needs to be replaced/updated with current production code

---

## 🎯 Recommended Strategy: Full Replacement

Since the target repo is outdated, we'll do a **full replacement** with selective preservation:

### Strategy: Replace with Selective Preservation

1. **Backup old repo** - Create archive branch
2. **Replace core files** - Update with production code
3. **Preserve valuable content** - Keep any unique docs/content from old repo
4. **Update configuration** - Modernize build/deploy config
5. **Test and deploy** - Verify everything works

**Why this approach:**
- Old repo is outdated, so full replacement is cleaner
- Preserves git history if needed
- Ensures production-ready code is deployed
- Can selectively keep any valuable old content

---

## 📁 Files to Merge

### Core Frontend (Essential)
```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── story/
│   ├── mage/
│   ├── proverbs/
│   └── zero/
├── components/
│   ├── SwordsmanPanel.tsx
│   ├── DonationFlow.tsx
│   ├── UAddressDisplay.tsx
│   ├── TAddressDisplay.tsx
│   └── ...
└── lib/
    ├── zcash-memo.ts
    ├── oracle-api.ts
    └── spellbook-fetcher.ts
```

### Configuration Files
```
package.json
package-lock.json
next.config.mjs
tsconfig.json
tailwind.config.ts
postcss.config.js
```

### Static Assets
```
public/
├── assets/                   # Videos, images
├── story/markdown/           # 12 Acts markdown
└── zero/                     # 30 Tales markdown
```

### Content & Data
```
spellbook/
└── spellbook-acts.json       # Canonical proverbs

docs/                          # Documentation (optional)
```

### Build Configuration
```
serve.json                     # For static serving
server.js                      # Static server (optional)
```

---

## 🔄 Merge Steps

### Phase 1: Preparation

1. **Identify Target Repository**
   - [ ] Confirm website repository location/URL
   - [ ] Check current website structure
   - [ ] Identify potential conflicts

2. **Backup Current State**
   ```bash
   # Create backup branch
   git checkout -b backup-before-merge
   git push origin backup-before-merge
   ```

3. **Clean Up Source Repo**
   - [ ] Remove `node_modules/`
   - [ ] Remove `out/` (build artifacts)
   - [ ] Remove `.next/` (if exists)
   - [ ] Check `.gitignore` is correct

### Phase 2: Analysis

1. **Compare Structures**
   - [ ] Check if target repo uses Next.js
   - [ ] Check routing structure
   - [ ] Check styling approach (Tailwind?)
   - [ ] Check TypeScript configuration

2. **Identify Conflicts**
   - [ ] Package dependencies
   - [ ] Route conflicts (`/story`, `/mage`, `/proverbs`)
   - [ ] Component naming conflicts
   - [ ] Configuration conflicts

### Phase 3: Merge Execution

#### If Target Repo is Next.js:

1. **Merge Dependencies**
   ```bash
   # In target repo
   npm install framer-motion@^11.3.21
   npm install react-markdown@^10.1.0
   npm install rehype-raw@^7.0.0
   npm install remark-gfm@^4.0.1
   ```

2. **Copy Source Files**
   ```bash
   # Copy app routes
   cp -r agentprivacy-zypher/src/app/* target-repo/src/app/
   
   # Copy components
   cp -r agentprivacy-zypher/src/components/* target-repo/src/components/
   
   # Copy lib utilities
   cp -r agentprivacy-zypher/src/lib/* target-repo/src/lib/
   
   # Copy public assets
   cp -r agentprivacy-zypher/public/* target-repo/public/
   ```

3. **Merge Configuration**
   - Merge `next.config.mjs` settings
   - Merge `tailwind.config.ts` if using Tailwind
   - Merge `tsconfig.json` settings
   - Update `package.json` scripts if needed

#### If Target Repo is NOT Next.js:

1. **Option: Build Static and Copy**
   ```bash
   # Build static site
   cd agentprivacy-zypher
   npm run build
   
   # Copy out/ directory to target repo
   cp -r out/* target-repo/public/spellbook/
   ```

2. **Option: Convert to Static HTML**
   - Export Next.js as static HTML
   - Integrate into existing static site generator

### Phase 4: Route Integration

**Routes to Add/Integrate**:
- `/` - Landing page (may conflict - need decision)
- `/story` - Story reader
- `/mage` - Mage chat
- `/proverbs` - Proverbs gallery
- `/zero` - Zero tales (if separate from story)

**Route Strategy**:
- If routes don't conflict: Direct merge
- If routes conflict: Use subdirectory (`/spellbook/story`, etc.)
- If landing page conflicts: Integrate content into existing landing

### Phase 5: Styling Integration

**Current Styling**:
- Tailwind CSS with custom theme
- Custom color scheme (primary, secondary, accent, surface)
- Framer Motion animations

**Integration Options**:
1. **Merge Tailwind Config**: If target uses Tailwind
2. **Namespace Styles**: If target uses different CSS approach
3. **CSS Modules**: Convert if needed

### Phase 6: Environment Variables

**Variables to Configure**:
```env
NEXT_PUBLIC_ORACLE_API_URL=http://localhost:3001
NEXT_PUBLIC_SPELLBOOK_IPFS_URL=https://ipfs.io/ipfs/...
NEXT_PUBLIC_NEAR_API_KEY=... (optional)
```

### Phase 7: Testing

1. **Local Testing**
   ```bash
   npm install
   npm run dev
   # Test all routes:
   # - http://localhost:5000/
   # - http://localhost:5000/story
   # - http://localhost:5000/mage
   # - http://localhost:5000/proverbs
   ```

2. **Build Testing**
   ```bash
   npm run build
   # Verify out/ directory created
   # Test static build
   npm start
   ```

3. **Integration Testing**
   - [ ] All routes work
   - [ ] Navigation works
   - [ ] Components render correctly
   - [ ] API calls work (if oracle backend running)
   - [ ] Static assets load

### Phase 8: Deployment

1. **Update Deployment Config**
   - Vercel/Netlify/Cloudflare Pages config
   - Environment variables
   - Build settings

2. **Deploy**
   ```bash
   # If using Vercel
   vercel deploy --prod
   
   # If using Netlify
   netlify deploy --prod
   ```

---

## 🔧 Configuration Adjustments

### Next.js Config
Current config uses static export:
```js
output: 'export'
```

**If target repo needs dynamic features**:
- May need to adjust config
- Consider API routes if needed
- Adjust image optimization

### Package.json
Current scripts:
```json
{
  "dev": "next dev -p 5000",
  "build": "next build",
  "start": "serve out -p 8000"
}
```

**Adjust if needed**:
- Port conflicts
- Build process differences
- Serve method

---

## 📝 Documentation Updates

After merge, update:
- [ ] README.md - Add new routes/features
- [ ] Deployment docs - Update deployment steps
- [ ] Architecture docs - Include new components
- [ ] API docs - If oracle backend integrated

---

## ⚠️ Potential Issues & Solutions

### Issue 1: Route Conflicts
**Problem**: Target repo may have `/story` or `/mage` routes  
**Solution**: 
- Use subdirectory (`/spellbook/story`)
- Merge content into existing routes
- Use query parameters

### Issue 2: Styling Conflicts
**Problem**: Different CSS frameworks or conflicting styles  
**Solution**:
- Namespace Tailwind classes
- Use CSS modules
- Create separate style scope

### Issue 3: Dependency Conflicts
**Problem**: Version mismatches  
**Solution**:
- Update to compatible versions
- Use peer dependencies
- Isolate with separate package.json

### Issue 4: Build Process Differences
**Problem**: Different build tools/configs  
**Solution**:
- Standardize on one approach
- Use build scripts to handle differences
- Document build process

---

## 🎯 Recommended Approach

Based on the current state, I recommend:

1. **Full Integration** (Option A)
   - Merge all frontend code into website repo
   - Keep `oracle-swordsman/` as separate service (optional)
   - Maintain same route structure
   - Use static export if website is static

2. **If Routes Conflict**:
   - Use `/spellbook/` prefix for all routes
   - Update all internal links
   - Update navigation

3. **Backend**:
   - Keep `oracle-swordsman/` as separate repo/service
   - Or merge into website repo as `backend/` or `services/oracle/`

---

## ✅ Pre-Merge Checklist

- [ ] Target repository identified and accessible
- [ ] Current website structure analyzed
- [ ] Conflicts identified and resolved
- [ ] Backup created
- [ ] Dependencies reviewed
- [ ] Build process understood
- [ ] Deployment process understood
- [ ] Environment variables documented
- [ ] Testing plan created

---

## 🚀 Next Steps

1. **Confirm Target Repository**
   - Share repository URL/location
   - Or confirm if creating new repo

2. **Choose Merge Strategy**
   - Full integration
   - Subdirectory
   - Selective

3. **Execute Merge**
   - Follow phases above
   - Test thoroughly
   - Deploy

---

## 📞 Questions to Answer

Before proceeding, please confirm:

1. **What is the target website repository?**
   - URL or location?
   - Current tech stack?
   - Current structure?

2. **What merge strategy do you prefer?**
   - Full integration
   - Subdirectory
   - Selective

3. **Route handling?**
   - Keep same routes (`/story`, `/mage`, `/proverbs`)?
   - Use prefix (`/spellbook/story`)?
   - Merge into existing routes?

4. **Backend integration?**
   - Merge `oracle-swordsman/` into website repo?
   - Keep as separate service?
   - Deploy separately?

5. **Deployment target?**
   - Vercel?
   - Netlify?
   - Cloudflare Pages?
   - Self-hosted?

---

**Ready to proceed once these questions are answered!** 🎯

