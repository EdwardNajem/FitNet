const mongoose = require('mongoose');

const followSchema=new mongoose.Schema(
 {
    UserFollowerId:{
        type: String,
        required: true,
     },

     UserFollowingId:{
        type: String,
        required: true,
     },

 }
);

module.exports = mongoose.model('Follow', followSchema);
