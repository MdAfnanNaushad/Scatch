const jwt = require('jsonwebtoken'); //Authorization
const generateToken = (user)=>{ //generating a random string which will go with the teh user request with the cookie
    return jwt.sign({ email:user.email, id: user._id }, process.env.JWT_KEY); //on the basis of mil object id and secret key
}
module.exports.generateToken = generateToken;