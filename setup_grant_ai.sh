#!/usr/bin/env bash
set -euo pipefail
trap 'echo "Error on line $LINENO"; exit 1' ERR

# Ensure required commands are available
for cmd in git npm; do
    command -v "$cmd" >/dev/null 2>&1 || { echo "Error: $cmd is not installed." >&2; exit 1; }
done

read -rp "Enter your GitHub repo URL (e.g. https://github.com/RaakuS/GrantBuddy.git): " REPO_URL
# Clone repository into GrantBuddy directory
if [ -d GrantBuddy ]; then
    echo "Directory GrantBuddy already exists. Using existing directory."
else
    git clone "$REPO_URL" GrantBuddy
fi

cd GrantBuddy

# Create .env.local with placeholders
: > .env.local

echo "# Grant AI environment variables" >> .env.local
read -rp "Enter your Anthropic API key: " ANTHROPIC_API_KEY
echo "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" >> .env.local

echo "# MCP OAuth (LinkedIn, Google, ORCID, Drive)" >> .env.local
echo "MCP_CLIENT_ID=" >> .env.local
echo "MCP_CLIENT_SECRET=" >> .env.local

echo "# SMTP (email reminders)" >> .env.local
echo "SMTP_HOST=" >> .env.local
echo "SMTP_PORT=" >> .env.local
echo "SMTP_USER=" >> .env.local
echo "SMTP_PASS=" >> .env.local
echo "SMTP_SECURE=false" >> .env.local

echo "# Database (SQLite default)" >> .env.local
echo "# DATABASE_URL=" >> .env.local

echo "# Auth / App URL" >> .env.local
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local

echo "# Vercel token (optional, for CI/CD)" >> .env.local
echo "VERCEL_TOKEN=" >> .env.local

# Install dependencies
npm install

# Verify local development
echo "Running dev server: http://localhost:3000"
npm run dev &
DEV_PID=$!
sleep 5
kill "$DEV_PID" >/dev/null 2>&1 || true
npm run build

# Commit and push scaffold to GitHub
if [ ! -d .git ]; then
    git init
fi

git add .
git commit -m "Add initial scaffold per roadmap" || true
read -rp "Enter remote name (default origin): " REMOTE
REMOTE=${REMOTE:-origin}
read -rp "Enter remote URL: " REMOTE_URL
if ! git remote | grep -q "^$REMOTE$"; then
    git remote add "$REMOTE" "$REMOTE_URL"
fi

git branch -M main
git push -u "$REMOTE" main

# Load environment variables
set -a
source .env.local
set +a

# Install and login with Vercel CLI
npm install -g vercel
if [ -z "${VERCEL_TOKEN}" ]; then
    echo "No VERCEL_TOKEN set in .env.local; you can login interactively"
    vercel login
else
    export VERCEL_TOKEN
fi

# Link the project to Vercel
vercel link --yes

# Set environment variables in Vercel
while read -r line; do
  key=$(echo "$line" | cut -d= -f1)
  val=$(echo "$line" | cut -d= -f2-)
  if [ -n "$val" ]; then
    vercel env add "$key" production --token="$VERCEL_TOKEN" <<< "$val"
  fi
done < .env.local

# Deploy to Vercel
vercel --prod --yes

# Instructions for custom domain
echo "To add your custom domain aigrantbuddy.com, run:"
echo "  vercel domains add aigrantbuddy.com --token \$VERCEL_TOKEN"
echo "Then update your DNS records as instructed in the Vercel dashboard."

# Summary
echo "✅ Grant AI scaffolded, built, and deployed!"
echo "🔗 Preview URL: $(vercel url --prod --token \"$VERCEL_TOKEN\")"
echo "👉 Remember to register OAuth Redirect URIs and fill in .env.local placeholders!"
