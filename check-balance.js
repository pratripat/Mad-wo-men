require('dotenv').config();
const { ethers } = require('ethers');

async function checkBalance() {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    );
    
    const address = '0xC1318Ccc9CFfd57936d2B2bB43373A56265747c7';
    const balance = await provider.getBalance(address);
    
    console.log('💰 Wallet Balance Check:');
    console.log('Address:', address);
    console.log('Balance:', ethers.formatEther(balance), 'ETH');
    
    if (balance === 0n) {
      console.log('\n⚠️  No ETH found! You need to get test ETH from a faucet:');
      console.log('1. Go to: https://sepoliafaucet.com/');
      console.log('2. Enter your address:', address);
      console.log('3. Get free test ETH');
      console.log('4. Wait a few minutes for the transaction to confirm');
    } else {
      console.log('\n✅ You have ETH! Ready to deploy the contract.');
    }
  } catch (error) {
    console.error('❌ Error checking balance:', error.message);
  }
}

checkBalance();
