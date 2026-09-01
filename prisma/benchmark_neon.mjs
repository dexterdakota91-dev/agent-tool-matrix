import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = (process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "")
  .replace(/channel_binding=require&?/g, "")
  .replace(/^["']|["']$/g, "")
  .trim();
const sql = neon(connectionString);

async function run() {
  console.log('Testing Zero-Latency Neon HTTP Queries...\n');

  console.time('Total getInitialData Parallel HTTP Execution');
  
  const [tools, workflows, apiKeys] = await Promise.all([
    sql`
      SELECT id, title, type, description, "markdownContent", tags, "createdAt", "updatedAt"
      FROM tools
      ORDER BY "createdAt" DESC
    `,
    sql`
      SELECT 
        w.id, w.title, w.description, w."createdAt", w."updatedAt",
        COALESCE(
          json_agg(
            json_build_object(
              'workflowId', wt."workflowId",
              'toolId', wt."toolId",
              'stepOrder', wt."stepOrder",
              'toolTitle', t.title,
              'toolType', t.type
            ) ORDER BY wt."stepOrder" ASC
          ) FILTER (WHERE wt."toolId" IS NOT NULL),
          '[]'
        ) as tools
      FROM workflows w
      LEFT JOIN workflow_tools wt ON w.id = wt."workflowId"
      LEFT JOIN tools t ON wt."toolId" = t.id
      GROUP BY w.id
      ORDER BY w."createdAt" DESC
    `,
    sql`
      SELECT id, name, prefix, "createdAt", "lastUsed", active
      FROM api_keys
      ORDER BY "createdAt" DESC
    `
  ]);

  console.timeEnd('Total getInitialData Parallel HTTP Execution');

  console.log(`\nFetched:`);
  console.log(`- ${tools.length} Tools`);
  console.log(`- ${workflows.length} Workflows`);
  console.log(`- ${apiKeys.length} API Keys`);
}

run().catch(console.error);
