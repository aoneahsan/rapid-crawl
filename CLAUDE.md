# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **rapid-crawl** project - a powerful Python SDK for web scraping, crawling, and data extraction. The package provides a comprehensive toolkit for extracting data from websites, handling dynamic content, and converting web pages into clean, structured formats suitable for AI and LLM applications.

### Key Information
- **Package Name**: rapid-crawl
- **Primary Language**: Python 3.8+
- **Repository**: https://github.com/aoneahsan/rapid-crawl
- **PyPI Package**: https://pypi.org/project/rapid-crawl/
- **License**: MIT

## Project Structure

```
rapid-crawl/
├── src/rapidcrawl/        # Main package source
│   ├── __init__.py        # Package exports
│   ├── client.py          # Main RapidCrawlApp client
│   ├── models.py          # Pydantic models
│   ├── exceptions.py      # Custom exceptions
│   ├── utils.py           # Utility functions
│   ├── cli.py            # CLI interface
│   └── features/         # Feature modules
│       ├── scrape.py     # Scraping functionality
│       ├── crawl.py      # Crawling functionality
│       ├── map.py        # URL mapping
│       └── search.py     # Web search
├── tests/                # Unit tests
├── scripts/              # Setup scripts
│   ├── setup.js         # NPX setup wizard
│   └── package.json     # NPX package config
├── pyproject.toml       # Python package config
├── README.md            # Documentation
└── LICENSE              # MIT license
```

## Core Features

The package implements four main features:

1. **Scrape**: Convert any URL into clean markdown or structured data
   - Multiple output formats (markdown, HTML, text, screenshot, structured data)
   - Dynamic content handling with Playwright
   - PDF and image processing
   - Custom data extraction with schemas
   - Page interactions (click, wait, scroll)

2. **Crawl**: Recursively crawl websites
   - Depth and page limits
   - URL pattern filtering (include/exclude)
   - Async support for performance
   - robots.txt compliance
   - Webhook notifications

3. **Map**: Fast URL discovery
   - Sitemap.xml parsing
   - Quick BFS crawling
   - Search filtering
   - Subdomain support

4. **Search**: Web search with scraping
   - Multiple search engines (Google, Bing, DuckDuckGo)
   - Optional result scraping
   - Date filtering
   - Location/language targeting

## Development Commands

```bash
# Install in development mode
pip install -e ".[dev]"

# Install Playwright browsers
playwright install chromium

# Run tests
pytest
pytest --cov=rapidcrawl  # with coverage

# Format code
black src/rapidcrawl

# Lint code
ruff check src/rapidcrawl

# Type checking
mypy src/rapidcrawl

# Build package
python -m build

# CLI usage
rapidcrawl --help
rapidcrawl scrape https://example.com
rapidcrawl setup  # Interactive setup wizard
```

## Key Dependencies

- **Core**: httpx, pydantic, beautifulsoup4, lxml
- **Dynamic content**: playwright
- **CLI**: click, rich
- **Text processing**: html2text, markdownify
- **PDF/Images**: PyPDF2, Pillow
- **Async**: aiofiles
- **Development**: pytest, black, ruff, mypy

## Architecture Notes

1. **Client Architecture**:
   - Main `RapidCrawlApp` client with feature modules
   - Each feature (scrape, crawl, map, search) has its own module
   - Shared utilities in `utils.py`
   - Comprehensive error handling with custom exceptions

2. **Async Support**:
   - Sync and async methods available
   - Crawler supports async for better performance
   - Rate limiting and retry decorators

3. **Configuration**:
   - Environment variables (.env file)
   - Constructor parameters
   - CLI setup wizard
   - NPX setup script for easy installation

4. **Testing**:
   - Unit tests for all major components
   - Mock-based testing for external dependencies
   - Pytest with coverage reporting

## Important Patterns

1. **Error Handling**: All operations return result objects with success/error info
2. **Validation**: Pydantic models for input validation
3. **Extensibility**: Easy to add new output formats or features
4. **CLI Design**: Rich terminal output with progress bars
5. **Documentation**: Comprehensive docstrings and type hints

## Future Enhancements

- Additional output formats
- More search engines
- Proxy support
- Enhanced rate limiting
- Cloud deployment options
- Node.js SDK (future)