const { Web3 } = require("web3");

// PaymentContract ABI (simplified)
const PaymentContractABI = [
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "transactionId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "sender", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "receiver", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "PaymentSent",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "address payable", "name": "receiver", "type": "address"}],
    "name": "sendPayment",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_transactionId", "type": "uint256"}],
    "name": "getTransaction",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "address", "name": "sender", "type": "address"},
      {"internalType": "address", "name": "receiver", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "bool", "name": "completed", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTransactionCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Initialize Web3 and contract
let web3, contract;

const initializeWeb3 = () => {
  if (!web3) {
    const BLOCKCHAIN_RPC_URL = process.env.ALCHEMY_API_URL || process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:7545";
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xda9053D313bdE1FA8E3917aa82b0E1B2329531cd";
    
    web3 = new Web3(BLOCKCHAIN_RPC_URL);
    contract = new web3.eth.Contract(PaymentContractABI, CONTRACT_ADDRESS);
  }
  return { web3, contract };
};

// Health check handler
const handleHealth = async (req, res) => {
  const { web3, contract } = initializeWeb3();
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    blockchain: process.env.ALCHEMY_API_URL || process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:7545",
    contract: process.env.CONTRACT_ADDRESS || "0xda9053D313bdE1FA8E3917aa82b0E1B2329531cd",
  });
};

// Payment handler
const handlePayment = async (req, res) => {
  try {
    const { web3, contract } = initializeWeb3();
    const { sender, receiver, amount } = req.body;

    // Input validation
    if (!sender || !receiver || !amount) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: sender, receiver, amount",
        timestamp: new Date().toISOString(),
      });
    }

    if (!web3.utils.isAddress(sender) || !web3.utils.isAddress(receiver)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Ethereum addresses",
        timestamp: new Date().toISOString(),
      });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Amount must be a positive number",
        timestamp: new Date().toISOString(),
      });
    }

    // Convert amount to Wei
    const amountInWei = web3.utils.toWei(amountNum.toString(), "ether");

    console.log(`🚀 Processing payment: ${sender} → ${receiver} (${amount} ETH)`);

    // Get account from private key for signing
    const privateKey = process.env.PRIVATE_KEY.startsWith("0x")
      ? process.env.PRIVATE_KEY
      : "0x" + process.env.PRIVATE_KEY;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    // Build transaction
    const txData = contract.methods.sendPayment(receiver).encodeABI();
    const tx = {
      from: account.address,
      to: process.env.CONTRACT_ADDRESS,
      value: amountInWei,
      gas: 300000,
      gasPrice: 20000000000, // 20 gwei
      data: txData,
    };

    // Sign and send transaction
    const signedTx = await account.signTransaction(tx);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    // Get transaction details
    const transactionCount = await contract.methods.getTransactionCount().call();
    const transactionId = Number(transactionCount.toString()) - 1;

    // Success response
    const successResponse = {
      status: "success",
      sender: sender,
      receiver: receiver,
      amount: amount + " ETH",
      transactionHash: receipt.transactionHash,
      transactionId: transactionId.toString(),
      gasUsed: receipt.gasUsed.toString(),
      timestamp: new Date().toISOString(),
    };

    console.log("✅ Payment successful:", successResponse);
    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("❌ Payment failed:", error.message);

    // Handle specific error types
    let errorMessage = "Transaction failed";
    if (error.message.includes("insufficient funds")) {
      errorMessage = "Insufficient funds for transaction";
    } else if (error.message.includes("user rejected")) {
      errorMessage = "Transaction rejected by user";
    } else if (error.message.includes("gas")) {
      errorMessage = "Gas estimation failed";
    }

    return res.status(500).json({
      status: "error",
      message: errorMessage,
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
      timestamp: new Date().toISOString(),
    });
  }
};

// Main handler
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Route requests
  if (req.method === 'GET' && (req.url === '/health' || req.url === '/api/health')) {
    return handleHealth(req, res);
  }
  
  if (req.method === 'POST' && (req.url === '/api/payment' || req.url === '/payment')) {
    return handlePayment(req, res);
  }

  // Default response
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
    timestamp: new Date().toISOString(),
  });
};