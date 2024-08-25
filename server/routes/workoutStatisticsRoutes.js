const express = require('express');
const {
    getWorkoutVolumeForLast7Days,
} = require('../controllers/workoutStatisticsController');

//router object
const router = express.Router();

router.get('/getWorkoutVolumeForLast7Days/:userId', getWorkoutVolumeForLast7Days);

module.exports = router;