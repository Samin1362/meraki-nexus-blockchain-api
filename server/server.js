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
    const { sender, receiver, amount, senderPrivateKey } = req.body;

    console.log(`💳 Payment Request: ${sender} → ${receiver} (${amount} ETH)`);

    // Validate input
    if (!sender || !receiver || !amount || !senderPrivateKey) {
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: sender, receiver, amount, senderPrivateKey",
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

    // Get account from private key for signing (from request body)
    const privateKey = senderPrivateKey.startsWith("0x")
      ? senderPrivateKey
      : "0x" + senderPrivateKey;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    // Verify that the sender address matches the private key
    if (account.address.toLowerCase() !== sender.toLowerCase()) {
      return res.status(400).json({
        status: "error",
        message: "Sender address does not match the provided private key",
        timestamp: new Date().toISOString(),
      });
    }

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

// Start server
app.listen(PORT, () => {
  console.log(`🎉 MerakiNexus Payment API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Payment API: http://localhost:${PORT}/api/payment`);
  console.log("");
  console.log("📝 Postman Test:");
  console.log(`POST http://localhost:${PORT}/api/payment`);
  console.log("Content-Type: application/json");
  console.log(
    JSON.stringify(
      {
        sender: "0x3B3a5d0E2941ec48AD8C6062367F1f12f5346faB",
        receiver: "0x5bFdc3D781CD81Fb8814B08E1439D639b0d4Fb48",
        amount: "0.1",
        senderPrivateKey: "YOUR_SENDER_PRIVATE_KEY_HERE",
      },
      null,
      2
    )
  );
});
