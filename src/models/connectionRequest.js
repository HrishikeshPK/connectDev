const { default: mongoose } = require("mongoose")
const ongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected" ],
            message: `{VALUE} is incorrect status type`
        },
    },
    
},
 {
    timestamps: true,
 }
)

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1})  //compound indexing

connectionRequestSchema.pre("save", function (next) {      // we can also check this thing feom api
    const connectionRequest = this
    // check if fromUSerId is the same as toUSerId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {                   // we need to parse so use this method to compare
        throw new Error("Cannot send connection request to yourself")
    }             
    next()           // Never forget to call next() because this method acts like a middleware
})

const connectionRequesModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports = connectionRequesModel