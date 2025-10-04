#!/bin/bash

# Build script for Netlify deployment
echo "🚀 Starting build process for MerakiNexus Payment Frontend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build files are in the 'build' directory"
    echo "🌐 Ready for Netlify deployment"
else
    echo "❌ Build failed!"
    exit 1
fi
