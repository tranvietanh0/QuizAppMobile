#!/bin/bash

# EAS Build Post-Install Hook
# This script runs automatically after pnpm install on EAS servers
# Docs: https://docs.expo.dev/build-reference/npm-hooks/

set -ex

echo "=== EAS Post-Install Hook ==="
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Navigate to monorepo root
cd ../..
echo "Monorepo root: $(pwd)"
echo "Root contents:"
ls -la

# Check if shared package exists
if [ -d "packages/shared" ]; then
    echo "Found packages/shared"
    ls -la packages/shared/
else
    echo "ERROR: packages/shared not found!"
    exit 1
fi

# Build shared package
echo "Building @quizapp/shared package..."
pnpm --filter @quizapp/shared build

# Verify build output
echo "Checking build output..."
ls -la packages/shared/dist/ || echo "WARNING: dist folder not found after build"

echo "=== Post-Install Complete ==="
