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


const getTrainers = async (req, res) => {
  try {
    const acceptedTrainerRequests = await TrainerRequest.find({ Status: 'Accepted' })
      .populate('User', 'avatar username') 
      .select('Type User');

    if (!acceptedTrainerRequests.length) {
      return res.status(404).json({ message: 'No trainers found.' });
    }

    const trainers = acceptedTrainerRequests.map(request => ({
      _id: request.User._id,
      avatar: request.User.avatar,
      username: request.User.username,
      type: request.Type, 
    }));

    res.json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: 'An error occurred while fetching trainers.', error: error.message });
  }
};



module.exports = {
  registerTrainer,
  getTrainerRequestStatus,
  getTrainers,
};
