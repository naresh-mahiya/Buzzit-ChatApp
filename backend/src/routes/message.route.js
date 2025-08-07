import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
import { upload } from "../lib/cloudinary.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

// Handle file uploads with multer
router.post(
  "/send/:id",
  protectRoute,
  upload.single('file'), // 'file' is the field name in the form-data
  sendMessage
);

export default router;
