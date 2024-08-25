const mongoose = require('mongoose');
const GymSubscriptionModel = require('../models/gymSubscriptionModel');

const sendSubscriptionRequest = async (req, res) => {
    try {
      const { userId, gymId } = req.body;
  
      // Ensure both userId and gymId are provided
      if (!userId || !gymId) {
        return res.status(400).json({ message: 'User ID and Gym ID are required.' });
      }
  
      // Check if a subscription already exists for this user and gym with 'pending' or 'active' status
      const existingSubscription = await GymSubscriptionModel.findOne({
        user: userId,
        gym: gymId,
        status: { $in: ['pending', 'active'] },
      });
  
      if (existingSubscription) {
        return res.status(400).json({ message: 'You already have a pending or active subscription to this gym.' });
      }
  
      // Create a new gym subscription
      const newSubscription = new GymSubscriptionModel({
        user: userId,
        gym: gymId,
        startDate: Date.now(),  // Use provided startDate or default to now
        endDate: null,  // Use provided endDate or set to null
        status: 'pending'  // Set the default status to 'pending'
      });
  
      // Save the new subscription to the database
      await newSubscription.save();
  
      res.status(201).json({ message: 'Gym subscription request created successfully.', subscription: newSubscription });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const removeSubscriptionRequest = async (req, res) => {
    try {
      const { userId, gymId } = req.body;
  
      // Ensure both userId and gymId are provided
      if (!userId || !gymId) {
        return res.status(400).json({ message: 'User ID and Gym ID are required.' });
      }
  
      // Check if a subscription already exists for this user and gym with 'pending' or 'active' status
      const existingSubscription = await GymSubscriptionModel.findOne({
        user: userId,
        gym: gymId,
        status: { $in: ['pending', 'active'] },
      });
  
      if (!existingSubscription) {
        return res.status(401).json({ message: 'You don\'t have a pending gym subscription to this gym.' });
      }else{
        // Remove the existing subscription
        await existingSubscription.deleteOne();
        return res.status(201).json({ message: 'Gym subscription redquest deleted successfully.' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
};

const checkGymSubscription = async (req, res) => {
    try {
        const { userId, gymId } = req.body;
    
        // Ensure both userId and gymId are provided
        if (!userId || !gymId) {
          return res.status(400).json({ message: 'User ID and Gym ID are required.' });
        }
    
        // Check if a subscription already exists for this user and gym with 'pending' or 'active' status
        const existingSubscription = await GymSubscriptionModel.findOne({
          user: userId,
          gym: gymId,
        });
    
        if (existingSubscription) {
          return res.status(201).json(existingSubscription);
        }else{
            return res.status(201).json(null);
        }
    
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

const checkAllSubscriptionForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const subscriptions = await GymSubscriptionModel.find({ user: userId })
      .populate('user') // Populate the user field
      .populate('gym') // Populate the gym field
      .sort({ status: 1 }) // Sort by status, "active" first and "pending" next
      .sort({ status: { $eq: 'active' } ? -1 : 1 }); // Ensure "active" status comes before "pending"

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(201).json({ message: 'No subscriptions found for this user.' });
    }

    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubscriptionsForGym = async (req, res) => {
  try {
    const { gymId } = req.params;

    if (!gymId) {
      return res.status(400).json({ message: 'Gym ID is required.' });
    }

    // Find active subscriptions
    const activeSubscriptions = await GymSubscriptionModel.find({
      gym: gymId,
      status: 'active'
    }).populate('user').populate('gym');

    // Find pending subscriptions
    const pendingSubscriptions = await GymSubscriptionModel.find({
      gym: gymId,
      status: 'pending'
    }).populate('user').populate('gym');

    if (activeSubscriptions.length === 0 && pendingSubscriptions.length === 0) {
      return res.status(201).json({ message: 'No subscriptions found for this gym.' });
    }

    res.status(200).json({
      activeSubscriptions,
      pendingSubscriptions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptSubscription = async (req, res) => {
  const { subscriptionId } = req.params;

  if (!subscriptionId) {
    return res.status(400).json({ message: 'Subscription ID is required.' });
  }

  try {
    const subscription = await GymSubscriptionModel.findByIdAndUpdate(
      subscriptionId,
      { status: 'active' },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found.' });
    }

    res.status(200).json({ message: 'Subscription accepted.', subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectSubscription = async (req, res) => {
  const { subscriptionId } = req.params;

  if (!subscriptionId) {
    return res.status(400).json({ message: 'Subscription ID is required.' });
  }

  try {
    await GymSubscriptionModel.findByIdAndDelete(
      subscriptionId,
    );

    res.status(200).json({ message: 'Subscription rejected.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    sendSubscriptionRequest,
    checkGymSubscription,
    removeSubscriptionRequest,
    checkAllSubscriptionForUser,
    getSubscriptionsForGym,
    acceptSubscription,
    rejectSubscription,
};