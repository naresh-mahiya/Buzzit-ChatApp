import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// 1. Create User (Admin only)
export const createUser = async (req, res) => {
  try {
    const { fullName, email, mobile, password, role = 'user' } = req.body;

    // Validate required fields
    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields (name, email, mobile, password) are required" });
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    // Mobile validation
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingUser.mobile === mobile) {
        return res.status(400).json({ message: "Mobile number already exists" });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      mobile: newUser.mobile,
      role: newUser.role,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    console.log("Error in createUser controller:", error.message);
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (error.keyPattern?.mobile) {
        return res.status(400).json({ message: "Mobile number already exists" });
      }
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 2. Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const { search, includeInactive = false } = req.query;
    
    let query = { isActive: true }; // Only show active users by default
    
    // Include inactive users if requested
    if (includeInactive === 'true') {
      query = {};
    }
    
    // Add search functionality
    if (search) {
      query = {
        ...query,
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ]
      };
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllUsers controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 3. Get Single User
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 4. Update User
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, mobile, role } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !mobile) {
      return res.status(400).json({ message: "Name, email, and mobile are required" });
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    // Mobile validation
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for duplicate email/mobile (excluding current user)
    const duplicateUser = await User.findOne({
      $and: [
        { _id: { $ne: userId } },
        { $or: [{ email }, { mobile }] }
      ]
    });

    if (duplicateUser) {
      if (duplicateUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (duplicateUser.mobile === mobile) {
        return res.status(400).json({ message: "Mobile number already exists" });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        email,
        mobile,
        role: role || existingUser.role,
      },
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateUser controller:", error.message);
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (error.keyPattern?.mobile) {
        return res.status(400).json({ message: "Mobile number already exists" });
      }
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 5. Delete User (Soft delete - mark as inactive)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (existingUser.role === 'admin') {
      return res.status(400).json({ message: "Cannot delete admin user" });
    }

    // Soft delete - mark as inactive
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.log("Error in deleteUser controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 6. Hard Delete User (Optional - for permanent removal)
export const hardDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (existingUser.role === 'admin') {
      return res.status(400).json({ message: "Cannot delete admin user" });
    }

    // Hard delete - remove from database
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User permanently deleted" });
  } catch (error) {
    console.log("Error in hardDeleteUser controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
