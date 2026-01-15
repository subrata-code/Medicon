import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../services/cloudinary.js";

// Set up storage in Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "medical_certificates", // Cloudinary folder name
    resource_type: "raw", // Auto-detect file type (pdf, images, etc.)
  },
});

// Initialize multer with the Cloudinary storage
const multerUpload = multer({ storage });

// Export a function that returns a middleware
const uploadFile = (fieldName, maxCount) => multerUpload.array(fieldName, maxCount);

export default { upload: uploadFile };