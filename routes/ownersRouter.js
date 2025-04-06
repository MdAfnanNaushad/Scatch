const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owner-model");
const bcrypt = require('bcrypt');

// Route to render the owner login page
router.get('/', (req, res) => {
    res.render("owner-login");
});

// Route to render the owner creation page
router.get("/create", (req, res) => {
    let success = req.flash("success");
    let error = req.flash("error");
    res.render("CreateOwner", { success, error });
});

// Route to create a new owner (restricted to development environment)
router.post("/create", async function (req, res) {
    try {
        // Check if an owner already exists
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(403).send("You don't have permission to create a new owner");
        }

        // Validate required fields
        let { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            req.flash("error", "All fields are required");
            return res.redirect("/owners/create");
        }

        // Hash the password
        const hashedpassword = await bcrypt.hash(password, 10);

        // Create the owner in the database
        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password: hashedpassword,
        });

        req.flash("success", "Owner created successfully");
        res.status(201).redirect("/owners/admin");
    } catch (error) {
        req.flash("error", "An error occurred while creating the owner.");
        console.error(error); // Log error for debugging
        res.status(500).redirect("/owners");
    }
});

// Route to render the admin panel
router.get("/admin", function (req, res) {
    let success = req.flash("success");
    let error = req.flash("error");
    res.render("createproducts", { success, error });
});

module.exports = router;