# Cloudflare Worker Email Setup Guide

This guide will help you set up a Cloudflare Worker to send emails from your website using Wrangler CLI.

## Step 1: Get a Resend API Key

1. Go to https://resend.com and sign up (free tier: 3,000 emails/month)
2. Verify your email address
3. Go to **API Keys** in the dashboard
4. Click **Create API Key**
5. Name it (e.g., "AgentPrivacy Worker")
6. Copy the API key (starts with `re_`)

## Step 2: Verify Your Domain (Optional but Recommended)

For production, you should verify your domain:
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Add `agentprivacy.ai` (or your domain)
4. Add the DNS records Resend provides to your Cloudflare DNS
5. Wait for verification (usually a few minutes)

**Note**: For testing, you can use Resend's test domain, but emails will be limited.

## Step 3: Install Wrangler CLI

You'll use Wrangler CLI to deploy the Worker. Install it via npm:

```bash
npm install -g wrangler
# Or use npx: npx wrangler deploy
```

Then authenticate with Cloudflare:

```bash
wrangler login
```

This will open your browser to authorize Wrangler with your Cloudflare account.

## Step 4: Deploy the Worker

1. Make sure you're in the project root directory (where `cloudflare-worker-email.js` and `wrangler.toml` are located)

2. Deploy the Worker:
   ```bash
   wrangler deploy
   ```

   This will create a new Worker named `agentprivacy-email` (or you can change the name in `wrangler.toml`)

3. The first time you deploy, Wrangler will ask you to confirm creating the Worker. Type `y` and press Enter.

## Step 5: Add Environment Variable (Resend API Key)

After deploying, add your Resend API key as a secret:

```bash
wrangler secret put RESEND_API_KEY
```

When prompted, paste your Resend API key from Step 1 and press Enter.

**Note**: Secrets are encrypted and only accessible at runtime. They won't appear in your code or `wrangler.toml`.

## Step 6: Update the Worker Code (Optional)

If you verified your domain in Step 2, update line 60 in `cloudflare-worker-email.js`:

```javascript
from: 'AgentPrivacy <noreply@agentprivacy.ai>', // Your verified domain
```

If you're using Resend's test domain, you can use:
```javascript
from: 'onboarding@resend.dev', // Test domain (limited)
```

After making changes, redeploy:
```bash
wrangler deploy
```

## Step 7: Get Your Worker URL

After deploying, Wrangler will show you the Worker URL. It will look like:
```
https://agentprivacy-email.your-subdomain.workers.dev
```

You can also find it in:
- Cloudflare Dashboard > Workers & Pages > Your Worker > Settings > Triggers
- Or run: `wrangler deployments list`

## Step 8: Update Frontend Environment Variable

Add this to your `.env.local` file (or Cloudflare Pages environment variables):

```env
NEXT_PUBLIC_EMAIL_API_URL=https://agentprivacy-email.your-subdomain.workers.dev
```

If deploying to Cloudflare Pages:
1. Go to **Workers & Pages** > Your site
2. Go to **Settings** > **Environment Variables**
3. Add `NEXT_PUBLIC_EMAIL_API_URL` with your Worker URL
4. Redeploy your site

## Step 9: Test

1. Build and deploy your frontend
2. Go to any page with the MagePanel
3. Fill out the feedback form with your email
4. Submit
5. Check your email inbox (and spam folder)

## Troubleshooting

### "This uploader does not yet support projects..."
- Use Wrangler CLI instead: `wrangler deploy`
- Make sure `wrangler.toml` exists in the project root

### "Email service not configured"
- Make sure you've set the secret: `wrangler secret put RESEND_API_KEY`
- Verify it's set: `wrangler secret list`
- Redeploy after setting: `wrangler deploy`

### "Failed to send email"
- Check Resend dashboard for error logs
- Verify your domain is verified (if using custom domain)
- Check that the `from` email matches your verified domain

### CORS errors
- The Worker already handles CORS
- Make sure the Worker URL is correct in `NEXT_PUBLIC_EMAIL_API_URL`

### Emails going to spam
- Verify your domain in Resend
- Use a verified domain in the `from` field
- Add SPF/DKIM records (Resend provides these)

## Alternative: Use Resend's Test Domain

For quick testing without domain verification:
1. In `cloudflare-worker-email.js`, change line 60 to:
   ```javascript
   from: 'onboarding@resend.dev',
   ```
2. Redeploy: `wrangler deploy`
3. Note: Test domain has limitations (emails may be delayed or limited)

## Useful Wrangler Commands

```bash
# Deploy the Worker
wrangler deploy

# View deployments
wrangler deployments list

# View logs (real-time)
wrangler tail

# List secrets
wrangler secret list

# Update a secret
wrangler secret put RESEND_API_KEY

# Delete a secret
wrangler secret delete RESEND_API_KEY

# Test locally (requires wrangler dev)
wrangler dev
```

## Cost

- **Resend**: Free tier = 3,000 emails/month, then $0.30 per 1,000 emails
- **Cloudflare Workers**: Free tier = 100,000 requests/day, then $0.50 per million requests

For most use cases, this will be completely free!
