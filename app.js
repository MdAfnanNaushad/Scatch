const express = require('express');
const app = express();

const db = require("./config/mongoose-connection"); // MongoDB connection
const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require("connect-flash"); // Flash messages
const expressSession = require("express-session"); // Session management
require("dotenv").config(); // Load environment variables

// Routers
const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const router = require("./routes/index");

// Middleware
app.set("view engine", "ejs"); // Set EJS as the view engine
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use('/profilepic/uploads', express.static(path.join(__dirname, 'public', 'profilepic', 'uploads')));

// Session configuration
app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET, // Use environment variable or fallback
    resave: false,
    saveUninitialized: false,
}));

// Flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Routes
app.use("/", router); // Main router
app.use("/owners", ownersRouter); // Owners router
app.use("/users", usersRouter); // Users router
app.use("/products", productsRouter); // Products router

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).render("404", { message: "Page Not Found" });
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("500", { message: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});