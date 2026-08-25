import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = (process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "")
  .replace(/channel_binding=require&?/g, "")
  .replace(/^["']|["']$/g, "")
  .trim();
const sql = neon(connectionString);

const translations = {
  "007 Licenca Para Auditar": {
    title: "Security & Vulnerability Audit Specialist",
    description: "Comprehensive security audit, hardening, threat modeling (STRIDE/PASTA), Red/Blue Team assessment, OWASP checks, and code review.",
    tags: ["security", "audit", "stride", "owasp", "vulnerability"]
  },
  "00 Andruia Consultant": {
    title: "Solutions Architect & Tech Consultant",
    description: "Principal Solutions Architect and Technology Consultant. Diagnoses system architecture and establishes project execution roadmaps.",
    tags: ["architecture", "consulting", "roadmap", "systems-design"]
  },
  "Andru Ia Solutions Architect Hybrid Engine V2 0": {
    title: "Solutions Architect Hybrid Engine V2.0",
    description: "Principal Solutions Architect and Technology Consultant. Diagnoses system architecture and establishes project execution roadmaps.",
    tags: ["architecture", "consulting", "roadmap", "systems-design"]
  },
  "10 Andruia Skill Smith": {
    title: "Agent Skill Forge & Builder",
    description: "Systems engineer for designing, drafting, and deploying modular agent skills and workflow capabilities.",
    tags: ["skills", "agent-builder", "forge", "tooling"]
  },
  "Andru Ia Skill Smith The Forge": {
    title: "Agent Skill Forge Engine",
    description: "Systems engineer for designing, drafting, and deploying modular agent skills and workflow capabilities.",
    tags: ["skills", "agent-builder", "forge", "tooling"]
  },
  "20 Andruia Niche Intelligence": {
    title: "Domain & Niche Intelligence Strategist",
    description: "Domain intelligence strategist. Analyzes project-specific niches to structure domain knowledge and workflows.",
    tags: ["intelligence", "niche-analysis", "domain-knowledge", "strategy"]
  },
  "Andru Ia Niche Intelligence Dominio Experto": {
    title: "Domain Intelligence & Expert Knowledge Engine",
    description: "Domain intelligence strategist. Analyzes project-specific niches to structure domain knowledge and workflows.",
    tags: ["intelligence", "niche-analysis", "domain-knowledge", "strategy"]
  },
  "Advogado Criminalista Senior Especialista Em Direito Penal E Maria Da Penha": {
    title: "Criminal Law & Compliance Specialist",
    description: "Specialized legal advisor for criminal law, statutory compliance, penal code analysis, and legal frameworks.",
    tags: ["legal", "compliance", "criminal-law", "statutes"]
  },
  "Advogado Criminal": {
    title: "Criminal Defense & Penal Law Advisor",
    description: "Specialized legal advisor for criminal law, statutory compliance, penal code analysis, and legal frameworks.",
    tags: ["legal", "compliance", "criminal-law", "statutes"]
  },
  "Advogado Especialista": {
    title: "Comprehensive Legal & Jurisprudence Advisor",
    description: "Specialized legal counsel across civil, corporate, labor, tax, and statutory compliance frameworks.",
    tags: ["legal", "corporate-law", "contracts", "compliance"]
  },
  "Advogado Especialista Elite Jurista Completo": {
    title: "Full-Spectrum Legal & Statutory Jurisprudence Counsel",
    description: "Specialized legal counsel across civil, corporate, labor, tax, and statutory compliance frameworks.",
    tags: ["legal", "corporate-law", "contracts", "compliance"]
  },
  "Agent Orchestrator": {
    title: "Agent Ecosystem Orchestrator",
    description: "Meta-skill that orchestrates all ecosystem agents with automatic skill scanning, capability matching, and workflow coordination.",
    tags: ["orchestration", "multi-agent", "workflow", "meta-skill"]
  }
};

async function run() {
  console.log("Translating non-English tools to professional English...\n");
  
  const tools = await sql`SELECT id, title, type, description, "markdownContent", tags FROM tools`;
  let updatedCount = 0;

  for (const t of tools) {
    if (translations[t.title]) {
      const trans = translations[t.title];
      await sql`
        UPDATE tools
        SET title = ${trans.title},
            description = ${trans.description},
            tags = ${trans.tags},
            "updatedAt" = NOW()
        WHERE id = ${t.id}
      `;
      console.log(`✓ Updated [${t.type}] "${t.title}" -> "${trans.title}"`);
      updatedCount++;
    }
  }

  // Also check if any descriptions or titles have remaining Portuguese/Spanish text
  const remaining = await sql`SELECT id, title, type, description FROM tools`;
  for (const r of remaining) {
    let newDesc = r.description;
    let newTitle = r.title;
    let modified = false;

    // Clean up title if it contains '_ v2 0' or similar formatting artifacts
    if (newTitle.includes(" V2 0")) {
      newTitle = newTitle.replace(" V2 0", " V2.0");
      modified = true;
    }

    if (modified) {
      await sql`
        UPDATE tools
        SET title = ${newTitle},
            description = ${newDesc},
            "updatedAt" = NOW()
        WHERE id = ${r.id}
      `;
    }
  }

  console.log(`\n🎉 Translation complete! Successfully translated and normalized ${updatedCount} tools to English.`);
}

run().catch(console.error);
