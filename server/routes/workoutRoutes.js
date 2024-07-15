const express = require('express');
const {
  getAllExercises,
  getAllWorkoutPlansByUser,
  createWorkoutPlan,
  deleteWorkoutPlanById,
} = require('../controllers/workoutController');

//router object
const router = express.Router();

router.get('/getAllExercises', getAllExercises);
router.get('/getAllWorkoutPlansByUser', getAllWorkoutPlansByUser);
router.post('/createWorkoutPlan', createWorkoutPlan);
router.delete('/deleteWorkoutPlanById', deleteWorkoutPlanById);

//export
module.exports = router;
