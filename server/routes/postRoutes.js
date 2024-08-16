const express = require('express');
const {
    uploadPost,
    uploadPostGym,
    getAllPosts,
    getPostsByUser,
    addLikeToPost,
    removeLikeFromPost,
    addCommentToPost,
    deleteCommentFromPost,
} = require('../controllers/postController');

//router object
const router = express.Router();

//routes
router.post('/uploadPost', uploadPost);
router.post('/uploadPostGym', uploadPostGym);
router.post('/getAllPosts', getAllPosts);
router.post('/getPostsByUser', getPostsByUser);
router.post('/addLikeToPost', addLikeToPost);
router.post('/removeLikeFromPost', removeLikeFromPost);
router.post('/addCommentToPost', addCommentToPost);
router.post('/deleteCommentFromPost', deleteCommentFromPost);
//export
module.exports = router;
