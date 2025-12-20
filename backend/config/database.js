const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use local MongoDB for testing
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supplysenseai';

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('Make sure your MongoDB connection string is correct and MongoDB is accessible.');
    process.exit(1);
  }
};

module.exports = connectDB;

