# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **rapid-crawl** project - a Python package that aims to clone the functionality of Firecrawl. The project is in its initial setup phase.

### Key Information
- **Package Name**: rapid-crawl
- **Primary Language**: Python (initially, with plans for Node.js and other languages later)
- **Repository**: https://github.com/aoneahsan/rapid-crawl
- **npm Package URL**: http://npmjs.com/package/rapid-crawl (future)

## Core Features to Implement

The package will implement four main features from Firecrawl:

1. **Scrape**: Convert any URL into clean markdown or structured data
   - Handle dynamic content, JS-rendered sites, PDFs, images
   - Manage proxies, caching, rate limits, JS-blocked content
   - Output formats: markdown, structured data, screenshots, HTML

2. **Crawl**: Recursively search through URL subdomains
   - Analyze sitemap and identify links
   - Traverse recursively to find all subpages
   - Extract and convert content to clean formats

3. **Map**: Get all URLs from a website quickly
   - Useful for prompting users to choose which links to scrape
   - Support search parameter for topic-specific pages
   - Enable selective page scraping

4. **Search**: Web search with full content retrieval
   - Customizable search parameters (location, etc.)
   - Optional content scraping from results
   - Multiple output formats
   - Configurable result limits and timeouts

## Development Setup

Since this is a new Python project, you'll need to:

1. **Initialize Python Project Structure**:
   - Create `pyproject.toml` or `setup.py` for package configuration
   - Set up `requirements.txt` or use Poetry/pipenv for dependencies
   - Create standard Python package structure: `rapid_crawl/` directory with `__init__.py`

2. **Essential Commands** (to be implemented):
   ```bash
   # Install dependencies
   pip install -r requirements.txt
   
   # Run tests
   pytest
   
   # Lint code
   flake8 rapid_crawl/
   # or
   ruff check rapid_crawl/
   
   # Format code
   black rapid_crawl/
   
   # Type checking
   mypy rapid_crawl/
   ```

## Architecture Considerations

When implementing the rapid-crawl package:

1. **Module Structure**:
   - `rapid_crawl/scraper/` - Web scraping functionality
   - `rapid_crawl/crawler/` - Recursive crawling logic
   - `rapid_crawl/mapper/` - URL mapping features
   - `rapid_crawl/search/` - Web search integration
   - `rapid_crawl/utils/` - Shared utilities (rate limiting, proxy management, etc.)

2. **Key Dependencies to Consider**:
   - Web scraping: `beautifulsoup4`, `requests`, `playwright` or `selenium` for JS rendering
   - Async operations: `aiohttp`, `asyncio`
   - HTML to Markdown: `markdownify` or `html2text`
   - PDF handling: `PyPDF2` or `pdfplumber`

3. **Important Design Patterns**:
   - Use async/await for concurrent operations
   - Implement proper rate limiting and retry logic
   - Create abstraction layers for different output formats
   - Design modular architecture to support future language ports

## Reference Documentation

Firecrawl documentation for feature specifications:
- Scrape: https://docs.firecrawl.dev/features/scrape
- Crawl: https://docs.firecrawl.dev/features/crawl
- Map: https://docs.firecrawl.dev/features/map
- Search: https://docs.firecrawl.dev/features/search