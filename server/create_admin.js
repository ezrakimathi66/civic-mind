// Run with: node create_admin.js
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'ezrakimathi66@gmail.com';
    const name = 'ezra kimathi';
    const password = '12345678';

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      console.log('User already exists, promoting to admin...');
    } else {
      console.log('Creating new admin user...');
      user = await User.create({
        name,
        email,
        password,
        role: 'admin'
      });
      console.log('Admin user created:', email);
    }

    // Ensure role is admin
    user.role = 'admin';
    await user.save();
    
    console.log('✅ Admin user ready:', {
      name: user.name,
      email: user.email,
      role: user.role
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
