# Agent Tool Matrix (ATM) Setup Script
# Run this script in PowerShell to configure your local development environment.

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "        Agent Tool Matrix (ATM) Setup        " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Node.js installation
Write-Host "[1/5] Checking Node.js installation..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node -v
    Write-Host "✓ Node.js is installed ($nodeVersion)" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Install from https://nodejs.org/" -ForegroundColor Red
    Exit 1
}
Write-Host ""

# 2. Check for .env file
Write-Host "[2/5] Verifying environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .env configuration file exists." -ForegroundColor Green
} else {
    Write-Host "⚠ .env file is missing! Creating a template — fill in your own credentials." -ForegroundColor DarkYellow
    $envTemplate = @"
# Neon Postgres Connection Strings
DATABASE_URL="postgresql://<user>:<password>@<host>-pooler.<region>.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://<user>:<password>@<host>.<region>.aws.neon.tech/neondb?sslmode=require"

# Neon Authentication Base Settings
NEON_AUTH_BASE_URL=https://<host>.neonauth.<region>.aws.neon.tech/neondb/auth
NEON_AUTH_JWKS_URL=https://<host>.neonauth.<region>.aws.neon.tech/neondb/auth/.well-known/jwks.json

# Local API Key developer bypass
DEV_AGENT_TOKEN="dev_static_key_changeme"
"@
    Set-Content -Path ".env" -Value $envTemplate
    Write-Host "✓ .env template created. Please fill in your Neon credentials before continuing." -ForegroundColor Green
    Exit 1
}
Write-Host ""

# 3. Install NPM dependencies
Write-Host "[3/5] Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully." -ForegroundColor Green
} else {
    Write-Host "✗ Dependency installation failed." -ForegroundColor Red
    Exit 1
}
Write-Host ""

# 4. Generate Prisma Client
Write-Host "[4/5] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma Client generated successfully." -ForegroundColor Green
} else {
    Write-Host "✗ Prisma Client generation failed." -ForegroundColor Red
    Exit 1
}
Write-Host ""

# 5. Seed the Database
Write-Host "[5/5] Seeding mock tools and workflows database..." -ForegroundColor Yellow
node prisma/seed.mjs
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database seeded successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Database seeding failed. Verify your Neon credentials in .env." -ForegroundColor Red
    Exit 1
}
Write-Host ""

Write-Host "=============================================" -ForegroundColor Green
Write-Host "   Setup complete! You are ready to develop. " -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Start the dev server:     npm run dev" -ForegroundColor Cyan
Write-Host "Run the full test suite:  npx playwright test" -ForegroundColor Cyan
Write-Host ""
