const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logout } = require("../controllers/AuthController");
const upload = require("../config/multer-config");  // Correct import for multer config
const userModel = require("../models/user-model");
const { isAuthenticated } = require("../middlewares/isLoggedIn");
const isLoggedIn = require('../middlewares/isLoggedIn');

// Route for registering a user
router.post("/register", registerUser);

// Route for logging in a user
router.post("/login", loginUser);

// Route for logging out a user
router.get("/logout", logout);

// Route to upload a profile picture (authentication required)
router.post("users/upload-profile-pic", isLoggedIn, upload.single('profilepic'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const user = await userModel.findById(req.user.userId);  // Find the user based on the JWT (from auth middleware)
        user.profilepic = req.file.filename;  // Save the filename in the user's profilepic field
        await user.save();

        res.status(200).json({ message: "Profile picture updated successfully", profilepic: req.file.filename });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading profile picture" });
    }
});

module.exports = router;
