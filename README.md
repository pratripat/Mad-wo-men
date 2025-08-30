# MAD(wo)MEN dNFT Ticketing System

A revolutionary Dynamic NFT (dNFT) ticketing system built for the MAD(wo)MEN hackathon project. This system solves current ticketing issues by leveraging blockchain technology to create secure, anti-fraud, and value-retaining event tickets.

## 🎯 Problem Solved

### Current Ticketing Issues Addressed:

1. **Fraud & Duplication**: Traditional tickets can be easily counterfeited or duplicated
2. **Lack of Lasting Value**: Tickets become worthless after the event
3. **Centralized Control**: Users don't truly own their tickets
4. **Secondary Market Issues**: No control over scalping and resale pricing
5. **Limited Post-Event Engagement**: No lasting connection between attendees and event organizers

### Our Solution:

- **Blockchain Immutability**: Each ticket is a unique, non-fungible token that cannot be duplicated
- **Dynamic NFTs**: Tickets evolve post-event into valuable collectibles with updated metadata
- **Decentralized Ownership**: Users truly own their tickets in their wallets
- **Secondary Market Control**: Smart contract can enforce resale rules and royalty fees
- **Lasting Value**: Post-event transformation creates ongoing value and engagement

## 🏗️ Architecture

### Tech Stack:
- **Smart Contract**: Solidity with OpenZeppelin ERC721
- **Blockchain**: Ethereum Sepolia Testnet
- **Backend**: Node.js with Express.js
- **Database**: MongoDB for off-chain data storage
- **Web3**: Ethers.js for blockchain interaction
- **Development**: Hardhat for smart contract development

### Project Structure:
```
MadWoMen/
├── contracts/
│   └── EventTicket.sol          # Main smart contract
├── scripts/
│   └── deploy.js                # Deployment script
├── backend/
│   ├── models/
│   │   └── Ticket.js            # MongoDB ticket model
│   ├── controllers/
│   │   └── ticketController.js  # API controllers
│   ├── routes/
│   │   └── ticketRoutes.js      # API routes
│   ├── services/
│   │   └── web3Service.js       # Web3 interaction service
│   └── server.js                # Express server
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Dependencies
└── env.example                  # Environment variables template
```

## 🚀 Features

### Smart Contract Features:
- **ERC721 Standard**: Compliant with NFT standards
- **Dynamic Metadata**: Tickets can be updated post-event
- **Access Control**: Only organizer can mint and update tickets
- **Event Tracking**: Built-in events for transparency
- **Extensible**: Ready for secondary market features

### API Endpoints:
- `POST /api/tickets/mint` - Mint new tickets
- `POST /api/tickets/checkIn` - Check in attendees
- `GET /api/tickets/:tokenId` - Get ticket information
- `GET /api/tickets/owner/:address` - Get tickets by owner
- `GET /api/tickets/stats` - System statistics

### Database Features:
- **Hybrid Storage**: Critical data on blockchain, details in MongoDB
- **Scalability**: Can handle thousands of events and tickets
- **Performance**: Optimized queries with indexing
- **Flexibility**: Easy to extend with additional fields

## 🛠️ Setup Instructions

### Prerequisites:
- Node.js (v18+)
- npm or yarn
- MongoDB (local or cloud)
- Alchemy account for Ethereum RPC
- Ethereum wallet with Sepolia testnet ETH

### Installation:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd MadWoMen
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Configure your .env file:**
   ```env
   # Ethereum Configuration
   ALCHEMY_API_KEY=your_alchemy_api_key
   PRIVATE_KEY=your_deployer_private_key
   ORGANIZER_PRIVATE_KEY=your_organizer_private_key
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/madwomen-ticketing
   
   # Smart Contract
   CONTRACT_ADDRESS=your_deployed_contract_address
   ```

### Deployment:

1. **Deploy smart contract:**
   ```bash
   npm run deploy:sepolia
   ```

2. **Update .env with deployed contract address:**
   ```env
   CONTRACT_ADDRESS=0x... # Address from deployment
   ```

3. **Start the backend server:**
   ```bash
   npm run start
   ```

## 📖 Usage Examples

### Minting a Ticket:
```javascript
// Frontend request to mint a ticket
const response = await fetch('/api/tickets/mint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientAddress: '0x1234567890abcdef...',
    eventName: 'MAD(wo)MEN Hackathon 2024',
    eventDate: '2024-12-15T10:00:00Z',
    eventLocation: 'Virtual Event',
    preEventMetadataURI: 'ipfs://Qm...',
    originalPrice: 50.00
  })
});
```

### Checking In:
```javascript
// Check in an attendee
const response = await fetch('/api/tickets/checkIn', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tokenId: '1',
    postEventMetadataURI: 'ipfs://Qm...'
  })
});
```

## 🔒 Security Features

### Smart Contract Security:
- **Access Control**: Only organizer can perform critical functions
- **Input Validation**: Comprehensive parameter validation
- **Reentrancy Protection**: OpenZeppelin's secure patterns
- **Event Logging**: Transparent transaction tracking

### API Security:
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Secure cross-origin requests
- **Helmet**: Security headers
- **Environment Variables**: Secure configuration management

## 🔮 Future Enhancements

### Planned Features:
1. **Secondary Market Integration**: Automated resale with royalty fees
2. **Multi-Event Support**: One contract for multiple events
3. **Royalty Distribution**: Automated organizer revenue sharing
4. **Metadata Standards**: IPFS integration with standardized metadata
5. **Mobile App**: React Native mobile application
6. **Analytics Dashboard**: Event statistics and insights
7. **Integration APIs**: Connect with existing ticketing platforms

### Secondary Market Features:
- **Maximum Resale Price**: Prevent ticket scalping
- **Royalty Fees**: Automatic organizer revenue
- **Transfer Restrictions**: Time-based transfer limitations
- **Marketplace Integration**: Direct resale through the platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenZeppelin**: For secure smart contract libraries
- **Hardhat**: For development framework
- **Ethers.js**: For Web3 interaction
- **MongoDB**: For database solution
- **Express.js**: For API framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Join our Discord community

---

**Built with ❤️ for the MAD(wo)MEN hackathon project**
