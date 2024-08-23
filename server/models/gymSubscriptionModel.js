const mongoose = require('mongoose');

const gymSubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    // default: Date.now,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'expired'],
    default: 'pending',
  }
});

module.exports = mongoose.model('gymSubscription', gymSubscriptionSchema);
