#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 MAD(wo)MEN dNFT Ticketing - Environment Setup\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupEnvironment() {
  try {
    // Generate a new wallet for testing
    const { ethers } = require('ethers');
    const wallet = ethers.Wallet.createRandom();
    
    console.log('✅ Generated new test wallet:');
    console.log(`   Address: ${wallet.address}`);
    console.log(`   Private Key: ${wallet.privateKey}`);
    console.log('\n⚠️  IMPORTANT: Save this private key securely! You\'ll need it for deployment.\n');

    // Ask for required values
    const alchemyApiKey = await askQuestion('🔑 Enter your Alchemy API Key: ');
    const etherscanApiKey = await askQuestion('🔍 Enter your Etherscan API Key (optional): ');
    
    // Generate secure secrets
    const jwtSecret = require('crypto').randomBytes(32).toString('hex');
    const sessionSecret = require('crypto').randomBytes(32).toString('hex');

    // Create .env content
    const envContent = `# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/madwomen-ticketing

# Ethereum Configuration
ALCHEMY_API_KEY=${alchemyApiKey}
PRIVATE_KEY=${wallet.privateKey}
ETHERSCAN_API_KEY=${etherscanApiKey}

# Smart Contract Configuration
CONTRACT_ADDRESS=your_deployed_contract_address_here
ORGANIZER_PRIVATE_KEY=${wallet.privateKey}

# Security Configuration
JWT_SECRET=${jwtSecret}
SESSION_SECRET=${sessionSecret}

# Optional: For production deployment
# REDIS_URL=redis://localhost:6379
# AWS_ACCESS_KEY_ID=your_aws_access_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret_key
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=your_s3_bucket_name
`;

    // Write to .env file
    fs.writeFileSync('.env', envContent);
    console.log('\n✅ Environment file (.env) created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Get some Sepolia testnet ETH for the wallet address above');
    console.log('2. Run: npm run deploy:sepolia');
    console.log('3. Update CONTRACT_ADDRESS in .env with the deployed contract address');
    console.log('4. Run: npm run start');

  } catch (error) {
    console.error('❌ Error setting up environment:', error.message);
  } finally {
    rl.close();
  }
}

setupEnvironment();
