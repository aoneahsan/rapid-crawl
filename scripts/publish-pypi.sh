#!/bin/bash

# Simple PyPI Publishing Script for RapidCrawl
# This publishes directly to PyPI (no TestPyPI)

set -e

echo "🚀 RapidCrawl PyPI Publishing Script"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "pyproject.toml" ]; then
    echo "❌ Error: pyproject.toml not found. Please run this script from the project root."
    exit 1
fi

# Check if .pypirc exists
if [ ! -f "$HOME/.pypirc" ]; then
    echo "❌ Error: ~/.pypirc not found."
    echo "Please create ~/.pypirc with your PyPI credentials."
    exit 1
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "📦 No dist directory found. Building package..."
    python -m build
else
    echo "📦 Found existing dist directory."
    ls -la dist/
    echo ""
    read -p "Use existing build? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "🔨 Rebuilding package..."
        rm -rf dist/ build/ *.egg-info/
        python -m build
    fi
fi

# Check package quality
echo ""
echo "✅ Checking package quality..."
twine check dist/*

# Show what will be uploaded
echo ""
echo "📦 Files to upload:"
ls -la dist/

# Final confirmation
echo ""
echo "⚠️  You are about to upload to PyPI (production)!"
echo "   Package: rapid-crawl version 0.1.0"
echo ""
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📤 Uploading to PyPI..."
    twine upload dist/*
    
    echo ""
    echo "✅ Success! Package uploaded to PyPI!"
    echo ""
    echo "🎉 Your package is now live at:"
    echo "   https://pypi.org/project/rapid-crawl/"
    echo ""
    echo "📦 Install with:"
    echo "   pip install rapid-crawl"
    echo ""
    echo "Next steps:"
    echo "1. Test installation: pip install rapid-crawl"
    echo "2. Create GitHub release with tag v0.1.0"
    echo "3. Announce on social media!"
else
    echo ""
    echo "❌ Upload cancelled."
    exit 1
fi