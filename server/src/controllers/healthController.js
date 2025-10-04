const { BLOCKCHAIN_RPC_URL, CONTRACT_ADDRESS } = require("../config/database");

const getHealth = (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    blockchain: BLOCKCHAIN_RPC_URL,
    contract: CONTRACT_ADDRESS,
  });
};

module.exports = {
  getHealth,
};
