const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  createdBy: {
    type: String,
    required: [true],
  },
  exercises: [
    {
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: [true],
      },
      reps: {
        type: Number,
        required: [true, 'Please provide the number of reps'],
      },
    },
  ],
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
