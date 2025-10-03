# MerakiNexus Payment API

A blockchain payment API built with Truffle, Web3.js, and Express. Supports both local development and Sepolia testnet deployment.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file with your configuration:

```bash
# For Sepolia testnet (recommended)
ALCHEMY_API_URL=https://eth-sepolia.g.alchemy.com/v2/SNornbGAaw2Zt9pkgcMh5
PRIVATE_KEY=your_test_wallet_private_key_here
CONTRACT_ADDRESS=your_deployed_contract_address

# For local development (fallback)
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
```

### 3. Deploy Contract

**For Sepolia testnet:**

```bash
npm run deploy:sepolia
```

**For local development:**

```bash
npm run deploy:local
```

### 4. Start Server

```bash
npm start
```

## 📡 API Endpoints

### Health Check

```
GET http://localhost:3000/health
```

### Payment

```
POST http://localhost:3000/api/payment
Content-Type: application/json

{
  "sender": "0x...",
  "receiver": "0x...",
  "amount": "0.1"
}
```

## 📁 Project Structure

```
├── contracts/
│   └── PaymentContract.sol    # Smart contract
├── migrations/
│   └── 1_simpleStorage.js     # Deployment script
├── test/
│   └── PaymentContract.test.js # Tests
├── build/
│   └── contracts/             # Compiled contracts
├── server.js                  # Express API server
├── truffle-config.js         # Truffle configuration
└── package.json              # Dependencies
```

## 🎯 Features

- ✅ Send ETH payments via smart contract
- ✅ Transaction tracking and history
- ✅ Error handling and validation
- ✅ Sepolia testnet deployment
- ✅ Local development support
- ✅ Simple REST API interface

## 🔧 Development

- **Blockchain**: Alchemy Sepolia (recommended) or Ganache (localhost:7545)
- **API Server**: Express (localhost:3000)
- **Framework**: Truffle
- **Web3**: Web3.js v4

## 🌐 Sepolia Testnet

### Prerequisites

- Get Sepolia test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- Add your private key to `.env` file
- Deploy contract: `npm run deploy:sepolia`

### Important Notes

- ⚠️ You need Sepolia test ETH in your wallet to send transactions
- ⚠️ Transactions on Sepolia are real testnet transactions
- ⚠️ Keep your private key secure and never commit it to version control
