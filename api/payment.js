const express = require("express");
const cors = require("cors");
const { Web3 } = require("web3");
const PaymentContract = require("../build/contracts/PaymentContract.json");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables with fallbacks
const BLOCKCHAIN_RPC_URL =
  process.env.ALCHEMY_API_URL ||
  process.env.BLOCKCHAIN_RPC_URL ||
  "http://127.0.0.1:7545";
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0xda9053D313bdE1FA8E3917aa82b0E1B2329531cd";
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3000;

// Initialize Web3 and contract
const web3 = new Web3(BLOCKCHAIN_RPC_URL);
const contract = new web3.eth.Contract(PaymentContract.abi, CONTRACT_ADDRESS);

console.log("🚀 MerakiNexus Payment API Server Starting...");
console.log(`📡 Blockchain RPC: ${BLOCKCHAIN_RPC_URL}`);
console.log(`📄 Contract Address: ${CONTRACT_ADDRESS}`);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    blockchain: BLOCKCHAIN_RPC_URL,
    contract: CONTRACT_ADDRESS,
  });
});

// Payment endpoint
app.post("/api/payment", async (req, res) => {
  try {
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

    console.log(
      `🚀 Processing payment: ${sender} → ${receiver} (${amount} ETH)`
    );

    // Get account from private key for signing
    const privateKey = process.env.PRIVATE_KEY.startsWith("0x")
      ? process.env.PRIVATE_KEY
      : "0x" + process.env.PRIVATE_KEY;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    // Build transaction
    const txData = contract.methods.sendPayment(receiver).encodeABI();
    const tx = {
      from: account.address,
      to: CONTRACT_ADDRESS,
      value: amountInWei,
      gas: 300000,
      gasPrice: 20000000000, // 20 gwei
      data: txData,
    };

    // Sign and send transaction
    const signedTx = await account.signTransaction(tx);
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    // Get transaction details
    const transactionCount = await contract.methods
      .getTransactionCount()
      .call();
    const transactionId = Number(transactionCount.toString()) - 1;
    const transaction = await contract.methods
      .getTransaction(transactionId)
      .call();

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
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
      timestamp: new Date().toISOString(),
    });
  }
});

// Export for Vercel
module.exports = app;
