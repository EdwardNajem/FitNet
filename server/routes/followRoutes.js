const express = require('express');
const { searchUsers,followUser,unfollowUser,followStatus } = require('../controllers/followController');
const router = express.Router();

router.get('/searchUsers', searchUsers);
router.post('/followUser',followUser);
router.post('/unfollowUser',unfollowUser);
router.get('/followStatus',followStatus);


module.exports = router;
