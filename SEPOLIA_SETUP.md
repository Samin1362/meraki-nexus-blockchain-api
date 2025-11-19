# 🚀 Sepolia Testnet Setup Guide

This guide will help you deploy and run the MerakiNexus Payment API on Sepolia testnet.

## 📋 Prerequisites

Before you begin, you need:

1. **Alchemy API Key** (Free)
   - Sign up at: https://www.alchemy.com/
   - Create a new app on **Sepolia testnet**
   - Copy the API key from your dashboard

2. **Test Wallet with Sepolia ETH**
   - Create a new MetaMask account (for testing only!)
   - Export the private key
   - Get free Sepolia ETH from faucets:
     - https://sepoliafaucet.com/
     - https://www.alchemy.com/faucets/ethereum-sepolia
     - https://faucet.quicknode.com/ethereum/sepolia
   - You need at least **0.01 ETH** for deployment

## 🔧 Step-by-Step Setup

### Step 1: Configure Environment Variables

Edit the `.env` file in the project root:

```bash
# Open .env file
nano .env  # or use any text editor
```

Update these values:

```bash
# Replace YOUR_ALCHEMY_KEY_HERE with your actual API key
ALCHEMY_API_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ACTUAL_API_KEY

# Replace YOUR_PRIVATE_KEY_HERE with your test wallet private key
PRIVATE_KEY=0xYOUR_ACTUAL_PRIVATE_KEY

# Leave these as is
CONTRACT_ADDRESS=PENDING_DEPLOYMENT
NODE_ENV=development
```

⚠️ **IMPORTANT:** Never commit the `.env` file to git! It contains your private key.

### Step 2: Verify Configuration

Run the verification script to check your setup:

```bash
node check-setup.js
```

This will verify:
- ✅ Alchemy API connection
- ✅ Account has Sepolia ETH
- ✅ Contract is compiled
- ✅ All dependencies installed

### Step 3: Deploy Contract to Sepolia

Run the deployment script:

```bash
node deploy-to-sepolia.js
```

This script will:
1. Connect to Sepolia testnet
2. Check your account balance
3. Deploy the PaymentContract
4. Automatically update `.env` with the contract address
5. Verify the deployment

**Expected output:**
```
🚀 MerakiNexus - Sepolia Deployment Script
==========================================

🔗 Connecting to Sepolia testnet...
✅ Connected with account: 0xYourAddress
✅ Connected to Sepolia (Chain ID: 11155111)
💰 Account balance: 0.5 ETH

📄 Loading PaymentContract...
✅ Contract loaded

🚀 Deploying contract to Sepolia...
   This may take 30-60 seconds...
⛽ Estimated gas: 500000
⛽ Gas price: 25 gwei

✅ Contract deployed successfully!
📄 Contract Address: 0xNewContractAddress

📝 Updating .env file...
✅ .env file updated

🎉 Deployment complete!
```

### Step 4: Start the Server

```bash
cd server
node src/index.js
```

You should see:

```
🚀 MerakiNexus Payment API Server Starting...
📡 Blockchain RPC: https://eth-sepolia.g.alchemy.com/v2/...
📄 Contract Address: 0xYourDeployedAddress
🎉 MerakiNexus Payment API running on http://localhost:3000
```

### Step 5: Test the Payment API

Create a test payment:

```bash
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "0xYourSenderAddress",
    "receiver": "0xReceiverAddress",
    "amount": "0.001",
    "senderPrivateKey": "0xSenderPrivateKey"
  }'
```

**Success response:**

```json
{
  "status": "success",
  "sender": "0xYourSenderAddress",
  "receiver": "0xReceiverAddress",
  "amount": "0.001 ETH",
  "transactionHash": "0x...",
  "transactionId": "0",
  "gasUsed": "85000",
  "timestamp": "2025-11-19T12:00:00.000Z"
}
```

## 🔍 Troubleshooting

### Error: "Gas estimation failed"

**Causes:**
1. Wrong RPC URL in `.env`
2. Contract not deployed
3. Insufficient funds (need amount + gas)
4. Network congestion

**Solutions:**
- Verify `.env` configuration
- Check Sepolia ETH balance: https://sepolia.etherscan.io/address/YOUR_ADDRESS
- Wait and try again if network is congested
- Make sure contract is deployed

### Error: "Insufficient funds"

**Solution:**
Get more Sepolia ETH from faucets:
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

### Error: "Cannot connect to RPC"

**Solutions:**
- Check your Alchemy API key is correct
- Verify API key has Sepolia testnet enabled
- Try using public RPC: `https://ethereum-sepolia-rpc.publicnode.com`

## 📊 Verify Your Contract

After deployment, verify your contract on Etherscan:

1. Go to: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
2. You should see:
   - Contract creation transaction
   - Contract balance
   - Transaction history

## 🔐 Security Best Practices

1. **Never use your real wallet** - Always use a dedicated test wallet
2. **Never commit `.env`** - It's already in `.gitignore`
3. **Never share private keys** - Not even test keys publicly
4. **Use environment variables** - Never hardcode sensitive data

## 📈 Recent Sepolia Changes (November 2025)

Sepolia underwent the **Fusaka upgrade** in October 2025:
- Block gas limit increased to 60 million
- Implemented Peer Data Availability Sampling (PeerDAS)
- **EIP-1559 gas pricing now mandatory**

Our code has been updated to use EIP-1559 format (`maxFeePerGas` + `maxPriorityFeePerGas`).

## 🎯 Next Steps

After successful deployment:

1. **Test different payment amounts**
2. **Monitor transactions** on Sepolia Etherscan
3. **Integrate with your frontend**
4. **Consider deploying to mainnet** (with real security audit!)

## 📞 Need Help?

- Check server logs for detailed error messages
- Run `node check-setup.js` to diagnose issues
- Verify contract on Sepolia Etherscan
- Check Alchemy dashboard for API usage

---

**Happy Testing! 🎉**

