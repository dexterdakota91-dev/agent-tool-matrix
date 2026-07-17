#!/usr/bin/env bash

# Agent Tool Matrix (ATM) Setup Script
# Run this script in your bash shell to configure your local development environment.

# Color definitions
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}=============================================${NC}"
echo -e "${CYAN}        Agent Tool Matrix (ATM) Setup        ${NC}"
echo -e "${CYAN}=============================================${NC}"
echo ""

# 1. Check Node.js installation
echo -e "${YELLOW}[1/5] Checking Node.js installation...${NC}"
if command -v node >/dev/null 2>&1; then
    nodeVersion=$(node -v)
    echo -e "${GREEN}✓ Node.js is installed ($nodeVersion)${NC}"
else
    echo -e "${RED}✗ Node.js is not found. Please install Node.js (v18+) from https://nodejs.org/${NC}"
    exit 1
fi
echo ""

# 2. Check for .env file
echo -e "${YELLOW}[2/5] Verifying environment configuration...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env configuration file exists.${NC}"
else
    echo -e "${YELLOW}⚠ .env file is missing! Creating a template — fill in your own credentials.${NC}"
    cat << 'EOF' > .env
# Neon Postgres Connection Strings
DATABASE_URL="postgresql://<user>:<password>@<host>-pooler.<region>.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://<user>:<password>@<host>.<region>.aws.neon.tech/neondb?sslmode=require"

# Neon Authentication Base Settings
NEON_AUTH_BASE_URL=https://<host>.neonauth.<region>.aws.neon.tech/neondb/auth
NEON_AUTH_JWKS_URL=https://<host>.neonauth.<region>.aws.neon.tech/neondb/auth/.well-known/jwks.json

# Local API Key developer bypass
DEV_AGENT_TOKEN="dev_static_key_changeme"
EOF
    echo -e "${GREEN}✓ .env template created. Please fill in your Neon credentials before continuing.${NC}"
    exit 1
fi
echo ""

# 3. Install NPM dependencies
echo -e "${YELLOW}[3/5] Installing npm dependencies...${NC}"
if npm install; then
    echo -e "${GREEN}✓ Dependencies installed successfully.${NC}"
else
    echo -e "${RED}✗ Dependency installation failed.${NC}"
    exit 1
fi
echo ""

# 4. Generate Prisma Client
echo -e "${YELLOW}[4/5] Generating Prisma Client...${NC}"
if npx prisma generate; then
    echo -e "${GREEN}✓ Prisma Client generated successfully.${NC}"
else
    echo -e "${RED}✗ Prisma Client generation failed.${NC}"
    exit 1
fi
echo ""

# 5. Seed the Database
echo -e "${YELLOW}[5/5] Seeding mock tools and workflows database...${NC}"
if node prisma/seed.mjs; then
    echo -e "${GREEN}✓ Database seeded successfully!${NC}"
else
    echo -e "${RED}✗ Database seeding failed. Verify your Neon credentials in .env.${NC}"
    exit 1
fi
echo ""

echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}   Setup complete! You are ready to develop. ${NC}"
echo -e "${GREEN}=============================================${NC}"
echo ""
echo -e "Start the dev server:     ${CYAN}npm run dev${NC}"
echo -e "Run the full test suite:  ${CYAN}npx playwright test${NC}"
echo ""
