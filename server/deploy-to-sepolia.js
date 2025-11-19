#!/usr/bin/env node

/**
 * MerakiNexus - Sepolia Deployment Script
 * This script helps deploy the PaymentContract to Sepolia testnet
 */

require('dotenv').config();
const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

const SEPOLIA_CHAIN_ID = 11155111;

async function main() {
  console.log('🚀 MerakiNexus - Sepolia Deployment Script');
  console.log('==========================================\n');

  // Check environment variables
  const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!ALCHEMY_API_URL || ALCHEMY_API_URL.includes('YOUR_ALCHEMY_KEY_HERE')) {
    console.error('❌ Error: ALCHEMY_API_URL not configured in .env file');
    console.log('📝 Please update your .env file with a valid Alchemy API URL');
    console.log('   Get one from: https://www.alchemy.com/\n');
    console.log('   Or use public RPC: https://ethereum-sepolia-rpc.publicnode.com');
    process.exit(1);
  }

  if (!PRIVATE_KEY || PRIVATE_KEY.includes('YOUR_PRIVATE_KEY_HERE')) {
    console.error('❌ Error: PRIVATE_KEY not configured in .env file');
    console.log('📝 Please update your .env file with your deployer private key');
    console.log('   ⚠️  Use a test account only!');
    console.log('   Get Sepolia ETH from: https://sepoliafaucet.com/\n');
    process.exit(1);
  }

  try {
    // Initialize Web3
    console.log('🔗 Connecting to Sepolia testnet...');
    const web3 = new Web3(ALCHEMY_API_URL);
    
    // Load account
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);
    console.log(`✅ Connected with account: ${account.address}`);

    // Check network
    const chainId = await web3.eth.getChainId();
    if (Number(chainId) !== SEPOLIA_CHAIN_ID) {
      console.error(`❌ Error: Connected to wrong network (Chain ID: ${chainId})`);
      console.log(`   Expected Sepolia (Chain ID: ${SEPOLIA_CHAIN_ID})`);
      process.exit(1);
    }
    console.log(`✅ Connected to Sepolia (Chain ID: ${chainId})`);

    // Check balance
    const balance = await web3.eth.getBalance(account.address);
    const balanceEth = web3.utils.fromWei(balance, 'ether');
    console.log(`💰 Account balance: ${balanceEth} ETH`);

    if (Number(balanceEth) < 0.01) {
      console.error('❌ Error: Insufficient balance for deployment');
      console.log('   You need at least 0.01 ETH on Sepolia testnet');
      console.log('   Get free Sepolia ETH from: https://sepoliafaucet.com/');
      process.exit(1);
    }

    // Load contract
    console.log('\n📄 Loading PaymentContract...');
    const contractPath = path.join(__dirname, '../build/contracts/PaymentContract.json');
    
    if (!fs.existsSync(contractPath)) {
      console.error('❌ Error: Contract not compiled');
      console.log('   Run: truffle compile');
      process.exit(1);
    }

    const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    const abi = contractJson.abi;
    const bytecode = contractJson.bytecode;

    console.log('✅ Contract loaded');

    // Deploy contract
    console.log('\n🚀 Deploying contract to Sepolia...');
    console.log('   This may take 30-60 seconds...');

    const contract = new web3.eth.Contract(abi);
    const deployTx = contract.deploy({ data: bytecode });

    // Estimate gas
    const gasEstimate = await deployTx.estimateGas({ from: account.address });
    console.log(`⛽ Estimated gas: ${gasEstimate}`);

    // Get current gas prices
    const gasPrice = await web3.eth.getGasPrice();
    const gasPriceGwei = web3.utils.fromWei(gasPrice, 'gwei');
    console.log(`⛽ Gas price: ${gasPriceGwei} gwei`);

    // Deploy with EIP-1559 (post-London fork)
    const deployedContract = await deployTx.send({
      from: account.address,
      gas: gasEstimate + 50000n, // Add buffer
      maxFeePerGas: web3.utils.toWei('50', 'gwei'),
      maxPriorityFeePerGas: web3.utils.toWei('2', 'gwei')
    });

    const contractAddress = deployedContract.options.address;
    console.log('\n✅ Contract deployed successfully!');
    console.log(`📄 Contract Address: ${contractAddress}`);

    // Update .env file
    console.log('\n📝 Updating .env file...');
    const envPath = path.join(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(
      'CONTRACT_ADDRESS=PENDING_DEPLOYMENT',
      `CONTRACT_ADDRESS=${contractAddress}`
    );
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated');

    // Verify deployment
    console.log('\n🔍 Verifying deployment...');
    const transactionCount = await deployedContract.methods.getTransactionCount().call();
    console.log(`✅ Contract is working! Transaction count: ${transactionCount}`);

    console.log('\n🎉 Deployment complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Verify contract on Etherscan:');
    console.log(`      https://sepolia.etherscan.io/address/${contractAddress}`);
    console.log('   2. Test the API:');
    console.log('      cd server && node src/index.js');
    console.log('\n💡 Save this contract address for future reference!');
    console.log(`   CONTRACT_ADDRESS=${contractAddress}\n`);

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    
    if (error.message.includes('insufficient funds')) {
      console.log('\n💡 You need more Sepolia ETH. Get some from:');
      console.log('   - https://sepoliafaucet.com/');
      console.log('   - https://www.alchemy.com/faucets/ethereum-sepolia');
    } else if (error.message.includes('gas')) {
      console.log('\n💡 Gas estimation failed. This could mean:');
      console.log('   - Network congestion (try again later)');
      console.log('   - Contract compilation issue (run: truffle compile)');
      console.log('   - RPC provider issue (check your Alchemy API key)');
    }
    
    process.exit(1);
  }
}

main();

