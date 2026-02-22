const fs = require('fs');
const path = 'src/app/evoke/page.tsx';
const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);

const contactSection = `        {/* Contact — no duplicate emoji (explaining box above has mage/swords) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="p-6 rounded-xl bg-primary/10 border border-primary/30">
            <h2 className="text-xl font-semibold text-text mb-4">Contact</h2>

            <p className="text-text-muted mb-6">
              Direct, private communion with the mage. Share your understanding, ask questions,
              or seek guidance on your sovereignty journey. Messages are not stored publicly.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">
                  Your message or proverb:
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Share your understanding, ask a question, or propose a proverb..."
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleContactSubmit}
                  disabled={!contactMessage.trim()}
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-background font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contactSubmitted ? '✓ Message Received' : 'Send to Mage'}
                </button>

                <button
                  onClick={openMagePanel}
                  className="px-6 py-3 bg-surface/50 hover:bg-surface text-text font-medium rounded-lg border border-surface/50 transition-colors"
                >
                  🧙 Form Proverb
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="text-xs text-text-muted text-center pb-8">
          The Privacy Mage sidebar provides real-time conversation. Use it while studying the spellbooks.
        </p>`;

// Find the duplicate block: comment "Your published proverbs" (without "— first after donate") followed by motion.div with delay 0.2
let startIdx = -1;
for (let i = 0; i < lines.length; i++) {
  // Match only the comment without "— first after donate" (the duplicate block)
  const trimmed = lines[i].trim();
  if (trimmed === '{/* Your published proverbs */}' && lines[i + 1] && lines[i + 1].includes('motion.div')) {
    const delayLine = lines.slice(i, i + 10).find(l => l.includes('delay: 0.2'));
    if (delayLine) {
      startIdx = i;
      break;
    }
  }
}
if (startIdx === -1) {
  console.error('Could not find duplicate block');
  process.exit(1);
}
console.log('Block starts at line', startIdx + 1, lines[startIdx]);
// Find closing </motion.div> for this block (depth: count nested motion.div)
let depth = 0;
let endIdx = -1;
for (let i = startIdx + 1; i < lines.length; i++) {
  if (lines[i].includes('<motion.div')) depth++;
  if (lines[i].includes('</motion.div>')) {
    depth--;
    if (depth === 0) { endIdx = i; break; }
  }
}
if (endIdx === -1) {
  console.error('Could not find end of block. Depth ended at', depth);
  for (let j = startIdx; j < Math.min(startIdx + 20, lines.length); j++) {
    console.log((j+1) + ':', lines[j].substring(0, 80));
  }
  process.exit(1);
}

const newLines = [...lines.slice(0, startIdx), ...contactSection.split('\n'), ...lines.slice(endIdx + 1)];
fs.writeFileSync(path, newLines.join('\n'));
console.log('Replaced lines', startIdx + 1, 'to', endIdx + 1);
