const express = require("express")
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user")
const { validateSignUpData } = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const { userAuth } = require("./middlewares/auth")

app.use(express.json())  // middleware provided by express which is activated(.use) for all cases (routes)
app.use(cookieParser())  

app.post("/signup", async(req, res) => {
    try{
    // Validation of data
    validateSignUpData(req)

    const { firstName, lastName, emailId, password } = req.body

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10)
    console.log(passwordHash)


    // Creating a new instance of the User model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash ,
    })

    
        await user.save()
        res.send("User added successfully")
    } catch (err) {
        res.status(400).send("ERROR : "+ err.message)
    } 
    
})

// login api
app.post("/login", async (req, res)=>{
    try {
        const { emailId, password } = req.body

        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(isPasswordValid){
            // Create a JWT token

            const token = await jwt.sign({_id: user._id}, "DEV@Tinder$798", {expiresIn:"0d"})  // DEV@Tinder$798 is a secret key/password

            // Add the token to cookie and send the response back to the user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            })
            res.send("Login Successful!!")
        }else {
            throw new Error("Invalid credentials")
        }
    }catch (err) {
        res.status(400).send("ERROR : "+ err.message)
    } 
})

app.get("/profile", userAuth, async(req,res)=>{
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

// Get user by email
app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId

    try {
        const user = await User.find({emailId: userEmail})
        if(!user){
            res.status(404).send("User not found")
        }else {
            res.send(user)
        }
    } catch (err) {
        res.status(400).send("Error saving the user:"+ err.message)

    }
})


// Feed API - GET/feed - get all the users from the database
app.get("/feed", async (req, res)=>{
    try{
       const users = await User.find({})
       res.send(users)
    }catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// delete user API 
app.delete("/user", async (req, res)=> {
    const userId = req.body.userId

    try {
        const users = await User.findByIdAndDelete(userId)
        res.send("User deleted successfully")
    }catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// update API
app.patch("/user/:userId", async(req, res) => {
    const userId = req.params?.userId
    const data = req.body

    try {
        const ALLOWED_UPDATES = [
            "userId",
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
        ]
        const isUpdateAllowed = Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k)
        )
        if (!isUpdateAllowed){
            throw new Error("Update not allowed")
        }
        if (data?.skills.lenght>10) {
            throw new Error("Skills cannot be ore than 10")
        }
        const user = await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument: "after",
            runValidators: true,
        } )
        console.log(user)
        res.send("User details updated")
    }catch (err) {
        res.status(400).send("Update failed: "+ err.message)
    }
})

connectDB()
    .then(()=> {
        console.log("Database connection established")
        app.listen((7777), ()=> {
            console.log("Server is successfully running on port 7777")
        })
    })
    .catch((err)=> {
        console.log("Database cannot be connected")
    })




// order of the routes matter a lot