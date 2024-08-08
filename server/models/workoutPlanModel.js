const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  createdBy: {
    type: String,
    required: [true, 'Please provide the creator'],
  },
  startTime: {
    type: Date,
  },
  exercises: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: [true, 'Please provide an exercise ID'],
      },
      image: {
        type: String,
        required: [true, 'Please provide an exercise image URL'],
      },
      name: {
        type: String,
        required: [true, 'Please provide the exercise name'],
      },
      primary: {
        type: String,
        required: [true, 'Please provide the primary muscle group'],
      },
      sets: {
        type: [
          {
            id: {
              type: Number,
              required: [true, 'Please provide the set ID'],
            },
            kg: {
              type: Number,
              default: 0,
            },
            meters: {
              type: Number,
              default: 0,
            },
            reps: {
              type: Number,
              required: [true, 'Please provide the number of reps'],
            },
            time: {
              type: String,
              default: "00:00",
            },
          },
        ],
        validate: {
          validator: function(array) {
            return array.length > 0;
          },
          message: 'Please provide at least one set for all the exercises',
        },
      },
      type: {
        type: String,
        required: [true, 'Please provide the exercise type'],
      },
    },
  ],
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);