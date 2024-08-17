const TrainerRequest = require('../models/trainerRequestModel');
const User = require('../models/userModel');

const registerTrainer = async (req, res) => {
  try {
    const { certificate, type, userId } = req.body;

    if (!certificate || !type || !userId) {
      return res.status(400).json({ message: 'Certificate, Type, and UserId are required.' });
    }

    const existingRequest = await TrainerRequest.findOne({
      User: userId,
      Status: { $in: ['Pending', 'Accepted'] },
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending or accepted request.' });
    }

    const newTrainerRequest = new TrainerRequest({
      Certificate: certificate,
      Type: type,
      User: userId,
    });

    await newTrainerRequest.save();

    res.status(201).json({ message: 'Trainer request submitted successfully.', request: newTrainerRequest });
  } catch (error) {
    console.error('Error registering trainer:', error);
    res.status(500).json({ message: 'An error occurred while registering the trainer.', error: error.message });
  }
};

const getTrainerRequestStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const trainerRequest = await TrainerRequest.findOne({ User: userId })
      .sort({ _id: -1 }); 
      console.log(trainerRequest);
      

    if (trainerRequest) {
      res.json({ status: trainerRequest.Status });
    } else {
      res.json({ status: 'NoRequest' });
    }
  } catch (error) {
    console.error('Error fetching trainer request status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  registerTrainer,
  getTrainerRequestStatus,
};
