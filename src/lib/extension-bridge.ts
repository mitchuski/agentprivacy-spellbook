/**
 * Extension Bridge - Communication layer between agentprivacy.ai and browser extensions
 *
 * This module handles bidirectional communication with the Swordsman and Mage extensions
 * using the window.postMessage API for website-to-extension and
 * listening for extension-initiated messages.
 */

// Message types from extensions to website
export type ExtensionToWebsiteMessage =
  | { type: 'CEREMONY_INSCRIPTION'; action: string; data: unknown }
  | { type: 'MAGE_PRESENT'; domain: string; orbPosition: { x: number; y: number } }
  | { type: 'SWORD_PRESENT'; myTermsState: unknown; orbPosition: { x: number; y: number } }
  | { type: 'CONSTELLATION_UPDATE'; nodes: unknown[]; edges: unknown[]; patterns: unknown[] }
  | { type: 'SCAN_RESULTS'; findings: unknown }
  | { type: 'MANA_SYNC'; balance: number; history: unknown[] }

// Message types from website to extensions
export type WebsiteToExtensionMessage =
  | { type: 'CEREMONY_CONFIRMATION'; action: string; success: boolean; txid?: string }
  | { type: 'CEREMONY_ERROR'; reason: string }
  | { type: 'PROVERB_INSCRIBED'; proverbId: string; tale: string; memo: string }
  | { type: 'MANA_EARNED'; amount: number; reason: string }
  | { type: 'MANA_SPENT'; amount: number; reason: string }
  | { type: 'SPELLBOOK_UNLOCKED'; grimoire: string }
  | { type: 'WEBSITE_READY'; capabilities: string[] }
  // Training events
  | { type: 'SPELL_CAST'; spellId: string; content: string; emoji: string; position: { x: number; y: number }; section: string }
  | { type: 'ORB_CONVERGENCE'; count: number; timestamp: number }
  | { type: 'SECTION_VISITED'; sectionId: string; totalVisited: number }
  | { type: 'PATH_UNLOCKED'; progress: { sectionsVisited: number; spellsCast: number; convergences: number } }
  | { type: 'REPERTOIRE_SYNC'; repertoire: unknown }

// Extension state
export interface ExtensionState {
  mageDetected: boolean
  swordsmanDetected: boolean
  mageOrbPosition: { x: number; y: number } | null
  swordsmanOrbPosition: { x: number; y: number } | null
  constellationNodes: unknown[]
  lastScanResults: unknown | null
  manaBalance: number
}

// Listeners
type MessageListener = (message: ExtensionToWebsiteMessage) => void
const listeners: Set<MessageListener> = new Set()

// Global state
let extensionState: ExtensionState = {
  mageDetected: false,
  swordsmanDetected: false,
  mageOrbPosition: null,
  swordsmanOrbPosition: null,
  constellationNodes: [],
  lastScanResults: null,
  manaBalance: 0
}

/**
 * Initialize the extension bridge
 * Call this once on app startup
 */
export function initExtensionBridge(): void {
  if (typeof window === 'undefined') return

  // Listen for messages from extensions
  window.addEventListener('message', handleExtensionMessage)

  // Announce website is ready
  setTimeout(() => {
    sendToExtensions({
      type: 'WEBSITE_READY',
      capabilities: ['proverb-inscription', 'mana-sync', 'ceremony']
    })
  }, 500)

  console.log('[ExtensionBridge] Initialized and listening for extensions')
}

/**
 * Clean up the extension bridge
 */
export function destroyExtensionBridge(): void {
  if (typeof window === 'undefined') return
  window.removeEventListener('message', handleExtensionMessage)
  listeners.clear()
}

/**
 * Handle incoming messages from extensions
 */
function handleExtensionMessage(event: MessageEvent): void {
  // Security: Only accept messages from same origin or localhost
  if (event.origin !== window.location.origin &&
      !event.origin.includes('localhost') &&
      !event.origin.includes('127.0.0.1')) {
    return
  }

  const message = event.data as ExtensionToWebsiteMessage
  if (!message || !message.type) return

  // Update internal state based on message type
  switch (message.type) {
    case 'MAGE_PRESENT':
      extensionState.mageDetected = true
      extensionState.mageOrbPosition = message.orbPosition
      console.log('[ExtensionBridge] Mage extension detected')
      break

    case 'SWORD_PRESENT':
      extensionState.swordsmanDetected = true
      extensionState.swordsmanOrbPosition = message.orbPosition
      console.log('[ExtensionBridge] Swordsman extension detected')
      break

    case 'CONSTELLATION_UPDATE':
      extensionState.constellationNodes = message.nodes
      break

    case 'SCAN_RESULTS':
      extensionState.lastScanResults = message.findings
      break

    case 'MANA_SYNC':
      extensionState.manaBalance = message.balance
      break

    case 'CEREMONY_INSCRIPTION':
      console.log('[ExtensionBridge] Inscription request:', message.action)
      break
  }

  // Notify all listeners
  listeners.forEach(listener => {
    try {
      listener(message)
    } catch (err) {
      console.error('[ExtensionBridge] Listener error:', err)
    }
  })
}

/**
 * Send a message to extensions via postMessage
 */
export function sendToExtensions(message: WebsiteToExtensionMessage): void {
  if (typeof window === 'undefined') return
  window.postMessage(message, '*')
}

/**
 * Subscribe to extension messages
 * Returns unsubscribe function
 */
export function onExtensionMessage(listener: MessageListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * Get current extension state
 */
export function getExtensionState(): Readonly<ExtensionState> {
  return { ...extensionState }
}

/**
 * Check if any extension is detected
 */
export function isExtensionDetected(): boolean {
  return extensionState.mageDetected || extensionState.swordsmanDetected
}

/**
 * Check if both extensions are detected (full ceremony mode)
 */
export function isDualExtensionMode(): boolean {
  return extensionState.mageDetected && extensionState.swordsmanDetected
}

// --- Specific actions ---

/**
 * Confirm a proverb inscription to the extensions
 */
export function confirmProverbInscription(proverbId: string, tale: string, memo: string): void {
  sendToExtensions({
    type: 'PROVERB_INSCRIBED',
    proverbId,
    tale,
    memo
  })
}

/**
 * Notify extensions of mana earned
 */
export function notifyManaEarned(amount: number, reason: string): void {
  sendToExtensions({
    type: 'MANA_EARNED',
    amount,
    reason
  })
}

/**
 * Notify extensions of mana spent
 */
export function notifyManaSpent(amount: number, reason: string): void {
  sendToExtensions({
    type: 'MANA_SPENT',
    amount,
    reason
  })
}

/**
 * Notify extensions of spellbook unlock
 */
export function notifySpellbookUnlocked(grimoire: string): void {
  sendToExtensions({
    type: 'SPELLBOOK_UNLOCKED',
    grimoire
  })
}

// --- Training Events ---

/**
 * Broadcast spell cast to extensions
 */
export function broadcastSpellCast(
  spellId: string,
  content: string,
  emoji: string,
  position: { x: number; y: number },
  section: string
): void {
  sendToExtensions({
    type: 'SPELL_CAST',
    spellId,
    content,
    emoji,
    position,
    section
  })
}

/**
 * Broadcast orb convergence to extensions
 */
export function broadcastOrbConvergence(count: number): void {
  sendToExtensions({
    type: 'ORB_CONVERGENCE',
    count,
    timestamp: Date.now()
  })
}

/**
 * Broadcast section visit to extensions
 */
export function broadcastSectionVisited(sectionId: string, totalVisited: number): void {
  sendToExtensions({
    type: 'SECTION_VISITED',
    sectionId,
    totalVisited
  })
}

/**
 * Broadcast path unlocked to extensions
 */
export function broadcastPathUnlocked(progress: {
  sectionsVisited: number
  spellsCast: number
  convergences: number
}): void {
  sendToExtensions({
    type: 'PATH_UNLOCKED',
    progress
  })
}

/**
 * Sync full repertoire to extensions
 */
export function syncRepertoireToExtensions(repertoire: unknown): void {
  sendToExtensions({
    type: 'REPERTOIRE_SYNC',
    repertoire
  })
}
