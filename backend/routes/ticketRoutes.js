const express = require('express');
const router = express.Router();
const ticketService = require('../services/ticketService');

/**
 * @route POST /api/tickets/purchase
 * @desc Purchase a ticket for an event
 * @access Public (for now, can add auth later)
 */
router.post('/purchase', async (req, res) => {
  try {
    const { eventId, userWalletAddress } = req.body;
    
    if (!eventId || !userWalletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Event ID and wallet address are required' 
      });
    }

    const result = await ticketService.purchaseTicket(eventId, userWalletAddress);
    
    res.status(200).json({
      success: true,
      message: 'Ticket purchased successfully!',
      data: result
    });
    
  } catch (error) {
    console.error('Ticket purchase error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to purchase ticket'
    });
  }
});

/**
 * @route GET /api/tickets/user/:walletAddress
 * @desc Get all tickets for a specific wallet address
 * @access Public (for now, can add auth later)
 */
router.get('/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wallet address is required' 
      });
    }

    const tickets = await ticketService.getUserTickets(walletAddress);
    
    res.status(200).json({
      success: true,
      data: tickets
    });
    
  } catch (error) {
    console.error('Get user tickets error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch user tickets'
    });
  }
});

/**
 * @route POST /api/tickets/check-in
 * @desc Check in a ticket at an event
 * @access Public (for now, can add auth later)
 */
router.post('/check-in', async (req, res) => {
  try {
    const { userWalletAddress, eventId } = req.body;
    
    if (!userWalletAddress || !eventId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wallet address and event ID are required' 
      });
    }

    const result = await ticketService.checkTicket(userWalletAddress, eventId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Ticket check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'An internal error occurred during check-in'
    });
  }
});

module.exports = router;
