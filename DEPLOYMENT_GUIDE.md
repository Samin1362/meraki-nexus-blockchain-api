# 🚀 Deployment Guide - GitHub & Vercel

## ⚠️ IMPORTANT: Read Before Deploying!

### Current Project State

✅ **Ready for GitHub:**
- All code changes committed
- `.gitignore` properly configured
- `.env` will NOT be committed (protected)
- Documentation complete

⚠️ **Vercel Deployment Status:**
- **PARTIALLY READY** - Need to configure environment variables
- Two deployment options available (see below)

---

## 🔒 Security Check - BEFORE Pushing to GitHub

### ✅ Verified Safe:

```bash
# .gitignore includes:
.env                    # ✅ Your secrets are protected
.env.local              # ✅ Protected
.env.*                  # ✅ Protected
build/                  # ✅ Compiled contracts excluded
node_modules/           # ✅ Dependencies excluded
```

### ❌ DO NOT COMMIT:

1. **Never commit `.env` file** - Already protected ✅
2. **Never hardcode private keys** - Not in code ✅
3. **Never commit `build/` directory** - Already excluded ✅

### 🔍 Final Security Scan:

Run this before pushing:

```bash
# Check if .env is tracked (should be empty)
git ls-files | grep .env

# Check for exposed secrets in code
grep -r "PRIVATE_KEY\|private.*key" --include="*.js" . | grep -v "process.env" | grep -v "YOUR_"

# Check what will be committed
git status
```

**If any of these show secrets, DO NOT PUSH!**

---

## 📦 GitHub Deployment

### Step 1: Commit Your Changes

```bash
# Check current status
git status

# Add all new files (safe - .env is excluded)
git add .

# Commit with descriptive message
git commit -m "Fix: Gas estimation error - Update to EIP-1559, add Sepolia config"

# Push to GitHub
git push origin main
```

### What Gets Committed:

✅ **Will be pushed:**
- Code changes (paymentController.js)
- Documentation (*.md files)
- Deployment scripts (check-setup.js, deploy-to-sepolia.js)
- Configuration templates (.env.template)
- Package files (package.json, package-lock.json)

❌ **Will NOT be pushed:**
- `.env` file (secrets protected)
- `node_modules/` (dependencies)
- `build/` (compiled contracts)
- Personal IDE settings

---

## 🚀 Vercel Deployment

### Two Deployment Options:

Your project has **TWO implementations**:

#### **Option A: Simple API (Recommended for Vercel)** ⭐

**File:** `api/payment.js`
- ✅ Uses `ethers.js`
- ✅ Direct ETH transfers (no smart contract)
- ✅ Faster deployment
- ✅ No contract deployment needed
- ✅ Currently configured in `vercel.json`

**Pros:**
- Simpler setup
- Works immediately after Vercel deployment
- Only needs RPC URL (no contract deployment)

**Cons:**
- No smart contract features
- Direct wallet transfers only

#### **Option B: Smart Contract API** 🔧

**File:** `server/src/`
- Uses `web3.js`
- Requires deployed smart contract
- More complex setup
- Better for learning/advanced features

**Pros:**
- Full smart contract functionality
- Transaction history on-chain
- Better for complex logic

**Cons:**
- Requires contract deployment first
- More environment variables
- More complex debugging

---

## 🎯 Recommended: Deploy Option A (Simple API)

### Step 1: Prepare Vercel Environment Variables

You'll need to configure these in Vercel dashboard:

**Required Variables:**

```bash
# Sepolia RPC URL (get from Alchemy)
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

# OR use public RPC (rate limited):
RPC_URL=https://ethereum-sepolia-rpc.publicnode.com

# Node environment
NODE_ENV=production
```

**Optional (for API fallback mode):**

```bash
# If you want server-side signing (not recommended for production)
PRIVATE_KEY=0xYOUR_DEPLOYER_PRIVATE_KEY
```

⚠️ **Note:** The simple API (`api/payment.js`) receives private keys in the request body, so you don't need to store them in environment variables.

### Step 2: Deploy to Vercel

#### Via Vercel Dashboard:

1. Go to https://vercel.com/
2. Click "Import Project"
3. Connect your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Add environment variables:
   - Go to "Settings" → "Environment Variables"
   - Add `RPC_URL`
   - Add `NODE_ENV=production`
6. Click "Deploy"

#### Via CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (will prompt for env vars)
vercel

# Deploy to production
vercel --prod
```

### Step 3: Configure Environment Variables in Vercel

In Vercel dashboard → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `RPC_URL` | `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY` | Production |
| `NODE_ENV` | `production` | Production |

### Step 4: Test Deployment

```bash
# Test health endpoint
curl https://your-app.vercel.app/api/health

# Should return:
{
  "status": "healthy",
  "service": "MerakiNexus Payment API",
  "version": "2.0.0"
}
```

---

## 🔧 Alternative: Deploy Option B (Smart Contract API)

### Requirements Before Deployment:

1. ✅ Deploy contract to Sepolia (run `node server/deploy-to-sepolia.js`)
2. ✅ Get contract address from deployment
3. ✅ Have Alchemy API key
4. ✅ Configure all environment variables

### Vercel Configuration:

You need to modify `vercel.json` to use the server implementation:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server/src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Required Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `ALCHEMY_API_URL` | `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY` | Production |
| `CONTRACT_ADDRESS` | `0xYourDeployedContractAddress` | Production |
| `NODE_ENV` | `production` | Production |

⚠️ **Important:** Do NOT add `PRIVATE_KEY` to Vercel environment variables. The API receives private keys in request bodies.

---

## 📋 Pre-Deployment Checklist

### Before Pushing to GitHub:

- [ ] `.env` is in `.gitignore` ✅ (Already configured)
- [ ] No hardcoded secrets in code ✅ (Already verified)
- [ ] `build/` directory excluded ✅ (Already configured)
- [ ] Run `git status` to verify what will be committed
- [ ] Run security scan (see above)

### Before Deploying to Vercel:

- [ ] Choose deployment option (A or B)
- [ ] Get Alchemy API key
- [ ] **(Option B only)** Deploy smart contract to Sepolia
- [ ] Prepare environment variables
- [ ] Test locally first
- [ ] Configure Vercel environment variables
- [ ] Test deployment

---

## 🎬 Quick Deployment Commands

### Option A (Simple API - Recommended):

```bash
# 1. Push to GitHub
git add .
git commit -m "Fix: Gas estimation error - Update to EIP-1559"
git push origin main

# 2. Deploy to Vercel
vercel --prod

# 3. Add environment variables in Vercel dashboard
# RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
# NODE_ENV=production

# 4. Test
curl https://your-app.vercel.app/api/health
```

### Option B (Smart Contract API):

```bash
# 1. Deploy contract locally first
cd server
node deploy-to-sepolia.js  # Note the contract address

# 2. Push to GitHub
git add .
git commit -m "Fix: Gas estimation error - Update to EIP-1559"
git push origin main

# 3. Modify vercel.json (see above)

# 4. Deploy to Vercel
vercel --prod

# 5. Add environment variables in Vercel dashboard
# ALCHEMY_API_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
# CONTRACT_ADDRESS=0xYourContractAddress
# NODE_ENV=production

# 6. Test
curl https://your-app.vercel.app/api/health
```

---

## ⚠️ Common Deployment Issues

### Issue 1: "Cannot find module"

**Cause:** Dependencies not installed
**Solution:** Vercel auto-installs. Check `package.json` includes all dependencies.

### Issue 2: "Gas estimation failed" on Vercel

**Cause:** Environment variables not set
**Solution:** 
- Check `RPC_URL` is set in Vercel
- Verify Alchemy API key is valid
- Check API key has Sepolia enabled

### Issue 3: "Contract not deployed"

**Cause:** Using Option B without deploying contract
**Solution:**
- Either switch to Option A (simple API)
- Or deploy contract first: `node server/deploy-to-sepolia.js`

### Issue 4: Vercel builds but API fails

**Cause:** Wrong file path in `vercel.json`
**Solution:**
- For Option A: Use `api/payment.js` (already configured)
- For Option B: Change to `server/src/index.js`

---

## 🔐 Security Best Practices

### For GitHub:

✅ **DO:**
- Use `.gitignore` for secrets (already configured)
- Review changes before committing (`git diff`)
- Use environment variables for all secrets
- Keep `.env.template` for documentation

❌ **DON'T:**
- Commit `.env` file
- Hardcode API keys or private keys
- Commit `build/` or `node_modules/`
- Push without reviewing changes

### For Vercel:

✅ **DO:**
- Store secrets in Vercel environment variables
- Use different keys for production vs development
- Limit API key permissions (Sepolia only)
- Monitor API usage in Alchemy dashboard

❌ **DON'T:**
- Store private keys in Vercel env vars (keys come from request body)
- Use production private keys in testnet
- Share Vercel project publicly without authentication
- Commit Vercel `.env.production` files

---

## 🎉 Summary

### Current Status:

| Item | Status |
|------|--------|
| Code fixed (gas estimation) | ✅ Complete |
| Security configured | ✅ Complete |
| Documentation | ✅ Complete |
| `.gitignore` configured | ✅ Complete |
| **Ready for GitHub** | ✅ **YES** |
| **Ready for Vercel** | ⚠️ **AFTER env vars setup** |

### To Deploy:

1. **GitHub:** Just push! (Safe - secrets protected)
2. **Vercel:** 
   - Set environment variables first
   - Use Option A (simple) for fastest deployment
   - Use Option B if you need smart contract features

### Estimated Time:

- GitHub push: **1 minute**
- Vercel deployment (Option A): **5 minutes**
- Vercel deployment (Option B): **15 minutes** (includes contract deployment)

---

**Ready to deploy? Follow the steps above!** 🚀

