const mongoose = require('mongoose');

// Define the user schema
const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim : true
  },
  lastName: {
    type: String,
    trim : true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim : true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email"]
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim : true,
    match: [
        /^\+?[1-9]\d{9,14}$/,
        "Invalid phone number format. Please use E.164 format, e.g., +1234567890."
      ]
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {timestamps : true});


// Create the User model
const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;