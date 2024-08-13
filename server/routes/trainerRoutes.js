const express = require('express');
const {
registerTrainer,
} = require('../controllers/trainerController');

const router = express.Router();

router.post('/registerTrainer', registerTrainer);



module.exports = router;
