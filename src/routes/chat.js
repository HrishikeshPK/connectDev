const express = require("express");
const Message = require("../models/message");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

// Fetch chat history between logged-in user and another user
chatRouter.get("/chat/:recipientId", userAuth, async (req, res) => {
  try {
    const { recipientId } = req.params;
    const userId = req.user._id
    console.log(userId)

    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId },
        { senderId: recipientId, recipientId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat history", error });
  }
});

module.exports = chatRouter;

