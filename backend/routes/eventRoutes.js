const express = require('express');
const router = express.Router();
// const Event = require('../models/Events');
const ticketService = require('../services/ticketService');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = ticketService.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events', error: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const events = ticketService.getAllEvents();
    const event = events.find(e => e._id === req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch event', error: error.message });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    // For now, we'll just return an error since we're using in-memory storage
    res.status(400).json({ success: false, message: 'Event creation not supported in test mode' });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ success: false, message: 'Failed to create event', error: error.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    // For now, we'll just return an error since we're using in-memory storage
    res.status(400).json({ success: false, message: 'Event updates not supported in test mode' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({ success: false, message: 'Failed to update event', error: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    // For now, we'll just return an error since we're using in-memory storage
    res.status(400).json({ success: false, message: 'Event deletion not supported in test mode' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, message: 'Failed to delete event', error: error.message });
  }
});

module.exports = router; 