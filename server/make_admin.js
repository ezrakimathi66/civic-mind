// Run this script with: node make_admin.js
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');

async function makeAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = 'ezrakimathi66@gmail.com';
  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found:', email);
    process.exit(1);
  }
  user.role = 'admin';
  await user.save();
  console.log('User promoted to admin:', email);
  process.exit(0);
}

makeAdmin();
