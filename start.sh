#!/bin/bash

# Startup script for Render deployment
echo "=== Render Startup Script ==="
echo "Current working directory: $(pwd)"
echo "Directory listing:"
ls -la

echo "=== Checking for dist directory ==="
if [ -d "dist" ]; then
    echo "✓ dist directory found"
    echo "Contents of dist:"
    ls -la dist/
    
    if [ -f "dist/index.js" ]; then
        echo "✓ dist/index.js found"
        echo "Starting application..."
        node dist/index.js
    else
        echo "✗ dist/index.js not found"
        exit 1
    fi
else
    echo "✗ dist directory not found"
    echo "Looking for dist in parent directories..."
    
    # Check parent directory
    if [ -d "../dist" ]; then
        echo "✓ Found dist in parent directory"
        cd ..
        echo "Changed to: $(pwd)"
        ls -la
        node dist/index.js
    else
        echo "✗ dist directory not found anywhere"
        exit 1
    fi
fi
