const mongoose = require('mongoose');
const LandingContent = require('./models/LandingContent');
require('dotenv').config();

const run = async () => {
  const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bit_dny_db';
  await mongoose.connect(connStr);
  const content = await LandingContent.findOne();
  console.log('Landing Content Gallery:', JSON.stringify(content.campusGallery, null, 2));
  process.exit(0);
};

run();
