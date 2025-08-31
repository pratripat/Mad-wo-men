# 🚀 Setup Guide - MAD(wo)MEN dNFT Ticketing System

This guide will walk you through setting up the complete MAD(wo)MEN dNFT Ticketing System step by step.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### Verify Installation
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show v8.x.x or higher
git --version     # Should show git version
```

## 🔧 Step-by-Step Setup

### Step 1: Clone the Repository
```bash
# Clone the repository
git clone <your-repository-url>
cd Mad-wo-men

# Verify the structure
ls -la
```

**Expected Output:**
```
📁 contracts/
📁 backend/
📁 frontend/
📁 scripts/
📄 package.json
📄 hardhat.config.js
📄 README.md
```

### Step 2: Install Backend Dependencies
```bash
# Install backend dependencies
npm install

# Install additional required packages
npm install nodemon cors helmet express-rate-limit

# Verify installation
npm list --depth=0
```

### Step 3: Install Frontend Dependencies
```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Return to root directory
cd ..

# Verify both installations
echo "Backend packages:"
npm list --depth=0 | head -10
echo "Frontend packages:"
cd frontend && npm list --depth=0 | head -10 && cd ..
```

### Step 4: Environment Configuration
```bash
# Create environment file
cp .env.example .env

# Edit the .env file with your configuration
# Use any text editor: nano, vim, or VS Code
nano .env
```

**Required .env Configuration:**
```env
# Server Configuration
PORT=3002
NODE_ENV=development

# MongoDB Configuration (Optional for testing)
# MONGODB_URI=mongodb://localhost:27017/madwomen-ticketing

# Web3 Configuration
ALCHEMY_API_KEY=your_alchemy_api_key_here
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Debug Configuration
DEBUG=false
```

**Environment Variables Explained:**
- **PORT**: Backend server port (default: 3002)
- **NODE_ENV**: Environment mode (development/production)
- **MONGODB_URI**: MongoDB connection string (optional for testing)
- **ALCHEMY_API_KEY**: Your Alchemy API key for Ethereum RPC
- **PRIVATE_KEY**: Private key for contract interactions
- **CONTRACT_ADDRESS**: Deployed smart contract address
- **CORS_ORIGIN**: Frontend origin for CORS configuration

### Step 5: Start the Backend Server
```bash
# Start the backend server (development mode)
npm run dev
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

**If you see port conflicts:**
```bash
# Check if port 3002 is in use
netstat -ano | findstr :3002    # Windows
lsof -ti:3002                   # Mac/Linux

# Kill processes using port 3002
taskkill /f /im node.exe        # Windows
lsof -ti:3002 | xargs kill -9   # Mac/Linux
```

### Step 6: Start the Frontend Application
```bash
# Open a NEW terminal window
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

### Step 7: Verify Both Servers Are Running
```bash
# Terminal 1 - Backend (should show server running)
# Terminal 2 - Frontend (should show Vite ready)

# Test backend health
curl http://localhost:3002/health

# Test frontend (open in browser)
open http://localhost:5173    # Mac
start http://localhost:5173   # Windows
xdg-open http://localhost:5173 # Linux
```

## 🧪 Testing the System

### 1. Connect Your Wallet
- Open [http://localhost:5173](http://localhost:5173) in your browser
- Click the "Connect Wallet" button
- You should see a mock wallet address displayed

### 2. Browse Events
- Navigate to the "Events" section
- You should see 5 sample events loaded
- Each event shows details, pricing, and seat availability

### 3. Purchase Tickets
- Click "Purchase Ticket" on any event
- The system will simulate NFT minting
- You'll receive confirmation with ticket details

### 4. View Your Tickets
- Go to "My Tickets" section
- See all your purchased tickets
- Each ticket has a unique QR code

### 5. Test the Scanner
- Navigate to "Scanner" section
- Click "Enable Test Mode" for instant testing
- Simulate QR code scanning and validation

## 🚨 Troubleshooting Common Issues

### Backend Server Issues

**Port Already in Use:**
```bash
# Check what's using port 3002
netstat -ano | findstr :3002    # Windows
lsof -ti:3002                   # Mac/Linux

# Kill the process
taskkill /f /im node.exe        # Windows
lsof -ti:3002 | xargs kill -9   # Mac/Linux
```

**Dependencies Missing:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Environment Variables:**
```bash
# Verify .env file exists
ls -la .env

# Check if variables are loaded
echo $PORT
echo $NODE_ENV
```

### Frontend Issues

**Dependencies Missing:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Port Conflicts:**
```bash
# Check if port 5173 is in use
lsof -ti:5173
# Kill if needed
lsof -ti:5173 | xargs kill -9
```

**Build Errors:**
```bash
# Clear build cache
rm -rf dist .vite
npm run build
```

### Smart Contract Issues

**Compilation Errors:**
```bash
# Clear Hardhat cache
npx hardhat clean

# Recompile contracts
npx hardhat compile

# Check Hardhat configuration
npx hardhat check
```

**Deployment Issues:**
```bash
# Verify Hardhat configuration
cat hardhat.config.js

# Check network configuration
npx hardhat node
```

## 🔍 Debug Mode

Enable detailed logging by setting in your `.env`:
```env
DEBUG=true
NODE_ENV=development
```

**Console Output Should Show:**
- Web3 provider initialization
- Smart contract initialization
- API request/response logging
- Database operations
- Error details

## 📱 API Testing

### Test Backend Health
```bash
curl http://localhost:3002/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "database": "In-Memory Storage (Testing Mode)",
  "environment": "development"
}
```

### Test Events API
```bash
curl http://localhost:3002/api/events
```

**Expected Response:**
```json
[
  {
    "_id": "1",
    "eventName": "MAD(wo)MEN Launch Party",
    "eventType": "tech",
    "location": "New York City, NY",
    "date": "2025-01-15T00:00:00.000Z",
    "price": 99.99,
    "maxSeats": 500,
    "bookedSeats": 127
  }
]
```

### Test Tickets API
```bash
curl http://localhost:3002/api/tickets/user/0x742d35Cc6C842835D59f61e8A000B60C9b8F1234
```

## 🎯 Next Steps After Setup

1. **Explore the Code**: Understand the project structure
2. **Customize Events**: Modify sample events or add new ones
3. **Test All Features**: Purchase tickets, scan QR codes, check-in attendees
4. **Modify Smart Contract**: Customize the EventTicket.sol contract
5. **Add Real Wallet**: Integrate with MetaMask or Coinbase Wallet
6. **Deploy to Testnet**: Deploy contracts to Sepolia testnet
7. **Production Setup**: Configure MongoDB and production environment

## 📞 Getting Help

If you encounter issues:

1. **Check Console Logs**: Look for error messages
2. **Verify Ports**: Ensure no conflicts on 3002 and 5173
3. **Check Dependencies**: Verify all packages are installed
4. **Environment Variables**: Ensure .env is properly configured
5. **GitHub Issues**: Create an issue with detailed information

**Include in Bug Reports:**
- Operating system and version
- Node.js version
- Steps to reproduce
- Console logs and error messages
- Screenshots if applicable

---

## 🎉 Congratulations!

You've successfully set up the MAD(wo)MEN dNFT Ticketing System! 

**The system is now running with:**
- ✅ Backend server on port 3002
- ✅ Frontend application on port 5173
- ✅ Sample events loaded
- ✅ Test mode enabled
- ✅ Mock wallet connected

**Ready to explore! 🚀✨** 