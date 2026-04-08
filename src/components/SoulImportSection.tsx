'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  setSpellbookInStorage,
  setCustomProverbs,
  setInscribedProverb,
  setConstellationWeb,
  type SpellbookStorage,
  type ConstellationWebStorage,
} from '@/lib/spellbook-storage';
import { parseAndAddBladeToInventory, type InventoryBlade } from '@/lib/spellweb-blade-bridge';
import type { SoulFile } from '@/lib/soul-convergence';

// ============================================
// TYPES
// ============================================

type ImportType = 'skills' | 'soul' | 'blade' | 'unknown';

interface ImportResult {
  type: ImportType;
  success: boolean;
  message: string;
  details?: {
    spellsImported?: number;
    skillsImported?: number;
    proverbsImported?: number;
    bladesImported?: number;
    personaName?: string;
    convergenceType?: string;
  };
}

// ============================================
// PARSERS
// ============================================

/**
 * Detect file type from content
 */
function detectFileType(content: string, filename: string): ImportType {
  // Check filename extension
  if (filename.endsWith('.soul')) return 'soul';
  if (filename.endsWith('.blade.md') || filename.includes('blade')) return 'blade';

  // Check content
  try {
    const json = JSON.parse(content);
    if (json.type === 'soul' && json.version) return 'soul';
  } catch {
    // Not JSON, check markdown patterns
  }

  // Check for blade markdown patterns
  if (content.includes('Signature: SPELL-') && content.includes('Hex:')) {
    return 'blade';
  }

  // Check for skills.md patterns
  if (
    content.includes('## Spells & Proverbs') ||
    content.includes('## Skill Files') ||
    content.includes('## Persona alignment') ||
    content.includes('# agentprivacy spellbook')
  ) {
    return 'skills';
  }

  return 'unknown';
}

/**
 * Parse .soul JSON file
 */
function parseSoulFile(content: string): SoulFile | null {
  try {
    const soul = JSON.parse(content) as SoulFile;
    if (soul.type !== 'soul' || !soul.version) return null;
    return soul;
  } catch {
    return null;
  }
}

/**
 * Parse skills.md markdown and extract data
 */
function parseSkillsMarkdown(content: string): {
  spellIds: string[];
  skillIds: string[];
  customProverbs: string;
  inscribedProverbs: Record<string, string>;
  constellationWeb: ConstellationWebStorage;
  personaName?: string;
} {
  const result = {
    spellIds: [] as string[],
    skillIds: [] as string[],
    customProverbs: '',
    inscribedProverbs: {} as Record<string, string>,
    constellationWeb: { links: [], reflections: {} } as ConstellationWebStorage,
    personaName: undefined as string | undefined,
  };

  // Extract persona name from header
  const personaMatch = content.match(/^#\s+(.+?)\s*$/m);
  if (personaMatch) {
    result.personaName = personaMatch[1].replace('agentprivacy spellbook', '').trim() || undefined;
  }

  // Extract spell IDs from "## Spells & Proverbs" section
  // Format: ### Act Title followed by **Spell:** ...
  const spellSectionMatch = content.match(/## Spells & Proverbs\s*([\s\S]*?)(?=##|$)/);
  if (spellSectionMatch) {
    // Extract act/tale references
    const actMatches = spellSectionMatch[1].matchAll(/###\s+(.+?)(?:\n|$)/g);
    for (const match of actMatches) {
      const title = match[1].trim();
      // Try to derive spell ID from title
      const actNum = title.match(/Act\s+(\d+)/i);
      const taleNum = title.match(/Tale\s+(\d+)/i);
      const chapterNum = title.match(/Chapter\s+(\d+)/i);

      if (actNum) {
        result.spellIds.push(`act-${actNum[1].padStart(2, '0')}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
      } else if (taleNum) {
        result.spellIds.push(`zero-tale-${taleNum[1]}`);
      } else if (chapterNum) {
        result.spellIds.push(`canon-chapter-${chapterNum[1]}`);
      }
    }
  }

  // Extract custom proverbs
  const customProverbsMatch = content.match(/## Saved proverbs\s*[\s\S]*?Proverbs you added[^:]*:\s*([\s\S]*?)(?=##|---\s*##|$)/);
  if (customProverbsMatch) {
    result.customProverbs = customProverbsMatch[1].trim();
  }

  // Extract inscribed proverbs
  const inscribedMatch = content.match(/## Inscribed proverbs\s*([\s\S]*?)(?=##|$)/);
  if (inscribedMatch) {
    const proverbBlocks = inscribedMatch[1].matchAll(/\*\*(.+?)\*\*\s*\n\s*([\s\S]*?)(?=\*\*|---|\n\n\n|$)/g);
    for (const block of proverbBlocks) {
      const label = block[1].trim();
      const proverb = block[2].trim();

      // Convert label back to taleId
      let taleId = '';
      const storyMatch = label.match(/Story\s*·\s*Act\s*(\d+)/i);
      const zeroMatch = label.match(/Zero\s*·\s*Tale\s*(\d+)/i);
      const canonMatch = label.match(/Canon\s*·\s*Chapter\s*(\d+)/i);

      if (storyMatch) {
        taleId = `act-${storyMatch[1].padStart(2, '0')}-imported`;
      } else if (zeroMatch) {
        taleId = `zero-tale-${zeroMatch[1]}`;
      } else if (canonMatch) {
        taleId = `canon-chapter-${canonMatch[1]}`;
      }

      if (taleId && proverb) {
        result.inscribedProverbs[taleId] = proverb;
      }
    }
  }

  // Extract skill files
  const skillFilesMatch = content.match(/## Skill Files\s*([\s\S]*?)(?=##|$)/);
  if (skillFilesMatch) {
    const skillHeaders = skillFilesMatch[1].matchAll(/###\s+(\S+)\s+(.+?)(?:\n|$)/g);
    for (const header of skillHeaders) {
      // Try to match skill ID from common patterns
      const skillName = header[2].trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
      result.skillIds.push(skillName);
    }
  }

  // Extract constellation web
  const webMatch = content.match(/## Constellation web\s*([\s\S]*?)(?=##|$)/);
  if (webMatch) {
    // Extract connections
    const connectionsMatch = webMatch[1].match(/### Connections\s*([\s\S]*?)(?=###|---|\n\n\n|$)/);
    if (connectionsMatch) {
      const linkMatches = connectionsMatch[1].matchAll(/-\s*(.+?)\s*→\s*(.+?)(?:\n|$)/g);
      for (const link of linkMatches) {
        result.constellationWeb.links.push({
          source: link[1].trim(),
          target: link[2].trim(),
        });
      }
    }

    // Extract reflections
    const reflectMatch = webMatch[1].match(/### Reflect notes\s*([\s\S]*?)(?=###|---|\n\n\n|$)/);
    if (reflectMatch) {
      const reflectBlocks = reflectMatch[1].matchAll(/\*\*(.+?)\*\*\s*\n\s*([\s\S]*?)(?=\*\*|---|\n\n\n|$)/g);
      for (const block of reflectBlocks) {
        const nodeId = block[1].trim();
        const text = block[2].trim();
        if (nodeId && text) {
          result.constellationWeb.reflections[nodeId] = text;
        }
      }
    }
  }

  return result;
}

/**
 * Import a .soul file
 */
function importSoulFile(soul: SoulFile): ImportResult {
  try {
    // Import mage spells into spellbook
    const spellIds = soul.mage.spellOrbit.map((s) => s.id).filter(Boolean);

    // Get training data if available
    const skillIds: string[] = [];

    // Save to spellbook storage
    setSpellbookInStorage({ spellIds, skillIds });

    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('agentprivacy:spellbook-changed'));
      window.dispatchEvent(new CustomEvent('agentprivacy:soul-imported', { detail: soul }));
    }

    return {
      type: 'soul',
      success: true,
      message: `Imported soul file for ${soul.identity.personaName}`,
      details: {
        personaName: soul.identity.personaName,
        convergenceType: soul.convergenceType,
        spellsImported: soul.mage.spellOrbit.length,
        bladesImported: Object.values(soul.swordsman.bladeRing).filter(Boolean).length,
      },
    };
  } catch (e) {
    return {
      type: 'soul',
      success: false,
      message: `Failed to import soul file: ${e instanceof Error ? e.message : 'Unknown error'}`,
    };
  }
}

/**
 * Import a skills.md file
 */
function importSkillsMarkdown(content: string): ImportResult {
  try {
    const parsed = parseSkillsMarkdown(content);

    // Save spellbook
    setSpellbookInStorage({
      spellIds: parsed.spellIds,
      skillIds: parsed.skillIds,
    });

    // Save custom proverbs
    if (parsed.customProverbs) {
      setCustomProverbs(parsed.customProverbs);
    }

    // Save inscribed proverbs
    for (const [taleId, proverb] of Object.entries(parsed.inscribedProverbs)) {
      setInscribedProverb(taleId, proverb);
    }

    // Save constellation web
    if (parsed.constellationWeb.links.length > 0 || Object.keys(parsed.constellationWeb.reflections).length > 0) {
      setConstellationWeb(parsed.constellationWeb);
    }

    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('agentprivacy:spellbook-changed'));
    }

    return {
      type: 'skills',
      success: true,
      message: parsed.personaName ? `Imported skills for ${parsed.personaName}` : 'Imported skills.md',
      details: {
        personaName: parsed.personaName,
        spellsImported: parsed.spellIds.length,
        skillsImported: parsed.skillIds.length,
        proverbsImported: Object.keys(parsed.inscribedProverbs).length + (parsed.customProverbs ? 1 : 0),
      },
    };
  } catch (e) {
    return {
      type: 'skills',
      success: false,
      message: `Failed to import skills.md: ${e instanceof Error ? e.message : 'Unknown error'}`,
    };
  }
}

/**
 * Import a blade .md file
 */
function importBladeMd(content: string): ImportResult {
  try {
    const blade = parseAndAddBladeToInventory(content);
    if (!blade) {
      return {
        type: 'blade',
        success: false,
        message: 'Could not parse blade file',
      };
    }

    return {
      type: 'blade',
      success: true,
      message: `Imported blade: ${blade.primaryEmoji} ${blade.name}`,
      details: {
        bladesImported: 1,
      },
    };
  } catch (e) {
    return {
      type: 'blade',
      success: false,
      message: `Failed to import blade: ${e instanceof Error ? e.message : 'Unknown error'}`,
    };
  }
}

// ============================================
// COMPONENT
// ============================================

export default function SoulImportSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const content = await file.text();
    const fileType = detectFileType(content, file.name);

    let result: ImportResult;

    switch (fileType) {
      case 'soul': {
        const soul = parseSoulFile(content);
        if (soul) {
          result = importSoulFile(soul);
        } else {
          result = { type: 'soul', success: false, message: 'Invalid .soul file format' };
        }
        break;
      }
      case 'skills':
        result = importSkillsMarkdown(content);
        break;
      case 'blade':
        result = importBladeMd(content);
        break;
      default:
        result = { type: 'unknown', success: false, message: 'Unrecognized file format' };
    }

    setImportResult(result);

    // Clear result after delay
    setTimeout(() => setImportResult(null), 5000);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
      // Reset input
      e.target.value = '';
    },
    [handleFile]
  );

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-text mb-2 flex items-center gap-2">
        <span>📥</span>
        Import
      </h2>
      <p className="text-sm text-text/70 mb-3">
        Import your persona data: <code className="text-primary">.soul</code> files (convergence export),{' '}
        <code className="text-amber-400">skills.md</code> (spellbook export), or{' '}
        <code className="text-violet-400">blade.md</code> files (forged blades from spellweb).
      </p>

      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative p-6 rounded-lg border-2 border-dashed cursor-pointer transition-all
          ${isDragging
            ? 'border-primary bg-primary/10'
            : 'border-surface/50 bg-surface/5 hover:border-surface hover:bg-surface/10'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".soul,.md,.json"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="text-center">
          <div className="text-3xl mb-2">
            {isDragging ? '📥' : '📂'}
          </div>
          <p className="text-sm text-text-muted">
            {isDragging ? 'Drop file to import' : 'Drop file here or click to browse'}
          </p>
          <p className="text-xs text-text-muted/60 mt-1">
            Supports .soul, skills.md, blade.md
          </p>
        </div>
      </div>

      {/* Import result */}
      <AnimatePresence>
        {importResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              mt-3 p-3 rounded-lg border text-sm
              ${importResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
              }
            `}
          >
            <div className="flex items-start gap-2">
              <span>{importResult.success ? '✓' : '✗'}</span>
              <div>
                <p className="font-medium">{importResult.message}</p>
                {importResult.details && (
                  <div className="text-xs mt-1 opacity-80">
                    {importResult.details.personaName && (
                      <span className="mr-3">Persona: {importResult.details.personaName}</span>
                    )}
                    {importResult.details.spellsImported !== undefined && importResult.details.spellsImported > 0 && (
                      <span className="mr-3">{importResult.details.spellsImported} spells</span>
                    )}
                    {importResult.details.skillsImported !== undefined && importResult.details.skillsImported > 0 && (
                      <span className="mr-3">{importResult.details.skillsImported} skills</span>
                    )}
                    {importResult.details.bladesImported !== undefined && importResult.details.bladesImported > 0 && (
                      <span className="mr-3">{importResult.details.bladesImported} blades</span>
                    )}
                    {importResult.details.convergenceType && (
                      <span className="mr-3">Type: {importResult.details.convergenceType}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
