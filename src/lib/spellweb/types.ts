/**
 * Spellweb graph types for visualization on /spells.
 * Enhanced for emoji constellation display.
 */

export interface SpellwebNode {
  id: string;
  type: 'grimoire' | 'spell' | 'skill' | 'persona' | 'ceremony';

  // Display
  emoji: string;              // Primary emoji (marker or default)
  label: string;              // Short label (I, II, 7, etc.)
  fullTitle?: string;         // Full title for tooltip

  // Legacy compat
  name: string;               // Same as fullTitle for backward compat

  // Graph properties
  val: number;                // Node size
  color?: string;             // Node color
  group?: string;             // For clustering (grimoire name)

  // Journey state
  isLit: boolean;             // User has selected/completed this
  isOnPath: boolean;          // Part of constellation path
  sequenceNumber?: number;    // Order in path (for sequential connections)
}

export interface SpellwebLink {
  source: string;
  target: string;
  type: 'grimoire' | 'sequence' | 'cluster' | 'constellation';
}

export interface SpellwebData {
  nodes: SpellwebNode[];
  links: SpellwebLink[];
}
