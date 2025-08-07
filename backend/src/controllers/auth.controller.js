import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, mobile, password } = req.body;
  try {
    // Validate all fields
    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields (name, email, mobile, password) are required" });
    }
    // Email validation (stricter)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    // Mobile validation (exactly 10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
    }
    // Password validation (at least 8 chars)
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    // Check for existing user by email or mobile
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingUser.mobile === mobile) {
        return res.status(400).json({ message: "Mobile number already exists" });
      }
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      role: 'user', // Default role for signup
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        mobile: newUser.mobile,
        profilePic: newUser.profilePic,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    // Handle duplicate key error from MongoDB
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

export const login = async (req, res) => {
  const { emailOrMobile, password, role } = req.body;
  try {
    if (!emailOrMobile || !password) {
      return res.status(400).json({ message: "Both email/mobile and password are required" });
    }
    
    // Find user by email or mobile
    const user = await User.findOne({
      $or: [
        { email: emailOrMobile },
        { mobile: emailOrMobile }
      ]
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Check if role matches (if role is specified)
    if (role && user.role !== role) {
      return res.status(400).json({ message: `Invalid credentials for ${role} login` });
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      profilePic: user.profilePic,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
