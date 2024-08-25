const mongoose = require('mongoose');

// Define the schema for the Post model
const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true, // Description is required
    },
    photo: {
      type: String, // URL or path to the photo, not required
      required: false,
    },
    postType: {
      type: String,
      required: true, // Make this required if every post must have a type
      enum: ['image', 'workout', 'text', 'image-gym'], // Example post types, adjust as needed
    },
    postVisibility: {
      type: String,
      required: true,
      enum: ['public', 'private'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the creator'],
    },
    workoutPlan: {
      type: [
        {
          exerciseName: {
            type: String,
            required: true, // Each exercise must have a name
          },
          photo: {
            type: String, // URL or path to the exercise photo, not required
            required: false,
          },
          sets: {
            type: Number,
            required: true, // Number of sets is required
          },
        },
      ],
      required: false, // The workoutPlan array is not required
    },
    workoutData: {
      duration: {
        type: Number, // Duration in minutes or seconds
        required: false, // Optional
      },
      volume: {
        type: Number, // Volume can be a measurement like total weight lifted
        required: false, // Optional
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // Reference to the User model
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Post', postSchema);