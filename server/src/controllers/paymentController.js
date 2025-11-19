const { web3, contract, CONTRACT_ADDRESS } = require("../config/database");

const processPayment = async (req, res) => {
  try {
    const { sender, receiver, amount, privateKey, account } = req.validatedData;

    console.log(`💳 Payment Request: ${sender} → ${receiver} (${amount} ETH)`);

    // Convert amount to Wei
    const amountInWei = web3.utils.toWei(amount.toString(), "ether");

    console.log(
      `🚀 Processing payment: ${sender} → ${receiver} (${amount} ETH)`
    );

    // Build transaction with EIP-1559 gas pricing
    const txData = contract.methods.sendPayment(receiver).encodeABI();

    // Get current gas prices
    const gasPrice = await web3.eth.getGasPrice();
    const maxPriorityFeePerGas = web3.utils.toWei("2", "gwei"); // Tip for miners
    const maxFeePerGas = BigInt(gasPrice) + BigInt(maxPriorityFeePerGas); // Base + tip

    const tx = {
      from: account.address,
      to: CONTRACT_ADDRESS,
      value: amountInWei,
      gas: 300000,
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas,
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
};

module.exports = {
  processPayment,
};
