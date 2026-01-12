# Cloudflare Deployment Guide

**Repository**: https://github.com/mitchuski/agentprivacy  
**Status**: Ready for deployment

---

## 🚀 Quick Deployment Options

### Option 1: Cloudflare Pages (Recommended for Static Sites)

1. **Connect Repository**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
   - Click "Create a project"
   - Connect GitHub repository: `mitchuski/agentprivacy`
   - Select branch: `main`

2. **Build Settings**:
   ```
   Framework preset: Next.js (Static HTML Export)
   Build command: npm run build
   Build output directory: out
   Root directory: / (leave blank)
   Node version: 18 or higher
   ```

3. **Environment Variables** (if needed):
   ```
   NEXT_PUBLIC_ORACLE_API_URL=https://oracle.agentprivacy.ai
   NEXT_PUBLIC_SPELLBOOK_IPFS_URL=https://ipfs.io/ipfs/...
   NEXT_PUBLIC_NEAR_API_KEY=... (if using NEAR AI)
   ```

4. **Deploy**:
   - Click "Save and Deploy"
   - Wait 2-3 minutes
   - Site will be live at `your-project.pages.dev`

5. **Custom Domain**:
   - In Pages → Settings → Custom domains
   - Add `agentprivacy.ai`
   - Update DNS records as instructed

---

### Option 2: Cloudflare Tunnel (For Self-Hosted)

If you're using Cloudflare Tunnel to connect to your own server:

1. **Install Cloudflare Tunnel**:
   ```bash
   # On your server
   cloudflared tunnel create agentprivacy
   ```

2. **Configure Tunnel**:
   ```yaml
   # config.yml
   tunnel: <tunnel-id>
   credentials-file: /path/to/credentials.json
   
   ingress:
     - hostname: agentprivacy.ai
       service: http://localhost:5000
     - hostname: www.agentprivacy.ai
       service: http://localhost:5000
     - service: http_status:404
   ```

3. **Run Tunnel**:
   ```bash
   cloudflared tunnel run agentprivacy
   ```

4. **Serve Static Files**:
   ```bash
   # Option A: Use Next.js dev server (development)
   npm run dev
   
   # Option B: Use static server (production)
   npm run build
   npm start  # Serves from 'out/' directory on port 8000
   
   # Option C: Use any static file server
   npx serve out -p 5000
   ```

5. **Update Tunnel Config**:
   - Point tunnel to your local server (port 5000 or 8000)
   - Tunnel will proxy requests to your local server

---

### Option 3: Cloudflare Workers (Advanced)

For serverless deployment:

1. **Install Wrangler**:
   ```bash
   npm install -g wrangler
   ```

2. **Initialize**:
   ```bash
   wrangler init
   ```

3. **Deploy Static Assets**:
   ```bash
   # Build first
   npm run build
   
   # Deploy to Workers
   wrangler pages deploy out
   ```

---

## 📋 Pre-Deployment Checklist

- [x] Code pushed to GitHub
- [x] Build tested locally (`npm run build`)
- [x] Static export verified (`out/` directory)
- [ ] Environment variables documented
- [ ] Custom domain configured (if using)
- [ ] DNS records updated
- [ ] SSL certificate active (automatic with Cloudflare)

---

## 🔧 Configuration Files

### For Cloudflare Pages

**Build Command**: `npm run build`  
**Output Directory**: `out`  
**Node Version**: 18+

### For Cloudflare Tunnel

**Local Server**: Port 5000 (dev) or 8000 (production)  
**Tunnel Config**: Points to `http://localhost:5000` or `http://localhost:8000`

---

## 🌐 Domain Setup

### DNS Records (if using Cloudflare DNS)

```
Type    Name    Content                    Proxy
A       @       <your-server-ip>           Proxied
CNAME   www     agentprivacy.ai            Proxied
```

### SSL/TLS Settings

- **SSL/TLS encryption mode**: Full (strict)
- **Always Use HTTPS**: On
- **Automatic HTTPS Rewrites**: On

---

## 🚨 Troubleshooting

### Build Fails

- Check Node version (needs 18+)
- Verify `package.json` has all dependencies
- Check build logs in Cloudflare dashboard

### Routes Don't Work

- Verify `next.config.mjs` has `output: 'export'`
- Check that `out/` directory is correct
- Verify static export completed

### Tunnel Not Connecting

- Check tunnel is running: `cloudflared tunnel list`
- Verify local server is running
- Check tunnel config matches your setup
- Review tunnel logs: `cloudflared tunnel run --loglevel debug`

### Assets Don't Load

- Check `public/` directory structure
- Verify asset paths in code
- Check CORS settings if needed

---

## 📊 Post-Deployment

After deployment:

1. **Test All Routes**:
   - https://agentprivacy.ai/
   - https://agentprivacy.ai/story
   - https://agentprivacy.ai/mage
   - https://agentprivacy.ai/proverbs

2. **Verify**:
   - All pages load
   - Navigation works
   - Assets load correctly
   - Mobile responsive
   - No console errors

3. **Monitor**:
   - Cloudflare Analytics
   - Error logs
   - Performance metrics

---

## 🔗 Useful Links

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

**Ready to deploy!** 🚀

