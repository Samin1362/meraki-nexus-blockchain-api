module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.json({
    status: "success",
    message: "Test endpoint working",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      ALCHEMY_API_URL: process.env.ALCHEMY_API_URL ? "Set" : "Not set",
      CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS ? "Set" : "Not set",
      PRIVATE_KEY: process.env.PRIVATE_KEY ? "Set" : "Not set"
    }
  });
};
