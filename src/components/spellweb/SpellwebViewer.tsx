'use client';

import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { buildSpellweb } from '@/lib/spellweb/builder';
import type { SpellCard } from '@/lib/grimoire-baked';
import type { SkillFileMeta } from '@/lib/skills-data';
import type { SpellwebNode, SpellwebLink } from '@/lib/spellweb/types';

const USER_LINKS_STORAGE_KEY = 'agentprivacy-spellweb-user-links';

const ForceGraph2D = dynamic(
  () => import('react-force-graph-2d').then((m) => m.default),
  { ssr: false }
);

function loadUserLinks(): Array<{ source: string; target: string }> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_LINKS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Array<{ source: string; target: string }>;
  } catch {
    // ignore
  }
  return [];
}

function saveUserLinks(links: Array<{ source: string; target: string }>) {
  try {
    localStorage.setItem(USER_LINKS_STORAGE_KEY, JSON.stringify(links));
  } catch {
    // ignore
  }
}

interface SpellwebViewerProps {
  selectedSpellIds: string[];
  selectedSkillIds: string[];
  spellCards: SpellCard[];
  skillFiles: SkillFileMeta[];
  inscribedMarkers?: Record<string, string>;
  filterGroups?: string[] | null;
  showTerms?: boolean;
  isExpanded?: boolean;
  onExpandToggle?: (expanded: boolean) => void;
  onFocusedNodeChange?: (node: { emoji: string; fullName: string; nodeId: string } | null) => void;
  onSelectedNodeChange?: (node: { id: string; emoji: string; fullName: string } | null) => void;
  connectRequested?: boolean;
  onConnectComplete?: () => void;
}

export default function SpellwebViewer({
  selectedSpellIds,
  selectedSkillIds,
  spellCards,
  skillFiles,
  inscribedMarkers = {},
  filterGroups = null,
  showTerms = false,
  isExpanded = false,
  onExpandToggle,
  onFocusedNodeChange,
  onSelectedNodeChange,
  connectRequested = false,
  onConnectComplete,
}: SpellwebViewerProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userLinks, setUserLinks] = useState<Array<{ source: string; target: string }>>(loadUserLinks);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const fgRef = useRef<{ d3Force: (name: string, force?: (() => void) | null) => unknown } | null>(null);

  const effectiveFullscreen = isExpanded ?? isFullscreen;

  useEffect(() => {
    if (!effectiveFullscreen) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        onExpandToggle?.(false);
        onConnectComplete?.();
      }
    };
    document.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [effectiveFullscreen, onExpandToggle]);

  const fullGraphData = useMemo(
    () => buildSpellweb(selectedSpellIds, selectedSkillIds, spellCards, skillFiles, { inscribedMarkers }),
    [selectedSpellIds, selectedSkillIds, spellCards, skillFiles, inscribedMarkers]
  );

  const graphData = useMemo(() => {
    let nodes = fullGraphData.nodes;
    let links: SpellwebLink[] = [...fullGraphData.links];

    if (filterGroups && filterGroups.length > 0) {
      const allowed = new Set(filterGroups);
      nodes = nodes.filter((n) => n.group && allowed.has(n.group));
      const nodeIds = new Set(nodes.map((n) => n.id));
      links = fullGraphData.links.filter((l) => {
        const src = typeof l.source === 'object' && l.source && 'id' in l.source ? (l.source as { id: string }).id : (l.source as string);
        const tgt = typeof l.target === 'object' && l.target && 'id' in l.target ? (l.target as { id: string }).id : (l.target as string);
        return nodeIds.has(src) && nodeIds.has(tgt);
      });
    }

    const userConnectLinks: SpellwebLink[] = userLinks
      .filter((u) => nodes.some((n) => n.id === u.source) && nodes.some((n) => n.id === u.target))
      .map((u) => ({ source: u.source, target: u.target, type: 'connect' as const }));
    links = [...links, ...userConnectLinks];

    return { nodes, links };
  }, [fullGraphData, filterGroups, userLinks]);

  const NODE_SCALE = 0.45;
  const EMOJI_SCALE = 1.4;

  const nodeCanvasObject = useCallback(
    (node: { x?: number; y?: number } & Partial<SpellwebNode>, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const n = node as SpellwebNode & { x: number; y: number };
      const x = n.x ?? 0;
      const y = n.y ?? 0;
      const isHovered = hoveredNode === n.id;
      const selected = selectedNodeId === n.id;
      const connectHighlight = connectRequested && selectedNodeId === n.id;

      const baseRadius = (n.val || 8) * NODE_SCALE;
      const radius = isHovered || selected || connectHighlight ? baseRadius * 1.2 : baseRadius;

      if (n.isOnPath || isHovered || selected || connectHighlight) {
        ctx.save();
        ctx.shadowColor = connectHighlight ? '#06b6d4' : selected ? '#06b6d4' : n.isOnPath ? '#fbbf24' : '#8b5cf6';
        ctx.shadowBlur = connectHighlight ? 14 : isHovered ? 14 : 8;
        ctx.beginPath();
        ctx.arc(x, y, radius + 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fill();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);

      if (n.type === 'grimoire') {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, n.color || '#6366f1');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.3)');
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = n.isLit ? (n.color || '#8b5cf6') : 'rgba(100,100,100,0.3)';
      }
      ctx.fill();

      ctx.strokeStyle = connectHighlight ? '#06b6d4' : selected ? '#06b6d4' : n.isOnPath ? '#fbbf24' : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = connectHighlight ? 2 : selected ? 2 : n.isOnPath ? 1.5 : 0.8;
      ctx.stroke();

      const emojiSize = (n.type === 'grimoire' ? radius * 1.25 : radius * 1.4) * EMOJI_SCALE;
      ctx.save();
      ctx.font = `${emojiSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const glowColor = n.color || '#8b5cf6';
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = radius * 0.8;
      ctx.fillText(n.emoji || '⚫', x, y);
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      ctx.fillText(n.emoji || '⚫', x, y);
      ctx.restore();

      const showLabel = showTerms || n.type === 'grimoire' || isHovered || selected || connectHighlight;
      if (showLabel && (n.label || n.fullTitle)) {
        const text = (n.fullTitle || n.label || '').slice(0, 28);
        const fontSize = Math.max(10 / globalScale, 8);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = isHovered || selected ? '#ffffff' : 'rgba(226, 232, 240, 0.9)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(text, x, y + radius + 3);
      }
    },
    [hoveredNode, selectedNodeId, connectRequested, showTerms]
  );

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

      if (linkType === 'connect') {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
      } else if (linkType === 'sequence') {
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

  const lastReportedFocusRef = useRef<string | null>(null);

  const reportFocused = useCallback(
    (nodeId: string | null) => {
      if (!onFocusedNodeChange) return;
      const node = nodeId ? graphData.nodes.find((n) => n.id === nodeId) : null;
      const willReportNull = !nodeId || !node;
      const nextKey = willReportNull ? null : nodeId;
      if (lastReportedFocusRef.current === nextKey) return;
      lastReportedFocusRef.current = nextKey;
      if (willReportNull) {
        onFocusedNodeChange(null);
        return;
      }
      onFocusedNodeChange({
        emoji: node!.emoji || '⚫',
        fullName: node!.fullTitle || node!.name || node!.label || nodeId,
        nodeId,
      });
    },
    [onFocusedNodeChange, graphData.nodes]
  );

  useEffect(() => {
    const id = selectedNodeId ?? hoveredNode;
    reportFocused(id);
  }, [selectedNodeId, hoveredNode, reportFocused]);

  const handleNodeHover = useCallback((node: object | null) => {
    const n = node as SpellwebNode | null;
    setHoveredNode(n?.id || null);
  }, []);

  const handleNodeClick = useCallback(
    (node: object | null) => {
      const n = node as SpellwebNode | null;
      const nodeId = n?.id ?? null;

      if (connectRequested && selectedNodeId && nodeId && nodeId !== selectedNodeId) {
        const newLinks = [...userLinks, { source: selectedNodeId, target: nodeId }];
        setUserLinks(newLinks);
        saveUserLinks(newLinks);
        onConnectComplete?.();
        return;
      }

      const nextId = selectedNodeId === nodeId ? null : nodeId;
      setSelectedNodeId(nextId);
      if (onSelectedNodeChange) {
        if (!nextId) {
          onSelectedNodeChange(null);
        } else {
          const node = graphData.nodes.find((nd) => nd.id === nextId);
          if (node) {
            onSelectedNodeChange({
              id: node.id,
              emoji: node.emoji || '⚫',
              fullName: node.fullTitle || node.name || node.label || nextId,
            });
          }
        }
      }
    },
    [connectRequested, selectedNodeId, userLinks, onConnectComplete, onSelectedNodeChange, graphData.nodes]
  );

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg?.d3Force) return;
    const linkForce = fg.d3Force('link') as {
      distance: (d: number | ((link: SpellwebLink & { source: unknown; target: unknown }) => number)) => void;
    } | undefined;
    const chargeForce = fg.d3Force('charge') as { strength: (s: number) => void } | undefined;
    if (linkForce?.distance) {
      linkForce.distance((link: SpellwebLink & { source: unknown; target: unknown }) => {
        if (link.type === 'connect') return 180;
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
        onNodeClick={handleNodeClick}
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
    </>
  );

  const handleExpandClose = () => {
    setIsFullscreen(false);
    onExpandToggle?.(false);
    onConnectComplete?.();
  };

  if (effectiveFullscreen) {
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
            onClick={handleExpandClose}
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
    <div className="relative h-full min-h-[480px] overflow-hidden bg-surface/10">
      {graphContent}
    </div>
  );
}
