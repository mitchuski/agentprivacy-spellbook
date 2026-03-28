# Soul orb copy button (footer / wave)

Quick reference for the `(⚔️⊥⿻⊥🧙)🙂` copy behaviour and porting to another site (e.g. Soulbis).

## Behaviour

- **Copied string:** `(⚔️⊥⿻⊥🧙)🙂` (constant `SOUL_ORB` in code).
- **Clipboard:** Uses `navigator.clipboard.writeText` in secure contexts, with a `textarea` + `document.execCommand('copy')` fallback.
- **Feedback:** Brief glow / scale on success (inline variant); ring + shadow on the wave orb (footer variant).

## Where it lives (this repo)

| Piece | Role |
|--------|------|
| `src/components/SoulOrbCopy.tsx` | Shared copy logic; `variant="inline"` (default) or `variant="footerOrb"`. |
| `src/components/landing/FooterWave.tsx` | Wraps the wave canvas in `relative h-64`; renders `<SoulOrbCopy variant="footerOrb" />` over the drawn orb. |
| `src/app/layout.tsx` | Footer copyright line includes `<SoulOrbCopy />` (inline). Footer wave + footer use `relative z-10` so clicks sit above the fixed hero background. |

## Wave orb alignment

Canvas orb center in `FooterWave.tsx`: `sx = w * 0.22`, `sy = h * 0.42`, radius `16`. The overlay button uses CSS `left: 22%`, `top: 42%`, `-translate-x-1/2 -translate-y-1/2`, ~48px hit target. If you move the canvas orb, update both places.

## Accessibility

- Inline: visible label is the emoji string; `title="Click to copy"`.
- Footer orb: `sr-only` text + `aria-label` includes the full string; `title="Click to copy soul orb"`.

## Static build for transfer

From repo root:

```bash
npm run build
```

Export is written to **`out/`** (Next static export). Copy that folder’s contents to your deploy target.

For a side-by-side drop on disk (example):

```powershell
# Adjust destination as needed; avoids overwriting an existing site root.
New-Item -ItemType Directory -Force -Path "C:\Users\mitch\soulbis website\agentprivacy-out" | Out-Null
robocopy "C:\Users\mitch\agentprivacy_master\out" "C:\Users\mitch\soulbis website\agentprivacy-out" /E /NFL /NDL /NJH /NJS
```

Robocopy: exit code **1** means “files copied successfully” on Windows (not an error). Use `/MIR` only if you intend to delete extra files at the destination.

After a transfer, this note is also copied next to that folder as `C:\Users\mitch\soulbis website\SOUL_ORB_COPY_NOTE.md`.

To port only the orb feature into another React/Next app: reuse `SoulOrbCopy.tsx`, add the same `FooterWave` wrapper + `footerOrb` overlay (or merge into your existing wave component), and keep `pointer-events-none` on the canvas so the button receives clicks.
