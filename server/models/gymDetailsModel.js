const mongoose = require('mongoose');

const workingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  status: {
    type: String,
    required: true,
    enum: ['open', 'closed'],
  },
  openingHour: {
    type: Date,
    required: function () {
      return this.status === 'open';
    },
    default: () => new Date('1970-01-01T10:00:00Z'), // Default to 12:00 PM (midday)
  },
  closingHour: {
    type: Date,
    required: function () {
      return this.status === 'open';
    },
    default: () => new Date('1970-01-01T10:00:00Z'), // Default to 12:00 PM (midday)
  },
});

const gymDetailsSchema = new mongoose.Schema({
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the gym'],
  },
  subscriptionFee: {
    type: Number,
    required: false,
  },
  workingHours: {
    type: [workingHoursSchema],
    default: () => [
      { day: 'Mon', status: 'open', openingHour: new Date('1970-01-01T10:00:00Z'), closingHour: new Date('1970-01-01T10:00:00Z') },
      { day: 'Tue', status: 'open', openingHour: new Date('1970-01-01T10:00:00Z'), closingHour: new Date('1970-01-01T10:00:00Z') },
      { day: 'Wed', status: 'open', openingHour: new Date('1970-01-01T10:00:00Z'), closingHour: new Date('1970-01-01T10:00:00Z') },
      { day: 'Thu', status: 'open', openingHour: new Date('1970-01-01T10:00:00Z'), closingHour: new Date('1970-01-01T10:00:00Z') },
      { day: 'Fri', status: 'open', openingHour: new Date('1970-01-01T10:00:00Z'), closingHour: new Date('1970-01-01T10:00:00Z') },
      { day: 'Sat', status: 'closed', openingHour: new Date('1970-01-01T10:00:00Z'), closingHour: new Date('1970-01-01T10:00:00Z') },
      { day: 'Sun', status: 'closed', openingHour: new Date('1970-01-01T10:00:00Z'), closingHour: new Date('1970-01-01T10:00:00Z') },
    ],
  },
  gymLocation: {
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    required: false,
  },
});

module.exports = mongoose.model('gymDetails', gymDetailsSchema);