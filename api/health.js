const { Web3 } = require("web3");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed. Use GET.",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      blockchain: process.env.ALCHEMY_API_URL || "Not set",
      contract: process.env.CONTRACT_ADDRESS || "Not set",
      environment: {
        NODE_ENV: process.env.NODE_ENV || "development",
        ALCHEMY_API_URL: process.env.ALCHEMY_API_URL ? "Set" : "Not set",
        CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS ? "Set" : "Not set",
        PRIVATE_KEY: process.env.PRIVATE_KEY ? "Set" : "Not set",
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Health check failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
