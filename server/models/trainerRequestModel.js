const mongoose = require('mongoose');

const trainerRequestSchema = new mongoose.Schema({
  Certificate: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
    required: true,
    default: 'Pending',
  },
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('TrainerRequest', trainerRequestSchema);
