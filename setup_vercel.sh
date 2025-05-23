#!/usr/bin/env bash

set -euo pipefail

ENV_FILE=".env"

cleanup() {
  echo "\nInterrupted. Exiting." >&2
  exit 1
}
trap cleanup INT

# 1. Ensure Vercel CLI is installed
if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI not found. Installing via npm..."
  if ! npm install -g vercel; then
    echo "Failed to install Vercel CLI." >&2
    exit 1
  fi
fi

# 5. If token already present in .env, skip creation
if [ -f "$ENV_FILE" ] && grep -q '^VERCEL_TOKEN=' "$ENV_FILE"; then
  echo "VERCEL_TOKEN already exists in $ENV_FILE. Nothing to do."
  exit 0
fi

# 2. Prompt for email
read -rp "Enter your Vercel account email: " email

# 3. Login to Vercel
if ! vercel login "$email"; then
  echo "Vercel login failed." >&2
  exit 1
fi

# 4. Create token
output=$(vercel token create grant-ai-automation --scope personal 2>&1)
status=$?
if [ $status -ne 0 ]; then
  echo "Token creation failed: $output" >&2
  exit $status
fi

token=$(echo "$output" | grep -Eo '[0-9a-zA-Z]{24,}' | tail -n1)
if [ -z "$token" ]; then
  echo "Failed to parse token from output: $output" >&2
  exit 1
fi

# 5. Write token to .env
{
  echo "VERCEL_TOKEN=$token"
} >> "$ENV_FILE"

# 6. Reminder to gitignore
cat <<MSG
Token saved to $ENV_FILE.
Remember to add this line to your .gitignore to keep it private:
$ENV_FILE
MSG

