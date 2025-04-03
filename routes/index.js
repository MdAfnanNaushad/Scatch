const express = require("express");
const app = express();
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const flash = require('connect-flash')
app.set("view engine", "ejs")
app.use(flash());
router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index", { error, loggedin: false }); //if the user is ot logged in then error will bw shown
});
router.get("/shop", isLoggedIn, async function (req, res) {
    try {
        let products = await productModel.find();
        const successMessages = req.flash("success", "Welcome to Scatch");
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
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.id);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect('/shop');
});
router.get("/account", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email }); // Find single user based on logged-in email
        if (user) {
            return res.render("account", { users: user }); // Pass the user object to the view
        }
        res.status(404).send("User not found"); // Handle case if user is not found
    } catch (error) {
        console.error(error);
        res.send("Something went wrong");
    }
});

router.get("/logout", isLoggedIn, function (req, res) {
    res.render("shop");
});


module.exports = router;