const Ticket = require('../models/Ticket');
const web3Service = require('../services/web3Service');

/**
 * @description Mint a new ticket (NFT) for an attendee
 * @route POST /api/tickets/mint
 * @access Private (Organizer only)
 */
const mintTicket = async (req, res) => {
  try {
    console.log('🎫 Mint ticket request received:', req.body);

    // Validate request body
    const {
      recipientAddress,
      eventName,
      eventDate,
      eventLocation,
      preEventMetadataURI,
      originalPrice
    } = req.body;

    // Required field validation
    if (!recipientAddress || !eventName || !eventDate || !eventLocation || !preEventMetadataURI || !originalPrice) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['recipientAddress', 'eventName', 'eventDate', 'eventLocation', 'preEventMetadataURI', 'originalPrice']
      });
    }

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      return res.status(400).json({
        error: 'Invalid Ethereum address format'
      });
    }

    // Validate date format
    const eventDateObj = new Date(eventDate);
    if (isNaN(eventDateObj.getTime())) {
      return res.status(400).json({
        error: 'Invalid event date format'
      });
    }

    // Validate price
    if (isNaN(originalPrice) || originalPrice <= 0) {
      return res.status(400).json({
        error: 'Invalid original price'
      });
    }

    // Check if Web3 service is ready
    if (!web3Service.isReady()) {
      return res.status(500).json({
        error: 'Web3 service not ready'
      });
    }

    // Check if contract is deployed
    if (!web3Service.isContractReady()) {
      return res.status(500).json({
        error: 'Smart contract not deployed. Deploy contract first using: npm run deploy:sepolia'
      });
    }

    // Mint the ticket on the blockchain
    console.log('🔄 Minting ticket on blockchain...');
    const blockchainResult = await web3Service.mintTicket(recipientAddress, preEventMetadataURI);

    if (!blockchainResult.success || !blockchainResult.tokenId) {
      throw new Error('Failed to mint ticket on blockchain');
    }

    // Create ticket record in database
    const ticketData = {
      tokenId: parseInt(blockchainResult.tokenId),
      contractAddress: process.env.CONTRACT_ADDRESS,
      ownerAddress: recipientAddress.toLowerCase(),
      eventName,
      eventDate: eventDateObj,
      eventLocation,
      preEventMetadataURI,
      originalPrice: parseFloat(originalPrice),
      status: 'minted',
      mintedAt: new Date(),
      updatedAt: new Date()
    };

    const ticket = new Ticket(ticketData);
    await ticket.save();

    console.log('✅ Ticket minted successfully:', {
      tokenId: blockchainResult.tokenId,
      recipient: recipientAddress,
      transactionHash: blockchainResult.transactionHash
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Ticket minted successfully',
      data: {
        tokenId: blockchainResult.tokenId,
        recipient: recipientAddress,
        transactionHash: blockchainResult.transactionHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed,
        eventName,
        eventDate: eventDateObj,
        eventLocation,
        status: 'minted'
      }
    });

  } catch (error) {
    console.error('❌ Error minting ticket:', error);
    res.status(500).json({
      error: 'Failed to mint ticket',
      message: error.message
    });
  }
};

/**
 * @description Check in a ticket (update metadata URI to post-event state)
 * @route POST /api/tickets/checkIn
 * @access Private (Organizer only)
 */
const checkIn = async (req, res) => {
  try {
    console.log('✅ Check-in request received:', req.body);

    const { tokenId, postEventMetadataURI } = req.body;

    // Validate request body
    if (!tokenId || !postEventMetadataURI) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['tokenId', 'postEventMetadataURI']
      });
    }

    // Validate token ID
    if (isNaN(tokenId) || parseInt(tokenId) <= 0) {
      return res.status(400).json({
        error: 'Invalid token ID'
      });
    }

    // Find ticket in database
    const ticket = await Ticket.findOne({ tokenId: parseInt(tokenId) });
    if (!ticket) {
      return res.status(404).json({
        error: 'Ticket not found'
      });
    }

    // Check if ticket is already used
    if (ticket.status === 'checked_in') {
      return res.status(400).json({
        error: 'Ticket has already been checked in'
      });
    }

    if (ticket.status === 'burned') {
      return res.status(400).json({
        error: 'Ticket has been burned and cannot be checked in'
      });
    }

    // Check if Web3 service is ready
    if (!web3Service.isReady()) {
      return res.status(500).json({
        error: 'Web3 service not ready'
      });
    }

    // Check if contract is deployed
    if (!web3Service.isContractReady()) {
      return res.status(500).json({
        error: 'Smart contract not deployed. Deploy contract first using: npm run deploy:sepolia'
      });
    }

    // Update metadata URI on blockchain
    console.log('🔄 Updating metadata on blockchain...');
    const blockchainResult = await web3Service.updateMetadataURI(tokenId, postEventMetadataURI);

    if (!blockchainResult.success) {
      throw new Error('Failed to update metadata on blockchain');
    }

    // Update ticket in database
    ticket.status = 'checked_in';
    ticket.postEventMetadataURI = postEventMetadataURI;
    ticket.checkedInAt = new Date();
    ticket.checkedInBy = 'organizer'; // In a real app, this would be the actual organizer's ID
    ticket.updatedAt = new Date();

    await ticket.save();

    console.log('✅ Ticket checked in successfully:', {
      tokenId,
      transactionHash: blockchainResult.transactionHash
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Ticket checked in successfully',
      data: {
        tokenId,
        transactionHash: blockchainResult.transactionHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed,
        status: 'checked_in',
        checkedInAt: ticket.checkedInAt,
        newMetadataURI: postEventMetadataURI
      }
    });

  } catch (error) {
    console.error('❌ Error checking in ticket:', error);
    res.status(500).json({
      error: 'Failed to check in ticket',
      message: error.message
    });
  }
};

/**
 * @description Get ticket information
 * @route GET /api/tickets/:tokenId
 * @access Public
 */
const getTicket = async (req, res) => {
  try {
    const { tokenId } = req.params;

    // Validate token ID
    if (!tokenId || isNaN(tokenId)) {
      return res.status(400).json({
        error: 'Invalid token ID'
      });
    }

    // Find ticket in database
    const ticket = await Ticket.findOne({ tokenId: parseInt(tokenId) });
    if (!ticket) {
      return res.status(404).json({
        error: 'Ticket not found'
      });
    }

    // Get blockchain information if Web3 service is ready
    let blockchainInfo = null;
    if (web3Service.isReady()) {
      try {
        blockchainInfo = await web3Service.getTicketInfo(tokenId);
      } catch (error) {
        console.warn('⚠️ Could not fetch blockchain info:', error.message);
      }
    }

    // Return ticket information
    res.status(200).json({
      success: true,
      data: {
        token: ticket,
        blockchain: blockchainInfo
      }
    });

  } catch (error) {
    console.error('❌ Error getting ticket:', error);
    res.status(500).json({
      error: 'Failed to get ticket information',
      message: error.message
    });
  }
};

/**
 * @description Get all tickets for an owner
 * @route GET /api/tickets/owner/:address
 * @access Public
 */
const getTicketsByOwner = async (req, res) => {
  try {
    const { address } = req.params;

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({
        error: 'Invalid Ethereum address format'
      });
    }

    // Find tickets in database
    const tickets = await Ticket.find({ ownerAddress: address.toLowerCase() });

    res.status(200).json({
      success: true,
      data: {
        owner: address,
        tickets: tickets,
        count: tickets.length
      }
    });

  } catch (error) {
    console.error('❌ Error getting tickets by owner:', error);
    res.status(500).json({
      error: 'Failed to get tickets',
      message: error.message
    });
  }
};

/**
 * @description Get system statistics
 * @route GET /api/tickets/stats
 * @access Public
 */
const getStats = async (req, res) => {
  try {
    // Get statistics from database
    const [totalTickets, mintedTickets, checkedInTickets, burnedTickets] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'minted' }),
      Ticket.countDocuments({ status: 'checked_in' }),
      Ticket.countDocuments({ status: 'burned' })
    ]);

    // Get blockchain statistics if Web3 service is ready
    let totalSupply = null;
    if (web3Service.isReady()) {
      try {
        totalSupply = await web3Service.getTotalSupply();
      } catch (error) {
        console.warn('⚠️ Could not fetch blockchain stats:', error.message);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        database: {
          totalTickets,
          mintedTickets,
          checkedInTickets,
          burnedTickets
        },
        blockchain: {
          totalSupply
        }
      }
    });

  } catch (error) {
    console.error('❌ Error getting stats:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: error.message
    });
  }
};

module.exports = {
  mintTicket,
  checkIn,
  getTicket,
  getTicketsByOwner,
  getStats
};
