/**
 * Nexus (knowledge graph) types. Data lives in /public/nexus/nodes.json and edges.json.
 * See docs/NEXUS_SPELLWEB_ARCHITECTURE.md and docs/SPELLWEB_INTEGRATION_SPEC_v2.md.
 */

export type Guild = 'swordsman' | 'mage' | 'emergent' | 'bridge';

export type ProtocolFamily =
  | 'commitment_schemes'
  | 'zero_knowledge_proofs'
  | 'key_management'
  | 'delegation'
  | 'private_transactions'
  | 'identity'
  | 'trust_systems'
  | 'governance'
  | 'agent_architecture'
  | 'standards';

export type Maturity = 'concept' | 'spec' | 'implementation' | 'deployed';

export type NodeType = 'tale' | 'protocol' | 'standard' | 'primitive';

export type EdgeType =
  | 'inscription_echo'
  | 'principle_extends'
  | 'implements'
  | 'guild_bridge'
  | 'dependency';

export interface NexusNode {
  id: string;
  label: string;
  type: NodeType;
  guild: Guild;
  protocolFamily: ProtocolFamily;
  dimensions: {
    d1Hide: number;
    d2Commit: number;
    d3Prove: number;
    d4Connect: number;
    d5Reflect: number;
    d6Delegate: number;
  };
  privacyDelegationPosition: number;
  dimensionalScale: number;
  complexity: number;
  maturity: Maturity;
  communityEngagement?: number;
  inscriptions: string[];
  summary: string;
  standards: string[];
  taleUrl?: string;
  externalUrl?: string;
}

export interface NexusEdge {
  source: string;
  target: string;
  type: EdgeType;
  strength: number;
  label?: string;
}

export const GUILD_COLORS: Record<Guild, string> = {
  swordsman: '#D4A017',
  mage: '#7C6FEF',
  emergent: '#C4A265',
  bridge: '#5B8C5A',
};

export const MATURITY_SIZES: Record<Maturity, number> = {
  concept: 8,
  spec: 14,
  implementation: 20,
  deployed: 28,
};

export const DIM_LABELS = ['d₁ Hide', 'd₂ Commit', 'd₃ Prove', 'd₄ Connect', 'd₅ Reflect', 'd₆ Delegate'] as const;
