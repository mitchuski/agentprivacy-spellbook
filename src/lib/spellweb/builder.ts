/**
 * Builds nodes and links for the spellweb from selected spells and skills.
 * Enhanced with emoji constellation, short labels, and sequential connections.
 */

import type { SpellCard } from '@/lib/grimoire-baked';
import type { SkillFileMeta } from '@/lib/skills-data';
import type { SpellwebNode, SpellwebLink } from './types';
import {
  getShortLabel,
  getSequenceNumber,
  getGrimoireFromSpellId,
  getGrimoireEmoji,
  getGrimoireColor,
  getGrimoireDisplayName,
} from './labels';

export interface BuildSpellwebOptions {
  inscribedMarkers?: Record<string, string>; // spellId → markerEmoji
}

export function buildSpellweb(
  selectedSpellIds: string[],
  selectedSkillIds: string[],
  spellCards: SpellCard[],
  skillFiles: SkillFileMeta[],
  options: BuildSpellwebOptions = {}
): { nodes: SpellwebNode[]; links: SpellwebLink[] } {
  const { inscribedMarkers = {} } = options;
  const nodes: SpellwebNode[] = [];
  const links: SpellwebLink[] = [];
  const nodeIds = new Set<string>();

  // Track spells by grimoire for sequential connections
  const spellsByGrimoire: Record<string, { id: string; seq: number }[]> = {};

  // 1. Build grimoire hub nodes
  const grimoireIds = new Set<string>();

  for (const id of selectedSpellIds) {
    const card = spellCards.find((c) => c.id === id);
    if (!card) continue;

    const grimoire = card.spellbook || getGrimoireFromSpellId(id);
    const gid = `grimoire-${grimoire}`;

    // Add grimoire node if not exists
    if (!grimoireIds.has(gid)) {
      grimoireIds.add(gid);
      nodeIds.add(gid);
      nodes.push({
        id: gid,
        type: 'grimoire',
        emoji: getGrimoireEmoji(grimoire),
        label: getGrimoireDisplayName(grimoire),
        fullTitle: `${getGrimoireDisplayName(grimoire)} Spellbook`,
        name: getGrimoireDisplayName(grimoire),
        val: 14,
        color: getGrimoireColor(grimoire),
        group: grimoire,
        isLit: true,
        isOnPath: false,
      });
    }

    // Track for sequential connections
    const seq = getSequenceNumber(id);
    if (seq !== null) {
      if (!spellsByGrimoire[grimoire]) spellsByGrimoire[grimoire] = [];
      spellsByGrimoire[grimoire].push({ id, seq });
    }

    // Add spell node
    const nid = `spell-${id}`;
    if (!nodeIds.has(nid)) {
      nodeIds.add(nid);

      // Use inscribed marker emoji if available, otherwise grimoire default
      const markerEmoji = inscribedMarkers[id] || getGrimoireEmoji(grimoire);

      nodes.push({
        id: nid,
        type: 'spell',
        emoji: markerEmoji,
        label: getShortLabel(id),
        fullTitle: card.title,
        name: card.title,
        val: 10,
        color: getGrimoireColor(grimoire),
        group: grimoire,
        isLit: true,
        isOnPath: !!inscribedMarkers[id], // On path if user inscribed a marker
        sequenceNumber: seq ?? undefined,
      });
    }

    // Link spell to grimoire
    links.push({
      source: nid,
      target: gid,
      type: 'grimoire',
    });
  }

  // 2. Create sequential connections within each grimoire
  for (const [grimoire, spells] of Object.entries(spellsByGrimoire)) {
    // Sort by sequence number
    spells.sort((a, b) => a.seq - b.seq);

    // Connect adjacent spells
    for (let i = 0; i < spells.length - 1; i++) {
      const current = spells[i];
      const next = spells[i + 1];

      // Only connect if they're adjacent in sequence
      if (next.seq === current.seq + 1) {
        links.push({
          source: `spell-${current.id}`,
          target: `spell-${next.id}`,
          type: 'sequence',
        });
      }
    }
  }

  // 3. Build skills hub and skill nodes
  const skillGid = 'grimoire-skills';
  if (selectedSkillIds.length > 0) {
    if (!nodeIds.has(skillGid)) {
      nodeIds.add(skillGid);
      nodes.push({
        id: skillGid,
        type: 'grimoire',
        emoji: '🧠',
        label: 'Skills',
        fullTitle: 'Agent Skill Files',
        name: 'Skills',
        val: 14,
        color: '#84cc16',
        group: 'skills',
        isLit: true,
        isOnPath: false,
      });
    }
  }

  for (const id of selectedSkillIds) {
    const meta = skillFiles.find((s) => s.id === id);
    if (!meta) continue;

    const nid = `skill-${id}`;
    if (!nodeIds.has(nid)) {
      nodeIds.add(nid);
      nodes.push({
        id: nid,
        type: 'skill',
        emoji: meta.seedEmoji || '🌱',
        label: meta.seedName.split(' ')[0], // First word only
        fullTitle: meta.seedName,
        name: meta.seedName,
        val: 8,
        color: '#84cc16',
        group: 'skills',
        isLit: true,
        isOnPath: false,
      });
    }

    links.push({
      source: nid,
      target: skillGid,
      type: 'cluster',
    });
  }

  return { nodes, links };
}
