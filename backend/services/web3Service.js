const { ethers } = require('ethers');

class Web3Service {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.wallet = null;
    this.contractAddress = process.env.CONTRACT_ADDRESS;
    this.organizerPrivateKey = process.env.ORGANIZER_PRIVATE_KEY;
    
    this.initializeProvider();
    // Only initialize contract if we have a valid contract address
    if (this.contractAddress && this.contractAddress !== 'your_deployed_contract_address_here') {
      this.initializeContract();
    } else {
      console.log('⚠️  Contract not deployed yet. Deploy contract first to enable full functionality.');
    }
  }

  /**
   * Initialize the Ethereum provider
   */
  initializeProvider() {
    try {
      // Use Alchemy provider for Sepolia testnet
      this.provider = new ethers.JsonRpcProvider(
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      );
      console.log('✅ Web3 provider initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Web3 provider:', error);
      throw error;
    }
  }

  /**
   * Initialize the smart contract instance
   */
  initializeContract() {
    try {
      if (!this.organizerPrivateKey) {
        throw new Error('ORGANIZER_PRIVATE_KEY environment variable is required');
      }

      // Create wallet instance with organizer's private key
      this.wallet = new ethers.Wallet(this.organizerPrivateKey, this.provider);
      
      // Contract ABI (simplified for the main functions we need)
      const contractABI = [
        "function mint(address recipient, string memory preEventMetadataURI) public returns (uint256)",
        "function updateMetadataURI(uint256 tokenId, string memory postEventMetadataURI) public",
        "function burn(uint256 tokenId) public",
        "function tokenURI(uint256 tokenId) public view returns (string memory)",
        "function isTicketUsed(uint256 tokenId) public view returns (bool)",
        "function totalSupply() public view returns (uint256)",
        "function ownerOf(uint256 tokenId) public view returns (address)",
        "event TicketMinted(uint256 indexed tokenId, address indexed recipient, string metadataURI)",
        "event MetadataUpdated(uint256 indexed tokenId, string newMetadataURI)",
        "event TicketBurned(uint256 indexed tokenId)"
      ];

      // Create contract instance
      this.contract = new ethers.Contract(
        this.contractAddress,
        contractABI,
        this.wallet
      );

      console.log('✅ Smart contract initialized');
      console.log('📋 Contract Address:', this.contractAddress);
      console.log('👤 Organizer Address:', this.wallet.address);
    } catch (error) {
      console.error('❌ Failed to initialize smart contract:', error);
      throw error;
    }
  }

  /**
   * Mint a new ticket (NFT)
   * @param {string} recipientAddress - The address of the ticket holder
   * @param {string} preEventMetadataURI - Metadata URI for the pre-event state
   * @returns {Promise<Object>} - Transaction details and token ID
   */
  async mintTicket(recipientAddress, preEventMetadataURI) {
    try {
      console.log(`🎫 Minting ticket for address: ${recipientAddress}`);
      console.log(`📄 Pre-event metadata URI: ${preEventMetadataURI}`);

      // Validate addresses
      if (!ethers.isAddress(recipientAddress)) {
        throw new Error('Invalid recipient address');
      }

      // Call the mint function on the smart contract
      const tx = await this.contract.mint(recipientAddress, preEventMetadataURI);
      console.log(`📝 Transaction hash: ${tx.hash}`);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

      // Parse the TicketMinted event to get the token ID
      const ticketMintedEvent = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed.name === 'TicketMinted';
        } catch {
          return false;
        }
      });

      let tokenId = null;
      if (ticketMintedEvent) {
        const parsed = this.contract.interface.parseLog(ticketMintedEvent);
        tokenId = parsed.args[0]; // tokenId is the first argument
      }

      return {
        success: true,
        tokenId: tokenId ? tokenId.toString() : null,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        recipient: recipientAddress,
        metadataURI: preEventMetadataURI
      };
    } catch (error) {
      console.error('❌ Error minting ticket:', error);
      throw error;
    }
  }

  /**
   * Update ticket metadata URI (check-in functionality)
   * @param {string} tokenId - The token ID of the ticket
   * @param {string} postEventMetadataURI - Metadata URI for the post-event state
   * @returns {Promise<Object>} - Transaction details
   */
  async updateMetadataURI(tokenId, postEventMetadataURI) {
    try {
      console.log(`🔄 Updating metadata for token ID: ${tokenId}`);
      console.log(`📄 Post-event metadata URI: ${postEventMetadataURI}`);

      // Validate token ID
      if (!tokenId || isNaN(tokenId)) {
        throw new Error('Invalid token ID');
      }

      // Call the updateMetadataURI function on the smart contract
      const tx = await this.contract.updateMetadataURI(tokenId, postEventMetadataURI);
      console.log(`📝 Transaction hash: ${tx.hash}`);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

      return {
        success: true,
        tokenId: tokenId,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        newMetadataURI: postEventMetadataURI
      };
    } catch (error) {
      console.error('❌ Error updating metadata:', error);
      throw error;
    }
  }

  /**
   * Burn a ticket
   * @param {string} tokenId - The token ID of the ticket to burn
   * @returns {Promise<Object>} - Transaction details
   */
  async burnTicket(tokenId) {
    try {
      console.log(`🔥 Burning ticket with token ID: ${tokenId}`);

      // Validate token ID
      if (!tokenId || isNaN(tokenId)) {
        throw new Error('Invalid token ID');
      }

      // Call the burn function on the smart contract
      const tx = await this.contract.burn(tokenId);
      console.log(`📝 Transaction hash: ${tx.hash}`);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

      return {
        success: true,
        tokenId: tokenId,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('❌ Error burning ticket:', error);
      throw error;
    }
  }

  /**
   * Get ticket information from the blockchain
   * @param {string} tokenId - The token ID of the ticket
   * @returns {Promise<Object>} - Ticket information
   */
  async getTicketInfo(tokenId) {
    try {
      console.log(`🔍 Getting info for token ID: ${tokenId}`);

      const [tokenURI, isUsed, owner] = await Promise.all([
        this.contract.tokenURI(tokenId),
        this.contract.isTicketUsed(tokenId),
        this.contract.ownerOf(tokenId)
      ]);

      return {
        tokenId: tokenId,
        tokenURI: tokenURI,
        isUsed: isUsed,
        owner: owner
      };
    } catch (error) {
      console.error('❌ Error getting ticket info:', error);
      throw error;
    }
  }

  /**
   * Get total supply of tickets
   * @returns {Promise<number>} - Total number of tickets minted
   */
  async getTotalSupply() {
    try {
      const totalSupply = await this.contract.totalSupply();
      return totalSupply.toString();
    } catch (error) {
      console.error('❌ Error getting total supply:', error);
      throw error;
    }
  }

  /**
   * Validate if the service is properly configured
   * @returns {boolean} - True if service is ready
   */
  isReady() {
    return !!(this.provider && this.wallet);
  }

  /**
   * Check if contract is deployed and ready
   * @returns {boolean} - True if contract is ready
   */
  isContractReady() {
    return !!(this.provider && this.contract && this.wallet);
  }
}

// Create singleton instance
const web3Service = new Web3Service();

module.exports = web3Service;
