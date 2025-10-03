const express = require("express");
const cors = require("cors");
const { Web3 } = require("web3");
const PaymentContract = require("./build/contracts/PaymentContract.json");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const BLOCKCHAIN_RPC_URL =
  process.env.BLOCKCHAIN_RPC_URL || "http://localhost:7545";
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0xda9053D313bdE1FA8E3917aa82b0E1B2329531cd";

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

    console.log(`💳 Payment Request: ${sender} → ${receiver} (${amount} ETH)`);

    // Validate input
    if (!sender || !receiver || !amount) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: sender, receiver, amount",
        timestamp: new Date().toISOString(),
      });
    }

    // Validate Ethereum addresses
    if (!web3.utils.isAddress(sender) || !web3.utils.isAddress(receiver)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Ethereum addresses",
        timestamp: new Date().toISOString(),
      });
    }

    // Validate amount
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

    // Send payment transaction
    const tx = await contract.methods.sendPayment(receiver).send({
      from: sender,
      value: amountInWei,
      gas: 300000,
    });

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
      transactionHash: tx.transactionHash,
      transactionId: transactionId.toString(),
      gasUsed: tx.gasUsed.toString(),
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

// Start server
app.listen(PORT, () => {
  console.log(`🎉 MerakiNexus Payment API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Payment API: http://localhost:${PORT}/api/payment`);
  console.log("");
  console.log("📝 Postman Test:");
  console.log("POST http://localhost:3000/api/payment");
  console.log("Content-Type: application/json");
  console.log(
    JSON.stringify(
      {
        sender: "0x3B3a5d0E2941ec48AD8C6062367F1f12f5346faB",
        receiver: "0x5bFdc3D781CD81Fb8814B08E1439D639b0d4Fb48",
        amount: "0.1",
      },
      null,
      2
    )
  );
});
