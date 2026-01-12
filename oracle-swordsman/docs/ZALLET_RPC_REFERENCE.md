# Zallet RPC Command Reference

Quick reference for Zallet RPC commands used in the inscription flow.

## Connection Details

```
Host: 127.0.0.1
Port: 28232
User: oracleswordsmanzypher
Pass: soulbae$mage
```

## Curl Template

```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"<METHOD>","params":[<PARAMS>]}'
```

---

## Available Methods

### Account Management

#### z_listaccounts
List all accounts in wallet.
```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"z_listaccounts","params":[]}'
```

#### z_getnewaccount
Create a new account. Requires seed fingerprint.
```bash
# First get seed fingerprint from listaddresses
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"listaddresses","params":[]}'

# Then create account
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"z_getnewaccount","params":["<SEED_FINGERPRINT>"]}'
```

#### z_getaddressforaccount
Get a unified address for an account.
```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"z_getaddressforaccount","params":[<ACCOUNT_NUMBER>]}'
```

#### listaddresses
List all addresses with seed fingerprints.
```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"listaddresses","params":[]}'
```

---

### Balance & UTXOs

#### z_gettotalbalance
Get total balance (transparent + shielded).
```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"z_gettotalbalance","params":[1, true]}'
```
- First param: minconf (default 1)
- Second param: include_watchonly (REQUIRED, must be true)

#### z_listunspent
List unspent notes (shows memos!).
```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"z_listunspent","params":[1, 9999999, true]}'
```
- First param: minconf
- Second param: maxconf
- Third param: include_watchonly

---

### Sending Transactions

#### z_sendmany (IMPORTANT - Account-based)
Send from account to one or more destinations.

**Key Point**: Zallet uses account-based sending, NOT address-based. Use account number in the from field.

```bash
# Send to transparent address (deshield)
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"z_sendmany",
    "params":[
      0,
      [{"address":"<T_ADDRESS>","amount":<AMOUNT>}],
      1,
      null,
      "AllowRevealedRecipients"
    ]
  }'
```

**Parameters:**
1. `from` - Account number (0 for main account, 1 for protocol fee reserve, etc.)
2. `amounts` - Array of {address, amount, memo?} objects
3. `minconf` - Minimum confirmations (default 1)
4. `fee` - Fee in ZEC (null for default ~0.0001)
5. `privacy_policy` - One of:
   - `"AllowRevealedAmounts"` - t→z (shielding)
   - `"AllowRevealedRecipients"` - z→t (deshielding)
   - `"AllowRevealedSenders"` - Reveals sender
   - `"AllowFullyTransparent"` - t→t
   - `"AllowLinkingAccountAddresses"` - Links addresses within account

**Example: Deshield 0.00618034 ZEC from Account 0 to P2SH**
```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"z_sendmany",
    "params":[
      0,
      [{"address":"t3UYAbyaHQsR5qCquvugxJ8DCJoDXSHmjV6","amount":0.00618034}],
      1,
      null,
      "AllowRevealedRecipients"
    ]
  }'
```

**Example: Move 38.2% to Protocol Fee Reserve (Account 1)**
```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"z_sendmany",
    "params":[
      0,
      [{"address":"u1m59drp9gsrkd6u4px5ywlgf2h9933859yeuflal7znm9my5gl6x88zyawsjxmpmyd8q03h98qhljugkrh7dcunuq5uvgj3nyvg32ne2dg0tycwmw5axmw9pg0dwpn70m8sx3340eer0s06khh005vm8s4yadmuj6t74clnxf3dujvmqc0sequ2h44ngx9wmwwzwfh633mrvzk0kkx93","amount":0.00381966}],
      1,
      null,
      "AllowLinkingAccountAddresses"
    ]
  }'
```

---

### Operation Status

#### z_getoperationstatus
Check status of async operations.
```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"z_getoperationstatus","params":[]}'
```

#### z_getoperationresult
Get result of completed operations (clears them).
```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"z_getoperationresult","params":[]}'
```

#### z_listoperationids
List all operation IDs.
```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"z_listoperationids","params":[]}'
```

---

### Transaction History

#### z_listtransactions
List recent transactions.
```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"z_listtransactions","params":[]}'
```

#### z_viewtransaction
View details of a specific transaction.
```bash
curl -s -u 'oracleswordsmanzypher:soulbae$mage' -X POST http://127.0.0.1:28232 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"z_viewtransaction","params":["<TXID>"]}'
```

---

## Current Wallet Accounts

| Account | Purpose | UA Address |
|---------|---------|------------|
| 0 | Treasury/Oracle (receives proverbs) | `u1jjrsaxyradv3dq03fa4wvk2husu2643v9m6rpnm8x7wmq0zdzv57ca0t5862yq9z7zx4h4d4r42rf85cup3xft6knntz5zglxkqxy8ekr0m2mx4s7cjsg5djq6dzlx9u7l8wlk85ha5t97nh9x3xm27qctlwvcezfeg0a96xnngu4u6fx05css4fzfv50vq0u3zy5vnfswvj5yzx0um` |
| 1 | Protocol Fee Reserve (38.2%) | `u1m59drp9gsrkd6u4px5ywlgf2h9933859yeuflal7znm9my5gl6x88zyawsjxmpmyd8q03h98qhljugkrh7dcunuq5uvgj3nyvg32ne2dg0tycwmw5axmw9pg0dwpn70m8sx3340eer0s06khh005vm8s4yadmuj6t74clnxf3dujvmqc0sequ2h44ngx9wmwwzwfh633mrvzk0kkx93` |

---

## Golden Split Workflow

For a 0.01 ZEC proverb submission:

1. **Calculate Split**
   - 61.8% = 0.00618034 ZEC → Deshield to Act P2SH for inscription
   - 38.2% = 0.00381966 ZEC → Move to Protocol Fee Reserve (Account 1)

2. **Deshield to Act P2SH** (from Account 0)
   ```bash
   # Act 8 example
   z_sendmany 0 [{"address":"t3UYAbyaHQsR5qCquvugxJ8DCJoDXSHmjV6","amount":0.00618034}] 1 null "AllowRevealedRecipients"
   ```

3. **Move Fee to Reserve** (Account 0 → Account 1)
   ```bash
   z_sendmany 0 [{"address":"<ACCOUNT_1_UA>","amount":0.00381966}] 1 null "AllowLinkingAccountAddresses"
   ```

---

## Act P2SH Addresses (for deshield destination)

| Act | P2SH Address |
|-----|--------------|
| 8 | `t3UYAbyaHQsR5qCquvugxJ8DCJoDXSHmjV6` |
| 9 | `t3R9vniLa2HoRXXcf6reywZfwRJiHQVhoQJ` |
| 10 | `t3NUNi662nPNcafpzR2GJFntGnCRx6TRaYu` |
| 11 | `t3cTVUehSQom21SojguNPgVhRfzeUhkGc6M` |
| 12 | `t3dVXHBYp2EAj9ZhkmwKMrwdSiRDD1suC51` |

See `act-p2sh-addresses.txt` for full list.
