# NEAR AI Setup Guide

## Issue: NEAR AI Agent Not Working

The NEAR AI integration requires environment variables to be set. Since the site uses static export (`output: 'export'`), API routes don't work in production.

## Solution

### For Static Export (Production)

The frontend makes **direct API calls** to NEAR Cloud AI. You need to set environment variables that are available at build time.

### Required Environment Variables

Set these in your deployment platform (Cloudflare Pages, Vercel, Netlify, etc.):

```env
NEXT_PUBLIC_NEAR_API_KEY=your_near_api_key_here
NEXT_PUBLIC_NEAR_API_URL=https://cloud-api.near.ai/v1
NEXT_PUBLIC_NEAR_MODEL=openai/gpt-oss-120b
```

### How It Works

1. **Development Mode** (localhost):
   - Uses proxy API route: `/api/near-ai/chat`
   - Proxy handles CORS and API key
   - Works with `npm run dev`

2. **Production Mode** (static export):
   - Makes direct API calls to `https://cloud-api.near.ai/v1/chat/completions`
   - Uses `NEXT_PUBLIC_NEAR_API_KEY` from environment
   - No proxy needed (CORS handled by NEAR API)

### Setting Up in Cloudflare Pages

1. Go to Cloudflare Dashboard → Pages → Your Project
2. Go to Settings → Environment Variables
3. Add:
   - `NEXT_PUBLIC_NEAR_API_KEY` = `your_actual_api_key`
   - `NEXT_PUBLIC_NEAR_API_URL` = `https://cloud-api.near.ai/v1` (optional, has default)
   - `NEXT_PUBLIC_NEAR_MODEL` = `openai/gpt-oss-120b` (optional, has default)
4. Redeploy

### Setting Up in Vercel

1. Go to Vercel Dashboard → Your Project
2. Go to Settings → Environment Variables
3. Add the same variables as above
4. Redeploy

### Testing

After setting environment variables:

1. **Build locally** (to test):
   ```bash
   # Set env vars
   $env:NEXT_PUBLIC_NEAR_API_KEY="your_key"
   npm run build
   npm start
   ```

2. **Check browser console**:
   - Open `/mage` page
   - Try sending a message
   - Check console for errors
   - Should see API calls to `https://cloud-api.near.ai/v1/chat/completions`

### Troubleshooting

**Error: "NEAR_API_KEY not configured"**
- Set `NEXT_PUBLIC_NEAR_API_KEY` environment variable
- Make sure it's prefixed with `NEXT_PUBLIC_` (required for client-side access)

**Error: CORS issues**
- In production, NEAR API should handle CORS
- If issues persist, check API key is valid
- Verify `NEXT_PUBLIC_NEAR_API_URL` is correct

**Error: "Failed to connect to NEAR API"**
- Check internet connection
- Verify API key is valid
- Check NEAR API status: https://status.near.ai

**API route returns 404 in production**
- This is expected! API routes don't work with static export
- The code automatically falls back to direct API calls
- Make sure `NEXT_PUBLIC_NEAR_API_KEY` is set

### Code Flow

```typescript
// src/lib/soulbae.ts
const isDevelopment = window.location.hostname === 'localhost';

if (isDevelopment) {
  // Try proxy first
  endpoint = '/api/near-ai/chat';
} else {
  // Production: direct API call
  endpoint = 'https://cloud-api.near.ai/v1/chat/completions';
}
```

### Getting a NEAR API Key

1. Visit: https://cloud.near.ai
2. Sign up / Log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key
6. Set as `NEXT_PUBLIC_NEAR_API_KEY`

---

**Note**: The `NEXT_PUBLIC_` prefix is required because these variables are used in client-side code (browser). They will be embedded in the JavaScript bundle at build time.

