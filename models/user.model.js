const mongoose = require('mongoose');

// Define the user schema
const astroUserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  placeOfBirth: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], 
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email"]
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
  dateOfBirth: {
    type: Date,
    required: true,
  },
  birthTime: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Ensure time is in HH:MM format (24-hour format)
        return /^\d{2}:\d{2}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid time format! Use HH:MM.`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, { timestamps: true });


// Create the User model
const AstroUser = mongoose.model('astroUser', astroUserSchema);

module.exports = AstroUser;
// export default User;