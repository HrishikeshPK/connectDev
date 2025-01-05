const stripe = require('stripe')("sk_test_51QaGutLODVM2OussL1dyFTVhUxSpxbLjZY0VXuQA7uhzh8C5wcmLQKndQbGSYrFuA8gN9u37pMW59DeqOjDK2wvD0070BoZKnS");
const User = require('../models/user');
const express = require("express");
const { userAuth } = require("../middlewares/auth")


const paymentRouter = express.Router();

// route to create a payment intent
paymentRouter.post("/payment/createpaymentintent", userAuth, async (req, res) => {
    const _id = req.user._id; // idd from userauth
    console.log(_id);
  
    try {
      const user = await User.findById(_id);
  
      // checking if the user exists
      if (!user) {
        return res.status(404).send("User not found.");
      }
  
      // Create a payment intent 
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, 
        currency: "usd",
        description: `Payment for user ${user.firstName} ${user.lastName}`,
      });
  
      
      user.paymentStatus = "succeeded"; // payment pending until completed
      await user.save();
  
      // sending client secret to the frontend
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  });
  

module.exports = paymentRouter;
