#!/bin/bash

echo "🚀 Deploying MerakiNexus Payment API + Frontend to Vercel..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your app will be available at the URL provided by Vercel"
