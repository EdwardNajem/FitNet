const ExerciseModel = require('../models/exerciseModel');
const WorkoutPlanModel = require('../models/workoutPlanModel');

const getAllExercises = async (req, res) => {
  try {
    const exercises = await ExerciseModel.find();

    if (!exercises) {
      return res.status(400).send({
        success: false,
        message: 'There are no exercises',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Exercises Found',
      exercises,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in Get All Exercises API',
      error,
    });
  }
};

const getAllWorkoutPlansByUser = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a URL parameter

  try {
    const workoutPlans = await WorkoutPlanModel.find({
      createdBy: userId,
    }).populate('exercises');

    if (!workoutPlans) {
      return res.status(400).send({
        success: false,
        message: 'No workout plans found for this user',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Workout plans retrieved successfully',
      workoutPlans,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in retrieving workout plans',
      error,
    });
  }
};

const createWorkoutPlan = async (req, res) => {
  const { title, createdBy, exercises } = req.body;

  if (!title || !createdBy || !exercises || !exercises.length) {
    return res.status(400).send({
      success: false,
      message: 'Please provide title, createdBy, and exercises with reps',
    });
  }

  try {
    const newWorkoutPlan = new WorkoutPlan({
      title,
      createdBy,
      exercises,
    });

    await newWorkoutPlan.save();

    res.status(201).send({
      success: true,
      message: 'Workout plan created successfully',
      workoutPlan: newWorkoutPlan,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in creating workout plan',
      error,
    });
  }
};


const deleteWorkoutPlanById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedWorkoutPlan = await WorkoutPlanModel.findByIdAndDelete(id);

    if (!deletedWorkoutPlan) {
      return res.status(404).send({
        success: false,
        message: 'Workout plan not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Workout plan deleted successfully',
      workoutPlan: deletedWorkoutPlan,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in deleting workout plan',
      error,
    });
  }
};

module.exports = {
  getAllExercises,
  getAllWorkoutPlansByUser,
  createWorkoutPlan,
  deleteWorkoutPlanById,
};
