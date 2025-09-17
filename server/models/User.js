const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Make sure this line is here!


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures no two users can have the same username
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', async function (next) {
  // Only hash the password if it's new or has been modified
  if (!this.isModified('password')) {
    return next(); // Corrected: Return here to stop execution
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Only call next() once
});

module.exports = mongoose.model('User', UserSchema);