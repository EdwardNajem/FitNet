const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  TrainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  TraineeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  TrainingDate: {
    type: Date,
    required: true,
  },
  Review: {
    type: Number,
    min: 1, 
    max: 5,
  },
});

module.exports = mongoose.model('Trainer', trainerSchema);
