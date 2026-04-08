'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { getSpellbookFromStorage, getAllInscribedMarkers, getInscribedProverbs, setConstellationWeb } from '@/lib/spellbook-storage';
import { getBakedSpellCards } from '@/lib/grimoire-baked';
import { ALL_SKILL_FILES } from '@/lib/skills-data';
import { getGrimoireFromSpellId, getGrimoireDisplayName, getGrimoireEmoji, getGrimoireColor } from '@/lib/spellweb/labels';
import AppNav from '@/components/AppNav';
import SpellwebViewer from '@/components/spellweb/SpellwebViewer';
import ExtensionStatusIndicator from '@/components/ExtensionStatusIndicator';
import { useExtensionBridge } from '@/contexts/ExtensionBridgeContext';
import { USER_LINKS_STORAGE_KEY } from '@/lib/spellweb-keys';

const REFLECTIONS_STORAGE_KEY = 'agentprivacy-spellweb-reflections';

function loadReflections(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(REFLECTIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<string, string>;
  } catch {
    // ignore
  }
  return {};
}

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

export default function WebPage() {
  const [selectedSpellIds, setSelectedSpellIds] = useState<string[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [spellCards, setSpellCards] = useState<ReturnType<typeof getBakedSpellCards>>([]);
  const [inscribedMarkers, setInscribedMarkers] = useState<Record<string, string>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  const [filterGroups, setFilterGroups] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);
  const [layoutKey, setLayoutKey] = useState(0);
  const [focusedNode, setFocusedNode] = useState<{ emoji: string; fullName: string; nodeId: string } | null>(null);
  const [selectedNode, setSelectedNode] = useState<{ id: string; emoji: string; fullName: string } | null>(null);
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [connectRequested, setConnectRequested] = useState(false);
  const [showSaveConstellationModal, setShowSaveConstellationModal] = useState(false);

  // Extension bridge integration
  const { state: extensionState, isConnected: extensionConnected, lastMessage } = useExtensionBridge();

  // Track live constellation nodes from extension
  const [liveConstellationNodes, setLiveConstellationNodes] = useState<Array<{
    id: string;
    emoji?: string;
    yangYin: 'yang' | 'yin';
    x: number;
    y: number;
  }>>([]);

  // Update live constellation when extension sends updates
  useEffect(() => {
    if (lastMessage?.type === 'CONSTELLATION_UPDATE') {
      const nodes = (lastMessage as { type: 'CONSTELLATION_UPDATE'; nodes: unknown[] }).nodes as Array<{
        id: string;
        emoji?: string;
        yangYin: 'yang' | 'yin';
        x: number;
        y: number;
      }>;
      setLiveConstellationNodes(nodes);
    }
  }, [lastMessage]);

  // Convert extension constellation nodes to spell IDs for the graph
  const extensionSpellIds = useMemo(() => {
    // Extension nodes might have different ID format - normalize them
    return liveConstellationNodes
      .filter(n => n.emoji)
      .map(n => `ext-${n.id}`);
  }, [liveConstellationNodes]);

  useEffect(() => {
    setReflections(loadReflections());
  }, []);

  const saveReflection = (nodeId: string, text: string) => {
    const next = { ...reflections };
    if (text.trim()) next[nodeId] = text.trim();
    else delete next[nodeId];
    setReflections(next);
    try {
      localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const loadSpellwebData = useCallback(() => {
    try {
      const { spellIds, skillIds } = getSpellbookFromStorage();
      setSelectedSpellIds(spellIds);
      setSelectedSkillIds(skillIds);
      setSpellCards(getBakedSpellCards());
      // Inscribed emoji/proverb from all spellbooks (Story, Zero, Canon, Society, Plurality) keyed by taleId/spellId
      setInscribedMarkers(getAllInscribedMarkers());
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load spellweb data');
    }
  }, []);

  useEffect(() => {
    loadSpellwebData();
  }, [loadSpellwebData]);

  useEffect(() => {
    const onFocus = () => loadSpellwebData();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadSpellwebData]);

  const selectionCount = selectedSpellIds.length + selectedSkillIds.length;

  // Available filter pills = grimoires present in current selection (spellbook-correct)
  const availableFilters = useMemo(() => {
    const groups = new Set<string>();
    selectedSpellIds.forEach((id) => {
      const card = spellCards.find((c) => c.id === id);
      const grimoire = card?.spellbook || getGrimoireFromSpellId(id);
      groups.add(grimoire);
    });
    if (selectedSkillIds.length > 0) groups.add('skills');
    return Array.from(groups).sort();
  }, [selectedSpellIds, selectedSkillIds, spellCards]);

  const toggleFilter = (group: string) => {
    setFilterGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const filterArray = filterGroups.size > 0 ? Array.from(filterGroups) : null;

  useEffect(() => {
    if (!isExpanded) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    document.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  const spellwebRightPanel = (expanded: boolean) => (
    <div className="flex flex-col gap-3 w-[200px] shrink-0 p-3 border-l border-surface/50 bg-background overflow-y-auto">
      {/* Extension status panel */}
      {extensionConnected && (
        <div className="rounded-xl border border-[#1D9E75]/30 bg-[#1D9E75]/5 p-3">
          <div className="font-medium text-text text-sm mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1D9E75] animate-pulse" />
            Extensions Active
          </div>
          <div className="text-xs text-text-muted space-y-1">
            {extensionState.mageDetected && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" />
                Mage scanning
              </div>
            )}
            {extensionState.swordsmanDetected && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#534AB7]" />
                Swordsman guarding
              </div>
            )}
            {liveConstellationNodes.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#1D9E75]/20">
                <div className="font-medium text-[#1D9E75]">
                  {liveConstellationNodes.length} live spell{liveConstellationNodes.length !== 1 ? 's' : ''}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {liveConstellationNodes.slice(0, 6).map((n, i) => (
                    <span
                      key={n.id}
                      className={`text-sm ${n.yangYin === 'yang' ? 'text-[#EF9F27]' : 'text-[#8b5cf6]'}`}
                      title={n.id}
                    >
                      {n.emoji || (n.yangYin === 'yang' ? '⚔' : '✦')}
                    </span>
                  ))}
                  {liveConstellationNodes.length > 6 && (
                    <span className="text-xs text-text-muted">+{liveConstellationNodes.length - 6}</span>
                  )}
                </div>
              </div>
            )}
            {extensionState.manaBalance > 0 && (
              <div className="mt-2 pt-2 border-t border-[#1D9E75]/20 flex items-center gap-1">
                <span className="text-[#EF9F27]">✦</span>
                <span className="font-medium text-[#EF9F27]">{extensionState.manaBalance}</span>
                <span className="text-text-muted">mana</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-surface/50 bg-surface/10 p-2 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setLayoutKey((k) => k + 1)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface/50 transition-colors"
          title="Re-layout constellation"
        >
          <span aria-hidden>✦</span>
          Constellation
        </button>
        <button
          type="button"
          onClick={() => setIsExpanded((e) => !e)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface/50 transition-colors"
          title={expanded ? 'Close fullscreen' : 'Expand to fullscreen'}
        >
          <span aria-hidden>{expanded ? '✕' : '⛶'}</span>
          {expanded ? 'Close' : 'Expand'}
        </button>
        <button
          type="button"
          onClick={() => setShowSaveConstellationModal(true)}
          className={`w-full py-2 px-3 rounded-xl border border-surface/50 flex items-center justify-center gap-2 text-sm font-medium text-text outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors ${(loadUserLinks().length > 0 || Object.values(reflections).some((t) => (t ?? '').trim())) ? 'bg-surface/20 hover:bg-surface/30 opacity-100 drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]' : 'bg-surface/10 hover:bg-surface/20 opacity-90'}`}
          title="Save connections and reflect notes into skills.md export"
          aria-label="Path the stars — save to spellbook"
        >
          <span aria-hidden className="text-xl">🌌</span>
          <span>path the stars</span>
        </button>
      </div>

      {selectedNode && (
        <div className="rounded-xl border border-surface/50 bg-surface/10 p-3">
          <div className="font-medium text-text text-sm mb-2 flex items-center gap-2">
            <span aria-hidden>🪞</span>
            Reflect
          </div>
          <textarea
            className="w-full min-h-[88px] rounded-lg border border-surface/50 bg-surface/20 text-text text-sm p-2 resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Notes for this node…"
            value={reflections[selectedNode.id] ?? ''}
            onChange={(e) => saveReflection(selectedNode.id, e.target.value)}
            onBlur={(e) => saveReflection(selectedNode.id, e.currentTarget.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {selectedNode && (
        <div className="rounded-xl border border-surface/50 bg-surface/10 p-3">
          <button
            type="button"
            onClick={() => setConnectRequested((c) => !c)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              connectRequested ? 'bg-primary/20 text-primary border border-primary/40' : 'text-text-muted hover:text-text hover:bg-surface/50'
            }`}
            title="Draw a line to another node (only you see it)"
          >
            <span aria-hidden>🔗</span>
            Connect
          </button>
          {connectRequested && (
            <p className="text-xs text-primary mt-2">Click another node to make a link.</p>
          )}
        </div>
      )}

      <div className="rounded-xl border border-surface/50 bg-surface/10 p-3 text-xs text-text-muted space-y-2">
        <div className="font-medium text-text/90">Emergent</div>
        <div className="space-y-1">
          <div><span aria-hidden>🪞</span> Reflect — notes attached to a node</div>
          <div><span aria-hidden>🔗</span> Connect — highlight a node, then link to another</div>
        </div>
        {focusedNode && (
          <div className="pt-2 border-t border-surface/50 text-text">
            <span className="font-medium text-text-muted">Focus:</span>
            <div className="mt-0.5"><span aria-hidden>{focusedNode.emoji}</span> {focusedNode.fullName}</div>
            {(() => {
              const nodeId = focusedNode.nodeId;
              let proverb = '';
              if (nodeId.startsWith('spell-')) {
                const spellId = nodeId.slice(6);
                const inscribed = typeof window !== 'undefined' ? getInscribedProverbs() : {};
                proverb = (inscribed[spellId] ?? spellCards.find((c) => c.id === spellId)?.proverb) ?? '';
              } else if (nodeId.startsWith('skill-')) {
                const skillId = nodeId.slice(6);
                proverb = ALL_SKILL_FILES.find((s) => s.id === skillId)?.proverb ?? '';
              }
              return proverb ? <div className="mt-1 text-text-muted text-[11px]">proverb: {proverb}</div> : null;
            })()}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top bar: back, Home, title, filter pills, Set map, Legend */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-text-muted hover:text-text transition-colors shrink-0"
            aria-label="Back to home"
          >
            <span aria-hidden>←</span>
            <span>Home</span>
          </Link>
          <span className="text-text-muted/60 shrink-0">·</span>
          <h1 className="text-lg font-semibold text-text shrink-0">Web</h1>

          {/* Extension status */}
          {extensionConnected && (
            <>
              <span className="text-text-muted/60 shrink-0">·</span>
              <ExtensionStatusIndicator showConstellation showMana />
              {liveConstellationNodes.length > 0 && (
                <span className="text-xs text-[#1D9E75] animate-pulse">
                  {liveConstellationNodes.length} live nodes
                </span>
              )}
            </>
          )}

          <div className="flex-1 min-w-0" />
          {selectionCount > 0 && availableFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {availableFilters.map((group) => {
                const isActive = filterGroups.size === 0 || filterGroups.has(group);
                const color = getGrimoireColor(group);
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => toggleFilter(group)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border shrink-0 ${
                      isActive
                        ? 'text-text'
                        : 'border-surface/50 text-text-muted hover:text-text'
                    }`}
                    style={isActive ? { borderColor: `${color}60`, backgroundColor: `${color}20` } : undefined}
                  >
                    <span aria-hidden>{getGrimoireEmoji(group)}</span>
                    {getGrimoireDisplayName(group)}
                  </button>
                );
              })}
              <Link
                href="/spells"
                className="px-3 py-1.5 rounded-full text-sm font-medium border border-surface/50 text-text-muted hover:text-text hover:bg-surface/50 transition-colors shrink-0"
              >
                spells
              </Link>
            </div>
          )}
        </div>

        {loadError ? (
          <div className="rounded-2xl border border-surface/50 bg-surface/10 min-h-[320px] flex flex-col items-center justify-center text-center px-6">
            <p className="text-text-muted mb-4">Something went wrong loading the spellweb.</p>
            <p className="text-text/80 mb-6 font-mono text-sm">{loadError}</p>
            <Link
              href="/spells"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Go to Spells
            </Link>
          </div>
        ) : selectionCount > 0 ? (
          <>
            {/* Fullscreen overlay: same graph + right panel with Constellation, Reflect, Connect */}
            {isExpanded && (
              <div
                className="fixed inset-0 z-50 flex bg-background"
                role="dialog"
                aria-modal="true"
                aria-label="Spellweb expanded"
              >
                <div className="flex-1 min-w-0 min-h-0 relative">
                  <SpellwebViewer
                    key={layoutKey}
                    selectedSpellIds={selectedSpellIds}
                    selectedSkillIds={selectedSkillIds}
                    spellCards={spellCards}
                    skillFiles={ALL_SKILL_FILES}
                    inscribedMarkers={inscribedMarkers}
                    filterGroups={filterArray}
                    showTerms={false}
                    isExpanded={false}
                    onFocusedNodeChange={setFocusedNode}
                    onSelectedNodeChange={setSelectedNode}
                    connectRequested={connectRequested}
                    onConnectComplete={() => setConnectRequested(false)}
                  />
                </div>
                {spellwebRightPanel(true)}
              </div>
            )}

            {/* Normal layout */}
            {!isExpanded && (
              <div className="flex gap-4">
                <div className="flex-1 min-w-0 rounded-2xl overflow-hidden border border-surface/50 bg-surface/10 min-h-[520px] relative">
                  <SpellwebViewer
                    key={layoutKey}
                    selectedSpellIds={selectedSpellIds}
                    selectedSkillIds={selectedSkillIds}
                    spellCards={spellCards}
                    skillFiles={ALL_SKILL_FILES}
                    inscribedMarkers={inscribedMarkers}
                    filterGroups={filterArray}
                    showTerms={false}
                    isExpanded={false}
                    onFocusedNodeChange={setFocusedNode}
                    onSelectedNodeChange={setSelectedNode}
                    connectRequested={connectRequested}
                    onConnectComplete={() => setConnectRequested(false)}
                  />
                </div>
                {spellwebRightPanel(false)}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-surface/50 bg-surface/10 min-h-[320px] flex flex-col items-center justify-center text-center px-6">
            <p className="text-text-muted mb-4">No spells or skills in your graph yet.</p>
            <p className="text-text/80 mb-6">Add spells and skills on the Spells page to build your spellweb.</p>
            <Link
              href="/spells"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Go to Spells
            </Link>
          </div>
        )}
      </main>

      {showSaveConstellationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-label="Path the stars"
        >
          <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-surface/50 bg-background shadow-xl overflow-hidden">
            <div className="p-4 border-b border-surface/50 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-semibold text-text flex items-center gap-2">
                <span aria-hidden>🌌</span>
                path the stars
              </h2>
              <button
                type="button"
                onClick={() => setShowSaveConstellationModal(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface/50"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
              <p className="text-sm text-text-muted">
                This snapshot will be included in your agentprivacy skills.md export (Spells → Download). Shown below: current connections and reflect notes.
              </p>
              {(() => {
                const links = loadUserLinks();
                const refl = { ...reflections };
                const hasLinks = links.length > 0;
                const hasRefl = Object.entries(refl).some(([, t]) => (t ?? '').trim());
                if (!hasLinks && !hasRefl) {
                  return <p className="text-sm text-text/80">No connections or reflect notes yet. Add some on the graph, then save.</p>;
                }
                return (
                  <div className="space-y-4 text-sm">
                    {hasLinks && (
                      <div>
                        <h3 className="font-medium text-text mb-2">Connections</h3>
                        <ul className="list-disc list-inside space-y-1 text-text/90">
                          {links.map(({ source, target }, i) => (
                            <li key={i}>{source} → {target}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {hasRefl && (
                      <div>
                        <h3 className="font-medium text-text mb-2">Reflect notes</h3>
                        <ul className="space-y-2">
                          {Object.entries(refl).filter(([, t]) => (t ?? '').trim()).map(([nodeId, text]) => (
                            <li key={nodeId} className="rounded-lg border border-surface/50 bg-surface/10 p-2">
                              <span className="font-mono text-xs text-text-muted">{nodeId}</span>
                              <p className="mt-1 text-text/90 whitespace-pre-wrap break-words">{text.trim().slice(0, 200)}{(text.trim().length > 200 ? '…' : '')}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="p-4 border-t border-surface/50 flex gap-2 justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowSaveConstellationModal(false)}
                className="px-4 py-2 rounded-lg border border-surface/50 text-text hover:bg-surface/50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConstellationWeb({
                    links: loadUserLinks(),
                    reflections: { ...reflections },
                  });
                  setShowSaveConstellationModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90"
              >
                Save to spellbook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
