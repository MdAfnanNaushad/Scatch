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
    res.render("index", { error, loggedin: false });
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
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");
    if(user.cart){
        bill = user.cart.reduce((total,item)=>{
            return total+item.price-(item.discount);
        },0)
    }
    res.render("cart", { user,bill });
});

router.get("/addtocart/:id", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.id);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect('/shop');
});
router.get("/logout", isLoggedIn, function (req, res) {
    res.render("shop");
});


module.exports = router;