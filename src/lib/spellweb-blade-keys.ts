/** Shared with spellweb-blade-bridge (localStorage). */
export const SPELLWEB_BLADE_META_KEY = 'agentprivacy_spellweb_blade_meta' as const;

/** Inventory of all imported witness blades */
export const SPELLWEB_BLADE_INVENTORY_KEY = 'agentprivacy_spellweb_blade_inventory' as const;

/** Currently equipped blade ID (legacy - single blade) */
export const SPELLWEB_EQUIPPED_BLADE_KEY = 'agentprivacy_spellweb_equipped_blade' as const;

/**
 * Stance blade loadout: which blade is assigned to each line (L1-L6) + swap slot
 * Format: { L1: bladeId | null, L2: bladeId | null, ..., L6: bladeId | null, swap: bladeId | null }
 */
export const SPELLWEB_STANCE_LOADOUT_KEY = 'agentprivacy_spellweb_stance_loadout' as const;
