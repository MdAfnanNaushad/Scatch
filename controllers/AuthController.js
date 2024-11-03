const express = require('express');
const flash = require('connect-flash');
const userModel = require("../models/user-model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generatetoken");


module.exports.registerUser = async function (req, res) { //regiter user exportation
    try {
        let { email, password, fullname } = req.body; //storing email,password fullname in req.body this is called destructuring
        let user = await userModel.findOne({ email: email }); //finding user on the basis of email
        if (user) return res.status(401).send("Already an Account! Try login First") //if the same registered user is trying to register then a message will be displayed
        bcrypt.genSalt(10, function (err, salt) { //hashing of passwors
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message); //if any disperancy then dispaying error
                else { //creating user
                    let user = await userModel.create({
                        email,
                        password: hash,
                        fullname,
                    });
                    let token = generateToken(user); //generating token using cookied
                    res.cookie("token", token); //method to token
                    req.flash("success", "User created successfully");// displaying flash message if the user has been creatred
                    res.redirect("/shop"); //redirectinh to shop route
                }

            });
        });
    } catch (error) {
        res.status(500).send(error.message);

    }


}
module.exports.loginUser = async function (req, res) { //for login
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email }); //finding on the basis of emial to user
    if (!user) return res.status(401).send("user not found"); //if not found then displayoing

    bcrypt.compare(password, user.password, function (err, result) { //comparing the password provided at the time of account creation by the user to the current password
        if (result) {
            let token = generateToken(user);//generting token
            res.cookie("token", token);//method to token
            req.flash("success", "loggedIn successfully")//if the user have given the cirrect details then dislaying
            res.redirect("/shop"); //redirecting to shop
        }
        else {
            req.flash("error", "incorrect credentials"); //if not then displaying
            res.redirect('/');
        }
    })
}
module.exports.logout = function (req, res) { //if the user want to logout
    res.cookie("token", ""); //then simply deleting the token
    res.redirect("/");//redirecting to main page or index.ejs
}