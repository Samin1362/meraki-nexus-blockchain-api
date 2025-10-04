const { Web3 } = require("web3");
const PaymentContract = require("../../../build/contracts/PaymentContract.json");

// Environment variables with fallbacks
const BLOCKCHAIN_RPC_URL =
  process.env.ALCHEMY_API_URL ||
  process.env.BLOCKCHAIN_RPC_URL ||
  "http://127.0.0.1:7545";
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0xda9053D313bdE1FA8E3917aa82b0E1B2329531cd";

// Initialize Web3 and contract
const web3 = new Web3(BLOCKCHAIN_RPC_URL);
const contract = new web3.eth.Contract(PaymentContract.abi, CONTRACT_ADDRESS);

console.log("🚀 MerakiNexus Payment API Server Starting...");
console.log(`📡 Blockchain RPC: ${BLOCKCHAIN_RPC_URL}`);
console.log(`📄 Contract Address: ${CONTRACT_ADDRESS}`);

module.exports = {
  web3,
  contract,
  BLOCKCHAIN_RPC_URL,
  CONTRACT_ADDRESS,
};
