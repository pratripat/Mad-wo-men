# MAD(wo)MEN dNFT Ticketing System 🎫

A revolutionary **Dynamic NFT (dNFT) Ticketing System** built for the MAD(wo)MEN hackathon project. This system leverages blockchain technology to create secure, anti-fraud, and value-retaining event tickets that transform into collectible badges after events.

## 🌟 Project Overview

### What We Built
The MAD(wo)MEN dNFT Ticketing System is a complete end-to-end solution that addresses the major problems in traditional ticketing:

- **🚫 Anti-Fraud**: Blockchain-verified NFTs make counterfeiting impossible
- **💎 Lasting Value**: Tickets transform into collectible badges after events
- **🔒 True Ownership**: Users own their tickets in their wallets
- **📱 Smart Check-in**: QR code scanning with real-time validation
- **🌐 Web3 Integration**: Full blockchain integration with Ethereum

### Key Features
- **Event Management**: Create and manage multiple events
- **NFT Minting**: Automatically mint tickets as NFTs on the blockchain
- **QR Code Generation**: Dynamic QR codes for each ticket
- **Scanner Dashboard**: Real-time ticket validation and check-in
- **Status Tracking**: Monitor ticket status from purchase to attendance
- **In-Memory Testing**: Built-in testing mode for development

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + CORS + Helmet
- **Blockchain**: Ethereum + Solidity + Hardhat + Ethers.js
- **Smart Contract**: OpenZeppelin ERC721 with dynamic metadata
- **Storage**: In-Memory (Testing) + MongoDB (Production Ready)
- **QR Codes**: HTML5 QR Scanner + React QR Code
- **Development**: Nodemon + Hot Reload

### Project Structure
```
Mad-wo-men/
├── 📁 contracts/
│   └── EventTicket.sol              # Main smart contract
├── 📁 backend/
│   ├── controllers/
│   │   └── ticketController.js      # API controllers
│   ├── models/
│   │   ├── DynamicNFT.js            # NFT data model
│   │   ├── Events.js                # Event model
│   │   └── Ticket.js                # Ticket model
│   ├── routes/
│   │   ├── eventRoutes.js           # Event API routes
│   │   ├── ticketRoutes.js          # Ticket API routes
│   │   └── walletRoutes.js          # Wallet API routes
│   ├── services/
│   │   ├── coinbaseWalletService.js # Wallet integration
│   │   ├── mockWeb3Service.js       # Mock Web3 service
│   │   ├── ticketService.js         # Core business logic
│   │   └── web3Service.js           # Blockchain interaction
│   ├── server.js                    # Main Express server
│   ├── server-demo.js               # Demo server
│   └── server-test.js               # Test server
├── 📁 frontend/
│   ├── components/
│   │   ├── Events.tsx               # Events dashboard
│   │   ├── MyTickets.tsx            # User tickets view
│   │   └── Scanner.tsx              # QR code scanner
│   ├── src/
│   │   ├── App.tsx                  # Main application
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── package.json                 # Frontend dependencies
│   └── vite.config.ts               # Vite configuration
├── 📁 scripts/
│   └── deploy.js                    # Contract deployment
├── hardhat.config.js                # Hardhat configuration
├── package.json                     # Backend dependencies
└── README.md                        # This file
```

## 🚀 Quick Start Guide

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git** (for cloning the repository)

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd Mad-wo-men
```

### Step 2: Install Backend Dependencies
```bash
# Install backend dependencies
npm install

# Install additional required packages
npm install nodemon cors helmet express-rate-limit
```

### Step 3: Install Frontend Dependencies
```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Return to root directory
cd ..
```

### Step 4: Set Up Environment Variables
```bash
# Create environment file
cp .env.example .env

# Edit the .env file with your configuration
# (See Environment Configuration section below)
```

### Step 5: Start the Backend Server
```bash
# Start the backend server (development mode)
npm run dev

# Or start in production mode
npm start
```

**Expected Output:**
```
✅ Web3 provider initialized
✅ Smart contract initialized
📋 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
👤 Organizer Address: 0xC1318Ccc9CFfd57936d2B2bB43373A56265747c7
⚠️  MongoDB disabled - using in-memory storage for testing
🚀 MAD(wo)MEN dNFT Ticketing Server running on port 3002
📊 Environment: development
🔗 Health check: http://localhost:3002/health
🎫 Events API: http://localhost:3002/api/events
🎫 Tickets API: http://localhost:3002/api/tickets
💾 Storage: In-Memory (Testing Mode)
```

### Step 6: Start the Frontend Application
```bash
# Open a new terminal window
# Navigate to frontend directory
cd frontend

# Start the development server
npm run dev
```

**Expected Output:**
```
> vite-react-typescript-starter@0.0.0 dev
> vite
  VITE v4.5.14  ready in 897 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
  ➜  press h to show help
```

### Step 7: Access the Application
- **Frontend**: Open [http://localhost:5173](http://localhost:5173) in your browser
- **Backend API**: Available at [http://localhost:3002](http://localhost:3002)
- **Health Check**: [http://localhost:3002/health](http://localhost:3002/health)

## ⚙️ Environment Configuration

### Create .env File
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3002
NODE_ENV=development

# MongoDB Configuration (Optional for testing)
MONGODB_URI=mongodb://localhost:27017/madwomen-ticketing

# Web3 Configuration
ALCHEMY_API_KEY=your_alchemy_api_key_here
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Environment Variables Explained
- **PORT**: Backend server port (default: 3002)
- **NODE_ENV**: Environment mode (development/production)
- **MONGODB_URI**: MongoDB connection string (optional for testing)
- **ALCHEMY_API_KEY**: Your Alchemy API key for Ethereum RPC
- **PRIVATE_KEY**: Private key for contract interactions
- **CONTRACT_ADDRESS**: Deployed smart contract address
- **CORS_ORIGIN**: Frontend origin for CORS configuration

## 🎯 How to Use the Application

### 1. Connect Your Wallet
- Click the "Connect Wallet" button
- The system will simulate a wallet connection
- You'll see a mock wallet address displayed

### 2. Browse Events
- Navigate to the "Events" section
- View available events with details
- See seat availability and pricing

### 3. Purchase Tickets
- Click "Purchase Ticket" on any event
- The system will mint an NFT ticket
- You'll receive confirmation with NFT details

### 4. View Your Tickets
- Go to "My Tickets" section
- See all your purchased tickets
- Each ticket has a unique QR code

### 5. Use the Scanner
- Navigate to "Scanner" section
- Use "Enable Test Mode" for testing
- Scan QR codes to validate tickets
- Check-in attendees in real-time

## 🔧 Development Commands

### Backend Commands
```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Compile smart contracts
npm run compile

# Deploy to local network
npm run deploy:local

# Deploy to Sepolia testnet
npm run deploy:sepolia
```

### Frontend Commands
```bash
# Navigate to frontend directory
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Smart Contract Commands
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start local blockchain
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

## 🧪 Testing the System

### Test Mode Features
The application includes a comprehensive test mode:

1. **Sample Events**: 5 pre-loaded events for testing
2. **Mock Wallet**: Simulated wallet connection
3. **Test Scanner**: QR code simulation without camera
4. **In-Memory Storage**: No database setup required

### Testing Workflow
1. **Start both servers** (backend + frontend)
2. **Connect wallet** (simulated)
3. **Purchase tickets** from events
4. **View tickets** in My Tickets section
5. **Test scanner** with test mode
6. **Validate tickets** and check-in attendees

### Sample Data
The system comes with 5 sample events:
- MAD(wo)MEN Launch Party
- Blockchain & Web3 Summit
- Tech Innovation Conference
- Digital Art Exhibition
- Music Festival 2025

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Backend Server Won't Start
```bash
# Check if port 3002 is already in use
netstat -ano | findstr :3002

# Kill processes using port 3002 (Windows)
taskkill /f /im node.exe

# Kill processes using port 3002 (Mac/Linux)
lsof -ti:3002 | xargs kill -9
```

#### Frontend Won't Start
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Smart Contract Issues
```bash
# Clear Hardhat cache
npx hardhat clean

# Recompile contracts
npx hardhat compile

# Check Hardhat configuration
npx hardhat check
```

#### CORS Errors
- Ensure backend is running on port 3002
- Check CORS configuration in backend/server.js
- Verify frontend is running on port 5173

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

## 📱 API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Events
- **GET** `/api/events` - Get all events
- **GET** `/api/events/:id` - Get specific event

### Tickets
- **POST** `/api/tickets/purchase` - Purchase a ticket
- **GET** `/api/tickets/user/:address` - Get user tickets
- **POST** `/api/tickets/check-in` - Check-in attendee

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

## 🔒 Security Features

### Smart Contract Security
- **Access Control**: Only organizer can mint/update tickets
- **Input Validation**: Comprehensive parameter validation
- **Reentrancy Protection**: OpenZeppelin secure patterns
- **Event Logging**: Transparent transaction tracking

### API Security
- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Request parameter validation
- **Helmet**: Security headers
- **Environment Variables**: Secure configuration

## 🚀 Production Deployment

### Backend Deployment
```bash
# Set production environment
NODE_ENV=production

# Install production dependencies
npm install --production

# Start production server
npm start
```

### Frontend Deployment
```bash
# Build production version
npm run build

# Serve static files
npm run preview
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3002
MONGODB_URI=your_production_mongodb_uri
ALCHEMY_API_KEY=your_production_alchemy_key
CONTRACT_ADDRESS=your_deployed_contract_address
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style
- Use TypeScript for frontend components
- Follow ESLint configuration
- Use meaningful commit messages
- Test all changes before committing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenZeppelin**: Secure smart contract libraries
- **Hardhat**: Development framework
- **Ethers.js**: Web3 interaction
- **React**: Frontend framework
- **Vite**: Build tool
- **Tailwind CSS**: Styling framework

## 📞 Support & Community

### Getting Help
- **GitHub Issues**: Create an issue for bugs or feature requests
- **Documentation**: Check this README and code comments
- **Community**: Join our Discord or community channels

### Reporting Bugs
When reporting bugs, please include:
- Operating system and version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Console logs and error messages

---

## 🎉 You're All Set!

Congratulations! You've successfully set up the MAD(wo)MEN dNFT Ticketing System. 

**Next Steps:**
1. 🎫 **Purchase some tickets** from the Events page
2. 📱 **View your tickets** in the My Tickets section  
3. 🔍 **Test the scanner** with the test mode
4. 🚀 **Explore the code** and customize for your needs

**Happy Building! 🚀✨**

---

**Built with ❤️ for the MAD(wo)MEN hackathon project**
