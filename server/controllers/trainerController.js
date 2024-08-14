const TrainerRequest = require('../models/trainerRequestModel');
const User = require('../models/userModel');

const registerTrainer = async (req, res) => {
  try {
    const { certificate, type, userId } = req.body; // Assuming userId is passed in the request body

    // Validation
    if (!certificate || !type || !userId) {
      return res.status(400).json({ message: 'Certificate, Type, and UserId are required.' });
    }

    // Check if the user already has a pending or approved request
    const existingRequest = await TrainerRequest.findOne({ User: userId, Status: { $in: ['Pending', 'Approved'] } });
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending or approved request.' });
    }

    // Create a new trainer request
    const newTrainerRequest = new TrainerRequest({
      Certificate: certificate,
      Type: type,
      User: userId,
    });

    await newTrainerRequest.save();

    // Update user's type to 'trainer'
    await User.findByIdAndUpdate(userId, { usertype: 'trainer' });

    res.status(201).json({ message: 'Trainer request submitted successfully.', request: newTrainerRequest });
  } catch (error) {
    console.error('Error registering trainer:', error); // Detailed logging

    // Custom error response
    res.status(500).json({ message: 'An error occurred while registering the trainer.', error: error.message });
  }
};

module.exports = {
  registerTrainer,
};
