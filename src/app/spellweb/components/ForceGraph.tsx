'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { SpellwebKGNode, SpellwebKGEdge } from '@/lib/spellweb/kg-types';
import { GUILD_COLORS, MATURITY_SIZES } from '@/lib/spellweb/kg-types';

type SimNode = SpellwebKGNode & { x?: number; y?: number; vx?: number; vy?: number };
type SimLink = SpellwebKGEdge & { source: SimNode; target: SimNode };

function polygonPoints(sides: number, radius: number): string {
  if (sides <= 1) return '';
  return Array.from({ length: sides }, (_, i) => {
    const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
    return `${radius * Math.cos(angle)},${radius * Math.sin(angle)}`;
  }).join(' ');
}

interface ForceGraphProps {
  nodes: SpellwebKGNode[];
  edges: SpellwebKGEdge[];
}

export default function ForceGraph({ nodes, edges }: ForceGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [dimensions, setDimensions] = useState({ width: 800, height: 520 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0]?.contentRect ?? { width: 800, height: 520 };
      setDimensions({ width: Math.max(100, width), height: Math.max(100, height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (nodes.length === 0) return;
    const width = dimensions.width;
    const height = dimensions.height;
    const simNodes: SimNode[] = nodes.map((n) => ({
      ...n,
      x: width / 2 + (Math.random() - 0.5) * width * 0.6,
      y: height / 2 + (Math.random() - 0.5) * height * 0.6,
    }));
    const initialPos = new Map<string, { x: number; y: number }>();
    simNodes.forEach((n) => {
      if (n.x != null && n.y != null) initialPos.set(n.id, { x: n.x, y: n.y });
    });
    setPositions(initialPos);

    const simLinks: SimLink[] = edges.map((e) => {
      const source = simNodes.find((n) => n.id === e.source);
      const target = simNodes.find((n) => n.id === e.target);
      if (!source || !target) return null;
      return { ...e, source, target };
    }).filter(Boolean) as SimLink[];

    const simulation = d3
      .forceSimulation(simNodes)
      .force(
        'link',
        d3
          .forceLink(simLinks)
          .distance((d: SimLink) => 120 - d.strength * 80)
          .strength((d: SimLink) => d.strength * 0.3)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.05))
      .force(
        'collide',
        d3.forceCollide<SimNode>().radius((d) => MATURITY_SIZES[d.maturity] + 4)
      )
      .on('tick', () => {
        const next = new Map<string, { x: number; y: number }>();
        simNodes.forEach((n) => {
          if (n.x != null && n.y != null) next.set(n.id, { x: n.x, y: n.y });
        });
        setPositions(new Map(next));
      });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, dimensions.width, dimensions.height]);

  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    zoomRef.current = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.2, 4]).on('zoom', (ev) => {
      const g = svg.querySelector('g.zoom-group');
      if (g) (g as SVGElement).setAttribute('transform', ev.transform.toString());
    });
    d3.select(svg).call(zoomRef.current);
    return () => {
      d3.select(svg).on('.zoom', null);
    };
  }, []);

  if (nodes.length === 0) return <div className="w-full h-[520px] flex items-center justify-center text-text-muted">No nodes</div>;

  const { width, height } = dimensions;

  return (
    <div ref={containerRef} className="w-full h-full min-h-[520px] relative">
      <svg ref={svgRef} width={width} height={height} className="bg-transparent overflow-visible">
        <defs>
          <linearGradient id="gradient-amber-violet" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4A017" />
            <stop offset="100%" stopColor="#7C6FEF" />
          </linearGradient>
          <marker id="arrow" viewBox="0 -5 10 10" refX="12" refY="0" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,-5L10,0L0,5" fill="#6B7280" />
          </marker>
        </defs>
        <g className="zoom-group">
          {/* Edges */}
          <g className="edges">
            {edges.map((edge, i) => {
              const srcPos = positions.get(edge.source);
              const tgtPos = positions.get(edge.target);
              if (!srcPos || !tgtPos) return null;
              const isPrincipleExtends = edge.type === 'principle_extends';
              const isDashed = edge.type === 'inscription_echo' || edge.type === 'dependency';
              const stroke = edge.type === 'guild_bridge' ? 'url(#gradient-amber-violet)' : '#6B7280';
              const strokeWidth = 1 + edge.strength * 2;
              return (
                <line
                  key={`${edge.source}-${edge.target}-${i}`}
                  x1={srcPos.x}
                  y1={srcPos.y}
                  x2={tgtPos.x}
                  y2={tgtPos.y}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isDashed ? '4 4' : undefined}
                  markerEnd={isPrincipleExtends ? 'url(#arrow)' : undefined}
                  opacity={edge.type === 'dependency' ? 0.6 : 0.9}
                />
              );
            })}
          </g>
          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node) => {
              const pos = positions.get(node.id);
              if (!pos) return null;
              const radius = MATURITY_SIZES[node.maturity];
              const color = GUILD_COLORS[node.guild];
              const sides = Math.max(1, Math.min(6, node.complexity));
              return (
                <g key={node.id} transform={`translate(${pos.x},${pos.y})`}>
                  {sides <= 1 ? (
                    <circle r={radius} fill={color} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                  ) : (
                    <polygon
                      points={polygonPoints(sides, radius)}
                      fill={color}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth={1}
                    />
                  )}
                  <text
                    y={radius + 6}
                    textAnchor="middle"
                    dominantBaseline="hanging"
                    fill="rgba(226,232,240,0.95)"
                    fontSize={10}
                    fontWeight="600"
                  >
                    {node.label.length > 22 ? node.label.slice(0, 21) + '…' : node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}
