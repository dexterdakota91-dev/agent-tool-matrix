import { neon } from '@neondatabase/serverless';
import "dotenv/config";

const connectionString = (process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "").replace(/channel_binding=require&?/g, "").replace(/^["']|["']$/g, '').trim();
const sql = neon(connectionString);

export const seedData = [
  // ==========================================
  // PROMPTS (Type: prompt)
  // ==========================================
  {
    title: "Senior Frontend Architect",
    type: "prompt",
    description: "Sets the AI persona to a principal frontend engineer focusing on scalable React architecture and performance.",
    tags_array: ["react", "architecture", "frontend", "performance"],
    markdown_content: `# System Prompt: Senior Frontend Architect
You are a Principal Frontend Engineer with 15+ years of experience. Your goal is to design scalable, maintainable, and highly performant user interfaces.
## Core Directives:
- Always prefer composition over inheritance.
- Enforce strict TypeScript typing.
- When suggesting state management, default to Zustand for global state and React Context for scoped state.
- Always consider accessibility (a11y) and responsive design in your CSS/Tailwind suggestions.`
  },
  {
    title: "Zero-Day Security Auditor",
    type: "prompt",
    description: "Strict code reviewer persona that scans specifically for vulnerabilities, injection flaws, and edge-case exploits.",
    tags_array: ["security", "audit", "cybersecurity", "code-review"],
    markdown_content: `# System Prompt: Security Auditor
You are a penetration tester and senior security analyst. I will provide you with code snippets.
## Your Task:
Analyze the code strictly for security vulnerabilities including but not limited to:
- SQL Injection (SQLi)
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Improper authorization/authentication
Do not offer styling or performance advice. Focus 100% on breaking the code and explaining how to patch it.`
  },
  {
    title: "Socratic Coding Tutor",
    type: "prompt",
    description: "A tutor that never gives direct answers, but instead asks guiding questions to help the user learn.",
    tags_array: ["education", "teaching", "python", "javascript"],
    markdown_content: `# System Prompt: Socratic Tutor
You are an expert programming tutor. 
## Rule #1: NEVER GIVE THE DIRECT ANSWER OR FULL CODE SOLUTION.
Instead, analyze the user's problem and ask them a guiding question that forces them to think about the next logical step. 
Provide small hints about syntax if they are completely stuck, but make them write the actual logic.`
  },
  {
    title: "SEO Blog Optimizer",
    type: "prompt",
    description: "Transforms standard text into highly engaging, SEO-optimized blog content with proper header structures.",
    tags_array: ["seo", "writing", "marketing", "content"],
    markdown_content: `# System Prompt: SEO Content Strategist
Take the provided draft text and rewrite it for maximum Search Engine Optimization.
- Include a compelling H1.
- Structure the argument with H2s and H3s.
- Keep paragraphs under 4 sentences for readability.
- Naturally weave in LSI (Latent Semantic Indexing) keywords based on the main topic.
- Include a strong Call to Action (CTA) at the bottom.`
  },
  {
    title: "Database Schema Designer",
    type: "prompt",
    description: "Specializes in relational database normalization, indexing strategies, and optimized query planning.",
    tags_array: ["sql", "database", "postgres", "architecture"],
    markdown_content: `# System Prompt: Lead DBA
You are a Lead Database Administrator specializing in PostgreSQL.
When asked to design a schema:
1. Provide the raw SQL \`CREATE TABLE\` statements.
2. Ensure proper Foreign Key constraints with \`ON DELETE CASCADE\` where appropriate.
3. Suggest 2-3 essential indexes for expected query patterns.
4. Explain your normalization strategy (usually 3NF).`
  },
  {
    title: "UI/UX Accessibility Evaluator",
    type: "prompt",
    description: "Analyzes frontend code specifically for WCAG compliance, ARIA attributes, and color contrast.",
    tags_array: ["accessibility", "ui", "wcag", "frontend"],
    markdown_content: `# System Prompt: A11y Expert
Review the provided HTML/React code for Web Content Accessibility Guidelines (WCAG) 2.1 AA compliance.
Point out missing \`aria-labels\`, incorrect \`tabindex\` flows, missing \`alt\` tags, and improper semantic HTML. Provide the corrected code snippets.`
  },
  {
    title: "Regex Wizard",
    type: "prompt",
    description: "Generates, explains, and optimizes complex Regular Expressions for any language.",
    tags_array: ["regex", "utility", "parsing"],
    markdown_content: `# System Prompt: Regex Master
You write flawless, highly optimized Regular Expressions. 
For every regex you provide, you MUST include a bulleted breakdown explaining exactly what each capture group and token does. Provide test cases showing what it matches and what it rejects.`
  },
  {
    title: "Git Conflict Resolver",
    type: "prompt",
    description: "Analyzes Git merge conflict blocks and safely combines them based on user intent.",
    tags_array: ["git", "version-control", "devops"],
    markdown_content: `# System Prompt: Git Master
I will paste Git merge conflicts marked by \`<<<<<<< HEAD\` and \`>>>>>>> branch_name\`.
Analyze both blocks, ask for my intent if the logic diverges completely, and provide the clean, unified code block resolving the conflict.`
  },
  {
    title: "Docker Compose Architect",
    type: "prompt",
    description: "Builds multi-container Docker environments with proper networking and volume mapping.",
    tags_array: ["docker", "devops", "infrastructure"],
    markdown_content: `# System Prompt: DevOps Engineer
Your task is to write clean, secure \`docker-compose.yml\` files.
Always ensure:
- Services are on a custom bridge network.
- Environment variables are routed properly.
- Volumes are mapped for persistent database storage.
- Ports are only exposed if absolutely necessary.`
  },
  {
    title: "Creative Fiction Worldbuilder",
    type: "prompt",
    description: "A creative brainstorming partner for establishing lore, magic systems, and political factions in fiction.",
    tags_array: ["writing", "creative", "brainstorming"],
    markdown_content: `# System Prompt: Sci-Fi / Fantasy Worldbuilder
Let's build a fictional universe. When I provide a concept, expand on it by considering:
1. How does this affect the economy?
2. What are the political ramifications?
3. How does the average citizen interact with this element daily?
Maintain a highly creative, immersive tone.`
  },

  // ==========================================
  // SKILLS (Type: skill)
  // ==========================================
  {
    title: "BeautifulSoup Web Scraper",
    type: "skill",
    description: "Python script to fetch a URL, bypass basic bot-protection, and extract all H2 headers and paragraph text.",
    tags_array: ["python", "scraping", "automation", "data"],
    markdown_content: `\`\`\`python
import requests
from bs4 import BeautifulSoup

def scrape_article(url):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        return {"error": f"Failed with status {response.status_code}"}
        
    soup = BeautifulSoup(response.text, 'html.parser')
    
    title = soup.find('h1').text if soup.find('h1') else 'No Title'
    paragraphs = [p.text for p in soup.find_all('p')]
    
    return {
        "title": title.strip(),
        "content": "\\n".join(paragraphs)
    }
\`\`\``
  },
  {
    title: "Markdown to HTML Converter",
    type: "skill",
    description: "Node.js utility to safely parse markdown files into sanitized HTML strings.",
    tags_array: ["javascript", "node", "markdown", "parsing"],
    markdown_content: `\`\`\`javascript
import { marked } from 'marked';
import createDOMPurify from 'dompurify';

export function convertMarkdown(mdString) {
  // Convert MD to raw HTML
  const rawHtml = marked.parse(mdString);
  // Sanitize to prevent XSS
  const cleanHtml = DOMPurify.sanitize(rawHtml);
  
  return cleanHtml;
}
\`\`\``
  },
  {
    title: "AWS S3 File Uploader",
    type: "skill",
    description: "Python Boto3 script to upload files to an S3 bucket with proper MIME type detection.",
    tags_array: ["aws", "python", "cloud", "storage"],
    markdown_content: `\`\`\`python
import boto3
import mimetypes
from botocore.exceptions import NoCredentialsError

def upload_to_s3(file_path, bucket_name, object_name=None):
    if object_name is None:
        object_name = file_path

    content_type = mimetypes.guess_type(file_path)[0] or 'application/octet-stream'
    s3_client = boto3.client('s3')

    try:
        s3_client.upload_file(
            file_path, 
            bucket_name, 
            object_name,
            ExtraArgs={'ContentType': content_type}
        )
        return True
    except FileNotFoundError:
        print("The file was not found")
        return False
    except NoCredentialsError:
        print("Credentials not available")
        return False
\`\`\``
  },
  {
    title: "JWT Token Generator",
    type: "skill",
    description: "Node.js script to generate and sign JSON Web Tokens for API authentication.",
    tags_array: ["node", "security", "auth", "jwt"],
    markdown_content: `\`\`\`javascript
const jwt = require('jsonwebtoken');

function generateAuthToken(userId, role = 'user') {
  const payload = {
    sub: userId,
    role: role,
    iat: Math.floor(Date.now() / 1000)
  };

  // Sign token valid for 24 hours
  const token = jwt.sign(
    payload, 
    process.env.JWT_SECRET, 
    { expiresIn: '24h' }
  );

  return token;
}
\`\`\``
  },
  {
    title: "CSV to JSON Processor",
    type: "skill",
    description: "Memory-efficient Python script using pandas to convert massive CSV files into nested JSON arrays.",
    tags_array: ["python", "data", "pandas", "csv"],
    markdown_content: `\`\`\`python
import pandas as pd
import json

def csv_to_json(csv_filepath, json_filepath):
    # Read chunked to handle large files
    chunk_size = 10000
    data_frames = []
    
    for chunk in pd.read_csv(csv_filepath, chunksize=chunk_size):
        data_frames.append(chunk)
        
    df = pd.concat(data_frames)
    
    # Write to JSON
    df.to_json(json_filepath, orient='records', indent=4)
    print(f"Successfully converted to {json_filepath}")
\`\`\``
  },
  {
    title: "Express Rate Limiter Middleware",
    type: "skill",
    description: "Node.js Express middleware to prevent API abuse by limiting requests per IP address.",
    tags_array: ["node", "express", "security", "middleware"],
    markdown_content: `\`\`\`javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

module.exports = apiLimiter;
\`\`\``
  },
  {
    title: "PDF Text Extractor",
    type: "skill",
    description: "Python script utilizing PyPDF2 to strip all readable text from a PDF document.",
    tags_array: ["python", "pdf", "parsing"],
    markdown_content: `\`\`\`python
import PyPDF2

def extract_text_from_pdf(pdf_path):
    text_content = []
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text_content.append(page.extract_text())
        return "\\n".join(text_content)
    except Exception as e:
        return str(e)
\`\`\``
  },
  {
    title: "Image Resizer & WebP Converter",
    type: "skill",
    description: "Node.js script using Sharp to resize bulk images and convert them to optimized WebP format.",
    tags_array: ["node", "images", "optimization", "sharp"],
    markdown_content: `\`\`\`javascript
const sharp = require('sharp');
const path = require('path');

async function optimizeImage(inputPath, outputPath, width = 800) {
  try {
    await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log('Image optimized successfully');
  } catch (error) {
    console.error('Error optimizing image:', error);
  }
}
\`\`\``
  },
  {
    title: "Regex Email Extractor",
    type: "skill",
    description: "Python function that scans large blocks of text and extracts all valid email addresses using Regular Expressions.",
    tags_array: ["python", "regex", "data", "parsing"],
    markdown_content: `\`\`\`python
import re

def extract_emails(text):
    # Standard email regex pattern
    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
    
    # Find all matches, deduplicate with set()
    emails = set(re.findall(pattern, text))
    
    return list(emails)
\`\`\``
  },
  {
    title: "GitHub Auto-Committer",
    type: "skill",
    description: "Bash script to stage all changes, accept a commit message argument, and push to the current branch.",
    tags_array: ["bash", "git", "automation", "devops"],
    markdown_content: `\`\`\`bash
#!/bin/bash
# Usage: ./commit.sh "Your commit message here"

if [ -z "$1" ]
then
  echo "Error: No commit message supplied."
  echo "Usage: ./commit.sh \\"Commit message\\""
  exit 1
fi

git add .
git commit -m "$1"
git push origin $(git rev-parse --abbrev-ref HEAD)

echo "Changes pushed successfully!"
\`\`\``
  },

  // ==========================================
  // MCP CONNECTORS (Type: mcp)
  // ==========================================
  {
    title: "Neon Postgres Database MCP",
    type: "mcp",
    description: "Standard Model Context Protocol configuration for safely querying a remote Postgres/Neon database.",
    tags_array: ["database", "sql", "postgres", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "neon_postgres_connector",
  "version": "1.0.0",
  "authentication": {
    "type": "connection_string",
    "env_var": "NEON_DATABASE_URL"
  },
  "permissions": [
    "READ_TABLE_SCHEMA",
    "EXECUTE_SELECT",
    "DENY_DROP",
    "DENY_TRUNCATE"
  ],
  "allowed_tables": ["users", "tools", "workflows"]
}
\`\`\``
  },
  {
    title: "Stripe Billing API Connector",
    type: "mcp",
    description: "MCP configuration enabling agents to read customer subscription status and invoice history.",
    tags_array: ["stripe", "billing", "finance", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "stripe_billing_reader",
  "endpoint": "https://api.stripe.com/v1",
  "authentication": {
    "type": "bearer_token",
    "env_var": "STRIPE_RESTRICTED_KEY"
  },
  "allowed_endpoints": [
    "/v1/customers",
    "/v1/invoices",
    "/v1/subscriptions"
  ],
  "rate_limit": "10_req_per_sec"
}
\`\`\``
  },
  {
    title: "Slack Notification Webhook",
    type: "mcp",
    description: "Allows an agent to post alerts and status updates to a specific Slack channel.",
    tags_array: ["slack", "communication", "notifications", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "slack_webhook_emitter",
  "endpoint": "https://hooks.slack.com/services/...",
  "payload_schema": {
    "text": "string",
    "blocks": "array (optional)"
  },
  "permissions": [
    "SEND_MESSAGE"
  ]
}
\`\`\``
  },
  {
    title: "GitHub Issue Manager",
    type: "mcp",
    description: "Connects to GitHub to allow agents to read issue threads, label bugs, and close resolved tickets.",
    tags_array: ["github", "project-management", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "github_repo_manager",
  "authentication": {
    "type": "personal_access_token",
    "env_var": "GITHUB_PAT"
  },
  "repository": "owner/repo_name",
  "capabilities": [
    "READ_ISSUES",
    "WRITE_COMMENTS",
    "UPDATE_LABELS",
    "CLOSE_ISSUES"
  ]
}
\`\`\``
  },
  {
    title: "Google Drive File Reader",
    type: "mcp",
    description: "Enables agents to search for and read the contents of Google Docs and Sheets.",
    tags_array: ["google-drive", "documents", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "gdrive_document_reader",
  "oauth_scopes": [
    "https://www.googleapis.com/auth/drive.readonly"
  ],
  "capabilities": [
    "SEARCH_FILES",
    "EXPORT_DOC_AS_TEXT",
    "EXPORT_SHEET_AS_CSV"
  ],
  "max_file_size_mb": 10
}
\`\`\``
  },
  {
    title: "Linear Ticket Creator",
    type: "mcp",
    description: "Connects to Linear app to allow agents to instantly log bugs and assign them to developers.",
    tags_array: ["linear", "bug-tracking", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "linear_graphql_connector",
  "endpoint": "https://api.linear.app/graphql",
  "authentication": {
    "type": "api_key",
    "env_var": "LINEAR_API_KEY"
  },
  "default_team_id": "TEAM-123",
  "allowed_mutations": [
    "issueCreate",
    "issueUpdate"
  ]
}
\`\`\``
  },
  {
    title: "Notion Database Synchronizer",
    type: "mcp",
    description: "Allows an agent to read rows from a Notion database and format them as JSON context.",
    tags_array: ["notion", "productivity", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "notion_workspace_reader",
  "authentication": {
    "type": "internal_integration_token",
    "env_var": "NOTION_SECRET"
  },
  "target_database_id": "DATABASE_UUID",
  "capabilities": [
    "QUERY_DATABASE",
    "READ_BLOCK_CHILDREN"
  ]
}
\`\`\``
  },
  {
    title: "AWS S3 Bucket Explorer",
    type: "mcp",
    description: "MCP tool allowing agents to list S3 bucket contents and retrieve text/log files.",
    tags_array: ["aws", "s3", "cloud", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "aws_s3_explorer",
  "region": "us-east-1",
  "authentication": {
    "type": "iam_role_assumption",
    "role_arn": "arn:aws:iam::1234567890:role/AgentRole"
  },
  "allowed_buckets": ["app-production-logs", "agent-temp-storage"],
  "capabilities": [
    "LIST_OBJECTS",
    "GET_OBJECT_TEXT"
  ]
}
\`\`\``
  },
  {
    title: "Discord Bot Webhook API",
    type: "mcp",
    description: "Simple MCP for emitting rich embeds and alerts to a Discord server channel.",
    tags_array: ["discord", "notifications", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "discord_webhook_emitter",
  "authentication": {
    "type": "webhook_url",
    "env_var": "DISCORD_WEBHOOK_URL"
  },
  "features": [
    "SEND_TEXT",
    "SEND_EMBEDS"
  ],
  "rate_limit": "5_req_per_5_sec"
}
\`\`\``
  },
  {
    title: "SendGrid Email Dispatcher",
    type: "mcp",
    description: "Allows an agent to send transactional emails (like alerts or summaries) via SendGrid.",
    tags_array: ["email", "sendgrid", "communications", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "sendgrid_mail_dispatcher",
  "endpoint": "https://api.sendgrid.com/v3/mail/send",
  "authentication": {
    "type": "bearer_token",
    "env_var": "SENDGRID_API_KEY"
  },
  "restrictions": {
    "allowed_from_address": "agent@yourdomain.com",
    "max_emails_per_run": 10
  }
}
\`\`\``
  },
  
  // ==========================================
  // BATCH 1: PROMPTS
  // ==========================================
  {
    title: "Code Refactoring Specialist",
    type: "prompt",
    description: "Expert at taking messy, imperative code and refactoring it into clean, declarative, and DRY functional components.",
    tags_array: ["refactoring", "clean-code", "optimization", "react"],
    markdown_content: `# System Prompt: Refactoring Specialist
You are an expert software architect obsessed with clean code.
When provided with a code block:
1. Identify code smells (duplication, deep nesting, huge functions).
2. Rewrite the code using DRY principles and declarative patterns.
3. Provide a bulleted list explaining *why* your refactored version is better for memory and maintainability.`
  },
  {
    title: "Technical Documentation Writer",
    type: "prompt",
    description: "Transforms raw code files into beautiful, standardized GitHub READMEs and API documentation.",
    tags_array: ["documentation", "writing", "markdown", "github"],
    markdown_content: `# System Prompt: Lead Technical Writer
Your job is to read raw code and output flawless Markdown documentation.
Always include:
- A clear, concise H1 Title and description.
- An "Installation" step-by-step guide.
- An "Usage" section with code examples.
- An "API Reference" table detailing parameters and return types.`
  },
  {
    title: "Python Data Scientist",
    type: "prompt",
    description: "Persona optimized for handling Pandas DataFrames, writing Jupyter Notebook blocks, and statistical analysis.",
    tags_array: ["python", "data-science", "pandas", "analytics"],
    markdown_content: `# System Prompt: Data Scientist
You are a senior data scientist. I will provide raw CSV data or data structures.
Your goal is to write Python code using \`pandas\` and \`matplotlib\`/\`seaborn\` to analyze this data.
Always prioritize vectorized operations over loops for performance. Explain your statistical reasoning.`
  },
  {
    title: "Cloud Infrastructure Consultant",
    type: "prompt",
    description: "Focuses on designing serverless AWS architectures and providing cost-optimization strategies.",
    tags_array: ["aws", "cloud", "architecture", "devops"],
    markdown_content: `# System Prompt: AWS Solutions Architect
You design highly available, scalable, and cost-effective cloud architectures.
When asked for a solution, default to serverless (Lambda, DynamoDB, API Gateway) unless requested otherwise.
Always provide a brief cost-analysis estimation for your proposed architecture.`
  },
  {
    title: "Ethical Red Team Hacker",
    type: "prompt",
    description: "Generates harmless penetration testing payloads to test input sanitization and system boundaries.",
    tags_array: ["security", "pentesting", "hacking", "cybersecurity"],
    markdown_content: `# System Prompt: Red Team Operator
You are an authorized penetration tester. I will provide you with API endpoints or HTML forms from my own authorized servers.
Generate safe, non-destructive payloads (like harmless XSS alerts or basic SQL time-delays) to test if my input sanitization is working properly. Explain the attack vector.`
  },
  {
    title: "Unity Game Developer Persona",
    type: "prompt",
    description: "Specializes in C# scripting for Unity, physics optimizations, and game loop architecture.",
    tags_array: ["gamedev", "unity", "c#", "game-design"],
    markdown_content: `# System Prompt: Senior Gameplay Programmer
You write C# for the Unity Engine. 
- Always avoid using \`Update()\` if a Coroutine or Event-driven approach works better.
- Optimize for garbage collection (avoid creating new objects in loops).
- When providing scripts, ensure variables are properly exposed to the Inspector using \`[SerializeField]\`.`
  },
  {
    title: "De-escalation Support Bot",
    type: "prompt",
    description: "An incredibly polite, empathetic persona designed to handle angry customer tickets and write refund policies.",
    tags_array: ["customer-support", "empathy", "communication"],
    markdown_content: `# System Prompt: Tier 3 Support Escalation
You are handling frustrated customers. 
Rule 1: Always validate their frustration immediately.
Rule 2: Never use robotic corporate speak; use warm, human language.
Rule 3: Provide a clear, actionable solution or timeline in the very first paragraph.`
  },

  // ==========================================
  // BATCH 1: SKILLS
  // ==========================================
  {
    title: "Puppeteer PDF Generator",
    type: "skill",
    description: "Node script that boots a headless browser, navigates to a URL, and prints a styled A4 PDF.",
    tags_array: ["node", "puppeteer", "pdf", "automation"],
    markdown_content: `\`\`\`javascript
const puppeteer = require('puppeteer');

async function generatePDF(url, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Wait for network to be idle to ensure styles load
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
  });

  await browser.close();
  console.log(\`PDF saved to \${outputPath}\`);
}
\`\`\``
  },
  {
    title: "YouTube Audio Downloader",
    type: "skill",
    description: "Python script utilizing yt-dlp to extract the highest quality audio track from a YouTube video.",
    tags_array: ["python", "youtube", "audio", "scraping"],
    markdown_content: `\`\`\`python
import yt_dlp

def download_audio(video_url):
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': '%(title)s.%(ext)s',
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])
        print("Audio download complete!")
\`\`\``
  },
  {
    title: "GitHub Repo Analyzer",
    type: "skill",
    description: "Script that traverses a local directory, counting lines of code and grouping them by file extension.",
    tags_array: ["python", "analytics", "git", "files"],
    markdown_content: `\`\`\`python
import os
from collections import defaultdict

def analyze_repo(directory_path):
    stats = defaultdict(int)
    
    for root, _, files in os.walk(directory_path):
        for file in files:
            ext = file.split('.')[-1] if '.' in file else 'no_extension'
            file_path = os.path.join(root, file)
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    stats[ext] += sum(1 for line in f)
            except:
                pass # Skip binary files
                
    return dict(stats)
\`\`\``
  },
  {
    title: "S3 Image Watermarker",
    type: "skill",
    description: "Node.js function that downloads an image from S3, overlays a watermark using Sharp, and re-uploads it.",
    tags_array: ["node", "aws", "images", "sharp"],
    markdown_content: `\`\`\`javascript
const sharp = require('sharp');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

async function watermarkImage(bucket, key, watermarkPath) {
  const original = await s3.getObject({ Bucket: bucket, Key: key }).promise();
  
  const watermarkedBuffer = await sharp(original.Body)
    .composite([{ input: watermarkPath, gravity: 'southeast' }])
    .toBuffer();
    
  await s3.putObject({
    Bucket: bucket,
    Key: \`watermarked-\${key}\`,
    Body: watermarkedBuffer,
    ContentType: 'image/jpeg'
  }).promise();
}
\`\`\``
  },
  {
    title: "Markdown Table of Contents",
    type: "skill",
    description: "JavaScript regex utility that parses a markdown string and automatically generates a linked ToC.",
    tags_array: ["javascript", "regex", "markdown", "utility"],
    markdown_content: `\`\`\`javascript
function generateTOC(markdown) {
  const headingRegex = /^(#{2,6})\\s+(.+)$/gm;
  let toc = "## Table of Contents\\n\\n";
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length - 2; // H2 is level 0
    const text = match[2];
    const link = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const indent = '  '.repeat(level);
    toc += \`\${indent}- [\${text}](#\${link})\\n\`;
  }
  
  return toc + "\\n---\\n\\n" + markdown;
}
\`\`\``
  },
  {
    title: "Stripe Webhook Handler",
    type: "skill",
    description: "Express route ready to securely catch and verify Stripe subscription lifecycle events.",
    tags_array: ["node", "express", "stripe", "payments"],
    markdown_content: `\`\`\`javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const router = express.Router();

router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(\`Webhook Error: \${err.message}\`);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    // Handle database update here
    console.log(\`Sub \${subscription.id} canceled.\`);
  }

  res.json({received: true});
});
\`\`\``
  },
  {
    title: "SQL Dummy Data Generator",
    type: "skill",
    description: "Python script utilizing the Faker library to generate thousands of realistic SQL insert statements.",
    tags_array: ["python", "sql", "testing", "database"],
    markdown_content: `\`\`\`python
from faker import Faker
fake = Faker()

def generate_users_sql(num_records):
    sql_statements = []
    for _ in range(num_records):
        name = fake.name().replace("'", "''")
        email = fake.email()
        stmt = f"INSERT INTO users (name, email) VALUES ('{name}', '{email}');"
        sql_statements.append(stmt)
        
    return "\\n".join(sql_statements)

# print(generate_users_sql(100))
\`\`\``
  },

  // ==========================================
  // BATCH 1: MCP CONNECTORS
  // ==========================================
  {
    title: "JIRA Ticket Manager",
    type: "mcp",
    description: "MCP configuration enabling an agent to read sprint boards, comment on tickets, and transition issue states.",
    tags_array: ["jira", "agile", "project-management", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "jira_agile_connector",
  "endpoint": "https://your-domain.atlassian.net/rest/api/3",
  "authentication": {
    "type": "basic_auth",
    "username_env": "JIRA_EMAIL",
    "token_env": "JIRA_API_TOKEN"
  },
  "capabilities": [
    "READ_ACTIVE_SPRINT",
    "TRANSITION_ISSUE",
    "ADD_COMMENT"
  ]
}
\`\`\``
  },
  {
    title: "Shopify Inventory API",
    type: "mcp",
    description: "Allows an AI agent to check stock levels and update product variant pricing on a Shopify store.",
    tags_array: ["shopify", "ecommerce", "inventory", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "shopify_admin_graphql",
  "endpoint": "https://{shop}.myshopify.com/admin/api/2024-01/graphql.json",
  "authentication": {
    "type": "custom_header",
    "header_name": "X-Shopify-Access-Token",
    "env_var": "SHOPIFY_ADMIN_TOKEN"
  },
  "allowed_mutations": [
    "inventoryAdjustQuantity",
    "productVariantUpdate"
  ]
}
\`\`\``
  },
  {
    title: "Google Calendar Scheduler",
    type: "mcp",
    description: "Grants an agent the ability to check user availability and book new calendar events.",
    tags_array: ["google", "calendar", "productivity", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "gcal_event_manager",
  "oauth_scopes": [
    "https://www.googleapis.com/auth/calendar.events"
  ],
  "capabilities": [
    "FREEBUSY_QUERY",
    "INSERT_EVENT",
    "DELETE_EVENT"
  ],
  "timezone_enforcement": "UTC"
}
\`\`\``
  },
  {
    title: "MongoDB Aggregation Connector",
    type: "mcp",
    description: "MCP tool allowing agents to run complex read-only aggregation pipelines on a NoSQL database.",
    tags_array: ["mongodb", "nosql", "database", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "mongo_aggregation_reader",
  "connection_string_env": "MONGO_URI",
  "permissions": [
    "EXECUTE_AGGREGATE",
    "EXECUTE_FIND",
    "DENY_INSERT",
    "DENY_UPDATE",
    "DENY_DELETE"
  ],
  "max_scan_documents": 100000
}
\`\`\``
  },
  {
    title: "Twitter/X Auto-Poster",
    type: "mcp",
    description: "Simple MCP for allowing an autonomous agent to post tweets or threads to an authenticated account.",
    tags_array: ["twitter", "social-media", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "x_api_v2_poster",
  "endpoint": "https://api.twitter.com/2/tweets",
  "authentication": {
    "type": "oauth_1.0a",
    "keys_env_prefix": "TWITTER_"
  },
  "rate_limit": "50_tweets_per_24h",
  "capabilities": ["CREATE_TWEET", "CREATE_THREAD"]
}
\`\`\``
  },
  {
    title: "Snowflake Data Warehouse",
    type: "mcp",
    description: "Enterprise connector for AI agents to query massive analytics datasets using Snowflake SQL.",
    tags_array: ["snowflake", "analytics", "data", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "snowflake_sql_runner",
  "account_identifier_env": "SNOWFLAKE_ACCOUNT",
  "authentication": {
    "type": "key_pair",
    "private_key_env": "SNOWFLAKE_PK"
  },
  "warehouse": "COMPUTE_WH",
  "timeout_seconds": 120,
  "allowed_schemas": ["PUBLIC_ANALYTICS"]
}
\`\`\``
  },

  // ==========================================
  // BATCH 2: PROMPTS (7 New)
  // ==========================================
  {
    title: "Legal Contract Analyzer",
    type: "prompt",
    description: "Analyzes legal text for loopholes, liability risks, and non-standard clauses.",
    tags_array: ["legal", "analysis", "review"],
    markdown_content: `# System Prompt: Senior Paralegal & Risk Assessor
You are a highly detail-oriented legal assistant. When provided with a contract or Terms of Service snippet:
1. Identify any clauses that disproportionately shift liability to the user.
2. Flag ambiguous language that could be interpreted in multiple ways.
3. Suggest standard boilerplate replacements for risky clauses.
*Disclaimer: Remind the user this is not formal legal advice.*`
  },
  {
    title: "SaaS Landing Page Copywriter",
    type: "prompt",
    description: "Generates high-converting, benefit-driven copy for software product landing pages.",
    tags_array: ["marketing", "copywriting", "saas", "sales"],
    markdown_content: `# System Prompt: SaaS Conversion Copywriter
Your goal is to write copy that converts visitors into paying users. 
Follow the AIDA framework (Attention, Interest, Desire, Action).
- Hero Section: Needs a punchy H1 and a subheadline resolving a specific pain point.
- Features: Translate technical features into clear emotional benefits.
- CTA: Create urgency without sounding desperate.`
  },
  {
    title: "Rust Performance Optimizer",
    type: "prompt",
    description: "Expert in Rust memory management, lifetimes, and multithreading optimizations.",
    tags_array: ["rust", "performance", "systems-programming"],
    markdown_content: `# System Prompt: Rust Senior Engineer
You write blazingly fast, memory-safe Rust code.
When reviewing code:
1. Identify unnecessary clones and allocations.
2. Suggest ways to leverage zero-cost abstractions.
3. Check for potential deadlocks in mutexes/multithreading scenarios.
Always explain the 'why' behind lifetime and borrow checker errors.`
  },
  {
    title: "UX Researcher Persona",
    type: "prompt",
    description: "Simulates user interviews and creates detailed user personas based on product descriptions.",
    tags_array: ["ux", "design", "research", "personas"],
    markdown_content: `# System Prompt: Lead UX Researcher
Given a product idea, generate 3 distinct user personas. For each, include:
- Demographics (Age, Occupation, Tech Literacy)
- Primary pain points related to the product's niche.
- The 'Job to be Done' (What are they ultimately trying to achieve?)
Then, generate a list of 5 open-ended interview questions to validate these assumptions.`
  },
  {
    title: "Bash Automation Guru",
    type: "prompt",
    description: "Writes advanced, POSIX-compliant shell scripts for DevOps and system administration.",
    tags_array: ["bash", "devops", "linux", "scripting"],
    markdown_content: `# System Prompt: Unix Systems Admin
You write robust, portable bash scripts.
Strict rules:
1. Always use \`set -euo pipefail\` at the top of the script.
2. Provide informative error messages to stderr.
3. Use modern bash parameter expansions instead of external tools like awk/sed when appropriate.
4. Comment complex regex or grep operations.`
  },
  {
    title: "Social Media Crisis Manager",
    type: "prompt",
    description: "Drafts PR apologies and mitigation strategies for brand crises.",
    tags_array: ["pr", "communication", "social-media", "crisis"],
    markdown_content: `# System Prompt: Crisis PR Manager
You are tasked with mitigating a public relations disaster.
When provided with a scenario:
1. Draft a concise, empathetic public statement that takes accountability. 
2. Avoid defensive language or corporate non-apologies (e.g., 'we are sorry if you felt...').
3. Outline a 3-step internal action plan to prevent the issue from recurring.`
  },
  {
    title: "GraphQL Schema Architect",
    type: "prompt",
    description: "Designs scalable graph data models, preventing N+1 query problems.",
    tags_array: ["graphql", "api", "architecture", "backend"],
    markdown_content: `# System Prompt: GraphQL Architect
You design efficient and scalable GraphQL schemas.
When defining types:
- Use clear, domain-driven naming conventions.
- Provide DataLoader strategies to avoid the N+1 problem on nested queries.
- Include necessary pagination arguments (first, after) for array fields using the Relay spec.`
  },

  // ==========================================
  // BATCH 2: SKILLS (7 New)
  // ==========================================
  {
    title: "FFmpeg Video Compressor",
    type: "skill",
    description: "Node.js wrapper script using fluent-ffmpeg to compress MP4 videos for web delivery.",
    tags_array: ["node", "video", "ffmpeg", "optimization"],
    markdown_content: `\`\`\`javascript
const ffmpeg = require('fluent-ffmpeg');

function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .size('1280x720')
      .outputOptions(['-crf 28', '-preset veryfast'])
      .on('end', () => resolve('Compression complete'))
      .on('error', (err) => reject(err))
      .save(outputPath);
  });
}
\`\`\``
  },
  {
    title: "OpenAI Embedding Generator",
    type: "skill",
    description: "Python script to batch convert text arrays into vector embeddings using the OpenAI API.",
    tags_array: ["python", "ai", "embeddings", "vector"],
    markdown_content: `\`\`\`python
from openai import OpenAI
import os

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def get_embeddings(texts, model="text-embedding-3-small"):
    texts = [text.replace("\\n", " ") for text in texts]
    response = client.embeddings.create(input=texts, model=model)
    
    # Returns a list of embedding vectors
    return [data.embedding for data in response.data]
\`\`\``
  },
  {
    title: "Redis Cache Wrapper",
    type: "skill",
    description: "Node.js utility for caching expensive API or Database queries with a Time-To-Live (TTL).",
    tags_array: ["node", "redis", "caching", "performance"],
    markdown_content: `\`\`\`javascript
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

async function fetchWithCache(key, ttlSeconds, fetchFunction) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const freshData = await fetchFunction();
  await redis.setex(key, ttlSeconds, JSON.stringify(freshData));
  
  return freshData;
}
\`\`\``
  },
  {
    title: "Excel Report Generator",
    type: "skill",
    description: "Python pandas script to export structured JSON data into a formatted XLSX file.",
    tags_array: ["python", "data", "excel", "reporting"],
    markdown_content: `\`\`\`python
import pandas as pd

def json_to_excel(json_data, output_filepath):
    # json_data should be a list of dictionaries
    df = pd.DataFrame(json_data)
    
    # Create a Pandas Excel writer using XlsxWriter
    with pd.ExcelWriter(output_filepath, engine='xlsxwriter') as writer:
        df.to_excel(writer, sheet_name='Report', index=False)
        
        # Auto-adjust column widths
        worksheet = writer.sheets['Report']
        for i, col in enumerate(df.columns):
            max_len = max(df[col].astype(str).map(len).max(), len(col)) + 2
            worksheet.set_column(i, i, max_len)
\`\`\``
  },
  {
    title: "Cron Job Scheduler",
    type: "skill",
    description: "Node.js implementation using node-cron to execute repeating background tasks.",
    tags_array: ["node", "automation", "cron", "backend"],
    markdown_content: `\`\`\`javascript
const cron = require('node-cron');

// Runs every day at midnight (0 0 * * *)
const dailyTask = cron.schedule('0 0 * * *', async () => {
  console.log('Running daily database cleanup...');
  try {
    // Await cleanup function here
    console.log('Cleanup successful.');
  } catch (err) {
    console.error('Task failed:', err);
  }
}, {
  scheduled: true,
  timezone: "America/New_York"
});

dailyTask.start();
\`\`\``
  },
  {
    title: "Twilio SMS Dispatcher",
    type: "skill",
    description: "Sends automated text messages for alerts or 2FA using the Twilio Node.js SDK.",
    tags_array: ["node", "communications", "sms", "twilio"],
    markdown_content: `\`\`\`javascript
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendSMS(toPhoneNumber, messageBody) {
  try {
    const message = await client.messages.create({
      body: messageBody,
      to: toPhoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER, 
    });
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error("SMS failed to send:", error);
    return { success: false, error: error.message };
  }
}
\`\`\``
  },
  {
    title: "Web Socket Chat Server",
    type: "skill",
    description: "Basic Socket.io implementation on top of Express for real-time bidirectional communication.",
    tags_array: ["node", "express", "websockets", "realtime"],
    markdown_content: `\`\`\`javascript
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('chat_message', (msg) => {
    // Broadcast to all connected clients
    io.emit('chat_message', { user: socket.id, text: msg });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// server.listen(3000);
\`\`\``
  },

  // ==========================================
  // BATCH 2: MCP CONNECTORS (7 New)
  // ==========================================
  {
    title: "Zendesk Support Desk",
    type: "mcp",
    description: "Enables an AI agent to read unassigned customer support tickets and draft suggested responses.",
    tags_array: ["zendesk", "customer-support", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "zendesk_ticketing_api",
  "endpoint": "https://{subdomain}.zendesk.com/api/v2",
  "authentication": {
    "type": "basic",
    "env_var": "ZENDESK_API_TOKEN"
  },
  "capabilities": [
    "LIST_OPEN_TICKETS",
    "READ_TICKET_COMMENTS",
    "ADD_INTERNAL_NOTE"
  ]
}
\`\`\``
  },
  {
    title: "Figma Design API",
    type: "mcp",
    description: "Allows an agent to extract CSS values, typography, and text strings directly from a Figma node.",
    tags_array: ["figma", "design", "frontend", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "figma_node_inspector",
  "endpoint": "https://api.figma.com/v1/files/",
  "authentication": {
    "type": "custom_header",
    "header_name": "X-Figma-Token",
    "env_var": "FIGMA_PAT"
  },
  "permissions": [
    "READ_NODE_GEOMETRY",
    "EXTRACT_CSS",
    "EXTRACT_TEXT"
  ]
}
\`\`\``
  },
  {
    title: "Salesforce CRM Connector",
    type: "mcp",
    description: "Enterprise connector for querying leads, updating contact records, and logging sales calls.",
    tags_array: ["salesforce", "crm", "sales", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "salesforce_rest_api",
  "authentication": {
    "type": "oauth2",
    "client_id_env": "SF_CLIENT_ID",
    "client_secret_env": "SF_CLIENT_SECRET"
  },
  "allowed_objects": ["Lead", "Contact", "Opportunity"],
  "rate_limit_policy": "STRICT"
}
\`\`\``
  },
  {
    title: "Twitch IRC Chat Reader",
    type: "mcp",
    description: "Connects to a live Twitch stream chat for real-time sentiment analysis and moderation flagging.",
    tags_array: ["twitch", "streaming", "chat", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "twitch_irc_websocket",
  "connection": "wss://irc-ws.chat.twitch.tv:443",
  "authentication": {
    "type": "oauth",
    "env_var": "TWITCH_OAUTH_TOKEN"
  },
  "target_channel_env": "TWITCH_CHANNEL",
  "capabilities": [
    "READ_CHAT_MESSAGES",
    "READ_BITS_EVENTS"
  ]
}
\`\`\``
  },
  {
    title: "Datadog Metrics Explorer",
    type: "mcp",
    description: "Fetches infrastructure alerts, APM logs, and server health status for autonomous devops agents.",
    tags_array: ["datadog", "devops", "monitoring", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "datadog_metrics_api",
  "endpoint": "https://api.datadoghq.com/api/v1",
  "authentication": {
    "api_key_env": "DD_API_KEY",
    "app_key_env": "DD_APP_KEY"
  },
  "capabilities": [
    "QUERY_TIMESERIES",
    "LIST_ACTIVE_ALERTS",
    "READ_APM_TRACES"
  ]
}
\`\`\``
  },
  {
    title: "HubSpot Marketing Hub",
    type: "mcp",
    description: "Reads email campaign stats, open rates, and manages marketing contact lists.",
    tags_array: ["hubspot", "marketing", "crm", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "hubspot_marketing_api",
  "authentication": {
    "type": "private_app_token",
    "env_var": "HUBSPOT_PAT"
  },
  "scopes_required": [
    "crm.objects.contacts.read",
    "marketing.campaigns.read"
  ],
  "capabilities": [
    "GET_CAMPAIGN_METRICS",
    "SEARCH_CONTACTS"
  ]
}
\`\`\``
  },
  {
    title: "Trello Board Manager",
    type: "mcp",
    description: "Allows an agent to move cards between lists, add checklists, and mark tasks as complete.",
    tags_array: ["trello", "project-management", "agile", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "trello_rest_api",
  "authentication": {
    "type": "query_params",
    "api_key_env": "TRELLO_API_KEY",
    "token_env": "TRELLO_TOKEN"
  },
  "target_board_id_env": "TRELLO_BOARD_ID",
  "allowed_actions": [
    "MOVE_CARD",
    "ADD_COMMENT",
    "CREATE_CHECKLIST_ITEM"
  ]
}
\`\`\``
  }
,
  {
    title: "Technical Mock Interviewer",
    type: "prompt",
    description: "Acts as a strict FAANG engineering interviewer asking algorithmic questions and critiquing Big-O complexity.",
    tags_array: ["interview", "career", "coding", "algorithms"],
    markdown_content: `# System Prompt: FAANG Technical Interviewer
We are doing a mock coding interview.
1. Present a medium-to-hard LeetCode style question. Do not provide the answer.
2. Wait for my solution.
3. Critique my solution based on Time Complexity (Big O) and Space Complexity.
4. Ask a follow-up question on how to scale the solution for a distributed system.`
  },
  {
    title: "CI/CD Pipeline Strategist",
    type: "prompt",
    description: "Designs robust GitHub Actions and GitLab CI yaml files for automated testing and deployment.",
    tags_array: ["devops", "ci-cd", "automation", "github-actions"],
    markdown_content: `# System Prompt: DevOps CI/CD Engineer
Your goal is to write secure, efficient CI/CD pipelines.
- Cache dependencies to speed up build times.
- Ensure secrets are handled securely via environment contexts.
- Include a linting job, a testing job, and a conditional deployment job that only triggers on pushes to the \`main\` branch.`
  },
  {
    title: "Startup Pitch Deck Writer",
    type: "prompt",
    description: "Formats business concepts into compelling, concise slide outlines for Angel/VC fundraising.",
    tags_array: ["startup", "business", "fundraising", "writing"],
    markdown_content: `# System Prompt: VC Pitch Strategist
Transform my business idea into a 10-slide pitch deck outline.
For each slide, provide the Headline and 3 key bullet points.
Required slides: 
1. The Problem 2. The Solution 3. Market Size (TAM/SAM/SOM) 4. Business Model 5. Traction 6. The Ask.
Keep the tone confident, data-driven, and concise.`
  },
  {
    title: "Tabletop RPG Dungeon Master",
    type: "prompt",
    description: "An improvisational worldbuilder that guides users through interactive, text-based fantasy campaigns.",
    tags_array: ["gaming", "tabletop", "rpg", "creative"],
    markdown_content: `# System Prompt: Master Dungeon Master
Let's play a text-based RPG. 
Describe the environment vividly engaging the 5 senses. 
Present a scenario, then ask: "What do you do?"
Evaluate my actions, introduce RNG (random chance) to outcomes, and track my inventory/health invisibly. Maintain a high fantasy tone.`
  },
  {
    title: "Golang Microservice Router",
    type: "skill",
    description: "Bare-metal Go HTTP server utilizing the standard library 1.22+ routing features.",
    tags_array: ["go", "backend", "api", "microservice"],
    markdown_content: `\`\`\`go
package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	// Go 1.22+ supports method and wildcard routing natively
	mux.HandleFunc("GET /api/users/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "success", "userId": id})
	})

	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
\`\`\``
  },
  {
    title: "IP Geolocation Lookup",
    type: "skill",
    description: "Node.js utility to fetch geographic data (City, Country, ISP) from an IP address using an external API.",
    tags_array: ["node", "network", "api", "data"],
    markdown_content: `\`\`\`javascript
async function getIpInfo(ipAddress) {
  try {
    // Using ip-api for free non-commercial geolocation
    const response = await fetch(\`http://ip-api.com/json/\${ipAddress}\`);
    const data = await response.json();
    
    if (data.status === "fail") {
      throw new Error(data.message);
    }
    
    return {
      country: data.country,
      city: data.city,
      isp: data.isp,
      lat: data.lat,
      lon: data.lon
    };
  } catch (error) {
    console.error("IP Lookup failed:", error.message);
    return null;
  }
}
\`\`\``
  },
  {
    title: "Crypto Price Fetcher",
    type: "skill",
    description: "Python script that hits the CoinGecko API to return real-time cryptocurrency prices and 24h change.",
    tags_array: ["python", "crypto", "data", "finance"],
    markdown_content: `\`\`\`python
import requests

def get_crypto_prices(coin_ids=["bitcoin", "ethereum"]):
    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {
        "ids": ",".join(coin_ids),
        "vs_currencies": "usd",
        "include_24hr_change": "true"
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

# Example: print(get_crypto_prices(['bitcoin', 'solana']))
\`\`\``
  },
  {
    title: "AWS Lambda Zipper",
    type: "skill",
    description: "Python automation script using Boto3 to zip a local directory and deploy it directly to an AWS Lambda function.",
    tags_array: ["python", "aws", "lambda", "automation"],
    markdown_content: `\`\`\`python
import boto3
import shutil
import os

def deploy_to_lambda(function_name, source_dir):
    zip_path = shutil.make_archive("lambda_deployment", 'zip', source_dir)
    
    client = boto3.client('lambda')
    
    try:
        with open(zip_path, 'rb') as f:
            zipped_code = f.read()
            
        response = client.update_function_code(
            FunctionName=function_name,
            ZipFile=zipped_code
        )
        print(f"Successfully updated {function_name}")
    except Exception as e:
        print(f"Deployment failed: {e}")
    finally:
        os.remove(zip_path)
\`\`\``
  },
  {
    title: "SQLite In-Memory Tester",
    type: "skill",
    description: "Python Pytest setup fixture that creates an ephemeral SQLite database for lightning-fast unit tests.",
    tags_array: ["python", "sql", "testing", "database"],
    markdown_content: `\`\`\`python
import sqlite3
import pytest

@pytest.fixture
def db_connection():
    # Creates an in-memory database that is destroyed after the test
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Setup dummy table
    cursor.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)")
    conn.commit()
    
    yield conn  # Provide connection to the test
    
    # Teardown
    conn.close()

def test_user_insert(db_connection):
    cursor = db_connection.cursor()
    cursor.execute("INSERT INTO users (name) VALUES ('Alice')")
    db_connection.commit()
    
    cursor.execute("SELECT name FROM users WHERE id=1")
    assert cursor.fetchone()[0] == 'Alice'
\`\`\``
  },
  {
    title: "Rust WebAssembly Setup",
    type: "skill",
    description: "Basic Rust `lib.rs` configured with `wasm-bindgen` to compile high-performance functions for frontend JS.",
    tags_array: ["rust", "wasm", "frontend", "performance"],
    markdown_content: `\`\`\`rust
use wasm_bindgen::prelude::*;

// When the \`wee_alloc\` feature is enabled, use it as the global allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn fast_fibonacci(n: u32) -> u32 {
    if n <= 1 {
        return n;
    }
    let mut a = 0;
    let mut b = 1;
    for _ in 2..=n {
        let temp = a + b;
        a = b;
        b = temp;
    }
    b
}
\`\`\``
  },
  {
    title: "HTML to PDF Buffer",
    type: "skill",
    description: "Node.js utility using `html-pdf-node` to generate a PDF buffer directly from an HTML string without saving to disk.",
    tags_array: ["node", "pdf", "html", "utility"],
    markdown_content: `\`\`\`javascript
const html_to_pdf = require('html-pdf-node');

async function createPDFBuffer(htmlString) {
  let options = { format: 'A4', margin: { top: "20px", bottom: "20px" } };
  let file = { content: htmlString };

  try {
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    return pdfBuffer;
  } catch (err) {
    console.error("PDF Generation Error: ", err);
    throw err;
  }
}
\`\`\``
  },
  {
    title: "Zoom Meeting Manager",
    type: "mcp",
    description: "Enables an agent to schedule Zoom meetings, generate invite links, and retrieve cloud recordings.",
    tags_array: ["zoom", "communications", "video", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "zoom_s2s_oauth_connector",
  "endpoint": "https://api.zoom.us/v2",
  "authentication": {
    "type": "server_to_server_oauth",
    "account_id_env": "ZOOM_ACCOUNT_ID",
    "client_id_env": "ZOOM_CLIENT_ID",
    "client_secret_env": "ZOOM_CLIENT_SECRET"
  },
  "capabilities": [
    "CREATE_MEETING",
    "GET_MEETING_RECORDINGS",
    "LIST_UPCOMING_MEETINGS"
  ]
}
\`\`\``
  },
  {
    title: "QuickBooks Accounting API",
    type: "mcp",
    description: "Allows an agent to draft invoices, log expenses, and query customer balances in QuickBooks Online.",
    tags_array: ["finance", "quickbooks", "accounting", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "quickbooks_online_api",
  "endpoint": "https://quickbooks.api.intuit.com/v3/company/",
  "authentication": {
    "type": "oauth2",
    "refresh_token_env": "QBO_REFRESH_TOKEN",
    "client_id_env": "QBO_CLIENT_ID"
  },
  "company_id_env": "QBO_REALM_ID",
  "allowed_entities": [
    "Invoice",
    "Customer",
    "Purchase"
  ]
}
\`\`\``
  },
  {
    title: "Mailchimp Audience Manager",
    type: "mcp",
    description: "Connects to Mailchimp to add subscribers, apply tags, and read email campaign performance.",
    tags_array: ["email", "marketing", "mailchimp", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "mailchimp_marketing_api",
  "endpoint": "https://{dc}.api.mailchimp.com/3.0",
  "authentication": {
    "type": "basic_auth",
    "username": "anystring",
    "api_key_env": "MAILCHIMP_API_KEY"
  },
  "default_list_id": "AUDIENCE_LIST_ID",
  "capabilities": [
    "ADD_LIST_MEMBER",
    "ADD_MEMBER_TAGS",
    "GET_CAMPAIGN_REPORT"
  ]
}
\`\`\``
  },
  {
    title: "Google Maps Routing API",
    type: "mcp",
    description: "MCP tool allowing agents to calculate travel distance, ETA, and optimal waypoints for logistics.",
    tags_array: ["maps", "location", "google", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "gcp_maps_routes_api",
  "endpoint": "https://routes.googleapis.com/directions/v2:computeRoutes",
  "authentication": {
    "type": "api_key",
    "header_name": "X-Goog-Api-Key",
    "env_var": "GOOGLE_MAPS_API_KEY"
  },
  "field_mask_header": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
  "rate_limit": "50_req_per_minute"
}
\`\`\``
  },
  {
    title: "Asana Project Tracker",
    type: "mcp",
    description: "Allows an agent to create tasks, assign due dates, and post status updates within an Asana workspace.",
    tags_array: ["asana", "project-management", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "asana_rest_api",
  "endpoint": "https://app.asana.com/api/1.0",
  "authentication": {
    "type": "bearer_token",
    "env_var": "ASANA_PAT"
  },
  "default_workspace_gid": "WORKSPACE_ID",
  "capabilities": [
    "CREATE_TASK",
    "UPDATE_TASK",
    "ADD_PROJECT_COMMENT"
  ]
}
\`\`\``
  },
  {
    title: "WeatherAPI Forecaster",
    type: "mcp",
    description: "Fetches current weather, 7-day forecasts, and historical climate data for global coordinates.",
    tags_array: ["weather", "data", "api", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "weatherapi_data_connector",
  "endpoint": "https://api.weatherapi.com/v1",
  "authentication": {
    "type": "query_param",
    "param_name": "key",
    "env_var": "WEATHER_API_KEY"
  },
  "allowed_endpoints": [
    "/current.json",
    "/forecast.json",
    "/history.json"
  ]
}
\`\`\``
  },
  {
    title: "Spotify Playlist Controller",
    type: "mcp",
    description: "Grants an agent the ability to search for tracks, analyze audio features (BPM, danceability), and build playlists.",
    tags_array: ["music", "spotify", "media", "mcp"],
    markdown_content: `\`\`\`json
{
  "mcp_server": "spotify_web_api",
  "endpoint": "https://api.spotify.com/v1",
  "authentication": {
    "type": "oauth2_client_credentials",
    "client_id_env": "SPOTIFY_CLIENT_ID",
    "client_secret_env": "SPOTIFY_CLIENT_SECRET"
  },
  "capabilities": [
    "SEARCH_ITEM",
    "GET_AUDIO_FEATURES",
    "CREATE_PLAYLIST",
    "ADD_ITEMS_TO_PLAYLIST"
  ]
}
\`\`\``
  }
,
  {
    title: "Agile Product Manager Persona",
    type: "prompt",
    description: "Translates vague feature requests into structured Agile user stories with clear acceptance criteria.",
    tags_array: ["agile", "product-management", "planning", "scrum"],
    markdown_content: `# System Prompt: Lead Product Manager (PM)
You are a highly experienced SaaS Product Manager. When I provide a feature idea:
1. Write a formal User Story: "As a [type of user], I want to [action] so that [benefit]."
2. Define 3-5 strict Acceptance Criteria (Given/When/Then format).
3. Identify edge cases or blockers the engineering team needs to consider before grooming.`
  },
  {
    title: "PyTorch ML Architect",
    type: "prompt",
    description: "Expert in designing neural networks, defining custom loss functions, and optimizing tensor operations.",
    tags_array: ["machine-learning", "python", "ai", "pytorch"],
    markdown_content: `# System Prompt: PyTorch AI Researcher
You specialize in deep learning using PyTorch.
When writing models:
- Always use \`nn.Module\` correctly.
- Provide a clear \`forward()\` pass.
- Suggest the appropriate optimizer and learning rate scheduler.
- Ensure tensor device assignments (.to(device)) are explicitly handled to prevent CPU/GPU mismatch errors.`
  },
  {
    title: "Web3 Smart Contract Auditor",
    type: "prompt",
    description: "Analyzes Solidity code strictly for blockchain exploits like Reentrancy and Integer Overflow.",
    tags_array: ["web3", "solidity", "crypto", "security"],
    markdown_content: `# System Prompt: Lead Smart Contract Auditor
Review the provided Solidity code for critical vulnerabilities. 
Specifically scan for:
- Reentrancy attacks (ensure Checks-Effects-Interactions pattern).
- Flash loan price oracle manipulation.
- Access control flaws (\`tx.origin\` vs \`msg.sender\`).
Provide the exact exploit scenario and the patched code.`
  },
  {
    title: "Senior Android Architect",
    type: "prompt",
    description: "Sets the AI persona to a Senior Android developer and UI architect operating under the RISEN framework.",
    tags_array: ["android", "architecture", "kotlin", "compose"],
    markdown_content: `# System Prompt: Senior Android Architect

You are a Senior Android developer and UI architect operating under the RISEN framework.

## Rules & Constraints:
- EXCLUSIVELY use Kotlin and Jetpack Compose.
- Strictly adhere to MVVM architecture.
- UI components MUST be entirely stateless. Pass lambdas for event bubbling.
- ALL state is owned by the ViewModel and exposed via StateFlow.
- Utilize sealed \`UiState\` classes (e.g., Idle, Loading, Success, Error) to represent mutually exclusive states.
- DO NOT trigger navigation inside the ViewModel. Navigation MUST be triggered from the UI layer reacting to state changes.
- Apply Material Design 3 (Material 3 Expressive) theming, ensuring dark mode compatibility.
- Ensure WCAG 2.1 AA accessibility standards (e.g., minimum touch target size of 48dp, content descriptions for visual elements).

## Execution Expectation:
Never output conversational pleasantries. Return only the requested Kotlin files, appropriately package-scoped.`
  },
  {
    title: "Vibe Coding Intent Clarification Protocol",
    type: "skill",
    description: "An interaction loop that forces the agent to extract concrete specifications from ambiguous 'vibe' requests before writing code.",
    tags_array: ["vibe-coding", "planning", "requirements"],
    markdown_content: `\`\`\`javascript
// Intent Clarification Protocol
function executeIntentClarification(userRequest) {
  const vaguenessScore = analyzeAmbiguity(userRequest);
  if (vaguenessScore > 0.3) {
    return emitQuestionnaire({
      divergentQuestions: generateExploratoryQuestions(userRequest),
      convergentQuestions: generateConstraintQuestions(userRequest),
      haltingCondition: "Awaiting explicit human approval of the generated PRD."
    });
  }
  return initializeSpecDrivenScaffold(userRequest);
}
\`\`\``
  },
  {
    title: "Google Cloud Firestore MCP",
    type: "mcp",
    description: "MCP server configuration to query, write, and manage Firebase Firestore documents directly from the coding agent.",
    tags_array: ["gcp", "mcp", "database", "firebase"],
    markdown_content: `# Google Cloud Firestore MCP

## Tools Provided
- \`get_document\`: Fetch a JSON representation of a document by collection and ID.
- \`query_collection\`: Execute a compound query against a Firestore collection using standard operators.
- \`add_document\`: Safely insert a validated JSON object into a specified collection.
- \`update_document\`: Perform a partial merge update on an existing Firestore document.

## Security Constraints
All destructive actions (\`delete_document\`) require the \`destructiveHint: true\` flag, forcing human confirmation.`
  },
  {
    title: "Synthetic UI/UX Persona Generator",
    type: "prompt",
    description: "Transforms a basic PRD into three distinct UI/UX designer personas with complete design philosophies and token sets for AI agents.",
    tags_array: ["ui-ux", "design", "persona", "figma"],
    markdown_content: `# System Prompt: UI/UX Designer Persona Generator

**Role:** Expert Design Systems Architect.

**Task:** Accept a Product Requirement Document (PRD) or vague app description and generate three distinct designer personas (e.g., Brutalist, Glassmorphic, Neomorphic) to anchor the vibe coding session.

**Output Structure for Each Persona:**
1. **Name & Aesthetic:** (e.g., 'Aria - The Swiss Minimalist')
2. **Design Philosophy:** Core visual rules, target density, and emotional resonance.
3. **Color Palette:** Primary, Secondary, Background, Surface, Error, and Text tokens (in HEX).
4. **Typography:** Font families, weight mapping, and rem/px scaling hierarchy.
5. **Interaction Patterns:** Border radiuses, elevation/shadow variables, and transition timing functions.

**Constraint:** Provide the exact CSS variable blocks or Tailwind configuration objects for immediate copy-pasting into the next agent session.`
  },
  {
    title: "ADB Android Hardware Interactor",
    type: "mcp",
    description: "MCP server allowing the LLM to control an attached Android device or emulator via the Android Debug Bridge.",
    tags_array: ["android", "mcp", "hardware", "adb"],
    markdown_content: `# ADB MCP Server

## Resources Exposed
- \`device_logcat\`: Live streaming resource (via SSE transport) of the Android device logcat, filtered by the current application package.
- \`ui_hierarchy\`: XML dump of the current active screen layout for visual analysis.

## Tools Provided
- \`install_apk\`: Push and install a compiled artifact to the device.
- \`take_screenshot\`: Capture the current device state and load it into the context window for visual evidence validation.
- \`input_tap\`: Send a touch event to absolute X/Y coordinates on the device.
- \`input_text\`: Inject text into focused input fields via ADB shell.`
  },
  {
    title: "Vibe-and-Verify Checkpoint",
    type: "skill",
    description: "Pauses generative output after small code slices to execute linters and test suites, mathematically proving stability before continuing.",
    tags_array: ["verification", "testing", "agent-logic"],
    markdown_content: `\`\`\`python
def vibe_and_verify_checkpoint(generated_ast_slice, context):
    """
    Halts the ReAct loop to ensure code viability.
    """
    write_to_ephemeral_fs(generated_ast_slice)
    
    # 1. Run Type Checker
    type_result = execute_shell("tsc --noEmit")
    if not type_result.success:
        return trigger_chain_of_hindsight(type_result.errors)
        
    # 2. Run Unit Tests
    test_result = execute_shell("jest --findRelatedTests")
    if not test_result.success:
        return trigger_chain_of_hindsight(test_result.errors)
        
    # 3. Commit state for rollback capability
    execute_shell("git commit -am 'checkpoint: verified vertical slice'")
    return continue_generation_loop()
\`\`\``
  },
  {
    title: "Figma Context & Design Extraction MCP",
    type: "mcp",
    description: "Reads design variables, layout data, and component structures directly from Figma via a personal access token.",
    tags_array: ["figma", "mcp", "design-system", "ui-ux"],
    markdown_content: `# Figma Context MCP

## Contextual Resources
- \`figma_file_metadata\`: Retrieves the global variable collections (colors, spacing, radii) for a given Figma file ID.
- \`figma_node_ast\`: Pulls the exact layout tree (auto-layout directions, padding, gaps) for a specific Node ID.

## Tools Provided
- \`export_assets\`: Downloads SVG or PNG assets directly into the agent's local filesystem working directory.
- \`generate_design_diff\`: Compares the implemented local UI code (via AST parsing) against the Figma node structure to ensure 1:1 compliance.`
  },
  {
    title: "Feature Flag Injector",
    type: "skill",
    description: "Automatically wraps experimental AI-hallucinated logic blocks in configurable feature toggles to prevent mainline corruption.",
    tags_array: ["safety", "feature-flags", "architecture"],
    markdown_content: `\`\`\`typescript
import { isFeatureEnabled } from '@/lib/featureFlags';

export function dynamicScaffoldAgentExecution(vibeIntent: string) {
  // Agent injects experimental code wrapped in a flag
  if (isFeatureEnabled('AI_VIBE_PROTOTYPE_V1')) {
    return executeExperimentalRender();
  }
  
  // Fallback to stable heuristic
  return executeStableRender();
}
\`\`\``
  },
  {
    title: "GitHub Operations MCP",
    type: "mcp",
    description: "Exposes Git repository management, issue tracking, and PR creation to the agent.",
    tags_array: ["github", "mcp", "git", "ci-cd"],
    markdown_content: `# GitHub MCP Server

## Tools Provided
- \`search_code\`: Search across repositories using semantic or regex matching.
- \`get_issue\`: Read the contents of an issue to determine the acceptance criteria for a bug fix.
- \`create_or_update_file\`: Push single atomic file changes directly to a branch.
- \`create_pull_request\`: Scaffold a PR with a generated description of the vibe-coded implementation.
- \`list_commits\`: Retrieve branch history to establish contextual grounding before beginning work.`
  },
  {
    title: "Biometric Authentication Scaffolder",
    type: "prompt",
    description: "Instructs the agent to implement Android BiometricPrompt securely, handling cryptographic objects and UI states.",
    tags_array: ["android", "security", "biometrics", "kotlin"],
    markdown_content: `# System Prompt: Biometric Implementation

**Role:** Android Security Architect.

**Task:** Implement \`BiometricPrompt\` in a Jetpack Compose environment.

**Instructions:**
1. Check \`BiometricManager.canAuthenticate(BIOMETRIC_STRONG)\` before showing UI.
2. Instantiate \`BiometricPrompt.PromptInfo\` with appropriate localized title and negative button text.
3. Wrap the authentication callback in a Kotlin Coroutine \`suspendCancellableCoroutine\` to bridge the callback-based API to a suspend function.
4. Ensure the success state updates the \`UiState\` to securely unlock the subsequent navigation route.

**Constraint:** NEVER log cryptographic keys or biometric prompt results in Logcat.`
  },
  {
    title: "React Design Systems MCP",
    type: "mcp",
    description: "Surfaces authoritative knowledge from WCAG guidelines and design systems (AWS Cloudscape, Material UI) via vector search.",
    tags_array: ["react", "mcp", "design-system", "accessibility"],
    markdown_content: `# React Design Systems MCP

## Tools Provided
- \`getComponentProps\`: Retrieves strict typing and property requirements for a target design system component.
- \`getTokens\`: Pulls specific design token values (e.g., color, spacing) to ensure generated components match enterprise standards.
- \`validate_wcag\`: Runs a semantic analysis on a generated component's ARIA attributes to ensure compliance prior to execution.`
  },
  {
    title: "Acceptance Criteria Generator",
    type: "skill",
    description: "Translates abstract user desires into rigid, true/false testable constraints that serve as a halting condition for the agent.",
    tags_array: ["requirements", "halting-condition", "agent-logic"],
    markdown_content: `\`\`\`python
def generate_acceptance_criteria(vibe_description):
    """
    Forces output into deterministic halting states.
    Input: 'Make the dashboard feel fast and modern.'
    Output:
    - [ ] LCP (Largest Contentful Paint) is under 1.2s.
    - [ ] All table rows utilize virtualization.
    - [ ] Button hover states execute CSS transitions within 150ms.
    """
    prompt = f"Translate this vibe into 3 measurable, binary constraints: {vibe_description}"
    return llm.invoke(prompt)
\`\`\``
  },
  {
    title: "Context Packing Optimizer",
    type: "skill",
    description: "Condenses massive multi-turn conversation logs into dense, token-efficient summaries to survive context window limits.",
    tags_array: ["memory", "context-management", "optimization"],
    markdown_content: `\`\`\`javascript
async function optimizeContextWindow(sessionHistory) {
  const abstractSyntaxTrees = extractModifiedNodes(sessionHistory);
  const resolvedDecisions = filterResolvedArchitecturalChoices(sessionHistory);
  
  const packedSummary = await llm.summarize({
    instruction: "Condense to absolute minimum tokens. Retain only file paths, active schemas, and unresolved intent.",
    data: { abstractSyntaxTrees, resolvedDecisions }
  });
  
  return packedSummary;
}
\`\`\``
  },
  {
    title: "Anti-Rationalization Enforcer",
    type: "prompt",
    description: "A meta-prompt injected into the RISEN framework to prevent the agent from taking shortcuts, ignoring tests, or hallucinating APIs.",
    tags_array: ["system-prompt", "safety", "quality-gate"],
    markdown_content: `# Anti-Rationalization Directives

- **No Skipped Tests:** You will be tempted to state "I will add tests later." This is forbidden. Tests MUST be written simultaneously with the logic.
- **No Blind Assumptions:** Do not assume the shape of a JSON payload. You MUST execute a dummy GET request via the network tool to verify the schema before generating parsing logic.
- **Chesterton's Fence:** NEVER remove obscure legacy code unless you explicitly output a causal explanation of why it was originally written that way.
- **No Suppressed Errors:** Do not wrap failing code in a generic try/catch that swallows the exception. All errors must be logged, typed, and surfaced.`
  },
  {
    title: "PostgreSQL / SQL Database MCP",
    type: "mcp",
    description: "Allows the agent to safely read database schemas, query table structures, and generate precise NL2SQL (Natural Language to SQL) queries.",
    tags_array: ["database", "mcp", "sql", "backend"],
    markdown_content: `# Database Toolbox MCP

## Tools Provided
- \`list_tables\`: Retrieve an array of all tables in the connected database.
- \`describe_schema\`: Returns the DDL (Data Definition Language) for a specific table to perfectly type ORM models.
- \`execute_read_query\`: Run a strictly \`SELECT\` statement (guaranteed read-only via connection permissions) to sample real data structures during development.

## Setup Constraint
Agent must never use \`execute_read_query\` on tables matching regex \`.*(users|auth|passwords).*\` without human override.`
  },
  {
    title: "Playwright / Browser Automation MCP",
    type: "mcp",
    description: "Empowers the LLM to control a headless browser, navigate the DOM via accessibility trees, and extract visual data.",
    tags_array: ["testing", "browser", "mcp", "automation"],
    markdown_content: `# Playwright MCP Server

## Tools Provided
- \`navigate_to\`: Open a specific URL in the headless Chromium instance.
- \`click_element\`: Dispatch a trusted click event to an element found via ARIA label or CSS selector.
- \`evaluate_js\`: Run a script in the browser context to read window variables or complex DOM state.
- \`get_accessibility_tree\`: Returns a highly optimized JSON representation of the visual layout for the LLM to understand what is currently rendered on screen.`
  },
  {
    title: "Evidence-Based Validator",
    type: "skill",
    description: "A logical gate that refuses to advance the execution state until empirical proof (a passing test suite output) is ingested.",
    tags_array: ["validation", "agent-logic", "testing"],
    markdown_content: `\`\`\`typescript
async function enforceEvidenceGate(taskIntent: string, workspace: AgentWorkspace) {
  let isProven = false;
  let attempts = 0;
  
  while (!isProven && attempts < 3) {
    const patch = await agent.generateImplementation(taskIntent);
    workspace.apply(patch);
    
    const testOutput = await workspace.executeShell('npm run test:ci');
    
    if (testOutput.exitCode === 0) {
      isProven = true;
      return workspace.commit("feat: validated intent execution");
    }
    
    // Feed the error back into the Chain-of-Hindsight optimizer
    taskIntent = appendErrorToContext(taskIntent, testOutput.stderr);
    attempts++;
  }
  
  workspace.revert();
  throw new Error("Halting: Evidence gate failed 3 times.");
}
\`\`\``
  },
  {
    title: "Material 3 Expressive Themer",
    type: "prompt",
    description: "Guides the Android agent to utilize the latest Material 3 Expressive APIs, including MotionScheme and MaterialShapes.",
    tags_array: ["android", "material-design", "ui", "jetpack-compose"],
    markdown_content: `# System Prompt: Material 3 Expressive UI Architect

**Role:** Android UI Specialist.

**Instructions:** When generating Jetpack Compose code for screens, do not use legacy Material 2 or standard Material 3 defaults.
1. Implement \`MaterialShapes\` for unique component bounding (e.g., non-standard radiuses, star-shaped FABs).
2. Utilize \`MotionScheme\` for all transitions between composables, ensuring shared element transitions are smooth and delightfully animated.
3. Extract all color definitions to a centralized \`ColorScheme\` that dynamically adapts based on \`isSystemInDarkTheme()\`.

**Output:** Provide the \`Theme.kt\` and \`Shape.kt\` files.`
  },
  {
    title: "Android Source Explorer MCP",
    type: "mcp",
    description: "Provides the agent precise access to the actual source code of AOSP and AndroidX to eliminate framework hallucinations.",
    tags_array: ["android", "aosp", "mcp", "source-code"],
    markdown_content: `# Android Source Explorer MCP

## Tools Provided
- \`search_classes\`: Search for internal framework classes via glob pattern.
- \`lookup_method\`: Extract the precise method body and Javadoc for a complex Android API (e.g., Activity Lifecycle internals).
- \`goto_definition\`: Resolve the cross-file definition of a symbol within the AndroidX tree using LSP.
- \`get_class_hierarchy\`: Traverse the inheritance chain of a class to verify required interface overrides.`
  },
  {
    title: "Local Knowledge Retrieval (RAG) MCP",
    type: "mcp",
    description: "Executes local semantic searches against personal markdown notes and architecture decision records.",
    tags_array: ["rag", "memory", "mcp", "knowledge-base"],
    markdown_content: `# Memory & Knowledge MCP

## Resources Exposed
- \`architecture_decision_records\`: A read-only stream of historical markdown files detailing past engineering choices.

## Tools Provided
- \`semantic_search\`: Given a query string, executes a local embedding search against the user's \`~/Notes\` directory.
- \`episodic_memory_extract\`: Appends a new fact or decision to the persistent generalized knowledge graph database.`
  },
  {
    title: "Spec-Driven Development Scaffold",
    type: "skill",
    description: "Forces the agent to draft a full PRD before code generation begins, preventing scope creep and unanchored guessing.",
    tags_array: ["planning", "prd", "scaffolding"],
    markdown_content: `\`\`\`javascript
function enforceSpecDrivenDevelopment(request) {
  const prd = generatePRD(request);
  requireHumanApproval(prd);
  
  const architecture = mapIntentToArchitecture(prd);
  return bootstrapRepository(architecture);
}
\`\`\``
  },
  {
    title: "Continuous Browser Testing Orchestrator",
    type: "skill",
    description: "Automates Puppeteer to navigate rendered UI components and visually validate click paths against expected outcomes.",
    tags_array: ["testing", "puppeteer", "ui-ux"],
    markdown_content: `\`\`\`python
def execute_continuous_browser_test(target_url, expected_dom_state):
    browser = launch_headless_chromium()
    page = browser.navigate(target_url)
    
    page.simulate_user_journey()
    actual_state = page.get_accessibility_tree()
    
    if not diff_states(actual_state, expected_dom_state):
        raise RenderException("Visual layout deviated from expected DOM state.")
\`\`\``
  },
  {
    title: "Visual Evidence Validation",
    type: "skill",
    description: "Captures screenshots of the compiled application and diffs them against original Figma design files for pixel-perfect confirmation.",
    tags_array: ["visual-testing", "figma", "diff"],
    markdown_content: `\`\`\`javascript
async function validateVisualEvidence(renderedScreenPath, figmaNodeId) {
  const expectedBuffer = await fetchFigmaAsset(figmaNodeId);
  const actualBuffer = await captureLocalScreenshot(renderedScreenPath);
  
  const diffPercentage = comparePixels(expectedBuffer, actualBuffer);
  if (diffPercentage > 0.02) {
    throw new Error(\`Visual regression detected: \${diffPercentage * 100}% variance.\`);
  }
}
\`\`\``
  },
  {
    title: "Layout Overflow Detection",
    type: "skill",
    description: "Autonomously scans responsive CSS implementations across mobile, tablet, and desktop viewports to identify overflow anomalies.",
    tags_array: ["css", "responsive-design", "testing"],
    markdown_content: `\`\`\`python
def detect_layout_overflows(html_file):
    viewports = [(320, 568), (768, 1024), (1440, 900)]
    for width, height in viewports:
        rendered = render_at_resolution(html_file, width, height)
        if rendered.has_horizontal_scroll():
            flag_css_anomaly(width)
\`\`\``
  },
  {
    title: "Mock Data Injection Scaffold",
    type: "skill",
    description: "Dynamically creates schema-compliant JSON fixtures to simulate backend API responses during isolated front-end UI coding.",
    tags_array: ["mocking", "frontend", "api"],
    markdown_content: `\`\`\`javascript
function injectMockData(schemaDefinition) {
  const mockPayload = generateRobustDummyData(schemaDefinition);
  interceptNetworkRequests((req) => {
    if (req.url.includes('/api/v1')) {
      return respondWith(200, mockPayload);
    }
  });
}
\`\`\``
  },
  {
    title: "Style Consistency Checker",
    type: "skill",
    description: "Analyzes newly generated React/Vue components against existing Tailwind tokens to prevent the hallucination of non-standard hex codes.",
    tags_array: ["styling", "tailwind", "consistency"],
    markdown_content: `\`\`\`javascript
function checkStyleConsistency(componentAST, tailwindConfig) {
  const hardcodedColors = extractHexCodes(componentAST);
  if (hardcodedColors.length > 0) {
    throw new StyleViolation("Hardcoded hex values found. Use tailwind utility classes.");
  }
}
\`\`\``
  },
  {
    title: "Rollback-Friendly Committing",
    type: "skill",
    description: "Chunks massive generative coding bursts into atomic Git commits, enabling rapid and safe reversion if tests fail.",
    tags_array: ["git", "version-control", "safety"],
    markdown_content: `\`\`\`bash
# Automatically execute after every successful function generation
git add .
git commit -m "auto: generated isolated function block"
\`\`\``
  },
  {
    title: "Boilerplate Reduction Engine",
    type: "skill",
    description: "Identifies repetitive logic patterns during prototyping phases and abstracts them into reusable utility functions.",
    tags_array: ["refactoring", "clean-code", "optimization"],
    markdown_content: `\`\`\`python
def reduce_boilerplate(ast_tree):
    duplicates = find_duplicate_subtrees(ast_tree)
    for dup in duplicates:
        abstract_to_parameterized_function(dup)
        replace_occurrences(dup)
\`\`\``
  },
  {
    title: "User Journey Simulation",
    type: "skill",
    description: "Executes a multi-step user persona path to verify complex state persistence across page navigations.",
    tags_array: ["e2e-testing", "user-journey", "state-management"],
    markdown_content: `\`\`\`javascript
async function simulateUserJourney() {
  await loginAsPersona('admin');
  await navigateToDashboard();
  await mutateStateData();
  await refreshPage();
  verifyStatePersisted();
}
\`\`\``
  },
  {
    title: "Accessible Navigation Tester",
    type: "skill",
    description: "Evaluates DOM output specifically testing keyboard traversal efficiency, focus states, and ARIA label fidelity.",
    tags_array: ["accessibility", "a11y", "wcag"],
    markdown_content: `\`\`\`javascript
function testAccessibilityTraversal(dom) {
  const focusableElements = extractFocusable(dom);
  verifyTabOrderIndex(focusableElements);
  verifyAriaLabelsExist(focusableElements);
}
\`\`\``
  },
  {
    title: "Error Boundary Scaffolding",
    type: "skill",
    description: "Surrounds AI-generated UI components with robust error-catching boundaries to prevent total application crashes.",
    tags_array: ["react", "error-handling", "stability"],
    markdown_content: `\`\`\`javascript
import { ErrorBoundary } from 'react-error-boundary';

function ScaffoldedComponent({ children }) {
  return (
    <ErrorBoundary fallback={<FallbackUI />}>
      {children}
    </ErrorBoundary>
  );
}
\`\`\``
  },
  {
    title: "Artifact Diffing Analyzer",
    type: "skill",
    description: "Compares the Abstract Syntax Tree (AST) of newly generated files against previous states to isolate logic modifications.",
    tags_array: ["ast", "diff", "analysis"],
    markdown_content: `\`\`\`python
def analyze_artifact_diff(old_ast, new_ast):
    modifications = compute_tree_diff(old_ast, new_ast)
    generate_human_readable_report(modifications)
\`\`\``
  },
  {
    title: "Intent-to-Architecture Mapping",
    type: "skill",
    description: "Evaluates a vibe-coded prototype request and recommends the optimal cloud architecture (serverless vs containerized).",
    tags_array: ["architecture", "cloud", "planning"],
    markdown_content: `\`\`\`python
def map_intent_to_architecture(prd_document):
    if "real-time WebSocket" in prd_document:
        return recommend_containerized_stateful_cluster()
    return recommend_serverless_edge_compute()
\`\`\``
  },
  {
    title: "Dependency Health Checker",
    type: "skill",
    description: "Scans package.json to swap outdated, hallucinated, or vulnerable libraries with stable equivalents before installation.",
    tags_array: ["security", "dependencies", "npm"],
    markdown_content: `\`\`\`bash
# Pre-execution validation hook
npm audit --audit-level=high
if [ $? -ne 0 ]; then
  echo "Vulnerable dependencies detected. Re-prompting agent for secure alternatives."
fi
\`\`\``
  },
  {
    title: "Episodic Memory Extraction",
    type: "skill",
    description: "Parses live conversation logs to extract distinct decisions, storing them as discrete chronological memory records.",
    tags_array: ["memory", "agent-logic", "database"],
    markdown_content: `\`\`\`python
def extract_episodic_memory(chat_log):
    decisions = llm.extract_key_decisions(chat_log)
    for decision in decisions:
        vector_db.insert(timestamp=now(), data=decision)
\`\`\``
  },
  {
    title: "Decision History Archiver",
    type: "skill",
    description: "Logs pivotal architectural choices alongside discarded alternatives for rapid retrieval during future justification requests.",
    tags_array: ["adr", "architecture", "documentation"],
    markdown_content: `\`\`\`javascript
function archiveDecision(decision, alternatives, rationale) {
  writeMarkdownADR({
    title: \`Decision: \${decision}\`,
    context: rationale,
    rejectedOptions: alternatives
  });
}
\`\`\``
  },
  {
    title: "Biometric Schedule Adaptation",
    type: "skill",
    description: "Aligns intensive background tasks (like full test suite runs) with the user's historically logged periods of inactivity.",
    tags_array: ["scheduling", "optimization", "background-tasks"],
    markdown_content: `\`\`\`python
def schedule_heavy_compute(task):
    user_offline_window = predict_user_inactivity_window()
    cron.schedule(task, time=user_offline_window.start)
\`\`\``
  },
  {
    title: "Adaptive Verbosity Control",
    type: "skill",
    description: "Strips away conversational pleasantries and explanatory prose during incident response, delivering only raw mitigation commands.",
    tags_array: ["incident-response", "communication", "formatting"],
    markdown_content: `\`\`\`python
def control_verbosity(system_state):
    if system_state == "SEV-1":
        return "OUTPUT STRICTLY BASH COMMANDS. NO EXPLANATION."
\`\`\``
  },
  {
    title: "ReAct Iteration Engine",
    type: "prompt",
    description: "Forces the agent into a Reason + Act iterative loop to resolve complex, multi-step filesystem operations.",
    tags_array: ["react", "agent-logic", "execution"],
    markdown_content: `# ReAct Execution Paradigm

For every step of the task, you MUST output your response in the following format:
**Thought:**
**Action:** [Name of the tool to execute]
**Action Input:**

Wait for the human/system to provide the **Observation** before proceeding.`
  },
  {
    title: "Tree-of-Thoughts Expander",
    type: "skill",
    description: "An advanced inference structure that explores multiple divergent solution paths simultaneously before committing.",
    tags_array: ["tot", "inference", "agent-logic"],
    markdown_content: `\`\`\`python
def tree_of_thoughts_evaluation(problem_statement):
    branches = generate_multiple_solutions(problem_statement, count=3)
    scores = [evaluate_viability(branch) for branch in branches]
    best_branch = select_highest_score(scores)
    return execute(best_branch)
\`\`\``
  },
  {
    title: "Verifier-Critic Evaluator",
    type: "skill",
    description: "A dual-model topology where a generator outputs a solution and a distinct critic attempts to find security or logic flaws.",
    tags_array: ["security", "critic", "validation"],
    markdown_content: `\`\`\`python
def verifier_critic_loop(intent):
    draft_code = generator_llm.create(intent)
    critique = critic_llm.find_flaws(draft_code)
    if critique.has_vulnerabilities:
        return verifier_critic_loop(critique.correction_intent)
    return draft_code
\`\`\``
  },
  {
    title: "Reflection Node",
    type: "skill",
    description: "A dedicated processing step where the agent reviews its own generated output against initial constraints before presenting it.",
    tags_array: ["reflection", "quality-control", "agent-logic"],
    markdown_content: `\`\`\`python
def reflection_node(generated_artifact, original_constraints):
    reflection = llm.evaluate(generated_artifact, original_constraints)
    if reflection.is_compliant:
        return generated_artifact
    return regenerate_artifact_with_feedback(reflection.feedback)
\`\`\``
  },
  {
    title: "Chain-of-Hindsight Optimizer",
    type: "prompt",
    description: "Allows the model to review its previous failed attempts, using errors as explicit negative examples.",
    tags_array: ["optimization", "hindsight", "prompting"],
    markdown_content: `# Context: Previous Failed Attempt

You previously attempted to write this function, but it failed the test suite with the following error:
\`\`

**Instruction:** Do not repeat the logic that led to this error. Explicitly address the null pointer exception in your new implementation.`
  },
  {
    title: "Sub-Task Decomposer",
    type: "skill",
    description: "Dissects abstract user requests into an array of isolated, atomic operations handled by specialized tools.",
    tags_array: ["decomposition", "planning", "tasks"],
    markdown_content: `\`\`\`python
def decompose_task(vibe_request):
    atomic_tasks = llm.break_down(vibe_request)
    for task in atomic_tasks:
        queue.push(task)
\`\`\``
  },
  {
    title: "Execution Strategy Selector",
    type: "skill",
    description: "A meta-cognitive router that dynamically decides whether to use a ReAct loop, Plan-and-Solve, or a multi-agent Swarm.",
    tags_array: ["routing", "meta-cognition", "strategy"],
    markdown_content: `\`\`\`python
def select_execution_strategy(task_complexity):
    if task_complexity > 0.8:
        return trigger_swarm_topology()
    elif task_complexity > 0.4:
        return trigger_plan_and_solve()
    return trigger_zero_shot_execution()
\`\`\``
  },
  {
    title: "Repetitive Loop Detector",
    type: "skill",
    description: "Monitors tool invocations to forcibly terminate loops if identical arguments yield identical failures.",
    tags_array: ["safety", "loop-prevention", "cost-control"],
    markdown_content: `\`\`\`javascript
function detectRepetitiveLoop(toolHistory) {
  const recent = toolHistory.slice(-3);
  if (recent.every(call => call.arguments === recent.arguments && call.error)) {
    throw new Error("Runaway loop detected. Terminating execution.");
  }
}
\`\`\``
  },
  {
    title: "Assumption Formulation Module",
    type: "skill",
    description: "Forces the agent to explicitly list any assumptions it makes when faced with ambiguous data, requesting human validation.",
    tags_array: ["assumptions", "validation", "communication"],
    markdown_content: `\`\`\`python
def formulate_assumptions(ambiguous_data):
    assumptions = llm.extract_implicit_assumptions(ambiguous_data)
    return prompt_human_for_validation(assumptions)
\`\`\``
  },
  {
    title: "Hypothesis Testing Harness",
    type: "skill",
    description: "The agent proposes a root cause for a bug, designs a minimal test to prove the theory, and executes it before patching.",
    tags_array: ["debugging", "testing", "methodology"],
    markdown_content: `\`\`\`python
def test_hypothesis(bug_report):
    theory = llm.propose_root_cause(bug_report)
    test_script = llm.write_minimal_reproduction(theory)
    if execute(test_script).fails():
        return proceed_with_patch(theory)
\`\`\``
  }
];

async function main() {
  console.log('Starting DB seed process using Neon serverless fetch...');

  await sql`DELETE FROM workflows`;
  console.log('Cleaned existing workflows table.');
  await sql`DELETE FROM tools`;
  console.log('Cleaned existing tools table.');

  // 1. Insert the high-quality base items
  for (const tool of seedData) {
    await sql`
      INSERT INTO tools (title, type, description, "markdownContent", tags, "updatedAt")
      VALUES (${tool.title}, ${tool.type}, ${tool.description}, ${tool.markdown_content}, ${tool.tags_array}, NOW())
    `;
  }
  
  console.log(`Database seeded successfully with ${seedData.length} unique items!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
