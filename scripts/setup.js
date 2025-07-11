#!/usr/bin/env node

/**
 * RapidCrawl Setup Script
 * 
 * This script helps users quickly set up RapidCrawl in their Python projects.
 * It can be run using npx for easy installation and configuration.
 * 
 * Usage: npx rapid-crawl-setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function print(message, color = '') {
  console.log(color + message + colors.reset);
}

function printHeader() {
  console.clear();
  print(`
╔═══════════════════════════════════════╗
║      RapidCrawl Setup Wizard          ║
╚═══════════════════════════════════════╝
`, colors.cyan + colors.bright);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function execCommand(command, silent = false) {
  try {
    if (!silent) print(`\n⚙️  Running: ${command}`, colors.yellow);
    const output = execSync(command, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function checkPython() {
  print('\n🐍 Checking Python installation...', colors.blue);
  
  // Try python3 first, then python
  let pythonCmd = 'python3';
  let result = execCommand('python3 --version', true);
  
  if (!result.success) {
    pythonCmd = 'python';
    result = execCommand('python --version', true);
  }
  
  if (!result.success) {
    print('❌ Python is not installed or not in PATH', colors.red);
    print('Please install Python 3.8 or higher from https://python.org', colors.yellow);
    return null;
  }
  
  const version = result.output.match(/Python (\d+\.\d+\.\d+)/);
  if (version) {
    const [major, minor] = version[1].split('.').map(Number);
    if (major < 3 || (major === 3 && minor < 8)) {
      print(`❌ Python ${version[1]} is too old. Please install Python 3.8 or higher`, colors.red);
      return null;
    }
    print(`✅ Found Python ${version[1]}`, colors.green);
  }
  
  return pythonCmd;
}

function checkPip(pythonCmd) {
  print('\n📦 Checking pip installation...', colors.blue);
  
  const result = execCommand(`${pythonCmd} -m pip --version`, true);
  
  if (!result.success) {
    print('❌ pip is not installed', colors.red);
    print('Installing pip...', colors.yellow);
    
    // Try to install pip
    const installResult = execCommand(`${pythonCmd} -m ensurepip --default-pip`);
    if (!installResult.success) {
      print('❌ Failed to install pip automatically', colors.red);
      print('Please install pip manually: https://pip.pypa.io/en/stable/installation/', colors.yellow);
      return false;
    }
  }
  
  print('✅ pip is installed', colors.green);
  return true;
}

async function createVirtualEnv(pythonCmd) {
  const useVenv = await question('\n🌐 Do you want to create a virtual environment? (recommended) [Y/n]: ');
  
  if (useVenv.toLowerCase() === 'n') {
    return null;
  }
  
  const venvName = await question('📁 Virtual environment name [venv]: ') || 'venv';
  
  print(`\n🔧 Creating virtual environment: ${venvName}`, colors.blue);
  const result = execCommand(`${pythonCmd} -m venv ${venvName}`);
  
  if (!result.success) {
    print('❌ Failed to create virtual environment', colors.red);
    return null;
  }
  
  print('✅ Virtual environment created', colors.green);
  
  // Determine activation command based on OS
  const isWindows = process.platform === 'win32';
  const activateCmd = isWindows 
    ? `${venvName}\\Scripts\\activate`
    : `source ${venvName}/bin/activate`;
  
  print(`\n💡 To activate the virtual environment, run:`, colors.yellow);
  print(`   ${activateCmd}`, colors.cyan);
  
  return { name: venvName, activateCmd };
}

async function installRapidCrawl(pythonCmd, venv) {
  print('\n📥 Installing RapidCrawl...', colors.blue);
  
  // Determine pip command
  let pipCmd = `${pythonCmd} -m pip`;
  if (venv) {
    const isWindows = process.platform === 'win32';
    pipCmd = isWindows 
      ? `${venv.name}\\Scripts\\pip`
      : `${venv.name}/bin/pip`;
  }
  
  // Install RapidCrawl
  const result = execCommand(`${pipCmd} install rapid-crawl`);
  
  if (!result.success) {
    print('❌ Failed to install RapidCrawl', colors.red);
    print('Trying alternative installation method...', colors.yellow);
    
    // Try with --user flag
    const altResult = execCommand(`${pipCmd} install --user rapid-crawl`);
    if (!altResult.success) {
      return false;
    }
  }
  
  print('✅ RapidCrawl installed successfully', colors.green);
  
  // Install Playwright browsers
  const installPlaywright = await question('\n🎭 Install Playwright browsers for dynamic content? [Y/n]: ');
  
  if (installPlaywright.toLowerCase() !== 'n') {
    print('\n📥 Installing Playwright browsers...', colors.blue);
    const playwrightCmd = venv 
      ? (process.platform === 'win32' 
          ? `${venv.name}\\Scripts\\playwright`
          : `${venv.name}/bin/playwright`)
      : 'playwright';
    
    execCommand(`${playwrightCmd} install chromium`);
    print('✅ Playwright browsers installed', colors.green);
  }
  
  return true;
}

async function configureRapidCrawl() {
  print('\n⚙️  Configuring RapidCrawl...', colors.blue);
  
  const config = {};
  
  // API Key
  const apiKey = await question('\n🔑 API Key (leave empty for self-hosted mode): ');
  if (apiKey) {
    config.RAPIDCRAWL_API_KEY = apiKey;
  }
  
  // Base URL
  const useCustomUrl = await question('\n🌐 Use custom API URL? [y/N]: ');
  if (useCustomUrl.toLowerCase() === 'y') {
    const baseUrl = await question('📍 API Base URL: ');
    config.RAPIDCRAWL_BASE_URL = baseUrl;
  }
  
  // Timeout
  const customTimeout = await question('\n⏱️  Custom timeout in seconds (default: 30): ');
  if (customTimeout) {
    config.RAPIDCRAWL_TIMEOUT = customTimeout;
  }
  
  // Write .env file
  if (Object.keys(config).length > 0) {
    const envPath = path.join(process.cwd(), '.env');
    const envExists = fs.existsSync(envPath);
    
    if (envExists) {
      const overwrite = await question('\n⚠️  .env file already exists. Overwrite? [y/N]: ');
      if (overwrite.toLowerCase() !== 'y') {
        print('ℹ️  Skipping .env file creation', colors.yellow);
        return;
      }
    }
    
    let envContent = '# RapidCrawl Configuration\n';
    for (const [key, value] of Object.entries(config)) {
      envContent += `${key}=${value}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    print('✅ Configuration saved to .env file', colors.green);
  }
}

async function createExampleScript(venv) {
  const createExample = await question('\n📝 Create example script? [Y/n]: ');
  
  if (createExample.toLowerCase() === 'n') {
    return;
  }
  
  const exampleContent = `#!/usr/bin/env python3
"""
RapidCrawl Example Script

This script demonstrates basic usage of the RapidCrawl SDK.
"""

from rapidcrawl import RapidCrawlApp
import json

def main():
    # Initialize the client
    app = RapidCrawlApp(debug=True)
    
    # Example 1: Scrape a single page
    print("\\n🔍 Example 1: Scraping a single page...")
    result = app.scrape_url(
        "https://example.com",
        formats=["markdown", "text"]
    )
    
    if result.success:
        print(f"✅ Scraped successfully!")
        print(f"Title: {result.title}")
        print(f"Content preview: {result.content['text'][:200]}...")
    else:
        print(f"❌ Scraping failed: {result.error}")
    
    # Example 2: Map a website
    print("\\n🗺️  Example 2: Mapping a website...")
    map_result = app.map_url(
        "https://example.com",
        limit=20
    )
    
    if map_result.success:
        print(f"✅ Found {map_result.total_urls} URLs")
        print("First 5 URLs:")
        for url in map_result.urls[:5]:
            print(f"  - {url}")
    
    # Example 3: Search the web
    print("\\n🔎 Example 3: Searching the web...")
    search_result = app.search(
        "Python web scraping tutorial",
        num_results=5
    )
    
    if search_result.success:
        print(f"✅ Found {search_result.total_results} results")
        for item in search_result.results:
            print(f"\\n{item.position}. {item.title}")
            print(f"   {item.url}")
            print(f"   {item.snippet[:100]}...")

if __name__ == "__main__":
    main()
`;

  const filename = 'rapidcrawl_example.py';
  fs.writeFileSync(filename, exampleContent);
  
  print(`\n✅ Created example script: ${filename}`, colors.green);
  
  const runCmd = venv 
    ? (process.platform === 'win32'
        ? `${venv.name}\\Scripts\\python`
        : `${venv.name}/bin/python`)
    : 'python';
  
  print(`\n💡 To run the example:`, colors.yellow);
  if (venv) {
    print(`   ${venv.activateCmd}`, colors.cyan);
  }
  print(`   ${runCmd} ${filename}`, colors.cyan);
}

async function main() {
  printHeader();
  
  print('Welcome to RapidCrawl Setup! This wizard will help you get started.\n', colors.bright);
  
  // Check Python
  const pythonCmd = checkPython();
  if (!pythonCmd) {
    rl.close();
    process.exit(1);
  }
  
  // Check pip
  if (!checkPip(pythonCmd)) {
    rl.close();
    process.exit(1);
  }
  
  // Create virtual environment
  const venv = await createVirtualEnv(pythonCmd);
  
  // Install RapidCrawl
  if (!await installRapidCrawl(pythonCmd, venv)) {
    print('\n❌ Setup failed. Please check the error messages above.', colors.red);
    rl.close();
    process.exit(1);
  }
  
  // Configure RapidCrawl
  await configureRapidCrawl();
  
  // Create example script
  await createExampleScript(venv);
  
  // Success message
  print('\n🎉 Setup completed successfully!', colors.green + colors.bright);
  print('\n📚 Next steps:', colors.yellow);
  print('   1. Review the documentation: https://github.com/aoneahsan/rapid-crawl', colors.cyan);
  print('   2. Check out the examples in the README', colors.cyan);
  print('   3. Start building with RapidCrawl!', colors.cyan);
  
  print('\n💡 Quick commands:', colors.yellow);
  if (venv) {
    print(`   Activate venv: ${venv.activateCmd}`, colors.cyan);
  }
  print('   Python SDK: python -c "from rapidcrawl import RapidCrawlApp; print(RapidCrawlApp)"', colors.cyan);
  print('   CLI tool: rapidcrawl --help', colors.cyan);
  
  rl.close();
}

// Handle errors
process.on('uncaughtException', (error) => {
  print(`\n❌ Unexpected error: ${error.message}`, colors.red);
  rl.close();
  process.exit(1);
});

// Run main function
main().catch((error) => {
  print(`\n❌ Setup error: ${error.message}`, colors.red);
  rl.close();
  process.exit(1);
});