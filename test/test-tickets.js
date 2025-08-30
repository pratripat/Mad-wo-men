/**
 * Test file for MAD(wo)MEN dNFT Ticketing System
 * This file demonstrates the functionality of the system
 */

const { ethers } = require('ethers');

// Sample test data
const testData = {
  recipientAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  eventName: 'MAD(wo)MEN Hackathon 2024',
  eventDate: '2024-12-15T10:00:00Z',
  eventLocation: 'Virtual Event',
  preEventMetadataURI: 'ipfs://QmX2AK2GXgkhA1ZQqWrdFcZZY5H3d5Z5Z5Z5Z5Z5Z5Z5Z5',
  postEventMetadataURI: 'ipfs://QmY3BK3HYh1BZQqWrdFcZZY5H3d5Z5Z5Z5Z5Z5Z5Z5Z5Z6',
  originalPrice: 50.00
};

/**
 * Test API endpoints
 */
async function testAPIEndpoints() {
  const baseURL = 'http://localhost:3001/api/tickets';
  
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // Test minting a ticket
    console.log('1. Testing ticket minting...');
    const mintResponse = await fetch(`${baseURL}/mint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const mintResult = await mintResponse.json();
    console.log('Mint Result:', mintResult);

    if (mintResult.success && mintResult.data.tokenId) {
      const tokenId = mintResult.data.tokenId;
      
      // Test getting ticket information
      console.log('\n2. Testing get ticket info...');
      const getTicketResponse = await fetch(`${baseURL}/${tokenId}`);
      const getTicketResult = await getTicketResponse.json();
      console.log('Get Ticket Result:', getTicketResult);

      // Test checking in
      console.log('\n3. Testing check-in...');
      const checkInResponse = await fetch(`${baseURL}/checkIn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId: tokenId,
          postEventMetadataURI: testData.postEventMetadataURI
        })
      });
      
      const checkInResult = await checkInResponse.json();
      console.log('Check-in Result:', checkInResult);

      // Test getting tickets by owner
      console.log('\n4. Testing get tickets by owner...');
      const ownerResponse = await fetch(`${baseURL}/owner/${testData.recipientAddress}`);
      const ownerResult = await ownerResponse.json();
      console.log('Owner Tickets Result:', ownerResult);

      // Test getting statistics
      console.log('\n5. Testing get statistics...');
      const statsResponse = await fetch(`${baseURL}/stats`);
      const statsResult = await statsResponse.json();
      console.log('Statistics Result:', statsResult);
    }

  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }
}

/**
 * Test smart contract functions
 */
async function testSmartContract() {
  console.log('🔗 Testing Smart Contract...\n');

  try {
    // This would require the contract to be deployed and the ABI to be available
    console.log('Note: Smart contract testing requires deployed contract and proper configuration');
    console.log('To test smart contract functions, deploy the contract first using: npm run deploy:sepolia');
    
  } catch (error) {
    console.error('❌ Smart Contract Test Error:', error.message);
  }
}

/**
 * Test database operations
 */
async function testDatabase() {
  console.log('🗄️ Testing Database Operations...\n');

  try {
    const mongoose = require('mongoose');
    const Ticket = require('../backend/models/Ticket');

    // Test database connection
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/madwomen-ticketing');
    console.log('✅ Database connected successfully');

    // Test creating a ticket document
    const testTicket = new Ticket({
      tokenId: 999,
      contractAddress: '0x1234567890123456789012345678901234567890',
      ownerAddress: testData.recipientAddress.toLowerCase(),
      eventName: testData.eventName,
      eventDate: new Date(testData.eventDate),
      eventLocation: testData.eventLocation,
      preEventMetadataURI: testData.preEventMetadataURI,
      originalPrice: testData.originalPrice,
      status: 'minted'
    });

    await testTicket.save();
    console.log('✅ Test ticket saved to database');

    // Test finding the ticket
    const foundTicket = await Ticket.findOne({ tokenId: 999 });
    console.log('✅ Test ticket found:', foundTicket ? 'Success' : 'Failed');

    // Clean up test data
    await Ticket.deleteOne({ tokenId: 999 });
    console.log('✅ Test ticket cleaned up');

    await mongoose.disconnect();
    console.log('✅ Database disconnected');

  } catch (error) {
    console.error('❌ Database Test Error:', error.message);
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting MAD(wo)MEN dNFT Ticketing System Tests\n');
  console.log('=' .repeat(50));

  // Test database operations
  await testDatabase();
  console.log('\n' + '=' .repeat(50));

  // Test API endpoints
  await testAPIEndpoints();
  console.log('\n' + '=' .repeat(50));

  // Test smart contract
  await testSmartContract();
  console.log('\n' + '=' .repeat(50));

  console.log('✅ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testAPIEndpoints,
  testSmartContract,
  testDatabase,
  runTests
};
