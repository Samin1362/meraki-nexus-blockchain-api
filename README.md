# MerakiNexus Payment API

A simple blockchain payment API built with Truffle, Web3.js, and Express.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Ganache

- Open Ganache GUI, or
- Run `truffle develop` in terminal

### 3. Deploy Contract

```bash
npm run deploy
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
- ✅ Local development with Ganache
- ✅ Simple REST API interface

## 🔧 Development

- **Blockchain**: Ganache (localhost:7545)
- **API Server**: Express (localhost:3000)
- **Framework**: Truffle
- **Web3**: Web3.js v4
