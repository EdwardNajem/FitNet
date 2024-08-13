const mongoose = require('mongoose');

const trainerRequestSchema=new mongoose.Schema(
 {
    Certificate:{
        type: String,
        required: true,
    },

    Type:{
        type: String,
        required: true,
    },
    
    Status:{
        type: String,
        required: true,
     },

 }
);

module.exports = mongoose.model('TrainerRequest', trainerRequestSchema);
