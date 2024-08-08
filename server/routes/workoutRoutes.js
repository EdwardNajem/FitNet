const express = require('express');
const {
  getAllExercises,
  getAllWorkoutPlansByUser,
  createWorkoutPlan,
  startWorkout,
  finishWorkout,
  deleteWorkoutPlanById,
  updateWorkoutPlanById,
} = require('../controllers/workoutController');

//router object
const router = express.Router();

router.get('/getAllExercises', getAllExercises);
router.get('/getAllWorkoutPlansByUser/:userId', getAllWorkoutPlansByUser);
router.post('/createWorkoutPlan', createWorkoutPlan);
router.post('/startWorkout', startWorkout);
router.post('/finishWorkout', finishWorkout);
router.delete('/deleteWorkoutPlanById/:workoutId', deleteWorkoutPlanById);
router.put('/updateWorkoutPlanById/:workoutId', updateWorkoutPlanById);

//export
module.exports = router;
