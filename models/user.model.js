const mongoose = require('mongoose');

// Define the user schema
const astroUserSchema = new mongoose.Schema({
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
    trim : true
  },
  phoneNumber: {
    type: String,
  required: true,
  unique: true,
  trim: true,
  match: [
    /^\+?[1-9]\d{9,14}$/, // Enforce E.164 format (must start with "+", and be 1-15 digits long)
    "Invalid phone number format. Please use E.164 format, e.g., +1234567890."
  ]
  },
  address : {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      match: [/^[0-9]{5,6}$/, "Pincode must be 5 or 6 digits"],
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: "India" 
    }
  } ,
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {timestamps : true});


// Create the User model
const AstroUser = mongoose.model('astroUser', astroUserSchema);

module.exports = AstroUser;
// export default User;