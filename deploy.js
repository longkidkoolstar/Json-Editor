// Simple deployment script for Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting deployment process...');

// First, run the build
console.log('Building the project...');
try {
    execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}

// Check if vercel CLI is installed
try {
    execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
    console.log('Vercel CLI not found. Installing...');
    try {
        execSync('npm install -g vercel', { stdio: 'inherit' });
    } catch (installError) {
        console.error('Failed to install Vercel CLI:', installError);
        process.exit(1);
    }
}

// Deploy to Vercel
console.log('Deploying to Vercel...');
try {
    // Use --yes to skip confirmation prompts
    execSync('vercel --prod --yes', { stdio: 'inherit' });
    console.log('Deployment completed successfully!');
} catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
}
