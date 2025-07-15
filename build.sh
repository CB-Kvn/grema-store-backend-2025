#!/bin/bash
# Build script for production

echo "Starting production build..."

# Install dependencies
npm ci --only=production

# Generate Prisma client
npx prisma generate

# Build TypeScript
npm run build

# Run database migrations
# npx prisma migrate deploy

echo "Build completed successfully!"
