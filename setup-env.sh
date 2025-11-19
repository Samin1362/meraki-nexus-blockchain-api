#!/bin/bash

# MerakiNexus Blockchain API - Environment Setup Script
# This script helps you create the .env file for Sepolia testnet

echo "🚀 MerakiNexus Blockchain API - Sepolia Setup"
echo "=============================================="
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

echo "📝 Please provide the following information:"
echo ""

# Get Alchemy API Key
echo "1️⃣  Alchemy API Setup"
echo "   Get your free API key from: https://www.alchemy.com/"
echo "   - Create an account"
echo "   - Create a new app on Sepolia testnet"
echo "   - Copy the API key from your dashboard"
echo ""
read -p "Enter your Alchemy API Key (or press Enter to use default RPC): " ALCHEMY_KEY

if [ -z "$ALCHEMY_KEY" ]; then
    ALCHEMY_API_URL="https://ethereum-sepolia-rpc.publicnode.com"
    echo "   Using public Sepolia RPC (rate limited)"
else
    ALCHEMY_API_URL="https://eth-sepolia.g.alchemy.com/v2/$ALCHEMY_KEY"
    echo "   ✅ Alchemy API URL configured"
fi

echo ""

# Get Private Key
echo "2️⃣  Deployer Account Setup"
echo "   You need a private key for deploying the contract"
echo "   ⚠️  NEVER share this key or commit it to git!"
echo "   - Create a new MetaMask account for testing"
echo "   - Export the private key (without 0x prefix)"
echo "   - Get Sepolia ETH from: https://sepoliafaucet.com/"
echo ""
read -p "Enter your deployer private key (without 0x): " PRIVATE_KEY

if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Private key is required for deployment"
    exit 1
fi

# Add 0x prefix if not present
if [[ ! $PRIVATE_KEY == 0x* ]]; then
    PRIVATE_KEY="0x$PRIVATE_KEY"
fi

echo ""
echo "✅ Configuration ready!"
echo ""

# Create .env file
cat > .env << EOF
# Alchemy Sepolia Configuration
ALCHEMY_API_URL=$ALCHEMY_API_URL
CONTRACT_ADDRESS=PENDING_DEPLOYMENT

# Deployer Private Key (for contract deployment only)
# NEVER commit this file to git!
PRIVATE_KEY=$PRIVATE_KEY

# Local development (fallback)
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545

# Environment
NODE_ENV=development
EOF

echo "✅ .env file created successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Verify you have Sepolia ETH in your deployer account"
echo "   2. Run: truffle migrate --network sepolia"
echo "   3. The script will update CONTRACT_ADDRESS automatically"
echo ""
echo "💡 Check your balance at:"
echo "   https://sepolia.etherscan.io/"
echo ""

