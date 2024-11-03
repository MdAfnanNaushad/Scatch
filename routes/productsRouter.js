const express = require('express');
const router = express.Router(); //requiring rouetr to use import and export method
const upload = require("../config/multer-config"); //we have to upload file therefre we are using multer
const productModel = require("../models/product-model"); //to caet product productmoel is a mist
const multer = require('multer'); //requiring multer

router.post("/create", upload.single("image"), async function (req, res) { //Schema for Product model

    try {
        let {
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor } = req.body;
        let product = await productModel.create({ //creating in mongoose
            image: req.file.buffer, //type of buffer not string
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        });
        req.flash("success", "Product created Successfully") //on creation sending flash message
        res.redirect("/owners/admin"); //redirecting to create more products
    }
    catch (err) {
        req.flash("error", err.message); //if any error happens in product mol the also redirecting
        res.redirect("/owners/admin");
    }
});

module.exports = router; //exporting