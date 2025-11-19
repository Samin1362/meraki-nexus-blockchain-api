#!/usr/bin/env node

/**
 * MerakiNexus - Setup Verification Script
 * Checks if everything is configured correctly before deployment
 */

require('dotenv').config();
const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

const SEPOLIA_CHAIN_ID = 11155111;

async function checkSetup() {
  console.log('🔍 MerakiNexus - Setup Verification');
  console.log('===================================\n');

  let errors = [];
  let warnings = [];
  let success = [];

  // Check 1: .env file exists
  console.log('1️⃣  Checking .env file...');
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    errors.push('.env file not found');
    console.log('   ❌ .env file not found');
  } else {
    success.push('.env file exists');
    console.log('   ✅ .env file exists');
  }

  // Check 2: Environment variables
  console.log('\n2️⃣  Checking environment variables...');
  const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

  if (!ALCHEMY_API_URL || ALCHEMY_API_URL.includes('YOUR_ALCHEMY_KEY_HERE')) {
    errors.push('ALCHEMY_API_URL not configured');
    console.log('   ❌ ALCHEMY_API_URL not configured');
  } else {
    success.push('ALCHEMY_API_URL configured');
    console.log('   ✅ ALCHEMY_API_URL configured');
  }

  if (!PRIVATE_KEY || PRIVATE_KEY.includes('YOUR_PRIVATE_KEY_HERE')) {
    errors.push('PRIVATE_KEY not configured');
    console.log('   ❌ PRIVATE_KEY not configured');
  } else {
    success.push('PRIVATE_KEY configured');
    console.log('   ✅ PRIVATE_KEY configured');
  }

  if (CONTRACT_ADDRESS === 'PENDING_DEPLOYMENT') {
    warnings.push('Contract not yet deployed');
    console.log('   ⚠️  CONTRACT_ADDRESS pending (will be set after deployment)');
  } else {
    success.push('CONTRACT_ADDRESS configured');
    console.log('   ✅ CONTRACT_ADDRESS configured');
  }

  // Check 3: Contract compilation
  console.log('\n3️⃣  Checking contract compilation...');
  const contractPath = path.join(__dirname, '../build/contracts/PaymentContract.json');
  if (!fs.existsSync(contractPath)) {
    errors.push('Contract not compiled');
    console.log('   ❌ Contract not compiled');
    console.log('      Run: truffle compile');
  } else {
    success.push('Contract compiled');
    console.log('   ✅ Contract compiled');
  }

  // Check 4: Node modules
  console.log('\n4️⃣  Checking dependencies...');
  if (!fs.existsSync('node_modules') || !fs.existsSync('../node_modules')) {
    errors.push('Dependencies not installed');
    console.log('   ❌ Dependencies not installed');
    console.log('      Run: npm install (in both root and server directories)');
  } else {
    success.push('Dependencies installed');
    console.log('   ✅ Dependencies installed');
  }

  // Check 5: Network connection (if credentials provided)
  if (ALCHEMY_API_URL && !ALCHEMY_API_URL.includes('YOUR_ALCHEMY_KEY_HERE') &&
      PRIVATE_KEY && !PRIVATE_KEY.includes('YOUR_PRIVATE_KEY_HERE')) {
    
    console.log('\n5️⃣  Checking network connection...');
    try {
      const web3 = new Web3(ALCHEMY_API_URL);
      
      // Check connection
      const blockNumber = await web3.eth.getBlockNumber();
      success.push('Connected to Sepolia');
      console.log(`   ✅ Connected to Sepolia (Block: ${blockNumber})`);

      // Check chain ID
      const chainId = await web3.eth.getChainId();
      if (Number(chainId) !== SEPOLIA_CHAIN_ID) {
        errors.push(`Wrong network (Chain ID: ${chainId})`);
        console.log(`   ❌ Wrong network (Chain ID: ${chainId})`);
        console.log(`      Expected Sepolia (Chain ID: ${SEPOLIA_CHAIN_ID})`);
      } else {
        success.push('Correct network (Sepolia)');
        console.log(`   ✅ Correct network (Sepolia)`);
      }

      // Check account balance
      console.log('\n6️⃣  Checking account balance...');
      const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
      const balance = await web3.eth.getBalance(account.address);
      const balanceEth = web3.utils.fromWei(balance, 'ether');
      
      console.log(`   📍 Account: ${account.address}`);
      console.log(`   💰 Balance: ${balanceEth} ETH`);

      if (Number(balanceEth) < 0.001) {
        errors.push('Insufficient balance');
        console.log('   ❌ Insufficient balance for deployment');
        console.log('      You need at least 0.01 ETH on Sepolia');
        console.log('      Get free Sepolia ETH from:');
        console.log('      - https://sepoliafaucet.com/');
        console.log('      - https://www.alchemy.com/faucets/ethereum-sepolia');
      } else if (Number(balanceEth) < 0.01) {
        warnings.push('Low balance (might not be enough for deployment)');
        console.log('   ⚠️  Low balance (might not be enough for deployment)');
        console.log('      Recommended: at least 0.01 ETH');
      } else {
        success.push('Sufficient balance');
        console.log('   ✅ Sufficient balance for deployment');
      }

    } catch (error) {
      errors.push(`Network connection failed: ${error.message}`);
      console.log('   ❌ Network connection failed');
      console.log(`      Error: ${error.message}`);
      console.log('      Check your ALCHEMY_API_URL in .env');
    }
  }

  // Summary
  console.log('\n' + '='.repeat(40));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(40));
  
  console.log(`\n✅ Passed: ${success.length}`);
  if (warnings.length > 0) {
    console.log(`⚠️  Warnings: ${warnings.length}`);
    warnings.forEach(w => console.log(`   - ${w}`));
  }
  if (errors.length > 0) {
    console.log(`\n❌ Errors: ${errors.length}`);
    errors.forEach(e => console.log(`   - ${e}`));
  }

  console.log('\n' + '='.repeat(40));

  if (errors.length > 0) {
    console.log('\n❌ Setup incomplete. Please fix the errors above.');
    console.log('\n📖 See SEPOLIA_SETUP.md for detailed instructions.');
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log('\n⚠️  Setup has warnings but can proceed.');
    console.log('\n✅ You can now run: node deploy-to-sepolia.js');
  } else {
    console.log('\n🎉 All checks passed! Setup is complete.');
    if (CONTRACT_ADDRESS === 'PENDING_DEPLOYMENT') {
      console.log('\n📋 Next step: Deploy your contract');
      console.log('   Run: node deploy-to-sepolia.js');
    } else {
      console.log('\n📋 Next step: Start your server');
      console.log('   Run: cd server && node src/index.js');
    }
  }
  
  console.log('');
}

checkSetup().catch(error => {
  console.error('\n❌ Verification failed:', error.message);
  process.exit(1);
});

