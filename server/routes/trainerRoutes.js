const express = require('express');
const {
registerTrainer,
getTrainerRequestStatus,
getTrainers,
} = require('../controllers/trainerController');

const router = express.Router();

router.post('/registerTrainer', registerTrainer);
router.get('/trainerRequestStatus/:userId', getTrainerRequestStatus);
router.get('/getTrainers', getTrainers);


module.exports = router;
