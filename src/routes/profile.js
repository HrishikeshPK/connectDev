const express = require("express")
const profileRouter = express.Router()

const { userAuth } = require("../middlewares/auth")
const { validateEditProfileData } = require("../utils/validation")

profileRouter.get("/profile/view", userAuth, async(req,res)=>{
    try {
    // const cookies = req.cookies  

    // const { token } = cookies
    // if (!token) {
    //     throw new Error("Invalid Token")
    // }
    // // Validate my token

    // const decodedMessage = await jwt.verify(token, "DEV@Tinder$798")    // DEV@Tinder$798 is a secret key/password
    // // console.log(decodedMessage)
    // const { _id } = decodedMessage
    // // console.log("Logged in user is: " +_id)

    // // console.log(cookies)  

    // const user = await User.findById(_id)
    // if(!user){
    //     throw new Error("User does not exist")
    // }
    const user = req.user    
    res.send(user)
    }catch (err){
        res.status(400).send("ERROR :"+ err.message)

    }
})

profileRouter.patch("/profile/edit", userAuth, async(req, res)=> {
    try{
        if (!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request")
        }

        const loggedInUser = req.user   // user coming from userAuth
        // console.log(loggedInUser)
          
        Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]))  
        
        await loggedInUser.save()
        
        res.json({
            message: `${loggedInUser.firstName}, your Profile updated successfully`, 
            data: loggedInUser,
        })
        // console.log(loggedInUser)
    } catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
})
module.exports = profileRouter