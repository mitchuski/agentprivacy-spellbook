/**
 * Load and validate Nexus (knowledge graph) data from /public/nexus/.
 */

import type { NexusNode, NexusEdge } from './types';

const NODES_URL = '/nexus/nodes.json';
const EDGES_URL = '/nexus/edges.json';

export interface NexusGraphData {
  nodes: NexusNode[];
  edges: NexusEdge[];
}

function isNexusNode(raw: unknown): raw is NexusNode {
  if (!raw || typeof raw !== 'object') return false;
  const o = raw as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.label === 'string' &&
    typeof o.type === 'string' &&
    typeof o.guild === 'string' &&
    typeof o.protocolFamily === 'string' &&
    typeof o.privacyDelegationPosition === 'number' &&
    typeof o.dimensionalScale === 'number' &&
    typeof o.complexity === 'number' &&
    typeof o.maturity === 'string' &&
    Array.isArray(o.inscriptions) &&
    typeof o.summary === 'string' &&
    Array.isArray(o.standards) &&
    o.dimensions != null &&
    typeof o.dimensions === 'object'
  );
}

function isNexusEdge(raw: unknown): raw is NexusEdge {
  if (!raw || typeof raw !== 'object') return false;
  const o = raw as Record<string, unknown>;
  return (
    typeof o.source === 'string' &&
    typeof o.target === 'string' &&
    typeof o.type === 'string' &&
    typeof o.strength === 'number'
  );
}

export async function loadNexusGraph(): Promise<NexusGraphData> {
  const [nodesRes, edgesRes] = await Promise.all([
    fetch(NODES_URL),
    fetch(EDGES_URL),
  ]);

  if (!nodesRes.ok) throw new Error(`Failed to load nodes: ${nodesRes.status}`);
  if (!edgesRes.ok) throw new Error(`Failed to load edges: ${edgesRes.status}`);

  const nodesRaw: unknown = await nodesRes.json();
  const edgesRaw: unknown = await edgesRes.json();

  if (!Array.isArray(nodesRaw)) throw new Error('nodes.json must be an array');
  if (!Array.isArray(edgesRaw)) throw new Error('edges.json must be an array');

  const nodes = nodesRaw.filter(isNexusNode) as NexusNode[];
  const edges = edgesRaw.filter(isNexusEdge) as NexusEdge[];

  if (nodes.length !== nodesRaw.length) throw new Error('Some node entries failed validation');
  if (edges.length !== edgesRaw.length) throw new Error('Some edge entries failed validation');

  return { nodes, edges };
}
