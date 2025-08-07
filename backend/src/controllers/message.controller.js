import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const loggedInUser = await User.findById(loggedInUserId);
    
    // Filter out the logged-in user and admin users
    const filteredUsers = await User.find({ 
      _id: { $ne: loggedInUserId },
      role: { $ne: 'admin' } // Exclude admin users from contact list
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Handle file upload if present
    let fileData = {};
    if (req.file) {
      try {
        // Convert buffer to data URL for Cloudinary
        const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        const uploadResponse = await cloudinary.uploader.upload(dataUrl, {
          resource_type: req.file.mimetype.startsWith("video") ? "video" : "auto",
          public_id: `${Date.now()}-${req.file.originalname}`,
          folder: 'chat-app',
        });
        
        fileData = {
          fileUrl: uploadResponse.secure_url,
          fileType: req.file.mimetype,
          fileName: req.file.originalname,
          ...(req.file.mimetype.startsWith("image/") && { image: uploadResponse.secure_url }),
          ...(req.file.mimetype.startsWith("video/") && { videoUrl: uploadResponse.secure_url }),
        };
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        return res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      ...fileData,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
