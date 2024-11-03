const express = require('express'); //express requiing
const app = express(); //requiring as app for the use in app.j file an not router
const router = express.Router();
const userModel = require("../models/user-model") //for user creation usermodel is a must
const bcrypt = require("bcrypt"); //requiring bcrypt for hashing of pssword on the basis of salt and password give by user
const jwt = require("jsonwebtoken"); //jwt for authorization and aithentication
const {generateToken} = require('../utils/generatetoken') //token generate function to prevent continuous login
const {registerUser , loginUser, logout} = require("../controllers/AuthController"); //to ensure whom to login and whom to not
const dotenv = require('dotenv'); //.env for secret requirements
const cookieParser = require('cookie-parser'); //cookie-parser to convert in readable format
dotenv.config(); //function to use  .env
app.use(cookieParser()); //method to use cokie parser
router.get("/", function (req, res) {
    res.send("hey");
});



//User can do either three things:
router.post("/register", registerUser ); //register himself
router.post("/login",loginUser);//login himself
router.get("/logout",logout);//logout himself

module.exports = router;