require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

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
    message: 'MAD(wo)MEN dNFT Ticketing System is running (DEMO MODE)',
    timestamp: new Date().toISOString(),
    mode: 'demo'
  });
});

// Demo API endpoints
app.get('/api/tickets/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      database: {
        totalTickets: 0,
        mintedTickets: 0,
        checkedInTickets: 0,
        burnedTickets: 0
      },
      blockchain: {
        totalSupply: null,
        message: 'Contract not deployed yet'
      },
      mode: 'demo'
    }
  });
});

app.get('/api/wallet/status', (req, res) => {
  res.json({
    success: true,
    data: {
      initialized: true,
      connected: false,
      provider: true,
      signer: false,
      message: 'Demo mode - no wallet connection required'
    }
  });
});

app.post('/api/tickets/mint', (req, res) => {
  res.status(500).json({
    error: 'Demo mode - Smart contract not deployed',
    message: 'Deploy contract first using: npm run deploy:sepolia'
  });
});

app.post('/api/tickets/checkIn', (req, res) => {
  res.status(500).json({
    error: 'Demo mode - Smart contract not deployed',
    message: 'Deploy contract first using: npm run deploy:sepolia'
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
  console.log(`🚀 MAD(wo)MEN dNFT Ticketing Server running on port ${PORT} (DEMO MODE)`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`⚠️  Demo mode - No MongoDB required`);
  console.log(`📋 Next steps:`);
  console.log(`   1. Get test ETH from faucet`);
  console.log(`   2. Deploy contract: npm run deploy:sepolia`);
  console.log(`   3. Start full server: npm run start`);
});

module.exports = app;
