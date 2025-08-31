const mongoose = require('mongoose');

const dynamicNftSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  eventsAttended: {
    type: Map,
    of: Object,
    default: new Map(),
    // The value object for each eventId now includes a one-time token.
    // Example entry:
    // 'eventId123': {
    //   eventName: 'AI Hackathon',
    //   eventType: 'tech',
    //   status: 'toBeAttended', // Or 'Attended'
    //   oneTimeToken: 'a4b3c2d1e0f9...', // Or 'used' after a successful scan
    // },
    // 'eventCounts': { 'tech': 1, 'music': 2 }
  },
});

module.exports = mongoose.model('DynamicNft', dynamicNftSchema);