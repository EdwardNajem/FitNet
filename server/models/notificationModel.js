const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    notificationType: {
      type: String,
      enum: ['like', 'comment'],
      required: true,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true, 
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
