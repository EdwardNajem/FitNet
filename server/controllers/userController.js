const JWT = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../helpers/authHelper');

// sign up
const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    //validation
    if (!firstname) {
      return res
        .status(400)
        .send({ success: false, message: 'First name is required' });
    }
    if (!lastname) {
      return res
        .status(400)
        .send({ success: false, message: 'Last name is required' });
    }
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: 'Email is required' });
    }
    if (!password || password.length < 8) {
      return res.status(400).send({
        success: false,
        message: 'Password is required and 8 characters long!',
      });
    }
    //exisiting user
    const existingEntrep = await UserModel.findOne({ email });
    if (existingEntrep) {
      return res.status(500).send({
        success: false,
        message: 'User already registered with this email',
      });
    }

    //hash password
    const hashedPassword = await hashPassword(password);

    //save user into database
    const user = await UserModel({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    }).save();

    return res
      .status(201)
      .send({ success: true, message: 'Account Registered' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in register API Entrep Register',
      error,
    });
  }
};

// log in
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: 'Provide Email or Password' });
    }

    //find user
    const user = await EntrepModel.findOne({ email });
    if (!user) {
      return res
        .status(500)
        .send({ success: false, message: 'Invalid email or password' });
    }

    //match password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res
        .status(500)
        .send({ success: false, message: 'Invalid email or password' });
    }
    //TOKEN JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    //undefined password
    user.password = undefined;

    res
      .status(200)
      .send({ success: true, message: 'login successful', token, user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in register API Entrep Login',
      error,
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
};
