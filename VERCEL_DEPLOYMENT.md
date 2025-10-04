# 🚀 Vercel Deployment Guide - MerakiNexus Payment API + Frontend

## 📋 **Project Overview**

This project now integrates:

- **React Frontend** with MetaMask integration
- **Node.js Backend** API with callback system
- **Seamless API → Frontend → Payment → Callback** flow
- **Vercel deployment** ready

## 🏗️ **Architecture**

```
API Request → Frontend → MetaMask/API Payment → Callback Notification
     ↓              ↓              ↓                    ↓
GET /api/payment  React App   Transaction        POST to callback
?receiver=0x123   Opens       Processing         URL with results
&amount=0.01      Payment      Success/Error      {status, txHash, etc}
&callback=url     Form
```

## 🔧 **Setup & Deployment**

### **1. Install Dependencies**

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

### **2. Environment Variables**

Create `.env.local` in the root directory:

```bash
# Blockchain Configuration
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=YOUR_PRIVATE_KEY_FOR_API_MODE

# Optional: Custom settings
NODE_ENV=production
```

### **3. Build Frontend**

```bash
cd frontend
npm run build
cd ..
```

### **4. Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 🌐 **API Usage**

### **Frontend Integration**

When someone hits your API with query parameters, it serves the React frontend:

```bash
# Example API call that opens frontend
GET https://your-app.vercel.app/api/payment?receiver=0x123&amount=0.01&callback=https://teammate-app.com/notify
```

**Response:** Serves the React payment page with:

- ✅ **Prefilled receiver address**
- ✅ **Prefilled amount**
- ✅ **Callback URL configured**

### **Payment Flow**

1. **User opens the URL** → React frontend loads
2. **User connects MetaMask** → Wallet connection
3. **User signs transaction** → MetaMask popup
4. **Transaction processes** → Blockchain confirmation
5. **Callback sent** → POST to callback URL with results

### **Callback Format**

**Success Response:**

```json
{
  "status": "success",
  "txHash": "0x123...",
  "receiver": "0x123...",
  "amount": "0.01",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**

```json
{
  "status": "error",
  "message": "Transaction failed",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 **Features Implemented**

### **✅ API Integration**

- **GET /api/payment** → Serves React frontend with query params
- **POST /api/payment** → Processes payments with callback
- **Automatic callback** → Sends results to provided URL

### **✅ Frontend Features**

- **URL parameter parsing** → Pre-fills form data
- **MetaMask integration** → Direct wallet transactions
- **API fallback** → For non-MetaMask users
- **Callback integration** → Sends results automatically
- **Visual feedback** → Shows callback URL status

### **✅ Responsive Design**

- **Mobile-first** → Touch-friendly interface
- **MerakiNexus theme** → Dark neon
- **GSAP animations** → Smooth hover effects
- **Glassmorphism UI** → Modern glass cards

## 📱 **User Experience**

### **For External Services**

```bash
# 1. External service calls your API
curl "https://your-app.vercel.app/api/payment?receiver=0x123&amount=0.01&callback=https://teammate-app.com/notify"

# 2. User sees payment page with prefilled data
# 3. User completes payment (MetaMask or API)
# 4. Your service receives callback with results
```

### **For End Users**

1. **Opens payment link** → Sees beautiful payment form
2. **Connects wallet** → MetaMask integration
3. **Signs transaction** → Secure blockchain payment
4. **Sees confirmation** → Transaction hash and details
5. **Callback sent** → External service notified

## 🔒 **Security Features**

### **Input Validation**

- ✅ **Ethereum address validation**
- ✅ **Amount validation** (positive numbers)
- ✅ **Private key verification**
- ✅ **Balance checking**

### **Error Handling**

- ✅ **Transaction failures** → User-friendly messages
- ✅ **Network issues** → Graceful fallbacks
- ✅ **Callback failures** → Logged but don't break flow
- ✅ **MetaMask errors** → Clear error messages

## 🚀 **Deployment Commands**

### **Quick Deploy**

```bash
# 1. Build frontend
cd frontend && npm run build && cd ..

# 2. Deploy to Vercel
vercel --prod
```

### **Development**

```bash
# Start development servers
npm run dev

# Or individually
npm run dev:api    # Backend only
npm run dev:frontend # Frontend only
```

## 📊 **File Structure**

```
project/
├── api/
│   └── payment.js          # Main API endpoint
├── frontend/
│   ├── src/                # React components
│   ├── build/              # Built frontend
│   └── package.json        # Frontend dependencies
├── vercel.json             # Vercel configuration
├── package.json            # Root dependencies
└── .env.local              # Environment variables
```

## 🎨 **UI Components**

### **Payment Form**

- **Prefilled fields** → From URL parameters
- **MetaMask mode** → Direct wallet transactions
- **API mode** → Fallback for non-MetaMask users
- **Callback indicator** → Shows callback URL status

### **Response Viewer**

- **Transaction details** → Hash, gas, timestamp
- **Success/error states** → Clear visual feedback
- **JSON formatting** → Syntax highlighted output

### **Navbar**

- **Wallet connection** → MetaMask integration
- **Network switching** → Sepolia, Mainnet, Goerli
- **Disconnect option** → Clean wallet disconnection
- **Responsive design** → Mobile-friendly layout

## 🔧 **Configuration**

### **Vercel Settings**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/payment.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/payment.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/build/index.html"
    }
  ]
}
```

### **Environment Variables**

- `RPC_URL` → Blockchain RPC endpoint
- `PRIVATE_KEY` → For API mode transactions
- `NODE_ENV` → Production/development mode

## 🎉 **Result**

Your MerakiNexus Payment system now provides:

- ✅ **Seamless API integration** → External services can trigger payments
- ✅ **Beautiful frontend** → Modern UI with MerakiNexus theme
- ✅ **MetaMask support** → Direct wallet transactions
- ✅ **Callback system** → Automatic result notifications
- ✅ **Mobile responsive** → Works on all devices
- ✅ **Production ready** → Deployed on Vercel

**Your payment system is now a complete, integrated solution!** 🚀
