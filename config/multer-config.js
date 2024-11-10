const multer = require("multer");
const path = require("path");
// Setting up multer storage to save files to the 'public/profilepic/uploads' folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "public", "profilepic", "uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Use timestamp for uniqueness
    }
});

// Initialize multer with the storage settings
const upload = multer({ storage: storage });

module.exports = upload;  // Export multer configuration to be used in other files
