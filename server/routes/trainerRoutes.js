const express = require('express');
const {
registerTrainer,
getTrainerRequestStatus,
} = require('../controllers/trainerController');

const router = express.Router();

router.post('/registerTrainer', registerTrainer);
router.get('/trainerRequestStatus/:userId', getTrainerRequestStatus);


module.exports = router;
