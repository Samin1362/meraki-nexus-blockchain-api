# MerakiNexus Payment API

A blockchain payment API built with Truffle, Web3.js, and Express. Supports both local development with Ganache and remote deployment on Vercel with Alchemy Sepolia.

## 🏗️ Project Structure

```
MerakiNexus-Payment-API/
├── server/                     # Node.js backend
│   ├── server.js              # Express API server
│   ├── package.json           # Server dependencies
│   └── package-lock.json      # Lock file
├── contracts/                  # Smart contracts
│   └── PaymentContract.sol     # Payment smart contract
├── migrations/                 # Deployment scripts
│   └── 1_paymentContract.js   # Contract deployment
├── test/                       # Tests
│   └── PaymentContract.test.js # Contract tests
├── build/                      # Compiled contracts
│   └── contracts/
│       └── PaymentContract.json
├── frontend/                   # Frontend (if needed)
├── truffle-config.js          # Truffle configuration
├── vercel.json                # Vercel deployment config
├── .env.template              # Environment template
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp .env.template .env

# Edit .env with your values
nano .env
```

### 2. Install Dependencies

```bash
npm run setup
```

### 3. Deploy Contract

**For Local Development (Ganache):**

```bash
# Start Ganache first, then:
npm run deploy:local
```

**For Sepolia Testnet:**

```bash
npm run deploy:sepolia
```

### 4. Start Server

**Local Development:**

```bash
npm start
```

**With Custom Environment:**

```bash
cd server && node server.js
```

## 🔧 Environment Configuration

### Local Development (.env)

```bash
# Use Ganache for local development
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
CONTRACT_ADDRESS=your_local_contract_address
NODE_ENV=development
PORT=3000
```

### Remote Deployment (Vercel Environment Variables)

```bash
# Set these in Vercel Dashboard > Settings > Environment Variables
ALCHEMY_API_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=your_sepolia_contract_address
NODE_ENV=production
PORT=3000
```

## 📡 API Endpoints

### Health Check

```
GET /health
```

### Payment

```
POST /api/payment
Content-Type: application/json

{
  "sender": "0x...",
  "receiver": "0x...",
  "amount": "0.1"
}
```

## 🌐 Deployment

### Local Development

1. Start Ganache
2. Deploy: `npm run deploy:local`
3. Start server: `npm start`
4. Test: `curl http://localhost:3000/health`

### Vercel Deployment

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Vercel

- `ALCHEMY_API_URL`: Your Alchemy Sepolia endpoint
- `PRIVATE_KEY`: Your wallet private key
- `CONTRACT_ADDRESS`: Deployed contract address
- `NODE_ENV`: production

## 🎯 Features

- ✅ **Dual Environment**: Local (Ganache) + Remote (Sepolia)
- ✅ **Secure**: Environment variables protected
- ✅ **Deployable**: Vercel-ready configuration
- ✅ **Tested**: Comprehensive test suite
- ✅ **Documented**: Clear setup instructions

## 🔒 Security

- ✅ `.env` files are gitignored
- ✅ Private keys never committed
- ✅ Environment-specific configurations
- ✅ Secure deployment practices

## 🧪 Testing

```bash
# Run tests
npm test

# Test API locally
curl http://localhost:3000/health

# Test payment
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{"sender":"0x...","receiver":"0x...","amount":"0.001"}'
```

## 📝 Development Workflow

1. **Local Development**: Use Ganache + local .env
2. **Testing**: Deploy to Sepolia testnet
3. **Production**: Deploy to Vercel with environment variables
4. **Security**: Never commit .env files

## 🚨 Important Notes

- ⚠️ **Never commit `.env` files to Git**
- ⚠️ **Use testnet ETH for Sepolia testing**
- ⚠️ **Keep private keys secure**
- ⚠️ **Test locally before deploying**
