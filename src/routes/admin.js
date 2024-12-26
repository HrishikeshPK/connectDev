const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin")
const User = require("../models/user")

const adminRouter = express.Router();

adminRouter.post("/admin/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.emailId !== emailId) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: admin._id }, "yourJWTSecret", { expiresIn: "1h" });
    res.json({ token, admin: { emailId: admin.emailId } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

adminRouter.get("/admin/feed", async (req, res) => {
  const searchKey = req.query.search

    const query = {
        firstName: {
            $regex:searchKey,
            $options:"i"
        }
    }
  try {
    const users = await User.find(query)
    .select("firstName lastName photoUrl age gender about ")
    res.send(users)
  }catch(err) {
    res.status(400).send({message: err.message})
  }
})
module.exports = adminRouter;

adminRouter.delete("/admin/user/:id", async(req, res) =>{
  const { id } = req.params
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "User deleted successfully", user: deletedUser })
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error", error: err.message })
  }
})
