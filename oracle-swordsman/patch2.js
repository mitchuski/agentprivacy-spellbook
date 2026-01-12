const fs = require('fs');
const path = 'C:/Users/mitch/agentprivacy_zypher/oracle-swordsman/src/zcash-client.ts';
let content = fs.readFileSync(path, 'utf8');

const oldMap = `const txList = notes

      return (txList || []).map((tx) => ({
        txid: tx.txid,
        type: tx.amount > 0 ? 'incoming' : 'outgoing',
        address: tx.address || '',
        amount: Math.abs(tx.amount),
        confirmations: tx.confirmations || 0,
        blockheight: tx.blockheight,
        timestamp: tx.time,
        memo: tx.memo,
      }));`;

const newMap = `return notes.slice(0, count).map((note) => ({
        txid: note.txid,
        type: 'incoming',  // z_listunspent only shows received notes
        address: note.address || '',
        amount: parseFloat(note.amount) || note.value || 0,
        confirmations: note.confirmations || 0,
        blockheight: note.blockheight,
        timestamp: undefined,
        memo: parseMemoHex(note.memo),
      }));`;

if (content.includes(oldMap)) {
  content = content.replace(oldMap, newMap);
  fs.writeFileSync(path, content);
  console.log('Map updated successfully');
} else {
  console.log('Old map not found');
}
