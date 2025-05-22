#!/usr/bin/env bash
# Script to fork MindsDB repo and modify README
set -euo pipefail

REPO_TO_FORK="mindsdb/mindsdb"
FORK_NAME="mindsdb-duplicate"

# Fork the repository without cloning (requires logged-in gh)
# This will create github.com/<user>/${FORK_NAME}

echo "Forking $REPO_TO_FORK as $FORK_NAME..."
if ! gh repo fork "$REPO_TO_FORK" --fork-name "$FORK_NAME" --clone=false; then
  echo "Failed to fork repository. Ensure you are authenticated with gh CLI." >&2
  exit 1
fi

# Get current authenticated username
USERNAME=$(gh api user --jq '.login')
FORK_REPO="$USERNAME/$FORK_NAME"

# Set repository visibility to public

echo "Setting $FORK_REPO visibility to public..."
if ! gh repo edit "$FORK_REPO" --visibility public; then
  echo "Failed to set repository visibility" >&2
  exit 1
fi

# Clone the fork locally
echo "Cloning $FORK_REPO..."
if [ -d "$FORK_NAME" ]; then
  echo "Directory $FORK_NAME already exists." >&2
else
  gh repo clone "$FORK_REPO"
fi

cd "$FORK_NAME"

# Prepend note to README
NOTE="Forked for personal experimentation. All credit to MindsDB."
echo "Adding note to README..."
if [ -f README.md ]; then
  # Prepend the note at the beginning of README
  printf '%s\n\n' "$NOTE" | cat - README.md > README.tmp && mv README.tmp README.md
else
  echo "$NOTE" > README.md
fi

# Commit and push

git add README.md
git commit -m "Add fork notice" || true

echo "Pushing changes..."
if ! git push; then
  echo "Failed to push changes" >&2
fi

cd ..

REPO_URL="https://github.com/$FORK_REPO"
echo "$REPO_URL" > my_mindsdb_repo.txt

cat <<MSG
✅ Fork created and updated at $REPO_URL
📄 Link also saved to my_mindsdb_repo.txt
MSG
