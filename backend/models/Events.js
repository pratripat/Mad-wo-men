const mongoose = require('mongoose');

// Define the enum values for the eventType
const eventTypes = ['tech', 'music', 'dance', 'art', 'sports', 'workshop'];

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: eventTypes,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  maxSeats: {
    type: Number,
    required: true,
    min: 1,
  },
  bookedSeats: {
    type: Number,
    default: 0,
    min: 0,
  },
});

module.exports = mongoose.model('Event', eventSchema);