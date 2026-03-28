import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MagePanelProvider } from "@/contexts/MagePanelContext";
import CustomCursor from "@/components/CustomCursor";
import HeroWave from "@/components/landing/HeroWave";
import FooterWave from "@/components/landing/FooterWave";
import SoulOrbCopy from "@/components/SoulOrbCopy";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const viewport = { width: 'device-width', initialScale: 1 };

export const metadata: Metadata = {
  title: "agentprivacy.ai - just another mage swordsman",
  description: "Knowledge and information sharing and discovery agent. Cast spells and skills, interface with the world. Understanding as key—storage, identity, confidential compute, ZK credential composition. Share loot in privacy pools with allies.",
  keywords: ["privacy", "AI agents", "zero-knowledge", "blockchain", "ERC-8004", "privacy pools", "x402"],
  authors: [{ name: "agentprivacy.ai" }],
  icons: {
    icon: [
      { url: '/assets/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/assets/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/assets/favicon.ico',
    apple: '/assets/favicon-48x48.png',
  },
  openGraph: {
    title: "agentprivacy.ai - just another mage swordsman",
    description: "Knowledge and information sharing and discovery agent. Cast spells and skills, interface with the world. Understanding as key—storage, identity, confidential compute, ZK credential composition. Share loot in privacy pools with allies.",
    type: "website",
    url: "https://agentprivacy.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "agentprivacy.ai - just another mage swordsman",
    description: "Knowledge and information sharing and discovery agent. Cast spells and skills, interface with the world. Understanding as key—storage, identity, confidential compute, ZK credential composition. Share loot in privacy pools with allies.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <HeroWave />
        <CustomCursor />
        <MagePanelProvider>
          <main>
            {children}
          </main>

        {/* Footer wave with soul orb — z-10 keeps footer above fixed HeroWave (z-0) */}
        <div className="relative z-10">
          <FooterWave />
        </div>
        <footer className="relative z-10 bg-background border-t border-surface/50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <img
                src="/assets/agentprivacy_logo.png"
                alt="agentprivacy"
                className="h-10 w-auto shrink-0"
              />
              <p className="text-base text-text-muted m-0 flex flex-wrap items-center gap-x-1 gap-y-0">
                <span>© 2026 agentprivacy just another</span>
                <SoulOrbCopy />
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-base">
              <a href="https://github.com/mitchuski/agentprivacy-docs" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">
                living documentation
              </a>
              <a href="https://x.com/privacymage" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">
                privacymage: x
              </a>
              <a href="https://t.me/soulbae_the_bot" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-cyan-400 transition-colors">
                🧙 soulbae, the first mage
              </a>
              <a href="https://spellweb.ai" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-cyan-400 transition-colors">
                🕸️ spellweb
              </a>
              <a href="https://t.me/agentprivacyai" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">
                agentprivacy-tg
              </a>
              <a href="https://soulbis.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-orange-400 transition-colors">
                ⚔️ soulbis, the first swordsman
              </a>
              <a href="https://intel.agentkyra.ai" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">
                private ai: agent kyra
              </a>
            </div>
          </div>
        </footer>
        </MagePanelProvider>
      </body>
    </html>
  );
}

