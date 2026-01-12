const fs = require('fs');
const path = 'C:/Users/mitch/agentprivacy_zypher/oracle-swordsman/src/zcash-client.ts';
let content = fs.readFileSync(path, 'utf8');

// Just replace the listtransactions call with z_listunspent
const oldLine = "const txList = await this.zallet.call<any[]>('listtransactions', '*', count);";
const newCode = `// Zallet doesn't support listtransactions - use z_listunspent for shielded notes
      const notes = await this.zallet.call<any[]>('z_listunspent', 0, 9999999);

      if (!notes || !Array.isArray(notes)) {
        return [];
      }

      // Parse memo hex to text
      const parseMemoHex = (memoHex) => {
        if (!memoHex) return null;
        try {
          const buf = Buffer.from(memoHex, 'hex');
          let end = buf.length;
          while (end > 0 && buf[end - 1] === 0) end--;
          if (end === 0 || buf[0] === 0xf6) return null;
          return buf.slice(0, end).toString('utf8');
        } catch {
          return null;
        }
      };

      const txList = notes`;

if (content.includes(oldLine)) {
  content = content.replace(oldLine, newCode);
  
  // Also update the map to handle notes instead of transactions
  const oldMap = `return (txList || []).map((tx) => ({
        txid: tx.txid,
        type: tx.amount > 0 ? 'incoming' : 'outgoing',
        address: tx.address || '',
        amount: Math.abs(tx.amount),
        confirmations: tx.confirmations || 0,
        blockheight: tx.blockheight,
        timestamp: tx.time,
        memo: tx.memo,
      }));`;
  
  const newMap = `return txList.slice(0, count).map((note) => ({
        txid: note.txid,
        type: 'incoming',  // z_listunspent only shows received notes
        address: note.address || '',
        amount: parseFloat(note.amount) || note.value || 0,
        confirmations: note.confirmations || 0,
        blockheight: note.blockheight,
        timestamp: undefined,
        memo: parseMemoHex(note.memo),
      }));`;
  
  content = content.replace(oldMap, newMap);
  
  fs.writeFileSync(path, content);
  console.log('File updated successfully');
} else {
  console.log('listtransactions line not found');
}
