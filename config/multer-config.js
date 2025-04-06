const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "..", "public", "profilepic", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Setting up multer storage to save files to the 'public/profilepic/uploads' folder
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir); // Save files to the correct directory
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp for uniqueness
//     }
// });
const storage = multer.memoryStorage();

// Initialize multer with the storage settings
const upload = multer({ storage: storage });

module.exports = upload; // Export multer configuration to be used in other files