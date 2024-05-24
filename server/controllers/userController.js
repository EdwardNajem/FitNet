const JWT = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../helpers/authHelper');

// sign up
const registerUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    email = email.toLowerCase();
    //validation
    if (!username) {
      return res
        .status(401)
        .send({ success: false, message: 'Username is required!' });
    }
    if (!email) {
      return res
        .status(402)
        .send({ success: false, message: 'Email is required!' });
    }
    if (!password || password.length < 8) {
      return res.status(403).send({
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
      username,
      email,
      password: hashedPassword,
      usertype: 'Attendee',
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
    let { email, password } = req.body;

    email = email.toLowerCase();

    //validation
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: 'Provide Email or Password' });
    }

    //find user
    const user = await UserModel.findOne({ email });
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

const updateUserInfo = async (req, res) => {
  try {
    const { _id, username, height, weight, dateofbirth, gender, avatar } =
      req.body;

    console.log('Incoming request data:', JSON.stringify(req.body, null, 2)); // Pretty-print the request data

    if (!_id || !username) {
      return res.status(400).send({
        success: false,
        message: 'Missing required fields',
      });
    }

    let birthdate = null;
    if (dateofbirth && dateofbirth !== 'NaN/NaN/NaN') {
      const birthdateParts = dateofbirth.split('/');
      if (birthdateParts.length === 3) {
        const [day, month, year] = birthdateParts;
        birthdate = new Date(year, month - 1, day);

        if (isNaN(birthdate.getTime())) {
          return res.status(400).send({
            success: false,
            message: 'Invalid birthdate',
          });
        }
      } else {
        return res.status(400).send({
          success: false,
          message: 'Invalid birthdate format. Expected format: DD/MM/YYYY',
        });
      }
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id },
      { username, height, weight, dateofbirth: birthdate, gender, avatar },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Account Updated',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error in updateUserInfo:', error);
    res.status(500).send({
      success: false,
      message: 'Error in Account Update API',
      error: error.message,
    });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const { _id } = req.body;

    const user = await UserModel.findOne({ _id });

    res.status(200).send({
      success: true,
      message: 'Account Found',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in Get Account API',
      error,
    });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { _id, oldPassword, newPassword } = req.body;

    const user = await UserModel.findOne({ _id });

    //validation
    if (!oldPassword) {
      return res
        .status(400)
        .send({ success: false, message: 'Please enter the old password!' });
    }
    if (!newPassword) {
      return res
        .status(400)
        .send({ success: false, message: 'Please enter the new password!' });
    }

    if (newPassword.length < 8) {
      return res.status(400).send({
        success: false,
        message: 'The new password should be 8 characters long!',
      });
    }

    const match = await comparePassword(oldPassword, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: 'The old password is incorrect!',
      });
    }
    const match2 = await comparePassword(newPassword, user.password);

    if (oldPassword === newPassword || match2) {
      return res.status(400).send({
        success: false,
        message: 'The old password cannot be the same as the new password!',
      });
    }
    //undefined password
    user.password = undefined;

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id },
      {
        password: hashedPassword,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: 'Change Password Successful',
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in Update User Password API',
      error,
    });
  }
};

const updateUserEmail = async (req, res) => {
  try {
    let { _id, oldEmail, newEmail } = req.body;

    oldEmail = oldEmail.toLowerCase();
    newEmail = newEmail.toLowerCase();

    const user = await UserModel.findOne({ _id });

    //validation
    if (!oldEmail) {
      return res
        .status(400)
        .send({ success: false, message: 'Please enter the old email!' });
    }
    if (!newEmail) {
      return res
        .status(400)
        .send({ success: false, message: 'Please enter the new email!' });
    }

    if (oldEmail !== user.email) {
      return res.status(400).send({
        success: false,
        message: 'The old email is incorrect!',
      });
    }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        return res.status(400).send({
          success: false,
          message: 'The new email is not a valid email address!',
        });
      }

    if (oldEmail === newEmail || newEmail === user.email) {
      return res.status(400).send({
        success: false,
        message: 'The old email cannot be the same as the new email!',
      });
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id },
      {
        email: newEmail,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: 'Change Email Successful',
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in Update User Email API',
      error,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserInfo,
  updateUserPassword,
  updateUserEmail,
};
