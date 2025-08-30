const fs = require('fs');
const { ethers } = require('ethers');

// Generate a new wallet for testing
const wallet = ethers.Wallet.createRandom();

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
ALCHEMY_API_KEY=your_alchemy_api_key_here
PRIVATE_KEY=${wallet.privateKey}
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Smart Contract Configuration
CONTRACT_ADDRESS=your_deployed_contract_address_here
ORGANIZER_PRIVATE_KEY=${wallet.privateKey}

# Security Configuration
JWT_SECRET=${jwtSecret}
SESSION_SECRET=${sessionSecret}

# Generated Test Wallet
# Address: ${wallet.address}
# Private Key: ${wallet.privateKey}
# 
# IMPORTANT: Get some Sepolia testnet ETH for this address:
# - Go to: https://sepoliafaucet.com/
# - Enter address: ${wallet.address}
# - Get free test ETH for deployment
`;

// Write to .env file
fs.writeFileSync('.env', envContent);

console.log('✅ Environment file (.env) created successfully!');
console.log('\n📋 Generated Test Wallet:');
console.log('   Address:', wallet.address);
console.log('   Private Key:', wallet.privateKey);
console.log('\n⚠️  IMPORTANT: Save this private key securely!');
console.log('\n📋 Next steps:');
console.log('1. Get some Sepolia testnet ETH for the wallet address above');
console.log('2. Update ALCHEMY_API_KEY in .env with your Alchemy API key');
console.log('3. Run: npm run deploy:sepolia');
console.log('4. Update CONTRACT_ADDRESS in .env with the deployed contract address');
console.log('5. Run: npm run start');
