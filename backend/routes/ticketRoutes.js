const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

/**
 * @route POST /api/tickets/mint
 * @description Mint a new ticket (NFT) for an attendee
 * @access Private (Organizer only)
 */
router.post('/mint', ticketController.mintTicket);

/**
 * @route POST /api/tickets/checkIn
 * @description Check in a ticket (update metadata URI to post-event state)
 * @access Private (Organizer only)
 */
router.post('/checkIn', ticketController.checkIn);

/**
 * @route GET /api/tickets/stats
 * @description Get system statistics
 * @access Public
 */
router.get('/stats', ticketController.getStats);

/**
 * @route GET /api/tickets/owner/:address
 * @description Get all tickets for a specific owner address
 * @access Public
 */
router.get('/owner/:address', ticketController.getTicketsByOwner);

/**
 * @route GET /api/tickets/:tokenId
 * @description Get ticket information by token ID
 * @access Public
 */
router.get('/:tokenId', ticketController.getTicket);

module.exports = router;
