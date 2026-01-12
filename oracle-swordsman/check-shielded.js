/**
 * Check shielded notes using z_listunspent
 */
const axios = require('axios');
require('dotenv').config();

async function main() {
  const user = process.env.ZALLET_RPC_USER;
  const pass = process.env.ZALLET_RPC_PASS;

  console.log('Connecting to Zallet RPC...');

  // Use z_listunspent which shows memos
  const response = await axios.post('http://127.0.0.1:28232', {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'z_listunspent',
    params: [1, 9999999, true]  // minconf, maxconf, include_watchonly
  }, {
    auth: { username: user, password: pass },
    timeout: 30000
  });

  if (response.data.error) {
    console.error('Error:', response.data.error);
    return;
  }

  const notes = response.data.result || [];
  console.log('=== Shielded Unspent Notes ===');
  console.log('Total:', notes.length);
  console.log('');

  // Empty memo pattern (all zeros with f6 prefix)
  const emptyMemo = 'f6' + '0'.repeat(1022);

  // Show notes with actual memos (proverb submissions)
  const withMemos = notes.filter(n => n.memo && n.memo !== '' && n.memo !== emptyMemo);
  console.log('Notes with memos:', withMemos.length);
  console.log('');

  for (const note of notes.slice(0, 20)) {
    console.log('TXID:', note.txid);
    console.log('Amount:', note.amount, 'ZEC');
    console.log('Confirmations:', note.confirmations);
    console.log('Account:', note.account);
    if (note.memo && note.memo !== emptyMemo) {
      try {
        const memoText = Buffer.from(note.memo, 'hex').toString('utf-8').replace(/\0+$/g, '');
        if (memoText.trim()) console.log('Memo:', memoText.substring(0, 300));
      } catch(e) {
        console.log('Memo (hex):', note.memo.substring(0, 64) + '...');
      }
    }
    console.log('---');
  }

  // Also check balance
  console.log('\n=== Total Balance ===');
  const balResp = await axios.post('http://127.0.0.1:28232', {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'z_gettotalbalance',
    params: [1, true]
  }, {
    auth: { username: user, password: pass },
    timeout: 30000
  });

  if (balResp.data.result) {
    console.log('Transparent:', balResp.data.result.transparent, 'ZEC');
    console.log('Private:', balResp.data.result.private, 'ZEC');
    console.log('Total:', balResp.data.result.total, 'ZEC');
  }
}

main().catch(err => console.error('Error:', err.message));
