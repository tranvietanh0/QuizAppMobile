#!/bin/bash

# EAS Build Pre-Install Script
# This script runs before the EAS build starts

set -e

echo "=== EAS Prebuild Script ==="
echo "Current directory: $(pwd)"

# Navigate to monorepo root
cd ../..
echo "Monorepo root: $(pwd)"

# Install dependencies first
echo "Installing dependencies..."
pnpm install --frozen-lockfile

# Build shared package
echo "Building @quizapp/shared package..."
pnpm --filter @quizapp/shared build

echo "=== Prebuild Complete ==="
