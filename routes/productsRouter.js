const express = require('express');
const router = express.Router(); // Requiring router to use import and export method
const upload = require("../config/multer-config"); // Import multer configuration
const productModel = require("../models/product-model"); // Product model for database operations

router.post("/create", upload.single("image"), async function (req, res) {
    try {
        const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        // Validate required fields
        if ( !req.file) {
            req.flash("error", "Name, price, and image are required");
            return res.redirect("/owners/admin");
        }

        // Create the product in the database
        let product = await productModel.create({
            image: req.file.buffer, // Save the filename instead of the buffer
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        });

        req.flash("success", "Product created successfully");
        res.redirect("/shop");
    } catch (err) {
        console.error(err); // Log the error for debugging
        req.flash("error", err.message);
        res.redirect("/owners/admin");
    }
});

module.exports = router; // Exporting the router