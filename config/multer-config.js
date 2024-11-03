const multer = require("multer"); //using multer to upload image

const storage = multer.memoryStorage(); //in the memory strorage(using ram)
const upload = multer({storage:storage});

module.exports = upload; //exporting as upload