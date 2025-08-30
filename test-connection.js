require('dotenv').config();
const { ethers } = require('ethers');

async function testConnection() {
  try {
    console.log('🔍 Testing Alchemy Connection...');
    
    // Create provider
    const provider = new ethers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    );
    
    // Test connection
    const network = await provider.getNetwork();
    console.log('✅ Connected to network:', network.name);
    
    // Check wallet balance
    const address = '0xC1318Ccc9CFfd57936d2B2bB43373A56265747c7';
    const balance = await provider.getBalance(address);
    console.log('💰 Wallet balance:', ethers.formatEther(balance), 'ETH');
    
    if (balance > 0n) {
      console.log('🎉 You have ETH! Ready to deploy.');
    } else {
      console.log('⚠️  No ETH yet. Get some from a faucet.');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
