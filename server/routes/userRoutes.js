const express = require('express');
const {
  registerUser,
  loginUser,
  updateUserInfo,
} = require('../controllers/userController');
const { sendOTPController } = require('../controllers/otpController');

//router object
const router = express.Router();

//routes
router.post('/registeruser', registerUser);
router.post('/loginuser', loginUser);
router.post('/sendOtp', sendOTPController);
router.put('/updateUserInfo', updateUserInfo);

//export
module.exports = router;
