const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
    },
    username: {
      type: String,
      required: [true, 'please add a first name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'please add an email'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'please add a password'],
      min: 8,
      max: 64,
    },
    usertype: {
      type: String,
      required: [true, 'please have a user type'],
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    gender: {
      type: String,
    },
    dateofbirth: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
