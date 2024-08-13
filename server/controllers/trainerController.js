const TrainerRequest = require('../models/trainerRequestModel'); 

const registerTrainer = async (req, res) => {
  try {
    const { Certificate, Type } = req.body;

    // Validate required fields
    if (!Certificate || !Type) {
      return res.status(400).json({ message: 'Certificate and Type are required fields' });
    }

    // Create a new trainer request with status 'Pending'
    const newTrainerRequest = new TrainerRequest({
      Certificate,
      Type,
      Status: 'Pending',
    });

    // Save the new trainer request to the database
    await newTrainerRequest.save();

    // Return a success response
    return res.status(201).json({
      message: 'Trainer registration submitted successfully and is pending approval',
      trainerRequest: newTrainerRequest,
    });
  } catch (error) {
    console.error('Error registering trainer:', error);
    return res.status(500).json({ message: 'An error occurred during trainer registration' });
  }
};

module.exports = {
  registerTrainer,
};
