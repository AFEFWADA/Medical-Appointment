const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the upload directory path
const uploadPath = path.join(__dirname, "../uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname.replace(/[:\s]/g, "-");
    const timestamp = new Date().toISOString().replace(/[:]/g, "-");
    cb(null, `${timestamp}-${sanitizedFileName}`); // Ensure unique filenames
  }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Unsupported file type! Only PDF, JPEG, and PNG are allowed."), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: fileFilter
});

module.exports = { upload }; // Export the configured multer instance
