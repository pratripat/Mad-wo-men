// const mongoose = require('mongoose');
// const Event = require('../models/Events');
// const DynamicNft = require('../models/DynamicNFT');
const web3Service = require('../services/web3Service');

// In-memory storage for testing
const eventStorage = new Map();
const ticketStorage = new Map();

// Initialize with 5 sample events
const initializeSampleEvents = () => {
  const sampleEvents = [
    {
      _id: '1',
      eventName: 'MAD(wo)MEN Launch Party',
      eventType: 'tech',
      location: 'New York City, NY',
      date: new Date('2025-01-15'),
      price: 99.99,
      maxSeats: 500,
      bookedSeats: 127
    },
    {
      _id: '2',
      eventName: 'Blockchain & Web3 Summit',
      eventType: 'tech',
      location: 'San Francisco, CA',
      date: new Date('2025-02-20'),
      price: 149.99,
      maxSeats: 300,
      bookedSeats: 89
    },
    {
      _id: '3',
      eventName: 'Tech Innovation Conference',
      eventType: 'tech',
      location: 'Austin, TX',
      date: new Date('2025-03-10'),
      price: 79.99,
      maxSeats: 400,
      bookedSeats: 156
    },
    {
      _id: '4',
      eventName: 'Digital Art Exhibition',
      eventType: 'art',
      location: 'Los Angeles, CA',
      date: new Date('2025-04-05'),
      price: 45.00,
      maxSeats: 200,
      bookedSeats: 78
    },
    {
      _id: '5',
      eventName: 'Music Festival 2025',
      eventType: 'music',
      location: 'Miami, FL',
      date: new Date('2025-05-15'),
      price: 199.99,
      maxSeats: 1000,
      bookedSeats: 234
    }
  ];

  sampleEvents.forEach(event => {
    eventStorage.set(event._id, { ...event });
  });
};

// Initialize sample events
initializeSampleEvents();

exports.purchaseTicket = async (eventId, userWalletAddress) => {
  try {
    const event = eventStorage.get(eventId);
    if (!event) {
      throw new Error('Event not found.');
    }
    
    if (event.bookedSeats >= event.maxSeats) {
      throw new Error('All seats for this event have been booked.');
    }
    
    let userNft = ticketStorage.get(userWalletAddress);
    let isNewNft = !userNft;
    
    if (isNewNft) {
      userNft = {
        walletAddress: userWalletAddress,
        eventsAttended: new Map(),
      };
    } else {
      if (userNft.eventsAttended.has(eventId)) {
        throw new Error('You have already purchased a ticket for this event.');
      }
    }
    
    // Update event booked seats
    event.bookedSeats += 1;
    eventStorage.set(eventId, event);
    
    // Create metadata URI for the NFT
    const metadataURI = JSON.stringify({
      name: `${event.eventName} - Ticket`,
      description: `NFT Ticket for ${event.eventName}`,
      image: "https://via.placeholder.com/400x400/6366f1/ffffff?text=Event+Ticket",
      attributes: [
        {
          trait_type: "Event Name",
          value: event.eventName
        },
        {
          trait_type: "Event Type", 
          value: event.eventType
        },
        {
          trait_type: "Event Date",
          value: event.date.toISOString()
        },
        {
          trait_type: "Event Location",
          value: event.location
        },
        {
          trait_type: "Ticket Status",
          value: "Active"
        }
      ]
    });
    
    // Mint the actual NFT on the blockchain
    let nftMintResult = null;
    if (web3Service.isContractReady()) {
      try {
        nftMintResult = await web3Service.mintTicket(userWalletAddress, metadataURI);
        console.log(`🎫 NFT minted successfully! Token ID: ${nftMintResult.tokenId}`);
      } catch (mintError) {
        console.error('❌ Failed to mint NFT on blockchain:', mintError);
        // Continue with local storage even if blockchain minting fails
        nftMintResult = {
          success: false,
          tokenId: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          transactionHash: `local_${Date.now()}`,
          error: mintError.message
        };
      }
    } else {
      // Fallback for when contract is not ready
      nftMintResult = {
        success: false,
        tokenId: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        transactionHash: `local_${Date.now()}`,
        error: 'Contract not deployed'
      };
    }
    
    // Update user's NFT data with the minted token information
    const eventType = event.eventType || 'unknown';
    const eventCounts = userNft.eventsAttended.get('eventCounts') || {};
    eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;
    userNft.eventsAttended.set('eventCounts', eventCounts);
    
    userNft.eventsAttended.set(eventId, {
      eventName: event.eventName,
      eventType: event.eventType,
      status: 'toBeAttended',
      purchaseDate: new Date(),
      eventDate: event.date,
      eventLocation: event.location,
      // Store the actual NFT data
      nftTokenId: nftMintResult.tokenId,
      nftTransactionHash: nftMintResult.transactionHash,
      nftMetadataURI: metadataURI,
      nftMintSuccess: nftMintResult.success,
      nftBlockNumber: nftMintResult.blockNumber
    });
    
    ticketStorage.set(userWalletAddress, userNft);
    
    console.log(`🎫 Ticket purchased successfully for event ${event.eventName}!`);
    console.log(`🔗 NFT Token ID: ${nftMintResult.tokenId}`);
    console.log(`📝 Transaction Hash: ${nftMintResult.transactionHash}`);
    
    return {
      transactionHash: nftMintResult.transactionHash,
      tokenId: nftMintResult.tokenId,
      updatedNft: userNft,
      event: event,
      nftMintSuccess: nftMintResult.success
    };
  } catch (error) {
    throw new Error(`Failed to purchase ticket: ${error.message}`);
  }
};

exports.checkTicket = async (userWalletAddress, eventId) => {
  try {
    console.log(`🔍 Checking ticket for wallet: ${userWalletAddress}, event: ${eventId}`);
    
    const userNft = ticketStorage.get(userWalletAddress);
    if (!userNft) {
      console.log('❌ No NFT found for wallet address');
      return { success: false, message: 'No ticket found for this wallet address.' };
    }
    
    const eventData = userNft.eventsAttended.get(eventId);
    if (!eventData) {
      console.log('❌ No event data found for event ID');
      return { success: false, message: 'User has not registered for this event.' };
    }
    
    console.log(`📋 Current ticket status: ${eventData.status}`);
    
    if (eventData.status === 'Attended') {
      console.log('❌ Ticket already attended');
      return { success: false, message: 'This ticket has already been used.' };
    }
    
    // Update ticket status to attended
    eventData.status = 'Attended';
    userNft.eventsAttended.set(eventId, eventData);
    ticketStorage.set(userWalletAddress, userNft);
    
    console.log(`✅ Ticket status updated to 'Attended' for event ${eventData.eventName}`);
    console.log(`💾 Updated data stored in ticketStorage`);
    
    // If we have a real NFT, update its metadata on the blockchain
    if (eventData.nftTokenId && web3Service.isContractReady() && eventData.nftMintSuccess) {
      try {
        const postEventMetadataURI = JSON.stringify({
          name: `${eventData.eventName} - Attended`,
          description: `NFT Ticket for ${eventData.eventName} - Event Attended`,
          image: "https://via.placeholder.com/400x400/10b981/ffffff?text=Event+Attended",
          attributes: [
            {
              trait_type: "Event Name",
              value: eventData.eventName
            },
            {
              trait_type: "Event Type", 
              value: eventData.eventType || 'unknown'
            },
            {
              trait_type: "Event Date",
              value: eventData.purchaseDate || new Date().toISOString()
            },
            {
              trait_type: "Event Location",
              value: eventData.eventLocation || 'Unknown'
            },
            {
              trait_type: "Ticket Status",
              value: "Attended"
            },
            {
              trait_type: "Check-in Date",
              value: new Date().toISOString()
            }
          ]
        });
        
        await web3Service.updateMetadataURI(eventData.nftTokenId, postEventMetadataURI);
        console.log(`✅ NFT metadata updated for token ${eventData.nftTokenId}`);
      } catch (updateError) {
        console.error('❌ Failed to update NFT metadata:', updateError);
        // Continue even if blockchain update fails
      }
    }
    
    const result = {
      success: true,
      message: 'Check-in successful! Welcome to the event.',
      userName: 'Attendee',
      eventStatus: 'Attended',
      tokenId: eventData.nftTokenId || eventId
    };
    
    console.log(`🎉 Check-in successful, returning:`, result);
    return result;
  } catch (error) {
    console.error('Check-in transaction failed:', error);
    return { success: false, message: 'An internal error occurred. Please try again.' };
  }
};

exports.getUserTickets = async (walletAddress) => {
  try {
    const userNft = ticketStorage.get(walletAddress);
    if (!userNft) {
      return [];
    }
    
    const tickets = [];
    for (const [eventId, eventData] of userNft.eventsAttended.entries()) {
      if (eventId !== 'eventCounts') {
        tickets.push({
          tokenId: eventData.nftTokenId || eventId,
          eventId: eventId,
          event: {
            id: eventId,
            name: eventData.eventName,
            date: eventData.eventDate,
            location: eventData.eventLocation
          },
          status: eventData.status,
          purchaseDate: eventData.purchaseDate,
          // Include NFT-specific data for QR generation
          nftTransactionHash: eventData.nftTransactionHash,
          nftMintSuccess: eventData.nftMintSuccess,
          nftBlockNumber: eventData.nftBlockNumber
        });
      }
    }
    return tickets;
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    throw new Error(`Failed to fetch user tickets: ${error.message}`);
  }
};

// Helper function to get all events
exports.getAllEvents = () => {
  return Array.from(eventStorage.values());
}; 