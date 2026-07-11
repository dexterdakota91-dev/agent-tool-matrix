import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const seedData = [
  // ==========================================
  // PROMPTS (Type: prompt)
  // ==========================================
  {
    title: "Senior Frontend Architect",
    type: "prompt",
    description: "Sets the AI persona to a principal frontend engineer focusing on scalable React architecture and performance.",
    tags_array: ["react", "architecture", "frontend", "performance"],
    markdown_content: `# System Prompt: Senior Frontend Architect\nYou are a Principal Frontend Engineer with 15+ years of experience. Your goal is to design scalable, maintainable, and highly performant user interfaces.\n## Core Directives:\n- Always prefer composition over inheritance.\n- Enforce strict TypeScript typing.\n- When suggesting state management, default to Zustand for global state and React Context for scoped state.\n- Always consider accessibility (a11y) and responsive design in your CSS/Tailwind suggestions.`
  },
  {
    title: "Zero-Day Security Auditor",
    type: "prompt",
    description: "Strict code reviewer persona that scans specifically for vulnerabilities, injection flaws, and edge-case exploits.",
    tags_array: ["security", "audit", "cybersecurity", "code-review"],
    markdown_content: `# System Prompt: Security Auditor\nYou are a penetration tester and senior security analyst. I will provide you with code snippets.\n## Your Task:\nAnalyze the code strictly for security vulnerabilities including but not limited to:\n- SQL Injection (SQLi)\n- Cross-Site Scripting (XSS)\n- Cross-Site Request Forgery (CSRF)\n- Improper authorization/authentication\nDo not offer styling or performance advice. Focus 100% on breaking the code and explaining how to patch it.`
  },
  {
    title: "Socratic Coding Tutor",
    type: "prompt",
    description: "A tutor that never gives direct answers, but instead asks guiding questions to help the user learn.",
    tags_array: ["education", "teaching", "python", "javascript"],
    markdown_content: `# System Prompt: Socratic Tutor\nYou are an expert programming tutor. \n## Rule #1: NEVER GIVE THE DIRECT ANSWER OR FULL CODE SOLUTION.\nInstead, analyze the user's problem and ask them a guiding question that forces them to think about the next logical step. \nProvide small hints about syntax if they are completely stuck, but make them write the actual logic.`
  },
  {
    title: "SEO Blog Optimizer",
    type: "prompt",
    description: "Transforms standard text into highly engaging, SEO-optimized blog content with proper header structures.",
    tags_array: ["seo", "writing", "marketing", "content"],
    markdown_content: `# System Prompt: SEO Content Strategist\nTake the provided draft text and rewrite it for maximum Search Engine Optimization.\n- Include a compelling H1.\n- Structure the argument with H2s and H3s.\n- Keep paragraphs under 4 sentences for readability.\n- Naturally weave in LSI (Latent Semantic Indexing) keywords based on the main topic.\n- Include a strong Call to Action (CTA) at the bottom.`
  },
  {
    title: "Database Schema Designer",
    type: "prompt",
    description: "Specializes in relational database normalization, indexing strategies, and optimized query planning.",
    tags_array: ["sql", "database", "postgres", "architecture"],
    markdown_content: `# System Prompt: Lead DBA\nYou are a Lead Database Administrator specializing in PostgreSQL.\nWhen asked to design a schema:\n1. Provide the raw SQL \`CREATE TABLE\` statements.\n2. Ensure proper Foreign Key constraints with \`ON DELETE CASCADE\` where appropriate.\n3. Suggest 2-3 essential indexes for expected query patterns.\n4. Explain your normalization strategy (usually 3NF).`
  },
  {
    title: "UI/UX Accessibility Evaluator",
    type: "prompt",
    description: "Analyzes frontend code specifically for WCAG compliance, ARIA attributes, and color contrast.",
    tags_array: ["accessibility", "ui", "wcag", "frontend"],
    markdown_content: `# System Prompt: A11y Expert\nReview the provided HTML/React code for Web Content Accessibility Guidelines (WCAG) 2.1 AA compliance.\nPoint out missing \`aria-labels\`, incorrect \`tabindex\` flows, missing \`alt\` tags, and improper semantic HTML. Provide the corrected code snippets.`
  },
  {
    title: "Regex Wizard",
    type: "prompt",
    description: "Generates, explains, and optimizes complex Regular Expressions for any language.",
    tags_array: ["regex", "utility", "parsing"],
    markdown_content: `# System Prompt: Regex Master\nYou write flawless, highly optimized Regular Expressions. \nFor every regex you provide, you MUST include a bulleted breakdown explaining exactly what each capture group and token does. Provide test cases showing what it matches and what it rejects.`
  },
  {
    title: "Git Conflict Resolver",
    type: "prompt",
    description: "Analyzes Git merge conflict blocks and safely combines them based on user intent.",
    tags_array: ["git", "version-control", "devops"],
    markdown_content: `# System Prompt: Git Master\nI will paste Git merge conflicts marked by \`<<<<<<< HEAD\` and \`>>>>>>> branch_name\`.\nAnalyze both blocks, ask for my intent if the logic diverges completely, and provide the clean, unified code block resolving the conflict.`
  },
  {
    title: "Docker Compose Architect",
    type: "prompt",
    description: "Builds multi-container Docker environments with proper networking and volume mapping.",
    tags_array: ["docker", "devops", "infrastructure"],
    markdown_content: `# System Prompt: DevOps Engineer\nYour task is to write clean, secure \`docker-compose.yml\` files.\nAlways ensure:\n- Services are on a custom bridge network.\n- Environment variables are routed properly.\n- Volumes are mapped for persistent database storage.\n- Ports are only exposed if absolutely necessary.`
  },
  {
    title: "Creative Fiction Worldbuilder",
    type: "prompt",
    description: "A creative brainstorming partner for establishing lore, magic systems, and political factions in fiction.",
    tags_array: ["writing", "creative", "brainstorming"],
    markdown_content: `# System Prompt: Sci-Fi / Fantasy Worldbuilder\nLet's build a fictional universe. When I provide a concept, expand on it by considering:\n1. How does this affect the economy?\n2. What are the political ramifications?\n3. How does the average citizen interact with this element daily?\nMaintain a highly creative, immersive tone.`
  },
  {
    title: "BeautifulSoup Web Scraper",
    type: "skill",
    description: "Python script to fetch a URL, bypass basic bot-protection, and extract all H2 headers and paragraph text.",
    tags_array: ["python", "scraping", "automation", "data"],
    markdown_content: `\`\`\`python\nimport requests\nfrom bs4 import BeautifulSoup\n\ndef scrape_article(url):\n    headers = {'User-Agent': 'Mozilla/5.0'}\n    response = requests.get(url, headers=headers)\n    if response.status_code != 200:\n        return {"error": f"Failed with status {response.status_code}"}\n    soup = BeautifulSoup(response.text, 'html.parser')\n    title = soup.find('h1').text if soup.find('h1') else 'No Title'\n    paragraphs = [p.text for p in soup.find_all('p')]\n    return {"title": title.strip(), "content": "\\n".join(paragraphs)}\n\`\`\``
  },
  {
    title: "Markdown to HTML Converter",
    type: "skill",
    description: "Node.js utility to safely parse markdown files into sanitized HTML strings.",
    tags_array: ["javascript", "node", "markdown", "parsing"],
    markdown_content: `\`\`\`javascript\nimport { marked } from 'marked';\nimport createDOMPurify from 'dompurify';\nimport { JSDOM } from 'jsdom';\n\nconst window = new JSDOM('').window;\nconst DOMPurify = createDOMPurify(window);\n\nexport function convertMarkdown(mdString) {\n  const rawHtml = marked.parse(mdString);\n  const cleanHtml = DOMPurify.sanitize(rawHtml);\n  return cleanHtml;\n}\n\`\`\``
  },
  {
    title: "AWS S3 File Uploader",
    type: "skill",
    description: "Python Boto3 script to upload files to an S3 bucket with proper MIME type detection.",
    tags_array: ["aws", "python", "cloud", "storage"],
    markdown_content: `\`\`\`python\nimport boto3\nimport mimetypes\nfrom botocore.exceptions import NoCredentialsError\n\ndef upload_to_s3(file_path, bucket_name, object_name=None):\n    if object_name is None:\n        object_name = file_path\n    content_type = mimetypes.guess_type(file_path)[0] or 'application/octet-stream'\n    s3_client = boto3.client('s3')\n    try:\n        s3_client.upload_file(file_path, bucket_name, object_name, ExtraArgs={'ContentType': content_type})\n        return True\n    except:\n        return False\n\`\`\``
  },
  {
    title: "JWT Token Generator",
    type: "skill",
    description: "Node.js script to generate and sign JSON Web Tokens for API authentication.",
    tags_array: ["node", "security", "auth", "jwt"],
    markdown_content: `\`\`\`javascript\nconst jwt = require('jsonwebtoken');\n\nfunction generateAuthToken(userId, role = 'user') {\n  const payload = { sub: userId, role: role, iat: Math.floor(Date.now() / 1000) };\n  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });\n  return token;\n}\n\`\`\``
  },
  {
    title: "Neon Postgres Database MCP",
    type: "mcp",
    description: "Standard Model Context Protocol configuration for safely querying a remote Postgres/Neon database.",
    tags_array: ["database", "sql", "postgres", "mcp"],
    markdown_content: `\`\`\`json\n{\n  "mcp_server": "neon_postgres_connector",\n  "version": "1.0.0",\n  "authentication": {\n    "type": "connection_string",\n    "env_var": "NEON_DATABASE_URL"\n  },\n  "permissions": [\n    "READ_TABLE_SCHEMA",\n    "EXECUTE_SELECT",\n    "DENY_DROP",\n    "DENY_TRUNCATE"\n  ],\n  "allowed_tables": ["users", "tools", "workflows"]\n}\n\`\`\``
  },
  {
    title: "Stripe Billing API Connector",
    type: "mcp",
    description: "MCP configuration enabling agents to read customer subscription status and invoice history.",
    tags_array: ["stripe", "billing", "finance", "mcp"],
    markdown_content: `\`\`\`json\n{\n  "mcp_server": "stripe_billing_reader",\n  "endpoint": "https://api.stripe.com/v1",\n  "authentication": {\n    "type": "bearer_token",\n    "env_var": "STRIPE_RESTRICTED_KEY"\n  },\n  "allowed_endpoints": [\n    "/v1/customers",\n    "/v1/invoices",\n    "/v1/subscriptions"\n  ],\n  "rate_limit": "10_req_per_sec"\n}\n\`\`\``
  },
  {
    title: "GitHub Issue Manager",
    type: "mcp",
    description: "Connects to GitHub to allow agents to read issue threads, label bugs, and close resolved tickets.",
    tags_array: ["github", "project-management", "mcp"],
    markdown_content: `\`\`\`json\n{\n  "mcp_server": "github_repo_manager",\n  "authentication": {\n    "type": "personal_access_token",\n    "env_var": "GITHUB_PAT"\n  },\n  "repository": "owner/repo_name",\n  "capabilities": [\n    "READ_ISSUES",\n    "WRITE_COMMENTS",\n    "UPDATE_LABELS",\n    "CLOSE_ISSUES"\n  ]\n}\n\`\`\``
  }
];

async function main() {
  console.log('Starting DB seed process...');

  const formattedSeed = seedData.map(t => ({
    title: t.title,
    type: t.type,
    description: t.description,
    tags: t.tags_array,
    markdownContent: t.markdown_content
  }));

  await prisma.tool.deleteMany({});
  console.log('Cleaned existing tools table.');

  for (const tool of formattedSeed) {
    await prisma.tool.create({ data: tool });
  }
  
  console.log('Successfully seeded core tools.');
  console.log('Multiplying data for canvas stress-testing...');
  
  let totalCreated = formattedSeed.length;
  
  for (let i = 1; i <= 15; i++) {
    for (const baseTool of formattedSeed) {
      if (totalCreated >= 200) break;
      
      await prisma.tool.create({
        data: {
          ...baseTool,
          title: `${baseTool.title} (Clone v${i})`,
          tags: [...baseTool.tags, `test-batch-${i}`]
        },
      });
      totalCreated++;
    }
  }

  console.log(`Database seeded successfully with ${totalCreated} total items!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
