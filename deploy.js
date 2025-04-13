const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

console.log(`${colors.blue}=== JSON Editor Deployment Script ===${colors.reset}\n`);

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log(`${colors.yellow}Warning: No .env file found.${colors.reset}`);
  console.log('Creating .env file from .env.example...');
  
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env');
    console.log(`${colors.green}Created .env file. Please update it with your Supabase credentials.${colors.reset}`);
  } else {
    console.log(`${colors.red}Error: .env.example file not found.${colors.reset}`);
    process.exit(1);
  }
}

// Build the application
console.log(`\n${colors.blue}Building the application...${colors.reset}`);
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log(`${colors.green}Build successful!${colors.reset}`);
} catch (error) {
  console.log(`${colors.red}Build failed: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Check if dist directory exists
if (!fs.existsSync('dist')) {
  console.log(`${colors.red}Error: dist directory not found after build.${colors.reset}`);
  process.exit(1);
}

console.log(`\n${colors.green}Deployment package ready!${colors.reset}`);
console.log(`\nYou can now deploy the 'dist' directory to your hosting provider.`);
console.log(`\n${colors.yellow}Remember to set the following environment variables on your hosting platform:${colors.reset}`);
console.log(`- SUPABASE_URL`);
console.log(`- SUPABASE_KEY`);

console.log(`\n${colors.blue}=== Deployment preparation complete ===${colors.reset}`);
