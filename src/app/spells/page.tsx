'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBakedSpellCards, type SpellCard, type SpellbookSource } from '@/lib/grimoire-baked';
import { ALL_SKILL_FILES, DUAL_AGENT_SKILL_MAP, type SkillFileMeta, type AgentRole } from '@/lib/skills-data';
import { SPELLBOOK_TEMPLATES } from '@/lib/spellbook-templates';
import { getMatchingPersonas } from '@/lib/persona-index';
import {
  getSpellbookFromStorage,
  setSpellbookInStorage,
  getSavedSpellbooks,
  saveSpellbookAs,
  loadSavedSpellbookIntoCurrent,
  deleteSavedSpellbook,
  getCustomProverbs,
  getInscribedProverbs,
  getInscribedTaleLabel,
  getPathwayLines,
  getInscribedMarkerEmoji,
  getAllInscribedMarkers,
  getConstellationWeb,
  type SavedSpellbook,
} from '@/lib/spellbook-storage';
import { useRouter } from 'next/navigation';
import AppNav from '@/components/AppNav';
import TierBadge from '@/components/trust/TierBadge';
import { calculateTier } from '@/lib/trust/tiers';
import { getTrustMetrics, setStudiedActs } from '@/lib/trust/storage';
import { getAgentCard, hasCompletedCeremony } from '@/lib/ceremony/storage';

const GRIMOIRE_BOOK_ORDER: SpellbookSource[] = ['story', 'origins', 'zero', 'canon', 'society', 'plurality', 'incantations'];

export default function SpellsPage() {
  const router = useRouter();
  const [spellCards] = useState<SpellCard[]>(() => getBakedSpellCards());
  const [spellbookFilter, setSpellbookFilter] = useState<SpellbookSource | 'all'>('all');
  const [agentFilter, setAgentFilter] = useState<AgentRole | 'all'>('all');
  const [toast, setToast] = useState<string | null>(null);
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);
  const [skillContent, setSkillContent] = useState<Record<string, string>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSpellIds, setSelectedSpellIds] = useState<Set<string>>(new Set());
  const [selectedSkillIds, setSelectedSkillIds] = useState<Set<string>>(new Set());
  const [savedSpellbooks, setSavedSpellbooks] = useState<SavedSpellbook[]>([]);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [exploreOpen, setExploreOpen] = useState(false);
  const [agentCard, setAgentCard] = useState<ReturnType<typeof getAgentCard>>(null);
  const [trustTier, setTrustTier] = useState<ReturnType<typeof calculateTier>>('blade');
  const [showCeremonyRequiredModal, setShowCeremonyRequiredModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showConstellationExportModal, setShowConstellationExportModal] = useState(false);
  const [inscribedMarkers, setInscribedMarkers] = useState<Record<string, string>>({});
  const [openGrimoireSections, setOpenGrimoireSections] = useState<Set<SpellbookSource>>(() => new Set(GRIMOIRE_BOOK_ORDER));
  const [agentSkillsSectionOpen, setAgentSkillsSectionOpen] = useState(true);
  const [expandedSkillCards, setExpandedSkillCards] = useState<Set<string>>(new Set());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templatesSectionExpanded, setTemplatesSectionExpanded] = useState(true);
  const [hasConstellationSaved, setHasConstellationSaved] = useState(false);

  useEffect(() => {
    const { spellIds, skillIds } = getSpellbookFromStorage();
    setSelectedSpellIds(new Set(spellIds));
    setSelectedSkillIds(new Set(skillIds));
    setSavedSpellbooks(getSavedSpellbooks());
    setAgentCard(hasCompletedCeremony() ? getAgentCard() : null);
    setTrustTier(calculateTier(getTrustMetrics()));
    setInscribedMarkers(getAllInscribedMarkers());
    const c = getConstellationWeb();
    setHasConstellationSaved(c.links.length > 0 || Object.keys(c.reflections).length > 0);
  }, []);

  useEffect(() => {
    const onFocus = () => {
      const c = getConstellationWeb();
      setHasConstellationSaved(c.links.length > 0 || Object.keys(c.reflections).length > 0);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  useEffect(() => {
    const storyActCount = [...selectedSpellIds].filter((id) => id.startsWith('act-')).length;
    if (storyActCount > 0) setStudiedActs(storyActCount);
    setTrustTier(calculateTier(getTrustMetrics()));
  }, [selectedSpellIds]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'ceremony') {
      setToast('Identity ready—you can now save spellbooks.');
      setTimeout(() => setToast(null), 2500);
      window.history.replaceState({}, '', '/spells');
    }
  }, []);

  const refreshSavedSpellbooks = useCallback(() => {
    setSavedSpellbooks(getSavedSpellbooks());
  }, []);

  const selectedSpellIdsRef = useRef(selectedSpellIds);
  const selectedSkillIdsRef = useRef(selectedSkillIds);
  selectedSpellIdsRef.current = selectedSpellIds;
  selectedSkillIdsRef.current = selectedSkillIds;

  const toggleSpell = useCallback((id: string) => {
    setSelectedSpellIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSpellbookInStorage({ spellIds: [...next], skillIds: [...selectedSkillIdsRef.current] });
      return next;
    });
  }, []);
  const toggleSkill = useCallback((id: string) => {
    setSelectedSkillIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSpellbookInStorage({ spellIds: [...selectedSpellIdsRef.current], skillIds: [...next] });
      return next;
    });
  }, []);

  const selectedSpells = spellCards.filter((c) => selectedSpellIds.has(c.id));
  const selectedSkills = ALL_SKILL_FILES.filter((s) => selectedSkillIds.has(s.id));
  const selectionCount = selectedSpellIds.size + selectedSkillIds.size;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const copyToClipboard = useCallback(async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(msg);
    } catch {
      showToast('Copy failed');
    }
  }, [showToast]);

  const loadSkillContent = useCallback(async (filename: string) => {
    if (skillContent[filename]) return skillContent[filename];
    // filename is e.g. "agentprivacy/dragon.skills.md" — keep path so /skills/agentprivacy/dragon.skills.md resolves
    const res = await fetch(`/skills/${filename}`);
    if (!res.ok) return '';
    const text = await res.text();
    setSkillContent((prev) => ({ ...prev, [filename]: text }));
    return text;
  }, [skillContent]);

  const handleViewFull = useCallback(async (meta: SkillFileMeta) => {
    if (expandedSkillId === meta.id) {
      setExpandedSkillId(null);
      return;
    }
    await loadSkillContent(meta.filename);
    setExpandedSkillId(meta.id);
  }, [expandedSkillId, loadSkillContent]);

  const handleDownload = useCallback(async (meta: SkillFileMeta) => {
    const content = await loadSkillContent(meta.filename);
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = meta.filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Download started');
  }, [loadSkillContent, showToast]);

  const handleSaveSpellbook = useCallback(() => {
    if (selectionCount === 0) return;
    const saved = saveSpellbookAs(saveName || 'My spellbook', [...selectedSpellIds], [...selectedSkillIds]);
    setSaveName('');
    setShowSaveForm(false);
    setSavedSpellbooks(getSavedSpellbooks());
    showToast(`Saved as "${saved.name}"`);
  }, [selectedSpellIds, selectedSkillIds, selectionCount, saveName, showToast]);

  const handleLoadSaved = useCallback((id: string) => {
    if (!loadSavedSpellbookIntoCurrent(id)) return;
    const { spellIds, skillIds } = getSpellbookFromStorage();
    setSelectedSpellIds(new Set(spellIds));
    setSelectedSkillIds(new Set(skillIds));
    refreshSavedSpellbooks();
    showToast('Spellbook loaded');
  }, [showToast, refreshSavedSpellbooks]);

  const handleDeleteSaved = useCallback((id: string) => {
    deleteSavedSpellbook(id);
    setSavedSpellbooks(getSavedSpellbooks());
    showToast('Spellbook removed');
  }, [showToast]);

  const handleClearSpellbook = useCallback(() => {
    setSelectedSpellIds(new Set());
    setSelectedSkillIds(new Set());
    setSpellbookInStorage({ spellIds: [], skillIds: [] });
    setShowClearConfirm(false);
    showToast('Spellbook cleared');
  }, [showToast]);

  const handleUseTemplate = useCallback((templateId: string) => {
    const t = SPELLBOOK_TEMPLATES.find((x) => x.id === templateId);
    if (!t) return;
    setSpellbookInStorage({ spellIds: t.spellIds, skillIds: t.skillIds });
    setSelectedSpellIds(new Set(t.spellIds));
    setSelectedSkillIds(new Set(t.skillIds));
    setSelectedTemplateId(templateId);
    setTemplatesSectionExpanded(false);
    showToast(`Loaded "${t.name}" into spell graph`);
  }, [showToast]);

  const handleUseCustomTemplate = useCallback(() => {
    setSpellbookInStorage({ spellIds: [], skillIds: [] });
    setSelectedSpellIds(new Set());
    setSelectedSkillIds(new Set());
    setSelectedTemplateId('custom');
    setTemplatesSectionExpanded(false);
    showToast('Cleared spell graph — build your own');
  }, [showToast]);

  const handleDownloadSpellbook = useCallback(async () => {
    // Union of storage + current state so we never miss skills/spells the user sees
    const { spellIds: storageSpellIds, skillIds: storageSkillIds } = getSpellbookFromStorage();
    const exportSpellIds = [...new Set([...storageSpellIds, ...selectedSpellIds])];
    const exportSkillIds = [...new Set([...storageSkillIds, ...selectedSkillIds])];
    const exportSpells = spellCards.filter((c) => exportSpellIds.includes(c.id));
    const exportSkills = ALL_SKILL_FILES.filter((s) => exportSkillIds.includes(s.id));

    const agentLabel = agentFilter !== 'all' ? agentFilter : null;
    const lines: string[] = [
      `# Custom Spellbook${agentLabel ? ` — ${agentLabel === 'soulbis' ? 'Soulbis (Swordsman)' : agentLabel === 'soulbae' ? 'Soulbae (Mage)' : 'Privacy Layer'}` : ''}`,
      '',
      'Built at agentprivacy.ai/spells',
      '',
      '---',
      '',
    ];
    const pathwayLines = getPathwayLines(exportSpellIds, spellCards);
    if (pathwayLines.length > 0) {
      lines.push('## Your pathway', '');
      lines.push('Acts and tales in your spell graph, mapped across spellbooks:', '', ...pathwayLines.map((l) => l + '\n'), '---', '');
    }
    if (exportSpells.length > 0) {
      lines.push('## Spells & Proverbs', '');
      for (const card of exportSpells) {
        lines.push(`### ${card.title}`, '', `**Spell:** ${card.spell}`, '', `*${card.proverb}*`, '', '---', '');
      }
    }
    const customProverbs = getCustomProverbs().trim();
    if (customProverbs) {
      lines.push('## Saved proverbs', '');
      lines.push('Proverbs you added (custom list; inscribe on constellation in each spellbook):', '', customProverbs, '', '---', '');
    }
    const inscribed = getInscribedProverbs();
    const inscribedEntries = Object.entries(inscribed).filter(([, p]) => (p ?? '').trim());
    if (inscribedEntries.length > 0) {
      lines.push('## Inscribed proverbs', '');
      lines.push('Per-act/tale proverbs from the constellation (one per node):', '');
      for (const [taleId, proverb] of inscribedEntries) {
        const label = getInscribedTaleLabel(taleId);
        lines.push(`**${label}**`, '', proverb.trim(), '', '---', '');
      }
      lines.push('');
    }
    const constellationWeb = getConstellationWeb();
    if (constellationWeb.links.length > 0 || Object.keys(constellationWeb.reflections).length > 0) {
      lines.push('## Constellation web', '');
      lines.push('Node connections and reflect notes from the Web (agentprivacy.ai/web):', '');
      if (constellationWeb.links.length > 0) {
        lines.push('### Connections', '');
        for (const { source, target } of constellationWeb.links) {
          lines.push(`- ${source} → ${target}`);
        }
        lines.push('', '---', '');
      }
      const reflectionEntries = Object.entries(constellationWeb.reflections).filter(([, t]) => (t ?? '').trim());
      if (reflectionEntries.length > 0) {
        lines.push('### Reflect notes', '');
        for (const [nodeId, text] of reflectionEntries) {
          lines.push(`**${nodeId}**`, '', text.trim(), '', '---', '');
        }
        lines.push('');
      }
    }
    const exportSkillIdSet = new Set(exportSkillIds);
    const matchingPersonas = getMatchingPersonas(exportSkillIdSet);
    if (matchingPersonas.length > 0) {
      lines.push('## Persona alignment', '');
      lines.push('This spell graph aligns with the following persona patterns (role skills covered):', '');
      for (const p of matchingPersonas) {
        lines.push(`- **${p.emoji} ${p.name}** — ${p.tagline}`);
      }
      lines.push('', '---', '');
    }
    if (exportSkills.length > 0) {
      lines.push('## Skill Files', '');
      for (const meta of exportSkills) {
        const content = await loadSkillContent(meta.filename);
        const body = (content ?? '').trim() ? content : `*${meta.proverb}*\n\n${meta.spell}`;
        lines.push(`### ${meta.seedEmoji} ${meta.seedName}`, '', body, '', '---', '');
      }
    }
    const md = lines.join('\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = agentFilter !== 'all' ? `${agentFilter}_spellbook.md` : 'my_spellbook.md';
    a.click();
    URL.revokeObjectURL(url);
    showToast('skills.md downloaded');
  }, [agentFilter, spellCards, selectedSpellIds, selectedSkillIds, loadSkillContent, showToast]);

  const filteredSpells = spellbookFilter === 'all'
    ? spellCards
    : spellbookFilter === 'none'
      ? []
      : spellCards.filter((c) => c.spellbook === spellbookFilter);

  const filteredSkills = agentFilter === 'all'
    ? ALL_SKILL_FILES
    : ALL_SKILL_FILES.filter((s) => s.agent === agentFilter);

  const spellsByBook = useMemo(() => {
    const map = new Map<SpellbookSource, SpellCard[]>();
    GRIMOIRE_BOOK_ORDER.forEach((b) => map.set(b, []));
    spellCards.forEach((c) => {
      if (c.spellbook !== 'none' && map.has(c.spellbook)) {
        map.get(c.spellbook)!.push(c);
      }
    });
    return map;
  }, [spellCards]);

  const expandAllGrimoire = useCallback(() => {
    setOpenGrimoireSections(new Set(GRIMOIRE_BOOK_ORDER));
  }, []);
  const collapseAllGrimoire = useCallback(() => {
    setOpenGrimoireSections(new Set());
  }, []);
  const toggleGrimoireSection = useCallback((book: SpellbookSource) => {
    setOpenGrimoireSections((prev) => {
      const next = new Set(prev);
      if (next.has(book)) next.delete(book);
      else next.add(book);
      return next;
    });
  }, []);

  const expandAllSkillCards = useCallback(() => {
    setExpandedSkillCards(new Set(filteredSkills.map((s) => s.id)));
  }, [filteredSkills]);
  const collapseAllSkillCards = useCallback(() => {
    setExpandedSkillCards(new Set());
  }, []);
  const toggleSkillCardExpanded = useCallback((id: string) => {
    setExpandedSkillCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const spellbookCounts = { all: spellCards.length, story: 0, origins: 0, zero: 0, canon: 0, society: 0, plurality: 0, incantations: 0, none: 0 };
  spellCards.forEach((c) => {
    if (c.spellbook === 'story') spellbookCounts.story++;
    else if (c.spellbook === 'origins') spellbookCounts.origins++;
    else if (c.spellbook === 'zero') spellbookCounts.zero++;
    else if (c.spellbook === 'canon') spellbookCounts.canon++;
    else if (c.spellbook === 'society') spellbookCounts.society++;
    else if (c.spellbook === 'plurality') spellbookCounts.plurality++;
    else if (c.spellbook === 'incantations') spellbookCounts.incantations++;
  });
  const spellbookTabs: { value: SpellbookSource | 'all'; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: spellbookCounts.all },
    { value: 'story', label: 'Story', count: spellbookCounts.story },
    { value: 'origins', label: 'Origins', count: spellbookCounts.origins },
    { value: 'zero', label: 'Zero', count: spellbookCounts.zero },
    { value: 'canon', label: 'Canon', count: spellbookCounts.canon },
    { value: 'society', label: 'Society', count: spellbookCounts.society },
    { value: 'plurality', label: 'Plurality', count: spellbookCounts.plurality },
    { value: 'incantations', label: 'Incantations', count: spellbookCounts.incantations },
    { value: 'none', label: 'No spellbook', count: spellbookCounts.none },
  ];

  return (
    <div className="min-h-screen bg-background text-text">
      <AppNav />

      <div className="flex flex-row">
        <main className="flex-1 min-w-0 max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-bold text-text mb-2">just casting spells</h1>
              <p className="text-text/80 max-w-2xl">
                Spellbooks are skill trees — personas for your agent. Here you build your <strong className="text-primary/90">spell graph</strong> by adding spells, proverbs, and skill files. That diversity compresses into the <strong className="text-primary/90">skills.md</strong> package. The soul .md emerges when you complete the journey of teaching each spell and your own reconstruction — an agent must climb to evolve the soul.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-text/60">Reference:</span>
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-surface/50 bg-surface/20">
                  <span className="text-sm font-medium text-text">The privacymage grimoire</span>
                  <a
                    href="https://red-acute-chinchilla-216.mypinata.cloud/ipfs/bafkreiephjsrjoqmwyncjkmllk6qk5qwetaqxibl52wkpzbuoxguereffa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const url = 'https://red-acute-chinchilla-216.mypinata.cloud/ipfs/bafkreiephjsrjoqmwyncjkmllk6qk5qwetaqxibl52wkpzbuoxguereffa';
                      navigator.clipboard.writeText(url).then(() => showToast('Grimoire URL copied'));
                    }}
                    className="text-xs px-2 py-1 rounded-lg border border-primary/30 text-primary hover:bg-primary/10"
                  >
                    Copy link
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0 min-w-[10rem]">
              <button
                type="button"
                onClick={() => setSidebarOpen((o) => !o)}
                className="w-full p-3 rounded-xl border border-surface/50 bg-surface/20 hover:bg-surface/40 flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={sidebarOpen ? 'Close spell graph sidebar' : 'Open spell graph sidebar'}
              >
                <span className="text-lg" aria-hidden>📖</span>
                <span className="font-medium">{selectionCount}</span>
                <span className="text-text/60 text-sm hidden sm:inline">in spell graph</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/web')}
                className="w-full p-3 rounded-xl border border-surface/50 bg-surface/30 hover:bg-surface/50 flex items-center justify-center gap-2 text-sm font-medium text-text outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                title="View constellation graph"
                aria-label="Open Spellweb constellation graph"
              >
                <span aria-hidden>🕸️</span>
                <span>Spellweb</span>
              </button>
              <button
                type="button"
                onClick={() => setShowConstellationExportModal(true)}
                className={`w-full py-2 px-3 rounded-xl border border-surface/50 flex items-center justify-center gap-2 text-sm font-medium text-text outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors ${hasConstellationSaved ? 'bg-surface/20 hover:bg-surface/30 opacity-100 drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]' : 'bg-surface/10 hover:bg-surface/20 opacity-80'}`}
                title={hasConstellationSaved ? 'Remember Stars saved — included in skills.md export' : 'No constellation saved yet — use Remember Stars on Web'}
                aria-label="Path the stars — view export snapshot"
              >
                <span aria-hidden className="text-xl">🌌</span>
                <span>path the stars</span>
              </button>
            </div>
          </div>

          {/* Skills export — prominent at top */}
          <section id="skills-export" className="mb-10 p-5 rounded-xl border border-primary/30 bg-primary/5">
            <h2 className="text-lg font-semibold text-text mb-2">Export your spell graph</h2>
            <p className="text-sm text-text/70 mb-4 max-w-2xl">
              An agentprivacy <strong>skills.md</strong> file, built from your constellation journey through the spellbooks — spells and proverbs linked in one package.
            </p>
            <button
              type="button"
              onClick={() => {
                if (!hasCompletedCeremony()) {
                  setShowCeremonyRequiredModal(true);
                  return;
                }
                handleDownloadSpellbook();
              }}
              disabled={selectionCount === 0}
              className="px-6 py-3 rounded-xl font-medium bg-primary text-background hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              Download agentprivacy.skills.md
            </button>
          </section>

        <section id="dual-agent-map" className="scroll-mt-24 mb-16">
          <h2 className="text-2xl font-semibold text-text mb-4">Dual-Agent Pathway Map</h2>
          <p className="text-text/70 mb-6">Which agent learns which skills. The Swordsman protects; the Mage projects; both serve the privacy layer.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-primary/30 bg-primary/5">
              <div className="text-2xl mb-2">⚔️</div>
              <h3 className="font-semibold text-text">Soulbis</h3>
              <p className="text-sm text-text/70 mb-4">Swordsman — Protect → Reflect</p>
              <ul className="space-y-1 text-sm">
                {DUAL_AGENT_SKILL_MAP.soulbis.skills.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <span>{s.seedEmoji}</span>
                    <span>{s.seedName}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-primary/30 bg-primary/5">
              <div className="text-2xl mb-2">🧙</div>
              <h3 className="font-semibold text-text">Soulbae</h3>
              <p className="text-sm text-text/70 mb-4">Mage — Project → Connect</p>
              <ul className="space-y-1 text-sm">
                {DUAL_AGENT_SKILL_MAP.soulbae.skills.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <span>{s.seedEmoji}</span>
                    <span>{s.seedName}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-surface/50 bg-surface/20">
              <div className="text-2xl mb-2">☯️</div>
              <h3 className="font-semibold text-text">Privacy Layer</h3>
              <p className="text-sm text-text/70 mb-4">The ground state both agents serve</p>
              <ul className="space-y-1 text-sm">
                {DUAL_AGENT_SKILL_MAP.privacy.skills.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <span>{s.seedEmoji}</span>
                    <span>{s.seedName}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-text/70 italic text-center max-w-2xl mx-auto">
            &ldquo;The Swordsman learns what to protect. The Mage learns what to project. Both learn what makes the separation hold.&rdquo;
          </p>
        </section>

        <section id="templates" className="scroll-mt-24 mb-16">
          <h2 className="text-2xl font-semibold text-text mb-4">Spellbook Patterns</h2>
          {templatesSectionExpanded ? (
            <>
              <p className="text-text/70 mb-6">Pre-configured spell graphs you can load and then customise. Selecting a persona fills your spell graph (sidepanel) with its spells and skill files.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SPELLBOOK_TEMPLATES.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-xl border border-surface/50 bg-surface/20 hover:border-primary/50 transition-colors flex flex-col"
                  >
                    <div className="text-2xl mb-2" aria-hidden>{t.emoji}</div>
                    <h3 className="font-semibold text-text mb-1">{t.name}</h3>
                    <p className="text-sm text-text/70 mb-4 flex-1">&ldquo;{t.tagline}&rdquo;</p>
                    <p className="text-xs text-text/50 mb-3">
                      {t.spellIds.length} spells · {t.skillIds.length} skills
                    </p>
                    <button
                      type="button"
                      onClick={() => handleUseTemplate(t.id)}
                      className="w-full py-2 rounded-lg text-sm font-medium bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30"
                    >
                      Use this persona
                    </button>
                  </div>
                ))}
                <div className="p-5 rounded-xl border border-dashed border-surface/50 bg-surface/10 hover:border-primary/40 hover:bg-surface/20 transition-colors flex flex-col">
                  <div className="text-2xl mb-2" aria-hidden>✨</div>
                  <h3 className="font-semibold text-text mb-1">Custom persona</h3>
                  <p className="text-sm text-text/70 mb-4 flex-1">Start from an empty spell graph and add only the spells and skills you want.</p>
                  <p className="text-xs text-text/50 mb-3">0 spells · 0 skills</p>
                  <button
                    type="button"
                    onClick={handleUseCustomTemplate}
                    className="w-full py-2 rounded-lg text-sm font-medium bg-surface/50 text-text border border-surface/50 hover:bg-surface"
                  >
                    Custom persona
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-surface/50 bg-surface/20 p-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-text/80">
                Persona: <strong className="text-primary">{selectedTemplateId === 'custom' ? 'Custom persona' : SPELLBOOK_TEMPLATES.find((x) => x.id === selectedTemplateId)?.name ?? selectedTemplateId}</strong>
              </p>
              <button
                type="button"
                onClick={() => setTemplatesSectionExpanded(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-surface/50 hover:bg-surface/30 text-text"
              >
                Show all patterns
              </button>
            </div>
          )}
        </section>

        <section id="spellbook" className="scroll-mt-24 mb-16">
          <h2 className="text-2xl font-semibold text-text mb-4">The Grimoire Spellbook</h2>
          <p className="text-text/70 mb-6">All spells and proverbs from the six spellbooks (v8.4.0). Select inscriptions and proverbs to add them to your spell graph.</p>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button type="button" onClick={expandAllGrimoire} className="px-3 py-1.5 rounded-lg border border-surface/50 text-sm hover:bg-surface/30">Expand all</button>
            <button type="button" onClick={collapseAllGrimoire} className="px-3 py-1.5 rounded-lg border border-surface/50 text-sm hover:bg-surface/30">Collapse all</button>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="md:w-44 flex-shrink-0 flex flex-wrap md:flex-col gap-2" role="tablist" aria-label="Choose spellbook">
              {spellbookTabs.filter((t) => t.value !== 'none').map((tab) => (
                <button
                  key={tab.value}
                  role="tab"
                  aria-selected={spellbookFilter === tab.value}
                  id={`spellbook-tab-${tab.value}`}
                  onClick={() => setSpellbookFilter(tab.value)}
                  className={`px-3 py-2 rounded-lg border text-left text-sm transition-colors ${
                    spellbookFilter === tab.value ? 'bg-primary/20 border-primary text-primary' : 'border-surface/50 hover:border-surface text-text'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </aside>
            <div id="spellbook-spell-list" className="flex-1 min-w-0 space-y-4" role="tabpanel">
              {spellbookFilter === 'all' ? (
                GRIMOIRE_BOOK_ORDER.map((book) => {
                  const cards = spellsByBook.get(book) ?? [];
                  if (cards.length === 0) return null;
                  const isOpen = openGrimoireSections.has(book);
                  const label = spellbookTabs.find((t) => t.value === book)?.label ?? book;
                  return (
                    <div key={book} className="rounded-xl border border-surface/50 bg-surface/10 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleGrimoireSection(book)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-text hover:bg-surface/20 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="text-sm uppercase tracking-wider text-primary/80">{label}</span>
                        <span className="text-text/60 text-sm">({cards.length})</span>
                        <span className="text-text/50" aria-hidden>{isOpen ? '▼' : '▶'}</span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-surface/50 p-4 space-y-4">
                          {cards.map((card) => (
                            <div key={card.id} className="p-4 rounded-xl border border-surface/50 bg-surface/20 hover:border-surface/80 transition-colors">
                              <h3 className="font-medium text-text mb-2">{card.title}</h3>
                              <p className="font-mono text-lg mb-2" aria-label={`Spell: ${card.spell}`}>{card.spell}</p>
                              <blockquote className="text-text/80 italic border-l-2 border-primary/50 pl-4 mb-4">&ldquo;{card.proverb}&rdquo;</blockquote>
                              <div className="flex flex-wrap gap-2">
                                <button onClick={() => copyToClipboard(card.spell, 'Spell copied ⚔️')} className="px-3 py-1.5 rounded bg-surface/50 hover:bg-surface border border-surface/50 text-sm">Copy Spell</button>
                                <button onClick={() => copyToClipboard(card.proverb, 'Proverb inscribed 📜')} className="px-3 py-1.5 rounded bg-surface/50 hover:bg-surface border border-surface/50 text-sm">Copy Proverb</button>
                                <button onClick={() => toggleSpell(card.id)} title={selectedSpellIds.has(card.id) ? 'Remove from spell graph' : 'Add to spell graph'} aria-label={selectedSpellIds.has(card.id) ? `Remove "${card.title}" from spell graph` : `Add "${card.title}" to spell graph`} className={`px-3 py-1.5 rounded border text-sm ${selectedSpellIds.has(card.id) ? 'bg-primary/20 border-primary text-primary' : 'bg-surface/50 hover:bg-surface border-surface/50'}`}><span aria-hidden>{selectedSpellIds.has(card.id) ? '✓🔮' : '🔮'}</span></button>
                                {card.learnUrl && <Link href={card.learnUrl} className="px-3 py-1.5 rounded bg-primary/20 hover:bg-primary/30 border border-primary/50 text-sm text-primary">Learn →</Link>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : filteredSpells.length === 0 ? (
                <p className="text-text/60 py-8">
                  {spellCards.length === 0 ? 'Could not load grimoire. Refresh the page.' : 'No spells in this spellbook.'}
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredSpells.map((card) => (
                    <div key={card.id} className="p-5 rounded-xl border border-surface/50 bg-surface/20 hover:border-surface/80 transition-colors">
                      <div className="text-xs uppercase tracking-wider text-primary/80 mb-1">{card.spellbook}</div>
                      <h3 className="font-medium text-text mb-2">{card.title}</h3>
                      <p className="font-mono text-lg mb-2" aria-label={`Spell: ${card.spell}`}>{card.spell}</p>
                      <blockquote className="text-text/80 italic border-l-2 border-primary/50 pl-4 mb-4">&ldquo;{card.proverb}&rdquo;</blockquote>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => copyToClipboard(card.spell, 'Spell copied ⚔️')} className="px-3 py-1.5 rounded bg-surface/50 hover:bg-surface border border-surface/50 text-sm">Copy Spell</button>
                        <button onClick={() => copyToClipboard(card.proverb, 'Proverb inscribed 📜')} className="px-3 py-1.5 rounded bg-surface/50 hover:bg-surface border border-surface/50 text-sm">Copy Proverb</button>
                        <button onClick={() => toggleSpell(card.id)} title={selectedSpellIds.has(card.id) ? 'Remove from spell graph' : 'Add to spell graph'} aria-label={selectedSpellIds.has(card.id) ? `Remove "${card.title}" from spell graph` : `Add "${card.title}" to spell graph`} className={`px-3 py-1.5 rounded border text-sm ${selectedSpellIds.has(card.id) ? 'bg-primary/20 border-primary text-primary' : 'bg-surface/50 hover:bg-surface border-surface/50'}`}><span aria-hidden>{selectedSpellIds.has(card.id) ? '✓🔮' : '🔮'}</span></button>
                        {card.learnUrl && <Link href={card.learnUrl} className="px-3 py-1.5 rounded bg-primary/20 hover:bg-primary/30 border border-primary/50 text-sm text-primary">Learn →</Link>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="agent-files" className="scroll-mt-24 mb-16 rounded-xl border border-surface/50 bg-surface/10 overflow-hidden">
          <button
            type="button"
            onClick={() => setAgentSkillsSectionOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-surface/20 transition-colors"
            aria-expanded={agentSkillsSectionOpen}
          >
            <h2 className="text-2xl font-semibold text-text">Agent Skill Files</h2>
            <span className="text-text/50" aria-hidden>{agentSkillsSectionOpen ? '▼' : '▶'}</span>
          </button>
          {agentSkillsSectionOpen && (
            <>
              <div className="px-4 pb-2">
                <p className="text-text/70 mb-4">The equation fractured into seeds. Drop into any agent context.</p>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <button onClick={expandAllSkillCards} type="button" className="px-3 py-1.5 rounded-lg border border-surface/50 text-sm hover:bg-surface/30">Expand all</button>
                  <button onClick={collapseAllSkillCards} type="button" className="px-3 py-1.5 rounded-lg border border-surface/50 text-sm hover:bg-surface/30">Collapse all</button>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setAgentFilter('all')} className={`px-4 py-2 rounded-lg border text-sm ${agentFilter === 'all' ? 'bg-primary/20 border-primary text-primary' : 'border-surface/50 text-text'}`}>All</button>
                    <button onClick={() => setAgentFilter('soulbis')} className={`px-4 py-2 rounded-lg border text-sm ${agentFilter === 'soulbis' ? 'bg-primary/20 border-primary text-primary' : 'border-surface/50 text-text'}`}>⚔️ Soulbis</button>
                    <button onClick={() => setAgentFilter('soulbae')} className={`px-4 py-2 rounded-lg border text-sm ${agentFilter === 'soulbae' ? 'bg-primary/20 border-primary text-primary' : 'border-surface/50 text-text'}`}>🧙 Soulbae</button>
                    <button onClick={() => setAgentFilter('privacy')} className={`px-4 py-2 rounded-lg border text-sm ${agentFilter === 'privacy' ? 'bg-primary/20 border-primary text-primary' : 'border-surface/50 text-text'}`}>☯️ Privacy</button>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 space-y-3">
                {filteredSkills.map((meta) => {
                  const isCardExpanded = expandedSkillCards.has(meta.id);
                  return (
                    <div key={meta.id} className="rounded-xl border border-surface/50 bg-surface/20 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleSkillCardExpanded(meta.id)}
                        className="w-full flex items-center gap-2 p-4 text-left hover:bg-surface/30 transition-colors"
                        aria-expanded={isCardExpanded}
                      >
                        <span className="text-2xl" aria-hidden>{meta.seedEmoji}</span>
                        <span className="font-medium text-text flex-1">{meta.seedName}</span>
                        <span className="text-xs text-text/60">{meta.filename}</span>
                        <span className="text-sm text-text/70">
                          {meta.agent === 'soulbis' && '⚔️ Soulbis'}
                          {meta.agent === 'soulbae' && '🧙 Soulbae'}
                          {meta.agent === 'privacy' && '☯️ Privacy'}
                        </span>
                        <span className="text-text/50" aria-hidden>{isCardExpanded ? '▼' : '▶'}</span>
                      </button>
                      {isCardExpanded && (
                        <div className="border-t border-surface/50 p-4 space-y-4">
                          <blockquote className="text-text/80 italic border-l-2 border-primary/50 pl-4">&ldquo;{meta.proverb}&rdquo;</blockquote>
                          <p className="font-mono text-sm text-text/70">{meta.spell}</p>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={async () => { const content = await loadSkillContent(meta.filename); copyToClipboard(content, 'Skill file copied 🌱'); }} className="px-3 py-1.5 rounded bg-surface/50 hover:bg-surface border border-surface/50 text-sm">Copy File</button>
                            <button onClick={() => handleViewFull(meta)} className="px-3 py-1.5 rounded bg-surface/50 hover:bg-surface border border-surface/50 text-sm">{expandedSkillId === meta.id ? 'Hide' : 'View Full'}</button>
                            <button onClick={() => handleDownload(meta)} className="px-3 py-1.5 rounded bg-surface/50 hover:bg-surface border border-surface/50 text-sm">Download .md</button>
                            <button onClick={() => toggleSkill(meta.id)} title={selectedSkillIds.has(meta.id) ? 'Remove from spell graph' : 'Add to spell graph'} aria-label={selectedSkillIds.has(meta.id) ? `Remove ${meta.seedName} from spell graph` : `Add ${meta.seedName} to spell graph`} className={`px-3 py-1.5 rounded border text-sm ${selectedSkillIds.has(meta.id) ? 'bg-primary/20 border-primary text-primary' : 'bg-surface/50 hover:bg-surface border-surface/50'}`}><span aria-hidden>{selectedSkillIds.has(meta.id) ? '✓🔮' : '🔮'}</span></button>
                          </div>
                          {expandedSkillId === meta.id && skillContent[meta.filename] && (
                            <div className="mt-4 p-4 rounded-lg bg-background/80 border border-surface/50 prose prose-invert prose-sm max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{skillContent[meta.filename]}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[39] bg-black/50 md:hidden"
          aria-hidden
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`flex-shrink-0 w-80 border-l border-surface/50 bg-background/95 overflow-hidden flex flex-col transition-[width] duration-200 ${sidebarOpen ? 'max-md:fixed max-md:right-0 max-md:top-0 max-md:bottom-0 max-md:z-40 max-md:shadow-xl' : 'w-0 max-md:hidden'}`}
        aria-label="Your spell graph"
      >
        {sidebarOpen && (
          <>
            <div className="p-4 border-b border-surface/50 flex items-center justify-between gap-2">
              <h2 className="font-semibold text-text">Your spell graph</h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!hasCompletedCeremony()) {
                      setShowCeremonyRequiredModal(true);
                      return;
                    }
                    handleDownloadSpellbook();
                  }}
                  disabled={selectionCount === 0}
                  className="p-2 rounded-lg hover:bg-surface/50 text-text/70 hover:text-text disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Save / download spell graph"
                  title="Save / download agentprivacy.skills.md"
                >
                  💾
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="p-2 rounded-lg hover:bg-surface/50 text-text/70 hover:text-text"
                  aria-label="Clear spellbook"
                  title="Clear spellbook"
                >
                  🗑️
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-surface/50 text-text/70 md:hidden"
                  aria-label="Close sidebar"
                >
                  ✕
                </button>
              </div>
            </div>
            {agentCard && (
              <div className="px-4 py-2 text-sm border-b border-surface/30 flex items-center justify-between gap-2">
                <span className="text-text/70 truncate">{agentCard.displayName}</span>
                <TierBadge tier={trustTier} showLabel={true} />
              </div>
            )}
            {agentFilter !== 'all' && (
              <p className="px-4 py-2 text-sm text-text/70 border-b border-surface/30">
                Filter: {agentFilter === 'soulbis' ? '⚔️ Soulbis' : agentFilter === 'soulbae' ? '🧙 Soulbae' : '☯️ Privacy'}
              </p>
            )}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* My spellbooks — at top */}
              <div className="border-b border-surface/30 pb-4">
                <button
                  type="button"
                  onClick={() => setExploreOpen((o) => !o)}
                  className="w-full flex items-center justify-between py-2 text-sm font-medium text-text/80 hover:text-text"
                >
                  <span>My spellbooks</span>
                  <span className="text-text/50">{savedSpellbooks.length}</span>
                </button>
                {exploreOpen && (
                  <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {savedSpellbooks.length === 0 ? (
                      <li className="text-sm text-text/50 py-2">No saved spellbooks yet. Save your current selection below.</li>
                    ) : (
                      savedSpellbooks.map((sb) => (
                        <li key={sb.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface/20 border border-surface/30">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-text truncate">{sb.name}</p>
                            <p className="text-xs text-text/50">
                              {sb.spellIds.length + sb.skillIds.length} items · {new Date(sb.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleLoadSaved(sb.id)}
                              className="px-2 py-1 rounded text-xs font-medium text-primary hover:bg-primary/20"
                              title="Load this spellbook"
                            >
                              Load
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSaved(sb.id)}
                              className="p-1 rounded text-text/50 hover:text-red-400 hover:bg-red-500/10"
                              title="Remove saved spellbook"
                              aria-label={`Delete ${sb.name}`}
                            >
                              ✕
                            </button>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>

              {/* Skill files — above Spells */}
              {selectedSkills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-text/80 mb-2">Skill files</h3>
                  <ul className="space-y-1">
                    {selectedSkills.map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate text-text">{s.seedEmoji} {s.seedName}</span>
                        <button type="button" onClick={() => toggleSkill(s.id)} className="text-primary hover:underline flex-shrink-0" aria-label={`Remove ${s.seedName} from spell graph`}>Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedSpells.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-text/80 mb-2">Spells</h3>
                  <ul className="space-y-3">
                    {selectedSpells.map((c) => {
                      const markerEmoji = typeof window !== 'undefined' ? getInscribedMarkerEmoji(c.id) : undefined;
                      return (
                        <li key={c.id} className="text-sm border-b border-surface/30 pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="truncate text-text font-medium">{c.title}</span>
                            <button type="button" onClick={() => toggleSpell(c.id)} className="text-primary hover:underline flex-shrink-0" aria-label={`Remove ${c.title} from spell graph`}>Remove</button>
                          </div>
                          <p className="text-xs font-mono text-text/70 break-all mb-0.5" title="Emoji spell inscription">
                            {c.spell || '—'}
                          </p>
                          {markerEmoji && (
                            <p className="text-xs text-text/60">
                              Your marker: <span className="font-medium" aria-hidden>{markerEmoji}</span>
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {selectionCount === 0 && (
                <p className="text-sm text-text/60">Add spells and skill files above to build your spell graph. Download when ready to get your skills.md package (linked in compression via spells and proverbs).</p>
              )}

              {/* Save spellbook */}
              <div className="border-t border-surface/30 pt-4 space-y-2">
                {showSaveForm ? (
                  <>
                    <input
                      type="text"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      placeholder="Name this spellbook (e.g. Soulbis build)"
                      className="w-full px-3 py-2 rounded-lg border border-surface/50 bg-background text-text text-sm placeholder:text-text/50"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveSpellbook();
                        if (e.key === 'Escape') setShowSaveForm(false);
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSaveSpellbook}
                        disabled={selectionCount === 0}
                        className="flex-1 py-2 rounded-lg text-sm font-medium bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowSaveForm(false); setSaveName(''); }}
                        className="px-3 py-2 rounded-lg text-sm border border-surface/50 hover:bg-surface/50"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasCompletedCeremony()) {
                        setShowCeremonyRequiredModal(true);
                        return;
                      }
                      setShowSaveForm(true);
                    }}
                    disabled={selectionCount === 0}
                    className="w-full py-2 rounded-lg text-sm font-medium border border-surface/50 hover:bg-surface/30 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Save spellbook
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </aside>
      </div>

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-primary/90 text-background text-sm shadow-lg z-50 animate-in fade-in duration-200"
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}

      {showCeremonyRequiredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-label="Ceremony required">
          <div className="w-full max-w-md rounded-2xl border border-surface/50 bg-background p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-text mb-2">Create your Swordsman identity to save</h2>
            <p className="text-text/70 text-sm mb-6">
              Your unique proverbs and learning path attach to your key profile. Complete the dual ceremony once to save spellbooks.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCeremonyRequiredModal(false)}
                className="flex-1 py-2 rounded-lg border border-surface/50 hover:bg-surface/30"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => router.push('/ceremony?returnTo=/spells')}
                className="flex-1 py-2 rounded-lg font-medium bg-primary text-background hover:bg-primary/90"
              >
                Begin Ceremony
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-label="Clear spellbook">
          <div className="w-full max-w-md rounded-2xl border border-surface/50 bg-background p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-text mb-2">Clear spellbook?</h2>
            <p className="text-text/70 text-sm mb-6">
              This removes all spells and skill files from your current selection. Saved spellbooks are not affected.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-surface/50 hover:bg-surface/30"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearSpellbook}
                className="flex-1 py-2 rounded-lg font-medium bg-primary text-background hover:bg-primary/90"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {showConstellationExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-label="Path the stars">
          <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-surface/50 bg-background shadow-xl overflow-hidden">
            <div className="p-4 border-b border-surface/50 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-semibold text-text flex items-center gap-2">
                <span aria-hidden>🌌</span>
                path the stars
              </h2>
              <button
                type="button"
                onClick={() => setShowConstellationExportModal(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface/50"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
              <p className="text-sm text-text-muted">
                Included in your agentprivacy skills.md export (Spells → Download). Shown below: saved connections and reflect notes.
              </p>
              {(() => {
                const c = getConstellationWeb();
                const hasLinks = c.links.length > 0;
                const reflEntries = Object.entries(c.reflections).filter(([, t]) => (t ?? '').trim());
                const hasRefl = reflEntries.length > 0;
                if (!hasLinks && !hasRefl) {
                  return <p className="text-sm text-text/80">No constellation saved yet. Use Remember Stars on the Web page to save your path.</p>;
                }
                return (
                  <div className="space-y-4 text-sm">
                    {hasLinks && (
                      <div>
                        <h3 className="font-medium text-text mb-2">Connections</h3>
                        <ul className="list-disc list-inside space-y-1 text-text/90">
                          {c.links.map(({ source, target }, i) => (
                            <li key={i}>{source} → {target}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {hasRefl && (
                      <div>
                        <h3 className="font-medium text-text mb-2">Reflect notes</h3>
                        <ul className="space-y-2">
                          {reflEntries.map(([nodeId, text]) => (
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
            <div className="p-4 border-t border-surface/50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowConstellationExportModal(false)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
