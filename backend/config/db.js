const mongoose = require('mongoose');

// Singleton Pattern: Only one connection is ever created
let instance = null;

const connectDB = async () => {
  if (instance) {
    console.log('Using existing MongoDB connection');
    return instance;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    instance = conn;
    console.log(`MongoDB Connected`);
    return instance;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
