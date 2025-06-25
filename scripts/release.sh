#!/bin/bash

# Release script for PalauCsvToJsonWrapper
# Usage: ./scripts/release.sh <version>
# Example: ./scripts/release.sh 1.0.1

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.1"
    exit 1
fi

VERSION=$1
TAG="v$VERSION"

echo "🚀 Creating release for version $VERSION..."

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: You must be on the main branch to create a release"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Working directory is not clean. Please commit or stash your changes."
    git status --short
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests first
echo "🧪 Running tests..."
npm test

# Build the package (to verify it builds successfully)
echo "🔨 Building package..."
npm run build

# Update package.json version
echo "📦 Updating package.json version..."
npm version $VERSION --no-git-tag-version

# Stage the version update
echo "📝 Staging version update..."
git add package.json package-lock.json

# Create and push the tag
echo "🏷️  Creating tag $TAG..."
git tag $TAG
git push origin main
git push origin $TAG

echo "✅ Release $TAG created and pushed successfully!"
echo "📋 GitHub Actions will now create a release automatically."
echo "🔗 Check your GitHub repository for the new release." 