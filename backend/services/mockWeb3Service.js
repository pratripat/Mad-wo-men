class MockWeb3Service {
  constructor() {
    this.mockTokenId = 0;
    this.mockTickets = new Map();
    this.isReady = true;
    this.isContractReady = true;
  }

  /**
   * Mock mint ticket function
   */
  async mintTicket(recipientAddress, preEventMetadataURI) {
    try {
      console.log(`🎫 Mock minting ticket for address: ${recipientAddress}`);
      
      this.mockTokenId++;
      const tokenId = this.mockTokenId;
      
      // Store mock ticket data
      this.mockTickets.set(tokenId, {
        tokenId,
        recipient: recipientAddress,
        metadataURI: preEventMetadataURI,
        isUsed: false,
        mintedAt: new Date()
      });

      console.log(`✅ Mock ticket minted with ID: ${tokenId}`);

      return {
        success: true,
        tokenId: tokenId.toString(),
        transactionHash: `0xmock_${Date.now()}_${tokenId}`,
        blockNumber: 12345678,
        gasUsed: '50000',
        recipient: recipientAddress,
        metadataURI: preEventMetadataURI
      };
    } catch (error) {
      console.error('❌ Mock mint error:', error);
      throw error;
    }
  }

  /**
   * Mock update metadata function
   */
  async updateMetadataURI(tokenId, postEventMetadataURI) {
    try {
      console.log(`🔄 Mock updating metadata for token ID: ${tokenId}`);
      
      const ticket = this.mockTickets.get(parseInt(tokenId));
      if (!ticket) {
        throw new Error('Mock ticket not found');
      }

      ticket.metadataURI = postEventMetadataURI;
      ticket.isUsed = true;
      ticket.updatedAt = new Date();

      console.log(`✅ Mock metadata updated for token ID: ${tokenId}`);

      return {
        success: true,
        tokenId: tokenId,
        transactionHash: `0xmock_update_${Date.now()}_${tokenId}`,
        blockNumber: 12345679,
        gasUsed: '30000',
        newMetadataURI: postEventMetadataURI
      };
    } catch (error) {
      console.error('❌ Mock update error:', error);
      throw error;
    }
  }

  /**
   * Mock get ticket info function
   */
  async getTicketInfo(tokenId) {
    try {
      const ticket = this.mockTickets.get(parseInt(tokenId));
      if (!ticket) {
        throw new Error('Mock ticket not found');
      }

      return {
        tokenId: ticket.tokenId,
        tokenURI: ticket.metadataURI,
        isUsed: ticket.isUsed,
        owner: ticket.recipient
      };
    } catch (error) {
      console.error('❌ Mock get ticket info error:', error);
      throw error;
    }
  }

  /**
   * Mock get total supply function
   */
  async getTotalSupply() {
    return this.mockTokenId.toString();
  }

  /**
   * Mock burn ticket function
   */
  async burnTicket(tokenId) {
    try {
      console.log(`🔥 Mock burning ticket with token ID: ${tokenId}`);
      
      const ticket = this.mockTickets.get(parseInt(tokenId));
      if (!ticket) {
        throw new Error('Mock ticket not found');
      }

      this.mockTickets.delete(parseInt(tokenId));

      return {
        success: true,
        tokenId: tokenId,
        transactionHash: `0xmock_burn_${Date.now()}_${tokenId}`,
        blockNumber: 12345680,
        gasUsed: '25000'
      };
    } catch (error) {
      console.error('❌ Mock burn error:', error);
      throw error;
    }
  }

  /**
   * Check if service is ready
   */
  isReady() {
    return this.isReady;
  }

  /**
   * Check if contract is ready
   */
  isContractReady() {
    return this.isContractReady;
  }

  /**
   * Get mock tickets for debugging
   */
  getMockTickets() {
    return Array.from(this.mockTickets.values());
  }
}

module.exports = MockWeb3Service;
