import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import { gsap } from "gsap";

const API_BASE_URL =
  "https://meraki-nexus-blockchain-api.vercel.app/api/payment";

const PaymentForm = ({
  isMetaMaskAvailable,
  isConnected,
  userAddress,
  onPaymentSuccess,
  onPaymentError,
  loading,
  setLoading,
  prefilledData = { receiver: "", amount: "" },
  callbackUrl = "",
}) => {
  const [formData, setFormData] = useState({
    sender: "",
    receiver: prefilledData.receiver || "",
    amount: prefilledData.amount || "",
    senderPrivateKey: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef(null);
  const inputRefs = useRef({});

  // GSAP animations on mount
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputFocus = (inputName) => {
    const input = inputRefs.current[inputName];
    if (input) {
      gsap.to(input, {
        scale: 1.02,
        boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleInputBlur = (inputName) => {
    const input = inputRefs.current[inputName];
    if (input) {
      gsap.to(input, {
        scale: 1,
        boxShadow: "0 0 10px rgba(139, 92, 246, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleButtonHover = (buttonRef) => {
    gsap.to(buttonRef, {
      scale: 1.05,
      boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleButtonLeave = (buttonRef) => {
    gsap.to(buttonRef, {
      scale: 1,
      boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const validateForm = () => {
    if (!formData.receiver || !formData.amount) {
      onPaymentError("Please fill in all required fields");
      return false;
    }

    if (!ethers.isAddress(formData.receiver)) {
      onPaymentError("Please enter a valid receiver address");
      return false;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      onPaymentError("Please enter a valid amount");
      return false;
    }

    return true;
  };

  const sendWithMetaMask = async () => {
    if (!isConnected) {
      onPaymentError("Please connect your MetaMask wallet first");
      return;
    }

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setLoading(true);

      // Check if MetaMask is still available
      if (!window.ethereum) {
        throw new Error("MetaMask connection lost. Please reconnect.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Verify we have the correct signer
      const signerAddress = await signer.getAddress();
      if (signerAddress.toLowerCase() !== userAddress.toLowerCase()) {
        throw new Error("Account mismatch. Please reconnect your wallet.");
      }

      // Check balance before sending
      const balance = await provider.getBalance(signerAddress);
      const amountWei = ethers.parseEther(formData.amount);

      if (balance < amountWei) {
        throw new Error("Insufficient balance for this transaction");
      }

      console.log("Sending transaction:", {
        from: signerAddress,
        to: formData.receiver,
        amount: formData.amount,
        amountWei: amountWei.toString(),
        balance: balance.toString(),
      });

      const tx = await signer.sendTransaction({
        to: formData.receiver,
        value: amountWei,
      });

      console.log("Transaction sent:", tx.hash);

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      // Create success response similar to API format
      const successResponse = {
        status: "success",
        sender: userAddress,
        receiver: formData.receiver,
        amount: formData.amount,
        txHash: receipt.hash,
        gas: receipt.gasUsed.toString(),
        timestamp: new Date().toISOString(),
        method: "MetaMask",
        blockNumber: receipt.blockNumber,
        gasPrice: receipt.gasPrice?.toString() || "0",
      };

      onPaymentSuccess(successResponse);

      // Reset form
      setFormData((prev) => ({
        ...prev,
        receiver: "",
        amount: "",
      }));
    } catch (error) {
      console.error("MetaMask transaction error:", error);

      let errorMessage = "Transaction failed";
      if (error.code === 4001) {
        errorMessage = "Transaction rejected by user";
      } else if (error.code === -32603) {
        errorMessage = "Insufficient funds for gas";
      } else if (error.message.includes("Insufficient balance")) {
        errorMessage = "Insufficient balance for this transaction";
      } else if (error.message.includes("Account mismatch")) {
        errorMessage = "Account mismatch. Please reconnect your wallet.";
      } else if (error.message.includes("connection lost")) {
        errorMessage = "MetaMask connection lost. Please reconnect.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      onPaymentError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const sendWithAPI = async () => {
    if (!validateForm()) return;

    if (!formData.sender || !formData.senderPrivateKey) {
      onPaymentError("Please fill in all required fields for API mode");
      return;
    }

    if (!ethers.isAddress(formData.sender)) {
      onPaymentError("Please enter a valid sender address");
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);

      const requestData = {
        sender: formData.sender,
        receiver: formData.receiver,
        amount: formData.amount,
        senderPrivateKey: formData.senderPrivateKey,
        callback: callbackUrl,
      };

      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        onPaymentSuccess(result);

        // Reset form
        setFormData({
          sender: "",
          receiver: "",
          amount: "",
          senderPrivateKey: "",
        });
      } else {
        onPaymentError(result.error || "API request failed");
      }
    } catch (error) {
      console.error("API request error:", error);
      onPaymentError("Network error: " + error.message);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const isMetaMaskMode = isMetaMaskAvailable && isConnected;
  const submitButtonRef = useRef(null);

  return (
    <div ref={formRef} className="space-y-6">
      {/* Receiver Address */}
      <div className="space-y-2">
        <label
          htmlFor="receiver"
          className="block text-sm font-medium text-gray-300"
        >
          Receiver Address *
        </label>
        <input
          ref={(el) => (inputRefs.current.receiver = el)}
          type="text"
          id="receiver"
          name="receiver"
          value={formData.receiver}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("receiver")}
          onBlur={() => handleInputBlur("receiver")}
          placeholder="0x..."
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple focus:shadow-neon-purple transition-all duration-300 disabled:opacity-50"
        />
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-300"
        >
          Amount (ETH) *
        </label>
        <input
          ref={(el) => (inputRefs.current.amount = el)}
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("amount")}
          onBlur={() => handleInputBlur("amount")}
          placeholder="0.001"
          step="0.0001"
          min="0"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple focus:shadow-neon-purple transition-all duration-300 disabled:opacity-50"
        />
      </div>

      {/* API Mode Fields */}
      {!isMetaMaskMode && (
        <>
          <div className="space-y-2">
            <label
              htmlFor="sender"
              className="block text-sm font-medium text-gray-300"
            >
              Sender Address *
            </label>
            <input
              ref={(el) => (inputRefs.current.sender = el)}
              type="text"
              id="sender"
              name="sender"
              value={formData.sender}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus("sender")}
              onBlur={() => handleInputBlur("sender")}
              placeholder="0x..."
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple focus:shadow-neon-purple transition-all duration-300 disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="senderPrivateKey"
              className="block text-sm font-medium text-gray-300"
            >
              Sender Private Key *
            </label>
            <input
              ref={(el) => (inputRefs.current.senderPrivateKey = el)}
              type="password"
              id="senderPrivateKey"
              name="senderPrivateKey"
              value={formData.senderPrivateKey}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus("senderPrivateKey")}
              onBlur={() => handleInputBlur("senderPrivateKey")}
              placeholder="Enter your private key"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple focus:shadow-neon-purple transition-all duration-300 disabled:opacity-50"
            />
          </div>
        </>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        {isMetaMaskMode ? (
          <button
            ref={submitButtonRef}
            onClick={sendWithMetaMask}
            onMouseEnter={() => handleButtonHover(submitButtonRef.current)}
            onMouseLeave={() => handleButtonLeave(submitButtonRef.current)}
            disabled={isSubmitting || loading}
            className="w-full px-6 py-4 bg-gradient-neon text-white rounded-xl font-semibold text-lg shadow-neon-purple hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {isSubmitting && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            <span>🦊 Send with MetaMask</span>
          </button>
        ) : (
          <button
            ref={submitButtonRef}
            onClick={sendWithAPI}
            onMouseEnter={() => handleButtonHover(submitButtonRef.current)}
            onMouseLeave={() => handleButtonLeave(submitButtonRef.current)}
            disabled={isSubmitting || loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-neon-blue to-neon-pink text-white rounded-xl font-semibold text-lg shadow-neon-blue hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {isSubmitting && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            <span>🔧 Send with API</span>
          </button>
        )}
      </div>

      {/* Mode Description */}
      <div className="pt-4">
        {isMetaMaskMode ? (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-sm text-green-400">
              💡 <strong>MetaMask Mode:</strong> Transaction will be sent
              directly from your connected wallet
            </p>
          </div>
        ) : (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-sm text-yellow-400">
              ⚠️ <strong>API Mode:</strong> Transaction will be processed
              through the backend API
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;
