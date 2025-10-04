import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Navbar = ({
  isMetaMaskAvailable,
  isConnected,
  userAddress,
  chainId,
  onConnect,
  onDisconnect,
  onSwitchNetwork,
  loading,
}) => {
  const navbarRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Animate navbar on mount
    gsap.fromTo(
      navbarRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const handleButtonHover = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleButtonLeave = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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

  const handleNetworkSwitch = () => {
    onSwitchNetwork("0xaa36a7");
  };

  const handleMainnetSwitch = () => {
    onSwitchNetwork("0x1");
  };

  const handleGoerliSwitch = () => {
    onSwitchNetwork("0x5");
  };

  return (
    <nav
      ref={navbarRef}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/90 backdrop-blur-lg border-b border-dark-border shadow-lg"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Navbar Content */}
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-neon rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🚀</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">
                MerakiNexus Payment
              </h1>
              <p className="text-xs text-gray-400">Blockchain Payments</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-sm font-bold gradient-text">MerakiNexus</h1>
            </div>
          </div>

          {/* Wallet Connection Section */}
          <div className="flex items-center">
            {isMetaMaskAvailable ? (
              <div className="flex items-center space-x-3">
                {isConnected ? (
                  <div className="flex items-center space-x-3">
                    {/* Connection Status */}
                    <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-400">
                        <span className="hidden sm:inline">Connected</span>
                        <span className="sm:hidden">✓</span>
                      </span>
                    </div>

                    {/* Address Display - Hidden on mobile */}
                    <div className="hidden md:block px-3 py-2 bg-dark-card border border-dark-border rounded-lg">
                      <span className="text-sm font-mono text-gray-300">
                        {formatAddress(userAddress)}
                      </span>
                    </div>

                    {/* Network Display - Hidden on small screens */}
                    {chainId && (
                      <div className="hidden lg:flex items-center space-x-2">
                        <div className="px-2 py-1 bg-neon-purple/20 border border-neon-purple/30 rounded text-xs text-neon-purple">
                          {getNetworkName(chainId)}
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={handleNetworkSwitch}
                            className={`px-2 py-1 rounded text-xs transition-colors ${
                              chainId === "0xaa36a7"
                                ? "bg-green-500/30 border border-green-500/50 text-green-400"
                                : "bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                            }`}
                            title="Switch to Sepolia Testnet"
                          >
                            Sepolia
                          </button>
                          <button
                            onClick={handleMainnetSwitch}
                            className={`px-2 py-1 rounded text-xs transition-colors ${
                              chainId === "0x1"
                                ? "bg-green-500/30 border border-green-500/50 text-green-400"
                                : "bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                            }`}
                            title="Switch to Ethereum Mainnet"
                          >
                            Mainnet
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Disconnect Button */}
                    <button
                      ref={buttonRef}
                      onClick={onDisconnect}
                      onMouseEnter={handleButtonHover}
                      onMouseLeave={handleButtonLeave}
                      disabled={loading}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-medium text-sm transition-all duration-300 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading && (
                        <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                      )}
                      <span className="hidden sm:inline">
                        {loading ? "Disconnecting..." : "Disconnect"}
                      </span>
                      <span className="sm:hidden">{loading ? "..." : "✕"}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    ref={buttonRef}
                    onClick={onConnect}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-neon text-white rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    title={
                      loading
                        ? "Connecting to MetaMask..."
                        : "Click to connect your MetaMask wallet and select account"
                    }
                  >
                    {loading && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}
                    <span className="hidden sm:inline">
                      {loading ? "Connecting..." : "🦊 Connect Wallet"}
                    </span>
                    <span className="sm:hidden">
                      {loading ? "..." : "🦊 Connect"}
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <span className="text-sm font-medium text-yellow-400">
                  <span className="hidden sm:inline">
                    ⚠️ MetaMask Not Found
                  </span>
                  <span className="sm:hidden">⚠️ No MetaMask</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Network Switcher - Only show when connected */}
        {isConnected && chainId && (
          <div className="lg:hidden border-t border-dark-border bg-dark-bg/50 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-3">
              {/* Network Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">
                    {getNetworkName(chainId)}
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {formatAddress(userAddress)}
                </div>
              </div>

              {/* Network Switch Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleNetworkSwitch}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    chainId === "0xaa36a7"
                      ? "bg-green-500/30 border border-green-500/50 text-green-400"
                      : "bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                  }`}
                >
                  Sepolia
                </button>
                <button
                  onClick={handleMainnetSwitch}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    chainId === "0x1"
                      ? "bg-green-500/30 border border-green-500/50 text-green-400"
                      : "bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                  }`}
                >
                  Mainnet
                </button>
                <button
                  onClick={handleGoerliSwitch}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
      </div>
    </nav>
  );
};

export default Navbar;
