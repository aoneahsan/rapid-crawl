#!/bin/bash

# RapidCrawl Publishing Script
# This script helps publish RapidCrawl to PyPI

set -e

echo "🚀 RapidCrawl Publishing Script"
echo "==============================="

# Check if we're in the right directory
if [ ! -f "pyproject.toml" ]; then
    echo "❌ Error: pyproject.toml not found. Please run this script from the project root."
    exit 1
fi

# Check if .pypirc exists
if [ ! -f "$HOME/.pypirc" ]; then
    echo "❌ Error: ~/.pypirc not found."
    echo ""
    echo "Please create ~/.pypirc with your PyPI credentials."
    echo "See .pypirc.template for an example."
    echo ""
    echo "To get a PyPI token:"
    echo "1. Create account at https://pypi.org/account/register/"
    echo "2. Go to https://pypi.org/manage/account/token/"
    echo "3. Create a new API token"
    exit 1
fi

# Parse command line arguments
USE_TESTPYPI=false
SKIP_BUILD=false
SKIP_TESTS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --test)
            USE_TESTPYPI=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--test] [--skip-build] [--skip-tests]"
            echo "  --test       Upload to TestPyPI instead of PyPI"
            echo "  --skip-build Skip building the package"
            echo "  --skip-tests Skip running tests"
            exit 1
            ;;
    esac
done

# Run tests if not skipped
if [ "$SKIP_TESTS" = false ]; then
    echo ""
    echo "📋 Running tests..."
    if command -v pytest &> /dev/null; then
        pytest || {
            echo "❌ Tests failed. Fix the tests before publishing."
            exit 1
        }
    else
        echo "⚠️  Warning: pytest not found. Skipping tests."
    fi
fi

# Build the package if not skipped
if [ "$SKIP_BUILD" = false ]; then
    echo ""
    echo "🔨 Building package..."
    
    # Clean previous builds
    rm -rf dist/ build/ *.egg-info/
    
    # Build
    python -m build || {
        echo "❌ Build failed."
        exit 1
    }
fi

# Check the package
echo ""
echo "✅ Checking package quality..."
twine check dist/* || {
    echo "❌ Package quality check failed."
    exit 1
}

# Show what will be uploaded
echo ""
echo "📦 Package contents:"
ls -la dist/

# Upload to PyPI or TestPyPI
if [ "$USE_TESTPYPI" = true ]; then
    echo ""
    echo "📤 Uploading to TestPyPI..."
    twine upload --repository testpypi dist/*
    
    echo ""
    echo "✅ Package uploaded to TestPyPI!"
    echo ""
    echo "To test installation:"
    echo "pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple/ rapid-crawl"
else
    echo ""
    read -p "⚠️  Ready to upload to PyPI. Are you sure? (y/N) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "📤 Uploading to PyPI..."
        twine upload dist/*
        
        echo ""
        echo "✅ Package uploaded to PyPI!"
        echo ""
        echo "To install:"
        echo "pip install rapid-crawl"
        echo ""
        echo "View at: https://pypi.org/project/rapid-crawl/"
    else
        echo ""
        echo "❌ Upload cancelled."
        exit 1
    fi
fi

echo ""
echo "🎉 Done!"