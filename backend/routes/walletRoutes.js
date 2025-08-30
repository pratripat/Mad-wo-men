const express = require('express');
const router = express.Router();
const coinbaseWalletService = require('../services/coinbaseWalletService');

/**
 * @route POST /api/wallet/connect
 * @description Connect to Coinbase Wallet
 * @access Public
 */
const connectWallet = async (req, res) => {
  try {
    console.log('🔗 Wallet connection request received');

    const result = await coinbaseWalletService.connectWallet();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Wallet connected successfully',
        data: {
          address: result.address,
          network: 'Sepolia Testnet'
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to connect wallet',
        message: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error connecting wallet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect wallet',
      message: error.message
    });
  }
};

/**
 * @route POST /api/wallet/disconnect
 * @description Disconnect from Coinbase Wallet
 * @access Public
 */
const disconnectWallet = async (req, res) => {
  try {
    console.log('🔌 Wallet disconnection request received');

    coinbaseWalletService.disconnectWallet();
    
    res.status(200).json({
      success: true,
      message: 'Wallet disconnected successfully'
    });
  } catch (error) {
    console.error('❌ Error disconnecting wallet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to disconnect wallet',
      message: error.message
    });
  }
};

/**
 * @route GET /api/wallet/status
 * @description Get wallet connection status
 * @access Public
 */
const getWalletStatus = async (req, res) => {
  try {
    const status = coinbaseWalletService.getConnectionStatus();
    
    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('❌ Error getting wallet status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get wallet status',
      message: error.message
    });
  }
};

/**
 * @route GET /api/wallet/address
 * @description Get connected wallet address
 * @access Public
 */
const getWalletAddress = async (req, res) => {
  try {
    const address = await coinbaseWalletService.getAddress();
    
    if (address) {
      res.status(200).json({
        success: true,
        data: { address }
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'No wallet connected'
      });
    }
  } catch (error) {
    console.error('❌ Error getting wallet address:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get wallet address',
      message: error.message
    });
  }
};

/**
 * @route GET /api/wallet/balance
 * @description Get wallet balance
 * @access Public
 */
const getWalletBalance = async (req, res) => {
  try {
    const balance = await coinbaseWalletService.getBalance();
    
    if (balance !== null) {
      res.status(200).json({
        success: true,
        data: { 
          balance: balance,
          currency: 'ETH',
          network: 'Sepolia Testnet'
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'No wallet connected'
      });
    }
  } catch (error) {
    console.error('❌ Error getting wallet balance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get wallet balance',
      message: error.message
    });
  }
};

/**
 * @route POST /api/wallet/switch-network
 * @description Switch to Sepolia testnet
 * @access Public
 */
const switchToSepolia = async (req, res) => {
  try {
    console.log('🔄 Network switch request received');

    const success = await coinbaseWalletService.switchToSepolia();
    
    if (success) {
      res.status(200).json({
        success: true,
        message: 'Switched to Sepolia testnet successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to switch network'
      });
    }
  } catch (error) {
    console.error('❌ Error switching network:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to switch network',
      message: error.message
    });
  }
};

// Define routes
router.post('/connect', connectWallet);
router.post('/disconnect', disconnectWallet);
router.get('/status', getWalletStatus);
router.get('/address', getWalletAddress);
router.get('/balance', getWalletBalance);
router.post('/switch-network', switchToSepolia);

module.exports = router;
