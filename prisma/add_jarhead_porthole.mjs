import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = (process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "")
  .replace(/channel_binding=require&?/g, "")
  .replace(/^["']|["']$/g, "")
  .trim();
const sql = neon(connectionString);

const itemsToAdd = [
  {
    title: "Jarhead Persistent Memory MCP",
    type: "mcp",
    description: "High-fidelity verbatim persistent memory system with knowledge triples, semantic associative recall, thermodynamic decay, and AEAD encryption.",
    tags: ["mcp", "jarhead", "memory", "knowledge-graph", "encryption", "persistent-storage"],
    markdownContent: `# Jarhead Persistent Memory MCP

High-fidelity persistent memory system for autonomous agents. Provides zero-loss verbatim storage, knowledge graph triples, semantic associative recall, and optional AEAD encryption.

\`\`\`json
{
  "mcpServers": {
    "jarhead": {
      "command": "python",
      "args": ["-m", "jarhead.server"],
      "tools": [
        "jarhead_store",
        "jarhead_recall",
        "jarhead_manage"
      ]
    }
  }
}
\`\`\`

## Key Capabilities
- **Zero-LLM Verbatim Storage**: Exact transcript and factual capture without lossy summarization.
- **Knowledge Triples**: Stores \`(entity, relation, target)\` semantic graph edges.
- **Thermodynamic Decay**: Models memory retention and access recency using thermodynamic decay curves.
- **AEAD Encryption**: Local authenticated encryption with associated data for sensitive secrets.
`
  },
  {
    title: "Jarhead Memory Store & Recall Skill",
    type: "skill",
    description: "Skill for storing, recalling, and indexing episodic knowledge triples and verbatim transcripts into Jarhead long-term memory.",
    tags: ["skill", "jarhead", "memory-store", "semantic-recall", "episodic-memory"],
    markdownContent: `# Jarhead Memory Store & Recall Skill

Enables the agent to proactively store critical architectural decisions, user preferences, and code patterns into Jarhead memory, and recall relevant context before taking action.

\`\`\`yaml
name: jarhead-memory
description: Proactive memory capture and associative recall using Jarhead.
triggers:
  - "remember this"
  - "store decision"
  - "recall architecture"
\`\`\`
`
  },
  {
    title: "Porthole Context Optimizer & Security MCP",
    type: "mcp",
    description: "Context window optimizer and security guardrail providing real-time secret redaction, schema compression, and token budget bounding.",
    tags: ["mcp", "porthole", "context-optimizer", "security", "secret-redaction", "token-budget"],
    markdownContent: `# Porthole Context Optimizer & Security MCP

High-performance context optimizer and security shield for LLM agents. Filters out redundant context, bounds outputs, compresses JSON schemas, and redacts sensitive API keys and tokens.

\`\`\`json
{
  "mcpServers": {
    "porthole": {
      "command": "python",
      "args": ["-m", "porthole.server"],
      "tools": [
        "porthole_redact_secrets",
        "porthole_bound_output",
        "porthole_filter_context",
        "porthole_compress_schema",
        "porthole_cache"
      ]
    }
  }
}
\`\`\`

## Key Capabilities
- **Secret Redaction**: Real-time scanning and hashing of AWS keys, JWTs, OpenAI/Anthropic tokens, and passwords.
- **Context Filtering**: Removes noisy diffs, repetitive logs, and irrelevant DOM trees before prompt dispatch.
- **Schema Compression**: Minifies function definitions and parameters to save up to 40% input tokens.
- **Deterministic Response Cache**: Instant sub-millisecond retrieval of idempotent tool calls.
`
  },
  {
    title: "Porthole Secret Redactor & Context Guardrail",
    type: "skill",
    description: "Automated agent guardrail skill that intercepts tool outputs to scrub secrets and minify context budgets before LLM reasoning.",
    tags: ["skill", "porthole", "security", "guardrail", "redactor", "context-budget"],
    markdownContent: `# Porthole Secret Redactor & Context Guardrail

Skill that guarantees sensitive credentials, API keys, and environment variables never leak into agent transcripts or LLM completions.

\`\`\`yaml
name: porthole-guardrail
description: Intercepts tool inputs and outputs to scrub secrets and optimize context size.
capabilities:
  - secret-redaction
  - output-bounding
  - schema-minification
\`\`\`
`
  }
];

async function run() {
  console.log("Checking and adding Jarhead and Porthole to Agent Tool Matrix database...\n");

  const existing = await sql`SELECT id, LOWER(title) as norm_title, title FROM tools WHERE LOWER(title) LIKE '%jarhead%' OR LOWER(title) LIKE '%porthole%'`;
  console.log(`Existing matches in DB: ${existing.length}`);
  const existingSet = new Set(existing.map(e => e.norm_title));

  let added = 0;
  for (const item of itemsToAdd) {
    const norm = item.title.toLowerCase();
    if (!existingSet.has(norm)) {
      await sql`
        INSERT INTO tools (title, type, description, "markdownContent", tags, "updatedAt")
        VALUES (${item.title}, ${item.type}, ${item.description}, ${item.markdownContent}, ${item.tags}, NOW())
      `;
      console.log(`✓ Added [${item.type.toUpperCase()}] "${item.title}"`);
      added++;
    } else {
      console.log(`- Already present: "${item.title}"`);
    }
  }

  const finalTools = await sql`SELECT id, title, type FROM tools WHERE LOWER(title) LIKE '%jarhead%' OR LOWER(title) LIKE '%porthole%'`;
  console.log(`\n🎉 Jarhead & Porthole in database:`);
  for (const f of finalTools) {
    console.log(`- [${f.type.toUpperCase()}] ${f.title}`);
  }

  const total = await sql`SELECT COUNT(*) as count FROM tools`;
  console.log(`\nTotal tools now in database: ${total[0].count}`);
}

run().catch(console.error);
