const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  // Blockchain information
  tokenId: {
    type: Number,
    required: true,
    unique: true
  },
  contractAddress: {
    type: String,
    required: true
  },
  ownerAddress: {
    type: String,
    required: true
  },
  
  // Event information
  eventName: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventLocation: {
    type: String,
    required: true
  },
  
  // Ticket metadata
  preEventMetadataURI: {
    type: String,
    required: true
  },
  postEventMetadataURI: {
    type: String,
    default: null
  },
  
  // Ticket status
  status: {
    type: String,
    enum: ['minted', 'checked_in', 'burned'],
    default: 'minted'
  },
  
  // Check-in information
  checkedInAt: {
    type: Date,
    default: null
  },
  checkedInBy: {
    type: String,
    default: null
  },
  
  // Pricing information (for future secondary market features)
  originalPrice: {
    type: Number,
    required: true
  },
  maxResalePrice: {
    type: Number,
    default: null
  },
  
  // Metadata
  mintedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Additional fields for extensibility
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ticketSchema.index({ tokenId: 1, contractAddress: 1 });
ticketSchema.index({ ownerAddress: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ eventDate: 1 });

// Pre-save middleware to update the updatedAt field
ticketSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance method to check if ticket is valid for check-in
ticketSchema.methods.canCheckIn = function() {
  return this.status === 'minted' && !this.isTicketUsed;
};

// Static method to find tickets by owner
ticketSchema.statics.findByOwner = function(ownerAddress) {
  return this.find({ ownerAddress: ownerAddress.toLowerCase() });
};

// Static method to find tickets by event
ticketSchema.statics.findByEvent = function(eventName) {
  return this.find({ eventName: { $regex: eventName, $options: 'i' } });
};

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
