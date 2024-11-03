const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owner-model");
const bcrypt = require('bcrypt');
const { has } = require('config');

router.get('/', (req, res) => { //this is the route to make owner login
    res.render("owner-login");
})

router.get("/create", (req,res)=>{
    let success = req.flash("success");
    let error = req.flash("error");
    res.render("CreateOwner",{success,error});
});
if (process.env.NODE_ENV === "development") { //for development stage only
    router.post("/create", async function (req, res) { // for visiting the create products section the owner have to go through this to be able to proove his identity
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(403).send("You dont have any permission to create a new owner")

        }

        let { fullname, email, password } = req.body;
        try{
        const hashedpassword = await bcrypt.hash(password,10);
        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password:hashedpassword,
        });
        
        req.flash("success", "Owner created successfully");
        res.status(201).redirect("/owners/admin"); //rendering the createproducts page; //staus iss ok with data passed as createdOener
    }catch{
        req.flash("error", "An error occurred while creating the owner.");
        console.error(error); // Log error for debugging
        res.status(500).redirect("/owners"); // Redirect to a relevant page on error
    }
    });
}

router.get("/admin", function (req, res) { //thi is thedmin panel to craete products
    let success = req.flash("success"); //flash message coming in blue when the owner will logged in
    let error = req.flash("error"); //if something incorrect happen then error will generate
    res.render("createproducts", { success, error }); //creation of products will take place in thi route
});



module.exports = router; //exporting method to use in the main file i.e,app.js