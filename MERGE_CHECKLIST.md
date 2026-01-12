# Merge Checklist: agentprivacy-zypher → agentprivacy Website

Use this checklist to ensure a smooth merge process.

---

## 📋 Pre-Merge Preparation

### Source Repo (agentprivacy-zypher)
- [ ] All changes committed
- [ ] All changes pushed to GitHub
- [ ] No uncommitted work
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass (if any)
- [ ] Documentation is up to date

### Target Repo (agentprivacy)
- [ ] Repository cloned locally
- [ ] Current state reviewed
- [ ] Any valuable content identified for preservation
- [ ] Backup branch created
- [ ] Ready to merge

### Environment
- [ ] Node.js 18+ installed
- [ ] Git configured
- [ ] Access to both repositories
- [ ] Deployment platform access (Vercel/Netlify/etc.)

---

## 🔄 Merge Execution

### Step 1: Backup
- [ ] Navigate to website repo
- [ ] Create backup branch: `git checkout -b backup-before-merge-YYYYMMDD`
- [ ] Push backup: `git push origin backup-before-merge-YYYYMMDD`
- [ ] Return to main branch

### Step 2: Add Remote
- [ ] Add zypher repo as remote: `git remote add zypher-source https://github.com/mitchuski/agentprivacy-zypher.git`
- [ ] Fetch: `git fetch zypher-source`
- [ ] Verify remote added: `git remote -v`

### Step 3: Merge
- [ ] Merge with strategy: `git merge -s ours --allow-unrelated-histories --no-commit zypher-source/main`
- [ ] Remove old files (except .git)
- [ ] Copy files from zypher: `git checkout zypher-source/main -- .`
- [ ] Remove oracle-swordsman if keeping separate
- [ ] Stage changes: `git add .`
- [ ] Commit merge: `git commit -m "Replace with production-ready implementation"`

### Step 4: Clean Up
- [ ] Remove temporary remote: `git remote remove zypher-source`
- [ ] Verify structure: `ls -la`
- [ ] Check key files exist

---

## ✅ Post-Merge Verification

### Local Testing
- [ ] Install dependencies: `npm install`
- [ ] Build succeeds: `npm run build`
- [ ] Dev server works: `npm run dev`
- [ ] Landing page loads: `http://localhost:5000/`
- [ ] Story page works: `http://localhost:5000/story`
- [ ] Mage page works: `http://localhost:5000/mage`
- [ ] Proverbs page works: `http://localhost:5000/proverbs`
- [ ] Navigation works between pages
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All assets load

### Git Verification
- [ ] Commit history looks correct: `git log --oneline`
- [ ] Backup branch exists: `git branch -a`
- [ ] Ready to push: `git status`

---

## 🚀 Deployment Preparation

### Repository Updates
- [ ] Push to GitHub: `git push origin main`
- [ ] Update repository description (if needed)
- [ ] Update repository topics/tags
- [ ] Verify GitHub Pages settings (if used)

### Deployment Platform (Vercel/Netlify/Cloudflare)
- [ ] Connect repository (if not already)
- [ ] Update build settings:
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `out`
  - [ ] Node version: `18` or higher
- [ ] Set environment variables:
  - [ ] `NEXT_PUBLIC_ORACLE_API_URL` (if using oracle)
  - [ ] `NEXT_PUBLIC_SPELLBOOK_IPFS_URL` (if needed)
  - [ ] `NEXT_PUBLIC_NEAR_API_KEY` (if using NEAR AI)
- [ ] Update domain settings (if using agentprivacy.ai)
- [ ] Trigger deployment

### Post-Deployment Testing
- [ ] Website loads: `https://agentprivacy.ai`
- [ ] All routes work
- [ ] No 404 errors
- [ ] Assets load correctly
- [ ] API calls work (if applicable)
- [ ] Mobile works
- [ ] Performance is good

---

## 📝 Documentation Updates

- [ ] Update README.md (if needed)
- [ ] Update deployment documentation
- [ ] Archive old documentation (if needed)
- [ ] Update any external links
- [ ] Update project status

---

## 🎯 Final Verification

### Functionality
- [ ] Landing page displays correctly
- [ ] Story reader works (all 12 Acts)
- [ ] Zero tales work (all 30 tales)
- [ ] Mage chat interface works
- [ ] Proverbs gallery displays inscriptions
- [ ] Navigation is smooth
- [ ] Forms work (if any)
- [ ] Links work

### Technical
- [ ] No build errors
- [ ] No runtime errors
- [ ] Console is clean
- [ ] Network requests succeed
- [ ] Static assets load
- [ ] SEO meta tags present
- [ ] Analytics working (if applicable)

### Content
- [ ] All text displays correctly
- [ ] Images load
- [ ] Videos play (if any)
- [ ] Markdown renders correctly
- [ ] Code blocks format correctly

---

## 🔧 Troubleshooting

If issues occur:

### Build Fails
- [ ] Check Node version: `node --version` (needs 18+)
- [ ] Clear cache: `rm -rf node_modules .next out`
- [ ] Reinstall: `npm install`
- [ ] Check for dependency conflicts

### Routes Don't Work
- [ ] Verify `next.config.mjs` has `output: 'export'`
- [ ] Check route files exist in `src/app/`
- [ ] Verify static export completed

### Assets Don't Load
- [ ] Check `public/` directory structure
- [ ] Verify asset paths in code
- [ ] Check build output in `out/`

### Deployment Issues
- [ ] Check build logs
- [ ] Verify environment variables
- [ ] Check domain/DNS settings
- [ ] Verify deployment platform config

---

## ✅ Success Criteria

The merge is successful when:

- ✅ All routes work on production
- ✅ Build succeeds without errors
- ✅ No console errors
- ✅ All features functional
- ✅ Mobile responsive
- ✅ Performance is good
- ✅ Documentation updated
- ✅ Deployed and live

---

## 📞 Notes

- **Backend**: `oracle-swordsman/` can stay in the zypher repo as a separate service
- **History**: Git history is preserved from both repos
- **Backup**: Backup branch can be deleted after successful deployment
- **Rollback**: If needed, checkout backup branch: `git checkout backup-before-merge-YYYYMMDD`

---

**Date Completed**: _______________  
**Completed By**: _______________  
**Deployment URL**: _______________

