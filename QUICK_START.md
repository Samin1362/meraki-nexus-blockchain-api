# ⚡ Quick Start Guide

## 🎯 Current Status

✅ **Completed:**
- Contract compiled (`PaymentContract.sol` → `build/contracts/PaymentContract.json`)
- `.env` file created with template
- Dependencies installed
- Gas configuration updated to EIP-1559 (Sepolia Fusaka compatible)
- Deployment scripts ready

❌ **Needs Configuration:**
- Alchemy API key
- Deployer private key with Sepolia ETH

---

## 🚀 Next Steps (3 minutes)

### Step 1: Get Alchemy API Key (1 minute)

1. Go to https://www.alchemy.com/
2. Sign up/Login (free account)
3. Click "Create new app"
4. Select **"Ethereum"** → **"Sepolia"**
5. Copy the API key

### Step 2: Prepare Test Wallet (1 minute)

1. Open MetaMask
2. Create a **new account** (for testing only!)
3. Export the private key:
   - Click ⋮ (three dots) → Account details → Show private key
   - Copy the private key

### Step 3: Get Sepolia ETH (1 minute)

1. Copy your new wallet address
2. Visit https://sepoliafaucet.com/
3. Paste your address and request 0.5 ETH
4. Wait ~30 seconds for confirmation

### Step 4: Configure .env File

Edit the `.env` file in the project root:

```bash
# Replace these two lines with your actual values:
ALCHEMY_API_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ACTUAL_API_KEY
PRIVATE_KEY=0xYOUR_ACTUAL_PRIVATE_KEY

# Leave these as is:
CONTRACT_ADDRESS=PENDING_DEPLOYMENT
NODE_ENV=development
```

**Alternative:** If you don't want to use Alchemy, use the public RPC:
```bash
ALCHEMY_API_URL=https://ethereum-sepolia-rpc.publicnode.com
```

### Step 5: Verify Setup

```bash
cd server
node check-setup.js
```

You should see:
```
🎉 All checks passed! Setup is complete.
📋 Next step: Deploy your contract
   Run: node deploy-to-sepolia.js
```

### Step 6: Deploy Contract

```bash
node deploy-to-sepolia.js
```

Expected output:
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
⛽ Estimated gas: ~500000
⛽ Gas price: ~25 gwei

✅ Contract deployed successfully!
📄 Contract Address: 0x...
```

The script will automatically update your `.env` file with the contract address.

### Step 7: Start the Server

```bash
node src/index.js
```

You should see:
```
🚀 MerakiNexus Payment API Server Starting...
📡 Blockchain RPC: https://eth-sepolia.g.alchemy.com/v2/...
📄 Contract Address: 0xYourDeployedContractAddress
🎉 MerakiNexus Payment API running on http://localhost:3000
```

### Step 8: Test Payment (Optional)

Create a test payment:

```bash
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "0xYourSenderAddress",
    "receiver": "0xAnyReceiverAddress",
    "amount": "0.001",
    "senderPrivateKey": "0xYourSenderPrivateKey"
  }'
```

**Success response:**
```json
{
  "status": "success",
  "sender": "0x...",
  "receiver": "0x...",
  "amount": "0.001 ETH",
  "transactionHash": "0x...",
  "transactionId": "0",
  "gasUsed": "85000",
  "timestamp": "2025-11-19T12:00:00.000Z"
}
```

---

## 🔍 Troubleshooting

### "Gas estimation failed" Error

**Root causes identified:**

1. ✅ **FIXED:** Missing `.env` file
2. ✅ **FIXED:** Wrong RPC URL (was pointing to local Ganache)
3. ✅ **FIXED:** Outdated gas pricing (updated to EIP-1559)
4. ⚠️ **Need to configure:** Alchemy API key
5. ⚠️ **Need to deploy:** Contract to Sepolia
6. ⚠️ **Need funds:** Sepolia ETH in your account

**After completing the Quick Start above, all issues will be resolved!**

### Other Common Errors

| Error | Solution |
|-------|----------|
| "ALCHEMY_API_URL not configured" | Edit `.env` with your Alchemy API key |
| "Insufficient funds" | Get more Sepolia ETH from faucets |
| "Contract not compiled" | Run `truffle compile` from project root |
| "Cannot connect to RPC" | Check Alchemy API key or use public RPC |

---

## 📊 What Was Fixed

### Before:
```javascript
// Old code (causing errors)
const tx = {
  gas: 300000,
  gasPrice: 20000000000, // Fixed 20 gwei
  // ...
};
```

❌ **Problems:**
- Fixed gas price (incompatible with Sepolia Fusaka upgrade)
- No connection to Sepolia (defaulted to local Ganache)
- Contract not deployed

### After:
```javascript
// New code (EIP-1559 compatible)
const gasPrice = await web3.eth.getGasPrice();
const maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei');
const maxFeePerGas = BigInt(gasPrice) + BigInt(maxPriorityFeePerGas);

const tx = {
  gas: 300000,
  maxFeePerGas: maxFeePerGas.toString(),
  maxPriorityFeePerGas: maxPriorityFeePerGas,
  // ...
};
```

✅ **Improvements:**
- Dynamic gas pricing (EIP-1559)
- Sepolia-compatible
- Proper `.env` configuration
- Automated deployment scripts

---

## 📚 Resources

- **Setup Guide:** `SEPOLIA_SETUP.md` (detailed instructions)
- **Verification:** `node check-setup.js` (check your configuration)
- **Deployment:** `node deploy-to-sepolia.js` (deploy to Sepolia)
- **Faucets:** Get free Sepolia ETH
  - https://sepoliafaucet.com/
  - https://www.alchemy.com/faucets/ethereum-sepolia
  - https://faucet.quicknode.com/ethereum/sepolia

---

## 🎉 Summary

The "Gas estimation failed" error was caused by:
1. Missing Sepolia configuration
2. Outdated gas pricing mechanism
3. Contract not deployed

**All code issues have been fixed!** You just need to:
1. Add your Alchemy API key to `.env`
2. Add your test wallet private key to `.env`
3. Get some Sepolia ETH
4. Run `node deploy-to-sepolia.js`

**Total time: ~5 minutes** ⏱️

---

*Need help? Check `SEPOLIA_SETUP.md` for detailed troubleshooting.*

