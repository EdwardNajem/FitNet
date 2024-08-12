const WorkoutPlanModel = require('../models/workoutPlanModel');
const userModel = require('../models/userModel');
const postModel = require('../models/postModel');
const mongoose = require('mongoose');

const uploadPost = async (req,res) => {
    const {postType} = req.body;

    if(!postType){
        return res.status(400).send({
            success: false,
            message: 'Please provide post type',
        });
    }else{
        if(postType=="workout"){
            const {description, workoutData, createdBy, workoutPlanId} = req.body;

            // now lets make the exercice array
            try {
                const workoutPlan = await WorkoutPlanModel.findById(workoutPlanId);
                const exercisesSummary = workoutPlan.exercises.map(exercise => ({
                    image: exercise.image,
                    name: exercise.name,
                    setsCount: exercise.sets.length, // Count the number of sets
                }));
                const workoutPlanPost = exercisesSummary.map(exercise => ({
                    exerciseName: exercise.name,
                    photo: exercise.image,
                    sets: exercise.setsCount,
                }));

                // return res.status(200).json(workoutPlanPost);

                const newPost = new postModel({
                    description,
                    postType,
                    createdBy,
                    workoutData,
                    workoutPlan: workoutPlanPost,
                });
                            
                await newPost.save();
            
                return res.status(201).send({
                    success: true,
                    message: 'Post created successfully',
                });

            } catch (error) {
                return res.status(500).send({
                    success: false,
                    message: 'Error in creating post',
                    error,
                });
            }
        }else{
            const {description, workoutData, createdBy, imageURL} = req.body;

            try {
                // this one is very easy
                const newPost = new postModel({
                    description,
                    photo: imageURL,
                    postType,
                    createdBy,
                    workoutData
                });
            
                await newPost.save();
            
                res.status(201).send({
                    success: true,
                    message: 'Post created successfully',
                });
            } catch (error) {
                return res.status(500).send({
                    success: false,
                    message: 'Error in creating post',
                    error,
                });
            }
        }
    }
}

// const getAllPosts = async (req, res) => {
//     try {
//         const posts = await postModel
//             .find()
//             .populate('createdBy') // Populate the entire user object who created the post
//             .populate('comments.user') // Populate the entire user object in each comment
//             .sort({ createdAt: -1 }); // Sort by creation date, newest first

//         res.status(200).json(posts);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving posts', error: error.message });
//     }
// };

const getAllPosts = async (req, res) => {
    const {userId} = req.body;
    try {
        const userIdObj = new mongoose.Types.ObjectId(userId); // Convert userId to ObjectId

        const posts = await postModel
            .find()
            .populate('createdBy') // Populate the entire user object who created the post
            .populate('comments.user') // Populate the entire user object in each comment
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .lean(); // Use lean to get plain JavaScript objects

        // Add isLikedByCurrentUser field to each post
        const postsWithLikeStatus = posts.map(post => ({
            ...post,
            isLikedByCurrentUser: post.likes.some(like => like.equals(userIdObj)), // Use equals for ObjectId comparison
        }));

        return res.status(200).json(postsWithLikeStatus);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving posts', error: error.message });
    }
};


const addLikeToPost = async (req, res) => {
    const { postId, userId } = req.body;
    
    if (!postId || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Please provide postId and userId',
        });
    }

    try {
        // Find the post by ID and update it by adding the userId to the likes array
        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            { $addToSet: { likes: userId } }, // $addToSet ensures no duplicate likes
            { new: true } // Return the updated post
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Post liked successfully',
            post: updatedPost,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error adding like: ${error.message}`,
        });
    }
};

const removeLikeFromPost = async (req, res) => {
    const { postId, userId } = req.body;
    
    if (!postId || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Please provide postId and userId',
        });
    }

    try {
        // Find the post by ID and update it by removing the userId from the likes array
        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            { $pull: { likes: userId } }, // $pull removes the userId from the likes array
            { new: true } // Return the updated post
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Like removed successfully',
            post: updatedPost,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error removing like: ${error.message}`,
        });
    }
};

const addCommentToPost = async (req, res) => {
    const { postId, userId, text } = req.body;

    if (!postId || !userId || !text) {
        return res.status(400).json({
            success: false,
            message: 'Please provide postId, userId, and comment text',
        });
    }

    try {
        // Create the comment object
        const comment = {
            user: userId,
            text: text,
            createdAt: new Date(),
        };

        // Find the post by ID and update it by adding the new comment to the comments array
        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            { $push: { comments: comment } }, // $push adds the comment to the comments array
            { new: true } // Return the updated post
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Comment added successfully',
            post: updatedPost,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error adding comment: ${error.message}`,
        });
    }
};

const deleteCommentFromPost = async (req, res) => {
    const { postId, commentId } = req.body;

    if (!postId || !commentId) {
        return res.status(400).json({
            success: false,
            message: 'Please provide postId and commentId',
        });
    }

    try {
        // Find the post by ID and update it by removing the comment with the specified commentId
        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            { $pull: { comments: { _id: commentId } } }, // $pull removes the comment with the specified _id
            { new: true } // Return the updated post
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
            post: updatedPost,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error deleting comment: ${error.message}`,
        });
    }
};

module.exports = {
    uploadPost,
    getAllPosts,
    addLikeToPost,
    removeLikeFromPost,
    addCommentToPost,
    deleteCommentFromPost
};