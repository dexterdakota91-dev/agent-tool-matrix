import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = (process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "")
  .replace(/channel_binding=require&?/g, "")
  .replace(/^["']|["']$/g, "")
  .trim();
const sql = neon(connectionString);

async function check() {
  const tools = await sql`SELECT id, title, type, description, "markdownContent", tags FROM tools`;
  console.log(`Scanning ${tools.length} tools for non-English content...\n`);

  const results = [];
  for (const t of tools) {
    const text = `${t.title} ${t.description || ''}`;
    // Check for common Portuguese / Spanish words or characters
    const hasAccents = /[áéíóúãõçâêîôûñÁÉÍÓÚÃÕÇÂÊÎÔÛÑ]/.test(text);
    const hasKeywords = /\b(para|dominio|experto|licenca|auditar|solucoes|soluções|arquitetura|inteligencia|inteligência|gerenciamento|visão|visao|estrategia|estratégia|de|del|los|las|uma|um|com|como|por|que|nao|não|em)\b/i.test(text);
    
    if (hasAccents || hasKeywords || t.title.toLowerCase().startsWith('andru')) {
      results.push(t);
    }
  }

  console.log(`Found ${results.length} potentially non-English tools:`);
  for (const r of results) {
    console.log(JSON.stringify({ id: r.id, title: r.title, type: r.type, description: r.description?.substring(0, 100) }, null, 2));
  }
}

check().catch(console.error);
