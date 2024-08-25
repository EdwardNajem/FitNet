const express = require('express');
const { 
    sendSubscriptionRequest,
    checkGymSubscription,
    removeSubscriptionRequest,
    checkAllSubscriptionForUser,
    getSubscriptionsForGym,
    acceptSubscription,
    rejectSubscription,
 } = require('../controllers/gymSubscriptionController');
const router = express.Router();

router.post('/sendSubscriptionRequest', sendSubscriptionRequest);
router.post('/checkGymSubscription', checkGymSubscription);
router.post('/removeSubscriptionRequest', removeSubscriptionRequest);
router.get('/checkAllSubscriptionForUser/:userId', checkAllSubscriptionForUser);
router.get('/getSubscriptionsForGym/:gymId', getSubscriptionsForGym);
router.get('/acceptSubscription/:subscriptionId', acceptSubscription);
router.get('/rejectSubscription/:subscriptionId', rejectSubscription);


module.exports = router;