const express = require('express');
const { getAllExercises } = require('../controllers/workoutController');

//router object
const router = express.Router();

router.get('/getAllExercises', getAllExercises);

//export
module.exports = router;
