#!/bin/bash
set -e
export PATH="$HOME/node-v20/bin:$HOME/.local/bin:$PATH"
export COREPACK_ENABLE_STRICT=0
export CI=true

BUILD_DIR="$HOME/buildforge-build"

node --version
command -v pnpm && pnpm --version

# Sync source to Linux fs (rsync only project files)
mkdir -p "$BUILD_DIR"
rsync -a --delete \
  --exclude 'node_modules' --exclude '.next' --exclude '.vercel' --exclude '.open-next' \
  --exclude '.git' --exclude '.env.local' --exclude '.build-wsl.sh' \
  /mnt/x/claude/buildforge/ "$BUILD_DIR/"

cd "$BUILD_DIR"

pnpm install --frozen-lockfile 2>&1 | tail -5

pnpm cf:build 2>&1 | tail -25

echo "--- .open-next contents ---"
ls -la .open-next 2>&1 | head -10
echo "--- worker.js ---"
ls -la .open-next/worker.js 2>&1 | head -3

# Copy the build output back to Windows side
rm -rf /mnt/x/claude/buildforge/.open-next
cp -r .open-next /mnt/x/claude/buildforge/
echo "--- synced back ---"
ls -la /mnt/x/claude/buildforge/.open-next/ 2>&1 | head -5
