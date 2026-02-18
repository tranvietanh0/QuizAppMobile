#!/bin/bash

# EAS Build Pre-Install Script
# This script runs before the EAS build starts

echo "Building @quizapp/shared package..."

# Navigate to root and build shared package
cd ../..
pnpm --filter @quizapp/shared build

echo "Shared package built successfully!"
