import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Determine resource type based on file mimetype
    let resourceType = 'auto';
    if (file.mimetype.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      resourceType = 'video';
    } else if (file.mimetype.startsWith('application/')) {
      resourceType = 'raw';
    }

    return {
      folder: 'chat-app',
      format: 'auto', // Automatically detect format
      public_id: `${Date.now()}-${uuidv4()}`,
      resource_type: resourceType,
      // Set appropriate quality based on file type
      quality: resourceType === 'image' ? 'auto:good' : 'auto:good',
      // For videos, specify format and quality
      ...(resourceType === 'video' && {
        format: 'mp4',
        quality: 'auto:good',
        fetch_format: 'auto',
        chunk_size: 6000000, // 6MB chunks for large files
      }),
    };
  },
});

// File filter to allow specific file types
const fileFilter = (req, file, cb) => {
  // Accept images, videos, and common document types
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.mimetype === 'application/vnd.ms-excel' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.mimetype === 'text/plain'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type!'), false);
  }
};

// Configure multer with memory storage
const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage, // Use memory storage instead of disk storage
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB file size limit
  },
});

// Export as both named and default for compatibility
export { cloudinary, upload };
export default cloudinary;
