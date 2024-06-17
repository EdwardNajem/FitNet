const ExerciseModel = require('../models/exerciseModel');

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

module.exports = { getAllExercises };
