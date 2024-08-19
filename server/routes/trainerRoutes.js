const express = require('express');
const {
registerTrainer,
getTrainerRequestStatus,
getTrainers,
bookTrainer,
checkBooking,
getTrainees,
} = require('../controllers/trainerController');

const router = express.Router();

router.post('/registerTrainer', registerTrainer);
router.get('/trainerRequestStatus/:userId', getTrainerRequestStatus);
router.get('/getTrainers', getTrainers);
router.post('/bookTrainer', bookTrainer);
router.post('/checkBooking', checkBooking);
router.get('/getTrainees/:trainerId', getTrainees);





module.exports = router;
