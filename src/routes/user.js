const express = require("express")
const userRouter = express.Router()

const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")



// GET all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async(req, res)=> {
    try {
        const loggedInUSer = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUSer._id,
            status: "interested"
        }).populate(
            "fromUserId", 
            "firstName lastName photoUrl age gender about skills"
        )
        // }).populate("fromUserId", ["firstName", "lastName"])
        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        })
    } catch (err) {
        req.statusCode(400).send("ERROR: ", + err.message)
    }
})

userRouter.get("/user/connections", userAuth, async(req, res)=> {
    try {
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted"},
                { fromUserId: loggedInUser._id, status: "accepted"}
            ]
        })
        .populate("fromUserId", 
            "firstName lastName photoUrl age gender about skills")
        .populate("toUserId", 
            "firstName lastName photoUrl age gender about skills")  
            
        console.log(connectionRequests)   
        
        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({ data })
    } catch (err) {
        res.status(400).send({message: err.message})
    }
})

userRouter.get("/feed", userAuth, async(req,res)=>{
    try{
        const loggedInUser= req.user

        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit
        const skip = (page-1)* limit

        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser}, {toUserId: loggedInUser}],
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })
        console.log(hideUsersFromFeed)

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed)}},
                { _id: { $ne: loggedInUser._id}},
            ]
        })
        .select("firstName lastName photoUrl age gender about skills")
        .skip(skip)
        .limit(limit)

        res.send(users)
    } catch (err) {
        res.status(400).send({message: err.message})
    }    
})
module.exports = userRouter