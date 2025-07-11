# Publishing RapidCrawl to PyPI

This guide walks you through publishing RapidCrawl to PyPI (Python Package Index).

## Prerequisites

- [ ] Python 3.8+ installed
- [ ] pip, build, and twine installed (`pip install --upgrade pip build twine`)
- [ ] PyPI account created at https://pypi.org/account/register/
- [ ] Email verified on PyPI
- [ ] 2FA enabled on PyPI (recommended)
- [ ] API token generated at https://pypi.org/manage/account/token/

## First-Time Setup

### 1. Create PyPI Configuration

Copy `.pypirc.template` to `~/.pypirc` and add your tokens:

```bash
cp .pypirc.template ~/.pypirc
chmod 600 ~/.pypirc
```

Edit `~/.pypirc` and replace:
- `<your-pypi-token>` with your PyPI API token
- `<your-testpypi-token>` with your TestPyPI API token (optional)

### 2. Verify Installation

```bash
# Check tools are installed
python --version
pip --version
twine --version
```

## Publishing Process

### Option 1: Using the Publish Script (Recommended)

```bash
# Test upload (to TestPyPI)
./scripts/publish.sh --test

# Production upload (to PyPI)
./scripts/publish.sh
```

### Option 2: Manual Process

1. **Run Tests**
   ```bash
   pytest
   ```

2. **Clean Previous Builds**
   ```bash
   rm -rf dist/ build/ *.egg-info/
   ```

3. **Build Package**
   ```bash
   python -m build
   ```

4. **Check Package Quality**
   ```bash
   twine check dist/*
   ```

5. **Upload to TestPyPI (Optional)**
   ```bash
   twine upload --repository testpypi dist/*
   ```

6. **Test Installation from TestPyPI**
   ```bash
   pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple/ rapid-crawl
   ```

7. **Upload to PyPI**
   ```bash
   twine upload dist/*
   ```

## Post-Publishing Tasks

### 1. Verify Installation

```bash
# Install from PyPI
pip install rapid-crawl

# Test it works
python -c "from rapidcrawl import RapidCrawlApp; print('Success!')"
rapidcrawl --version
```

### 2. Create GitHub Release

```bash
# Tag the release
git tag -a v0.1.0 -m "Initial release of RapidCrawl"
git push origin v0.1.0
```

Then on GitHub:
1. Go to https://github.com/aoneahsan/rapid-crawl/releases
2. Click "Create a new release"
3. Select the tag `v0.1.0`
4. Add release notes from CHANGELOG.md
5. Upload `dist/*.whl` and `dist/*.tar.gz` as release assets
6. Publish release

### 3. Update Documentation

- [ ] Add PyPI badge to README: `![PyPI](https://img.shields.io/pypi/v/rapid-crawl)`
- [ ] Update installation instructions
- [ ] Announce on social media
- [ ] Update project website

## Version Management

Before releasing a new version:

1. Update version in `pyproject.toml`
2. Update `CHANGELOG.md` with release notes
3. Commit changes: `git commit -m "Bump version to X.Y.Z"`
4. Follow the publishing process above

## Troubleshooting

### Authentication Error

If you get "403 Forbidden" or authentication errors:
- Ensure your API token starts with `pypi-`
- Check token has upload permissions
- Verify token is in correct section of `.pypirc`

### Package Name Conflict

If the package name is taken:
- Choose a different name in `pyproject.toml`
- Update all references to the package name
- Rebuild and republish

### Build Errors

If build fails:
- Check all dependencies are listed in `pyproject.toml`
- Ensure all source files are in `src/rapidcrawl/`
- Verify no syntax errors: `python -m py_compile src/rapidcrawl/**/*.py`

## Security Notes

- **Never commit `.pypirc` to version control**
- Keep your PyPI tokens secure
- Use 2FA on your PyPI account
- Regularly rotate API tokens
- Review package contents before uploading

## Support

If you encounter issues:
1. Check the [Packaging Python Projects](https://packaging.python.org/tutorials/packaging-projects/) guide
2. Review [Twine documentation](https://twine.readthedocs.io/)
3. Ask on [Python Packaging Discourse](https://discuss.python.org/c/packaging/)

---

Remember: Once you upload a specific version to PyPI, you cannot overwrite it. Always test thoroughly before publishing!