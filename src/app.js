const express = require("express")
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user")

app.use(express.json())  // middleware provided by express which is activated(.use) for all cases (routes)

app.post("/signup", async(req, res) => {
    // Creating a new instance of the User model
    const user = new User(req.body)

    try{
        await user.save()
        res.send("User added successfully")
    } catch (err) {
        res.status(400).send("Error saving the user:"+ err.message)
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
    } catch {
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
app.patch("/user", async(req, res) => {
    const userId = req.body.userId
    const data = req.body

    try {
        await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument: "after",
            runValidators: true,
        } )
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