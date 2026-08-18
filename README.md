# AgentPrivacy.ai - The Spellbooks

A privacy-preserving interactive story platform built with Next.js, featuring three spellbooks (story, zero, canon), AI-assisted proverb generation, and Zcash integration for private donations.

## 🎯 What Is This?

This is a **spellbook collection** - an interactive storytelling platform featuring:

- **Story Spellbook** - The First Person Spellbook with 12 acts
- **Zero Spellbook** - Zero Knowledge Spellbook with 30 tales  
- **Canon Spellbook** - Blockchain history and lineage (11 chapters)
- **Soulbae** (the Mage) helps craft relationship proverbs through AI conversation
- **Swordsman Panel** formats proverbs for Zcash shielded transactions
- **Donations** flow privately through Zcash z→z transactions with encrypted memos

Think of it as: **Crowdfunding with proof-of-understanding, where privacy is preserved by design.**

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│  Next.js Static Site (out/)            │
│  - Landing page (/)                     │
│  - Story spellbook (/story)             │
│  - Zero spellbook (/zero)               │
│  - Canon spellbook (/canon)              │
│  - Mage interface (/mage)                │
│  - Proverbs gallery (/proverbs)         │
└─────────────────────────────────────────┘
              │
              ├─► Soulbae API (NEAR Shade Agent)
              │   - TEE-attested AI agent
              │   - Proverb generation
              │   - Privacy-preserving chat
              │
              └─► Zcash Blockchain
                  - Shielded transactions
                  - Encrypted memos
                  - Private donations
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for cloning
- (Optional) **Zcash wallet** for testing donations

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd agentprivacy-ai-firstmage

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:8000
```

### Build for Production

```bash
# Build static site
npm run build

# Output will be in ./out directory
# Serve locally to test
npm start  # Runs on port 8000
```

## 📁 Project Structure

```
agentprivacy-ai-firstmage/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── story/page.tsx      # Story spellbook (12 acts)
│   │   ├── zero/page.tsx       # Zero spellbook (30 tales)
│   │   ├── canon/page.tsx      # Canon spellbook (11 chapters)
│   │   ├── mage/page.tsx       # Soulbae chat interface
│   │   └── proverbs/page.tsx   # Proverbs gallery
│   ├── components/             # React components
│   │   ├── SwordsmanPanel.tsx  # Donation panel
│   │   ├── ChatMessage.tsx     # Chat UI
│   │   └── ...
│   └── lib/                    # Utilities
│       ├── soulbae.ts          # Soulbae API client
│       └── zcash-memo.ts       # Zcash memo formatting
├── public/
│   ├── assets/                 # Videos and images
│   ├── story/markdown/         # Story spellbook content
│   ├── zero/markdown/          # Zero spellbook content
│   └── canon/                  # Canon spellbook content
├── out/                        # Static export (after build)
├── next.config.mjs             # Next.js config
└── package.json
```

## 🎨 Key Features

### 1. Three Spellbooks

**Story Spellbook (`/story`):**
- **12 Acts** of privacy-themed narrative
- **Markdown-based** content in `public/story/markdown/`
- **Swordsman Panel** for each act (donation interface)
- **Navigation** between acts with smooth transitions

**Zero Spellbook (`/zero`):**
- **30 Tales** of zero-knowledge cryptography
- **Markdown-based** content in `public/zero/markdown/`
- **Video assets** for key tales
- **Swordsman Panel** integration

**Canon Spellbook (`/canon`):**
- **11 Chapters** of blockchain history and lineage
- **Markdown-based** content in `public/canon/`
- **Video assets** for each chapter
- **Historical narrative** from cypherpunks to present

### 2. Mage Interface (`/mage`)

- **Chat with Soulbae** - AI agent for proverb generation
- **TEE Attestation** - Verifiable privacy guarantees
- **Privacy Budget** - Limited queries per session (φ × 10 = 16)
- **Proverb Suggestions** - AI-generated relationship proverbs
- **Copy to Zodl** - Format memo for Zcash wallet

### 3. Swordsman Panel

- **Proverb Input** - User enters their understanding
- **Validation** - Checks proverb length (512 bytes max)
- **Zcash Memo Format** - Generates `[rpp-v1]` format
- **Copy to Clipboard** - Ready for Zodl wallet

### 4. Zcash Integration

**Memo Format (rpp-v1):**
```
[rpp-v1]
[act-i-venice]
[1699564800123]
[Your proverb here]
```

**Flow:**
1. User reads tale → Gets proverb from Soulbae
2. Formats memo → Copies to clipboard
3. Pastes in Zodl → Sets amount privately
4. Sends z→z transaction → Donation with encrypted memo

## 🔧 Customization Guide

### Adding Your Own Story

1. **Add Markdown files** to `public/story/markdown/`:
   ```
   00-your-firstpage.md
   01-act-i-your-tale.md
   02-act-ii-your-tale.md
   ...
   ```

2. **Update act mapping** in `src/app/story/page.tsx`:
   ```typescript
   const getActFilename = (act: number): string => {
     const filenames: { [key: number]: string } = {
       0: 'your-firstpage',
       1: 'i-your-tale',
       // ...
     };
     return filenames[act] || '';
   };
   ```

3. **Add video assets** (optional) in `public/assets/`:
   ```typescript
   const getActVideo = (act: number): string | null => {
     const videoMap: { [key: number]: string } = {
       1: '/assets/your-video.mp4',
       // ...
     };
     return videoMap[act] || null;
   };
   ```

### Customizing Soulbae

1. **Update API URL** in `src/lib/soulbae.ts`:
   ```typescript
   const SOULBAE_URL = process.env.NEXT_PUBLIC_SOULBAE_URL || 'https://your-domain.com/mage';
   ```

2. **Update character file** (if using NEAR Shade Agent):
   - Edit `soulbae-character.md`
   - Deploy to your Shade Agent instance

### Changing Colors & Styling

Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: '#6366f1',    // Your primary color
  secondary: '#8b5cf6',  // Your secondary color
  accent: '#06b6d4',     // Your accent color
  // ...
}
```

### Adding New Pages

1. Create route in `src/app/`:
   ```
   src/app/your-page/page.tsx
   ```

2. Add navigation link in `src/app/layout.tsx` or individual pages

## 📦 Deployment

### Static Export (Recommended)

This project uses Next.js static export (`output: 'export'`), so it can be deployed anywhere:

**Cloudflare Pages:**
```bash
npm run build
# Upload ./out directory to Cloudflare Pages
# Build command: npm run build
# Output directory: out
```

**Vercel:**
```bash
vercel deploy --prod
# Automatically detects Next.js and builds
```

**Netlify:**
```bash
netlify deploy --prod --dir=out
```

**Any Static Host:**
- Upload the `out/` directory to any static hosting service
- No server required!

### Environment Variables

Create `.env.local` for development:
```bash
NEXT_PUBLIC_SOULBAE_URL=https://your-soulbae-api.com
```

For production, set these in your hosting platform's environment variables.

## 🔒 Privacy & Security

### What's Private

- **Donation amounts** - Only visible to sender/receiver
- **Wallet addresses** - Shielded z-addresses
- **User conversations** - Not stored by Soulbae
- **Transaction timing** - Hidden in shielded pool

### What's Public

- **Story content** - Public markdown files
- **Proverbs** - In encrypted memos (only readable by recipient)
- **TEE Attestation** - Verifiable proof of privacy

### Privacy Guarantees

- **Soulbae** runs in TEE (Trusted Execution Environment)
- **Zcash** uses shielded pool (z→z transactions)
- **No tracking** - No analytics, no cookies, no surveillance

## 📚 Documentation

- **[SPELLBOOK_DEPLOYMENT_GUIDE.md](./SPELLBOOK_DEPLOYMENT_GUIDE.md)** - Complete deployment walkthrough
- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Architecture details
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Original deployment guide
- **[SOULBAE_CONFIG.md](./SOULBAE_CONFIG.md)** - Soulbae configuration

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start dev server (port 8000)
npm run build    # Build static site
npm start        # Serve built site (port 5000)
npm run lint     # Run ESLint
```

### Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Markdown** - Markdown rendering
- **Zcash** - Privacy-preserving blockchain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Zero Knowledge Spellbook** - Original story inspiration
- **NEAR AI** - Shade Agent technology
- **Zcash** - Privacy-preserving transactions

---

**"just another mage, sharing a spellbook"** 🧙‍♂️📖

For questions or support, open an issue or check the documentation files.
