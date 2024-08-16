const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  TrainerId: {
    type: String,
    required: true,
  },
  TraineeId: {
    type: String,
    required: true,
  },
  TrainingDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Trainer', trainerSchema);
