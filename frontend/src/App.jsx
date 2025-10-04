import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import PaymentForm from "./components/PaymentForm";
import ResponseViewer from "./components/ResponseViewer";
import Navbar from "./components/Navbar";

// const API_BASE_URL =
//   "https://meraki-nexus-blockchain-api.vercel.app/api/payment";

function App() {
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // New state for callback integration
  const [callbackUrl, setCallbackUrl] = useState("");
  const [prefilledData, setPrefilledData] = useState({
    receiver: "",
    amount: "",
  });

  const heroRef = useRef(null);
  const cardRef = useRef(null);

  const getNetworkName = (chainId) => {
    const networks = {
      "0x1": "Ethereum Mainnet",
      "0x5": "Goerli Testnet",
      "0xaa36a7": "Sepolia Testnet",
      "0x89": "Polygon",
      "0x38": "BSC",
      "0xa": "Optimism",
      "0xa4b1": "Arbitrum One",
    };
    return networks[chainId] || `Network ${chainId}`;
  };

  // Check for MetaMask availability on component mount
  useEffect(() => {
    // Parse URL parameters for callback integration
    const urlParams = new URLSearchParams(window.location.search);
    const receiver = urlParams.get("receiver");
    const amount = urlParams.get("amount");
    const callback = urlParams.get("callback");

    if (receiver || amount || callback) {
      console.log("🔗 URL parameters detected:", {
        receiver,
        amount,
        callback,
      });
      setPrefilledData({
        receiver: receiver || "",
        amount: amount || "",
      });
      setCallbackUrl(callback || "");
    }

    const checkMetaMask = () => {
      if (typeof window.ethereum !== "undefined") {
        setIsMetaMaskAvailable(true);
        // Check if already connected
        checkConnection();
      } else {
        setIsMetaMaskAvailable(false);
      }
    };

    checkMetaMask();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline();

    if (heroRef.current) {
      tl.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }

    if (cardRef.current) {
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      );
    }
  }, []);

  // Test MetaMask connection function
  const testMetaMaskConnection = async () => {
    try {
      console.log("Testing MetaMask connection...");

      if (!window.ethereum) {
        console.log("❌ MetaMask not detected");
        return false;
      }

      console.log("✅ MetaMask detected");

      // Test basic connection
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      console.log("📊 Current accounts:", accounts);

      // Test network
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      console.log("🌐 Current network:", chainId);

      // Test balance
      if (accounts.length > 0) {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        });

        console.log("💰 Balance:", balance);
      }

      return true;
    } catch (error) {
      console.error("❌ MetaMask test failed:", error);
      return false;
    }
  };

  // Run test on component mount
  useEffect(() => {
    if (isMetaMaskAvailable) {
      testMetaMaskConnection();
    }
  }, [isMetaMaskAvailable]);

  const checkConnection = async () => {
    try {
      if (!window.ethereum) {
        console.log("MetaMask not available");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setIsConnected(true);
        setUserAddress(accounts[0]);

        // Get additional connection info
        try {
          const currentChainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          setChainId(currentChainId);
          console.log("Already connected to MetaMask:", {
            address: accounts[0],
            chainId: currentChainId,
          });
        } catch (chainError) {
          console.log("Could not get chain ID:", chainError);
        }
      } else {
        console.log("No accounts connected");
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      // Don't set error state here as this is just a check
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setIsConnected(true);
      setUserAddress(accounts[0]);
    } else {
      setIsConnected(false);
      setUserAddress("");
    }
  };

  const handleChainChanged = (chainId) => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const connectMetaMask = async () => {
    try {
      setLoading(true);
      setError("");

      // Check if MetaMask is available
      if (!window.ethereum) {
        throw new Error(
          "MetaMask not detected. Please install MetaMask extension."
        );
      }

      // Always request account access to give user choice
      // This will open MetaMask popup even if previously connected
      console.log("🦊 Opening MetaMask connection popup...");

      // Force MetaMask to show account selection by using wallet_requestPermissions
      // This ensures user gets to choose which account to connect
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
        console.log(
          "✅ Account permissions requested - user can select account"
        );
      } catch (permissionError) {
        console.log(
          "Permission request failed, trying direct account request:",
          permissionError
        );
      }

      // Now request the accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setIsConnected(true);
        setUserAddress(accounts[0]);

        // Get network information
        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        setChainId(currentChainId);

        // Get additional account info
        try {
          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          });

          console.log("✅ Successfully connected to MetaMask:", {
            address: accounts[0],
            chainId: currentChainId,
            balance: balance,
            network: getNetworkName(currentChainId),
          });
        } catch (balanceError) {
          console.log("Could not fetch balance:", balanceError);
        }

        console.log("🎉 MetaMask connection successful!");

        // Automatically switch to Sepolia testnet after connection
        try {
          console.log("🔄 Switching to Sepolia testnet...");
          await switchNetwork("0xaa36a7");
        } catch (networkError) {
          console.log("Could not switch to Sepolia:", networkError);
          // Don't throw error, just log it - user can manually switch
        }
      } else {
        throw new Error(
          "No accounts found. Please unlock MetaMask and try again."
        );
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);

      // Handle specific error cases
      let errorMessage = "Failed to connect to MetaMask.";

      if (error.code === 4001) {
        errorMessage =
          "Connection rejected by user. Please try again and approve the connection.";
      } else if (error.code === -32002) {
        errorMessage =
          "Connection request already pending. Please check MetaMask.";
      } else if (error.message.includes("User rejected")) {
        errorMessage =
          "Connection was rejected. Please try again and approve the connection.";
      } else if (error.message.includes("MetaMask not detected")) {
        errorMessage =
          "MetaMask not detected. Please install MetaMask extension.";
      } else if (error.message.includes("No accounts found")) {
        errorMessage =
          "No accounts found. Please unlock MetaMask and try again.";
      } else {
        errorMessage = `Connection failed: ${error.message}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (responseData) => {
    setResponse(responseData);
    setError("");

    // Send callback if URL is provided
    if (callbackUrl) {
      try {
        console.log(`📤 Sending callback to: ${callbackUrl}`);
        const callbackResponse = await fetch(callbackUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "success",
            txHash: responseData.transactionHash || responseData.txHash,
            receiver: responseData.receiver,
            amount: responseData.amount,
            timestamp: new Date().toISOString(),
          }),
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

    // Animate response appearance
    setTimeout(() => {
      const responseElement = document.querySelector(".response-container");
      if (responseElement) {
        gsap.fromTo(
          responseElement,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }
        );
      }
    }, 100);
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
    setResponse(null);
  };

  const clearResponse = () => {
    setResponse(null);
    setError("");
  };

  const switchNetwork = async (targetChainId = "0xaa36a7") => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not available");
      }

      // Try to switch to the network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainId }],
        });
        console.log(`✅ Switched to network: ${targetChainId}`);
      } catch (switchError) {
        // If network is not added, try to add it
        if (switchError.code === 4902) {
          console.log(
            `Network ${targetChainId} not found, attempting to add it...`
          );
          await addNetwork(targetChainId);
        } else {
          throw switchError;
        }
      }
    } catch (error) {
      console.error("Error switching network:", error);
      setError(`Failed to switch network: ${error.message}`);
    }
  };

  const addNetwork = async (chainId) => {
    const networkConfigs = {
      "0xaa36a7": {
        chainId: "0xaa36a7",
        chainName: "Sepolia Test Network",
        nativeCurrency: {
          name: "Sepolia Ether",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://sepolia.infura.io/v3/"],
        blockExplorerUrls: ["https://sepolia.etherscan.io/"],
      },
      "0x1": {
        chainId: "0x1",
        chainName: "Ethereum Mainnet",
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://mainnet.infura.io/v3/"],
        blockExplorerUrls: ["https://etherscan.io/"],
      },
      "0x5": {
        chainId: "0x5",
        chainName: "Goerli Test Network",
        nativeCurrency: {
          name: "Goerli Ether",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://goerli.infura.io/v3/"],
        blockExplorerUrls: ["https://goerli.etherscan.io/"],
      },
    };

    const config = networkConfigs[chainId];
    if (!config) {
      throw new Error(`Network configuration not found for ${chainId}`);
    }

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [config],
      });
      console.log(`✅ Added network: ${config.chainName}`);
    } catch (addError) {
      console.error("Error adding network:", addError);
      throw new Error(`Failed to add network: ${addError.message}`);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);

      // Clear local state first
      setIsConnected(false);
      setUserAddress("");
      setChainId("");
      setResponse(null);
      setError("");

      // Try multiple disconnect methods for better compatibility
      if (window.ethereum && window.ethereum.request) {
        try {
          // Method 1: Try the newer disconnect method (if available)
          if (window.ethereum.disconnect) {
            await window.ethereum.disconnect();
            console.log("Disconnected using ethereum.disconnect()");
          }
        } catch (disconnectError) {
          console.log("ethereum.disconnect() not available:", disconnectError);
        }

        try {
          // Method 2: Try to revoke permissions
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
          });
          console.log("Permissions revoked");
        } catch (permissionError) {
          console.log("Permission revocation not supported:", permissionError);
        }

        try {
          // Method 3: Try to close the connection (if supported)
          if (window.ethereum.close) {
            await window.ethereum.close();
            console.log("Connection closed");
          }
        } catch (closeError) {
          console.log("ethereum.close() not available:", closeError);
        }
      }

      // Remove event listeners
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }

      console.log(
        "✅ Disconnected from MetaMask - User can now connect with different account"
      );
    } catch (error) {
      console.error("Error during disconnect:", error);
      setError("Failed to disconnect from MetaMask");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navbar */}
      <Navbar
        isMetaMaskAvailable={isMetaMaskAvailable}
        isConnected={isConnected}
        userAddress={userAddress}
        chainId={chainId}
        onConnect={connectMetaMask}
        onDisconnect={handleDisconnect}
        onSwitchNetwork={switchNetwork}
        loading={loading}
      />

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section */}
        <section ref={heroRef} className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">MerakiNexus</span>
              <br />
              <span className="text-white">Payment</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Pay seamlessly with blockchain or fallback API
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
                <span>MetaMask Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                <span>API Fallback</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neon-pink rounded-full"></div>
                <span>Secure Transactions</span>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Form */}
        <section className="pb-20 px-4">
          <div className="max-w-2xl mx-auto">
            <div ref={cardRef} className="glass-card p-8 md:p-10">
              {/* Mode Indicator */}
              <div className="mb-8 space-y-4">
                {isMetaMaskAvailable ? (
                  <div
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                      isConnected
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    <span>
                      {isConnected
                        ? "🦊 MetaMask Connected"
                        : "⚠️ MetaMask Not Connected"}
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                    <span>🔧 API Mode (MetaMask not detected)</span>
                  </div>
                )}

                {/* Network Status */}
                {isConnected && chainId && (
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-300">
                          Connected to:{" "}
                          <span className="text-neon-purple">
                            {getNetworkName(chainId)}
                          </span>
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => switchNetwork("0xaa36a7")}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            chainId === "0xaa36a7"
                              ? "bg-green-500/30 border border-green-500/50 text-green-400"
                              : "bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                          }`}
                        >
                          Sepolia
                        </button>
                        <button
                          onClick={() => switchNetwork("0x1")}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            chainId === "0x1"
                              ? "bg-green-500/30 border border-green-500/50 text-green-400"
                              : "bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                          }`}
                        >
                          Mainnet
                        </button>
                        <button
                          onClick={() => switchNetwork("0x5")}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            chainId === "0x5"
                              ? "bg-green-500/30 border border-green-500/50 text-green-400"
                              : "bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                          }`}
                        >
                          Goerli
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Callback Status */}
                {callbackUrl && (
                  <div className="glass-card p-4 bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-blue-400">
                        📤 Callback URL:{" "}
                        <span className="text-blue-300 font-mono text-xs">
                          {callbackUrl}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Payment Form */}
              <PaymentForm
                isMetaMaskAvailable={isMetaMaskAvailable}
                isConnected={isConnected}
                userAddress={userAddress}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                loading={loading}
                setLoading={setLoading}
                prefilledData={prefilledData}
                callbackUrl={callbackUrl}
              />

              {/* Response Viewer */}
              {response && (
                <div className="response-container mt-8">
                  <ResponseViewer response={response} onClear={clearResponse} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-dark-border">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-400">
              Built for{" "}
              <span className="gradient-text font-semibold">MerakiNexus</span>{" "}
              🚀
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
