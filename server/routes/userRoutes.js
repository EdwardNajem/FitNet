const express = require('express');
const {
  registerUser,
  loginUser,
  updateUserInfo,
  updateUserPassword,
  updateUserEmail,
  getGymDetails,
  getUserDetails,
} = require('../controllers/userController');
const { sendOTPController } = require('../controllers/otpController');

//router object
const router = express.Router();

//routes
router.post('/registeruser', registerUser);
router.post('/loginuser', loginUser);
router.post('/sendOtp', sendOTPController);
router.put('/updateUserInfo', updateUserInfo);
router.put('/updateUserPassword', updateUserPassword);
router.put('/updateUserEmail', updateUserEmail);
router.get('/getGymDetails/:userId', getGymDetails);
router.post('/getUserDetails', getUserDetails);

//export
module.exports = router;
