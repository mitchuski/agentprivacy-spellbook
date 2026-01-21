'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { SoulbaeMessage } from '@/lib/soulbae';

interface ChatMessageProps {
  message: SoulbaeMessage;
  isUser?: boolean;
}

export default function ChatMessage({ message, isUser = false }: ChatMessageProps) {
  // Ensure isUser is correctly determined from message role
  // Use a consistent check that works on both server and client
  // Default to false if message is undefined/null to prevent hydration mismatch
  const isUserMessage = Boolean(message?.role === 'user' || isUser);
  
  // Ensure className is always a string to prevent hydration mismatch
  const containerClassName = `flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4`;
  
  // Pre-compute all classNames to prevent hydration mismatch
  const messageBoxClassName = `max-w-[80%] rounded-lg px-4 py-3 ${
    isUserMessage
      ? 'bg-primary/20 border border-primary/30 text-text'
      : 'bg-surface/50 border border-surface/50 text-text-muted'
  }`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={containerClassName}
      suppressHydrationWarning
    >
      <div
        className={messageBoxClassName}
        suppressHydrationWarning
      >
        <div className="flex items-start gap-2">
          {!isUserMessage && (
            <span className="text-xl mt-1">🧙</span>
          )}
          <div className="flex-1">
            {isUserMessage ? (
              // User messages - simple display with markdown
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ children }) => <code className="bg-background/50 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-text-muted">{children}</li>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              // Assistant messages - check for RPP format, then render markdown
              <div className="prose prose-invert max-w-none">
                {(() => {
                  const content = message.content;
                  
                  // Check for [RPP Proverb: ...] format (the actual format from NEAR AI)
                  const rppProverbMatch = content.match(/^(\[RPP\s+Proverb\s*:\s*[^\]]+\])\s*\n?\n?(.*)$/s);
                  if (rppProverbMatch) {
                    const proverbPart = rppProverbMatch[1];
                    const storyPart = rppProverbMatch[2].trim();
                    
                    // Extract just the proverb text for display (remove any existing quotes)
                    const proverbTextMatch = proverbPart.match(/\[RPP\s+Proverb\s*:\s*([^\]]+)\]/i);
                    let proverbText = proverbTextMatch ? proverbTextMatch[1].trim() : proverbPart;
                    // Remove all quotes (both single and double) from start and end
                    proverbText = proverbText.replace(/^['"]+|['"]+$/g, '');
                    
                    return (
                      <>
                        <div className="p-4 mb-3 bg-primary/20 border-2 border-primary/50 rounded-lg text-primary font-medium text-lg leading-relaxed">
                          <span className="text-2xl mr-2">🔮</span>
                          [RPP] proverb: "{proverbText}"
                        </div>
                        {storyPart && (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0 text-text-muted">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                              code: ({ children }) => <code className="bg-background/50 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="text-text-muted">{children}</li>,
                            }}
                          >
                            {storyPart}
                          </ReactMarkdown>
                        )}
                      </>
                    );
                  }
                  
                  // Check if content starts with [RPP] proverb format (handles both single and double quotes)
                  // This matches the cleaned format: [RPP] proverb: "text" followed by story
                  const rppMatch = content.match(/^(\[RPP\]\s+proverb:\s*(?:'[^']*'|"[^"]*"))\s*\n?\n?(.*)$/s);
                  if (rppMatch) {
                    const proverbPart = rppMatch[1];
                    const storyPart = rppMatch[2].trim();
                    
                    return (
                      <>
                        <div className="p-4 mb-3 bg-primary/20 border-2 border-primary/50 rounded-lg text-primary font-medium text-lg leading-relaxed">
                          <span className="text-2xl mr-2">🔮</span>
                          {proverbPart}
                        </div>
                        {storyPart && (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0 text-text-muted">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                              code: ({ children }) => <code className="bg-background/50 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="text-text-muted">{children}</li>,
                            }}
                          >
                            {storyPart}
                          </ReactMarkdown>
                        )}
                      </>
                    );
                  }
                  
                  // Check if content is ONLY a proverb (starts and ends with [RPP] proverb format)
                  const isProverbOnly = content.match(/^\[RPP\]\s+proverb:\s*(?:'[^']*'|"[^"]*")\s*$/);
                  if (isProverbOnly) {
                    // Render proverb in its own distinct bubble
                    return (
                      <div className="p-4 bg-primary/20 border-2 border-primary/50 rounded-lg text-primary font-medium text-lg leading-relaxed">
                        <span className="text-2xl mr-2">🔮</span>
                        {content}
                      </div>
                    );
                  }
                  
                  // Fallback: check if RPP appears anywhere in the content (handles both formats)
                  const parts = content.split(/(\[RPP\s+Proverb\s*:\s*[^\]]+\]|\[RPP\]\s+proverb:\s*(?:'[^']*'|"[^"]*"))/);
                  if (parts.length > 1) {
                    return parts.map((part, index) => {
                      if (part.match(/^\[RPP/)) {
                        // Extract proverb text (remove any existing quotes)
                        const proverbMatch = part.match(/\[RPP\s+Proverb\s*:\s*([^\]]+)\]/i) || part.match(/\[RPP\]\s*proverb\s*:\s*(?:'([^']*)'|"([^"]*)")/i);
                        let proverbText = proverbMatch ? (proverbMatch[1] || proverbMatch[2] || proverbMatch[3]).trim() : part;
                        // Remove all quotes (both single and double) from start and end
                        proverbText = proverbText.replace(/^['"]+|['"]+$/g, '');
                        return (
                          <div key={index} className="p-4 mb-2 bg-primary/20 border-2 border-primary/50 rounded-lg text-primary font-medium text-lg leading-relaxed">
                            <span className="text-2xl mr-2">🔮</span>
                            [RPP] proverb: "{proverbText}"
                          </div>
                        );
                      }
                      if (part.trim()) {
                        return (
                          <ReactMarkdown
                            key={index}
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0 text-text-muted">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                              code: ({ children }) => <code className="bg-background/50 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="text-text-muted">{children}</li>,
                            }}
                          >
                            {part}
                          </ReactMarkdown>
                        );
                      }
                      return null;
                    }).filter(Boolean);
                  }
                  
                  // No RPP format found, render markdown
                  return (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 text-text-muted">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        code: ({ children }) => <code className="bg-background/50 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="text-text-muted">{children}</li>,
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  );
                })()}
              </div>
            )}
            {message.timestamp && (
              <span className="text-xs text-text-muted/50 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
          {isUserMessage && (
            <span className="text-xl mt-1">⚔️</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

