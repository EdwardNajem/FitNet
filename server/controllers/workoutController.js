const ExerciseModel = require('../models/exerciseModel');
const WorkoutPlanModel = require('../models/workoutPlanModel');
const userModel = require('../models/userModel');

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
    const newWorkoutPlan = new WorkoutPlanModel({
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

const startWorkout = async (req, res) => {
  const {workoutId, startTime} = req.body;

  if (!workoutId || !startTime) {
    return res.status(400).send({
      success: false,
      message: 'Please make sure everything is provided',
    });
  }

  try {
    const updatedWorkoutPlan = await WorkoutPlanModel.findByIdAndUpdate(
      workoutId,
      { startTime },
      { new: true, runValidators: true }
    );

    if (!updatedWorkoutPlan) {
      return res.status(404).send({
        success: false,
        message: 'Workout plan not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Workout start time updated successfully',
      workoutPlan: updatedWorkoutPlan,
    });
    
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Error in starting your workout',
      error,
    });
  }
}

const finishWorkout = async (req, res) => {
  const {workoutId, endTime} = req.body;
  if (!workoutId || !endTime) {
    return res.status(400).send({
      success: false,
      message: 'Please make sure everything is provided',
    });
  }

  try {

    const workoutPlan = await WorkoutPlanModel.findById(workoutId);

    // first lets get the end time
    const date1 = new Date(workoutPlan.startTime);
    const date2 = new Date(endTime);
    const diffInMs = date2 - date1;

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    // now lets calculate the volume
    let volume = 0;
    const user = await userModel.findById(workoutPlan.createdBy); 
    const weightOfUser = user.weight;
    for (let index = 0; index < workoutPlan.exercises.length; index++) {
      const item = workoutPlan.exercises[index];
      switch (item.type) {
        case 'Duration':
          console.log('amogus')
          break;
        case 'Weight & Reps':
          for (let set = 0; set < item.sets.length; set++) {
            const currentSet = item.sets[set];
            volume += currentSet.kg * currentSet.reps;   
          }
          break;
        case 'Bodyweight Reps':
          for (let set = 0; set < item.sets.length; set++) {
            const currentSet = item.sets[set];
            volume += weightOfUser * currentSet.reps;   
          }
          break;
        case 'Weighted Bodyweight':
          for (let set = 0; set < item.sets.length; set++) {
            const currentSet = item.sets[set];
            volume += (weightOfUser+currentSet.kg) * currentSet.reps;   
          }
          break;
        case 'Weight & Distance':
          console.log('amogus')
          break;
        case 'Assisted Bodyweight':
          for (let set = 0; set < item.sets.length; set++) {
            const currentSet = item.sets[set];
            volume += (weightOfUser-currentSet.kg) * currentSet.reps;
          }
          break;
        default:
          ExerciseComponent = null;  
      }
    }


    return res.status(200).send({
      success: true,
      data: {
        duration: diffInMinutes,
        volume: volume,
      },
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: 'Error in ending your workout',
      error,
    });
  }
}


const deleteWorkoutPlanById = async (req, res) => {
  const { workoutId } = req.params;

  try {
    const deletedWorkoutPlan = await WorkoutPlanModel.findByIdAndDelete(workoutId);

    if (!deletedWorkoutPlan) {
      return res.status(401).send({
        success: false,
        message: 'Workout plan not found ' + id,
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

const updateWorkoutPlanById = async (req, res) => {
  const { workoutId } = req.params; // Assuming the ID is passed as a URL parameter
  const { title, exercises } = req.body;

  if (!title || !exercises || !exercises.length) {
    return res.status(400).send({
      success: false,
      message: 'Please provide title and exercises with reps',
    });
  }

  // Process the exercises array to update time with currentTime if present
  const updatedExercises = exercises.map(exercise => {
    const updatedSets = exercise.sets.map(set => ({
      ...set,
      time: set.currentTime || set.time,
      reps: set.currentReps || set.reps,
      meters: set.currentMeters || set.meters,
    }));
    return { ...exercise, sets: updatedSets };
  });

  try {
    const updatedWorkoutPlan = await WorkoutPlanModel.findByIdAndUpdate(
      workoutId,
      { title, exercises: updatedExercises },
      { new: true, runValidators: true }
    );

    if (!updatedWorkoutPlan) {
      return res.status(404).send({
        success: false,
        message: 'Workout plan not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Workout plan updated successfully',
      workoutPlan: updatedWorkoutPlan,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in updating workout plan',
      error,
    });
  }
};

module.exports = {
  getAllExercises,
  getAllWorkoutPlansByUser,
  createWorkoutPlan,
  startWorkout,
  finishWorkout,
  deleteWorkoutPlanById,
  updateWorkoutPlanById,
};
