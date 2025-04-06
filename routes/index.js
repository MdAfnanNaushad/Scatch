const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", function (req, res) {
    let error = req.flash("error");
    let success = req.flash("success");
    res.render("index", { error, success, loggedin: false });
});

router.get("/shop", isLoggedIn, async function (req, res) {
    try {
        let products = await productModel.find();
        const successMessages = req.flash("success");
        const success = successMessages.length ? successMessages[0] : "";
        res.render("shop", { products, success });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/");
    }
});

router.get("/cart", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate("cart");
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/");
        }
        let bill = 0;
        if (user.cart && user.cart.length > 0) {
            bill = user.cart.reduce((total, item) => {
                const price = item.price || 0;
                const discount = item.discount || 0;
                return total + price - discount;
            }, 0);
        }
        res.render("cart", { user, bill });
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to load cart");
        res.redirect("/");
    }
});

router.get("/addtocart/:id", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/shop");
        }
        let product = await productModel.findById(req.params.id);
        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/shop");
        }
        user.cart.push(req.params.id);
        await user.save();
        req.flash("success", "Added to cart");
        res.redirect("/shop");
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to add product to cart");
        res.redirect("/shop");
    }
});

router.get("/account", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        if (user) {
            return res.render("account", { users: user });
        }
        res.status(404).send("User not found");
    } catch (error) {
        console.error(error);
        res.send("Something went wrong");
    }
});

router.get("/logout", isLoggedIn, function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            req.flash("error", "Failed to log out");
            return res.redirect("/shop");
        }
        res.redirect("/");
    });
});

module.exports = router;