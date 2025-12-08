# Troubleshooting Guide

## Issue 1: NEAR AI (Soulbae) Not Working

### The Problem
The `NEXT_PUBLIC_NEAR_API_KEY` environment variable must be set **BEFORE** Cloudflare builds the site. The API key gets embedded in the JavaScript bundle at **build time**, not runtime.

### The Fix

1. **Verify in Cloudflare:**
   - Dashboard → Pages → Your Project → Settings → Environment Variables
   - `NEXT_PUBLIC_NEAR_API_KEY` should be set as **Secret**
   - Value: `sk-bfaacdcdbbb54214998a1095da028771`

2. **CRITICAL: Trigger Rebuild**
   - **Option A**: Go to Deployments → Click "Retry deployment" on latest
   - **Option B**: Make any small change and push (I just pushed fixes)
   - Cloudflare will rebuild with the env var

3. **Test:**
   - Visit `https://agentprivacy.ai/mage`
   - Open browser console (F12)
   - Send a message
   - Should see: `API Key present: true` in console
   - Should get response from Soulbae

---

## Issue 2: Proverbs Not Loading

### The Problem
Inscriptions need to come from either:
1. Oracle API (if `NEXT_PUBLIC_ORACLE_API_URL` is set)
2. Static JSON file (`/data/inscriptions.json`)

### The Fix

**For now (static data):**
- File exists at: `public/data/inscriptions.json` (empty for now)
- After deployment, accessible at: `https://agentprivacy.ai/data/inscriptions.json`
- Page will show "No inscriptions found yet" (this is correct - file is empty)

**To add inscriptions later:**
1. Export from backend: `curl http://localhost:3001/api/inscriptions > inscriptions.json`
2. Copy to: `public/data/inscriptions.json`
3. Commit and push
4. Cloudflare auto-deploys

---

## Quick Test

After Cloudflare rebuilds:

1. **Test NEAR AI:**
   - Visit: `https://agentprivacy.ai/mage`
   - Console should show: `API Key present: true`
   - Send message → Should get response

2. **Test Proverbs:**
   - Visit: `https://agentprivacy.ai/proverbs`
   - Console should show: `Loaded inscriptions from static data`
   - Page should load (empty state is fine)

---

**Most Important**: Cloudflare must **rebuild** after setting environment variables!

