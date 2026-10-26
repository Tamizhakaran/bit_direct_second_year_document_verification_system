const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bit_dny_db';
    console.log(`Connecting to MongoDB at: ${connStr}...`);
    
    // Set connection timeout options
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000 // Quick timeout to fallback to memory server if local MongoDB isn't running
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB connection failed: ${error.message}`);
    console.log('Spinning up in-memory MongoDB server fallback...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      
      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host} (${uri})`);
    } catch (memError) {
      console.error(`Error starting MongoDB Memory Server: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
