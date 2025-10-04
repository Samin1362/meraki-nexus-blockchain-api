const { web3 } = require("../config/database");

const validatePaymentRequest = (req, res, next) => {
  const { sender, receiver, amount, senderPrivateKey } = req.body;

  // Check required fields
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

  // Validate private key format
  const privateKey = senderPrivateKey.startsWith("0x")
    ? senderPrivateKey
    : "0x" + senderPrivateKey;

  try {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    // Verify that the sender address matches the private key
    if (account.address.toLowerCase() !== sender.toLowerCase()) {
      return res.status(400).json({
        status: "error",
        message: "Sender address does not match the provided private key",
        timestamp: new Date().toISOString(),
      });
    }

    // Add validated data to request
    req.validatedData = {
      sender,
      receiver,
      amount: amountNum,
      privateKey,
      account,
    };

    next();
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Invalid private key format",
      timestamp: new Date().toISOString(),
    });
  }
};

module.exports = {
  validatePaymentRequest,
};
