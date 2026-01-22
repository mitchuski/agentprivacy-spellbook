# CORS Fix for NEAR AI

## The Problem

NEAR Cloud AI API (`cloud-api.near.ai`) doesn't allow direct browser requests due to CORS policy. Since we're using static export, we can't use Next.js API routes.

**Error:**
```
Access to fetch at 'https://cloud-api.near.ai/v1/chat/completions' 
from origin 'https://agentprivacy.ai' has been blocked by CORS policy
```

## Solutions

### Option 1: Cloudflare Worker Proxy (Recommended)

Create a Cloudflare Worker to proxy NEAR AI requests:

1. **Create Worker:**
   ```javascript
   // worker.js
   export default {
     async fetch(request) {
       // Only allow requests from agentprivacy.ai
       const origin = request.headers.get('Origin');
       if (origin !== 'https://agentprivacy.ai' && origin !== 'http://localhost:5000') {
         return new Response('Forbidden', { status: 403 });
       }

       // Forward to NEAR AI
       const url = new URL(request.url);
       const nearUrl = `https://cloud-api.near.ai${url.pathname}${url.search}`;
       
       const response = await fetch(nearUrl, {
         method: request.method,
         headers: {
           ...Object.fromEntries(request.headers),
           'Origin': 'https://cloud-api.near.ai',
         },
         body: request.body,
       });

       // Add CORS headers
       const newResponse = new Response(response.body, response);
       newResponse.headers.set('Access-Control-Allow-Origin', origin || '*');
       newResponse.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
       newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
       
       return newResponse;
     }
   };
   ```

2. **Deploy Worker:**
   - Go to Cloudflare Dashboard → Workers & Pages
   - Create new Worker
   - Name: `near-ai-proxy`
   - Deploy the code above
   - Route: `near-ai-proxy.your-subdomain.workers.dev`

3. **Update Frontend:**
   ```typescript
   // src/lib/soulbae.ts
   const NEAR_API_URL = process.env.NEXT_PUBLIC_NEAR_API_URL || 
     'https://near-ai-proxy.your-subdomain.workers.dev';
   ```

### Option 2: Use Your Cloudflare Tunnel

If you have a tunnel set up, you can proxy through it:

1. **Set up backend proxy endpoint:**
   ```javascript
   // In your oracle backend (oracle-swordsman)
   app.post('/api/proxy/near-ai', async (req, res) => {
     const response = await fetch('https://cloud-api.near.ai/v1/chat/completions', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${process.env.NEAR_API_KEY}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(req.body),
     });
     
     const data = await response.json();
     res.json(data);
   });
   ```

2. **Update frontend:**
   ```typescript
   const NEAR_API_URL = 'https://oracle.agentprivacy.ai'; // Your tunnel URL
   // Use /api/proxy/near-ai instead of /chat/completions
   ```

### Option 3: Temporary - Use CORS Proxy Service

**Note:** Not recommended for production, but works for testing:

```typescript
// Temporary workaround
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const endpoint = `${CORS_PROXY}${NEAR_API_URL}/chat/completions`;
```

---

## Quick Fix for Now

**For the proverbs page**, the static JSON should work. Let me verify the file is being served correctly.

