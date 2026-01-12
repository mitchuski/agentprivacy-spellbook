# Merge Summary: What Gets Merged

**Source**: `agentprivacy-zypher` (this repo)  
**Target**: `https://github.com/mitchuski/agentprivacy`  
**Strategy**: Full replacement with backend kept separate

---

## ✅ What WILL Be Merged (Frontend Only)

### Core Application
- ✅ `src/` - All frontend React/Next.js code
  - `src/app/` - All routes (landing, story, mage, proverbs, zero)
  - `src/components/` - All React components
  - `src/lib/` - Utility functions

### Configuration Files
- ✅ `package.json` - Dependencies
- ✅ `package-lock.json` - Lock file
- ✅ `next.config.mjs` - Next.js configuration
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `tailwind.config.ts` - Tailwind CSS config
- ✅ `postcss.config.js` - PostCSS config
- ✅ `next-env.d.ts` - Next.js TypeScript definitions

### Static Assets
- ✅ `public/` - All static assets
  - `public/assets/` - Videos, images
  - `public/story/markdown/` - 12 Acts markdown files
  - `public/zero/` - 30 Zero tales markdown files
  - `public/icon.png`, etc.

### Content & Data
- ✅ `spellbook/` - Spellbook JSON data
  - `spellbook/spellbook-acts.json` - Canonical proverbs

### Documentation
- ✅ `docs/` - Documentation files
- ✅ `README.md` - Main readme
- ✅ `STATUS.md` - Project status
- ✅ `*.md` - All markdown documentation files

### Build & Deployment
- ✅ `serve.json` - Static server config
- ✅ `server.js` - Static server script
- ✅ `.gitignore` - Git ignore rules

---

## ❌ What Will NOT Be Merged (Backend Stays Separate)

### Backend Service
- ❌ `oracle-swordsman/` - **KEPT IN ZYPHER REPO**
  - Backend API server
  - Database scripts
  - Oracle monitoring scripts
  - Inscription scripts
  - All backend TypeScript code

### Why Keep Backend Separate?

1. **Different Deployment**: Backend runs as a separate service (port 3001)
2. **Different Dependencies**: Backend has its own `package.json` and dependencies
3. **Security**: Backend contains sensitive keys and configuration
4. **Maintenance**: Easier to maintain and deploy separately
5. **Scalability**: Can scale frontend and backend independently

### Backend Remains In:
- **Repository**: `agentprivacy-zypher`
- **Location**: `oracle-swordsman/` directory
- **Deployment**: Separate service/container

---

## 🔗 How Frontend Connects to Backend

The frontend connects to the backend via API calls:

### API Endpoints Used
```typescript
// From src/lib/oracle-api.ts
const ORACLE_API_URL = process.env.NEXT_PUBLIC_ORACLE_API_URL || 'http://localhost:3001';

// Endpoints:
- GET  /api/inscriptions  - Get onchain inscriptions
- POST /api/submit        - Submit proverb (optional)
- GET  /api/status/:code  - Check submission status (optional)
- GET  /api/stats         - Get statistics (optional)
```

### Environment Variable
```env
NEXT_PUBLIC_ORACLE_API_URL=http://localhost:3001
# Or production URL: https://oracle.agentprivacy.ai
```

### Frontend Works Without Backend
- ✅ All routes work without backend
- ✅ Story reader works independently
- ✅ Mage chat works independently (uses NEAR AI directly)
- ✅ Proverbs gallery can work with static data or API
- ⚠️ Real-time inscription updates require backend

---

## 📁 Final Repository Structure

After merge, the `agentprivacy` website repo will have:

```
agentprivacy/                    # Website repository
├── src/                          # Frontend code
│   ├── app/                      # Next.js routes
│   ├── components/              # React components
│   └── lib/                     # Utilities
├── public/                       # Static assets
├── spellbook/                    # Spellbook data
├── docs/                         # Documentation
├── package.json                  # Frontend dependencies
├── next.config.mjs               # Next.js config
└── ... (other config files)

# Backend stays in agentprivacy-zypher:
agentprivacy-zypher/              # Zypher repository
└── oracle-swordsman/             # Backend service
    ├── src/                      # Backend TypeScript
    ├── scripts/                  # Backend scripts
    └── package.json             # Backend dependencies
```

---

## 🚀 Deployment Architecture

### Frontend (agentprivacy repo)
- **Platform**: Vercel / Netlify / Cloudflare Pages
- **Type**: Static site (Next.js static export)
- **URL**: `https://agentprivacy.ai`
- **Routes**: `/`, `/story`, `/mage`, `/proverbs`, `/zero`

### Backend (agentprivacy-zypher repo)
- **Platform**: VPS / Docker / Cloud service
- **Type**: Node.js API server
- **URL**: `https://oracle.agentprivacy.ai` (or similar)
- **Port**: 3001 (or configured port)

### Connection
- Frontend calls backend API via `NEXT_PUBLIC_ORACLE_API_URL`
- Backend can be deployed independently
- Frontend works even if backend is down (with limited features)

---

## ✅ Merge Confirmation

**Backend Separation**: ✅ Confirmed  
**Frontend Merge**: ✅ Ready  
**Strategy**: Full replacement with backend excluded

The merge script will automatically exclude `oracle-swordsman/` from the merge.

---

## 📝 Post-Merge Notes

After merging:

1. **Frontend** is in `agentprivacy` repo - deploy to website
2. **Backend** stays in `agentprivacy-zypher` repo - deploy separately
3. **Connection** via environment variable `NEXT_PUBLIC_ORACLE_API_URL`
4. **Documentation** updated in both repos as needed

---

**Ready to proceed with merge!** 🚀

