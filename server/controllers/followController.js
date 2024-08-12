const UserModel = require('../models/userModel'); 
const FollowModel = require('../models/followModel'); 
const searchUsers = async (req, res) => {
  try {
    const searchQuery = req.query.q; 
    const users = await UserModel.find({ 
      username: { $regex: searchQuery, $options: 'i' } 
    }).select('username avatar'); 
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const followUser = async (req, res) => {
  try {
    const { UserFollowerId, UserFollowingId } = req.body;

    // Check if the follow relationship already exists
    const existingFollow = await FollowModel.findOne({
      UserFollowerId,
      UserFollowingId,
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Create a new follow relationship
    const newFollow = new FollowModel({
      UserFollowerId,
      UserFollowingId,
    });

    await newFollow.save();
    res.status(200).json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { UserFollowerId, UserFollowingId } = req.body;

    // Remove the follow relationship
    const result = await FollowModel.deleteOne({
      UserFollowerId,
      UserFollowingId,
    });

    if (result.deletedCount === 0) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const followStatus = async (req, res) => {
  try {
    const { UserFollowerId, UserFollowingId } = req.query;

    const follow = await FollowModel.findOne({
      UserFollowerId,
      UserFollowingId,
    });

    res.status(200).json({ isFollowing: !!follow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const getFollowerCount = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const followerCount = await FollowModel.countDocuments({ UserFollowingId: userId });
    res.status(200).json({ followerCount });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: error.message });
  }
};

const getFollowingCount = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const followingCount = await FollowModel.countDocuments({ UserFollowerId: userId });
    res.status(200).json({ followingCount });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  searchUsers,
  followUser,
  unfollowUser,
  followStatus,
  getFollowerCount,
  getFollowingCount,
};
