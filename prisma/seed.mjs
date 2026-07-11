import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

const sampleTools = [
  {
    title: "Git Master",
    type: "skill",
    description: "Automates complex git workflows and resolves merge conflicts autonomously.",
    markdownContent: `### Git Master Skill

A production-grade agent skill designed to resolve git merge conflicts and orchestrate branching models.

#### Key Features:
- Resolves complex 3-way merge conflicts using semantic code understanding.
- Automates squash-and-merge rebasing workflows.
- Detects regression patterns before committing code.

#### Usage:
\`\`\`bash
agy invoke git-master --repo . --resolve-conflicts
\`\`\`
`,
    tags: ["git", "vcs", "automation", "workflow"]
  },
  {
    title: "System Prompt Optimizer",
    type: "prompt",
    description: "Analyzes and rewrites LLM system prompts for maximum reasoning output.",
    markdownContent: `### System Prompt Optimizer

This prompt template guides LLMs to analyze structural flaws in user-defined system prompts and output highly optimized, XML-structured system instructions.

#### Focus Areas:
- Role & Persona definition
- Input validation boundaries
- Output parsing format guidelines
- Edge case handling instructions
`,
    tags: ["prompt-engineering", "llm", "reasoning"]
  },
  {
    title: "Neon Postgres Connector",
    type: "mcp",
    description: "Direct Model Context Protocol connector to Neon serverless database instances.",
    markdownContent: `### Neon Postgres MCP Server

An MCP server enabling LLMs to safely query, analyze, and migrate Neon Postgres databases.

#### Capabilities:
- Schema discovery and index auditing.
- SQL syntax check and EXPLAIN analysis.
- Connection pooling management.
`,
    tags: ["database", "mcp", "neon", "postgres"]
  },
  {
    title: "Figma-to-React Engine",
    type: "skill",
    description: "Converts Figma design tokens and component trees into clean Tailwind React components.",
    markdownContent: `### Figma-to-React UI Generator

A compiler that reads the Figma REST API JSON representation of a design node and emits pure, responsive, typescript React code.

#### Stack:
- Tailwind CSS v4
- Framer Motion animations
- Accessible Radix UI primitives
`,
    tags: ["figma", "react", "tailwind", "ui"]
  },
  {
    title: "Supabase Object Storage",
    type: "mcp",
    description: "MCP server providing secure read and write access to Supabase bucket structures.",
    markdownContent: `### Supabase Storage MCP Server

Exposes filesystem tools for files stored in Supabase buckets, mapping remote paths to standard MCP reads/writes.
`,
    tags: ["storage", "supabase", "mcp", "cloud"]
  },
  {
    title: "Persona Blueprint",
    type: "prompt",
    description: "Instantly generates detailed behavioral profiles and system instructions for target AI personas.",
    markdownContent: `### Persona Blueprint Prompt

Create a hyper-realistic, domain-specific AI expert profile.

#### Parameters:
- Domain Expertise (e.g. Quantitative Finance)
- Tone / Communication Style
- Constraint Rules
`,
    tags: ["prompt-engineering", "personas", "creativity"]
  }
];

async function main() {
  console.log("Seeding database using direct Neon client...");
  try {
    // Clear existing data
    await sql`DELETE FROM workflow_tools`;
    await sql`DELETE FROM workflows`;
    await sql`DELETE FROM tools`;

    // Seed Tools
    const seededTools = [];
    for (const tool of sampleTools) {
      const result = await sql`
        INSERT INTO tools (title, type, description, "markdownContent", tags, "updatedAt")
        VALUES (${tool.title}, ${tool.type}, ${tool.description}, ${tool.markdownContent}, ${tool.tags}, NOW())
        RETURNING *;
      `;
      const t = result[0];
      seededTools.push(t);
      console.log(`Created tool: ${t.title} (${t.id})`);
    }

    // Seed a sample workflow
    const workflowResult = await sql`
      INSERT INTO workflows (title, description, "updatedAt")
      VALUES ('Design-to-Deploy Code pipeline', 'Chains Figma-to-React compilation, Neon Postgres schema setup, and Git versioning.', NOW())
      RETURNING *;
    `;
    const workflow = workflowResult[0];

    // Link tools to workflow
    await sql`
      INSERT INTO workflow_tools ("workflowId", "toolId", "stepOrder")
      VALUES 
        (${workflow.id}, ${seededTools[3].id}, 1),
        (${workflow.id}, ${seededTools[2].id}, 2),
        (${workflow.id}, ${seededTools[0].id}, 3);
    `;

    console.log(`Created workflow: ${workflow.title} with 3 steps`);
    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Failed to seed database:", err);
  }
}

main();