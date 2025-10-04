const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Environment variables
const RPC_URL = process.env.RPC_URL || "https://sepolia.drpc.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "YOUR_PRIVATE_KEY";

console.log("🚀 MerakiNexus Payment API with Frontend Integration Starting...");

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "MerakiNexus Payment API",
    version: "2.0.0",
  });
});

// Main payment endpoint - serves frontend or processes payment
app.get("/api/payment", async (req, res) => {
  const { receiver, amount, callback } = req.query;

  // Always serve the frontend (with or without query parameters)
  console.log(
    `📱 Serving frontend with params: receiver=${receiver}, amount=${amount}, callback=${callback}`
  );

  // Serve the React app
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Process payment endpoint
app.post("/api/payment", async (req, res) => {
  try {
    const { sender, receiver, amount, senderPrivateKey, callback } = req.body;

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
    if (!ethers.isAddress(sender) || !ethers.isAddress(receiver)) {
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

    // Initialize provider and wallet
    console.log(`🔗 Using RPC: ${RPC_URL}`);
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(senderPrivateKey, provider);
    console.log(`👛 Wallet address: ${wallet.address}`);

    // Verify sender address matches private key
    if (wallet.address.toLowerCase() !== sender.toLowerCase()) {
      return res.status(400).json({
        status: "error",
        message: "Sender address does not match the provided private key",
        timestamp: new Date().toISOString(),
      });
    }

    // Check balance
    const balance = await provider.getBalance(sender);
    const amountInWei = ethers.parseEther(amountNum.toString());

    if (balance < amountInWei) {
      return res.status(400).json({
        status: "error",
        message: "Insufficient balance for transaction",
        timestamp: new Date().toISOString(),
      });
    }

    // Create transaction
    const tx = {
      to: receiver,
      value: amountInWei,
      gasLimit: 21000,
    };

    // Send transaction
    const txResponse = await wallet.sendTransaction(tx);
    console.log(`🚀 Transaction sent: ${txResponse.hash}`);

    // Wait for confirmation
    const receipt = await txResponse.wait();
    console.log(`✅ Transaction confirmed: ${receipt.hash}`);

    // Success response
    const successResponse = {
      status: "success",
      txHash: receipt.hash,
      receiver: receiver,
      amount: amount,
      gasUsed: receipt.gasUsed.toString(),
      blockNumber: receipt.blockNumber,
      timestamp: new Date().toISOString(),
    };

    console.log("✅ Payment successful:", successResponse);

    // Send callback if provided
    if (callback) {
      try {
        console.log(`📤 Sending callback to: ${callback}`);
        const callbackResponse = await fetch(callback, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(successResponse),
        });

        if (callbackResponse.ok) {
          console.log("✅ Callback sent successfully");
        } else {
          console.log("⚠️ Callback failed:", callbackResponse.status);
        }
      } catch (callbackError) {
        console.log("⚠️ Callback error:", callbackError.message);
      }
    }

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("❌ Payment failed:", error.message);
    console.error("❌ Full error:", error);

    // Handle specific error types
    let errorMessage = "Transaction failed";
    if (error.message.includes("insufficient funds")) {
      errorMessage = "Insufficient funds for transaction";
    } else if (error.message.includes("user rejected")) {
      errorMessage = "Transaction rejected by user";
    } else if (error.message.includes("gas")) {
      errorMessage = "Gas estimation failed";
    } else if (error.message.includes("network")) {
      errorMessage = "Network connection failed";
    } else if (error.message.includes("invalid private key")) {
      errorMessage = "Invalid private key";
    }

    const errorResponse = {
      status: "error",
      message: errorMessage,
      timestamp: new Date().toISOString(),
    };

    // Send error callback if provided
    const { callback } = req.body;
    if (callback) {
      try {
        console.log(`📤 Sending error callback to: ${callback}`);
        await fetch(callback, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(errorResponse),
        });
      } catch (callbackError) {
        console.log("⚠️ Error callback failed:", callbackError.message);
      }
    }

    return res.status(500).json(errorResponse);
  }
});

// Catch-all handler for React routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Start server if running directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(
      `🎉 MerakiNexus Payment API running on http://localhost:${PORT}`
    );
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💳 Payment API: http://localhost:${PORT}/api/payment`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log("");
    console.log("📝 Test URLs:");
    console.log(`GET http://localhost:${PORT}/api/payment`);
    console.log(
      `GET http://localhost:${PORT}/api/payment?receiver=0x123&amount=0.01&callback=https://example.com/notify`
    );
  });
}

module.exports = app;
