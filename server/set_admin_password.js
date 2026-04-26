// Run this script with: node set_admin_password.js
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
async function setAdminPassword() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = 'ezrakimathi66@gmail.com';
  const plainPassword = '12345678';
  let user = await User.findOne({ email });
  if (!user) {
    // Create the user if not found
    user = new User({
      name: 'Ezra Kimathi',
      email,
      password: plainPassword,
      role: 'admin',
      initials: 'EK'
    });
    await user.save();
    console.log('Admin user created with password 12345678');
  } else {
    user.password = plainPassword;
    user.role = 'admin';
    await user.save();
    console.log('Admin password updated to 12345678');
  }
  process.exit(0);
}

setAdminPassword();
