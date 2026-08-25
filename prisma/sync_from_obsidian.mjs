import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const VAULT_ATM_PATH = 'C:\\Users\\DEXTE\\.obsidian\\Vault2\\Vault2\\ATM Tools';

function parseObsidianNote(filePath, defaultType) {
  const raw = fs.readFileSync(filePath, 'utf8');
  let filenameTitle = path.basename(filePath, '.md').trim();
  let title = filenameTitle;
  let type = defaultType;
  let description = '';
  let tags = [];
  let markdownContent = '';

  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  let body = raw;

  if (fmMatch) {
    const frontmatter = fmMatch[1];
    body = fmMatch[2];

    const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n\r]+)["']?/i);
    if (titleMatch) title = titleMatch[1].trim();

    const typeMatch = frontmatter.match(/type:\s*["']?([^"'\n\r]+)["']?/i);
    if (typeMatch) {
      const t = typeMatch[1].toLowerCase().trim();
      if (t === 'prompt' || t === 'skill' || t === 'mcp') type = t;
    }

    const tagsBlockMatch = frontmatter.match(/tags:\s*\n((?:\s*-\s*[^\n\r]+\r?\n?)+)/i);
    if (tagsBlockMatch) {
      const tagLines = tagsBlockMatch[1].split('\n');
      for (const line of tagLines) {
        const cleaned = line.replace(/^\s*-\s*/, '').replace(/["']/g, '').trim();
        if (cleaned && cleaned !== 'atm-tool') {
          tags.push(cleaned.toLowerCase());
        }
      }
    }

    const descMatch = body.match(/\*\*Description:\*\*\s*([^\n\r]+)/i);
    if (descMatch) {
      description = descMatch[1].trim();
    } else {
      const fmDesc = frontmatter.match(/description:\s*["']?([^"'\n\r]+)["']?/i);
      if (fmDesc) description = fmDesc[1].trim();
    }

    const contentMatch = body.match(/## Markdown Content & Source Implementation\s*\r?\n([\s\S]*)$/i);
    if (contentMatch && contentMatch[1].trim().length > 0) {
      markdownContent = contentMatch[1].trim();
    } else {
      markdownContent = body.trim();
    }
  } else {
    markdownContent = raw.trim();
  }

  // Normalize and clean title
  let cleanTitle = title
    .replace(/\\/g, '')
    .replace(/_+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If title is all lowercase kebab-case (e.g. 'ab-testing'), make it title-cased if filename is better
  if (/^[a-z0-9-]+$/.test(cleanTitle) && !/^[a-z0-9-]+$/.test(filenameTitle)) {
    cleanTitle = filenameTitle.replace(/_+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Clean description
  if (!description || description.length < 10) {
    const lines = body.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#') && !l.startsWith('**') && !l.startsWith('---'));
    if (lines.length > 0) {
      description = lines[0].substring(0, 200).trim();
    } else {
      description = `${cleanTitle} - ${type.toUpperCase()} component for Agent Tool Matrix.`;
    }
  }

  // Clean tags
  if (tags.length === 0) {
    tags = [type, cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')];
  }
  tags = Array.from(new Set(tags.map(t => t.toLowerCase().trim()))).filter(Boolean);

  if (!markdownContent || markdownContent.length < 10) {
    markdownContent = `# ${cleanTitle}\n\n${description}\n\n\`\`\`yaml\ntype: ${type}\ntitle: "${cleanTitle}"\n\`\`\``;
  }

  return {
    title: cleanTitle,
    type,
    description,
    tags,
    markdownContent
  };
}

async function run() {
  console.log('=== Syncing Tools from Obsidian Vault to Agent Tool Matrix ===\n');

  const connectionString = (process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "")
    .replace(/channel_binding=require&?/g, "")
    .replace(/^["']|["']$/g, "")
    .trim();
  const sql = neon(connectionString);

  // 1. Fetch current DB tools
  const currentDbTools = await sql`SELECT id, title, type, description, "markdownContent", tags FROM tools`;
  console.log(`Current tools in Database: ${currentDbTools.length}`);

  const dbToolMap = new Map();
  for (const t of currentDbTools) {
    const key = t.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    dbToolMap.set(key, t);
  }

  // 2. Scan Obsidian notes
  const folders = [
    { folder: 'Prompts', type: 'prompt' },
    { folder: 'Skills', type: 'skill' },
    { folder: 'MCP Connectors', type: 'mcp' }
  ];

  const vaultToolsMap = new Map();

  for (const { folder, type } of folders) {
    const dir = path.join(VAULT_ATM_PATH, folder);
    if (!fs.existsSync(dir)) {
      console.warn(`Vault directory not found: ${dir}`);
      continue;
    }
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    console.log(`Found ${files.length} notes in Vault [${folder}]`);

    for (const file of files) {
      try {
        const item = parseObsidianNote(path.join(dir, file), type);
        const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        if (!vaultToolsMap.has(key)) {
          vaultToolsMap.set(key, item);
        } else {
          // keep whichever has richer markdown content
          const existing = vaultToolsMap.get(key);
          if (item.markdownContent.length > existing.markdownContent.length) {
            vaultToolsMap.set(key, item);
          }
        }
      } catch (err) {
        console.error(`Failed parsing note ${file}:`, err);
      }
    }
  }

  console.log(`\nTotal Unique Organized Tools in Obsidian Vault: ${vaultToolsMap.size}`);

  // 3. Determine missing and update candidates
  const toInsert = [];
  const toUpdate = [];

  for (const [key, vaultItem] of vaultToolsMap.entries()) {
    const dbItem = dbToolMap.get(key);
    if (!dbItem) {
      toInsert.push(vaultItem);
    } else {
      // Check if DB item is missing markdown content or has a very short description
      const dbNeedsContent = (!dbItem.markdownContent || dbItem.markdownContent.length < 50) && (vaultItem.markdownContent && vaultItem.markdownContent.length > 50);
      const dbNeedsDesc = (!dbItem.description || dbItem.description.length < 20) && (vaultItem.description && vaultItem.description.length > 20);
      if (dbNeedsContent || dbNeedsDesc) {
        toUpdate.push({
          id: dbItem.id,
          title: dbItem.title,
          description: dbNeedsDesc ? vaultItem.description : dbItem.description,
          markdownContent: dbNeedsContent ? vaultItem.markdownContent : dbItem.markdownContent,
          tags: dbItem.tags && dbItem.tags.length > 0 ? dbItem.tags : vaultItem.tags
        });
      }
    }
  }

  console.log(`- New tools to insert into Agent Tool Matrix: ${toInsert.length}`);
  console.log(`- Existing tools to enrich with Obsidian source data: ${toUpdate.length}`);

  // 4. Perform insertions
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
      console.log(`Inserted new tools batch ${i + 1}-${Math.min(i + chunkSize, toInsert.length)} of ${toInsert.length}`);
    }
  }

  // 5. Perform updates if any
  if (toUpdate.length > 0) {
    for (const tool of toUpdate) {
      await sql`
        UPDATE tools
        SET description = ${tool.description},
            "markdownContent" = ${tool.markdownContent},
            tags = ${tool.tags},
            "updatedAt" = NOW()
        WHERE id = ${tool.id}
      `;
    }
    console.log(`Updated and enriched ${toUpdate.length} existing tools with complete markdown source.`);
  }

  // 6. Final verification
  const finalTools = await sql`SELECT id, title, type FROM tools`;
  console.log(`\n🎉 SYNC COMPLETE! Total tools now in Agent Tool Matrix: ${finalTools.length}`);
  
  const pCount = finalTools.filter(t => t.type === 'prompt').length;
  const sCount = finalTools.filter(t => t.type === 'skill').length;
  const mCount = finalTools.filter(t => t.type === 'mcp').length;
  console.log(`- Prompts: ${pCount}`);
  console.log(`- Skills: ${sCount}`);
  console.log(`- MCP Connectors: ${mCount}`);
}

run().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
