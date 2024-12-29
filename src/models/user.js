 const mongoose = require("mongoose")
 const validator = require("validator")
 const jwt = require("jsonwebtoken")
 const bcrypt = require("bcrypt")

 const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: "+value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Not a strong password: "+value)
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,

        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not a valid gender type`                      //below given is a custom validation for this
        },

        // validate(value) {
        //     if (!["male", "female", "others"].includes(value)) {                        
        //         throw new Error("Gender data is not valid")
        //     }
        // }
    },
    photoUrl: {
        
        type: String,
        validate(value) {
            if (!validator.isURL(value)){
                throw new Error("not a valid url")
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user",
    },
    skills: {
        type: [String],
    },
    trialStartDate: {
        type: Date,
        default: Date.now,
      },
      trialEndDate: {
        type: Date,
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed','succeeded'],
        default: 'pending',
      },
      stripeCustomerId: {
        type: String,
      },
      stripeSubscriptionId: {
        type: String,
      }    
 }, {
    timestamps: true
 })

 userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jwt.sign({_id: user._id}, "DEV@Tinder$798", {expiresIn:"1d"}) 

    return token
 }

 userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

    return isPasswordValid
 }

 userSchema.pre('save', function(next) {
    if (!this.trialEndDate) {
      this.trialEndDate = new Date(this.trialStartDate);
      this.trialEndDate.setDate(this.trialEndDate.getDate() + 7); // Add 7 days
    }
    next();
  });
 module.exports = mongoose.model("User", userSchema)