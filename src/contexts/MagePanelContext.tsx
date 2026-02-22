'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import MagePanel from '@/components/MagePanel';

/** Current page context for Mage inference (act/tale/chapter the user is viewing). */
export type MagePanelPageContext = {
  taleId: string;
  actNumber?: number;
  actName?: string;
};

type MagePanelContextValue = {
  isOpen: boolean;
  openMagePanel: () => void;
  closeMagePanel: () => void;
  /** Set current page context so the popout Mage uses the right act/tale for inference. Call from story/zero/canon/society when the user selects an act/tale/chapter. */
  setPageContext: (ctx: MagePanelPageContext | null) => void;
  pageContext: MagePanelPageContext | null;
};

const MagePanelContext = createContext<MagePanelContextValue | null>(null);

export function useMagePanel() {
  const ctx = useContext(MagePanelContext);
  if (!ctx) {
    return {
      isOpen: false,
      openMagePanel: () => {},
      closeMagePanel: () => {},
      setPageContext: () => {},
      pageContext: null,
    };
  }
  return ctx;
}

export function MagePanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pageContext, setPageContext] = useState<MagePanelPageContext | null>(null);
  const openMagePanel = useCallback(() => setIsOpen(true), []);
  const closeMagePanel = useCallback(() => setIsOpen(false), []);

  const taleId = pageContext?.taleId ?? 'evoke-base';
  const actNumber = pageContext?.actNumber;
  const actName = pageContext?.actName;

  return (
    <MagePanelContext.Provider value={{ isOpen, openMagePanel, closeMagePanel, setPageContext, pageContext }}>
      {children}
      <MagePanel
        taleId={taleId}
        actNumber={actNumber}
        actName={actName}
        controlledOpen={isOpen}
        onClose={closeMagePanel}
      />
    </MagePanelContext.Provider>
  );
}
