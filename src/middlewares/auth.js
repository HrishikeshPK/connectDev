const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
// Read the token from the req cookies
// Validate the token
// Find tne user 

try{
    const { token } =req.cookies
    if(!token){
        // throw new Error ("Token is nt valid!!!!")
        return res.status(401).send("Please login")
    }
    const decodedMessage = await jwt.verify(token, "DEV@Tinder$798")

    const { _id} = decodedMessage

    const user = await User.findById(_id)
    if(!user){
        throw new Error("User not found")
    }
    req.user = user
    next()
    
    
}catch (err) {
    res.status(400).send("ERROR: "+err.message)
}
}

module.exports = {
    userAuth,
}