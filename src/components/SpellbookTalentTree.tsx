'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface TalentTreeNode {
  id: number;
  label: string;
  shortLabel?: string;
}

interface SpellbookTalentTreeProps {
  nodes: TalentTreeNode[];
  activeId: number;
  onSelect: (id: number) => void;
  /** Max node id the user has "learned" (path stays lit when navigating away). Optional. */
  learnedUpToId?: number;
  /** Custom pathway: node ids that form your unique path (e.g. from selected spells). When set, path is drawn through these nodes in order. */
  pathwayNodeIds?: number[];
  /** Max nodes per row before wrapping (default 8) */
  nodesPerRow?: number;
  /** Label for node type e.g. "Act", "Tale", "Chapter" */
  nodeKind?: string;
  /** When set, the single crystal between nodes is clickable and opens inscribe-proverb for that node (nodeId). */
  onCrystalClick?: (nodeId: number) => void;
  /** Per-node constellation marker emoji (from inscribed spell). If set, shown between nodes instead of 🔮; lit when node is in pathway. */
  markerEmojiByNodeId?: Record<number, string>;
}

function nodeIndex(nodes: TalentTreeNode[], id: number): number {
  const i = nodes.findIndex((n) => n.id === id);
  return i >= 0 ? i : -1;
}

export default function SpellbookTalentTree({
  nodes,
  activeId,
  onSelect,
  learnedUpToId,
  pathwayNodeIds,
  nodesPerRow = 8,
  nodeKind = 'Node',
  onCrystalClick,
  markerEmojiByNodeId,
}: SpellbookTalentTreeProps) {
  const rows: TalentTreeNode[][] = [];
  for (let i = 0; i < nodes.length; i += nodesPerRow) {
    rows.push(nodes.slice(i, i + nodesPerRow));
  }
  const activeIdx = nodeIndex(nodes, activeId);
  const learnedIdx = learnedUpToId != null ? nodeIndex(nodes, learnedUpToId) : -1;
  const pathwaySet = pathwayNodeIds != null && pathwayNodeIds.length > 0
    ? new Set(pathwayNodeIds)
    : null;
  const pathwayIndexByNode = pathwaySet
    ? new Map<number, number>(pathwayNodeIds!.map((id, i) => [id, i]))
    : null;

  /** When pathwayNodeIds is set: node is on path if in pathway. Connector before/after is on path if both nodes are consecutive in pathway. */
  /** Otherwise: path lights from start to the furthest of current selection and learned progress */
  const getIsOnPath = (nodeIdx: number, nodeId: number): boolean => {
    if (pathwaySet) return pathwaySet.has(nodeId);
    const pathEndIdx = Math.max(activeIdx, learnedIdx);
    return pathEndIdx >= 0 && nodeIdx <= pathEndIdx;
  };
  const getConnectorBeforeOnPath = (nodeIdx: number, nodeId: number, colIndex: number): boolean => {
    if (colIndex === 0) return false;
    if (pathwayIndexByNode && pathwaySet) {
      const prevNode = rows.flat()[nodeIdx - 1];
      if (!prevNode) return false;
      const myOrder = pathwayIndexByNode.get(nodeId);
      const prevOrder = pathwayIndexByNode.get(prevNode.id);
      return myOrder != null && prevOrder != null && myOrder === prevOrder + 1;
    }
    const pathEndIdx = Math.max(activeIdx, learnedIdx);
    return pathEndIdx >= 0 && nodeIdx <= pathEndIdx;
  };
  const getConnectorAfterOnPath = (nodeIdx: number, nodeId: number, isLastInRow: boolean): boolean => {
    if (isLastInRow) return false;
    if (pathwayIndexByNode && pathwaySet) {
      const nextNode = rows.flat()[nodeIdx + 1];
      if (!nextNode) return false;
      const myOrder = pathwayIndexByNode.get(nodeId);
      const nextOrder = pathwayIndexByNode.get(nextNode.id);
      return myOrder != null && nextOrder != null && nextOrder === myOrder + 1;
    }
    const pathEndIdx = Math.max(activeIdx, learnedIdx);
    return pathEndIdx >= 0 && nodeIdx < pathEndIdx;
  };

  /** The single crystal between prev and this node lights if this act/tale is in the user's spellbook (inscribed proverb). */
  const isCrystalLitForNode = (nodeId: number): boolean =>
    pathwaySet != null && pathwaySet.has(nodeId);

  const activeNodeRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    activeNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [activeId]);

  return (
    <div className="w-full overflow-x-auto pb-4">
      {onCrystalClick && (
        <p className="text-sm text-text-muted mb-3 text-center sm:text-left">
          Click the <span className="text-primary font-medium">crystals between {nodeKind}s</span> to inscribe your own meaning — they light up once inscribed.
        </p>
      )}
      <div className="inline-flex flex-col gap-6 min-w-0">
        {rows.map((row, rowIndex) => {
          const startIdx = rowIndex * nodesPerRow;
          return (
            <div key={rowIndex} className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
              {row.map((node, colIndex) => {
                const nodeIdx = startIdx + colIndex;
                const isActive = activeId === node.id;
                const isOnPath = getIsOnPath(nodeIdx, node.id);
                const isLastInRow = colIndex === row.length - 1;
                const connectorBeforeOnPath = colIndex > 0 && getConnectorBeforeOnPath(nodeIdx, node.id, colIndex);
                const connectorAfterOnPath = !isLastInRow && getConnectorAfterOnPath(nodeIdx, node.id, isLastInRow);

                const crystalLit = isCrystalLitForNode(node.id);
                const markerEmoji = markerEmojiByNodeId?.[node.id] ?? '🔮';

                return (
                  <div key={node.id} className="flex items-center">
                    {/* Single crystal per gap: between previous node and this one (for this node's act/tale) */}
                    {colIndex > 0 && (
                      <>
                        <motion.div
                          className={`w-1 sm:w-2 h-0.5 flex-shrink-0 rounded-full ${
                            connectorBeforeOnPath
                              ? 'bg-primary/80 shadow-[0_0_6px_rgba(168,85,247,0.5)]'
                              : 'bg-surface/60'
                          }`}
                          aria-hidden
                          animate={connectorBeforeOnPath ? { opacity: [0.7, 1, 0.7] } : {}}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        {onCrystalClick ? (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onCrystalClick(node.id); }}
                            title={crystalLit ? "Inscribed — click to edit proverb" : `Inscribe your proverb for ${nodeKind} ${node.id}`}
                            className={`text-sm flex-shrink-0 mx-0.5 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded ${
                              crystalLit ? 'opacity-100 drop-shadow-[0_0_4px_rgba(168,85,247,0.8)]' : 'opacity-40 hover:opacity-70'
                            }`}
                            aria-label={`Inscribe proverb for ${nodeKind} ${node.id}`}
                          >
                            {markerEmoji}
                          </button>
                        ) : (
                          <span
                            className={`text-sm flex-shrink-0 mx-0.5 select-none ${
                              crystalLit ? 'opacity-100 drop-shadow-[0_0_4px_rgba(168,85,247,0.8)]' : 'opacity-40'
                            }`}
                            title={crystalLit ? "You've inscribed this act's proverb" : 'Inscribe to light the marker'}
                            aria-hidden
                          >
                            {markerEmoji}
                          </span>
                        )}
                        <motion.div
                          className={`w-1 sm:w-2 h-0.5 flex-shrink-0 rounded-full ${
                            connectorBeforeOnPath
                              ? 'bg-primary/80 shadow-[0_0_6px_rgba(168,85,247,0.5)]'
                              : 'bg-surface/60'
                          }`}
                          aria-hidden
                          animate={connectorBeforeOnPath ? { opacity: [0.7, 1, 0.7] } : {}}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </>
                    )}

                    {/* Node: number only (title/story expands in content area below) */}
                    <motion.button
                      ref={isActive ? (el) => { activeNodeRef.current = el; } : undefined}
                      type="button"
                      onClick={() => onSelect(node.id)}
                      title={node.label}
                      className={`
                        relative flex items-center justify-center
                        min-w-[1.75rem] w-7 h-7 sm:min-w-[2rem] sm:w-8 sm:h-8 rounded-lg
                        border-2 transition-all duration-200 text-xs font-mono font-medium
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
                        ${
                          isActive
                            ? 'border-primary bg-primary/20 text-primary shadow-lg shadow-primary/20 scale-105'
                            : isOnPath
                              ? 'border-primary/40 bg-primary/5 text-text'
                              : 'border-surface/50 bg-surface/20 text-text hover:border-surface hover:bg-surface/40'
                        }
                      `}
                      whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      aria-label={`${nodeKind} ${node.id}: ${node.label}`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      {isOnPath && !isActive && (
                        <span className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-primary/60" aria-hidden />
                      )}
                      {node.shortLabel ?? node.id}
                    </motion.button>

                    {/* Connector to next node (no second crystal — one crystal per gap only) */}
                    {!isLastInRow && (
                      <>
                        <motion.div
                          className={`w-1 sm:w-2 h-0.5 flex-shrink-0 rounded-full ${
                            connectorAfterOnPath
                              ? 'bg-primary/80 shadow-[0_0_6px_rgba(168,85,247,0.5)]'
                              : 'bg-surface/60'
                          }`}
                          aria-hidden
                          animate={connectorAfterOnPath ? { opacity: [0.7, 1, 0.7] } : {}}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                          className={`w-1 sm:w-2 h-0.5 flex-shrink-0 rounded-full ${
                            connectorAfterOnPath
                              ? 'bg-primary/80 shadow-[0_0_6px_rgba(168,85,247,0.5)]'
                              : 'bg-surface/60'
                          }`}
                          aria-hidden
                          animate={connectorAfterOnPath ? { opacity: [0.7, 1, 0.7] } : {}}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
