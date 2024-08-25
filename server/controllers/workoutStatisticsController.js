const mongoose = require('mongoose');
const PostModel = require('../models/postModel');

const getWorkoutVolumeForLast7Days = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        // Convert userId to ObjectId
        const userIdObj = new mongoose.Types.ObjectId(userId);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Fetch posts created by the user in the last 7 days
        const posts = await PostModel.find({
            createdBy: userIdObj,
            createdAt: { $gte: sevenDaysAgo }
        }).lean();

        // Initialize an object to store aggregated volume by date
        const volumeByDate = {};

        // Loop through the posts to aggregate volume by date
        posts.forEach(post => {
            const date = new Date(post.createdAt).toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
            const volume = post.workoutData.volume || 0;

            if (volumeByDate[date]) {
                volumeByDate[date] += volume;
            } else {
                volumeByDate[date] = volume;
            }
        });

        // Convert the volumeByDate object to an array of objects with date and volume
        const volumeData = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            volumeData.push({
                date: dateString,
                volume: volumeByDate[dateString] || 0
            });
        }

        return res.status(200).json(volumeData.reverse()); // Reverse to have the oldest date first

    } catch (error) {
        console.error('Error fetching workout volume:', error);
        return res.status(500).json({ message: 'Error fetching workout volume.' });
    }
};


module.exports = {
    getWorkoutVolumeForLast7Days,
};