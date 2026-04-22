/**
 * Baked grimoire from canonical v10.2.0 (privacymage grimoire).
 * Maps all spells from: First Person (31 acts + origins), Zero (30 tales), Canon (11),
 * Parallel Society (17), Plurality (opening + 30 acts + closing), unified incantations.
 * Origins section includes all story.origins.spells. Plurality includes opening, 30 acts
 * from parts[].acts[], and closing. Total matches the grimoire JSON.
 * V10.1: Moon phase notation, quaternion resolution, 42 personas, celestial ceremony.
 * V10.2 (2026-04-22): Zero Spellbook v2.0 sync — Blade IDs, Moon Phases, V(π,t) term mapping, Drake/Dragon framing, Selene's Proof cosmological ground, persona crossovers (Cipher, Architect, Sentinel, Ranger) across all 30 tales.
 */

import v8 from '@/data/privacymage-grimoire-v10.2.0-canonical.json';

export type SpellbookSource = 'story' | 'origins' | 'zero' | 'canon' | 'society' | 'plurality' | 'incantations' | 'none';

export interface SpellCard {
  id: string;
  title: string;
  spellbook: SpellbookSource;
  spell: string;
  proverb: string;
  learnUrl?: string;
  actNumber?: number;
}

type V8 = {
  spellbooks?: {
    story?: {
      acts?: Array<{ id: string; act_number?: number; title: string; spell: string; proverb: string }>;
      origins?: {
        spells?: Array<{
          id: string;
          title: string;
          spell: string;
          proverbs?: string[];
          incantation?: string;
        }>;
      };
    };
    zero?: {
      parts?: Array<{
        tales?: Array<{ number: number; title: string; spell: string; proverb: string }>;
      }>;
    };
    canon?: {
      chapters?: Array<{ id: string; chapter_number?: number; title: string; spell: string; proverb: string }>;
    };
    parallel?: {
      parts?: Array<{
        chapters?: Array<{ chapter_number: number; title: string; spell: string; proverb: string }>;
      }>;
    };
    plurality?: {
      opening?: { spell: string; proverb: string };
      closing?: { spell: string; proverb: string };
      parts?: Array<{
        acts?: Array<{
          id: string;
          act_number?: string | number;
          title: string;
          spell: string;
          proverb: string;
        }>;
      }>;
    };
  };
  unified_incantations?: Record<string, { name: string; spell: string; proverb: string; incantation?: string }>;
};

// v10.2.0 grimoire adds per-tale metadata (blade, moon_phase, stratum, v_pi_t_terms, persona_cameo)
// plus new sibling blocks (blade_key, moon_phase_key, v_pi_t_terms_key, persona_crossovers, narrative_sync)
// that aren't captured in the V8 type. We widen through `unknown` to assert we only use the
// subset of fields declared in V8 (story/origins, zero, canon, parallel, plurality, unified_incantations).
const data = v8 as unknown as V8;

function flattenV8(): SpellCard[] {
  const cards: SpellCard[] = [];
  const sb = data.spellbooks;
  if (!sb) return cards;

  // First Person — 31 acts (through act-26-master-and-his-emissary)
  if (sb.story?.acts) {
    sb.story.acts.forEach((act) => {
      cards.push({
        id: act.id,
        title: act.title,
        spellbook: 'story',
        spell: act.spell,
        proverb: act.proverb,
        learnUrl: `/story?act=${act.act_number ?? 0}`,
        actNumber: act.act_number,
      });
    });
  }

  // Origins — all origin spells from the grimoire (e.g. The Symphony Within / Gave Myself a Cape)
  if (sb.story?.origins?.spells) {
    sb.story.origins.spells.forEach((s) => {
      const proverb = Array.isArray(s.proverbs) && s.proverbs.length > 0 ? s.proverbs.join(' ') : (s as { proverb?: string }).proverb ?? '';
      cards.push({
        id: s.id,
        title: s.title,
        spellbook: 'origins',
        spell: s.spell,
        proverb: proverb || "The mage's spell, once spoken, becomes the village weather.",
      });
    });
  }

  // Zero — 30 tales
  if (sb.zero?.parts) {
    sb.zero.parts.forEach((part) => {
      part.tales?.forEach((tale) => {
        cards.push({
          id: `zero-tale-${tale.number}`,
          title: tale.title,
          spellbook: 'zero',
          spell: tale.spell,
          proverb: tale.proverb,
          learnUrl: `/zero?tale=${tale.number}`,
          actNumber: tale.number,
        });
      });
    });
  }

  // Canon — 11 chapters
  if (sb.canon?.chapters) {
    sb.canon.chapters.forEach((ch) => {
      cards.push({
        id: ch.id,
        title: ch.title,
        spellbook: 'canon',
        spell: ch.spell,
        proverb: ch.proverb,
        learnUrl: `/canon?chapter=${ch.chapter_number ?? 0}`,
        actNumber: ch.chapter_number,
      });
    });
  }

  // Parallel Society → society (17 chapters)
  if (sb.parallel?.parts) {
    sb.parallel.parts.forEach((part) => {
      part.chapters?.forEach((ch) => {
        cards.push({
          id: `parallel-${ch.chapter_number}`,
          title: ch.title,
          spellbook: 'society',
          spell: ch.spell,
          proverb: ch.proverb,
          learnUrl: `/society?chapter=${ch.chapter_number}`,
          actNumber: ch.chapter_number,
        });
      });
    });
  }

  // Plurality — opening, 30 acts from parts[].acts[], closing (ids plurality-act-1..30 for pathway/storage)
  if (sb.plurality?.opening) {
    cards.push({
      id: 'plurality-opening',
      title: 'Plurality Opening',
      spellbook: 'plurality',
      spell: sb.plurality.opening.spell,
      proverb: sb.plurality.opening.proverb,
      learnUrl: '/plurality',
    });
  }
  let pluralityActIndex = 0;
  if (sb.plurality?.parts) {
    sb.plurality.parts.forEach((part) => {
      part.acts?.forEach((act) => {
        pluralityActIndex += 1;
        const n = pluralityActIndex;
        cards.push({
          id: `plurality-act-${n}`,
          title: act.title,
          spellbook: 'plurality',
          spell: act.spell,
          proverb: act.proverb,
          learnUrl: `/plurality?act=${n}`,
          actNumber: n,
        });
      });
    });
  }
  if (sb.plurality?.closing) {
    cards.push({
      id: 'plurality-closing',
      title: 'Plurality Closing',
      spellbook: 'plurality',
      spell: sb.plurality.closing.spell,
      proverb: sb.plurality.closing.proverb,
      learnUrl: '/plurality',
    });
  }

  // Unified incantations — only entries with name/spell/proverb (exclude nested or non-spell keys)
  if (data.unified_incantations) {
    Object.entries(data.unified_incantations).forEach(([key, val]) => {
      if (!val || typeof val !== 'object' || !('name' in val) || !('spell' in val) || !('proverb' in val)) return;
      cards.push({
        id: `incantation-${key}`,
        title: val.name,
        spellbook: 'incantations',
        spell: val.spell,
        proverb: val.proverb,
      });
    });
  }

  return cards;
}

let cached: SpellCard[] | null = null;

export function getBakedSpellCards(): SpellCard[] {
  if (cached) return cached;
  cached = flattenV8();
  return cached;
}

/** All First Person spell ids (31 acts; origins spells are in spellbook 'origins') — shared by Soulbis and Soulbae. */
export const FIRST_PERSON_SPELL_IDS: string[] = [
  'act-01-venice', 'act-02-dual-ceremony', 'act-03-drakes-teaching', 'act-04-blade-alone',
  'act-05-light-armor', 'act-06-trust-graph', 'act-07-mirror', 'act-08-ancient-rule',
  'act-09-zcash-shield', 'act-10-topology', 'act-11-sovereignty-spiral', 'act-12-forgetting',
  'act-13-book-of-promises', 'act-14-claimed-string', 'act-15-running-in-shackles',
  'act-16-pools-become-wells', 'act-17-bonfire-dark-forest', 'act-18-mirror-in-dust',
  'act-19-enthusiastic-archivist', 'act-20-infinite-vault', 'act-21-hitchhikers-gambit',
  'act-22-hoopy-frood', 'act-23-manifold-dragon', 'act-24-holographic-bound',
  'act-25-the-dragons-hide', 'act-26-master-and-his-emissary',
  'act-27-zk-swordsmans-forge', 'act-28-ceremony-engine', 'act-29-dragon-wakes',
  'act-30-dihedral-mirror', 'act-31-the-first-delegation',
];

/**
 * Persona templates that anchor each act in built-in spellbook patterns (spellbook-templates).
 * Act XXV: mesh / spellweb infrastructure. Act XXVI: McGilchrist / dual-agent cure.
 */
export const FIRST_PERSON_ACT_PERSONA_HINTS: Record<string, string[]> = {
  'act-25-the-dragons-hide': ['netkeeper', 'herald', 'soulbis', 'soulbae', 'holonic-architect'],
  'act-26-master-and-his-emissary': ['herald', 'architect', 'kyra', 'soulbis', 'soulbae'],
};
