# MerakiNexus Payment API - Deployment Guide

## 🚀 Vercel Deployment

### Step 1: Prepare Your Repository

```bash
# Make sure .env is gitignored
git add .gitignore
git commit -m "Add gitignore for security"

# Push to GitHub
git add .
git commit -m "Reorganize project structure"
git push origin main
```

### Step 2: Deploy Contract to Sepolia

```bash
# Set your environment variables
export ALCHEMY_API_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY"
export PRIVATE_KEY="your_private_key"
export CONTRACT_ADDRESS="your_contract_address"

# Deploy to Sepolia
npm run deploy:sepolia
```

### Step 3: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set environment variables in Vercel:
   - `ALCHEMY_API_URL`: Your Alchemy Sepolia endpoint
   - `PRIVATE_KEY`: Your wallet private key
   - `CONTRACT_ADDRESS`: Your deployed contract address
   - `NODE_ENV`: production
5. Deploy!

### Step 4: Test Deployment

```bash
# Test your deployed API
curl https://your-app.vercel.app/health
curl -X POST https://your-app.vercel.app/api/payment \
  -H "Content-Type: application/json" \
  -d '{"sender":"0x...","receiver":"0x...","amount":"0.001"}'
```

## 🔧 Local Development

### Step 1: Setup Environment

```bash
# Copy template
cp .env.template .env

# Edit with your local values
nano .env
```

### Step 2: Start Ganache

- Open Ganache GUI, or
- Run `truffle develop`

### Step 3: Deploy & Run

```bash
# Deploy contract
npm run deploy:local

# Start server
npm start
```

## 🔒 Security Checklist

- ✅ `.env` files are gitignored
- ✅ Private keys not in repository
- ✅ Environment variables set in Vercel
- ✅ Testnet used for testing
- ✅ No production keys in code

## 🎯 Environment Variables

### Local Development (.env)

```bash
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
CONTRACT_ADDRESS=your_local_address
NODE_ENV=development
PORT=3000
```

### Vercel Production

```bash
ALCHEMY_API_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=your_sepolia_address
NODE_ENV=production
PORT=3000
```

## 🧪 Testing

### Local Testing

```bash
# Health check
curl http://localhost:3000/health

# Payment test
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{"sender":"0x...","receiver":"0x...","amount":"0.001"}'
```

### Production Testing

```bash
# Replace with your Vercel URL
curl https://your-app.vercel.app/health
```

## 📝 Troubleshooting

### Common Issues

1. **Port already in use**: `pkill -f "node server.js"`
2. **Environment variables not loaded**: Check `.env` file
3. **Contract not deployed**: Run `npm run deploy:sepolia`
4. **Vercel deployment fails**: Check environment variables

### Debug Commands

```bash
# Check if server is running
lsof -ti:3000

# Kill server
pkill -f "node server.js"

# Check environment
node -e "require('dotenv').config(); console.log(process.env)"
```
