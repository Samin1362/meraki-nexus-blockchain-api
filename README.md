# MerakiNexus Payment API

A blockchain payment API with integrated frontend for seamless ETH transactions via MetaMask or API fallback.

## 🚀 Live Demo

**Frontend:** https://meraki-nexus-blockchain-api.vercel.app/api/payment

## 📋 API Endpoints

### Health Check

```bash
GET https://meraki-nexus-blockchain-api.vercel.app/api/health
```

### Payment Processing

```bash
POST https://meraki-nexus-blockchain-api.vercel.app/api/payment
```

## 💳 How to Use the API

### 1. Frontend Integration (Recommended)

**URL with Parameters:**

```
https://meraki-nexus-blockchain-api.vercel.app/api/payment?receiver=0x123&amount=0.01&callback=https://your-app.com/notify
```

**Features:**

- ✅ MetaMask wallet integration
- ✅ Network switching (Sepolia, Mainnet, Goerli)
- ✅ Fallback API form
- ✅ Automatic callback notifications
- ✅ Responsive design with animations

### 2. Direct API Calls

**Request Body:**

```json
{
  "sender": "0x9B79AF9bb193c295Dd63227cDFc59E091eDAcAeB",
  "receiver": "0xC68D9470B03ab145CAA86009F0c4909386FAc709",
  "amount": "0.001",
  "senderPrivateKey": "50a73a23a57eb22ee1305b3af0fb210466a270b848ce6f4120b6460b3a4e2b68",
  "callback": "https://your-app.com/notify"
}
```

**Success Response:**

```json
{
  "status": "success",
  "txHash": "0x8e33faf9234e0fe1a44ee97b35fe8642492d091b7791505d5711393e60a0f15a",
  "receiver": "0xC68D9470B03ab145CAA86009F0c4909386FAc709",
  "amount": "0.001",
  "gasUsed": "21000",
  "blockNumber": 9339504,
  "timestamp": "2025-10-04T07:00:49.611Z"
}
```

**Error Response:**

```json
{
  "status": "error",
  "message": "Transaction failed",
  "timestamp": "2025-10-04T07:00:49.611Z"
}
```

## 🔧 Integration Examples

### JavaScript/Frontend

```javascript
// Open payment page with pre-filled data
const paymentUrl = `https://meraki-nexus-blockchain-api.vercel.app/api/payment?receiver=${receiverAddress}&amount=${amount}&callback=${callbackUrl}`;
window.open(paymentUrl, "_blank");
```

### cURL

```bash
curl -X POST "https://meraki-nexus-blockchain-api.vercel.app/api/payment" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "0x9B79AF9bb193c295Dd63227cDFc59E091eDAcAeB",
    "receiver": "0xC68D9470B03ab145CAA86009F0c4909386FAc709",
    "amount": "0.001",
    "senderPrivateKey": "50a73a23a57eb22ee1305b3af0fb210466a270b848ce6f4120b6460b3a4e2b68"
  }'
```

### Python

```python
import requests

response = requests.post(
    "https://meraki-nexus-blockchain-api.vercel.app/api/payment",
    json={
        "sender": "0x9B79AF9bb193c295Dd63227cDFc59E091eDAcAeB",
        "receiver": "0xC68D9470B03ab145CAA86009F0c4909386FAc709",
        "amount": "0.001",
        "senderPrivateKey": "50a73a23a57eb22ee1305b3af0fb210466a270b848ce6f4120b6460b3a4e2b68"
    }
)
print(response.json())
```

## 🌐 Network Support

- **Sepolia Testnet** (Default)
- **Ethereum Mainnet**
- **Goerli Testnet**

## 📱 Features

- **MetaMask Integration** - Connect wallet, sign transactions
- **Network Switching** - Switch between testnets and mainnet
- **API Fallback** - Manual payment with private key
- **Callback System** - Automatic result notifications
- **Responsive Design** - Mobile and desktop optimized
- **Real-time Updates** - Live transaction status

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, Ethers.js
- **Frontend:** HTML, TailwindCSS, GSAP, JavaScript
- **Blockchain:** Ethereum, Sepolia Testnet
- **Deployment:** Vercel

## 📄 License

MIT License - Built for MerakiNexus 🚀
