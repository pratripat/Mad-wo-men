require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import mock services
const MockWeb3Service = require('./services/mockWeb3Service');

const app = express();
const PORT = process.env.PORT || 3001;

// Create mock services
const mockWeb3Service = new MockWeb3Service();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MAD(wo)MEN dNFT Ticketing System is running (TEST MODE)',
    timestamp: new Date().toISOString(),
    mode: 'test'
  });
});

// Mock ticket routes
app.post('/api/tickets/mint', async (req, res) => {
  try {
    console.log('🎫 Mock mint ticket request received:', req.body);

    const {
      recipientAddress,
      eventName,
      eventDate,
      eventLocation,
      preEventMetadataURI,
      originalPrice
    } = req.body;

    // Validate request body
    if (!recipientAddress || !eventName || !eventDate || !eventLocation || !preEventMetadataURI || !originalPrice) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['recipientAddress', 'eventName', 'eventDate', 'eventLocation', 'preEventMetadataURI', 'originalPrice']
      });
    }

    // Mock mint the ticket
    const blockchainResult = await mockWeb3Service.mintTicket(recipientAddress, preEventMetadataURI);

    console.log('✅ Mock ticket minted successfully:', {
      tokenId: blockchainResult.tokenId,
      recipient: recipientAddress,
      transactionHash: blockchainResult.transactionHash
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Mock ticket minted successfully',
      data: {
        tokenId: blockchainResult.tokenId,
        recipient: recipientAddress,
        transactionHash: blockchainResult.transactionHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed,
        eventName,
        eventDate: new Date(eventDate),
        eventLocation,
        status: 'minted',
        mode: 'test'
      }
    });

  } catch (error) {
    console.error('❌ Error minting mock ticket:', error);
    res.status(500).json({
      error: 'Failed to mint mock ticket',
      message: error.message
    });
  }
});

app.post('/api/tickets/checkIn', async (req, res) => {
  try {
    console.log('✅ Mock check-in request received:', req.body);

    const { tokenId, postEventMetadataURI } = req.body;

    // Validate request body
    if (!tokenId || !postEventMetadataURI) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['tokenId', 'postEventMetadataURI']
      });
    }

    // Mock update metadata
    const blockchainResult = await mockWeb3Service.updateMetadataURI(tokenId, postEventMetadataURI);

    console.log('✅ Mock ticket checked in successfully:', {
      tokenId,
      transactionHash: blockchainResult.transactionHash
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Mock ticket checked in successfully',
      data: {
        tokenId,
        transactionHash: blockchainResult.transactionHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed,
        status: 'checked_in',
        checkedInAt: new Date(),
        newMetadataURI: postEventMetadataURI,
        mode: 'test'
      }
    });

  } catch (error) {
    console.error('❌ Error checking in mock ticket:', error);
    res.status(500).json({
      error: 'Failed to check in mock ticket',
      message: error.message
    });
  }
});

app.get('/api/tickets/stats', async (req, res) => {
  try {
    const totalSupply = await mockWeb3Service.getTotalSupply();
    const mockTickets = mockWeb3Service.getMockTickets();
    
    const mintedTickets = mockTickets.length;
    const checkedInTickets = mockTickets.filter(t => t.isUsed).length;
    const burnedTickets = 0; // Mock service doesn't track burned tickets

    res.status(200).json({
      success: true,
      data: {
        database: {
          totalTickets: mintedTickets,
          mintedTickets: mintedTickets,
          checkedInTickets: checkedInTickets,
          burnedTickets: burnedTickets
        },
        blockchain: {
          totalSupply: totalSupply,
          message: 'Mock blockchain data'
        },
        mode: 'test'
      }
    });

  } catch (error) {
    console.error('❌ Error getting mock stats:', error);
    res.status(500).json({
      error: 'Failed to get mock statistics',
      message: error.message
    });
  }
});

app.get('/api/tickets/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;

    // Validate token ID
    if (!tokenId || isNaN(tokenId)) {
      return res.status(400).json({
        error: 'Invalid token ID'
      });
    }

    // Get mock ticket info
    const blockchainInfo = await mockWeb3Service.getTicketInfo(tokenId);

    res.status(200).json({
      success: true,
      data: {
        token: {
          tokenId: parseInt(tokenId),
          status: blockchainInfo.isUsed ? 'checked_in' : 'minted'
        },
        blockchain: blockchainInfo,
        mode: 'test'
      }
    });

  } catch (error) {
    console.error('❌ Error getting mock ticket:', error);
    res.status(404).json({
      error: 'Mock ticket not found',
      message: error.message
    });
  }
});

app.get('/api/tickets/stats', async (req, res) => {
  try {
    const totalSupply = await mockWeb3Service.getTotalSupply();
    const mockTickets = mockWeb3Service.getMockTickets();
    
    const mintedTickets = mockTickets.length;
    const checkedInTickets = mockTickets.filter(t => t.isUsed).length;
    const burnedTickets = 0; // Mock service doesn't track burned tickets

    res.status(200).json({
      success: true,
      data: {
        database: {
          totalTickets: mintedTickets,
          mintedTickets: mintedTickets,
          checkedInTickets: checkedInTickets,
          burnedTickets: burnedTickets
        },
        blockchain: {
          totalSupply: totalSupply,
          message: 'Mock blockchain data'
        },
        mode: 'test'
      }
    });

  } catch (error) {
    console.error('❌ Error getting mock stats:', error);
    res.status(500).json({
      error: 'Failed to get mock statistics',
      message: error.message
    });
  }
});

app.get('/api/wallet/status', (req, res) => {
  res.json({
    success: true,
    data: {
      initialized: true,
      connected: true,
      provider: true,
      signer: true,
      message: 'Test mode - mock wallet connected'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MAD(wo)MEN dNFT Ticketing Server running on port ${PORT} (TEST MODE)`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test mode - Full functionality with mock blockchain`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST /api/tickets/mint - Mint mock tickets`);
  console.log(`   POST /api/tickets/checkIn - Check in mock tickets`);
  console.log(`   GET /api/tickets/:tokenId - Get mock ticket info`);
  console.log(`   GET /api/tickets/stats - Get mock statistics`);
  console.log(`   GET /api/wallet/status - Get mock wallet status`);
});

module.exports = app;
