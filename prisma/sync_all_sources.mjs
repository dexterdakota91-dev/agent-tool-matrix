import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = (process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "")
  .replace(/channel_binding=require&?/g, "")
  .replace(/^["']|["']$/g, "")
  .trim();
const sql = neon(connectionString);

function cleanTitle(str) {
  return str
    .replace(/^#+\s*/, '')
    .replace(/_+/g, ' ')
    .replace(/-+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function parseMarkdownSkill(filePath, defaultType = 'skill') {
  const raw = fs.readFileSync(filePath, 'utf8');
  let title = path.basename(filePath, '.md');
  let type = defaultType;
  let description = '';
  let tags = [];
  let markdownContent = raw;

  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  let body = raw;

  if (fmMatch) {
    const frontmatter = fmMatch[1];
    body = fmMatch[2];

    const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n\r]+)["']?/i) || frontmatter.match(/name:\s*["']?([^"'\n\r]+)["']?/i);
    if (titleMatch) title = titleMatch[1].trim();

    const typeMatch = frontmatter.match(/type:\s*["']?([^"'\n\r]+)["']?/i);
    if (typeMatch) {
      const t = typeMatch[1].toLowerCase().trim();
      if (t === 'prompt' || t === 'skill' || t === 'mcp') type = t;
    }

    const descMatch = frontmatter.match(/description:\s*(?:>-\s*\n([\s\S]*?)(?=\n[a-z0-9_-]+:|$)|["']?([^"'\n\r]+)["']?)/i);
    if (descMatch) {
      description = (descMatch[1] || descMatch[2] || '').replace(/\r?\n\s*/g, ' ').trim();
    }

    const tagsBlockMatch = frontmatter.match(/tags:\s*\n((?:\s*-\s*[^\n\r]+\r?\n?)+)/i);
    if (tagsBlockMatch) {
      const tagLines = tagsBlockMatch[1].split('\n');
      for (const line of tagLines) {
        const cleaned = line.replace(/^\s*-\s*/, '').replace(/["']/g, '').trim();
        if (cleaned && cleaned !== 'atm-tool') tags.push(cleaned.toLowerCase());
      }
    }
  }

  if (!description || description.length < 10) {
    const descInBody = body.match(/\*\*Description:\*\*\s*([^\n\r]+)/i);
    if (descInBody) {
      description = descInBody[1].trim();
    } else {
      const lines = body.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#') && !l.startsWith('---') && !l.startsWith('**') && l.length > 20);
      if (lines.length > 0) {
        description = lines[0].substring(0, 250).trim();
      } else {
        description = `${cleanTitle(title)} - ${type.toUpperCase()} capability for agent systems.`;
      }
    }
  }

  const contentMatch = body.match(/## Markdown Content & Source Implementation\s*\r?\n([\s\S]*)$/i);
  if (contentMatch && contentMatch[1].trim().length > 0) {
    markdownContent = contentMatch[1].trim();
  } else {
    markdownContent = body.trim();
  }

  title = cleanTitle(title);
  if (tags.length === 0) {
    tags = [type, title.toLowerCase().replace(/[^a-z0-9]+/g, '-')];
  }
  tags = Array.from(new Set(tags.map(t => t.toLowerCase().trim()))).filter(Boolean);

  return { title, type, description, tags, markdownContent };
}

async function auditAndSync() {
  console.log("=== Auditing and Syncing All Skills & MCP Connectors ===\n");

  // 1. Fetch current database tools
  const dbRows = await sql`SELECT id, LOWER(title) as norm_title, title, type, description, tags FROM tools`;
  console.log(`Current DB contains: ${dbRows.length} tools`);

  const dbMap = new Map();
  for (const r of dbRows) {
    const key = r.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    dbMap.set(key, r);
  }

  const allItems = new Map();

  // Helper to add item
  function addItem(item) {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!key) return;
    if (!allItems.has(key)) {
      allItems.set(key, item);
    } else {
      const existing = allItems.get(key);
      if (item.markdownContent.length > existing.markdownContent.length) {
        allItems.set(key, item);
      }
    }
  }

  // 2. Scan Obsidian ATM Tools
  const obsidianBase = 'C:\\Users\\DEXTE\\.obsidian\\Vault2\\Vault2\\ATM Tools';
  const obsidianDirs = [
    { folder: 'Skills', type: 'skill' },
    { folder: 'MCP Connectors', type: 'mcp' },
    { folder: 'Prompts', type: 'prompt' }
  ];

  for (const { folder, type } of obsidianDirs) {
    const dir = path.join(obsidianBase, folder);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
      console.log(`Obsidian [${folder}]: found ${files.length} files`);
      for (const f of files) {
        try {
          const item = parseMarkdownSkill(path.join(dir, f), type);
          addItem(item);
        } catch (e) {
          console.error(`Error parsing ${f}:`, e.message);
        }
      }
    }
  }

  // 3. Scan Local Workspace .agents/skills
  const localSkillsDir = 'C:\\dev\\agent-tool-matrix\\.agents\\skills';
  if (fs.existsSync(localSkillsDir)) {
    const dirs = fs.readdirSync(localSkillsDir);
    for (const d of dirs) {
      const skillFile = path.join(localSkillsDir, d, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        console.log(`Local .agents/skills: found ${d}`);
        const item = parseMarkdownSkill(skillFile, 'skill');
        addItem(item);
      }
    }
  }

  // 4. Scan Builtin & Gemini Config Skills
  const extraSkillPaths = [
    'C:\\Users\\DEXTE\\.gemini\\config\\skills',
    'C:\\Users\\DEXTE\\.gemini\\config\\plugins',
    'C:\\Users\\DEXTE\\.gemini\\antigravity\\builtin\\skills'
  ];

  for (const basePath of extraSkillPaths) {
    if (fs.existsSync(basePath)) {
      const entries = fs.readdirSync(basePath);
      for (const entry of entries) {
        const full = path.join(basePath, entry);
        if (fs.statSync(full).isDirectory()) {
          const skillFile = path.join(full, 'SKILL.md');
          const nestedSkill = path.join(full, 'skills', 'SKILL.md');
          if (fs.existsSync(skillFile)) {
            const item = parseMarkdownSkill(skillFile, 'skill');
            addItem(item);
          } else if (fs.existsSync(nestedSkill)) {
            const item = parseMarkdownSkill(nestedSkill, 'skill');
            addItem(item);
          }
        }
      }
    }
  }

  // 5. Scan MCP Config Servers
  const mcpConfigFile = 'C:\\Users\\DEXTE\\.gemini\\config\\mcp_config.json';
  if (fs.existsSync(mcpConfigFile)) {
    try {
      const mcpData = JSON.parse(fs.readFileSync(mcpConfigFile, 'utf8'));
      const servers = mcpData.mcpServers || {};
      for (const [name, config] of Object.entries(servers)) {
        const title = `${cleanTitle(name)} MCP`;
        const item = {
          title,
          type: 'mcp',
          description: `MCP connector for ${cleanTitle(name)} providing model context protocol integration and agent tools.`,
          tags: ['mcp', name.toLowerCase(), 'connector', 'tools'],
          markdownContent: `# ${title}\n\nModel Context Protocol connector for ${cleanTitle(name)}.\n\n\`\`\`json\n${JSON.stringify({ mcpServers: { [name]: config } }, null, 2)}\n\`\`\``
        };
        addItem(item);
      }
    } catch (e) {
      console.error('Error reading MCP config:', e.message);
    }
  }

  console.log(`\nTotal unique tools discovered across all sources: ${allItems.size}`);

  // 6. Identify missing tools to insert
  const toInsert = [];
  for (const [key, item] of allItems.entries()) {
    if (!dbMap.has(key)) {
      toInsert.push(item);
    }
  }

  console.log(`Tools missing from database: ${toInsert.length}`);

  if (toInsert.length > 0) {
    const chunkSize = 20;
    for (let i = 0; i < toInsert.length; i += chunkSize) {
      const chunk = toInsert.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(tool =>
          sql`
            INSERT INTO tools (title, type, description, "markdownContent", tags, "updatedAt")
            VALUES (${tool.title}, ${tool.type}, ${tool.description}, ${tool.markdownContent}, ${tool.tags}, NOW())
          `
        )
      );
      console.log(`Inserted batch ${i + 1}-${Math.min(i + chunkSize, toInsert.length)} of ${toInsert.length}`);
    }
  }

  // 7. Verify final counts
  const finalTools = await sql`SELECT type, COUNT(*) as count FROM tools GROUP BY type`;
  const totalInDb = await sql`SELECT COUNT(*) as count FROM tools`;
  
  console.log("\n🎉 FINAL DATABASE VERIFICATION:");
  console.log(`Total tools now in Agent Tool Matrix: ${totalInDb[0].count}`);
  for (const row of finalTools) {
    console.log(`- ${row.type.toUpperCase()}s: ${row.count}`);
  }
}

auditAndSync().catch(console.error);
