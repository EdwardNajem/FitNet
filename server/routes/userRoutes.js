const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

//router object
const router = express.Router();

//routes
router.post('/registeruser', registerUser);
router.post('/loginuser', loginUser);
// router.post('/sendOtp', sendOTP);

//export
module.exports = router;
