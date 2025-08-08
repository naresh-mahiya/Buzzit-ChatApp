import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  {
    email: "nareshmahiya@primemail.com",
    fullName: "Naresh Mahiya",
    mobile: "5678901234",
    password: "12345678",
  },
  // Female Users
  {
    email: "aanyasharma@example.com",
    fullName: "Aanya Sharma",
    mobile: "1234567890",
    password: "12345678",
  },
  {
    email: "kairiverma@example.com",
    fullName: "Kairi Verma",
    mobile: "2345678901",
    password: "12345678",
  },

  // Male Users
  {
    email: "vihaanpatel@example.com",
    fullName: "Vihaan Patel",
    mobile: "3456789012",
    password: "12345678",
  },
  {
    email: "reyanshgupta@example.com",
    fullName: "Reyansh Gupta",
    mobile: "4567890123",
    password: "12345678",
  },
];


const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();
