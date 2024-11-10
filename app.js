const express = require('express');
const app = express();

const db = require("./config/mongoose-connection"); //to use mongoose cconnection from config folde
const cookieParser = require('cookie-parser');
const path = require('path');

const controllers = require('./controllers/AuthController') //for controllers maimly to give the access to the decided individuals and not all
const isLoggedIn = require("./middlewares/isLoggedIn")// requiring middleware for safer login and loggedout

const flash = require("connect-flash") //to use flah messages
const ownersRouter = require("./routes/ownersRouter"); //to user owners router
const productsRouter = require("./routes/productsRouter"); //to use producs router
const usersRouter = require("./routes/usersRouter"); //to use user router
const router = require("./routes/index"); //using index.js folder nd to use all its data in this feild


const expressSession = require("express-session"); //for creating session of the logged in use and not of the user who is not logged in or dont have an account



require("dotenv").config(); //meths to use .env file in which all the passwords and security key
app.set("view engine", "ejs"); // Set the view engine first

app.use(express.json()); //converting the data into json format
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()); //method to use cookie-pareser (the random string attachment)


app.use(express.static(path.join(__dirname, "public"))); //ensuring to resd all the file from the public directory
app.use('/profilepic/uploads', express.static(path.join(__dirname, 'public', 'profilepic', 'uploads')));

app.use(expressSession({ //what to include in express session
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false, //dont save everytime
    saveUninitialized: false, //dont save the seession of thjose who are jsut comingbut not te user
}));

app.use(flash()); //method of using flash message

app.use("/", router); //the main router
app.use("/owners", ownersRouter);  //the owners outer any thing related to owner will have to go from this router for example /owners/admin
app.use("/users", usersRouter); //the user router same concepts s that of above
app.use("/products", productsRouter);  //""
app.listen(3000, () => { //the listening port roter or the port or link wherethe app is running
    console.log("listening on port 3000");
});
