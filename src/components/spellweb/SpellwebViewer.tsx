'use client';

import { useMemo, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { buildSpellweb, type BuildSpellwebOptions } from '@/lib/spellweb/builder';
import type { SpellCard } from '@/lib/grimoire-baked';
import type { SkillFileMeta } from '@/lib/skills-data';
import type { SpellwebNode, SpellwebLink } from '@/lib/spellweb/types';

const ForceGraph2D = dynamic(
  () => import('react-force-graph-2d').then((m) => m.default),
  { ssr: false }
);

interface SpellwebViewerProps {
  selectedSpellIds: string[];
  selectedSkillIds: string[];
  spellCards: SpellCard[];
  skillFiles: SkillFileMeta[];
  inscribedMarkers?: Record<string, string>;
}

export default function SpellwebViewer({
  selectedSpellIds,
  selectedSkillIds,
  spellCards,
  skillFiles,
  inscribedMarkers = {},
}: SpellwebViewerProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const graphData = useMemo(
    () => buildSpellweb(selectedSpellIds, selectedSkillIds, spellCards, skillFiles, { inscribedMarkers }),
    [selectedSpellIds, selectedSkillIds, spellCards, skillFiles, inscribedMarkers]
  );

  const nodeCanvasObject = useCallback((node: { x?: number; y?: number } & Partial<SpellwebNode>, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const n = node as SpellwebNode & { x: number; y: number };
    const x = n.x ?? 0;
    const y = n.y ?? 0;
    const isHovered = hoveredNode === n.id;

    // Base radius from node value
    const baseRadius = n.val || 8;
    const radius = isHovered ? baseRadius * 1.2 : baseRadius;

    // Draw glow for nodes on path or hovered
    if (n.isOnPath || isHovered) {
      ctx.save();
      ctx.shadowColor = n.isOnPath ? '#fbbf24' : '#8b5cf6';
      ctx.shadowBlur = isHovered ? 20 : 12;
      ctx.beginPath();
      ctx.arc(x, y, radius + 2, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fill();
      ctx.restore();
    }

    // Draw node background circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);

    // Gradient fill for grimoire nodes
    if (n.type === 'grimoire') {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, n.color || '#6366f1');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0.3)');
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = n.isLit ? (n.color || '#8b5cf6') : 'rgba(100,100,100,0.3)';
    }
    ctx.fill();

    // Draw border
    ctx.strokeStyle = n.isOnPath ? '#fbbf24' : 'rgba(255,255,255,0.2)';
    ctx.lineWidth = n.isOnPath ? 2 : 1;
    ctx.stroke();

    // Draw emoji in center
    const emojiSize = n.type === 'grimoire' ? radius * 1.2 : radius * 1.4;
    ctx.font = `${emojiSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.emoji || '⚫', x, y);

    // Draw short label below (only if zoomed in enough or grimoire)
    const showLabel = globalScale > 0.5 || n.type === 'grimoire' || isHovered;
    if (showLabel && n.label) {
      const fontSize = Math.max(10 / globalScale, 8);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(226, 232, 240, 0.9)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(n.label, x, y + radius + 4);
    }
  }, [hoveredNode]);

  const linkCanvasObject = useCallback((link: object, ctx: CanvasRenderingContext2D) => {
    const l = link as SpellwebLink & { source: { x: number; y: number }; target: { x: number; y: number } };
    const sourceNode = l.source as { x: number; y: number };
    const targetNode = l.target as { x: number; y: number };

    if (!sourceNode || !targetNode) return;

    ctx.beginPath();
    ctx.moveTo(sourceNode.x, sourceNode.y);
    ctx.lineTo(targetNode.x, targetNode.y);

    if (l.type === 'sequence') {
      // Sequential path - dashed, brighter
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
    } else if (l.type === 'constellation') {
      // Constellation core - thick, glowing
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
    } else if (l.type === 'cluster') {
      // Skill cluster - dotted
      ctx.strokeStyle = 'rgba(132, 204, 22, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
    } else {
      // Grimoire connection - solid, subtle
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
    }

    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  const handleNodeHover = useCallback((node: object | null) => {
    const n = node as SpellwebNode | null;
    setHoveredNode(n?.id || null);
  }, []);

  return (
    <div className="relative h-[400px] border border-surface/50 rounded-xl overflow-hidden bg-surface/10">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel={(node) => (node as SpellwebNode).fullTitle || (node as SpellwebNode).name || ''}
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        onNodeHover={handleNodeHover}
        nodePointerAreaPaint={(node, color, ctx) => {
          const n = node as SpellwebNode & { x: number; y: number };
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(n.x, n.y, (n.val || 8) + 4, 0, 2 * Math.PI);
          ctx.fill();
        }}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        linkDirectionalParticles={0}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        backgroundColor="transparent"
      />

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-xs text-text-muted bg-background/80 rounded-lg px-3 py-2">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> Spells
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#84cc16]" /> Skills
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-[#fbbf24]" style={{ borderStyle: 'dashed' }} /> Path
        </span>
      </div>

      {/* Hover tooltip */}
      {hoveredNode && (
        <div className="absolute top-3 right-3 bg-background/90 border border-surface/50 rounded-lg px-3 py-2 text-sm max-w-[200px]">
          {graphData.nodes.find(n => n.id === hoveredNode)?.fullTitle || hoveredNode}
        </div>
      )}
    </div>
  );
}
