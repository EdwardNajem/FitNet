const express = require('express');
const { 
    sendSubscriptionRequest,
    checkGymSubscription,
    removeSubscriptionRequest,
    checkAllSubscriptionForUser,
 } = require('../controllers/gymSubscriptionController');
const router = express.Router();

router.post('/sendSubscriptionRequest', sendSubscriptionRequest);
router.post('/checkGymSubscription', checkGymSubscription);
router.post('/removeSubscriptionRequest', removeSubscriptionRequest);
router.get('/checkAllSubscriptionForUser/:userId', checkAllSubscriptionForUser);


module.exports = router;