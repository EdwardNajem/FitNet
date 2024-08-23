const express = require('express');
const { searchUsers,
    searchGyms,
    followUser,
    unfollowUser,
    followStatus,
    getFollowerCount,
    getFollowingCount, } = require('../controllers/followController');
const router = express.Router();

router.get('/searchUsers', searchUsers);
router.get('/searchGyms', searchGyms);
router.post('/followUser',followUser);
router.post('/unfollowUser',unfollowUser);
router.get('/followStatus',followStatus);
router.get('/getFollowerCount',getFollowerCount);
router.get('/getFollowingCount',getFollowingCount);


module.exports = router;
