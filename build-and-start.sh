#!/bin/bash
echo "=== Build Verification Script ==="
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo "=== Running build ==="
npm run build

echo "=== Post-build directory contents ==="
ls -la

echo "=== Checking dist directory ==="
if [ -d "dist" ]; then
    echo "✓ dist directory exists"
    ls -la dist/
    if [ -f "dist/index.js" ]; then
        echo "✓ dist/index.js exists"
    else
        echo "✗ dist/index.js does not exist"
        exit 1
    fi
else
    echo "✗ dist directory does not exist"
    exit 1
fi

echo "=== Running Prisma migrations ==="
npm run prisma:migrate:prod

echo "=== Starting application ==="
npm start
