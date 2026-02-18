#!/bin/bash

# EAS Build Post-Install Hook
# This script runs automatically after pnpm install on EAS servers
# Docs: https://docs.expo.dev/build-reference/npm-hooks/

set -e

echo "=== EAS Post-Install Hook ==="
echo "Current directory: $(pwd)"

# Navigate to monorepo root
cd ../..
echo "Monorepo root: $(pwd)"

# Build shared package
echo "Building @quizapp/shared package..."
pnpm --filter @quizapp/shared build

echo "=== Post-Install Complete ==="
