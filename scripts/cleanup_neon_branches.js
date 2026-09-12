const https = require('https');

const API_KEY = process.env.NEON_API_KEY;
const PROJECT_ID = process.env.NEON_PROJECT_ID || 'nameless-hall-67176116';

if (!API_KEY) {
  console.error("No NEON_API_KEY provided");
  process.exit(1);
}

function request(method, path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'console.neon.tech',
      port: 443,
      path: `/api/v2/projects/${PROJECT_ID}${path}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log(`Fetching branches for Neon project ${PROJECT_ID}...`);
  const { status, data } = await request('GET', '/branches');
  if (status !== 200) {
    console.error(`Failed to fetch branches (status ${status}):`, data);
    process.exit(1);
  }

  const branches = data.branches || [];
  console.log(`Found ${branches.length} branches:`);
  for (const b of branches) {
    console.log(`- [${b.id}] "${b.name}" | Primary: ${b.primary} | Default: ${b.default}`);
  }

  const toDelete = branches.filter(b => !b.primary && !b.default && b.name !== 'main');
  console.log(`\nFound ${toDelete.length} non-primary branch(es) to delete.`);

  for (const b of toDelete) {
    console.log(`Deleting branch ${b.name} (${b.id})...`);
    const delRes = await request('DELETE', `/branches/${b.id}`);
    console.log(`Result for ${b.name}: status ${delRes.status}`);
  }

  console.log("\nCleanup finished! Re-verifying remaining branches...");
  const finalCheck = await request('GET', '/branches');
  if (finalCheck.status === 200) {
    const remaining = finalCheck.data.branches || [];
    console.log(`Remaining branches (${remaining.length}):`);
    for (const b of remaining) {
      console.log(`- [${b.id}] "${b.name}" (Primary: ${b.primary}, Default: ${b.default})`);
    }
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
