const express = require('express');
const {
registerTrainer,
getTrainerRequestStatus,
getTrainers,
bookTrainer,
checkBooking,
getTrainees,
getNearestTrainingSession,
deleteTrainingSession,
deleteTrainingSessionByDate,
} = require('../controllers/trainerController');

const router = express.Router();

router.post('/registerTrainer', registerTrainer);
router.get('/trainerRequestStatus/:userId', getTrainerRequestStatus);
router.get('/getTrainers', getTrainers);
router.post('/bookTrainer', bookTrainer);
router.post('/checkBooking', checkBooking);
router.get('/getTrainees/:trainerId', getTrainees);

router.get('/getNearestTrainingSession/:traineeId',getNearestTrainingSession);
router.delete('/deleteTrainingSession/:sessionId',deleteTrainingSession);
router.post('/deleteTrainingSessionByDate', deleteTrainingSessionByDate);



module.exports = router;
