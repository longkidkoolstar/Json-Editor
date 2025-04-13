// Simple build script for the JSON Editor
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

// Create a build directory if it doesn't exist
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
    console.log('Created build directory');
}

// Copy static files to build directory
const filesToCopy = [
    'index.html',
    'server.js',
    'vercel.json',
    'package.json',
    'package-lock.json'
];

// Copy directories to build directory
const dirsToCopy = [
    'css',
    'js',
    'supabase'
];

// Copy static assets to public directory
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('Created public directory');
}

// Copy CSS and JS to public directory for static serving
const publicDirs = ['css', 'js'];

// Also copy index.html to public directory
if (fs.existsSync(path.join(__dirname, 'index.html'))) {
    fs.copyFileSync(
        path.join(__dirname, 'index.html'),
        path.join(publicDir, 'index.html')
    );
    console.log('Copied index.html to public directory');
}
publicDirs.forEach(dir => {
    const srcDir = path.join(__dirname, dir);
    const destDir = path.join(publicDir, dir);

    if (fs.existsSync(srcDir)) {
        // Create destination directory if it doesn't exist
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Copy all files in the directory
        const files = fs.readdirSync(srcDir);
        files.forEach(file => {
            const srcFile = path.join(srcDir, file);
            const destFile = path.join(destDir, file);

            if (fs.statSync(srcFile).isFile()) {
                fs.copyFileSync(srcFile, destFile);
                console.log(`Copied ${path.join(dir, file)} to public directory`);
            }
        });
    }
});

// Copy individual files
filesToCopy.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        fs.copyFileSync(
            path.join(__dirname, file),
            path.join(buildDir, file)
        );
        console.log(`Copied ${file} to build directory`);
    }
});

// Copy directories recursively
dirsToCopy.forEach(dir => {
    const srcDir = path.join(__dirname, dir);
    const destDir = path.join(buildDir, dir);

    if (fs.existsSync(srcDir)) {
        // Create destination directory if it doesn't exist
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Copy all files in the directory
        const files = fs.readdirSync(srcDir);
        files.forEach(file => {
            const srcFile = path.join(srcDir, file);
            const destFile = path.join(destDir, file);

            if (fs.statSync(srcFile).isFile()) {
                fs.copyFileSync(srcFile, destFile);
                console.log(`Copied ${path.join(dir, file)} to build directory`);
            }
        });
    }
});

console.log('Build completed successfully!');
