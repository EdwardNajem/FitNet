const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');

//DotEnv
dotenv.config();

//MONGODB CONNECTION
connectDB();

//Rest Object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//ROUTES
app.use('/fitnet', require('./routes/userRoutes'));
app.use('/fitnet', require('./routes/workoutRoutes'));
app.use('/fitnet', require('./routes/postRoutes'));
app.use('/fitnet', require('./routes/followRoutes'));
app.use('/fitnet', require('./routes/trainerRoutes'));

//PORT
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(`Server Running ${PORT}`.bgGreen.white);
});
