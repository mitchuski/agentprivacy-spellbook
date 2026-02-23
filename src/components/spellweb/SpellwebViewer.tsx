'use client';

import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fgRef = useRef<{ d3Force: (name: string, force?: (() => void) | null) => unknown } | null>(null);

  useEffect(() => {
    if (!isFullscreen) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    document.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const graphData = useMemo(
    () => buildSpellweb(selectedSpellIds, selectedSkillIds, spellCards, skillFiles, { inscribedMarkers }),
    [selectedSpellIds, selectedSkillIds, spellCards, skillFiles, inscribedMarkers]
  );

  // Smaller nodes and emojis so yellow lines define the shapes
  const NODE_SCALE = 0.45;
  const EMOJI_SCALE = 0.85;

  const nodeCanvasObject = useCallback((node: { x?: number; y?: number } & Partial<SpellwebNode>, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const n = node as SpellwebNode & { x: number; y: number };
    const x = n.x ?? 0;
    const y = n.y ?? 0;
    const isHovered = hoveredNode === n.id;

    // Base radius from node value, scaled down so lines lead the eye
    const baseRadius = (n.val || 8) * NODE_SCALE;
    const radius = isHovered ? baseRadius * 1.2 : baseRadius;

    // Draw glow for nodes on path or hovered
    if (n.isOnPath || isHovered) {
      ctx.save();
      ctx.shadowColor = n.isOnPath ? '#fbbf24' : '#8b5cf6';
      ctx.shadowBlur = isHovered ? 14 : 8;
      ctx.beginPath();
      ctx.arc(x, y, radius + 1.5, 0, 2 * Math.PI);
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
    ctx.lineWidth = n.isOnPath ? 1.5 : 0.8;
    ctx.stroke();

    // Draw emoji smaller so lines are the primary shape
    const emojiSize = (n.type === 'grimoire' ? radius * 1.1 : radius * 1.2) * EMOJI_SCALE;
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
      ctx.fillText(n.label, x, y + radius + 3);
    }
  }, [hoveredNode]);

  const linkCanvasObject = useCallback(
    (link: object, ctx: CanvasRenderingContext2D) => {
      const l = link as SpellwebLink & { source: { x: number; y: number; id?: string }; target: { x: number; y: number; id?: string } };
      const sourceNode = l.source as { x: number; y: number };
      const targetNode = l.target as { x: number; y: number };

      if (!sourceNode || !targetNode || sourceNode.x == null || targetNode.x == null) return;

      const sourceId = typeof l.source === 'object' && l.source && 'id' in l.source ? (l.source as { id: string }).id : (l.source as string);
      const targetId = typeof l.target === 'object' && l.target && 'id' in l.target ? (l.target as { id: string }).id : (l.target as string);
      const linkType = l.type ?? graphData.links.find((lnk) => lnk.source === sourceId && lnk.target === targetId)?.type ?? 'grimoire';

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);

      if (linkType === 'sequence') {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
      } else if (linkType === 'constellation') {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
        ctx.lineWidth = 3.5;
        ctx.setLineDash([]);
      } else if (linkType === 'cluster') {
        ctx.strokeStyle = 'rgba(132, 204, 22, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
      } else {
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
      }

      ctx.stroke();
      ctx.setLineDash([]);
    },
    [graphData.links]
  );

  const handleNodeHover = useCallback((node: object | null) => {
    const n = node as SpellwebNode | null;
    setHoveredNode(n?.id || null);
  }, []);

  // Per-link distance: spell→spellbook short (tight clusters), spell→spell medium (readable). Softer charge so spellbooks stay closer together.
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg?.d3Force) return;
    const linkForce = fg.d3Force('link') as {
      distance: (d: number | ((link: SpellwebLink & { source: unknown; target: unknown }) => number)) => void;
    } | undefined;
    const chargeForce = fg.d3Force('charge') as { strength: (s: number) => void } | undefined;
    if (linkForce?.distance) {
      linkForce.distance((link: SpellwebLink & { source: unknown; target: unknown }) => {
        if (link.type === 'grimoire' || link.type === 'cluster') return 110;
        return 220;
      });
    }
    if (chargeForce?.strength) chargeForce.strength(-95);
  }, [graphData]);

  const graphContent = (
    <>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel={(node) => (node as SpellwebNode).fullTitle || (node as SpellwebNode).name || ''}
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        onNodeHover={handleNodeHover}
        nodePointerAreaPaint={(node, color, ctx) => {
          const n = node as SpellwebNode & { x: number; y: number };
          const r = (n.val || 8) * NODE_SCALE + 6;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
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
    </>
  );

  if (isFullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col bg-background"
        role="dialog"
        aria-modal="true"
        aria-label="Spellweb fullscreen"
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-surface/50 bg-surface/20 shrink-0">
          <span className="text-sm font-medium text-text-muted">Your Spellweb</span>
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="px-3 py-2 rounded-lg text-text-muted hover:text-text hover:bg-surface/50 transition-colors font-medium"
            aria-label="Close fullscreen"
          >
            Close
          </button>
        </div>
        <div className="flex-1 min-h-0 relative w-full">
          <div className="absolute inset-0 w-full h-full">
            {graphContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] border border-surface/50 rounded-xl overflow-hidden bg-surface/10">
      {graphContent}
      <button
        type="button"
        onClick={() => setIsFullscreen(true)}
        className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg bg-background/80 hover:bg-background border border-surface/50 text-text-muted hover:text-text text-sm font-medium transition-colors"
        title="Expand spellweb to fullscreen"
        aria-label="Expand spellweb to fullscreen"
      >
        Expand
      </button>
    </div>
  );
}
