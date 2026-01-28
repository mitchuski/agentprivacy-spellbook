'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithSoulbae, generateSessionId, type SoulbaeMessage } from '@/lib/soulbae';
import { streamChatCompletion } from '@/lib/stream-utils';
import ChatMessage from '@/components/ChatMessage';
import ProverbSuggestions from '@/components/ProverbSuggestions';
import { getSpellemojiForAct, getActFromTaleId } from '@/lib/zcash-memo';

// Spellbook structures for feedback form
type SpellbookType = 'story' | 'zero' | 'canon' | 'society' | 'plurality' | null;

const spellbookOptions: { value: SpellbookType; label: string }[] = [
  { value: null, label: 'No specific spellbook' },
  { value: 'story', label: 'Story' },
  { value: 'zero', label: 'Zero' },
  { value: 'canon', label: 'Canon' },
  { value: 'society', label: 'Society' },
  { value: 'plurality', label: 'Plurality' },
];

// Story acts (1-19)
const storyActs: { [key: number]: string } = {
  1: 'Act I: Venice',
  2: 'Act II: Dual Ceremony',
  3: 'Act III: Drake\'s Teaching',
  4: 'Act IV: Blade Alone',
  5: 'Act V: Light Armour',
  6: 'Act VI: Trust Graph Plane',
  7: 'Act VII: Mirror Enhanced',
  8: 'Act VIII: Ancient Rule',
  9: 'Act IX: Zcash Shield',
  10: 'Act X: Topology of Revelation',
  11: 'Act XI: Balanced Spiral',
  12: 'Act XII: The Forgetting',
  13: 'Act XIII: The Book of Promises',
  14: 'Act XIV: Rain on the Mountain of Entropy',
  15: 'Act XV: Running in Shackles Through the Dark Forest',
  16: 'Act XVI: When Pools Become Wells',
  17: 'Act XVII: Bonfire in the Dark Forest',
  18: 'Act XVIII: A Mirror in Dust, Vibed into Scrying Glass',
  19: 'Act XIX: The Anthropic Archivist',
  20: 'Act XX: The Infinite Vault',
};

// Zero tales (1-30)
const zeroTales: { [key: number]: string } = {
  1: 'Tale 1: The Monastery of Hidden Knowledge',
  2: 'Tale 2: The Three Trials of Truth',
  3: 'Tale 3: The Silent Messenger',
  4: 'Tale 4: The Fields of Finite Wisdom',
  5: 'Tale 5: The Constraint Forge',
  6: 'Tale 6: The Polynomial Riddle',
  7: 'Tale 7: The Witness and the Instance',
  8: 'Tale 8: The Plonkish Revolution',
  9: 'Tale 9: The Pairing Dance',
  10: 'Tale 10: The Commitment Ceremony',
  11: 'Tale 11: The FRI Oracle',
  12: 'Tale 12: The Folding Path',
  13: 'Tale 13: The Sumcheck Riddle',
  14: 'Tale 14: The IPA Chronicle',
  15: 'Tale 15: The Mirror Within Mirrors',
  16: 'Tale 16: The Cyclic Ceremony',
  17: 'Tale 17: The Universal Setup',
  18: 'Tale 18: The Toxic Waste Dragon',
  19: 'Tale 19: The zkVM Kingdom',
  20: 'Tale 20: The Cairo Scribes',
  21: 'Tale 21: The Circom Workshops',
  22: 'Tale 22: The zkEVM Empire',
  23: 'Tale 23: The Private Coin of ZCash',
  24: 'Tale 24: The Tornado\'s Eye',
  25: 'Tale 25: The Rollup Realms',
  26: 'Tale 26: The Vulnerability Codex',
  27: 'Tale 27: The Data Availability Prophecy',
  28: 'Tale 28: The Bridge Between Worlds',
  29: 'Tale 29: The Intelligence Proof',
  30: 'Tale 30: The Eternal Sovereignty',
};

// Canon chapters (1-10)
const canonChapters: { [key: number]: string } = {
  1: 'Chapter 1: The Cypherpunk Whispers',
  2: 'Chapter 2: The Early Incantations',
  3: 'Chapter 3: The Synthesis',
  4: 'Chapter 4: The World Computer',
  5: 'Chapter 5: The First Fracture',
  6: 'Chapter 6: The Great Schism',
  7: 'Chapter 7: The Surveillance Truth',
  8: 'Chapter 8: The Missing Primitive',
  9: 'Chapter 9: The Open Canon',
  10: 'Chapter 10: The Timeline Archive',
};

// Society chapters (1-17)
const societyChapters: { [key: number]: string } = {
  1: 'Chapter 1: The Westphalian Warning',
  2: 'Chapter 2: The Elder Remembers',
  3: 'Chapter 3: The Pirate\'s Republic',
  4: 'Chapter 4: The Manifesto',
  5: 'Chapter 5: Leibniz Dreams',
  6: 'Chapter 6: The Arsenal Opened',
  7: 'Chapter 7: The Banker\'s Confession',
  8: 'Chapter 8: The Network State Vision',
  9: 'Chapter 9: The Three Doors',
  10: 'Chapter 10: The Leibniz Overlap',
  11: 'Chapter 11: Rights Became Real',
  12: 'Chapter 12: Treaty Protocol',
  13: 'Chapter 13: Head Was Cut',
  14: 'Chapter 14: Tools That Breathe',
  15: 'Chapter 15: Trust Reassignment',
  16: 'Chapter 16: Garden Bloomed',
  17: 'Chapter 17: Values Met Code',
};

// Plurality acts (1-30) - placeholder structure
const pluralityActs: { [key: number]: string } = {
  1: 'Act 1', 2: 'Act 2', 3: 'Act 3', 4: 'Act 4', 5: 'Act 5',
  6: 'Act 6', 7: 'Act 7', 8: 'Act 8', 9: 'Act 9', 10: 'Act 10',
  11: 'Act 11', 12: 'Act 12', 13: 'Act 13', 14: 'Act 14', 15: 'Act 15',
  16: 'Act 16', 17: 'Act 17', 18: 'Act 18', 19: 'Act 19', 20: 'Act 20',
  21: 'Act 21', 22: 'Act 22', 23: 'Act 23', 24: 'Act 24', 25: 'Act 25',
  26: 'Act 26', 27: 'Act 27', 28: 'Act 28', 29: 'Act 29', 30: 'Act 30',
};

// Get available acts/chapters for a spellbook
const getSpellbookItems = (spellbook: SpellbookType): { [key: number]: string } | null => {
  switch (spellbook) {
    case 'story': return storyActs;
    case 'zero': return zeroTales;
    case 'canon': return canonChapters;
    case 'society': return societyChapters;
    case 'plurality': return pluralityActs;
    default: return null;
  }
};

// Share Proverb Form Component
interface ShareProverbFormProps {
  taleId?: string;
  actNumber?: number;
  actName?: string;
}

function ShareProverbForm({ taleId, actNumber, actName }: ShareProverbFormProps) {
  // Determine spellbook and page type from taleId
  const getSpellbookFromTaleId = (id?: string): SpellbookType | 'other' | null => {
    if (!id) return null;
    if (id.startsWith('story-') || id.startsWith('act-')) return 'story';
    if (id.startsWith('zero-')) return 'zero';
    if (id.startsWith('canon-')) return 'canon';
    if (id.startsWith('society-')) return 'society';
    if (id.startsWith('plurality-')) return 'plurality';
    if (id === 'privacy-origins') return 'other';
    if (id === 'evoke-base') return 'other';
    return null;
  };

  const getPageType = (id?: string): string | null => {
    if (!id) return null;
    if (id === 'privacy-origins') return 'privacy';
    if (id === 'evoke-base') return 'evoke';
    if (id.includes('mage')) return 'mage';
    if (id.includes('proverbs')) return 'proverbs';
    return null;
  };

  const detectedSpellbook = getSpellbookFromTaleId(taleId);
  const pageType = getPageType(taleId);
  const initialSpellbook: SpellbookType | null = detectedSpellbook && detectedSpellbook !== 'other' ? detectedSpellbook : null;

  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedSpellbook, setSelectedSpellbook] = useState<SpellbookType | null>(initialSpellbook);
  const [selectedAct, setSelectedAct] = useState<number | null>(actNumber && actNumber > 0 ? actNumber : null);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get available items for selected spellbook
  const availableItems = selectedSpellbook ? getSpellbookItems(selectedSpellbook) : null;

  // Auto-fill act when actNumber or taleId changes (user navigated to different act)
  useEffect(() => {
    if (actNumber && actNumber > 0) {
      setSelectedAct(actNumber);
    }
    // Ensure spellbook is set based on taleId
    if (initialSpellbook && !selectedSpellbook) {
      setSelectedSpellbook(initialSpellbook);
    }
  }, [actNumber, taleId, initialSpellbook]);

  // Reset act selection when spellbook changes to a different one
  useEffect(() => {
    if (selectedSpellbook && selectedSpellbook !== initialSpellbook) {
      setSelectedAct(null);
    } else if (selectedSpellbook === initialSpellbook && actNumber && actNumber > 0) {
      // Restore act if spellbook matches the initial one
      setSelectedAct(actNumber);
    }
  }, [selectedSpellbook, initialSpellbook, actNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    if (!userEmail.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSending(true);
    setError(null);
    
    const subject = 'Proverb Submission - Mage Stream';
    const pageTypeLabel = pageType || (selectedSpellbook ? spellbookOptions.find(opt => opt.value === selectedSpellbook)?.label : '');
    const actLabel = selectedAct && availableItems ? availableItems[selectedAct] : (actName && actNumber ? actName : '');
    const body = `Proverb:\n${feedbackMessage}\n\n` +
      (userName.trim() ? `Name: ${userName.trim()}\n` : '') +
      (pageType ? `Page: ${pageType}\n` : selectedSpellbook ? `Spellbook: ${pageTypeLabel}\n` : '') +
      (actLabel ? `${selectedSpellbook === 'zero' ? 'Tale' : selectedSpellbook === 'canon' || selectedSpellbook === 'society' ? 'Chapter' : selectedSpellbook ? 'Act' : 'Reference'}: ${actLabel}\n` : '') +
      `\nSubmitted from: agentprivacy.ai\nSubmitted by: ${userEmail.trim()}`;

    try {
      // Try to use email API endpoint if configured
      const emailApiUrl = process.env.NEXT_PUBLIC_EMAIL_API_URL || '';
      
      if (emailApiUrl) {
        // Use configured email API (e.g., Cloudflare Worker, Vercel Function, etc.)
        const response = await fetch(emailApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: 'mage@agentprivacy.ai',
            from: userEmail.trim(),
            subject: subject,
            text: body,
            replyTo: userEmail.trim(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to send email' }));
          throw new Error(errorData.error || 'Failed to send email');
        }
      } else {
        // Fallback: Use EmailJS if configured, otherwise use mailto
        const emailjsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
        const emailjsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
        const emailjsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
        
        if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
          // Use EmailJS (works with static sites)
          const emailjsUrl = `https://api.emailjs.com/api/v1.0/email/send`;
          const response = await fetch(emailjsUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              service_id: emailjsServiceId,
              template_id: emailjsTemplateId,
              user_id: emailjsPublicKey,
              template_params: {
                to_email: 'mage@agentprivacy.ai',
                from_email: userEmail.trim(),
                subject: subject,
                message: body,
                reply_to: userEmail.trim(),
              },
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to send email via EmailJS');
          }
        } else {
          // Final fallback: Use mailto (opens email client)
          const mailtoLink = `mailto:mage@agentprivacy.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          window.location.href = mailtoLink;
        }
      }
      
      // Show sent confirmation
      setSent(true);
      setIsSending(false);
      setTimeout(() => {
        setSent(false);
        setFeedbackMessage('');
        setUserEmail('');
        setUserName('');
        setSelectedSpellbook(null);
        setSelectedAct(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error sending email:', err);
      setError('Failed to send email. Please try again or use your email client.');
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => {
            setUserEmail(e.target.value);
            setError(null);
          }}
          placeholder="Your email address"
          required
          className="w-full px-3 py-2 bg-background border border-surface/50 rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-3"
        />
      </div>
      <textarea
        value={feedbackMessage}
        onChange={(e) => setFeedbackMessage(e.target.value)}
        placeholder="Share your proverb, share understanding, any feedback is welcome fellow mage."
        rows={4}
        className="w-full px-3 py-2 bg-background border border-surface/50 rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
      />
      {error && (
        <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!feedbackMessage.trim() || !userEmail.trim() || isSending || sent}
        className="w-full px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
      >
        {isSending ? (
          <>
            <span className="animate-spin">⏳</span>
            <span>Sending...</span>
          </>
        ) : sent ? (
          <>
            <span>✓</span>
            <span>Sent!</span>
          </>
        ) : (
          <span>Send</span>
        )}
      </button>
      <div>
        <label className="block text-xs text-text-muted mb-2">Optional:</label>
        <div className="space-y-3">
          <div>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Name"
              className="w-full px-3 py-2 bg-background border border-surface/50 rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-2">Associate with Spellbook</label>
            {pageType ? (
              <div className="w-full px-3 py-2 bg-background/50 border border-surface/50 rounded-lg text-sm text-text">
                {pageType}
              </div>
            ) : (
              <>
                <select
                  value={selectedSpellbook || ''}
                  onChange={(e) => setSelectedSpellbook(e.target.value ? e.target.value as SpellbookType : null)}
                  className="w-full px-3 py-2 bg-background border border-surface/50 rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                >
                  {spellbookOptions.map((option) => (
                    <option key={option.value || 'null'} value={option.value || ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {availableItems && (
                  <select
                    value={selectedAct || ''}
                    onChange={(e) => setSelectedAct(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 bg-background border border-surface/50 rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">No specific {selectedSpellbook === 'zero' ? 'tale' : selectedSpellbook === 'canon' || selectedSpellbook === 'society' ? 'chapter' : 'act'}</option>
                    {Object.entries(availableItems).map(([num, title]) => (
                      <option key={num} value={num}>
                        {title}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

const MAX_QUERIES = 6; // Privacy budget per session

interface MagePanelProps {
  taleId: string;
  actNumber?: number;
  actName?: string;
}

export default function MagePanel({ taleId, actNumber, actName }: MagePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<SoulbaeMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [privacyBudget, setPrivacyBudget] = useState(MAX_QUERIES);
  const [proverbSuggestions, setProverbSuggestions] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [userProverb, setUserProverb] = useState('');
  const [proverbCopied, setProverbCopied] = useState(false);
  const [isEvokeExpanded, setIsEvokeExpanded] = useState(false);
  const [inscriptionCopied, setInscriptionCopied] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State to force session ID regeneration
  const [sessionResetKey, setSessionResetKey] = useState(0);

  // Generate or retrieve persistent session ID - recalculate when taleId changes or session is reset
  const persistentSessionId = useMemo(() => {
    if (typeof window === 'undefined') {
      return generateSessionId();
    }
    const key = `soulbae-session-${taleId}`;
    // If reset was triggered, generate new session
    if (sessionResetKey > 0) {
      const newSession = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(key, newSession);
      return newSession;
    }
    let stored = localStorage.getItem(key);
    if (!stored) {
      stored = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(key, stored);
    }
    return stored;
  }, [taleId, sessionResetKey]);

  // Reset state when taleId changes (user navigated to different act)
  useEffect(() => {
    // Reset messages, input, and user proverb when taleId changes
    setMessages([]);
    setInput('');
    setUserProverb('');
    setProverbSuggestions([]);
    setIsClient(true);
  }, [taleId]);

  // Prevent body scroll when panel is open on mobile only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isOpen && isMobile) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };
    
    if (isOpen) {
      // Only prevent body scroll on mobile devices (screen width < 768px)
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          document.body.style.overflow = originalStyle;
          window.removeEventListener('resize', handleResize);
        };
      }
    }
  }, [isOpen]);

  // Load chat history from localStorage when taleId or session changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const key = `soulbae-chat-${taleId}-${persistentSessionId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const loadedMessages = JSON.parse(saved);
        // Filter out messages with instruction text or corrupted content
        const cleanedMessages = loadedMessages.filter((msg: SoulbaeMessage) => {
          if (!msg.content || typeof msg.content !== 'string') return false;
          // Minimal filtering - only remove obviously corrupted messages
          const instructionPatterns = [
            /^\[RPP Proverb:\s*\]/i, // Empty RPP proverbs
          ];
          return !instructionPatterns.some(pattern => pattern.test(msg.content));
        });
        // Just extract proverbs from messages - no cleaning needed
        setMessages(cleanedMessages);
      } catch (e) {
        console.error('Failed to load chat history:', e);
        // Clear corrupted data
        localStorage.removeItem(key);
      }
    }

    // Load privacy budget
    const budgetKey = `soulbae-budget-${taleId}-${persistentSessionId}`;
    const savedBudget = localStorage.getItem(budgetKey);
    if (savedBudget) {
      try {
        const budget = parseInt(savedBudget, 10);
        if (!isNaN(budget)) {
          setPrivacyBudget(budget);
        }
      } catch (e) {
        console.error('Failed to load privacy budget:', e);
      }
    } else {
      // Reset to max if no saved budget for this tale
      setPrivacyBudget(MAX_QUERIES);
    }
  }, [taleId, persistentSessionId]);

  // Initial message from Soulbae
  useEffect(() => {
    if (messages.length === 0 && isClient) {
      let initialContent = `Welcome! I'm Soulbae, the first Mage. I'm here to help you understand.`;
      
      if (taleId === 'evoke-base') {
        initialContent = `Welcome! I'm Soulbae, the first Mage. I'm here to help you explore the spellbooks and share your understanding.

What would you like to explore?`;
      } else if (actName) {
        initialContent = `Welcome! I'm Soulbae, the first Mage. I'm here to help you understand this tale.

You're reading: **${actName}**\n\nWhat would you like to explore?`;
      } else {
        initialContent = `Welcome! I'm Soulbae, the first Mage. I'm here to help you understand.

What would you like to explore?`;
      }
      
      const initialMessage: SoulbaeMessage = {
        role: 'assistant',
        content: initialContent,
        timestamp: Date.now(),
      };
      setMessages([initialMessage]);
    }
  }, [taleId, actName, messages.length, isClient]);

  // Save chat history to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        localStorage.setItem(`soulbae-chat-${taleId}-${persistentSessionId}`, JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to save chat history:', e);
      }
    }
  }, [messages, taleId, persistentSessionId]);

  // Save privacy budget
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`soulbae-budget-${taleId}-${persistentSessionId}`, privacyBudget.toString());
      } catch (e) {
        console.error('Failed to save privacy budget:', e);
      }
    }
  }, [privacyBudget, taleId, persistentSessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim() || isLoading || privacyBudget <= 0) return;

    const userMessage: SoulbaeMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const conversationHistory = messages;
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setProverbSuggestions([]);

    const assistantMessageId = Date.now();
    const assistantMessage: SoulbaeMessage = {
      role: 'assistant',
      content: '',
      timestamp: assistantMessageId,
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await chatWithSoulbae(
        taleId,
        userMessage.content,
        persistentSessionId,
        conversationHistory
      );

      // Check if response has a stream property (streaming response)
      const responseWithStream = response as any;
      if (responseWithStream.stream && responseWithStream.stream instanceof ReadableStream) {
        const reader = responseWithStream.stream.getReader();
        let fullContent = '';

        for await (const chunk of streamChatCompletion(reader)) {
          fullContent += chunk;
          
          // Minimal instruction filtering - just remove obvious leakage patterns
          let cleanedContent = fullContent;
          // Remove instruction text that appears before the RPP Proverb
          cleanedContent = cleanedContent.replace(/^[^[]*?(?=\[RPP\s+Proverb|\[RPP\]\s+proverb)/i, '');
          // Remove common instruction patterns
          cleanedContent = cleanedContent.replace(/\b(Use emojis|friendly|Let's craft|maybe|connecting to)\b[.,]?\s*/gi, '');
          cleanedContent = cleanedContent.replace(/another mage,?\s*[^[]*?(?=\[RPP\s+Proverb|\[RPP\]\s+proverb)/i, '');
          
          setMessages((prev) => {
            return prev.map((msg) => {
              if (msg.timestamp === assistantMessageId && msg.role === 'assistant') {
                return { ...msg, content: cleanedContent };
              }
              return msg;
            });
          });
        }
      } else {
        // Non-streaming response - minimal instruction filtering
        let cleanedMessage = response.message;
        // Remove instruction text that appears before the RPP Proverb
        cleanedMessage = cleanedMessage.replace(/^[^[]*?(?=\[RPP\s+Proverb|\[RPP\]\s+proverb)/i, '');
        // Remove common instruction patterns
        cleanedMessage = cleanedMessage.replace(/\b(Use emojis|friendly|Let's craft|maybe|connecting to)\b[.,]?\s*/gi, '');
        cleanedMessage = cleanedMessage.replace(/another mage,?\s*[^[]*?(?=\[RPP\s+Proverb|\[RPP\]\s+proverb)/i, '');
        
        setMessages((prev) => {
          return prev.map((msg) => {
            if (msg.timestamp === assistantMessageId && msg.role === 'assistant') {
              return { ...msg, content: cleanedMessage };
            }
            return msg;
          });
        });
      }

      if (response.proverb_suggestions && response.proverb_suggestions.length > 0) {
        setProverbSuggestions(response.proverb_suggestions);
      }

      if (response.privacy_budget_remaining !== undefined) {
        setPrivacyBudget(response.privacy_budget_remaining);
      } else {
        setPrivacyBudget((prev) => Math.max(0, prev - 1));
      }
    } catch (error: any) {
      console.error('Error chatting with Soulbae:', error);
      setMessages((prev) => {
        return prev.map((msg) => {
          if (msg.timestamp === assistantMessageId && msg.role === 'assistant') {
            return {
              ...msg,
              content: error?.message || 'I encountered an error. Please try again.',
            };
          }
          return msg;
        });
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProverbSelect = (proverb: string) => {
    setInput(proverb);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  // Extract proverb text from RPP format
  const extractProverbText = (text: string): string | null => {
    if (!text) return null;
    // Try [RPP Proverb: ...] format first
    let match = text.match(/\[RPP\s+Proverb\s*:\s*([^\]]+)\]/i);
    if (match) {
      let proverbText = match[1].trim();
      proverbText = proverbText.replace(/^['"]|['"]$/g, '').trim();
      if (proverbText && proverbText.length > 0) {
        return proverbText;
      }
    }
    // Try [RPP] proverb: "..." format
    match = text.match(/\[RPP\]\s*proverb\s*:\s*(?:'([^']*)'|"([^"]*)")/i);
    if (match) {
      const proverbText = (match[1] || match[2])?.trim();
      if (proverbText && proverbText.length > 0) {
        return proverbText;
      }
    }
    // Try [RPP] proverb: ... (without quotes, everything after colon until closing bracket or newline)
    match = text.match(/\[RPP\]\s*proverb\s*:\s*([^\]]+?)(?:\]|$)/i);
    if (match) {
      let proverbText = match[1].trim();
      proverbText = proverbText.replace(/^['"]|['"]$/g, '').trim();
      if (proverbText && proverbText.length > 0) {
        return proverbText;
      }
    }
    return null;
  };

  // Extract detected proverb from messages
  const detectedProverb = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.role === 'assistant') {
        const proverb = extractProverbText(message.content);
        if (proverb) {
          return proverb;
        }
      }
    }
    return null;
  })();

  // Auto-fill userProverb when proverb is detected (always update with latest)
  useEffect(() => {
    if (detectedProverb) {
      setUserProverb(detectedProverb);
      // Broadcast to parent page (e.g., proverbs page) for Zashi panel
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('mage-proverb-detected', {
          detail: { proverb: detectedProverb }
        });
        window.dispatchEvent(event);
      }
    }
  }, [detectedProverb]);

  const handleCopyProverb = async () => {
    if (!userProverb.trim()) return;
    try {
      await navigator.clipboard.writeText(userProverb.trim());
      setProverbCopied(true);
      setTimeout(() => setProverbCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy proverb:', err);
    }
  };

  // Get emoji inscription for current story/act
  const getEmojiInscription = (): string => {
    if (actNumber && actNumber > 0) {
      return getSpellemojiForAct(actNumber);
    }
    const act = getActFromTaleId(taleId);
    if (act !== null) {
      return getSpellemojiForAct(act);
    }
    return '';
  };

  const handleCopyInscription = async () => {
    const inscription = getEmojiInscription();
    if (!inscription.trim()) return;
    try {
      await navigator.clipboard.writeText(inscription.trim());
      setInscriptionCopied(true);
      setTimeout(() => setInscriptionCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy inscription:', err);
    }
  };

  // Handle reset context - clear conversation and start fresh
  const handleResetContext = () => {
    if (typeof window === 'undefined') return;
    
    // Clear localStorage for current session
    const chatKey = `soulbae-chat-${taleId}-${persistentSessionId}`;
    const budgetKey = `soulbae-budget-${taleId}-${persistentSessionId}`;
    const sessionKey = `soulbae-session-${taleId}`;
    
    localStorage.removeItem(chatKey);
    localStorage.removeItem(budgetKey);
    localStorage.removeItem(sessionKey);
    
    // Clear messages and state
    setMessages([]);
    setInput('');
    setUserProverb('');
    setProverbSuggestions([]);
    
    // Reset privacy budget
    setPrivacyBudget(MAX_QUERIES);
    
    // Force new session ID generation
    setSessionResetKey(prev => prev + 1);
  };

  return (
    <>
      {/* Toggle Button - Fixed on right side */}
      {!isOpen && (
        <motion.button
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          onClick={() => setIsOpen(!isOpen)}
          className="fixed right-0 top-1/2 z-[60] transform -translate-y-1/2"
          data-mage-toggle
        >
          <div className="bg-secondary/90 hover:bg-secondary text-white px-4 py-6 rounded-l-lg shadow-lg flex items-center gap-2 transition-all">
            <span className="text-xl">🧙</span>
            <span className="font-medium hidden sm:inline">Mage</span>
          </div>
        </motion.button>
      )}

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[55] md:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 bg-surface border-l border-surface/50 z-[60] shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${
                isExpanded ? 'w-3/4 sm:w-2/3 md:w-1/2' : 'w-[90vw] sm:w-96 max-w-full'
              }`}
              style={{ 
                height: '100dvh',
                maxHeight: '100dvh',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)'
              }}
            >
              {/* Header */}
              <div className="p-4 border-b border-surface/50 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧙</span>
                    <div>
                      <h2 className="text-xl font-bold text-text">Mage</h2>
                      <p className="text-sm text-text-muted">Understanding the story</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-text-muted hover:text-primary transition-colors p-1.5 rounded hover:bg-surface/50"
                      title={isExpanded ? "Minimize panel" : "Expand panel"}
                    >
                      {isExpanded ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-text-muted hover:text-text text-2xl leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
                {isClient && (
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-text-muted">
                      Privacy Budget: <span className={privacyBudget <= 1 ? 'text-red-400' : privacyBudget <= 3 ? 'text-yellow-400' : 'text-primary'}>{privacyBudget} / {MAX_QUERIES}</span>
                    </div>
                    <button
                      onClick={handleResetContext}
                      className="text-xs text-text-muted hover:text-text px-2 py-1 rounded hover:bg-surface/50 transition-colors"
                      title="Reset context and start fresh"
                    >
                      Reset Context
                    </button>
                  </div>
                )}
              </div>

              {/* Just Another Proverb Formed Section - Moved to top */}
              <div className="border-b border-surface/50 p-4 flex-shrink-0 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-text mb-2">
                    just another proverb formed
                  </h3>
                  <textarea
                    value={userProverb}
                    onChange={(e) => setUserProverb(e.target.value)}
                    placeholder="Paste your proverbial wisdom here..."
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-surface/50 rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  {userProverb.trim() && (
                    <button
                      onClick={handleCopyProverb}
                      className="mt-2 w-full px-3 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-all duration-200 text-primary text-sm font-medium"
                    >
                      {proverbCopied ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-primary"
                        >
                          ✓ Copied!
                        </motion.span>
                      ) : (
                        'Copy Proverb'
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Container - Scrollable */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {isClient ? (
                  <AnimatePresence>
                    {messages.map((message, index) => {
                      const isUser = Boolean(message?.role === 'user');
                      return (
                        <ChatMessage 
                          key={`${message.role}-${message.timestamp}-${index}`} 
                          message={message} 
                          isUser={isUser} 
                        />
                      );
                    })}
                  </AnimatePresence>
                ) : (
                  <div className="text-text-muted text-center py-8">Loading chat...</div>
                )}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-text-muted"
                  >
                    <span>🧙</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}

                {proverbSuggestions.length > 0 && (
                  <ProverbSuggestions
                    suggestions={proverbSuggestions}
                    onSelect={handleProverbSelect}
                  />
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Section - Always Visible */}
              <div className="flex-shrink-0 flex flex-col">
                {/* Input Area */}
                <div className="border-t border-surface/50 p-4 flex-shrink-0">
                  <div className="flex gap-2">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        privacyBudget <= 0
                          ? 'Privacy budget exhausted'
                          : 'Ask about the story...'
                      }
                      disabled={isLoading || privacyBudget <= 0}
                      rows={2}
                      className="flex-1 px-3 py-2 bg-background border border-surface/50 rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading || privacyBudget <= 0}
                      className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                    >
                      Send
                    </button>
                  </div>
                </div>

                {/* Evoke Your Proverb Section - Collapsible */}
                <div className="border-t border-surface/50 flex-shrink-0 border-l-2 border-r-2 border-b-2 border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.3),0_0_30px_rgba(59,130,246,0.15)] overflow-hidden" style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}>
                <button
                  onClick={() => setIsEvokeExpanded(!isEvokeExpanded)}
                  className="w-full p-4 flex items-center justify-between hover:bg-surface/50 transition-colors"
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <h3 className="text-sm font-semibold text-text">Evoke Your Proverb</h3>
                  </div>
                  <span className="text-text-muted text-lg transform transition-transform">
                    {isEvokeExpanded ? '−' : '+'}
                  </span>
                </button>
                {isEvokeExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 sm:px-4 pb-4 overflow-x-hidden overflow-y-auto max-h-[40vh] sm:max-h-[50vh]" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))' }}>
                      <p className="text-xs text-text-muted mb-3">
                        serendipity in understanding are the acts of creation.
                      </p>
                      <ShareProverbForm taleId={taleId} actNumber={actNumber} actName={actName} />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer - Emoji Inscription Copy Button */}
              {getEmojiInscription() && (
                <div className="border-t border-surface/50 flex-shrink-0 p-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))' }}>
                  <button
                    onClick={handleCopyInscription}
                    className="w-full px-4 py-3 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-all duration-200 text-left group"
                    title="Copy emoji inscription"
                  >
                    <div className="text-primary font-semibold text-xs mb-2">
                      {inscriptionCopied ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-primary"
                        >
                          cast
                        </motion.span>
                      ) : (
                        <span className="group-hover:text-primary/80 transition-colors">
                          inscribe
                        </span>
                      )}
                    </div>
                    <div className="text-text-muted text-sm flex-1 break-words max-w-full whitespace-pre-line font-mono">
                      {getEmojiInscription()}
                    </div>
                  </button>
                </div>
              )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

