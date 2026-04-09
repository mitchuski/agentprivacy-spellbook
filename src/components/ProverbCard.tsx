'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import EvokeModal from '@/components/EvokeModal';
import {
  type UserProverb,
  updateProverbStatus,
  deleteUserProverb,
  getGrimoireDisplayName,
  getStatusDisplay,
  getSourceTypeDisplay,
} from '@/lib/proverbs/storage';
import { formatZcashMemo, getTaleIdFromAct } from '@/lib/zcash-memo';
import UAddressDisplay from '@/components/UAddressDisplay';

/** Link to spellbook page for constellation / map to spellbook. */
function getSpellbookLink(taleId: string): { href: string; label: string } | null {
  const storyMatch = taleId.match(/^story-(\d+)$/i);
  if (storyMatch) return { href: `/story?act=${storyMatch[1]}`, label: 'Story' };
  if (taleId.match(/^zero-/i)) return { href: '/zero', label: 'Zero' };
  if (taleId.startsWith('canon')) return { href: '/canon', label: 'Canon' };
  if (taleId.startsWith('society')) return { href: '/society', label: 'Society' };
  if (taleId.startsWith('plurality')) return { href: '/plurality', label: 'Plurality' };
  const actMatch = taleId.match(/^act-(\d{2})-/);
  if (actMatch) return { href: `/story?act=${parseInt(actMatch[1], 10)}`, label: 'Story' };
  return null;
}

interface ProverbCardProps {
  proverb: UserProverb;
  onUpdate?: () => void;
  showActions?: boolean;
  /** Show source type (From Mage, Agreed on cast) in header (feed style). */
  showSourceType?: boolean;
}

export default function ProverbCard({ proverb, onUpdate, showActions = true, showSourceType = false }: ProverbCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRevealFlow, setShowRevealFlow] = useState(false);
  const [memoCopied, setMemoCopied] = useState(false);
  const [showEvokeModal, setShowEvokeModal] = useState(false);

  const statusDisplay = getStatusDisplay(proverb.status);
  const sourceDisplay = getSourceTypeDisplay(proverb.sourceType);
  const spellbookLink = getSpellbookLink(proverb.taleId);
  const timeAgo = getTimeAgo(proverb.createdAt);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(proverb.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleAddToSpells = () => {
    updateProverbStatus(proverb.id, 'added_to_spells');
    onUpdate?.();
  };

  const handleDelete = () => {
    if (confirm('Remove this proverb from your collection?')) {
      deleteUserProverb(proverb.id);
      onUpdate?.();
    }
  };

  const handleCopyMemo = async () => {
    const actNum = proverb.actNumber || 1;
    const taleId = getTaleIdFromAct(actNum);
    const memo = formatZcashMemo(taleId, proverb.content);
    try {
      await navigator.clipboard.writeText(memo);
      setMemoCopied(true);
      updateProverbStatus(proverb.id, 'pending_reveal');
      onUpdate?.();
      setTimeout(() => setMemoCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy memo:', err);
    }
  };

  return (
    <>
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-surface/30 border border-surface/50 rounded-xl hover:border-surface transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs text-text-muted flex-wrap">
          {showSourceType ? (
            <>
              <span>{getGrimoireDisplayName(proverb.grimoire)}</span>
              <span>·</span>
              <span>{sourceDisplay.icon} {sourceDisplay.label}</span>
              {proverb.actNumber != null && (
                <>
                  <span>·</span>
                  <span>Act {proverb.actNumber}</span>
                </>
              )}
              <span>·</span>
              <span>{timeAgo}</span>
            </>
          ) : (
            <>
              <span className={statusDisplay.color}>{statusDisplay.icon}</span>
              <span>{getGrimoireDisplayName(proverb.grimoire)}</span>
              {proverb.actNumber && <span>• Act {proverb.actNumber}</span>}
              <span>• {timeAgo}</span>
            </>
          )}
        </div>
        <span className={`px-2 py-0.5 text-xs rounded-full ${statusDisplay.color} bg-surface/50 flex-shrink-0`}>
          {statusDisplay.label}
        </span>
      </div>

      {/* Content */}
      <p className="text-text italic mb-4 leading-relaxed">
        "{proverb.content}"
      </p>

      {/* Actions */}
      {showActions && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface/50 hover:bg-surface text-text-muted hover:text-text transition-colors"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>

          {proverb.status === 'collected' && (
            <>
              <button
                onClick={handleAddToSpells}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary transition-colors"
              >
                ✨ Add to spell graph
              </button>

              <button
                onClick={() => setShowEvokeModal(true)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent transition-colors"
              >
                ✦ Evoke
              </button>

              <button
                onClick={() => setShowRevealFlow(!showRevealFlow)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 text-secondary transition-colors"
              >
                ⚔️ Reveal on Zcash
              </button>
            </>
          )}

          {proverb.status === 'revealed' && proverb.revealedTxid && (
            <a
              href={`https://mainnet.zcashexplorer.app/transactions/${proverb.revealedTxid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent transition-colors"
            >
              View on Chain ↗
            </a>
          )}

          {spellbookLink && (
            <Link
              href={spellbookLink.href}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface/50 hover:bg-surface text-text-muted hover:text-text transition-colors"
            >
              Map to spellbook →
            </Link>
          )}

          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors ml-auto"
          >
            Remove
          </button>
        </div>
      )}

      {/* Reveal Flow */}
      {showRevealFlow && proverb.status === 'collected' && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-4 pt-4 border-t border-surface/50"
        >
          <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
            <h4 className="text-sm font-semibold text-secondary mb-2">⚔️ Reveal on Zcash</h4>
            <p className="text-xs text-text-muted mb-4">
              Inscribe this proverb on the Zcash blockchain as a permanent proof of understanding.
            </p>

            <button
              onClick={handleCopyMemo}
              className="w-full py-2 mb-3 text-sm font-medium rounded-lg bg-secondary hover:bg-secondary/90 text-background transition-colors"
            >
              {memoCopied ? '✓ Memo Copied!' : '📋 Copy Memo for Zodl'}
            </button>

            {memoCopied && (
              <div className="space-y-2 text-xs text-text-muted">
                <p>1. Open Zodl wallet</p>
                <p>2. Send <strong className="text-secondary">0.01 ZEC</strong> to:</p>
                <UAddressDisplay label="zec" variant="small-button" />
                <p>3. Paste the memo in the message field</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>

      {/* Evoke Modal */}
      <EvokeModal
        isOpen={showEvokeModal}
        onClose={() => setShowEvokeModal(false)}
        initialProverb={proverb.content}
        onEvoked={() => {
          setShowEvokeModal(false);
          onUpdate?.();
        }}
      />
    </>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}
