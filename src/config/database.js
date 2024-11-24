const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://hrishikesh:iz8wohAlO8GrFYsk@namaste.o4hrl.mongodb.net/devTinder"
    )
}

module.exports = connectDB

// 


