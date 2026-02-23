# Deploying to Cloudflare Pages

This app uses **Next.js static export** (`output: 'export'`). Use these settings in the Cloudflare Pages dashboard.

## Build configuration

| Setting | Value |
|--------|--------|
| **Framework preset** | Next.js (Static HTML Export) |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |
| **Root directory** | (leave blank unless the app lives in a subfolder) |
| **Node.js version** | 18 or 20 (set via environment variable `NODE_VERSION=18` if needed) |

## What was fixed for Cloudflare

- **RSC path adapter in repo**  
  `build/fix-rsc-paths.js` is committed so Cloudflare (and any CI) runs it. It fixes Next.js 16 issue #85374: build outputs nested paths (`__next/segment/__PAGE__.txt`) while the client requests dot-separated (`__next.segment.__PAGE__.txt`). Without the adapter, prefetch and client-side navigation would 404; with it, behavior matches local.

- **Static export only**  
  The site is fully static. API routes under `app/api/` are not run on Cloudflare (no Node server). The spells page uses baked grimoire data; the NEAR AI proxy is for local dev only.

## If the build still fails

1. Check the build log for the first error (missing module, path, or “API routes”).
2. Ensure **Build output directory** is exactly `out` (lowercase).
3. Ensure the build command is `npm run build` (so the postbuild check for `out` runs).
4. If you see errors about `app/api` or Route Handlers, the project may need those routes moved out of `app` for static-only deploys.
