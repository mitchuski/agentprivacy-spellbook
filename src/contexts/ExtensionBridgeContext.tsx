'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode
} from 'react'
import {
  initExtensionBridge,
  destroyExtensionBridge,
  onExtensionMessage,
  getExtensionState,
  isExtensionDetected,
  isDualExtensionMode,
  sendToExtensions,
  confirmProverbInscription,
  notifyManaEarned,
  notifyManaSpent,
  notifySpellbookUnlocked,
  type ExtensionState,
  type ExtensionToWebsiteMessage,
  type WebsiteToExtensionMessage
} from '@/lib/extension-bridge'

interface ExtensionBridgeContextValue {
  // State
  state: ExtensionState
  isConnected: boolean
  isDualMode: boolean

  // Actions
  sendMessage: (message: WebsiteToExtensionMessage) => void
  confirmInscription: (proverbId: string, tale: string, memo: string) => void
  earnMana: (amount: number, reason: string) => void
  spendMana: (amount: number, reason: string) => void
  unlockSpellbook: (grimoire: string) => void

  // Last message (for reactive UI updates)
  lastMessage: ExtensionToWebsiteMessage | null
}

const ExtensionBridgeContext = createContext<ExtensionBridgeContextValue | null>(null)

export function ExtensionBridgeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ExtensionState>(getExtensionState())
  const [lastMessage, setLastMessage] = useState<ExtensionToWebsiteMessage | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isDualMode, setIsDualMode] = useState(false)

  useEffect(() => {
    // Initialize bridge on mount
    initExtensionBridge()

    // Subscribe to messages
    const unsubscribe = onExtensionMessage((message) => {
      setLastMessage(message)
      setState(getExtensionState())
      setIsConnected(isExtensionDetected())
      setIsDualMode(isDualExtensionMode())
    })

    // Check initial state after a short delay (extensions may already be loaded)
    const checkTimer = setTimeout(() => {
      setState(getExtensionState())
      setIsConnected(isExtensionDetected())
      setIsDualMode(isDualExtensionMode())
    }, 1000)

    return () => {
      unsubscribe()
      clearTimeout(checkTimer)
      destroyExtensionBridge()
    }
  }, [])

  const sendMessage = useCallback((message: WebsiteToExtensionMessage) => {
    sendToExtensions(message)
  }, [])

  const confirmInscription = useCallback((proverbId: string, tale: string, memo: string) => {
    confirmProverbInscription(proverbId, tale, memo)
  }, [])

  const earnMana = useCallback((amount: number, reason: string) => {
    notifyManaEarned(amount, reason)
  }, [])

  const spendMana = useCallback((amount: number, reason: string) => {
    notifyManaSpent(amount, reason)
  }, [])

  const unlockSpellbook = useCallback((grimoire: string) => {
    notifySpellbookUnlocked(grimoire)
  }, [])

  const value: ExtensionBridgeContextValue = {
    state,
    isConnected,
    isDualMode,
    sendMessage,
    confirmInscription,
    earnMana,
    spendMana,
    unlockSpellbook,
    lastMessage
  }

  return (
    <ExtensionBridgeContext.Provider value={value}>
      {children}
    </ExtensionBridgeContext.Provider>
  )
}

/**
 * Hook to access extension bridge functionality
 * Must be used within ExtensionBridgeProvider
 */
export function useExtensionBridge(): ExtensionBridgeContextValue {
  const context = useContext(ExtensionBridgeContext)
  if (!context) {
    throw new Error('useExtensionBridge must be used within ExtensionBridgeProvider')
  }
  return context
}

/**
 * Lightweight hook that only tracks connection status
 * Use this when you just need to know if extensions are present
 */
export function useExtensionStatus() {
  const { isConnected, isDualMode, state } = useExtensionBridge()
  return {
    isConnected,
    isDualMode,
    mageDetected: state.mageDetected,
    swordsmanDetected: state.swordsmanDetected
  }
}
