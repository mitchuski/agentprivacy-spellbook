# Cloudflare Worker Setup - Step by Step

## Step 1: Navigate to Workers & Pages

1. Go to [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
2. Log in to your Cloudflare account
3. In the left sidebar, click **"Workers & Pages"**
4. Click **"Create application"** (or "Create" button)
5. Click **"Create Worker"**

## Step 2: Configure the Worker

1. **Name your Worker:** `near-ai-proxy` (or any name you prefer)
2. Click **"Deploy"** (we'll add the code next)

## Step 3: Add the Code

1. After deployment, click on your Worker name to open it
2. Click **"Quick edit"** or **"Edit code"** button
3. Delete the default code
4. Copy and paste this code:

```javascript
/**
 * Cloudflare Worker to proxy NEAR AI API requests
 * This bypasses CORS restrictions
 */
export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Get the API key from environment (set in Cloudflare Worker settings)
    const NEAR_API_KEY = env.NEAR_API_KEY;
    
    if (!NEAR_API_KEY) {
      return new Response(JSON.stringify({ error: 'NEAR_API_KEY not configured in Worker' }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Parse the request URL
    const url = new URL(request.url);
    const path = url.pathname;
    const search = url.search;

    // Forward to NEAR AI
    const nearUrl = `https://cloud-api.near.ai${path}${search}`;
    
    // Get request body if it exists
    let body = null;
    if (request.method === 'POST' || request.method === 'PUT') {
      body = await request.text();
    }

    // Forward request to NEAR AI
    const response = await fetch(nearUrl, {
      method: request.method,
      headers: {
        'Authorization': `Bearer ${NEAR_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body,
    });

    // Get response data
    const responseData = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';

    // Return response with CORS headers
    return new Response(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  },
};
```

5. Click **"Save and deploy"** (or "Deploy")

## Step 4: Set the API Key Secret

1. In your Worker page, click **"Settings"** tab (or gear icon)
2. Scroll down to **"Variables and Secrets"** section
3. Click **"Add variable"**
4. Select **"Secret"** tab
5. **Variable name:** `NEAR_API_KEY`
6. **Value:** `sk-bfaacdcdbbb54214998a1095da028771` (your actual NEAR AI API key)
7. Click **"Save"**

## Step 5: Get Your Worker URL

1. Go back to the Worker overview page
2. You'll see your Worker URL at the top, something like:
   ```
   https://near-ai-proxy.your-subdomain.workers.dev
   ```
3. **Copy this URL** - you'll need it for the next step

## Step 6: Configure Cloudflare Pages

1. Go to **"Workers & Pages"** → **"Pages"**
2. Click on your **`agentprivacy`** project
3. Click **"Settings"** tab
4. Click **"Environment variables"** in the sidebar
5. Click **"Add variable"**
6. **Variable name:** `NEXT_PUBLIC_NEAR_PROXY_URL`
7. **Value:** Your Worker URL from Step 5 (e.g., `https://near-ai-proxy.your-subdomain.workers.dev`)
8. **Type:** Plain text (not secret - it's public anyway)
9. **Environment:** Production (or All environments)
10. Click **"Save"**

## Step 7: Redeploy Pages

1. Go to **"Deployments"** tab in your Pages project
2. Click the **"..."** menu on your latest deployment
3. Click **"Retry deployment"** (or push a new commit to trigger auto-deploy)

## Step 8: Test

1. Wait for deployment to complete (2-3 minutes)
2. Visit `https://agentprivacy.ai/mage`
3. Send a message to Soulbae
4. It should work! 🎉

## Troubleshooting

- **Worker returns 500:** Check that `NEAR_API_KEY` is set as a Secret in Worker settings
- **Still getting CORS error:** Make sure `NEXT_PUBLIC_NEAR_PROXY_URL` is set correctly in Pages
- **404 error:** Check that the Worker URL is correct and the Worker is deployed

