# Cloudflare Tunnel Architecture Guide

## What Needs the Tunnel?

### ✅ Frontend (Static Site) - NO TUNNEL NEEDED
- **Location**: Cloudflare Pages (or static hosting)
- **Type**: Static HTML/JS files
- **Routes**: `/`, `/story`, `/mage`, `/proverbs`, `/zero`
- **Status**: ✅ Already working - no tunnel needed

### ⚠️ Oracle Backend API - OPTIONAL TUNNEL
- **Location**: Your server (VPS, local machine, etc.)
- **Type**: Node.js API server (oracle-swordsman)
- **Port**: 3001 (or configured port)
- **Purpose**: Serves inscription data to `/proverbs` page
- **Status**: ⚠️ Needs to be accessible

---

## Architecture Options

### Option 1: Oracle Backend Through Tunnel (Recommended)

**Setup:**
1. Run oracle backend on your server (port 3001)
2. Configure Cloudflare Tunnel to point to it:
   ```yaml
   # config.yml
   tunnel: <tunnel-id>
   ingress:
     - hostname: oracle.agentprivacy.ai
       service: http://localhost:3001
     - service: http_status:404
   ```
3. Set frontend environment variable:
   ```
   NEXT_PUBLIC_ORACLE_API_URL=https://oracle.agentprivacy.ai
   ```

**Pros:**
- Real-time updates
- Automatic inscription updates
- No manual work needed

**Cons:**
- Requires tunnel setup
- Backend must stay running

---

### Option 2: Manual Updates (No Tunnel Needed)

**How it works:**
1. Export inscriptions data from backend
2. Include in static build
3. Update manually when new inscriptions appear

**Steps:**

1. **Export inscriptions from backend:**
   ```bash
   # On backend server
   curl http://localhost:3001/api/inscriptions > inscriptions.json
   ```

2. **Add to frontend:**
   ```typescript
   // src/lib/inscriptions-static.ts
   import inscriptionsData from '@/data/inscriptions.json';
   
   export function getInscriptions() {
     return inscriptionsData;
   }
   ```

3. **Update proverbs page to use static data:**
   ```typescript
   // src/app/proverbs/page.tsx
   import { getInscriptions } from '@/lib/inscriptions-static';
   // Remove oracle-api import
   ```

4. **Build and deploy:**
   ```bash
   npm run build
   git add public/data/inscriptions.json
   git commit -m "Update inscriptions data"
   git push
   ```

**Pros:**
- No tunnel needed
- No backend dependency
- Simple deployment
- Works with static hosting

**Cons:**
- Manual updates required
- Not real-time
- Need to rebuild/redeploy for updates

---

### Option 3: Hybrid Approach

**Use static data as fallback:**
```typescript
// src/lib/oracle-api.ts
export async function getInscriptions() {
  try {
    // Try API first
    const response = await fetch(`${ORACLE_API_URL}/api/inscriptions`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('API unavailable, using static data');
  }
  
  // Fallback to static data
  return getStaticInscriptions();
}
```

**Pros:**
- Works with or without backend
- Real-time when backend available
- Static fallback when backend down

---

## Current Setup

**Frontend:**
- ✅ Deployed via Cloudflare Pages
- ✅ Static export working
- ✅ NEAR AI configured

**Oracle Backend:**
- ⚠️ Needs to be accessible
- Options:
  1. Through Cloudflare Tunnel (oracle.agentprivacy.ai)
  2. Manual updates (export JSON, include in build)
  3. Hybrid (API with static fallback)

---

## Recommendation

**For now (quick setup):**
- Use **Option 2: Manual Updates**
- Export inscriptions JSON periodically
- Include in static build
- No tunnel complexity

**Later (when ready):**
- Set up **Option 1: Tunnel**
- Point tunnel to oracle backend
- Set `NEXT_PUBLIC_ORACLE_API_URL`
- Get real-time updates

---

## Manual Update Workflow

1. **Export from backend:**
   ```bash
   curl http://localhost:3001/api/inscriptions > inscriptions.json
   ```

2. **Copy to frontend:**
   ```bash
   cp inscriptions.json agentprivacy-website/public/data/
   ```

3. **Update code to use static data** (one-time setup)

4. **Build and push:**
   ```bash
   cd agentprivacy-website
   npm run build
   git add public/data/inscriptions.json
   git commit -m "Update inscriptions"
   git push
   ```

5. **Cloudflare auto-deploys**

---

## Tunnel Setup (If You Want Real-Time)

1. **Install Cloudflare Tunnel:**
   ```bash
   cloudflared tunnel create oracle
   ```

2. **Configure:**
   ```yaml
   tunnel: <tunnel-id>
   credentials-file: /path/to/credentials.json
   
   ingress:
     - hostname: oracle.agentprivacy.ai
       service: http://localhost:3001
     - service: http_status:404
   ```

3. **Run tunnel:**
   ```bash
   cloudflared tunnel run oracle
   ```

4. **Set environment variable in Cloudflare Pages:**
   ```
   NEXT_PUBLIC_ORACLE_API_URL=https://oracle.agentprivacy.ai
   ```

---

**Which approach do you want to use?**

