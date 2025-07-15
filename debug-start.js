#!/usr/bin/env node
// Debug script to help identify path issues on Render

const fs = require('fs');
const path = require('path');

console.log('=== Debug Information ===');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('__filename:', __filename);

// Check if dist directory exists
const distPath = path.join(process.cwd(), 'dist');
console.log('Looking for dist at:', distPath);

if (fs.existsSync(distPath)) {
    console.log('✓ dist directory exists');
    
    const indexPath = path.join(distPath, 'index.js');
    console.log('Looking for index.js at:', indexPath);
    
    if (fs.existsSync(indexPath)) {
        console.log('✓ index.js exists');
        console.log('Starting application...');
        
        // Start the application
        require(indexPath);
    } else {
        console.log('✗ index.js does not exist');
        
        // List contents of dist
        const distContents = fs.readdirSync(distPath);
        console.log('Contents of dist:', distContents);
        
        process.exit(1);
    }
} else {
    console.log('✗ dist directory does not exist');
    
    // List contents of current directory
    const currentContents = fs.readdirSync(process.cwd());
    console.log('Contents of current directory:', currentContents);
    
    // Check if we're in the src directory by mistake
    const parentPath = path.join(process.cwd(), '..');
    const parentDistPath = path.join(parentPath, 'dist');
    
    console.log('Checking parent directory for dist:', parentDistPath);
    
    if (fs.existsSync(parentDistPath)) {
        console.log('✓ Found dist in parent directory');
        
        const parentIndexPath = path.join(parentDistPath, 'index.js');
        if (fs.existsSync(parentIndexPath)) {
            console.log('✓ index.js found in parent dist');
            console.log('Changing working directory to:', parentPath);
            process.chdir(parentPath);
            
            // Start the application
            require(parentIndexPath);
        } else {
            console.log('✗ index.js not found in parent dist');
            process.exit(1);
        }
    } else {
        console.log('✗ dist not found in parent directory either');
        process.exit(1);
    }
}
