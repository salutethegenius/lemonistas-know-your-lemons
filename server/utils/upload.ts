import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define storage location for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store uploaded files in the attached_assets directory
    const uploadDir = path.join(process.cwd(), 'attached_assets');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename including original extension
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `team-member-${uniquePrefix}${ext}`);
  }
});

// File filter to only accept image files
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Initialize multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: fileFilter
});

export default upload;