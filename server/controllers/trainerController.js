const TrainerRequestModel = require('../models/trainerRequestModel');
const UserModel = require('../models/userModel');
const TrainerModel = require('../models/trainerModel');

const registerTrainer = async (req, res) => {
  try {
    const { certificate, type, userId } = req.body;

    if (!certificate || !type || !userId) {
      return res.status(400).json({ message: 'Certificate, Type, and UserId are required.' });
    }

    const existingRequest = await TrainerRequestModel.findOne({
      User: userId,
      Status: { $in: ['Pending', 'Accepted'] },
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending or accepted request.' });
    }

    const newTrainerRequest = new TrainerRequestModel({
      Certificate: certificate,
      Type: type,
      User: userId,
    });

    await newTrainerRequest.save();

    res.status(200).json({ message: 'Trainer request submitted successfully.', request: newTrainerRequest });
  } catch (error) {
    console.error('Error registering trainer:', error);
    res.status(500).json({ message: 'An error occurred while registering the trainer.', error: error.message });
  }
};

const getTrainerRequestStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const trainerRequest = await TrainerRequestModel.findOne({ User: userId })
      .sort({ _id: -1 }); 
      
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
    const acceptedTrainerRequests = await TrainerRequestModel.find({ Status: 'Accepted' })
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

const bookTrainer = async (req, res) => {
  try {
    const { trainerId, traineeId, trainingDate } = req.body;

    if (!trainerId || !traineeId || !trainingDate) {
      return res.status(400).json({ message: 'TrainerId, TraineeId, and TrainingDate are required.' });
    }

    const trainer = await UserModel.findById(trainerId);
    if (!trainer || trainer.usertype !== 'trainer') {
      return res.status(404).json({ message: 'Trainer not found.' });
    }

    const trainee = await UserModel.findById(traineeId);
    if (!trainee) {
      return res.status(404).json({ message: 'Trainee not found.' });
    }

 

    const newBooking = new TrainerModel({
      TrainerId: trainerId,
      TraineeId: traineeId,
      TrainingDate: trainingDate,
    });

    await newBooking.save();

    res.status(200).json({ message: 'Booking successful.', booking: newBooking });
  } catch (error) {
    console.error('Error booking trainer:', error);
    res.status(500).json({ message: 'An error occurred while booking the trainer.', error: error.message });
  }
};


const checkBooking = async (req, res) => {
  try {
    const { trainerId, trainingDate } = req.body;

    if (!trainerId || !trainingDate) {
      return res.status(400).json({ message: 'TrainerId and TrainingDate are required.' });
    }

    const existingBooking = await TrainerModel.findOne({ 
      TrainerId: trainerId, 
      TrainingDate: new Date(trainingDate) 
    });

    if (existingBooking) {
      return res.status(200).json({ isBooked: true });
    }

    return res.status(200).json({ isBooked: false });
  } catch (error) {
    console.error('Error checking booking:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getTrainees = async (req, res) => {
  try {
    const { trainerId } = req.params;

    if (!trainerId) {
      return res.status(400).json({ message: 'TrainerId is required.' });
    }

    const bookings = await TrainerModel.find({ TrainerId: trainerId })
      .populate('TraineeId', 'username avatar') 
      .select('TraineeId TrainingDate');

    if (!bookings.length) {
      return res.status(200).json({ message: 'No current trainees.', trainees: [] });
    }

    const trainees = bookings.map(booking => ({
      id: booking.TraineeId._id,
      name: booking.TraineeId.username,
      date: booking.TrainingDate,
      avatar: booking.TraineeId.avatar
    }));

    res.json({ trainees });
  } catch (error) {
    console.error('Error fetching trainees:', error);
    res.status(500).json({ message: 'An error occurred while fetching trainees.', error: error.message });
  }
};



const getNearestTrainingSession = async (req, res) => {
  try {
    const { traineeId } = req.params;

    const nearestSession = await TrainerModel.findOne({
      TraineeId: traineeId,
      TrainingDate: { $gte: new Date() },
    })
      .sort({ TrainingDate: 1 })
      .populate({
        path: 'TrainerId',
        select: 'username avatar', 
        model: UserModel, 
      });

    if (!nearestSession) {
      return res.status(200).json({ message: 'No upcoming sessions found' });
    }

    res.status(200).json({
      nearestSession: {
        _id: nearestSession._id,
        Trainer: {
          username: nearestSession.TrainerId.username,
          avatar: nearestSession.TrainerId.avatar,
        },
        TrainingDate: nearestSession.TrainingDate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching nearest session' });
  }
};

const deleteTrainingSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await TrainerModel.findByIdAndDelete(sessionId);
    res.status(200).json({ message: 'Training session deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting training session' });
  }
};


module.exports = {
  registerTrainer,
  getTrainerRequestStatus,
  getTrainers,
  bookTrainer,
  checkBooking,
  getTrainees,
  getNearestTrainingSession,
  deleteTrainingSession,
};
