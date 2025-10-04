const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/health", healthRoutes);
app.use("/api/payment", paymentRoutes);

// Start server
const PORT = process.env.PORT || 3000;

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

module.exports = app;
