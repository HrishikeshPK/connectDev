const express = require("express")
const requestRouter = express.Router()

const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res)=>{
    try {
        const fromUserId = req.user._id                //from userAuth
        const toUserId= req.params.toUserId
        const status = req.params.status

        const allowedStatus = ["ignored", "interested"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({ message: "Invalid status type: " +status})
        }

        const toUser = await User.findById(toUserId)
        if(!toUser){
            return res.status(404).json({message : "User not found"})
        }

        // If there is an existing connectionRequest
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [                                                     // or condition in mongoose
                { fromUserId, toUserId},
                { fromUserId: toUserId, toUserId: fromUserId}
            ], 
        })
        if(existingConnectionRequest) {
            return res
            .status(400)
            .send({message : "Connection Request Already Exists!! "})
        }

        const connectionRequest = new ConnectionRequest ({
            fromUserId, 
            toUserId, 
            status,
        })

        const data = await connectionRequest.save()

        res.json({
            message: req.user.firstName+ " is " +status+ " in " + toUser.firstName,
            data
        })

        
    }catch (err) {
        res.status(400).send("ERROR: "+ err.message)
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res)=> {

    try {
        const loggedInUSer = req.user
        const { status, requestId }= req.params

        const allowedStatus = ["accepted", "rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Status not allowed"})
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUSer,
            status: "interested"
        })
        if(!connectionRequest){
            return res.status(404).json({message: "Connection Request not found"})
        }

        connectionRequest.status = status

        const data = await connectionRequest.save()
        res.json({message: "Connection Request "+ status, data})

    } catch (err) {
        res.status(400).send("ERROR: " +err.message)
    }
})
module.exports = requestRouter