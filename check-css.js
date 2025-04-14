// This script checks if the CSS files are being served correctly
const http = require('http');
const fs = require('fs');
const path = require('path');

// Check if the CSS file exists in the public directory
const publicCssPath = path.join(__dirname, 'public', 'css', 'styles.css');
console.log(`Checking if CSS file exists at: ${publicCssPath}`);
if (fs.existsSync(publicCssPath)) {
    console.log('✅ CSS file exists in public/css/styles.css');
} else {
    console.log('❌ CSS file does not exist in public/css/styles.css');
}

// Check if the CSS file exists in the root directory
const rootCssPath = path.join(__dirname, 'css', 'styles.css');
console.log(`Checking if CSS file exists at: ${rootCssPath}`);
if (fs.existsSync(rootCssPath)) {
    console.log('✅ CSS file exists in css/styles.css');
} else {
    console.log('❌ CSS file does not exist in css/styles.css');
}

// Check if the public/index.html file references the correct CSS path
const publicHtmlPath = path.join(__dirname, 'public', 'index.html');
console.log(`Checking if public/index.html references the correct CSS path`);
if (fs.existsSync(publicHtmlPath)) {
    const htmlContent = fs.readFileSync(publicHtmlPath, 'utf8');
    if (htmlContent.includes('href="css/styles.css"')) {
        console.log('✅ public/index.html references css/styles.css');
    } else {
        console.log('❌ public/index.html does not reference css/styles.css');
    }
} else {
    console.log('❌ public/index.html does not exist');
}

console.log('\nRecommendation:');
console.log('1. Make sure the CSS file exists in public/css/styles.css');
console.log('2. Make sure public/index.html references the CSS file with href="css/styles.css"');
console.log('3. Update vercel.json to serve static files from the public directory');
