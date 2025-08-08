import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { connectDB } from "../lib/db.js";

const createAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = new User({
      fullName: 'Admin Buzzit',
      email: 'admin@buzzit.com',
      mobile: '7877051528',
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created successfully:', adminUser.email);
    console.log('Admin credentials:');
    console.log('Email: admin@buzzit.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
