const mongoose = require('mongoose'); //requiring mongoose to connect thourgh database
const config = require("config"); //Requiring config which typically used configuration files to interact with 
const dbgr = require("debug")("development:mongoose");//This line imports the debug module, which is used for logging debug information. Here, it's namespaced as development:mongoose.
const connectionString = process.env.MONGODB_URI || config.get("MONGODB_URI");
mongoose.connect(connectionString)//this is the connection String generation
    .then(function () {
        dbgr("connected"); //This block attempts to connect to the MongoDB database using the connection string obtained from the configuration settings.
        console.log("connected to server");


    })
    .catch(function (err) {
        dbgr(err);
        console.log(err);

    })

module.exports = mongoose.connection;