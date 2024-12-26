const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Default admin credentials
const DEFAULT_ADMIN = {
  emailId: "admin@gmail.com",
  password: bcrypt.hashSync("Admin@123", 10), // Hashed default password
};

const adminSchema = new mongoose.Schema({
    emailId: {
    type: String,
    required: true,
    default: DEFAULT_ADMIN.emailId, // Hardcoded username
  },
  password: {
    type: String,
    required: true,
    default: DEFAULT_ADMIN.password, // Hardcoded hashed password
  },
});

// Prevent creating multiple admins
adminSchema.pre("save", function (next) {
  if (!this.isNew) {
    return next(new Error("Admin already exists and cannot be modified!"));
  }
  next();
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
