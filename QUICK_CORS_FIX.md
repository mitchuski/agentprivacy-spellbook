# Quick CORS Fix for NEAR AI

## The Problem
NEAR AI API blocks direct browser requests (CORS error). Your static export can't use Next.js API routes.

## Solution: Cloudflare Worker Proxy

### Step 1: Deploy the Worker
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages
2. Click "Create application" → "Create Worker"
3. Name it: `near-ai-proxy`
4. Copy the code from `cloudflare-worker-proxy.js` into the editor
5. Click "Deploy"

### Step 2: Set Environment Variable in Worker
1. In your Worker settings, go to "Variables and Secrets"
2. Add a secret:
   - **Variable name:** `NEAR_API_KEY`
   - **Value:** `sk-bfaacdcdbbb54214998a1095da028771` (your actual key)
   - **Type:** Secret

### Step 3: Get Worker URL
After deployment, you'll get a URL like:
```
https://near-ai-proxy.your-subdomain.workers.dev
```

### Step 4: Set in Cloudflare Pages
1. Go to your `agentprivacy` Pages project
2. Settings → Environment variables
3. Add variable:
   - **Name:** `NEXT_PUBLIC_NEAR_PROXY_URL`
   - **Value:** `https://near-ai-proxy.your-subdomain.workers.dev`
   - **Type:** Plain text (not secret - it's public anyway)
4. Redeploy your Pages project

## Alternative: Use Your Tunnel

If you prefer to use your existing tunnel:

1. Add this endpoint to your oracle backend:
```javascript
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

2. Set `NEXT_PUBLIC_NEAR_PROXY_URL` to your tunnel URL + `/api/proxy/near-ai`

## Test
After deployment, visit `https://agentprivacy.ai/mage` and send a message. It should work!

