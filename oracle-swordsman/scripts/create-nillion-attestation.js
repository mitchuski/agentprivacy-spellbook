/**
 * Create Nillion Attestation Workload
 * Stores a hash of the inscription key in a TEE for proof of integration
 */

const axios = require('axios');

const NILLION_API_KEY = 'c050d154e9bd8832a66fdad0559b8767';
const NILLION_API_URL = 'https://api.nilcc.nillion.network/api/v1';

// Hash of the inscription WIF (NOT the key itself!)
const WIF_HASH = '90599fd8da17d7a0068b1dd4ea8ca44d90d63588818085ee8db009855635becc';
const PUBKEY = '03a92c73b25ec06cdb7d70aaaef178a1ede2969f11169f332b56a5bfed47c66223';

async function createAttestationWorkload() {
  console.log('=== Nillion TEE Attestation Workload ===\n');

  // Simple docker compose that stores the hash and exposes attestation
  const dockerCompose = `services:
  attestation:
    image: caddy:2-alpine
    command: caddy respond --listen :80 --body '{"status":"active","keyHashStored":true,"publicKey":"${PUBKEY}","keyHash":"${WIF_HASH}","purpose":"zcash-inscription-signing","network":"mainnet"}' --header "Content-Type: application/json"`;

  const workloadConfig = {
    name: 'zypher-inscription-attestation',
    artifactsVersion: '0.2.1',
    dockerCompose: dockerCompose,
    envVars: {
      WIF_HASH: WIF_HASH,
      PUBKEY: PUBKEY,
      PURPOSE: 'zcash-inscription-signing'
    },
    publicContainerName: 'attestation',
    publicContainerPort: 80,
    memory: 2048,
    cpus: 2,
    disk: 10,
    gpus: 0
  };

  console.log('Creating workload with config:');
  console.log('  Name:', workloadConfig.name);
  console.log('  Key Hash:', WIF_HASH.substring(0, 16) + '...');
  console.log('  Public Key:', PUBKEY.substring(0, 16) + '...');
  console.log('');

  try {
    const response = await axios.post(
      `${NILLION_API_URL}/workloads/create`,
      workloadConfig,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': NILLION_API_KEY,
          'accept': 'application/json'
        },
        timeout: 60000
      }
    );

    console.log('✅ Workload created successfully!\n');
    console.log('Workload ID:', response.data.workloadId);
    console.log('Domain:', response.data.domain);
    console.log('Status:', response.data.status);
    console.log('Credit Rate:', response.data.creditRate, 'credits/min');
    console.log('');
    console.log('Attestation URL:', `https://${response.data.domain}/`);
    console.log('TEE Report URL:', `https://${response.data.domain}/nilcc/api/v2/report`);

    return response.data;
  } catch (error) {
    console.error('❌ Failed to create workload:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

createAttestationWorkload().catch(console.error);
