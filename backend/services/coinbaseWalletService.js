const { CoinbaseWalletSDK } = require('@coinbase/wallet-sdk');

class CoinbaseWalletService {
  constructor() {
    this.walletSDK = null;
    this.provider = null;
    this.signer = null;
    this.initialized = false;
  }

  /**
   * Initialize Coinbase Wallet SDK
   */
  initialize() {
    try {
      // Initialize Coinbase Wallet SDK
      this.walletSDK = new CoinbaseWalletSDK({
        appName: 'MAD(wo)MEN dNFT Ticketing',
        appLogoUrl: 'https://your-app-logo-url.com/logo.png', // Optional
        darkMode: false, // Set to true for dark mode
        overrideIsMetaMask: true, // Makes it work like MetaMask
        enableMobileWalletLink: true, // Enable mobile wallet link
        enableExtension: true, // Enable browser extension
        dappUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
        chainId: 11155111, // Sepolia testnet
        jsonRpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      });

      console.log('✅ Coinbase Wallet SDK initialized');
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Coinbase Wallet SDK:', error);
      return false;
    }
  }

  /**
   * Connect to Coinbase Wallet
   * @returns {Promise<Object>} Connection result
   */
  async connectWallet() {
    try {
      if (!this.initialized) {
        this.initialize();
      }

      console.log('🔗 Connecting to Coinbase Wallet...');
      
      // Request account access
      const accounts = await this.walletSDK.request({
        method: 'eth_requestAccounts'
      });

      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        console.log('✅ Connected to Coinbase Wallet:', address);
        
        // Get provider and signer
        this.provider = this.walletSDK.makeWeb3Provider(
          `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
          11155111 // Sepolia chain ID
        );
        
        this.signer = this.provider.getSigner();
        
        return {
          success: true,
          address: address,
          provider: this.provider,
          signer: this.signer
        };
      } else {
        throw new Error('No accounts found');
      }
    } catch (error) {
      console.error('❌ Failed to connect to Coinbase Wallet:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Disconnect from Coinbase Wallet
   */
  disconnectWallet() {
    try {
      if (this.walletSDK) {
        this.walletSDK.disconnect();
        this.provider = null;
        this.signer = null;
        console.log('✅ Disconnected from Coinbase Wallet');
      }
    } catch (error) {
      console.error('❌ Error disconnecting from Coinbase Wallet:', error);
    }
  }

  /**
   * Get wallet address
   * @returns {Promise<string|null>} Wallet address
   */
  async getAddress() {
    try {
      if (this.signer) {
        return await this.signer.getAddress();
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting wallet address:', error);
      return null;
    }
  }

  /**
   * Get wallet balance
   * @returns {Promise<string|null>} Wallet balance in ETH
   */
  async getBalance() {
    try {
      if (this.provider && this.signer) {
        const address = await this.signer.getAddress();
        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting wallet balance:', error);
      return null;
    }
  }

  /**
   * Sign a message
   * @param {string} message - Message to sign
   * @returns {Promise<string|null>} Signature
   */
  async signMessage(message) {
    try {
      if (this.signer) {
        const signature = await this.signer.signMessage(message);
        return signature;
      }
      return null;
    } catch (error) {
      console.error('❌ Error signing message:', error);
      return null;
    }
  }

  /**
   * Send transaction
   * @param {Object} transaction - Transaction object
   * @returns {Promise<Object|null>} Transaction result
   */
  async sendTransaction(transaction) {
    try {
      if (this.signer) {
        const tx = await this.signer.sendTransaction(transaction);
        return await tx.wait();
      }
      return null;
    } catch (error) {
      console.error('❌ Error sending transaction:', error);
      return null;
    }
  }

  /**
   * Check if wallet is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return !!(this.signer && this.provider);
  }

  /**
   * Get connection status
   * @returns {Object} Connection status object
   */
  getConnectionStatus() {
    return {
      initialized: this.initialized,
      connected: this.isConnected(),
      provider: !!this.provider,
      signer: !!this.signer
    };
  }

  /**
   * Switch to Sepolia network
   * @returns {Promise<boolean>} Success status
   */
  async switchToSepolia() {
    try {
      if (this.walletSDK) {
        await this.walletSDK.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID in hex
        });
        console.log('✅ Switched to Sepolia network');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error switching to Sepolia:', error);
      return false;
    }
  }
}

// Create singleton instance
const coinbaseWalletService = new CoinbaseWalletService();

module.exports = coinbaseWalletService;
