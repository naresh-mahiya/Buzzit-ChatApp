import express from "express";
import { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  hardDeleteUser 
} from "../controllers/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protectRoute);
router.use(requireAdmin);

// User management routes
router.post("/users", createUser);
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);
router.delete("/users/:userId/hard", hardDeleteUser);

export default router;
